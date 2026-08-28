(function(){
  'use strict';
  const PLATFORM='planetario-ds';
  const SURFACE='COSMOS / Planetário DS';
  const URL='https://iresvqwyaqotghjssncg.supabase.co';
  const KEY='sb_publishable_9yUn07uD4XYySt1ynzZu-A_v8HSoSDO';
  const SK='sb-iresvqwyaqotghjssncg-auth-token';
  let session=null,identity=null,lastProgress=new Map();
  const normalize=s=>s?.access_token?s:(s?.currentSession?.access_token?s.currentSession:(s?.session?.access_token?s.session:null));
  function load(){try{session=normalize(JSON.parse(localStorage.getItem(SK)||'null'));}catch{session=null}return session;}
  function save(s){session=normalize(s);try{session?localStorage.setItem(SK,JSON.stringify(session)):localStorage.removeItem(SK)}catch{}return session;}
  async function req(path,{method='GET',body,token=true}={}){
    let s=load();const h={apikey:KEY,'content-type':'application/json'};if(token&&s?.access_token)h.Authorization='Bearer '+s.access_token;
    let r=await fetch(URL+path,{method,headers:h,body:body===undefined?undefined:JSON.stringify(body)});
    if(r.status===401&&token&&s?.refresh_token){const f=await fetch(URL+'/auth/v1/token?grant_type=refresh_token',{method:'POST',headers:{apikey:KEY,'content-type':'application/json'},body:JSON.stringify({refresh_token:s.refresh_token})});if(f.ok){s=save(await f.json());h.Authorization='Bearer '+s.access_token;r=await fetch(URL+path,{method,headers:h,body:body===undefined?undefined:JSON.stringify(body)});}}
    const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d?.message||d?.error_description||d?.error||('HTTP '+r.status));return d;
  }
  async function resolveIdentity(){const s=load();if(!s?.access_token){identity=null;document.documentElement.dataset.agvCore='offline';return null;}const user=await req('/auth/v1/user');const rows=await req('/rest/v1/profiles?select=id,full_name,email,role,active,must_change_password&id=eq.'+encodeURIComponent(user.id)+'&limit=1');const p=rows?.[0];if(!p?.active){identity=null;return null;}let classInfo=null;try{const ms=await req('/rest/v1/class_memberships?select=class_id,is_primary&user_id=eq.'+encodeURIComponent(user.id)+'&active=eq.true&order=is_primary.desc&limit=1');if(ms?.[0]?.class_id){const cs=await req('/rest/v1/classes?select=id,code,name&id=eq.'+encodeURIComponent(ms[0].class_id)+'&limit=1');classInfo=cs?.[0]||null;}}catch{}identity={user,profile:p,classInfo,authority:'agv-core'};api.identity=identity;document.documentElement.dataset.agvCore='connected';document.documentElement.dataset.authAuthority='agv-core';window.dispatchEvent(new CustomEvent('agv:core-identity',{detail:identity}));return identity;}
  async function progress(eventType,{activityId='platform',progress=null,score=null,payload={},idempotencyKey=null}={}){if(!load()?.access_token)return null;const now=Date.now(),key=eventType+':'+activityId;if(eventType==='activity.progress'){const prev=lastProgress.get(key)||0;if(now-prev<3500)return null;lastProgress.set(key,now);}return req('/functions/v1/agv-progress-event',{method:'POST',body:{eventId:crypto.randomUUID(),idempotencyKey:idempotencyKey||PLATFORM+':'+eventType+':'+crypto.randomUUID(),platformId:PLATFORM,activityId,eventType,occurredAt:new Date().toISOString(),progress,score,payload:{surface:SURFACE,authority:'agv-core',...payload}}});}
  async function boot(){const i=await resolveIdentity().catch(()=>null);if(!i)return;progress('session.started',{activityId:'platform',payload:{version:document.documentElement.dataset.version||null}}).catch(()=>{});}
  const api={platformId:PLATFORM,surface:SURFACE,identity,session:()=>load(),resolveIdentity,progress,authority:'agv-core',legacyRole:'cache-only'};window.AGVPlatformCore=api;
  window.addEventListener('storage',e=>{if(e.key!==SK)return;session=null;resolveIdentity().catch(()=>{});});
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',boot):boot();
})();
