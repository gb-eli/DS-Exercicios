import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

const root=path.resolve(new URL('../..',import.meta.url).pathname);
const read=rel=>fs.readFileSync(path.join(root,rel),'utf8');
const imp=rel=>import(pathToFileURL(path.join(root,rel)).href+`?f9414=${Math.random()}`);
const protocol=await imp('lobby/assets/core/network-v2/network-protocol.js');
const {createNetworkManager}=await imp('lobby/assets/core/network-v2/network-manager.js');
const {createSoloTransport}=await imp('lobby/assets/core/network-v2/solo-transport.js');
const {createSupabaseTransport}=await imp('lobby/assets/core/network-v2/supabase-transport.js');
const {createColyseusTransport}=await imp('lobby/assets/core/network-v2/colyseus-transport.js');
const {createRealtimeAvatarPacketBuilder,createRealtimeAvatarPeerMerger}=await imp('lobby/assets/social/realtime-avatar-sync.js');

const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
function fakeTransport({name,priority,mode,allowConnect=true,healthy=true}={}){
  let connected=false,handler=()=>{},sent=[];
  const api={
    name,priority,mode,capabilities:{playerStream:true,vehicleStream:true,interactionStream:true,authoritative:mode==='performance'},
    setMessageHandler(fn){handler=fn;},setContext(){},
    async connect(){connected=!!api.allowConnect;return connected;},async disconnect(){connected=false;return true;},
    async send(packet){if(!connected)return false;sent.push(packet);return true;},
    async health(){return{ok:connected&&api.healthy,state:connected?'connected':'failed'};},
    diagnostics(){return{connected,sent:sent.length};},emit(packet){handler(packet);},
    allowConnect,healthy,get sent(){return sent;},get connected(){return connected;}
  };return api;
}

test('Network Protocol V3 cria envelope comum, sanitiza e rejeita pacote velho',()=>{
  const p=protocol.createNetworkEnvelope({type:'interaction',senderId:'u1',worldId:'campus-ds',area:'central',seq:2,payload:protocol.sanitizeInteractionPayload({targetId:'door',type:'door',verb:'Abrir',level:3,phase:'success'})});
  assert.equal(p.v,protocol.NETWORK_PROTOCOL_VERSION);assert.equal(p.type,'interaction');assert.equal(p.senderId,'u1');assert.equal(p.payload.targetId,'door');assert.equal(protocol.isNetworkEnvelope(p),true);assert.equal(protocol.networkEnvelopeFresh(p),true);assert.equal(protocol.networkEnvelopeKey(p),'u1|u1|interaction|2');
  const stale={...p,ts:Date.now()-30000};assert.equal(protocol.networkEnvelopeFresh(stale),false);
});

test('NetworkManager inicia em contingência quando performance está indisponível e mantém Solo como último fallback',async()=>{
  const perf=fakeTransport({name:'colyseus',priority:10,mode:'performance',allowConnect:false});
  const cont=fakeTransport({name:'supabase',priority:50,mode:'contingency',allowConnect:true});
  const solo=createSoloTransport();
  const manager=createNetworkManager({transports:[perf,cont,solo],getContext:()=>({userId:'u',worldId:'campus-ds',area:'central'}),monitorIntervalMs:1000,failbackIntervalMs:1000,minModeHoldMs:1000});
  assert.equal(await manager.start(),true);assert.equal(manager.getActiveMode(),'contingency');assert.equal(manager.getActiveTransport(),'supabase');await manager.stop();
});

