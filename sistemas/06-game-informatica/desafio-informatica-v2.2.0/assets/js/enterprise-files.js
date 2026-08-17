const clone=value=>JSON.parse(JSON.stringify(value));
const iso=()=>new Date().toISOString();
const clean=value=>String(value??'').replace(/[<>]/g,'').trim();
const uid=(prefix='item')=>`${prefix}-${Math.random().toString(36).slice(2,10)}`;

export const ENTERPRISE_FILES_VERSION=1;

function baseState(config={}){
  const at=iso();
  return {
    version:ENTERPRISE_FILES_VERSION,
    sources:{
      'sheet-main':{id:'sheet-main',name:clean(config.sheetName||'Base administrativa'),type:'spreadsheet',app:'sheet',version:1,modifiedAt:at},
      'doc-main':{id:'doc-main',name:clean(config.documentName||'Documento administrativo'),type:'document',app:'docs',version:1,modifiedAt:at}
    },
    files:[],accessRequests:[],conflicts:[],incidents:[],history:[{at,action:'workspace-created',detail:'Área de arquivos empresariais iniciada'}]
  };
}

function normalizeFile(file={}){
  return {
    id:clean(file.id||uid('file')),artifactGroup:clean(file.artifactGroup||file.id||uid('artifact')),
    name:clean(file.name||'arquivo'),type:clean(file.type||'Arquivo'),source:clean(file.source||'Downloads'),size:clean(file.size||'arquivo da operação'),
    modifiedAt:file.modifiedAt||iso(),access:clean(file.access||'private'),recipientAccess:Boolean(file.recipientAccess),
    sourceId:clean(file.sourceId||''),sourceVersion:Number(file.sourceVersion)||0,status:clean(file.status||'current'),
    conflictId:clean(file.conflictId||''),owner:clean(file.owner||'Você'),version:Number(file.version)||1,
    deletedAt:file.deletedAt||null,previousStatus:clean(file.previousStatus||'')
  };
}

export function normalizeEnterpriseFileState(saved,config={}){
  const base=baseState(config),state={...base,...clone(saved||{})};
  state.sources={...base.sources,...(state.sources||{})};
  for(const [key,value] of Object.entries(state.sources))state.sources[key]={...base.sources[key],...value,id:value?.id||key,version:Math.max(1,Number(value?.version)||1),modifiedAt:value?.modifiedAt||iso()};
  state.files=Array.isArray(state.files)?state.files.map(normalizeFile):[];
  state.accessRequests=Array.isArray(state.accessRequests)?state.accessRequests:[];
  state.conflicts=Array.isArray(state.conflicts)?state.conflicts:[];
  state.incidents=Array.isArray(state.incidents)?state.incidents:[];
  state.history=Array.isArray(state.history)?state.history:[];
  return state;
}

