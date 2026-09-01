export const PARQUE_REALTIME_VERSION='14.10.8.80-f7';
export const PARQUE_REALTIME_EVENT='competition-state';
export const PARQUE_REALTIME_CHANNEL='agv-world:parque-diversoes:v1';

const safeText=(value,fallback='')=>String(value??fallback).replace(/[^\w:@.\-]/g,'-').slice(0,96);

export function createParqueSupabaseCompetitionTransport({supabase,participantId,displayName='Jogador',channelName=PARQUE_REALTIME_CHANNEL,onStatus=()=>{}}={}){
  if(!supabase?.channel||!participantId)return null;
  const pid=safeText(participantId);if(!pid)return null;
  const listeners=new Set();let stopped=false,status='joining';
  const channel=supabase.channel(channelName,{config:{broadcast:{self:false,ack:false},presence:{key:pid}}});
  const emitStatus=(next,detail={})=>{status=String(next||status);try{onStatus({status,channel:channelName,...detail});}catch(_){}};
  channel.on('broadcast',{event:PARQUE_REALTIME_EVENT},message=>{
    const payload=message?.payload??message;
    if(!payload||payload.participantId===pid)return;
    for(const listener of listeners)try{listener(payload);}catch(_){}
  });
  channel.subscribe(next=>{
    emitStatus(String(next||'unknown').toLowerCase());
    if(next==='SUBSCRIBED'){
      try{channel.track?.({participantId:pid,displayName:String(displayName||'Jogador').slice(0,80),worldId:'parque-diversoes-agv',scene:'parque',at:Date.now()});}catch(_){}
    }
  });
  return Object.freeze({
    participantId:pid,displayName:String(displayName||'Jogador').slice(0,80),channelName,
    publish(packet){
      if(stopped||!packet)return false;
      try{const result=channel.send({type:'broadcast',event:PARQUE_REALTIME_EVENT,payload:packet});return result!==false;}catch(error){emitStatus('error',{message:String(error?.message||error)});return false;}
    },
    subscribe(listener){if(typeof listener!=='function')return()=>{};listeners.add(listener);return()=>listeners.delete(listener);},
    getStatus:()=>status,
    stop(){if(stopped)return;stopped=true;listeners.clear();try{channel.untrack?.();}catch(_){}try{supabase.removeChannel?.(channel);}catch(_){}emitStatus('closed');}
  });
}
