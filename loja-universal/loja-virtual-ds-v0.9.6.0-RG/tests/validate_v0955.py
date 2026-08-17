from pathlib import Path
import json,hashlib
from PIL import Image
root=Path(__file__).resolve().parents[1]
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
# v0.9.6.0-RG intentionally rebuilds GLB geometry. Fidelity is now structural,
# not byte identity against the old low-poly v0.9.5.4 models.
rep=json.loads((root/'reports/graphics-recovery-validation-v0.9.6.0-RG.json').read_text())
assert rep['glbCount']==39
assert rep['hierarchyPreserved'] and rep['animationCountsPreserved'] and rep['materialsPreserved']
assert rep['lodTriangles']=={'lod0':39168,'lod1':8448,'lod2':1680}
for x in rep['glbs']:
 assert x['nodesPreserved'] and x['meshesPreserved'] and x['animationsPreserved'] and x['materialsPreserved'],x['path']
for tier in ['ultra','realism']:
 d=root/'assets/runtime'/tier
 assert d.exists()
 for name,size in [('env-'+tier+'-2048.webp',(2048,1024)),('material-detail-'+tier+'-1024.webp',(1024,1024)),('stage-'+tier+'-1920.webp',(1920,1080))]:
  p=d/name;assert p.exists(),p
  with Image.open(p) as im:assert im.size==size,(p,im.size)
for pack in ['graphics-ultra-core','graphics-cinematic']:
 o=json.loads((root/'packs'/f'{pack}.json').read_text());assert o['premium3DAssets'] and o['assetMaturity']=='premium-runtime-v1'
 for f in o['files']:
  p=root/f['path'].replace('../','');assert p.exists(),p;assert sha(p)==f['sha256'],p
js=(root/'demo/renderer-profile.js').read_text();assert 'u_envMap' in js and 'u_detailMap' in js and 'u_clearcoat' in js and 'createImageBitmap' in js
html=(root/'demo/index.html').read_text();assert 'premiumAssetStatus' in html and 'v0.9.6.0-RG' in html
print(json.dumps({'ok':True,'version':'0.9.6.0-RG','glbs':rep['glbCount'],'premium':True,'geometryRebuilt':True},ensure_ascii=False))
