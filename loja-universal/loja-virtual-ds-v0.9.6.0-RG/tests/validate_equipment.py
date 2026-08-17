#!/usr/bin/env python3
import json,struct,sys,re
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
errors=[]
def req(c,m):
 if not c: errors.append(m)
manifest=json.loads((ROOT/'assets/equipment/equipment-manifest.json').read_text())
items=manifest['items']; ids=[i['id'] for i in items]
req(manifest['version']=='0.5.0','versão do equipamento')
req(len(items)==36,f'esperados 36 itens, encontrados {len(items)}')
req(len(ids)==len(set(ids)),'IDs duplicados')
for item in items:
 p=ROOT/item['model3d']; q=ROOT/item['preview']
 req(p.is_file(),f'modelo ausente {item["id"]}'); req(q.is_file(),f'preview ausente {item["id"]}')
 if p.is_file():
  b=p.read_bytes();
  try:
   magic,ver,total=struct.unpack_from('<4sII',b,0); req(magic==b'glTF' and ver==2 and total==len(b),f'GLB inválido {item["id"]}')
   jl=struct.unpack_from('<I',b,12)[0]; j=json.loads(b[20:20+jl]); req(j.get('extras',{}).get('itemId')==item['id'],f'extras divergente {item["id"]}'); req(len(j.get('nodes',[]))>=2,f'sem geometria {item["id"]}')
  except Exception as e: errors.append(f'erro {item["id"]}: {e}')
cat=json.loads((ROOT/'catalog/items.json').read_text())
req(cat['version']=='0.7.0','catálogo não está em 0.7.0')
by={i['id']:i for i in cat['items']}
for id in ids:
 req(id in by,f'{id} não está no catálogo'); req(bool(by.get(id,{}).get('model3d')),f'{id} sem model3d')
# avatar slots
expected={'SLOT_HAIR','SLOT_HEAD','SLOT_FACE','SLOT_TORSO','SLOT_SHOULDER_L','SLOT_SHOULDER_R','SLOT_HAND_L','SLOT_HAND_R','SLOT_BACK','SLOT_SHIELD','SLOT_WAIST','SLOT_FOOT_L','SLOT_FOOT_R','SLOT_VEHICLE','SLOT_AURA','SLOT_COMPANION'}
for lod in range(3):
 p=ROOT/f'assets/avatars/avatar-tech-v1/avatar-tech-v1-lod{lod}.glb';b=p.read_bytes();jl=struct.unpack_from('<I',b,12)[0];j=json.loads(b[20:20+jl]);names={n.get('name') for n in j['nodes']};req(expected<=names,f'slots faltando LOD{lod}: {sorted(expected-names)}')
html=(ROOT/'demo/index.html').read_text();boot=(ROOT/'demo/boot.module.js').read_text();avatar_module=(ROOT/'demo/modules/avatar.module.js').read_text();req('equipment-data.js' in boot,'dados de equipamento ausentes no boot');req('avatar3d.js' in avatar_module,'renderer de equipamento ausente no módulo');req(not (ROOT/'demo/equipment-assets.js').exists(),'Base64 de equipamento não deve existir no runtime');req(html.count('data-equip-item=')>=16,'seletor visual insuficiente')
if errors:
 print('VALIDAÇÃO EQUIPAMENTOS FALHOU');[print('-',e) for e in errors];sys.exit(1)
print(f'VALIDAÇÃO EQUIPAMENTOS OK — {len(items)} GLBs, {len(expected)} slots, {len(cat["items"])} itens no catálogo.')
