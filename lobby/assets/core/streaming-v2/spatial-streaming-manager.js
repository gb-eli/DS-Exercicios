export const SPATIAL_STREAMING_VERSION=1;

const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
const distance2d=(a,b)=>Math.hypot(Number(a?.x||0)-Number(b?.x||0),Number(a?.z||0)-Number(b?.z||0));

function normalizeChunk(input={}){
  if(!input.id)throw new TypeError('stream_chunk_id_required');
  if(typeof input.load!=='function')throw new TypeError(`stream_chunk_load_required:${input.id}`);
  return {
    id:String(input.id),label:String(input.label||input.id),x:Number(input.x||0),z:Number(input.z||0),radius:Math.max(0,Number(input.radius||0)),
    loadRadius:Number(input.loadRadius)>0?Math.max(1,Number(input.loadRadius)):0,unloadRadius:Number(input.unloadRadius)>0?Math.max(1,Number(input.unloadRadius)):0,priority:Number(input.priority||0),
    policy:input.policy==='always'?'always':'on-demand',load:input.load,unload:typeof input.unload==='function'?input.unload:null,
    status:'idle',resource:null,lastDistance:Infinity,lastUsedAt:0,error:null,pinned:input.policy==='always'||!!input.pinned,promise:null
  };
}

export function createSpatialStreamingManager({loadRadius=30,unloadRadius=44,maxLoaded=5,onEvent=()=>{}}={}){
  const chunks=new Map();let disposed=false,lastPosition={x:0,z:0},revision=0;
  const emit=(type,chunk,extra={})=>{try{onEvent({type,id:chunk?.id||null,label:chunk?.label||null,status:chunk?.status||null,revision,...extra});}catch(_){}};

  function register(input){
    if(disposed)throw new Error('streaming_manager_disposed');
    const chunk=normalizeChunk(input);if(chunks.has(chunk.id))throw new Error(`stream_chunk_duplicate:${chunk.id}`);chunks.set(chunk.id,chunk);revision++;emit('registered',chunk);return chunk.id;
  }

  async function ensureLoaded(chunk,reason='proximity'){
    if(disposed||!chunk)return null;
    if(chunk.status==='loaded')return chunk.resource;
    if(chunk.status==='loading')return chunk.promise;
    chunk.status='loading';chunk.error=null;revision++;emit('loading',chunk,{reason});
    chunk.promise=Promise.resolve().then(()=>chunk.load({id:chunk.id,label:chunk.label,reason})).then(resource=>{
      if(disposed){try{chunk.unload?.(resource,{reason:'manager-disposed'})}catch(_){}return null;}
      chunk.resource=resource??true;chunk.status='loaded';chunk.lastUsedAt=Date.now();chunk.promise=null;revision++;emit('loaded',chunk,{reason});return chunk.resource;
    }).catch(error=>{chunk.status='error';chunk.error=error;chunk.promise=null;revision++;emit('error',chunk,{reason,message:String(error?.message||error)});return null;});
    return chunk.promise;
  }

  async function unloadChunk(chunk,reason='distance'){
    if(!chunk||((chunk.pinned||chunk.policy==='always')&&reason!=='dispose')||chunk.status==='idle'||chunk.status==='unloading')return false;
    if(chunk.status==='loading'){try{await chunk.promise;}catch(_){}if(chunk.status!=='loaded')return false;}
    const resource=chunk.resource;chunk.status='unloading';revision++;emit('unloading',chunk,{reason});
    try{await chunk.unload?.(resource,{id:chunk.id,label:chunk.label,reason});}
    catch(error){emit('unload-error',chunk,{reason,message:String(error?.message||error)});}
    chunk.resource=null;chunk.status='idle';chunk.lastUsedAt=Date.now();revision++;emit('unloaded',chunk,{reason});return true;
  }

  function rankedLoaded(){return [...chunks.values()].filter(c=>c.status==='loaded'&&!c.pinned&&c.policy!=='always').sort((a,b)=>b.lastDistance-a.lastDistance||a.priority-b.priority||a.lastUsedAt-b.lastUsedAt);}

  async function enforceBudget(){
    const loaded=[...chunks.values()].filter(c=>c.status==='loaded');if(loaded.length<=maxLoaded)return;
    const candidates=rankedLoaded();let excess=loaded.length-maxLoaded;
    for(const chunk of candidates){if(excess<=0)break;if(chunk.lastDistance<Math.max(loadRadius,chunk.loadRadius||0))continue;if(await unloadChunk(chunk,'budget'))excess--;}
  }

  function update(position,{forceIds=[],pinIds=[]}={}){
    if(disposed)return diagnostics();lastPosition={x:Number(position?.x||0),z:Number(position?.z||0)};const force=new Set(forceIds.map(String)),pins=new Set(pinIds.map(String));
    for(const chunk of chunks.values()){
      chunk.lastDistance=distance2d(lastPosition,chunk)-chunk.radius;chunk.pinned=chunk.policy==='always'||pins.has(chunk.id);
      const lr=chunk.loadRadius||loadRadius,ur=Math.max(lr+2,chunk.unloadRadius||unloadRadius);
      if(chunk.policy==='always'||force.has(chunk.id)||chunk.pinned||chunk.lastDistance<=lr){chunk.lastUsedAt=Date.now();void ensureLoaded(chunk,force.has(chunk.id)?'forced':'proximity');}
      else if(chunk.lastDistance>=ur){void unloadChunk(chunk,'distance');}
    }
    void enforceBudget();return diagnostics();
  }

  function pin(id,value=true){const chunk=chunks.get(String(id));if(!chunk)return false;chunk.pinned=chunk.policy==='always'||!!value;if(chunk.pinned)void ensureLoaded(chunk,'pin');return true;}
  function preload(ids=[]){for(const id of ids){const chunk=chunks.get(String(id));if(chunk)void ensureLoaded(chunk,'preload');}}
  async function dispose(){if(disposed)return;disposed=true;for(const chunk of chunks.values()){chunk.pinned=false;if(chunk.status==='loaded'||chunk.status==='loading')await unloadChunk(chunk,'dispose');}chunks.clear();revision++;}
  function diagnostics(){
    const items=[...chunks.values()].map(c=>({id:c.id,label:c.label,status:c.status,distance:Number.isFinite(c.lastDistance)?Math.round(c.lastDistance*10)/10:null,pinned:!!c.pinned,policy:c.policy,error:c.error?String(c.error?.message||c.error):null}));
    return {version:SPATIAL_STREAMING_VERSION,revision,position:{...lastPosition},registered:items.length,loaded:items.filter(i=>i.status==='loaded').length,loading:items.filter(i=>i.status==='loading').length,errors:items.filter(i=>i.status==='error').length,maxLoaded:clamp(Number(maxLoaded)||5,1,64),chunks:items};
  }
  return Object.freeze({register,update,pin,preload,diagnostics,dispose,ensureLoaded:id=>ensureLoaded(chunks.get(String(id)),'manual'),unload:id=>unloadChunk(chunks.get(String(id)),'manual')});
}
