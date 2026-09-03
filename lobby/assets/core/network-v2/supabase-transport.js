import { createRealtimeAvatarSync } from '../../social/realtime-avatar-sync.js?v=14.10.8.96-f9414-network-manager';

export function createSupabaseTransport({supabase,state,getSnapshot,onUnknownPeer=()=>{},onStatus=()=>{}}={}){
  let avatarSync=null,channel=null,connected=false,avatarReady=false,genericReady=false,handler=()=>{},context={},lastError='',sent=0,received=0,connectedAt=0;
  const topic='agv-lobby-network-v2';
  function ensureAvatar(){if(avatarSync)return avatarSync;avatarSync=createRealtimeAvatarSync({supabase,state,getSnapshot,onUnknownPeer,onStatus:status=>{avatarReady=status==='SUBSCRIBED'?true:['CHANNEL_ERROR','TIMED_OUT','CLOSED'].includes(status)?false:avatarReady;connected=avatarReady||genericReady;onStatus({layer:'avatar',status});}});return avatarSync;}
  async function connectGeneric(){
    if(channel&&genericReady)return true;
    return new Promise(resolve=>{
      let settled=false,deadline=null;const finish=value=>{if(settled)return;settled=true;if(deadline)clearTimeout(deadline);resolve(value);};
      try{
        deadline=setTimeout(()=>finish(false),3500);
        channel=supabase.channel(topic,{config:{broadcast:{self:false,ack:false}}}).on('broadcast',{event:'network-v2'},message=>{received+=1;handler(message?.payload);}).subscribe(status=>{
          if(status==='SUBSCRIBED')genericReady=true;else if(['CHANNEL_ERROR','TIMED_OUT','CLOSED'].includes(status))genericReady=false;connected=avatarReady||genericReady;onStatus({layer:'generic',status});if(status==='SUBSCRIBED')finish(true);else if(['CHANNEL_ERROR','TIMED_OUT','CLOSED'].includes(status))finish(false);
        });
      }catch(error){lastError=String(error?.message||error).slice(0,180);finish(false);}
    });
  }
  return{
    name:'supabase',priority:50,mode:'contingency',capabilities:{playerStream:true,vehicleStream:true,interactionStream:true,authoritative:false,local:false,handlesPlayerStream:true},
    setMessageHandler(next){handler=typeof next==='function'?next:()=>{};},
    setContext(next={}){context={...context,...next};return true;},
    async connect(nextContext={}){
      context={...context,...nextContext};
      try{
        const [avatarOk,generic]=await Promise.all([ensureAvatar().ensure(),connectGeneric()]);
        avatarReady=!!avatarOk;connected=avatarReady||!!generic;if(connected){connectedAt=Date.now();lastError='';}else lastError='supabase_realtime_unavailable';
        return connected;
      }catch(error){lastError=String(error?.message||error).slice(0,180);connected=false;return false;}
    },
    async disconnect(){connected=false;avatarReady=false;genericReady=false;try{await avatarSync?.stop?.()}catch(_){}avatarSync=null;if(channel){try{await supabase.removeChannel(channel)}catch(_){}channel=null;}return true;},
    async send(packet){if(!connected)return false;if(packet?.type==='player_state'){ensureAvatar().burst();sent+=1;return true;}if(!genericReady||!channel)return false;try{const result=await channel.send({type:'broadcast',event:'network-v2',payload:packet});if(result==='ok'||result===undefined){sent+=1;return true;}lastError=`broadcast_${result}`;return false;}catch(error){lastError=String(error?.message||error).slice(0,180);return false;}},
    burstPlayer(){if(!connected)return false;ensureAvatar().burst();return true;},
    async health(){return{ok:connected&&(genericReady||avatarReady),state:connected?'connected':'failed',latencyMs:null,lastError};},
    diagnostics(){return{connected,avatarReady,genericReady,connectedAt,sent,received,lastError,context:{worldId:context.worldId||null,area:context.area||null}};}
  };
}
