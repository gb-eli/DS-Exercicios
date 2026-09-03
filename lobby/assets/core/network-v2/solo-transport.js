export function createSoloTransport(){
  let connected=false,sent=0,context={};
  return{
    name:'solo',priority:999,mode:'solo',capabilities:{playerStream:false,vehicleStream:false,interactionStream:false,authoritative:false,local:true},
    async connect(nextContext={}){context={...context,...nextContext};connected=true;return true;},
    async disconnect(){connected=false;return true;},
    async send(){if(!connected)return false;sent+=1;return true;},
    async health(){return{ok:connected,latencyMs:0,state:connected?'connected':'idle'};},
    setContext(next={}){context={...context,...next};return true;},
    diagnostics(){return{connected,sent,context:{worldId:context.worldId||null,area:context.area||null}};}
  };
}
