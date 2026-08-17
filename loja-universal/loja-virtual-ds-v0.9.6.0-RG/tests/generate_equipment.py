from __future__ import annotations
import json, math, struct, hashlib, shutil
from pathlib import Path
from dataclasses import dataclass
from typing import List, Dict, Tuple
import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'assets' / 'equipment'
MODELS = OUT / 'models'
PREVIEWS = OUT / 'previews'
MODELS.mkdir(parents=True, exist_ok=True)
PREVIEWS.mkdir(parents=True, exist_ok=True)

MATERIALS: Dict[str, dict] = {
    'charcoal': {'color':[0.035,0.060,0.095,1], 'metallic':0.35,'roughness':0.45,'emissive':[0,0,0]},
    'graphite': {'color':[0.10,0.14,0.19,1], 'metallic':0.55,'roughness':0.30,'emissive':[0,0,0]},
    'silver': {'color':[0.58,0.68,0.78,1], 'metallic':0.92,'roughness':0.20,'emissive':[0,0,0]},
    'white': {'color':[0.90,0.95,0.98,1], 'metallic':0.15,'roughness':0.40,'emissive':[0,0,0]},
    'cyan': {'color':[0.02,0.42,0.62,1], 'metallic':0.35,'roughness':0.25,'emissive':[0.02,0.55,0.90]},
    'blue': {'color':[0.04,0.18,0.65,1], 'metallic':0.30,'roughness':0.34,'emissive':[0.02,0.08,0.18]},
    'navy': {'color':[0.02,0.06,0.18,1], 'metallic':0.25,'roughness':0.48,'emissive':[0,0,0]},
    'violet': {'color':[0.34,0.08,0.75,1], 'metallic':0.35,'roughness':0.25,'emissive':[0.28,0.05,0.62]},
    'pink': {'color':[0.82,0.05,0.46,1], 'metallic':0.28,'roughness':0.25,'emissive':[0.48,0.02,0.28]},
    'red': {'color':[0.65,0.035,0.045,1], 'metallic':0.60,'roughness':0.25,'emissive':[0.22,0.0,0.0]},
    'gold': {'color':[0.92,0.48,0.035,1], 'metallic':0.88,'roughness':0.18,'emissive':[0.22,0.08,0.0]},
    'yellow': {'color':[0.95,0.78,0.05,1], 'metallic':0.25,'roughness':0.35,'emissive':[0.18,0.12,0]},
    'green': {'color':[0.02,0.48,0.19,1], 'metallic':0.28,'roughness':0.40,'emissive':[0.0,0.10,0.02]},
    'orange': {'color':[0.95,0.26,0.035,1], 'metallic':0.30,'roughness':0.28,'emissive':[0.35,0.05,0]},
    'brown': {'color':[0.22,0.075,0.025,1], 'metallic':0.05,'roughness':0.75,'emissive':[0,0,0]},
    'skin': {'color':[0.66,0.38,0.23,1], 'metallic':0.0,'roughness':0.72,'emissive':[0,0,0]},
    'holo': {'color':[0.10,0.70,0.90,0.52], 'metallic':0.15,'roughness':0.08,'emissive':[0.08,0.70,1.0], 'blend':True},
    'glass': {'color':[0.30,0.62,0.80,0.38], 'metallic':0.15,'roughness':0.08,'emissive':[0.02,0.16,0.25], 'blend':True},
}

@dataclass
class Box:
    name: str
    center: Tuple[float,float,float]
    size: Tuple[float,float,float]
    material: str
    rotation: Tuple[float,float,float] = (0,0,0)


def b(name,c,s,m,r=(0,0,0)): return Box(name,tuple(c),tuple(s),m,tuple(r))

def q_euler(rx,ry,rz):
    cx,sx=math.cos(rx/2),math.sin(rx/2); cy,sy=math.cos(ry/2),math.sin(ry/2); cz,sz=math.cos(rz/2),math.sin(rz/2)
    return [sx*cy*cz-cx*sy*sz, cx*sy*cz+sx*cy*sz, cx*cy*sz-sx*sy*cz, cx*cy*cz+sx*sy*sz]

