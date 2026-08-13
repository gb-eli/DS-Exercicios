import json, struct
from pathlib import Path
root=Path(__file__).resolve().parents[1]
av=root/'assets/avatars/avatar-tech-v1'
expected={'Idle','Walk','Run','Wave','Goodbye','Celebrate','Jump','Applause','Think','Point','Sit'}
for lod in range(3):
 p=av/f'avatar-tech-v1-lod{lod}.glb'; b=p.read_bytes(); magic,version,total=struct.unpack_from('<4sII',b,0)
 assert magic==b'glTF' and version==2 and total==len(b)
 jl=struct.unpack_from('<I',b,12)[0]; j=json.loads(b[20:20+jl])
 assert expected<={a['name'] for a in j['animations']}
 names={n.get('name') for n in j['nodes']}
 for slot in ['SLOT_HAIR','SLOT_HEAD','SLOT_FACE','SLOT_TORSO','SLOT_SHOULDER_L','SLOT_SHOULDER_R','SLOT_HAND_L','SLOT_HAND_R','SLOT_BACK','SLOT_SHIELD','SLOT_WAIST','SLOT_FOOT_L','SLOT_FOOT_R','SLOT_VEHICLE','SLOT_AURA','SLOT_COMPANION']: assert slot in names
print('avatar 3D valido')
