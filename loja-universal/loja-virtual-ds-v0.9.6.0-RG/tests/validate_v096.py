from pathlib import Path
import json,hashlib
root=Path(__file__).resolve().parents[1]
required=['config/backpack.config.json','demo/backpack-config.js','demo/backpack-manager.js','demo/persistence-manager.js','demo/backpack-bridge.js','demo/backpack-ui.js','demo/styles-backpack.css']
for rel in required:assert (root/rel).exists(),rel
cfg=json.loads((root/'config/backpack.config.json').read_text())
assert cfg['capacity']=={'items':8,'quickAnimations':6,'quickMessages':6}
assert sum(g['limit'] for g in cfg['groups'].values())==8
boot=(root/'demo/boot.module.js').read_text()
for token in ['DS_BACKPACK_CONFIG','DSBackpack','DSPersistence','DSBackpackSDK']:assert token in boot,token
html=(root/'demo/index.html').read_text()
for token in ['inventoryGeneralPanel','backpackPanel','backpackSlots','backpackAnimations','backpackMessages','profileBackupInput','profileBackpackItems']:assert token in html,token
ui=(root/'demo/backpack-ui.js').read_text()
for token in ['data-backpack-use','restoreLastCheckpoint','importFile','autoOrganize']:assert token in ui,token
pm=(root/'demo/persistence-manager.js').read_text()
for token in ['financialDataIncluded:false','checkpoint','indexedDB','DS_PROFILE_BACKUP_V1']:assert token in pm,token
bm=(root/'demo/backpack-manager.js').read_text()
for token in ['itemIds','quickAnimations','quickMessages','canAddItem','playAnimation','sayMessage']:assert token in bm,token
pack=json.loads((root/'packs/graphics-essential.json').read_text());paths={x['path'] for x in pack['files']}
for rel in ['../config/backpack.config.json','../demo/backpack-config.js','../demo/backpack-manager.js','../demo/persistence-manager.js','../demo/backpack-bridge.js']:assert rel in paths,rel
for f in pack['files']:
 p=root/f['path'].replace('../','');assert p.exists(),p;assert hashlib.sha256(p.read_bytes()).hexdigest()==f['sha256'],p
print(json.dumps({'ok':True,'version':'0.9.6.0-RG','itemSlots':8,'animationSlots':6,'messageSlots':6,'financialImportProtected':True},ensure_ascii=False))