# Reusable voxel constructors

def hair_base(accent='cyan'):
    return [b('HairTop',(0,.25,0),(1.62,.48,1.48),'brown'),b('HairFront',(0,.10,.62),(1.56,.38,.28),'brown'),b('HairBack',(0,.02,-.65),(1.50,.75,.24),'brown'),b('Accent',(.60,.25,.53),(.14,.60,.18),accent)]

def torso_shell(primary='charcoal',accent='cyan',secondary='graphite'):
    return [b('Torso',(0,0,0),(2.05,1.72,1.02),primary),b('Panel',(0,.08,.56),(1.10,.78,.12),secondary),b('Core',(0,.10,.64),(.34,.34,.13),accent),b('StripeL',(-.83,.15,.56),(.12,1.20,.12),accent),b('StripeR',(.83,.15,.56),(.12,1.20,.12),accent)]

def boots(accent='cyan'):
    return [b('Boot',(0,0,0),(.75,.55,1.15),'graphite'),b('Sole',(0,-.27,.13),(.82,.12,1.22),accent),b('Toe',(0,.02,.53),(.72,.32,.28),'silver')]

def backpack(primary='graphite',accent='cyan'):
    return [b('Pack',(0,0,0),(1.35,1.65,.60),primary),b('Panel',(0,.15,-.36),(.82,.75,.18),accent),b('SideL',(-.78,0,0),(.25,1.05,.45),'charcoal'),b('SideR',(.78,0,0),(.25,1.05,.45),'charcoal'),b('Top',(0,.92,0),(.75,.18,.48),'silver')]

def shield(primary='graphite',accent='cyan',center='silver'):
    return [b('ShieldCore',(0,0,0),(.34,2.20,1.65),primary),b('ShieldFrame',(-.20,0,0),(.16,2.45,1.90),accent),b('Center',(-.39,0,0),(.14,.62,.62),center),b('Bar',(-.48,0,0),(.12,.18,1.25),center)]

def scanner(primary='graphite',accent='cyan'):
    return [b('Body',(0,0,0),(.72,1.12,.46),primary),b('Screen',(0,.18,.30),(.56,.50,.12),accent),b('Grip',(0,-.76,-.04),(.30,.65,.30),'charcoal'),b('Emitter',(0,.58,.08),(.38,.18,.38),'silver')]

def notebook(primary='graphite',accent='cyan'):
    return [b('Base',(0,-.18,0),(1.60,.14,1.02),primary,r=(math.radians(-5),0,0)),b('Screen',(0,.52,-.46),(1.62,1.20,.12),primary,r=(math.radians(-25),0,0)),b('Glow',(0,.52,-.38),(1.38,.92,.04),accent,r=(math.radians(-25),0,0)),b('Keys',(0,-.08,.08),(1.20,.04,.62),'silver')]

def drone(accent='cyan'):
    return [b('Core',(0,0,0),(.78,.48,.78),'graphite'),b('Eye',(0,.02,.46),(.38,.24,.10),accent),b('WingL',(-.72,0,0),(.60,.12,.25),'silver'),b('WingR',(.72,0,0),(.60,.12,.25),'silver'),b('RotorL',(-.96,.08,0),(.28,.08,.70),accent),b('RotorR',(.96,.08,0),(.28,.08,.70),accent),b('Bottom',(0,-.38,0),(.28,.25,.28),'charcoal')]

def hoverboard(accent='violet'):
    return [b('Deck',(0,0,0),(2.25,.18,.65),'graphite'),b('Glow',(0,-.14,0),(1.80,.10,.45),accent),b('ThrusterL',(-.78,-.20,0),(.38,.24,.50),'silver'),b('ThrusterR',(.78,-.20,0),(.38,.24,.50),'silver')]

def rocket(accent='orange'):
    return [b('Body',(0,0,0),(.78,2.15,.78),'white'),b('Nose',(0,1.32,0),(.48,.55,.48),accent),b('Window',(0,.38,.43),(.34,.34,.10),'glass'),b('FinL',(-.58,-.72,0),(.42,.72,.18),accent),b('FinR',(.58,-.72,0),(.42,.72,.18),accent),b('Engine',(0,-1.25,0),(.48,.35,.48),'graphite')]

