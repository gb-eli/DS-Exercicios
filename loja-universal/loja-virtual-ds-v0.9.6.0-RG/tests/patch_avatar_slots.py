import json,struct
from pathlib import Path
root=Path(__file__).resolve().parents[1]
av=root/'assets/avatars/avatar-tech-v1'
new_slots=[
 ('SLOT_HAIR','B_Head',[0,.60,0],{'slot':'hair'}),
 ('SLOT_FACE','B_Head',[0,.68,.72],{'slot':'face'}),
 ('SLOT_TORSO','B_Torso',[0,.75,.02],{'slot':'torso'}),
 ('SLOT_SHOULDER_L','B_ShoulderL',[0,0,0],{'slot':'shoulder-left'}),
 ('SLOT_SHOULDER_R','B_ShoulderR',[0,0,0],{'slot':'shoulder-right'}),
 ('SLOT_WAIST','B_Hips',[0,-.15,0],{'slot':'waist'}),
 ('SLOT_FOOT_L','B_FootL',[0,-.15,.18],{'slot':'foot-left'}),
 ('SLOT_FOOT_R','B_FootR',[0,-.15,.18],{'slot':'foot-right'}),
 ('SLOT_VEHICLE','AvatarRoot',[0,.25,0],{'slot':'vehicle'}),
]
def pad4(b,fill=b' '): return b+fill*((4-len(b)%4)%4)
for lod in range(3):
 p=av/f'avatar-tech-v1-lod{lod}.glb'; raw=p.read_bytes(); dv=memoryview(raw)
 magic,ver,total=struct.unpack_from('<4sII',raw,0); assert magic==b'glTF'
 pos=12; json_data=None; bin_data=None
 while pos<len(raw):
  ln,tp=struct.unpack_from('<II',raw,pos); data=raw[pos+8:pos+8+ln]
  if tp==0x4E4F534A: json_data=json.loads(data.decode('utf-8').rstrip(' \0'))
  elif tp==0x004E4942: bin_data=data
  pos+=8+ln
 j=json_data; names={n.get('name'):i for i,n in enumerate(j['nodes'])}
 # Hide v0.4 embedded demo equipment; v0.5 loads real external assets.
 for n in j['nodes']:
  if n.get('extras',{}).get('itemId'):
   n['extras']['defaultVisible']=False
 for name,parent,trans,extras in new_slots:
  if name in names: continue
  idx=len(j['nodes']); j['nodes'].append({'name':name,'translation':trans,'extras':extras}); names[name]=idx
  pi=names[parent]; j['nodes'][pi].setdefault('children',[]).append(idx)
 j.setdefault('extras',{})['equipmentVersion']='0.5.0'
 js=pad4(json.dumps(j,separators=(',',':'),ensure_ascii=False).encode('utf-8'))
 bd=pad4(bin_data or b'',b'\0')
 total=12+8+len(js)+(8+len(bd) if bd else 0)
 out=struct.pack('<4sII',b'glTF',2,total)+struct.pack('<II',len(js),0x4E4F534A)+js
 if bd: out+=struct.pack('<II',len(bd),0x004E4942)+bd
 p.write_bytes(out)
print('slots atualizados')
