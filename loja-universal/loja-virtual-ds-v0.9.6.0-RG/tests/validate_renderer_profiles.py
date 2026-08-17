from pathlib import Path
import json,hashlib
root=Path(__file__).resolve().parents[1]
cfg=json.loads((root/'config/renderers.config.json').read_text())
assert set(cfg['profiles'])=={'lite','advanced','cinematic'}
assert cfg['modeMap']['realism']=='cinematic'
for f in ['demo/renderer-profile.js','demo/modules/renderer.module.js','demo/styles-renderer.css']:
 assert (root/f).exists(),f
old=Path('/mnt/data/loja-virtual-ds-v0.9.5.3')
for p in (root/'assets').rglob('*.glb'):
 q=old/p.relative_to(root)
 assert q.exists() and hashlib.sha256(p.read_bytes()).digest()==hashlib.sha256(q.read_bytes()).digest(),p
print(json.dumps({'version':'0.9.6.0-RG','profiles':list(cfg['profiles']),'assetsPreserved':True},indent=2))