items: List[dict] = []
def add(id,name,category,rarity,price,pack,attachments,boxes,description):
    items.append(dict(id=id,name=name,category=category,rarity=rarity,basePrice=price,pack=pack,attachments=attachments,boxes=boxes,description=description))

# Appearance / head
add('hair-cyan-stripe','Cabelo Faixa Ciano','appearance','basic',180,'avatar-hair',[{'slot':'hair'}],hair_base('cyan'),'Cabelo voxel escuro com faixa emissiva ciano.')
add('hair-wave-dark','Cabelo Onda Noturna','appearance','rare',950,'avatar-hair',[{'slot':'hair'}],hair_base('violet')+[b('WaveL',(-.58,.48,.16),(.48,.34,.55),'brown',r=(0,0,.22)),b('WaveR',(.48,.52,.10),(.58,.30,.50),'brown',r=(0,0,-.18))],'Penteado volumétrico com reflexos violetas.')
add('hair-neon-braid','Trança Neon Prisma','appearance','epic',3200,'avatar-hair',[{'slot':'hair'}],hair_base('pink')+[b('Braid',(.74,-.38,-.55),(.22,1.45,.22),'pink',r=(0,0,-.10)),b('Tip',(.82,-1.05,-.55),(.30,.22,.30),'violet')],'Trança voxel com segmentos emissivos rosa e violeta.')
add('cap-code','Boné Code Runner','headwear','basic',260,'headwear',[{'slot':'head'}],[b('Cap',(0,0,0),(1.62,.38,1.36),'navy'),b('Brim',(0,-.04,.90),(1.20,.12,.68),'cyan'),b('Badge',(0,.02,.70),(.38,.22,.08),'white')],'Boné tecnológico com aba ciano.')
add('helmet-orbit','Capacete Orbit','headwear','epic',4800,'headwear',[{'slot':'head'}],[b('Helmet',(0,0,0),(1.86,1.78,1.72),'graphite'),b('Visor',(0,.05,.90),(1.52,.68,.12),'glass'),b('Crown',(0,.90,0),(1.15,.20,1.20),'silver'),b('SideL',(-1.0,0,0),(.18,.72,.70),'cyan'),b('SideR',(1.0,0,0),(.18,.72,.70),'cyan')],'Capacete espacial modular com viseira holográfica.')
add('glasses-spectrum','Óculos Spectrum','appearance','rare',1200,'face-accessories',[{'slot':'face'}],[b('LensL',(-.43,0,0),(.70,.45,.10),'glass'),b('LensR',(.43,0,0),(.70,.45,.10),'glass'),b('Bridge',(0,0,0),(.22,.10,.12),'silver'),b('ArmL',(-.78,0,-.24),(.10,.10,.62),'graphite'),b('ArmR',(.78,0,-.24),(.10,.10,.62),'graphite')],'Óculos com lentes holográficas e armação metálica.')
add('visor-holo','Viseira HoloScan','appearance','legendary',9000,'face-accessories',[{'slot':'face'}],[b('Visor',(0,0,0),(1.70,.58,.12),'holo'),b('FrameTop',(0,.36,0),(1.80,.10,.16),'cyan'),b('SideL',(-.92,0,-.15),(.14,.58,.40),'graphite'),b('SideR',(.92,0,-.15),(.14,.58,.40),'graphite')],'Viseira avançada de escaneamento e dados.')