test('NetworkManager faz failback com hold mínimo e depois failover por limiar de saúde',async()=>{
  const perf=fakeTransport({name:'colyseus',priority:10,mode:'performance',allowConnect:false,healthy:true});
  const cont=fakeTransport({name:'supabase',priority:50,mode:'contingency',allowConnect:true,healthy:true});
  const manager=createNetworkManager({transports:[perf,cont,createSoloTransport()],getContext:()=>({userId:'u'}),monitorIntervalMs:20,failbackIntervalMs:20,minModeHoldMs:70,failureThreshold:2});
  await manager.start();assert.equal(manager.getActiveMode(),'contingency');perf.allowConnect=true;
  await sleep(35);assert.equal(manager.getActiveMode(),'contingency','anti-flapping deve segurar o modo antes do hold mínimo');
  await sleep(90);assert.equal(manager.getActiveMode(),'performance','transport de maior prioridade deve reassumir após estabilidade');
  perf.healthy=false;await sleep(70);assert.equal(manager.getActiveMode(),'contingency','duas falhas de saúde devem acionar contingência');
  const d=manager.getDiagnostics();assert.ok(d.failbacks>=1);assert.ok(d.failovers>=1);await manager.stop();
});

test('NetworkManager deduplica envelopes e publica veículo/interação pelo protocolo comum',async()=>{
  const cont=fakeTransport({name:'supabase',priority:10,mode:'contingency'});const manager=createNetworkManager({transports:[cont],getContext:()=>({userId:'u1',worldId:'campus-ds',area:'central'}),monitorIntervalMs:1000});await manager.start();
  let seen=0;manager.on('vehicle_state',()=>seen++);const packet=protocol.createNetworkEnvelope({type:'vehicle_state',senderId:'u2',worldId:'campus-ds',seq:7,payload:{id:'car',driverId:'u2',x:1,z:2}});manager.handleIncoming(packet);manager.handleIncoming(packet);assert.equal(seen,1);assert.equal(manager.getDiagnostics().droppedDuplicate,1);
  await manager.publishVehicle({id:'car',driverId:'u1',x:2,z:3});await manager.publishInteraction({targetId:'door',targetType:'door',verb:'Abrir',level:3,phase:'success'});assert.ok(cont.sent.some(p=>p.type==='vehicle_state'));assert.ok(cont.sent.some(p=>p.type==='interaction'));await manager.stop();
});

test('Realtime avatar packet builder/merger preserva protocolo v2 existente para SupabaseTransport',()=>{
  const state={user:{id:'u1'},scene:'campus',player:{x:10,y:20,area:'central'},others:[{student_id:'u2',x:0,y:0}]};const builder=createRealtimeAvatarPacketBuilder({state,getSnapshot:()=>({scene:'campus',area:'central',x:10,y:20,heading:1,moving:true,avatarStyle:{accentCss:'#36d2ff'}})});const own=builder.packetSnapshot(true);assert.equal(own.v,2);assert.equal(own.userId,'u1');
  const merger=createRealtimeAvatarPeerMerger({state});assert.equal(merger.mergePeer({...own,userId:'u2',seq:1,x:33,y:44,ts:Date.now()}),true);assert.equal(state.others[0].x,33);assert.equal(state.others[0].y,44);
});

test('ColyseusTransport permanece opcional quando endpoint/client ainda não estão configurados',async()=>{
  const t=createColyseusTransport({endpoint:''});assert.equal(await t.connect({worldId:'campus-ds'}),false);assert.equal((await t.health()).ok,false);assert.equal(t.diagnostics().endpointConfigured,false);
});


test('ColyseusTransport conecta via clientFactory injetado e envia/recebe network-v2',async()=>{
  let receive=null,sent=[];const room={onMessage(type,fn){assert.equal(type,'network-v2');receive=fn;},onLeave(){},onError(){},send(type,payload){sent.push({type,payload});},async leave(){}};
  const transport=createColyseusTransport({endpoint:'wss://game.example.test',clientFactory:()=>({joinOrCreate:async(name,options)=>{assert.equal(name,'agv-world');assert.equal(options.worldId,'campus-ds');return room;}})});let inbound=null;transport.setMessageHandler(p=>inbound=p);assert.equal(await transport.connect({worldId:'campus-ds'}),true);const packet={v:3,type:'heartbeat',senderId:'u',seq:1,ts:Date.now()};assert.equal(await transport.send(packet),true);assert.equal(sent.length,1);receive(packet);assert.equal(inbound,packet);assert.equal((await transport.health()).ok,true);await transport.disconnect();
});

