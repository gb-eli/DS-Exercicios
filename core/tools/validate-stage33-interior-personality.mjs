import fs from 'node:fs';
const read=p=>fs.readFileSync(p,'utf8');
const must=(ok,msg)=>{console.log(`${ok?'PASS':'FAIL'}  ${msg}`);if(!ok)process.exitCode=1};
const interiors=read('lobby/assets/world/campus-interiors.js');
const d3=read('lobby/assets/lobby3d.js');
const lite=read('lobby/assets/lobby-lite.js');
const lobby=read('lobby/assets/lobby.js');
const boot=read('lobby/assets/boot.js');
const vendor=read('lobby/assets/vendor-loader.js');
const index=read('lobby/index.html');
const sw=read('lobby/sw.js');

for(const id of ['unified-platform','bank','store','lab-virtual','ctf-ds','cosmos','desafio-ds','fliperama','game-info','practical-exam']){
  must(interiors.includes(`${id}:Object.freeze`)||interiors.includes(`'${id}':Object.freeze`),`perfil visual interno ${id}`);
}
for(const id of ['1ds','2ds','3ds','sub'])must(interiors.includes(`${id}:Object.freeze`)||interiors.includes(`'${id}':Object.freeze`),`tema acadêmico ${id}`);
must(interiors.includes('CAMPUS_INTERIOR_STYLE_PROFILES')&&interiors.includes('CAMPUS_CLASSROOM_INTERIOR_THEMES'),'catálogos de estilo interno exportados');
must(interiors.includes('interiorRoomStyle')&&interiors.includes("prop:'exam'")&&interiors.includes("prop:'workbench'")&&interiors.includes("prop:'console'"),'salas possuem props por função');
must(interiors.includes('style:CAMPUS_INTERIOR_STYLE_PROFILES[destination.id]'),'perfil funcional carrega a identidade visual');
must(d3.includes('CAMPUS_CLASSROOM_INTERIOR_THEMES')&&d3.includes('theme.motif'),'laboratórios acadêmicos 3D possuem assinatura por turma');
must(d3.includes('function interiorRoomProp(')&&d3.includes("case 'exam'")&&d3.includes("case 'orbital'")&&d3.includes("case 'maker'"),'renderer 3D monta equipamentos internos especializados');
must(d3.includes('const floorMap=(profile.floorMaps||[]).find')&&d3.includes('interiorRoomStyle(room.kind,profile.accent)'),'props 3D derivam do blueprint funcional existente');
must(d3.includes('ambientNodes')&&d3.includes('node.floor!==activeToolFloor')&&d3.includes('!reducedMotion'),'animações internas limitadas ao piso ativo e acessibilidade');
must(d3.includes('const ensureToolInterior=id=>')&&d3.includes('toolInterior(profile)')&&d3.includes('releaseToolInterior')&&d3.includes('disposeObject(room.group)'),'interiores continuam lazy e descartáveis');
must(lite.includes('interiorRoomStyle')&&lite.includes('style=profile.style||{}')&&lite.includes('roomStyle.icon'),'modo 2D usa a mesma identidade e ícones das salas');
const stageAtLeast=(text,min)=>[...text.matchAll(/stage(\d+)/g)].some(m=>Number(m[1])>=min);
must([d3,lite,lobby].every(t=>t.includes('campus-interiors.js?v=14.10.8.65-stage')&&stageAtLeast(t,33)),'consumidores usam cache-bust de fase >=33');
must([vendor,boot,lobby,index].every(t=>stageAtLeast(t,33))&&index.includes('vendor-loader.js?v=14.10.8.65-stage'),'cadeia de boot publica fase >=33');
must(/agv-lobby-runtime-\$\{VERSION\}-stage(\d+)/.test(sw)&&stageAtLeast(sw,33)&&sw.includes('campus-interiors.js?v=14.10.8.65-stage'),'Service Worker publica interiores em fase >=33');
must(![interiors,d3,lite,lobby,boot,vendor,sw].some(t=>/service_role|sb_secret/i.test(t)),'sem segredo de backend no frontend');

if(process.exitCode)process.exit(process.exitCode);
console.log('\nVALIDAÇÃO ETAPA 33 — FASE 4.1: PASS');
