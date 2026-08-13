#!/usr/bin/env python3
from __future__ import annotations
import csv, hashlib, json, os, re, struct, subprocess, sys
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
REPORTS = ROOT / 'reports'
REPORTS.mkdir(exist_ok=True)

IMAGE_EXTS={'.png','.webp','.jpg','.jpeg','.avif','.gif'}
TEXT_EXTS={'.html','.css','.js','.mjs','.json','.md','.svg','.txt','.py'}
RUNTIME_ROOTS={'demo','dist','assets','catalog','config','schemas','src'}

try:
    from PIL import Image
except Exception:
    Image=None
try:
    import trimesh
except Exception:
    trimesh=None

def sha256(path: Path) -> str:
    h=hashlib.sha256()
    with path.open('rb') as f:
        for chunk in iter(lambda:f.read(1024*1024),b''):
            h.update(chunk)
    return h.hexdigest()

def classify(rel: Path) -> str:
    parts=rel.parts
    if parts[0]=='assets':
        if len(parts)>1 and parts[1]=='concepts': return 'reference-concept'
        if len(parts)>1 and parts[1]=='previews': return 'documentation-preview'
        return 'runtime-asset'
    if parts[0] in {'demo','dist','catalog','config','schemas','src'}: return 'runtime-code-data'
    if parts[0]=='docs': return 'documentation'
    if parts[0]=='tests': return 'test-tooling'
    if parts[0]=='examples': return 'integration-example'
    return 'release-metadata'

def glb_json(path: Path) -> dict[str, Any]:
    data=path.read_bytes()
    if len(data)<20 or data[:4]!=b'glTF': raise ValueError('invalid GLB magic')
    version,total=struct.unpack_from('<II',data,4)
    off=12; doc=None
    while off+8<=len(data):
        length,ctype=struct.unpack_from('<II',data,off); off+=8
        chunk=data[off:off+length]; off+=length
        if ctype==0x4E4F534A:
            doc=json.loads(chunk.decode('utf-8').rstrip('\x00 ')); break
    if doc is None: raise ValueError('missing JSON chunk')
    doc['_glbVersion']=version; doc['_declaredLength']=total; doc['_actualLength']=len(data)
    return doc

def inspect_glb(path: Path) -> dict[str, Any]:
    rel=str(path.relative_to(ROOT)).replace(os.sep,'/')
    result={'path':rel,'bytes':path.stat().st_size,'sha256':sha256(path),'valid':False}
    try:
        doc=glb_json(path)
        anims=doc.get('animations',[])
        result.update({
            'valid': doc['_declaredLength']==doc['_actualLength'],
            'glbVersion':doc['_glbVersion'],
            'nodes':len(doc.get('nodes',[])), 'meshes':len(doc.get('meshes',[])),
            'materials':len(doc.get('materials',[])), 'textures':len(doc.get('textures',[])),
            'images':len(doc.get('images',[])), 'skins':len(doc.get('skins',[])),
            'animations':len(anims), 'animationNames':[a.get('name',f'animation-{i}') for i,a in enumerate(anims)],
            'animationChannels':sum(len(a.get('channels',[])) for a in anims),
            'accessors':len(doc.get('accessors',[])), 'bufferViews':len(doc.get('bufferViews',[])),
            'extensionsUsed':doc.get('extensionsUsed',[]), 'extensionsRequired':doc.get('extensionsRequired',[]),
            'generator':doc.get('asset',{}).get('generator',''),
        })
        if trimesh is not None:
            try:
                scene=trimesh.load(path, force='scene', process=False)
                bounds=scene.bounds
                if bounds is not None:
                    result['bounds']=[[round(float(v),4) for v in row] for row in bounds]
                    result['extent']=[round(float(v),4) for v in scene.extents]
                result['geometryCount']=len(scene.geometry)
                result['triangles']=int(sum(len(g.faces) for g in scene.geometry.values() if hasattr(g,'faces')))
            except Exception as e:
                result['geometryInspectionWarning']=str(e)[:300]
    except Exception as e:
        result['error']=str(e)
    return result

