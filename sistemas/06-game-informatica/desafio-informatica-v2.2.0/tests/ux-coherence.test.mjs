import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {LESSONS,APP_VERSION} from '../assets/js/data.js';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const get=id=>LESSONS.find(item=>item.id===id);
assert.equal(APP_VERSION,'2.5.7');

// Conteúdos já aplicados não podem ser reformulados.
assert.equal(get('1ADM-01').curriculumRevision,'2026T2-preserved');
assert.equal(get('1ADM-02').curriculumRevision,'2026T2-preserved');
assert.equal(get('1ADM-03').curriculumRevision,'2026T2-admin-v229');

const revised=['1ADM-07','1ADM-08','2ADM-03','2ADM-04','2ADM-05'].map(get);
for(const lesson of revised){
  assert.equal(lesson.stages[0].type,'explain',`${lesson.id} deve começar com contexto/briefing.`);
  for(const stage of lesson.stages.filter(stage=>stage.type==='presentation-lab')){
    assert.equal(stage.tasks[0]?.action,'layout-title-content',`${lesson.id}: apresentação deve começar pela escolha do layout.`);
  }
}

// Todo anexo solicitado precisa ser produzido pelo editor documental da própria aula.
for(const lesson of ['1ADM-07','1ADM-08','2ADM-03','2ADM-04','2ADM-05'].map(get)){
  const documents=lesson.stages.filter(stage=>stage.type==='document-lab').map(stage=>stage.config?.filename).filter(Boolean);
  for(const email of lesson.stages.filter(stage=>stage.type==='email-lab')){
    assert.ok(documents.includes(email.config?.attachment),`${lesson.id}: anexo ${email.config?.attachment} não foi produzido no fluxo.`);
  }
}

// Avaliação e recuperação do 2º ADM precisam verificar competências equivalentes por problemáticas diferentes.
const assessment=get('2ADM-04'),recovery=get('2ADM-05');
const assessmentSheet=assessment.stages.find(stage=>stage.type==='office-lab');
const recoverySheet=recovery.stages.find(stage=>stage.type==='office-lab');
const assessmentFormula=assessment.stages.find(stage=>stage.type==='formula');
const recoveryFormula=recovery.stages.find(stage=>stage.type==='formula');
assert.notDeepEqual(assessmentSheet.config.rows,recoverySheet.config.rows,'Avaliação e recuperação usam a mesma base.');
assert.notDeepEqual(assessmentFormula.tasks.map(task=>task.answer),recoveryFormula.tasks.map(task=>task.answer),'Avaliação e recuperação usam as mesmas fórmulas.');
assert.ok(recoverySheet.tasks.some(task=>task.action==='filter-delayed'));
assert.ok(recoverySheet.tasks.some(task=>task.action==='share-reader'));

const app=fs.readFileSync(path.join(root,'assets/js/app.js'),'utf8');
const css=fs.readFileSync(path.join(root,'assets/css/app.css'),'utf8');
const sheet=fs.readFileSync(path.join(root,'assets/js/spreadsheet-engine.js'),'utf8');
assert.match(app,/presentation-lab'\)return \[/,'Tutorial específico de apresentações ausente.');
assert.match(app,/'presentation-lab':\{icon:'▥',label:'APRESENTAÇÃO'\}/);
assert.match(app,/configuredChart/);
assert.match(app,/chartTitle/);
assert.match(app,/chart-column','chart-closed/,'Uso e fechamento de gráfico devem ser ações auxiliares neutras.');
assert.match(css,/\.rs-chart-panel header button\{[^}]*color:#3c4043!important/s,'Botão de fechar gráfico não está visível.');
assert.match(css,/@media\(max-width:780px\)[\s\S]*\.slides-workspace\{grid-template-columns:58px minmax\(0,1fr\);overflow:hidden/s,'Apresentação sem regra responsiva principal.');
assert.match(css,/@media\(max-width:430px\)[\s\S]*\.slide-canvas\{width:calc\(100% - 10px\)/s,'Apresentação sem ajuste para celulares estreitos.');
assert.match(sheet,/data-rs-close-chart/);
assert.match(sheet,/this\.book\.chart=null/);

console.log('UX/coherence tests passed: responsive charts/slides, real attachments and differentiated assessments.');
