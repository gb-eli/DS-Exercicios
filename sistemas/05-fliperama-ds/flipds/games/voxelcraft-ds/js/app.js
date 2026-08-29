import { startGame } from './game.js';
import { saveWorld, loadWorld, hasSave, clearWorld, saveSettings, loadSettings, getStorageStatus } from './storage.js';

const $ = id => document.getElementById(id);
const QUERY = new URLSearchParams(location.search);
const EMBEDDED = QUERY.get('embed') === '1';
const PARENT_SOURCE = 'fliperama-ds';
const MESSAGE_SOURCE = 'fliperama-ds-voxelcraft';
const ITEM_DEFAULTS = [
  { name:'HTML', color:'#f06529', count:20 },
  { name:'CSS', color:'#2965f1', count:20 },
  { name:'JavaScript', color:'#f0db4f', count:20 },
  { name:'Madeira', color:'#8b5a2b', count:0 },
  { name:'Pedra', color:'#777f85', count:0 },
  { name:'Maçã', color:'#d83b3b', count:3 }
];
const ITEMS = ITEM_DEFAULTS.map(item => ({...item}));
const MODE_LABELS = { learning:'APRENDIZAGEM', free:'LIVRE', challenge:'DESAFIO' };
const STORAGE_LABELS = { indexeddb:'INDEXEDDB', localstorage:'LOCAL', memory:'MEMÓRIA' };
const state = {
  engine:null, selected:0, saveTimer:null, launching:false, lastProgress:null,
  lastError:null, savePromise:Promise.resolve(null), actualQuality:'auto'
};

function postParent(type, detail={}) {
  if (!EMBEDDED || window.parent === window) return;
  const targetOrigin = location.origin === 'null' ? '*' : location.origin;
  try { window.parent.postMessage({ source:MESSAGE_SOURCE, type, detail }, targetOrigin); } catch {}
}

function setText(id, text) { const element=$(id); if (element) element.textContent=String(text ?? ''); }
function clamp(value,min,max){return Math.min(max,Math.max(min,Number(value)||0));}
function showPrompt(text, duration=2200) {
  setText('prompt', text);
  if (duration > 0) setTimeout(() => { if ($('prompt')?.textContent === text) setText('prompt',''); }, duration);
}

function currentSettings() {
  return {
    quality:$('quality').value,
    mode:$('gameMode').value,
    fov:Number($('fov').value),
    sensitivity:Number($('sensitivity').value),
    learning:$('learning').checked
  };
}

function applySettings(settings) {
  $('quality').value=settings.quality;
  $('gameMode').value=settings.mode;
  $('fov').value=String(settings.fov);
  $('sensitivity').value=String(settings.sensitivity);
  $('learning').checked=settings.learning;
  setText('fovValue', `${settings.fov}°`);
  setText('sensitivityValue', `${settings.sensitivity}%`);
}

function persistSettings(){ saveSettings(currentSettings()); }

function resolvedQuality() {
  const selected=$('quality').value;
  if(selected!=='auto') return selected;
  const cores=navigator.hardwareConcurrency||4;
  const memory=navigator.deviceMemory||4;
  const coarse=(typeof matchMedia==='function'&&matchMedia('(pointer:coarse)').matches);
  if(cores<=2||memory<=2) return 'economy';
  if(coarse||cores<=4||memory<=4) return 'medium';
  if(cores>=8&&memory>=8) return 'ultra';
  return 'high';
}

function resetItems(){ITEM_DEFAULTS.forEach((item,index)=>{ITEMS[index]={...item};});state.selected=0;}
function restoreItems(savedItems){
  resetItems();
  if(!Array.isArray(savedItems)) return;
  for(const saved of savedItems){
    const item=ITEMS.find(entry=>entry.name===saved.name);
    if(item) item.count=Math.round(clamp(saved.count,0,999));
  }
}

function makeItemMarker(item){const marker=document.createElement('i');marker.style.backgroundColor=item.color;return marker;}
function renderHotbar(){
  const bar=$('hotbar');bar.replaceChildren();
  ITEMS.forEach((item,index)=>{
    const button=document.createElement('button');button.type='button';button.className=`slot${state.selected===index?' active':''}`;button.title=`${index+1}: ${item.name}`;
    const small=document.createElement('small');small.textContent=item.name;
    const count=document.createElement('b');count.textContent=String(item.count);
    button.append(makeItemMarker(item),small,count);
    button.addEventListener('click',()=>{state.selected=index;renderHotbar();state.engine?.setSelected?.(item);});
    bar.appendChild(button);
  });
}

