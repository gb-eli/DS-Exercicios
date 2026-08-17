from pathlib import Path
import json,re,hashlib
root=Path(__file__).resolve().parents[1]
required=['demo/avatar-profile-state.js','demo/avatar-snapshot.js','demo/transaction-visuals.js','demo/showcase-controller.js','demo/styles-coherence.css']
for rel in required:assert (root/rel).exists(),rel
boot=(root/'demo/boot.module.js').read_text()
for token in ['DSAvatarProfile','DSAvatarSnapshot','DSTransactionVisuals','DSAvatarShowcase']:assert token in boot,token
html=(root/'demo/index.html').read_text()
for token in ['data-avatar-snapshot="profile"','data-avatar-snapshot="inventory"','productEquippedPreview','transactionAvatar','showcaseModal']:assert token in html,token
app=(root/'demo/app.js').read_text()
for token in ['avatarProfile?.isEquipped','DSTransactionVisuals','quickEquipProduct','DSAvatarSnapshot?.preview','ds-avatar-profile-change']:assert token in app,token
avatar=(root/'demo/avatar3d.js').read_text();assert 'DSAvatarProfile?.setEquipped' in avatar and 'profileItems' in avatar
pack=json.loads((root/'packs/graphics-essential.json').read_text())
paths={x['path'] for x in pack['files']}
for rel in ['../demo/avatar-profile-state.js','../demo/avatar-snapshot.js','../demo/transaction-visuals.js','../demo/showcase-controller.js','../demo/styles-coherence.css']:assert rel in paths,rel
for f in pack['files']:
 p=root/f['path'].replace('../','');assert p.exists(),p;assert hashlib.sha256(p.read_bytes()).hexdigest()==f['sha256'],p
print(json.dumps({'ok':True,'version':'0.9.6.0-RG','coherenceSurfaces':6,'newCoreFiles':5},ensure_ascii=False))
