#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');
const root = path.resolve(__dirname, '..');
const gameDir = path.join(root, 'games', 'duo-elementos-ds');
const levels = JSON.parse(fs.readFileSync(path.join(gameDir, 'levels.json'), 'utf8'));
const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const html = fs.readFileSync(path.join(gameDir, 'index.html'), 'utf8');
const gameJs = fs.readFileSync(path.join(gameDir, 'game.js'), 'utf8');
const coreJs = fs.readFileSync(path.join(root, 'games', 'shared', 'multiplayer-local-core.js'), 'utf8');
const learning = JSON.parse(fs.readFileSync(path.join(root, 'education', 'game-learning.json'), 'utf8'));
const checks = [];
const test = (label, ok, detail='') => { checks.push({label,status:ok?'pass':'fail',detail}); if(!ok) process.exitCode=1; };

function pointSegment(x, gates, open) {
  const closed = gates.filter(g => !open.has(g.id)).sort((a,b)=>a.x-b.x);
  let left = 0, right = 960;
  for (const gate of closed) {
    if (gate.x < x) left = Math.max(left, gate.x + gate.w);
    else { right = Math.min(right, gate.x); break; }
  }
  return [left,right];
}
function reachable(level) {
  const open = new Set();
  const latched = new Set();
  const playerX = { ember: level.spawns.ember[0], tide: level.spawns.tide[0] };
  for (let pass=0; pass<20; pass++) {
    let changed=false;
    for (const sw of level.switches) {
      if (latched.has(sw.id)) continue;
      const [left,right] = pointSegment(playerX[sw.element] ?? playerX.ember, level.gates, open);
      if (sw.x + sw.w/2 >= left && sw.x + sw.w/2 <= right) { latched.add(sw.id); changed=true; }
    }
    for (const gate of level.gates) {
      if (!open.has(gate.id) && gate.requires.every(id=>latched.has(id))) { open.add(gate.id); changed=true; }
    }
    if (!changed) break;
  }
  return { open, latched };
}

