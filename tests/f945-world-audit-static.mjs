import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
const root=process.argv[2]||path.resolve(import.meta.dirname,'..');
const read=rel=>fs.readFileSync(path.join(root,rel),'utf8');
const checks=[];
function check(name,condition,detail=''){checks.push({name,ok:Boolean(condition),detail});if(!condition)process.exitCode=1;}
const audit=read('lobby/assets/core/world-runtime-audit.js');
const manager=read('lobby/assets/core/world-manager.js');
const adapter=read('lobby/assets/core/world-adapter.js');
const lobby=read('lobby/assets/lobby.js');
const boot=read('lobby/assets/boot.js');
const sw=read('lobby/sw.js');
const diag=read('lobby/assets/diagnostics.js');
check('audit module export',/export const WORLD_RUNTIME_AUDIT/.test(audit));
check('audit stages complete',['adapter','import','assets','runtime','renderer','firstFrame','input','interaction','unload'].every(stage=>audit.includes(stage)));
check('manager audit begin/fail/stop',manager.includes('WORLD_RUNTIME_AUDIT.begin')&&manager.includes('WORLD_RUNTIME_AUDIT.fail')&&manager.includes('WORLD_RUNTIME_AUDIT.stopCurrent'));
const list=adapter.match(/export const WORLD_ADAPTERS=Object\.freeze\(\[([\s\S]*?)\]\);/)?.[1]||'';
const adapterCount=(list.match(/WORLD_ADAPTER/g)||[]).length;
check('18 persistent world adapters',adapterCount===18,`found=${adapterCount}`);
check('airdrop excluded from persistent matrix',adapter.includes("auditEnabled:false"));
check('lazy import instrumentation',adapter.includes('markImport')&&adapter.includes('lazyFactory'));
check('lobby registers manifests',lobby.includes('WORLD_RUNTIME_AUDIT.registerWorlds(WORLD_REGISTRY.manifests)'));
check('3d first-frame instrumentation',lobby.includes("markFirstFrame(worldId,'3d'"));
check('2d first-frame instrumentation',lobby.includes("'lite',{source:'runtime_callback'}"));
check('interaction instrumentation',lobby.includes('WORLD_RUNTIME_AUDIT.markInteraction(action)'));
check('movement instrumentation',lobby.includes('WORLD_RUNTIME_AUDIT.markMovement'));
check('boot probes audit module',boot.includes("'core/world-runtime-audit.js'")&&boot.includes("requiredAssets=['lobby.js'"));
check('service worker caches audit module',sw.includes("./assets/core/world-runtime-audit.js?v=14.10.8.96-f945-world-audit"));
check('diagnostics schema 3',diag.includes('diagnosticSchema:3')&&diag.includes("14.10.8.96-F94.5"));
// Resolve all relative static/dynamic JS imports under lobby.
let importCount=0,missing=[];
for(const file of walk(path.join(root,'lobby')).filter(f=>f.endsWith('.js'))){
  const text=fs.readFileSync(file,'utf8');
  const re=/(?:from\s*|import\s*\()\s*['\"]([^'\"]+)['\"]/g;let m;
  while((m=re.exec(text))){const spec=m[1];if(!spec.startsWith('.'))continue;importCount++;const target=path.resolve(path.dirname(file),spec.split('?')[0]);if(!fs.existsSync(target))missing.push(`${path.relative(root,file)} -> ${spec}`);}
}
check('local imports resolve',missing.length===0,`imports=${importCount}; missing=${missing.slice(0,5).join(', ')}`);
console.log(JSON.stringify({suite:'F94.5 world audit static',passed:checks.filter(c=>c.ok).length,total:checks.length,checks},null,2));
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(ent=>{const p=path.join(dir,ent.name);return ent.isDirectory()?walk(p):[p];});}
