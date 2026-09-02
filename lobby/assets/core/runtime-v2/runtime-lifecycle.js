export function createRuntimeLifecycle({onEvent=()=>{}}={}){
  let phase='created',revision=0;
  const emit=(type,detail={})=>{phase=type;revision++;try{onEvent({type,phase,revision,...detail})}catch(_){}};
  return Object.freeze({mark:emit,getPhase:()=>phase,getRevision:()=>revision,snapshot:()=>Object.freeze({phase,revision})});
}
