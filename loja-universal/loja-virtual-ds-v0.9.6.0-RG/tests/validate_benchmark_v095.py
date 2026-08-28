#!/usr/bin/env python3
from pathlib import Path
import json,re,sys
R=Path(__file__).resolve().parents[1]; errors=[]
def check(c,m):
 if not c:errors.append(m)
html=(R/'demo/index.html').read_text(encoding='utf-8');js=(R/'demo/benchmark-engine.js').read_text(encoding='utf-8');css='\n'.join((R/'demo'/f).read_text(encoding='utf-8') for f in ['styles-core.css','styles-performance.css','styles-packages.css'])
check((R/'VERSION').read_text().strip()=='0.9.6.0-RG','VERSION incorreta')
for x in ['runGraphicsBenchmark','runQuickBenchmark','benchmarkResults','benchmarkModeComparison','benchmarkRecommendations','benchmarkResultStages']:
 check(f'id="{x}"' in html,f'UI ausente: {x}')
for x in ['cpuSuite','workerSuite','shaderSuite','textureSuite','particleSuite','stabilitySuite','storageSuite','exportReport','applyRecommendation']:
 check(x in js,f'função ausente: {x}')
for x in ['ds-store-benchmark-v1','ds-advanced-benchmark-complete','neverAuto']:
 check(x in js or x in json.dumps(json.loads((R/'config/benchmark.config.json').read_text())),f'contrato ausente: {x}')
performance_module=(R/'demo/modules/performance.module.js').read_text();check('benchmark-engine.js' in performance_module,'benchmark não conectado ao módulo de desempenho')
check('.benchmark-score-ring' in css and '@media(max-width:430px)' in css,'CSS benchmark/responsivo ausente')
conf=json.loads((R/'config/benchmark.config.json').read_text());check(len(conf['stages'])==8,'etapas != 8')
perf=(R/'demo/performance-manager.js').read_text();check('advancedBenchmark' in perf and 'ds-advanced-benchmark-complete' in perf,'benchmark não integrado ao modo automático')
perf=(R/'demo/performance-manager.js').read_text();check('advancedBenchmark' in perf and 'ds-advanced-benchmark-complete' in perf,'benchmark não integrado ao modo automático')
manifest=json.loads((R/'manifest.json').read_text());check(manifest['version']=='0.9.6.0-RG','manifest version')
report={'version':'0.9.6.0-RG','checks':24,'errors':errors,'passed':not errors};(R/'reports/benchmark-validation-v095.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps(report,ensure_ascii=False,indent=2));sys.exit(1 if errors else 0)
