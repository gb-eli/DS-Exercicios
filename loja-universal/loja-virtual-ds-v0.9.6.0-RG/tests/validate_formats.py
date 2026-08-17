from pathlib import Path
import json, gzip, sys
try:
    import brotli
except Exception as exc:
    print(f'brotli indisponível: {exc}')
    sys.exit(1)
from PIL import Image

root=Path(__file__).resolve().parents[1]
errors=[]

glb=json.loads((root/'reports/glb-format-comparison.json').read_text())
img=json.loads((root/'reports/image-format-comparison.json').read_text())
probe=json.loads((root/'reports/toolchain-probe.json').read_text())

if glb['summary']['modelCount'] < 39: errors.append('menos de 39 GLBs analisados')
if glb['summary']['brotliReductionPct'] <= 0: errors.append('Brotli sem ganho')
if glb['summary']['gzipReductionPct'] <= 0: errors.append('Gzip sem ganho')
if img['summary']['sampleCount'] < 8: errors.append('menos de 8 imagens analisadas')
for required in ['webp-lossless','webp-q90','webp-q80','avif-q80']:
    if required not in img['summary']['variants']: errors.append(f'variante ausente: {required}')

for sample in glb['summary']['selectedSamples']:
    source=root/sample['path']
    folder=root/'lab/formats/glb-transfer'/source.stem
    gz=folder/(source.name+'.gz')
    br=folder/(source.name+'.br')
    if not source.exists() or not gz.exists() or not br.exists():
        errors.append(f'amostra GLB incompleta: {source.name}')
        continue
    raw=source.read_bytes()
    if gzip.decompress(gz.read_bytes()) != raw: errors.append(f'gzip inválido: {source.name}')
    if brotli.decompress(br.read_bytes()) != raw: errors.append(f'brotli inválido: {source.name}')
    split=sample.get('split',{})
    for key in ['gltf','bin']:
        p=root/split.get(key,'')
        if not p.is_file(): errors.append(f'split ausente: {key} de {source.name}')

for row in img['variants']:
    if 'error' in row: errors.append(f"conversão falhou: {row['source']} {row['variant']}")
    else:
        p=root/row['path']
        try:
            with Image.open(p) as im: im.verify()
        except Exception as exc:
            errors.append(f'imagem inválida {p}: {exc}')

for path in ['demo/formats.html','config/format-pipeline.config.json','reports/format-decision-matrix.json','docs/LABORATORIO_FORMATOS_v0.9.2.md']:
    if not (root/path).is_file(): errors.append(f'arquivo ausente: {path}')

manifest=json.loads((root/'manifest.json').read_text())
if manifest.get('version')!='0.9.2': errors.append('manifest não está em 0.9.2')
if manifest.get('formatLab',{}).get('meshopt') != 'not-encoded-toolchain-unavailable': errors.append('estado Meshopt incorreto')

result={
    'status':'PASS' if not errors else 'FAIL',
    'errors':errors,
    'glbModels':glb['summary']['modelCount'],
    'imageSamples':img['summary']['sampleCount'],
    'imageVariants':sum(v['files'] for v in img['summary']['variants'].values()),
    'gzipReductionPct':glb['summary']['gzipReductionPct'],
    'brotliReductionPct':glb['summary']['brotliReductionPct'],
    'nativeEncoders':{k:v['available'] for k,v in probe.items() if isinstance(v,dict) and 'available' in v}
}
print(json.dumps(result,ensure_ascii=False,indent=2))
if errors: sys.exit(1)
