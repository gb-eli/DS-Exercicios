from pathlib import Path
import json, sys
root=Path(__file__).resolve().parents[1]
items=json.loads((root/'catalog/items.json').read_text(encoding='utf-8'))['items']
rarities={r['id'] for r in json.loads((root/'catalog/rarities.json').read_text(encoding='utf-8'))['rarities']}
ids=set()
errors=[]
for item in items:
    if item['id'] in ids: errors.append('ID duplicado: '+item['id'])
    ids.add(item['id'])
    if item['rarity'] not in rarities: errors.append('Raridade inválida: '+item['id'])
    if not 0 <= item['basePrice'] <= 500000: errors.append('Preço inválido: '+item['id'])
print(f'{len(items)} itens validados.')
if errors:
    print('\n'.join(errors));sys.exit(1)
print('Catálogo válido.')
