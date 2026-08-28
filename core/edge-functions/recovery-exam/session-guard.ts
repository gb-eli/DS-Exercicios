export function authSessionId(authHeader:string){
  try{
    const token=String(authHeader||'').replace(/^Bearer\s+/i,'').trim();
    if(!token)return null;
    const parts=token.split('.');if(parts.length<2)return null;
    let raw=parts[1].replace(/-/g,'+').replace(/_/g,'/');while(raw.length%4)raw+='=';
    const payload=JSON.parse(atob(raw));
    const sid=String(payload?.session_id||'').trim();
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(sid)?sid:null;
  }catch(_){return null}
}
export async function requireLiveAuthSession(db:any,authHeader:string,userId:string){
  const sid=authSessionId(authHeader);
  if(!sid)return {ok:false,error:'session_claim_missing',status:401};
  const {data,error}=await db.rpc('security_is_auth_session_active_service',{p_user_id:userId,p_session_id:sid});
  if(error)return {ok:false,error:'session_guard_unavailable',status:503,detail:String(error.message||error)};
  if(data!==true)return {ok:false,error:'session_revoked',status:401};
  return {ok:true,session_id:sid};
}

