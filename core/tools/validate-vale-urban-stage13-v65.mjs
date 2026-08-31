import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(process.argv[2]||'.');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const must=(ok,msg)=>{console.log(`${ok?'PASS':'FAIL'}  ${msg}`);if(!ok)process.exitCode=1};
const runtime=JSON.parse(read('lobby/data/vale-silicio/runtime-v2.json'));
const shared=read('lobby/assets/world/vale-silicio-shared.js');
const d3=read('lobby/assets/vale3d.js');
const lite=read('lobby/assets/vale-lite.js');
const world=runtime.world||{}, urban=world.urban_plan||{}, companies=(runtime.companies||[]).filter(c=>c.enabled!==false);

must(world.world_bounds?.min_x===-420&&world.world_bounds?.max_x===420&&world.world_bounds?.min_z===-420&&world.world_bounds?.max_z===420,'Vale ampliado para 840 × 840 m');
must(world.roads?.generator==='planned_orthogonal_grid_v3','malha radial substituída por quadras ortogonais planejadas');
must(Number(world.roads?.main_road_width)>=14&&Number(world.roads?.sidewalk_width)>=3.2,'avenidas e calçadas receberam largura urbana maior');
must(Array.isArray(urban.roads)&&urban.roads.length>=30,'rede viária planejada possui ao menos 30 segmentos');
must(urban.roads.filter(r=>r.kind==='avenue').length>=2,'dois eixos arteriais principais preservados');
must(Array.isArray(urban.crosswalks)&&urban.crosswalks.length>=8,'travessias de pedestres distribuídas nos principais acessos');
must(Array.isArray(urban.greenery)&&urban.greenery.length>=18,'paisagismo leve distribuído sem saturar a cena');
must(Array.isArray(world.districts)&&world.districts.every(d=>d.urban_block?.width&&d.urban_block?.depth&&d.urban_block?.gateway),'todos os distritos possuem quadra e portal de leitura urbana');
must(companies.length===27,'27 empresas ativas preservadas');
const rotated=companies.filter(c=>Math.abs(Number(c.lot?.rotation_y_deg||0)%180)>0.01);
must(rotated.length>=10,`fachadas orientadas para as vias e OBB preservado (${rotated.length} rotacionadas)`);
let overlaps=0;
const rect=c=>{const p=c.lot?.world_position||{},s=c.lot?.size||{},r=Math.round(Number(c.lot?.rotation_y_deg||0))%180;let w=Number(s.width||40),d=Number(s.depth||34);if(Math.abs(r)===90)[w,d]=[d,w];return{x:Number(p.x||0),z:Number(p.z||0),w,d,id:c.id}};
const rs=companies.map(rect);
for(let i=0;i<rs.length;i++)for(let j=i+1;j<rs.length;j++){const a=rs[i],b=rs[j];if(Math.abs(a.x-b.x)<(a.w+b.w)/2&&Math.abs(a.z-b.z)<(a.d+b.d)/2)overlaps++;}
must(overlaps===0,'lotes das 27 empresas não se sobrepõem');
let roadIntrusions=0;
for(const road of urban.roads||[]){const a=road.a||{},b2=road.b||{},rw=Number(road.width||6);for(const r of rs){if(Math.abs(Number(a.x)-Number(b2.x))<.001){const lo=Math.min(Number(a.z),Number(b2.z)),hi=Math.max(Number(a.z),Number(b2.z));if(Math.abs(r.x-Number(a.x))<(r.w+rw)/2&&r.z+r.d/2>lo&&r.z-r.d/2<hi)roadIntrusions++;}else if(Math.abs(Number(a.z)-Number(b2.z))<.001){const lo=Math.min(Number(a.x),Number(b2.x)),hi=Math.max(Number(a.x),Number(b2.x));if(Math.abs(r.z-Number(a.z))<(r.d+rw)/2&&r.x+r.w/2>lo&&r.x-r.w/2<hi)roadIntrusions++;}}}
must(roadIntrusions===0,'ruas planejadas não atravessam lotes das empresas');
const b=world.world_bounds;
must(rs.every(r=>r.x-r.w/2>b.min_x+12&&r.x+r.w/2<b.max_x-12&&r.z-r.d/2>b.min_z+12&&r.z+r.d/2<b.max_z-12),'todos os lotes mantêm margem segura dos limites do Vale');
must(shared.includes("VALE_BOUNDS=Object.freeze({minX:-420,maxX:420,minZ:-420,maxZ:420})"),'runtime compartilhado usa os novos limites urbanos');
const hall=world.core_landmarks?.find?.(x=>x.id==='hall_inovacao_agv');must(shared.includes("x:0,z:-360")&&shared.includes("id:'hall-inovacao'")&&hall?.position?.x===80&&hall?.position?.z===-120,'portal sul e Hall da Inovação sincronizados no runtime compartilhado');
must(d3.includes('roadPlan=urban.roads')&&d3.includes('crosswalkPlan=urban.crosswalks')&&d3.includes('districtPad('),'3D deriva ruas, travessias e quadras do urban_plan');
must(d3.includes('sidewalkWidth')&&d3.includes('avenueLights(')&&d3.includes('greeneryPlan.forEach'),'3D renderiza calçadas, iluminação arterial e paisagismo leve');
must(d3.includes("depthTest,depthWrite:false")&&!d3.includes('depthTest:false}));s.scale.set(scale'),'placas do mundo respeitam profundidade e reduzem sobreposição visual');
must(lite.includes('roadPlan=urban.roads')&&lite.includes('drawDistrictBlock(')&&lite.includes('drawCrosswalk('),'2D usa a mesma malha urbana do 3D');
must(lite.includes("ctx.rotate(-rot)")&&lite.includes('dx*cos-dz*sin'),'2D respeita rotação visual e colisão orientada dos prédios');
must(!d3.includes("roadSegment({x:0,z:0},district.center")&&!lite.includes('drawRoad(center,district.center'),'spokes radiais antigos removidos do 2D e do 3D');

if(process.exitCode)process.exit(process.exitCode);
console.log('\nVALIDAÇÃO VALE — urbanismo Etapa 13: PASS');
