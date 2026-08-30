import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

const root=process.cwd();
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const exists=p=>fs.existsSync(path.join(root,p));
const version=JSON.parse(read('atividades/version.json'));
const release=JSON.parse(read('release-current.json'));
const manifest=(await import(pathToFileURL(path.join(root,'atividades/assets/data/exercise-manifest.js')).href+`?p91=${Date.now()}`)).EXERCISE_MANIFEST;
const refs={
  ...(await import(pathToFileURL(path.join(root,'atividades/assets/data/exercise-reference.js')).href+`?p91=${Date.now()}-1`)).EXERCISE_REFERENCES,
  ...(await import(pathToFileURL(path.join(root,'atividades/assets/data/exercise-reference-extra.js')).href+`?p91=${Date.now()}-2`)).EXERCISE_REFERENCE_EXTRAS,
  ...(await import(pathToFileURL(path.join(root,'atividades/assets/data/exercise-reference-synced.js')).href+`?p91=${Date.now()}-3`)).EXERCISE_REFERENCE_SYNCED,
  ...(await import(pathToFileURL(path.join(root,'atividades/assets/data/exercise-reference-3ds-restored.js')).href+`?p91=${Date.now()}-4`)).EXERCISE_REFERENCE_3DS_RESTORED
};
const activitiesHtml=read('atividades/index.html');
const app=read('atividades/assets/js/app.js');
const workspace=read('atividades/assets/js/workspace.js');
const supabaseJs=read('atividades/assets/js/supabase.js');
const py=read('atividades/assets/js/python-runtime.js');
const preview=read('atividades/preview/index.html');
const css=read('atividades/assets/css/app.css');
const adminAuth=read('core/edge-functions/admin-auth-sessions/index.ts');
const adminRpc=read('core/database/030_p76_auth_session_revocation.sql');

