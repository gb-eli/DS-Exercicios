import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'../..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const css=read('lobby/assets/lobby.css');
const html=read('lobby/index.html');
const sw=read('lobby/sw.js');
const lobby=read('lobby/assets/lobby.js');
const checks=[
  ['canvas principal tem regra exclusiva fullscreen',()=>assert.match(css,/#game3d\{position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none;outline:none\}/)],
  ['Lobby não usa seletor fullscreen genérico para qualquer canvas',()=>assert.doesNotMatch(css,/\.game-stage canvas\{position:absolute;inset:0;width:100%;height:100%/)],
  ['cursor touch/desktop do canvas principal não contamina minimapa',()=>assert.doesNotMatch(css,/\.game-stage canvas\{cursor:grab\}/)],
  ['minimapa limpa inset herdado e ancora no canto',()=>assert.match(css,/\.vale-minimap\{position:absolute;inset:auto;left:auto;bottom:auto;right:18px;top:136px;width:160px;height:160px;display:block/)],
  ['minimapa possui limite físico anti-fullscreen',()=>assert.match(css,/\.vale-minimap\{max-width:160px;max-height:160px\}/)],
  ['minimapa continua oculto por padrão no HTML',()=>assert.match(html,/<canvas id="vale-minimap" class="vale-minimap hidden" width="160" height="160"/)],
  ['minimapa só é exibido no Vale 3D',()=>assert.match(css,/body\[data-scene="vale"\]\[data-lobby-mode="3d"\] \.vale-minimap:not\(\.hidden\)\{display:block\}/)],
  ['runtime WebGL continua usando canvas game3d separado',()=>assert.match(lobby,/canvas:\$\('game3d'\)/)],
  ['renderização do minimapa continua usando canvas vale-minimap separado',()=>assert.match(lobby,/const canvas=\$\('vale-minimap'\)/)],
  ['HTML usa cache-bust exclusivo da correção no CSS',()=>assert.match(html,/assets\/lobby\.css\?v=14\.10\.8\.65-stage21/)],
  ['Service Worker pré-carrega o mesmo CSS corrigido',()=>assert.match(sw,/\.\/assets\/lobby\.css\?v=14\.10\.8\.65-stage21/)],
];
let pass=0;
for(const [name,fn] of checks){try{fn();pass++;console.log(`PASS ${name}`);}catch(err){console.error(`FAIL ${name}: ${err.message}`);process.exitCode=1;}}
console.log(`\nEtapa 21: ${pass}/${checks.length} verificações PASS`);
if(pass!==checks.length)process.exitCode=1;
