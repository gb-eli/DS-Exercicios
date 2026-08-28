from pathlib import Path
import json
root=Path(__file__).resolve().parents[1]
html=(root/'demo/index.html').read_text(encoding='utf-8')
boot=(root/'demo/boot.module.js').read_text(encoding='utf-8')
runtime=(root/'demo/runtime-loader.js').read_text(encoding='utf-8')
assert 'styles-core.css' in html
assert 'boot.module.js' in html
assert 'type="module"' in html or "type='module'" in html
assert 'runtime-loader.js' in boot
assert 'avatar-assets.js' not in html and 'equipment-assets.js' not in html
assert 'avatar3d.js' not in html and 'product3d.js' not in html and 'vfx-engine.js' not in html
assert 'import(moduleUrl)' in runtime and 'document.baseURI' in runtime
for f in ['shared.module.js','assets.module.js','inventory.module.js','avatar.module.js','product.module.js','vfx.module.js','packages.module.js','performance.module.js','integration.module.js']:
    assert (root/'demo/modules'/f).exists(), f
assert not (root/'demo/avatar-assets.js').exists()
assert not (root/'demo/equipment-assets.js').exists()
config=(root/'demo/config-data.js').read_text(encoding='utf-8')
assert 'window.DS_ECONOMY_CONFIG' in config
assert 'window.DS_STORE_CONFIG' in config
lock=json.loads((root/'reports/visual-fidelity-lock-v0952.json').read_text(encoding='utf-8'))
assert not lock['changed'] and not lock['removed']
budget=json.loads((root/'reports/module-load-budget-v0952.json').read_text(encoding='utf-8'))
print(json.dumps({'ok':True,'assetsIdentical':lock['identicalCount'],'initialBudget':budget['reductions']},ensure_ascii=False))
