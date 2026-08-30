import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from '../lobby/assets/config.js?v=14.10.8.59';

const createClient=globalThis.supabase?.createClient;
const $=id=>document.getElementById(id);
const PROOF_KEY='agv-password-recovery-proof';
const PROOF_TTL_MS=10*60*1000;
const originalUrl=new URL(window.location.href);
const hashParams=new URLSearchParams(originalUrl.hash.replace(/^#/,''));
const queryParams=originalUrl.searchParams;
const recoveryType=queryParams.get('type')||hashParams.get('type');
const tokenHash=queryParams.get('token_hash');
const accessToken=hashParams.get('access_token');
const refreshToken=hashParams.get('refresh_token');

function show(id){['checking-view','invalid-view','password-form','success-view'].forEach(key=>$(key)?.classList.toggle('hidden',key!==id));}
function cleanUrl(){history.replaceState(null,'',window.location.pathname);}
function setProof(userId){sessionStorage.setItem(PROOF_KEY,JSON.stringify({userId,at:Date.now()}));}
function getProof(){try{const proof=JSON.parse(sessionStorage.getItem(PROOF_KEY)||'null');if(!proof?.userId||Date.now()-Number(proof.at||0)>PROOF_TTL_MS){sessionStorage.removeItem(PROOF_KEY);return null;}return proof;}catch{sessionStorage.removeItem(PROOF_KEY);return null;}}
function clearProof(){sessionStorage.removeItem(PROOF_KEY);}
function invalidate(message='Solicite um novo link de recuperação na tela de entrada.'){$('invalid-message').textContent=message;show('invalid-view');}
function validPassword(value){return value.length>=8&&/[A-Za-zÀ-ÿ]/.test(value)&&/\d/.test(value);}

if(typeof createClient!=='function'){invalidate('Não foi possível carregar o serviço de autenticação. Volte ao login e tente novamente.');}
else{
  const client=createClient(SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY,{auth:{storageKey:'agv-password-recovery-session',persistSession:true,autoRefreshToken:true,detectSessionInUrl:false}});

  async function validateRecovery(){
    show('checking-view');
    try{
      let session=null;
      let linkWasConsumed=false;
      if(recoveryType==='recovery'&&tokenHash){
        const {data,error}=await client.auth.verifyOtp({token_hash:tokenHash,type:'recovery'});
        if(error)throw error;
        session=data?.session||null;
        linkWasConsumed=true;
      }else if(recoveryType==='recovery'&&accessToken&&refreshToken){
        const {data,error}=await client.auth.setSession({access_token:accessToken,refresh_token:refreshToken});
        if(error)throw error;
        session=data?.session||null;
        linkWasConsumed=true;
      }else{
        const proof=getProof();
        if(!proof)throw new Error('recovery_context_missing');
        const {data,error}=await client.auth.getSession();
        if(error||!data?.session)throw error||new Error('recovery_session_missing');
        session=data.session;
      }
      if(!session?.access_token)throw new Error('recovery_session_invalid');
      const {data:userData,error:userError}=await client.auth.getUser();
      if(userError||!userData?.user)throw userError||new Error('recovery_user_missing');
      const user=userData.user;
      const {data:profile,error:profileError}=await client.from('profiles').select('id,full_name,email,active').eq('id',user.id).maybeSingle();
      if(profileError)throw profileError;
      if(!profile?.active)throw new Error('inactive_profile');
      if(linkWasConsumed)setProof(user.id);
      else if(getProof()?.userId!==user.id)throw new Error('recovery_user_mismatch');
      cleanUrl();
      $('account-label').textContent=`Conta validada: ${profile.email||user.email||'e-mail institucional'}`;
      show('password-form');
    }catch(error){
      console.error('[AGV recovery]',error);
      cleanUrl();
      clearProof();
      await client.auth.signOut({scope:'local'}).catch(()=>{});
      invalidate(error?.message==='inactive_profile'?'Esta conta está inativa. Procure a equipe responsável.':'O link é inválido, já foi utilizado ou expirou. Solicite um novo link.');
    }
  }

  $('password-form').addEventListener('submit',async event=>{
    event.preventDefault();
    const password=$('new-password').value,confirm=$('confirm-password').value,msg=$('form-message'),button=$('save-password');
    msg.textContent='';msg.classList.remove('ok');
    if(!validPassword(password)){msg.textContent='A senha precisa ter no mínimo 8 caracteres, uma letra e um número.';return;}
    if(password!==confirm){msg.textContent='As senhas não coincidem.';return;}
    const proof=getProof();
    if(!proof){invalidate('A validação expirou. Solicite um novo link para redefinir a senha.');return;}
    button.disabled=true;button.textContent='Salvando…';
    try{
      const {data:userData,error:userError}=await client.auth.getUser();
      if(userError||userData?.user?.id!==proof.userId)throw userError||new Error('recovery_identity_changed');
      const {error}=await client.auth.updateUser({password});
      if(error)throw error;
      clearProof();
      localStorage.removeItem('sb-iresvqwyaqotghjssncg-auth-token');
      const {error:signOutError}=await client.auth.signOut({scope:'global'});
      if(signOutError)await client.auth.signOut({scope:'local'}).catch(()=>{});
      show('success-view');
    }catch(error){
      console.error('[AGV recovery update]',error);
      msg.textContent='Não foi possível alterar a senha. O link pode ter expirado; solicite um novo se o problema continuar.';
    }finally{button.disabled=false;button.textContent='Salvar nova senha';}
  });

  validateRecovery();
}
