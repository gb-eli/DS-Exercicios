import { runPython } from './python-runtime.js';
import { EXERCISE_MANIFEST } from '../data/exercise-manifest.js';
import { validateExercise, renderValidation } from './validation.js';
import {
  prepareSupervision, stopSupervision, handlePaste, handleDrop, handleEditorInput,
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

function setSaveState(text,cls=''){
  const el=$('save-state'); if(!el)return;
  el.textContent=text; el.className=`save-state ${cls}`.trim();
}

function tabInsert(textarea,event){
  if(event.key!=='Tab')return;
  event.preventDefault();
  const start=textarea.selectionStart,end=textarea.selectionEnd;
  textarea.value=textarea.value.slice(0,start)+'  '+textarea.value.slice(end);
  textarea.selectionStart=textarea.selectionEnd=start+2;
  textarea.dispatchEvent(new Event('input',{bubbles:true}));
}

function defaultFiles(subjectSlug){
  const key=`${subjectSlug}:${state.exercise.exercise_number}`;
  const meta=EXERCISE_MANIFEST[key] || null;
  state.meta=meta;
  const defs=(meta?.files||[]).length ? meta.files : (DEFAULTS[subjectSlug]||[]);
  return defs.map(f=>({filename:f.filename,language:f.language||'text',content:''}));
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
    const seeds=defaultFiles(state.subject.slug).map(f=>({
      student_id:state.profile.id,exercise_id:state.exercise.id,
      filename:f.filename,language:f.language,content:localStorage.getItem(`epds:${state.profile.id}:${state.exercise.id}:${f.filename}`) ?? f.content
    }));
    const data=await callStudentFiles({action:'ensure',exercise_id:state.exercise.id,files:seeds.map(({filename,language,content})=>({filename,language,content}))});
    remote=data.files||[];
  }
  state.files=remote;
  remote.forEach(f=>state.lastSavedContent.set(f.id,f.content||''));
}