test('SupabaseTransport encapsula avatar realtime legado e broadcast genérico sem trocar o contrato',async()=>{
  const previousMatch=globalThis.matchMedia,previousDocument=globalThis.document;globalThis.matchMedia=()=>({matches:false});globalThis.document={hidden:false};
  const channels=[],sent=[];const supabase={channel(name){const c={name,on(){return c;},subscribe(cb){cb('SUBSCRIBED');return c;},async send(msg){sent.push({name,msg});return'ok';}};channels.push(c);return c;},async removeChannel(){}};
  const state={user:{id:'u1'},scene:'campus',player:{x:1,y:2,area:'central'},others:[]};const transport=createSupabaseTransport({supabase,state,getSnapshot:()=>({scene:'campus',area:'central',x:1,y:2})});assert.equal(await transport.connect({worldId:'campus-ds'}),true);assert.equal(transport.diagnostics().avatarReady,true);assert.equal(transport.diagnostics().genericReady,true);assert.equal(await transport.send({type:'vehicle_state',payload:{id:'v'}}),true);assert.ok(sent.some(x=>x.name==='agv-lobby-network-v2'));transport.burstPlayer();await sleep(5);assert.ok(sent.some(x=>x.name==='agv-lobby-avatar-state-v85'));await transport.disconnect();globalThis.matchMedia=previousMatch;if(previousDocument===undefined)delete globalThis.document;else globalThis.document=previousDocument;
});

test('Lobby integra NetworkManager de forma lazy, mantém fallback legado e não o torna boot crítico',()=>{
  const lobby=read('lobby/assets/lobby.js'),boot=read('lobby/assets/boot.js'),sw=read('lobby/sw.js');
  assert.match(lobby,/import\('\.\/core\/network-v2\/network-stack\.js\?v=14\.10\.8\.96-f9414-network-manager'\)/);assert.match(lobby,/ensureLegacyAvatarRealtime/);assert.match(lobby,/publishVehicle/);assert.match(lobby,/publishInteraction/);assert.match(lobby,/__agvNetworkManager/);
  const required=boot.match(/const requiredAssets=\[([^\]]+)\]/s)?.[1]||'';assert.doesNotMatch(required,/network-v2/,'NetworkManager deve continuar fora do gate crítico');assert.match(boot,/boot_optional_asset_warning/);assert.match(sw,/OPTIONAL_SHELL[\s\S]*network-v2\/network-stack\.js/);
});

test('SupabaseTransport é o wrapper do avatar realtime e modos/estado ficam explícitos',()=>{
  const transport=read('lobby/assets/core/network-v2/supabase-transport.js'),state=read('lobby/assets/core/lobby-state.js');assert.match(transport,/createRealtimeAvatarSync/);assert.match(transport,/handlesPlayerStream:true/);assert.match(transport,/agv-lobby-network-v2/);assert.match(state,/networkMode:'solo'/);assert.match(state,/networkTransport:null/);
});

test('cache F94.14 usa stage77 e diagnósticos identificam release',()=>{
  assert.match(read('lobby/sw.js'),/stage77-f9414-network-manager/);assert.match(read('lobby/index.html'),/stage77-f9414-network-manager/);assert.match(read('lobby/assets/boot.js'),/stage77-f9414-network-manager/);assert.match(read('lobby/assets/diagnostics.js'),/14\.10\.8\.96-F94\.14/);
});

test('F94.14 não adiciona migrations nem Edge Functions ao contrato de rede',()=>{
  for(const rel of ['lobby/assets/core/network-v2/network-manager.js','lobby/assets/core/network-v2/network-protocol.js','lobby/assets/core/network-v2/transport-contract.js','lobby/assets/core/network-v2/colyseus-transport.js','lobby/assets/core/network-v2/solo-transport.js'])assert.doesNotMatch(read(rel),/service_role|edge-functions|iresvqw|from\('lobby_/i,rel);
});
