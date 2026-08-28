from pathlib import Path
import json,hashlib,re
root=Path(__file__).resolve().parents[1]
required=['../config/visual-recovery.config.json', '../demo/visual-recovery.js', '../demo/styles-recovery.css', '../assets/runtime/recovery/avatar-front-hq.webp', '../assets/runtime/recovery/avatar-three-quarter-hq.webp', '../assets/runtime/recovery/avatar-side-hq.webp', '../assets/runtime/recovery/avatar-back-hq.webp', '../assets/runtime/recovery/avatar-hero-hq.webp', '../assets/runtime/recovery/recovery-assets.json']
for rel in required:
 p=root/rel.replace('../','');assert p.exists(),p
perf=(root/'demo/performance-manager.js').read_text()
assert "return'intermediate'" in perf
assert "ds-allow-basic-auto" in perf
renderer=(root/'demo/renderer-profile.js').read_text()
assert "intermediate:'advanced'" in renderer
assert "homeView" not in re.search(r"function target.*?return id\}",renderer,re.S).group(0)
snap=(root/'demo/avatar-snapshot.js').read_text()
for a in ['front','three-quarter','side','back']:assert a in snap
html=(root/'demo/index.html').read_text();assert 'styles-recovery.css' in html
assert 'avatar-three-quarter-hq.webp' in html
for p in (root/'assets/avatars').rglob('*.glb'):
 assert p.stat().st_size>0
print(json.dumps({'ok':True,'version':'0.9.6.0-RG','visualFloor':'intermediate','fallbackAngles':4},ensure_ascii=False))
