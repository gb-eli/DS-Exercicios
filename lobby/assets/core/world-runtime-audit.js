const AUDIT_SCHEMA=1;
const RELEASE='14.10.8.96-F94.5';
const STORAGE_KEY='agv:world-runtime-audit:v1';
const MAX_ATTEMPTS_PER_MODE=4;
const MAX_RESOURCES=80;
const RETENTION_MS=7*24*60*60*1000;
const ASSET_RE=/\.(?:glb|gltf|bin|ktx2|basis|png|jpe?g|webp|avif|svg|mp3|ogg|wav|m4a|mp4|webm)(?:$|\?)/i;
const MODULE_RE=/\.(?:m?js)(?:$|\?)/i;
const INPUT_TYPES=new Set(['keydown','pointerdown','touchstart','wheel']);

const now=()=>performance?.now?.()??Date.now();
const wall=()=>Date.now();
const safe=value=>String(value??'').slice(0,180);
const round=value=>Number.isFinite(value)?Number(value.toFixed(2)):null;
const clone=value=>{try{return structuredClone(value)}catch(_){return JSON.parse(JSON.stringify(value))}};
const modeKey=(worldId,mode)=>`${String(worldId||'unknown')}:${String(mode||'unknown')}`;

function blankStage(){return{status:'pending',atMs:null,elapsedMs:null,detail:null};}
function blankAttempt({worldId,scene,label,mode,quality,source}){
  return{
    id:`${modeKey(worldId,mode)}:${wall()}:${Math.random().toString(36).slice(2,7)}`,
    worldId:String(worldId||'unknown'),scene:String(scene||worldId||'unknown'),label:String(label||worldId||'Mundo'),mode:String(mode||'unknown'),quality:quality||null,source:source||'runtime',
    startedAt:new Date().toISOString(),startedWallMs:wall(),startedPerfMs:now(),endedAt:null,durationMs:null,status:'running',error:null,
    stages:{adapter:blankStage(),import:blankStage(),assets:blankStage(),runtime:blankStage(),renderer:blankStage(),firstFrame:blankStage(),input:blankStage(),interaction:blankStage(),unload:blankStage()},
    resources:{modules:[],assets:[],other:[],summary:{moduleCount:0,assetCount:0,transferBytes:0,durationMs:0}},
    renderer:null,firstInput:null,firstInteraction:null,movementObserved:false,playerStateObserved:false
  };
}

function loadPersisted(){
  try{
    const raw=JSON.parse(localStorage.getItem(STORAGE_KEY)||'null');
    if(!raw||raw.schema!==AUDIT_SCHEMA||wall()-Number(raw.savedAt||0)>RETENTION_MS)return null;
    return raw;
  }catch(_){return null;}
}
function savePersisted(data){try{localStorage.setItem(STORAGE_KEY,JSON.stringify({...data,savedAt:wall()}));}catch(_){} }

const persisted=loadPersisted();
const state={schema:AUDIT_SCHEMA,release:RELEASE,worlds:new Map(),attempts:new Map(),activeAttemptId:null,history:Array.isArray(persisted?.history)?persisted.history:[],startedAt:new Date().toISOString()};
let installed=false,resourceObserver=null,ui=null;

function diagRecord(type,detail={}){try{globalThis.__agvLobbyDiag?.record?.(type,detail)}catch(_){} }
function diagUpdate(){try{globalThis.__agvLobbyDiag?.update?.({worldAudit:snapshot({compact:true})})}catch(_){} }
function persist(){
  const history=state.history.slice(-120);
  savePersisted({schema:AUDIT_SCHEMA,release:RELEASE,history});
}
function activeAttempt(){return state.activeAttemptId?state.attempts.get(state.activeAttemptId)||null:null;}
function attemptFor(worldId,mode){
  const key=modeKey(worldId,mode);
  const ids=[...state.attempts.values()].filter(a=>modeKey(a.worldId,a.mode)===key).sort((a,b)=>b.startedWallMs-a.startedWallMs);
  return ids[0]||null;
}
function getAttempt(worldId,mode){return attemptFor(worldId,mode);}