# Torso clothing
add('shirt-code-grid','Camiseta Code Grid','clothing','basic',240,'clothing-basic',[{'slot':'torso'}],torso_shell('charcoal','cyan','navy'),'Camiseta voxel com painel de código luminoso.')
add('jacket-neon','Jaqueta Neon Flux','clothing','rare',1800,'clothing-jackets',[{'slot':'torso'}],torso_shell('navy','violet','graphite')+[b('CollarL',(-.52,.84,.25),(.45,.28,.45),'violet',r=(0,0,.18)),b('CollarR',(.52,.84,.25),(.45,.28,.45),'violet',r=(0,0,-.18))],'Jaqueta escura com acabamento violeta e gola elevada.')
add('uniform-brazil-tech','Uniforme Brasil Tech','clothing','legendary',15000,'uniforms-countries',[{'slot':'torso'}],torso_shell('green','yellow','blue')+[b('FlagCore',(0,.08,.65),(.42,.30,.08),'blue')],'Uniforme original inspirado nas cores do Brasil.')
add('uniform-usa-tech','Uniforme Estelar Tech','clothing','legendary',15000,'uniforms-countries',[{'slot':'torso'}],torso_shell('navy','red','white')+[b('StarCore',(0,.08,.65),(.42,.42,.08),'white')],'Uniforme original em azul, branco e vermelho.')
add('uniform-uk-tech','Uniforme Reino Tech','clothing','legendary',15000,'uniforms-countries',[{'slot':'torso'}],torso_shell('blue','red','white')+[b('CrossV',(0,.08,.65),(.18,.78,.08),'white'),b('CrossH',(0,.08,.66),(.90,.18,.08),'red')],'Uniforme original inspirado nas cores britânicas.')
add('uniform-spain-tech','Uniforme Sol Tech','clothing','legendary',15000,'uniforms-countries',[{'slot':'torso'}],torso_shell('red','yellow','graphite')+[b('SunCore',(0,.08,.65),(.46,.46,.08),'yellow')],'Uniforme original em vermelho e amarelo.')
add('armor-tech-red','Armadura Tech Vermelha','clothing','mythic',30000,'uniforms-archetypes',[{'slot':'torso'}],torso_shell('red','gold','graphite')+[b('ShoulderL',(-1.18,.55,0),(.42,.52,1.05),'gold'),b('ShoulderR',(1.18,.55,0),(.42,.52,1.05),'gold')],'Armadura original vermelha e dourada de alta tecnologia.')
add('guardian-night','Traje Guardião Noturno','clothing','mythic',28000,'uniforms-archetypes',[{'slot':'torso'},{'slot':'back','variant':'cape'}],torso_shell('charcoal','violet','graphite')+[b('Cape',(0,-.05,-.75),(1.95,2.60,.12),'violet')],'Traje original escuro com capa e detalhes violetas.')
add('acrobat-digital','Traje Acróbata Digital','clothing','mythic',26000,'uniforms-archetypes',[{'slot':'torso'}],torso_shell('navy','cyan','red')+[b('WebLine1',(0,.25,.65),(.10,1.05,.06),'red'),b('WebLine2',(0,.25,.66),(1.10,.10,.06),'cyan')],'Traje leve original para movimentos e acrobacias.')
add('guardian-star','Armadura Guardião Estelar','clothing','mythic',32000,'uniforms-archetypes',[{'slot':'torso'}],torso_shell('blue','gold','white')+[b('Star',(0,.10,.66),(.55,.55,.08),'gold')],'Armadura original azul, branca e dourada.')
add('mystic-arcane','Manto Místico Arcano','clothing','mythic',34000,'uniforms-archetypes',[{'slot':'torso'},{'slot':'back','variant':'cape'}],torso_shell('violet','gold','navy')+[b('Cape',(0,-.15,-.80),(2.10,2.85,.12),'violet'),b('Gem',(0,.20,.68),(.36,.52,.12),'holo')],'Manto original com gema holográfica e detalhes dourados.')
add('thunder-warrior','Armadura Guerreiro do Trovão','clothing','mythic',36000,'uniforms-archetypes',[{'slot':'torso'}],torso_shell('graphite','cyan','silver')+[b('ShoulderL',(-1.20,.55,0),(.45,.55,1.10),'silver'),b('ShoulderR',(1.20,.55,0),(.45,.55,1.10),'silver'),b('Bolt',(0,.08,.68),(.20,.92,.08),'cyan',r=(0,0,.38))],'Armadura original com núcleo de energia elétrica.')

