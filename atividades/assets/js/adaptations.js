const MODE_STORAGE_PREFIX='epds:pedagogical-mode:';
const STEP_STORAGE_PREFIX='epds:pedagogical-steps:';

function safeJson(value,fallback={}){
  if(value&&typeof value==='object')return value;
  if(typeof value!=='string')return fallback;
  try{return JSON.parse(value)}catch{return fallback}
}

function normalizeMode(value){return value==='adapted'?'adapted':'conventional'}
function modeKey(profileId,adaptationKey='support'){return `${MODE_STORAGE_PREFIX}${profileId||'anon'}:${adaptationKey}`}
function stepKey(profileId,exerciseId,adaptationKey='support'){return `${STEP_STORAGE_PREFIX}${profileId||'anon'}:${exerciseId||'none'}:${adaptationKey}`}
function readStored(key){try{return localStorage.getItem(key)}catch{return null}}
function writeStored(key,value){try{localStorage.setItem(key,value)}catch(_){}}

export async function loadAdaptationRequest(supabase,profile){
  if(!supabase||!profile?.id)return null;
  try{
    const {data,error}=await supabase.from('pedagogical_adaptation_requests')
      .select('id,status,created_at,updated_at')
      .eq('student_id',profile.id)
      .order('created_at',{ascending:false})
      .limit(1)
      .maybeSingle();
    if(error){
      if(String(error.code||'')==='42P01')return null;
      throw error;
    }
    return data||null;
  }catch(error){console.warn('[adaptations] solicitação indisponível',error);return null}
}

export async function requestPedagogicalAdaptation(supabase,profile){
  if(!supabase||!profile?.id)throw new Error('profile_required');
  const {data:existing}=await supabase.from('pedagogical_adaptation_requests')
    .select('id,status,created_at,updated_at')
    .eq('student_id',profile.id)
    .eq('status','pending')
    .limit(1)
    .maybeSingle();
  if(existing)return existing;
  const {data,error}=await supabase.from('pedagogical_adaptation_requests')
    .insert({student_id:profile.id,status:'pending',request_source:'student'})
    .select('id,status,created_at,updated_at')
    .single();
  if(error){
    if(String(error.code||'')==='23505')return loadAdaptationRequest(supabase,profile);
    throw error;
  }
  return data;
}

export function resolvePedagogicalAdaptation(accommodations=[]){
  const rows=(Array.isArray(accommodations)?accommodations:[])
    .filter(row=>row?.active!==false)
    .filter(row=>row?.accommodation_type==='learning_mode'||row?.config?.adaptation_profile||row?.config?.profile_key)
    .sort((a,b)=>{
      const ax=a?.exercise_id?1:0,bx=b?.exercise_id?1:0;
      if(ax!==bx)return bx-ax;
      return Date.parse(b?.updated_at||b?.created_at||0)-Date.parse(a?.updated_at||a?.created_at||0);
    });
  if(!rows.length)return null;
  const row=rows[0],config=safeJson(row.config,{}),profileKey=String(config.profile_key||config.adaptation_profile||'guided');
  return {
    id:row.id||null,
    profileKey,
    title:String(config.student_label||config.title||'Apoio pedagógico disponível'),
    message:String(config.student_message||config.message||'Esta atividade possui uma organização de apoio preparada para você.'),
    defaultMode:normalizeMode(config.default_mode||'conventional'),
    allowSwitch:config.allow_switch!==false,
    offerPrompt:config.offer_prompt!==false,
    recommendedFontSize:Math.max(0,Math.min(22,Number(config.recommended_font_size||0))),
    features:{
      shortInstructions:config.features?.short_instructions!==false,
      stepByStep:config.features?.step_by_step!==false,
      focusCues:config.features?.focus_cues!==false,
      largerControls:Boolean(config.features?.larger_controls),
      reducedVisualLoad:Boolean(config.features?.reduced_visual_load),
      predictableFeedback:Boolean(config.features?.predictable_feedback),
      extraCheckpoints:Boolean(config.features?.extra_checkpoints),
      independentStudy:Boolean(config.features?.independent_study),
      extensionChoice:Boolean(config.features?.extension_choice),
      motorFriendly:Boolean(config.features?.motor_friendly),
      extraHelp:Boolean(config.features?.extra_help),
      codeHelp:Boolean(config.features?.code_help),
      guidedCodeHelp:Boolean(config.features?.guided_code_help),
      termExplanations:Boolean(config.features?.term_explanations),
      contentExplanations:Boolean(config.features?.content_explanations),
      microSteps:Boolean(config.features?.micro_steps),
      highlightCurrentStep:config.features?.highlight_current_step!==false,
      homeDetailedGuidance:Boolean(config.features?.home_detailed_guidance),
    },
    supervision:safeJson(config.supervision,{}),
    raw:config,
  };
}