function registerWorlds(worlds=[]){
  for(const world of worlds){
    if(!world?.id)continue;
    state.worlds.set(String(world.id),{id:String(world.id),scene:String(world.scene||world.id),label:String(world.name||world.label||world.id),enabled:world.enabled!==false,capabilities:clone(world.capabilities||{})});
  }
  diagUpdate();renderUi();
}

function markStage(attempt,stage,status='pass',detail=null){
  if(!attempt||!attempt.stages?.[stage])return null;
  const elapsed=now()-attempt.startedPerfMs;
  const entry=attempt.stages[stage];
  if(entry.status==='pass'&&status==='running')return entry;
  entry.status=status;entry.atMs=new Date().toISOString();entry.elapsedMs=round(elapsed);entry.detail=detail?clone(detail):null;
  diagRecord('world_audit_stage',{attemptId:attempt.id,worldId:attempt.worldId,scene:attempt.scene,mode:attempt.mode,stage,status,elapsedMs:entry.elapsedMs,detail:entry.detail});
  diagUpdate();renderUi();return entry;
}

function begin({worldId,scene,label,mode,quality=null,source='runtime'}={}){
  const current=activeAttempt();
  if(current&&current.status==='running')finish(current.id,{status:'superseded',reason:'new_runtime_attempt'});
  const attempt=blankAttempt({worldId,scene,label,mode,quality,source});
  state.attempts.set(attempt.id,attempt);state.activeAttemptId=attempt.id;
  markStage(attempt,'adapter','running',{source});
  diagRecord('world_audit_begin',{attemptId:attempt.id,worldId:attempt.worldId,scene:attempt.scene,mode:attempt.mode,quality:attempt.quality,source});
  trimAttempts();diagUpdate();renderUi();return attempt.id;
}
function trimAttempts(){
  const grouped=new Map();
  for(const attempt of [...state.attempts.values()].sort((a,b)=>b.startedWallMs-a.startedWallMs)){
    const key=modeKey(attempt.worldId,attempt.mode);const list=grouped.get(key)||[];
    if(list.length<MAX_ATTEMPTS_PER_MODE){list.push(attempt);grouped.set(key,list);}else state.attempts.delete(attempt.id);
  }
}
function mark(attemptId,stage,detail=null,status='pass'){
  const attempt=state.attempts.get(attemptId)||activeAttempt();if(!attempt)return null;
  return markStage(attempt,stage,status,detail);
}
function markFor(worldId,mode,stage,detail=null,status='pass'){
  const attempt=getAttempt(worldId,mode);return attempt&&attempt.status==='running'?markStage(attempt,stage,status,detail):null;
}
function markImport(worldId,mode,status,detail={}){return markFor(worldId,mode,'import',detail,status);}
function markRuntime(worldId,mode,status,detail={}){return markFor(worldId,mode,'runtime',detail,status);}
function markRenderer(detail={}){
  const attempt=activeAttempt();if(!attempt||attempt.status!=='running')return;
  attempt.renderer={...(attempt.renderer||{}),...clone(detail)};markStage(attempt,'renderer','pass',attempt.renderer);
}
function assetSummary(attempt){
  const all=[...attempt.resources.modules,...attempt.resources.assets,...attempt.resources.other];
  attempt.resources.summary={moduleCount:attempt.resources.modules.length,assetCount:attempt.resources.assets.length,transferBytes:all.reduce((s,r)=>s+(Number(r.transferSize)||0),0),durationMs:round(all.reduce((s,r)=>s+(Number(r.duration)||0),0))};
  return clone(attempt.resources.summary);
}
function markFirstFrame(worldId,mode,detail={}){
  const attempt=getAttempt(worldId,mode);if(!attempt||attempt.status!=='running')return null;
  const summary=assetSummary(attempt);
  if(attempt.resources.assets.length||attempt.resources.modules.length)markStage(attempt,'assets','pass',summary);else markStage(attempt,'assets','pass',{...summary,note:'no_new_network_resources_observed_cached_or_procedural'});
  return markStage(attempt,'firstFrame','pass',detail);
}
function markInput(detail={}){
  const attempt=activeAttempt();if(!attempt||attempt.status!=='running'||attempt.stages.runtime.status!=='pass'||attempt.stages.input.status==='pass')return;
  attempt.firstInput=clone(detail);markStage(attempt,'input','pass',attempt.firstInput);
}
function markMovement(detail={}){
  const attempt=activeAttempt();if(!attempt||attempt.status!=='running')return;
  attempt.playerStateObserved=true;
  if(detail.moving&&!attempt.movementObserved){attempt.movementObserved=true;diagRecord('world_audit_movement_observed',{attemptId:attempt.id,worldId:attempt.worldId,mode:attempt.mode});}
}
function markInteraction(action=null){
  const attempt=activeAttempt();if(!attempt||attempt.status!=='running')return;
  const detail={type:safe(action?.type||'interact_request'),objectId:safe(action?.object?.id||action?.id||'' )||null,experience:safe(action?.experience||action?.challenge||'')||null,targetWorldId:safe(action?.targetWorldId||'')||null};
  attempt.firstInteraction=detail;markStage(attempt,'interaction','pass',detail);
}
function fail(attemptId,error,detail={}){
  const attempt=state.attempts.get(attemptId)||activeAttempt();if(!attempt)return;
  const message=safe(error?.message||error||'world_runtime_failed');
  attempt.status='fail';attempt.error={message,name:safe(error?.name||'Error'),...clone(detail)};attempt.endedAt=new Date().toISOString();attempt.durationMs=round(now()-attempt.startedPerfMs);
  const existingFail=Object.entries(attempt.stages).find(([,v])=>v.status==='fail');
  const pending=Object.entries(attempt.stages).find(([,v])=>v.status==='running')||Object.entries(attempt.stages).find(([,v])=>v.status==='pending');
  if(!existingFail&&pending)markStage(attempt,pending[0],'fail',{message,...clone(detail)});
  diagRecord('world_audit_failed',{attemptId:attempt.id,worldId:attempt.worldId,scene:attempt.scene,mode:attempt.mode,message,durationMs:attempt.durationMs});
  archive(attempt);if(state.activeAttemptId===attempt.id)state.activeAttemptId=null;diagUpdate();renderUi();
}
function finish(attemptId,{status='pass',reason='runtime_stopped'}={}){
  const attempt=state.attempts.get(attemptId)||activeAttempt();if(!attempt)return;
  if(attempt.status==='fail')return;
  attempt.status=status;attempt.endedAt=new Date().toISOString();attempt.durationMs=round(now()-attempt.startedPerfMs);
  markStage(attempt,'unload',status==='pass'?'pass':'skipped',{reason});
  diagRecord('world_audit_finish',{attemptId:attempt.id,worldId:attempt.worldId,scene:attempt.scene,mode:attempt.mode,status:attempt.status,reason,durationMs:attempt.durationMs});
  archive(attempt);if(state.activeAttemptId===attempt.id)state.activeAttemptId=null;diagUpdate();renderUi();
}
function archive(attempt){
  state.history=state.history.filter(item=>item.id!==attempt.id);state.history.push(clone(attempt));if(state.history.length>120)state.history.splice(0,state.history.length-120);persist();
}
function stopCurrent(reason='runtime_switch'){const attempt=activeAttempt();if(attempt)finish(attempt.id,{status:'pass',reason});}

