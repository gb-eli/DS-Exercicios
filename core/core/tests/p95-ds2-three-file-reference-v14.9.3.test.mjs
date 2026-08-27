import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=p=>fs.readFileSync(p,'utf8');
const {EXERCISE_REFERENCE_DS2_CORRECTED}=await import('../../atividades/assets/data/exercise-reference-ds2-corrected.js');
const workspace=read('atividades/assets/js/workspace.js');
const grade=read('core/edge-functions/exercise-autograde/index.ts');
const studentFiles=read('core/edge-functions/student-files/index.ts');
const guard=read('core/database/038_p95_ds2_three_file_reference_guard.sql');
const release=JSON.parse(read('release-current.json'));
const version=JSON.parse(read('atividades/version.json'));
const html=read('atividades/index.html');

const referenceFor=n=>EXERCISE_REFERENCE_DS2_CORRECTED[`programacao-front-end:${n}`];
const ids=html=>new Set([...html.matchAll(/\bid\s*=\s*["']([^"']+)["']/gi)].map(m=>m[1]));
const jsTargetIds=js=>new Set([
  ...[...js.matchAll(/getElementById\s*\(\s*["']([^"']+)["']/gi)].map(m=>m[1]),
  ...[...js.matchAll(/querySelector(?:All)?\s*\(\s*["']#([^"']+)["']/gi)].map(m=>m[1]),
]);

test('P9.5 DS2 01-20 têm referência canônica em exatamente HTML, CSS e JS separados',()=>{
  for(let n=1;n<=20;n++){
    const ref=referenceFor(n);
    assert.ok(ref,`referência DS2 ${n} ausente`);
    assert.deepEqual(Object.keys(ref.files).sort(),['estilo.css','index.html','script.js']);
    assert.match(ref.files['index.html'],/<link[^>]+href=["']estilo\.css["']/i);
    assert.match(ref.files['index.html'],/<script[^>]+src=["']script\.js["']/i);
    assert.doesNotMatch(ref.files['index.html'],/<style\b/i);
    assert.doesNotMatch(ref.files['index.html'],/\sstyle\s*=/i);
    assert.doesNotMatch(ref.files['index.html'],/\son(?:click|input|change|submit|keyup|keydown)\s*=/i,`DS2 ${n}: evento JS não pode ficar embutido no HTML`);
    assert.ok(ref.files['estilo.css'].split(/\r?\n/).length>2,`CSS DS2 ${n} deve ser multilinha`);
    assert.doesNotThrow(()=>new Function(ref.files['script.js']),`JS DS2 ${n} inválido`);
    const available=ids(ref.files['index.html']);
    for(const id of jsTargetIds(ref.files['script.js'])) assert.ok(available.has(id),`DS2 ${n}: JS usa #${id} ausente no HTML`);
  }
});


test('P9.5 objetivos críticos do DS2 correspondem ao JavaScript de referência',()=>{
  const js=n=>referenceFor(n).files['script.js'];
  assert.match(js(2),/classList\.toggle\(["']escuro["']\)/);
  assert.match(js(5),/contador\+\+/);
  assert.match(js(7),/fahrenheit/i);
  assert.match(js(8),/Aprovado/); assert.match(js(8),/Reprovado/);
  assert.match(js(11),/for\s*\(let\s+numero\s*=\s*1;[\s\S]*?numero\s*<=\s*10/);
  assert.match(js(12),/typeof\s+nome/); assert.match(js(12),/semValor\s*=\s*null/); assert.match(js(12),/const\s+aluno\s*=\s*\{/);
  assert.match(js(16),/nomes\.push/); assert.match(js(16),/nomes\.length/);
  assert.match(js(17),/\.forEach\(/); assert.match(js(17),/indice/);
  assert.match(js(18),/addEventListener\(["']input["']/); assert.match(js(18),/value\.length/);
  assert.match(js(19),/campoSenha\.type/); assert.match(js(19),/["']password["']/); assert.match(js(19),/["']text["']/);
});

test('P9.5 workspace provisiona estilo.css e reconcilia arquivo esperado ausente sem sobrescrever os existentes',()=>{
  assert.match(workspace,/EXERCISE_REFERENCE_DS2_CORRECTED\[key\]\|\|EXERCISE_REFERENCES\[key\]/);
  assert.match(workspace,/'programacao-front-end':[\s\S]*?href="estilo\.css"/);
  assert.match(workspace,/filename:'estilo\.css'/);
  assert.match(workspace,/const missingExpected=desired\.filter/);
  assert.match(workspace,/if\(!remote\.length\|\|missingExpected\.length\)/);
  assert.match(studentFiles,/const fileAliases=/);
  assert.match(studentFiles,/existingAliases=new Set/);
  assert.match(studentFiles,/reconciled:missing\.length/);
  assert.match(studentFiles,/action==='save_all'\|\|action==='checkpoint'/);
});

test('P9.5 autocorreção inclui arquivos ausentes como zero e exige três arquivos não vazios para entrega DS2',()=>{
  assert.match(grade,/details\.push\(\{filename:null,reference_filename:ref\.filename[\s\S]*?score:0,missing:true,empty:true/);
  assert.match(grade,/total\+=w/);
  assert.match(grade,/requiredThreeFiles=subjectSlug==='programacao-front-end'\?\['index\.html','estilo\.css','script\.js'\]/);
  assert.match(grade,/required_files_incomplete/);
  assert.match(grade,/version:'autograde-v8-reference-history'/);
  assert.match(grade,/server-reference-v8-history/);
  assert.match(workspace,/Preencha index\.html, estilo\.css e script\.js antes de entregar/);
});

test('P9.5 banco impede reintrodução de CSS embutido ou referência desconectada',()=>{
  assert.match(guard,/guard_ds2_frontend_reference_structure/);
  assert.match(guard,/<style\(\[\[:space:\]>\]\)/);
  assert.match(guard,/style\[\[:space:\]\]\*=/);
  assert.match(guard,/on\(click\|input\|change\|submit\|keyup\|keydown\)/);
  assert.match(guard,/v_filename not in \('index\.html','estilo\.css','script\.js'\)/);
  assert.match(guard,/tg_op='DELETE'/);
  assert.match(guard,/estilo\[\.\]css/);
  assert.match(guard,/script\[\.\]js/);
  assert.match(guard,/trg_guard_ds2_frontend_reference_structure/);
});

test('P9.5 release/cache alinhados',()=>{
  assert.equal(release.version,'14.10.8.18');
  assert.equal(version.release,'v14.10.8.18');
  assert.equal(version.version,'0.22.8.14');
  assert.match(html,/app\.css\?v=14\.10\.8/);
  assert.match(html,/app\.js\?v=14\.10\.8/);
});
