import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { requireLiveAuthSession } from "./session-guard.ts";
import {createClient} from "jsr:@supabase/supabase-js@2.111.0";
import {consumeRate,ensureAccess,logRisk,requestIp} from "./security.ts";
const H={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type","Access-Control-Allow-Methods":"POST, OPTIONS"};
const J=(x:unknown,s=200,extra:Record<string,string>={})=>new Response(JSON.stringify(x),{status:s,headers:{...H,...extra,"content-type":"application/json","cache-control":"no-store"}});
const AREAS=new Set(['central','1ds','2ds','3ds','sub']),EMOTES=new Set(['wave','like','spark']);
const STAFF=new Set(['teacher','admin','super_admin']);
const uuidRx=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const enc=new TextEncoder();
function b64url(bytes:Uint8Array){let raw='';for(const b of bytes)raw+=String.fromCharCode(b);return btoa(raw).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');}
function b64urlText(value:string){return b64url(enc.encode(value));}
function fromB64url(value:string){let raw=value.replace(/-/g,'+').replace(/_/g,'/');while(raw.length%4)raw+='=';const decoded=atob(raw),out=new Uint8Array(decoded.length);for(let i=0;i<decoded.length;i++)out[i]=decoded.charCodeAt(i);return out;}
async function hmacKey(secret:string,usage:KeyUsage[]){return crypto.subtle.importKey('raw',enc.encode(secret),{name:'HMAC',hash:'SHA-256'},false,usage);}
async function signGather(payload:any,secret:string){const body=b64urlText(JSON.stringify(payload)),key=await hmacKey(secret,['sign']),sig=new Uint8Array(await crypto.subtle.sign('HMAC',key,enc.encode(body)));return `${body}.${b64url(sig)}`;}
async function verifyGather(token:string,secret:string){try{const parts=String(token||'').split('.');if(parts.length!==2)return null;const [body,sig]=parts,key=await hmacKey(secret,['verify']),ok=await crypto.subtle.verify('HMAC',key,fromB64url(sig),enc.encode(body));if(!ok)return null;const payload=JSON.parse(new TextDecoder().decode(fromB64url(body)));if(!payload?.exp||Date.now()>Number(payload.exp))return null;if(!uuidRx.test(String(payload.issuer||'')))return null;if(!['campus','vale'].includes(String(payload.scene)))return null;return payload;}catch{return null;}}
function boundedCoord(value:any,max:number){const n=Number(value);return Number.isFinite(n)?Math.max(0,Math.min(max,Math.round(n))):null;}
function safeInterior(value:any){const text=String(value||'').trim();return text&&/^[a-zA-Z0-9:_-]{1,120}$/.test(text)?text:null;}
Deno.serve(async req=>{if(req.method==='OPTIONS')return new Response('ok',{headers:H});if(req.method!=='POST')return J({error:'method_not_allowed'},405);if(Number(req.headers.get('content-length')||0)>32768)return J({error:'payload_too_large'},413);try{
 const url=Deno.env.get('SUPABASE_URL')!,anon=Deno.env.get('SUPABASE_ANON_KEY')!,service=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,auth=req.headers.get('Authorization')||'';
 const uc=createClient(url,anon,{global:{headers:{Authorization:auth}}}),db=createClient(url,service,{auth:{persistSession:false,autoRefreshToken:false}}),{data:{user}}=await uc.auth.getUser();if(!user)return J({error:'unauthorized'},401);const live=await requireLiveAuthSession(db,auth,user.id);if(!live.ok)return J({error:live.error,detail:live.detail||null},live.status);
 const {data:p}=await db.from('profiles').select('role,active,must_change_password').eq('id',user.id).maybeSingle();if(!p?.active||p.must_change_password||!['student','teacher','admin','super_admin'].includes(String(p.role)))return J({error:'profile_not_ready'},403);
 await ensureAccess(db,user,req,'lobby-presence');const body=await req.json().catch(()=>({})),action=String(body?.action||'heartbeat');const rl=await consumeRate(db,`lobby-presence:${user.id}:${requestIp(req)||'noip'}`,40,60,120);if(rl.allowed===false){await logRisk(db,user,req,'rate_limit','high',{source:'lobby-presence',action,count:rl.count});return J({error:'rate_limited',retry_after:rl.retry_after||120},429,{'Retry-After':String(rl.retry_after||120)})}
 if(action==='issue_gather'){
   if(!STAFF.has(String(p.role)))return J({error:'staff_required'},403);
   const x=boundedCoord(body?.x,1600),y=boundedCoord(body?.y,1000),scene=String(body?.scene||'campus');if(x===null||y===null||!['campus','vale'].includes(scene))return J({error:'invalid_gather_target'},400);
   const payload={v:1,issuer:user.id,role:String(p.role),scene,x,y,area:String(body?.area||'central').slice(0,40),interior:safeInterior(body?.interior),iat:Date.now(),exp:Date.now()+20000,nonce:crypto.randomUUID()};
   const token=await signGather(payload,service);await logRisk(db,user,req,'lobby_staff_gather','info',{source:'lobby-presence',scene,x,y});return J({ok:true,token,expires_at:new Date(payload.exp).toISOString()});
 }
 if(action==='verify_gather'){
   const payload=await verifyGather(String(body?.token||''),service);if(!payload||!STAFF.has(String(payload.role)))return J({error:'invalid_or_expired_gather'},403);
   return J({ok:true,target:{scene:payload.scene,x:payload.x,y:payload.y,area:payload.area,interior:payload.interior||null,issuer:payload.issuer,expires_at:new Date(payload.exp).toISOString()}});
 }
 if(action==='leave'){await db.from('lobby_presence').delete().eq('student_id',user.id);return J({ok:true})}
 if(action!=='heartbeat')return J({error:'unknown_action'},400);
 if(p.role==='student'){const {data:b}=await db.from('lobby_blocks').select('blocked_until,reason').eq('student_id',user.id).gt('blocked_until',new Date().toISOString()).maybeSingle();if(b)return J({error:'lobby_access_blocked',blocked_until:b.blocked_until,reason:b.reason||null},423)}
 let x=Number(body?.x),y=Number(body?.y);const invalid=!Number.isFinite(x)||!Number.isFinite(y)||x<0||x>1600||y<0||y>1000;if(invalid){await logRisk(db,user,req,'lobby_coordinate_tampering','warning',{source:'lobby-presence',x:body?.x,y:body?.y});x=Math.max(0,Math.min(1600,Number.isFinite(x)?x:800));y=Math.max(0,Math.min(1000,Number.isFinite(y)?y:500))}
 const area=AREAS.has(String(body?.area))?String(body.area):'central';const emote=EMOTES.has(String(body?.emote))?String(body.emote):null;let target=uuidRx.test(String(body?.interaction_target_id||''))?String(body.interaction_target_id):null;if(p.role==='student')target=null;
 const row:any={student_id:user.id,x:Math.round(x),y:Math.round(y),area,emote,emote_until:emote?new Date(Date.now()+4500).toISOString():null,interaction_target_id:target};const {error}=await db.from('lobby_presence').upsert(row,{onConflict:'student_id'});if(error){if(String(error.message||'').includes('lobby_access_blocked'))return J({error:'lobby_access_blocked'},423);throw error}return J({ok:true});
}catch(e){console.error(e);return J({error:'internal_error'},500)}});
