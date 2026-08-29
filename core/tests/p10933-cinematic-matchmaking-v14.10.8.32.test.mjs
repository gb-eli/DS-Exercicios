import assert from 'node:assert/strict';
import fs from 'node:fs';
const student=fs.readFileSync(new URL('../../prova/assets/student.js',import.meta.url),'utf8');
const sim=fs.readFileSync(new URL('../../prova/assets/simulator.js',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../../prova/assets/prova.css',import.meta.url),'utf8');
const html=fs.readFileSync(new URL('../../prova/index.html',import.meta.url),'utf8');
assert.ok(student.includes('startMatchmakingSequence'), 'transition hook remains available for the real student flow');
for(const text of ['Carregando sua sessão','Sincronizando equipe, função e atividades','Lobby pronto']) assert.ok(student.includes(text),text);
for(const fake of ['BUSCANDO PARTIDA','SINCRONIZANDO SERVIDOR','BUSCANDO JOGADORES','DEPLOYING SQUAD','SA-EAST','MATCH FOUND']){assert.ok(!student.includes(fake),fake);assert.ok(!sim.includes(fake),fake);}
for(const cls of ['.session-transition','.session-start-notice','.evaluation-status-strip']) assert.ok(css.includes(cls),cls);
assert.ok(css.includes('@media(prefers-reduced-motion:reduce)'), 'reduced motion support required');
assert.ok(/14\.10\.8\.(?:3[9]|[4-9]\d|\d{3,})/.test(html), 'student cache key must be v39 or newer');
console.log('p10933 professional transition compatibility v14.10.8.39: OK');
