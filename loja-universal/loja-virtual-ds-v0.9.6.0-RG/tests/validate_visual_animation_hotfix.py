#!/usr/bin/env python3
from __future__ import annotations
from pathlib import Path
import hashlib, json, re, sys
ROOT=Path(__file__).resolve().parents[1]
checks=[]
def check(name, condition, detail=''):
    checks.append({'name':name,'ok':bool(condition),'detail':detail})

def txt(rel): return (ROOT/rel).read_text(encoding='utf-8')
html=txt('demo/index.html'); css='\n'.join(txt(x) for x in ['demo/styles-core.css','demo/styles-avatar.css','demo/styles-vfx.css','demo/styles-performance.css','demo/styles-packages.css','demo/styles-integration.css','demo/styles-assets.css']); app=txt('demo/app.js'); avatar=txt('demo/avatar3d.js'); vfx=txt('demo/vfx-engine.js')
check('version-ui', 'v0.9.6.0-RG' in html)
check('fallback-hides-loading', "loading.hidden=true" in avatar and "mode:'fallback2d'" in avatar)
check('loadout-persistence', 'ds-avatar-loadout-v1' in avatar and 'persistLoadout' in avatar)
check('animation-crossfade', 'transitionPose' in avatar and 'transitionDuration' in avatar)
check('secondary-motion', 'secondaryMotion' in avatar and 'B_KneeL' in avatar and 'B_WristR' in avatar and 'B_AnkleL' in avatar)
check('lod-disposal-order', "if(avatar)disposeGpuModel(avatar)" in avatar and "avatar=null" not in re.search(r'async function setQuality\(q\).*?\n',avatar).group(0))
check('inventory-handler-scoped', "#inventoryGrid [data-equip-item]" in app)
check('profile-actions', 'data-profile-animation' in html and 'renderProfileLoadout' in app)
check('mobile-sticky-preview', 'position:sticky' in css and '.avatar-stage.real-3d' in css)
check('vfx-view-lifecycle', "e.detail.current==='effectsView'" in vfx and "else main?.stop()" in vfx)
check('visible-speech-target', 'vfxSpeechBubble' in html and "activeView==='effectsView'?'vfxSpeechBubble':'avatarSpeechBubble'" in vfx)
check('vfx-budget-alignment', all(x in html for x in ['70 partículas','240 partículas','700 partículas','1.500 partículas']))
check('no-direct-duplicate-animation-binding', "querySelectorAll('[data-glb-animation]').forEach" not in app)
check('root-entry-relative', './demo/index.html' in txt('index.html'))
# CSS brace sanity, ignoring comments/strings is unnecessary for this generated sheet, but catches truncation.
check('css-balanced-braces', css.count('{')==css.count('}'), f"{css.count('{')} / {css.count('}')}")
# Package integrity.
packages=json.loads(txt('packs/packages.json'))
check('package-store-version', packages.get('storeVersion')=='0.9.6.0-RG')
all_files=[]
for pack in packages['packs']:
    for entry in pack.get('files',[]):
        path=(ROOT/'packs'/entry['path']).resolve()
        ok=path.exists() and path.stat().st_size==entry['bytes'] and hashlib.sha256(path.read_bytes()).hexdigest()==entry['sha256']
        all_files.append(ok)
check('package-hashes', all(all_files), f"{sum(all_files)}/{len(all_files)}")
report={'version':'0.9.6.0-RG','status':'PASS' if all(x['ok'] for x in checks) else 'FAIL','checks':checks}
(ROOT/'reports').mkdir(exist_ok=True)
(ROOT/'reports'/'visual-animation-validation.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({'status':report['status'],'checks':len(checks),'passed':sum(x['ok'] for x in checks)},ensure_ascii=False))
if report['status']!='PASS':
    for x in checks:
        if not x['ok']: print('FAIL',x)
    sys.exit(1)
