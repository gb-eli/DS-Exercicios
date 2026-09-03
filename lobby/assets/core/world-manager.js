import { snapshotWorldState } from './lobby-state.js?v=14.10.8.96-f948-camera-v2';
import { resolveWorldTransition } from '../world/world-navigation.js?v=14.10.8.92-f90-graphics';
import { normalizeWorldRuntime,assertWorldRuntimeV2 } from './runtime-v2/world-runtime-contract.js?v=14.10.8.96-f9412-vehicle-core';
import { createWorldContext } from './runtime-v2/world-context.js?v=14.10.8.96-f948-camera-v2';

const worldAudit=()=>globalThis.__agvWorldRuntimeAudit||null;

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
    const audit=worldAudit();const auditId=adapter.auditEnabled===false?null:audit?.begin?.({worldId:adapter.auditId||adapter.id,scene:adapter.scene,label:adapter.label,mode,quality:context?.initialQuality||null,source:'world-manager'});
    if(auditId)audit?.mark?.(auditId,'adapter',{ticket,adapterId:adapter.id,scene:adapter.scene},'pass');
    let candidate=null;
    try{
      const runtimeContext=createWorldContext({worldId:adapter.id,scene:adapter.scene,mode,state:context?.state||worldState,signal:signal||context.signal||null,quality:context?.initialQuality||null,source:'world-manager',extra:{adapterLabel:adapter.label}});
      const rawRuntime=assertRuntime(await adapter.createRuntime(mode,{...context,signal:signal||context.signal||null,runtimeContext}));
      candidate=assertWorldRuntimeV2(normalizeWorldRuntime(rawRuntime,{worldId:adapter.id,scene:adapter.scene,mode,label:adapter.label}));
      if(ticket!==sequence||signal?.aborted)throw abortError();
      activeRuntime=candidate;setIdentity(adapter,mode,'ready');emit('ready',{worldId:adapter.id,mode,ticket});
      if(auditId)audit?.mark?.(auditId,'runtime',{ticket,contractStop:true},'pass');
      return activeRuntime;
    }catch(error){
      if(candidate&&candidate!==activeRuntime){try{candidate.stop?.()}catch(_){}}
      if(ticket===sequence){lastError=error;worldState.runtimeStatus='error';worldState.runtimeRevision=Number(worldState.runtimeRevision||0)+1;emit('error',{worldId:adapter.id,mode,ticket,message:String(error?.message||error)});}
      if(auditId)audit?.fail?.(auditId,error,{ticket,phase:'world_manager_start'});
      throw error;
    }
  }

  function stop(reason='runtime_switch'){
    const ticket=++sequence,runtime=activeRuntime,adapter=activeAdapter,mode=worldState.runtimeMode;
    activeRuntime=null;activeAdapter=null;lastError=null;worldState.runtimeStatus=runtime?'stopping':'idle';worldState.runtimeRevision=Number(worldState.runtimeRevision||0)+1;
    if(runtime)emit('stopping',{worldId:adapter?.id||worldState.worldId,mode,ticket,reason});
    try{runtime?.stop?.()}finally{if(adapter?.auditEnabled!==false)worldAudit()?.stopCurrent?.(reason);worldState.runtimeStatus='idle';worldState.runtimeRevision=Number(worldState.runtimeRevision||0)+1;emit('idle',{worldId:worldState.worldId,mode,ticket,reason});}
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
