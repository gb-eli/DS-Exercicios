const withTimeout=(promise,ms,code='colyseus_timeout')=>{let timer;return Promise.race([Promise.resolve(promise),new Promise((_,reject)=>{timer=setTimeout(()=>reject(new Error(code)),ms);})]).finally(()=>clearTimeout(timer));};

export function createColyseusTransport({endpoint='',roomName='agv-world',clientFactory=null,clientModuleUrl='',connectTimeoutMs=3500,getJoinOptions=()=>({})}={}){
  let client=null,room=null,connected=false,lastError='',connectedAt=0,lastMessageAt=0,sent=0,received=0,handler=()=>{},context={};
  async function resolveClientFactory(){
    if(typeof clientFactory==='function')return clientFactory;
    if(globalThis.Colyseus?.Client)return url=>new globalThis.Colyseus.Client(url);
    if(clientModuleUrl){const mod=await import(clientModuleUrl);const Client=mod?.Client||mod?.default?.Client;if(Client)return url=>new Client(url);}
    return null;
  }
  return{
    name:'colyseus',priority:10,mode:'performance',capabilities:{playerStream:true,vehicleStream:true,interactionStream:true,authoritative:true,local:false},
    setMessageHandler(next){handler=typeof next==='function'?next:()=>{};},
    setContext(next={}){context={...context,...next};return true;},
    async connect(nextContext={}){
      context={...context,...nextContext};
      if(connected&&room)return true;
      if(!/^wss?:\/\//i.test(String(endpoint||''))){lastError='endpoint_unconfigured';return false;}
      try{
        const factory=await resolveClientFactory();if(!factory){lastError='client_unavailable';return false;}
        client=factory(endpoint);
        const options={...(await Promise.resolve(getJoinOptions(context))),worldId:context.worldId||undefined,area:context.area||undefined};
        room=await withTimeout(client.joinOrCreate(roomName,options),connectTimeoutMs,'colyseus_connect_timeout');
        if(!room){lastError='room_unavailable';return false;}
        room.onMessage?.('network-v2',packet=>{received+=1;lastMessageAt=Date.now();handler(packet);});
        room.onLeave?.(()=>{connected=false;});
        room.onError?.((code,message)=>{lastError=`${code||'room_error'}:${message||''}`;connected=false;});
        connected=true;connectedAt=Date.now();lastError='';return true;
      }catch(error){lastError=String(error?.message||error).slice(0,180);connected=false;room=null;return false;}
    },
    async disconnect(){connected=false;try{await room?.leave?.(true)}catch(_){}room=null;client=null;return true;},
    async send(packet){if(!connected||!room)return false;try{room.send('network-v2',packet);sent+=1;return true;}catch(error){lastError=String(error?.message||error).slice(0,180);connected=false;return false;}},
    async health(){return{ok:!!connected&&!!room,state:connected?'connected':'failed',latencyMs:null,lastMessageAt,lastError};},
    diagnostics(){return{endpointConfigured:/^wss?:\/\//i.test(String(endpoint||'')),roomName,connected,connectedAt,lastMessageAt,sent,received,lastError};}
  };
}