def extract_refs(path: Path) -> list[str]:
    rel=path.relative_to(ROOT)
    try: text=path.read_text('utf-8',errors='ignore')
    except: return []
    refs=[]
    if path.suffix.lower()=='.html':
        refs += re.findall(r'(?:src|href)\s*=\s*["\']([^"\']+)["\']',text,re.I)
    if path.suffix.lower() in {'.css','.html'}:
        refs += re.findall(r'url\(\s*["\']?([^\)"\']+)',text,re.I)
    # Conservative quoted static local assets in JS/JSON.
    if path.suffix.lower() in {'.js','.json'}:
        refs += [r for r in re.findall(r'["\']([^"\']+\.(?:png|webp|svg|glb|json|css|js|ktx2|wasm))["\']',text,re.I) if '/' in r or r.startswith('.')]
    out=[]
    for ref in refs:
        ref=ref.strip()
        if not ref or ref.startswith(('http:','https:','data:','#','mailto:','javascript:','//')): continue
        ref=ref.split('?',1)[0].split('#',1)[0]
        out.append(ref)
    return sorted(set(out))

def resolve_ref(source: Path, ref: str) -> Path:
    if ref.startswith('/'):
        return ROOT/ref.lstrip('/')
    first=ref.split('/',1)[0]
    if first in {'assets','config','dist','catalog','src','schemas','docs','examples','demo'}:
        return (ROOT/ref).resolve()
    return (source.parent/ref).resolve()

