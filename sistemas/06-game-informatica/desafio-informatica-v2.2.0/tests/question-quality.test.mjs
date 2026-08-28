import assert from 'node:assert/strict';
import {LESSONS as SOURCE_LESSONS} from '../assets/js/data.js';
import {QUESTION_BANK_V4 as SOURCE_BANK} from '../assets/js/questions-v4.js';
import {GUIDED_REINFORCEMENT_V4} from '../assets/js/guided-v4.js';
import {prepareQuestionQuality,auditQuestionQuality} from '../assets/js/question-quality.js';

const lessons=structuredClone(SOURCE_LESSONS),questionBank=structuredClone(SOURCE_BANK);
lessons.forEach(lesson=>{lesson.stages=[...(lesson.stages||[]),...structuredClone(GUIDED_REINFORCEMENT_V4[lesson.id]||[])]});
const report=prepareQuestionQuality({lessons,questionBank});
const spread=positions=>Math.max(...positions)-Math.min(...positions);
assert.ok(spread(report.guided.positions)<=1,'As posições corretas das aulas devem ficar equilibradas.');
assert.ok(spread(report.diagnostic.positions)<=1,'As posições corretas do diagnóstico devem ficar equilibradas.');
assert.ok(report.diagnostic.significantLengthCueRate<=1,'O diagnóstico não deve permitir pista recorrente pelo tamanho da alternativa.');
assert.ok(report.guided.significantLengthCueRate<=5,'O conjunto guiado deve manter a pista de tamanho abaixo do limite editorial.');
for(const id of ['1ADM-01','1ADM-02']){
  const lesson=lessons.find(item=>item.id===id);const audit=auditQuestionQuality({lessons:[lesson]}).guided;
  assert.ok(audit.significantLengthCueRate<=5,`${id} deve ficar sem padrão perceptível de resposta mais longa.`);
}
console.log('Question quality tests passed',report);
