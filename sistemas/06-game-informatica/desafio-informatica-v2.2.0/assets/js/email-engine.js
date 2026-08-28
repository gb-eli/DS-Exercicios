import {conceptSatisfied,flexibleConceptCoverage,contextualOverlap,narrativeLooksComplete,narrativeIntentSatisfied} from './text-validation.js?v=20260811r38';
const clone=value=>JSON.parse(JSON.stringify(value));
const now=()=>new Date().toISOString();
const clean=value=>String(value??'').replace(/[<>]/g,'').trim();
const normalize=value=>clean(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ');
const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const uid=(prefix='mail')=>`${prefix}-${Math.random().toString(36).slice(2,10)}`;
const splitAddresses=value=>String(value||'').split(/[;,]/).map(item=>item.trim().toLowerCase()).filter(Boolean);
const validAddress=value=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const keywordSatisfied=(value,word)=>conceptSatisfied(value,word);
const keywordCoverage=(value,keywords=[],minimum=keywords.length)=>{
  if(!keywords.length)return true;
  const result=flexibleConceptCoverage(value,keywords,{minimumRatio:0,minimumConcepts:minimum});
  return result.ok;
};
const hasProfessionalGreeting=value=>conceptSatisfied(value,'ola');
const hasProfessionalClosing=value=>conceptSatisfied(value,'atenciosamente');
const shortTime=value=>new Date(value).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});
const shortDate=value=>new Date(value).toLocaleDateString('pt-BR',{day:'2-digit',month:'short'}).replace('.','');

export const EMAIL_ENGINE_VERSION=1;

function scenarioSubject(config){
  if(config.requestSubject)return config.requestSubject;
  const source=clean(config.scenario||'Solicitação administrativa');
  return source.length>72?`${source.slice(0,69)}...`:source;
}
function requesterAddress(config){return clean(config.requestFrom||config.recipient||'gestao.agv@simulacao.edu.br').toLowerCase()}
function requesterName(config){
  if(config.requester)return clean(config.requester);
  const local=requesterAddress(config).split('@')[0].replace(/[._-]+/g,' ');
  return local.replace(/\b\w/g,char=>char.toUpperCase());
}
function defaultFiles(config){
  const expected=clean(config.attachment||'');
  const supplied=Array.isArray(config.availableFiles)?config.availableFiles.map((file,index)=>({id:clean(file.id||`available-${index}`),name:clean(file.name),type:clean(file.type||'Arquivo'),size:clean(file.size||'Arquivo da operação'),source:clean(file.source||'Meu Drive'),modifiedAt:file.modifiedAt||now(),access:clean(file.access||'restricted'),recipientAccess:Boolean(file.recipientAccess),status:clean(file.status||'current'),sourceId:clean(file.sourceId||''),sourceVersion:Number(file.sourceVersion)||0,version:Number(file.version)||1,conflictId:clean(file.conflictId||''),artifactGroup:clean(file.artifactGroup||'')})).filter(file=>file.name):[];
  const list=[
    ...supplied,
    {id:'file-instructions',name:'orientacoes-da-solicitacao.pdf',type:'PDF',size:'188 KB',source:'Downloads',modifiedAt:now(),access:'private'},
    {id:'file-draft',name:'rascunho-nao-revisado.docx',type:'Documento',size:'46 KB',source:'Recentes',modifiedAt:now(),access:'private'},
    {id:'file-previous',name:'relatorio-mes-anterior.pdf',type:'PDF',size:'624 KB',source:'Meu Drive',modifiedAt:now(),access:'restricted'}
  ];
  if(expected&&config.expectedFileAvailable!==false){list.unshift({id:'file-expected',name:expected,type:expected.toLowerCase().endsWith('.pdf')?'PDF':'Arquivo',size:'742 KB',source:'Downloads',modifiedAt:now(),access:'private'});list.push({id:'drive-expected',name:expected,type:expected.toLowerCase().endsWith('.pdf')?'PDF':'Arquivo',size:'742 KB',source:'Meu Drive',modifiedAt:now(),access:'restricted'});}
  const seen=new Set();return list.filter(file=>file.name&&!seen.has(file.id)&&(seen.add(file.id),true));
}
function defaultThreads(config){
  const at=now(),from=requesterAddress(config),name=requesterName(config),subject=scenarioSubject(config);
  return [
    {id:'thread-request',folder:'inbox',unread:true,starred:true,important:true,participants:[from],messages:[{id:'message-request',from,name,to:config.account||'estudante.agv@simulacao.edu.br',cc:clean(config.requestCc||''),subject,body:clean(config.requestMessage||config.scenario||'Prepare a resposta profissional e confira os dados antes do envio.'),at,attachments:config.requestAttachment?[{name:config.requestAttachment,size:'384 KB',type:'Arquivo recebido'}]:[]} ]},
    {id:'thread-hr',folder:'inbox',unread:true,starred:false,important:false,participants:['rh.agv@simulacao.edu.br'],messages:[{id:'message-hr',from:'rh.agv@simulacao.edu.br',name:'Recursos Humanos',to:config.account||'estudante.agv@simulacao.edu.br',subject:'Atualização do calendário de capacitações',body:'O calendário simulado foi atualizado. Consulte a pasta compartilhada quando necessário.',at:new Date(Date.now()-1000*60*42).toISOString(),attachments:[]}]},
    {id:'thread-finance',folder:'inbox',unread:false,starred:false,important:false,participants:['financeiro.agv@simulacao.edu.br'],messages:[{id:'message-finance',from:'financeiro.agv@simulacao.edu.br',name:'Financeiro',to:config.account||'estudante.agv@simulacao.edu.br',subject:'Conferência mensal concluída',body:'A conferência simulada do período foi concluída e arquivada.',at:new Date(Date.now()-1000*60*60*22).toISOString(),attachments:[]}]},
    {id:'thread-security',folder:'spam',unread:true,starred:false,important:false,participants:['suporte-conta@alerta-invalido.example'],messages:[{id:'message-security',from:'suporte-conta@alerta-invalido.example',name:'Aviso externo',to:config.account||'estudante.agv@simulacao.edu.br',subject:'URGENTE: informe seu código para manter o acesso',body:'Mensagem simulada suspeita. Nunca informe senha ou código temporário.',at:new Date(Date.now()-1000*60*60*27).toISOString(),attachments:[]}]}
  ];
}