export class EnterpriseFileWorkspace{
  constructor(config={},saved=null){this.config=config;this.state=normalizeEnterpriseFileState(saved,config)}
  serialize(){return clone(this.state)}
  #history(action,detail=''){this.state.history.push({at:iso(),action,detail});this.state.history=this.state.history.slice(-220)}
  #incident(kind,detail='',fileId=''){const item={id:uid('incident'),at:iso(),kind,detail,fileId,resolved:false};this.state.incidents.push(item);this.state.incidents=this.state.incidents.slice(-80);return item}
  source(id){return this.state.sources[id]||null}
  registerSource(source={}){
    const id=clean(source.id);if(!id)return null;
    const current=this.state.sources[id]||{};this.state.sources[id]={id,name:clean(source.name||current.name||id),type:clean(source.type||current.type||'document'),app:clean(source.app||current.app||''),version:Math.max(1,Number(source.version||current.version)||1),modifiedAt:source.modifiedAt||current.modifiedAt||iso()};
    this.#history('source-registered',id);return clone(this.state.sources[id]);
  }
  touchSource(sourceId,detail='Alteração salva'){
    const source=this.state.sources[sourceId]||this.registerSource({id:sourceId,name:sourceId});
    source.version=Math.max(1,Number(source.version)||1)+1;source.modifiedAt=iso();
    let stale=0;
    for(const file of this.state.files){if(file.sourceId===sourceId&&file.sourceVersion<source.version&&file.status==='current'){file.status='stale';stale++;this.#incident('stale-artifact',`${file.name} ficou desatualizado após ${detail}.`,file.id)}}
    this.#history('source-updated',`${sourceId} · versão ${source.version} · ${detail}`);return {source:clone(source),stale};
  }
  produceArtifact({name,type='PDF',sourceId='doc-main',locations=['Downloads','Meu Drive'],access='restricted',size='arquivo gerado nesta operação'}={}){
    const source=this.state.sources[sourceId]||this.registerSource({id:sourceId,name:sourceId});
    for(const previous of this.state.files){if(previous.sourceId===sourceId&&previous.name===clean(name)&&previous.status==='current'){previous.status='stale';for(const request of this.state.accessRequests)if(request.fileId===previous.id&&request.status==='pending')request.status='superseded';this.#incident('superseded-artifact',`${previous.name} foi substituído por uma nova exportação.`,previous.id)}}
    const group=uid('artifact'),created=[];
    for(const location of locations){const file=normalizeFile({id:uid(location==='Meu Drive'?'drive':'download'),artifactGroup:group,name,type,source:location,size,modifiedAt:iso(),access:location==='Meu Drive'?access:'private',recipientAccess:location!=='Meu Drive'||access!=='restricted',sourceId,sourceVersion:source.version,status:'current',version:source.version});this.state.files.push(file);created.push(file)}
    this.#history('artifact-produced',`${clean(name)} · fonte ${sourceId} v${source.version}`);return clone(created);
  }
  duplicateFile(fileId,newName=''){
    const file=this.state.files.find(item=>item.id===fileId);if(!file)return {ok:false,reason:'Arquivo não encontrado.'};
    const copy=normalizeFile({...file,id:uid('copy'),artifactGroup:uid('artifact'),name:clean(newName||`${file.name.replace(/(\.[^.]+)$/,'')} - cópia${file.name.match(/(\.[^.]+)$/)?.[1]||''}`),modifiedAt:iso(),status:'duplicate'});this.state.files.push(copy);this.#incident('duplicate-version',`Foi criada uma cópia paralela de ${file.name}.`,copy.id);this.#history('file-duplicated',copy.name);return {ok:true,file:clone(copy)}
  }
  createConflict(sourceId,{remoteVersion=0,detail='Outra pessoa alterou o arquivo enquanto ele estava aberto.'}={}){
    const source=this.state.sources[sourceId]||this.registerSource({id:sourceId,name:sourceId});const existing=this.state.conflicts.find(item=>item.sourceId===sourceId&&item.status==='pending');if(existing)return clone(existing);
    const conflict={id:uid('conflict'),sourceId,localVersion:source.version,remoteVersion:Math.max(source.version+1,Number(remoteVersion)||0),detail:clean(detail),status:'pending',createdAt:iso(),resolvedAt:null,strategy:''};this.state.conflicts.push(conflict);this.#incident('version-conflict',detail,sourceId);this.#history('conflict-created',`${sourceId} · local ${conflict.localVersion} / remoto ${conflict.remoteVersion}`);return clone(conflict)
  }
  resolveConflict(conflictId,strategy='keep-local'){
    const conflict=this.state.conflicts.find(item=>item.id===conflictId);if(!conflict||conflict.status!=='pending')return {ok:false,reason:'Conflito não encontrado.'};
    const source=this.state.sources[conflict.sourceId];if(strategy==='use-remote')source.version=conflict.remoteVersion;else source.version=Math.max(conflict.remoteVersion,source.version)+1;
    source.modifiedAt=iso();conflict.status='resolved';conflict.strategy=strategy;conflict.resolvedAt=iso();
    let stale=0;for(const file of this.state.files){if(file.sourceId===conflict.sourceId&&file.sourceVersion<source.version&&file.status==='current'){file.status='stale';stale++;this.#incident('stale-artifact',`${file.name} precisa ser gerado novamente após resolver o conflito.`,file.id)}}
    for(const item of this.state.incidents)if(item.kind==='version-conflict'&&item.fileId===conflict.sourceId&&!item.resolved)item.resolved=true;
    this.#history('conflict-resolved',`${conflict.sourceId} · ${strategy}`);return {ok:true,source:clone(source),stale}
  }
  requestAccess(fileId,requester='gestao@simulacao.edu.br'){
    const file=this.state.files.find(item=>item.id===fileId);if(!file)return {ok:false,reason:'Arquivo não encontrado.'};
    const pending=this.state.accessRequests.find(item=>item.fileId===fileId&&item.requester===requester&&item.status==='pending');if(pending)return {ok:true,request:clone(pending),reused:true};
    const request={id:uid('access'),fileId,requester:clean(requester).toLowerCase(),requestedAt:iso(),status:'pending',permission:'reader',resolvedAt:null};this.state.accessRequests.push(request);this.#history('access-requested',`${file.name} · ${request.requester}`);return {ok:true,request:clone(request)}
  }
  resolveAccessRequest(requestId,decision='approve',permission='reader'){
    const request=this.state.accessRequests.find(item=>item.id===requestId);if(!request||request.status!=='pending')return {ok:false,reason:'Solicitação não encontrada.'};
    request.status=decision==='approve'?'approved':'denied';request.permission=permission;request.resolvedAt=iso();const file=this.state.files.find(item=>item.id===request.fileId);
    if(file&&request.status==='approved'){file.recipientAccess=true;file.access=file.access==='restricted'?'shared':file.access}
    this.#history('access-request-resolved',`${file?.name||request.fileId} · ${request.status}`);return {ok:true,request:clone(request),file:file?clone(file):null}
  }

  deleteFile(fileId,{reason='Arquivo movido para a lixeira'}={}){
    const file=this.state.files.find(item=>item.id===fileId);if(!file)return {ok:false,reason:'Arquivo não encontrado.'};
    if(file.status==='trashed')return {ok:true,file:clone(file),reused:true};
    file.previousStatus=file.status;file.status='trashed';file.deletedAt=iso();file.modifiedAt=iso();
    for(const request of this.state.accessRequests)if(request.fileId===fileId&&request.status==='pending')request.status='superseded';
    this.#incident('file-deleted',`${file.name} foi enviado para a lixeira. ${clean(reason)}`,file.id);this.#history('file-deleted',file.name);return {ok:true,file:clone(file)}
  }
  restoreFile(fileId){
    const file=this.state.files.find(item=>item.id===fileId);if(!file||file.status!=='trashed')return {ok:false,reason:'Arquivo não encontrado na lixeira.'};
    const source=this.state.sources[file.sourceId];const fallback=file.previousStatus&&file.previousStatus!=='trashed'?file.previousStatus:'current';
    file.status=source&&file.sourceVersion<source.version?'stale':fallback;file.deletedAt=null;file.previousStatus='';file.modifiedAt=iso();
    for(const item of this.state.incidents)if(item.kind==='file-deleted'&&item.fileId===file.id&&!item.resolved)item.resolved=true;
    this.#history('file-restored',`${file.name} · ${file.status}`);return {ok:true,file:clone(file)}
  }
  trashedFiles(){return this.state.files.filter(file=>file.status==='trashed')}
  setFileAccess(fileId,{access,recipientAccess}={}){
    const file=this.state.files.find(item=>item.id===fileId);if(!file)return false;if(access)file.access=clean(access);if(typeof recipientAccess==='boolean')file.recipientAccess=recipientAccess;file.modifiedAt=iso();this.#history('file-access-updated',`${file.name} · ${file.access}`);return true
  }
  currentFiles(){return this.state.files.filter(file=>file.status==='current')}
  emailFiles(){return this.state.files.filter(file=>file.status!=='trashed').map(file=>clone(file))}
  pendingAccessRequests(){return this.state.accessRequests.filter(item=>item.status==='pending')}
  pendingConflicts(){return this.state.conflicts.filter(item=>item.status==='pending')}
  validateForSend(fileOrId,{expectedName='',recipient=''}={}){
    const file=typeof fileOrId==='string'?this.state.files.find(item=>item.id===fileOrId):fileOrId;const issues=[];
    if(!file)return {valid:false,issues:[{id:'missing',label:'O arquivo selecionado não existe mais.'}]};
    if(expectedName&&file.name!==expectedName)issues.push({id:'wrong-version-name',label:'O arquivo selecionado não corresponde ao nome solicitado.'});
    if(file.status==='trashed')issues.push({id:'file-trashed',label:'O arquivo está na lixeira e precisa ser restaurado antes do envio.'});
    if(file.status==='stale')issues.push({id:'stale-version',label:'O arquivo foi gerado antes da última alteração e está desatualizado.'});
    if(file.status==='duplicate')issues.push({id:'duplicate-version',label:'Esta é uma cópia paralela. Confira se é a versão aprovada.'});
    if(file.conflictId||this.pendingConflicts().some(item=>item.sourceId===file.sourceId))issues.push({id:'conflict-pending',label:'Existe um conflito de versão pendente para o arquivo de origem.'});
    if(file.sourceId&&this.state.sources[file.sourceId]&&file.sourceVersion<this.state.sources[file.sourceId].version)issues.push({id:'source-newer',label:'Existe uma versão mais recente do documento de origem.'});
    if(file.source==='Meu Drive'&&file.access==='restricted'&&!file.recipientAccess)issues.push({id:'access-required',label:`${recipient||'O destinatário'} ainda não possui acesso ao arquivo do Drive.`});
    return {valid:issues.length===0,issues,file:clone(file)}
  }
  markSent(fileIds=[]){for(const id of fileIds){const file=this.state.files.find(item=>item.id===id);if(file){file.sentAt=iso();this.#history('file-sent',file.name)}}}
  metrics(){return {files:this.state.files.length,current:this.currentFiles().length,stale:this.state.files.filter(file=>file.status==='stale').length,duplicates:this.state.files.filter(file=>file.status==='duplicate').length,trashed:this.trashedFiles().length,pendingAccess:this.pendingAccessRequests().length,pendingConflicts:this.pendingConflicts().length,incidents:this.state.incidents.filter(item=>!item.resolved).length}}
}
