(()=>{
  'use strict';
  const cfg={supabaseUrl:'https://iresvqwyaqotghjssncg.supabase.co',publishableKey:'sb_publishable_9yUn07uD4XYySt1ynzZu-A_v8HSoSDO'};
  const fullscreen=window.AGVFullscreen;
  const sessionApi=window.AGVSession;
  if(!fullscreen||!sessionApi)return;
  const auth=sessionApi.create(cfg);
  async function sync(){
    const session=await auth.getSession({refreshIfNeeded:true,ttl:0}).catch(()=>null);
    if(!session){fullscreen.require(false);return;}
    let requireForUser=true;
    try{
      const user=await auth.getUser();
      const rows=await auth.request(`/rest/v1/profiles?select=role,active&id=eq.${encodeURIComponent(user.id)}&limit=1`);
      const profile=Array.isArray(rows)?rows[0]:null;
      requireForUser=profile?.active!==false&&String(profile?.role||'student')==='student';
    }catch(_){
      // Falha fechada para sessão autenticada: evita que instabilidade de perfil
      // libere um aluno do requisito de tela cheia.
      requireForUser=true;
    }
    fullscreen.require(requireForUser);
  }
  addEventListener('pageshow',sync);
  addEventListener('focus',()=>sync().catch(()=>{}));
  sync();
})();
