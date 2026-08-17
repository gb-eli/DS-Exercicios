#!/usr/bin/env python3
import json,re,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
errors=[]
def ok(cond,msg):
    if not cond: errors.append(msg)
config=json.loads((ROOT/'config/graphics-modes.config.json').read_text())
ok(config['canonicalOrder']==['basic','intermediate','advanced','ultra','realism'],'ordem canônica incorreta')
ok(config['aliases']['economy']=='basic','alias economy ausente')
perf=json.loads((ROOT/'config/performance.config.json').read_text())
ok(set(config['canonicalOrder']).issubset(perf['qualityModes']),'modos faltando no desempenho')
html=(ROOT/'demo/index.html').read_text()
for m in config['canonicalOrder']:ok(f'data-quality-option="{m}"' in html,f'botão {m} ausente')
css='\n'.join((ROOT/'demo'/f).read_text() for f in ['styles-core.css','styles-avatar.css','styles-vfx.css','styles-performance.css','styles-packages.css','styles-integration.css','styles-assets.css'])
for m in config['canonicalOrder']:ok(f'body[data-quality="{m}"]' in css,f'estilo {m} ausente')
for f in ['performance-manager.js','graphics-mode-controller.js','avatar3d.js','product3d.js','vfx-engine.js']:
    ok((ROOT/'demo'/f).exists(),f'{f} ausente')
index=json.loads((ROOT/'packs/packages.json').read_text())
for m in config['canonicalOrder']:ok(m in index['modeRequirements'],f'pacotes para {m} ausentes')
ok((ROOT/'VERSION').read_text().strip()=='0.9.6.0-RG','VERSION incorreta')
report={'version':'0.9.6.0-RG','checks':18,'errors':errors,'passed':not errors}
(ROOT/'reports/graphics-modes-validation.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(report,ensure_ascii=False,indent=2))
sys.exit(1 if errors else 0)
