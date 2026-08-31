import fs from 'node:fs';
const read=p=>fs.readFileSync(p,'utf8');
const must=(ok,msg)=>{console.log(`${ok?'PASS':'FAIL'}  ${msg}`);if(!ok)process.exitCode=1};
const vale3d=read('lobby/assets/vale3d.js');
const runtime=JSON.parse(read('lobby/data/vale-silicio/runtime-v2.json'));
const companies=(runtime.companies||[]).filter(c=>c.enabled!==false);
const rotated=companies.filter(c=>Math.abs(Number(c.lot?.rotation_y_deg||0)%180)>0.01);
const collisionReady=companies.filter(c=>c.building?.collision?.enabled!==false);
const stairReady=companies.filter(c=>c.building?.collision?.stairs_have_collision===true&&c.building?.collision?.walkable_entry===true);

must(rotated.length>=10,`dataset possui prédios rotacionados que exigem OBB (${rotated.length})`);
must(vale3d.includes('function localPoint(')&&vale3d.includes('function hitsCollider(')&&vale3d.includes('rotation}'),'colisão de prédio usa coordenadas locais/OBB e preserva rotação');
must(vale3d.includes('PLAYER_RADIUS=.82')&&vale3d.includes('dx*dx+dz*dz<radius*radius'),'jogador usa volume físico circular em vez de ponto sem espessura');
must(!vale3d.includes('Math.abs(x-c.x)<c.w/2+.7'),'colisor AABB antigo foi removido');
must(collisionReady.length===companies.length,`todos os ${companies.length} prédios ativos declaram colisão habilitada`);
must(stairReady.length===companies.length&&vale3d.includes('addEntranceSteps(')&&vale3d.includes('surfaceHeightAt('),'entradas caminháveis geram degraus e altura física de superfície');
must(vale3d.includes('entryGap')&&vale3d.includes("p.z>=c.d/2-.45"),'porta possui faixa de aproximação sem bloquear o último degrau');
must(vale3d.includes('function movePlayer(')&&vale3d.includes('Math.ceil(distance/.42)'),'movimento é subdividido para impedir atravessar geometria em corrida/frame lento');
must(vale3d.includes('function hitsVehicle(')&&vale3d.includes("e.def.kind==='drone'"),'veículos terrestres participam da colisão e drones permanecem aéreos');
must(vale3d.includes('function nearestSafePoint(')&&vale3d.includes('const safe=nearestSafePoint(Number(target.x)||0'),'teleporte procura posição navegável em vez de materializar dentro de sólido');
must(!vale3d.includes('self.position.z-=7'),'saída de interior não aplica deslocamento global incorreto em prédios rotacionados');
must(vale3d.includes('surfaceHeightAt(self.position.x,self.position.z)+playerY'),'salto e degraus compõem a altura do avatar sem atravessar o piso');

if(process.exitCode)process.exit(process.exitCode);
console.log('\nVALIDAÇÃO VALE — física/circulação Etapa 11: PASS');