function renderInventory(){
  const grid=$('inventoryGrid');grid.replaceChildren();
  ITEMS.forEach((item,index)=>{
    const card=document.createElement('article');card.className='item-card';
    const title=document.createElement('strong');title.textContent=item.name;
    const count=document.createElement('p');count.textContent=String(item.count);
    const button=document.createElement('button');button.type='button';button.textContent='Selecionar';
    button.addEventListener('click',()=>{state.selected=index;renderHotbar();state.engine?.setSelected?.(ITEMS[state.selected]);closeModal('inventoryModal');});
    card.append(title,count,button);grid.appendChild(card);
  });
}

function addItem(name,count=1){
  const item=ITEMS.find(value=>value.name===name);
  if(item)item.count=Math.round(clamp(item.count+count,0,999));
  renderHotbar();renderInventory();showPrompt(`+${count} ${name}`,1500);
}

function openModal(id){
  const element=$(id);if(!element)return;element.classList.remove('hidden');
  if(element.classList.contains('modal'))state.engine?.setPaused?.(true);
}
function closeModal(id){
  const element=$(id);if(!element)return;element.classList.add('hidden');
  if(element.classList.contains('modal')){
    const any=[...document.querySelectorAll('.modal')].some(modal=>!modal.classList.contains('hidden')&&modal.id!=='loadingModal');
    if(!any)state.engine?.setPaused?.(false);
  }
}

function showLoading(title='Preparando o mundo...',text='Carregando renderizador 3D e criando os primeiros chunks.'){
  setText('loadingTitle',title);setText('loadingText',text);$('loadingModal').classList.remove('hidden');
}
function hideLoading(){$('loadingModal').classList.add('hidden');}
function showError(error){
  state.lastError=error;hideLoading();setText('errorText',error?.message||'Erro desconhecido.');$('errorModal').classList.remove('hidden');
  postParent('error',{message:error?.message||String(error)});
}

function updateStorageLabel(backend=getStorageStatus().backend) {
  const label=STORAGE_LABELS[backend]||String(backend||'salvamento').toUpperCase();
  setText('storageLabel',label);
  $('storageLabel')?.classList.toggle('warning',backend==='memory');
}

async function updateSaveSummary(){
  try{
    const saved=await loadWorld();
    $('continueBtn').disabled=!saved;$('clearSaveBtn').disabled=!saved;
    if(!saved){setText('saveSummary','Nenhum mundo salvo neste dispositivo.');updateStorageLabel();return;}
    const date=new Date(saved.savedAt||Date.now()).toLocaleString('pt-BR');
    const backend=saved.storageBackend||getStorageStatus().backend;
    updateStorageLabel(backend);
    const durability=backend==='memory'?' • temporário até fechar a página':'';
    const chapter=saved.stats?.completed?3:Math.max(1,Math.min(3,Number(saved.stats?.chapter)||1));
    setText('saveSummary',`Mundo salvo em ${date} • etapa ${chapter}/3 • ${saved.stats?.xp||0} XP • ${saved.edits?.length||0} alterações • ${STORAGE_LABELS[backend]||backend}${durability}.`);
  }catch{setText('saveSummary','Não foi possível consultar o armazenamento local. O modo temporário será usado.');updateStorageLabel('memory');}
}

function updateProgress(data={}){
  state.lastProgress=data;
  const progress=clamp(data.progress,0,100);
  $('missionBar').style.width=`${progress}%`;setText('missionText',`${Math.round(progress)}%`);
  setText('missionTitle',data.title||'Exploração do mundo');
  if(data.lesson)setText('lesson',data.lesson);
  if(data.code)setText('codeExplain',data.code);
  if(Number.isFinite(data.xp))setText('xpLabel',`${Math.round(data.xp)} XP`);
  if(Number.isFinite(data.chunks))setText('chunkCount',`${Math.round(data.chunks)} chunks`);
  if(Number.isFinite(data.triangles))setText('triangleCount',`${Math.round(data.triangles)} tri`);
  postParent('progress',{...data,progress});
}

