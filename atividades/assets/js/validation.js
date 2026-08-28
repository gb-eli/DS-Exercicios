function fileMap(files, active, editorValue){
  return Object.fromEntries(files.map(f=>[f.filename, f.id===active?.id ? editorValue : (f.content||'')]));
}
function esc(s){return String(s||'').replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));}
function rx(pattern){try{return new RegExp(pattern,'ms')}catch{return null}}
function parseHtml(source){
  try{return new DOMParser().parseFromString(String(source||''),'text/html')}catch{return null}
}
function add(results,ok,label){results.push({ok:Boolean(ok),label});}
function headingHierarchyOk(doc){
  const hs=[...doc.querySelectorAll('h1,h2,h3,h4,h5,h6')].map(el=>Number(el.tagName.slice(1)));
  if(!hs.length)return false;
  if(hs[0]!==1)return false;
  for(let i=1;i<hs.length;i++)if(hs[i]>hs[i-1]+1)return false;
  return true;
}
function uniqueIdsOk(doc){
  const ids=[...doc.querySelectorAll('[id]')].map(el=>el.id).filter(Boolean);
  return ids.length===new Set(ids).size;
}
function validateFormAccessibility(doc,cfg,results){
  const controls=[...doc.querySelectorAll('input:not([type="hidden"]),select,textarea')];
  if(cfg.controlesMinimos!=null)add(results,controls.length>=cfg.controlesMinimos,`Controles de formulário: mínimo ${cfg.controlesMinimos}`);
  if(cfg.labelsAssociados){
    const ok=controls.every(control=>{
      if(control.closest('label'))return true;
      return Boolean(control.id&&doc.querySelector(`label[for="${CSS.escape(control.id)}"]`));
    });
    add(results,ok,'Todos os campos possuem rótulo associado');
  }
  for(const [type,min] of Object.entries(cfg.tiposInputMinimos||{}))add(results,doc.querySelectorAll(`input[type="${CSS.escape(type)}"]`).length>=min,`Input ${type}: mínimo ${min}`);
  if(cfg.selectsMinimos!=null)add(results,doc.querySelectorAll('select').length>=cfg.selectsMinimos,`Selects: mínimo ${cfg.selectsMinimos}`);
  if(cfg.camposObrigatoriosMinimos!=null)add(results,doc.querySelectorAll('input[required],select[required],textarea[required]').length>=cfg.camposObrigatoriosMinimos,`Campos obrigatórios: mínimo ${cfg.camposObrigatoriosMinimos}`);
  if(cfg.autocompletesMinimos!=null)add(results,doc.querySelectorAll('input[autocomplete]:not([autocomplete="off"])').length>=cfg.autocompletesMinimos,`Campos com autocomplete: mínimo ${cfg.autocompletesMinimos}`);
  if(cfg.fieldsetsComLegend!=null)add(results,[...doc.querySelectorAll('fieldset')].filter(f=>f.querySelector(':scope > legend')).length>=cfg.fieldsetsComLegend,`Fieldsets com legend: mínimo ${cfg.fieldsetsComLegend}`);
  if(cfg.botaoSubmit)add(results,Boolean(doc.querySelector('button[type="submit"],input[type="submit"]')),'Botão de envio explícito');
  if(cfg.nomesObrigatorios)add(results,controls.every(c=>Boolean(c.getAttribute('name'))),'Campos possuem atributo name');
  if(cfg.tabindexPositivoProibido)add(results,![...doc.querySelectorAll('[tabindex]')].some(el=>Number(el.getAttribute('tabindex'))>0),'Sem tabindex positivo');
}
function validateTableAccessibility(doc,cfg,results){
  const tables=[...doc.querySelectorAll('table')];
  if(cfg.tabelasMinimas!=null)add(results,tables.length>=cfg.tabelasMinimas,`Tabelas: mínimo ${cfg.tabelasMinimas}`);
  if(cfg.captionObrigatorio)add(results,tables.every(t=>Boolean(t.querySelector(':scope > caption'))),'Tabela possui caption');
  if(cfg.cabecalhosMinimos!=null)add(results,doc.querySelectorAll('th').length>=cfg.cabecalhosMinimos,`Cabeçalhos th: mínimo ${cfg.cabecalhosMinimos}`);
  if(cfg.scopeColMinimo!=null)add(results,doc.querySelectorAll('th[scope="col"]').length>=cfg.scopeColMinimo,`Cabeçalhos scope="col": mínimo ${cfg.scopeColMinimo}`);
  if(cfg.linhasCorpoMinimas!=null)add(results,doc.querySelectorAll('tbody tr').length>=cfg.linhasCorpoMinimas,`Linhas no tbody: mínimo ${cfg.linhasCorpoMinimas}`);
  if(cfg.celulasPorLinhaMinimas!=null)add(results,[...doc.querySelectorAll('tbody tr')].every(tr=>tr.querySelectorAll('td,th').length>=cfg.celulasPorLinhaMinimas),`Cada linha possui ao menos ${cfg.celulasPorLinhaMinimas} células`);
  if(cfg.statusTextual){
    const patterns=(cfg.padroesCabecalhoStatus||['status','situação','situacao','estado']).map(x=>String(x).toLowerCase());
    const headers=[...doc.querySelectorAll('thead th')].map(x=>x.textContent.trim().toLowerCase());
    add(results,headers.some(h=>patterns.some(p=>h.includes(p))),'Coluna de status identificada por texto');
  }
}
function validateHtmlSemantic(source,hs,results){
  const doc=parseHtml(source);if(!doc){add(results,false,'HTML pôde ser analisado');return;}
  if(hs.doctype)add(results,/^\s*<!doctype\s+html/i.test(source),'DOCTYPE HTML');
  if(hs.idioma)add(results,Boolean(doc.documentElement.getAttribute('lang')),'Idioma da página');
  if(hs.charset)add(results,Boolean(doc.querySelector('meta[charset]')),'Charset');
  if(hs.viewport)add(results,Boolean(doc.querySelector('meta[name="viewport"]')),'Meta viewport');
  for(const [tag,min] of Object.entries(hs.tagsMinimas||{}))add(results,doc.querySelectorAll(tag).length>=min,`<${tag}>: mínimo ${min}`);
  for(const [tag,count] of Object.entries(hs.tagsExatas||{}))add(results,doc.querySelectorAll(tag).length===count,`<${tag}>: exatamente ${count}`);
  for(const tag of hs.tagsExatasEstritas||[])if(!(hs.tagsExatas||{})[tag])add(results,doc.querySelectorAll(tag).length===1,`<${tag}>: exatamente 1`);
  for(const id of hs.idsObrigatorios||[])add(results,Boolean(doc.getElementById(id)),`ID obrigatório: ${id}`);
  for(const rel of hs.relacoes||[]){
    const count=[...doc.querySelectorAll(rel.pai)].reduce((n,parent)=>n+parent.querySelectorAll(rel.filho).length,0);
    add(results,count>=Number(rel.minimo||1),rel.descricao||`${rel.filho} dentro de ${rel.pai}`);
  }
  if(hs.linksInternos!=null)add(results,[...doc.querySelectorAll('a[href^="#"]')].filter(a=>a.getAttribute('href')?.length>1).length>=hs.linksInternos,`Links internos: mínimo ${hs.linksInternos}`);
  if(hs.artigoComTitulo)add(results,[...doc.querySelectorAll('article')].every(a=>Boolean(a.querySelector('h1,h2,h3,h4,h5,h6'))),'Cada article possui título');
  if(hs.hierarquiaTitulos)add(results,headingHierarchyOk(doc),'Hierarquia de títulos sem saltos');
  if(hs.idsUnicos)add(results,uniqueIdsOk(doc),'IDs únicos');
  if(hs.formularioAcessivel)validateFormAccessibility(doc,hs.formularioAcessivel,results);
  if(hs.tabelaAcessivel)validateTableAccessibility(doc,hs.tabelaAcessivel,results);
}
export function validateExercise(meta, files, active, editorValue){
  const map=fileMap(files,active,editorValue),results=[],validation=meta?.validacao||{};
  if(validation.minChars){const content=Object.values(map).join('\n');add(results,content.length>=validation.minChars,`Mínimo de ${validation.minChars} caracteres`);}
  if(Array.isArray(validation.regras))for(const rule of validation.regras){
    const content=map[rule.arquivo]||'',pats=(rule.padroes||[]).map(rx).filter(Boolean),hits=pats.map(r=>r.test(content));
    add(results,rule.modo==='todos'?hits.every(Boolean):hits.some(Boolean),rule.rotulo||'Critério do exercício');
  }
  const hs=validation.htmlSemantico||validation.htmlEstrutura;if(hs)validateHtmlSemantic(map['index.html']||map['html']||'',hs,results);
  return results;
}
export function validationScore(results){if(!results.length)return null;return Math.round(results.filter(r=>r.ok).length/results.length*100);}
export function renderValidation(results){
  if(!results.length)return '<p class="muted">Pré-validação automática ainda não disponível para este exercício. O código continua sendo salvo normalmente.</p>';
  const ok=results.filter(r=>r.ok).length,pct=Math.round(ok/results.length*100);
  return `<div class="validation-summary"><strong>${pct}% dos critérios públicos detectados</strong><span>${ok}/${results.length}</span></div>`+results.map(r=>`<div class="validation-row ${r.ok?'ok':'pending'}"><span>${r.ok?'✓':'○'}</span><span>${esc(r.label)}</span></div>`).join('');
}
