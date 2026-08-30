import fs from 'node:fs';
import path from 'node:path';

const root=path.resolve(process.argv[2]||'.');
let failures=0;
const pass=m=>console.log(`PASS  ${m}`);
const fail=m=>{failures++;console.error(`FAIL  ${m}`)};
const must=(cond,m)=>cond?pass(m):fail(m);
const read=rel=>fs.readFileSync(path.join(root,rel),'utf8');
const exists=rel=>fs.existsSync(path.join(root,rel));

const required=[
  'lobby/index.html','lobby/assets/boot.js','lobby/assets/lobby.js','lobby/assets/lobby-lite.js','lobby/assets/lobby3d.js','lobby/sw.js',
  'lobby/assets/world/campus-destinations.js','lobby/assets/world/campus-connections.js','lobby/assets/world/campus-environment.js',
  'lobby/assets/world/campus-experiences.js','lobby/assets/world/dynamic-world.js','repair-lobby.html'
];
for(const rel of required)must(exists(rel),`arquivo obrigatório ${rel}`);

for(const rel of ['lobby/index.html','lobby/assets/boot.js','lobby/assets/config.js','lobby/assets/lobby.js','lobby/assets/lobby-lite.js','lobby/assets/lobby3d.js','lobby/sw.js','repair-lobby.html']){
  must(read(rel).includes('14.10.8.61'),`release .61 em ${rel}`);
}

const sw=read('lobby/sw.js'),boot=read('lobby/assets/boot.js'),dest=read('lobby/assets/world/campus-destinations.js'),connections=read('lobby/assets/world/campus-connections.js'),env=read('lobby/assets/world/campus-environment.js'),lite=read('lobby/assets/lobby-lite.js'),main=read('lobby/assets/lobby.js'),three=read('lobby/assets/lobby3d.js');
for(const asset of ['campus-destinations.js','campus-connections.js','dynamic-world.js']){
  must(sw.includes(asset+'?v=14.10.8.61'),`Service Worker inclui ${asset}`);
  must(boot.includes(`'world/${asset}'`),`boot verifica ${asset}`);
}

const ids=['unified-platform','lab-virtual','ctf-ds','cosmos','desafio-ds','fliperama','game-info','practical-exam','bank','store'];
for(const id of ids)must(dest.includes(`id:'${id}'`),`destino ${id}`);
for(const arch of ['campus-hall','research-lab','cyber-fortress','observatory','challenge-arena','arcade','innovation-center','exam-center','bank','store'])must(dest.includes(`architecture:'${arch}'`),`arquitetura ${arch}`);
must(dest.includes('CAMPUS_TOOL_BUILDING_COLLIDERS'),'colliders dos prédios conectados');
must(dest.includes('entrance=Object.freeze'),'entradas calculadas por prédio');

for(const id of ['north-promenade','south-promenade','west-promenade','east-promenade','bank-link','store-link','lab-link','cosmos-link','ctf-link','desafio-link'])must(connections.includes(`'${id}'`),`conexão ${id}`);
must(connections.includes('CAMPUS_DISTRICT_GATES'),'portais de distrito');
must(connections.includes('CAMPUS_SKYBRIDGES'),'skybridges');
must(connections.includes('CAMPUS_WAYFINDING'),'wayfinding');

must(env.includes('createToolBuilding'),'arquitetura 3D dos prédios');
must(env.includes('createCampusConnectionLayer'),'malha de conexões 3D');
must(env.includes("experience.type==='tool-building'&&experience.entrance"),'interação 3D usa entrada');
must(three.includes('CAMPUS_TOOL_BUILDING_COLLIDERS'),'runtime 3D usa colliders dos prédios');
must(lite.includes('CAMPUS_CONNECTIONS'),'mapa 2D renderiza conexões');
must(lite.includes("experience.type==='tool-building'&&experience.entrance"),'interação 2D usa entrada');
must(main.includes('campus-destination-list'),'diretório funcional de prédios');
must(read('lobby/index.html').includes('Prédios e acessos'),'UI do diretório no Campus');

// Importações relativas JS precisam resolver localmente. Ignora URLs e imports dinâmicos não literais.
const jsFiles=[];
const walk=dir=>{for(const ent of fs.readdirSync(dir,{withFileTypes:true})){const full=path.join(dir,ent.name);if(ent.isDirectory())walk(full);else if(ent.isFile()&&/\.m?js$/.test(ent.name))jsFiles.push(full)}};
walk(path.join(root,'lobby'));
let importCount=0,missingImports=[];
const importRe=/(?:from\s*|import\s*\()\s*['"](\.{1,2}\/[^'"]+)['"]/g;
for(const file of jsFiles){const text=fs.readFileSync(file,'utf8');let m;while((m=importRe.exec(text))){importCount++;const spec=m[1].split('?')[0].split('#')[0],target=path.resolve(path.dirname(file),spec);if(!fs.existsSync(target))missingImports.push(`${path.relative(root,file)} -> ${spec}`);}}
must(missingImports.length===0,`imports locais resolvidos (${importCount} verificados)`);if(missingImports.length)missingImports.slice(0,20).forEach(x=>console.error('      '+x));

// Não aceitar referências runtime da release anterior dentro do Lobby.
const stale=[];
for(const file of [...jsFiles,path.join(root,'lobby/index.html'),path.join(root,'repair-lobby.html')]){const text=fs.readFileSync(file,'utf8');if(text.includes('14.10.8.60'))stale.push(path.relative(root,file));}
must(stale.length===0,'sem referências runtime v14.10.8.60 no Lobby');if(stale.length)stale.forEach(x=>console.error('      '+x));

if(failures){console.error(`\nVALIDAÇÃO v14.10.8.61: FAIL (${failures})`);process.exit(1)}
console.log('\nVALIDAÇÃO v14.10.8.61: PASS');