function recordResource(entry){
  const attempt=activeAttempt();if(!attempt||attempt.status!=='running')return;
  const name=safe(entry.name);if(!name)return;
  const item={name:name.startsWith(location.origin)?safe(new URL(name).pathname):safe(name),initiatorType:safe(entry.initiatorType||''),duration:round(Number(entry.duration)||0),transferSize:Number(entry.transferSize||0),encodedBodySize:Number(entry.encodedBodySize||0)};
  const bucket=ASSET_RE.test(name)?attempt.resources.assets:MODULE_RE.test(name)?attempt.resources.modules:attempt.resources.other;
  if(bucket.length<MAX_RESOURCES&&!bucket.some(r=>r.name===item.name&&r.initiatorType===item.initiatorType))bucket.push(item);
  if(ASSET_RE.test(name)&&attempt.stages.assets.status==='pending')markStage(attempt,'assets','running',{first:item.name});
}
function installResourceObserver(){
  if(typeof PerformanceObserver==='undefined')return;
  try{resourceObserver=new PerformanceObserver(list=>{for(const entry of list.getEntries())recordResource(entry)});resourceObserver.observe({type:'resource',buffered:false});}catch(_){}
}
function installRendererProbe(){
  const proto=globalThis.HTMLCanvasElement?.prototype;if(!proto||proto.__agvWorldAuditGetContext)return;
  const native=proto.getContext;if(typeof native!=='function')return;
  Object.defineProperty(proto,'__agvWorldAuditGetContext',{value:native,configurable:true});
  proto.getContext=function(type,...args){
    const result=native.call(this,type,...args);const t=String(type||'').toLowerCase();
    if(result&&['webgl','webgl2','webgpu','2d'].includes(t)){
      let renderer=null,vendor=null;
      try{if(t.startsWith('webgl')){const ext=result.getExtension?.('WEBGL_debug_renderer_info');renderer=ext?safe(result.getParameter(ext.UNMASKED_RENDERER_WEBGL)):null;vendor=ext?safe(result.getParameter(ext.UNMASKED_VENDOR_WEBGL)):null;}}catch(_){}
      markRenderer({context:t,renderer,vendor,canvasId:safe(this.id||'')||null,width:Number(this.width||0)||null,height:Number(this.height||0)||null});
    }
    return result;
  };
}
function installInputProbe(){
  for(const type of INPUT_TYPES)addEventListener(type,event=>{const target=event.target,tag=String(target?.tagName||'').toUpperCase();if(['INPUT','TEXTAREA','SELECT','BUTTON','A'].includes(tag))return;if(type!=='keydown'&&tag!=='CANVAS')return;markInput({type,source:target===document?'document':target===window?'window':target?.tagName?.toLowerCase?.()||'other'});},{capture:true,passive:type==='wheel'});
}
function install(){if(installed)return;installed=true;installResourceObserver();installRendererProbe();installInputProbe();if(new URLSearchParams(location.search).get('worldaudit')==='1')queueMicrotask(ensureUi);}

