// v14.10.0 — construtor puro do preview HTML/CSS/JS.
// Mantém a semântica de scripts deferidos: arquivos locais com `defer` são
// movidos para o fim do body quando viram inline, evitando execução antes do DOM.
function normalizeAssetName(value){
  return String(value||'').trim().replace(/[?#].*$/,'').replace(/^\.\//,'');
}
function escapeClosingScript(value){
  return String(value??'').replace(/<\/script/gi,'<\\/script');
}
function assetLookup(files,extensionRx){
  const map=new Map();
  for(const file of files||[]){
    const name=normalizeAssetName(file?.filename);
    if(!name||!extensionRx.test(name))continue;
    map.set(name,String(file?.content??''));
    const base=name.split('/').pop();
    if(base&&!map.has(base))map.set(base,String(file?.content??''));
  }
  return map;
}
export function buildHtmlPreview(files){
  const list=Array.isArray(files)?files:[];
  const htmlFile=list.find(f=>/\.html?$/i.test(String(f?.filename||'')));
  if(!htmlFile)return null;
  let html=String(htmlFile.content??'');
  const css=assetLookup(list,/\.css$/i),js=assetLookup(list,/\.(?:js|mjs)$/i);

  html=html.replace(/<link\b([^>]*?)href=["']([^"']+)["']([^>]*)>/gi,(full,before,href,after)=>{
    const key=normalizeAssetName(href),content=css.get(key)??css.get(key.split('/').pop());
    if(content===undefined)return full;
    return `<style data-agv-preview-source="${key.replace(/["&<>]/g,'')}">${content}</style>`;
  });

  const deferred=[];
  html=html.replace(/<script\b([^>]*?)src=["']([^"']+)["']([^>]*)><\/script>/gi,(full,before,src,after)=>{
    const key=normalizeAssetName(src),content=js.get(key)??js.get(key.split('/').pop());
    if(content===undefined)return full;
    const attrs=`${before||''} ${after||''}`;
    const safe=escapeClosingScript(content);
    const isModule=/\btype\s*=\s*["']module["']/i.test(attrs);
    const isDeferred=/\bdefer\b/i.test(attrs);
    if(isDeferred&&!isModule){
      deferred.push(`<script data-agv-preview-source="${key.replace(/["&<>]/g,'')}">${safe}<\/script>`);
      return `<!-- AGV preview: ${key} adiado até o DOM -->`;
    }
    const moduleAttr=isModule?' type="module"':'';
    return `<script${moduleAttr} data-agv-preview-source="${key.replace(/["&<>]/g,'')}">${safe}<\/script>`;
  });

  if(deferred.length){
    const block=`\n${deferred.join('\n')}\n`;
    if(/<\/body\s*>/i.test(html))html=html.replace(/<\/body\s*>/i,`${block}</body>`);
    else html+=block;
  }
  return html;
}
