import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'../..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const lite=read('lobby/assets/vale-lite.js');
const three=read('lobby/assets/vale3d.js');
const checks=[
  ['Vale 2D inicia com zoom legível em desktop',()=>assert.match(lite,/zoom=1\.08,zoomTarget=1\.08/)],
  ['Vale 2D usa zoom inicial maior também em telefone',()=>assert.match(lite,/w<680\?\.82:1\.08/)],
  ['Vale 2D implementa scroll real para zoom',()=>{assert.match(lite,/wheelZoom/);assert.match(lite,/addEventListener\('wheel',wheelZoom/)}],
  ['Vale 2D implementa pinch zoom',()=>{assert.match(lite,/pinchPointers/);assert.match(lite,/pinchMove/)}],
  ['Vale 2D possui atalhos + - e reset de zoom',()=>{assert.match(lite,/NumpadAdd/);assert.match(lite,/NumpadSubtract/);assert.match(lite,/e\.code==='Digit0'/)}],
  ['Vale 2D mantém prédios com tamanho mínimo visível',()=>assert.match(lite,/bw=Math\.max\(9,fp\.width\*s\),bh=Math\.max\(8,fp\.depth\*s\)/)],
  ['Vale 3D ampliou plano de clipping para cidade larga',()=>assert.match(three,/PerspectiveCamera\([^\n]+\.08,1400\)/)],
  ['Vale 3D usa névoa menos agressiva',()=>assert.match(three,/scene\.fog\.density=\.00092-day\*\.00030/)],
  ['Vale 3D mantém mais prédios visíveis no modo Eco',()=>assert.match(three,/quality==='low'\?265:quality==='medium'\?340:quality==='high'\?430:520/)],
  ['Vale 3D melhora leitura de silhueta dos prédios',()=>{assert.match(three,/const roof=box\(fp\.width\*\.92/);assert.match(three,/emissiveIntensity:\.18/)}],
  ['Vale 3D usa câmera inicial mais aberta ao terreno',()=>assert.match(three,/initialPitch:\.43,initialDistance:9\.2/)],
  ['Exterior do Vale possui recuperação defensiva de visibilidade',()=>assert.match(three,/if\(worldRoot\.visible===false\)worldRoot\.visible=true/)],
];
let pass=0;
for(const [name,fn] of checks){try{fn();pass++;console.log(`PASS ${name}`);}catch(err){console.error(`FAIL ${name}: ${err.message}`);process.exitCode=1;}}
console.log(`\nEtapa 20: ${pass}/${checks.length} verificações PASS`);
if(pass!==checks.length)process.exitCode=1;
