import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const ROOT=path.resolve(new URL('../..',import.meta.url).pathname);
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const dataFiles={
 ds1:'sistemas/08-lab-exercicios-ds1/modo-aluno/disciplinas/introducao-programacao/data/exercicios.js',
 ds2:'sistemas/09-lab-exercicios-ds2/modo-aluno/frontend/data/exercicios.js',
 ds3:'sistemas/10-lab-exercicios-ds3/modo-aluno/data/exercicios.js',
 subfe:'sistemas/07-lab-exercicios-sub/versao-aluno/data/exercicios.js',
 submob:'sistemas/07-lab-exercicios-sub/versao-aluno/data/mobile-exercicios.js'
};
function loadData(rel){const c={window:{}};vm.createContext(c);vm.runInContext(read(rel),c);return c.window.EXERCICIOS||c.window.EXERCICIOS_FRONTEND||c.window.EXERCICIOS_MOBILE;}
const expected={ds1:8,ds2:28,ds3:8,subfe:7,submob:4};
for(const [key,rel] of Object.entries(dataFiles)){
 const arr=loadData(rel);assert.equal(arr.length,expected[key],`${key}: contagem`);
 for(const ex of arr){assert.equal(ex.studentReferenceStripped,true,`${key} ex ${ex.numero}: flag anti-gabarito`);assert.ok(!('professor' in ex),`${key} ex ${ex.numero}: professor não pode estar no bundle`);}
}
const ds2=read(dataFiles.ds2);assert.ok(!ds2.includes('function alterarTexto() {'),'DS2: solução tutorial 01 removida');assert.ok(!ds2.includes('function modoClaro() {'),'DS2: solução tutorial 02 removida');assert.ok(ds2.includes('Estrutura de apoio:'),'DS2: apoio conceitual mantido');
const analysis=read('sistemas/08-lab-exercicios-ds1/modo-aluno/disciplinas/analise-metodos/data/analysis-data.js');assert.ok(!/"solution"\s*:/.test(analysis),'Análise: solution removido');assert.ok(!/"essential"\s*:/.test(analysis),'Análise: essential removido');assert.ok(!/"kind"\s*:\s*"(?:actor|distractor)"/.test(analysis),'Análise: ator/distrator não revelado');
const bridge=read('core/sdk/agv-lab-exercises-bridge.js');assert.match(bridge,/conclusao\|concluir/,'bridge reconhece conclusão DS3');assert.match(bridge,/lastStartedActivity/,'bridge deduplica abertura');assert.ok(!bridge.includes('service_role'),'bridge não contém service role');
const professor=read('professor/assets/professor.js');assert.match(professor,/import_references/,'Console Professor suporta import privado');assert.ok(!professor.includes('nome = input("Digite seu nome'),'Console não embute gabarito');
const teacherHtml=read('professor/index.html');assert.match(teacherHtml,/teacher-import-file/,'UI de import admin existe');
const canonicalRoots=[
 'sistemas/07-lab-exercicios-sub/versao-aluno',
 'sistemas/08-lab-exercicios-ds1/modo-aluno',
 'sistemas/09-lab-exercicios-ds2/modo-aluno',
 'sistemas/10-lab-exercicios-ds3/modo-aluno'
];
function walk(dir,out=[]){for(const ent of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,ent.name);if(ent.isDirectory())walk(p,out);else if(/\.(js|json|html)$/i.test(ent.name))out.push(p)}return out}
for(const rel of canonicalRoots){for(const f of walk(path.join(ROOT,rel))){const txt=fs.readFileSync(f,'utf8');assert.ok(!/"professor"\s*:/.test(txt),`professor payload ausente: ${path.relative(ROOT,f)}`)}}
const catalog=JSON.parse(read('core/catalog/lab-exercises-88.json'));assert.equal(catalog.records.length,88,'catálogo canônico 88');
console.log('PASS lab-exercises-v8: 88 catálogo; bundles aluno sem professor/full refs; bridge + import privado OK');