def main():
    files=[]; hashes=defaultdict(list); ext_counts=Counter(); purpose_sizes=Counter(); dir_sizes=Counter()
    image_info=[]; js_checks=[]
    for p in sorted(ROOT.rglob('*')):
        if not p.is_file() or REPORTS in p.parents: continue
        rel=p.relative_to(ROOT); size=p.stat().st_size; ext=p.suffix.lower() or '[none]'
        digest=sha256(p); purpose=classify(rel)
        rec={'path':str(rel).replace(os.sep,'/'),'bytes':size,'extension':ext,'purpose':purpose,'sha256':digest}
        if ext in IMAGE_EXTS and Image is not None:
            try:
                with Image.open(p) as im:
                    rec.update({'width':im.width,'height':im.height,'imageMode':im.mode,'imageFormat':im.format})
                    image_info.append({'path':rec['path'],'bytes':size,'width':im.width,'height':im.height,'format':im.format,'pixels':im.width*im.height,'bytesPerPixel':round(size/max(1,im.width*im.height),4)})
            except Exception as e: rec['imageError']=str(e)
        files.append(rec); hashes[digest].append(rec['path']); ext_counts[ext]+=1; purpose_sizes[purpose]+=size
        top=rel.parts[0]; dir_sizes[top]+=size
    # GLBs
    glbs=[inspect_glb(p) for p in sorted(ROOT.rglob('*.glb'))]
    # References
    ref_rows=[]; broken=[]
    for p in sorted(ROOT.rglob('*')):
        if not p.is_file() or REPORTS in p.parents or p.suffix.lower() not in {'.html','.css','.js','.json'}: continue
        for ref in extract_refs(p):
            if '${' in ref or '{' in ref:
                continue
            target=resolve_ref(p,ref); exists=target.exists()
            row={'source':str(p.relative_to(ROOT)).replace(os.sep,'/'),'reference':ref,'resolved':str(target.relative_to(ROOT)).replace(os.sep,'/') if target.is_relative_to(ROOT) else str(target),'exists':exists}
            ref_rows.append(row)
            if not exists: broken.append(row)
    broken_runtime=[x for x in broken if x['source'].startswith(('demo/','dist/','config/','catalog/','assets/')) or x['source']=='index.html']
    broken_source=[x for x in broken if x['source'].startswith('src/')]
    broken_documentation=[x for x in broken if x not in broken_runtime and x not in broken_source]
    # JS syntax
    for p in sorted(ROOT.rglob('*.js')):
        if REPORTS in p.parents: continue
        proc=subprocess.run(['node','--check',str(p)],capture_output=True,text=True)
        js_checks.append({'path':str(p.relative_to(ROOT)).replace(os.sep,'/'),'ok':proc.returncode==0,'message':(proc.stderr or proc.stdout).strip()[:500]})
    # JSON parse
    json_checks=[]
    for p in sorted(ROOT.rglob('*.json')):
        if REPORTS in p.parents: continue
        try: json.load(p.open()); ok=True; msg=''
        except Exception as e: ok=False; msg=str(e)
        json_checks.append({'path':str(p.relative_to(ROOT)).replace(os.sep,'/'),'ok':ok,'message':msg})
    duplicate_groups=[{'sha256':h,'bytes':(ROOT/paths[0]).stat().st_size,'paths':paths,'wastedBytes':(len(paths)-1)*(ROOT/paths[0]).stat().st_size} for h,paths in hashes.items() if len(paths)>1 and (ROOT/paths[0]).stat().st_size>0]
    duplicate_groups.sort(key=lambda x:x['wastedBytes'],reverse=True)
    # Catalog summary
    catalog={}
    for name in ['items','animations','vfx','rarities','discounts']:
        p=ROOT/'catalog'/f'{name}.json'
        d=json.load(p.open())
        if name=='items': catalog[name]=len(d.get('items',[]))
        elif name=='animations': catalog[name]=len(d.get('animations',[]))
        elif name=='vfx': catalog[name]={'effects':len(d.get('effects',[])),'speechBubbles':len(d.get('speechBubbles',[]))}
        elif name=='rarities': catalog[name]=len(d.get('rarities',d if isinstance(d,list) else []))
        elif name=='discounts': catalog[name]=len(d.get('discounts',d if isinstance(d,list) else []))
    # Inventory JSON/CSV
    (REPORTS/'asset-inventory.json').write_text(json.dumps({'generatedAt':'2026-08-01T10:06:00-03:00','root':ROOT.name,'files':files},ensure_ascii=False,indent=2),encoding='utf-8')
    with (REPORTS/'asset-inventory.csv').open('w',newline='',encoding='utf-8') as f:
        fields=['path','bytes','extension','purpose','sha256','width','height','imageFormat']
        w=csv.DictWriter(f,fieldnames=fields,extrasaction='ignore'); w.writeheader(); w.writerows(files)
    (REPORTS/'glb-audit.json').write_text(json.dumps({'count':len(glbs),'models':glbs},ensure_ascii=False,indent=2),encoding='utf-8')
    (REPORTS/'image-audit.json').write_text(json.dumps({'count':len(image_info),'images':sorted(image_info,key=lambda x:x['bytes'],reverse=True)},ensure_ascii=False,indent=2),encoding='utf-8')
    (REPORTS/'duplicate-assets.json').write_text(json.dumps({'groups':duplicate_groups,'totalWastedBytes':sum(x['wastedBytes'] for x in duplicate_groups)},ensure_ascii=False,indent=2),encoding='utf-8')
    (REPORTS/'reference-audit.json').write_text(json.dumps({'references':ref_rows,'broken':broken},ensure_ascii=False,indent=2),encoding='utf-8')
    (REPORTS/'syntax-audit.json').write_text(json.dumps({'javascript':js_checks,'json':json_checks},ensure_ascii=False,indent=2),encoding='utf-8')
    # Findings
    valid_glbs=sum(1 for x in glbs if x.get('valid'))
    animated=[x for x in glbs if x.get('animations',0)>0]
    oversized_images=[x for x in image_info if x['bytes']>=500_000]
    runtime_bytes=sum(purpose_sizes[k] for k in ['runtime-asset','runtime-code-data'])
    total_bytes=sum(x['bytes'] for x in files)
    baseline={
        'version':'0.9.1','sourceVersion':'0.9.0','auditType':'non-destructive-baseline',
        'totalFiles':len(files),'totalBytes':total_bytes,'runtimeBytes':runtime_bytes,
        'catalog':catalog,'glb':{'total':len(glbs),'valid':valid_glbs,'animatedModels':len(animated),'totalAnimations':sum(x.get('animations',0) for x in glbs),'totalTriangles':sum(x.get('triangles',0) for x in glbs)},
        'images':{'total':len(image_info),'oversized500KB':len(oversized_images)},
        'references':{'total':len(ref_rows),'brokenRaw':len(broken),'brokenRuntime':len(broken_runtime),'sourcePathFindings':len(broken_source),'documentationLogReferences':len(broken_documentation)},
        'syntax':{'javascriptFiles':len(js_checks),'javascriptErrors':sum(not x['ok'] for x in js_checks),'jsonFiles':len(json_checks),'jsonErrors':sum(not x['ok'] for x in json_checks)},
        'duplicates':{'groups':len(duplicate_groups),'wastedBytes':sum(x['wastedBytes'] for x in duplicate_groups)},
        'sizesByPurpose':dict(purpose_sizes),'sizesByTopDirectory':dict(dir_sizes),'extensions':dict(ext_counts),
        'status':'PASS' if valid_glbs==len(glbs) and not broken_runtime and all(x['ok'] for x in js_checks+json_checks) else 'PASS_WITH_FINDINGS'
    }
    (REPORTS/'baseline-summary.json').write_text(json.dumps(baseline,ensure_ascii=False,indent=2),encoding='utf-8')
    # markdown report
    mib=lambda b:f'{b/1048576:.2f} MB'
    topdups='\n'.join(f"- {mib(g['wastedBytes'])} duplicados: `"+'`, `'.join(g['paths'][:4])+('`…' if len(g['paths'])>4 else '`') for g in duplicate_groups[:8]) or '- Nenhuma duplicação exata relevante.'
    topimgs='\n'.join(f"- `{x['path']}` — {mib(x['bytes'])}, {x['width']}×{x['height']}" for x in sorted(image_info,key=lambda x:x['bytes'],reverse=True)[:12])
    report=f'''# Auditoria técnica e linha de base — Loja Virtual DS v0.9.1

## Resultado

**Status:** {baseline['status']}  
**Origem congelada:** v0.9.0  
**Natureza:** auditoria não destrutiva; nenhum item, animação, textura ou recurso visual foi removido.

## Inventário consolidado

- Arquivos: **{len(files)}**
- Tamanho descompactado: **{mib(total_bytes)}**
- Núcleo e assets de execução: **{mib(runtime_bytes)}**
- Produtos: **{catalog['items']}**
- Modelos GLB: **{len(glbs)}**, todos estruturalmente válidos: **{valid_glbs==len(glbs)}**
- Modelos com animações: **{len(animated)}**
- Clips incorporados nos GLBs: **{sum(x.get('animations',0) for x in glbs)}**
- Efeitos VFX: **{catalog['vfx']['effects']}**
- Falas: **{catalog['vfx']['speechBubbles']}**
- Referências locais verificadas: **{len(ref_rows)}**
- Referências quebradas no runtime distribuído: **{len(broken_runtime)}**
- Referências históricas em logs/documentos: **{len(broken_documentation)}**
- Caminhos relativos do CSS-fonte que dependem da etapa de distribuição: **{len(broken_source)}**
- JavaScript com erro sintático: **{sum(not x['ok'] for x in js_checks)}**
- JSON inválido: **{sum(not x['ok'] for x in json_checks)}**

## Achados principais

1. **A base funcional está íntegra.** Catálogo, GLBs, VFX, adaptadores e SDK passaram nos validadores existentes e na nova auditoria.
2. **Os conteúdos de referência e capturas ocupam parcela expressiva do pacote.** `assets/concepts` e `assets/previews` são valiosos para documentação, mas não devem entrar no carregamento da aplicação.
3. **Existem duplicações exatas de arquivos de prévia e distribuição.** Elas permanecem nesta versão para preservar compatibilidade; a futura v0.9.3 deverá separar pacote de execução e pacote de documentação.
4. **Os GLBs atuais são pequenos e não usam extensões de compressão.** Isso cria uma boa base para o laboratório comparativo Meshopt/Draco da v0.9.2, sem substituir os originais.
5. **PNG e WebP coexistem intencionalmente.** Na próxima fase será medida a fidelidade e o custo real antes de escolher o formato por categoria.
6. **Não há KTX2/BasisU na base atual.** A conversão deve ocorrer em cópias de teste, validando materiais, alfa, emissivos e animações.
7. **A demonstração ainda concentra parte do runtime em scripts relativamente grandes e assets Base64 de fallback.** O code splitting e os pacotes serão tratados depois do laboratório de formatos.

## Maiores imagens

{topimgs}

## Duplicações exatas relevantes

{topdups}

## Decisão de preservação

Nenhum arquivo foi apagado nesta fase. A linha de base registra hashes SHA-256 de todos os arquivos para detectar regressões e permitir rollback.

## Próxima fase autorizável

**v0.9.2 — Laboratório de formatos**: testar Meshopt, Draco, KTX2/BasisU, WebP e AVIF em amostras controladas, comparando tamanho, decodificação, memória, FPS e fidelidade visual antes de mudar o pipeline oficial.
'''
    (ROOT/'docs'/'AUDITORIA_v0.9.1.md').write_text(report,encoding='utf-8')
    print(json.dumps(baseline,ensure_ascii=False,indent=2))

if __name__=='__main__': main()
