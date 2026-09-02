import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const root=path.resolve(new URL('../..',import.meta.url).pathname);
const contractUrl=pathToFileURL(path.join(root,'lobby/assets/core/interaction-v2/interaction-contract.js')).href+'?f949test';
const managerUrl=pathToFileURL(path.join(root,'lobby/assets/core/interaction-v2/interaction-manager.js')).href+'?f949test';
const {describeInteraction,INTERACTION_LEVELS}=await import(contractUrl);
const {createInteractionManager}=await import(managerUrl);

test('contrato classifica interação jogável, multiplayer e informativa sem prometer função falsa',()=>{
  const car=describeInteraction({id:'car',type:'campus-vehicle'});assert.equal(car.verb,'drive');assert.equal(car.level,4);assert.equal(car.button,'Usar veículo');
  const heli=describeInteraction({id:'heli',type:'campus-aerial-vehicle'});assert.equal(heli.verb,'pilot');assert.equal(heli.level,4);
  const net=describeInteraction({id:'net',type:'campus-network-vehicle'});assert.equal(net.level,5);assert.equal(net.authoritative,true);
  const fake=describeInteraction({id:'vale-car',type:'vale-vehicle'});assert.equal(fake.level,1);assert.equal(fake.verb,'inspect');assert.equal(fake.button,'Examinar');assert.match(fake.note,/sem direção/i);
  const unknown=describeInteraction({id:'decor',type:'unknown-decoration'});assert.equal(unknown.level,INTERACTION_LEVELS.DECORATIVE);assert.equal(unknown.enabled,false);assert.equal(unknown.button,'Apenas cenário');
});

test('portais e experiências usam verbos semânticos padronizados',()=>{
  assert.equal(describeInteraction({type:'world-portal'}).verb,'travel');
  assert.equal(describeInteraction({type:'slide'}).verb,'ride');
  assert.equal(describeInteraction({type:'parkour'}).verb,'play');
  assert.equal(describeInteraction({type:'tool-elevator'}).level,3);
});

test('manager produz feedback, auditoria e normaliza resultado',async()=>{
  const events=[];const manager=createInteractionManager({onVisual:(phase)=>events.push(`visual:${phase}`),onAudit:(phase)=>events.push(`audit:${phase}`),cooldownMs:1});
  const result=await manager.execute({id:'npc-1',type:'npc'},{executor:()=>true});
  assert.equal(result.ok,true);assert.equal(result.handled,true);assert.ok(events.includes('visual:start'));assert.ok(events.includes('visual:success'));assert.ok(events.includes('audit:success'));
});

test('manager bloqueia elementos sem interação ativa',async()=>{
  const manager=createInteractionManager({cooldownMs:1});let called=false;
  const result=await manager.execute({id:'decor',type:'unknown-decoration'},{executor:()=>{called=true;return true;}});
  assert.equal(result.blocked,true);assert.equal(called,false);
});

test('Lobby integra Interaction V2 no pipeline central',()=>{
  const src=fs.readFileSync(path.join(root,'lobby/assets/lobby.js'),'utf8');
  assert.match(src,/createInteractionManager/);assert.match(src,/runInteractionV2/);assert.match(src,/interactionManager\.describe/);assert.match(src,/onInteract:action=>interact\(action\)/);
  assert.doesNotMatch(src,/onInteract:action=>\{worldAudit\(\)\?\.markInteraction/);
});

test('UI identifica níveis, estado de execução e erro/sucesso',()=>{
  const css=fs.readFileSync(path.join(root,'lobby/assets/lobby.css'),'utf8');
  assert.match(css,/F94\.9 — Interaction V2/);assert.match(css,/data-interaction-level="5"/);assert.match(css,/interaction-success/);assert.match(css,/interaction-error/);
});

test('cache da fase corrente preserva o contrato e o manager da Interaction V2',()=>{
  const sw=fs.readFileSync(path.join(root,'lobby/sw.js'),'utf8');const boot=fs.readFileSync(path.join(root,'lobby/assets/boot.js'),'utf8');const html=fs.readFileSync(path.join(root,'lobby/index.html'),'utf8');
  assert.match(sw,/stage(?:71-f949-interaction-v2|72-f9491-campus3d-hotfix|73-f9410-modular-streaming)/);assert.match(sw,/interaction-v2\/interaction-contract\.js/);assert.match(sw,/interaction-v2\/interaction-manager\.js/);
  assert.match(boot,/interaction-v2\/interaction-contract\.js/);assert.match(boot,/interaction-v2\/interaction-manager\.js/);assert.match(html,/stage(?:71-f949-interaction-v2|72-f9491-campus3d-hotfix|73-f9410-modular-streaming)/);
});

test('tipos antes enganosos não aparecem como dirigir/jogar',()=>{
  const vale=describeInteraction({type:'vale-vehicle'});const sport=describeInteraction({type:'vale-sport'});const support=describeInteraction({type:'military-support-vehicle'});
  assert.notEqual(vale.button,'Dirigir');assert.notEqual(sport.button,'Jogar');assert.notEqual(support.button,'Dirigir');
  assert.equal(vale.informational,true);assert.equal(sport.informational,true);assert.equal(support.informational,true);
});
