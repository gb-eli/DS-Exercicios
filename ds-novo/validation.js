
function fileMap(files, active, editorValue){
  return Object.fromEntries(files.map(f=>[f.filename, f.id===active?.id ? editorValue : (f.content||'')]));
}
function esc(s){return String(s||'').replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));}
function countTag(html,tag){const m=html.match(new RegExp(`<${tag}(?:\\s|>)`,'gi')); return m?m.length:0;}
export function validateExercise(meta, files, active, editorValue){
  const map=fileMap(files,active,editorValue);
  const results=[];
  const validation=meta?.validacao||{};
  if(validation.minChars){
    const content=Object.values(map).join('\n');
    results.push({ok:content.length>=validation.minChars,label:`Mínimo de ${validation.minChars} caracteres`});
  }
  if(Array.isArray(validation.regras)){
    for(const rule of validation.regras){
      const content=map[rule.arquivo]||'';
      const pats=(rule.padroes||[]).map(p=>{try{return new RegExp(p,'ms')}catch{return null}}).filter(Boolean);
      const hits=pats.map(rx=>rx.test(content));
      const ok=rule.modo==='todos'?hits.every(Boolean):hits.some(Boolean);
      results.push({ok,label:rule.rotulo||'Critério do exercício'});
    }
  }
  const hs=validation.htmlSemantico || validation.htmlEstrutura;
  if(hs){
    const html=map['index.html']||map['html']||'';
    if(hs.doctype) results.push({ok:/<!doctype\s+html/i.test(html),label:'DOCTYPE HTML'});
    if(hs.idioma) results.push({ok:/<html[^>]+lang=/i.test(html),label:'Idioma da página'});
    if(hs.charset) results.push({ok:/<meta[^>]+charset=/i.test(html),label:'Charset'});
    if(hs.viewport) results.push({ok:/<meta[^>]+name=["']viewport["']/i.test(html),label:'Meta viewport'});
    for(const [tag,min] of Object.entries(hs.tagsMinimas||{})){
      results.push({ok:countTag(html,tag)>=min,label:`<${tag}>: mínimo ${min}`});
    }
    for(const id of hs.idsObrigatorios||[]){
      results.push({ok:new RegExp(`id=["']${id.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}["']`).test(html),label:`ID obrigatório: ${id}`});
    }
  }
  return results;
}
export function renderValidation(results){
  if(!results.length) return '<p class="muted">Este exercício ainda não possui validação automática migrada. O código continua sendo salvo normalmente.</p>';
  const ok=results.filter(r=>r.ok).length;
  const pct=Math.round(ok/results.length*100);
  return `<div class="validation-summary"><strong>${pct}% dos critérios detectados</strong><span>${ok}/${results.length}</span></div>`+
    results.map(r=>`<div class="validation-row ${r.ok?'ok':'pending'}"><span>${r.ok?'✓':'○'}</span><span>${esc(r.label)}</span></div>`).join('');
}
