from pathlib import Path
import json,struct
root=Path(__file__).resolve().parents[1]
rep=json.loads((root/'reports/graphics-recovery-validation-v0.9.6.0-RG.json').read_text())
assert rep['glbCount']==39
assert rep['hierarchyPreserved'] and rep['animationCountsPreserved'] and rep['materialsPreserved']
assert rep['lodTriangles']=={'lod0':39168,'lod1':8448,'lod2':1680}
for x in rep['glbs']:
 assert x['nodesPreserved'] and x['meshesPreserved'] and x['animationsPreserved'] and x['materialsPreserved']
print(json.dumps({'ok':True,'version':'0.9.6.0-RG','glbs':39,'lodTriangles':rep['lodTriangles'],'compressionReduction':rep['compression']['reductionPercent']},ensure_ascii=False))
