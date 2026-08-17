import assert from 'node:assert/strict';
import {LESSONS,TERM_PLANS,APP_VERSION} from '../assets/js/data.js';
assert.equal(APP_VERSION,'2.5.7');
const lessons=LESSONS.filter(item=>item.classId==='2ADM').sort((a,b)=>a.order-b.order);
assert.equal(lessons.length,5);
for(const lesson of lessons){
  assert.equal(lesson.stages.some(stage=>['hardware-lab','minigame','twofactor-lab'].includes(stage.type)),false,`${lesson.id} não deve exigir hardware, jogos ou 3D.`);
  assert.doesNotMatch(`${lesson.title} ${lesson.subtitle}`,/hardware|arquitetura do computador|desenvolvimento de sistemas/i);
}
const first=lessons[0];
for(const type of ['office-lab','formula','document-lab','email-lab'])assert.ok(first.stages.some(stage=>stage.type===type),`Etapa ${type} ausente na Aula 1.`);
assert.match(first.title,/planilhas/i);
assert.ok(lessons[1].stages.some(stage=>stage.type==='formula'));
for(const type of ['document-lab','presentation-lab','email-lab'])assert.ok(lessons[2].stages.some(stage=>stage.type===type),`Aula 3 sem ${type}.`);
for(const lesson of lessons.slice(3)){
  for(const type of ['office-lab','formula','document-lab','presentation-lab','email-lab'])assert.ok(lesson.stages.some(stage=>stage.type===type),`${lesson.id} sem ${type}.`);
}
assert.match(TERM_PLANS['2ADM'].emphasis,/Planilhas/);
assert.match(TERM_PLANS['2ADM'].emphasis,/Gmail|apresentações/i);
console.log('admin2-focus.test.mjs: OK');
