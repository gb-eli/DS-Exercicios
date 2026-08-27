import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'../..');
const dataRoot=path.join(root,'atividades/assets/data');
const html=fs.readFileSync(path.join(root,'atividades/index.html'),'utf8');
const js=fs.readFileSync(path.join(root,'atividades/assets/js/workspace.js'),'utf8');
const app=fs.readFileSync(path.join(root,'atividades/assets/js/app.js'),'utf8');
const css=fs.readFileSync(path.join(root,'atividades/assets/css/app.css'),'utf8');
const restored=fs.readFileSync(path.join(dataRoot,'exercise-reference-3ds-restored.js'),'utf8');

const mod=async(name)=>import(pathToFileURL(path.join(dataRoot,name)).href+`?test=${Date.now()}-${Math.random()}`);
const manifest=(await mod('exercise-manifest.js')).EXERCISE_MANIFEST;
const refs={
  ...(await mod('exercise-reference.js')).EXERCISE_REFERENCES,
  ...(await mod('exercise-reference-extra.js')).EXERCISE_REFERENCE_EXTRAS,
  ...(await mod('exercise-reference-synced.js')).EXERCISE_REFERENCE_SYNCED,
  ...(await mod('exercise-reference-3ds-restored.js')).EXERCISE_REFERENCE_3DS_RESTORED
};
const codingSubjects=new Set(['introducao-programacao','programacao-front-end','programacao-desenvolvimento-sistemas','programacao-front-end-sub','programacao-mobile-sub']);
const aliases=(filename)=>{
  const name=String(filename).toLowerCase();
  if(name==='style.css')return ['style.css','estilo.css'];
  if(name==='estilo.css')return ['estilo.css','style.css'];
  if(name==='app.js')return ['app.js','script.js'];
  if(name==='script.js')return ['script.js','app.js'];
  return [name];
};

test('P8.7 has public reference coverage for every programming exercise and every expected file',()=>{
  const coding=Object.entries(manifest).filter(([,meta])=>codingSubjects.has(meta.subject));
  const counts=Object.fromEntries([...codingSubjects].map(subject=>[subject,coding.filter(([,meta])=>meta.subject===subject).length]));
  assert.deepEqual(counts,{
    'introducao-programacao':8,
    'programacao-front-end':20,
    'programacao-desenvolvimento-sistemas':8,
    'programacao-front-end-sub':10,
    'programacao-mobile-sub':5
  },'catálogo de programação deve acompanhar o recorte ativo de produção');
  const missing=[];
  for(const [key,meta] of coding){
    const ref=refs[key];
    const available=Object.keys(ref?.files||{}).map(x=>x.toLowerCase());
    for(const file of (meta.files||[])){
      if(!aliases(file.filename).some(name=>available.includes(name))) missing.push(`${key}:${file.filename}`);
    }
  }
  assert.deepEqual(missing,[],'nenhum arquivo de programação pode ficar sem referência pública');
});

test('P8.7 restores 3DS 05-08 with HTML, CSS and JavaScript references',()=>{
  for(let n=5;n<=8;n++){
    const ref=refs[`programacao-desenvolvimento-sistemas:${n}`];
    assert.ok(ref,`referência do 3DS ${n} ausente`);
    for(const filename of ['index.html','estilo.css','script.js']){
      assert.ok(String(ref.files?.[filename]||'').trim().length>20,`${filename} do 3DS ${n} está vazio`);
    }
  }
  assert.doesNotMatch(restored,/minimum_score|private_validation|service_role|criteria\s*:/i,'bundle público restaurado não deve incluir regra privada');
});

test('P8.7 Supabase is primary but an empty database row cannot erase a valid bundle fallback',()=>{
  assert.match(js,/from\('exercise_reference_files'\)/);
  assert.match(js,/for\(const file of fallbackFiles\)state\.referenceFiles\.set/);
  assert.match(js,/if\(!content\.trim\(\)\)continue/);
  assert.match(js,/source:'supabase'/);
  assert.match(js,/EXERCISE_REFERENCE_3DS_RESTORED/);
});

test('P8.7 reference and editor have VS Code-like line numbers and safe per-line reference highlighting',()=>{
  assert.match(html,/id="editor-line-numbers"/);
  assert.match(html,/id="reference-code"/);
  assert.match(js,/function renderEditorLineNumbers/);
  assert.match(js,/function renderNumberedCode/);
  assert.match(js,/\.split\('\\n'\)/);
  assert.match(js,/highlightCode\(raw,language\)/);
  assert.match(css,/\.reference-line-number/);
  assert.match(css,/\.editor-line-numbers/);
  assert.match(css,/\.tok-keyword\{color:#569cd6/);
  assert.match(css,/\.tok-string\{color:#ce9178/);
});

test('P8.7 keeps reference left and editor right on notebooks, stacked on mobile',()=>{
  assert.match(css,/@media\(min-width:900px\)[\s\S]*reference-active\.tools-collapsed[\s\S]*grid-template-columns:minmax\(0,1fr\) minmax\(0,1fr\)/);
  assert.match(css,/output-panel\{grid-column:1!important;grid-row:1!important/);
  assert.match(css,/workspace-panel\{grid-column:2!important;grid-row:1!important/);
  assert.match(css,/@media\(max-width:760px\)[\s\S]*reference-active \.output-panel\{order:1/);
  assert.match(css,/reference-active \.workspace-panel\{order:2/);
});

test('P8.7 manifest also participates in cache busting',()=>{
  assert.match(js,/exercise-manifest\.js\?v=14\.(?:8|9)\.\d+|exercise-manifest\.js\?v=14\.10\.\d+/);
  assert.match(app,/exercise-manifest\.js\?v=14\.(?:8|9)\.\d+|exercise-manifest\.js\?v=14\.10\.\d+/);
  assert.match(html,/app\.js\?v=14\.(?:(?:8|9)\.\d+|10\.\d+)/);
});
