import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
const root=path.resolve(process.argv[2]||'.');
const url=p=>pathToFileURL(path.join(root,p)).href;
const exp=await import(url('lobby/assets/world/campus-experiences.js'));
const {createRideManager}=await import(url('lobby/assets/game/ride-manager.js'));
const {createTrainManager}=await import(url('lobby/assets/game/train-manager.js'));
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const d3=read('lobby/assets/lobby3d.js'),lite=read('lobby/assets/lobby-lite.js'),ui=read('lobby/assets/lobby.js'),html=read('lobby/index.html'),env=read('lobby/assets/world/campus-environment.js');
const checks=[];const check=(name,ok)=>checks.push({name,ok:!!ok});

check('escadas externas liberadas pela colisão',d3.includes("['roof','bridge','step','ramp'].includes(surface?.type)"));
const externalSteps=exp.CAMPUS_VERTICAL_SURFACES.filter(s=>String(s.id).startsWith('stairs-'));
check('escadas externas preservam superfícies físicas',externalSteps.length>=72&&externalSteps.every(s=>s.type==='step'&&s.h>0));
const slideSurfaces=exp.CAMPUS_VERTICAL_SURFACES.filter(s=>String(s.id).startsWith('slide-'));
check('escorregador possui degraus e plataforma físicos',slideSurfaces.length>=9&&Math.max(...slideSurfaces.map(s=>s.h))>=4.1);
const towerDecks=exp.CAMPUS_VERTICAL_SURFACES.filter(s=>String(s.id).startsWith('tower-deck-'));
check('mirante possui decks físicos',towerDecks.length===3&&Math.max(...towerDecks.map(s=>s.h))===13.32);
check('subida e descida do mirante têm rotas próprias',!!exp.CAMPUS_RIDES.tower&&!!exp.CAMPUS_RIDES['tower-down']&&exp.CAMPUS_RIDES.tower.nodes.at(-1).y===13.32&&exp.CAMPUS_RIDES['tower-down'].nodes.at(-1).y<.1);
check('interação do mirante alterna subida/descida no alto',d3.includes("const rideId=id==='tower'&&playerY>8?'tower-down':id"));
check('modo 2D preserva alternância do mirante',lite.includes("const rideId=id==='tower'&&jump>8?'tower-down':id"));

check('circuito panorâmico completo existe',!!exp.CAMPUS_RIDES.coaster&&exp.CAMPUS_RIDES.coaster.nodes.length>=16);
check('circuito panorâmico parte e retorna à Estação Intermodal',exp.CAMPUS_RIDES.coaster.nodes[0].x===34&&exp.CAMPUS_RIDES.coaster.nodes[0].z===-6&&exp.CAMPUS_RIDES.coaster.nodes.at(-1).x===34&&exp.CAMPUS_RIDES.coaster.nodes.at(-1).z===-6);
check('botão da montanha-russa existe e é contextual',html.includes('id="train-panoramic"')&&html.includes('Montanha-russa panorâmica')&&ui.includes('openTrainModal(showPanoramic=false)')&&ui.includes("if(obj.type==='coaster'){openTrainModal(true)"));
check('monotrilho e montanha-russa usam veículos visuais separados',d3.includes("const trainPos=trainRide||train.sampleVisual(nowMs)")&&d3.includes("activeCoaster=activeRideId==='coaster'&&experienceRide")&&env.includes("g.userData.coasterTrain=coasterTrain"));
check('estações sinalizam chegada do trem',env.includes('stations.push({station:{...station,...profile,name:profile.name},platform,edgeLight,indicator})')&&d3.includes('trainPos.station===entry.station.id'));
check('avatar não atravessa o trem durante a viagem',d3.includes("!train.isTraveling()&&activeRideId!=='coaster'"));

let now=0;const events=[];const ride=createRideManager({clock:()=>now,onEvent:e=>events.push(e)});
check('gerenciador inicia montanha-russa',ride.start('coaster')===true);
now=(exp.CAMPUS_RIDES.coaster.duration+0.5)*1000;const coasterEnd=ride.tick(now);
check('montanha-russa completa e retorna à estação',coasterEnd?.done===true&&Math.hypot(coasterEnd.x-34,coasterEnd.z+6)<.01);
now=0;const slide=createRideManager({clock:()=>now});slide.start('slide');now=2600;const slideMid=slide.tick(now);now=5400;const slideEnd=slide.tick(now);
check('escorregador sobe e retorna ao nível do solo',slideMid?.y>2.5&&slideEnd?.done===true&&slideEnd.y<.2);

let t=0;const trainEvents=[];const train=createTrainManager({clock:()=>t,onEvent:e=>trainEvents.push(e)});
const stations=train.stations();
check('monotrilho mantém estações reais',stations.length>=8&&stations.some(s=>s.id==='vale')&&stations.some(s=>s.id==='central'));
check('viagem entre estações inicia',train.startTrip('vale',{x:0,z:-8.5})===true);
t=30000;const tripEnd=train.tickTrip(t);
check('viagem chega à estação escolhida',tripEnd?.done===true&&tripEnd.station==='vale');

check('elevador 3D possui cabine e movimento temporal',d3.includes('elevatorMotion={fromFloor:activeToolFloor,toFloor:target')&&d3.includes('room.elevatorCabin.position.y=fromY+(toY-fromY)*smooth'));
check('escada interna 3D troca pavimento',d3.includes("applyToolFloor(activeToolInterior,target,{move:true,via:'stairs'})"));
check('modo 2D mantém elevador e escada funcionais',lite.includes("useToolElevator:ref=>changeToolFloor(ref,'elevator')")&&lite.includes("useToolStairs:ref=>changeToolFloor(ref,'stairs')"));

let failed=0;for(const c of checks){console.log(`${c.ok?'PASS':'FAIL'} ${c.name}`);if(!c.ok)failed++;}
console.log(`\n${checks.length-failed}/${checks.length} PASS`);if(failed)process.exit(1);
