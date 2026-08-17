#!/usr/bin/env python3
from __future__ import annotations
import json, re, sys
from pathlib import Path
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
errors: list[str] = []

def require(condition: bool, message: str) -> None:
    if not condition:
        errors.append(message)

# Required files
required_files = [
    'demo/index.html','demo/styles.css','demo/app.js','dist/ds-store-ui.css',
    'dist/ds-store-foundation.js','config/design-tokens.json','src/ui/tokens.css',
    'src/ui/component-registry.js','docs/DESIGN_SYSTEM.md','docs/RESPONSIVIDADE.md',
    'docs/PROMPT_INTEGRACAO_v0.7.0.md','assets/asset-manifest.json','docs/ASSET_GUIDE.md','assets/equipment/equipment-manifest.json'
]
for rel in required_files:
    require((ROOT / rel).is_file(), f'arquivo ausente: {rel}')

# HTML navigation targets and unique IDs
html = (ROOT / 'demo/index.html').read_text(encoding='utf-8')
soup = BeautifulSoup(html, 'html.parser')
ids: dict[str, int] = {}
for tag in soup.find_all(attrs={'id': True}):
    ids[tag['id']] = ids.get(tag['id'], 0) + 1
require(not [key for key, count in ids.items() if count > 1], 'há IDs duplicados no HTML')
views = {tag.get('id') for tag in soup.select('.view')}
expected_views = {'homeView','storeView','walletView','inventoryView','avatarView','profileView','integrityView','componentsView','architectureView','assetsView','performanceView','effectsView'}
require(expected_views <= views, f'views ausentes: {sorted(expected_views - views)}')
for tag in soup.select('[data-view]'):
    require(tag.get('data-view') in views, f'data-view inválido: {tag.get("data-view")}')

# JS selector IDs should exist when directly referenced via $('#id').
js = (ROOT / 'demo/app.js').read_text(encoding='utf-8')
js_ids = set(re.findall(r"\$\('#([A-Za-z0-9_-]+)'\)", js))
missing_js_ids = sorted(js_ids - set(ids))
require(not missing_js_ids, f'IDs usados no JS não existem no HTML: {missing_js_ids}')

# Catalog and economy
items_data = json.loads((ROOT / 'catalog/items.json').read_text(encoding='utf-8'))
items = items_data['items']
item_ids = [item['id'] for item in items]
require(items_data['version'] == '0.7.0', 'versão do catálogo de itens incorreta')
require(len(item_ids) == len(set(item_ids)), 'IDs duplicados no catálogo')
require(all(30 <= item['basePrice'] <= 500000 for item in items), 'preço fora da faixa 30–500000')
require(all(item.get('pack') and item.get('slot') for item in items), 'item sem pack ou slot')

discounts = json.loads((ROOT / 'catalog/discounts.json').read_text(encoding='utf-8'))['discounts']
require([d['percent'] for d in discounts] == [10,25,38,60,80,99,100], 'faixas de desconto oficiais divergentes')

store = json.loads((ROOT / 'config/store.config.json').read_text(encoding='utf-8'))
require(store['version'] == '0.7.0', 'versão de store.config incorreta')
require(store['walletName'] == 'Carteira Virtual DS', 'nome da carteira incorreto')
require(store.get('designSystem', {}).get('version') == '0.7.0', 'Design System não declarado no store.config')

manifest = json.loads((ROOT / 'manifest.json').read_text(encoding='utf-8'))
require(manifest['stage'] == 'adaptive-graphics-and-product-360', 'stage do manifesto incorreto')
require(manifest['nextVersion'] == '0.8.0', 'próxima versão incorreta')

css = (ROOT / 'dist/ds-store-ui.css').read_text(encoding='utf-8')
for token in ['.mobile-nav', '.sidebar', '.product-card', '.wallet-balance-card', '.module-loader', '@media(max-width:820px)']:
    require(token in css, f'componente CSS ausente: {token}')

foundation = (ROOT / 'dist/ds-store-foundation.js').read_text(encoding='utf-8')
require("const VERSION = '0.5.0'" in foundation, 'versão do núcleo financeiro inesperada')
require('ds-store-foundation-v0.1.0' in foundation and 'ds-store-foundation-v0.2.0' in foundation, 'migração das versões anteriores ausente')

if errors:
    print('VALIDAÇÃO FALHOU')
    for error in errors:
        print(f'- {error}')
    sys.exit(1)
print(f'VALIDAÇÃO OK — {len(items)} itens, {len(views)} views, {len(js_ids)} seletores de ID conferidos.')
