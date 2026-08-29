const TABLE_MISSING_CODES=new Set(['42P01','PGRST204','PGRST205']);
const CATEGORY_META={
  help:{label:'Preciso do professor',short:'Ajuda',placeholder:'Conte onde você parou e o que está difícil.'},
  question:{label:'Não entendi',short:'Dúvida',placeholder:'Escreva sua dúvida. Se puder, diga em qual atividade ela apareceu.'},
  bug:{label:'Informar um erro',short:'Erro',placeholder:'Conte o que não funcionou e o que apareceu na tela.'},
  feedback:{label:'Sugerir uma melhoria',short:'Sugestão',placeholder:'O que deixaria a plataforma ou a atividade mais clara para você?'},
};

let state=null;
const firstName=profile=>String(profile?.full_name||'').trim().split(/\s+/)[0]||'Você';
const tableMissing=error=>TABLE_MISSING_CODES.has(String(error?.code||''));
const clamp=(value,min,max)=>Math.max(min,Math.min(max,Number(value)||0));
const safeObject=value=>value&&typeof value==='object'&&!Array.isArray(value)?value:{};

function createButton(label,className='support-action'){
  const button=document.createElement('button');button.type='button';button.className=className;button.textContent=label;return button;
}

function buildShell(profile,context){
  document.getElementById('student-support-hub')?.remove();
  const shell=document.createElement('div');shell.id='student-support-hub';shell.className='student-support-hub';
  const launcher=createButton('Apoio e mensagens','support-launcher');launcher.setAttribute('aria-expanded','false');launcher.setAttribute('aria-controls','student-support-drawer');
  const drawer=document.createElement('aside');drawer.id='student-support-drawer';drawer.className='support-drawer';drawer.setAttribute('aria-label','Apoio e mensagens do professor');drawer.hidden=true;
  const header=document.createElement('header');header.className='support-drawer-head';
  const copy=document.createElement('div'),eyebrow=document.createElement('span'),title=document.createElement('strong'),intro=document.createElement('p');
  eyebrow.textContent='Canal com o professor';title.textContent=`Olá, ${firstName(profile)}!`;
  intro.textContent=String(context?.config?.personalization?.teacher_message||'Estou por aqui para ajudar. Você pode mandar uma dúvida agora e continuar a atividade enquanto aguarda a resposta.').slice(0,700);
  copy.append(eyebrow,title,intro);const close=createButton('Fechar','support-close');close.setAttribute('aria-label','Fechar apoio e mensagens');header.append(copy,close);

  const status=document.createElement('p');status.className='support-service-status';status.setAttribute('role','status');status.textContent='As mensagens ficam salvas. O professor responde assim que possível.';
  const quick=document.createElement('div');quick.className='support-quick-actions';
  for(const [category,meta] of Object.entries(CATEGORY_META)){const button=createButton(meta.label);button.dataset.supportCategory=category;quick.append(button);}

  const difficulty=document.createElement('label');difficulty.className='support-difficulty';
  const difficultyText=document.createElement('span');difficultyText.textContent='Como você quer esta experiência?';
  const select=document.createElement('select');select.id='student-support-difficulty';select.setAttribute('aria-label','Nível de apoio desejado');
  [['essential','Mais simples'],['guided','Guiada'],['autonomous','Mais autônoma'],['challenge','Mais desafiadora']].forEach(([value,label])=>{const option=document.createElement('option');option.value=value;option.textContent=label;select.append(option);});
  select.value=context?.preference?.programming_level||context?.config?.personalization?.recommended_level||'guided';difficulty.append(difficultyText,select);

  const conversation=document.createElement('section');conversation.className='support-conversation';
  const conversationHead=document.createElement('div');conversationHead.className='support-conversation-head';
  const conversationTitle=document.createElement('strong');conversationTitle.id='student-support-thread-title';conversationTitle.textContent=CATEGORY_META.help.label;
  const refresh=createButton('Atualizar','support-refresh');conversationHead.append(conversationTitle,refresh);
  const messages=document.createElement('div');messages.className='support-message-list';messages.id='student-support-messages';messages.setAttribute('aria-live','polite');
  const form=document.createElement('form');form.className='support-message-form';
  const textarea=document.createElement('textarea');textarea.maxLength=4000;textarea.rows=3;textarea.required=true;textarea.placeholder=CATEGORY_META.help.placeholder;textarea.setAttribute('aria-label','Mensagem para o professor');
  const submit=createButton('Enviar mensagem','support-send');submit.type='submit';
  const formStatus=document.createElement('small');formStatus.className='support-form-status';formStatus.setAttribute('role','status');form.append(textarea,submit,formStatus);
  conversation.append(conversationHead,messages,form);
  drawer.append(header,status,quick,difficulty,conversation);shell.append(launcher,drawer);document.body.append(shell);
  return {shell,launcher,drawer,close,status,quick,select,conversationTitle,refresh,messages,form,textarea,submit,formStatus};
}

