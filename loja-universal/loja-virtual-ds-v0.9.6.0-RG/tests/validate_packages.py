from pathlib import Path
import json, hashlib, sys
root=Path(__file__).resolve().parents[1]
idx=json.loads((root/'packs/packages.json').read_text(encoding='utf-8'))
assert idx['storeVersion']=='0.9.5.1'
assert len(idx['packs'])==7
ids={p['id'] for p in idx['packs']}
assert len(ids)==7
assert 'graphics-essential' in ids
for p in idx['packs']:
    total=0
    for f in p['files']:
        fp=root/'demo'/f['path']
        fp=fp.resolve()
        assert fp.exists(), (p['id'],f['path'])
        data=fp.read_bytes(); total+=len(data)
        assert hashlib.sha256(data).hexdigest()==f['sha256']
    assert total==p['bytes']
    for dep in p.get('requires',[]): assert dep in ids
for mode, reqs in idx['modeRequirements'].items():
    assert all(x in ids for x in reqs)
print(json.dumps({'passed':True,'packs':len(idx['packs']),'files':sum(p['fileCount'] for p in idx['packs'])},ensure_ascii=False))
