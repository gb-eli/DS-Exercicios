const clone=value=>JSON.parse(JSON.stringify(value));
const iso=()=>new Date().toISOString();
const id=(prefix='id')=>`${prefix}-${Math.random().toString(36).slice(2,9)}`;
const clean=value=>String(value??'').replace(/[<>]/g,'').trim();

export const DOCUMENT_ENGINE_VERSION=1;

export class DocumentEngine{
  constructor(config={},saved=null){
    this.config={
      documentTitle:'Documento administrativo',department:'Setor administrativo',date:'Agosto de 2026',
      intro:'Conteúdo administrativo simulado para prática.',bullets:[],signature:'Setor responsável',
      permission:'reader',filename:'documento-administrativo.pdf',shareRecipient:'supervisao.agv@simulacao.edu.br',
      folderName:'Relatórios Administrativos',...config
    };
    this.state=saved?this.#normalize(saved):this.#initialState();
  }
  #initialState(){
    const created=iso(),documentId='doc-main';
    const doc={
      id:documentId,name:this.config.documentTitle,type:'document',owner:'Você',modifiedAt:created,starred:true,
      folderId:'folder-reports',version:1,selectedBlock:'title',
      content:{title:this.config.documentTitle,intro:this.config.intro,bullets:[...(this.config.bullets||[])],deadline:(this.config.bullets||[]).find(x=>/prazo|até|\d{2}\/\d{2}/i.test(x))||'conforme orientação do setor',date:this.config.date,signature:this.config.signature},
      formatting:{titleStyle:false,boldDeadline:false,centerHeader:false,list:false,date:false,signature:false},
      comments:[],versions:[{id:'version-initial',label:'Versão inicial',at:created,author:'Sistema',summary:'Documento criado',snapshot:null}],
      share:{people:[],generalAccess:'restricted',generalPermission:'reader'},
      exportSettings:{paper:'A4',orientation:'portrait',margins:'normal',pages:'all',includeComments:false},
      exportHistory:[],pdfReady:false,filename:this.config.filename
    };
    doc.versions[0].snapshot=this.#snapshotDoc(doc);
    return {
      version:DOCUMENT_ENGINE_VERSION,view:'drive',folderId:'folder-reports',activeFileId:documentId,search:'',sidePanel:'',
      folders:[{id:'folder-root',name:'Meu Drive',parentId:null},{id:'folder-admin',name:'Administração',parentId:'folder-root'},{id:'folder-reports',name:this.config.folderName,parentId:'folder-admin'}],
      files:[doc,{id:'sheet-base',name:'Base administrativa',type:'spreadsheet',owner:'Você',modifiedAt:created,folderId:'folder-reports',starred:false},{id:'pdf-previous',name:'Relatório anterior.pdf',type:'pdf',owner:'Secretaria',modifiedAt:created,folderId:'folder-reports',starred:false}],
      history:[{at:created,label:'Pasta aberta',detail:this.config.folderName}]
    };
  }
  #normalize(saved){
    const base=this.#initialState(),state={...base,...clone(saved)};
    state.folders=Array.isArray(state.folders)?state.folders:base.folders;
    state.files=Array.isArray(state.files)?state.files:base.files;
    const doc=state.files.find(file=>file.id===state.activeFileId&&file.type==='document')||state.files.find(file=>file.type==='document');
    if(doc){
      doc.content={...base.files[0].content,...(doc.content||{})};
      doc.formatting={...base.files[0].formatting,...(doc.formatting||{})};
      doc.comments=Array.isArray(doc.comments)?doc.comments:[];
      doc.versions=Array.isArray(doc.versions)&&doc.versions.length?doc.versions:base.files[0].versions;
      doc.share={...base.files[0].share,...(doc.share||{})};
      doc.share.people=Array.isArray(doc.share.people)?doc.share.people:[];
      doc.exportSettings={...base.files[0].exportSettings,...(doc.exportSettings||{})};
      doc.exportHistory=Array.isArray(doc.exportHistory)?doc.exportHistory:[];
      state.activeFileId=doc.id;
    }
    state.history=Array.isArray(state.history)?state.history:[];
    return state;
  }
  #snapshotDoc(doc=this.document){
    return clone({content:doc.content,formatting:doc.formatting,share:doc.share,filename:doc.filename,pdfReady:doc.pdfReady});
  }
  #touch(label,detail=''){
    const doc=this.document;if(doc){doc.modifiedAt=iso();doc.version=Math.max(1,Number(doc.version)||1)}
    this.state.history.push({at:iso(),label,detail});this.state.history=this.state.history.slice(-120);
  }
  get document(){return this.state.files.find(file=>file.id===this.state.activeFileId&&file.type==='document')||this.state.files.find(file=>file.type==='document')}
  serialize(){return clone(this.state)}
  setView(view){this.state.view=view==='document'?'document':'drive';this.#touch(view==='document'?'Documento aberto':'Drive aberto',this.document?.name||'')}
  selectBlock(block){this.document.selectedBlock=block;this.#touch('Trecho selecionado',block)}
  search(value){this.state.search=clean(value)}
  visibleFiles(){const q=this.state.search.toLowerCase();return this.state.files.filter(file=>file.folderId===this.state.folderId&&(!q||file.name.toLowerCase().includes(q)))}
  applyAction(action,options={}){
    const doc=this.document;if(!doc)return {ok:false};
    const selected=doc.selectedBlock||'title';
    const needs={
      'title-style':'title','bold-deadline':'deadline','center-header':'title','insert-list':'bullets'
    };
    if(needs[action]&&selected!==needs[action])return {ok:false,reason:`Selecione ${needs[action]} antes de aplicar a ferramenta.`};
    if(action==='title-style')doc.formatting.titleStyle=true;
    else if(action==='bold-deadline')doc.formatting.boldDeadline=true;
    else if(action==='center-header')doc.formatting.centerHeader=true;
    else if(action==='insert-list')doc.formatting.list=true;
    else if(action==='add-date')doc.formatting.date=true;
    else if(action==='add-signature')doc.formatting.signature=true;
    else if(action==='add-comment'){
      const text=clean(options.text||'Revisar este trecho antes da aprovação.');if(!text)return {ok:false,reason:'Digite um comentário.'};
      doc.comments.push({id:id('comment'),text,anchor:selected,author:'Estudante',at:iso(),resolved:false});
    }
    else if(action==='resolve-comment'){
      const comment=doc.comments.find(item=>!item.resolved);if(!comment)return {ok:false,reason:'Não há comentário pendente.'};comment.resolved=true;comment.resolvedAt=iso();
    }
    else if(action==='save-version'){
      const label=clean(options.label||`Versão ${doc.versions.length+1}`);doc.version+=1;doc.versions.push({id:id('version'),label,at:iso(),author:'Estudante',summary:'Versão nomeada',snapshot:this.#snapshotDoc(doc)});
    }
    else if(action.startsWith('permission-')){
      const permission=action.replace('permission-','');doc.share.people=[{email:clean(options.email||this.config.shareRecipient),permission}];
    }
    else if(action==='export-pdf'){
      doc.exportSettings={...doc.exportSettings,...(options.settings||{})};doc.pdfReady=true;doc.exportHistory.push({at:iso(),filename:doc.filename,settings:clone(doc.exportSettings)});
    }
    else if(action==='open-drive-file'){this.setView('document');return {ok:true,label:'Documento aberto no editor'};}
    else return {ok:false,reason:'Ação não reconhecida.'};
    this.#touch('Documento atualizado',action);return {ok:true,label:action};
  }
  addCollaborator(email,permission='reader'){
    const value=clean(email).toLowerCase();if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))return {ok:false,reason:'Informe um e-mail fictício válido.'};
    const current=this.document.share.people.find(item=>item.email===value);if(current)current.permission=permission;else this.document.share.people.push({email:value,permission});
    this.#touch('Pessoa adicionada ao compartilhamento',`${value} · ${permission}`);return {ok:true};
  }
  removeCollaborator(email){this.document.share.people=this.document.share.people.filter(item=>item.email!==email);this.#touch('Acesso removido',email)}
  setGeneralAccess(access,permission='reader'){this.document.share.generalAccess=access;this.document.share.generalPermission=permission;this.#touch('Acesso geral alterado',`${access} · ${permission}`)}
  restoreVersion(versionId){const version=this.document.versions.find(item=>item.id===versionId);if(!version?.snapshot)return {ok:false};const snap=clone(version.snapshot);Object.assign(this.document,snap);this.#touch('Versão restaurada',version.label);return {ok:true}}
}