function handleStatus(data={}) {
  if(data.loading){showLoading(data.title||'Preparando o mundo...',data.message||'Carregando recursos.');return;}
  if(data.message)showPrompt(data.message,data.duration??2500);
  if(data.type==='pointer-lock-denied')showPrompt('O navegador bloqueou a captura do mouse. Arraste sobre a cena para olhar.',4200);
  if(data.type==='safe-recovery')showPrompt('Posição recuperada para um local seguro.',2600);
  if(data.type==='edit-limit')showPrompt('Limite de alterações atingido. Salve e inicie outro mundo para continuar construindo.',5000);
}

async function performSave(){
  const data=state.engine?.serialize?.();
  if(!data)return null;
  const saved=await saveWorld({...data,items:ITEMS});
  updateStorageLabel(saved.storageBackend);
  await updateSaveSummary();
  postParent('saved',{xp:saved.stats?.xp||0,edits:saved.edits?.length||0,savedAt:saved.savedAt,storage:saved.storageBackend});
  return saved;
}

function save(){
  state.savePromise=state.savePromise.catch(()=>null).then(()=>performSave());
  return state.savePromise;
}

function switchToGame(){ $('menu').classList.remove('active');$('gameScreen').classList.add('active'); }
function switchToMenu(){ $('gameScreen').classList.remove('active');$('menu').classList.add('active'); }

async function createEngine({quality,mode,saved}) {
  state.actualQuality=quality;
  setText('qualityLabel',quality.toUpperCase());
  return startGame({
    quality,mode,fov:Number($('fov').value),sensitivity:Number($('sensitivity').value)/100,
    selected:ITEMS[state.selected],saved,onCollect:addItem,onInventoryChange:()=>{renderHotbar();renderInventory();},
    onProgress:updateProgress,onStatus:handleStatus,
    onHud:data=>{
      setText('fps',`${Math.round(data.fps||0)} FPS`);setText('chunkCount',`${data.chunks||0} chunks`);setText('triangleCount',`${data.triangles||0} tri`);
      $('healthBar').style.width=`${clamp(data.health,0,100)}%`;$('hungerBar').style.width=`${clamp(data.hunger,0,100)}%`;
      if(data.lesson)setText('lesson',data.lesson);if(data.code)setText('codeExplain',data.code);if(Number.isFinite(data.xp))setText('xpLabel',`${Math.round(data.xp)} XP`);
    }
  });
}

function canUseSafeFallback(error,quality){
  return quality!=='economy' && /WebGL|renderizador|GPU|contexto|memória|canvas/i.test(String(error?.message||error));
}

async function launch(useSave,forceQuality){
  if(state.launching)return;
  state.launching=true;state.lastError=null;persistSettings();showLoading();
  try{
    const saved=useSave?await loadWorld():null;
    restoreItems(saved?.items);renderHotbar();renderInventory();switchToGame();
    const mode=$('gameMode').value;let quality=forceQuality||resolvedQuality();
    setText('modeLabel',MODE_LABELS[mode]||mode.toUpperCase());
    try { state.engine=await createEngine({quality,mode,saved}); }
    catch(error){
      if(!canUseSafeFallback(error,quality))throw error;
      state.engine?.destroy?.();state.engine=null;
      quality='economy';showLoading('Ativando modo seguro...','Ajustando distância de visão, resolução e efeitos para este dispositivo.');
      state.engine=await createEngine({quality,mode,saved});
      setText('qualityLabel','ECONÔMICO SEGURO');
      postParent('fallback',{quality,reason:error.message});
    }
    $('learningPanel').classList.toggle('hidden',!$('learning').checked||mode==='free');
    hideLoading();openModal('helpModal');clearInterval(state.saveTimer);state.saveTimer=setInterval(()=>save().catch(()=>{}),30000);
    updateStorageLabel(saved?.storageBackend||getStorageStatus().backend);
    postParent('started',{quality:state.actualQuality,mode,continued:Boolean(saved)});
  }catch(error){
    state.engine?.destroy?.();state.engine=null;showError(error);
  }finally{state.launching=false;}
}

async function exitToMenu({saveFirst=true}={}){
  clearInterval(state.saveTimer);state.saveTimer=null;
  if(saveFirst&&state.engine){try{await save();}catch{}}
  state.engine?.destroy?.();state.engine=null;document.exitPointerLock?.();
  document.querySelectorAll('.modal').forEach(modal=>modal.classList.add('hidden'));
  switchToMenu();await updateSaveSummary();postParent('stopped',{});
}

function requestLabReturn(){postParent('exit',{});}

