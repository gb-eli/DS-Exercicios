import { runPython } from './python-runtime.js?v=14.10.8.38';
import { EXERCISE_MANIFEST } from '../data/exercise-manifest.js?v=14.10.8.38';
import { EXERCISE_MANIFEST_CURRENT } from '../data/exercise-manifest-current.js?v=14.10.8.38';
import { EXERCISE_REFERENCES } from '../data/exercise-reference.js?v=14.10.8.38';
import { EXERCISE_REFERENCE_EXTRAS } from '../data/exercise-reference-extra.js?v=14.10.8.38';
import { EXERCISE_REFERENCE_SYNCED } from '../data/exercise-reference-synced.js?v=14.10.8.38';
import { EXERCISE_REFERENCE_3DS_RESTORED } from '../data/exercise-reference-3ds-restored.js?v=14.10.8.38';
import { EXERCISE_REFERENCE_DS2_CORRECTED } from '../data/exercise-reference-ds2-corrected.js?v=14.10.8.38';
import { EXERCISE_REFERENCE_CATALOG_CURRENT } from '../data/exercise-reference-catalog-current.js?v=14.10.8.38';
import { validateExercise, renderValidation } from './validation.js?v=14.10.8.38';
import {
  prepareSupervision, stopSupervision, handleBeforeInput, handlePaste, handleDrop, handleEditorInput,
  sendEditorSnapshot, sendCursor, inspectCode, getSupervisionSessionId, markTrustedEditorInsertion,
  callActivityProgress
} from './supervision.js?v=14.10.8.20';

import { supabase, handleSessionInvalid } from './supabase.js?v=14.10.8.38';
import { createStoreZip, downloadBlob, downloadTextFile } from './downloads.js?v=14.10.8.38';
import { buildHtmlPreview } from './preview-builder.js?v=14.10.8.38';
import { shouldRecoverCachedDraft } from './draft-recovery.js?v=14.10.8.38';
import { getWeekendWindow, formatWeekendCountdown, buildWeekendDiagnostics, WEEKEND_SUPPORT_TIME_ZONE } from './weekend-support.js?v=14.10.8.38';
import { callWeekendVoucher, copyWeekendVoucherCode } from './weekend-voucher.js?v=14.10.8.38';
import {
  resolvePedagogicalAdaptation, loadAdaptationPreference, initializeAdaptationMode, persistAdaptationMode, applyAdaptationClasses,
  renderAdaptationBanner, maybePromptAdaptation, renderAdaptedGuidance,
  loadAdaptationRequest, requestPedagogicalAdaptation, loadAdaptationStepProgress, persistAdaptationStepProgress
} from './adaptations.js?v=14.10.8.20';
import { logExperienceEvent } from './personalized-experience.js?v=14.10.8.20';

let state = {
  profile:null,
  exercise:null,
  subject:null,
  meta:null,
  files:[],
  active:null,
  dirty:false,
  saveTimer:null,
  saveQueues:new Map(),
  lastSavedContent:new Map(),
  remoteEdit:false,
  teacherEditing:false,
  lastProgressTouchAt:0,
  supportRelease:null,
  adaptation:null,
  adaptationMode:'conventional',
  adaptationModeState:null,
  adaptationRequest:null,
  adaptationBaseFontSize:14,
  adaptationStepProgress:null,
  recoveredFiles:new Set(),
  toolsOpen:false,
  outputOpen:false,
  pendingServerEvaluation:null,
  autoGrade:{score:0,graded_at:null,submitted_score:null,submitted_at:null,attempts:0,status:'in_progress',completion_source:null,dirty:false,pending:false,files:[],reference_match:null,current_file_matches:0,legacy_file_matches:0},
  symbolPaletteOpen:false,
  referenceAvailable:false,
  referenceFiles:new Map(),
  referenceVariants:new Map(),
  referenceSelections:new Map(),
  referenceMatchCache:new Map(),
  referenceSource:'none',
  classId:null,
  classroomUrl:null,
  repositoryUrl:null,
  legacyRepositoryUrl:null,
  linksLoaded:false,
  codeFontSize:14,
  weekend:{window:null,enabled:false,focusLine:null,timer:null,lastDiagnostics:null,voucher:null,voucherLoading:false,voucherError:null},
};

const $ = (id)=>document.getElementById(id);

const CODE_FONT_STORAGE='epds:code-font-size';
const CODE_FONT_MIN=11;
const CODE_FONT_MAX=22;
const CODE_FONT_STEP=1;
function compactTouchWorkspace(){
  try{return Boolean(window.matchMedia?.('(pointer: coarse)').matches||window.innerWidth<=760);}catch(_){return false;}
}
function codeFontMinimum(){return compactTouchWorkspace()?16:CODE_FONT_MIN;}
function clampCodeFontSize(value){
  const n=Number(value),min=codeFontMinimum();
  return Math.max(min,Math.min(CODE_FONT_MAX,Number.isFinite(n)?Math.round(n):Math.max(14,min)));
}

function loadCodeFontSize(){
  try{return clampCodeFontSize(localStorage.getItem(CODE_FONT_STORAGE)||14);}catch(_){return clampCodeFontSize(14);}
}

function applyCodeFontSize(value,{persist=true}={}){
  const size=clampCodeFontSize(value);
  state.codeFontSize=size;
  const gutter=Math.max(52,Math.min(70,Math.ceil(size*2.6+10)));
  document.documentElement.style.setProperty('--code-font-size',`${size}px`);
  document.documentElement.style.setProperty('--code-gutter-width',`${gutter}px`);
  const label=$('font-size-label');if(label)label.textContent=`${size} px`;
  const dec=$('font-decrease-btn'),inc=$('font-increase-btn');
  if(dec)dec.disabled=size<=codeFontMinimum();
  if(inc)inc.disabled=size>=CODE_FONT_MAX;
  if(persist){try{localStorage.setItem(CODE_FONT_STORAGE,String(size));}catch(_){}}
  renderEditorLineNumbers();
}
function adjustCodeFontSize(delta){applyCodeFontSize(state.codeFontSize+delta);}

const WEEKEND_DISABLED_PREFIX='epds:weekend-help-disabled:';
const WEEKEND_SEEN_PREFIX='epds:weekend-reward-seen:';
function weekendStorageKey(prefix,weekendId){return `${prefix}${state.profile?.id||'anon'}:${weekendId||'none'}`;}
function weekendDisabled(windowInfo=state.weekend?.window){
  if(!windowInfo?.weekendId)return false;
  try{return localStorage.getItem(weekendStorageKey(WEEKEND_DISABLED_PREFIX,windowInfo.weekendId))==='1';}catch(_){return false;}
}
function setWeekendDisabled(disabled){
  const info=state.weekend?.window;if(!info?.weekendId)return;
  try{localStorage.setItem(weekendStorageKey(WEEKEND_DISABLED_PREFIX,info.weekendId),disabled?'1':'0');}catch(_){}
}
function weekendRewardSeen(windowInfo=state.weekend?.window){
  if(!windowInfo?.weekendId)return true;
  try{return localStorage.getItem(weekendStorageKey(WEEKEND_SEEN_PREFIX,windowInfo.weekendId))==='1';}catch(_){return false;}
}
function markWeekendRewardSeen(){
  const info=state.weekend?.window;if(!info?.weekendId)return;
  try{localStorage.setItem(weekendStorageKey(WEEKEND_SEEN_PREFIX,info.weekendId),'1');}catch(_){}
}
function clearWeekendFocus(){
  state.weekend.focusLine=null;state.weekend.lastDiagnostics=null;
  $('weekend-code-focus-line')?.classList.add('hidden');
  renderEditorLineNumbers();
}
function updateWeekendFocusOverlay(){
  const overlay=$('weekend-code-focus-line'),editor=$('code-editor');if(!overlay||!editor)return;
  const info=state.weekend?.window,line=Number(state.weekend?.focusLine||0);
  if(!info?.eligible||!state.weekend.enabled||!Number.isFinite(line)||line<1){overlay.classList.add('hidden');return;}
  const style=getComputedStyle(editor),lineHeight=parseFloat(style.lineHeight)||22,paddingTop=parseFloat(style.paddingTop)||0;
  const top=paddingTop+((line-1)*lineHeight)-editor.scrollTop;
  if(top+lineHeight<0||top>editor.clientHeight){overlay.classList.add('hidden');return;}
  overlay.style.top=`${Math.max(0,top)}px`;overlay.style.height=`${lineHeight}px`;overlay.classList.remove('hidden');
}
function renderWeekendModeBanner(){
  const banner=$('weekend-mode-banner'),info=state.weekend?.window;if(!banner)return;
  if(!info?.eligible){banner.classList.add('hidden');clearWeekendFocus();return;}
  banner.classList.remove('hidden');banner.dataset.enabled=state.weekend.enabled?'true':'false';
  const title=$('weekend-mode-title'),status=$('weekend-mode-status'),toggle=$('weekend-mode-toggle'),count=$('weekend-mode-countdown'),voucherBtn=$('weekend-voucher-open');
  if(title)title.textContent=state.weekend.enabled?'Modo Final de Semana ativo':'Ajuda de Final de Semana pausada';
  if(status)status.textContent=state.weekend.enabled?'Dicas extras + voucher de 1 ponto extra disponíveis até domingo às 18:00 (horário de Brasília).':'A ajuda pode ser reativada; seu voucher de 1 ponto continua disponível para consulta.';
  if(toggle)toggle.textContent=state.weekend.enabled?'Desativar ajuda extra':'Ativar ajuda extra';
  if(count)count.textContent=formatWeekendCountdown(info.remainingMs);
  if(voucherBtn){voucherBtn.classList.remove('hidden');voucherBtn.textContent=state.weekend?.voucher?.code?`Ver código ${state.weekend.voucher.code}`:'Ver código +1 ponto';}
}
function renderWeekendVoucherDialog(){
  const voucher=state.weekend?.voucher,code=$('weekend-reward-code'),status=$('weekend-reward-code-status'),copy=$('weekend-reward-copy');
  if(code)code.textContent=voucher?.code|| (state.weekend?.voucherLoading?'Gerando…':'Indisponível');
  if(copy)copy.disabled=!voucher?.code;
  if(status){
    if(voucher?.code)status.textContent=`Voucher emitido em ${new Intl.DateTimeFormat('pt-BR',{timeZone:'America/Sao_Paulo',dateStyle:'short',timeStyle:'short'}).format(new Date(voucher.issued_at))}. Envie este código ao professor.`;
    else if(state.weekend?.voucherLoading)status.textContent='Gerando seu código seguro…';
    else if(state.weekend?.voucherError)status.textContent='Não foi possível gerar o código agora. Tente novamente antes de domingo às 18h.';
    else status.textContent='O código será gerado pelo servidor assim que a recompensa estiver disponível.';
  }
}
async function ensureWeekendVoucher({force=false}={}){
  const info=state.weekend?.window;if(!info?.eligible||!state.profile?.id)return null;
  if(state.weekend.voucher&&!force)return state.weekend.voucher;
  if(state.weekend.voucherLoading)return null;
  state.weekend.voucherLoading=true;state.weekend.voucherError=null;renderWeekendVoucherDialog();
  try{
    const data=await callWeekendVoucher('issue',{class_id:state.classId||null,weekend_id:info.weekendId});
    state.weekend.voucher=data?.voucher||null;
    return state.weekend.voucher;
  }catch(error){console.warn('[AGV] Voucher de fim de semana indisponível.',error);state.weekend.voucherError=error;}
  finally{state.weekend.voucherLoading=false;renderWeekendVoucherDialog();renderWeekendModeBanner();}
  return null;
}
function openWeekendRewardDialog(){
  const info=state.weekend?.window;if(!info?.eligible)return;
  renderWeekendVoucherDialog();
  const dialog=$('weekend-reward-dialog');try{if(dialog&&!dialog.open)dialog.showModal();}catch(_){}
  ensureWeekendVoucher().catch(()=>{});
}
function currentWeekendFileSnapshot(){
  return state.files.map(file=>({filename:file.filename,content:state.active?.id===file.id&&$('code-editor')?String($('code-editor').value??''):String(file.content??'')}));
}
function activeServerDetail(data=state.autoGrade){
  const files=data?.files||state.autoGrade?.files||[];if(!state.active)return null;
  return files.find(file=>referenceAliases(file.filename||file.reference_filename||'').some(alias=>referenceAliases(state.active.filename).includes(alias)))||null;
}
function renderWeekendSupport(data=state.autoGrade){
  const guidance=$('exercise-guidance');if(!guidance)return;
  guidance.querySelector('#weekend-extra-support')?.remove();
  const info=state.weekend?.window;
  if(!info?.eligible||!state.weekend.enabled||!state.active){clearWeekendFocus();return;}
  const reference=referenceForFile(state.active.filename,{fast:true})||'';
  const diagnostics=buildWeekendDiagnostics({filename:state.active.filename,language:state.active.language||referenceLanguageForFile(state.active.filename),studentContent:$('code-editor')?.value??state.active.content??'',referenceContent:reference,files:currentWeekendFileSnapshot(),serverDetail:activeServerDetail(data)});
  state.weekend.lastDiagnostics=diagnostics;state.weekend.focusLine=diagnostics.focusLine||null;
  const box=document.createElement('section');box.id='weekend-extra-support';box.className='weekend-extra-support';
  const head=document.createElement('div');head.className='weekend-support-head';
  const heading=document.createElement('strong');heading.textContent='Ajuda extra deste fim de semana';
  const badge=document.createElement('span');badge.className='weekend-support-badge';badge.textContent='Premiação ativa';head.append(heading,badge);box.append(head);
  for(const item of diagnostics.suggestions||[]){
    const card=document.createElement('div');card.className=`weekend-support-item ${item.level||''}`.trim();
    const title=document.createElement('strong');title.textContent=`${item.focusLine?`Linha ${item.focusLine} • `:''}${item.title||'Próximo ajuste'}`;
    const msg=document.createElement('span');msg.textContent=String(item.message||'');card.append(title,msg);box.append(card);
  }
  if(diagnostics.steps?.length){const title=document.createElement('strong');title.textContent='Passo a passo focado';box.append(title);const ol=document.createElement('ol');diagnostics.steps.forEach(step=>{const li=document.createElement('li');li.textContent=step.replace(/^\d+\.\s*/, '');ol.append(li);});box.append(ol);}
  guidance.append(box);renderEditorLineNumbers();updateWeekendFocusOverlay();
}
let referenceRefreshTimer=0;
let weekendSupportTimer=0;
function scheduleReferenceRefresh(){
  clearTimeout(referenceRefreshTimer);
  referenceRefreshTimer=setTimeout(()=>{referenceRefreshTimer=0;renderReference();renderLiveMetrics();},compactTouchWorkspace()?650:420);
}
function scheduleWeekendSupport(){
  clearTimeout(weekendSupportTimer);
  weekendSupportTimer=setTimeout(()=>{weekendSupportTimer=0;renderWeekendSupport();},compactTouchWorkspace()?700:450);
}
function tickWeekendMode(){
  const info=getWeekendWindow(Date.now(),WEEKEND_SUPPORT_TIME_ZONE);state.weekend.window=info;
  if(!info.eligible){state.weekend.enabled=false;renderWeekendModeBanner();renderWeekendSupport();if(state.weekend.timer){clearInterval(state.weekend.timer);state.weekend.timer=null;}return;}
  renderWeekendModeBanner();
}
function initializeWeekendMode(){
  if(state.weekend.timer){clearInterval(state.weekend.timer);state.weekend.timer=null;}
  const info=getWeekendWindow(Date.now(),WEEKEND_SUPPORT_TIME_ZONE);state.weekend.window=info;
  state.weekend.enabled=Boolean(info.eligible&&!weekendDisabled(info));
  state.weekend.voucher=null;state.weekend.voucherError=null;state.weekend.voucherLoading=false;
  renderWeekendModeBanner();renderWeekendSupport();
  if(info.eligible){
    state.weekend.timer=setInterval(tickWeekendMode,1000);
    ensureWeekendVoucher().catch(()=>{});
    if(!weekendRewardSeen(info))openWeekendRewardDialog();
  }
}
function toggleWeekendMode(){
  const info=getWeekendWindow(Date.now(),WEEKEND_SUPPORT_TIME_ZONE);state.weekend.window=info;if(!info.eligible)return;
  state.weekend.enabled=!state.weekend.enabled;setWeekendDisabled(!state.weekend.enabled);renderWeekendModeBanner();renderWeekendSupport();
}