export async function loadAdaptationPreference(supabase,profile,adaptation){
  if(!supabase||!profile?.id||!adaptation?.profileKey)return null;
  try{
    const {data,error}=await supabase.from('pedagogical_adaptation_preferences')
      .select('mode,updated_at')
      .eq('student_id',profile.id)
      .eq('adaptation_key',adaptation.profileKey)
      .maybeSingle();
    if(error){
      if(String(error.code||'')==='42P01')return null;
      throw error;
    }
    return data?.mode==='adapted'||data?.mode==='conventional'?data.mode:null;
  }catch(error){console.warn('[adaptations] preferência remota indisponível',error);return null}
}

export function initializeAdaptationMode(profile,adaptation,remoteMode=null){
  if(!adaptation)return {mode:'conventional',stored:false,shouldPrompt:false};
  const key=modeKey(profile?.id,adaptation.profileKey),stored=readStored(key),hasLocal=stored==='adapted'||stored==='conventional';
  const hasRemote=remoteMode==='adapted'||remoteMode==='conventional';
  const mode=hasRemote?remoteMode:(hasLocal?stored:adaptation.defaultMode);
  return {mode:normalizeMode(mode),stored:Boolean(hasRemote||hasLocal),shouldPrompt:Boolean(adaptation.offerPrompt&&!hasRemote&&!hasLocal)};
}

export function persistAdaptationMode(profile,adaptation,mode,supabase=null){
  if(!adaptation)return Promise.resolve();
  const next=normalizeMode(mode);
  writeStored(modeKey(profile?.id,adaptation.profileKey),next);
  if(!supabase||!profile?.id||!adaptation?.profileKey)return Promise.resolve();
  return supabase.from('pedagogical_adaptation_preferences')
    .upsert({student_id:profile.id,adaptation_key:adaptation.profileKey,mode:next,updated_at:new Date().toISOString()},{onConflict:'student_id,adaptation_key'})
    .then(({error})=>{if(error&&String(error.code||'')!=='42P01')throw error})
    .catch(error=>console.warn('[adaptations] não foi possível sincronizar preferência',error));
}

export function applyAdaptationClasses(adaptation,mode){
  const root=document.documentElement;
  const classes=[
    'pedagogical-adapted','pedagogical-guided','pedagogical-reinforced','pedagogical-motor','pedagogical-home','pedagogical-extension'
  ];
  classes.forEach(name=>root.classList.remove(name));
  if(!adaptation||mode!=='adapted')return;
  root.classList.add('pedagogical-adapted');
  const key=String(adaptation.profileKey||'');
  if(key.includes('reinforced'))root.classList.add('pedagogical-reinforced');
  if(key.includes('motor'))root.classList.add('pedagogical-motor');
  if(key.includes('home'))root.classList.add('pedagogical-home');
  if(key.includes('extension'))root.classList.add('pedagogical-extension');
  if(!root.classList.contains('pedagogical-reinforced'))root.classList.add('pedagogical-guided');
}

