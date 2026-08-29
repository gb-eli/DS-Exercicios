#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const root = path.resolve(__dirname, '..');
const voxel = path.join(root, 'games', 'voxelcraft-ds');
const output = path.join(__dirname, 'voxelcraft-campaign-results-v0.36.2.json');
const report = path.join(root, 'TESTES-VOXELCRAFT-CAMPANHA-v0.36.2.md');
const checks = [];
function check(label, condition, detail) { checks.push({ label, status: condition ? 'pass' : 'fail', detail }); }
function includes(file, text) { return fs.readFileSync(file, 'utf8').includes(text); }

(async () => {
  const storagePath = path.join(voxel, 'js', 'storage.js');
  const gamePath = path.join(voxel, 'js', 'game.js');
  const appPath = path.join(voxel, 'js', 'app.js');
  const htmlPath = path.join(voxel, 'index.html');
  const manifestPath = path.join(voxel, 'manifest.json');
  const mainAppPath = path.join(root, 'app.js');
  const swPath = path.join(root, 'sw.js');

  const storageSource = fs.readFileSync(storagePath, 'utf8');
  const storageModule = await import(`data:text/javascript;base64,${Buffer.from(storageSource).toString('base64')}`);
  const unsafe = {
    version: 1,
    quality: 'impossivel', mode: 'unknown',
    player: { x: Infinity, y: -99999, z: 3, yaw: Infinity, pitch: 99, camera: 'cinematic', health: 500, hunger: -20 },
    stats: { xp: -5, broken: 1e12, placed: 3, distance: -2, collected: 4, completed: 1 },
    edits: [['0,1,2', 2], ['bad-key', 2], ['1,2,3', 99]],
    items: [{ name: 'HTML', count: 5000 }, { name: 'Desconhecido', count: 5 }]
  };
  const safe = storageModule.sanitizeWorld(unsafe);
  check('Schema de save 12', safe?.version === 12, 'O sanitizador converte estados antigos para o schema 12.');
  check('Sanitização de jogador', safe.player.health === 100 && safe.player.hunger === 0 && safe.player.pitch === 1.4 && safe.player.camera === 'first', 'Vida, fome, câmera e inclinação permanecem dentro dos limites.');
  check('Sanitização de edições', safe.edits.length === 1 && safe.edits[0][0] === '0,1,2', 'Chaves e tipos inválidos são descartados.');
  check('Sanitização de inventário', safe.items.length === 1 && safe.items[0].count === 999, 'Itens desconhecidos são removidos e quantidades são limitadas.');
  check('Campanha sanitizada', safe.stats.chapter === 3 && safe.stats.chaptersCompleted === 3, 'Saves antigos concluídos migram para 3/3 etapas sem perder o estado de conclusão.');

  const localData = new Map();
  global.localStorage = {
    getItem: key => localData.has(key) ? localData.get(key) : null,
    setItem: (key, value) => localData.set(key, String(value)),
    removeItem: key => localData.delete(key)
  };
  delete global.indexedDB;
  const savedLocal = await storageModule.saveWorld({ player:{x:1,y:12,z:2}, stats:{xp:42}, edits:[], items:[] });
  const loadedLocal = await storageModule.loadWorld();
  check('Fallback localStorage', savedLocal.storageBackend === 'localstorage' && loadedLocal?.stats.xp === 42, 'Sem IndexedDB, o mundo permanece persistente no localStorage.');

  global.localStorage = { getItem:()=>{throw new Error('blocked');}, setItem:()=>{throw new Error('blocked');}, removeItem:()=>{} };
  const savedMemory = await storageModule.saveWorld({ player:{x:2,y:13,z:3}, stats:{xp:77}, edits:[], items:[] });
  const loadedMemory = await storageModule.loadWorld();
  check('Fallback em memória', savedMemory.storageBackend === 'memory' && loadedMemory?.stats.xp === 77, 'Quando os armazenamentos persistentes falham, a sessão continua em memória.');

  check('Three.js local', includes(gamePath, "const THREE_URL='../vendor/three/three.module.min.js'"), 'O renderizador não depende de CDN externa.');
  check('Spawn e recuperação seguros', includes(gamePath, 'function safeSpawn') && includes(gamePath, 'function recoverPlayer'), 'Saves inválidos e quedas recuperam o personagem.');
  check('Proteção contra autoaprisionamento', includes(gamePath, 'function blockIntersectsPlayer') && includes(gamePath, 'blockIntersectsPlayer(target)'), 'Não é permitido colocar um bloco dentro do personagem.');
  check('Bordas de chunks', includes(gamePath, 'function rebuildAffected') && includes(gamePath, 'localX===0') && includes(gamePath, 'localZ===CHUNK-1'), 'A edição na borda reconstrói os chunks vizinhos.');
  check('Coyote time e jump buffer', includes(gamePath, 'coyote=') && includes(gamePath, 'jumpBuffer='), 'Saltos toleram borda e comando antecipado.');
  check('Câmera com colisão', includes(gamePath, 'cameraRay.intersectObjects') && includes(gamePath, 'hit.distance-.3'), 'A terceira pessoa recua antes do terreno.');
  check('Pointer Lock com fallback', includes(gamePath, 'pointerlockerror') && includes(appPath, 'pointer-lock-denied'), 'Falhas de captura do mouse geram orientação e comandos alternativos.');
  check('Suporte a gamepad', includes(gamePath, 'navigator.getGamepads') && includes(gamePath, "edge('jump',0") && includes(gamePath, "edge('camera',3"), 'Movimento, câmera e ações principais possuem mapeamento de controle.');
  check('Limite de edições', includes(gamePath, 'MAX_EDITS=15000') && includes(gamePath, "type:'edit-limit'"), 'O mundo bloqueia crescimento indefinido do mapa de edições.');
  check('Modo seguro automático', includes(appPath, "quality='economy'") && includes(appPath, "Ativando modo seguro"), 'Falhas de GPU podem reiniciar o módulo no perfil Econômico.');
  check('Fila de salvamento', includes(appPath, 'savePromise') && includes(appPath, 'state.savePromise.catch'), 'Gravações simultâneas são serializadas.');
  check('Campanha de três etapas', includes(gamePath, "Etapa 1/3 — Streaming do mundo") && includes(gamePath, "Etapa 2/3 — Recursos e inventário") && includes(gamePath, "Etapa 3/3 — Construção e navegação") && includes(gamePath, 'chaptersCompleted'), 'Aprendizagem usa três etapas progressivas e registra a conclusão de cada uma.');
  check('Desafio de três etapas', includes(gamePath, "Etapa 1/3 — Cartografia de chunks") && includes(gamePath, "Etapa 2/3 — Mineração persistente") && includes(gamePath, "Etapa 3/3 — Engenharia de campo"), 'Modo Desafio possui trilha própria em três etapas.');
  check('Persistência da etapa', includes(storagePath, "world.v12") && includes(storagePath, "LEGACY_WORLD_KEYS") && includes(storagePath, "chapter:") && includes(storagePath, "chaptersCompleted:"), 'Schema 12 preserva a etapa e importa a chave local v11.');
  check('Interface de modo seguro', includes(htmlPath, 'safeModeBtn') && includes(htmlPath, 'storageLabel'), 'A interface oferece recuperação e informa o backend de armazenamento.');

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  check('Manifesto atualizado', manifest.version === 13 && manifest.storage_schema === 12 && manifest.campaign_stages === 3 && manifest.status === 'jogavel', 'Manifesto identifica integração 13, schema 12, três etapas e estado jogável.');
  const mainApp = fs.readFileSync(mainAppPath, 'utf8');
  const voxelEntry = mainApp.slice(mainApp.indexOf('"id": "voxelcraft-ds"'), mainApp.indexOf('"id": "board-arena"'));
  check('Catálogo jogável', voxelEntry.includes('"status": "jogavel"') && mainApp.includes("'voxelcraft-ds': () =>"), 'O VoxelCraft permanece jogável e carregável nas versões posteriores à Fase 7.12.');
  check('Cache offline completo', ['index.html','css/style.css','js/app.js','js/game.js','js/storage.js','vendor/three/three.module.min.js'].every(file => includes(swPath, `./games/voxelcraft-ds/${file}`)), 'Todos os arquivos essenciais do VoxelCraft estão no shell offline.');
  check('Comunicação segura do iframe', mainApp.includes("const targetOrigin = location.origin === 'null' ? '*' : location.origin") && mainApp.includes("type === 'fallback'"), 'Mensagens de erro e modo seguro chegam ao runtime principal.');

  const passed = checks.filter(item => item.status === 'pass').length;
  const failed = checks.length - passed;
  const result = { product:'Fliperama DS', module:'VoxelCraft DS', version:'0.36.2', generatedAt:new Date().toISOString(), summary:{checks:checks.length,passed,failed}, checks };
  fs.writeFileSync(output, `${JSON.stringify(result,null,2)}\n`);
  const lines = [
    '# Testes do VoxelCraft DS — Campanha v0.36.2','',
    `Gerado em: ${result.generatedAt}`,'',
    `- Verificações: **${checks.length}**`,
    `- Aprovadas: **${passed}**`,
    `- Falhas: **${failed}**`,'','## Resultados',''
  ];
  for (const item of checks) lines.push(`- **${item.status === 'pass' ? 'APROVADO' : 'FALHOU'} — ${item.label}:** ${item.detail}`);
  lines.push('','## Limite da validação','','Os testes automatizados cobrem estrutura, persistência, proteções, integração e presença dos mecanismos. A sensação da câmera, conforto dos joysticks, desempenho e qualidade visual ainda devem ser conferidos em dispositivos reais.','');
  fs.writeFileSync(report, `${lines.join('\n')}\n`);
  console.log(JSON.stringify(result.summary,null,2));
  if (failed) process.exitCode=1;
})().catch(error => { console.error(error); process.exitCode=1; });