# Feet / back
add('boots-pulse','Botas Pulse','clothing','rare',850,'items-footwear',[{'slot':'foot-left'},{'slot':'foot-right','mirrorX':True}],boots('cyan'),'Botas voxel com sola emissiva.')
add('backpack-nexus','Mochila Nexus','accessory','rare',1250,'items-back',[{'slot':'back'}],backpack('graphite','cyan'),'Mochila modular com painel luminoso.')
add('backpack-scholar','Mochila Scholar Pro','accessory','epic',4200,'items-back',[{'slot':'back'}],backpack('brown','gold')+[b('BookPocket',(0,-.45,-.40),(.82,.38,.14),'red')],'Mochila escolar premium com bolso para livros e notebook.')
add('jetpack-orbit','Jetpack Orbit','vehicle','legendary',8500,'vehicles-flight',[{'slot':'back'}],[b('Core',(0,0,0),(1.15,1.55,.58),'graphite'),b('EngineL',(-.75,-.05,0),(.48,1.55,.48),'silver'),b('EngineR',(.75,-.05,0),(.48,1.55,.48),'silver'),b('GlowL',(-.75,-.93,0),(.32,.22,.32),'cyan'),b('GlowR',(.75,-.93,0),(.32,.22,.32),'cyan'),b('Panel',(0,.25,-.38),(.70,.72,.14),'violet')],'Jetpack com propulsores e painel de controle.')

# Shields / tools
add('shield-sentinel','Escudo Sentinel','accessory','epic',3500,'items-shields',[{'slot':'shield'}],shield('graphite','cyan','silver'),'Escudo tecnológico com núcleo energético.')
add('shield-star','Escudo Estelar','accessory','legendary',12000,'items-shields',[{'slot':'shield'}],shield('blue','gold','white')+[b('StarV',(-.56,0,0),(.10,.90,.30),'gold'),b('StarH',(-.57,0,0),(.10,.30,1.00),'gold')],'Escudo original azul e dourado com símbolo estelar geométrico.')
add('scanner-prisma','Scanner Prisma','tool','rare',1800,'tools-scanners',[{'slot':'held-item-right'}],scanner('graphite','cyan'),'Scanner portátil com tela holográfica.')
add('notebook-holo','Notebook HoloCode','tool','epic',5000,'tools-computing',[{'slot':'held-item-left'}],notebook('graphite','cyan'),'Notebook aberto com tela holográfica.')
add('compass-quantum','Bússola Quantum','tool','epic',4200,'tools-navigation',[{'slot':'held-item-right'}],[b('Body',(0,0,0),(.85,.25,.85),'gold'),b('Dial',(0,.16,0),(.62,.08,.62),'glass'),b('Needle',(0,.24,0),(.12,.05,.55),'red',r=(0,.55,0)),b('Grip',(0,-.48,0),(.26,.70,.26),'brown')],'Bússola tecnológica com ponteiro luminoso.')
add('hammer-thunder','Martelo de Energia Trovejante','tool','legendary',18000,'tools-heroic',[{'slot':'held-item-right'}],[b('Head',(0,.55,0),(1.40,.72,.72),'silver'),b('Core',(0,.55,.43),(.58,.35,.10),'cyan'),b('Handle',(0,-.55,0),(.28,1.70,.28),'brown'),b('Pommel',(0,-1.45,0),(.42,.22,.42),'gold')],'Ferramenta original de energia inspirada em arquétipos de trovão.')
add('staff-arcane','Cajado Prisma Arcano','tool','legendary',16500,'tools-heroic',[{'slot':'held-item-right'}],[b('Staff',(0,-.30,0),(.20,2.70,.20),'gold'),b('Gem',(0,1.22,0),(.72,.72,.72),'holo',r=(.4,.4,.4)),b('Ring',(0,.75,0),(1.05,.12,.30),'violet')],'Cajado original com cristal holográfico.')

