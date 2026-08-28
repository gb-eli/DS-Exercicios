import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {LESSONS,TERM_PLANS} from '../assets/js/data.js';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const first=LESSONS.filter(item=>item.classId==='1ADM').sort((a,b)=>a.order-b.order);
const second=LESSONS.filter(item=>item.classId==='2ADM').sort((a,b)=>a.order-b.order);
assert.equal(first.length,8,'O 1º ADM deve fechar o trimestre com 8 aulas.');
assert.equal(second.length,5,'O 2º ADM deve fechar o trimestre com 5 aulas.');
assert.deepEqual(first.map(item=>item.order),[1,2,3,4,5,6,7,8]);
assert.deepEqual(second.map(item=>item.order),[1,2,3,4,5]);
assert.deepEqual(TERM_PLANS['1ADM'].completedOrders,[1,2,3],'As Aulas 1, 2 e 3 do 1º ADM devem permanecer registradas como já aplicadas.');
assert.equal(first[0].curriculumRevision,'2026T2-preserved');
assert.equal(first[1].curriculumRevision,'2026T2-preserved');
assert.equal(first[2].curriculumRevision,'2026T2-admin-v229');
assert.equal(first.at(-2).kind,'assessment');
assert.equal(first.at(-1).kind,'recovery');
assert.equal(second.at(-2).kind,'assessment');
assert.equal(second.at(-1).kind,'recovery');
for(const lesson of first.slice(3))assert.match(lesson.curriculumRevision,/v25(?:0|2|6)/);
for(const lesson of second.slice(1))assert.match(lesson.curriculumRevision,/v25(?:0|2|6)/);
assert.equal(second[0].stages.some(stage=>stage.type==='hardware-lab'),false);
for(const type of ['office-lab','formula','document-lab','email-lab'])assert.ok(second[0].stages.some(stage=>stage.type===type),`Aula 1 do 2º ADM sem ${type}.`);
assert.ok(second[1].stages.some(stage=>stage.type==='formula'),'A segunda aula do 2º ADM deve aprofundar fórmulas administrativas.');
for(const type of ['document-lab','presentation-lab','email-lab'])assert.ok(second[2].stages.some(stage=>stage.type===type),`A terceira aula do 2º ADM sem ${type}.`);
for(const lesson of [first.at(-2),first.at(-1),second.at(-2),second.at(-1)]){
  for(const type of ['office-lab','formula','document-lab','presentation-lab','email-lab'])assert.ok(lesson.stages.some(stage=>stage.type===type),`${lesson.id} deve avaliar ${type}.`);
  assert.equal(lesson.stages.some(stage=>['hardware-lab','minigame'].includes(stage.type)),false,`${lesson.id} não deve avaliar hardware ou jogos.`);
}
for(const lesson of LESSONS){
  assert.ok(lesson.application,'Aula sem aplicação administrativa.');
  assert.ok(lesson.evidence,'Aula sem evidência esperada.');
  assert.ok(['content','assessment','recovery'].includes(lesson.kind),'Tipo de aula inválido.');
}
assert.equal(TERM_PLANS['1ADM'].weeks,4);
assert.equal(TERM_PLANS['1ADM'].meetingsPerWeek,2);
assert.equal(TERM_PLANS['2ADM'].totalMeetings,5);
assert.match(TERM_PLANS['1ADM'].emphasis,/Gmail|apresentações/i);
assert.match(TERM_PLANS['2ADM'].emphasis,/Planilhas/);
assert.ok(fs.existsSync(path.join(root,'curriculum-plan.json')),'Plano curricular JSON ausente.');
console.log('Curriculum plan tests passed: 1º ADM 1–3 frozen and remaining lessons focused on realistic office tools.');
