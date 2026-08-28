const DEFAULT_COLUMNS=['Item','Setor','Quantidade','Situação'];

export function columnName(index){
  let n=Number(index)+1,out='';
  while(n>0){const rem=(n-1)%26;out=String.fromCharCode(65+rem)+out;n=Math.floor((n-1)/26)}
  return out;
}
export function columnIndex(name){
  return String(name||'').toUpperCase().split('').reduce((acc,ch)=>acc*26+(ch.charCodeAt(0)-64),0)-1;
}
export function parseCellRef(ref){
  const match=/^([A-Z]+)(\d+)$/i.exec(String(ref||'').trim());
  return match?{col:columnIndex(match[1]),row:Number(match[2])-1}:null;
}
export function cellRef(row,col){return `${columnName(col)}${row+1}`}
export function normalizeText(value){return String(value??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim()}
function localeNumberOrNull(value){
  const raw=String(value??'').trim();
  if(!raw)return null;
  const clean=raw.replace(/R\$\s?/gi,'').replace(/%$/,'').replace(/\s/g,'').replace(/\.(?=\d{3}(?:\D|$))/g,'').replace(',','.');
  if(!/^[+-]?(?:\d+(?:\.\d+)?|\.\d+)$/.test(clean))return null;
  const number=Number(clean);return Number.isFinite(number)?number:null;
}
export function parseLocaleNumber(value){
  const number=localeNumberOrNull(value);return number===null?0:number;
}

export function buildWorkbook(columns=DEFAULT_COLUMNS,rows=[]){
  const data=[columns.map(String),...rows.map(row=>columns.map((_,i)=>String(row?.[i]??'')))];
  return {data,formulas:{},formats:{},filter:null,sort:null,frozenRows:0,share:{general:'restricted',role:'reader',people:[],linkCopied:false},chart:null,selection:{anchor:'A1',focus:'A1'},title:'',version:1};
}
export function cloneWorkbook(book){return JSON.parse(JSON.stringify(book))}
export function selectedRefs(selection){
  const a=parseCellRef(selection?.anchor||'A1'),b=parseCellRef(selection?.focus||selection?.anchor||'A1');if(!a||!b)return ['A1'];
  const refs=[];for(let r=Math.min(a.row,b.row);r<=Math.max(a.row,b.row);r++)for(let c=Math.min(a.col,b.col);c<=Math.max(a.col,b.col);c++)refs.push(cellRef(r,c));return refs;
}
function rangeValues(book,range){
  const parts=String(range||'').split(':');const a=parseCellRef(parts[0]),b=parseCellRef(parts[1]||parts[0]);if(!a||!b)return [];
  const out=[];for(let r=Math.min(a.row,b.row);r<=Math.max(a.row,b.row);r++)for(let c=Math.min(a.col,b.col);c<=Math.max(a.col,b.col);c++)out.push(getCellValue(book,cellRef(r,c)));return out;
}
function formulaArgs(text,preferCommaSeparator=false){
  const source=String(text||'');
  const hasTopLevelSemicolon=(()=>{let level=0,quoted=false;for(let i=0;i<source.length;i++){const ch=source[i];if(ch==='"'&&source[i-1]!=='\\')quoted=!quoted;if(quoted)continue;if(ch==='(')level++;else if(ch===')')level--;else if(ch===';'&&level===0)return true}return false})();
  const args=[];let level=0,current='',quoted=false;
  for(let i=0;i<source.length;i++){
    const ch=source[i];
    if(ch==='"'&&source[i-1]!=='\\')quoted=!quoted;
    if(!quoted){if(ch==='(')level++;if(ch===')')level--;}
    const decimalComma=!preferCommaSeparator&&ch===','&&/\d/.test(source[i-1]||'')&&/\d/.test(source[i+1]||'');
    const separator=!quoted&&level===0&&(ch===';'||(ch===','&&!hasTopLevelSemicolon&&!decimalComma));
    if(separator){args.push(current.trim());current=''}else current+=ch;
  }
  if(current.trim()||source.endsWith(';')||source.endsWith(','))args.push(current.trim());
  return args;
}

function scalar(book,token,stack){
  const trimmed=String(token||'').trim();
  if(/^".*"$/.test(trimmed))return trimmed.slice(1,-1);
  if(/^[A-Z]+\d+$/i.test(trimmed))return getCellValue(book,trimmed,stack);
  if(/^[A-Z]+\d+:[A-Z]+\d+$/i.test(trimmed))return rangeValues(book,trimmed);
  if(/^(VERDADEIRO|TRUE)$/i.test(trimmed))return true;if(/^(FALSO|FALSE)$/i.test(trimmed))return false;
  const n=localeNumberOrNull(trimmed);return n===null?trimmed:n;
}
export function evaluateFormula(book,formula,stack=new Set()){
  let expr=String(formula||'').trim();if(!expr.startsWith('='))return expr;expr=expr.slice(1).trim();
  const fn=/^([\p{L}.]+)\((.*)\)$/iu.exec(expr);
  if(fn){
    const name=normalizeText(fn[1]).replace(/\./g,''),englishNames=['sum','average','min','max','countif','sumif','if'],args=formulaArgs(fn[2],englishNames.includes(name));
    const values=args.flatMap(arg=>{const val=scalar(book,arg,stack);return Array.isArray(val)?val:[val]});
    const nums=values.map(localeNumberOrNull).filter(value=>value!==null);
    if(['soma','sum'].includes(name))return nums.reduce((a,b)=>a+b,0);
    if(['media','average'].includes(name))return nums.length?nums.reduce((a,b)=>a+b,0)/nums.length:0;
    if(['minimo','min'].includes(name))return nums.length?Math.min(...nums):0;
    if(['maximo','max'].includes(name))return nums.length?Math.max(...nums):0;
    if(['contse','countif'].includes(name)){
      const source=Array.isArray(scalar(book,args[0],stack))?scalar(book,args[0],stack):[];const criterion=String(scalar(book,args[1],stack));return source.filter(v=>normalizeText(v)===normalizeText(criterion)).length;
    }
    if(['somase','sumif'].includes(name)){
      const source=Array.isArray(scalar(book,args[0],stack))?scalar(book,args[0],stack):[];const criterion=String(scalar(book,args[1],stack));const sumRange=Array.isArray(scalar(book,args[2]||args[0],stack))?scalar(book,args[2]||args[0],stack):[];return source.reduce((sum,v,i)=>normalizeText(v)===normalizeText(criterion)?sum+parseLocaleNumber(sumRange[i]):sum,0);
    }
    if(['se','if'].includes(name)){
      const condition=evaluateCondition(book,args[0],stack);return scalar(book,condition?args[1]:args[2],stack);
    }
  }
  const safe=expr.replace(/([A-Z]+\d+)/gi,ref=>String(parseLocaleNumber(getCellValue(book,ref,stack)))).replace(/,/g,'.');
  if(!/^[\d+\-*/().\s]+$/.test(safe))return '#ERRO!';
  const result=safeArithmetic(safe);return Number.isFinite(result)?result:'#ERRO!';
}
function safeArithmetic(source){
  const tokens=String(source).match(/\d+(?:\.\d+)?|[()+\-*/]/g)||[];let index=0;
  const peek=()=>tokens[index],take=()=>tokens[index++];
  const primary=()=>{const token=take();if(token==='('){const value=expression();if(take()!==')')throw new Error('parenthesis');return value}if(token==='+'||token==='-'){const value=primary();return token==='-'?-value:value}const value=Number(token);if(!Number.isFinite(value))throw new Error('number');return value};
  const term=()=>{let value=primary();while(peek()==='*'||peek()==='/'){const op=take(),right=primary();value=op==='*'?value*right:value/right}return value};
  const expression=()=>{let value=term();while(peek()==='+'||peek()==='-'){const op=take(),right=term();value=op==='+'?value+right:value-right}return value};
  try{const value=expression();return index===tokens.length?value:NaN}catch{return NaN}
}
function evaluateCondition(book,text,stack){
  const match=String(text||'').match(/^(.+?)(>=|<=|<>|=|>|<)(.+)$/);if(!match)return Boolean(scalar(book,text,stack));
  const left=scalar(book,match[1],stack),right=scalar(book,match[3],stack),op=match[2];const ln=localeNumberOrNull(left),rn=localeNumberOrNull(right),numeric=ln!==null&&rn!==null;const a=numeric?ln:normalizeText(left),b=numeric?rn:normalizeText(right);
  return op==='='?a===b:op==='<>'?a!==b:op==='>'?a>b:op==='<'?a<b:op==='>='?a>=b:a<=b;
}
export function getCellValue(book,ref,stack=new Set()){
  const pos=parseCellRef(ref);if(!pos)return '';
  if(stack.has(ref))return '#CIRCULAR!';
  const formula=book.formulas?.[ref];if(formula){const next=new Set(stack);next.add(ref);return evaluateFormula(book,formula,next)}
  return book.data?.[pos.row]?.[pos.col]??'';
}
export function setCellInput(book,ref,input){
  const pos=parseCellRef(ref);if(!pos)return;
  while(book.data.length<=pos.row)book.data.push([]);while(book.data[pos.row].length<=pos.col)book.data[pos.row].push('');
  const text=String(input??'');if(text.trim().startsWith('=')){book.formulas[ref]=text.trim();book.data[pos.row][pos.col]=''}else{delete book.formulas[ref];book.data[pos.row][pos.col]=text}
}
export function visibleRowIndexes(book){
  const indexes=Array.from({length:Math.max(0,book.data.length-1)},(_,i)=>i+1);let out=indexes;
  if(book.filter){const col=book.filter.col;out=out.filter(row=>normalizeText(getCellValue(book,cellRef(row,col))).includes(normalizeText(book.filter.value)))}
  if(book.sort){const {col,dir}=book.sort;out=[...out].sort((ra,rb)=>{const av=getCellValue(book,cellRef(ra,col)),bv=getCellValue(book,cellRef(rb,col)),aBlank=String(av??'').trim()==='',bBlank=String(bv??'').trim()==='';if(aBlank!==bBlank)return aBlank?1:-1;const an=localeNumberOrNull(av),bn=localeNumberOrNull(bv);const numeric=an!==null&&bn!==null;const result=numeric?an-bn:String(av).localeCompare(String(bv),'pt-BR',{numeric:true});return dir==='desc'?-result:result})}
  return out;
}
export class SpreadsheetEngine{
  constructor(host,{columns,rows,initialState,onAction,onChange,reducedMotion=false,title='Controle Administrativo',scenario='Rotina administrativa'}={}){
    this.host=host;this.modalReturnFocus=null;this.book=initialState?cloneWorkbook(initialState):buildWorkbook(columns,rows);this.onAction=onAction||(()=>{});this.onChange=onChange||(()=>{});this.reducedMotion=reducedMotion;this.title=this.book.title||title;this.book.title=this.title;this.scenario=scenario;this.undoStack=[];this.redoStack=[];this.clipboard=[];this.dragging=false;this.render();
  }
  serialize(){return cloneWorkbook(this.book)}
  snapshot(){this.undoStack.push(cloneWorkbook(this.book));if(this.undoStack.length>40)this.undoStack.shift();this.redoStack=[]}
  commit(action,detail={}){this.book.version=(this.book.version||0)+1;this.onChange(this.serialize());this.onAction(action,detail,this.serialize())}
  undo(){if(!this.undoStack.length)return;this.redoStack.push(cloneWorkbook(this.book));this.book=this.undoStack.pop();this.render();this.commit('undo')}
  redo(){if(!this.redoStack.length)return;this.undoStack.push(cloneWorkbook(this.book));this.book=this.redoStack.pop();this.render();this.commit('redo')}
  selected(){return selectedRefs(this.book.selection)}
  applyFormat(key,value=true,action=key){this.snapshot();for(const ref of this.selected()){this.book.formats[ref]={...(this.book.formats[ref]||{}),[key]:value};if(key==='currency'&&value)this.book.formats[ref].percent=false;if(key==='percent'&&value)this.book.formats[ref].currency=false}this.render();this.commit(action,{refs:this.selected(),value})}
  toggleFormat(key,action=key){const ref=this.book.selection.focus||'A1',current=Boolean(this.book.formats?.[ref]?.[key]);this.applyFormat(key,!current,action)}
  setSelection(ref,extend=false){this.book.selection=extend?{...this.book.selection,focus:ref}:{anchor:ref,focus:ref};this.renderSelection();this.updateFormulaBar()}
  render(){
    const dataCols=Math.max(0,...(this.book.data||[]).map(row=>row?.length||0)),formulaCols=Math.max(0,...Object.keys(this.book.formulas||{}).map(ref=>(parseCellRef(ref)?.col??-1)+1)),selectionCols=(parseCellRef(this.book.selection?.focus||'A1')?.col??0)+1,cols=Math.max(dataCols,formulaCols,selectionCols,4),visible=visibleRowIndexes(this.book),displayRows=[0,...visible];const generalLabel=this.book.share.general==='link'?`Qualquer pessoa com o link · ${this.roleLabel(this.book.share.role)}`:'Restrito';
    this.host.innerHTML=`<div class="real-sheet-app ${this.book.frozenRows?'is-frozen':''}">
      <header class="rs-titlebar"><div class="rs-brand">▦</div><div class="rs-file"><input data-rs-title value="${escapeAttr(this.title)}" aria-label="Nome do arquivo"><small>Salvo automaticamente · ${escapeHtml(this.scenario)}</small></div><div class="rs-top-actions"><span class="rs-save">✓ Salvo</span><button class="rs-share-primary" data-rs-open-share>Compartilhar</button></div></header>
      <nav class="rs-menu" aria-label="Menu da planilha"><button data-rs-menu="file">Arquivo</button><button data-rs-menu="edit">Editar</button><button data-rs-menu="view">Ver</button><button data-rs-menu="insert">Inserir</button><button data-rs-menu="format">Formatar</button><button data-rs-menu="data">Dados</button><button data-rs-menu="tools">Ferramentas</button><button data-rs-menu="help">Ajuda</button><span class="rs-access">${escapeHtml(generalLabel)}</span></nav>
      <div class="rs-toolbar" role="toolbar" aria-label="Formatação"><button data-rs-undo title="Desfazer">↶</button><button data-rs-redo title="Refazer">↷</button><span></span><select data-rs-font aria-label="Fonte"><option>Arial</option><option>Roboto</option><option>Calibri</option></select><select data-rs-size aria-label="Tamanho"><option>10</option><option selected>11</option><option>12</option><option>14</option><option>16</option><option>18</option></select><button data-rs-format="bold" title="Negrito"><b>B</b></button><button data-rs-format="italic" title="Itálico"><i>I</i></button><button data-rs-format="underline" title="Sublinhado"><u>S</u></button><button data-rs-format="currency" title="Moeda">R$</button><button data-rs-format="percent" title="Porcentagem">%</button><button data-rs-format="align" title="Centralizar">≡</button><button data-rs-format="fill" title="Preenchimento">▣</button><button data-rs-format="border" title="Bordas">▦</button><button data-rs-freeze title="Congelar linha 1">❄</button><button data-rs-chart title="Inserir gráfico">▥</button></div>
      <div class="rs-formula"><input data-rs-name aria-label="Referência" value="${escapeHtml(this.book.selection.focus||'A1')}"><b>fx</b><input data-rs-formula aria-label="Conteúdo ou fórmula"></div>
      <div class="rs-grid-wrap"><div class="rs-grid" style="--rs-cols:${cols}"><button class="rs-corner" aria-label="Selecionar toda a planilha" title="Selecionar tudo"></button>${Array.from({length:cols},(_,c)=>`<button class="rs-col-head" data-rs-col="${c}">${columnName(c)}<i data-rs-filter-col="${c}" title="Filtro da coluna">▾</i></button>`).join('')}${displayRows.map(r=>`<button class="rs-row-head" data-rs-row="${r}">${r+1}</button>${Array.from({length:cols},(_,c)=>this.cellHtml(r,c)).join('')}`).join('')}</div></div>
      <footer class="rs-footer"><div><button class="rs-sheet-tab active">Dados</button><button class="rs-add-sheet" title="Aba única nesta atividade" aria-label="Aba única nesta atividade" disabled>＋</button></div><span>${visible.length} de ${Math.max(0,this.book.data.length-1)} registros visíveis</span></footer>
      <div class="rs-live" aria-live="polite"></div>${this.book.chart?this.chartHtml(visible):''}
    </div>`;
    this.bind();this.renderSelection();this.updateFormulaBar();
  }
  cellHtml(row,col){
    const ref=cellRef(row,col),value=getCellValue(this.book,ref),fmt=this.book.formats[ref]||{};const classes=['rs-cell'];if(row===0)classes.push('rs-header-cell');
    const safeFont=['Arial','Roboto','Calibri'].includes(fmt.font)?fmt.font:'';
    const style=[fmt.bold?'font-weight:700':'',fmt.italic?'font-style:italic':'',fmt.underline?'text-decoration:underline':'',fmt.align==='center'?'text-align:center':fmt.align==='right'?'text-align:right':'',fmt.fill?'background:#fff2cc':'',fmt.border?'box-shadow:inset 0 0 0 2px #5f6368':'',fmt.size?`font-size:${Math.max(8,Math.min(32,Number(fmt.size)||11))}px`:'',safeFont?`font-family:${safeFont},Arial,sans-serif`:''].filter(Boolean).join(';');
    const numericValue=localeNumberOrNull(value);let display=value;if(fmt.currency&&numericValue!==null)display=numericValue.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});if(fmt.percent&&numericValue!==null)display=`${(numericValue*100).toLocaleString('pt-BR')}%`;
    return `<div class="${classes.join(' ')}" tabindex="0" role="gridcell" data-rs-cell="${ref}" style="${style}" aria-label="${ref}: ${escapeHtml(display)}">${escapeHtml(display)}</div>`;
  }
  chartHtml(visible){
    const rows=visible.slice(0,8),values=rows.map(r=>parseLocaleNumber(getCellValue(this.book,cellRef(r,2)))),max=Math.max(...values,1),valueHeader=getCellValue(this.book,'C1')||'Valor',categoryHeader=getCellValue(this.book,'A1')||'Categoria';
    return `<section class="rs-chart-panel" role="dialog" aria-label="Gráfico da planilha"><header><div><strong>${escapeHtml(valueHeader)} por ${escapeHtml(categoryHeader)}</strong><small>Gráfico de colunas · dados fictícios</small></div><button data-rs-close-chart aria-label="Fechar gráfico" title="Fechar gráfico">×</button></header><div class="rs-chart-bars">${rows.map((r,i)=>`<div><b>${escapeHtml(String(values[i]))}</b><i style="height:${Math.max(8,(values[i]/max)*100)}%"></i><small>${escapeHtml(getCellValue(this.book,cellRef(r,0)))}</small></div>`).join('')}</div><footer>Use o gráfico para comparar os registros visíveis. Feche esta janela para continuar editando a planilha.</footer></section>`;
  }
  bind(){
    this.host.querySelectorAll('[data-rs-cell]').forEach(cell=>{
      cell.onpointerdown=e=>{this.dragging=true;this.setSelection(cell.dataset.rsCell,e.shiftKey);document.addEventListener('pointerup',()=>{this.dragging=false},{once:true})};
      cell.onpointerenter=()=>{if(this.dragging){this.book.selection.focus=cell.dataset.rsCell;this.renderSelection();this.updateFormulaBar()}};
      cell.onpointerup=()=>{this.dragging=false};
      cell.ondblclick=()=>this.editCell(cell.dataset.rsCell);
      cell.onkeydown=e=>{if(e.key==='Enter'||e.key==='F2'){e.preventDefault();this.editCell(cell.dataset.rsCell)}else if(e.key==='Delete'){this.snapshot();for(const ref of this.selected())setCellInput(this.book,ref,'');this.render();this.commit('clear',{refs:this.selected()})}}
    });
    const formulaInput=this.host.querySelector('[data-rs-formula]');let formulaCommitted=false;formulaInput.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();formulaCommitted=true;this.setActiveInput(e.currentTarget.value)}};formulaInput.onblur=e=>{if(!formulaCommitted){const ref=this.book.selection.focus||'A1',current=String(this.book.formulas[ref]??getCellValue(this.book,ref)??'');if(e.currentTarget.value!==current)this.setActiveInput(e.currentTarget.value)}};
    this.host.querySelector('[data-rs-name]').onkeydown=e=>{if(e.key==='Enter'){const ref=e.currentTarget.value.toUpperCase();if(parseCellRef(ref))this.setSelection(ref)}};
    const titleInput=this.host.querySelector('[data-rs-title]');titleInput.onchange=e=>{const next=e.currentTarget.value.trim()||'Planilha sem título';if(next===this.title)return;this.snapshot();this.title=next;this.book.title=next;this.commit('rename-file',{title:next})};

    this.host.onkeydown=e=>{
      if(['INPUT','SELECT','TEXTAREA'].includes(e.target.tagName))return;
      const ctrl=e.ctrlKey||e.metaKey;
      if(ctrl&&e.key.toLowerCase()==='c'){e.preventDefault();this.copySelection();return}
      if(ctrl&&e.key.toLowerCase()==='v'){e.preventDefault();this.pasteSelection();return}
      if(ctrl&&e.key.toLowerCase()==='z'){e.preventDefault();e.shiftKey?this.redo():this.undo();return}
      if(ctrl&&e.key.toLowerCase()==='y'){e.preventDefault();this.redo();return}
      const move={ArrowUp:[-1,0],ArrowDown:[1,0],ArrowLeft:[0,-1],ArrowRight:[0,1],Tab:[0,e.shiftKey?-1:1]};
      if(move[e.key]){e.preventDefault();const current=parseCellRef(this.book.selection.focus||'A1'),delta=move[e.key];if(current)this.setSelection(cellRef(Math.max(0,current.row+delta[0]),Math.max(0,current.col+delta[1])),e.shiftKey&&e.key!=='Tab')}
    };
    const lastRow=Math.max(0,this.book.data.length-1),lastCol=Math.max(0,Math.max(...(this.book.data||[]).map(row=>(row?.length||1)-1)));
    this.host.querySelectorAll('[data-rs-col]').forEach(head=>head.onclick=e=>{if(e.target.closest('[data-rs-filter-col]'))return;const col=Number(head.dataset.rsCol);this.book.selection={anchor:cellRef(0,col),focus:cellRef(lastRow,col)};this.renderSelection();this.updateFormulaBar()});
    this.host.querySelectorAll('[data-rs-row]').forEach(head=>head.onclick=()=>{const row=Number(head.dataset.rsRow);this.book.selection={anchor:cellRef(row,0),focus:cellRef(row,lastCol)};this.renderSelection();this.updateFormulaBar()});
    this.host.querySelector('.rs-corner')?.addEventListener('click',()=>{this.book.selection={anchor:'A1',focus:cellRef(lastRow,lastCol)};this.renderSelection();this.updateFormulaBar()});
    this.host.querySelector('[data-rs-undo]').onclick=()=>this.undo();this.host.querySelector('[data-rs-redo]').onclick=()=>this.redo();
    this.host.querySelectorAll('[data-rs-format]').forEach(btn=>btn.onclick=()=>{const type=btn.dataset.rsFormat;if(type==='bold')this.toggleFormat('bold','bold');else if(type==='italic')this.toggleFormat('italic','italic');else if(type==='underline')this.toggleFormat('underline','underline');else if(type==='align'){const ref=this.book.selection.focus||'A1',current=this.book.formats?.[ref]?.align||'left',next=current==='left'?'center':current==='center'?'right':'left';this.applyFormat('align',next,`align-${next}`)}else if(type==='fill')this.toggleFormat('fill','fill-alert');else if(type==='border')this.toggleFormat('border','border');else if(type==='currency')this.toggleFormat('currency','currency');else if(type==='percent')this.toggleFormat('percent','percent')});
    this.host.querySelector('[data-rs-font]').onchange=e=>this.applyFormat('font',e.currentTarget.value,`font-${e.currentTarget.value.toLowerCase()}`);
    this.host.querySelector('[data-rs-size]').onchange=e=>this.applyFormat('size',Number(e.currentTarget.value),`font-${e.currentTarget.value}`);
    this.host.querySelector('[data-rs-freeze]').onclick=()=>{this.snapshot();this.book.frozenRows=this.book.frozenRows?0:1;this.render();this.commit('freeze-header',{enabled:Boolean(this.book.frozenRows)})};
    this.host.querySelector('[data-rs-chart]').onclick=()=>{this.snapshot();this.book.chart={type:'column'};this.render();this.commit('chart-column')};
    this.host.querySelector('[data-rs-open-share]').onclick=()=>this.openShareDialog();
    this.host.querySelectorAll('[data-rs-filter-col]').forEach(btn=>btn.onclick=e=>{e.stopPropagation();this.openFilterDialog(Number(btn.dataset.rsFilterCol))});
    this.host.querySelectorAll('[data-rs-menu]').forEach(btn=>btn.onclick=()=>this.openMenu(btn.dataset.rsMenu,btn));
    this.host.querySelector('[data-rs-close-chart]')?.addEventListener('click',()=>{this.snapshot();this.book.chart=null;this.render();this.commit('chart-closed')});
  }
  editCell(ref){
    const cell=this.host.querySelector(`[data-rs-cell="${ref}"]`);if(!cell)return;const current=this.book.formulas[ref]??getCellValue(this.book,ref);cell.innerHTML=`<input class="rs-cell-editor" value="${escapeAttr(current)}" aria-label="Editar ${ref}">`;const input=cell.querySelector('input');input.focus();input.select();let resolved=false;const finish=()=>{if(resolved)return;resolved=true;this.snapshot();setCellInput(this.book,ref,input.value);this.render();this.commit('cell-edit',{ref,input:input.value,value:getCellValue(this.book,ref)})};input.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();finish()}else if(e.key==='Escape'){resolved=true;this.render()}};input.onblur=finish;
  }
  setActiveInput(value){const ref=this.book.selection.focus||'A1';this.snapshot();setCellInput(this.book,ref,value);this.render();this.commit('cell-edit',{ref,input:value,value:getCellValue(this.book,ref)})}
  copySelection(){
    const a=parseCellRef(this.book.selection.anchor),b=parseCellRef(this.book.selection.focus);if(!a||!b)return;
    const minRow=Math.min(a.row,b.row),maxRow=Math.max(a.row,b.row),minCol=Math.min(a.col,b.col),maxCol=Math.max(a.col,b.col);
    this.clipboard=[];for(let row=minRow;row<=maxRow;row++){const line=[];for(let col=minCol;col<=maxCol;col++){const ref=cellRef(row,col);line.push(this.book.formulas[ref]??getCellValue(this.book,ref))}this.clipboard.push(line)}
    const tsv=this.clipboard.map(line=>line.join('\t')).join('\n');navigator.clipboard?.writeText?.(tsv).catch(()=>{});this.commit('copy',{rows:this.clipboard.length,cols:this.clipboard[0]?.length||0});this.announce('Seleção copiada.')
  }
  pasteSelection(){
    if(!this.clipboard.length){this.announce('Nenhum conteúdo copiado dentro da planilha.');return}
    const start=parseCellRef(this.book.selection.focus||'A1');if(!start)return;this.snapshot();
    this.clipboard.forEach((line,r)=>line.forEach((value,c)=>setCellInput(this.book,cellRef(start.row+r,start.col+c),value)));this.render();this.commit('paste',{start:cellRef(start.row,start.col),rows:this.clipboard.length,cols:this.clipboard[0]?.length||0});this.announce('Conteúdo colado.')
  }
  announce(message){const live=this.host.querySelector('.rs-live');if(live)live.textContent=message}
  renderSelection(){
    const refs=new Set(this.selected());this.host.querySelectorAll('[data-rs-cell]').forEach(cell=>cell.classList.toggle('selected',refs.has(cell.dataset.rsCell)));const focus=this.host.querySelector(`[data-rs-cell="${this.book.selection.focus}"]`);focus?.classList.add('focus-cell');
  }
  updateFormulaBar(){const ref=this.book.selection.focus||'A1',formula=this.book.formulas[ref]??getCellValue(this.book,ref),fmt=this.book.formats?.[ref]||{};const name=this.host.querySelector('[data-rs-name]'),bar=this.host.querySelector('[data-rs-formula]');if(name)name.value=ref;if(bar)bar.value=String(formula??'');const font=this.host.querySelector('[data-rs-font]'),size=this.host.querySelector('[data-rs-size]');if(font&&fmt.font&&[...font.options].some(o=>o.value===fmt.font))font.value=fmt.font;if(size&&fmt.size&&[...size.options].some(o=>Number(o.value)===Number(fmt.size)))size.value=String(fmt.size);this.host.querySelectorAll('[data-rs-format]').forEach(btn=>{const type=btn.dataset.rsFormat,active=type==='align'?Boolean(fmt.align&&fmt.align!=='left'):Boolean(fmt[type]);btn.classList.toggle('active',active);btn.setAttribute('aria-pressed',String(active))})}
  openMenu(type,anchor){
    this.host.querySelector('.rs-popover')?.remove();const items=type==='edit'?[['Desfazer','undo'],['Refazer','redo'],['Limpar seleção','clear']]:type==='data'?[['Criar/alterar filtro','filter'],['Ordenar A → Z','sort-asc'],['Ordenar Z → A','sort-desc'],['Remover filtro','clear-filter']]:type==='view'?[['Congelar linha 1','freeze-header']]:type==='insert'?[['Gráfico','chart-column']]:type==='format'?[['Negrito','bold'],['Centralizar','center'],['Moeda','currency']]:type==='file'?[['Fazer download → PDF (simulado)','export-pdf']]:[['Ajuda da ferramenta','help']];
    const pop=document.createElement('div');pop.className='rs-popover';pop.setAttribute('role','menu');pop.innerHTML=items.map(([label,action])=>`<button role="menuitem" data-rs-pop-action="${action}">${label}</button>`).join('');const app=this.host.querySelector('.real-sheet-app');app.appendChild(pop);const rect=anchor.getBoundingClientRect(),appRect=app.getBoundingClientRect();const preferred=Math.max(8,rect.left-appRect.left),maxLeft=Math.max(8,appRect.width-pop.offsetWidth-8);pop.style.left=`${Math.min(preferred,maxLeft)}px`;pop.style.top=`${Math.min(rect.bottom-appRect.top+4,Math.max(8,appRect.height-pop.offsetHeight-8))}px`;const closeMenu=()=>{pop.remove();anchor.focus?.()};pop.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();closeMenu()}const buttons=[...pop.querySelectorAll('button')],index=buttons.indexOf(document.activeElement);if(event.key==='ArrowDown'){event.preventDefault();buttons[(index+1+buttons.length)%buttons.length]?.focus()}if(event.key==='ArrowUp'){event.preventDefault();buttons[(index-1+buttons.length)%buttons.length]?.focus()}});pop.querySelector('button')?.focus();
    pop.querySelectorAll('[data-rs-pop-action]').forEach(btn=>btn.onclick=()=>{const action=btn.dataset.rsPopAction;pop.remove();if(action==='undo')this.undo();else if(action==='redo')this.redo();else if(action==='filter')this.openFilterDialog(parseCellRef(this.book.selection.focus)?.col||0);else if(action==='sort-asc'||action==='sort-desc'){this.snapshot();this.book.sort={col:parseCellRef(this.book.selection.focus)?.col||0,dir:action.endsWith('desc')?'desc':'asc'};this.render();this.commit(action,{col:this.book.sort.col})}else if(action==='clear-filter'){this.snapshot();this.book.filter=null;this.render();this.commit('clear-filter')}else if(action==='freeze-header'){this.snapshot();this.book.frozenRows=1;this.render();this.commit('freeze-header')}else if(action==='chart-column'){this.snapshot();this.book.chart={type:'column'};this.render();this.commit('chart-column')}else if(action==='bold')this.toggleFormat('bold','bold');else if(action==='center')this.applyFormat('align','center','center');else if(action==='currency')this.toggleFormat('currency','currency');else if(action==='export-pdf'){this.announce('Exportação simulada registrada. Nesta atividade, o arquivo final é gerado pelo fluxo de conclusão.');this.commit('export-pdf')}else if(action==='help'){this.openModal('<div class="rs-dialog-head"><div><strong>Ajuda da planilha</strong><small>Use clique ou toque para selecionar células e duplo clique para editar.</small></div><button data-rs-close>×</button></div><p>Você também pode editar pela barra <b>fx</b>, usar Enter para confirmar, arrastar para selecionar um intervalo e usar os menus de Dados, Formatar e Inserir.</p><div class="rs-dialog-actions"><button class="primary" data-rs-close-help>Entendi</button></div>',modal=>modal.querySelector('[data-rs-close-help]').onclick=()=>this.closeModal());this.commit('help')}else if(action==='clear'){this.snapshot();for(const ref of this.selected())setCellInput(this.book,ref,'');this.render();this.commit('clear')}else this.commit(action)});
  }
  openFilterDialog(col){
    const values=[...new Set(this.book.data.slice(1).map((_,r)=>String(getCellValue(this.book,cellRef(r+1,col)))))].filter(Boolean);this.openModal(`<div class="rs-dialog-head"><div><strong>Filtro da coluna ${escapeHtml(getCellValue(this.book,cellRef(0,col))||columnName(col))}</strong><small>Escolha uma condição ou ordenação.</small></div><button data-rs-close>×</button></div><div class="rs-filter-actions"><button data-rs-sort="asc">Ordenar A → Z</button><button data-rs-sort="desc">Ordenar Z → A</button></div><label class="rs-field">Mostrar linhas que contêm<input data-rs-filter-input value="${escapeAttr(this.book.filter?.col===col?this.book.filter.value:'')}"></label><div class="rs-value-list">${values.map(value=>`<button data-rs-filter-value="${escapeAttr(value)}">${escapeHtml(value)}</button>`).join('')}</div><div class="rs-dialog-actions"><button data-rs-clear-filter>Limpar</button><button class="primary" data-rs-apply-filter>Aplicar filtro</button></div>`,modal=>{
      modal.querySelector('[data-rs-apply-filter]').onclick=()=>{const value=modal.querySelector('[data-rs-filter-input]').value.trim();this.snapshot();this.book.filter=value?{col,value}:null;this.closeModal();this.render();const term=normalizeText(value);const action=term.includes('pendente')?'filter-pending':term.includes('critica')?'filter-critical':term.includes('atrasado')?'filter-delayed':'filter-applied';this.commit(action,{col,value})};
      modal.querySelectorAll('[data-rs-filter-value]').forEach(btn=>btn.onclick=()=>modal.querySelector('[data-rs-filter-input]').value=btn.dataset.rsFilterValue);
      modal.querySelectorAll('[data-rs-sort]').forEach(btn=>btn.onclick=()=>{this.snapshot();this.book.sort={col,dir:btn.dataset.rsSort};this.closeModal();this.render();this.commit(btn.dataset.rsSort==='desc'?'sort-desc':'sort-asc',{col})});
      modal.querySelector('[data-rs-clear-filter]').onclick=()=>{this.snapshot();this.book.filter=null;this.closeModal();this.render();this.commit('clear-filter')};
    });
  }
  openShareDialog(){
    const s=this.book.share;this.openModal(`<div class="rs-dialog-head"><div><strong>Compartilhar “${escapeHtml(this.title)}”</strong><small>Controle quem pode acessar este arquivo simulado.</small></div><button data-rs-close>×</button></div><label class="rs-field">Adicionar pessoas e grupos<div class="rs-person-entry"><input data-rs-person placeholder="nome@simulacao.edu.br"><select data-rs-person-role><option value="reader">Leitor</option><option value="commenter">Comentador</option><option value="editor">Editor</option></select><button data-rs-add-person>Adicionar</button></div></label><div class="rs-people-list">${s.people.length?s.people.map((p,i)=>`<div><span class="rs-avatar">${escapeHtml(p.email.slice(0,1).toUpperCase())}</span><span><strong>${escapeHtml(p.email)}</strong><small>Acesso concedido</small></span><select data-rs-existing-role="${i}"><option value="reader" ${p.role==='reader'?'selected':''}>Leitor</option><option value="commenter" ${p.role==='commenter'?'selected':''}>Comentador</option><option value="editor" ${p.role==='editor'?'selected':''}>Editor</option></select><button data-rs-remove-person="${i}" aria-label="Remover">×</button></div>`).join(''):'<p>Nenhuma pessoa adicionada.</p>'}</div><section class="rs-general-access"><strong>Acesso geral</strong><select data-rs-general><option value="restricted" ${s.general==='restricted'?'selected':''}>Restrito</option><option value="link" ${s.general==='link'?'selected':''}>Qualquer pessoa com o link</option></select><select data-rs-general-role ${s.general==='link'?'':'disabled'}><option value="reader" ${s.role==='reader'?'selected':''}>Leitor</option><option value="commenter" ${s.role==='commenter'?'selected':''}>Comentador</option><option value="editor" ${s.role==='editor'?'selected':''}>Editor</option></select><p data-rs-permission-help>${this.permissionHelp(s.role)}</p></section><div class="rs-dialog-actions"><button data-rs-copy-link>🔗 Copiar link</button><button class="primary" data-rs-save-share>Concluído</button></div>`,modal=>{
      const general=modal.querySelector('[data-rs-general]'),role=modal.querySelector('[data-rs-general-role]');general.onchange=()=>{role.disabled=general.value!=='link'};role.onchange=()=>modal.querySelector('[data-rs-permission-help]').textContent=this.permissionHelp(role.value);
      modal.querySelector('[data-rs-add-person]').onclick=()=>{const email=modal.querySelector('[data-rs-person]').value.trim(),personRole=modal.querySelector('[data-rs-person-role]').value;if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)){modal.querySelector('[data-rs-person]').setCustomValidity('Informe um e-mail fictício válido.');modal.querySelector('[data-rs-person]').reportValidity();return}this.snapshot();this.book.share.people.push({email,role:personRole});this.closeModal();this.render();this.commit(`share-${personRole}`,{email,scope:'person'});this.openShareDialog()};
      modal.querySelectorAll('[data-rs-existing-role]').forEach(select=>select.onchange=()=>{this.snapshot();this.book.share.people[Number(select.dataset.rsExistingRole)].role=select.value;this.commit(`share-${select.value}`,{scope:'person-update'})});
      modal.querySelectorAll('[data-rs-remove-person]').forEach(btn=>btn.onclick=()=>{this.snapshot();this.book.share.people.splice(Number(btn.dataset.rsRemovePerson),1);this.closeModal();this.render();this.commit('share-remove');this.openShareDialog()});
      modal.querySelector('[data-rs-copy-link]').onclick=async()=>{this.snapshot();this.book.share.linkCopied=true;try{await navigator.clipboard?.writeText('https://planilhas.agv.local/arquivo-simulado')}catch{}modal.querySelector('[data-rs-copy-link]').textContent='✓ Link copiado';this.commit('share-link-copied',{general:general.value,role:role.value})};
      modal.querySelector('[data-rs-save-share]').onclick=()=>{this.snapshot();this.book.share.general=general.value;this.book.share.role=role.value;this.closeModal();this.render();this.commit(`share-${role.value}`,{general:general.value,role:role.value})};
    });
  }
  roleLabel(role){return role==='editor'?'Editor':role==='commenter'?'Comentador':'Leitor'}
  permissionHelp(role){return role==='editor'?'Pode alterar dados, fórmulas e compartilhamento.':role==='commenter'?'Pode visualizar e registrar comentários, sem alterar as células.':'Pode apenas visualizar e fazer download quando permitido.'}
  openModal(html,onReady){this.closeModal();this.modalReturnFocus=document.activeElement instanceof HTMLElement?document.activeElement:null;const overlay=document.createElement('div');overlay.className='rs-modal-backdrop';overlay.innerHTML=`<div class="rs-dialog" role="dialog" aria-modal="true" tabindex="-1">${html}</div>`;this.host.querySelector('.real-sheet-app').appendChild(overlay);const dialog=overlay.querySelector('.rs-dialog'),heading=dialog.querySelector('strong,h2,h3');if(heading){heading.id=heading.id||`rs-dialog-title-${Date.now()}`;dialog.setAttribute('aria-labelledby',heading.id)}overlay.onclick=e=>{if(e.target===overlay)this.closeModal()};overlay.querySelector('[data-rs-close]')?.addEventListener('click',()=>this.closeModal());overlay.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();this.closeModal();return}if(event.key!=='Tab')return;const items=[...dialog.querySelectorAll('button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])')].filter(node=>node.getClientRects().length);if(!items.length){event.preventDefault();dialog.focus();return}const first=items[0],last=items.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}});onReady?.(dialog);requestAnimationFrame(()=>{(dialog.querySelector('input,select,button')||dialog).focus({preventScroll:true})})}
  closeModal(){const overlay=this.host.querySelector('.rs-modal-backdrop');if(!overlay)return;overlay.remove();const target=this.modalReturnFocus;this.modalReturnFocus=null;if(target?.isConnected)target.focus({preventScroll:true})}
}
function escapeHtml(value=''){return String(value).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]))}
function escapeAttr(value=''){return escapeHtml(value).replace(/`/g,'&#96;')}