const CLASSROOM_FALLBACKS = Object.freeze({
  'ee8271e6-390d-455c-badd-c9319a2bf2ec:ad1c2081-9bea-459b-b6f6-272f452bc573':'https://classroom.google.com/c/NzkzNTA2MzQ0MjU1',
  'ee8271e6-390d-455c-badd-c9319a2bf2ec:51875c25-08bc-44a7-af0c-162413edd9df':'https://classroom.google.com/c/ODQyMTU5MjQ3MTA1',
  'ee5f3643-1900-4d0f-91b8-d37bd55f8d27:718b598f-d2c8-40e2-b9f8-9a6980c1caca':'https://classroom.google.com/c/NzkzNTA2MTk2NDg4',
  'ee5f3643-1900-4d0f-91b8-d37bd55f8d27:3815053a-f49d-446b-9b0c-006a601aa194':'https://classroom.google.com/c/ODQyMTU3NDI1MTAy',
  '2cde8db5-9e9c-41cd-847f-d915091f32d2:74f4a657-a75d-4eb2-a1e1-e639ffa3179a':'https://classroom.google.com/c/ODQyMTU2NzEwNzc1',
  '5192fbab-6ec9-4178-9f6d-e4b4b9619d4d:ad1f8cc9-d1ba-4e11-b61c-cf94219d5644':'https://classroom.google.com/c/ODcxMDE0NTQ3NzYw',
  '5192fbab-6ec9-4178-9f6d-e4b4b9619d4d:4240a7d8-23b3-414d-a259-de3eb38dc000':'https://classroom.google.com/c/ODcxMDE0Mjg4NTU4'
});

function classroomFallback(){
  const key=`${state.classId||''}:${state.subject?.id||''}`;
  return CLASSROOM_FALLBACKS[key]||null;
}

function repositoryKey(){return String(state.subject?.slug||'default');}

async function callStudentFiles(body){
  const {data,error}=await supabase.functions.invoke('student-files',{body});
  if(!error&&!data?.error)return data||{};
  let details=data||null;
  try{if(!details&&error?.context?.clone)details=await error.context.clone().json();}catch(_){}
  await handleSessionInvalid(details);
  const e=new Error(details?.reason||details?.error||error?.message||'Falha ao salvar arquivo.');
  e.code=details?.error||'function_error';e.status=error?.context?.status||null;e.details=details;throw e;
}

async function callAutograde(body){
  const {data,error}=await supabase.functions.invoke('exercise-autograde',{body});
  if(!error&&!data?.error)return data||{};
  let details=data||null;
  try{if(!details&&error?.context?.clone)details=await error.context.clone().json();}catch(_){}
  await handleSessionInvalid(details);
  const e=new Error(details?.reason||details?.error||error?.message||'Falha na autocorreção.');
  e.code=details?.error||'function_error';e.status=error?.context?.status||null;e.details=details;throw e;
}


function activeLanguageKey(){
  const raw=String(state.active?.language||state.active?.filename?.split('.').pop()||'text').toLowerCase();
  return ({js:'javascript',mjs:'javascript',kt:'kotlin',md:'markdown',py:'python',htm:'html'})[raw]||raw;
}
function toSymbolItem(item){
  if(item&&typeof item==='object')return {name:String(item.name||item.label||item.value||'símbolo'),value:String(item.value??item.symbol??'')};
  return {name:String(item),value:String(item)};
}
function symbolPaletteModel(){
  const cfg=state.exercise?.config||{},sw=cfg.student_workspace||{},lang=activeLanguageKey();
  const palette=sw.symbol_palette||cfg.symbol_palette;
  if(palette?.enabled){
    const source=palette.groups||{},groups=[];
    const values=(source[lang]||palette.fallback_symbols||[]).map(toSymbolItem).filter(x=>x.value);
    if(values.length)groups.push({name:lang==='javascript'?'JavaScript':lang.toUpperCase(),items:values});
    const pt=(source.portuguese||source.portugues||[]).map(toSymbolItem).filter(x=>x.value);
    if(pt.length&&!['portuguese','portugues'].includes(lang))groups.push({name:'Português',items:pt});
    return {enabled:true,label:String(palette.label||'Símbolos'),groups};
  }
  const typing=sw.typing_assist||cfg.typing_assist;
  if(typing?.enabled){
    const categories=Array.isArray(typing.categories)?typing.categories:[];
    const langId=lang==='javascript'?'javascript':lang;
    const selected=categories.filter(c=>String(c.id||'').toLowerCase()===langId||['portugues','portuguese'].includes(String(c.id||'').toLowerCase()));
    const use=selected.length?selected:categories;
    return {enabled:true,label:String(typing.label||'Símbolos'),groups:use.map(c=>({name:String(c.label||c.id||'Símbolos'),items:(c.symbols||c.items||[]).map(toSymbolItem).filter(x=>x.value)})).filter(g=>g.items.length)};
  }
  const keyboard=sw.keyboard_helper||cfg.keyboard_helper;
  if(keyboard?.enabled){
    return {enabled:true,label:String(keyboard.label||'Símbolos'),groups:(keyboard.groups||[]).map(g=>({name:String(g.name||g.label||'Símbolos'),items:(g.items||g.symbols||[]).map(toSymbolItem).filter(x=>x.value)})).filter(g=>g.items.length)};
  }
  const fallback={
    html:['<','>','/','=','"',"'",'&',';'],
    css:['{','}',':',';','#','.','%','@','(',')',',','-'],
    javascript:['(',')','{','}','[',']','=','=>','===','!==','&&','||','>=','<=','+','-','*','/','!','?','`','$','${','}'],
    python:['_','(',')','[',']','{','}','"',"'",':','=','.',',','#','+','-','*','/','//','%','**','==','!=','>','<','>=','<=','\\','$'],
    kotlin:['(',')','{','}','[',']','=','.', '?',':',',','"','$','${','}','*'],
    xml:['<','>','/','=','"'],
    markdown:['`','#','-','*','[',']','(',')','>'],
    text:['#','-',':','>','/','(',')','"',"'",'?']
  };
  const vals=fallback[lang]||fallback.text;
  return {enabled:true,label:'Símbolos',groups:[{name:lang==='javascript'?'JavaScript':lang.toUpperCase(),items:vals.map(toSymbolItem)}]};
}
function renderSymbolPalette(){
  const model=symbolPaletteModel(),btn=$('symbols-btn'),panel=$('symbol-palette'),box=$('symbol-palette-groups');
  if(btn){btn.classList.toggle('hidden',!model.enabled||!state.active);btn.textContent=model.label;btn.setAttribute('aria-expanded',String(Boolean(state.symbolPaletteOpen&&model.enabled)));}
  if(!panel||!box)return;
  if(!model.enabled||!state.active){state.symbolPaletteOpen=false;panel.classList.add('hidden');box.replaceChildren();return;}
  $('symbol-palette-title').textContent=model.label;
  $('symbol-palette-context').textContent=state.active?.filename?`Arquivo: ${state.active.filename}`:'';
  panel.classList.toggle('hidden',!state.symbolPaletteOpen);
  box.replaceChildren();
  const pairMap={
    javascript:[{name:'parênteses',value:'()'},{name:'chaves',value:'{}'},{name:'colchetes',value:'[]'},{name:'aspas duplas',value:'""'},{name:'aspas simples',value:"''"},{name:'crases / template string',value:'``'},{name:'interpolação',value:'${}'}],
    html:[{name:'aspas duplas',value:'""'},{name:'aspas simples',value:"''"}],css:[{name:'chaves',value:'{}'},{name:'parênteses',value:'()'}],
    python:[{name:'parênteses',value:'()'},{name:'chaves',value:'{}'},{name:'colchetes',value:'[]'},{name:'aspas duplas',value:'""'},{name:'aspas simples',value:"''"}],
    kotlin:[{name:'parênteses',value:'()'},{name:'chaves',value:'{}'},{name:'colchetes',value:'[]'},{name:'aspas duplas',value:'""'},{name:'interpolação',value:'${}'}]
  };
  const groups=[...model.groups],pairs=pairMap[activeLanguageKey()]||[];if(pairs.length)groups.push({name:'Pares rápidos',items:pairs});
  for(const group of groups){
    const section=document.createElement('div');section.className='symbol-group';
    const label=document.createElement('span');label.className='symbol-group-label';label.textContent=group.name;section.append(label);
    const buttons=document.createElement('div');buttons.className='symbol-buttons';
    for(const item of group.items){
      const button=document.createElement('button');button.type='button';button.className='symbol-key';button.textContent=item.value;button.title=item.name;button.setAttribute('aria-label',`${item.name}: ${item.value}`);button.addEventListener('click',()=>insertSymbolAtCursor(item.value));buttons.append(button);
    }
    section.append(buttons);box.append(section);
  }
}
function insertSymbolAtCursor(value){
  const editor=$('code-editor');if(!editor||!state.active)return;
  const start=Number(editor.selectionStart||0),end=Number(editor.selectionEnd||start),text=String(value||'');if(!text)return;
  markTrustedEditorInsertion();
  editor.setRangeText(text,start,end,'end');
  const pairs=new Map([['()',1],['{}',1],['[]',1],['""',1],["''",1],['``',1],['${}',2]]);
  if(pairs.has(text)){const pos=start+pairs.get(text);editor.setSelectionRange(pos,pos);}
  let ev;try{ev=new InputEvent('input',{bubbles:true,inputType:'insertText',data:text});}catch(_){ev=new Event('input',{bubbles:true});}
  editor.dispatchEvent(ev);editor.focus();
}

const DEFAULTS = {
  'introducao-programacao': [{filename:'main.py',language:'python',content:'# Digite seu código Python aqui\n'}],
  'programacao-front-end': [
    {filename:'index.html',language:'html',content:'<!doctype html>\n<html lang="pt-BR">\n<head>\n  <meta charset="utf-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1">\n  <link rel="stylesheet" href="estilo.css">\n  <title>Exercício</title>\n</head>\n<body>\n\n  <script src="script.js"><\\/script>\n</body>\n</html>\n'},
    {filename:'estilo.css',language:'css',content:'/* Escreva seu CSS aqui */\n'},
    {filename:'script.js',language:'javascript',content:'// Escreva seu JavaScript aqui\n'}
  ],
  'programacao-desenvolvimento-sistemas': [
    {filename:'index.html',language:'html',content:'<!doctype html>\n<html lang="pt-BR">\n<head>\n  <meta charset="utf-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1">\n  <link rel="stylesheet" href="style.css">\n  <title>Exercício</title>\n</head>\n<body>\n\n  <script src="script.js"><\\/script>\n</body>\n</html>\n'},
    {filename:'style.css',language:'css',content:'/* Escreva seu CSS aqui */\n'},
    {filename:'script.js',language:'javascript',content:'// Escreva seu JavaScript aqui\n'}
  ],
  'programacao-front-end-sub': [
    {filename:'index.html',language:'html',content:'<!doctype html>\n<html lang="pt-BR">\n<head>\n  <meta charset="utf-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1">\n  <link rel="stylesheet" href="style.css">\n  <title>Exercício</title>\n</head>\n<body>\n\n  <script src="script.js"><\\/script>\n</body>\n</html>\n'},
    {filename:'style.css',language:'css',content:'/* Escreva seu CSS aqui */\n'},
    {filename:'script.js',language:'javascript',content:'// Escreva seu JavaScript aqui\n'}
  ],
  'programacao-mobile-sub': [
    {filename:'index.html',language:'html',content:'<!doctype html>\n<html lang="pt-BR">\n<head>\n  <meta charset="utf-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1">\n  <link rel="stylesheet" href="style.css">\n  <title>Mobile</title>\n</head>\n<body>\n\n  <script src="script.js"><\\/script>\n</body>\n</html>\n'},
    {filename:'style.css',language:'css',content:'/* CSS mobile */\n'},
    {filename:'script.js',language:'javascript',content:'// JavaScript mobile\n'}
  ],
  'analise-metodo-sistemas': [{filename:'atividade.md',language:'markdown',content:'# Resposta da atividade\n\n'}],
  'inovacao-tecnologica-empreendedorismo': [{filename:'atividade.md',language:'markdown',content:'# Desenvolvimento da atividade\n\n'}]
};

