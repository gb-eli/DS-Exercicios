#!/usr/bin/env python3
from pathlib import Path
import json, hashlib, sys
ROOT=Path(__file__).resolve().parents[1]
V='0.9.6.0-RG'
idx=json.loads((ROOT/'packs/packages.json').read_text())
assert idx['storeVersion']==V
assert len(idx['packs'])==7
ids={p['id'] for p in idx['packs']}
assert 'module-visual-reference' not in ids
assert 'graphics-cinematic' in ids
cin=next(p for p in idx['packs'] if p['id']=='graphics-cinematic')
assert cin.get('premium3DAssets') is True
assert cin.get('assetMaturity')=='premium-runtime-v1'
assert any('env-realism-2048.webp' in f['path'] for f in cin['files'])
assert all('assets/concepts/' not in f['path'] and 'assets/previews/' not in f['path'] for p in idx['packs'] for f in p['files'])
assert (ROOT/'dev/packs/reference-dev.json').exists()
assert (ROOT/'config/publish-profiles.json').exists()
assert (ROOT/'reports/lod-metrics-v0951.json').exists()
html=(ROOT/'demo/index.html').read_text()
assert 'assets/concepts/' not in html and 'assets/previews/' not in html
for p in idx['packs']:
  for f in p['files']:
    fp=(ROOT/'demo'/f['path']).resolve(); assert fp.exists(),(p['id'],f['path'])
    data=fp.read_bytes(); assert len(data)==f['bytes']; assert hashlib.sha256(data).hexdigest()==f['sha256']
print(json.dumps({'passed':True,'packs':len(idx['packs']),'runtimeFiles':sum(p['fileCount'] for p in idx['packs'])},ensure_ascii=False))