function flattenSteps(meta={}){
  const raw=meta?.passos;
  const groups=Array.isArray(raw)?[['Etapas',raw]]:Object.entries(raw||{});
  const items=[];
  for(const [group,steps] of groups){
    if(!Array.isArray(steps))continue;
    for(const step of steps){
      const title=String(step?.titulo||step?.tarefa||'Etapa').trim();
      const text=String(step?.explicacao||step?.tarefa||'').trim();
      if(!title&&!text)continue;
      items.push({
        group:String(group),
        title,
        text,
        file:String(step?.arquivo||step?.file||group||'').trim(),
        lines:Array.isArray(step?.linhas)?step.linhas.slice(0,2):[],
        details:Array.isArray(step?.detalhes)?step.detalhes.map(String).filter(Boolean).slice(0,4):[],
        parts:Array.isArray(step?.partes)?step.partes.map(part=>({name:String(part?.nome||'').trim(),description:String(part?.descricao||'').trim()})).filter(part=>part.name||part.description).slice(0,8):[],
        why:String(step?.porQue||step?.porque||step?.motivo||'').trim(),
        expected:String(step?.resultadoEsperado||step?.resultado||'').trim(),
        alert:String(step?.alerta||step?.erroComum||step?.erro_comum||'').trim(),
      });
    }
  }
  return items;
}

const CONCEPT_EXPLANATIONS={
  'print()':'Mostra uma informação na tela. Em Python, é usado para exibir textos, valores e resultados.',
  'input()':'Pausa o programa e recebe o que a pessoa digita. O valor recebido começa como texto.',
  'str':'Representa texto. Use quando o dado deve ser tratado como palavra, frase ou conjunto de caracteres.',
  'int':'Representa número inteiro, sem casas decimais. Também pode converter um texto numérico para inteiro.',
  'float':'Representa número com casas decimais e pode converter uma entrada numérica para esse formato.',
  'bool':'Representa verdadeiro ou falso. É muito usado em condições e validações.',
  'f-strings':'Permitem misturar texto e valores em uma mesma frase Python usando f antes das aspas e chaves para os valores.',
  'if':'Executa um bloco somente quando uma condição é verdadeira.',
  'elif':'Testa outra condição quando o if anterior não foi verdadeiro.',
  'else':'Executa o caminho alternativo quando as condições anteriores não foram atendidas.',
  'for':'Repete um bloco seguindo uma sequência ou quantidade definida.',
  'while':'Repete um bloco enquanto uma condição continuar verdadeira.',
  'array':'Lista ordenada de valores. Em JavaScript, os itens podem ser acessados pelo índice.',
  'objeto':'Agrupa informações em pares de propriedade e valor.',
  'const':'Cria uma referência que não será reatribuída. O conteúdo interno de objetos e arrays ainda pode mudar.',
  'let':'Cria uma variável cujo valor pode ser reatribuído durante a execução.',
  'function':'Agrupa instruções reutilizáveis que podem receber dados e devolver um resultado.',
  'dom':'É a representação da página HTML que o JavaScript consegue consultar e modificar.',
  'queryselector':'Localiza um elemento da página usando um seletor CSS.',
  'addeventlistener':'Conecta uma função a um evento, como clique, digitação ou envio de formulário.',
  'classlist':'Permite adicionar, remover ou alternar classes CSS de um elemento pelo JavaScript.',
  'localstorage':'Armazena pequenos dados no navegador para que possam permanecer após recarregar a página.',
  'map':'Cria um novo array transformando cada item do array original.',
  'filter':'Cria um novo array mantendo apenas os itens que passam por uma condição.',
  'reduce':'Percorre um array acumulando os valores em um único resultado.',
  'find':'Procura o primeiro item de um array que atende a uma condição.',
  'some':'Verifica se pelo menos um item atende a uma condição.',
  'every':'Verifica se todos os itens atendem a uma condição.',
  'promise':'Representa uma operação assíncrona que poderá concluir com sucesso ou erro.',
  'json':'Formato textual estruturado muito usado para transportar e armazenar dados.',
  'html':'Define a estrutura e o significado do conteúdo de uma página.',
  'css':'Define apresentação visual, espaçamento, posicionamento e responsividade da página.',
  'javascript':'Adiciona lógica e comportamento à página, como eventos, validações e alterações no DOM.',
  'flexbox':'Modelo CSS para alinhar e distribuir elementos principalmente em uma direção.',
  'grid':'Modelo CSS para organizar elementos em linhas e colunas.',
  'media queries':'Regras CSS aplicadas conforme características da tela, muito usadas em responsividade.',
  'box model':'Modelo de caixa do CSS: conteúdo, padding, borda e margem.',
  'kotlin':'Linguagem usada no Android para escrever a lógica do aplicativo.',
  'textview':'Componente Android usado para exibir texto.',
  'edittext':'Componente Android usado para receber texto digitado pela pessoa.',
  'button':'Componente de ação que pode disparar um evento quando pressionado.',
};

