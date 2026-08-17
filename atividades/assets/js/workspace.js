import { runPython } from './python-runtime.js';
import { EXERCISE_MANIFEST } from '../data/exercise-manifest.js';
import { validateExercise, renderValidation } from './validation.js';
import {
  prepareSupervision, stopSupervision, handleBeforeInput, handlePaste, handleDrop, handleEditorInput,
  sendEditorSnapshot, sendCursor, inspectCode, getSupervisionSessionId,
  callActivityProgress
} from './supervision.js';

import { supabase } from './supabase.js';

let state = {
  profile:null,
  exercise:null,
  subject:null,
  meta:null,
  files:[],
  active:null,
  dirty:false,
  saveTimer:null,
  lastSavedContent:new Map(),
  remoteEdit:false,
  teacherEditing:false,
  lastProgressTouchAt:0,
  supportRelease:null,
  recoveredFiles:new Set(),
  toolsOpen:false,
  outputOpen:false,
  pendingServerEvaluation:null,
};

const $ = (id)=>document.getElementById(id);

async function callStudentFiles(body){
  const {data,error}=await supabase.functions.invoke('student-files',{body});
  if(!error&&!data?.error)return data||{};
  let details=data||null;
  try{if(!details&&error?.context?.clone)details=await error.context.clone().json();}catch(_){}
  const e=new Error(details?.reason||details?.error||error?.message||'Falha ao salvar arquivo.');
  e.code=details?.error||'function_error';e.status=error?.context?.status||null;e.details=details;throw e;
}

