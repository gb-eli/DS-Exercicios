from pathlib import Path
import json, struct
ROOT=Path(__file__).resolve().parents[1]
v=json.loads((ROOT/'assets/vfx/vfx-manifest.json').read_text())
assert v['version']=='0.7.0'
assert len(v['effects'])>=17
ids=set()
for e in v['effects']:
 assert e['id'] not in ids; ids.add(e['id'])
 assert e['price']>=0
 assert (ROOT/'assets/vfx/previews'/f"{e['id']}.webp").exists()
 assert (ROOT/'assets/vfx/effects'/f"{e['id']}.json").exists()
for lod in ['lod0','lod1','lod2']:
 p=ROOT/'assets/avatars/avatar-tech-v1'/f'avatar-tech-v1-{lod}.glb'; d=p.read_bytes(); off=12; js=None
 while off<len(d):
  ln,typ=struct.unpack_from('<II',d,off); ch=d[off+8:off+8+ln]; off+=8+ln
  if typ==0x4E4F534A: js=json.loads(ch.decode().rstrip(' \0'))
 names={a.get('name') for a in js.get('animations',[])}
 for required in ['DanceLoop','TypeComputer','StudyNotebook','PresentProject','UseScanner','RocketCelebrate','AuraPowerUp']: assert required in names,(lod,required)
print(f'OK: {len(v["effects"])} efeitos, {len(v["speechBubbles"])} falas e clips avançados nos três LODs')