# Companion / vehicles
add('drone-iris','Drone Íris','companion','legendary',12500,'companions-drones',[{'slot':'companion'}],drone('cyan'),'Companheiro flutuante reativo.')
add('companion-cube','Cubo Assistente Nexo','companion','epic',6500,'companions-drones',[{'slot':'companion'}],[b('Cube',(0,0,0),(.92,.92,.92),'graphite'),b('Face',(0,0,.50),(.56,.36,.08),'cyan'),b('Top',(0,.56,0),(.52,.16,.52),'holo'),b('WingL',(-.65,0,0),(.36,.12,.62),'silver'),b('WingR',(.65,0,0),(.36,.12,.62),'silver')],'Cubo flutuante com interface expressiva.')
add('skateboard-byte','Skate Byte','vehicle','rare',2600,'vehicles-ground',[{'slot':'vehicle'}],[b('Deck',(0,0,0),(2.10,.14,.62),'graphite'),b('Stripe',(0,.10,0),(1.50,.05,.32),'cyan'),b('Wheel1',(-.72,-.20,.42),(.28,.28,.18),'violet'),b('Wheel2',(.72,-.20,.42),(.28,.28,.18),'violet'),b('Wheel3',(-.72,-.20,-.42),(.28,.28,.18),'violet'),b('Wheel4',(.72,-.20,-.42),(.28,.28,.18),'violet')],'Skate voxel com rodas neon.')
add('hoverboard-neon','Hoverboard Neon Arc','vehicle','legendary',14000,'vehicles-ground',[{'slot':'vehicle'}],hoverboard('violet'),'Prancha flutuante com propulsores violetas.')
add('rocket-pioneer','Foguete Pioneiro DS','vehicle','mythic',45000,'vehicles-flight',[{'slot':'vehicle'}],rocket('orange'),'Foguete voxel para prévias e celebrações.')
add('shoulder-orb','Orbe de Ombro Lumina','accessory','epic',7200,'items-shoulder',[{'slot':'shoulder-right'}],[b('Orb',(0,0,0),(.62,.62,.62),'holo'),b('Mount',(0,-.48,0),(.38,.35,.38),'graphite'),b('Ring',(0,0,0),(.85,.12,.30),'cyan',r=(0,0,.5))],'Orbe holográfico acoplado ao ombro.')

# ---------- GLB builder ----------
CUBE_POS = np.array([
[-.5,-.5,.5],[.5,-.5,.5],[.5,.5,.5],[-.5,.5,.5],
[.5,-.5,-.5],[-.5,-.5,-.5],[-.5,.5,-.5],[.5,.5,-.5],
[-.5,.5,.5],[.5,.5,.5],[.5,.5,-.5],[-.5,.5,-.5],
[-.5,-.5,-.5],[.5,-.5,-.5],[.5,-.5,.5],[-.5,-.5,.5],
[.5,-.5,.5],[.5,-.5,-.5],[.5,.5,-.5],[.5,.5,.5],
[-.5,-.5,-.5],[-.5,-.5,.5],[-.5,.5,.5],[-.5,.5,-.5]], dtype=np.float32)
CUBE_NORM = np.array([[0,0,1]]*4+[[0,0,-1]]*4+[[0,1,0]]*4+[[0,-1,0]]*4+[[1,0,0]]*4+[[-1,0,0]]*4,dtype=np.float32)
CUBE_IDX = np.array([0,1,2,0,2,3,4,5,6,4,6,7,8,9,10,8,10,11,12,13,14,12,14,15,16,17,18,16,18,19,20,21,22,20,22,23],dtype=np.uint16)

def pad4(data:bytes, fill=b' '):
    return data + fill*((4-len(data)%4)%4)

