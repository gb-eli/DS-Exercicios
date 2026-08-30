import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root=path.resolve(process.argv[2]||'.');
const read=rel=>fs.readFileSync(path.join(root,rel),'utf8');
const must=(ok,label)=>{if(!ok){console.error(`FAIL  ${label}`);process.exitCode=1}else console.log(`PASS  ${label}`)};
const exists=rel=>fs.existsSync(path.join(root,rel));

const protectedPages=[
  'index.html','lobby/index.html','atividades/index.html','professor/index.html','admin/index.html',
  'prova/index.html','prova/admin.html','prova/simulador.html','recuperacao/index.html','recuperacao/admin.html','economia/index.html',
  'sistemas/01-lab-virtual/LABDS/index.html','sistemas/01-lab-virtual/LABDS/lab/index.html','sistemas/02-ctf-ds/ctf/index.html',
  'sistemas/03-planetario-ds/universods/index.html','sistemas/04-desafio-ds/desafio 33/index.html','sistemas/05-fliperama-ds/flipds/index.html',
  'sistemas/06-game-informatica/desafio-informatica-v2.2.0/index.html'
];

for(const rel of ['auth/index.html','auth/auth.js','core/session/unified-auth-guard.js','lobby/assets/world/campus-destinations.js','economia/index.html'])must(exists(rel),`arquivo obrigatório ${rel}`);
for(const rel of protectedPages)must(exists(rel)&&read(rel).includes('unified-auth-guard.js'),`guard central em ${rel}`);

const authHtml=read('auth/index.html');
must(authHtml.includes('id="login-form"'),'login oficial possui e-mail/senha');
must(authHtml.includes('id="google-btn"'),'login oficial possui Google');
must(authHtml.includes('id="forgot-btn"'),'login oficial possui recuperação');
must(read('core/session/unified-auth-guard.js').includes('currentReturnTo(){try'),'returnTo da rota atual preservado');

const activeAuthFiles=[
  'professor/assets/professor.js','admin/assets/admin.js','prova/assets/student.js','prova/assets/admin.js','prova/assets/simulator.js',
  'recuperacao/assets/student.js','recuperacao/assets/admin.js','sistemas/01-lab-virtual/LABDS/lab/js/agv-core-bridge.js',
  'sistemas/02-ctf-ds/ctf/js/app.js','sistemas/02-ctf-ds/ctf/js/core/agv-core-bridge.js',
  'sistemas/04-desafio-ds/desafio 33/js/agv-core-session.js','sistemas/05-fliperama-ds/flipds/agv-core-session.js',
  'sistemas/06-game-informatica/desafio-informatica-v2.2.0/assets/js/app.js'
];
for(const rel of activeAuthFiles){const t=read(rel);must(!t.includes('/auth/v1/token?grant_type=password')&&!t.includes('auth.signIn('),`sem login por senha paralelo em ${rel}`)}

const catalog=JSON.parse(read('core/catalog/platform-integration-v14.0.json'));
for(const id of ['lab-sub','lab-ds1','lab-ds2','lab-ds3']){const item=(catalog.platforms||[]).find(x=>x.id===id);must(item&&item.legacy===true&&item.readyForUnifiedHub===false,`legado ${id} fora do Hub`)}
const dest=read('lobby/assets/world/campus-destinations.js');
for(const id of ['unified-platform','lab-virtual','ctf-ds','cosmos','desafio-ds','fliperama','game-info','practical-exam','bank','store'])must(dest.includes(`id:'${id}'`),`destino Lobby ${id}`);
must(/campus-destinations\.js\?v=14\.10\.8\.\d+/.test(read('lobby/sw.js')),'Service Worker inclui manifesto de destinos');

for(const table of ['wallets','wallet_ledger','store_items','inventory_instances'])must(read('economia/economia.js').includes(table),`economia usa ${table}`);

const scanExtensions=new Set(['.js','.mjs','.html','.json','.css']);
const secretPatterns=[/sb_secret_[A-Za-z0-9_-]+/,/GOCSPX-[A-Za-z0-9_-]+/];
let secretHits=[];
function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const full=path.join(dir,entry.name);if(entry.isDirectory()){if(['.git'].includes(entry.name))continue;walk(full);continue}if(!scanExtensions.has(path.extname(entry.name)))continue;const rel=path.relative(root,full).replaceAll('\\','/');if(rel.startsWith('docs/')||rel.startsWith('core/database/')||rel.startsWith('core/edge-functions/'))continue;const text=fs.readFileSync(full,'utf8');if(secretPatterns.some(r=>r.test(text)))secretHits.push(rel)}}
walk(root);
must(secretHits.length===0,`nenhum Client Secret/sb_secret no frontend${secretHits.length?`: ${secretHits.join(', ')}`:''}`);

if(process.exitCode)process.exit(process.exitCode);
console.log('\nVALIDAÇÃO v14.10.8.59: PASS');
