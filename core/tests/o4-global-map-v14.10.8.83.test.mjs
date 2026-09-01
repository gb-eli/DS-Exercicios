import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { createGlobalMapSnapshot, GLOBAL_MAP_LAYOUT, buildWorldPopulation, globalMapAvailability } from '../../lobby/assets/world/global-map.js';
import { WORLD_REGISTRY } from '../../lobby/assets/world/world-registry.js';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'../..');
const read=rel=>fs.readFileSync(path.join(root,rel),'utf8');
const sha=rel=>crypto.createHash('sha256').update(fs.readFileSync(path.join(root,rel))).digest('hex');

test('O4 monta visão lógica dos 11 mundos e das 10 conexões sem carregar 3D',()=>{
  const snapshot=createGlobalMapSnapshot({currentScene:'campus',currentArea:'central'});
  assert.equal(snapshot.worlds.length,11);
  assert.equal(snapshot.connections.length,10);
  assert.equal(snapshot.currentWorldId,'campus-ds');
  assert.equal(snapshot.selectedWorldId,'campus-ds');
  for(const world of snapshot.worlds){
    assert.ok(Number.isFinite(world.position.x),world.id);
    assert.ok(Number.isFinite(world.position.y),world.id);
    assert.ok(GLOBAL_MAP_LAYOUT.has(world.id),world.id);
  }
  const source=read('lobby/assets/world/global-map.js');
  assert.doesNotMatch(source,/3d\.js|lobby3d|plugin-world-host|createWorldManager|new\s+THREE|WebGLRenderer|import\s*\(/i);
});

test('O4 calcula população usando aliases de presença existentes sem alterar Presence',()=>{
  const rows=[
    {student_id:'a',area:'central'},
    {student_id:'b',area:'museu-hardware'},
    {student_id:'c',area:'labirinto-armadilhas'},
    {student_id:'d',area:'colegio-agv'},
    {student_id:'e',area:'moon-agv'}
  ];
  const counts=buildWorldPopulation(rows,{scene:'colegio',area:'colegio-agv'});
  assert.equal(counts.get('campus-ds'),1);
  assert.equal(counts.get('museu-hardware-agv'),1);
  assert.equal(counts.get('labirinto-armadilhas'),1);
  assert.equal(counts.get('colegio-agv'),2);
  assert.equal(counts.get('moon-agv'),1);
});

test('O4 expõe disponibilidade, conexões, portais, POIs e eventos/experiências por metadata',()=>{
  const snapshot=createGlobalMapSnapshot({currentScene:'parque',currentArea:'parque-diversoes-agv'});
  const parque=snapshot.worlds.find(world=>world.id==='parque-diversoes-agv');
  const space=snapshot.worlds.find(world=>world.id==='space-agv');
  assert.equal(globalMapAvailability(WORLD_REGISTRY.get('campus-ds')).label,'Disponível');
  assert.ok(parque.portals.length>=1);
  assert.ok(parque.pois.length>=1);
  assert.ok(parque.events.some(event=>/race|challenge|ride/i.test(String(event.kind||event.id))));
  assert.deepEqual(space.connectionIds.sort(),['campus-ds','mars-agv','moon-agv'].sort());
});

test('O4 adiciona HUD e modal global acessíveis sem substituir mapa local ou teletransporte',()=>{
  const html=read('lobby/index.html');
  const lobby=read('lobby/assets/lobby.js');
  assert.match(html,/id="global-map-button"/);
  assert.match(html,/id="global-map-modal"/);
  assert.match(html,/id="global-map-nodes"/);
  assert.match(html,/id="global-map-detail-portals"/);
  assert.match(html,/id="global-map-detail-pois"/);
  assert.match(html,/id="global-map-detail-events"/);
  assert.match(lobby,/createGlobalMapSnapshot/);
  assert.match(lobby,/function renderGlobalMap\(/);
  assert.match(lobby,/global-map-teleport/);
  assert.match(lobby,/openTeleportModal\(\)/);
});

test('O4 mantém ação de viagem desacoplada: mapa global não inicia runtime nem chama portais diretamente',()=>{
  const lobby=read('lobby/assets/lobby.js');
  const start=lobby.indexOf('let globalMapSelectedWorldId=');
  const end=lobby.indexOf('function solarBodyPosition',start);
  assert.ok(start>=0&&end>start);
  const block=lobby.slice(start,end);
  assert.doesNotMatch(block,/worldManager\.(start|stop)|start3D\(|startLite\(|enterVale\(|enterRural\(|enterMilitary\(|enterSpace\(|enterMoon\(|enterMars\(|enterParque\(|enterColegio\(|enterLabirinto\(|enterMuseu\(/);
  assert.doesNotMatch(block,/state\.runtime/);
});

test('O4 preserva Chat, Banco, Edge Function e Service Worker da O3',()=>{
  assert.equal(sha('lobby/assets/social/proximity-chat.js'),'d79d006c920f60c5911bfafdebdc5d2309fc1b52a4748bbcdda022b92c164a5f');
  assert.equal(sha('lobby/sw.js'),'0cfe4c83f11685e9c97751ed17c159f2f301b8e90dfac39f8343306f18bb1433');
  assert.equal(sha('core/database/073_lobby_new_worlds.sql'),'f5e8d4a64b997b3c005a2cf8ddd0d698a6825feb8dcdd13f2b6d5ea6bf406265');
  assert.equal(sha('core/edge-functions/lobby-presence/index.ts'),'fde4f49c46ecad384244741008f056f7a9dffd2fb35488d046a17adf780b3663');
});

test('O4 mantém WorldManager e adapters fora do contrato de visualização',()=>{
  const manager=read('lobby/assets/core/world-manager.js');
  const adapter=read('lobby/assets/core/world-adapter.js');
  assert.doesNotMatch(manager,/global-map/);
  assert.doesNotMatch(adapter,/global-map/);
});