def build_glb(item:dict, path:Path):
    used=[]
    for bx in item['boxes']:
        if bx.material not in used: used.append(bx.material)
    pos=CUBE_POS.tobytes(); norm=CUBE_NORM.tobytes(); idx=CUBE_IDX.tobytes()
    pos_off=0; norm_off=len(pos); idx_off=norm_off+len(norm); binary=pad4(pos+norm+idx,b'\0')
    views=[
      {'buffer':0,'byteOffset':pos_off,'byteLength':len(pos),'target':34962},
      {'buffer':0,'byteOffset':norm_off,'byteLength':len(norm),'target':34962},
      {'buffer':0,'byteOffset':idx_off,'byteLength':len(idx),'target':34963},
    ]
    accessors=[
      {'bufferView':0,'componentType':5126,'count':24,'type':'VEC3','min':[-.5,-.5,-.5],'max':[.5,.5,.5]},
      {'bufferView':1,'componentType':5126,'count':24,'type':'VEC3'},
      {'bufferView':2,'componentType':5123,'count':36,'type':'SCALAR'},
    ]
    mats=[]; meshes=[]; mat_index={}
    for mname in used:
        d=MATERIALS[mname]; mat_index[mname]=len(mats)
        mat={'name':mname,'pbrMetallicRoughness':{'baseColorFactor':d['color'],'metallicFactor':d['metallic'],'roughnessFactor':d['roughness']},'emissiveFactor':d['emissive'],'doubleSided':True}
        if d.get('blend'): mat['alphaMode']='BLEND'
        mats.append(mat)
        meshes.append({'name':'Cube_'+mname,'primitives':[{'attributes':{'POSITION':0,'NORMAL':1},'indices':2,'material':mat_index[mname]}]})
    nodes=[{'name':'ITEM_ROOT','children':list(range(1,len(item['boxes'])+1)),'extras':{'itemId':item['id'],'slotAttachments':item['attachments'],'version':'0.5.0'}}]
    for bx in item['boxes']:
        n={'name':bx.name,'mesh':used.index(bx.material),'translation':list(bx.center),'scale':list(bx.size)}
        if any(abs(x)>1e-7 for x in bx.rotation): n['rotation']=q_euler(*bx.rotation)
        nodes.append(n)
    gltf={'asset':{'version':'2.0','generator':'Loja Virtual DS Equipment Generator v0.5.0'},'scene':0,'scenes':[{'nodes':[0]}],'nodes':nodes,'meshes':meshes,'materials':mats,'buffers':[{'byteLength':len(binary)}],'bufferViews':views,'accessors':accessors,'extras':{'dsStoreVersion':'0.5.0','itemId':item['id'],'category':item['category'],'rarity':item['rarity']}}
    js=pad4(json.dumps(gltf,separators=(',',':'),ensure_ascii=False).encode('utf-8'))
    total=12+8+len(js)+8+len(binary)
    out=struct.pack('<4sII',b'glTF',2,total)+struct.pack('<II',len(js),0x4E4F534A)+js+struct.pack('<II',len(binary),0x004E4942)+binary
    path.write_bytes(out)
    return len(nodes),len(out)

# ---------- preview renderer ----------
FACES=[(0,1,2,3),(4,7,6,5),(3,2,7,4),(0,5,6,1),(1,6,7,2),(0,3,4,5)]
FACE_SHADE=[1.0,.42,.86,.48,.72,.62]

def rotmat(rx,ry,rz):
    cx,sx=math.cos(rx),math.sin(rx); cy,sy=math.cos(ry),math.sin(ry); cz,sz=math.cos(rz),math.sin(rz)
    Rx=np.array([[1,0,0],[0,cx,-sx],[0,sx,cx]]); Ry=np.array([[cy,0,sy],[0,1,0],[-sy,0,cy]]); Rz=np.array([[cz,-sz,0],[sz,cz,0],[0,0,1]])
    return Rz@Ry@Rx

def rgba(mat, shade=1):
    c=MATERIALS[mat]['color']; return tuple(max(0,min(255,int(v*255*shade))) for v in c[:3])+(int(c[3]*255),)

