#!/usr/bin/env python3
from __future__ import annotations
import json, subprocess, sys
from datetime import datetime, timezone
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
commands=[
 ['python','tests/validate_catalog.py'],
 ['python','tests/validate_assets.py'],
 ['python','tests/validate_avatar3d.py'],
 ['python','tests/validate_equipment.py'],
 ['python','tests/validate_vfx.py'],
 ['python','tests/validate_v07.py'],
 ['python','tests/validate_v08.py'],
 ['python','tests/validate_v09.py'],
 ['node','tests/test_sdk_node.js'],
 ['python','tests/validate_visual_animation_hotfix.py'],
 ['python','tests/validate_graphics_modes.py'],
 ['python','tests/validate_rig_animation_v0944.py'],
 ['python','tests/validate_benchmark_v095.py'],
 ['python','tests/validate_runtime_dev_split_v0951.py'],
 ['python','tests/validate_modular_runtime_v0952.py'],
 ['python','tests/audit_baseline.py'],
]
results=[]
for cmd in commands:
    p=subprocess.run(cmd,cwd=ROOT,capture_output=True,text=True)
    results.append({'command':' '.join(cmd),'ok':p.returncode==0,'returnCode':p.returncode,'stdout':p.stdout.strip()[-4000:],'stderr':p.stderr.strip()[-4000:]})
# Syntax checks for all JS.
js_errors=[]
for path in sorted(ROOT.rglob('*.js')):
    if 'reports' in path.parts: continue
    p=subprocess.run(['node','--check',str(path)],capture_output=True,text=True)
    if p.returncode: js_errors.append({'path':str(path.relative_to(ROOT)),'message':(p.stderr or p.stdout).strip()})
report={'version':'0.9.6.0-RG','generatedAt':datetime.now(timezone.utc).isoformat(),'commands':results,'javascriptSyntaxErrors':js_errors,'status':'PASS' if all(r['ok'] for r in results) and not js_errors else 'FAIL'}
(ROOT/'reports').mkdir(exist_ok=True)
(ROOT/'reports'/'regression-result.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({'status':report['status'],'checks':len(results),'jsErrors':len(js_errors)},ensure_ascii=False))
sys.exit(0 if report['status']=='PASS' else 1)