const DEFAULTS = {
  'introducao-programacao': [{filename:'main.py',language:'python',content:'# Digite seu código Python aqui\n'}],
  'programacao-front-end': [
    {filename:'index.html',language:'html',content:'<!doctype html>\n<html lang="pt-BR">\n<head>\n  <meta charset="utf-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1">\n  <link rel="stylesheet" href="style.css">\n  <title>Exercício</title>\n</head>\n<body>\n\n  <script src="script.js"><\\/script>\n</body>\n</html>\n'},
    {filename:'style.css',language:'css',content:'/* Escreva seu CSS aqui */\n'},
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
  if(!file)return;
  try{
    localStorage.setItem(cacheKey(file),JSON.stringify({
      v:2,
      content:String(content??''),
      savedAt:Date.now(),
      remoteRevision:Number(file.revision||0)
    }));
  }catch(_){}
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
  if(btn){btn.setAttribute('aria-expanded',String(state.outputOpen));btn.textContent=state.outputOpen?'Ocultar saída':'Preview';}
}

function escapeCode(value){
  return String(value??'').replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
}

function tokenClass(token,language){
  const t=String(token);
  if(/^\/\//.test(t)||/^\/\*/.test(t)||/^#/.test(t))return 'tok-comment';
  if(/^['"`]/.test(t))return 'tok-string';
  if(/^\d/.test(t))return 'tok-number';
  if(language==='html'&&/^</.test(t))return 'tok-tag';
  return 'tok-keyword';
}

function highlightCode(code,language='text'){
  const lang=String(language||'').toLowerCase();
  const source=String(code??'');
  if(lang==='html'){
    const rx=/<!--[\s\S]*?-->|<\/?[A-Za-z][^>]*>/g;
    let out='',last=0,m;
    while((m=rx.exec(source))){
      out+=escapeCode(source.slice(last,m.index));
      const cls=m[0].startsWith('<!--')?'tok-comment':'tok-tag';
      out+=`<span class="${cls}">${escapeCode(m[0])}</span>`;
      last=rx.lastIndex;
    }
    return out+escapeCode(source.slice(last));
  }
  let rx=null;
  if(lang==='javascript'||lang==='js'){
    rx=/\/\/[^\n]*|\/\*[\s\S]*?\*\/|'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|`(?:\\.|[^`\\])*`|\b(?:const|let|var|function|if|else|for|while|return|class|new|async|await|true|false|null|undefined|document|window|addEventListener|querySelector)\b|\b\d+(?:\.\d+)?\b/g;
  }else if(lang==='python'){
    rx=/#[^\n]*|'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|\b(?:def|if|elif|else|for|while|return|import|from|as|class|True|False|None|and|or|not|in|print|input|range|len)\b|\b\d+(?:\.\d+)?\b/g;
  }else if(lang==='css'){
    rx=/\/\*[\s\S]*?\*\/|'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|\b(?:display|position|color|background|margin|padding|width|height|grid|flex|gap|border|font|transform|transition|align-items|justify-content)\b|\b\d+(?:\.\d+)?(?:px|rem|em|%|vh|vw|s|ms)?\b/g;
  }
  if(!rx)return escapeCode(source);
  let out='',last=0,m;
  while((m=rx.exec(source))){
    out+=escapeCode(source.slice(last,m.index));
    out+=`<span class="${tokenClass(m[0],lang)}">${escapeCode(m[0])}</span>`;
    last=rx.lastIndex;
  }
  return out+escapeCode(source.slice(last));
}

let highlightFrame=0;
function renderHighlight(){
  cancelAnimationFrame(highlightFrame);
  highlightFrame=requestAnimationFrame(()=>{
    const editor=$('code-editor'),pre=$('code-highlight');
    if(!editor||!pre)return;
    pre.innerHTML=highlightCode(editor.value,state.active?.language||'text')+'\n';
    pre.scrollTop=editor.scrollTop;
    pre.scrollLeft=editor.scrollLeft;
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
  const meta=EXERCISE_MANIFEST[key] || null;
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
  if(!remote.length){
    const seeds=defaultFiles(state.subject.slug).map(f=>{
      const temp={filename:f.filename,revision:0};
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
    remote=data.files||[];
  }
  state.files=remote;
  state.recoveredFiles=new Set();
  remote.forEach(file=>{
    const serverContent=file.content||'';
    state.lastSavedContent.set(file.id,serverContent);
    const draft=readCachedDraft(file);
    if(!draft)return;
    const remoteAt=Date.parse(file.saved_at||0)||0;
    const newer=Boolean(draft.savedAt&&draft.savedAt>remoteAt+250);
    if(newer&&draft.content!==serverContent){
      file.content=draft.content;
      state.recoveredFiles.add(file.id);
    }else if(draft.savedAt&&draft.content===serverContent){
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
  persistLocalDraft(state.active,state.active.content);
  setSaveState('Alterações locais protegidas — sincronizando','saving');
  clearTimeout(state.saveTimer);
  const fileId=state.active.id;
  const content=$('code-editor').value;
  state.saveTimer=setTimeout(()=>saveFileSnapshot(fileId,content,false),1200);
}

async function saveFileSnapshot(fileId,content,force=false){
  const file=state.files.find(f=>f.id===fileId); if(!file)return;
  if(!force && state.lastSavedContent.get(fileId)===content){
    if(state.active?.id===fileId){state.dirty=false;setSaveState(`Tudo salvo • revisão ${file.revision||1}`,'ok');}
    return;
  }
  persistLocalDraft(file,content);
  if(state.active?.id===fileId)setSaveState('Salvando na nuvem...','saving');
  let data;
  try{
    const result=await callStudentFiles({action:'save',exercise_id:state.exercise.id,file_id:fileId,content});
    data=result.file;
  }catch(error){
    if(error.status===423){
      setWorkspacePaused(true,error.details?.reason||'Atividade bloqueada pelo professor.');
    }
    if(state.active?.id===fileId){
      if(error.code==='malicious_code_rejected'){
        setSaveState(`Código não salvo: padrão bloqueado (${(error.details?.patterns||[]).join(', ')||'segurança'}). O evento foi registrado para o professor.`,'error');
      }else{
        setSaveState('Sem conexão ou atividade bloqueada: cópia local preservada','error');
      }
    }
    return;
  }
  file.revision=data.revision; file.saved_at=data.saved_at;
  if(file.content===content || state.active?.id!==fileId) file.content=data.content;
  state.lastSavedContent.set(fileId,data.content);
  localStorage.removeItem(cacheKey(file));
  if(state.active?.id===fileId){
    state.dirty=($('code-editor').value!==data.content);
    setSaveState(`Salvo • revisão ${data.revision} • ${formatDate(data.saved_at)}`,'ok');
  }
  if(Date.now()-state.lastProgressTouchAt>10000){
    state.lastProgressTouchAt=Date.now();
    callActivityProgress({action:'touch',exercise_id:state.exercise.id}).catch(()=>{});
  }
}

async function saveActiveFile(force=false){
  if(!state.active)return;
  clearTimeout(state.saveTimer);
  const content=$('code-editor').value;
  state.active.content=content;
  await saveFileSnapshot(state.active.id,content,force);
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
  const checkFiles=state.files.map(f=>({filename:f.filename,content:f.id===state.active?.id?$('code-editor').value:(f.content||'')}));
  const security=await inspectCode(checkFiles);
  if(!security.ok){
    $('terminal-output').textContent=`Execução bloqueada pelo modo supervisionado.\n${security.findings.map(x=>`• ${x.filename}: ${x.label}`).join('\n')}`;
    showOutput('terminal');
    return;
  }
  const map=Object.fromEntries(checkFiles.map(f=>[f.filename,f.content]));
  if(map['index.html']!=null){
    let html=map['index.html'];
    const escapeRx=value=>String(value).replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
    for(const [filename,content] of Object.entries(map)){
      if(/\.css$/i.test(filename)){
        const name=escapeRx(filename);
        html=html.replace(new RegExp(`<link[^>]+href=[\"'](?:\./)?${name}[\"'][^>]*>`,'ig'),`<style>${content||''}</style>`);
      }
      if(/\.(?:js|mjs)$/i.test(filename)){
        const name=escapeRx(filename),safe=String(content||'').replace(/<\/script/gi,'<\\/script');
        html=html.replace(new RegExp(`<script[^>]+src=[\"'](?:\./)?${name}[\"'][^>]*><\/script>`,'ig'),`<script>${safe}<\/script>`);
      }
    }
    renderInIsolatedPreview(html);
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
  $('preview-frame').classList.toggle('hidden',which!=='preview');
  $('terminal-pane').classList.toggle('hidden',which!=='terminal');
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
    btn.onclick=()=>{ $('code-editor').value=row.content||''; state.active.content=$('code-editor').value; invalidateServerEvaluation(); renderHighlight(); scheduleSave(); $('history-dialog').close(); };
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

function isPrivateServerValidation(meta=state.meta){
  return meta?.avaliacao?.autoridade==='backend-privado';
}

function normalizeGithubRepositoryUrl(input){
  try{
    const url=new URL(String(input||'').trim());
    if(url.protocol!=='https:'||url.hostname.toLowerCase()!=='github.com')return '';
    const parts=url.pathname.split('/').filter(Boolean);
    if(parts.length<2)return '';
    const owner=parts[0],repo=parts[1].replace(/\.git$/i,'');
    if(!/^[A-Za-z0-9_.-]+$/.test(owner)||!/^[A-Za-z0-9_.-]+$/.test(repo))return '';
    return `https://github.com/${owner}/${repo}`;
  }catch{return ''}
}

function invalidateServerEvaluation(){
  if(!state.pendingServerEvaluation)return;
  state.pendingServerEvaluation=null;
  if(isPrivateServerValidation())runValidation();
}

function renderServerEvaluation(data){
  const box=$('validation-results');if(!box)return;
  box.classList.add('server-validation');
  box.replaceChildren();
  const summary=document.createElement('div');summary.className='validation-summary';
  const strong=document.createElement('strong');strong.textContent=`${Math.round(Number(data?.score||0))}% na correção oficial`;
  const span=document.createElement('span');span.textContent=`mínimo para entrega: ${Number(data?.minimum_score||state.meta?.avaliacao?.minimoEntrega||80)}%`;
  summary.append(strong,span);box.append(summary);
  for(const criterion of (data?.criteria||[])){
    const row=document.createElement('div');row.className=`validation-row ${criterion.ok?'ok':'pending'}`;
    const mark=document.createElement('span');mark.textContent=criterion.ok?'✓':'○';
    const label=document.createElement('span');label.textContent=String(criterion.label||'Critério');
    const points=document.createElement('span');points.className='validation-points';points.textContent=`${Number(criterion.points||0)}/${Number(criterion.max_points||0)} pts`;
    row.append(mark,label,points);box.append(row);
  }
}

async function runServerEvaluation({quiet=false}={}){
  await saveActiveFile(true);
  const checkFiles=state.files.map(f=>({filename:f.filename,content:f.id===state.active?.id?$('code-editor').value:(f.content||'')}));
  const security=await inspectCode(checkFiles);if(!security.ok)return null;
  try{
    const data=await callActivityProgress({action:'evaluate',exercise_id:state.exercise.id,session_id:getSupervisionSessionId()});
    state.pendingServerEvaluation=data;renderServerEvaluation(data);
    if(!quiet)setSaveState(`Correção oficial: ${Math.round(Number(data.score||0))}%`,'ok');
    return data;
  }catch(error){
    const messages={
      private_validation_unavailable:'A correção privada ainda não foi ativada no servidor.',
      private_validation_not_configured:'Este exercício ainda não possui corretor privado configurado.',
      active_supervised_session_required:'A sessão supervisionada precisa estar ativa para corrigir.',
      session_revoked:'Sua sessão foi encerrada. Entre novamente no portal.'
    };
    setSaveState(messages[error.code]||error.message||'Não foi possível executar a correção oficial.','error');
    return null;
  }
}

function validationIsFullySupported(meta){
  const validation=meta?.validacao||{};
  const keys=Object.keys(validation);
  if(!keys.length)return false;
  const harmless=new Set(['tipo','flexibilidadeAluno','requisitosRecomendados','politica','aceitarEquivalencias']);
  const supported=new Set(['minChars','regras','htmlSemantico','htmlEstrutura']);
  const substantive=keys.filter(k=>!harmless.has(k));
  return substantive.length>0&&substantive.every(k=>supported.has(k));
}

async function completeExercise(){
  const currentValue=$('code-editor').value;
  const expected=(state.meta?.files||[]).map(f=>f.filename);
  const fileContent=name=>{const f=state.files.find(x=>x.filename===name);return f?(f.id===state.active?.id?currentValue:(f.content||'')):'';};
  const missing=expected.filter(name=>!meaningfulFileContent(name,fileContent(name)));
  if(missing.length){
    setSaveState(`Complete os arquivos antes de entregar: ${missing.join(', ')}`,'error');
    return;
  }
  if(isPrivateServerValidation()){
    const evaluation=await runServerEvaluation({quiet:true});
    if(!evaluation)return;
    const minimum=Number(evaluation.minimum_score||state.meta?.avaliacao?.minimoEntrega||80);
    if(Number(evaluation.score||0)<minimum){
      setSaveState(`Correção oficial: ${Math.round(Number(evaluation.score||0))}%. Você precisa de pelo menos ${minimum}% para entregar.`,'error');
      return;
    }
    const scoreBox=$('exercise-submit-score');
    if(scoreBox){scoreBox.replaceChildren();const strong=document.createElement('strong');strong.textContent=`${Math.round(Number(evaluation.score||0))}%`;const span=document.createElement('span');span.textContent=Number(evaluation.score||0)>=100?'Todos os critérios automáticos foram atendidos.':'Entrega permitida com pendências. Você pode melhorar e enviar novamente depois.';scoreBox.append(strong,span);}
    $('exercise-submit-message')?.classList.add('hidden');
    const repoInput=$('exercise-repository-url');
    if(repoInput&&!repoInput.value){
      try{repoInput.value=localStorage.getItem(`agv:exercise-repository:${state.exercise.id}`)||'';}catch(_){}
    }
    $('exercise-submit-dialog')?.showModal();
    return;
  }
  const results=validateExercise(state.meta||{},state.files,state.active,currentValue);
  runValidation();
  if(!validationIsFullySupported(state.meta)){
    await saveActiveFile(true);
    setSaveState('Código salvo. A conclusão automática deste exercício ainda está em migração; o professor fará a validação.','error');
    return;
  }
  if(!results.length){
    await saveActiveFile(true);
    setSaveState('Código salvo. Este exercício ainda não possui validação automática segura.','error');
    return;
  }
  if(results.some(r=>!r.ok)){
    setSaveState('Ainda há critérios pendentes na validação automática.','error');
    return;
  }
  const checkFiles=state.files.map(f=>({filename:f.filename,content:f.id===state.active?.id?$('code-editor').value:(f.content||'')}));
  const security=await inspectCode(checkFiles);
  if(!security.ok)return;
  await saveActiveFile(true);
  try{
    await callActivityProgress({action:'complete',exercise_id:state.exercise.id,session_id:getSupervisionSessionId()});
    $('exercise-state').textContent='Concluído';
    setSaveState('Exercício concluído e sincronizado','ok');
  }catch(error){
    const messages={activity_too_fast:'A atividade foi iniciada há poucos segundos. Continue trabalhando antes de concluir.',empty_activity:'Escreva sua solução antes de concluir.',active_supervised_session_required:'A sessão supervisionada precisa estar ativa para concluir.',exercise_locked_by_teacher:'Este exercício foi bloqueado pelo professor.',server_validation_required:'Use a correção oficial e registre o link do GitHub para entregar.'};
    setSaveState(messages[error.code]||error.message||'Não foi possível concluir.','error');
  }
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

async function loadStudentSupport(){
  const [{data:accommodations},{data:progressRows}] = await Promise.all([
    supabase.from('student_accommodations').select('id,accommodation_type,config,reason,active').eq('student_id',state.profile.id).eq('exercise_id',state.exercise.id).eq('active',true),
    supabase.from('student_exercises').select('approval_status,teacher_feedback,teacher_feedback_at').eq('student_id',state.profile.id).eq('exercise_id',state.exercise.id)
  ]);
  const support=[...(accommodations||[])];
  const release=state.supportRelease||{};
  const progress=(progressRows||[])[0]||{};
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
      const message=a?.config?.message||a.reason;
      if(message) addSupportNote(a.accommodation_type||'Apoio',message);
    }
    if(progress.teacher_feedback) addSupportNote('Feedback do professor',progress.teacher_feedback,'teacher');
    if(progress.approval_status==='approved') addSupportNote('Aprovado pelo professor','Este exercício recebeu aprovação manual.','approved');
    if(progress.approval_status==='changes_requested') addSupportNote('Ajustes solicitados','Revise o feedback acima e faça as alterações indicadas.','changes');
    if(fragment.childNodes.length) guidance.prepend(fragment);
  }
}
function setWorkspacePaused(paused,message=''){
  const editor=$('code-editor');
  if(editor) editor.readOnly=Boolean(paused||state.teacherEditing);
  ['run-preview-btn','mark-complete-btn','save-now-btn','validate-btn'].forEach(id=>{const el=$(id);if(el)el.disabled=Boolean(paused);});
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
    invalidateServerEvaluation();
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
  state.profile=profile; state.exercise=exercise; state.subject=subject;
  state.active=null; state.files=[]; state.lastSavedContent=new Map(); state.remoteEdit=false; state.teacherEditing=false; state.supportRelease=null; state.recoveredFiles=new Set();
  setToolsOpen(false);
  setOutputOpen(false);
  showRecoveryBanner(0);
  setWorkspacePaused(true,'Preparando atividade supervisionada...');
  setSaveState('Carregando seus arquivos...','saving');
  clearIsolatedPreview('Inicie a atividade supervisionada para executar o código.');
  await loadEffectiveReleaseSupport();
  await ensureFiles();
  const meta=state.meta||EXERCISE_MANIFEST[`${subject.slug}:${exercise.exercise_number}`]||{};
  state.meta=meta;
  state.pendingServerEvaluation=null;
  if($('mark-complete-btn'))$('mark-complete-btn').textContent=isPrivateServerValidation(meta)?'Entregar':'Concluir';
  if($('validate-btn'))$('validate-btn').textContent=isPrivateServerValidation(meta)?'Corrigir agora':'Validar exercício';
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
  runValidation();
  await loadStudentSupport();
  await prepareSupervision({
    profile,exercise,
    getEditorState:editorSnapshot,
    onArmed:()=>{setWorkspacePaused(false,'Modo supervisionado ativo');flushRecoveredDrafts().catch(()=>{});},
    onPause:(paused)=>setWorkspacePaused(paused,paused?'Retorne à tela cheia para continuar.':'Modo supervisionado ativo'),
    onLock:(reason)=>setWorkspacePaused(true,reason||'Atividade bloqueada'),
    onTeacherEdit:applyTeacherEdit,
    onTeacherEditing:setTeacherEditing
  });
}

export async function unmountWorkspace(){
  clearTimeout(state.saveTimer);
  try{await saveActiveFile(false);}catch(_){}
  await stopSupervision();
  state.active=null;
}


function runValidation(){
  const box=document.getElementById('validation-results'); if(!box)return;
  if(isPrivateServerValidation()){
    if(state.pendingServerEvaluation){renderServerEvaluation(state.pendingServerEvaluation);return;}
    box.classList.add('server-validation');box.replaceChildren();
    const p=document.createElement('p');p.className='muted';p.textContent='Correção oficial no servidor. Clique em “Corrigir agora” para receber o percentual sem baixar o gabarito para o navegador.';box.append(p);return;
  }
  box.classList.remove('server-validation');
  const results=validateExercise(state.meta||{},state.files,state.active,$('code-editor').value);
  box.innerHTML=renderValidation(results);
}
$('code-editor')?.addEventListener('keydown',e=>tabInsert(e.currentTarget,e));
$('code-editor')?.addEventListener('beforeinput',e=>handleBeforeInput(e));
$('code-editor')?.addEventListener('paste',e=>handlePaste(e));
$('code-editor')?.addEventListener('drop',e=>handleDrop(e));
$('code-editor')?.addEventListener('input',(event)=>{
  if(!state.active||state.remoteEdit)return;
  state.active.content=$('code-editor').value;
  invalidateServerEvaluation();
  scheduleSave();
  renderHighlight();
  handleEditorInput($('code-editor').value,event);
});
['keyup','click','select'].forEach(evt=>$('code-editor')?.addEventListener(evt,sendCursor));
$('code-editor')?.addEventListener('scroll',()=>{const e=$('code-editor'),p=$('code-highlight');if(p&&e){p.scrollTop=e.scrollTop;p.scrollLeft=e.scrollLeft;}});
$('toggle-tools-btn')?.addEventListener('click',()=>setToolsOpen(!state.toolsOpen));
$('toggle-output-btn')?.addEventListener('click',()=>setOutputOpen(!state.outputOpen));
$('save-now-btn')?.addEventListener('click',()=>saveActiveFile(true));
$('run-preview-btn')?.addEventListener('click',async()=>{await buildPreview();runValidation();});
$('validate-btn')?.addEventListener('click',()=>{if(isPrivateServerValidation())runServerEvaluation();else runValidation();});
$('mark-complete-btn')?.addEventListener('click',completeExercise);
$('exercise-submit-close')?.addEventListener('click',()=>$('exercise-submit-dialog')?.close());
$('exercise-submit-form')?.addEventListener('submit',async event=>{
  event.preventDefault();
  const button=$('exercise-submit-button'),msg=$('exercise-submit-message'),repoInput=$('exercise-repository-url');
  const repo=normalizeGithubRepositoryUrl(repoInput?.value||'');
  msg?.classList.add('hidden');
  if(!repo){
    if(msg){msg.textContent='Cole o link do repositório no formato https://github.com/usuario/repositorio.';msg.className='form-message';}
    repoInput?.focus();
    return;
  }
  if(repoInput)repoInput.value=repo;
  if(button){button.disabled=true;button.textContent='Enviando...';}
  try{
    await saveActiveFile(true);
    const data=await callActivityProgress({action:'submit',exercise_id:state.exercise.id,session_id:getSupervisionSessionId(),repository_url:repo});
    state.pendingServerEvaluation=data;renderServerEvaluation(data);
    try{localStorage.setItem(`agv:exercise-repository:${state.exercise.id}`,repo);}catch(_){}
    const score=Math.round(Number(data.score||0)),best=Math.round(Number(data.best_score??score));
    const completed=data.completed===true||data.delivery_state==='completed'||best>=100;
    $('exercise-state').textContent=completed?`Concluído • ${best}%`:`Entregue com pendências • ${score}%`;
    if(msg){
      msg.textContent=completed
        ? `Entrega concluída com ${score}%. O link do GitHub e a evidência dos arquivos foram registrados.`
        : `Entrega registrada com ${score}%. A atividade continua em andamento: você pode corrigir e enviar novamente para melhorar o resultado.`;
      msg.className='form-message ok';
    }
    setSaveState(completed?`Atividade concluída • ${best}%`:`Entrega registrada com pendências • ${score}%`,'ok');
    setTimeout(()=>$('exercise-submit-dialog')?.close(),completed?1000:1500);
  }catch(error){
    const details=error?.details||{};
    const messages={
      invalid_repository_url:'Informe o link do repositório no formato https://github.com/usuario/repositorio.',
      incomplete_files:`Ainda há arquivos obrigatórios incompletos${Array.isArray(details.missing_files)&&details.missing_files.length?`: ${details.missing_files.join(', ')}`:'.'}`,
      score_below_minimum:`A correção ficou abaixo de ${Number(details.minimum_score||80)}%. Continue ajustando antes de entregar.`,
      server_validation_required:'Esta atividade exige correção privada no servidor.',
      private_validation_unavailable:'O corretor privado ainda não está ativo no servidor.',
      private_validation_not_configured:'O corretor privado deste exercício ainda não foi configurado.',
      session_guard_unavailable:'A validação de sessão do servidor ainda não está disponível. Avise o professor.',
      session_claim_missing:'Sua sessão precisa ser renovada. Saia e entre novamente no portal.',
      session_revoked:'Seu acesso foi encerrado. Entre novamente no portal.',
      exercise_locked_by_teacher:'O professor bloqueou ou encerrou o prazo desta atividade.',
      activity_locked:'Esta atividade está temporariamente bloqueada.'
    };
    if(msg){msg.textContent=messages[error.code]||error.message||'Não foi possível registrar a entrega.';msg.className='form-message';}
  }finally{if(button){button.disabled=false;button.textContent='Entregar atividade';}}
});
$('history-btn')?.addEventListener('click',async()=>{await loadHistory();$('history-dialog').showModal();});
document.querySelectorAll('.output-tab').forEach(b=>b.addEventListener('click',()=>showOutput(b.dataset.output)));
window.addEventListener('beforeunload',()=>{if(state.active&&state.dirty)persistLocalDraft(state.active,$('code-editor').value);});