export function createInitialEmailState(config={}){
  return {version:EMAIL_ENGINE_VERSION,folder:'inbox',query:'',selectedThreadId:null,composeOpen:false,filePickerOpen:false,drivePickerOpen:false,showCc:Boolean(config.cc),showBcc:false,sent:false,lastSavedAt:null,draft:{id:'draft-main',mode:'reply',to:'',cc:'',bcc:'',subject:'',body:'',attachments:[],driveLinks:[],updatedAt:null},threads:defaultThreads(config),files:defaultFiles(config),sentMessages:[],history:[{at:now(),action:'mailbox-opened',detail:'Caixa de entrada aberta'}]};
}

export function normalizeEmailState(saved,config={}){
  const base=createInitialEmailState(config),state={...base,...clone(saved||{})};
  state.draft={...base.draft,...(state.draft||{})};
  state.draft.attachments=Array.isArray(state.draft.attachments)?state.draft.attachments:[];
  state.draft.driveLinks=Array.isArray(state.draft.driveLinks)?state.draft.driveLinks:[];
  state.threads=Array.isArray(state.threads)&&state.threads.length?state.threads:base.threads;
  state.files=Array.isArray(state.files)&&state.files.length?state.files:base.files;
  state.sentMessages=Array.isArray(state.sentMessages)?state.sentMessages:[];
  state.history=Array.isArray(state.history)?state.history:[];
  return state;
}