function modeCell(worldId,mode){
  const candidates=[...state.attempts.values(),...state.history].filter(a=>a.worldId===worldId&&a.mode===mode).sort((a,b)=>b.startedWallMs-a.startedWallMs);const attempt=candidates[0];
  if(!attempt)return{status:'untested',stage:null,error:null,durationMs:null,input:'pending',interaction:'pending'};
  const failed=Object.entries(attempt.stages||{}).find(([,v])=>v.status==='fail');
  const lastPass=Object.entries(attempt.stages||{}).filter(([,v])=>v.status==='pass').at(-1);
  const core=['adapter','import','runtime','renderer','firstFrame'];
  const coreReady=core.every(stage=>attempt.stages?.[stage]?.status==='pass');
  const status=attempt.status==='fail'?'fail':attempt.status==='running'?'running':coreReady?'pass':'partial';
  return{status,stage:failed?.[0]||lastPass?.[0]||null,error:attempt.error?.message||null,durationMs:attempt.durationMs??null,attemptId:attempt.id,input:attempt.stages?.input?.status||'pending',interaction:attempt.stages?.interaction?.status||'pending',movementObserved:!!attempt.movementObserved};
}
function matrix(){return[...state.worlds.values()].map(world=>({id:world.id,scene:world.scene,label:world.label,enabled:world.enabled,lite:modeCell(world.id,'lite'),'3d':modeCell(world.id,'3d')}));}
function snapshot({compact=false}={}){
  const base={schema:AUDIT_SCHEMA,release:RELEASE,capturedAt:new Date().toISOString(),activeAttemptId:state.activeAttemptId,worldCount:state.worlds.size,matrix:matrix()};
  if(compact)return base;
  return{...base,active:clone(activeAttempt()),attempts:[...state.attempts.values()].map(clone),history:clone(state.history.slice(-60))};
}
function reset(){state.attempts.clear();state.history=[];state.activeAttemptId=null;try{localStorage.removeItem(STORAGE_KEY)}catch(_){}diagRecord('world_audit_reset',{});diagUpdate();renderUi();}
function exportText(){return JSON.stringify(snapshot(),null,2);}

