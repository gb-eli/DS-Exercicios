'use strict';
(function(){
  window.LABDS=window.LABDS||{};
  const SUPABASE_URL='https://iresvqwyaqotghjssncg.supabase.co';
  const PUBLISHABLE_KEY='sb_publishable_9yUn07uD4XYySt1ynzZu-A_v8HSoSDO';
  const SESSION_KEY='sb-iresvqwyaqotghjssncg-auth-token';
  const LEGACY_SESSION_KEY='labds:agv-core-session:v1';
  let session=null,identity=null;const toolOpenPromises=new Map();
  const store=()=>localStorage;
  function migrateLegacySession(){try{if(!store().getItem(SESSION_KEY)){const old=sessionStorage.getItem(LEGACY_SESSION_KEY);if(old)store().setItem(SESSION_KEY,old)}sessionStorage.removeItem(LEGACY_SESSION_KEY)}catch{}}
  const encode=value=>encodeURIComponent(String(value??''));

  function saveSession(next){session=next?.access_token?next:null;try{if(session)store().setItem(SESSION_KEY,JSON.stringify(session));else store().removeItem(SESSION_KEY);}catch{}return session;}
  function loadStoredSession(){if(session?.access_token)return session;migrateLegacySession();try{const raw=store().getItem(SESSION_KEY);if(raw)session=JSON.parse(raw);}catch{}return session;}
  async function authRequest(path,body,accessToken=''){
    const response=await fetch(`${SUPABASE_URL}${path}`,{method:'POST',headers:{apikey:PUBLISHABLE_KEY,'Content-Type':'application/json',...(accessToken?{Authorization:`Bearer ${accessToken}`}:{})},body:JSON.stringify(body||{})});
    const data=await response.json().catch(()=>({}));if(!response.ok){const error=new Error(data?.msg||data?.message||data?.error_description||data?.error||`Falha de autenticação (${response.status}).`);error.status=response.status;error.data=data;throw error;}return data;
  }
  async function refreshSession(){const current=loadStoredSession();if(!current?.refresh_token)throw new Error('Sessão expirada. Entre novamente.');const fresh=await authRequest('/auth/v1/token?grant_type=refresh_token',{refresh_token:current.refresh_token});return saveSession(fresh);}
  async function coreFetch(path,options={},retry=true){let current=loadStoredSession();if(!current?.access_token)throw new Error('Sessão central não encontrada.');const doFetch=()=>fetch(`${SUPABASE_URL}${path}`,{...options,headers:{apikey:PUBLISHABLE_KEY,Authorization:`Bearer ${current.access_token}`,'Content-Type':'application/json',...(options.headers||{})}});let response=await doFetch();if(response.status===401&&retry&&current.refresh_token){current=await refreshSession();response=await coreFetch(path,options,false);}return response;}
  async function rest(path){const response=await coreFetch(`/rest/v1/${path}`,{method:'GET'});const data=await response.json().catch(()=>[]);if(!response.ok)throw new Error(data?.message||data?.hint||`Falha ao consultar o Core (${response.status}).`);return data;}
  async function loadIdentity(user){const profiles=await rest(`profiles?select=id,full_name,email,role,active,must_change_password&id=eq.${encode(user.id)}&limit=1`);const profile=profiles?.[0];if(!profile?.active)throw new Error('Conta inativa ou perfil central não localizado.');const memberships=await rest(`class_memberships?select=class_id,is_primary&user_id=eq.${encode(user.id)}&active=eq.true&order=is_primary.desc&limit=1`);let classInfo=null;if(memberships?.[0]?.class_id){const classes=await rest(`classes?select=id,code,name,shift&id=eq.${encode(memberships[0].class_id)}&limit=1`);classInfo=classes?.[0]||null;}identity={user,profile,classInfo};return identity;}
  async function getCurrentIdentity(){let current=loadStoredSession();if(!current?.access_token)return null;let response=await fetch(`${SUPABASE_URL}/auth/v1/user`,{headers:{apikey:PUBLISHABLE_KEY,Authorization:`Bearer ${current.access_token}`}});if(response.status===401&&current.refresh_token){current=await refreshSession();response=await fetch(`${SUPABASE_URL}/auth/v1/user`,{headers:{apikey:PUBLISHABLE_KEY,Authorization:`Bearer ${current.access_token}`}});}if(!response.ok){saveSession(null);return null;}const user=await response.json();current.user=user;saveSession(current);return loadIdentity(user);}
  async function signOut(){const current=loadStoredSession();if(current?.access_token){try{await fetch(`${SUPABASE_URL}/auth/v1/logout`,{method:'POST',headers:{apikey:PUBLISHABLE_KEY,Authorization:`Bearer ${current.access_token}`}});}catch{}}identity=null;saveSession(null);const returnTo='sistemas/01-lab-virtual/LABDS/lab/index.html';location.replace(window.AGVUnifiedAuth?.loginUrl?.(returnTo)||new URL('../../../../auth/',location.href).href);}

  function ensureStatus(){let badge=document.querySelector('#agvCoreStatus');if(badge)return badge;badge=document.createElement('span');badge.id='agvCoreStatus';badge.className='agv-core-status';badge.textContent='AGV Core';document.querySelector('.header-actions')?.prepend(badge);return badge;}
  function updateStatus(text,tone='ok'){const badge=ensureStatus();badge.textContent=text;badge.dataset.tone=tone;}
  async function alignLocalSession(info){const name=info?.profile?.full_name||info?.user?.email||'Estudante';const turma=info?.classInfo?.name||info?.classInfo?.code||'Turma institucional';const current=window.LABDS.Session?.get?.();if(current&&(current.studentName!==name||current.studentClass!==turma))await window.LABDS.Session?.finalize?.('Finalizada por troca de conta central',{clearPersonal:false});if(!window.LABDS.Session?.get?.())window.LABDS.Session?.create?.(name,turma);}
  async function requireSession(){
    const info=await getCurrentIdentity().catch(()=>null);
    if(info&&!info.profile.must_change_password){
      identity=info;
      await alignLocalSession(info);
      updateStatus('AGV Core • conectado');
      return info;
    }
    const root=window.AGVUnifiedAuth?.rootUrl||new URL('../../../../',location.href).href;
    if(info?.profile?.must_change_password){
      location.replace(new URL('atividades/',root).href);
      throw new Error('Troca de senha obrigatória.');
    }
    const returnTo='sistemas/01-lab-virtual/LABDS/lab/index.html';
    location.replace(window.AGVUnifiedAuth?.loginUrl?.(returnTo)||new URL(`auth/?returnTo=${encodeURIComponent(returnTo)}`,root).href);
    throw new Error('Sessão institucional obrigatória.');
  }
  async function coreAction(action,payload={}){const response=await coreFetch('/functions/v1/lab-virtual-core',{method:'POST',body:JSON.stringify({action,...payload})});const data=await response.json().catch(()=>({}));if(!response.ok){const map={tool_not_opened:'Abra esta ferramenta pelo portal antes de concluir a atividade.',minimum_activity_time:'Continue explorando a atividade por mais alguns segundos.',completion_not_registered:'Esta conclusão ainda não está registrada no Core.',client_reward_forbidden:'O valor da recompensa é definido somente pelo servidor.'};const error=new Error(map[data?.error]||data?.message||data?.error||`Falha no Core (${response.status}).`);error.code=data?.error||'lab_core_error';error.data=data;throw error;}return data;}
  const loadCoreState=()=>coreAction('state');
  function toolOpened(toolId){const id=String(toolId||'');if(!id)return Promise.reject(new Error('Ferramenta não informada.'));if(toolOpenPromises.has(id))return toolOpenPromises.get(id);const task=coreAction('tool_open',{toolId:id}).catch(error=>{toolOpenPromises.delete(id);throw error;});toolOpenPromises.set(id,task);return task;}
  async function completeActivity(completionId,toolId,context={}){if(toolId)await toolOpened(toolId);return coreAction('complete',{completionId,toolId,context,attemptId:crypto.randomUUID?.()||`${Date.now()}-${Math.random()}`});}
  window.addEventListener('storage',event=>{if(event.key===SESSION_KEY){session=null;identity=null;}});
  window.LABDS.AGVCore={requireSession,signOut,loadCoreState,toolOpened,completeActivity,getIdentity:()=>identity,hasSession:()=>Boolean(loadStoredSession()?.access_token),info:Object.freeze({platformId:'lab-virtual',mode:'core-authority',supabaseUrl:SUPABASE_URL})};
})();