function setOpen(open){
  if(!state)return;state.ui.drawer.hidden=!open;state.ui.launcher.setAttribute('aria-expanded',String(open));state.ui.shell.classList.toggle('is-open',open);
  if(open){void refreshSupport();setTimeout(()=>state.ui.textarea.focus(),30);}
}

function activeThread(){
  return state?.threads.filter(thread=>thread.category===state.category&&thread.status!=='closed').sort((a,b)=>Date.parse(b.last_message_at||b.created_at)-Date.parse(a.last_message_at||a.created_at))[0]||null;
}

function renderMessages(){
  if(!state)return;const {messages}=state.ui;messages.replaceChildren();
  const thread=activeThread(),rows=thread?state.messages.filter(message=>String(message.thread_id)===String(thread.id)):[];
  if(!rows.length){const empty=document.createElement('p');empty.className='support-empty';empty.textContent='Nenhuma mensagem aqui ainda. Escreva quando precisar — não é necessário explicar informações pessoais ou de saúde.';messages.append(empty);return;}
  rows.sort((a,b)=>Date.parse(a.created_at)-Date.parse(b.created_at)||Number(a.id)-Number(b.id)).forEach(row=>{
    const article=document.createElement('article'),author=document.createElement('strong'),body=document.createElement('p'),time=document.createElement('time');
    const own=String(row.author_id)===String(state.profile.id);article.className=`support-message ${own?'is-student':'is-teacher'}`;author.textContent=own?'Você':'Professor';body.textContent=String(row.body||'');
    const date=new Date(row.created_at);time.textContent=Number.isNaN(date.getTime())?'':date.toLocaleString('pt-BR',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'});article.append(author,body,time);messages.append(article);
  });
  messages.scrollTop=messages.scrollHeight;
}

function selectCategory(category,open=true){
  if(!CATEGORY_META[category]||!state)return;state.category=category;
  state.ui.quick.querySelectorAll('[data-support-category]').forEach(button=>button.classList.toggle('is-selected',button.dataset.supportCategory===category));
  state.ui.conversationTitle.textContent=CATEGORY_META[category].label;state.ui.textarea.placeholder=CATEGORY_META[category].placeholder;renderMessages();if(open)setOpen(true);
}

async function refreshSupport(){
  if(!state||state.loading)return;state.loading=true;state.ui.refresh.disabled=true;
  try{
    const {data:threads,error}=await state.supabase.from('student_support_threads').select('id,category,status,subject_slug,exercise_id,created_at,updated_at,last_message_at').eq('student_id',state.profile.id).order('last_message_at',{ascending:false}).limit(80);
    if(error)throw error;state.available=true;state.threads=threads||[];
    const ids=state.threads.map(thread=>thread.id);let messages=[];
    if(ids.length){const result=await state.supabase.from('student_support_messages').select('id,thread_id,author_id,body,created_at').in('thread_id',ids).order('created_at',{ascending:false}).limit(500);if(result.error)throw result.error;messages=result.data||[];}
    state.messages=messages;state.ui.status.textContent='Canal aluno–professor ativo. As mensagens ficam salvas e podem ser respondidas mesmo que você esteja offline.';renderMessages();
  }catch(error){
    if(tableMissing(error)){state.available=false;state.ui.status.textContent='A central está pronta na interface e será ativada após a atualização do banco.';}
    else{console.warn('[support-hub] não foi possível atualizar mensagens',error);state.ui.status.textContent='Sem conexão agora. Tente atualizar novamente em alguns instantes.';}
  }finally{if(state){state.loading=false;state.ui.refresh.disabled=false;}}
}

async function ensureThread(){
  let thread=activeThread();if(thread)return thread;
  const row={student_id:state.profile.id,category:state.category,status:'open'};
  const {data,error}=await state.supabase.from('student_support_threads').insert(row).select('id,category,status,subject_slug,exercise_id,created_at,updated_at,last_message_at').single();
  if(error)throw error;state.threads.unshift(data);return data;
}

async function sendMessage(event){
  event.preventDefault();if(!state)return;const body=state.ui.textarea.value.trim();if(!body)return;
  state.ui.submit.disabled=true;state.ui.formStatus.textContent='Enviando…';
  try{
    const thread=await ensureThread();const {data,error}=await state.supabase.from('student_support_messages').insert({thread_id:thread.id,author_id:state.profile.id,body}).select('id,thread_id,author_id,body,created_at').single();
    if(error)throw error;state.messages.push(data);state.ui.textarea.value='';state.ui.formStatus.textContent='Mensagem enviada. Você pode continuar a atividade.';renderMessages();
  }catch(error){
    console.warn('[support-hub] mensagem não enviada',error);state.ui.formStatus.textContent=tableMissing(error)?'O banco ainda precisa receber a atualização da Central de Apoio.':'Não foi possível enviar agora. Seu texto continua aqui para tentar novamente.';
  }finally{if(state)state.ui.submit.disabled=false;}
}

async function saveDifficulty(){
  if(!state)return;const value=state.ui.select.value,context=state.context||{},current=safeObject(context.preference);
  state.ui.select.disabled=true;state.ui.status.textContent='Salvando sua preferência…';
  try{
    const row={student_id:state.profile.id,adaptation_key:context.adaptationKey||current.adaptation_key||'general',programming_level:value,support_focus:Array.isArray(current.support_focus)?current.support_focus:[],explanation_style:current.explanation_style||'mixed',extra_challenges:value==='challenge'?'yes':current.extra_challenges||'sometimes',preferred_mode:current.preferred_mode||'last',onboarding_completed:current.onboarding_completed||false,updated_at:new Date().toISOString()};
    const {error}=await state.supabase.from('pedagogical_learning_preferences').upsert(row,{onConflict:'student_id'});if(error)throw error;
    if(state.context)state.context.preference=row;state.ui.status.textContent='Preferência salva. O professor também poderá considerar essa escolha nas próximas atividades.';
  }catch(error){console.warn('[support-hub] preferência não sincronizada',error);state.ui.status.textContent='Não foi possível salvar essa preferência agora.';}
  finally{if(state)state.ui.select.disabled=false;}
}

function showNotice(notification,{local=false}={}){
  if(!state)return;document.getElementById('student-support-notice')?.remove();
  const notice=document.createElement('aside');notice.id='student-support-notice';notice.className=`student-support-notice tone-${notification.tone||'encouragement'}`;notice.setAttribute('role','status');
  const icon=document.createElement('span');icon.textContent=notification.tone==='celebration'?'★':'💬';icon.setAttribute('aria-hidden','true');
  const copy=document.createElement('div'),title=document.createElement('strong'),body=document.createElement('p');title.textContent=String(notification.title||'Mensagem do professor');body.textContent=String(notification.body||'');copy.append(title,body);
  const close=createButton('Entendi','support-notice-close');close.onclick=async()=>{notice.remove();if(!local&&notification.id){try{await state?.supabase.from('student_support_notifications').update({read_at:new Date().toISOString()}).eq('id',notification.id).eq('student_id',state.profile.id);}catch(_){}}};
  notice.append(icon,copy,close);document.body.append(notice);
}

async function pollNotifications(){
  if(!state||document.visibilityState!=='visible')return;
  try{
    const {data,error}=await state.supabase.from('student_support_notifications').select('id,title,body,tone,created_at').eq('student_id',state.profile.id).is('read_at',null).order('created_at',{ascending:true}).limit(1);
    if(error){if(!tableMissing(error))throw error;return;}const item=data?.[0];if(item&&!state.seenNotifications.has(String(item.id))){state.seenNotifications.add(String(item.id));showNotice(item);}
  }catch(error){console.warn('[support-hub] notificações indisponíveis',error);}
}

function showFocusCheck(){
  if(!state||document.visibilityState!=='visible'||document.getElementById('student-focus-check'))return;
  const overlay=document.createElement('div');overlay.id='student-focus-check';overlay.className='student-focus-check';
  const card=document.createElement('section');card.setAttribute('role','dialog');card.setAttribute('aria-modal','true');card.setAttribute('aria-labelledby','student-focus-title');
  const kicker=document.createElement('span');kicker.textContent='Pausa de foco';const title=document.createElement('h2');title.id='student-focus-title';title.textContent=`${firstName(state.profile)}, você está aí?`;
  const copy=document.createElement('p');copy.textContent='Tudo bem precisar de uma pausa. Escolha uma opção para eu organizar melhor seu apoio.';const actions=document.createElement('div');
  [['present','Sim, estou aqui'],['need_help','Preciso de ajuda'],['pause','Vou pausar um pouco']].forEach(([response,label])=>{const button=createButton(label,response==='present'?'button button-primary':'button button-ghost');button.onclick=()=>void respondFocus(response,overlay);actions.append(button);});
  card.append(kicker,title,copy,actions);overlay.append(card);document.body.append(overlay);card.querySelector('button')?.focus();
}

async function respondFocus(response,overlay){
  overlay.querySelectorAll('button').forEach(button=>button.disabled=true);
  try{await state.supabase.from('student_focus_checkins').insert({student_id:state.profile.id,response,context:{source:'support_hub',visibility:document.visibilityState}});}catch(error){if(!tableMissing(error))console.warn('[support-hub] check-in não sincronizado',error);}
  overlay.remove();if(response==='need_help')selectCategory('help',true);if(response==='present')showNotice({title:'Checkpoint concluído',body:'Ótimo, siga uma etapa de cada vez. Seu esforço conta, mesmo quando você precisa recomeçar.',tone:'celebration'},{local:true});
}

function scheduleFocus(context){
  const supervision=safeObject(context?.config?.supervision),raw=supervision.focus_check_interval_minutes??supervision.check_in_interval_minutes;
  const interval=clamp(raw,0,60);if(!interval||!(supervision.focus_check_enabled===true||Number(raw)>0))return null;
  return window.setInterval(showFocusCheck,interval*60*1000);
}

export function destroyStudentSupportHub(){
  if(!state){document.getElementById('student-support-hub')?.remove();return;}
  clearInterval(state.pollTimer);clearInterval(state.notificationTimer);clearInterval(state.focusTimer);clearTimeout(state.milestoneTimer);
  document.getElementById('student-support-hub')?.remove();document.getElementById('student-support-notice')?.remove();document.getElementById('student-focus-check')?.remove();state=null;
}

export function initializeStudentSupportHub({supabase,profile,context=null}){
  if(!supabase||!profile?.id)return;destroyStudentSupportHub();const ui=buildShell(profile,context);
  state={supabase,profile,context,ui,category:'help',threads:[],messages:[],loading:false,available:null,seenNotifications:new Set(),pollTimer:null,notificationTimer:null,focusTimer:null,milestoneTimer:null};
  ui.launcher.onclick=()=>setOpen(ui.drawer.hidden);ui.close.onclick=()=>setOpen(false);ui.refresh.onclick=()=>void refreshSupport();ui.form.onsubmit=sendMessage;ui.select.onchange=()=>void saveDifficulty();
  ui.quick.querySelectorAll('[data-support-category]').forEach(button=>button.onclick=()=>selectCategory(button.dataset.supportCategory,true));selectCategory('help',false);
  void refreshSupport();void pollNotifications();state.pollTimer=window.setInterval(()=>{if(document.visibilityState==='visible'&&!ui.drawer.hidden)void refreshSupport();},30000);state.notificationTimer=window.setInterval(pollNotifications,30000);state.focusTimer=scheduleFocus(context);
  state.milestoneTimer=window.setTimeout(()=>showNotice({title:'30 minutos de dedicação',body:'Você permaneceu estudando por meia hora. Isso é um checkpoint de esforço — faça uma pausa curta se precisar.',tone:'celebration'},{local:true}),30*60*1000);
}
