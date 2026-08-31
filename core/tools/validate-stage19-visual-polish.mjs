import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const root=path.resolve(path.dirname(new URL(import.meta.url).pathname),'../..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const lobby=read('lobby/assets/lobby3d.js');
const vale3d=read('lobby/assets/vale3d.js');
const vale2d=read('lobby/assets/vale-lite.js');

const checks=[
  ['Campus labels possuem culling por distância',()=>assert.match(lobby,/labelCullDistance/)],
  ['Campus atualiza visibilidade das placas externas',()=>assert.match(lobby,/updateExteriorLabelVisibility/)],
  ['Névoa do Campus acompanha ciclo de luz',()=>assert.match(lobby,/scene\.fog\.density=\.0105-daylight\*\.0042/)],
  ['Vale 3D usa ciclo de tempo compartilhado',()=>assert.match(vale3d,/resolveWorldTime/)],
  ['Vale 3D possui sky dome atmosférico',()=>assert.match(vale3d,/function valeSkyDome/)],
  ['Vale 3D atualiza atmosfera sem trabalho por frame',()=>assert.match(vale3d,/lastAtmosphereUpdate<30000/)],
  ['Vale 3D faz culling de placas por distância',()=>assert.match(vale3d,/updateValeLabels/)],
  ['Placas de empresa continuam sob LOD próprio',()=>assert.match(vale3d,/externalLOD=true/)],
  ['Distritos do Vale têm acentos visuais discretos',()=>assert.match(vale3d,/districtAccent/)],
  ['Vale 2D usa skyPalette compartilhada',()=>assert.match(vale2d,/skyPalette/)],
  ['Vale 2D mostra distrito por proximidade',()=>assert.match(vale2d,/distance<165\|\|s>\.78/)],
  ['Vale 2D mostra nomes de empresas por proximidade',()=>assert.match(vale2d,/distance<82\|\|s>\.9/)],
];
let pass=0;
for(const [name,fn] of checks){try{fn();pass++;console.log(`PASS ${name}`);}catch(err){console.error(`FAIL ${name}: ${err.message}`);process.exitCode=1;}}
console.log(`\nEtapa 19: ${pass}/${checks.length} verificações PASS`);
if(pass!==checks.length)process.exitCode=1;