function cacheKey(file){ return `epds:${state.profile.id}:${state.exercise.id}:${file.filename}`; }

function readCachedDraft(file){
  const raw=localStorage.getItem(cacheKey(file));
  if(raw===null)return null;
  try{
    const parsed=JSON.parse(raw);
    if(parsed&&parsed.v===2&&typeof parsed.content==='string'){
      return {content:parsed.content,savedAt:Number(parsed.savedAt||0),remoteRevision:Number(parsed.remoteRevision||0)};
    }
  }catch(_){}
  return {content:String(raw),savedAt:0,remoteRevision:0,legacy:true};
}

function persistLocalDraft(file,content){
  if(!file)return false;
  try{
    localStorage.setItem(cacheKey(file),JSON.stringify({
      v:2,
      content:String(content??''),
      savedAt:Date.now(),
      remoteRevision:Number(file.revision||0)
    }));
    return true;
  }catch(error){
    console.warn('[AGV] Não foi possível gravar a cópia local do arquivo.',error);
    return false;
  }
}

function mirrorSaveState(text,cls=''){
  const pill=$('workspace-save-pill');
  if(!pill)return;
  const normalized=cls==='error'?'error':cls==='saving'?'saving':'ok';
  pill.dataset.state=normalized;
  pill.textContent=normalized==='error'?'Cópia local preservada':normalized==='saving'?'Salvando…':'Salvo';
  pill.title=text||pill.textContent;
}

function showRecoveryBanner(count){
  const banner=$('draft-recovery');
  if(!banner)return;
  if(!count){banner.classList.add('hidden');return;}
  $('draft-recovery-text').textContent=count===1
    ?'Recuperamos uma alteração mais recente que ainda não tinha chegado à nuvem.'
    :`Recuperamos ${count} arquivos com alterações mais recentes que ainda não tinham chegado à nuvem.`;
  banner.classList.remove('hidden');
}

function setToolsOpen(open){
  state.toolsOpen=!!open;
  document.getElementById('exercise-view')?.classList.toggle('tools-collapsed',!state.toolsOpen);
  const btn=$('toggle-tools-btn');
  if(btn){btn.setAttribute('aria-expanded',String(state.toolsOpen));btn.textContent=state.toolsOpen?'Ocultar orientações':'Orientações';}
}

function setOutputOpen(open){
  state.outputOpen=!!open;
  document.getElementById('exercise-view')?.classList.toggle('output-collapsed',!state.outputOpen);
  const btn=$('toggle-output-btn');
  if(btn){
    btn.setAttribute('aria-expanded',String(state.outputOpen));
    btn.textContent=state.outputOpen?'Ocultar painel':(state.referenceAvailable?'Referência':'Preview');
  }
}

function referenceEntry(){
  const key=`${state.subject?.slug||''}:${state.exercise?.exercise_number||''}`;
  return EXERCISE_REFERENCE_CATALOG_CURRENT[key]||EXERCISE_REFERENCE_DS2_CORRECTED[key]||EXERCISE_REFERENCES[key]||EXERCISE_REFERENCE_EXTRAS[key]||EXERCISE_REFERENCE_SYNCED[key]||EXERCISE_REFERENCE_3DS_RESTORED[key]||null;
}

function localReferenceEntries(){
  const key=`${state.subject?.slug||''}:${state.exercise?.exercise_number||''}`;
  return [
    ['catalog-current',EXERCISE_REFERENCE_CATALOG_CURRENT[key]],
    ['ds2-corrected',EXERCISE_REFERENCE_DS2_CORRECTED[key]],
    ['reference',EXERCISE_REFERENCES[key]],
    ['extra',EXERCISE_REFERENCE_EXTRAS[key]],
    ['synced',EXERCISE_REFERENCE_SYNCED[key]],
    ['3ds-restored',EXERCISE_REFERENCE_3DS_RESTORED[key]],
  ].filter(([,entry])=>entry?.files&&typeof entry.files==='object');
}

