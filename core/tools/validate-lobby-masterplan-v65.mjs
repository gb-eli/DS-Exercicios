import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root=path.resolve(process.argv[2]||'.');
let failures=0;
const must=(ok,msg)=>{console.log(`${ok?'PASS':'FAIL'}  ${msg}`);if(!ok)failures++;};
const mod=async rel=>import(pathToFileURL(path.join(root,rel)).href+`?audit=${Date.now()}-${Math.random()}`);

const manifest=await mod('lobby/assets/world/campus-manifest.js');
const destinations=await mod('lobby/assets/world/campus-destinations.js');
const experiences=await mod('lobby/assets/world/campus-experiences.js');
const city=await mod('lobby/assets/world/campus-city-network.js');

must(manifest.WORLD_X>=54&&manifest.WORLD_Z>=36,'campus ampliado para pelo menos 108 × 72 m');

for(const [key,layout] of Object.entries(manifest.CAMPUS_ZONE_LAYOUT)){
  const [x,,z]=layout.building;
  must(Math.abs(layout.liteBuilding.x-x)<.001&&Math.abs(layout.liteBuilding.z-z)<.001,`${key}: centro 2D e 3D sincronizado`);
  must(Math.abs(x)<manifest.WORLD_X-10&&Math.abs(z)<manifest.WORLD_Z-7,`${key}: prédio com margem de circulação dentro do mundo`);
}

const all=destinations.CAMPUS_DESTINATIONS;
for(const item of all){
  const half=Math.max(item.footprint.width,item.footprint.depth)/2+2;
  must(Math.abs(item.x)+half<manifest.WORLD_X&&Math.abs(item.z)+half<manifest.WORLD_Z,`${item.id}: destino dentro dos limites com margem`);
}
for(let i=0;i<all.length;i++)for(let j=i+1;j<all.length;j++){
  const a=all[i],b=all[j],min=(Math.max(a.footprint.width,a.footprint.depth)+Math.max(b.footprint.width,b.footprint.depth))/2+3;
  must(Math.hypot(a.x-b.x,a.z-b.z)>min,`${a.id} ↔ ${b.id}: lotes sem sobreposição`);
}

const nonTools=experiences.CAMPUS_EXPERIENCES.filter(x=>x.type!=='tool-building');
for(const e of nonTools){
  must(Math.abs(e.x)<manifest.WORLD_X-3&&Math.abs(e.z)<manifest.WORLD_Z-3,`${e.id}: experiência dentro da área útil`);
}
const centralClear=nonTools.filter(e=>e.id!=='coaster'&&e.id!=='tower').every(e=>Math.hypot(e.x,e.z)>=20);
must(centralClear,'núcleo central livre de atrações volumosas fora dos dois marcos laterais');

must(city.CAMPUS_ROAD_HIERARCHY.filter(r=>r.class==='arterial').every(r=>r.width>=6.4),'avenidas principais com largura mínima de 6,4 m');
must(city.CAMPUS_CROSSWALKS.length>=7,'travessias ampliadas nos eixos e anel viário');
must(city.CAMPUS_PEDESTRIAN_BRIDGES.every(b=>Math.abs(b.x)>=20),'passarelas afastadas da praça central');

const env=fs.readFileSync(path.join(root,'lobby/assets/world/campus-environment.js'),'utf8');
const lite=fs.readFileSync(path.join(root,'lobby/assets/lobby-lite.js'),'utf8');
must(!env.includes('PISTA AGV • 09/27')&&!env.includes('for(const [x,z,w,d] of[[0,-22,72,5.2]'),'3D sem malha urbana legada/pista duplicada');
must(!lite.includes('base legada preservada para regressão visual')&&!lite.includes("drawRectWorld(0,22,54,4.3"),'2D sem base urbana legada sobreposta');
must(env.includes('WORLD_X*2+8')&&env.includes('WORLD_Z*2+8'),'piso 3D deriva das dimensões do masterplan');
must(experiences.CAMPUS_VERTICAL_SURFACES.some(s=>s.id==='roof-1ds')&&experiences.CAMPUS_VERTICAL_SURFACES.some(s=>s.id==='roof-sub'),'superfícies verticais continuam geradas para as salas');

if(failures){console.error(`\nMASTERPLAN ETAPA 12: FAIL (${failures})`);process.exit(1);}
console.log('\nMASTERPLAN ETAPA 12: PASS');
