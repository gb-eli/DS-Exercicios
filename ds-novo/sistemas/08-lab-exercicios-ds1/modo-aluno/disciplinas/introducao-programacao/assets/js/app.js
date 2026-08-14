const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const ROLE = document.body.dataset.role || "aluno";
const DISCIPLINE_ID = window.APP_CONFIG?.disciplineId || "introducao-programacao";
let current = 0;
let activeFile = "";
let step = 0;
let pythonWorker = null;
let state = freshState();
let saveTimer = null;
let pendingSave = null;
let storageWarningShown = false;
let helpIssue = null;
let helpOpener = null;
let previewRunId = 0;
let previewRunHadError = false;
const ex = () => EXERCICIOS[current];

function freshState() {
  return { files: {}, validated: false, completed: false, completedAt: null, percentage: 0, lastRunSuccess: false, hasRun: false, localConfirmed: false, supportUsed: [], supportHistory: [], supportUndo: null, understood: {}, runCount: 0, validationAttempts: 0, behaviorScenarios: {}, runtimeProblems: [], needsReview: false, projectRoot: "", filePaths: {}, extraFiles: {}, folders: [], previewStorage: {}, ui: { terminalCollapsed: false, previewCollapsed: false, problemsCollapsed: false } };
}
function currentUserId() { return window.AppAuth?.currentUser?.()?.id || "guest"; }
function stateKey() { return `ds1_disc_${DISCIPLINE_ID}_${ROLE}_${currentUserId()}_ex_${ex().numero}_state_v1`; }
function legacyStateKeys() { return [
  `ds1_80_${ROLE}_${currentUserId()}_ex_${ex().numero}_state_v3`,
  `ds1_80_${ROLE}_${currentUserId()}_ex_${ex().numero}_state_v2`
]; }
function esc(value) { return String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;"); }
function languageForFile(name = activeFile) {
  const ext = name.split(".").pop()?.toLowerCase();
  return ({ py:"python", html:"html", css:"css", js:"javascript", c:"c", cpp:"cpp", cs:"csharp", java:"java", md:"markdown", txt:"text" })[ext] || ex().linguagem;
}
function codeHash(code) { let hash = 2166136261; for (const char of code) { hash ^= char.charCodeAt(0); hash = Math.imul(hash, 16777619); } return (hash >>> 0).toString(16); }
function storageGet(key) { if(window.DSCore?.storage)return window.DSCore.storage.get(key,showStorageFailure); try { return localStorage.getItem(key); } catch { showStorageFailure(); return null; } }
function storageSet(key, value) { if(window.DSCore?.storage)return window.DSCore.storage.set(key,value,showStorageFailure); try { localStorage.setItem(key, value); return true; } catch { showStorageFailure(); return false; } }
function storageRemove(key) { if(window.DSCore?.storage)return window.DSCore.storage.remove(key,showStorageFailure); try { localStorage.removeItem(key); return true; } catch { showStorageFailure(); return false; } }
function showStorageFailure() { if (storageWarningShown) return; storageWarningShown = true; window.AppShell?.showStorageWarning(); }
function persistSnapshot(key, payload) { if (storageSet(key, payload)) window.AppAuth?.log("progresso_salvo", { numero: ex().numero, percentage: state.percentage }); }
function saveState({ immediate = false } = {}) {
  const snapshot = { key: stateKey(), payload: JSON.stringify(state) };
  if (immediate) { if (saveTimer) clearTimeout(saveTimer); saveTimer = null; pendingSave = null; persistSnapshot(snapshot.key, snapshot.payload); return; }
  pendingSave = snapshot;
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(flushSave, 350);
}
function flushSave() {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = null;
  const snapshot = pendingSave;
  pendingSave = null;
  if (snapshot) persistSnapshot(snapshot.key, snapshot.payload);
}
function githubKey() { return `ds1_disc_${DISCIPLINE_ID}_${ROLE}_${currentUserId()}_github_v1`; }
function legacyGithubKey() { return `ds1_${ROLE}_${currentUserId()}_github_v2`; }
function normalizeGithubUrl(value, allowHome = false) {
  let raw = String(value || "").trim();
  if (/^(www\.)?github\.com\//i.test(raw)) raw = `https://${raw}`;
  const url = new URL(raw);
  if (url.protocol !== "https:" || !/^(www\.)?github\.com$/i.test(url.hostname)) throw new Error("dominio");
  const parts = url.pathname.split("/").filter(Boolean);
  if (!allowHome && parts.length < 2) throw new Error("repositorio");
  url.protocol = "https:"; url.username = ""; url.password = ""; url.hash = "";
  return url.href;
}
function savedGithubUrl() {
  const own = storageGet(githubKey());
  if (own) { try { return normalizeGithubUrl(own); } catch {} }
  // Migração segura da v1.8.x/v1.9.0: esta chave já era individual por usuário
  // e pertencia exclusivamente a Introdução à Programação. Copiamos sem apagar.
  const legacyOwn = storageGet(legacyGithubKey());
  if (legacyOwn) {
    try { const normalized = normalizeGithubUrl(legacyOwn); storageSet(githubKey(), normalized); return normalized; } catch {}
  }
  // A chave muito antiga era global e poderia compartilhar o repositório entre alunos.
  // Ela continua sendo removida sem atribuição automática.
  if (storageGet("ds1GithubUrl")) storageRemove("ds1GithubUrl");
  return APP_CONFIG.githubDefault;
}
function configureGithub() {
  const value = prompt("URL do repositório GitHub:", savedGithubUrl());
  if (!value) return;
  try { const normalized = normalizeGithubUrl(value); storageSet(githubKey(), normalized); window.AppShell?.toast("Repositório salvo somente para este usuário.", "success"); }
  catch { alert("Informe uma URL de repositório no formato https://github.com/usuario/repositorio."); }
}
function openExternal(value, fallback, allowHome = false) {
  try { const url = allowHome ? new URL(value || fallback) : normalizeGithubUrl(value || fallback, allowHome); if (url.protocol !== "https:") throw new Error(); window.open(url.href, "_blank", "noopener,noreferrer"); }
  catch { window.AppShell?.toast("O link informado não é seguro ou válido.", "danger"); }
}


const ENV_HELP = {
  Python: `<h2>Python e VS Code</h2><p>Baixe o instalador no site oficial do Python: <a href="https://www.python.org/downloads/" target="_blank" rel="noopener noreferrer">python.org/downloads</a>. Durante a instalação no Windows, habilite a inclusão do Python no PATH.</p><pre>python --version\npy --version\npython -m pip --version</pre><p>Para usar uma versão mais nova do Python, instale a nova versão pelo site oficial e selecione o interpretador correspondente no VS Code. O comando abaixo atualiza apenas o instalador de pacotes:</p><pre>python -m pip install --upgrade pip</pre><p>Ambiente virtual:</p><pre>python -m venv .venv\n.venv\\Scripts\\activate</pre>`,
  HTML: `<h2>Ambiente Web</h2><p>Use o VS Code e um navegador atualizado. HTML não precisa de instalação adicional: salve <code>index.html</code> e abra pelo navegador ou por um servidor local.</p>`,
  CSS: `<h2>Ambiente Web</h2><p>Crie <code>style.css</code> na mesma pasta e ligue-o ao HTML com <code>&lt;link rel="stylesheet" href="style.css"&gt;</code>.</p>`,
  JavaScript: `<h2>JavaScript no navegador</h2><p>Crie <code>script.js</code> e ligue-o antes do fechamento do corpo. Use as Ferramentas do Desenvolvedor do navegador para ler o console e os erros.</p>`,
  C: `<h2>Compilador C</h2><p>Instale uma distribuição GCC compatível com seu sistema e confirme o comando:</p><pre>gcc --version</pre><p>Compilação recomendada:</p><pre>gcc -std=c11 -Wall -Wextra -pedantic main.c -o programa</pre>`,
  "C++": `<h2>Compilador C++</h2><p>Confirme o G++:</p><pre>g++ --version</pre><p>Compilação recomendada:</p><pre>g++ -std=c++17 -Wall -Wextra -pedantic main.cpp -o programa</pre>`,
  "C#": `<h2>.NET SDK</h2><p>Use a página oficial: <a href="https://dotnet.microsoft.com/download" target="_blank" rel="noopener noreferrer">dotnet.microsoft.com/download</a>.</p><pre>dotnet --version\ndotnet --list-sdks\ndotnet restore\ndotnet run</pre>`,
  Java: `<h2>JDK</h2><p>Instale um JDK e confirme que os dois comandos estão disponíveis:</p><pre>java --version\njavac --version</pre><p>Compilar e executar:</p><pre>javac Main.java\njava Main</pre>`
};

const TOKEN_HELP = {
  if:"Inicia uma condição: o bloco indentado ou entre chaves executa quando a expressão é verdadeira.",
  elif:"Testa outra condição em Python quando o if anterior foi falso.",
  else:"Define o caminho alternativo quando as condições anteriores são falsas.",
  for:"Repete um bloco para cada item ou valor de uma sequência.",
  while:"Repete um bloco enquanto a condição permanecer verdadeira.",
  def:"Declara uma função em Python.",
  return:"Devolve um resultado para o ponto onde a função foi chamada.",
  import:"Carrega um módulo ou biblioteca.",
  class:"Declara uma classe, que funciona como modelo para objetos.",
  try:"Inicia um bloco que pode gerar um erro tratável.",
  catch:"Captura uma exceção em C#, Java ou JavaScript.",
  except:"Captura uma exceção em Python.",
  const:"Declara uma referência que não pode ser reatribuída em JavaScript.",
  let:"Declara uma variável de escopo de bloco em JavaScript.",
  public:"Permite acesso ao membro fora da classe.",
  private:"Restringe o acesso ao interior da classe.",
  static:"Associa o membro à classe, não a uma instância específica.",
  void:"Indica que uma função ou método não devolve valor.",
  int:"Tipo usado para números inteiros.",
  float:"Tipo usado para números decimais de precisão simples.",
  double:"Tipo usado para números decimais com maior precisão.",
  bool:"Tipo lógico: verdadeiro ou falso.",
  break:"Interrompe o laço ou encerra um case.",
  continue:"Pula para a próxima repetição do laço."
};


let codeEditor = null;
let selectedEntry = { kind: "root", path: "" };
let terminalAwaitingInput = false;

function ensureProjectState() {
  state.projectRoot = cleanName(state.projectRoot || ex().pasta, ex().pasta);
  state.filePaths = state.filePaths && typeof state.filePaths === "object" ? state.filePaths : {};
  state.extraFiles = state.extraFiles && typeof state.extraFiles === "object" ? state.extraFiles : {};
  state.folders = Array.isArray(state.folders) ? state.folders : [];
  state.previewStorage = state.previewStorage && typeof state.previewStorage === "object" ? state.previewStorage : {};
  state.ui = state.ui && typeof state.ui === "object" ? state.ui : {};
  state.ui.terminalCollapsed = Boolean(state.ui.terminalCollapsed);
  state.ui.previewCollapsed = Boolean(state.ui.previewCollapsed);
  state.completed = Boolean(state.completed);
  for (const name of allExerciseFiles()) if (!state.filePaths[name]) state.filePaths[name] = name;
  const cleanFolders = new Set();
  for (const folder of state.folders) { const value=cleanPath(folder); if(value) cleanFolders.add(value); }
  for (const path of [...Object.values(state.filePaths), ...Object.keys(state.extraFiles)]) {
    const parts=cleanPath(path).split("/").filter(Boolean); parts.pop(); let at="";
    for(const part of parts){at=at?`${at}/${part}`:part;cleanFolders.add(at);}
  }
  state.folders=[...cleanFolders].sort();
}
function cleanName(value, fallback="item") {
  let text=String(value||"").trim().replace(/[\/:*?"<>|\x00-\x1F]/g,"-").replace(/[. ]+$/g,"").slice(0,80);
  if (!text || /^\.+$/.test(text)) text = String(fallback || "item");
  const stem=(text.split(".")[0]||"").toUpperCase();
  if (/^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/.test(stem)) text=`${text}-`;
  return text || "item";
}
function cleanPath(value) { return String(value||"").split("/").map(part=>cleanName(part,"")).filter(Boolean).join("/"); }
function projectEntryConflict(path, exceptPath="") {
  ensureProjectState();
  const target=cleanPath(path), except=cleanPath(exceptPath);
  if (!target || target===except) return false;
  const files=[...Object.values(state.filePaths||{}),...Object.keys(state.extraFiles||{})];
  const norm=value=>String(value||"").toLocaleLowerCase("en-US");const targetKey=norm(target),exceptKey=norm(except);
  return files.some(item=>norm(item)===targetKey && norm(item)!==exceptKey) || (state.folders||[]).some(item=>norm(item)===targetKey && norm(item)!==exceptKey);
}
function pathForCanonical(name){ ensureProjectState(); return state.filePaths[name] || name; }
function canonicalForPath(path){ ensureProjectState(); return Object.keys(state.filePaths).find(name=>state.filePaths[name]===path) || null; }
function getFileContent(path){ const canonical=canonicalForPath(path); return canonical ? (state.files[canonical] ?? "") : (state.extraFiles[path] ?? ""); }
function setFileContent(path,value){ const canonical=canonicalForPath(path); if(canonical) state.files[canonical]=String(value??""); else state.extraFiles[path]=String(value??""); }
function projectFilePaths(){ ensureProjectState(); return [...Object.values(state.filePaths), ...Object.keys(state.extraFiles)].sort((a,b)=>a.localeCompare(b,"pt-BR")); }
function parentPath(path){ const parts=String(path||"").split("/");parts.pop();return parts.join("/"); }
function basename(path){ return String(path||"").split("/").pop()||""; }
function extension(path){ const name=basename(path); const at=name.lastIndexOf("."); return at>0?name.slice(at).toLowerCase():""; }
function projectRoot(){ ensureProjectState(); return state.projectRoot || ex().pasta; }
function markEdited(){ const hadCompletion=state.completed||state.validated; state.validated=false;state.completed=false;state.completedAt=null;state.lastRunSuccess=false;state.localConfirmed=false;state.behaviorScenarios={};state.needsReview=Boolean(hadCompletion);const c=$("#localExecutionConfirm");if(c)c.checked=false; renderExperiencePanels(); }
function modeForPath(path){
  const ext=extension(path);
  return ({".py":"python",".html":"htmlmixed",".htm":"htmlmixed",".css":"css",".js":"javascript",".mjs":"javascript",".json":{name:"javascript",json:true},".c":"text/x-csrc",".cpp":"text/x-c++src",".cc":"text/x-c++src",".cs":"text/x-csharp",".java":"text/x-java",".md":"markdown"})[ext] || null;
}
function manualTypingToast(kind="paste"){
  const message=kind==="reference"
    ? "A referência é somente para leitura. Observe e digite o código manualmente no editor."
    : "Colagem desativada. Digite o código manualmente olhando a referência.";
  window.AppShell?.toast(message,"warning");
}
function blockStudentPaste(event){
  event?.preventDefault?.(); event?.stopPropagation?.();
  manualTypingToast("paste");
  window.AppAuth?.log("colagem_bloqueada",{numero:ex().numero,arquivo:activeFile});
  return false;
}
function protectManualTypingSurface(){
  if(!codeEditor)return;
  const wrapper=codeEditor.getWrapperElement?.();
  const input=codeEditor.getInputField?.();
  const targets=[wrapper,input].filter(Boolean);
  for(const target of targets){
    if(target.dataset.manualTypingProtected==="1")continue;
    target.dataset.manualTypingProtected="1";
    target.addEventListener("paste",blockStudentPaste,true);
    target.addEventListener("drop",event=>{
      const hasText=Boolean(event.dataTransfer?.types && [...event.dataTransfer.types].some(type=>type==="text/plain"||type==="text"));
      if(hasText)blockStudentPaste(event);
    },true);
    target.addEventListener("beforeinput",event=>{
      if(["insertFromPaste","insertFromPasteAsQuotation","insertFromDrop","insertReplacementText"].includes(event.inputType))blockStudentPaste(event);
    },true);
    target.addEventListener("contextmenu",event=>{
      event.preventDefault();
      window.AppShell?.toast("Menu de contexto desativado no editor para impedir colagem. Use apenas digitação manual.","warning");
    });
  }
}
function protectReferenceReading(){
  const nodes=["referenceCode","tutorialCode","helpReferenceCode"].map(id=>document.getElementById(id)).filter(Boolean);
  const block=event=>{
    event.preventDefault(); event.stopPropagation();
    manualTypingToast("reference");
    window.AppAuth?.log("copia_referencia_bloqueada",{numero:ex().numero,arquivo:activeFile});
    return false;
  };
  for(const node of nodes){
    if(node.dataset.referenceProtected==="1")continue;
    node.dataset.referenceProtected="1";
    node.addEventListener("copy",block,true);
    node.addEventListener("cut",block,true);
    node.addEventListener("contextmenu",block,true);
    node.addEventListener("dragstart",block,true);
  }
}
function initCodeEditor(){
  const area=$("#editor"); if(!area||codeEditor||!window.CodeMirror)return;
  codeEditor=CodeMirror.fromTextArea(area,{lineNumbers:true,mode:modeForPath(activeFile),theme:"ds-vscode",indentUnit:4,tabSize:4,indentWithTabs:false,lineWrapping:false,inputStyle:"textarea",viewportMargin:20,screenReaderLabel:"Editor de código",extraKeys:{
    Tab(cm){if(cm.somethingSelected())cm.indentSelection("add");else cm.replaceSelection("    ","end");},
    "Shift-Tab"(cm){cm.indentSelection("subtract");},
    "Ctrl-V"(){manualTypingToast("paste");window.AppAuth?.log("colagem_bloqueada",{numero:ex().numero,arquivo:activeFile});return true;},
    "Cmd-V"(){manualTypingToast("paste");window.AppAuth?.log("colagem_bloqueada",{numero:ex().numero,arquivo:activeFile});return true;},
    "Shift-Ctrl-V"(){manualTypingToast("paste");return true;},
    "Shift-Cmd-V"(){manualTypingToast("paste");return true;},
    "Shift-Insert"(){manualTypingToast("paste");return true;}
  }});
  codeEditor.setSize("100%","100%");
  codeEditor.on("change",()=>{ if(codeEditor._rendering)return; setFileContent(activeFile,codeEditor.getValue()); markEdited(); updateEditorVisual();renderProgress();saveState(); });
  codeEditor.on("focus",()=>{selectedEntry={kind:"file",path:activeFile};renderProjectTree();});
  updateEditorAccessibility();
  protectManualTypingSurface();
  protectReferenceReading();
}
function updateEditorAccessibility(){
  if(!codeEditor)return;
  const label=`Editor de código: ${activeFile || "arquivo do exercício"}`;
  codeEditor.setOption("screenReaderLabel",label);
  const input=codeEditor.getInputField?.();
  if(input){input.setAttribute("aria-label",label);input.setAttribute("spellcheck","false");input.setAttribute("autocomplete","off");input.setAttribute("autocorrect","off");input.removeAttribute("autocapitalize");input.style.textTransform="none";}
}
function editorValue(){ return codeEditor ? codeEditor.getValue() : ($("#editor")?.value ?? getFileContent(activeFile)); }
function setEditorValue(value){ const text=String(value??""); if(codeEditor){codeEditor._rendering=true;codeEditor.setValue(text);codeEditor.setOption("mode",modeForPath(activeFile));codeEditor._rendering=false;codeEditor.refresh();}else if($("#editor"))$("#editor").value=text; }

function renderProjectTree(){
  ensureProjectState(); const tree=$("#projectTree"); if(!tree)return;
  $("#projectRootLabel").textContent=projectRoot(); $("#recommendedFolder").textContent=ex().pasta;
  const folderSet=new Set(state.folders);
  for(const path of projectFilePaths()){let p=parentPath(path);while(p){folderSet.add(p);p=parentPath(p);}}
  const entries=[...folderSet].map(path=>({kind:"folder",path})).concat(projectFilePaths().map(path=>({kind:"file",path}))).sort((a,b)=>a.path.localeCompare(b.path,"pt-BR")||(a.kind==="folder"?-1:1));
  const rootSelected=selectedEntry.kind==="root";
  let html=`<button type="button" class="tree-entry tree-root ${rootSelected?"selected":""}" data-entry-kind="root" data-entry-path="" role="treeitem" aria-level="1" aria-selected="${rootSelected}" tabindex="${rootSelected?0:-1}"><span class="tree-badge">PROJ</span><span>${esc(projectRoot())}</span></button>`;
  html+=entries.map(item=>{const depth=item.path.split("/").length;const selected=selectedEntry.kind===item.kind&&selectedEntry.path===item.path;const label=basename(item.path);const badge=item.kind==="folder"?"DIR":(extension(label).slice(1).toUpperCase()||"FILE");return `<button type="button" class="tree-entry ${selected?"selected":""}" style="--tree-depth:${depth}" data-entry-kind="${item.kind}" data-entry-path="${esc(item.path)}" role="treeitem" aria-level="${depth+1}" aria-selected="${selected}" tabindex="${selected?0:-1}"><span class="tree-badge">${esc(badge)}</span><span>${esc(label)}</span></button>`;}).join("");
  tree.innerHTML=html;
  tree.querySelectorAll('[data-entry-kind]').forEach(button=>button.onclick=()=>{selectedEntry={kind:button.dataset.entryKind,path:button.dataset.entryPath||""};if(selectedEntry.kind==="file"){syncEditor();activeFile=selectedEntry.path;renderPractice();renderTabs();}else renderProjectTree();});
}
function targetFolderForCreate(){ if(selectedEntry.kind==="folder")return selectedEntry.path;if(selectedEntry.kind==="file")return parentPath(selectedEntry.path);return ""; }
function createFile(){ const parent=targetFolderForCreate(); const raw=prompt("Nome do novo arquivo:","novo-arquivo.py"); if(!raw)return; const name=cleanName(raw,"novo-arquivo.py");const path=cleanPath(parent?`${parent}/${name}`:name);if(projectEntryConflict(path)){alert("Já existe um arquivo ou pasta com esse nome nesse local.");return;}state.extraFiles[path]="";selectedEntry={kind:"file",path};activeFile=path;markEdited();ensureProjectState();renderPractice();renderTabs();saveState({immediate:true});window.AppAuth?.log("arquivo_criado",{numero:ex().numero,path}); }
function createFolder(){ const parent=targetFolderForCreate();const raw=prompt("Nome da nova pasta:","src");if(!raw)return;const name=cleanName(raw,"pasta");const path=cleanPath(parent?`${parent}/${name}`:name);if(projectEntryConflict(path)){alert("Já existe um arquivo ou pasta com esse nome nesse local.");return;}state.folders.push(path);state.folders=[...new Set(state.folders)].sort();selectedEntry={kind:"folder",path};renderProjectTree();saveState({immediate:true});window.AppAuth?.log("pasta_criada",{numero:ex().numero,path}); }
function renameSelected(){
  ensureProjectState();
  if(selectedEntry.kind==="root"){
    const raw=prompt("Nome da pasta principal no ZIP:",projectRoot());if(!raw)return;state.projectRoot=cleanName(raw,ex().pasta);renderProjectTree();if($("#completeFolder"))$("#completeFolder").textContent=projectRoot();saveState({immediate:true});return;
  }
  const oldPath=selectedEntry.path;if(!oldPath)return;const oldName=basename(oldPath);const raw=prompt(selectedEntry.kind==="folder"?"Novo nome da pasta:":"Novo nome do arquivo:",oldName);if(!raw)return;const newName=cleanName(raw,oldName);const base=parentPath(oldPath);const newPath=cleanPath(base?`${base}/${newName}`:newName);if(oldPath===newPath)return;
  if(selectedEntry.kind==="file"){
    const canonical=canonicalForPath(oldPath);if(canonical&&extension(newPath)!==extension(oldPath)){alert("Para preservar a linguagem deste exercício, mantenha a extensão do arquivo.");return;}
    if(projectEntryConflict(newPath,oldPath)){alert("Já existe um arquivo ou pasta com esse nome nesse local.");return;}
    if(canonical)state.filePaths[canonical]=newPath;else{state.extraFiles[newPath]=state.extraFiles[oldPath]??"";delete state.extraFiles[oldPath];}
    if(activeFile===oldPath)activeFile=newPath;selectedEntry={kind:"file",path:newPath};
  }else{
    if(projectEntryConflict(newPath,oldPath)){alert("Já existe um arquivo ou pasta com esse nome nesse local.");return;}
    const move=path=>path===oldPath||path.startsWith(oldPath+"/")?newPath+path.slice(oldPath.length):path;
    state.folders=state.folders.map(move);
    for(const canonical of Object.keys(state.filePaths))state.filePaths[canonical]=move(state.filePaths[canonical]);
    const extras={};for(const [path,content] of Object.entries(state.extraFiles))extras[move(path)]=content;state.extraFiles=extras;
    activeFile=move(activeFile);selectedEntry={kind:"folder",path:newPath};
  }
  markEdited();ensureProjectState();renderSummary();renderPractice();renderTabs();saveState({immediate:true});window.AppAuth?.log("item_renomeado",{numero:ex().numero,oldPath,newPath});
}
function activeCanonical(){return canonicalForPath(activeFile);}
function referenceForActive(){const canonical=activeCanonical();return canonical?(ex().arquivos[canonical]||""):"";}
function activeIsSupplied(){const canonical=activeCanonical();return canonical&&(ex().arquivosFornecidos||[]).includes(canonical);}
function activeBase(){const canonical=activeCanonical();return canonical?ex().codigoBase?.[canonical]:null;}
function executableCanonical(){return ex().arquivoPrincipal;}
function executablePath(){return pathForCanonical(executableCanonical());}
function executableCode(){return state.files[executableCanonical()]||"";}
function currentProjectFiles(){ const result={}; for(const canonical of allExerciseFiles())result[pathForCanonical(canonical)]=state.files[canonical]||"";for(const [path,content] of Object.entries(state.extraFiles||{}))result[path]=content;return result; }
function runtimeCommand(){ if(ex().runtime==="python"){const path=executablePath();const safe=String(path).replace(/"/g,'\\"');return `python ${/\s/.test(path)?`"${safe}"`:safe}`;}return ex().comando; }

function loadState() {
  try {
    let raw = storageGet(stateKey());
    let migratedFrom = null;
    if (!raw) {
      for (const legacyKey of legacyStateKeys()) {
        const legacyRaw = storageGet(legacyKey);
        if (legacyRaw) { raw = legacyRaw; migratedFrom = legacyKey; break; }
      }
    }
    state = { ...freshState(), ...(JSON.parse(raw) || {}) };
    if (migratedFrom && raw) {
      storageSet(stateKey(), raw);
      window.AppAuth?.log("progresso_migrado_disciplina", { numero: ex().numero, disciplineId: DISCIPLINE_ID, from: migratedFrom, to: stateKey() });
    }
  } catch { state = freshState(); }
  for (const name of Object.keys(ex().arquivos)) {
    if (name === "README.md") continue;
    if (typeof state.files[name] !== "string") state.files[name] = (ex().arquivosFornecidos || []).includes(name) ? ex().arquivos[name] : "";
  }
  ensureProjectState();
  activeFile = pathForCanonical(ex().arquivoPrincipal);
  selectedEntry = { kind: "file", path: activeFile };
}

function highlightCode(code, language) {
  if (language === "html") return esc(code).replace(/(&lt;\/?)([\w-]+)/g, '$1<span class="tok-tag" data-token="$2">$2</span>');
  const keywords = /\b(if|else|elif|for|while|def|return|import|from|class|public|private|protected|static|void|int|float|double|bool|boolean|string|String|new|try|catch|except|switch|case|break|continue|const|let|function|true|false|True|False|struct|typedef|do|foreach)\b/g;
  const tokenPattern = /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|#[^\n]*|\/\/[^\n]*)/g;
  return String(code ?? "").split(tokenPattern).map(part => {
    if (!part) return "";
    if (part.startsWith("#") || part.startsWith("//")) return `<span class="tok-comment">${esc(part)}</span>`;
    if (part.startsWith('"') || part.startsWith("'")) return `<span class="tok-string">${esc(part)}</span>`;
    return esc(part).replace(keywords, token => `<span class="tok-keyword" data-token="${token}">${token}</span>`);
  }).join("");
}
function codeLines(code, range) {
  const lang = languageForFile(activeFile);
  return String(code).split("\n").map((line,index) => {
    const number=index+1, selected=range && number>=range[0] && number<=range[1];
    return `<div class="code-line ${selected ? "highlight" : ""}" data-line-number="${number}" tabindex="0" title="Clique para explicar a linha ${number}"><code>${highlightCode(line,lang)||" "}</code></div>`;
  }).join("");
}


const PYTHON_BEHAVIOR = {
  3:{blocking:true,scenarios:[{id:'liberado',label:'Idade suficiente',terms:['acesso à oficina foi liberado','idade mínima exigida']},{id:'nao-liberado',label:'Idade abaixo do mínimo',terms:['acesso ainda não foi liberado','faltam']}]},
  4:{blocking:true,scenarios:[{id:'aprovado',label:'Situação Aprovado',terms:['Situação: Aprovado']},{id:'recuperacao',label:'Situação Recuperação',terms:['Situação: Recuperação']},{id:'reprovado',label:'Situação Reprovado',terms:['Situação: Reprovado']}]},
  5:{blocking:false,scenarios:[{id:'aprovado',label:'Aprovado',terms:['Situação: Aprovado']},{id:'recuperacao',label:'Recuperação',terms:['Situação: Recuperação']},{id:'nao-aprovado',label:'Não aprovado',terms:['Situação: Não aprovado']},{id:'invalidos',label:'Dados inválidos',terms:['Situação: Dados inválidos']}]},
  6:{blocking:false,scenarios:[{id:'intervalo',label:'Intervalo válido',terms:['--- TABUADA DO']},{id:'invalido',label:'Intervalo inválido',terms:['Intervalo inválido']}]},
  7:{blocking:false,scenarios:[{id:'resumo',label:'Resumo da turma',terms:['--- RESUMO DA TURMA ---','Aprovados:','Recuperação:','Reprovados:']},{id:'invalido',label:'Quantidade inválida',terms:['Quantidade inválida']}]},
  8:{blocking:true,scenarios:[{id:'liberado',label:'Acesso liberado',terms:['Acesso liberado!']},{id:'bloqueado',label:'Limite atingido',terms:['Acesso bloqueado: limite de tentativas atingido']}]}
};
function behaviorConfig(){return PYTHON_BEHAVIOR[Number(ex().numero)]||null;}
function observeBehavior(output=''){const cfg=behaviorConfig();if(!cfg)return;state.behaviorScenarios=state.behaviorScenarios||{};const text=String(output);for(const scenario of cfg.scenarios){if((scenario.terms||[]).every(term=>text.toLocaleLowerCase('pt-BR').includes(String(term).toLocaleLowerCase('pt-BR'))))state.behaviorScenarios[scenario.id]={at:new Date().toISOString()};}}
function behaviorStatus(){const cfg=behaviorConfig();if(!cfg)return {configured:false,blocking:false,total:0,done:0,missing:[]};const done=cfg.scenarios.filter(x=>state.behaviorScenarios?.[x.id]).length;return {configured:true,blocking:Boolean(cfg.blocking),total:cfg.scenarios.length,done,missing:cfg.scenarios.filter(x=>!state.behaviorScenarios?.[x.id])};}
function currentStepKey(){return `${ex().numero}:${step}`;}
function markUnderstood(){state.understood=state.understood||{};state.understood[currentStepKey()]={at:new Date().toISOString()};saveState();renderTutorial();renderSupportStatus();window.AppAuth?.log('etapa_compreendida',{numero:ex().numero,step:step+1});}
function supportAllowed(){if(ROLE==='professor')return true;if(Number(ex().numero)<=3)return Boolean(state.understood?.[currentStepKey()]);return Number(state.validationAttempts||0)>=2||Number(state.runCount||0)>=3;}
function currentStepBlock(){const item=ex().passos[step]||ex().passos[0];const lines=String(ex().arquivos[item.arquivo]||'').split('\n');return {item,code:lines.slice(Math.max(0,item.linhas[0]-1),Math.max(item.linhas[0],item.linhas[1])).join('\n')};}
function completeCurrentStep(){manualTypingToast("paste");window.AppAuth?.log("preenchimento_automatico_bloqueado",{numero:ex().numero,step:step+1});return;/* v1.8.6: bloqueado no Aluno */const {item,code}=currentStepBlock();if(!supportAllowed()){window.AppShell?.toast(Number(ex().numero)<=3?'Marque “Já entendi esta parte” antes de usar o apoio.':'Faça pelo menos 3 execuções ou 2 tentativas de validação antes de liberar este apoio.','warning');return;}const target=pathForCanonical(item.arquivo);if(activeFile!==target){syncEditor();activeFile=target;selectedEntry={kind:'file',path:target};renderPractice();renderTabs();}const before=editorValue();if(codeEditor){const cursor=codeEditor.getCursor();codeEditor.replaceRange(`${code}${code.endsWith('\n')?'':'\n'}`,cursor);}else setFileContent(activeFile,before+code+'\n');state.supportUndo={file:activeFile,before};state.supportHistory=Array.isArray(state.supportHistory)?state.supportHistory:[];state.supportHistory.push({at:new Date().toISOString(),exercise:ex().numero,step:step+1,file:item.arquivo,lines:item.linhas,origin:'apoio-progressivo'});state.supportUsed=[...new Set([...(state.supportUsed||[]),`etapa:${item.arquivo}:${item.linhas[0]}-${item.linhas[1]}`])];markEdited();saveState({immediate:true});renderSupportStatus();window.AppAuth?.log('apoio_progressivo_usado',{numero:ex().numero,step:step+1,file:item.arquivo});}
function undoSupport(){if(!state.supportUndo)return;const item=state.supportUndo;const path=item.file;if(activeFile!==path){syncEditor();activeFile=path;}setFileContent(path,item.before);setEditorValue(item.before);state.supportUndo=null;markEdited();saveState({immediate:true});renderSupportStatus();window.AppAuth?.log('apoio_progressivo_desfeito',{numero:ex().numero});}
function renderSupportStatus(){const panel=$('#supportStatusPanel');if(!panel)return;panel.innerHTML=`<div><span class="chip info">Apoio manual</span><strong>Sem preenchimento automático</strong></div><p>Consulte o tutorial, as explicações e a referência. O código deve ser digitado manualmente no editor do aluno.</p><div class="support-meta"><span>${state.runCount||0} execução(ões)</span><span>${state.validationAttempts||0} tentativa(s) de validação</span></div>`;}
function renderBehaviorScenarios(){const panel=$('#behaviorScenarioPanel');if(!panel)return;const cfg=behaviorConfig();if(!cfg){panel.hidden=true;return;}panel.hidden=false;const st=behaviorStatus();panel.innerHTML=`<div class="behavior-head"><div><span class="chip info">Cenários de teste</span><strong>${st.done}/${st.total} testados</strong></div><span class="chip ${st.done===st.total?'success':cfg.blocking?'warning':'info'}">${cfg.blocking?'obrigatórios':'recomendados'}</span></div><p class="behavior-note">Execute o programa com entradas diferentes. Cada resultado reconhecido fica registrado até o código ser alterado.</p><div class="behavior-list">${cfg.scenarios.map(x=>`<div class="behavior-item ${state.behaviorScenarios?.[x.id]?'done':''}"><span>${state.behaviorScenarios?.[x.id]?'✓':'○'}</span><strong>${esc(x.label)}</strong></div>`).join('')}</div>`;}
function codeHealth(){const pct=progress();if(!pct)return {state:'empty',label:'Ainda não começou',message:'Comece a digitar para acompanhar o avanço.',pct:0};if(state.validated)return {state:'correct',label:'Validado',message:'Código, execução e critérios foram conferidos.',pct:100};if(pct>=100)return {state:'correct',label:'Pronto para validar',message:'Os critérios automáticos chegaram a 100%. Clique em Validar agora.',pct:100};if(pct>=80)return {state:'near',label:'Quase completo',message:'Confira os checkpoints pendentes antes de validar.',pct};return {state:'building',label:'Em construção',message:'Continue digitando e execute para conferir o comportamento.',pct};}
function renderCodeHealth(){const box=$('#codeHealth');if(!box)return;const health=codeHealth();box.dataset.state=health.state;$('#codeHealthStatus').textContent=health.label;$('#codeHealthPercent').textContent=`${health.pct}%`;$('#codeHealthBar').style.width=`${health.pct}%`;$('#codeHealthMessage').textContent=health.message;$('#codeHealthRemaining').textContent=health.pct>=100?'Pronto para validar':health.pct?`Restam cerca de ${Math.max(0,100-health.pct)}%`:'Comece pelo primeiro trecho';}
function renderExecutionCheckpoints(){const box=$('#executionCheckpoints');if(!box)return;const currentHash=ex().runtime==='web'?projectSnapshotHash():codeHash(state.files[ex().arquivoPrincipal]||'');const populated=editableFiles().every(name=>String(state.files[name]||'').trim());const executed=Boolean(state.lastRunSuccess&&state.executedHash===currentHash);const behavior=behaviorStatus();const scenarioDone=!behavior.configured||behavior.done===behavior.total||!behavior.blocking;const items=[['Código',populated,'Arquivo obrigatório preenchido.'],['Execução',executed,'A versão atual executou sem erro.'],['Testes',scenarioDone,behavior.configured?`${behavior.done}/${behavior.total} cenário(s) reconhecido(s).`:'Sem cenário adicional obrigatório.'],['Validação',Boolean(state.validated),'Critérios pedagógicos conferidos.']];$('#checkpointSummary').textContent=`${items.filter(x=>x[1]).length}/4`;$('#checkpointList').innerHTML=items.map(([label,done,text])=>`<div class="checkpoint-item ${done?'done':'pending'}"><span class="checkpoint-icon">${done?'✓':'○'}</span><div><strong>${label}</strong><p>${text}</p></div></div>`).join('');}
function renderProblems(){const out=$('#runtimeProblemsOutput');if(!out)return;const list=Array.isArray(state.runtimeProblems)?state.runtimeProblems:[];out.innerHTML=list.length?list.slice(-8).map(item=>`<div class="problem-card"><strong>${esc(item.title||'Problema')}</strong><span>${esc(item.detail||'')}</span></div>`).join(''):'<p class="muted">Nenhum problema registrado na versão atual.</p>';}
function renderExperienceMeta(){
  const currentHash=ex().runtime==='web'?projectSnapshotHash():codeHash(state.files[ex().arquivoPrincipal]||'');
  const runtimeCurrent=Boolean(state.lastRunSuccess&&state.executedHash===currentHash);
  const runtime=$("#runtimeStatus");if(runtime){runtime.dataset.state=runtimeCurrent?'current':'stale';runtime.textContent=runtimeCurrent?'execução atual':'execução desatualizada';}
  const origin=$("#originStatus");if(origin){const used=Boolean((state.supportHistory||[]).length);origin.dataset.state=used?'support':'typed';origin.textContent=used?'apoio progressivo usado':'digitado pelo aluno';}
  const saveScope=$("#saveScopeStatus");if(saveScope){const user=window.AppAuth?.currentUser?.();saveScope.textContent=user?.username?`salvo para @${user.username}`:'progresso individual';}
}
function renderExperiencePanels(){renderSupportStatus();renderBehaviorScenarios();renderCodeHealth();renderExecutionCheckpoints();renderProblems();renderExperienceMeta();}

function renderSummary() {
  $("#exerciseTitle").textContent = ex().titulo;
  $("#exerciseModule").textContent = ex().modulo;
  $("#exerciseObjective").textContent = ex().objetivo;
  const n=Number(ex().numero)||1;
  const phase=n<=2?"Fundamentos":n<=5?"Decisões e validações":"Repetição e controle";
  $("#phaseBadge").textContent=`Exercício ${String(ex().numero).padStart(2,"0")}`;
  $("#phaseTitle").textContent=phase;
  $("#phaseText").textContent=n<=2?"Construa a base: entradas, valores, tipos e cálculos.":n<=5?"Aprenda a tomar decisões e combinar critérios com clareza.":"Automatize tarefas repetitivas e acompanhe o estado do programa.";
  $("#concepts").innerHTML = ex().conceitos.map(item => `<span class="chip">${esc(item)}</span>`).join("");
  $("#command").textContent = runtimeCommand();
}
function renderTabs() {
  const files = projectFilePaths();
  const basenameCounts=files.reduce((map,path)=>{const name=basename(path);map[name]=(map[name]||0)+1;return map;},{});
  $("#fileTabs").innerHTML = files.map(path => { const canonical=canonicalForPath(path), supplied=canonical&&(ex().arquivosFornecidos||[]).includes(canonical);const name=basename(path);const label=basenameCounts[name]>1?path:name;return `<button data-file="${esc(path)}" role="tab" aria-selected="${path===activeFile}" tabindex="${path===activeFile?0:-1}" class="${path===activeFile?"active":""} ${supplied?"base-file":""}" title="${esc(path)}${supplied?" - código-base fornecido pela plataforma":""}" aria-label="Abrir arquivo ${esc(path)}">${esc(label)}${supplied?" · base":""}</button>`; }).join("");
  $$('[data-file]').forEach(button => button.onclick = () => { syncEditor(); activeFile=button.dataset.file; selectedEntry={kind:"file",path:activeFile}; renderPractice(); renderTabs(); });
}
function renderTutorial() {
  const parts=ex().passos; step=Math.max(0,Math.min(step,parts.length-1)); const item=parts[step];
  $("#stepCounter").textContent=`Parte ${step+1} de ${parts.length}`;
  $("#stepTitle").textContent=item.titulo; $("#stepText").textContent=item.explicacao; $("#stepResult").textContent=item.resultado;
  activeFile=pathForCanonical(item.arquivo); selectedEntry={kind:"file",path:activeFile}; $("#tutorialCode").innerHTML=codeLines(ex().arquivos[item.arquivo]||"",item.linhas);
  $("#prevStep").disabled=step===0; $("#nextStep").textContent=step===parts.length-1?"Abrir prática":"Próxima parte"; if($("#alreadyUnderstood")){const done=Boolean(state.understood?.[currentStepKey()]);$("#alreadyUnderstood").textContent=done?"✓ Já entendi esta parte":"Já entendi esta parte";$("#alreadyUnderstood").classList.toggle("success",done);}
  $("#tutorialOutput").textContent=ex().runtime==="local"?`Comando local:\n${ex().comando}`:"Na prática, execute o seu próprio código e leia o resultado ou o erro.";
}
function renderReference() {
  const canonical=activeCanonical();
  $("#referenceName").textContent=canonical?`${basename(activeFile)} · referência`:`${basename(activeFile)} · arquivo criado pelo aluno`;
  $("#referenceCode").innerHTML=canonical?codeLines(ex().arquivos[canonical]||""):codeLines("// Este arquivo foi criado pelo aluno e não possui gabarito.","text");
  $("#referenceHint").textContent=canonical?"Somente leitura: observe, compreenda e digite manualmente no editor.":"Arquivo livre: use-o para organizar seu projeto.";
  protectReferenceReading();
}
function updateEditorVisual(){ if(codeEditor){codeEditor.setOption("mode",modeForPath(activeFile));updateEditorAccessibility(); if(helpIssue&&!$("#helpMode").hidden)updateHelpPanel();} }
function syncEditor() { if (!activeFile) return; setFileContent(activeFile,editorValue()); saveState(); }
function renderPractice() {
  ensureProjectState();initCodeEditor();renderProjectTree();renderReference();
  $("#editorName").textContent=activeIsSupplied()?`${activeFile} · base fornecida`:activeFile; setEditorValue(getFileContent(activeFile)); updateEditorAccessibility();
  const base=activeBase();
  $("#localConfirmWrap").hidden=ex().runtime!=="local"; $("#localExecutionConfirm").checked=Boolean(state.localConfirmed);
  $("#finishButton").disabled=!state.validated||state.completed; $("#finishButton").textContent=state.completed?"Atividade concluída":"Concluir atividade";
  if($("#completeFolder"))$("#completeFolder").textContent=projectRoot();
  renderProgress(); renderRuntime(); renderTabs(); renderExperiencePanels();
}
function allExerciseFiles() { return Object.keys(ex().arquivos).filter(name=>name!=="README.md"); }
function editableFiles() { return allExerciseFiles().filter(name=>!(ex().arquivosFornecidos||[]).includes(name)); }
function ruleMatches(item) {
  const code = state.files[item.arquivo] || "";
  const matches = (item.padroes || []).map(pattern => { try { return new RegExp(pattern, "is").test(code); } catch { return code.includes(pattern); } });
  if (item.modo === "todos") return matches.length > 0 && matches.every(Boolean);
  if (Number.isInteger(item.minimo)) return matches.filter(Boolean).length >= item.minimo;
  return matches.some(Boolean);
}
function progress() {
  const files=editableFiles();
  const populated=files.filter(name=>(state.files[name]||"").trim()).length/Math.max(1,files.length);
  const rules=ex().validacao.regras||[]; const matched=rules.filter(ruleMatches).length/Math.max(1,rules.length);
  const run=state.lastRunSuccess||state.localConfirmed?1:0;
  const behavior=behaviorStatus();
  const tests=!behavior.configured||!behavior.blocking||behavior.total===0?1:behavior.done/behavior.total;
  if (!populated) return 0;
  return Math.min(100,Math.round(populated*20+matched*50+run*20+tests*10));
}
function renderProgress() {
  const calculated=progress();
  state.percentage=(state.validated||state.completed)?100:calculated;
  const readyToValidate=!state.validated&&!state.completed&&state.percentage>=100;
  $("#progressPercent").textContent=`${state.percentage}%`; $("#progressBar").style.width=`${state.percentage}%`;
  $("#progressText").textContent=state.completed?"Atividade concluída":state.validated?"Validada - conclua a atividade":readyToValidate?"Código pronto - valide a atividade":state.percentage>=80?"Quase pronta":state.percentage?"Em desenvolvimento":"Ainda não começou";
  const validateButton=$("#validateButton");
  if(validateButton){
    validateButton.disabled=Boolean(state.validated||state.completed);
    validateButton.textContent=state.validated||state.completed?"Validado":readyToValidate?"Validar agora":"Validar";
    validateButton.classList.toggle("success",readyToValidate||state.validated||state.completed);
    validateButton.classList.toggle("secondary",!(readyToValidate||state.validated||state.completed));
  }
  if ($("#finishButton")) { $("#finishButton").disabled = !state.validated || state.completed; $("#finishButton").textContent=state.completed?"Atividade concluída":"Concluir atividade"; } renderExperiencePanels();
}
function setPanelCollapsed(panelId,bodyId,buttonId,collapsed){const panel=$(panelId),body=$(bodyId),button=$(buttonId);if(!panel||!body||!button)return;panel.classList.toggle("collapsed",collapsed);body.hidden=collapsed;button.setAttribute("aria-expanded",String(!collapsed));button.textContent=collapsed?"Expandir":"Minimizar";}
function setRuntimePanel(kind,collapsed,{persist=true}={}){const map={terminal:["#terminalPanel","#terminalBody","#toggleTerminal","terminalCollapsed"],preview:["#webPreviewShell","#previewBody","#togglePreview","previewCollapsed"]};const item=map[kind];if(!item)return;setPanelCollapsed(item[0],item[1],item[2],Boolean(collapsed));if(persist){state.ui=state.ui||{};state.ui[item[3]]=Boolean(collapsed);saveState();}}
function renderRuntime() {
  const web=ex().runtime==="web", python=ex().runtime==="python";
  $("#webPreviewShell").hidden=!web; $("#terminalPanel").hidden=false; $("#preparedInputs").hidden=!python;
  $("#runButton").textContent=web?"Atualizar preview":python?"Executar Python":"Mostrar comandos";
  $("#stopButton").hidden=!python; $("#terminalLabel").textContent=web?"Console do navegador":python?"Terminal Python":"Terminal / execução local";
  $("#terminalStatus").textContent=python?"Pyodide":web?"console":"VS Code";
  $("#runtimeNote").textContent=web?"O preview usa somente os arquivos escritos e conectados pelo aluno. Preview e console podem ser minimizados separadamente.":python?"O Python roda em Worker. Em navegadores com JSPI, input() solicita valores diretamente no terminal; nos demais, use as entradas preparadas como modo de compatibilidade.":"Use este terminal como guia de compilação e execução no VS Code; ele pode ser minimizado quando não for necessário.";
  setRuntimePanel("terminal",state.ui?.terminalCollapsed,{persist:false});
  if(web)setRuntimePanel("preview",state.ui?.previewCollapsed,{persist:false});
  if (web && !$("#webPreview").srcdoc) $("#webPreview").srcdoc = '<main style="font-family:sans-serif;padding:2rem"><h1>Preview aguardando execução</h1><p>Clique em Atualizar preview para executar somente o seu código.</p></main>';
}
function currentFiles() { const result={}; for (const name of allExerciseFiles()) result[name]=state.files[name]||""; return result; }
function projectSnapshotHash(){const files=currentProjectFiles();return codeHash(Object.entries(files).sort(([a],[b])=>a.localeCompare(b)).map(([path,content])=>`${path}\0${content}`).join("\0---\0"));}
function resolveProjectReference(baseFile,reference){
  let ref=String(reference||"").trim();
  if(!ref||ref.startsWith("#")||/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(ref))return null;
  ref=ref.split(/[?#]/,1)[0];try{ref=decodeURIComponent(ref);}catch{}
  const parts=(ref.startsWith("/")?[]:parentPath(baseFile).split("/").filter(Boolean));
  for(const part of ref.replace(/^\/+/,"").split("/")){if(!part||part===".")continue;if(part===".."){if(parts.length)parts.pop();continue;}parts.push(part);}
  return cleanPath(parts.join("/"));
}
function previewDocument(){
  const projectFiles=currentProjectFiles();
  const htmlCanonical=ex().arquivoPrincipal||"index.html";
  const htmlPath=pathForCanonical(htmlCanonical);
  const html=getFileContent(htmlPath)||"";
  const warnings=[];
  if(!html.trim())return {html:"",warnings,hash:projectSnapshotHash()};
  const doc=new DOMParser().parseFromString(html,"text/html");
  const csp=doc.createElement("meta");csp.httpEquiv="Content-Security-Policy";csp.content="default-src 'none'; img-src data: blob:; style-src 'unsafe-inline'; script-src 'unsafe-inline'; font-src data:; media-src data: blob:; connect-src 'none'; form-action 'none'; base-uri 'none'";doc.head.prepend(csp);
  for(const link of [...doc.querySelectorAll('link[rel~="stylesheet"][href]')]){
    const raw=link.getAttribute("href")||"";const path=resolveProjectReference(htmlPath,raw);
    if(!path){warnings.push(`Estilo externo bloqueado no preview: ${raw}`);link.remove();continue;}
    if(!Object.prototype.hasOwnProperty.call(projectFiles,path)){warnings.push(`Arquivo CSS não encontrado: ${raw}`);link.remove();continue;}
    const style=doc.createElement("style");style.dataset.dsSource=path;style.textContent=projectFiles[path];link.replaceWith(style);
  }
  for(const script of [...doc.querySelectorAll('script[src]')]){
    const raw=script.getAttribute("src")||"";const path=resolveProjectReference(htmlPath,raw);
    if(!path){warnings.push(`Script externo bloqueado no preview: ${raw}`);script.remove();continue;}
    if(!Object.prototype.hasOwnProperty.call(projectFiles,path)){warnings.push(`Arquivo JavaScript não encontrado: ${raw}`);script.remove();continue;}
    const inline=doc.createElement("script");inline.dataset.dsSource=path;inline.textContent=String(projectFiles[path]).replaceAll("</script>","<\/script>");script.replaceWith(inline);
  }
  const runId=previewRunId;
  const prelude=doc.createElement("script");prelude.textContent=`(function(){const runId=${runId};const send=(type,level,args)=>parent.postMessage({source:'ds1-preview',runId,type,level,text:(args||[]).map(v=>{try{return typeof v==='object'?JSON.stringify(v):String(v)}catch{return String(v)}}).join(' ')},'*');['log','warn','error'].forEach(level=>{const original=console[level];console[level]=(...args)=>{send('console',level,args);original.apply(console,args)}});addEventListener('error',event=>send('runtime-error','error',[event.message+' - linha '+event.lineno]));addEventListener('unhandledrejection',event=>send('runtime-error','error',[event.reason?.message||event.reason||'Promise rejeitada']));const data=${JSON.stringify(state.previewStorage||{})};const storage={getItem:key=>Object.prototype.hasOwnProperty.call(data,key)?data[key]:null,setItem:(key,value)=>{data[key]=String(value);parent.postMessage({source:'ds1-preview-storage',runId,key,value:String(value)},'*')},removeItem:key=>{delete data[key];parent.postMessage({source:'ds1-preview-storage',runId,action:'remove',key},'*')},clear:()=>{Object.keys(data).forEach(key=>delete data[key]);parent.postMessage({source:'ds1-preview-storage',runId,action:'clear'},'*')},key:index=>Object.keys(data)[index]??null,get length(){return Object.keys(data).length}};try{Object.defineProperty(window,'localStorage',{value:storage})}catch{}})();`;
  doc.head.prepend(prelude);
  const ready=doc.createElement("script");ready.textContent=`parent.postMessage({source:'ds1-preview',runId:${runId},type:'ready'},'*')`;doc.body.append(ready);
  return {html:`<!doctype html>
${doc.documentElement.outerHTML}`,warnings,hash:projectSnapshotHash()};
}
function updatePreview() {
  const runId = ++previewRunId;
  previewRunHadError = false;
  state.hasRun = true; state.lastRunSuccess = false; state.validated = false;
  const built=previewDocument();state.executedHash=built.hash;
  $("#terminalOutput").textContent = built.warnings.length ? `Executando preview…\n${built.warnings.map(item=>`[aviso] ${item}`).join("\n")}` : "Executando preview…";
  if (!built.html) {
    $("#webPreview").srcdoc = '<main style="font-family:sans-serif;padding:2rem"><h1>HTML principal vazio</h1><p>Digite a estrutura HTML para visualizar.</p></main>';
    saveState(); renderProgress(); return;
  }
  $("#webPreview").srcdoc = built.html;
  saveState(); renderProgress();
}

function appendTerminal(text,newline=true){const out=$("#terminalOutput");out.textContent+=(out.textContent?"":"")+String(text??"")+(newline?"\n":"");out.scrollTop=out.scrollHeight;}
function setTerminalInput(active,promptText="Entrada:"){terminalAwaitingInput=active;$("#terminalCommandForm").hidden=!active;$("#terminalPrompt").textContent=promptText||"Entrada:";if(active){$("#terminalCommandInput").value="";$("#terminalCommandInput").focus();}}
function stopPython() {
  if (pythonWorker) { pythonWorker.terminate(); pythonWorker=null; appendTerminal("Execução interrompida pelo usuário."); }
  setTerminalInput(false);$("#stopButton").disabled=true;state.lastRunSuccess=false;state.validated=false;state.completed=false;saveState();renderProgress();
}
function runPython() {
  const out=$("#terminalOutput"), code=executableCode(); state.runCount=Number(state.runCount||0)+1;
  if (!code.trim()) { out.textContent=`${executablePath()} está vazio. Digite o código antes de executar.`; return; }
  if(pythonWorker){pythonWorker.terminate();pythonWorker=null;} setTerminalInput(false);out.textContent="Iniciando Python...\n";$("#stopButton").disabled=false;setRuntimePanel("terminal",false);
  pythonWorker=new Worker("assets/js/python-worker.js"); let buffer="";
  pythonWorker.onmessage=event=>{
    const data=event.data||{};
    if(data.type==="status"){appendTerminal(data.text);return;}
    if(data.type==="capability"){appendTerminal(data.interactive?"Terminal interativo disponível: responda quando input() solicitar.":"Modo de compatibilidade: o navegador não disponibilizou entrada interativa; serão usadas as entradas preparadas.");return;}
    if(data.type==="input-request"){if(data.prompt)appendTerminal(data.prompt,false);setTerminalInput(true,data.prompt||"Entrada:");return;}
    if(data.type==="stdout"||data.type==="stderr"){buffer+=data.text+"\n";appendTerminal(data.text);return;}
    if(data.type==="stdin"){buffer+=`> ${data.text}\n`;appendTerminal(`> ${data.text}`);return;}
    if(data.type==="done"){
      setTerminalInput(false);state.hasRun=true;state.lastRunSuccess=Boolean(data.success);state.executedHash=codeHash(code);state.validated=false;state.completed=false;
      if (!data.success) {appendTerminal(data.error||"Erro durante a execução.");state.runtimeProblems=[...(state.runtimeProblems||[]),{title:"Erro de execução",detail:data.error||"Falha durante a execução."}].slice(-20);} else {observeBehavior(buffer); if (!buffer) appendTerminal("Programa concluído sem saída."); state.runtimeProblems=[];}
      $("#stopButton").disabled=true;if(pythonWorker){pythonWorker.terminate();pythonWorker=null;}saveState();renderProgress();window.AppAuth?.log(data.success?"python_executado":"erro_execucao",{numero:ex().numero});
    }
  };
  pythonWorker.onerror=event=>{setTerminalInput(false);out.textContent+=`\nFalha no Worker: ${event.message}`;state.hasRun=true;state.lastRunSuccess=false;state.validated=false;state.completed=false;$("#stopButton").disabled=true;if(pythonWorker){pythonWorker.terminate();pythonWorker=null;}saveState();renderProgress();};
  const prepared=$("#inputValues").value;const inputs=prepared?prepared.split("\n"):[];pythonWorker.postMessage({type:"run",code,inputs,fileName:executablePath()});
}
function showLocal() {
  setRuntimePanel("terminal",false);
  $("#terminalOutput").textContent=`Execução local obrigatória\n\nPasta: ${projectRoot()}\nComando: ${runtimeCommand()}\n\n1. Abra a pasta no VS Code.\n2. Abra o terminal nessa pasta.\n3. Execute o comando.\n4. Leia os erros de compilação ou execução.\n5. Corrija e execute novamente.\n6. Depois, marque “Executei localmente”.`;
  state.hasRun=true; saveState();
}
async function run() { syncEditor(); if(ex().runtime==="web") updatePreview(); else if(ex().runtime==="python") runPython(); else showLocal(); }

function balanced(code,open,close) { let count=0,quote=null,escaped=false; for(const char of code){if(escaped){escaped=false;continue}if(char==='\\'){escaped=true;continue}if(quote){if(char===quote)quote=null;continue}if(char==='"'||char==="'"){quote=char;continue}if(char===open)count++;if(char===close)count--;if(count<0)return false}return count===0&&!quote; }
async function syntaxProblems() {
  const problems=[];
  for (const name of allExerciseFiles()) {
    const code=state.files[name]||"", lang=languageForFile(name);
    if (!code.trim()) continue;
    if (lang==="javascript") { try { new Function(code); } catch(error) { problems.push(`${name}: ${error.message}`); } }
    if (lang==="css" && !balanced(code,"{","}")) problems.push(`${name}: verifique chaves ou aspas.`);
    if (["c","cpp","csharp","java"].includes(lang) && (!balanced(code,"{","}")||!balanced(code,"(",")"))) problems.push(`${name}: verifique chaves, parênteses ou aspas.`);
    if (lang==="python") {
      // A sintaxe Python é confirmada pela execução real no Worker. A exigência de executar
      // a versão atual é adicionada uma única vez em validate(), evitando diagnóstico duplicado.
    }
  }
  return problems;
}
function referenceLineFor(rule) {
  const code = ex().arquivos[rule?.arquivo] || "";
  const lines = code.split("\n");
  for (let index = 0; index < lines.length; index += 1) {
    if ((rule?.padroes || []).some(pattern => { try { return new RegExp(pattern, "i").test(lines[index]); } catch { return false; } })) return index + 1;
  }
  return 1;
}
function updateHelpPanel() {
  if (!helpIssue || !$("#helpMode")) return;
  const student = (state.files[helpIssue.arquivo] || "").split("\n");
  const reference = (ex().arquivos[helpIssue.arquivo] || "").split("\n");
  $("#helpFile").textContent = pathForCanonical(helpIssue.arquivo);
  $("#helpLine").textContent = String(helpIssue.linha);
  $("#helpReason").textContent = helpIssue.motivo;
  const studentLine = student[helpIssue.linha - 1];
  $("#helpStudentCode").textContent = studentLine !== undefined && studentLine !== "" ? studentLine : `Linha ${helpIssue.linha} ainda não existe ou está vazia.${student.length ? `\nÚltima linha digitada: ${student[student.length - 1] || "(vazia)"}` : ""}`;
  $("#helpReferenceCode").textContent = reference[helpIssue.linha - 1] || "(compare com o tutorial e o código de referência)";
  
}
function showHelp({ empty, syntax, missing, runMissing }) {
  const output = $("#terminalOutput").textContent || "";
  const runtimeLine = Number((output.match(/(?:line|linha)\s+(\d+)/i) || [])[1]);
  const rule = missing[0];
  const arquivo = empty[0] || rule?.arquivo || ex().arquivoPrincipal;
  const linha = runtimeLine || (rule ? referenceLineFor(rule) : 1);
  const motivo = empty.length ? `Comece preenchendo ${pathForCanonical(arquivo)}.` : rule ? `Compare o requisito: ${rule.rotulo}.` : syntax.length ? syntax[0] : runMissing ? "Execute a versão atual do código e leia a saída ou o erro." : "Revise o trecho indicado.";
  helpIssue = { arquivo, linha: Math.max(1, linha), motivo };
  const targetPath=pathForCanonical(arquivo); if (activeFile !== targetPath) { syncEditor(); activeFile = targetPath; selectedEntry={kind:"file",path:activeFile}; renderTabs(); renderPractice(); }
  const panel = $("#helpMode");
  helpOpener = document.activeElement;
  panel.hidden = false;
  updateHelpPanel();
  panel.focus();
}
function closeHelp() {
  const panel = $("#helpMode");
  if (!panel) return;
  panel.hidden = true; helpIssue = null; 
  if (helpOpener && document.contains(helpOpener)) helpOpener.focus();
}
async function validate() {
  syncEditor();
  const message = $("#validation");
  const empty = editableFiles().filter(name => !(state.files[name] || "").trim());
  const syntax = await syntaxProblems();
  const missing = (ex().validacao.regras || []).filter(item => !ruleMatches(item));
  const runMissing = ex().runtime === "web" && (!state.lastRunSuccess || state.executedHash !== projectSnapshotHash()) || ex().runtime === "python" && (!state.lastRunSuccess || state.executedHash !== codeHash(state.files[ex().arquivoPrincipal] || "")) || ex().runtime === "local" && !state.localConfirmed;
  state.validationAttempts=Number(state.validationAttempts||0)+1; const behavior=behaviorStatus(); const issues = [];
  if (empty.length) issues.push(`Arquivos vazios: ${empty.map(pathForCanonical).join(", ")}.`);
  issues.push(...syntax);
  if (missing.length) issues.push(`Requisitos pendentes: ${missing.map(item => item.rotulo).join(", ")}.`);
  if (runMissing) issues.push(ex().runtime === "local" ? "Execute no VS Code e marque a confirmação de execução local." : "Execute a versão atual sem erros antes de concluir."); if(behavior.configured&&behavior.blocking&&behavior.missing.length) issues.push(`Cenários obrigatórios pendentes: ${behavior.missing.map(item=>item.label).join(", ")}.`);
  if (issues.length) {
    message.dataset.tone = "danger";
    message.innerHTML = `<strong>Revise antes de concluir:</strong><ul>${issues.map(item => `<li>${esc(item)}</li>`).join("")}</ul>`;
    state.validated = false; state.runtimeProblems=issues.map(item=>({title:"Validação",detail:item}));
    showHelp({ empty, syntax, missing, runMissing });
  } else {
    message.dataset.tone = "success";
    message.innerHTML = "<strong>Atividade validada.</strong> A estrutura, a execução e os requisitos obrigatórios foram conferidos. Agora clique em <strong>Concluir atividade</strong> para registrar a conclusão.";
    state.validated = true; state.needsReview=false; state.runtimeProblems=[];
    closeHelp();
  }
  $("#finishButton").disabled = !state.validated;
  renderProgress(); renderExperiencePanels(); saveState();
}

async function copyText(text) { try { await navigator.clipboard.writeText(text); return true; } catch { const area=document.createElement("textarea");area.value=text;document.body.append(area);area.select();const ok=document.execCommand("copy");area.remove();return ok; } }
async function copyReference() { manualTypingToast("reference");window.AppAuth?.log("copia_referencia_bloqueada",{numero:ex().numero,arquivo:activeFile});return false; }
function useBase(){ completeCurrentStep(); }
function download(name,content,type="text/plain;charset=utf-8") { window.Utils.download(name, content, type); }
function downloadCurrent(){syncEditor();download(basename(activeFile),getFileContent(activeFile));}
function downloadReadme(){download("README.md",ex().arquivos["README.md"]||"");}
function crc32(bytes) { let crc = 0xffffffff; for (const byte of bytes) { crc ^= byte; for (let bit = 0; bit < 8; bit += 1) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1)); } return (crc ^ 0xffffffff) >>> 0; }
function zipBytes(files) {
  const encoder = new TextEncoder(), chunks = [], central = []; let offset = 0;
  const u16 = value => new Uint8Array([value & 255, value >>> 8 & 255]);
  const u32 = value => new Uint8Array([value & 255, value >>> 8 & 255, value >>> 16 & 255, value >>> 24 & 255]);
  const join = parts => { const size = parts.reduce((sum, part) => sum + part.length, 0), out = new Uint8Array(size); let at = 0; for (const part of parts) { out.set(part, at); at += part.length; } return out; };
  const now = new Date(), dosTime = (now.getHours() << 11) | (now.getMinutes() << 5) | Math.floor(now.getSeconds() / 2), dosDate = ((now.getFullYear() - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate();
  for (const [name, content] of Object.entries(files)) {
    const fileName = encoder.encode(name), data = encoder.encode(String(content ?? "")), crc = crc32(data);
    const local = join([u32(0x04034b50),u16(20),u16(0x0800),u16(0),u16(dosTime),u16(dosDate),u32(crc),u32(data.length),u32(data.length),u16(fileName.length),u16(0),fileName,data]);
    chunks.push(local);
    central.push(join([u32(0x02014b50),u16(20),u16(20),u16(0x0800),u16(0),u16(dosTime),u16(dosDate),u32(crc),u32(data.length),u32(data.length),u16(fileName.length),u16(0),u16(0),u16(0),u16(0),u32(0),u32(offset),fileName]));
    offset += local.length;
  }
  const centralData = join(central), body = join(chunks), end = join([u32(0x06054b50),u16(0),u16(0),u16(central.length),u16(central.length),u32(centralData.length),u32(body.length),u16(0)]);
  return join([body, centralData, end]);
}
async function downloadProject(){
  syncEditor();ensureProjectState();
  const projectFiles=currentProjectFiles();const incomplete=Object.values(projectFiles).some(content=>!String(content).trim())||!state.validated;
  if(incomplete&&!(await window.AppShell.confirmIncompleteDownload()))return;
  const files={};const root=projectRoot();
  for(const folder of [...state.folders].sort())files[`${root}/${folder}/`]="";
  for(const [path,content] of Object.entries(projectFiles))files[`${root}/${path}`]=content;
  const studentReadme=Object.prototype.hasOwnProperty.call(projectFiles,"README.md");
  files[`${root}/${studentReadme?"README-EXERCICIO.md":"README.md"}`]=ex().arquivos["README.md"]||"";
  if((state.supportHistory||[]).length)files[`${root}/autocompletar.json`]=JSON.stringify({platform:"1DS",version:APP_CONFIG.version,exercise:ex().numero,user:window.AppAuth?.currentUser?.()?.username||null,uses:state.supportHistory},null,2);
  if(incomplete)files[`${root}/LEIA-ME-PROGRESSO.txt`]=`PROJETO EM ANDAMENTO\n\nExercício: ${String(ex().numero).padStart(2,"0")} - ${ex().nomeCurto}\nArquivos e pastas preservam os nomes escolhidos no Explorador.\nO projeto ainda possui conteúdo vazio, incompleto ou não validado.\nVocê pode continuar no VS Code ou reabrir a plataforma neste navegador.\n`;
  const suffix=incomplete?"-EM-ANDAMENTO":"";download(`${root}${suffix}.zip`,new Blob([zipBytes(files)],{type:"application/zip"}),"application/zip");window.AppAuth?.log("projeto_aluno_baixado",{numero:ex().numero,incomplete,root,files:Object.keys(projectFiles)});
}
function downloadReference(){manualTypingToast("reference");window.AppAuth?.log("download_referencia_bloqueado",{numero:ex().numero});return false;}
function showView(name){$$('.view').forEach(view=>view.hidden=view.id!==`view-${name}`);$$('[data-view]').forEach(button=>button.classList.toggle('active',button.dataset.view===name));if(name==='practice')renderPractice();}
function openInfo(type){
  const currentStep=ex().passos[step]||ex().passos[0];
  const tips=[...(ex().professor?.erros||[]).slice(0,3),...(ex().professor?.testes||[]).slice(0,2)];
  const maps={
    contexto:`<h2>${esc(ex().modulo)}</h2><p>${esc(ex().objetivo)}</p><p><strong>Você vai praticar:</strong> ${ex().conceitos.map(esc).join(", ")}.</p>`,
    dicas:`<h2>Dicas e exemplos</h2><ul>${tips.map(item=>`<li>${esc(item)}</li>`).join("")}</ul><p>Use as dicas para comparar sua lógica. Elas não substituem a execução do seu próprio código.</p>`,
    explicacao:`<h2>${esc(currentStep?.titulo||"Etapa atual")}</h2><p>${esc(currentStep?.explicacao||ex().objetivo)}</p><p><strong>Resultado esperado:</strong> ${esc(currentStep?.resultado||"Execute e observe o comportamento.")}</p>`,
    termos:`<h2>Conceitos</h2><ul>${ex().conceitos.map(item=>`<li>${esc(item)}</li>`).join("")}</ul>`,
    ambiente:`${ENV_HELP[ex().tecnologia]||"<h2>Preparação do ambiente</h2>"}<h3>Comando principal deste exercício</h3><pre>${esc(runtimeCommand())}</pre><p>${esc($("#runtimeNote").textContent)}</p>`
  };
  const titles={contexto:"Contexto e objetivo",dicas:"Dicas e exemplos",explicacao:"Explicação da etapa",termos:"Glossário do código",ambiente:"Preparar ambiente"};
  window.AppShell?.openInfo(titles[type]||"Informações",maps[type]||"");
}
function explainLine(number){const canonical=activeCanonical();const part=canonical?ex().passos.find(item=>item.arquivo===canonical&&number>=item.linhas[0]&&number<=item.linhas[1]):null;const source=canonical?(ex().arquivos[canonical]||""):getFileContent(activeFile);const line=String(source).split("\n")[number-1]||"";window.AppShell?.openInfo(`Linha ${number} - ${basename(activeFile)}`,`<pre>${esc(line)}</pre><p>${esc(part?.explicacao||"Observe os valores usados, a ordem da instrução e o efeito produzido no programa.")}</p><p><strong>Papel no exercício:</strong> ${esc(part?.resultado||ex().objetivo)}</p>`);}
function explainToken(token){window.AppShell?.openInfo(token,`<p>${esc(TOKEN_HELP[token]||`“${token}” é um termo usado nesta linguagem. Observe o contexto da linha e compare com os exemplos do tutorial.`)}</p>`);}
function renderClassroom(){if(!$("#classroomDescription"))return;$("#classroomTitle").value=ex().classroom.titulo;$("#classroomDescription").value=ex().classroom.descricao;}
function renderTeacher(){if(ROLE!=="professor")return;const data=ex().professor;$("#teacherRoteiro").innerHTML=data.roteiro.map(item=>`<li>${esc(item)}</li>`).join("");$("#teacherTestes").innerHTML=data.testes.map(item=>`<li>${esc(item)}</li>`).join("");$("#teacherErros").innerHTML=data.erros.map(item=>`<li>${esc(item)}</li>`).join("");$("#teacherComparison").textContent=data.comparacao;}
function renderAll(){loadState();if($("#completeFolder"))$("#completeFolder").textContent=projectRoot();renderSummary();renderTabs();renderTutorial();renderPractice();renderClassroom();renderTeacher();$("#exerciseSelect").value=current;showView("tutorial");}

function setCodeFont(delta){const root=document.documentElement,currentSize=parseFloat(getComputedStyle(root).getPropertyValue('--code-font-size'))||15;const next=Math.max(12,Math.min(22,currentSize+delta));root.style.setProperty('--code-font-size',`${next}px`);storageSet(`ds1_${DISCIPLINE_ID}_CodeFont`,String(next));if(codeEditor)codeEditor.refresh();}
function init(){
  const savedFont=Number(storageGet(`ds1_${DISCIPLINE_ID}_CodeFont`));if(savedFont)document.documentElement.style.setProperty('--code-font-size',`${savedFont}px`);
  $("#exerciseSelect").innerHTML=EXERCICIOS.map((item,index)=>`<option value="${index}">${String(item.numero).padStart(2,"0")} - ${esc(item.nomeCurto)}</option>`).join("");
  $("#exerciseSelect").onchange=event=>{syncEditor();flushSave();current=Number(event.target.value);step=0;renderAll();};
  $$('[data-view]').forEach(button=>button.onclick=()=>showView(button.dataset.view));$$('[data-info]').forEach(button=>button.onclick=()=>openInfo(button.dataset.info));
  $("#prevStep").onclick=()=>{if(step>0){step--;renderTutorial();renderSupportStatus();}};$("#nextStep").onclick=()=>{if(step<ex().passos.length-1){step++;renderTutorial();renderSupportStatus();}else showView("practice");}; if($("#alreadyUnderstood"))$("#alreadyUnderstood").onclick=markUnderstood;
  initCodeEditor();
  protectReferenceReading();
  $("#fileTabs").addEventListener("keydown",event=>{if(!["ArrowLeft","ArrowRight","Home","End"].includes(event.key))return;const tabs=$$("#fileTabs [role=tab]");if(!tabs.length)return;const at=Math.max(0,tabs.indexOf(document.activeElement));let next=at;if(event.key==="ArrowLeft")next=(at-1+tabs.length)%tabs.length;if(event.key==="ArrowRight")next=(at+1)%tabs.length;if(event.key==="Home")next=0;if(event.key==="End")next=tabs.length-1;event.preventDefault();tabs[next].click();tabs[next].focus();});
  $("#projectTree").addEventListener("keydown",event=>{if(!["ArrowUp","ArrowDown","Home","End"].includes(event.key))return;const items=$$("#projectTree [role=treeitem]");if(!items.length)return;const at=Math.max(0,items.indexOf(document.activeElement));let next=at;if(event.key==="ArrowUp")next=Math.max(0,at-1);if(event.key==="ArrowDown")next=Math.min(items.length-1,at+1);if(event.key==="Home")next=0;if(event.key==="End")next=items.length-1;event.preventDefault();items[next].click();items[next].focus();});
  $("#runButton").onclick=run;$("#stopButton").onclick=stopPython;$("#validateButton").onclick=validate;$("#downloadCurrent").onclick=downloadCurrent;$("#downloadReadme").onclick=downloadReadme;$("#downloadExercise").onclick=downloadProject;$("#closeHelp").onclick=closeHelp;$("#reviewTutorial").onclick=()=>{closeHelp();showView("tutorial");};$("#newFileButton").onclick=createFile;$("#newFolderButton").onclick=createFolder;$("#renameEntryButton").onclick=renameSelected;$("#toggleTerminal").onclick=()=>setRuntimePanel("terminal",!$("#terminalBody").hidden);$("#togglePreview").onclick=()=>setRuntimePanel("preview",!$("#previewBody").hidden);

  $("#terminalCommandForm").onsubmit=event=>{event.preventDefault();if(!pythonWorker||!terminalAwaitingInput)return;const value=$("#terminalCommandInput").value;appendTerminal(`> ${value}`);setTerminalInput(false);pythonWorker.postMessage({type:"stdin-response",value});};
  $$('[data-preview-device]').forEach(button=>button.onclick=()=>{const device=button.dataset.previewDevice;$("#previewDeviceFrame").dataset.device=device;$$('[data-preview-device]').forEach(item=>item.classList.toggle("active",item===button));});
  $("#localExecutionConfirm").onchange=event=>{state.localConfirmed=event.target.checked;state.validated=false;saveState();renderProgress();};
  $("#finishButton").onclick=()=>{if(state.validated&&!state.completed){state.completed=true;state.completedAt=new Date().toISOString();state.percentage=100;saveState({immediate:true});renderProgress();showView('complete');window.AppAuth?.log("atividade_concluida",{numero:ex().numero});}};
  if($("#copyClassroom"))$("#copyClassroom").onclick=()=>copyText(ex().classroom.titulo+'\n\n'+ex().classroom.descricao);
  const closeMobileMenu=()=>{const actions=$(".header-actions");actions.classList.remove("menu-open");$(".menu-toggle").setAttribute("aria-expanded","false");};
  $(".menu-toggle").onclick=()=>{const actions=$(".header-actions");actions.classList.toggle("menu-open");$(".menu-toggle").setAttribute("aria-expanded",String(actions.classList.contains("menu-open")));};
  $$('[data-font-delta]').forEach(button=>button.onclick=()=>setCodeFont(Number(button.dataset.fontDelta)));
  document.addEventListener("click",event=>{
    const token=event.target.closest('[data-token]');if(token){event.stopPropagation();explainToken(token.dataset.token);return;}
    const line=event.target.closest('.code-line[data-line-number]');if(line)explainLine(Number(line.dataset.lineNumber));
    if(event.target.closest('[data-config-github]')) configureGithub();
    if(event.target.closest('[data-open-classroom]')) openExternal(APP_CONFIG.classroomUrl,APP_CONFIG.classroomUrl,true);
    if(event.target.closest('[data-open-github]')) openExternal(savedGithubUrl(),APP_CONFIG.githubDefault,true);
    if(!event.target.closest('.app-header')) closeMobileMenu();
  });
  document.addEventListener("keydown",event=>{if(event.key!=="Escape")return;if(!$("#helpMode").hidden){closeHelp();return;}if($(".header-actions").classList.contains("menu-open")){closeMobileMenu();$(".menu-toggle").focus();}});
  window.addEventListener('message',event=>{
    const data=event.data||{},frame=$("#webPreview");
    if(event.source!==frame.contentWindow||data.runId!==previewRunId)return;
    if(data.source==='ds1-preview'){
      const out=$("#terminalOutput");
      if(data.type==='console'){out.textContent+=(out.textContent?"\n":"")+`[${data.level}] ${data.text}`;}
      if(data.type==='runtime-error'){previewRunHadError=true;state.lastRunSuccess=false;state.validated=false;out.textContent+=(out.textContent?"\n":"")+`[error] ${data.text}`;saveState();renderProgress();}
      if(data.type==='ready'){state.lastRunSuccess=!previewRunHadError;state.hasRun=true;state.validated=false;if(!previewRunHadError){if(out.textContent==='Executando preview…')out.textContent='Preview executado sem erros registrados.';else out.textContent+='\n[status] Preview concluído sem erros registrados.';}saveState();renderProgress();}
    }
    if(data.source==='ds1-preview-storage'){state.previewStorage=state.previewStorage||{};if(data.action==='clear')state.previewStorage={};else if(data.action==='remove')delete state.previewStorage[data.key];else state.previewStorage[data.key]=data.value;saveState();}
  });
  ['appauth:before-lock','appauth:before-logout','appauth:before-switch','appauth:before-home'].forEach(name=>document.addEventListener(name,()=>{syncEditor();flushSave();}));
  window.addEventListener('pagehide',()=>{syncEditor();flushSave();});
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden'){syncEditor();flushSave();}});
  document.addEventListener('appauth:ready',()=>renderAll());
  renderAll();
}
document.addEventListener("DOMContentLoaded",init);
