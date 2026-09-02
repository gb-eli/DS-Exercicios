import {describeInteraction,INTERACTION_CONTRACT_VERSION} from './interaction-contract.js?v=14.10.8.96-f949-interaction-v2';
const now=()=>typeof performance!=='undefined'&&performance.now?performance.now():Date.now();
const resultObject=(value,descriptor)=>{if(value&&typeof value==='object')return{ok:value.ok!==false,handled:value.handled!==false,...value,descriptor};if(value===false)return{ok:false,handled:false,descriptor};return{ok:true,handled:true,value,descriptor};};
export function createInteractionManager({getState=()=>null,getRuntime=()=>null,onVisual=()=>{},onAudit=()=>{},onAnimation=()=>{},cooldownMs=220}={}){
  let busy=false,lastAt=0,lastId=null;
  function describe(target,context={}){return describeInteraction(target,{state:getState(),runtime:getRuntime(),...context});}
  async function execute(target,{executor,context={}}={}){
    const descriptor=describe(target,context),started=now();
    if(!descriptor.enabled){const result={ok:false,handled:false,blocked:true,reason:'interaction_unavailable',descriptor};onAudit('blocked',result);return result;}
    if(busy&&lastId===descriptor.id&&started-lastAt<cooldownMs){return{ok:false,handled:false,blocked:true,reason:'interaction_debounced',descriptor};}
    busy=true;lastAt=started;lastId=descriptor.id;onVisual('start',descriptor);onAudit('start',{descriptor});
    if(descriptor.animation)try{onAnimation(descriptor.animation,descriptor)}catch(_){}
    try{
      const value=typeof executor==='function'?await executor(descriptor):false,result=resultObject(value,descriptor);result.durationMs=Math.max(0,Math.round(now()-started));
      onVisual(result.ok?'success':'fail',descriptor,result);onAudit(result.ok?'success':'fail',result);return result;
    }catch(error){const result={ok:false,handled:false,error:String(error?.message||error||'interaction_error'),durationMs:Math.max(0,Math.round(now()-started)),descriptor};onVisual('error',descriptor,result);onAudit('error',result);return result;}
    finally{setTimeout(()=>{busy=false;},Math.min(260,cooldownMs));}
  }
  return Object.freeze({version:INTERACTION_CONTRACT_VERSION,describe,execute,isBusy:()=>busy});
}
