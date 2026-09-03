export const TRANSPORT_CONTRACT_VERSION=1;
export const TRANSPORT_STATES=Object.freeze(['idle','connecting','connected','degraded','failed','closed']);

export function normalizeTransport(transport,{name='transport',priority=100,mode='contingency'}={}){
  if(!transport||typeof transport!=='object')throw new TypeError('network_transport_invalid');
  for(const method of ['connect','disconnect','send','health'])if(typeof transport[method]!=='function')throw new TypeError(`network_transport_method_missing:${method}`);
  let messageHandler=()=>{};
  if(typeof transport.setMessageHandler==='function')transport.setMessageHandler(packet=>messageHandler(packet));
  const facade={
    __agvTransportContractVersion:TRANSPORT_CONTRACT_VERSION,
    name:String(transport.name||name),
    priority:Number.isFinite(Number(transport.priority))?Number(transport.priority):priority,
    mode:String(transport.mode||mode),
    capabilities:Object.freeze({...transport.capabilities}),
    connect:(...args)=>transport.connect(...args),
    disconnect:(...args)=>transport.disconnect(...args),
    send:(...args)=>transport.send(...args),
    health:(...args)=>transport.health(...args),
    burstPlayer:(...args)=>typeof transport.burstPlayer==='function'?transport.burstPlayer(...args):false,
    setContext:(...args)=>typeof transport.setContext==='function'?transport.setContext(...args):false,
    diagnostics:()=>typeof transport.diagnostics==='function'?transport.diagnostics():{},
    onMessage(handler){messageHandler=typeof handler==='function'?handler:()=>{};return()=>{if(messageHandler===handler)messageHandler=()=>{};};},
    raw:transport
  };
  return Object.freeze(facade);
}

export function assertTransportV1(transport){
  if(!transport||transport.__agvTransportContractVersion!==TRANSPORT_CONTRACT_VERSION)throw new TypeError('network_transport_v1_required');
  return transport;
}
