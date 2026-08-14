from pathlib import Path
import json, subprocess, hashlib, re
root=Path(__file__).resolve().parents[1]
assert (root/'VERSION').read_text().strip()=='0.9.4.4'
manifest=json.loads((root/'manifest.json').read_text(encoding='utf-8'))
assert manifest['version']=='0.9.4.4' and manifest['incrementalCache'] is True
cfg=json.loads((root/'config/cache-memory.config.json').read_text(encoding='utf-8'))
assert cfg['incrementalUpdate']['enabled'] and cfg['lru']['enabled']
idx=json.loads((root/'packs/packages.json').read_text(encoding='utf-8'))
assert idx['storeVersion']=='0.9.4.4' and len(idx['packs'])==8
html=(root/'demo/index.html').read_text(encoding='utf-8')
for token in ['cache-memory-manager.js','memoryLruTable','simulateMemoryPressure','memoryBudgetSelect']:
    assert token in html, token
app=(root/'demo/app.js').read_text(encoding='utf-8')
assert 'ds-view-change' in app
cm=(root/'demo/cache-memory-manager.js').read_text(encoding='utf-8')
for token in ['releaseModule','enforceBudget','attachWebGL','simulatePressure','webglcontextlost']:
    assert token in cm, token
pm=(root/'demo/package-manager.js').read_text(encoding='utf-8')
for token in ['SHARED_ASSET_CACHE','findReusable','ensureQuota','cleanLRUPacks','fileIndex']:
    assert token in pm, token
av=(root/'demo/avatar3d.js').read_text(encoding='utf-8')
prod=(root/'demo/product3d.js').read_text(encoding='utf-8')
vfx=(root/'demo/vfx-engine.js').read_text(encoding='utf-8')
assert 'deleteBuffer' in av and 'releaseUnusedEquipment' in av
assert 'deleteBuffer' in prod and 'releaseCache' in prod
assert 'DSCacheMemory' in vfx
files=['demo/cache-memory-manager.js','demo/package-manager.js','demo/app.js','demo/avatar3d.js','demo/product3d.js','demo/vfx-engine.js','sw.js']
syntax={}
for f in files:
    p=root/f
    r=subprocess.run(['node','--check',str(p)],capture_output=True,text=True)
    syntax[f]=r.returncode==0
    assert r.returncode==0,(f,r.stderr)
reg=subprocess.run(['python',str(root/'tests/run_regression.py')],capture_output=True,text=True)
assert reg.returncode==0,reg.stderr+reg.stdout
print(json.dumps({'passed':True,'packs':len(idx['packs']),'syntax':syntax,'regression':'passed','features':8},ensure_ascii=False))