export function validateEmailDraft(draft,config={}){
  const to=splitAddresses(draft.to),cc=splitAddresses(draft.cc),bcc=splitAddresses(draft.bcc),all=[...to,...cc,...bcc];
  const expectedTo=requesterAddress(config),expectedCc=splitAddresses(config.cc||'');
  const errors=[],warnings=[];
  if(!to.length)errors.push({id:'recipient-missing',label:'Informe o destinatário principal.'});
  if(all.some(address=>!validAddress(address)))errors.push({id:'recipient-invalid',label:'Há um endereço de e-mail inválido.'});
  if(expectedTo&&!to.includes(expectedTo))errors.push({id:'recipient-wrong',label:'A mensagem não está endereçada ao setor solicitante.'});
  for(const address of expectedCc)if(!cc.includes(address))errors.push({id:'cc-missing',label:'Inclua no CC a pessoa ou setor que precisa acompanhar.'});
  if(!clean(draft.subject))errors.push({id:'subject-missing',label:'Informe um assunto.'});
  else {
    const subjectKeywords=config.subjectKeywords||[];
    const subjectCheck=flexibleConceptCoverage(draft.subject,subjectKeywords,{minimumRatio:config.subjectKeywordRatio??0.4,minimumConcepts:config.subjectKeywordMinimum??1});
    const subjectContext=contextualOverlap(draft.subject,config.scenario||config.requestSubject||'');
    if(subjectKeywords.length&&!subjectCheck.ok&&subjectContext<0.2)errors.push({id:'subject-context',label:'O assunto ainda não identifica o tema principal da solicitação. Você pode usar palavras equivalentes.'});
  }
  if(!clean(draft.body))errors.push({id:'body-missing',label:'Escreva a mensagem.'});
  else {
    const bodyKeywords=config.bodyKeywords||[],contextKeywords=bodyKeywords.filter(word=>!['ola','atenciosamente'].includes(normalize(word)));
    const bodyCheck=flexibleConceptCoverage(draft.body,contextKeywords,{minimumRatio:config.bodyKeywordRatio??0.45,minimumConcepts:config.bodyKeywordMinimum??1});
    const bodyContext=contextualOverlap(draft.body,config.scenario||config.requestMessage||'');
    if(bodyKeywords.some(word=>normalize(word)==='ola')&&!hasProfessionalGreeting(draft.body))warnings.push({id:'body-greeting',label:'Uma saudação deixaria a mensagem mais profissional, mas outras formas de abertura também são aceitas.'});
    if(bodyKeywords.some(word=>normalize(word)==='atenciosamente')&&!hasProfessionalClosing(draft.body))warnings.push({id:'body-closing',label:'Considere finalizar com uma despedida profissional. A ausência não bloqueia o envio.'});
    if(contextKeywords.length&&!bodyCheck.ok&&bodyContext<0.12&&!(narrativeLooksComplete(draft.body,{minWords:7,minChars:32})&&narrativeIntentSatisfied(draft.body)))errors.push({id:'body-context',label:'Explique um pouco melhor o que está sendo enviado ou solicitado. Não é necessário repetir as mesmas palavras do enunciado.'});
  }
  const expectedAttachment=clean(config.attachment||'');
  const attachedNames=[...(draft.attachments||[]).map(file=>file.name),...(draft.driveLinks||[]).map(file=>file.name)];
  if(expectedAttachment&&!attachedNames.includes(expectedAttachment))errors.push({id:'attachment-missing',label:'Anexe a versão correta do arquivo solicitado.'});
  if(!expectedAttachment&&attachedNames.length)warnings.push({id:'unexpected-attachment',label:'Esta solicitação não exige anexo. Confirme se o arquivo deve ser enviado.'});
  if(/anex[oa]/i.test(draft.body)&&!attachedNames.length&&!draft.driveLinks?.length)errors.push({id:'attachment-mentioned',label:'O texto menciona um anexo, mas nenhum arquivo ou link foi incluído.'});
  if((draft.driveLinks||[]).some(link=>link.access==='restricted'&&!link.recipientAccess))errors.push({id:'drive-access',label:'Um link do Drive está restrito e o destinatário não possui acesso.'});
  const inserted=[...(draft.attachments||[]),...(draft.driveLinks||[])];
  if(inserted.some(file=>file.status==='stale'))errors.push({id:'file-stale',label:'O arquivo anexado foi gerado antes da última alteração e está desatualizado.'});
  if(inserted.some(file=>file.status==='duplicate'))warnings.push({id:'file-duplicate',label:'O arquivo selecionado é uma cópia paralela. Confira se é a versão aprovada.'});
  if(inserted.some(file=>file.conflictId||file.status==='conflict'))errors.push({id:'file-conflict',label:'Existe um conflito de versão pendente no arquivo selecionado.'});
  if(draft.subject&&draft.subject===draft.subject.toUpperCase()&&/[A-ZÁÉÍÓÚÇ]{4}/.test(draft.subject))warnings.push({id:'subject-uppercase',label:'Assuntos totalmente em maiúsculas podem parecer agressivos.'});
  if(draft.subject.trim().length<6)warnings.push({id:'subject-vague',label:'O assunto está muito curto e pode dificultar a identificação.'});
  if(bcc.length&&cc.length===0&&to.length>1)warnings.push({id:'recipient-structure',label:'Confira se Para, CC e CCO representam corretamente os papéis.'});
  return {valid:errors.length===0,errors,warnings,summary:{to,cc,bcc,attachments:attachedNames,driveLinks:(draft.driveLinks||[]).map(link=>link.name)}};
}

