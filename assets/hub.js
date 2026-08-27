(()=>{
  'use strict';
  const cfg={supabaseUrl:'https://iresvqwyaqotghjssncg.supabase.co',publishableKey:'sb_publishable_9yUn07uD4XYySt1ynzZu-A_v8HSoSDO'};
  const auth=window.AGVSession.create(cfg),$=id=>document.getElementById(id);
  const school='@escola.pr.gov.br';
  const LOBBY_URL='lobby/?v=14.10.8.18';
  document.querySelectorAll('a[href^="lobby/"]').forEach(link=>link.setAttribute('href',LOBBY_URL));
  let profile=null;
  const setMsg=(t='',error=false)=>{const e=$('login-message');e.textContent=t;e.classList.toggle('error',error)};
  async function loadProfile(){const user=await auth.getUser();const rows=await auth.request(`/rest/v1/profiles?select=id,full_name,email,role,active,must_change_password&id=eq.${encodeURIComponent(user.id)}&limit=1`);const p=Array.isArray(rows)?rows[0]:null;if(!p?.active)throw new Error('Acesso inativo.');profile=p;if(p.must_change_password){location.replace('atividades/');return {redirected:true,profile:p};}return {redirected:false,profile:p};}
  function syncFullscreen(){window.AGVFullscreen?.require(profile?.role==='student');}
  function renderSigned(){const role=profile?.role||'student';syncFullscreen();$('login-card').classList.add('hidden');$('signed').classList.remove('hidden');$('user-name').textContent=profile?.full_name||profile?.email||'Usuário';$('user-role').textContent=role==='student'?'Aluno':role==='teacher'?'Professor':role==='admin'?'Administrador':'Super Admin';document.querySelectorAll('[data-role]').forEach(el=>{const allowed=el.dataset.role.split(',').includes(role);el.classList.toggle('hidden',!allowed)});renderPracticalExam().catch(()=>{});}

  async function renderPracticalExam(){
    const card=$('practical-exam-card'),title=$('practical-exam-title'),copy=$('practical-exam-copy'),go=$('practical-exam-go');if(!card||!profile)return;
    const staff=['teacher','admin','super_admin'].includes(profile.role);card.href=staff?'prova/admin.html':'prova/';
    try{
      const out=await auth.request('/functions/v1/practical-exam',{method:'POST',body:{action:'hub_state'}});
      card.classList.toggle('exam-hot',out?.active===true);
      if(out?.active){title.textContent=staff?`🔴 PROVA PRÁTICA EM ANDAMENTO (${out.count||1})`:'🔴 PROVA PRÁTICA EM ANDAMENTO';copy.textContent=out?.session?.title?`${out.session.subject_name||'Avaliação'} • ${out.session.title}`:'Há uma avaliação ativa agora.';go.textContent=staff?'Gerenciar agora →':'Entrar agora →';}
      else{title.textContent='Modo Prova Prática';copy.textContent=staff?'Criar e acompanhar avaliações em empresas, cargos e missões.':'Nenhuma prova em andamento. Quando o professor abrir uma avaliação, ela aparecerá aqui.';go.textContent=staff?'Abrir gestão →':'Abrir →';}
    }catch(_){card.classList.remove('exam-hot');}
  }

  async function renderPlatforms(){const host=$('hub-platform-grid');if(!host)return;try{const r=await fetch('core/catalog/platform-integration-v14.0.json',{cache:'no-store'});if(!r.ok)throw new Error('catalog');const data=await r.json();const items=(data.platforms||[]).filter(x=>x.readyForUnifiedHub).slice(0,10);host.replaceChildren();for(const item of items){const a=document.createElement('a');a.className='platform-mini';a.href=item.route;a.innerHTML=`<span>${item.icon||'🧩'}</span><div><strong>${item.name}</strong><small>${item.category||'Plataforma integrada'}</small></div><b>→</b>`;host.appendChild(a)}}catch(_){host.textContent='O catálogo de plataformas está temporariamente indisponível.'}}
  function renderGuest(){window.AGVFullscreen?.require(false);$('signed').classList.add('hidden');$('login-card').classList.remove('hidden');}
  async function restore(){const s=await auth.getSession();if(!s)return renderGuest();try{const result=await loadProfile();if(result?.redirected)return;renderSigned();}catch{await auth.signOut();renderGuest();}}
  const recoveryDialog=$('recovery-dialog');
  $('forgot-password-btn')?.addEventListener('click',()=>{const email=$('email').value.trim().toLowerCase();$('recovery-email').value=email;$('recovery-cgm').value='';$('recovery-message').textContent='';$('recovery-message').classList.remove('error');recoveryDialog?.showModal();});
  $('recovery-close-btn')?.addEventListener('click',()=>recoveryDialog?.close());
  $('recovery-form')?.addEventListener('submit',async e=>{
    e.preventDefault();
    const btn=e.submitter,email=$('recovery-email').value.trim().toLowerCase(),cgm=String($('recovery-cgm').value||'').replace(/\D/g,''),msg=$('recovery-message');
    msg.textContent='';msg.classList.remove('error');
    if(!email.endsWith(school)){msg.textContent=`Use seu e-mail institucional ${school}.`;msg.classList.add('error');return;}
    if(!/^\d{6,12}$/.test(cgm)){msg.textContent='Informe um CGM válido, usando somente números.';msg.classList.add('error');return;}
    btn.disabled=true;btn.textContent='Redefinindo…';
    try{
      const out=await auth.temporaryCgmPasswordReset(email,cgm);
      msg.textContent=out?.message||'Se os dados informados estiverem corretos, a senha foi redefinida para o CGM. No próximo acesso, crie uma nova senha pessoal.';
    }catch(err){
      console.error(err);
      msg.textContent=err?.status===429?'Muitas tentativas. Aguarde alguns minutos e tente novamente.':'Não foi possível concluir a redefinição agora. Tente novamente em alguns minutos.';
      msg.classList.add('error');
    }finally{btn.disabled=false;btn.textContent='Redefinir senha para CGM';}
  });
  $('login-form').addEventListener('submit',async e=>{e.preventDefault();const btn=e.submitter,email=$('email').value.trim().toLowerCase(),password=$('password').value;if(!email.endsWith(school))return setMsg(`Use seu e-mail institucional ${school}.`,true);await window.AGVFullscreen?.request({silent:true});btn.disabled=true;setMsg('Entrando…');try{try{await auth.signIn(email,password);}catch(first){if(!/^\d{6,12}$/.test(password))throw first;setMsg('Validando primeiro acesso…');const out=await auth.signUpStudent(email,password,location.href);if(!out?.access_token)await auth.signIn(email,password);}const result=await loadProfile();if(result?.redirected)return;renderSigned();setMsg();}catch(err){console.error(err);await auth.signOut();setMsg('Não foi possível entrar. Aluno no primeiro acesso: use o CGM. Equipe: use sua senha individual.',true);}finally{btn.disabled=false;}});
  $('logout').addEventListener('click',async()=>{await auth.signOut();profile=null;await window.AGVFullscreen?.release?.();renderGuest();});
  auth.onStorage(()=>restore());renderPlatforms();restore();
})();