function renderFileTabs(){
  const box=$('file-tabs'); box.innerHTML='';
  state.files.forEach(file=>{
    const b=document.createElement('button');
    b.type='button'; b.className='file-tab'+(state.active?.id===file.id?' active':'');
    b.textContent=file.filename;
    b.onclick=async()=>activateFile(file.id);
    box.appendChild(b);
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
  setSaveState('Alterações locais — salvando...','saving');
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
  localStorage.setItem(cacheKey(file),content);
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

async function buildPreview(){
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
    html=html.replace(/<link[^>]+href=["']style\.css["'][^>]*>/i,`<style>${map['style.css']||''}</style>`);
    html=html.replace(/<script[^>]+src=["']script\.js["'][^>]*><\/script>/i,`<script>${(map['script.js']||'').replace(/<\/script/gi,'<\\/script')}<\\/script>`);
    $('preview-frame').srcdoc=html;
    showOutput('preview');
  }else if(state.active?.language==='markdown'){
    const escaped=$('code-editor').value.replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
    $('preview-frame').srcdoc=`<style>body{font:16px/1.6 system-ui;padding:24px;white-space:pre-wrap}</style>${escaped}`;
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
    btn.onclick=()=>{ $('code-editor').value=row.content||''; scheduleSave(); $('history-dialog').close(); };
    item.append(info,btn); list.appendChild(item);
  });
  if(!(data||[]).length){const p=document.createElement('p');p.className='muted';p.textContent='Ainda não há versões anteriores.';list.appendChild(p);}
}

async function completeExercise(){
  const results=validateExercise(state.meta||{},state.files,state.active,$('code-editor').value);
  runValidation();
  if(results.length && results.some(r=>!r.ok)){
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
    const messages={
      activity_too_fast:'A atividade foi iniciada há poucos segundos. Continue trabalhando antes de concluir.',
      empty_activity:'Escreva sua solução antes de concluir.',
      active_supervised_session_required:'A sessão supervisionada precisa estar ativa para concluir.',
      exercise_locked_by_teacher:'Este exercício foi bloqueado pelo professor.'
    };
    setSaveState(messages[error.code]||error.message||'Não foi possível concluir.','error');
  }
}


async function loadStudentSupport(){
  const [{data:accommodations},{data:releases},{data:progressRows}] = await Promise.all([
    supabase.from('student_accommodations').select('id,accommodation_type,config,reason,active').eq('student_id',state.profile.id).eq('exercise_id',state.exercise.id).eq('active',true),
    supabase.from('exercise_releases').select('allow_html_base,allow_css_base,allow_js_base,allow_extra_hints,allow_guided_support,enabled').eq('student_id',state.profile.id).eq('exercise_id',state.exercise.id),
    supabase.from('student_exercises').select('approval_status,teacher_feedback,teacher_feedback_at').eq('student_id',state.profile.id).eq('exercise_id',state.exercise.id)
  ]);
  const support=[...(accommodations||[])];
  const release=(releases||[])[0]||{};
  const progress=(progressRows||[])[0]||{};
  const guidance=document.getElementById('exercise-guidance');
  if(guidance){
    const chunks=[];
    if(release.allow_extra_hints) chunks.push('<div class="support-note"><strong>Dicas extras liberadas</strong><span>Seu professor habilitou apoio adicional para este exercício.</span></div>');
    if(release.allow_guided_support) chunks.push('<div class="support-note"><strong>Apoio guiado liberado</strong><span>Você pode utilizar as orientações adicionais disponíveis neste exercício.</span></div>');
    for(const a of support){
      const message=a?.config?.message||a.reason;
      if(message) chunks.push(`<div class="support-note"><strong>${String(a.accommodation_type||'Apoio').replace(/[&<>]/g,'')}</strong><span>${String(message).replace(/[&<>]/g,'')}</span></div>`);
    }
    if(progress.teacher_feedback) chunks.push(`<div class="support-note teacher"><strong>Feedback do professor</strong><span>${String(progress.teacher_feedback).replace(/[&<>]/g,'')}</span></div>`);
    if(progress.approval_status==='approved') chunks.push('<div class="support-note approved"><strong>Aprovado pelo professor</strong><span>Este exercício recebeu aprovação manual.</span></div>');
    if(progress.approval_status==='changes_requested') chunks.push('<div class="support-note changes"><strong>Ajustes solicitados</strong><span>Revise o feedback acima e faça as alterações indicadas.</span></div>');
    if(chunks.length) guidance.insertAdjacentHTML('afterbegin',chunks.join(''));
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
    state.remoteEdit=false;
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
  state.active=null; state.files=[]; state.lastSavedContent=new Map(); state.remoteEdit=false; state.teacherEditing=false;
  setWorkspacePaused(true,'Preparando atividade supervisionada...');
  setSaveState('Carregando seus arquivos...','saving');
  $('preview-frame').srcdoc='<style>body{font:15px system-ui;padding:24px;color:#555}</style>Inicie a atividade supervisionada para executar o código.';
  await ensureFiles();
  const meta=state.meta||EXERCISE_MANIFEST[`${subject.slug}:${exercise.exercise_number}`]||{};
  state.meta=meta;
  const guidance=document.getElementById('exercise-guidance');
  if(guidance){
    const concepts=[...(meta.conceitos||[]),...(meta.retomadas||[]),...(meta.novos||[])].slice(0,8);
    guidance.innerHTML=`<strong>${meta.objetivo||exercise.description||'Desenvolva a atividade proposta.'}</strong>`+
      (concepts.length?`<ul>${concepts.map(c=>`<li>${String(c).replace(/[&<>]/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[x]))}</li>`).join('')}</ul>`:'');
  }
  renderFileTabs();
  await activateFile(state.files[0]?.id);
  runValidation();
  await loadStudentSupport();
  await prepareSupervision({
    profile,exercise,
    getEditorState:editorSnapshot,
    onArmed:()=>{setWorkspacePaused(false,'Modo supervisionado ativo');buildPreview();},
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
  const results=validateExercise(state.meta||{},state.files,state.active,$('code-editor').value);
  box.innerHTML=renderValidation(results);
}
$('code-editor')?.addEventListener('keydown',e=>tabInsert(e.currentTarget,e));
$('code-editor')?.addEventListener('paste',e=>handlePaste(e));
$('code-editor')?.addEventListener('drop',e=>handleDrop(e));
$('code-editor')?.addEventListener('input',(event)=>{
  if(!state.active||state.remoteEdit)return;
  state.active.content=$('code-editor').value;
  scheduleSave();
  handleEditorInput($('code-editor').value,event);
});
['keyup','click','select'].forEach(evt=>$('code-editor')?.addEventListener(evt,sendCursor));
$('save-now-btn')?.addEventListener('click',()=>saveActiveFile(true));
$('run-preview-btn')?.addEventListener('click',async()=>{await buildPreview();runValidation();});
$('validate-btn')?.addEventListener('click',runValidation);
$('mark-complete-btn')?.addEventListener('click',completeExercise);
$('history-btn')?.addEventListener('click',async()=>{await loadHistory();$('history-dialog').showModal();});
document.querySelectorAll('.output-tab').forEach(b=>b.addEventListener('click',()=>showOutput(b.dataset.output)));
window.addEventListener('beforeunload',()=>{if(state.active&&state.dirty)localStorage.setItem(cacheKey(state.active),$('code-editor').value);});