(async()=>{
  test('Manifesto de níveis usa schema 1', levels.schemaVersion===1);
  test('Campanha possui 8 fases', levels.levels.length===8, `${levels.levels.length} fases`);
  test('IDs das fases são 1..8', levels.levels.every((l,i)=>l.id===i+1));
  test('Títulos das fases são únicos', new Set(levels.levels.map(l=>l.title)).size===8);
  test('Mundo lógico 960×540', levels.world.width===960 && levels.world.height===540);

  for (const level of levels.levels) {
    const switchIds = level.switches.map(s=>s.id);
    const gateIds = level.gates.map(g=>g.id);
    test(`Fase ${level.id}: relés únicos`, new Set(switchIds).size===switchIds.length, switchIds.join(', '));
    test(`Fase ${level.id}: gates únicos`, new Set(gateIds).size===gateIds.length, gateIds.join(', '));
    test(`Fase ${level.id}: requisitos de gates existem`, level.gates.every(g=>g.requires.every(id=>switchIds.includes(id))));
    const route=reachable(level);
    test(`Fase ${level.id}: gates desbloqueáveis`, route.open.size===level.gates.length, `${route.open.size}/${level.gates.length}`);
    test(`Fase ${level.id}: saídas dos dois elementos`, ['ember','tide'].every(k=>Array.isArray(level.exits[k])&&level.exits[k].length===4));
    test(`Fase ${level.id}: spawns válidos`, ['ember','tide'].every(k=>level.spawns[k][0]>=0&&level.spawns[k][0]<960&&level.spawns[k][1]>=0&&level.spawns[k][1]<500));
    test(`Fase ${level.id}: objetivos definidos`, typeof level.objective==='string'&&level.objective.length>35);
  }

  test('Fase final exige quatro relés', levels.levels[7].switches.length===4);
  test('Fase final exige seis núcleos', levels.levels[7].shards.length===6);
  test('Torres Gêmeas começa com jogadores em lados diferentes', levels.levels[6].spawns.ember[0] < 468 && levels.levels[6].spawns.tide[0] > 468);
  test('Há perigos de fogo, água e neutros', ['fire','water','void'].every(kind=>levels.levels.some(l=>l.hazards.some(h=>h.element===kind))));
  test('Há relés Ígneo e Aqua', ['ember','tide'].every(kind=>levels.levels.some(l=>l.switches.some(s=>s.element===kind))));
  test('Há núcleos específicos e neutros', ['ember','tide','any'].every(kind=>levels.levels.some(l=>l.shards.some(s=>s.element===kind))));

  const coreUrl='data:text/javascript;base64,'+Buffer.from(coreJs).toString('base64');
  const { MultiplayerLocalCore } = await import(coreUrl);
  const solo = new MultiplayerLocalCore('solo');
  solo.dispatch('move-left',true);
  test('Core solo mapeia controle genérico ao personagem ativo', solo.isHeld(0,'left') && !solo.isHeld(1,'left'));
  solo.dispatch('move-left',false); solo.dispatch('switch-player',true); solo.dispatch('move-right',true);
  test('Core solo troca personagem ativo', solo.activePlayer===1 && solo.isHeld(1,'right'));
  const local = new MultiplayerLocalCore('local');
  local.dispatch('move-left',true); local.dispatch('p2-right',true); local.dispatch('p2-jump',true);
  test('Core local mantém entradas independentes', local.isHeld(0,'left') && local.isHeld(1,'right') && local.consumePressed(1,'jump'));
  test('Core possui polling de gamepad', coreJs.includes('navigator.getGamepads') && coreJs.includes('pads[1]'));

  test('HTML usa canvas e controles touch', html.includes('<canvas id="game"') && html.includes('touch-controls'));
  test('Runtime possui coyote time e jump buffer', gameJs.includes('COYOTE_MS') && gameJs.includes('JUMP_BUFFER_MS'));
  test('Runtime possui afinidade elemental', gameJs.includes("hazard.element === 'fire'") && gameJs.includes("hazard.element === 'water'"));
  test('Runtime salva progresso serializável', gameJs.includes('function serialize()') && gameJs.includes('latchedSwitches') && gameJs.includes('collectedShards'));
  test('Runtime possui checkpoints', gameJs.includes('updateCheckpoint') && gameJs.includes('checkpointSpawns'));
  test('Runtime emite conclusão da campanha', gameJs.includes("post('finished'") && gameJs.includes("medal"));
  test('Runtime respeita redução de movimento', gameJs.includes('reducedMotion'));
  test('Runtime limita partículas em qualidade baixa', gameJs.includes("quality === 'low'") && gameJs.includes('particles.length > 120'));

  test('Portal registra loader do Duo', app.includes("'duo-elementos-ds': () =>") && app.includes('DuoElementosRuntime'));
  test('Portal registra modo solo e local', app.includes("options: { solo: 'Solo · alternar personagens', local: '2 jogadores locais' }"));
  test('Portal registra controles independentes', app.includes("ArrowLeft: 'p2-left'") && app.includes("KeyA: 'move-left'") && app.includes("KeyQ: 'switch-player'"));
  test('Portal possui HUD específico', app.includes("activeGameId === 'duo-elementos-ds'") && app.includes("state?.deaths"));
  test('Portal possui resultado específico', app.includes('Câmara Nexus estabilizada!'));
  test('Catálogo contém Duo Elementos', app.includes('"id": "duo-elementos-ds"') && app.includes('"packageSizeBudgetKb": 750'));
  test('Ficha educacional externa existe', !!learning['duo-elementos-ds']);
  test('Ficha educacional possui 8 etapas', learning['duo-elementos-ds']?.progression?.length===8);
  test('Previews e logo existem', ['logo.svg','preview-01.svg','preview-02.svg'].every(name=>fs.existsSync(path.join(root,'media','games','duo-elementos-ds',name))));

  const passed=checks.filter(c=>c.status==='pass').length, failed=checks.length-passed;
  const result={product:'Fliperama DS',module:'Duo Elementos DS',version:'0.37.0',phase:'Fase 7.18 — Multiplayer Local Core + Duo Elementos DS',generatedAt:new Date().toISOString(),summary:{checks:checks.length,passed,failed},checks};
  fs.writeFileSync(path.join(__dirname,'duo-elementos-test-results-v0.37.0.json'),JSON.stringify(result,null,2)+'\n');
  const lines=['# Testes do Duo Elementos DS — Fliperama DS v0.37.0','',`Gerado em: ${result.generatedAt}`,'',`- Verificações: **${checks.length}**`,`- Aprovadas: **${passed}**`,`- Falhas: **${failed}**`,'','## Resultados','',...checks.map(c=>`- **${c.status==='pass'?'APROVADO':'FALHOU'} — ${c.label}:** ${c.detail||'OK'}`),''];
  fs.writeFileSync(path.join(root,'TESTES-DUO-ELEMENTOS-v0.37.0.md'),lines.join('\n')+'\n');
  console.log(`${passed}/${checks.length} verificações aprovadas.`);
})().catch(err=>{console.error(err);process.exitCode=1;});
