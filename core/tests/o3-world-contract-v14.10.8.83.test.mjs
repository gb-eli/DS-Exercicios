import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { WORLD_MANIFEST_REQUIRED_FIELDS, isWorldManifest } from '../../lobby/assets/world/world-manifest.js';
import { WORLD_MANIFESTS } from '../../lobby/assets/world/world-manifests.js';
import { WORLD_CONNECTIONS, validateWorldConnections } from '../../lobby/assets/world/world-connections.js';
import { WORLD_REGISTRY } from '../../lobby/assets/world/world-registry.js';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'../..');
const read=rel=>fs.readFileSync(path.join(root,rel),'utf8');
const sha=rel=>crypto.createHash('sha256').update(fs.readFileSync(path.join(root,rel))).digest('hex');

const EXPECTED_IDS=['campus-ds','vale-silicio','rural-agv','military-agv','space-agv','moon-agv','mars-agv','parque-diversoes-agv','colegio-agv','labirinto-armadilhas','museu-hardware-agv'];

test('O3 declara os 11 mundos atuais com o contrato obrigatório completo',()=>{
  assert.equal(WORLD_MANIFESTS.length,11);
  assert.deepEqual(WORLD_MANIFESTS.map(w=>w.id),EXPECTED_IDS);
  for(const world of WORLD_MANIFESTS){
    assert.equal(isWorldManifest(world),true,world.id);
    for(const field of WORLD_MANIFEST_REQUIRED_FIELDS)assert.ok(field in world,`${world.id}:${field}`);
    assert.equal(world.schemaVersion,1);
    assert.equal(Object.isFrozen(world),true);
  }
});

test('O3 preserva ids, scenes, aliases e áreas legadas sem alterar Presença',()=>{
  assert.equal(WORLD_REGISTRY.resolve('museu-hardware')?.id,'museu-hardware-agv');
  assert.equal(WORLD_REGISTRY.resolve('museu')?.presenceArea,'museu-hardware');
  assert.equal(WORLD_REGISTRY.resolve('colegio-agv')?.scene,'colegio');
  assert.equal(WORLD_REGISTRY.resolve('colegio')?.id,'colegio-agv');
  assert.equal(WORLD_REGISTRY.resolve('labyrinth-traps')?.scene,'labirinto');
  assert.equal(WORLD_REGISTRY.resolve('labirinto')?.presenceArea,'labirinto-armadilhas');
  assert.equal(WORLD_REGISTRY.byPresenceArea('central')?.id,'campus-ds');
});

test('O3 mantém bounds, spawn e contagens de metadata alinhados às fontes atuais',async()=>{
  const vale=await import('../../lobby/assets/world/vale-silicio-shared.js');
  const parque=await import('../../lobby/assets/world/parque-diversoes-agv-shared.js');
  const colegio=await import('../../lobby/assets/world/colegio-agv-shared.js');
  const lab=await import('../../lobby/assets/world/labirinto-armadilhas-shared.js');
  const museu=await import('../../lobby/assets/world/museu-hardware-shared.js');
  assert.deepEqual(WORLD_REGISTRY.get('vale-silicio').bounds,vale.VALE_BOUNDS);
  assert.deepEqual(WORLD_REGISTRY.get('parque-diversoes-agv').spawn,parque.PARQUE_SPAWN);
  assert.equal(WORLD_REGISTRY.get('colegio-agv').destinations.length,colegio.DESTINATIONS.length);
  assert.equal(WORLD_REGISTRY.get('labirinto-armadilhas').destinations.length,lab.DESTINATIONS.length);
  assert.equal(WORLD_REGISTRY.get('museu-hardware-agv').destinations.length,museu.MUSEU_HARDWARE_DESTINATIONS.length);
});

test('O3 cria grafo consistente sem referências para mundos inexistentes',()=>{
  assert.equal(validateWorldConnections(),true);
  assert.equal(WORLD_CONNECTIONS.length,10);
  for(const edge of WORLD_CONNECTIONS){
    assert.ok(WORLD_REGISTRY.has(edge.from),edge.from);
    assert.ok(WORLD_REGISTRY.has(edge.to),edge.to);
    assert.notEqual(edge.from,edge.to);
  }
  assert.equal(WORLD_REGISTRY.areConnected('space-agv','moon-agv'),true);
  assert.equal(WORLD_REGISTRY.areConnected('space-agv','mars-agv'),true);
  assert.equal(WORLD_REGISTRY.areConnected('campus-ds','museu-hardware-agv'),true);
});

test('O3 mantém manifests como metadata estática e não importa runtimes 3D',()=>{
  const source=read('lobby/assets/world/world-manifests.js');
  assert.doesNotMatch(source,/lobby3d|vale3d|rural3d|military3d|space3d|moon3d|mars3d|parque-diversoes-agv3d|museu-hardware3d|plugin-world-host/);
  assert.match(source,/createWorldManifest/);
});

test('O3 não modifica os três arquivos protegidos de backend/cache da O2',()=>{
  assert.equal(sha('lobby/sw.js'),'0cfe4c83f11685e9c97751ed17c159f2f301b8e90dfac39f8343306f18bb1433');
  assert.equal(sha('core/database/073_lobby_new_worlds.sql'),'f5e8d4a64b997b3c005a2cf8ddd0d698a6825feb8dcdd13f2b6d5ea6bf406265');
  assert.equal(sha('core/edge-functions/lobby-presence/index.ts'),'fde4f49c46ecad384244741008f056f7a9dffd2fb35488d046a17adf780b3663');
});

test('O3 mantém o runtime existente desacoplado do novo catálogo até O4/O5',()=>{
  const adapter=read('lobby/assets/core/world-adapter.js');
  const manager=read('lobby/assets/core/world-manager.js');
  assert.doesNotMatch(adapter,/world-registry|world-manifests|world-connections/);
  assert.doesNotMatch(manager,/world-registry|world-manifests|world-connections/);
});