function simpleContentHash(value){
  const source=normalizeReferenceContent(value);
  let h=2166136261;
  for(let i=0;i<source.length;i++){h^=source.charCodeAt(i);h=Math.imul(h,16777619);}
  return (h>>>0).toString(16).padStart(8,'0');
}
function addReferenceVariant(file){
  if(!file?.filename)return;
  const key=normalizeFilename(file.filename),content=normalizeReferenceContent(file.content);
  if(!content.trim())return;
  if(!state.referenceVariants.has(key))state.referenceVariants.set(key,[]);
  const list=state.referenceVariants.get(key),hash=file.content_hash||simpleContentHash(content);
  const found=list.find(item=>normalizeReferenceContent(item.content)===content||(item.content_hash||simpleContentHash(item.content))===hash);
  if(found){
    if(file.is_current){Object.assign(found,file,{content,is_current:true});}
    return;
  }
  list.push({...file,content,content_hash:hash});
}
function referenceVariantCandidates(filename){
  const out=[];
  for(const alias of referenceAliases(filename)){
    for(const item of state.referenceVariants.get(alias)||[])if(!out.some(existing=>existing.id===item.id&&existing.content_hash===item.content_hash))out.push(item);
  }
  const current=referenceFileCurrentFor(filename);
  if(current&&!out.some(item=>normalizeReferenceContent(item.content)===normalizeReferenceContent(current.content))){
    out.push({...current,id:`current:${normalizeFilename(current.filename)}:${simpleContentHash(current.content)}`,label:'Atual • sincronizada',version_key:'current',is_current:true,content_hash:simpleContentHash(current.content)});
  }
  return out;
}
function similarityTokens(value){
  return (normalizeReferenceContent(value).toLowerCase().match(/===|!==|=>|==|!=|>=|<=|&&|\|\||[a-z_$À-ÿ][\w$À-ÿ-]*|\d+(?:\.\d+)?|[{}()[\]<>:;,.#@%+*\/=!?&|$-]/gi)||[]);
}
function referenceSimilarity(student,reference){
  const a=similarityTokens(student),b=similarityTokens(reference);
  if(!a.length||!b.length)return 0;
  const A=new Map(),B=new Map();
  for(const x of a)A.set(x,(A.get(x)||0)+1);for(const x of b)B.set(x,(B.get(x)||0)+1);
  let common=0;for(const [k,n] of A)common+=Math.min(n,B.get(k)||0);
  const precision=common/a.length,recall=common/b.length;
  return precision+recall?(2*precision*recall)/(precision+recall):0;
}
function currentStudentContentFor(filename){
  const target=state.files.find(file=>referenceAliases(filename).includes(normalizeFilename(file.filename)));
  return target?currentFileContent(target):'';
}
function selectedReferenceVariant(filename){
  const candidates=referenceVariantCandidates(filename);
  if(!candidates.length)return null;
  const key=normalizeFilename(filename),manual=state.referenceSelections.get(key);
  if(manual&&manual!=='auto'){
    const selected=candidates.find(item=>String(item.id||item.version_key||item.content_hash)===manual);
    if(selected){const result={...selected,match_mode:'manual',match_score:referenceSimilarity(currentStudentContentFor(filename),selected.content)};state.referenceMatchCache.set(key,result);return result;}
  }
  const student=currentStudentContentFor(filename);
  const current=candidates.find(item=>item.is_current)||candidates[0];
  if(!String(student||'').trim()){const result={...current,match_mode:'current-empty',match_score:0};state.referenceMatchCache.set(key,result);return result;}
  let best=current,bestScore=-1;
  for(const candidate of candidates){
    const score=referenceSimilarity(student,candidate.content);
    if(score>bestScore+0.0001||(Math.abs(score-bestScore)<0.0001&&candidate.is_current)){best=candidate;bestScore=score;}
  }
  const result={...best,match_mode:'auto',match_score:Math.max(0,bestScore)};state.referenceMatchCache.set(key,result);return result;
}
function cachedReferenceVariant(filename){
  const key=normalizeFilename(filename),manual=state.referenceSelections.get(key);
  if(manual&&manual!=='auto')return selectedReferenceVariant(filename);
  return state.referenceMatchCache.get(key)||referenceFileCurrentFor(filename)||referenceVariantCandidates(filename).find(item=>item.is_current)||referenceVariantCandidates(filename)[0]||null;
}

function normalizeFilename(value){return String(value||'').trim().toLowerCase();}
function referenceAliases(filename){
  const name=normalizeFilename(filename), aliases=new Set([name]);
  if(name==='style.css')aliases.add('estilo.css');
  if(name==='estilo.css')aliases.add('style.css');
  if(name==='app.js')aliases.add('script.js');
  if(name==='script.js')aliases.add('app.js');
  if(name==='atividade.md')aliases.add('referencia.md');
  if(name==='referencia.md')aliases.add('atividade.md');
  if(name==='mainactivity.kt')aliases.add('main.kt');
  if(name==='main.kt')aliases.add('mainactivity.kt');
  return [...aliases];
}

async function loadWorkspaceResources(){
  state.referenceFiles=new Map();state.referenceVariants=new Map();state.referenceSelections=new Map();state.referenceMatchCache=new Map();state.referenceSource='none';state.classId=null;state.classroomUrl=null;state.repositoryUrl=null;state.legacyRepositoryUrl=null;state.linksLoaded=false;
  const fallback=referenceEntry();
  const fallbackFiles=Object.entries(fallback?.files||{}).map(([filename,content])=>({filename,language:(fallback.languages||{})[filename]||'',content:String(content??''),source:'bundle'}));
  let dbRefs=[];
  try{
    const {data,error}=await supabase.from('exercise_reference_files')
      .select('filename,language,content,updated_at')
      .eq('exercise_id',state.exercise.id)
      .order('filename',{ascending:true});
    if(error)throw error;
    dbRefs=Array.isArray(data)?data:[];
  }catch(error){console.warn('[AGV] Referência no Supabase indisponível; usando contingência local.',error);}
  for(const file of fallbackFiles)state.referenceFiles.set(normalizeFilename(file.filename),file);
  for(const [source,entry] of localReferenceEntries()){
    for(const [filename,content] of Object.entries(entry.files||{})){
      addReferenceVariant({
        id:`bundle:${source}:${normalizeFilename(filename)}:${simpleContentHash(content)}`,
        filename,language:(entry.languages||{})[filename]||'',content,
        label:`Histórica local • ${source}`,version_key:`bundle:${source}`,source_kind:'bundle_snapshot',source_ref:source,is_current:false
      });
    }
  }
  let usefulDbRefs=0;
  for(const file of dbRefs){
    const content=String(file?.content??'');
    // Uma linha vazia no banco nunca deve apagar uma referência local válida.
    // O Supabase continua sendo a fonte principal quando possui conteúdo real.
    if(!content.trim())continue;
    state.referenceFiles.set(normalizeFilename(file.filename),{...file,content,source:'supabase'});
    usefulDbRefs+=1;
  }
  state.referenceSource=usefulDbRefs?'supabase':fallbackFiles.length?'bundle':'none';
  for(const file of state.referenceFiles.values())addReferenceVariant({...file,id:`current:${normalizeFilename(file.filename)}:${simpleContentHash(file.content)}`,label:file.source==='supabase'?'Atual • sincronizada':'Atual • contingência local',version_key:'current',is_current:true});
  try{
    const {data:history,error}=await supabase.from('exercise_reference_file_versions')
      .select('id,filename,language,content,content_hash,version_key,label,source_kind,source_ref,effective_from,effective_to,is_current,active')
      .eq('exercise_id',state.exercise.id).eq('active',true)
      .order('filename',{ascending:true}).order('is_current',{ascending:false});
    if(error)throw error;
    for(const file of history||[])addReferenceVariant({...file,source:'history'});
  }catch(error){console.info('[AGV] Histórico versionado de referências ainda não instalado; mantendo referências atuais e snapshots locais.',error?.message||error);}
  state.referenceAvailable=state.referenceFiles.size>0||state.referenceVariants.size>0;

  try{
    const {data:membership,error}=await supabase.from('class_memberships').select('class_id')
      .eq('user_id',state.profile.id).eq('active',true).order('is_primary',{ascending:false}).limit(1).maybeSingle();
    if(error)throw error;
    state.classId=membership?.class_id||state.exercise?.class_id||null;
  }catch(error){console.warn('[AGV] Não foi possível resolver a turma para links externos.',error);state.classId=state.exercise?.class_id||null;}

  const linkTasks=[];
  if(state.classId&&state.subject?.id){
    linkTasks.push((async()=>{
      const {data,error}=await supabase.from('classroom_links').select('url')
        .eq('class_id',state.classId).eq('subject_id',state.subject.id).eq('active',true).limit(1);
      if(error)throw error;state.classroomUrl=data?.[0]?.url||classroomFallback();
    })());
  }
  linkTasks.push((async()=>{
    const {data,error}=await supabase.from('student_delivery_settings').select('repository_url,repository_urls').eq('user_id',state.profile.id).maybeSingle();
    if(error&&error.code!=='PGRST116')throw error;
    const perSubject=(data?.repository_urls&&typeof data.repository_urls==='object')?data.repository_urls[repositoryKey()]:null;
    state.repositoryUrl=perSubject||null;
    state.legacyRepositoryUrl=data?.repository_url||null;
  })());
  const results=await Promise.allSettled(linkTasks);
  results.filter(x=>x.status==='rejected').forEach(x=>console.warn('[AGV] Link externo indisponível.',x.reason));
  if(!state.classroomUrl)state.classroomUrl=classroomFallback();
  state.linksLoaded=true;
  updateWorkspaceActionAvailability();
}

function referenceFileCurrentFor(filename){
  const exact=normalizeFilename(filename);
  const candidates=referenceAliases(filename)
    .map(alias=>state.referenceFiles.get(alias))
    .filter(Boolean);
  // O Supabase é a fonte oficial mesmo quando usa um alias equivalente ao
  // nome do arquivo do aluno (style.css/estilo.css, main.kt/MainActivity.kt).
  // Dentro da mesma fonte, o nome exato continua sendo preferido.
  return candidates.find(file=>file.source==='supabase'&&normalizeFilename(file.filename)===exact)
    ||candidates.find(file=>file.source==='supabase')
    ||candidates.find(file=>normalizeFilename(file.filename)===exact)
    ||candidates[0]
    ||null;
}
function referenceFileFor(filename,{fast=false}={}){
  return (fast?cachedReferenceVariant(filename):selectedReferenceVariant(filename))||referenceFileCurrentFor(filename);
}
function normalizeReferenceContent(value){
  let source=String(value??'').replace(/\r\n?/g,'\n');
  const realNewlines=(source.match(/\n/g)||[]).length;
  const escapedNewlines=(source.match(/\\n/g)||[]).length;
  // Contingência para imports antigos que gravaram o arquivo inteiro com \n literal.
  // Só converte quando não existe nenhuma quebra real e há evidência de arquivo multilinha,
  // evitando alterar sequências \n legítimas dentro de strings de um código normal.
  if(realNewlines===0&&escapedNewlines>=2){
    source=source.replace(/\\r\\n/g,'\n').replace(/\\n/g,'\n').replace(/\\r/g,'\n');
  }
  return source;
}
function referenceForFile(filename,{fast=false}={}){
  const file=referenceFileFor(filename,{fast});
  return file?normalizeReferenceContent(file.content):null;
}
function referenceLanguageForFile(filename){return referenceFileFor(filename)?.language||state.active?.language||'text';}

function renderReferenceVersionControl(filename,file){
  const select=$('reference-version-select'),status=$('reference-version-status'),wrap=$('reference-version-control');
  if(!select||!status||!wrap)return;
  const candidates=referenceVariantCandidates(filename),key=normalizeFilename(filename),selection=state.referenceSelections.get(key)||'auto';
  select.replaceChildren();
  const auto=document.createElement('option');auto.value='auto';auto.textContent='Auto • mais próxima do seu código';select.append(auto);
  const ordered=[...candidates].sort((a,b)=>Number(Boolean(b.is_current))-Number(Boolean(a.is_current))||String(b.effective_from||'').localeCompare(String(a.effective_from||'')));
  ordered.forEach((candidate,index)=>{
    const option=document.createElement('option');
    option.value=String(candidate.id||candidate.version_key||candidate.content_hash);
    const date=candidate.effective_from?` • ${formatDate(candidate.effective_from)}`:'';
    option.textContent=candidate.is_current?`Atual${date}`:`Anterior ${index}${date} • ${candidate.source_ref||candidate.label||'histórica'}`;
    select.append(option);
  });
  select.value=[...select.options].some(option=>option.value===selection)?selection:'auto';
  select.disabled=candidates.length<2;
  wrap.classList.toggle('single-version',candidates.length<2);
  const score=Math.round(Number(file?.match_score||0)*100);
  if(file?.match_mode==='manual')status.textContent=`Exibição manual • compatibilidade estimada ${score}%`;
  else if(file?.match_mode==='auto'&&!file?.is_current)status.textContent=`Detectada referência anterior • compatibilidade ${score}%`;
  else if(file?.match_mode==='auto')status.textContent=`Detectada referência atual • compatibilidade ${score}%`;
  else status.textContent=file?.is_current?'Referência atual':'Referência histórica';
}

function renderReference(){
  const code=$('reference-code'),name=$('reference-filename'),note=$('reference-note');
  if(!code||!name||!note)return;
  const file=referenceFileFor(state.active?.filename),content=normalizeReferenceContent(file?.content);
  const has=typeof content==='string'&&content.length>0;
  state.referenceAvailable=state.referenceFiles.size>0||state.referenceVariants.size>0;
  name.textContent=state.active?.filename||'arquivo';
  renderReferenceVersionControl(state.active?.filename,file);
  if(has){
    const historical=!file?.is_current;
    const mode=file?.match_mode==='manual'?'selecionada manualmente':file?.match_mode==='auto'?'detectada automaticamente':'selecionada';
    note.textContent=historical
      ?`Referência histórica oficial ${mode} para manter compatibilidade com o código já digitado. Você pode comparar com a versão atual no seletor acima.`
      :`Referência atual ${mode}. Se o seu código começou antes de uma atualização, o modo Auto pode reconhecer e exibir uma versão anterior. Copiar, arrastar e colar continuam desativados.`;
    code.innerHTML=renderNumberedCode(content,referenceLanguageForFile(state.active?.filename));
    code.dataset.empty='false';
  }else{
    note.textContent=state.referenceAvailable?'Não existe referência para este arquivo específico. Selecione outro arquivo da atividade.':'A referência ainda não foi publicada para esta atividade.';
    code.innerHTML='<span class="reference-empty-message">Referência ainda não publicada.</span>';
    code.dataset.empty='true';
  }
  const btn=$('toggle-output-btn');
  if(btn&&!state.outputOpen)btn.textContent=state.referenceAvailable?'Referência':'Preview';
}

function escapeCode(value){
  return String(value??'').replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
}
function span(cls,value){return `<span class="${cls}">${escapeCode(value)}</span>`;}
function tokenClass(token,language){
  const t=String(token),lang=String(language||'').toLowerCase();
  if(/^\/\//.test(t)||/^\/\*/.test(t)||/^#/.test(t)||/^<!--/.test(t))return 'tok-comment';
  if(/^['"`]/.test(t))return 'tok-string';
  if(/^\d/.test(t)||/^#[0-9a-f]{3,8}$/i.test(t))return 'tok-number';
  if(lang==='html'&&/^<\/?/.test(t))return 'tok-tag';
  return 'tok-keyword';
}

function highlightHtmlLine(line){
  const source=String(line??'');
  if(/^\s*<!--/.test(source))return span('tok-comment',source);
  let out='',last=0,m;
  const tagRx=/<\/?[A-Za-z][^>]*>/g;
  while((m=tagRx.exec(source))){
    out+=escapeCode(source.slice(last,m.index));
    const raw=m[0];
    const parts=raw.match(/^(<\/?)([A-Za-z][\w:-]*)([\s\S]*?)(\/?>)$/);
    if(!parts){out+=span('tok-tag',raw);last=tagRx.lastIndex;continue;}
    let attrs='',aLast=0,a;
    const attrRx=/([A-Za-z_:][\w:.-]*)(\s*=\s*)("[^"]*"|'[^']*'|[^\s>]+)/g;
    while((a=attrRx.exec(parts[3]))){
      attrs+=escapeCode(parts[3].slice(aLast,a.index));
      attrs+=span('tok-attr',a[1])+escapeCode(a[2])+span('tok-string',a[3]);
      aLast=attrRx.lastIndex;
    }
    attrs+=escapeCode(parts[3].slice(aLast));
    out+=escapeCode(parts[1])+span('tok-tag',parts[2])+attrs+escapeCode(parts[4]);
    last=tagRx.lastIndex;
  }
  return out+escapeCode(source.slice(last));
}

function highlightCode(code,language='text'){
  const lang=String(language||'').toLowerCase(),source=String(code??'');
  if(lang==='html'||lang==='htmlmixed')return source.split('\n').map(highlightHtmlLine).join('\n');
  let rx=null;
  if(lang==='javascript'||lang==='js'){
    rx=/\/\/[^\n]*|\/\*[\s\S]*?\*\/|'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|`(?:\\.|[^`\\])*`|\b(?:const|let|var|function|if|else|for|while|return|class|new|async|await|true|false|null|undefined|document|window|addEventListener|querySelector|querySelectorAll|map|filter|reduce|forEach|push|length)\b|\b\d+(?:\.\d+)?\b/g;
  }else if(lang==='python'||lang==='py'){
    rx=/#[^\n]*|'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|\b(?:def|if|elif|else|for|while|return|import|from|as|class|True|False|None|and|or|not|in|print|input|range|len|int|float|str|bool)\b|\b\d+(?:\.\d+)?\b/g;
  }else if(lang==='kotlin'||lang==='kt'){
    rx=/\/\/[^\n]*|\/\*[\s\S]*?\*\/|'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|\b(?:package|import|class|object|interface|fun|val|var|override|private|public|protected|internal|if|else|when|for|while|return|in|is|as|this|super|null|true|false|try|catch|finally|throw|setContentView|onCreate|apply)\b|\b\d+(?:\.\d+)?[fFlL]?\b/g;
  }else if(lang==='css'){
    rx=/\/\*[\s\S]*?\*\/|'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|#[0-9a-fA-F]{3,8}\b|\b(?:display|position|color|background|background-color|margin|padding|width|height|min-width|max-width|grid|grid-template-columns|flex|flex-wrap|gap|border|border-radius|font|font-size|font-weight|transform|transition|align-items|justify-content|box-shadow)\b|\b\d+(?:\.\d+)?(?:px|rem|em|%|vh|vw|s|ms)?\b/g;
  }else if(lang==='json'){
    rx=/"(?:\\.|[^"\\])*"(?=\s*:)|"(?:\\.|[^"\\])*"|\b(?:true|false|null)\b|-?\b\d+(?:\.\d+)?\b/g;
  }
  if(!rx)return escapeCode(source);
  let out='',last=0,m;
  while((m=rx.exec(source))){
    out+=escapeCode(source.slice(last,m.index));
    const tok=m[0];
    let cls=tokenClass(tok,lang);
    if(lang==='json'&&/^"/.test(tok)&&/^\s*:/.test(source.slice(rx.lastIndex)))cls='tok-attr';
    if(lang==='css'&&/^[a-z-]+$/i.test(tok))cls='tok-attr';
    out+=span(cls,tok);last=rx.lastIndex;
  }
  return out+escapeCode(source.slice(last));
}

function renderNumberedCode(content,language){
  // Cada linha já é um elemento de bloco/grid. Não inserir `\n` entre os
  // elementos: com white-space:pre esse caractere vira uma linha visual extra.
  // Remove somente a linha vazia artificial criada pelo newline final do arquivo;
  // linhas vazias reais no meio do código continuam preservadas.
  const lines=normalizeReferenceContent(content).split('\n');
  if(lines.length>1&&lines[lines.length-1]==='')lines.pop();
  return lines.map((raw,index)=>{
    const line=highlightCode(raw,language);
    return `<span class="reference-line"><span class="reference-line-number" aria-hidden="true">${index+1}</span><span class="reference-line-code">${line||'&nbsp;'}</span></span>`;
  }).join('');
}

function renderEditorLineNumbers(){
  const editor=$('code-editor'),gutter=$('editor-line-numbers');if(!editor||!gutter)return;
  const count=Math.max(1,String(editor.value??'').split('\n').length),focus=state.weekend?.enabled&&state.weekend?.window?.eligible?Number(state.weekend?.focusLine||0):0;
  const signature=`${count}:${focus}`;
  if(gutter.dataset.signature!==signature){
    gutter.innerHTML=Array.from({length:count},(_,i)=>`<span${i+1===focus?' class="weekend-focus"':''}>${i+1}</span>`).join('');
    gutter.dataset.signature=signature;
  }
  gutter.scrollTop=editor.scrollTop;updateWeekendFocusOverlay();
}

let highlightFrame=0;
function renderHighlight(){
  cancelAnimationFrame(highlightFrame);
  highlightFrame=requestAnimationFrame(()=>{
    const editor=$('code-editor'),pre=$('code-highlight');
    if(!editor||!pre)return;
    try{
      const source=String(editor.value??'');
      if(compactTouchWorkspace()&&source.length>24000)pre.textContent=source;
      else pre.innerHTML=highlightCode(source,state.active?.language||'text');
      const shell=editor.closest('.editor-shell');
      const highlightReady=Boolean(pre.textContent===editor.value);
      shell?.classList.toggle('highlight-ready',highlightReady);
    }catch(_){
      editor.closest('.editor-shell')?.classList.remove('highlight-ready');
      pre.textContent='';
    }
    pre.scrollTop=editor.scrollTop;pre.scrollLeft=editor.scrollLeft;
    renderEditorLineNumbers();
  });
}

async function flushRecoveredDrafts(){
  if(!state.recoveredFiles.size)return;
  const ids=[...state.recoveredFiles];
  for(const id of ids){
    const file=state.files.find(f=>f.id===id);
    if(file) await saveFileSnapshot(file.id,file.content||'',false);
  }
  state.recoveredFiles.clear();
}

function setSaveState(text,cls=''){
  const el=$('save-state');
  if(el){el.textContent=text; el.className=`save-state ${cls}`.trim();}
  mirrorSaveState(text,cls);
}

function tabInsert(textarea,event){
  if(event.key!=='Tab')return;
  event.preventDefault();
  const start=textarea.selectionStart,end=textarea.selectionEnd;
  textarea.value=textarea.value.slice(0,start)+'  '+textarea.value.slice(end);
  textarea.selectionStart=textarea.selectionEnd=start+2;
  textarea.dispatchEvent(new Event('input',{bubbles:true}));
}

function starterForFile(file,defs,safeDefaults){
  const filename=String(file?.filename||'');
  const lower=filename.toLowerCase();
  const exact=safeDefaults.find(x=>String(x.filename).toLowerCase()===lower)?.content;
  if(exact)return exact;
  if(lower.endsWith('.html')){
    const css=defs.find(x=>/\.css$/i.test(x.filename||''))?.filename||'estilo.css';
    const js=defs.find(x=>/\.(?:js|mjs)$/i.test(x.filename||''))?.filename||'script.js';
    const cssHref=filename.includes('/')?`../${css}`:css;
    const jsSrc=filename.includes('/')?`../${js}`:js;
    return `<!doctype html>\n<html lang="pt-BR">\n<head>\n  <meta charset="utf-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1">\n  <link rel="stylesheet" href="${cssHref}">\n  <title>Exercício</title>\n</head>\n<body>\n\n  <script src="${jsSrc}"><\/script>\n</body>\n</html>\n`;
  }
  if(lower.endsWith('.css'))return '/* Escreva seu CSS aqui */\n';
  if(/\.(?:js|mjs)$/i.test(lower))return '// Escreva seu JavaScript aqui\n';
  if(lower.endsWith('.py'))return '# Digite seu código Python aqui\n';
  return '';
}

function defaultFiles(subjectSlug){
  const key=`${subjectSlug}:${state.exercise.exercise_number}`;
  const meta=EXERCISE_MANIFEST_CURRENT[key] || EXERCISE_MANIFEST[key] || null;
  state.meta=meta;
  const safeDefaults=DEFAULTS[subjectSlug]||[];
  const defs=(meta?.files||[]).length ? meta.files : safeDefaults;
  const support=state.supportRelease||{};
  return defs.map(f=>{
    const name=String(f.filename||'').toLowerCase();
    const allowed=(name.endsWith('.html')&&support.allow_html_base)||(name.endsWith('.css')&&support.allow_css_base)||((name.endsWith('.js')||name.endsWith('.mjs'))&&support.allow_js_base);
    const starter=starterForFile(f,defs,safeDefaults);
    return {filename:f.filename,language:f.language||'text',content:allowed?starter:''};
  });
}

async function loadRemoteFiles(){
  const {data,error}=await supabase.from('student_files')
    .select('id,filename,language,content,revision,saved_at')
    .eq('student_id',state.profile.id)
    .eq('exercise_id',state.exercise.id)
    .order('filename');
  if(error) throw error;
  return data||[];
}

async function ensureFiles(){
  let remote=await loadRemoteFiles();
  const desired=defaultFiles(state.subject.slug);
  const remoteNames=new Set(remote.flatMap(file=>referenceAliases(file.filename)));
  const missingExpected=desired.filter(file=>!referenceAliases(file.filename).some(name=>remoteNames.has(name)));
  if(!remote.length||missingExpected.length){
    const seeds=desired.map(f=>{
      const raw=localStorage.getItem(`epds:${state.profile.id}:${state.exercise.id}:${f.filename}`);
      let draftContent=null;
      if(raw!==null){
        try{const parsed=JSON.parse(raw);draftContent=parsed?.v===2&&typeof parsed.content==='string'?parsed.content:String(raw);}
        catch(_){draftContent=String(raw);}
      }
      return {
        student_id:state.profile.id,exercise_id:state.exercise.id,
        filename:f.filename,language:f.language,content:draftContent ?? f.content
      };
    });
    const data=await callStudentFiles({action:'ensure',exercise_id:state.exercise.id,files:seeds.map(({filename,language,content})=>({filename,language,content}))});
    remote=data.files||remote;
  }
  const canonicalNames=new Set(desired.flatMap(file=>referenceAliases(file.filename)));
  remote=remote.filter(file=>referenceAliases(file.filename).some(name=>canonicalNames.has(name)));
  state.files=remote;
  state.recoveredFiles=new Set();
  remote.forEach(file=>{
    const serverContent=file.content||'';
    state.lastSavedContent.set(file.id,serverContent);
    const draft=readCachedDraft(file);
    if(!draft)return;
    if(shouldRecoverCachedDraft(file,draft,serverContent)){
      file.content=draft.content;
      state.recoveredFiles.add(file.id);
    }else if(draft.content===serverContent){
      localStorage.removeItem(cacheKey(file));
    }
  });
  showRecoveryBanner(state.recoveredFiles.size);
}

function renderFileTabs(){
  const boxes=[$('file-tabs'),$('quick-file-tabs')].filter(Boolean);
  boxes.forEach(box=>box.innerHTML='');
  state.files.forEach(file=>{
    boxes.forEach(box=>{
      const b=document.createElement('button');
      b.type='button'; b.className='file-tab'+(state.active?.id===file.id?' active':'');
      b.textContent=file.filename;
      b.onclick=async()=>activateFile(file.id);
      box.appendChild(b);
    });
  });
}

async function activateFile(id){
  const next=state.files.find(f=>f.id===id); if(!next)return;
  if(state.active && state.active.id!==id) await saveActiveFile(false);
  state.active=next;
  $('active-filename').textContent=next.filename;
  $('active-language').textContent=next.language||'texto';
  $('code-editor').value=next.content||'';
  renderFileTabs();
  renderHighlight();
  renderReference();
  renderSymbolPalette();
  renderLiveMetrics();
  renderWeekendSupport();
  setSaveState(`Revisão ${next.revision||1} • ${formatDate(next.saved_at)}`,'ok');
  sendEditorSnapshot(true);
}

function formatDate(v){
  if(!v)return' ainda não salvo';
  try{return new Intl.DateTimeFormat('pt-BR',{dateStyle:'short',timeStyle:'short'}).format(new Date(v));}
  catch{return String(v);}
}

function scheduleSave(){
  if(!state.active)return;
  state.dirty=true;
  state.active.content=$('code-editor').value;
  const localProtected=persistLocalDraft(state.active,state.active.content);
  setSaveState(localProtected?'Alterações locais protegidas — sincronizando':'Sincronizando — cópia local indisponível neste navegador',localProtected?'saving':'error');
  clearTimeout(state.saveTimer);
  const fileId=state.active.id;
  const content=$('code-editor').value;
  state.saveTimer=setTimeout(()=>saveFileSnapshot(fileId,content,false),1200);
}

async function performFileSave(fileId,content,force=false){
  const file=state.files.find(f=>f.id===fileId); if(!file)return {synced:false,skipped:true};
  if(!force && state.lastSavedContent.get(fileId)===content){
    if(state.active?.id===fileId){state.dirty=($('code-editor').value!==content);setSaveState(`Tudo salvo • revisão ${file.revision||1}`,'ok');}
    return {synced:true,current:state.active?.id!==fileId||$('code-editor').value===content,skipped:true,file};
  }
  const localProtected=persistLocalDraft(file,content);
  if(state.active?.id===fileId)setSaveState(localProtected?'Salvando na nuvem...':'Salvando na nuvem — cópia local indisponível',localProtected?'saving':'error');
  let data;
  try{
    const result=await callStudentFiles({action:'save',exercise_id:state.exercise.id,file_id:fileId,content});
    data=result.file;
    if(!data)throw new Error('Servidor não confirmou o arquivo salvo.');
  }catch(error){
    if(error.status===423){
      setWorkspacePaused(true,error.details?.reason||'Atividade bloqueada pelo professor.');
    }
    if(state.active?.id===fileId){
      if(error.code==='malicious_code_rejected'){
        setSaveState(`Código não salvo: padrão bloqueado (${(error.details?.patterns||[]).join(', ')||'segurança'}). O evento foi registrado para o professor.`,'error');
      }else{
        setSaveState(localProtected?'Sem conexão ou atividade bloqueada: cópia local preservada':'Falha ao salvar e não foi possível criar cópia local','error');
      }
    }
    return {synced:false,error,localProtected};
  }
  file.revision=data.revision; file.saved_at=data.saved_at;
  // Nunca substitua em memória uma edição mais nova por uma resposta de uma gravação anterior.
  if(String(file.content??'')===String(content??''))file.content=data.content;
  state.lastSavedContent.set(fileId,data.content);
  const currentContent=state.active?.id===fileId?$('code-editor').value:String(file.content??'');
  if(currentContent===data.content)localStorage.removeItem(cacheKey(file));
  else persistLocalDraft(file,currentContent);
  if(state.active?.id===fileId){
    state.dirty=($('code-editor').value!==data.content);
    setSaveState(state.dirty?`Revisão ${data.revision} salva • há alterações mais novas aguardando`:`Salvo • revisão ${data.revision} • ${formatDate(data.saved_at)}`,state.dirty?'saving':'ok');
  }
  if(Date.now()-state.lastProgressTouchAt>10000){
    state.lastProgressTouchAt=Date.now();
    callActivityProgress({action:'touch',exercise_id:state.exercise.id}).catch(()=>{});
  }
  return {synced:true,current:currentContent===data.content,file:data};
}

function saveFileSnapshot(fileId,content,force=false){
  const previous=state.saveQueues.get(fileId)||Promise.resolve();
  const task=previous.catch(()=>{}).then(()=>performFileSave(fileId,content,force));
  state.saveQueues.set(fileId,task);
  task.finally(()=>{if(state.saveQueues.get(fileId)===task)state.saveQueues.delete(fileId);});
  return task;
}

async function waitForPendingSaves(){
  // A fila pode ganhar um novo item enquanto aguardamos o anterior.
  // Releia o mapa até ele realmente ficar vazio para não competir com save_all.
  for(let pass=0;pass<8&&state.saveQueues.size;pass+=1){
    await Promise.allSettled([...state.saveQueues.values()]);
  }
}

async function saveActiveFile(force=false){
  if(!state.active)return {synced:true,skipped:true};
  clearTimeout(state.saveTimer);
  const content=$('code-editor').value;
  state.active.content=content;
  return saveFileSnapshot(state.active.id,content,force);
}

function setActionStatus(message='',kind=''){
  const el=$('workspace-action-status');if(!el)return;
  el.textContent=String(message||'');el.dataset.kind=kind||'';
  clearTimeout(setActionStatus.timer);
  if(message)setActionStatus.timer=setTimeout(()=>{if(el.textContent===String(message))el.textContent='';},6500);
}
function updateWorkspaceActionAvailability(){
  const github=$('github-btn'),classroom=$('classroom-btn');
  if(github)github.title=state.repositoryUrl?'Abrir repositório configurado':'Configurar e abrir seu repositório no GitHub';
  if(classroom)classroom.title=state.classroomUrl?'Abrir Google Classroom desta disciplina':'Abrir Google Classroom';
}
function repoNameForSubject(){
  const slug=state.subject?.slug||'';
  return ({
    'introducao-programacao':'atividades-praticas-1ds',
    'programacao-front-end':'atividades-praticas',
    'programacao-desenvolvimento-sistemas':'atividades-praticas-3ds',
    'programacao-front-end-sub':'atividades-frontend-sub',
    'programacao-mobile-sub':'atividades-mobile-sub'
  })[slug]||'atividades-praticas';
}

async function saveAllBeforeExport(){
  clearTimeout(state.saveTimer);
  if(state.active){state.active.content=$('code-editor').value;persistLocalDraft(state.active,state.active.content);}
  await waitForPendingSaves();
  if(state.active){state.active.content=$('code-editor').value;persistLocalDraft(state.active,state.active.content);}
  const payload=state.files.filter(f=>f?.id).map(f=>({file_id:f.id,content:String(f.content??'')}));
  if(!payload.length)return {synced:false,files:state.files};
  try{
    const result=await callStudentFiles({action:'save_all',exercise_id:state.exercise.id,files:payload});
    for(const saved of result.files||[]){
      const file=state.files.find(f=>f.id===saved.id);if(!file)continue;
      file.revision=saved.revision;file.saved_at=saved.saved_at;
      const currentContent=state.active?.id===file.id?$('code-editor').value:String(file.content??'');
      if(currentContent===saved.content){file.content=saved.content;localStorage.removeItem(cacheKey(file));}
      else persistLocalDraft(file,currentContent);
      state.lastSavedContent.set(file.id,saved.content);
    }
    state.dirty=Boolean(state.active&&$('code-editor').value!==state.lastSavedContent.get(state.active.id));
    setSaveState(state.dirty?'Cópia sincronizada • há alterações mais novas aguardando':'Tudo salvo na nuvem',state.dirty?'saving':'ok');
    return {synced:!state.dirty,files:state.files};
  }catch(error){
    console.warn('[AGV] Exportação seguirá com a cópia local porque a sincronização falhou.',error);
    setSaveState('Cópia local preservada — download liberado','error');
    return {synced:false,files:state.files,error};
  }
}

async function downloadCurrentStudentFile(){
  const btn=$('download-current-btn');if(btn)btn.disabled=true;
  try{
    setActionStatus('Salvando antes de baixar…','saving');
    const result=await saveAllBeforeExport();
    const file=state.active||result.files?.[0];if(!file)throw new Error('Nenhum arquivo disponível.');
    const content=state.active?.id===file.id?$('code-editor').value:String(file.content??'');
    downloadTextFile(file.filename,content);
    setActionStatus(`${file.filename} baixado${result.synced?' e sincronizado':' com a cópia local'}.`,'ok');
  }catch(error){console.error(error);setActionStatus(error.message||'Falha ao baixar arquivo.','error');}
  finally{if(btn)btn.disabled=false;}
}

async function downloadStudentProjectZip(){
  const btn=$('download-zip-btn');if(btn)btn.disabled=true;
  try{
    setActionStatus('Salvando e preparando o ZIP…','saving');
    const result=await saveAllBeforeExport(),files=(result.files||[]).map(f=>({filename:f.filename,content:f.id===state.active?.id?$('code-editor').value:String(f.content??'')}));
    if(!files.length)throw new Error('Nenhum arquivo disponível para o ZIP.');
    const zip=createStoreZip(files);
    const n=String(state.exercise?.exercise_number||'').padStart(2,'0'),slug=String(state.subject?.slug||'atividade').replace(/[^a-z0-9-]+/gi,'-');
    downloadBlob(zip,`${slug}-exercicio-${n}-meus-codigos.zip`);
    setActionStatus(`ZIP criado com ${files.length} arquivo(s)${result.synced?' sincronizados':' da cópia local'}.`,'ok');
  }catch(error){console.error(error);setActionStatus(error.message||'Falha ao gerar ZIP.','error');}
  finally{if(btn)btn.disabled=false;}
}

function normalizeGithubRepo(input){
  try{
    const url=new URL(String(input||'').trim());if(url.protocol!=='https:'||url.hostname.toLowerCase()!=='github.com')return '';
    const parts=url.pathname.split('/').filter(Boolean);if(parts.length<2)return '';
    const owner=parts[0],repo=parts[1].replace(/\.git$/i,'');
    if(!/^[A-Za-z0-9_.-]+$/.test(owner)||!/^[A-Za-z0-9_.-]+$/.test(repo))return '';
    return `https://github.com/${owner}/${repo}`;
  }catch{return '';}
}
async function openStudentGithub(){
  const btn=$('github-btn');if(btn)btn.disabled=true;
  try{
    const saveResult=await saveAllBeforeExport();
    if(!state.repositoryUrl){
      const entered=window.prompt(`Cole o link do seu repositório ${repoNameForSubject()} no GitHub:`,state.legacyRepositoryUrl||`https://github.com/`);
      if(!entered){setActionStatus('GitHub não configurado.','');return;}
      const repository=normalizeGithubRepo(entered);if(!repository)throw new Error('Use um link no formato https://github.com/usuario/repositorio.');
      const {data:current,error:readError}=await supabase.from('student_delivery_settings').select('repository_url,repository_urls').eq('user_id',state.profile.id).maybeSingle();
      if(readError&&readError.code!=='PGRST116')throw readError;
      const repositories={...(current?.repository_urls&&typeof current.repository_urls==='object'?current.repository_urls:{}),[repositoryKey()]:repository};
      const {data,error}=await supabase.from('student_delivery_settings').upsert({user_id:state.profile.id,repository_url:current?.repository_url||repository,repository_urls:repositories,updated_at:new Date().toISOString()},{onConflict:'user_id'}).select('repository_url,repository_urls').single();
      if(error)throw error;state.repositoryUrl=data?.repository_urls?.[repositoryKey()]||repository;state.legacyRepositoryUrl=data?.repository_url||state.legacyRepositoryUrl||repository;updateWorkspaceActionAvailability();
    }
    window.open(state.repositoryUrl,'_blank','noopener,noreferrer');
    setActionStatus(saveResult.synced?'GitHub aberto em nova aba.':'GitHub aberto; atenção: a nuvem ainda não confirmou todas as alterações.',saveResult.synced?'ok':'error');
  }catch(error){console.error(error);setActionStatus(error.message||'Não foi possível abrir o GitHub.','error');}
  finally{if(btn)btn.disabled=false;}
}
async function openStudentClassroom(){
  const btn=$('classroom-btn');if(btn)btn.disabled=true;
  try{
    const saveResult=await saveAllBeforeExport();
    const url=state.classroomUrl||classroomFallback();
    if(!url)throw new Error('Classroom desta turma e disciplina ainda não foi configurado.');
    window.open(url,'_blank','noopener,noreferrer');
    setActionStatus(saveResult.synced?'Classroom da disciplina aberto.':'Classroom aberto; atenção: a nuvem ainda não confirmou todas as alterações.',saveResult.synced?'ok':'error');
  }catch(error){console.error(error);setActionStatus('Não foi possível abrir o Classroom.','error');}
  finally{if(btn)btn.disabled=false;}
}

let previewToken='';
let previewReady=false;
let pendingPreviewHtml='';
function ensurePreviewToken(){
  if(previewToken)return previewToken;
  const bytes=new Uint8Array(18);crypto.getRandomValues(bytes);
  previewToken=Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join('');
  return previewToken;
}
function previewPost(type,payload={}){
  const frame=$('preview-frame');if(!frame?.contentWindow)return false;
  frame.contentWindow.postMessage({type,token:ensurePreviewToken(),...payload},'*');
  return true;
}
function renderInIsolatedPreview(html){
  pendingPreviewHtml=String(html??'');
  if(previewReady)previewPost('agv-preview:render',{html:pendingPreviewHtml});
}
function clearIsolatedPreview(message='Preview aguardando execução.') {
  pendingPreviewHtml='';
  if(previewReady)previewPost('agv-preview:clear',{message});
}
window.addEventListener('message',event=>{
  const frame=$('preview-frame');if(!frame||event.source!==frame.contentWindow)return;
  const data=event.data||{};
  if(data.type==='agv-preview:ready'){previewPost('agv-preview:init');return;}
  if(data.token!==previewToken)return;
  if(data.type==='agv-preview:initialized'){previewReady=true;if(pendingPreviewHtml)previewPost('agv-preview:render',{html:pendingPreviewHtml});else previewPost('agv-preview:clear',{message:'Inicie a atividade supervisionada para executar o código.'});}
});

async function buildPreview(){
  setOutputOpen(true);
  const checkFiles=state.files.map(f=>({filename:f.filename,content:f.id===state.active?.id?$('code-editor').value:(f.content||''),language:f.language||''}));
  const security=await inspectCode(checkFiles);
  if(!security.ok){
    $('terminal-output').textContent=`Execução bloqueada pelo modo supervisionado.\n${security.findings.map(x=>`• ${x.filename}: ${x.label}`).join('\n')}`;
    showOutput('terminal');
    return;
  }
  const previewHtml=buildHtmlPreview(checkFiles);
  if(previewHtml!==null){
    renderInIsolatedPreview(previewHtml);
    showOutput('preview');
  }else if(state.active?.language==='markdown'){
    const escaped=$('code-editor').value.replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
    renderInIsolatedPreview(`<style>body{font:16px/1.6 system-ui;padding:24px;white-space:pre-wrap}</style>${escaped}`);
    showOutput('preview');
  }else if(state.active?.language==='python'){
    showOutput('terminal');
    runPython($('code-editor').value,state.active.filename||'main.py');
  }else{
    $('terminal-output').textContent='Use o preview para HTML/CSS/JS.';
    showOutput('terminal');
  }
}

function showOutput(which){
  setOutputOpen(true);
  document.querySelectorAll('.output-tab').forEach(b=>b.classList.toggle('active',b.dataset.output===which));
  $('reference-pane')?.classList.toggle('hidden',which!=='reference');
  $('preview-frame').classList.toggle('hidden',which!=='preview');
  $('terminal-pane').classList.toggle('hidden',which!=='terminal');
  document.getElementById('exercise-view')?.classList.toggle('reference-active',which==='reference');
}

async function loadHistory(){
  if(!state.active)return;
  const {data,error}=await supabase.from('student_file_history')
    .select('id,content,revision,created_at')
    .eq('student_file_id',state.active.id)
    .eq('student_id',state.profile.id)
    .order('revision',{ascending:false})
    .limit(30);
  const list=$('history-list'); list.innerHTML='';
  if(error){list.textContent='Não foi possível carregar o histórico.';return;}
  const current=document.createElement('div');
  current.className='history-item';
  current.innerHTML=`<div><strong>Revisão ${state.active.revision}</strong><small>Atual • ${formatDate(state.active.saved_at)}</small></div>`;
  list.appendChild(current);
  (data||[]).forEach(row=>{
    const item=document.createElement('div'); item.className='history-item';
    const info=document.createElement('div');
    info.innerHTML=`<strong>Revisão ${row.revision}</strong><small>${formatDate(row.created_at)}</small>`;
    const btn=document.createElement('button'); btn.type='button'; btn.className='button button-ghost button-small'; btn.textContent='Restaurar';
    btn.onclick=()=>{ $('code-editor').value=row.content||''; state.active.content=$('code-editor').value; invalidateServerEvaluation({schedule:true}); renderHighlight(); scheduleSave(); $('history-dialog').close(); };
    item.append(info,btn); list.appendChild(item);
  });
  if(!(data||[]).length){const p=document.createElement('p');p.className='muted';p.textContent='Ainda não há versões anteriores.';list.appendChild(p);}
}

function meaningfulFileContent(filename,content){
  const name=String(filename||'').toLowerCase();
  let value=String(content||'').trim();
  if(!value)return false;
  if(name.endsWith('.css')){
    value=value.replace(/\/\*[\s\S]*?\*\//g,'').trim();
    return /[^{}]+\{[^{}]*:[^{}]*\}/m.test(value);
  }
  if(/\.(?:js|mjs)$/i.test(name)){
    value=value.replace(/\/\*[\s\S]*?\*\//g,'').replace(/^\s*\/\/.*$/gm,'').trim();
    return /[A-Za-z_$][\w$]*|(?:if|for|while|function|const|let|var)\b/.test(value);
  }
  if(name.endsWith('.html')){
    value=value.replace(/<!--[\s\S]*?-->/g,'').trim();
    return /<(?:[a-z][\w-]*)(?:\s|>)/i.test(value);
  }
  if(name.endsWith('.py')){
    value=value.replace(/^\s*#.*$/gm,'').trim();
    return /[A-Za-z_]\w*|(?:print|input|if|for|while|def)\s*[(:]/.test(value);
  }
  return value.length>=2;
}

let liveGradeTimer=0;
let liveGradeSequence=0;
let lastLiveGradeAt=0;

function progressComparable(filename,value){
  const name=String(filename||'').toLowerCase();
  let source=String(value??'').replace(/\r\n?/g,'\n');
  if(name.endsWith('.html')||name.endsWith('.htm'))source=source.replace(/<!--[\s\S]*?-->/g,' ');
  if(name.endsWith('.css')||/\.(?:js|mjs|kt)$/i.test(name))source=source.replace(/\/\*[\s\S]*?\*\//g,' ').replace(/^\s*\/\/.*$/gm,' ');
  if(name.endsWith('.py'))source=source.replace(/^\s*#.*$/gm,' ');
  if(name.endsWith('.md'))source=source.replace(/^\s*<!--.*?-->\s*$/gm,' ');
  return source.replace(/\s+/g,'').trim();
}
function currentFileContent(file){
  return state.active?.id===file?.id&&$('code-editor')?String($('code-editor').value??''):String(file?.content??'');
}
function estimateCodeCompletion(){
  if(!state.files.length)return 0;
  const codeFiles=state.files.filter(file=>!/(?:^|\/)readme\.md$/i.test(String(file.filename||''))&&!/\.md$/i.test(String(file.filename||'')));
  const files=codeFiles.length?codeFiles:state.files;
  let total=0;
  for(const file of files){
    const student=progressComparable(file.filename,currentFileContent(file));
    const reference=progressComparable(file.filename,referenceForFile(file.filename,{fast:true})??'');
    let ratio=0;
    if(reference.length)ratio=Math.min(1,student.length/reference.length);
    else ratio=student.length?1:0;
    total+=ratio;
  }
  return Math.max(0,Math.min(100,Math.round((total/files.length)*100)));
}
function renderLiveMetrics(){
  const completion=estimateCodeCompletion(),completionEl=$('completion-score'),scoreEl=$('autograde-score'),errorEl=$('error-score');
  if(completionEl)completionEl.textContent=`${completion}%`;
  const hasGrade=Boolean(state.autoGrade?.graded_at);
  const score=Math.max(0,Math.min(100,Math.round(Number(state.autoGrade?.score||0))));
  if(scoreEl)scoreEl.textContent=hasGrade?`${score}%`:'—';
  if(errorEl)errorEl.textContent=hasGrade?`${100-score}%`:'—';
  const exerciseAuto=$('exercise-auto-score');if(exerciseAuto)exerciseAuto.textContent=hasGrade?`${score}%`:'0%';
  $('autograde-meter')?.setAttribute('data-completion',String(completion));
}
function invalidateServerEvaluation({schedule=false}={}){
  state.pendingServerEvaluation=null;
  state.autoGrade={...state.autoGrade,dirty:true,pending:Boolean(schedule&&getSupervisionSessionId())};
  renderAutoGrade();
  if(schedule)scheduleLiveAutograde();
}
function scheduleLiveAutograde(force=false){
  clearTimeout(liveGradeTimer);
  const sessionId=getSupervisionSessionId();
  if(!sessionId||!state.exercise||!state.active)return;
  const seq=++liveGradeSequence;
  state.autoGrade.pending=true;
  renderAutoGrade();
  const wait=force?250:1800;
  liveGradeTimer=setTimeout(async()=>{
    if(seq!==liveGradeSequence||!getSupervisionSessionId())return;
    const elapsed=Date.now()-lastLiveGradeAt;
    if(elapsed<3500){liveGradeTimer=setTimeout(()=>scheduleLiveAutograde(true),3500-elapsed);return;}
    lastLiveGradeAt=Date.now();
    await runAutoGrade({quiet:true,automatic:true});
  },wait);
}

function renderAutoGrade(data=state.autoGrade){
  const score=Math.max(0,Math.min(100,Math.round(Number(data?.score??state.autoGrade?.score??0))));
  const scoreEl=$('autograde-score'),label=$('autograde-label'),bar=$('autograde-bar'),box=$('validation-results');
  renderLiveMetrics();
  if(bar)bar.value=score;
  if(label){
    if(state.autoGrade?.pending)label.textContent='Recalculando acerto e erro automaticamente…';
    else if(state.autoGrade?.dirty)label.textContent='Código alterado • nova correção será feita após uma pausa na digitação';
    else if(!data?.graded_at&&!state.autoGrade?.graded_at)label.textContent='Digite seu código: conclusão atualiza na hora; acerto/erro após uma breve pausa';
    else label.textContent=score===100?'Solução correta':score>=70?'Boa aproximação; há ajustes':score>0?'Nota parcial':'Revise sua solução';
  }
  if(!box)return;
  box.classList.add('server-validation');box.replaceChildren();
  const intro=document.createElement('p');intro.className='muted';
  if(state.autoGrade?.dirty)intro.textContent='A conclusão é estimada localmente; acerto e erro estão sendo recalculados automaticamente no servidor.';
  else if((data?.reference_match||state.autoGrade?.reference_match)==='legacy')intro.textContent='Correção compatível: o servidor reconheceu que seus arquivos correspondem melhor a uma referência anterior oficial.';
  else if((data?.reference_match||state.autoGrade?.reference_match)==='mixed')intro.textContent='Correção compatível: seus arquivos correspondem a versões oficiais diferentes; cada arquivo está sendo comparado com a referência mais próxima.';
  else intro.textContent='Acerto e erro usam a referência oficial mais compatível no servidor; conclusão indica quanto da atividade já foi preenchido.';
  box.append(intro);
  const files=data?.files||state.autoGrade?.files||[];
  for(const file of files){
    const row=document.createElement('div');row.className=`validation-row ${Number(file.score||0)>=100?'ok':'pending'}`;
    const mark=document.createElement('span');mark.textContent=Number(file.score||0)>=100?'✓':'○';
    const name=document.createElement('span');
    const versionTag=file.matched_reference_current===false?' • ref. anterior':file.matched_reference_current===true?' • ref. atual':'';
    name.textContent=`${String(file.filename||file.reference_filename||'Arquivo')}${file.missing?' • ausente':file.empty?' • vazio':versionTag}`;
    if(file.matched_reference_label)name.title=String(file.matched_reference_label);
    const pct=document.createElement('span');pct.className='validation-points';pct.textContent=`${Math.round(Number(file.score||0))}%`;
    row.append(mark,name,pct);box.append(row);
  }
  renderWeekendSupport(data);
}

async function runAutoGrade({quiet=false,automatic=false}={}){
  try{
    await saveActiveFile(true);
    await waitForPendingSaves();
    const checkFiles=state.files.map(f=>({filename:f.filename,content:f.id===state.active?.id?$('code-editor').value:(f.content||'')}));
    const security=await inspectCode(checkFiles);if(!security.ok){state.autoGrade.pending=false;renderAutoGrade();return null;}
    const data=await callAutograde({action:'grade',exercise_id:state.exercise.id,session_id:getSupervisionSessionId()});
    state.autoGrade={...state.autoGrade,score:Number(data.score||0),graded_at:data.graded_at||new Date().toISOString(),dirty:false,pending:false,files:data.files||[],reference_match:data.reference_match||null,current_file_matches:Number(data.current_file_matches||0),legacy_file_matches:Number(data.legacy_file_matches||0)};
    renderAutoGrade(data);
    if(!quiet)setSaveState(`Autocorreção: ${Math.round(Number(data.score||0))}%`,'ok');
    return data;
  }catch(error){
    const messages={
      active_supervised_session_required:'A sessão supervisionada precisa estar ativa para autocorrigir.',
      reference_unavailable:'A referência oficial está temporariamente indisponível.',
      exercise_locked_by_teacher:'Este exercício está bloqueado pelo professor.',
      session_revoked:'Sua sessão foi encerrada. Entre novamente no portal.'
    };
    state.autoGrade.pending=false;renderAutoGrade();
    if(!automatic)setSaveState(messages[error.code]||error.message||'Não foi possível executar a autocorreção.','error');
    return null;
  }
}

async function completeExercise(){
  const evaluation=await runAutoGrade({quiet:true});
  if(!evaluation)return;
  const score=Math.round(Number(evaluation.score||0)),scoreBox=$('exercise-submit-score');
  const incomplete=Array.isArray(evaluation.incomplete_files)?evaluation.incomplete_files:[];
  if(incomplete.length){
    setSaveState(`Complete os três arquivos antes de entregar: ${incomplete.join(', ')}.`,'error');
    return;
  }
  if(scoreBox){
    scoreBox.replaceChildren();
    const strong=document.createElement('strong');strong.textContent=`${score}%`;
    const span=document.createElement('span');span.textContent=score===100?'Sua solução atingiu 100% na autocorreção.':'A entrega será aceita com nota parcial. Você poderá continuar corrigindo e entregar novamente.';
    scoreBox.append(strong,span);
  }
  const msg=$('exercise-submit-message');if(msg)msg.classList.add('hidden');
  $('exercise-submit-dialog')?.showModal();
}


async function loadEffectiveReleaseSupport(){
  const {data:membership}=await supabase.from('class_memberships').select('class_id').eq('user_id',state.profile.id).eq('active',true).order('is_primary',{ascending:false}).limit(1).maybeSingle();
  const classId=membership?.class_id||null;
  const [sr,cr]=await Promise.all([
    supabase.from('exercise_releases').select('allow_html_base,allow_css_base,allow_js_base,allow_extra_hints,allow_guided_support,enabled,updated_at').eq('student_id',state.profile.id).eq('exercise_id',state.exercise.id).order('updated_at',{ascending:false}).limit(1),
    classId?supabase.from('exercise_releases').select('allow_html_base,allow_css_base,allow_js_base,allow_extra_hints,allow_guided_support,enabled,updated_at').eq('class_id',classId).is('student_id',null).eq('exercise_id',state.exercise.id).order('updated_at',{ascending:false}).limit(1):Promise.resolve({data:[],error:null})
  ]);
  const student=(sr.data||[])[0]||null,classRelease=(cr.data||[])[0]||null;
  const merged={};
  for(const key of ['allow_html_base','allow_css_base','allow_js_base','allow_extra_hints','allow_guided_support']){
    merged[key]=student&&student[key]!==null&&student[key]!==undefined?!!student[key]:!!classRelease?.[key];
  }
  state.supportRelease=merged;
  return merged;
}

function setPedagogicalMode(mode,{persist=true,prompt=false}={}){
  const next=mode==='adapted'?'adapted':'conventional';
  state.adaptationMode=next;
  if(state.adaptation&&persist){
    void persistAdaptationMode(state.profile,state.adaptation,next,supabase);
    void logExperienceEvent(supabase,state.profile,{adaptation_key:state.adaptation.profileKey,subject_slug:state.subject?.slug||null,event_type:'mode_selected',mode:next,metadata:{source:'workspace',exercise_id:state.exercise?.id||null}});
  }
  applyAdaptationClasses(state.adaptation,next);
  if(state.adaptation){
    if(next==='adapted'&&Number(state.adaptation.recommendedFontSize||0)>0){
      applyCodeFontSize(Math.max(state.codeFontSize,Number(state.adaptation.recommendedFontSize)),{persist:false});
    }else if(next==='conventional'&&Number(state.adaptationBaseFontSize||0)>0){
      applyCodeFontSize(state.adaptationBaseFontSize,{persist:false});
    }
  }
  renderAdaptationBanner({profile:state.profile,exercise:state.exercise,adaptation:state.adaptation,mode:next,onModeChange:(value)=>setPedagogicalMode(value,{persist:true}),request:state.adaptationRequest,onRequest:submitAdaptationRequest});
  renderAdaptedGuidance({profile:state.profile,exercise:state.exercise,meta:state.meta||{},adaptation:state.adaptation,mode:next,remoteProgress:state.adaptationStepProgress,onStepProgress:(progress)=>{state.adaptationStepProgress={...progress};void persistAdaptationStepProgress(supabase,state.profile,state.exercise,state.adaptation,progress);}});
  if(prompt&&state.adaptation){
    maybePromptAdaptation({adaptation:state.adaptation,state:state.adaptationModeState,onChoose:(value)=>setPedagogicalMode(value,{persist:true})});
  }
}

async function submitAdaptationRequest(){
  const button=document.getElementById('adaptation-mode-toggle');
  if(button){button.disabled=true;button.textContent='Enviando...'}
  try{
    state.adaptationRequest=await requestPedagogicalAdaptation(supabase,state.profile);
    renderAdaptationBanner({profile:state.profile,exercise:state.exercise,adaptation:state.adaptation,mode:state.adaptationMode,onModeChange:(value)=>setPedagogicalMode(value,{persist:true}),request:state.adaptationRequest,onRequest:submitAdaptationRequest});
    setSaveState('Solicitação de outra experiência enviada ao professor.','ok');
  }catch(error){
    console.error(error);
    if(button){button.disabled=false;button.textContent='Solicitar outra experiência'}
    setSaveState('Não foi possível enviar a solicitação agora.','error');
  }
}

async function loadStudentSupport(){
  const [{data:exerciseAccommodations},{data:globalAccommodations},{data:progressRows}] = await Promise.all([
    supabase.from('student_accommodations').select('id,exercise_id,accommodation_type,config,reason,active,created_at,updated_at').eq('student_id',state.profile.id).eq('exercise_id',state.exercise.id).eq('active',true),
    supabase.from('student_accommodations').select('id,exercise_id,accommodation_type,config,reason,active,created_at,updated_at').eq('student_id',state.profile.id).is('exercise_id',null).eq('active',true),
    supabase.from('student_exercises').select('approval_status,teacher_feedback,teacher_feedback_at,auto_score,auto_score_at,submitted_score,submitted_at,attempts,status,completion_source').eq('student_id',state.profile.id).eq('exercise_id',state.exercise.id)
  ]);
  const support=[...(globalAccommodations||[]),...(exerciseAccommodations||[])];
  state.adaptation=resolvePedagogicalAdaptation(support);
  state.adaptationRequest=state.adaptation?null:await loadAdaptationRequest(supabase,state.profile);
  state.adaptationBaseFontSize=state.codeFontSize;
  const [remoteAdaptationMode,remoteStepProgress]=state.adaptation?await Promise.all([loadAdaptationPreference(supabase,state.profile,state.adaptation),loadAdaptationStepProgress(supabase,state.profile,state.exercise,state.adaptation)]):[null,null];
  state.adaptationStepProgress=remoteStepProgress;
  state.adaptationModeState=initializeAdaptationMode(state.profile,state.adaptation,remoteAdaptationMode);
  const release=state.supportRelease||{};
  const progress=(progressRows||[])[0]||{};
  state.autoGrade={...state.autoGrade,score:Number(progress.auto_score||0),graded_at:progress.auto_score_at||null,submitted_score:progress.submitted_score??null,submitted_at:progress.submitted_at||null,attempts:Number(progress.attempts||0),status:progress.status||'in_progress',completion_source:progress.completion_source||null,dirty:false,pending:false,files:state.autoGrade?.files||[]};
  renderAutoGrade();
  const guidance=document.getElementById('exercise-guidance');
  if(guidance){
    const fragment=document.createDocumentFragment();
    const addSupportNote=(title,message,kind='')=>{
      const note=document.createElement('div');
      note.className=`support-note${kind?` ${kind}`:''}`;
      const strong=document.createElement('strong');
      strong.textContent=String(title||'Apoio');
      const span=document.createElement('span');
      span.textContent=String(message||'');
      note.append(strong,span);
      fragment.appendChild(note);
    };
    const base=[release.allow_html_base?'HTML':null,release.allow_css_base?'CSS':null,release.allow_js_base?'JavaScript':null].filter(Boolean);
    if(base.length) addSupportNote('Arquivos-base liberados',`${base.join(', ')}. O starter é aplicado na primeira criação dos arquivos e nunca sobrescreve trabalho já salvo.`);
    if(release.allow_extra_hints) addSupportNote('Dicas extras liberadas','Seu professor habilitou apoio adicional para este exercício.');
    if(release.allow_guided_support) addSupportNote('Apoio guiado liberado','Você pode utilizar as orientações adicionais disponíveis neste exercício.');
    for(const a of support){
      if(a?.accommodation_type==='learning_mode'||a?.config?.adaptation_profile||a?.config?.profile_key)continue;
      const message=a?.config?.message||a.reason;
      if(message) addSupportNote(a.accommodation_type||'Apoio',message);
    }
    if(progress.teacher_feedback) addSupportNote('Feedback do professor',progress.teacher_feedback,'teacher');
    if(progress.approval_status==='approved') addSupportNote('Aprovado pelo professor','Este exercício recebeu aprovação manual.','approved');
    if(progress.approval_status==='changes_requested') addSupportNote('Ajustes solicitados','Revise o feedback acima e faça as alterações indicadas.','changes');
    if(fragment.childNodes.length) guidance.prepend(fragment);
  }
  setPedagogicalMode(state.adaptationModeState?.mode||'conventional',{persist:false,prompt:Boolean(state.adaptationModeState?.shouldPrompt)});
}
function setWorkspacePaused(paused,message=''){
  const editor=$('code-editor');
  if(editor) editor.readOnly=Boolean(paused||state.teacherEditing);
  ['run-preview-btn','mark-complete-btn','save-now-btn','workspace-save-now-btn','validate-btn'].forEach(id=>{const el=$(id);if(el)el.disabled=Boolean(paused);});
  document.querySelector('.workspace-panel')?.classList.toggle('supervision-paused',Boolean(paused));
  if(message)setSaveState(message,paused?'error':'ok');
}
function applyTeacherEdit(payload){
  const file=state.files.find(f=>f.filename===payload.filename); if(!file)return;
  file.content=String(payload.content||'');
  state.lastSavedContent.set(file.id,file.content);
  if(state.active?.id===file.id){
    state.remoteEdit=true;
    $('code-editor').value=file.content;
    renderHighlight();
    state.remoteEdit=false;
    invalidateServerEvaluation({schedule:true});
    setSaveState('Professor atualizou o código ao vivo','ok');
    runValidation();
  }
}
function setTeacherEditing(editing,name='Professor'){
  state.teacherEditing=editing;
  $('code-editor').readOnly=editing;
  document.querySelector('.workspace-panel')?.classList.toggle('teacher-editing',editing);
  if(editing)setSaveState(`${name} está editando ao vivo — aguarde um instante`,'saving');
  else setSaveState('Edição do professor finalizada','ok');
}
function editorSnapshot(){
  const editor=$('code-editor');
  return {
    filename:state.active?.filename||'',
    content:editor?.value||'',
    cursor_start:editor?.selectionStart||0,
    cursor_end:editor?.selectionEnd||0
  };
}

export async function mountWorkspace({profile,exercise,subject}){
  state.profile=profile;
  applyCodeFontSize(loadCodeFontSize(),{persist:false}); state.exercise=exercise; state.subject=subject;
  state.active=null; state.files=[]; state.saveQueues=new Map(); state.lastSavedContent=new Map(); state.remoteEdit=false; state.teacherEditing=false; state.supportRelease=null; state.adaptation=null; state.adaptationMode='conventional'; state.adaptationModeState=null;state.adaptationRequest=null; state.adaptationBaseFontSize=state.codeFontSize; state.adaptationStepProgress=null; applyAdaptationClasses(null,'conventional'); state.recoveredFiles=new Set(); state.referenceSelections=new Map(); state.referenceMatchCache=new Map();
  setToolsOpen(false);
  setOutputOpen(false);
  showRecoveryBanner(0);
  setWorkspacePaused(true,'Preparando atividade supervisionada...');
  setSaveState('Carregando seus arquivos...','saving');
  clearIsolatedPreview('Inicie a atividade supervisionada para executar o código.');
  await Promise.all([loadEffectiveReleaseSupport(),loadWorkspaceResources()]);
  await ensureFiles();
  const meta=state.meta||EXERCISE_MANIFEST_CURRENT[`${subject.slug}:${exercise.exercise_number}`]||EXERCISE_MANIFEST[`${subject.slug}:${exercise.exercise_number}`]||{};
  state.meta=meta;
  state.pendingServerEvaluation=null;
  state.autoGrade={score:0,graded_at:null,submitted_score:null,submitted_at:null,attempts:0,status:'in_progress',completion_source:null,dirty:false,pending:false,files:[],reference_match:null,current_file_matches:0,legacy_file_matches:0};
  state.symbolPaletteOpen=false;
  if($('mark-complete-btn'))$('mark-complete-btn').textContent='Entregar';
  if($('validate-btn'))$('validate-btn').textContent='Auto corrigir';
  const guidance=document.getElementById('exercise-guidance');
  if(guidance){
    const concepts=[...(meta.conceitos||[]),...(meta.retomadas||[]),...(meta.novos||[])].slice(0,8);
    guidance.replaceChildren();
    const objective=document.createElement('strong');
    objective.textContent=String(meta.objetivo||exercise.description||'Desenvolva a atividade proposta.');
    guidance.append(objective);
    if(concepts.length){
      const list=document.createElement('ul');
      concepts.forEach(concept=>{const item=document.createElement('li');item.textContent=String(concept);list.append(item);});
      guidance.append(list);
    }
    if(Array.isArray(meta.requisitosPublicos)&&meta.requisitosPublicos.length){
      const heading=document.createElement('strong');heading.textContent='Requisitos da entrega';guidance.append(heading);
      const list=document.createElement('ul');meta.requisitosPublicos.forEach(req=>{const item=document.createElement('li');item.textContent=String(req);list.append(item);});guidance.append(list);
    }
    const rawSteps=meta.passos;
    const stepGroups=Array.isArray(rawSteps)?[['Etapas',rawSteps]]:Object.entries(rawSteps||{});
    if(stepGroups.length){
      const details=document.createElement('details');details.className='guidance-steps';
      const summary=document.createElement('summary');summary.textContent='Passo a passo (opcional)';details.append(summary);
      for(const [groupName,steps] of stepGroups){
        if(!Array.isArray(steps)||!steps.length)continue;
        const heading=document.createElement('strong');heading.textContent=groupName==='Etapas'?'Etapas':String(groupName).toUpperCase();details.append(heading);
        const ol=document.createElement('ol');
        steps.forEach(step=>{const li=document.createElement('li'),title=document.createElement('b'),text=document.createElement('span');title.textContent=String(step?.titulo||'Etapa');text.textContent=String(step?.explicacao||step?.tarefa||'');li.append(title,text);ol.append(li);});
        details.append(ol);
      }
      guidance.append(details);
    }
  }
  renderFileTabs();
  await activateFile(state.files[0]?.id);
  state.referenceAvailable=state.referenceFiles.size>0;
  showOutput('reference');
  runValidation();
  await loadStudentSupport();
  if(state.adaptation?.profileKey){
    void logExperienceEvent(supabase,state.profile,{adaptation_key:state.adaptation.profileKey,subject_slug:state.subject?.slug||null,event_type:'experience_opened',mode:state.adaptationMode,metadata:{source:'workspace',exercise_id:state.exercise?.id||null,exercise_number:state.exercise?.exercise_number||null}});
  }
  initializeWeekendMode();
  await prepareSupervision({
    profile,exercise,
    getEditorState:editorSnapshot,
    onArmed:()=>{setWorkspacePaused(false,'Modo supervisionado ativo');flushRecoveredDrafts().catch(()=>{});renderLiveMetrics();scheduleLiveAutograde(true);},
    onPause:(paused)=>setWorkspacePaused(paused,paused?'Retorne à tela cheia para continuar.':'Modo supervisionado ativo'),
    onLock:(reason)=>setWorkspacePaused(true,reason||'Atividade bloqueada'),
    onTeacherEdit:applyTeacherEdit,
    onTeacherEditing:setTeacherEditing
  });
}

export async function unmountWorkspace(){
  const closingExperience=state.adaptation?.profileKey&&state.profile?.id?{profile:state.profile,adaptation_key:state.adaptation.profileKey,subject_slug:state.subject?.slug||null,mode:state.adaptationMode,exercise_id:state.exercise?.id||null,exercise_number:state.exercise?.exercise_number||null}:null;
  clearTimeout(state.saveTimer);clearTimeout(liveGradeTimer);clearTimeout(referenceRefreshTimer);clearTimeout(weekendSupportTimer);liveGradeSequence+=1;if(state.weekend?.timer){clearInterval(state.weekend.timer);state.weekend.timer=null;}clearWeekendFocus();
  try{await saveActiveFile(false);}catch(_){}
  // Barreira final: nenhuma gravação já enfileirada pode ficar solta ao trocar de tela.
  await waitForPendingSaves();
  await stopSupervision();
  if(closingExperience){
    await logExperienceEvent(supabase,closingExperience.profile,{adaptation_key:closingExperience.adaptation_key,subject_slug:closingExperience.subject_slug,event_type:'experience_closed',mode:closingExperience.mode,metadata:{source:'workspace',exercise_id:closingExperience.exercise_id,exercise_number:closingExperience.exercise_number}});
  }
  state.saveQueues=new Map();
  state.active=null;
  state.adaptation=null;state.adaptationMode='conventional';state.adaptationModeState=null;state.adaptationStepProgress=null;applyAdaptationClasses(null,'conventional');
  try{document.getElementById('adaptation-choice-dialog')?.close()}catch(_){}
}


function runValidation(){ renderAutoGrade(); }

$('code-editor')?.addEventListener('keydown',e=>tabInsert(e.currentTarget,e));
$('code-editor')?.addEventListener('beforeinput',e=>handleBeforeInput(e));
$('code-editor')?.addEventListener('paste',e=>handlePaste(e));
$('code-editor')?.addEventListener('drop',e=>handleDrop(e));
$('code-editor')?.addEventListener('input',(event)=>{
  if(!state.active||state.remoteEdit)return;
  state.active.content=$('code-editor').value;
  invalidateServerEvaluation({schedule:true});
  scheduleSave();
  renderHighlight();
  if((state.referenceSelections.get(normalizeFilename(state.active.filename))||'auto')==='auto')scheduleReferenceRefresh();
  scheduleWeekendSupport();
  handleEditorInput($('code-editor').value,event);
});
['keyup','click','select'].forEach(evt=>$('code-editor')?.addEventListener(evt,sendCursor));
$('code-editor')?.addEventListener('scroll',()=>{const e=$('code-editor'),p=$('code-highlight'),g=$('editor-line-numbers');if(p&&e){p.scrollTop=e.scrollTop;p.scrollLeft=e.scrollLeft;}if(g&&e)g.scrollTop=e.scrollTop;updateWeekendFocusOverlay();});
$('symbols-btn')?.addEventListener('click',()=>{state.symbolPaletteOpen=!state.symbolPaletteOpen;renderSymbolPalette();});
$('symbol-palette-close')?.addEventListener('click',()=>{state.symbolPaletteOpen=false;renderSymbolPalette();$('code-editor')?.focus();});
$('toggle-tools-btn')?.addEventListener('click',()=>setToolsOpen(!state.toolsOpen));
$('toggle-output-btn')?.addEventListener('click',()=>{
  if(state.outputOpen)setOutputOpen(false);
  else showOutput(state.referenceAvailable?'reference':'preview');
});
async function manualSaveFeedback(){
  const result=await saveActiveFile(true);
  if(result?.synced&&result?.current!==false)setActionStatus('Código salvo na nuvem.','ok');
  else if(result?.synced)setActionStatus('Revisão salva; alterações mais novas continuam sincronizando.','saving');
  else setActionStatus('Código preservado localmente; a nuvem não confirmou o salvamento.','error');
}
$('save-now-btn')?.addEventListener('click',manualSaveFeedback);
$('workspace-save-now-btn')?.addEventListener('click',manualSaveFeedback);
$('download-current-btn')?.addEventListener('click',downloadCurrentStudentFile);
$('download-zip-btn')?.addEventListener('click',downloadStudentProjectZip);
$('github-btn')?.addEventListener('click',openStudentGithub);
$('classroom-btn')?.addEventListener('click',openStudentClassroom);
$('font-decrease-btn')?.addEventListener('click',()=>adjustCodeFontSize(-CODE_FONT_STEP));
$('font-increase-btn')?.addEventListener('click',()=>adjustCodeFontSize(CODE_FONT_STEP));
$('run-preview-btn')?.addEventListener('click',async()=>{await buildPreview();runValidation();});
$('validate-btn')?.addEventListener('click',()=>runAutoGrade());
$('mark-complete-btn')?.addEventListener('click',completeExercise);
$('exercise-submit-close')?.addEventListener('click',()=>$('exercise-submit-dialog')?.close());
$('exercise-submit-form')?.addEventListener('submit',async event=>{
  event.preventDefault();
  const button=$('exercise-submit-button'),msg=$('exercise-submit-message');
  if(button){button.disabled=true;button.textContent='Entregando...';}
  if(msg)msg.classList.add('hidden');
  try{
    await saveActiveFile(true);await waitForPendingSaves();
    const data=await callAutograde({action:'submit',exercise_id:state.exercise.id,session_id:getSupervisionSessionId()});
    const score=Math.round(Number(data.score||0));
    const officialScore=Math.round(Number(data.official_score??score));
    const attempts=Number(data.attempts||state.autoGrade?.attempts||0);
    const completed=Boolean(data.completed);
    state.autoGrade={...state.autoGrade,score,graded_at:data.graded_at||new Date().toISOString(),submitted_score:officialScore,submitted_at:data.submitted_at||new Date().toISOString(),attempts,status:completed?'completed':'in_progress',completion_source:completed?'autograde_submission':'autograde_submission_partial',dirty:false,pending:false,files:data.files||[],reference_match:data.reference_match||null,current_file_matches:Number(data.current_file_matches||0),legacy_file_matches:Number(data.legacy_file_matches||0)};
    renderAutoGrade(data);
    $('exercise-state').textContent=completed?`Concluído • ${officialScore}%`:`Entrega parcial • ${officialScore}%`;
    const delivered=$('exercise-submitted-score');if(delivered)delivered.textContent=`${officialScore}%`;
    const attemptsEl=$('exercise-attempts');if(attemptsEl)attemptsEl.textContent=String(attempts);
    if(msg){
      if(completed)msg.textContent='Entrega registrada com 100%. Atividade concluída.';
      else if(score<officialScore)msg.textContent=`Tentativa registrada com ${score}%. Sua melhor nota entregue continua ${officialScore}%.`;
      else msg.textContent=`Entrega parcial registrada com ${officialScore}%. Continue ajustando; 100% conclui a atividade.`;
      msg.className='form-message ok';
    }
    setSaveState(completed?`Atividade concluída • ${officialScore}%`:`Entrega parcial • ${officialScore}%`,'ok');
    setTimeout(()=>$('exercise-submit-dialog')?.close(),1200);
  }catch(error){
    const messages={empty_activity:'Digite sua solução antes de entregar.',required_files_incomplete:'Preencha index.html, estilo.css e script.js antes de entregar. A nota pode ser parcial, mas os três arquivos precisam existir e ter conteúdo.',active_supervised_session_required:'A sessão supervisionada precisa estar ativa para entregar.',exercise_locked_by_teacher:'Este exercício está bloqueado pelo professor.',reference_unavailable:'A referência oficial está temporariamente indisponível.',session_revoked:'Sua sessão foi encerrada. Entre novamente no portal.'};
    const missing=Array.isArray(error?.details?.incomplete_files)?error.details.incomplete_files:[];
    if(msg){msg.textContent=(messages[error.code]||error.message||'Não foi possível registrar a entrega.')+(missing.length?` Arquivos pendentes: ${missing.join(', ')}.`:'');msg.className='form-message';}
  }finally{if(button){button.disabled=false;button.textContent='Entregar com esta nota';}}
});

$('history-btn')?.addEventListener('click',async()=>{await loadHistory();$('history-dialog').showModal();});
document.querySelectorAll('.output-tab').forEach(b=>b.addEventListener('click',()=>showOutput(b.dataset.output)));
$('reference-version-select')?.addEventListener('change',event=>{
  if(!state.active)return;
  state.referenceSelections.set(normalizeFilename(state.active.filename),String(event.currentTarget.value||'auto'));
  renderReference();
  renderLiveMetrics();
  renderWeekendSupport();
});
['copy','cut','dragstart','contextmenu'].forEach(type=>$('reference-code')?.addEventListener(type,event=>{event.preventDefault();}));
$('reference-code')?.addEventListener('keydown',event=>{if((event.ctrlKey||event.metaKey)&&['c','x','a'].includes(String(event.key||'').toLowerCase()))event.preventDefault();});
$('weekend-mode-toggle')?.addEventListener('click',toggleWeekendMode);
$('weekend-voucher-open')?.addEventListener('click',openWeekendRewardDialog);
$('weekend-reward-close')?.addEventListener('click',()=>{markWeekendRewardSeen();try{$('weekend-reward-dialog')?.close();}catch(_){}});
$('weekend-reward-confirm')?.addEventListener('click',()=>{markWeekendRewardSeen();try{$('weekend-reward-dialog')?.close();}catch(_){}});
$('weekend-reward-copy')?.addEventListener('click',async()=>{const btn=$('weekend-reward-copy'),code=state.weekend?.voucher?.code;if(!code)return;const ok=await copyWeekendVoucherCode(code);if(btn){const before=btn.textContent;btn.textContent=ok?'Código copiado':'Copie manualmente';setTimeout(()=>{btn.textContent=before||'Copiar código';},1600);}});
$('weekend-reward-dialog')?.addEventListener('close',markWeekendRewardSeen);

function protectActiveDraft(){
  if(!state.active)return;
  const content=$('code-editor')?.value??state.active.content??'';
  state.active.content=content;
  persistLocalDraft(state.active,content);
}
window.addEventListener('beforeunload',protectActiveDraft);
window.addEventListener('pagehide',()=>{protectActiveDraft();saveActiveFile(false).catch(()=>{});});
document.addEventListener('visibilitychange',()=>{
  if(document.visibilityState==='hidden'){protectActiveDraft();saveActiveFile(false).catch(()=>{});}
});
