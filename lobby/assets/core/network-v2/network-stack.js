import { createNetworkManager } from './network-manager.js?v=14.10.8.96-f9414-network-manager';
import { createSoloTransport } from './solo-transport.js?v=14.10.8.96-f9414-network-manager';
import { createSupabaseTransport } from './supabase-transport.js?v=14.10.8.96-f9414-network-manager';
import { createColyseusTransport } from './colyseus-transport.js?v=14.10.8.96-f9414-network-manager';
import { createRealtimeAvatarPacketBuilder, createRealtimeAvatarPeerMerger } from '../../social/realtime-avatar-sync.js?v=14.10.8.96-f9414-network-manager';

export const NETWORK_STACK_VERSION=2;

export function createLobbyNetworkStack({supabase,state,getSnapshot,onUnknownPeer=()=>{},onStatus=()=>{},onTransition=()=>{},onDiagnostic=()=>{},colyseus={}}={}){
  const networkSessionId=globalThis.crypto?.randomUUID?.()||`agv-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,9)}`;
  const playerBuilder=createRealtimeAvatarPacketBuilder({state,getSnapshot});
  const colyseusPeerMerger=createRealtimeAvatarPeerMerger({state,onUnknownPeer});
  const transports=[
    createColyseusTransport({endpoint:colyseus.endpoint||'',roomName:colyseus.roomName||'agv-world',clientFactory:colyseus.clientFactory||null,clientModuleUrl:colyseus.clientModuleUrl||'',getJoinOptions:()=>({userId:state.user?.id||null,sessionId:networkSessionId,worldId:state.player?.worldId||state.scene||'campus-ds',scene:state.scene||'campus'})}),
    createSupabaseTransport({supabase,state,getSnapshot,onUnknownPeer,onStatus}),
    createSoloTransport()
  ];
  const manager=createNetworkManager({
    transports,
    getContext:()=>({userId:state.user?.id||'',worldId:state.player?.worldId||state.scene||'campus-ds',area:state.player?.area||'',sessionId:networkSessionId}),
    getPlayerPacket:({full=false}={})=>playerBuilder.packetSnapshot(full),
    onTransition,onDiagnostic
  });
  manager.on('player_state',envelope=>{if(envelope?.senderId===state.user?.id)return;colyseusPeerMerger.mergePeer(envelope?.payload);});
  return manager;
}
