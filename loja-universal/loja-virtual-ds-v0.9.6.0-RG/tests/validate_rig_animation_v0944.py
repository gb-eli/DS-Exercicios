#!/usr/bin/env python3
import json,struct,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]; errors=[]
def check(c,m):
    if not c: errors.append(m)
def read_glb(p):
    b=p.read_bytes(); check(b[:4]==b'glTF',p.name+' header'); jl=struct.unpack_from('<I',b,12)[0]; return json.loads(b[20:20+jl].decode().rstrip(' \0'))
expected={'Crouch','TurnAround','LookAround','ArmStretch','KneeLift','VictoryPose','WalkShowcase','Bow','ThumbsUp','SquatPulse'}
bones={'B_SpineLower','B_Chest','B_ClavicleL','B_ClavicleR','B_WristL','B_WristR','B_PalmL','B_PalmR','B_AnkleL','B_AnkleR'}
for p in sorted((ROOT/'assets/avatars/avatar-tech-v1').glob('avatar-tech-v1-lod*.glb')):
    j=read_glb(p); names={n.get('name') for n in j['nodes']}; anims={a.get('name') for a in j.get('animations',[])}
    check(bones<=names,p.name+' bones ausentes'); check(expected<=anims,p.name+' clips novos ausentes'); check(len(anims)==28,p.name+' deve ter 28 clips')
meta=json.loads((ROOT/'assets/avatars/avatar-tech-v1/animations.json').read_text()); check(meta['rig']=='DS_HUMANOID_VOXEL_RIG_2','rig metadata');check(meta['clipCount']==28,'clipCount')
html=(ROOT/'demo/index.html').read_text(); check('data-rig-focus' in html,'controles do rig');check('28 clips' in html,'texto 28 clips')
js=(ROOT/'demo/avatar3d.js').read_text(); check('setRigFocus' in js,'API setRigFocus');check('smoothstep' in js,'crossfade smoothstep');check('B_WristR' in js and 'B_AnkleL' in js,'secondary motion v2')
check((ROOT/'VERSION').read_text().strip()=='0.9.6.0-RG','VERSION')
report={'version':'0.9.6.0-RG','glbs':3,'expectedClips':28,'newBones':10,'errors':errors,'passed':not errors}
(ROOT/'reports/rig-animation-validation-v0944.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(report,ensure_ascii=False,indent=2));sys.exit(1 if errors else 0)