const initialSettings=loadSettings();
if(QUERY.get('mode')&&['learning','free','challenge'].includes(QUERY.get('mode')))initialSettings.mode=QUERY.get('mode');
if(QUERY.get('quality')&&['auto','economy','low','medium','high','ultra'].includes(QUERY.get('quality')))initialSettings.quality=QUERY.get('quality');
applySettings(initialSettings);
if(EMBEDDED)$('returnLabBtn').classList.remove('hidden');
updateSaveSummary();renderHotbar();renderInventory();postParent('ready',{version:12,storage:'fliperama-ds.voxelcraft',safeMode:true});

$('playBtn').addEventListener('click',()=>launch(false));
$('continueBtn').addEventListener('click',()=>launch(true));
$('startBtn').addEventListener('click',()=>closeModal('helpModal'));
$('menuBtn').addEventListener('click',()=>openModal('pauseModal'));
$('resumeBtn').addEventListener('click',()=>closeModal('pauseModal'));
$('inventoryBtn').addEventListener('click',()=>openModal('inventoryModal'));
$('saveBtn').addEventListener('click',()=>save().then(()=>showPrompt('Mundo salvo.')).catch(showError));
$('cameraBtn').addEventListener('click',()=>state.engine?.toggleCamera?.());
$('fullscreenBtn').addEventListener('click',()=>document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen?.());
$('exitBtn').addEventListener('click',()=>exitToMenu());
$('returnLabBtn').addEventListener('click',requestLabReturn);
$('retryBtn').addEventListener('click',()=>{$('errorModal').classList.add('hidden');exitToMenu({saveFirst:false}).then(()=>launch(false));});
$('safeModeBtn').addEventListener('click',()=>{$('errorModal').classList.add('hidden');$('quality').value='economy';$('fov').value='70';applySettings({...currentSettings(),quality:'economy',fov:70});exitToMenu({saveFirst:false}).then(()=>launch(false,'economy'));});
$('errorBackBtn').addEventListener('click',()=>{$('errorModal').classList.add('hidden');exitToMenu({saveFirst:false});});
$('clearSaveBtn').addEventListener('click',async()=>{if(!confirm('Apagar o mundo salvo deste dispositivo?'))return;await clearWorld();resetItems();renderHotbar();renderInventory();await updateSaveSummary();postParent('cleared',{});});
$('fov').addEventListener('input',()=>{setText('fovValue',`${$('fov').value}°`);persistSettings();});
$('sensitivity').addEventListener('input',()=>{setText('sensitivityValue',`${$('sensitivity').value}%`);persistSettings();});
['quality','gameMode','learning'].forEach(id=>$(id).addEventListener('change',persistSettings));

document.addEventListener('click',event=>{const close=event.target.closest('[data-close]');if(close){event.preventDefault();closeModal(close.dataset.close);}});
document.addEventListener('keydown',event=>{
  if(!$('gameScreen').classList.contains('active'))return;
  if(event.key==='Escape'&&state.engine&&!state.launching){openModal('pauseModal');return;}
  const index=Number(event.key)-1;
  if(index>=0&&index<ITEMS.length){state.selected=index;renderHotbar();state.engine?.setSelected?.(ITEMS[index]);}
});
document.addEventListener('visibilitychange',()=>{if(document.hidden){state.engine?.setPaused?.(true);save().catch(()=>{});}else if(state.engine&&!document.querySelector('.modal:not(.hidden)'))state.engine.setPaused?.(false);});
window.addEventListener('pagehide',()=>{if(state.engine)save().catch(()=>{});});
window.addEventListener('message',async event=>{
  const allowedOrigin=location.origin==='null'||event.origin===location.origin;
  if(!allowedOrigin||event.data?.source!==PARENT_SOURCE)return;
  const type=event.data.type,detail=event.data.detail||{};
  if(type==='start'){
    if(detail.mode&&['learning','free','challenge'].includes(detail.mode))$('gameMode').value=detail.mode;
    if(detail.quality&&['auto','economy','low','medium','high','ultra'].includes(detail.quality))$('quality').value=detail.quality;
    persistSettings();
    if(!state.engine&&!state.launching)await launch(detail.continue!==false&&await hasSave());
    else state.engine?.setPaused?.(false);
  }else if(type==='pause')state.engine?.setPaused?.(true);
  else if(type==='resume')state.engine?.setPaused?.(false);
  else if(type==='shutdown')await exitToMenu({saveFirst:true});
  else if(type==='save')await save().catch(()=>{});
});
