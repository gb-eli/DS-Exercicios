import assert from 'node:assert/strict';
import {EMAIL_ENGINE_VERSION,createInitialEmailState,normalizeEmailState,validateEmailDraft} from '../assets/js/email-engine.js';

assert.equal(EMAIL_ENGINE_VERSION,1);
const config={
  scenario:'A direção solicitou o relatório gerencial.',
  recipient:'direcao.agv@simulacao.edu.br',
  cc:'supervisao.agv@simulacao.edu.br',
  subjectKeywords:['relatório','gerencial'],
  bodyKeywords:['olá','anexo','análise'],
  attachment:'relatorio-gerencial.pdf'
};
const initial=createInitialEmailState(config);
assert.equal(initial.folder,'inbox');
assert.ok(initial.threads.some(thread=>thread.id==='thread-request'&&thread.unread));
assert.ok(initial.files.some(file=>file.name==='relatorio-gerencial.pdf'));
assert.ok(initial.threads.some(thread=>thread.folder==='spam'),'Deve existir uma mensagem suspeita simulada.');

const integrated=createInitialEmailState({...config,expectedFileAvailable:false,availableFiles:[{id:'enterprise-generated-pdf',name:'relatorio-gerencial.pdf',type:'PDF',size:'gerado na operação',source:'Meu Drive',access:'restricted'}]});
assert.equal(integrated.files.filter(file=>file.name==='relatorio-gerencial.pdf').length,1,'O seletor deve receber somente o PDF realmente produzido pela operação.');
assert.equal(integrated.files.find(file=>file.name==='relatorio-gerencial.pdf').id,'enterprise-generated-pdf');

let result=validateEmailDraft({to:'',cc:'',bcc:'',subject:'',body:'',attachments:[],driveLinks:[]},config);
assert.equal(result.valid,false);
assert.ok(result.errors.some(error=>error.id==='recipient-missing'));
assert.ok(result.errors.some(error=>error.id==='attachment-missing'));

result=validateEmailDraft({
  to:'direcao.agv@simulacao.edu.br',
  cc:'supervisao.agv@simulacao.edu.br',
  bcc:'',
  subject:'Relatório gerencial — análise de agosto',
  body:'Olá, encaminho em anexo o relatório para análise. Obrigado.',
  attachments:[{name:'relatorio-gerencial.pdf'}],
  driveLinks:[]
},config);
assert.equal(result.valid,true);
assert.equal(result.errors.length,0);

result=validateEmailDraft({
  to:'direcao.agv@simulacao.edu.br',cc:'supervisao.agv@simulacao.edu.br',bcc:'',
  subject:'Relatório gerencial',body:'Olá, segue o anexo para análise.',attachments:[],
  driveLinks:[{name:'relatorio-gerencial.pdf',access:'restricted',recipientAccess:false}]
},config);
assert.equal(result.valid,false);
assert.ok(result.errors.some(error=>error.id==='drive-access'));


result=validateEmailDraft({
  to:'direcao.agv@simulacao.edu.br',cc:'supervisao.agv@simulacao.edu.br',bcc:'',
  subject:'Relatório gerencial',body:'Olá, segue o anexo para análise.',
  attachments:[{name:'relatorio-gerencial.pdf',status:'stale'}],driveLinks:[]
},config);
assert.equal(result.valid,false);
assert.ok(result.errors.some(error=>error.id==='file-stale'));


// A escrita narrativa deve aceitar sinônimos, ordem diferente e pequenas variações sem exigir frases literais.
result=validateEmailDraft({
  to:'direcao.agv@simulacao.edu.br',
  cc:'supervisao.agv@simulacao.edu.br',
  bcc:'',
  subject:'Documento para a gestão',
  body:'Boa tarde. Estou enviando o PDF para você verificar. Agradeço pela atenção.',
  attachments:[{name:'relatorio-gerencial.pdf'}],
  driveLinks:[]
},config);
assert.equal(result.valid,true,'Sinônimos profissionais devem ser aceitos.');

result=validateEmailDraft({
  to:'direcao.agv@simulacao.edu.br',
  cc:'supervisao.agv@simulacao.edu.br',
  bcc:'',
  subject:'Relatóri gerencial',
  body:'Encaminho o documento para conferência. Caso necessário, posso ajustar as informações.',
  attachments:[{name:'relatorio-gerencial.pdf'}],
  driveLinks:[]
},config);
assert.equal(result.valid,true,'Pequeno erro de digitação e redação própria não devem bloquear a tarefa.');
assert.ok(result.warnings.some(warning=>warning.id==='body-greeting'),'Saudação ausente deve virar orientação, não erro.');

result=validateEmailDraft({
  to:'direcao.agv@simulacao.edu.br',
  cc:'supervisao.agv@simulacao.edu.br',
  bcc:'',
  subject:'Assunto qualquer sem relação',
  body:'Hoje o céu está bonito e eu gosto muito de conversar sobre assuntos completamente diferentes desta atividade.',
  attachments:[{name:'relatorio-gerencial.pdf'}],
  driveLinks:[]
},config);
assert.equal(result.valid,false,'Texto longo mas sem relação com a tarefa ainda deve ser recusado.');
assert.ok(result.errors.some(error=>error.id==='subject-context'||error.id==='body-context'));

const restored=normalizeEmailState({...initial,folder:'drafts',draft:{...initial.draft,subject:'Rascunho salvo',attachments:[{name:'arquivo.pdf'}]}},config);
assert.equal(restored.folder,'drafts');
assert.equal(restored.draft.subject,'Rascunho salvo');
assert.equal(restored.draft.attachments[0].name,'arquivo.pdf');
console.log('E-mail engine: caixa, validação, anexos, Drive e retomada validados.');
