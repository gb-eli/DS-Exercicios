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
      if(requireForUser){
        try{
          const accommodations=await auth.request(`/rest/v1/student_accommodations?select=config&student_id=eq.${encodeURIComponent(user.id)}&exercise_id=is.null&accommodation_type=eq.learning_mode&active=eq.true&order=updated_at.desc&limit=1`);
          const config=Array.isArray(accommodations)?accommodations[0]?.config:null;
          const supervision=config?.supervision||{};
          const mode=String(supervision.mode||'');
          if(mode==='home_study'||mode==='relaxed'||supervision.require_fullscreen===false)requireForUser=false;
        }catch(error){console.warn('[AGVFullscreen] adaptação pedagógica indisponível; política padrão preservada.',error);}
      }
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
