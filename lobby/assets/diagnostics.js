(()=>{
  'use strict';

  const RELEASE='14.10.8.96-F94.14';
  const MAX_EVENTS=120;
  const startedAt=Date.now();
  const params=new URLSearchParams(location.search);
  const requested=params.get('diag')==='1';
  const events=[];
  const state={
    release:RELEASE,
    diagnosticSchema:3,
    startedAt:new Date(startedAt).toISOString(),
    stage:'document_loading',
    sdk:{version:'2.112.3',source:null,attempts:[],serviceWorkerCache:null},
    serviceWorker:{supported:'serviceWorker' in navigator,registered:false,controlled:Boolean(navigator.serviceWorker?.controller),error:null},
    runtime:{mode:null,quality:null,fps:null,avatar:null,firstFrame:false},
    observability:{currentWorld:null,currentScene:null,currentInterior:null,source:null,frameTimeMs:null,dpr:null,drawCalls:null,triangles:null,points:null,lines:null,geometries:null,textures:null,programs:null,npcCount:null,vehicleCount:null,sceneObjects:null,visibleSceneObjects:null,geometryMemoryMb:null,textureMemoryMb:null,estimatedGpuMemoryMb:null,estimatedMemoryMethod:null,jsHeapUsedMb:null,jsHeapTotalMb:null,jsHeapLimitMb:null,lastSampleAt:null},
    lastError:null
  };

  const safeText=value=>String(value??'').slice(0,220);
  const now=()=>Date.now()-startedAt;
  const clone=value=>{try{return structuredClone(value)}catch(_){return JSON.parse(JSON.stringify(value))}};

  function record(type,data={}){
    const item={t:now(),type:safeText(type),...clone(data)};
    events.push(item);
    if(events.length>MAX_EVENTS)events.splice(0,events.length-MAX_EVENTS);
    if(type==='stage'&&data?.stage)state.stage=safeText(data.stage);
    if(type==='error')state.lastError={t:item.t,code:safeText(data?.code||'unknown'),message:safeText(data?.message||''),file:safeText(data?.file||''),line:Number(data?.line||0)||null,column:Number(data?.column||0)||null,stack:safeText(data?.stack||'')};
    renderIfOpen();
    return item;
  }

  function connectionSnapshot(){
    const c=navigator.connection||navigator.mozConnection||navigator.webkitConnection;
    return {
      online:navigator.onLine,
      effectiveType:c?.effectiveType||null,
      downlink:Number.isFinite(c?.downlink)?c.downlink:null,
      rtt:Number.isFinite(c?.rtt)?c.rtt:null,
      saveData:Boolean(c?.saveData)
    };
  }

  function deviceSnapshot(){
    const vv=window.visualViewport;
    return {
      viewport:{width:innerWidth,height:innerHeight},
      visualViewport:vv?{width:Math.round(vv.width),height:Math.round(vv.height),scale:Number(vv.scale?.toFixed?.(2)||vv.scale||1)}:null,
      dpr:Number(devicePixelRatio||1),
      coarsePointer:matchMedia('(pointer:coarse)').matches,
      reducedMotion:matchMedia('(prefers-reduced-motion:reduce)').matches,
      hardwareConcurrency:Number(navigator.hardwareConcurrency||0)||null,
      deviceMemory:Number(navigator.deviceMemory||0)||null,
      platform:safeText(navigator.userAgentData?.platform||navigator.platform||'unknown'),
      browserHint:safeText(navigator.userAgentData?.brands?.map(b=>`${b.brand}/${b.version}`).join(', ')||'unavailable')
    };
  }

  function resourceEvidence(){
    const entries=performance.getEntriesByType?.('resource')||[];
    const sdk=entries.filter(e=>/supabase-js|vendor\/supabase\/supabase\.js/i.test(e.name)).at(-1);
    if(!sdk)return null;
    return {
      name:sdk.name.startsWith(location.origin)?new URL(sdk.name).pathname:new URL(sdk.name).host,
      duration:Math.round(sdk.duration||0),
      transferSize:Number(sdk.transferSize||0),
      encodedBodySize:Number(sdk.encodedBodySize||0),
      initiatorType:sdk.initiatorType||null
    };
  }


  const RELEVANT_LISTENER_TYPES=new Set(['keydown','keyup','resize','pointerdown','pointerup','pointermove','pointercancel','webglcontextlost','visibilitychange','wheel','touchstart','touchmove','touchend','click']);
  const instrumentation={
    installed:false,
    raf:{pending:new Map(),requested:0,fired:0,cancelled:0,maxPending:0},
    listeners:{targets:new WeakMap(),active:0,added:0,removed:0,byType:Object.create(null),byTarget:Object.create(null)}
  };
  function targetKind(target){
    if(target===window)return'window';if(target===document)return'document';if(target===window.visualViewport)return'visualViewport';
    const tag=String(target?.tagName||'').toLowerCase();if(tag==='canvas')return'canvas';if(tag)return'element';return'other';
  }
  function listenerCapture(options){return typeof options==='boolean'?options:Boolean(options?.capture)}
  function listenerOnce(options){return Boolean(options&&typeof options==='object'&&options.once)}
  function bumpCounter(bucket,key,delta){bucket[key]=Math.max(0,Number(bucket[key]||0)+delta);if(!bucket[key])delete bucket[key]}
  function installInstrumentation(){
    if(instrumentation.installed)return;instrumentation.installed=true;
    const nativeRaf=window.requestAnimationFrame?.bind(window),nativeCancel=window.cancelAnimationFrame?.bind(window);
    if(nativeRaf&&nativeCancel){
      window.requestAnimationFrame=callback=>{let id=0;function wrapped(time){instrumentation.raf.pending.delete(id);instrumentation.raf.fired++;return callback.call(this,time)}id=nativeRaf(wrapped);instrumentation.raf.pending.set(id,now());instrumentation.raf.requested++;instrumentation.raf.maxPending=Math.max(instrumentation.raf.maxPending,instrumentation.raf.pending.size);return id;};
      window.cancelAnimationFrame=id=>{if(instrumentation.raf.pending.delete(id))instrumentation.raf.cancelled++;return nativeCancel(id)};
    }
    const proto=globalThis.EventTarget?.prototype,nativeAdd=proto?.addEventListener,nativeRemove=proto?.removeEventListener;
    if(nativeAdd&&nativeRemove){
      proto.addEventListener=function(type,listener,options){
        const eventType=String(type||'');if(listener&&RELEVANT_LISTENER_TYPES.has(eventType)&&!listenerOnce(options)){
          let byType=instrumentation.listeners.targets.get(this);if(!byType){byType=new Map();instrumentation.listeners.targets.set(this,byType)}
          let records=byType.get(eventType);if(!records){records=[];byType.set(eventType,records)}
          const capture=listenerCapture(options);if(!records.some(item=>item.listener===listener&&item.capture===capture)){
            records.push({listener,capture});instrumentation.listeners.active++;instrumentation.listeners.added++;bumpCounter(instrumentation.listeners.byType,eventType,1);bumpCounter(instrumentation.listeners.byTarget,targetKind(this),1);
          }
        }
        return nativeAdd.call(this,type,listener,options);
      };
      proto.removeEventListener=function(type,listener,options){
        const eventType=String(type||''),byType=instrumentation.listeners.targets.get(this),records=byType?.get(eventType),capture=listenerCapture(options);
        if(records){const index=records.findIndex(item=>item.listener===listener&&item.capture===capture);if(index>=0){records.splice(index,1);instrumentation.listeners.active=Math.max(0,instrumentation.listeners.active-1);instrumentation.listeners.removed++;bumpCounter(instrumentation.listeners.byType,eventType,-1);bumpCounter(instrumentation.listeners.byTarget,targetKind(this),-1);if(!records.length)byType.delete(eventType)}}
        return nativeRemove.call(this,type,listener,options);
      };
    }
  }
  function jsHeapSnapshot(){
    const memory=performance.memory;if(!memory)return{available:false,usedMb:null,totalMb:null,limitMb:null};
    const mb=value=>Number.isFinite(value)?Number((value/1048576).toFixed(2)):null;
    return{available:true,usedMb:mb(memory.usedJSHeapSize),totalMb:mb(memory.totalJSHeapSize),limitMb:mb(memory.jsHeapSizeLimit)};
  }
  function instrumentationSnapshot(){
    const heap=jsHeapSnapshot();return{
      raf:{activePending:instrumentation.raf.pending.size,requested:instrumentation.raf.requested,fired:instrumentation.raf.fired,cancelled:instrumentation.raf.cancelled,maxPending:instrumentation.raf.maxPending,definition:'pending requestAnimationFrame callbacks'},
      listeners:{activeRelevant:instrumentation.listeners.active,added:instrumentation.listeners.added,removed:instrumentation.listeners.removed,byType:{...instrumentation.listeners.byType},byTarget:{...instrumentation.listeners.byTarget},trackedTypes:[...RELEVANT_LISTENER_TYPES],definition:'persistent addEventListener registrations observed after diagnostics init; once listeners excluded'},
      jsHeap:heap
    };
  }

  function snapshot(){
    state.serviceWorker.controlled=Boolean(navigator.serviceWorker?.controller);
    const data=clone(state),instrumentationData=instrumentationSnapshot();
    data.observability={...data.observability,instrumentation:instrumentationData};
    return {
      ...data,
      capturedAt:new Date().toISOString(),
      elapsedMs:now(),
      network:connectionSnapshot(),
      device:deviceSnapshot(),
      document:{visibility:document.visibilityState,readyState:document.readyState,secureContext:isSecureContext},
      sdkResource:resourceEvidence(),
      events:clone(events)
    };
  }

  function exportText(){return JSON.stringify(snapshot(),null,2)};
  let panel=null,pre=null,trigger=null;

  function ensureUi(){
    if(panel)return;
    trigger=document.createElement('button');
    trigger.id='diag-trigger';
    trigger.className='diag-trigger';
    trigger.type='button';
    trigger.textContent='Diagnóstico técnico';
    trigger.hidden=!requested;
    trigger.onclick=()=>open();

    panel=document.createElement('section');
    panel.id='diag-panel';
    panel.className='diag-panel hidden';
    panel.setAttribute('role','dialog');
    panel.setAttribute('aria-modal','true');
    panel.setAttribute('aria-labelledby','diag-title');
    panel.innerHTML=`<div class="diag-card"><header><div><p>Lobby • suporte</p><h2 id="diag-title">Diagnóstico técnico</h2></div><button id="diag-close" type="button" aria-label="Fechar diagnóstico">×</button></header><p class="diag-note">Não inclui nome, e-mail, CGM, token ou código do aluno.</p><div id="diag-summary" class="diag-summary"></div><pre id="diag-json" tabindex="0"></pre><footer><button id="diag-refresh" type="button">Atualizar</button><button id="diag-copy" class="primary" type="button">Copiar diagnóstico</button></footer><p id="diag-feedback" class="diag-feedback" aria-live="polite"></p></div>`;
    document.body.append(trigger,panel);
    pre=panel.querySelector('#diag-json');
    panel.querySelector('#diag-close').onclick=close;
    panel.querySelector('#diag-refresh').onclick=render;
    panel.querySelector('#diag-copy').onclick=copy;
    panel.addEventListener('click',e=>{if(e.target===panel)close()});
    if(requested)open();
  }

  function summaryHtml(data){
    const esc=value=>safeText(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    const rows=[
      ['Release',data.release],['Etapa',data.stage],['SDK',`${data.sdk.source||'ainda não carregado'} • ${data.sdk.version}`],
      ['Service Worker',data.serviceWorker.controlled?'controlando':'não controla a página'],['Rede',data.network.online?'online':'offline'],
      ['Runtime',data.runtime.mode?`${data.runtime.mode}${data.runtime.quality?` • ${data.runtime.quality}`:''}`:'ainda não iniciado'],
      ['Mundo',data.observability.currentWorld||data.observability.currentScene||'não reportado'],
      ['FPS / frame',data.runtime.fps?`${data.runtime.fps} FPS • ${data.observability.frameTimeMs??'—'} ms`:'não reportado'],
      ['Renderer',data.observability.drawCalls==null?'não reportado':`${data.observability.drawCalls} calls • ${data.observability.triangles??'—'} tri`],
      ['GPU estimada',data.observability.estimatedGpuMemoryMb==null?'não disponível':`${data.observability.estimatedGpuMemoryMb} MB`],
      ['RAF / listeners',`${data.observability.instrumentation?.raf?.activePending??0} pendentes • ${data.observability.instrumentation?.listeners?.activeRelevant??0} relevantes`],
      ['Último erro',data.lastError?.code||'nenhum']
    ];
    return rows.map(([k,v])=>`<div><span>${esc(k)}</span><strong>${esc(v)}</strong></div>`).join('');
  }

  function render(){
    if(!panel||panel.classList.contains('hidden'))return;
    const data=snapshot();
    panel.querySelector('#diag-summary').innerHTML=summaryHtml(data);
    pre.textContent=JSON.stringify(data,null,2);
  }
  function renderIfOpen(){if(panel&&!panel.classList.contains('hidden'))render()}
  function open(){ensureUi();panel.classList.remove('hidden');trigger.hidden=true;render();queueMicrotask(()=>panel.querySelector('#diag-close')?.focus())}
  function close(){if(!panel)return;panel.classList.add('hidden');trigger.hidden=false;trigger.focus()}
  async function copy(){
    const feedback=panel.querySelector('#diag-feedback');
    try{await navigator.clipboard.writeText(exportText());feedback.textContent='Diagnóstico copiado. Envie este texto ao professor.'}
    catch(_){pre.focus();const sel=getSelection();sel.removeAllRanges();const range=document.createRange();range.selectNodeContents(pre);sel.addRange(range);feedback.textContent='Não foi possível copiar automaticamente. O texto foi selecionado para cópia manual.'}
  }
  function exposeError(code,message=''){
    record('error',{code,message});
    ensureUi();trigger.hidden=false;trigger.classList.add('diag-trigger-error');
  }
  function update(patch={}){
    for(const [key,value] of Object.entries(patch)){
      if(value&&typeof value==='object'&&!Array.isArray(value)&&state[key]&&typeof state[key]==='object')Object.assign(state[key],clone(value));
      else state[key]=clone(value);
    }
    renderIfOpen();
  }

  globalThis.__agvLobbyDiag={release:RELEASE,state,events,record,update,snapshot,exportText,open,close,exposeError,instrumentationSnapshot};
  record('stage',{stage:'diagnostics_ready'});

  addEventListener('online',()=>record('network',{online:true}));
  addEventListener('offline',()=>record('network',{online:false}));
  addEventListener('error',event=>{
    const target=event.target;
    if(target?.tagName==='SCRIPT'){record('resource_error',{resource:safeText(target.src||'script')});return;}
    record('error',{code:'runtime_error',message:safeText(event.message||'runtime_error'),file:safeText(event.filename||''),line:event.lineno||null,column:event.colno||null,stack:safeText(event.error?.stack||'')});
  },true);
  addEventListener('unhandledrejection',event=>record('error',{code:'unhandled_rejection',message:safeText(event.reason?.message||event.reason||'unknown'),stack:safeText(event.reason?.stack||'')}));
  addEventListener('resize',()=>update({device:deviceSnapshot()}),{passive:true});
  document.addEventListener('keydown',event=>{if(event.altKey&&event.shiftKey&&String(event.key).toLowerCase()==='d'){event.preventDefault();panel?.classList.contains('hidden')===false?close():open()}else if(event.key==='Escape'&&panel&&!panel.classList.contains('hidden')){event.preventDefault();close()}},true);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ensureUi,{once:true});else ensureUi();
  installInstrumentation();
})();
