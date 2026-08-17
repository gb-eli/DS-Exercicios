import assert from 'node:assert/strict';
import fs from 'node:fs';
import {APP_VERSION,LESSONS,GUIDED_MINIMUM_MINUTES,DIAGNOSTIC_MINIMUM_MINUTES} from '../assets/js/data.js';
import {validateEmailDraft} from '../assets/js/email-engine.js';

assert.equal(APP_VERSION,'2.5.7');
assert.equal(LESSONS.length,13);
assert.equal(GUIDED_MINIMUM_MINUTES,5);
assert.equal(DIAGNOSTIC_MINIMUM_MINUTES,15);

const byId=Object.fromEntries(LESSONS.map(lesson=>[lesson.id,lesson]));
for(const id of ['1ADM-01','1ADM-02','1ADM-03']){
  assert.ok(byId[id]);
  assert.match(byId[id].curriculumRevision,/preserved|admin-v229/);
}

for(const lesson of LESSONS){
  assert.ok(lesson.title&&lesson.subtitle,`${lesson.id}: título/subtítulo ausente`);
  assert.ok(Array.isArray(lesson.objectives)&&lesson.objectives.length>=2,`${lesson.id}: objetivos insuficientes`);
  assert.ok(lesson.application&&lesson.evidence,`${lesson.id}: aplicação/evidência ausente`);
  assert.ok(!lesson.stages.some(stage=>['hardware-lab','twofactor-lab','enterprise-lab'].includes(stage.type)),`${lesson.id}: ferramenta fora do foco atual de Informática Empresarial`);
  let interactions=0;
  for(const stage of lesson.stages){
    assert.ok(stage.title,`${lesson.id}: etapa sem título`);
    interactions+=(stage.tasks?.length||stage.questions?.length||stage.steps?.length||1);
    for(const question of stage.questions||stage.tasks||[]){
      if(Array.isArray(question.options)){
        assert.ok(Number.isInteger(question.answer)&&question.answer>=0&&question.answer<question.options.length,`${lesson.id}/${stage.title}: resposta inválida`);
        assert.ok(question.why,`${lesson.id}/${stage.title}: feedback ausente`);
      }
      if(question.answer&&question.tokens){
        assert.ok(String(question.answer).startsWith('='),`${lesson.id}/${stage.title}: fórmula sem =`);
        assert.equal(question.tokens.join('').replace(/\s+/g,'').toUpperCase(),String(question.answer).replace(/\s+/g,'').toUpperCase(),`${lesson.id}/${stage.title}: blocos não formam a fórmula esperada`);
      }
    }
  }
  assert.ok(interactions>=6,`${lesson.id}: carga prática insuficiente para a duração planejada`);

  // Every e-mail attachment must be produced earlier in the same lesson.
  lesson.stages.forEach((stage,index)=>{
    if(stage.type!=='email-lab'||!stage.config?.attachment)return;
    const produced=lesson.stages.slice(0,index).some(previous=>previous.type==='document-lab'&&previous.config?.filename===stage.config.attachment);
    assert.ok(produced,`${lesson.id}: e-mail exige ${stage.config.attachment} sem produção anterior`);
  });

  // Presentation charts must be tied to the scenario instead of generic fixed bars.
  lesson.stages.forEach((stage,index)=>{
    if(stage.type!=='presentation-lab')return;
    const wantsChart=(stage.tasks||[]).some(task=>task.action==='insert-chart');
    if(!wantsChart)return;
    assert.ok(Array.isArray(stage.config?.chartData)&&stage.config.chartData.length>=3,`${lesson.id}: gráfico sem dados contextualizados`);
    assert.ok(stage.config?.chartTitle,`${lesson.id}: gráfico sem título contextual`);
    assert.ok(Array.isArray(stage.config?.bulletItems)&&stage.config.bulletItems.length>=3,`${lesson.id}: tópicos genéricos`);
    const office=lesson.stages.slice(0,index).reverse().find(previous=>previous.type==='office-lab');
    if(office){
      const categories=new Set((office.config?.rows||[]).map(row=>String(row[1])));
      for(const point of stage.config.chartData)assert.ok(categories.has(String(point.label)),`${lesson.id}: categoria ${point.label} não pertence à base da aula`);
    }
  });

  // Filters must say exactly which status the student is expected to apply.
  for(const stage of lesson.stages.filter(stage=>stage.type==='office-lab'))for(const task of stage.tasks||[]){
    if(task.action==='filter-pending')assert.match(task.prompt,/Pendente/i,`${lesson.id}: filtro Pendente ambíguo`);
    if(task.action==='filter-delayed')assert.match(task.prompt,/Atrasado/i,`${lesson.id}: filtro Atrasado ambíguo`);
  }

  // When a full-range calculation follows a filtered table, it must be explicit that hidden rows remain included.
  const filtered=lesson.stages.some(stage=>stage.type==='office-lab'&&(stage.tasks||[]).some(task=>task.action?.startsWith('filter-')));
  if(filtered){
    for(const stage of lesson.stages.filter(stage=>stage.type==='formula'))for(const task of stage.tasks||[]){
      if(/SOMA|MÉDIA/.test(task.answer)&&/:/.test(task.answer))assert.match(task.prompt,/base completa|somente|setor|pendente|atrasado/i,`${lesson.id}: fórmula após filtro sem escopo claro: ${task.prompt}`);
    }
  }
}