def render_preview(item:dict, path:Path, size=512):
    yaw=math.radians(-35); pitch=math.radians(22); Rcam=rotmat(pitch,yaw,0)
    polys=[]; all2=[]
    for bx in item['boxes']:
        verts=np.array([[-.5,-.5,-.5],[.5,-.5,-.5],[.5,.5,-.5],[-.5,.5,-.5],[-.5,-.5,.5],[.5,-.5,.5],[.5,.5,.5],[-.5,.5,.5]],float)
        verts*=np.array(bx.size); verts=(rotmat(*bx.rotation)@verts.T).T+np.array(bx.center); v=(Rcam@verts.T).T
        pts=np.column_stack([v[:,0],-v[:,1]])
        all2.extend(pts.tolist())
        for fi,face in enumerate(FACES):
            p3=v[list(face)]; normal=np.cross(p3[1]-p3[0],p3[2]-p3[0])
            if normal[2] <= 0: continue
            depth=float(p3[:,2].mean()); polys.append((depth,pts[list(face)],rgba(bx.material,FACE_SHADE[fi])))
    arr=np.array(all2); mn=arr.min(axis=0); mx=arr.max(axis=0); span=max(*(mx-mn),1e-6); scale=size*.66/span; center=(mn+mx)/2
    img=Image.new('RGBA',(size,size),(3,8,18,255)); draw=ImageDraw.Draw(img,'RGBA')
    # glow platform
    draw.ellipse((size*.20,size*.78,size*.80,size*.91),fill=(22,180,255,28),outline=(42,215,255,80),width=3)
    for _,pts,col in sorted(polys,key=lambda x:x[0]):
        pp=[((p[0]-center[0])*scale+size/2,(p[1]-center[1])*scale+size*.48) for p in pts]
        draw.polygon(pp,fill=col,outline=(130,220,255,45))
    # vignette/frame
    draw.rounded_rectangle((8,8,size-8,size-8),radius=28,outline=(42,215,255,70),width=2)
    img.save(path.with_suffix('.png'))
    img.convert('RGB').save(path.with_suffix('.webp'),'WEBP',quality=88,method=6)

manifest=[]
for item in items:
    glb=MODELS/f"{item['id']}.glb"; nodes,sz=build_glb(item,glb); render_preview(item,PREVIEWS/item['id'])
    manifest.append({k:v for k,v in item.items() if k!='boxes'} | {'model3d':f'assets/equipment/models/{item["id"]}.glb','preview':f'assets/equipment/previews/{item["id"]}.webp','nodes':nodes,'bytes':sz,'sha256':hashlib.sha256(glb.read_bytes()).hexdigest()})

(OUT/'equipment-manifest.json').write_text(json.dumps({'version':'0.5.0','rig':'DS_VOXEL_RIG_1','items':manifest},ensure_ascii=False,indent=2),encoding='utf-8')

presets=[
 {'id':'preset-tech-student','name':'Estudante Tech','items':['hair-cyan-stripe','shirt-code-grid','boots-pulse','backpack-nexus','scanner-prisma','shield-sentinel']},
 {'id':'preset-brazil','name':'Brasil Tech','items':['hair-wave-dark','uniform-brazil-tech','boots-pulse','backpack-scholar','drone-iris']},
 {'id':'preset-night','name':'Guardião Noturno','items':['helmet-orbit','guardian-night','boots-pulse','shield-sentinel','shoulder-orb']},
 {'id':'preset-arcane','name':'Místico Arcano','items':['visor-holo','mystic-arcane','staff-arcane','companion-cube']},
 {'id':'preset-thunder','name':'Guerreiro do Trovão','items':['helmet-orbit','thunder-warrior','hammer-thunder','jetpack-orbit']},
]
(OUT/'presets.json').write_text(json.dumps({'version':'0.5.0','presets':presets},ensure_ascii=False,indent=2),encoding='utf-8')

# contact sheet
thumbs=[]
for item in items:
    thumbs.append((item,Image.open(PREVIEWS/f"{item['id']}.png").resize((220,220))))
w=1100; rows=math.ceil(len(thumbs)/5); h=rows*275+90
sheet=Image.new('RGB',(w,h),(5,10,20)); d=ImageDraw.Draw(sheet)
d.text((32,22),'Loja Virtual DS v0.5.0 — Itens 3D equipáveis',fill=(230,248,255))
for i,(item,img) in enumerate(thumbs):
    x=20+(i%5)*216; y=70+(i//5)*275
    sheet.paste(img.convert('RGB'),(x,y)); d.text((x+8,y+224),item['name'][:28],fill=(210,236,248)); d.text((x+8,y+244),f"{item['rarity']} • {item['basePrice']:,} moedas".replace(',','.'),fill=(80,200,240))
sheet.save(ROOT/'assets/previews/v0.5.0-equipment-catalog.png')
print(f'gerados {len(items)} itens')
