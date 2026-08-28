import assert from 'node:assert/strict';
import {LESSONS} from '../assets/js/data.js';
import {EnterpriseOperations,ENTERPRISE_OPERATIONS_VERSION} from '../assets/js/enterprise-operations.js';
import {EnterpriseFileWorkspace} from '../assets/js/enterprise-files.js';

const operationsConfig={
  deadlineMinutes:20,
  acceptedPriorityIds:['privacy-incident'],
  priorities:[
    {id:'privacy-incident',label:'Conter acesso indevido',urgency:5,impact:5,dueMinutes:5},
    {id:'equipment-catalog',label:'Reorganizar catálogo visual',urgency:1,impact:1,dueMinutes:40}
  ],
  strategies:[
    {id:'contain-and-parallelize',label:'Conter e dividir tarefas',accepted:true},
    {id:'centralize-after-containment',label:'Conter e centralizar',accepted:true},
    {id:'keep-access-until-finish',label:'Manter acesso indevido',accepted:false}
  ],
  incidents:[
    {id:'privacy-1',label:'Link com permissão excessiva',acceptedStrategies:['recall-notify-report']}
  ]
};
const ops=new EnterpriseOperations(operationsConfig);
assert.equal(ops.serialize().version,ENTERPRISE_OPERATIONS_VERSION);
assert.equal(ops.choosePriority('equipment-catalog').ok,false,'Tarefa estética não deve superar incidente crítico.');
assert.equal(ops.choosePriority('privacy-incident').ok,true,'Incidente crítico deve ser uma prioridade aceitável.');
assert.equal(ops.chooseStrategy('keep-access-until-finish').ok,false,'Estratégia insegura deve ser rejeitada.');
const accepted=ops.chooseStrategy('contain-and-parallelize');
assert.equal(accepted.ok,true);
assert.ok(accepted.acceptedAlternatives>=2,'Deve existir mais de uma solução aceitável.');
const incident=ops.openIncidents()[0];
assert.equal(ops.resolveIncident(incident.id,'keep-access').ok,false);
assert.equal(ops.resolveIncident(incident.id,'recall-notify-report').ok,true);
assert.equal(ops.ready({requiredIncidents:true,requirePriority:true,requireStrategy:true}).ready,true);
assert.equal(ops.deadlineStatus(11*60).status,'attention');
assert.equal(ops.deadlineStatus(16*60).status,'critical');
const restored=new EnterpriseOperations(operationsConfig,ops.serialize());
assert.equal(restored.metrics().openIncidents,0,'Decisões operacionais devem sobreviver ao checkpoint.');

const ws=new EnterpriseFileWorkspace({documentName:'Plano'});
const created=ws.produceArtifact({name:'plano.pdf',sourceId:'doc-main',locations:['Meu Drive']})[0];
assert.equal(ws.deleteFile(created.id).ok,true);
assert.equal(ws.trashedFiles().length,1);
assert.ok(ws.validateForSend(created.id,{expectedName:'plano.pdf'}).issues.some(item=>item.id==='file-trashed'));
assert.equal(ws.restoreFile(created.id).ok,true);
assert.equal(ws.trashedFiles().length,0);
assert.equal(ws.validateForSend(created.id,{expectedName:'plano.pdf'}).valid,false,'Arquivo restaurado continua exigindo acesso do destinatário.');

for(const lessonId of ['1ADM-07','1ADM-08','2ADM-04','2ADM-05']){
  const lesson=LESSONS.find(item=>item.id===lessonId);
  assert.equal(lesson.stages.some(item=>item.type==='hardware-lab'),false);
  assert.ok(lesson.stages.some(item=>item.type==='office-lab'));
  assert.ok(lesson.stages.some(item=>item.type==='email-lab'));
}
console.log('Reusable operations modules and current office-focused assessment composition validated.');