// Evaluation and recovery must be different paths, not a renamed copy.
for(const classId of ['1ADM','2ADM']){
  const assessment=LESSONS.find(lesson=>lesson.classId===classId&&lesson.kind==='assessment');
  const recovery=LESSONS.find(lesson=>lesson.classId===classId&&lesson.kind==='recovery');
  assert.ok(assessment&&recovery);
  const a=JSON.stringify(assessment.stages.map(stage=>({type:stage.type,config:stage.config,tasks:stage.tasks}))); 
  const r=JSON.stringify(recovery.stages.map(stage=>({type:stage.type,config:stage.config,tasks:stage.tasks})));
  assert.notEqual(a,r,`${classId}: avaliação e recuperação equivalentes`);
  const aFile=assessment.stages.find(stage=>stage.type==='document-lab')?.config?.filename;
  const rFile=recovery.stages.find(stage=>stage.type==='document-lab')?.config?.filename;
  assert.notEqual(aFile,rFile,`${classId}: avaliação e recuperação usam a mesma evidência`);
}

// Professional wording alternatives should work without forcing one literal phrase.
const emailStage=byId['1ADM-05'].stages.find(stage=>stage.type==='email-lab');
const config=emailStage.config;
const professionalDraft={
  to:config.recipient,cc:config.cc,bcc:'',
  subject:'Comunicado administrativo para revisão',
  body:'Bom dia, segue em anexo o arquivo PDF do comunicado administrativo para revisão da coordenação. Cordialmente, estudante.',
  attachments:[{name:config.attachment,status:'current'}],driveLinks:[]
};
const professional=validateEmailDraft(professionalDraft,config);
assert.equal(professional.valid,true,professional.errors.map(error=>error.label).join(' | '));
const noGreeting=validateEmailDraft({...professionalDraft,body:'Segue em anexo o arquivo PDF do comunicado administrativo para revisão. Cordialmente.'},config);
assert.equal(noGreeting.valid,true);
assert.ok(noGreeting.warnings.some(warning=>warning.id==='body-greeting')); // orientação, não bloqueio
const wrongFile=validateEmailDraft({...professionalDraft,attachments:[{name:'arquivo-antigo.pdf',status:'current'}]},config);
assert.equal(wrongFile.valid,false);
assert.ok(wrongFile.errors.some(error=>error.id==='attachment-missing'));

const appSource=fs.readFileSync(new URL('../assets/js/app.js',import.meta.url),'utf8');
assert.match(appSource,/configuredChart/);
assert.match(appSource,/A ajuda não indica o critério nem a permissão corretos/);
assert.doesNotMatch(appSource,/<strong>Demandas por setor<\/strong><div class="slide-chart"><span><i style="height:45%/);

console.log('Fase 3: coerência pedagógica, cenários, gráficos, e-mail, avaliação e recuperação validados.');
