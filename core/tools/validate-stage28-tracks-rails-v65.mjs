import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
const root=path.resolve(process.argv[2]||'.');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const url=p=>pathToFileURL(path.join(root,p)).href;
const exp=await import(url('lobby/assets/world/campus-experiences.js'));
const mob=await import(url('lobby/assets/world/campus-mobility-systems.js'));
const env=read('lobby/assets/world/campus-environment.js');
const d3=read('lobby/assets/lobby3d.js');
const lite=read('lobby/assets/lobby-lite.js');
const checks=[];const check=(name,ok)=>checks.push({name,ok:!!ok});

const track=mob.CAMPUS_MOBILITY_TRACKS?.find(item=>item.id==='track-mobility-south');
const route=mob.CAMPUS_TRAFFIC_ROUTES?.find(item=>item.id===track?.routeId);
check('pista técnica reutiliza rota existente',!!track&&!!route&&track.routeId==='mobility-south'&&route.nodes.length>=8);
check('pista não cria segunda malha asfaltada',env.includes("root.name='campus-mobility-track-layer'")&&env.includes('Balizadores espaçados')&&!env.includes("campus-mobility-track-asphalt"));
check('pista tem bordas e linha de largada leves',env.includes('track.curbWidth||.18')&&env.includes('start=box(THREE,track.width'));
check('pista aparece no mapa 2D sem duplicar via',lite.includes('for(const track of CAMPUS_MOBILITY_TRACKS)')&&lite.includes("ctx.setLineDash"));

const coaster=exp.CAMPUS_RIDES.coaster;
const heights=coaster.nodes.map(n=>n.y);
check('montanha-russa mantém circuito completo',coaster.nodes.length>=16&&coaster.nodes[0].x===34&&coaster.nodes.at(-1).x===34&&coaster.nodes[0].z===-6&&coaster.nodes.at(-1).z===-6);
check('montanha-russa ganhou relevo real',Math.max(...heights)-Math.min(...heights)>=4.5&&Math.max(...heights)>=6);
check('montanha-russa possui bitola e suportes definidos',Number(coaster.railGauge)>=1&&Number(coaster.supportEvery)>=2);
check('trilho 3D próprio da montanha-russa existe',env.includes("montanha-russa panorâmica tem trilho próprio")&&env.includes('new THREE.TubeGeometry(rc,railSamples,.055,6,false)'));
check('modo Eco simplifica trilho da montanha-russa',env.includes("if(quality==='low')g.add(new THREE.Mesh(new THREE.TubeGeometry(curve,railSamples,.09,6,false),railMaterial))"));
check('carrinho da montanha-russa é separado do monotrilho',env.includes("coasterTrain.name='coaster-train'")&&d3.includes("activeCoaster=activeRideId==='coaster'&&experienceRide")&&d3.includes('const trainPos=trainRide||train.sampleVisual(nowMs)'));
check('mapa 2D mostra circuito próprio da montanha-russa',lite.includes('Montanha-russa panorâmica tem circuito próprio')&&lite.includes('CAMPUS_RIDES.coaster.nodes'));

check('monotrilho mantém oito estações ou mais',exp.CAMPUS_TRAIN_STATIONS.length>=8);
check('monotrilho reduz pilares sem perder suporte',env.includes('for(let i=0;i<32;i++)')&&!env.includes('for(let i=0;i<44;i++)'));
check('monotrilho ganha guias laterais só fora do Eco',env.includes("if(quality!=='low'){for(const side of[-1,1])")&&env.includes('side*.24'));
check('estações têm duas bordas e faixa de segurança',env.includes('edgeLightB=box')&&env.includes('safety=box'));
check('2D diferencia viga do monotrilho e linha-guia',lite.includes("ctx.strokeStyle='rgba(30,42,54,.92)'")&&lite.includes("ctx.strokeStyle='rgba(181,140,255,.7)'"));

const lobby=read('lobby/assets/lobby.js'),boot=read('lobby/assets/boot.js'),vendor=read('lobby/assets/vendor-loader.js'),html=read('lobby/index.html'),sw=read('lobby/sw.js');
const stageAtLeast=(source,pattern,min=28)=>{const m=source.match(pattern);return !!m&&Number(m[1])>=min;};
check('lobby força runtime 2D/3D com cache-bust de fase >=28',stageAtLeast(lobby,/lobby3d\.js\?v=14\.10\.8\.65-stage(\d+)/)&&stageAtLeast(lobby,/lobby-lite\.js\?v=14\.10\.8\.65-stage(\d+)/));
check('boot força lobby.js com cache-bust de fase >=28',stageAtLeast(boot,/lobby\.js\?v=\$\{VERSION\}-stage(\d+)/));
check('vendor-loader força boot novo com fase >=28',stageAtLeast(vendor,/assets\/boot\.js\?v=\$\{VERSION\}-stage(\d+)/)&&stageAtLeast(html,/vendor-loader\.js\?v=14\.10\.8\.65-stage(\d+)/));
check('Service Worker mantém cache de fase >=28 e assets de trilhos',stageAtLeast(sw,/agv-lobby-runtime-\$\{VERSION\}-stage(\d+)/)&&stageAtLeast(sw,/campus-environment\.js\?v=14\.10\.8\.65-stage(\d+)/)&&sw.includes('game/train-manager.js?v=14.10.8.65-stage28'));

let failed=0;for(const c of checks){console.log(`${c.ok?'PASS':'FAIL'} ${c.name}`);if(!c.ok)failed++;}
console.log(`\n${checks.length-failed}/${checks.length} PASS`);if(failed)process.exit(1);
