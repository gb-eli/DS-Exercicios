from pathlib import Path
import json, sys
root=Path(__file__).resolve().parents[1]
cat=json.loads((root/'catalog/items.json').read_text(encoding='utf-8'))
manifest=json.loads((root/'assets/asset-manifest.json').read_text(encoding='utf-8'))
errors=[]
for item in cat['items']:
    required=['thumbnail']
    if item.get('model3d'): required.append('model3d')
    elif item.get('vectorPreview'): required.append('vectorPreview')
    else: errors.append(f"{item['id']}: sem preview vetorial ou modelo 3D")
    for field in required:
        p=(root/'demo'/item[field]).resolve()
        if not p.exists(): errors.append(f"{item['id']}: missing {field} {p}")
if len(list((root/'assets/equipment/models').glob('*.glb'))) != 36: errors.append('equipment model count mismatch')
if len(list((root/'assets/equipment/previews').glob('*.webp'))) != 36: errors.append('equipment preview count mismatch')
if len(list((root/'assets/materials/webp').glob('*.webp'))) < 12: errors.append('materials incomplete')
if errors:
    print('\n'.join(errors)); sys.exit(1)
print(f"OK: {len(cat['items'])} items, {len(manifest['groups']['icons'])} icons, {len(manifest['groups']['materials'])} materials, 36 GLBs")
