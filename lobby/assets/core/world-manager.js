import { snapshotWorldState } from './lobby-state.js?v=14.10.8.85-f83-gameplay-performance';
import { resolveWorldTransition } from '../world/world-navigation.js?v=14.10.8.92-f90-graphics';

function abortError(){
  try{return new DOMException('world_runtime_start_aborted','AbortError')}catch(_){const error=new Error('world_runtime_start_aborted');error.name='AbortError';return error;}
}

function assertRuntime(runtime){
  if(!runtime||typeof runtime.stop!=='function')throw new TypeError('world_runtime_contract_invalid');
  return runtime;
}

export function createWorldManager({worldState,onLifecycleEvent=()=>{}}={}){
  if(!worldState||typeof worldState!=='object')throw new TypeError('world_state_required');
  let activeRuntime=null,activeAdapter=null,sequence=0,lastError=null,lastTransition=null;

  const emit=(type,detail={})=>{
    try{onLifecycleEvent({type,...detail,snapshot:snapshotWorldState(worldState)})}catch(_){}
  };

  const setIdentity=(adapter,mode,status)=>{
    if(adapter){worldState.worldId=adapter.id;worldState.scene=adapter.scene;activeAdapter=adapter;}
    if(mode)worldState.runtimeMode=mode;
    worldState.runtimeStatus=status;
    worldState.runtimeRevision=Number(worldState.runtimeRevision||0)+1;
  };

  async function start({adapter,mode,context={},signal=null}={}){
    if(!adapter?.supports?.(mode)||typeof adapter.createRuntime!=='function')throw new TypeError('world_adapter_contract_invalid');
    const ticket=++sequence;lastError=null;setIdentity(adapter,mode,'starting');emit('starting',{worldId:adapter.id,mode,ticket});
    let candidate=null;
    try{
      candidate=assertRuntime(await adapter.createRuntime(mode,{...context,signal:signal||context.signal||null}));
      if(ticket!==sequence||signal?.aborted)throw abortError();
      activeRuntime=candidate;setIdentity(adapter,mode,'ready');emit('ready',{worldId:adapter.id,mode,ticket});
      return activeRuntime;
    }catch(error){
      if(candidate&&candidate!==activeRuntime){try{candidate.stop?.()}catch(_){}}
      if(ticket===sequence){lastError=error;worldState.runtimeStatus='error';worldState.runtimeRevision=Number(worldState.runtimeRevision||0)+1;emit('error',{worldId:adapter.id,mode,ticket,message:String(error?.message||error)});}
      throw error;
    }
  }

  function stop(reason='runtime_switch'){
    const ticket=++sequence,runtime=activeRuntime,adapter=activeAdapter,mode=worldState.runtimeMode;
    activeRuntime=null;activeAdapter=null;lastError=null;worldState.runtimeStatus=runtime?'stopping':'idle';worldState.runtimeRevision=Number(worldState.runtimeRevision||0)+1;
    if(runtime)emit('stopping',{worldId:adapter?.id||worldState.worldId,mode,ticket,reason});
    try{runtime?.stop?.()}finally{worldState.runtimeStatus='idle';worldState.runtimeRevision=Number(worldState.runtimeRevision||0)+1;emit('idle',{worldId:worldState.worldId,mode,ticket,reason});}
    return !!runtime;
  }

  function planTransition(options={}){
    const plan=resolveWorldTransition(options);lastTransition=plan;emit('transition-planned',{from:plan.source.id,to:plan.target.id,portalId:plan.portal?.id||null,reason:plan.reason});return plan;
  }

  return Object.freeze({
    start,stop,planTransition,
    getRuntime:()=>activeRuntime,
    getAdapter:()=>activeAdapter,
    isActive:()=>!!activeRuntime,
    diagnostics:()=>({active:!!activeRuntime,adapterId:activeAdapter?.id||null,error:lastError?String(lastError?.message||lastError):null,lastTransition:lastTransition?{from:lastTransition.source.id,to:lastTransition.target.id,portalId:lastTransition.portal?.id||null,reason:lastTransition.reason}:null,...snapshotWorldState(worldState)})
  });
}