export class EmailEngine{
  constructor(container,options={}){
    this.container=container;this.config={account:'estudante.agv@simulacao.edu.br',scenario:'Comunicação administrativa',reducedMotion:false,...options};
    this.state=normalizeEmailState(options.initialState,this.config);this.onChange=typeof options.onChange==='function'?options.onChange:()=>{};this.onAction=typeof options.onAction==='function'?options.onAction:()=>{};this.onSend=typeof options.onSend==='function'?options.onSend:()=>{};this.warningConfirmed=false;this.returnFocus=null;this.render();
  }
  serialize(){return clone(this.state)}
  touch(action,detail='',meta={}){this.state.history.push({at:now(),action,detail});this.state.history=this.state.history.slice(-180);this.onAction(action,{detail,...meta,state:this.serialize()});this.commit()}
  commit(){this.state.lastSavedAt=now();this.onChange(this.serialize())}
  primaryThread(){return this.state.threads.find(thread=>thread.id==='thread-request')}
  selectedThread(){return this.state.threads.find(thread=>thread.id===this.state.selectedThreadId)}
  unreadCount(){return this.state.threads.filter(thread=>thread.folder==='inbox'&&thread.unread).length}
  folderThreads(folder=this.state.folder){
    let threads=this.state.threads.filter(thread=>folder==='starred'?thread.starred:thread.folder===folder);
    const q=normalize(this.state.query);if(q)threads=threads.filter(thread=>normalize(JSON.stringify(thread)).includes(q));
    return threads.sort((a,b)=>new Date(b.messages.at(-1).at)-new Date(a.messages.at(-1).at));
  }
  saveDraft(){this.state.draft.updatedAt=now();this.state.lastSavedAt=now();this.onAction('mail-draft-saved',{draft:clone(this.state.draft)});this.commit();this.updateSaveStatus()}
  updateSaveStatus(){const node=this.container.querySelector('[data-mail-save-status]');if(node)node.textContent=`Rascunho salvo às ${shortTime(this.state.draft.updatedAt||now())}`}
  openThread(id){const thread=this.state.threads.find(item=>item.id===id);if(!thread)return;thread.unread=false;this.state.selectedThreadId=id;this.touch(id==='thread-request'?'mail-open-request':'mail-open-thread',thread.messages.at(-1).subject);this.render()}
  compose(mode='new'){
    this.returnFocus=document.activeElement instanceof HTMLElement?document.activeElement:null;
    const message=this.selectedThread()?.messages.at(-1),isRequest=this.state.selectedThreadId==='thread-request';
    this.state.composeOpen=true;this.state.showCc=Boolean(this.config.cc)||mode==='reply-all';
    this.state.draft={id:this.state.draft.id||'draft-main',mode,to:mode==='new'?'':(message?.from||requesterAddress(this.config)),cc:mode==='reply-all'?clean(this.config.cc||message?.cc||''):'',bcc:'',subject:mode==='new'?'':`Re: ${message?.subject||scenarioSubject(this.config)}`,body:clean(this.state.draft.body||''),attachments:this.state.draft.attachments||[],driveLinks:this.state.draft.driveLinks||[],updatedAt:now()};
    this.touch('mail-compose-opened',`${mode}${isRequest?' · solicitação principal':''}`);this.render()
  }
  attachFile(file){this.state.draft.attachments=[file];this.state.filePickerOpen=false;this.touch('mail-file-attached',file.name,{file:clone(file)});this.render()}
  addDriveLink(file){
    const existing=this.state.draft.driveLinks.some(link=>link.id===file.id);if(!existing)this.state.draft.driveLinks.push({...file,recipientAccess:file.access!=='restricted'});
    this.state.drivePickerOpen=false;this.touch('mail-drive-link-added',file.name,{file:clone(file)});this.render()
  }
  toggleDriveAccess(id){const link=this.state.draft.driveLinks.find(item=>item.id===id);if(link){link.recipientAccess=!link.recipientAccess;this.touch('mail-drive-access-changed',`${link.name} · ${link.recipientAccess?'acesso concedido':'restrito'}`,{file:clone(link)});this.render()}}
  removeAttachment(index){const [file]=this.state.draft.attachments.splice(index,1);this.touch('mail-attachment-removed',file?.name||'');this.render()}
  removeDriveLink(index){const [file]=this.state.draft.driveLinks.splice(index,1);this.touch('mail-drive-link-removed',file?.name||'');this.render()}
  send(){
    const validation=validateEmailDraft(this.state.draft,this.config);
    if(this.config.requireRequestRead&&!this.state.history.some(item=>item.action==='mail-open-request'))validation.errors.unshift({id:'request-unread',label:'Abra e leia a solicitação principal antes de enviar.'});
    if(this.config.requireReply&&this.state.draft.mode==='new')validation.errors.unshift({id:'reply-required',label:'Responda à solicitação recebida para manter a conversa no mesmo tópico.'});
    validation.valid=validation.errors.length===0;this.onAction('mail-send-attempt',{validation,draft:clone(this.state.draft)});
    if(!validation.valid){this.showValidation(validation);return}
    if(validation.warnings.length&&!this.warningConfirmed){this.warningConfirmed=true;this.showValidation(validation,true);return}
    const sent={id:uid('sent'),from:this.config.account,to:this.state.draft.to,cc:this.state.draft.cc,bcc:this.state.draft.bcc,subject:this.state.draft.subject,body:this.state.draft.body,attachments:clone(this.state.draft.attachments),driveLinks:clone(this.state.draft.driveLinks),at:now()};
    this.state.sentMessages.push(sent);this.state.sent=true;this.state.composeOpen=false;this.state.folder='sent';this.state.selectedThreadId=null;this.touch('mail-send',sent.subject);this.onSend({message:clone(sent),validation,state:this.serialize()});this.render()
  }
  showValidation(validation,warningOnly=false){
    const node=this.container.querySelector('[data-mail-validation]');if(!node)return;
    const items=warningOnly?validation.warnings:validation.errors;
    node.className=`mail-pro-validation ${warningOnly?'warning':'error'}`;
    node.innerHTML=`<strong>${warningOnly?'Confirmação antes do envio':'Revise a mensagem'}</strong><ul>${items.map(item=>`<li>${escapeHtml(item.label)}</li>`).join('')}</ul>${warningOnly?'<button data-mail-confirm-send>Enviar mesmo assim</button>':''}`;
    node.scrollIntoView({behavior:this.config.reducedMotion?'auto':'smooth',block:'nearest'});
    node.querySelector('[data-mail-confirm-send]')?.addEventListener('click',()=>this.send());
  }
  render(){
    this.container.innerHTML=`<div class="mail-pro-shell"><header class="mail-pro-header"><div class="mail-pro-brand"><i>✦</i><strong>Correio AGV</strong></div><label class="mail-pro-search"><span>⌕</span><input data-mail-search placeholder="Pesquisar mensagens" value="${escapeHtml(this.state.query)}"></label><div class="mail-pro-header-actions"><button title="Ajuda">?</button><button title="Configurações">⚙</button><span>${escapeHtml(String(this.config.account).slice(0,1).toUpperCase())}</span></div></header><div class="mail-pro-body"><aside class="mail-pro-sidebar"><button class="mail-pro-compose" data-mail-compose>＋ Escrever</button><nav>${this.folderButton('inbox','▰','Caixa de entrada',this.unreadCount())}${this.folderButton('starred','☆','Com estrela')}${this.folderButton('sent','➤','Enviados',this.state.sentMessages.length)}${this.folderButton('drafts','▱','Rascunhos',this.state.draft.updatedAt?1:0)}${this.folderButton('spam','!','Spam',this.state.threads.filter(x=>x.folder==='spam').length)}</nav><small>Conta simulada<br>${escapeHtml(this.config.account)}</small></aside><main class="mail-pro-main">${this.renderMain()}</main></div>${this.state.composeOpen?this.renderCompose():''}${this.state.filePickerOpen?this.renderFilePicker(false):''}${this.state.drivePickerOpen?this.renderFilePicker(true):''}</div>`;
    this.bind();
  }
  folderButton(folder,icon,label,count=''){return `<button class="${this.state.folder===folder&&!this.state.selectedThreadId?'active':''}" data-mail-folder="${folder}"><b>${icon}</b><span>${label}</span>${count!==''?`<i>${count}</i>`:''}</button>`}
  renderMain(){
    if(this.state.selectedThreadId)return this.renderThread();
    if(this.state.folder==='sent')return this.renderSent();
    if(this.state.folder==='drafts')return this.renderDrafts();
    const threads=this.folderThreads();
    return `<div class="mail-pro-toolbar"><div><button title="Selecionar">□</button><button title="Atualizar">↻</button><button title="Mais">⋮</button></div><span>${threads.length?`1–${threads.length} de ${threads.length}`:'0 mensagens'}</span></div><div class="mail-pro-tabs"><button class="active">Principal</button><button>Atualizações</button><button>Social</button></div><section class="mail-pro-list">${threads.length?threads.map(thread=>this.renderThreadRow(thread)).join(''):'<div class="mail-pro-empty"><b>Caixa vazia</b><span>Nenhuma mensagem corresponde à pesquisa.</span></div>'}</section>`;
  }
  renderThreadRow(thread){const message=thread.messages.at(-1);return `<button class="mail-pro-row ${thread.unread?'unread':''}" data-mail-thread="${thread.id}"><span class="mail-pro-check">□</span><span class="mail-pro-star" data-mail-star="${thread.id}">${thread.starred?'★':'☆'}</span><strong>${escapeHtml(message.name||message.from)}</strong><div><b>${escapeHtml(message.subject)}</b><span> — ${escapeHtml(message.body.slice(0,92))}</span></div><time>${shortDate(message.at)}</time></button>`}
  renderThread(){const thread=this.selectedThread(),message=thread?.messages.at(-1);if(!message)return '';
    return `<div class="mail-pro-thread-toolbar"><button data-mail-back>←</button><button>▱</button><button>!</button><button>⌫</button><span></span><button>‹</button><button>›</button></div><article class="mail-pro-thread"><header><h2>${escapeHtml(message.subject)}</h2><span>Caixa de entrada</span></header><div class="mail-pro-message-head"><div class="mail-pro-avatar">${escapeHtml(String(message.name||message.from).slice(0,1).toUpperCase())}</div><div><strong>${escapeHtml(message.name||message.from)} <small>&lt;${escapeHtml(message.from)}&gt;</small></strong><span>para ${escapeHtml(message.to)}${message.cc?`, cc: ${escapeHtml(message.cc)}`:''}</span></div><time>${shortTime(message.at)}</time><button>☆</button><button>↩</button><button>⋮</button></div><div class="mail-pro-message-body">${escapeHtml(message.body).replace(/\n/g,'<br>')}</div>${message.attachments?.length?`<div class="mail-pro-incoming-files">${message.attachments.map(file=>`<button data-mail-incoming-file="${escapeHtml(file.name)}"><b>▤</b><span><strong>${escapeHtml(file.name)}</strong><small>${escapeHtml(file.size||'Arquivo recebido')}</small></span><i>↓</i></button>`).join('')}</div>`:''}<div class="mail-pro-reply-actions"><button data-mail-reply="reply">↩ Responder</button><button data-mail-reply="reply-all">↩↩ Responder a todos</button><button data-mail-reply="forward">→ Encaminhar</button></div></article>`;
  }
  renderSent(){return `<div class="mail-pro-toolbar"><strong>Enviados</strong><span>${this.state.sentMessages.length} mensagem(ns)</span></div><section class="mail-pro-list">${this.state.sentMessages.length?this.state.sentMessages.slice().reverse().map(message=>`<button class="mail-pro-row" data-mail-sent="${message.id}"><span>□</span><span>☆</span><strong>para: ${escapeHtml(message.to)}</strong><div><b>${escapeHtml(message.subject)}</b><span> — ${escapeHtml(message.body.slice(0,88))}</span></div><time>${shortTime(message.at)}</time></button>`).join(''):'<div class="mail-pro-empty"><b>Nenhuma mensagem enviada</b><span>As mensagens simuladas aparecerão aqui.</span></div>'}</section>`}
  renderDrafts(){return `<div class="mail-pro-toolbar"><strong>Rascunhos</strong><span>${this.state.draft.updatedAt?'1 rascunho':'Nenhum rascunho'}</span></div><section class="mail-pro-list">${this.state.draft.updatedAt?`<button class="mail-pro-row unread" data-mail-open-draft><span>□</span><span>☆</span><strong>Rascunho</strong><div><b>${escapeHtml(this.state.draft.subject||'(sem assunto)')}</b><span> — ${escapeHtml(this.state.draft.body.slice(0,88)||'Mensagem em preparação')}</span></div><time>${shortTime(this.state.draft.updatedAt)}</time></button>`:'<div class="mail-pro-empty"><b>Nenhum rascunho</b><span>Mensagens em edição serão salvas automaticamente.</span></div>'}</section>`}
  renderCompose(){const draft=this.state.draft;return `<section class="mail-pro-compose-window" role="dialog" aria-modal="true" aria-labelledby="mailComposeTitle" tabindex="-1"><header><strong id="mailComposeTitle">${draft.mode==='reply'?'Responder':draft.mode==='reply-all'?'Responder a todos':draft.mode==='forward'?'Encaminhar':'Nova mensagem'}</strong><div><button title="Minimizar" aria-label="Minimizar composição">—</button><button title="Tela cheia" aria-label="Alternar tela cheia">□</button><button data-mail-close-compose title="Salvar e fechar" aria-label="Salvar rascunho e fechar">×</button></div></header><div class="mail-pro-compose-fields"><label><span>Para</span><input data-mail-field="to" value="${escapeHtml(draft.to)}" autocomplete="off"><button data-mail-toggle-cc>CC</button><button data-mail-toggle-bcc>CCO</button></label>${this.state.showCc?`<label><span>CC</span><input data-mail-field="cc" value="${escapeHtml(draft.cc)}" autocomplete="off"></label>`:''}${this.state.showBcc?`<label><span>CCO</span><input data-mail-field="bcc" value="${escapeHtml(draft.bcc)}" autocomplete="off"></label>`:''}<label><span>Assunto</span><input data-mail-field="subject" value="${escapeHtml(draft.subject)}" autocomplete="off"></label></div><textarea class="mail-pro-compose-body" data-mail-field="body" placeholder="Escreva a mensagem profissional...">${escapeHtml(draft.body)}</textarea><div class="mail-pro-inserted">${draft.attachments.map((file,index)=>`<span class="mail-pro-file-chip"><b>PDF</b>${escapeHtml(file.name)}${file.status==='stale'?'<em>desatualizado</em>':file.status==='duplicate'?'<em>cópia</em>':''}<button data-mail-remove-attachment="${index}" aria-label="Remover anexo ${escapeHtml(file.name)}">×</button></span>`).join('')}${draft.driveLinks.map((file,index)=>`<span class="mail-pro-file-chip drive ${file.recipientAccess?'ok':'blocked'}"><b>▦</b>${escapeHtml(file.name)}${file.status==='stale'?'<em>desatualizado</em>':file.status==='duplicate'?'<em>cópia</em>':''}<button data-mail-access="${file.id}" title="Alterar acesso">${file.recipientAccess?'✓':'🔒'}</button><button data-mail-remove-link="${index}" aria-label="Remover link ${escapeHtml(file.name)}">×</button></span>`).join('')}</div><div data-mail-validation></div><footer><div><button class="mail-pro-send" data-mail-send>Enviar</button><button class="mail-pro-send-more">⌄</button><button title="Opções de formatação">A</button><button data-mail-attach title="Anexar arquivo">📎</button><button data-mail-drive title="Inserir arquivo do Drive">▦</button><button title="Inserir link">🔗</button><button title="Emoji">☺</button></div><span data-mail-save-status>${draft.updatedAt?`Rascunho salvo às ${shortTime(draft.updatedAt)}`:'Salvando rascunho...'}</span><button data-mail-discard title="Descartar">⌫</button></footer></section>`}
  renderFilePicker(drive=false){const files=this.state.files.filter(file=>drive?file.source==='Meu Drive':file.source!=='Meu Drive');const titleId=drive?'mailDrivePickerTitle':'mailFilePickerTitle';return `<div class="mail-pro-modal" role="presentation"><section class="mail-pro-picker" role="dialog" aria-modal="true" aria-labelledby="${titleId}" tabindex="-1"><header><div><strong id="${titleId}">${drive?'Inserir arquivos usando o Drive':'Anexar arquivos'}</strong><span>${drive?'Escolha um arquivo e confira a permissão.':'Selecione a versão correta nos arquivos simulados.'}</span></div><button data-mail-close-picker aria-label="Fechar seletor de arquivos">×</button></header><nav><button class="active">${drive?'Meu Drive':'Recentes'}</button><button>${drive?'Compartilhados comigo':'Downloads'}</button><button>${drive?'Recentes':'Documentos'}</button></nav><div class="mail-pro-picker-list">${files.map(file=>`<button data-mail-pick="${file.id}"><b>${file.type==='PDF'?'PDF':'▤'}</b><span><strong>${escapeHtml(file.name)}</strong><small>${escapeHtml(file.source)} · ${escapeHtml(file.size)}${drive?` · ${file.access==='restricted'?'Restrito':'Com link'}`:''}${file.status==='stale'?' · DESATUALIZADO':file.status==='duplicate'?' · CÓPIA PARALELA':''}</small></span><i>›</i></button>`).join('')}</div><footer><button data-mail-close-picker>Cancelar</button></footer></section></div>`}
  closeActiveLayer(){
    if(this.state.filePickerOpen||this.state.drivePickerOpen){this.state.filePickerOpen=false;this.state.drivePickerOpen=false;this.render();return true}
    if(this.state.composeOpen){this.state.composeOpen=false;this.saveDraft();this.render();return true}
    return false
  }
  activeDialog(){return this.container.querySelector('.mail-pro-picker,.mail-pro-compose-window')}
  focusActiveDialog(){requestAnimationFrame(()=>{const dialog=this.activeDialog();if(!dialog)return;const active=document.activeElement;if(active&&dialog.contains(active))return;const target=dialog.querySelector('input,textarea,button:not([disabled]),select,[tabindex]:not([tabindex="-1"])')||dialog;target.focus({preventScroll:true})})}
  bind(){
    this.container.querySelector('[data-mail-search]')?.addEventListener('input',event=>{this.state.query=event.target.value;this.commit();clearTimeout(this.searchTimer);this.searchTimer=setTimeout(()=>this.render(),180)});
    this.container.querySelector('[data-mail-compose]')?.addEventListener('click',()=>this.compose('new'));
    this.container.querySelectorAll('[data-mail-folder]').forEach(button=>button.addEventListener('click',()=>{this.state.folder=button.dataset.mailFolder;this.state.selectedThreadId=null;this.touch('mail-folder-opened',button.dataset.mailFolder);this.render()}));
    this.container.querySelectorAll('[data-mail-thread]').forEach(button=>button.addEventListener('click',event=>{if(event.target.closest('[data-mail-star]'))return;this.openThread(button.dataset.mailThread)}));
    this.container.querySelectorAll('[data-mail-star]').forEach(button=>button.addEventListener('click',event=>{event.stopPropagation();const thread=this.state.threads.find(item=>item.id===button.dataset.mailStar);thread.starred=!thread.starred;this.touch('mail-star-toggled',thread.messages.at(-1).subject);this.render()}));
    this.container.querySelector('[data-mail-back]')?.addEventListener('click',()=>{this.state.selectedThreadId=null;this.commit();this.render()});
    this.container.querySelectorAll('[data-mail-reply]').forEach(button=>button.addEventListener('click',()=>this.compose(button.dataset.mailReply)));
    this.container.querySelectorAll('[data-mail-incoming-file]').forEach(button=>button.addEventListener('click',()=>{this.touch('mail-open-attachment',button.dataset.mailIncomingFile);button.classList.add('opened')}));
    this.container.querySelector('[data-mail-open-draft]')?.addEventListener('click',()=>{this.state.composeOpen=true;this.render()});
    this.container.querySelector('[data-mail-close-compose]')?.addEventListener('click',()=>{const target=this.returnFocus;this.state.composeOpen=false;this.saveDraft();this.render();requestAnimationFrame(()=>target?.isConnected&&target.focus({preventScroll:true}))});
    this.container.querySelector('[data-mail-toggle-cc]')?.addEventListener('click',()=>{this.state.showCc=!this.state.showCc;this.render()});
    this.container.querySelector('[data-mail-toggle-bcc]')?.addEventListener('click',()=>{this.state.showBcc=!this.state.showBcc;this.render()});
    this.container.querySelectorAll('[data-mail-field]').forEach(field=>field.addEventListener('input',()=>{this.state.draft[field.dataset.mailField]=field.value;clearTimeout(this.draftTimer);this.draftTimer=setTimeout(()=>this.saveDraft(),400)}));
    this.container.querySelector('[data-mail-attach]')?.addEventListener('click',()=>{this.returnFocus=document.activeElement instanceof HTMLElement?document.activeElement:null;this.state.filePickerOpen=true;this.render()});
    this.container.querySelector('[data-mail-drive]')?.addEventListener('click',()=>{this.returnFocus=document.activeElement instanceof HTMLElement?document.activeElement:null;this.state.drivePickerOpen=true;this.render()});
    this.container.querySelectorAll('[data-mail-close-picker]').forEach(button=>button.addEventListener('click',()=>{const target=this.returnFocus;this.state.filePickerOpen=false;this.state.drivePickerOpen=false;this.render();requestAnimationFrame(()=>target?.isConnected&&target.focus({preventScroll:true}))}));
    this.container.querySelectorAll('[data-mail-pick]').forEach(button=>button.addEventListener('click',()=>{const file=this.state.files.find(item=>item.id===button.dataset.mailPick);this.state.drivePickerOpen?this.addDriveLink(file):this.attachFile(file)}));
    this.container.querySelectorAll('[data-mail-remove-attachment]').forEach(button=>button.addEventListener('click',()=>this.removeAttachment(Number(button.dataset.mailRemoveAttachment))));
    this.container.querySelectorAll('[data-mail-remove-link]').forEach(button=>button.addEventListener('click',()=>this.removeDriveLink(Number(button.dataset.mailRemoveLink))));
    this.container.querySelectorAll('[data-mail-access]').forEach(button=>button.addEventListener('click',()=>this.toggleDriveAccess(button.dataset.mailAccess)));
    this.container.querySelector('[data-mail-send]')?.addEventListener('click',()=>this.send());
    this.container.querySelector('[data-mail-discard]')?.addEventListener('click',()=>{this.state.draft={...createInitialEmailState(this.config).draft};this.state.composeOpen=false;this.touch('mail-draft-discarded','Rascunho descartado');this.render()});
    this.container.onkeydown=event=>{const dialog=this.activeDialog();if(!dialog)return;if(event.key==='Escape'){event.preventDefault();this.closeActiveLayer();return}if(event.key!=='Tab')return;const items=[...dialog.querySelectorAll('button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])')].filter(node=>node.getClientRects().length);if(!items.length){event.preventDefault();dialog.focus();return}const first=items[0],last=items.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}};
    this.focusActiveDialog();
  }
}
