const fs=require('fs'),path=require('path'),vm=require('vm');
const root=path.resolve(__dirname,'..');
const app=fs.readFileSync(path.join(root,'app.js'),'utf8');
const index=fs.readFileSync(path.join(root,'index.html'),'utf8');
const sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');
const version=JSON.parse(fs.readFileSync(path.join(root,'version.json'),'utf8'));
const checks=[]; const ok=(name,pass,detail='')=>checks.push({name,pass:!!pass,detail});
const eras={
 'plataforma-classica-ds':'1990-1999','chess-arena-360':'2020-atual','crystal-cascade-3d':'2020-atual',
 'hexa-reactor':'2020-atual','mundo-plataforma-ds-360':'2020-atual','plataforma-poligonal-ds-3d':'2020-atual'};
for(const [id,era] of Object.entries(eras)){
 const p=app.indexOf(`"id": "${id}"`), slice=app.slice(p,p+900);
 ok(`Era válida: ${id}`,p>=0&&slice.includes(`"era": "${era}"`),era);
}
ok('matchMedia protegido no bootstrap',app.includes("typeof window.matchMedia === 'function' ? window.matchMedia"));
ok('Polyfill matchMedia no index',index.includes("typeof window.matchMedia !== 'function'"));
ok('requestAnimationFrame possui fallback',index.includes("typeof window.requestAnimationFrame !== 'function'"));
ok('Object.fromEntries possui fallback',index.includes("typeof Object.fromEntries !== 'function'"));
ok('Erro JavaScript real é exibido',index.includes('A plataforma encontrou um erro ao iniciar.'));
ok('Timeout ampliado para 30s',index.includes('}, 30000);'));
ok('Roadmap tolera gameModes ausente',app.includes("(item.gameModes ?? []).join(', ') || '—'"));
ok('Roadmap tolera controls ausente',app.includes("(item.controls ?? []).join(', ') || '—'"));
ok('Roadmap tolera graphics ausente',app.includes("(item.graphics ?? []).join(', ') || '—'"));
ok('Roadmap tolera learning ausente',app.includes("(item.learning ?? []).join(', ') || '—'"));
ok('sessionStorage não bloqueia modo gráfico',app.includes("typeof sessionStorage !== 'undefined' ?"));
ok('Service Worker força cache novo',sw.includes("const VERSION = '0.39.0-hotfix1'"));
ok('version.json identifica hotfix',version.version==='0.39.0-hotfix1');
const gameFiles=['games/voxelcraft-ds/js/game.js','games/voxelcraft-ds/js/app.js','games/duo-elementos-ds/game.js','games/plataforma-classica-ds/game.js','games/plataforma-poligonal-ds-3d/game.js','games/chess-arena-360/game.js','games/hexa-reactor/game.js'];
ok('Runtimes isolados protegem matchMedia',gameFiles.every(f=>!/(^|[^\w])matchMedia\([^\n]+\)\.matches/.test(fs.readFileSync(path.join(root,f),'utf8').replace(/typeof matchMedia==='function'&&matchMedia/g,'SAFE'))));
// Execute main in a permissive fake DOM without matchMedia/sessionStorage/indexedDB.
function dummy(){return new Proxy(function(){},{get(t,p){if(p==='then')return undefined;if(p==='style')return {};if(p==='classList')return{contains:()=>false,add(){},remove(){},toggle(){}};if(p==='dataset')return{};if(['children','options'].includes(p))return[];if(p==='open'||p==='hidden'||p==='checked')return false;if(['value','textContent','innerHTML'].includes(p))return'';if(p==='contentWindow')return{postMessage(){}};if(p==='getContext')return()=>({});if(p===Symbol.iterator)return function*(){};return dummy();},set(){return true;},apply(){return dummy();}})}
let booted=false,bootError='';
try{
 const appEl=dummy(),document=new Proxy({querySelector:s=>s==='#app'?appEl:dummy(),querySelectorAll:()=>[],createElement:()=>dummy(),addEventListener(){},documentElement:dummy(),body:dummy(),head:dummy(),fullscreenElement:null,hidden:false},{get:(t,p)=>p in t?t[p]:dummy()});
 const c={console:{log(){},warn(){},error(){}},document,navigator:{hardwareConcurrency:4},location:{protocol:'https:',origin:'https://x',href:'https://x/'},localStorage:{getItem(){return null},setItem(){}},performance:{now:()=>Date.now()},requestAnimationFrame:f=>setTimeout(()=>f(Date.now()),0),cancelAnimationFrame:clearTimeout,setTimeout,clearTimeout,setInterval,clearInterval,IntersectionObserver:function(){this.observe=()=>{};this.disconnect=()=>{}},ResizeObserver:function(){this.observe=()=>{};this.disconnect=()=>{}},URL,URLSearchParams,Map,Set,WeakMap,WeakSet,Promise,Date,Math,JSON,Object,Array,String,Number,Boolean,RegExp,Error,TypeError,Intl,AbortController,fetch:async()=>({ok:true,json:async()=>version}),crypto:{randomUUID:()=> 'x'},HTMLDialogElement:function(){},devicePixelRatio:1,innerWidth:1280,innerHeight:720}; c.window=c;c.globalThis=c;c.addEventListener=()=>{};c.removeEventListener=()=>{};
 vm.runInNewContext(app,c,{filename:'app.js',timeout:15000});booted=true;
}catch(e){bootError=e&&e.message||String(e)}
ok('Bootstrap executa sem matchMedia/sessionStorage/IndexedDB',booted,bootError||'ok');
const passed=checks.filter(x=>x.pass).length,failed=checks.length-passed;
const result={product:'Fliperama DS',version:'0.39.0-hotfix1',phase:'Fase 7.28H',summary:{checks:checks.length,passed,failed},items:checks};
fs.writeFileSync(path.join(__dirname,'startup-hotfix-results-v0.39.0-hf1.json'),JSON.stringify(result,null,2)+'\n');
fs.writeFileSync(path.join(root,'TESTES-HOTFIX-INICIALIZACAO-v0.39.0-hf1.md'),['# Testes — Hotfix de inicialização v0.39.0 HF1','',`- Verificações: **${checks.length}**`,`- Aprovadas: **${passed}**`,`- Falhas: **${failed}**`,'',...checks.map(x=>`- ${x.pass?'✅':'❌'} **${x.name}**${x.detail?` — ${x.detail}`:''}`),''].join('\n'));
console.log(JSON.stringify(result.summary,null,2)); if(failed)process.exitCode=1;
