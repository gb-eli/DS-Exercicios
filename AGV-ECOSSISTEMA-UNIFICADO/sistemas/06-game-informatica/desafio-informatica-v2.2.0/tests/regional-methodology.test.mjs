import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {APP_VERSION,LESSONS,TERM_PLANS,SCHOOL} from '../assets/js/data.js';

assert.equal(APP_VERSION,'2.5.7');
assert.match(SCHOOL,/Alberto Gomes Veiga/);
const byId=Object.fromEntries(LESSONS.map(lesson=>[lesson.id,lesson]));
for(const id of ['1ADM-01','1ADM-02','1ADM-03']){
  assert.ok(byId[id].regionalContext,`${id}: enquadramento regional ausente`);
  assert.ok(Array.isArray(byId[id].learningPath)&&byId[id].learningPath.length>=5,`${id}: percurso metodológico ausente`);
}
for(const lesson of LESSONS){
  assert.ok(lesson.regionalContext,`${lesson.id}: contexto regional ausente`);
  assert.match(lesson.regionalContext,/Paranaguá|Curitiba|Paraná/i,`${lesson.id}: contexto não conectado ao território`);
  assert.ok(lesson.professionalRole,`${lesson.id}: papel profissional ausente`);
  assert.ok(Array.isArray(lesson.careerSkills)&&lesson.careerSkills.length>=3,`${lesson.id}: competências profissionais insuficientes`);
  assert.ok(Array.isArray(lesson.learningPath)&&lesson.learningPath.length>=5,`${lesson.id}: percurso de aprendizagem insuficiente`);
  assert.match(lesson.audienceNote,/14 a 18 anos/i,`${lesson.id}: faixa etária não registrada`);
  assert.match(lesson.dataNotice,/fictíci/i,`${lesson.id}: aviso de dados fictícios ausente`);
  assert.equal(lesson.stages.some(stage=>['hardware-lab','twofactor-lab','enterprise-lab'].includes(stage.type)),false,`${lesson.id}: etapa fora do foco administrativo`);
}
for(const id of ['1ADM-04','1ADM-05','1ADM-06','2ADM-01','2ADM-02','2ADM-03']){
  const lesson=byId[id];
  assert.equal(lesson.stages[0].type,'explain',`${id}: deve começar com contexto`);
  assert.ok(lesson.stages.some(stage=>stage.type==='quiz'),`${id}: fixação ausente`);
  assert.ok(lesson.stages.some(stage=>['office-lab','document-lab','presentation-lab','email-lab','formula'].includes(stage.type)),`${id}: prática de ferramenta ausente`);
}
for(const id of ['1ADM-07','1ADM-08','2ADM-04','2ADM-05']){
  const lesson=byId[id];
  assert.equal(lesson.stages[0].type,'explain',`${id}: briefing ausente`);
  for(const type of ['office-lab','formula','document-lab','presentation-lab','email-lab'])assert.ok(lesson.stages.some(stage=>stage.type===type),`${id}: avaliação prática sem ${type}`);
}
assert.match(TERM_PLANS['1ADM'].emphasis,/Paranaguá|Curitiba|Paraná/);
assert.match(TERM_PLANS['2ADM'].emphasis,/Paraná/);
assert.ok(Array.isArray(TERM_PLANS['1ADM'].methodology)&&TERM_PLANS['1ADM'].methodology.length>=6);
assert.ok(Array.isArray(TERM_PLANS['2ADM'].methodology)&&TERM_PLANS['2ADM'].methodology.length>=6);

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const app=fs.readFileSync(path.join(root,'assets/js/app.js'),'utf8');
const css=fs.readFileSync(path.join(root,'assets/css/app.css'),'utf8');
assert.match(app,/lesson-career-frame/);
assert.match(app,/CONTEXTO REGIONAL E PROFISSIONAL/);
assert.match(app,/COMPETÊNCIAS PARA O MERCADO/);
assert.match(app,/COMO A AULA ESTÁ ORGANIZADA/);
assert.match(css,/\.lesson-career-frame/);
assert.match(css,/\.learning-path-card/);
console.log('Regionalização, metodologia ativa e preparação profissional validadas.');