function subjectCount(subject){return Object.values(manifest).filter(x=>x?.subject===subject).length;}
function ids(html){return [...html.matchAll(/\sid=["']([^"']+)["']/g)].map(m=>m[1]);}
function localRefs(html){
  return [...html.matchAll(/(?:src|href)=["']([^"'#?]+)(?:\?[^"']*)?["']/g)].map(m=>m[1]).filter(x=>!x.startsWith('http')&&!x.startsWith('data:')&&!x.startsWith('mailto:')&&!x.startsWith('javascript:'));
}
function resolveHtmlRef(baseFile,ref){
  const base=path.dirname(path.join(root,baseFile));
  const clean=ref.startsWith('/')?ref.slice(1):ref;
  return ref.startsWith('/')?path.join(root,clean):path.resolve(base,clean);
}

test('P8.11 release, UI and cache remain synchronized in later candidates',()=>{
  assert.match(release.version,/^14\.(?:8\.(?:11|1[2-9]|[2-9]\d)|9\.\d+|10\.\d+)(?:\.\d+)?$/);
  assert.match(version.version,/^0\.(?:20\.(?:11|1[2-9]|[2-9]\d)|2[1-9]\.\d+|22\.\d+)(?:\.\d+)?$/);
  assert.equal(version.release,`v${release.version}`);
  assert.ok(['RELEASE_CANDIDATE','READY_FOR_DEPLOY'].includes(release.status));
  const escaped=(release.runtimeCacheVersion||release.version).replace(/\./g,'\\.');
  assert.match(activitiesHtml,new RegExp(`app\\.js\\?v=${escaped}`));
  assert.match(read('admin/index.html'),new RegExp(`admin\\.js\\?v=${escaped}`));
  assert.match(read('professor/index.html'),new RegExp(`professor\\.js\\?v=${escaped}`));
});

test('P8.11 critical JS CSS Worker and Preview imports use the current cache bust',()=>{
  const escaped=(release.runtimeCacheVersion||release.version).replace(/\./g,'\\.');
  for(const token of ['workspace.js','supabase.js']){
    const tokenRx=token.replace(/\./g,'\\.');
    assert.match(app,new RegExp(`${tokenRx}\\?v=${escaped}`));
  }
  assert.match(supabaseJs,new RegExp(`config\\.js\\?v=${escaped}`));
  assert.match(workspace,new RegExp(`python-runtime\\.js\\?v=${escaped}`));
  assert.match(workspace,new RegExp(`validation\\.js\\?v=${escaped}`));
  assert.match(py,new RegExp(`python-worker\\.js\\?v=${escaped}`));
  assert.match(preview,new RegExp(`host\\.css\\?v=${escaped}`));
  assert.match(preview,new RegExp(`host\\.js\\?v=${escaped}`));
  assert.match(activitiesHtml,new RegExp(`app\\.css\\?v=${escaped}`));
});

test('P8.11 Supabase SDK outage fails visibly instead of hanging on loading',()=>{
  assert.match(supabaseJs,/SUPABASE_SDK_AVAILABLE/);
  assert.match(supabaseJs,/SUPABASE_SDK_ERROR/);
  assert.match(supabaseJs,/cdn\.jsdelivr\.net/);
  assert.match(supabaseJs,/unpkg\.com/);
  assert.match(app,/if \(SUPABASE_SDK_AVAILABLE\)/);
  assert.match(app,/Não foi possível carregar o serviço de autenticação/);
});

test('P8.11 admin auth revocation is JWT guarded and service-only at source',()=>{
  assert.match(adminAuth,/requireLiveAuthSession/);
  assert.match(adminAuth,/admin_auth_session_count_service/);
  assert.match(adminAuth,/admin_revoke_auth_sessions_service/);
  assert.match(adminRpc,/revoke all on function public\.admin_auth_session_count_service\(uuid\) from public, anon, authenticated/);
  assert.match(adminRpc,/grant execute on function public\.admin_revoke_auth_sessions_service\(uuid\) to service_role/);
});

test('P8.11 public manifest matches the production catalogue cut',()=>{
  assert.equal(subjectCount('analise-metodo-sistemas'),5);
  assert.equal(subjectCount('introducao-programacao'),8);
  assert.equal(subjectCount('inovacao-tecnologica-empreendedorismo'),6);
  assert.equal(subjectCount('programacao-front-end'),20);
  assert.equal(subjectCount('programacao-desenvolvimento-sistemas'),8);
  assert.equal(subjectCount('programacao-front-end-sub'),10);
  assert.equal(subjectCount('programacao-mobile-sub'),5);
  assert.ok(!manifest['programacao-front-end:21']);
  assert.equal(manifest['analise-metodo-sistemas:5']?.titulo,'Auditoria de um Sistema Real');
  assert.equal(manifest['inovacao-tecnologica-empreendedorismo:6']?.titulo,'Exercício 06 — Viabilidade financeira simplificada');
});

test('P8.11 every manifest exercise has a usable public reference fallback',()=>{
  const missing=[];
  for(const [key,meta] of Object.entries(manifest)){
    const ref=refs[key];
    if(!ref||!Object.values(ref.files||{}).some(v=>String(v||'').trim().length>10)) missing.push(key);
    if(['analise-metodo-sistemas','inovacao-tecnologica-empreendedorismo'].includes(meta.subject)){
      assert.ok(String(ref?.files?.['referencia.md']||'').trim().length>20,`${key} precisa de referencia.md local`);
    }
  }
  assert.deepEqual(missing,[]);
});

test('P8.11 workspace keeps reference/editor/download/GitHub/Classroom controls',()=>{
  for(const id of ['reference-code','editor-line-numbers','code-editor','workspace-save-now-btn','download-current-btn','download-zip-btn','github-btn','classroom-btn']) assert.match(activitiesHtml,new RegExp(`id=["']${id}["']`));
  assert.match(workspace,/from\('exercise_reference_files'\)/);
  assert.match(workspace,/saveAllBeforeExport/);
  assert.match(workspace,/createStoreZip/);
  assert.match(workspace,/repository_urls/);
  assert.match(workspace,/classroom_links/);
  assert.match(workspace,/lang==='kotlin'\|\|lang==='kt'/);
  assert.match(workspace,/\bpackage\|import\|class\|object\|interface\|fun\|val\|var\b/);
});

test('P8.11 responsive reference layout is 50-50 on notebook and stacked on mobile',()=>{
  assert.match(css,/@media\(min-width:900px\)[\s\S]*grid-template-columns:minmax\(0,1fr\) minmax\(0,1fr\)/);
  assert.match(css,/@media\(max-width:760px\)[\s\S]*reference-active \.output-panel\{order:1/);
  assert.match(css,/reference-active \.workspace-panel\{order:2/);
});

test('P8.11 key HTML routes have no duplicate IDs and all local references exist',()=>{
  for(const file of ['atividades/index.html','admin/index.html','professor/index.html','atividades/preview/index.html','validacao-antiga/index.html']){
    const html=read(file), seen=new Set(), duplicates=[];
    for(const id of ids(html)){if(seen.has(id))duplicates.push(id);seen.add(id);}
    assert.deepEqual(duplicates,[],`${file} não pode ter IDs duplicados`);
    const missing=[];
    for(const ref of localRefs(html)){
      const resolved=resolveHtmlRef(file,ref);
      if(!fs.existsSync(resolved))missing.push(ref);
    }
    assert.deepEqual(missing,[],`${file} possui referência local inexistente`);
  }
});

test('P8.11 public frontends do not contain service-role or private-validator secrets',()=>{
  for(const dir of ['atividades','admin','professor']){
    const walk=d=>fs.readdirSync(path.join(root,d),{withFileTypes:true}).flatMap(ent=>ent.isDirectory()?walk(path.join(d,ent.name)):[path.join(d,ent.name)]);
    for(const f of walk(dir).filter(f=>/\.(?:js|html|json)$/i.test(f))){
      const text=read(f);
      assert.doesNotMatch(text,/SUPABASE_SERVICE_ROLE_KEY|AGV_PRIVATE_EXERCISE_RULES_V1|sb_secret_/i,`segredo no bundle público: ${f}`);
    }
  }
});
