from pathlib import Path
import gzip,json,hashlib,sys
root=Path(__file__).resolve().parents[1]
m=json.loads((root/'assets/compression/mesh-transfer-manifest.json').read_text())
errors=[]
for e in m['entries']:
 o=root/e['original'];g=root/e['gzip']
 if not o.exists() or not g.exists():errors.append('missing '+e['original']);continue
 raw=o.read_bytes();dec=gzip.decompress(g.read_bytes())
 if raw!=dec:errors.append('mismatch '+e['original'])
 if hashlib.sha256(raw).hexdigest()!=e['sha256']:errors.append('hash '+e['original'])
for f in ['demo/asset-transfer.js','demo/avatar3d.js','demo/product3d.js','demo/modules/avatar.module.js','demo/modules/product.module.js']:
 if not (root/f).exists():errors.append('missing '+f)
assert not errors,errors
print(json.dumps({'version':m['version'],'entries':len(m['entries']),'reductionPercent':m['reductionPercent'],'lossless':True},indent=2))
