import { EXERCISE_MANIFEST } from '../data/exercise-manifest.js';
import { validateExercise, renderValidation } from './validation.js';

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
};

const $ = (id)=>document.getElementById(id);

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
    const {data,error}=await supabase.from('student_files').insert(seeds)
      .select('id,filename,language,content,revision,saved_at');
    if(error) throw error;
    remote=data||[];
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
    b.onclick=()=>activateFile(file.id);
    box.appendChild(b);
  });
}

function activateFile(id){
  const next=state.files.find(f=>f.id===id); if(!next)return;
  state.active=next;
  $('active-filename').textContent=next.filename;
  $('active-language').textContent=next.language||'texto';
  $('code-editor').value=next.content||'';
  renderFileTabs();
  setSaveState(`Revisão ${next.revision||1} • ${formatDate(next.saved_at)}`,'ok');
}

function formatDate(v){
  if(!v)return' ainda não salvo';
  try{return new Intl.DateTimeFormat('pt-BR',{dateStyle:'short',timeStyle:'short'}).format(new Date(v));}
  catch{return String(v);}
}

function scheduleSave(){
  state.dirty=true; setSaveState('Alterações locais — salvando...','saving');
  clearTimeout(state.saveTimer);
  state.saveTimer=setTimeout(()=>saveActiveFile(),1800);
}

async function saveActiveFile(force=false){
  if(!state.active)return;
  const content=$('code-editor').value;
  if(!force && state.lastSavedContent.get(state.active.id)===content){
    state.dirty=false; setSaveState(`Tudo salvo • revisão ${state.active.revision||1}`,'ok'); return;
  }
  localStorage.setItem(cacheKey(state.active),content);
  setSaveState('Salvando na nuvem...','saving');
  const {data,error}=await supabase.from('student_files')
    .update({content})
    .eq('id',state.active.id)
    .eq('student_id',state.profile.id)
    .select('id,content,revision,saved_at')
    .single();
  if(error){
    setSaveState('Sem conexão: cópia local preservada','error');
    return;
  }
  state.active.content=data.content; state.active.revision=data.revision; state.active.saved_at=data.saved_at;
  state.lastSavedContent.set(state.active.id,data.content);
  state.dirty=false;
  localStorage.removeItem(cacheKey(state.active));
  setSaveState(`Salvo • revisão ${data.revision} • ${formatDate(data.saved_at)}`,'ok');
  await supabase.from('student_exercises').update({last_activity_at:new Date().toISOString()})
    .eq('student_id',state.profile.id).eq('exercise_id',state.exercise.id);
}

function buildPreview(){
  const map=Object.fromEntries(state.files.map(f=>[f.filename,f.id===state.active?.id?$('code-editor').value:f.content||'']));
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
  }else{
    $('terminal-output').textContent=state.active?.language==='python'
      ? 'Execução Python será conectada ao runtime Pyodide na próxima etapa. Seu código já está salvo e versionado.'
      : 'Use o preview para HTML/CSS/JS.';
    showOutput('terminal');
  }
}

function showOutput(which){
  document.querySelectorAll('.output-tab').forEach(b=>b.classList.toggle('active',b.dataset.output===which));
  $('preview-frame').classList.toggle('hidden',which!=='preview');
  $('terminal-output').classList.toggle('hidden',which!=='terminal');
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
  await saveActiveFile(true);
  const {error}=await supabase.from('student_exercises').update({
    status:'completed',progress_percent:100,completed_at:new Date().toISOString(),last_activity_at:new Date().toISOString()
  }).eq('student_id',state.profile.id).eq('exercise_id',state.exercise.id);
  if(error){setSaveState('Código salvo, mas não foi possível concluir.','error');return;}
  $('exercise-state').textContent='Concluído';
  setSaveState('Exercício concluído e sincronizado','ok');
}

export async function mountWorkspace({profile,exercise,subject}){
  state.profile=profile; state.exercise=exercise; state.subject=subject;
  state.active=null; state.files=[]; state.lastSavedContent=new Map();
  setSaveState('Carregando seus arquivos...','saving');
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
  activateFile(state.files[0]?.id);
  buildPreview();
  runValidation();
}


function runValidation(){
  const box=document.getElementById('validation-results'); if(!box)return;
  const results=validateExercise(state.meta||{},state.files,state.active,$('code-editor').value);
  box.innerHTML=renderValidation(results);
}
$('code-editor')?.addEventListener('keydown',e=>tabInsert(e.currentTarget,e));
$('code-editor')?.addEventListener('input',()=>{ if(state.active){state.active.content=$('code-editor').value;scheduleSave();}});
$('save-now-btn')?.addEventListener('click',()=>saveActiveFile(true));
$('run-preview-btn')?.addEventListener('click',()=>{buildPreview();runValidation();});
$('validate-btn')?.addEventListener('click',runValidation);
$('mark-complete-btn')?.addEventListener('click',completeExercise);
$('history-btn')?.addEventListener('click',async()=>{await loadHistory();$('history-dialog').showModal();});
document.querySelectorAll('.output-tab').forEach(b=>b.addEventListener('click',()=>showOutput(b.dataset.output)));
window.addEventListener('beforeunload',()=>{if(state.active&&state.dirty)localStorage.setItem(cacheKey(state.active),$('code-editor').value);});
