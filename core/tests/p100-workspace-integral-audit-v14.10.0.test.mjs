import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {execFileSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';
const root=process.cwd();
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const imp=async p=>import(pathToFileURL(path.join(root,p)).href+`?p100=${Date.now()}-${Math.random()}`);
const {EXERCISE_MANIFEST}=await imp('atividades/assets/data/exercise-manifest.js');
const refs={
 ...(await imp('atividades/assets/data/exercise-reference.js')).EXERCISE_REFERENCES,
 ...(await imp('atividades/assets/data/exercise-reference-extra.js')).EXERCISE_REFERENCE_EXTRAS,
 ...(await imp('atividades/assets/data/exercise-reference-synced.js')).EXERCISE_REFERENCE_SYNCED,
 ...(await imp('atividades/assets/data/exercise-reference-3ds-restored.js')).EXERCISE_REFERENCE_3DS_RESTORED,
 ...(await imp('atividades/assets/data/exercise-reference-ds2-corrected.js')).EXERCISE_REFERENCE_DS2_CORRECTED
};
const ws=read('atividades/assets/js/workspace.js'), html=read('atividades/index.html'), css=read('atividades/assets/css/app.css');
const app=read('atividades/assets/js/app.js'), studentFiles=read('core/edge-functions/student-files/index.ts'), grade=read('core/edge-functions/exercise-autograde/index.ts');
const release=JSON.parse(read('release-current.json')), version=JSON.parse(read('atividades/version.json'));
const aliases=name=>{const n=String(name||'').toLowerCase(),s=new Set([n]);if(n==='style.css')s.add('estilo.css');if(n==='estilo.css')s.add('style.css');if(n==='app.js')s.add('script.js');if(n==='script.js')s.add('app.js');if(n==='atividade.md')s.add('referencia.md');if(n==='referencia.md')s.add('atividade.md');if(n==='main.kt')s.add('mainactivity.kt');if(n==='mainactivity.kt')s.add('main.kt');return [...s]};
const refFile=(ref,name)=>{for(const a of aliases(name)){for(const [k,v] of Object.entries(ref?.files||{}))if(k.toLowerCase()===a)return String(v??'');}return null;};
const htmlIds=src=>new Set([...src.matchAll(/\bid\s*=\s*["']([^"']+)["']/gi)].map(m=>m[1]));
const jsIds=src=>new Set([...src.matchAll(/(?:getElementById\s*\(\s*["']([^"']+)["']|querySelector(?:All)?\s*\(\s*["']#([^"']+)["'])/gi)].map(m=>m[1]||m[2]).filter(Boolean));

test('P10 catálogo inteiro possui referência coerente e sem newline escapado fantasma',()=>{
 assert.equal(Object.keys(EXERCISE_MANIFEST).length,62);
 const issues=[];
 for(const [key,meta] of Object.entries(EXERCISE_MANIFEST)){
   const ref=refs[key]; if(!ref){issues.push(`${key}:sem referência`);continue;}
   for(const def of meta.files||[]){
     const content=refFile(ref,def.filename); if(content===null){issues.push(`${key}:${def.filename}:referência ausente`);continue;}
     const real=(content.match(/\n/g)||[]).length, escaped=(content.match(/\\n/g)||[]).length;
     if(real===0&&escaped>=2)issues.push(`${key}:${def.filename}:newline literal`);
     if(/\n[ \t]*\n[ \t]*\n/.test(content))issues.push(`${key}:${def.filename}:3 linhas vazias consecutivas`);
   }
 }
 assert.deepEqual(issues,[]);
});

test('P10 referências de código compilam e arquivos web permanecem conectados',()=>{
 const issues=[],tmp=fs.mkdtempSync(path.join(os.tmpdir(),'agv-p100-'));
 try{
  for(const [key,meta] of Object.entries(EXERCISE_MANIFEST)){
   const ref=refs[key];
   for(const def of meta.files||[]){
    const src=refFile(ref,def.filename);if(src===null)continue;
    if(/\.js$/i.test(def.filename)){try{new Function(src)}catch(e){issues.push(`${key}:${def.filename}:JS ${e.message}`)}}
    if(/\.py$/i.test(def.filename)){const p=path.join(tmp,'main.py');fs.writeFileSync(p,src);try{execFileSync('python3',['-m','py_compile',p],{stdio:'pipe'})}catch(e){issues.push(`${key}:${def.filename}:Python inválido`)}}
   }
   const h=(meta.files||[]).find(x=>/\.html?$/i.test(x.filename));if(!h)continue;
   const hs=refFile(ref,h.filename)||'', ids=htmlIds(hs);
   const c=(meta.files||[]).find(x=>/\.css$/i.test(x.filename)),j=(meta.files||[]).find(x=>/\.js$/i.test(x.filename));
   if(c&&!new RegExp(`href=["'][^"']*${c.filename.replace('.','\\.')}[^"']*["']`,'i').test(hs))issues.push(`${key}:CSS não conectado`);
   if(j&&!new RegExp(`src=["'][^"']*${j.filename.replace('.','\\.')}[^"']*["']`,'i').test(hs))issues.push(`${key}:JS não conectado`);
   if(c&&/<style\b/i.test(hs))issues.push(`${key}:CSS embutido com arquivo CSS separado`);
   if(j){for(const id of jsIds(refFile(ref,j.filename)||''))if(!ids.has(id))issues.push(`${key}:JS aponta #${id} ausente`);}
  }
 } finally{fs.rmSync(tmp,{recursive:true,force:true});}
 assert.deepEqual(issues,[]);
});

test('P10 renderer não cria linha, espaço ou editor fantasma',()=>{
 assert.match(ws,/lines\[lines\.length-1\]===''\)lines\.pop\(\)/);
 assert.match(ws,/\}\)\.join\(''\)/);
 assert.doesNotMatch(ws,/highlightCode\(editor\.value[^\n]*\+\s*['"]\\n/);
 assert.match(css,/\.reference-code\{[\s\S]*?white-space:normal!important/);
 assert.match(css,/\.reference-code \.reference-line-code\{[\s\S]*?white-space:pre!important/);
 assert.match(css,/\.reference-code \.reference-line\{[\s\S]*?line-height:var\(--code-line-height\)!important/);
 assert.match(css,/\.editor-shell\.highlight-ready \.code-editor\{color:transparent/);
});

test('P10 Classroom e GitHub permanecem no workspace e salvam antes de abrir',()=>{
 for(const id of ['github-btn','classroom-btn','workspace-save-now-btn','download-current-btn','download-zip-btn'])assert.match(html,new RegExp(`id=["']${id}["']`));
 assert.match(ws,/async function openStudentGithub\(\)[\s\S]*?saveAllBeforeExport\(\)/);
 assert.match(ws,/repository_urls/);assert.match(ws,/https:\/\/github\.com/);
 assert.match(ws,/async function openStudentClassroom\(\)[\s\S]*?saveAllBeforeExport\(\)/);
 assert.match(ws,/classroom_links/);
});

test('P10 digitação mostra conclusão, acerto e erro com autocorreção após pausa',()=>{
 for(const id of ['completion-score','autograde-score','error-score','autograde-bar'])assert.match(html,new RegExp(`id=["']${id}["']`));
 assert.match(ws,/function estimateCodeCompletion\(\)/);
 assert.match(ws,/function scheduleLiveAutograde\(force=false\)/);
 assert.match(ws,/const wait=force\?250:1800/);
 assert.match(ws,/elapsed<3500/);
 assert.match(ws,/runAutoGrade\(\{quiet:true,automatic:true\}\)/);
 assert.match(ws,/errorEl\.textContent=hasGrade\?`\$\{100-score\}%`:'—'/);
 assert.match(html,/<progress id="autograde-bar"/);
 assert.doesNotMatch(ws,/autograde-bar[^\n]*\.style/);
});

test('P10 preview preserva defer e continua isolado',async()=>{
 const {buildHtmlPreview}=await imp('atividades/assets/js/preview-builder.js');
 const out=buildHtmlPreview([
  {filename:'index.html',content:'<!doctype html><html><head><link rel="stylesheet" href="estilo.css"><script src="script.js" defer></script></head><body><button id="x">X</button></body></html>'},
  {filename:'estilo.css',content:'#x { color: red; }'},
  {filename:'script.js',content:'document.querySelector("#x").textContent="OK";'}
 ]);
 assert.match(out,/<style data-agv-preview-source="estilo\.css">/);
 assert.ok(out.indexOf('<button id="x">')<out.indexOf('data-agv-preview-source="script.js"'),'script deferido deve ficar depois do DOM');
 assert.match(html,/id="preview-frame"[^>]*sandbox="allow-scripts"/);
 assert.doesNotMatch(html,/id="preview-frame"[^>]*allow-same-origin/);
});

test('P10 referência Markdown/Kotlin e arquivos do aluno usam aliases compatíveis',()=>{
 assert.match(ws,/atividade\.md[\s\S]*referencia\.md/);
 assert.match(ws,/mainactivity\.kt[\s\S]*main\.kt/);
 assert.match(studentFiles,/atividade\.md[\s\S]*referencia\.md/);
 assert.match(studentFiles,/action==='save_all'\|\|action==='checkpoint'/);
 assert.match(studentFiles,/requireLiveAuthSession/);
 assert.match(studentFiles,/reconciled:missing\.length/);
});

test('P10 release, UI e autocorreção server-side estão alinhados',()=>{
 assert.equal(release.version,'14.10.8.18');assert.equal(version.version,'0.22.8.14');assert.equal(version.release,'v14.10.8.18');
 assert.match(html,/app\.js\?v=14\.10\.8/);assert.match(app,/workspace\.js\?v=14\.10\.8/);
 assert.match(grade,/version:'autograde-v8-reference-history'/);assert.match(grade,/required_files_incomplete/);assert.match(grade,/submitted_score:officialScore/);
});
