import assert from 'node:assert/strict';
import {createEnterpriseWorkflow,availableTasks,blockedTasks,resolveEnterpriseAction,completeEnterpriseTask,serializeEnterpriseWorkflow,workflowComplete,taskStatus} from '../assets/js/enterprise-workflow.js';

const target=[
  {id:'mail-open-request',app:'mail',action:'mail-open-request',prompt:'Ler a solicitação',requires:[]},
  {id:'sheet-review',app:'sheet',action:'sheet-review',prompt:'Conferir a planilha',requires:['mail-open-request']},
  {id:'docs-prepare',app:'docs',action:'docs-prepare',prompt:'Preparar o documento',requires:['mail-open-request']},
  {id:'docs-export-pdf',app:'docs',action:'docs-export-pdf',prompt:'Exportar PDF',requires:['docs-prepare']},
  {id:'mail-attach-pdf',app:'mail',action:'mail-attach-pdf',prompt:'Anexar PDF',requires:['docs-export-pdf']},
  {id:'mail-send-reply',app:'mail',action:'mail-send-reply',prompt:'Enviar resposta',requires:['sheet-review','mail-attach-pdf']},
  {id:'case-close',app:'dashboard',action:'case-close',prompt:'Encerrar caso',requires:['mail-send-reply']}
];
const workflow=createEnterpriseWorkflow(target);
assert.deepEqual(availableTasks(workflow).map(task=>task.action),['mail-open-request'],'A solicitação deve iniciar o caso.');
assert.equal(resolveEnterpriseAction(workflow,'sheet-review').kind,'blocked','A planilha fica bloqueada até a leitura da demanda.');
assert.equal(completeEnterpriseTask(workflow,'mail-open-request'),true);
const afterRequest=availableTasks(workflow).map(task=>task.action);
for(const action of ['sheet-review','docs-prepare'])assert.ok(afterRequest.includes(action),`${action} deve ficar disponível em paralelo.`);
assert.equal(resolveEnterpriseAction(workflow,'mail-send-reply').kind,'blocked');
assert.equal(resolveEnterpriseAction(workflow,'mail-open-request').kind,'repeat');
assert.equal(resolveEnterpriseAction(workflow,'cell-edit').kind,'exploration');
assert.ok(completeEnterpriseTask(workflow,'docs-prepare'));
assert.equal(taskStatus(workflow,'docs-export-pdf'),'available');
assert.ok(completeEnterpriseTask(workflow,'docs-export-pdf'));
assert.ok(completeEnterpriseTask(workflow,'mail-attach-pdf'));
assert.ok(completeEnterpriseTask(workflow,'sheet-review'));
assert.equal(taskStatus(workflow,'mail-send-reply'),'available');
const saved=serializeEnterpriseWorkflow(workflow),restored=createEnterpriseWorkflow(target,{workflow:saved,...saved});
assert.deepEqual([...restored.completed].sort(),[...workflow.completed].sort(),'O grafo deve sobreviver ao checkpoint.');
assert.ok(blockedTasks(restored).length>0);
let guard=0;while(!workflowComplete(restored)&&guard++<20){for(const task of availableTasks(restored))completeEnterpriseTask(restored,task)}
assert.equal(workflowComplete(restored),true,'O caso deve poder ser concluído por diferentes ordens válidas.');
console.log('Enterprise workflow module: parallel tasks, dependencies, neutral exploration, checkpoint and flexible completion validated.');
