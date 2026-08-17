from pathlib import Path
import json,re,struct,sys
root=Path(__file__).resolve().parents[1]
errors=[]
for f in ['demo/performance-manager.js','demo/product3d.js','config/graphics.config.json','config/performance.config.json','docs/PERFORMANCE_ADAPTATIVA.md']:
    if not (root/f).exists(): errors.append('missing '+f)
perf=json.loads((root/'config/performance.config.json').read_text())
if 'ultraAdvanced' not in perf['qualityModes']: errors.append('ultraAdvanced missing')
html=(root/'demo/index.html').read_text()
for id in ['performanceView','product3dCanvas','runGraphicsBenchmark','performanceHud']:
    if f'id="{id}"' not in html: errors.append('html id '+id)
items=json.loads((root/'catalog/items.json').read_text())['items']
models=[x for x in items if x.get('model3d')]
if len(models)<30: errors.append('too few model3d items')
for item in models:
    p=(root/'demo'/item['model3d']).resolve()
    if not p.exists(): errors.append('model missing '+item['id'])
    else:
        b=p.read_bytes()[:4]
        if b!=b'glTF': errors.append('bad glb '+item['id'])
print(json.dumps({'ok':not errors,'errors':errors,'model3d':len(models)},ensure_ascii=False,indent=2))
sys.exit(1 if errors else 0)
