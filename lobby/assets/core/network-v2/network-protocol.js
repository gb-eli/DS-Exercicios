export const NETWORK_PROTOCOL_VERSION=3;
export const NETWORK_PACKET_TYPES=Object.freeze(['player_state','vehicle_state','interaction','world_event','heartbeat','ack']);
const VALID_TYPES=new Set(NETWORK_PACKET_TYPES);
const finite=(value,fallback=0)=>Number.isFinite(Number(value))?Number(value):fallback;
const text=(value,max=64)=>String(value??'').slice(0,max);

export function createNetworkEnvelope({type,payload=null,senderId='',worldId='',area='',seq=0,ts=Date.now(),transport='',sessionId=''}={}){
  const packetType=VALID_TYPES.has(String(type))?String(type):'world_event';
  return Object.freeze({
    v:NETWORK_PROTOCOL_VERSION,
    type:packetType,
    senderId:text(senderId,80),
    worldId:text(worldId,64),
    area:text(area,64),
    seq:Math.max(0,Math.floor(finite(seq))),
    ts:Math.max(0,Math.floor(finite(ts,Date.now()))),
    transport:text(transport,24),
    sessionId:text(sessionId,80),
    payload
  });
}

export function isNetworkEnvelope(packet){
  return !!packet&&packet.v===NETWORK_PROTOCOL_VERSION&&VALID_TYPES.has(String(packet.type))&&typeof packet.senderId==='string'&&Number.isFinite(Number(packet.seq))&&Number.isFinite(Number(packet.ts));
}

export function networkEnvelopeKey(packet={}){
  return `${String(packet.sessionId||packet.senderId||'unknown')}|${String(packet.senderId||'unknown')}|${String(packet.type||'unknown')}|${Math.max(0,Math.floor(finite(packet.seq)))}`;
}

export function networkEnvelopeFresh(packet,{now=Date.now(),maxAgeMs=12000,maxFutureMs=3000}={}){
  if(!isNetworkEnvelope(packet))return false;
  const delta=finite(packet.ts)-finite(now);
  return delta<=maxFutureMs&&delta>=-Math.max(1000,finite(maxAgeMs,12000));
}

export function sanitizeInteractionPayload(input={}){
  return Object.freeze({
    targetId:text(input.targetId||input.id,96)||null,
    targetType:text(input.targetType||input.type,32)||null,
    verb:text(input.verb,32)||null,
    level:Number.isFinite(Number(input.level))?Math.max(0,Math.min(5,Math.floor(Number(input.level)))):null,
    phase:text(input.phase,24)||null
  });
}

export const NETWORK_PROTOCOL=Object.freeze({version:NETWORK_PROTOCOL_VERSION,types:NETWORK_PACKET_TYPES});