function statusBadge(cell){
  const status=cell?.status||'untested';const label=status==='pass'?'PASS':status==='fail'?'FAIL':status==='running'?'RUN':status==='partial'?'PARC':'—';const checks=cell?.status==='pass'?` • input ${cell.input==='pass'?'✓':'—'} • interação ${cell.interaction==='pass'?'✓':'—'}`:'';return`<span class="agv-audit-badge ${status}">${label}</span>${cell?.stage?`<small>${cell.stage}${checks}</small>`:''}`;
}
function ensureUi(){
  if(ui)return ui;
  const style=document.createElement('style');style.textContent=`.agv-audit-trigger{position:fixed;right:14px;bottom:64px;z-index:10005;border:1px solid #35d7ff55;background:#08131ddd;color:#dff8ff;border-radius:12px;padding:9px 12px;font:700 12px system-ui;cursor:pointer}.agv-audit-panel{position:fixed;inset:4vh 3vw;z-index:10006;background:#071019f4;color:#eefaff;border:1px solid #4bdcff55;border-radius:18px;padding:18px;overflow:auto;box-shadow:0 20px 80px #000b;font:13px system-ui}.agv-audit-panel.hidden{display:none}.agv-audit-head{display:flex;justify-content:space-between;gap:12px;align-items:center;position:sticky;top:-18px;background:#071019f8;padding:12px 0;z-index:1}.agv-audit-table{width:100%;border-collapse:collapse}.agv-audit-table th,.agv-audit-table td{padding:8px;border-bottom:1px solid #ffffff18;text-align:left}.agv-audit-table td:nth-child(n+2){width:120px}.agv-audit-badge{display:inline-block;min-width:42px;text-align:center;padding:3px 6px;border-radius:999px;margin-right:6px;background:#ffffff18}.agv-audit-badge.pass{background:#18b87033;color:#72f1ad}.agv-audit-badge.fail{background:#ef444433;color:#ff9797}.agv-audit-badge.running{background:#eab30833;color:#ffe072}.agv-audit-table small{color:#98adba}.agv-audit-actions{display:flex;gap:8px;flex-wrap:wrap}.agv-audit-actions button{border:1px solid #ffffff2c;background:#102331;color:#fff;border-radius:10px;padding:8px 10px;cursor:pointer}`;document.head.appendChild(style);
  const trigger=document.createElement('button');trigger.className='agv-audit-trigger';trigger.type='button';trigger.textContent='Auditoria dos mundos';
  const panel=document.createElement('section');panel.className='agv-audit-panel hidden';panel.innerHTML=`<div class="agv-audit-head"><div><strong>F94.5 • Auditoria executável dos mundos</strong><div>PASS só significa etapa observada nesta sessão/dispositivo.</div></div><div class="agv-audit-actions"><button data-audit-copy>Copiar JSON</button><button data-audit-reset>Limpar</button><button data-audit-close>Fechar</button></div></div><div data-audit-body></div>`;
  document.body.append(trigger,panel);trigger.onclick=()=>{panel.classList.remove('hidden');renderUi()};panel.querySelector('[data-audit-close]').onclick=()=>panel.classList.add('hidden');panel.querySelector('[data-audit-reset]').onclick=reset;panel.querySelector('[data-audit-copy]').onclick=async()=>{try{await navigator.clipboard.writeText(exportText())}catch(_){}};
  ui={trigger,panel,body:panel.querySelector('[data-audit-body]')};renderUi();return ui;
}
function renderUi(){if(!ui||ui.panel.classList.contains('hidden'))return;const rows=matrix().map(row=>`<tr><td><strong>${safe(row.label)}</strong><br><small>${safe(row.id)}</small></td><td>${statusBadge(row.lite)}</td><td>${statusBadge(row['3d'])}</td></tr>`).join('');ui.body.innerHTML=`<p>${state.worlds.size} mundos registrados. Use normalmente o Lobby e visite os mapas em 2D/3D; a matriz é preenchida automaticamente.</p><table class="agv-audit-table"><thead><tr><th>Mundo</th><th>2D</th><th>3D</th></tr></thead><tbody>${rows}</tbody></table>`;}

install();

export const WORLD_RUNTIME_AUDIT=Object.freeze({
  schema:AUDIT_SCHEMA,release:RELEASE,registerWorlds,begin,mark,markFor,markImport,markRuntime,markRenderer,markFirstFrame,markInput,markMovement,markInteraction,fail,finish,stopCurrent,getAttempt,snapshot,matrix,exportText,reset,open:()=>{ensureUi();ui.panel.classList.remove('hidden');renderUi();}
});