function normalizeConcept(value){
  return String(value||'').trim().toLowerCase().replace(/[`*_]/g,'').replace(/\s+/g,' ');
}
function conceptExplanation(value){
  const raw=String(value||'').trim(),key=normalizeConcept(raw);
  if(CONCEPT_EXPLANATIONS[key])return CONCEPT_EXPLANATIONS[key];
  for(const [known,text] of Object.entries(CONCEPT_EXPLANATIONS)){
    if(key.includes(known)||known.includes(key))return text;
  }
  return `Este é um conceito importante desta atividade. Localize onde “${raw}” aparece no objetivo ou nas etapas e observe qual função ele cumpre antes de escrever o código.`;
}
function languageFromFile(filename='',language=''){
  const explicit=String(language||'').toLowerCase();if(explicit)return explicit;
  const ext=String(filename||'').split('.').pop()?.toLowerCase();
  return ({py:'python',js:'javascript',html:'html',css:'css',kt:'kotlin',xml:'xml',json:'json'})[ext]||ext||'texto';
}
function languageTip(language){
  const key=String(language||'').toLowerCase();
  if(key.includes('python'))return 'Confira indentação, dois-pontos nas estruturas e o tipo dos valores recebidos por input().';
  if(key.includes('javascript'))return 'Confira nomes de variáveis, parênteses, chaves, eventos e se o elemento do DOM existe antes de usá-lo.';
  if(key==='html')return 'Confira abertura e fechamento das tags, hierarquia dos elementos e atributos como id, for, href e type.';
  if(key==='css')return 'Confira o seletor, as chaves do bloco e se cada propriedade termina corretamente. Teste uma alteração visual por vez.';
  if(key.includes('kotlin'))return 'Confira nomes, tipos, parênteses, chaves e referências aos componentes da interface. Leia o primeiro erro antes dos demais.';
  if(key==='xml')return 'Confira abertura e fechamento das tags, atributos e nomes dos recursos referenciados.';
  return 'Faça uma pequena alteração por vez, execute e leia a primeira mensagem de erro antes de continuar.';
}
function collectCodeFiles(meta={},steps=[]){
  const map=new Map();
  for(const file of Array.isArray(meta?.files)?meta.files:[]){
    const filename=String(file?.filename||'').trim();if(filename)map.set(filename,{filename,language:languageFromFile(filename,file?.language)});
  }
  for(const step of steps){
    const filename=String(step?.file||step?.arquivo||'').trim();if(filename&&!map.has(filename))map.set(filename,{filename,language:languageFromFile(filename)});
  }
  return [...map.values()].slice(0,8);
}
function renderSupportSection(title){
  const section=document.createElement('section');section.className='pedagogical-help-section';
  const h=document.createElement('strong');h.textContent=title;section.append(h);return section;
}
function updateCurrentStepHighlight(list){
  if(!list)return;
  const items=[...list.querySelectorAll('li')];items.forEach(li=>li.classList.remove('current'));
  const current=items.find(li=>!li.classList.contains('done'));
  if(current)current.classList.add('current');
  items.forEach(li=>{const badge=li.querySelector('.pedagogical-step-now');if(badge)badge.hidden=!li.classList.contains('current')});
}

function loadStepProgress(profile,exercise,adaptation,remoteProgress=null){
  if(remoteProgress&&typeof remoteProgress==='object'&&!Array.isArray(remoteProgress))return {...remoteProgress};
  const key=stepKey(profile?.id,exercise?.id,adaptation?.profileKey),raw=readStored(key);
  try{const data=JSON.parse(raw||'{}');return data&&typeof data==='object'?data:{}}catch{return {}}
}
function saveStepProgress(profile,exercise,adaptation,progress){
  writeStored(stepKey(profile?.id,exercise?.id,adaptation?.profileKey),JSON.stringify(progress||{}));
}

export async function loadAdaptationStepProgress(supabase,profile,exercise,adaptation){
  if(!supabase||!profile?.id||!exercise?.id||!adaptation?.profileKey)return null;
  try{
    const {data,error}=await supabase.from('pedagogical_adaptation_progress')
      .select('completed_steps,updated_at')
      .eq('student_id',profile.id)
      .eq('exercise_id',exercise.id)
      .eq('adaptation_key',adaptation.profileKey)
      .maybeSingle();
    if(error){if(String(error.code||'')==='42P01')return null;throw error}
    return data?.completed_steps&&typeof data.completed_steps==='object'?data.completed_steps:null;
  }catch(error){console.warn('[adaptations] progresso remoto indisponível',error);return null}
}

export function persistAdaptationStepProgress(supabase,profile,exercise,adaptation,progress){
  saveStepProgress(profile,exercise,adaptation,progress);
  if(!supabase||!profile?.id||!exercise?.id||!adaptation?.profileKey)return Promise.resolve();
  return supabase.from('pedagogical_adaptation_progress')
    .upsert({student_id:profile.id,exercise_id:exercise.id,adaptation_key:adaptation.profileKey,completed_steps:progress||{},updated_at:new Date().toISOString()},{onConflict:'student_id,exercise_id,adaptation_key'})
    .then(({error})=>{if(error&&String(error.code||'')!=='42P01')throw error})
    .catch(error=>console.warn('[adaptations] não foi possível sincronizar progresso',error));
}

export function renderAdaptationBanner({profile,exercise,adaptation,mode,onModeChange,request=null,onRequest}){
  const banner=document.getElementById('adaptation-mode-banner');
  if(!banner)return;
  const title=document.getElementById('adaptation-mode-title'),status=document.getElementById('adaptation-mode-status'),badge=document.getElementById('adaptation-mode-badge'),toggle=document.getElementById('adaptation-mode-toggle');
  if(!adaptation){
    banner.classList.remove('hidden');banner.dataset.mode='request';
    const pending=request?.status==='pending';
    if(title)title.textContent=pending?'Solicitação de adaptação enviada':'Precisa de outra forma de organização?';
    if(status)status.textContent=pending?'O professor poderá preparar um modo de apoio para você. Continue normalmente enquanto isso.':'Você pode solicitar uma adaptação pedagógica sem preencher justificativa pessoal nesta tela.';
    if(badge)badge.textContent=pending?'Pendente':'Opcional';
    if(toggle){toggle.hidden=false;toggle.disabled=pending;toggle.textContent=pending?'Solicitação enviada':'Solicitar adaptação';toggle.onclick=()=>{if(!pending)onRequest?.()}}
    return;
  }
  banner.classList.remove('hidden');banner.dataset.mode=mode;
  if(toggle)toggle.disabled=false;
  if(title)title.textContent=mode==='adapted'?'Modo de apoio ativo':'Apoio pedagógico disponível';
  if(status)status.textContent=mode==='adapted'?adaptation.message:'Você pode ativar a organização adaptada desta atividade quando quiser.';
  if(badge)badge.textContent=mode==='adapted'?(adaptation.profileKey.includes('home')?'Estudo domiciliar':'Adaptado'):'Convencional';
  if(toggle){
    toggle.hidden=!adaptation.allowSwitch;
    toggle.textContent=mode==='adapted'?'Usar modo convencional':'Ativar modo adaptado';
    toggle.onclick=()=>onModeChange?.(mode==='adapted'?'conventional':'adapted');
  }
  const dialog=document.getElementById('adaptation-choice-dialog');
  if(dialog){
    const heading=document.getElementById('adaptation-choice-title'),copy=document.getElementById('adaptation-choice-copy');
    if(heading)heading.textContent=adaptation.profileKey.includes('home')?'Seu modo de estudo domiciliar está disponível':'Você recebeu uma adaptação pedagógica';
    if(copy)copy.textContent=adaptation.message;
  }
}

export function maybePromptAdaptation({adaptation,state,onChoose}){
  if(!adaptation||!state?.shouldPrompt)return false;
  const dialog=document.getElementById('adaptation-choice-dialog');if(!dialog)return false;
  const adapted=document.getElementById('adaptation-choice-accept'),conventional=document.getElementById('adaptation-choice-conventional');
  if(adapted)adapted.onclick=()=>{dialog.close();onChoose?.('adapted')};
  if(conventional)conventional.onclick=()=>{dialog.close();onChoose?.('conventional')};
  try{if(!dialog.open)dialog.showModal();return true}catch{return false}
}

export function renderAdaptedGuidance({profile,exercise,meta,adaptation,mode,remoteProgress=null,onStepProgress=null}){
  const guidance=document.getElementById('exercise-guidance');if(!guidance)return;
  guidance.querySelector('#pedagogical-adaptation-support')?.remove();
  if(!adaptation||mode!=='adapted'){if(adaptation)guidance.querySelectorAll('.guidance-steps').forEach(el=>{try{el.open=false}catch(_){}});return;}
  guidance.querySelectorAll('.guidance-steps').forEach(el=>{try{el.open=true}catch(_){}});
  const steps=flattenSteps(meta),box=document.createElement('section');box.id='pedagogical-adaptation-support';box.className='pedagogical-adaptation-support';
  const head=document.createElement('div');head.className='pedagogical-support-head';
  const h=document.createElement('strong');h.textContent=adaptation.profileKey.includes('home')?'Roteiro detalhado para estudar de casa':'Apoio passo a passo';
  const tag=document.createElement('span');tag.textContent=adaptation.profileKey.includes('home')?'Estudo domiciliar guiado':adaptation.profileKey.includes('reinforced')?'Passo a passo reforçado':'Ajuda extra ativa';head.append(h,tag);box.append(head);

  const intro=document.createElement('p');
  if(adaptation.profileKey.includes('home'))intro.textContent='Faça uma parte por vez. Leia a explicação, trabalhe somente na etapa destacada, execute, confira o resultado e marque como concluída. Você pode salvar, interromper e continuar depois.';
  else if(adaptation.profileKey.includes('reinforced'))intro.textContent='Concentre-se somente na etapa destacada. Há ajuda extra para conteúdo e código, mas você continua produzindo sua própria solução.';
  else intro.textContent='Siga a etapa destacada e use a ajuda extra quando precisar. Você pode voltar ao modo convencional a qualquer momento.';
  box.append(intro);

  if(adaptation.features.contentExplanations){
    const content=renderSupportSection('O que esta atividade quer que você aprenda');
    const p=document.createElement('p');p.textContent=String(meta?.objetivo||exercise?.description||'Leia o objetivo da atividade e identifique o resultado que precisa construir.');content.append(p);
    if(meta?.modulo){const small=document.createElement('small');small.textContent=`Conteúdo principal: ${String(meta.modulo)}`;content.append(small)}
    box.append(content);
  }

  if(adaptation.profileKey.includes('home')||adaptation.features.homeDetailedGuidance){
    const home=renderSupportSection('Como organizar o estudo em casa');
    const ul=document.createElement('ul');ul.className='pedagogical-home-checklist';
    [
      'Antes de começar: leia o objetivo e veja quais arquivos serão usados.',
      'Durante: faça somente a etapa destacada e execute o código após pequenas alterações.',
      'Se travar: abra “Ajuda extra”, releia os termos e use a orientação de código sem copiar uma resposta pronta.',
      'Antes de enviar: execute novamente, confira o resultado e marque as etapas concluídas.'
    ].forEach(text=>{const li=document.createElement('li');li.textContent=text;ul.append(li)});home.append(ul);box.append(home);
  }

  if(adaptation.features.motorFriendly){const note=document.createElement('p');note.className='pedagogical-support-note';note.textContent='Controles ampliados e navegação por teclado permanecem disponíveis; não há exigência de movimentos rápidos.';box.append(note)}
  if(adaptation.features.extensionChoice){const note=document.createElement('p');note.className='pedagogical-support-note';note.textContent='A estrutura guiada é opcional: você pode avançar mais rápido nas partes dominadas e usar o apoio somente quando precisar.';box.append(note)}

  if(steps.length){
    const progress=loadStepProgress(profile,exercise,adaptation,remoteProgress),list=document.createElement('ol');list.className='pedagogical-step-list';
    steps.slice(0,16).forEach((step,index)=>{
      const li=document.createElement('li'),label=document.createElement('label'),check=document.createElement('input'),copy=document.createElement('span'),titleRow=document.createElement('span'),title=document.createElement('strong'),now=document.createElement('em'),text=document.createElement('small');
      check.type='checkbox';check.checked=Boolean(progress[index]);check.setAttribute('aria-label',`Marcar etapa ${index+1} como concluída`);
      titleRow.className='pedagogical-step-title-row';title.textContent=`Etapa ${index+1} · ${step.title}`;now.className='pedagogical-step-now';now.textContent='Agora';now.hidden=true;titleRow.append(title,now);
      text.textContent=step.text||'Realize esta parte antes de avançar.';copy.append(titleRow,text);
      if(adaptation.profileKey.includes('home')){
        const context=document.createElement('div');context.className='pedagogical-home-step-context';
        const addLine=(label,value)=>{if(!value)return;const row=document.createElement('small'),strong=document.createElement('strong');strong.textContent=`${label}: `;row.append(strong,document.createTextNode(value));context.append(row)};
        const location=[step.file||'',step.lines?.length?`linhas ${step.lines.join('–')}`:''].filter(Boolean).join(' · ');
        addLine('Onde trabalhar',location);
        addLine('Por que esta etapa existe',step.why);
        addLine('Como saber se deu certo',step.expected);
        addLine('Atenção',step.alert);
        if(step.details?.length)addLine('Explicação extra',step.details.join(' '));
        if(step.parts?.length){
          const parts=document.createElement('div');parts.className='pedagogical-home-parts';
          step.parts.forEach(part=>{const item=document.createElement('small'),strong=document.createElement('strong');strong.textContent=part.name||'Parte';item.append(strong,document.createTextNode(part.description?` — ${part.description}`:''));parts.append(item)});
          context.append(parts);
        }
        if(context.childNodes.length)copy.append(context);
      }
      if(adaptation.features.microSteps){const micro=document.createElement('small');micro.className='pedagogical-step-micro';micro.textContent='Leia → localize a parte → faça uma alteração pequena → execute/confira → marque como concluída.';copy.append(micro)}
      label.append(check,copy);li.append(label);
      check.addEventListener('change',()=>{progress[index]=check.checked;saveStepProgress(profile,exercise,adaptation,progress);onStepProgress?.({...progress});li.classList.toggle('done',check.checked);updateCurrentStepHighlight(list)});li.classList.toggle('done',check.checked);list.append(li);
    });
    box.append(list);if(adaptation.features.highlightCurrentStep)updateCurrentStepHighlight(list);
  }

  if(adaptation.features.extraHelp||adaptation.features.codeHelp||adaptation.features.termExplanations){
    const details=document.createElement('details');details.className='pedagogical-extra-help';
    if(adaptation.profileKey.includes('home'))details.open=true;
    const summary=document.createElement('summary');summary.textContent='Ajuda extra · conteúdo, termos e código';details.append(summary);
    const body=document.createElement('div');body.className='pedagogical-extra-help-body';
    const safe=document.createElement('p');safe.className='pedagogical-support-note';safe.textContent='Use esta ajuda para entender o caminho. Ela não entrega a resposta pronta: você continua escrevendo e testando sua própria solução.';body.append(safe);

    if(adaptation.features.termExplanations){
      const concepts=[...(meta?.conceitos||[]),...(meta?.retomadas||[]),...(meta?.novos||[])].map(String).filter(Boolean).slice(0,12);
      if(concepts.length){
        const section=renderSupportSection('Termos importantes em linguagem direta'),grid=document.createElement('div');grid.className='pedagogical-glossary';
        concepts.forEach(concept=>{const card=document.createElement('article'),term=document.createElement('strong'),explanation=document.createElement('span');term.textContent=concept;explanation.textContent=conceptExplanation(concept);card.append(term,explanation);grid.append(card)});section.append(grid);body.append(section);
      }
    }

    if(adaptation.features.codeHelp){
      const section=renderSupportSection('Ajuda para trabalhar com o código'),files=collectCodeFiles(meta,steps);
      const flow=document.createElement('ol');flow.className='pedagogical-code-flow';
      ['Abra somente o arquivo da etapa atual.','Localize a parte indicada e faça uma alteração pequena.','Execute ou visualize o resultado antes de continuar.','Se houver erro, leia primeiro a mensagem inicial e confira a linha indicada.','Corrija uma coisa por vez e execute novamente.'].forEach(text=>{const li=document.createElement('li');li.textContent=text;flow.append(li)});section.append(flow);
      if(files.length){const fileList=document.createElement('div');fileList.className='pedagogical-code-files';files.forEach(file=>{const item=document.createElement('article'),name=document.createElement('strong'),tip=document.createElement('span');name.textContent=file.filename;tip.textContent=languageTip(file.language);item.append(name,tip);fileList.append(item)});section.append(fileList)}
      if(adaptation.features.guidedCodeHelp){
        const ladder=document.createElement('div');ladder.className='pedagogical-code-ladder';
        const title=document.createElement('strong');title.textContent='Ajuda progressiva — abra somente se precisar';ladder.append(title);
        [
          ['Pista 1','Releia a etapa atual e identifique qual arquivo, elemento, variável ou função precisa mudar.'],
          ['Pista 2','Compare o que você escreveu com os termos e a estrutura explicados acima. Não copie código inteiro.'],
          ['Pista 3','Execute. Leia primeiro o primeiro erro apresentado e localize a linha indicada.'],
          ['Pista 4','Isole o problema: corrija somente uma coisa, execute novamente e observe o que mudou.'],
          ['Conferência','Volte ao resultado esperado da etapa e confirme se sua solução produz esse comportamento.']
        ].forEach(([label,message])=>{const d=document.createElement('details'),sum=document.createElement('summary'),p=document.createElement('p');sum.textContent=label;p.textContent=message;d.append(sum,p);ladder.append(d)});
        section.append(ladder);
      }
      body.append(section);
    }
    details.append(body);box.append(details);
  }
  guidance.prepend(box);
}

