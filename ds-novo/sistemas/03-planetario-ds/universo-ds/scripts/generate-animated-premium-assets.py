#!/usr/bin/env python3
import json, math, struct, os
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'public/assets/premium/models'
MANIFEST=ROOT/'public/assets/premium/manifest.json'
OUT.mkdir(parents=True,exist_ok=True)

def quat(axis,angle):
    x,y,z=axis; s=math.sin(angle/2); return [x*s,y*s,z*s,math.cos(angle/2)]

def box(size=(1,1,1), color=(1,1,1,1)):
    sx,sy,sz=[v/2 for v in size]
    faces=[
      ((0,0,1),[(-sx,-sy,sz),(sx,-sy,sz),(sx,sy,sz),(-sx,sy,sz)]),
      ((0,0,-1),[(sx,-sy,-sz),(-sx,-sy,-sz),(-sx,sy,-sz),(sx,sy,-sz)]),
      ((1,0,0),[(sx,-sy,sz),(sx,-sy,-sz),(sx,sy,-sz),(sx,sy,sz)]),
      ((-1,0,0),[(-sx,-sy,-sz),(-sx,-sy,sz),(-sx,sy,sz),(-sx,sy,-sz)]),
      ((0,1,0),[(-sx,sy,sz),(sx,sy,sz),(sx,sy,-sz),(-sx,sy,-sz)]),
      ((0,-1,0),[(-sx,-sy,-sz),(sx,-sy,-sz),(sx,-sy,sz),(-sx,-sy,sz)])]
    p=[];n=[];c=[];idx=[]
    for normal,verts in faces:
      base=len(p)//3
      for v in verts: p+=v;n+=normal;c+=color
      idx += [base,base+1,base+2,base,base+2,base+3]
    return p,n,c,idx

def cylinder(radius=1,height=1,segments=12,color=(1,1,1,1), capped=True):
    p=[];n=[];c=[];idx=[]; h=height/2
    for i in range(segments):
      a=2*math.pi*i/segments; x=math.cos(a)*radius;z=math.sin(a)*radius
      p += [x,-h,z,x,h,z]; n += [math.cos(a),0,math.sin(a)]*2; c += list(color)*2
    for i in range(segments):
      j=(i+1)%segments; idx += [2*i,2*j,2*j+1,2*i,2*j+1,2*i+1]
    if capped:
      for y,ny,rev in [(-h,-1,True),(h,1,False)]:
        center=len(p)//3;p += [0,y,0];n += [0,ny,0];c += list(color)
        ring=[]
        for i in range(segments):
          a=2*math.pi*i/segments;ring.append(len(p)//3);p += [math.cos(a)*radius,y,math.sin(a)*radius];n += [0,ny,0];c += list(color)
        for i in range(segments):
          j=(i+1)%segments
          idx += [center,ring[j],ring[i]] if rev else [center,ring[i],ring[j]]
    return p,n,c,idx

def cone(radius=1,height=1,segments=12,color=(1,1,1,1)):
    p=[];n=[];c=[];idx=[];h=height/2
    tip=[0,h,0]
    for i in range(segments):
      a=2*math.pi*i/segments;b=2*math.pi*(i+1)/segments
      v0=[math.cos(a)*radius,-h,math.sin(a)*radius];v1=[math.cos(b)*radius,-h,math.sin(b)*radius]
      u=[v1[k]-v0[k] for k in range(3)];v=[tip[k]-v0[k] for k in range(3)]
      nn=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];l=math.sqrt(sum(x*x for x in nn)) or 1;nn=[x/l for x in nn]
      base=len(p)//3
      for q in (v0,v1,tip): p+=q;n+=nn;c+=color
      idx += [base,base+1,base+2]
    base_center=len(p)//3;p += [0,-h,0];n += [0,-1,0];c += color
    ring=[]
    for i in range(segments):
      a=2*math.pi*i/segments;ring.append(len(p)//3);p += [math.cos(a)*radius,-h,math.sin(a)*radius];n += [0,-1,0];c += color
    for i in range(segments):idx += [base_center,ring[(i+1)%segments],ring[i]]
    return p,n,c,idx

def uv_sphere(radius=1,segments=12,rings=8,color=(1,1,1,1)):
    p=[];n=[];c=[];idx=[]
    for y in range(rings+1):
      v=y/rings;phi=v*math.pi
      for x in range(segments+1):
        u=x/segments;theta=u*2*math.pi
        nx=math.sin(phi)*math.cos(theta);ny=math.cos(phi);nz=math.sin(phi)*math.sin(theta)
        p += [nx*radius,ny*radius,nz*radius];n += [nx,ny,nz];c += color
    for y in range(rings):
      for x in range(segments):
        a=y*(segments+1)+x;b=a+segments+1
        idx += [a,b,a+1,b,b+1,a+1]
    return p,n,c,idx

COLORS={
 'white':(0.9,0.94,0.98,1),'dark':(0.08,0.11,0.16,1),'gold':(0.95,0.58,0.16,1),
 'solar':(0.08,0.22,0.62,1),'red':(0.75,0.12,0.08,1),'silver':(0.45,0.55,0.64,1),
 'mars':(0.65,0.28,0.12,1),'blue':(0.12,0.54,0.92,1),'fabric':(0.72,0.75,0.78,1)
}

class Builder:
  def __init__(self,name,lod):
    self.name=name;self.lod=lod;self.parts=[];self.nodes=[];self.animations=[];self.root=self.node('ROOT',None,children=[],extras={'collider':{'type':'sphere','radius':2.5}})
  def node(self,name,mesh=None,translation=None,rotation=None,scale=None,children=None,extras=None,parent=None):
    d={'name':name}
    if mesh is not None:d['mesh']=mesh
    if translation:d['translation']=translation
    if rotation:d['rotation']=rotation
    if scale:d['scale']=scale
    if children is not None:d['children']=children
    if extras:d['extras']=extras
    i=len(self.nodes);self.nodes.append(d)
    if parent is not None:self.nodes[parent].setdefault('children',[]).append(i)
    return i
  def part(self,name,geom,translation=(0,0,0),rotation=None,scale=None,parent=None,interaction=None,collider=None):
    mesh=len(self.parts);self.parts.append((name,geom));extras={}
    if interaction:extras['interaction']=interaction
    if collider:extras['collider']=collider
    return self.node(name,mesh,list(translation),rotation,scale,extras=extras or None,parent=self.root if parent is None else parent)
  def clip(self,name,duration,channels,loop=True):
    self.animations.append({'name':name,'duration':duration,'channels':channels,'extras':{'loop':loop}})

def build_asset(asset,lod):
  seg=[8,14,22][lod];rings=[5,8,12][lod];b=Builder(asset,lod)
  W=COLORS['white'];D=COLORS['dark'];G=COLORS['gold'];S=COLORS['solar'];R=COLORS['red'];M=COLORS['mars'];B=COLORS['blue'];F=COLORS['fabric'];V=COLORS['silver']
  if asset=='rocket':
    body=b.part('Core',cylinder(.46,3.6,seg,W),collider={'type':'capsule','radius':.46,'height':3.6})
    upper=b.part('UpperStage',cylinder(.34,1.6,seg,W),translation=(0,2.55,0),interaction='stage-separation')
    nose=b.part('Fairing',cone(.35,1.2,seg,W),translation=(0,3.95,0),parent=upper)
    engines=[]
    for x,z in [(-.22,-.2),(.22,-.2),(-.22,.2),(.22,.2)]:engines.append(b.part(f'Engine{len(engines)+1}',cone(.12,.45,seg,D),translation=(x,-2.03,z),rotation=quat((1,0,0),math.pi),interaction='engine-gimbal'))
    for ang in [0,math.pi/2,math.pi,3*math.pi/2]:
      b.part('Fin',box((.08,.7,.65),R),translation=(math.cos(ang)*.48,-1.35,math.sin(ang)*.48),rotation=quat((0,1,0),-ang))
    b.clip('idle',4,[{'node':body,'path':'rotation','times':[0,2,4],'values':[quat((0,1,0),0),quat((0,1,0),.12),quat((0,1,0),0)]}])
    b.clip('stage-separation',2,[{'node':upper,'path':'translation','times':[0,.7,2],'values':[[0,2.55,0],[0,3.1,0],[0,5.8,0]]}])
    for i,e in enumerate(engines):b.clip(f'gimbal-{i+1}',1.2,[{'node':e,'path':'rotation','times':[0,.3,.6,.9,1.2],'values':[quat((1,0,0),math.pi),quat((1,0,0),math.pi+.12),quat((1,0,0),math.pi-.12),quat((1,0,0),math.pi+.08),quat((1,0,0),math.pi)]}])
  elif asset=='shuttle':
    fus=b.part('Orbiter',box((1.05,.65,3.2),W),rotation=quat((1,0,0),math.pi/2),collider={'type':'box','size':[1.05,.65,3.2]})
    b.part('Nose',cone(.48,1.0,seg,W),translation=(0,0,2.05),rotation=quat((1,0,0),math.pi/2),parent=fus)
    b.part('LeftWing',box((2.1,.12,1.35),D),translation=(-1.2,-.08,.2),rotation=quat((0,1,0),-.15),parent=fus)
    b.part('RightWing',box((2.1,.12,1.35),D),translation=(1.2,-.08,.2),rotation=quat((0,1,0),.15),parent=fus)
    doorL=b.part('CargoDoorLeft',box((.5,.08,2.1),W),translation=(-.28,.38,.05),interaction='cargo-bay',parent=fus)
    doorR=b.part('CargoDoorRight',box((.5,.08,2.1),W),translation=(.28,.38,.05),interaction='cargo-bay',parent=fus)
    gear=[]
    for pos in [(-.42,-.42,-.7),(.42,-.42,-.7),(0,-.42,1.15)]:gear.append(b.part('LandingGear',cylinder(.09,.55,seg,D),translation=pos,rotation=quat((1,0,0),math.pi/2),parent=fus))
    b.clip('cargo-bay',2,[{'node':doorL,'path':'rotation','times':[0,1,2],'values':[quat((0,0,1),0),quat((0,0,1),-1.35),quat((0,0,1),-1.35)]},{'node':doorR,'path':'rotation','times':[0,1,2],'values':[quat((0,0,1),0),quat((0,0,1),1.35),quat((0,0,1),1.35)]}],False)
    gear_channels=[]
    for g in gear:
      selfv=b.nodes[g].get('translation',[0,0,0]);gear_channels.append({'node':g,'path':'translation','times':[0,.75,1.5],'values':[selfv,[selfv[0],selfv[1]-.35,selfv[2]],[selfv[0],selfv[1]-.45,selfv[2]]]})
    b.clip('landing-gear',1.5,gear_channels,False)
  elif asset=='capsule':
    body=b.part('PressureVessel',cone(.9,1.6,seg,W),collider={'type':'cone','radius':.9,'height':1.6})
    ring=b.part('DockingRing',cylinder(.34,.24,seg,V),translation=(0,.92,0),interaction='docking-ring')
    hatch=b.part('Hatch',cylinder(.32,.08,seg,D),translation=(.72,.1,0),rotation=quat((0,0,1),math.pi/2),interaction='hatch')
    panels=[]
    for x in (-1.35,1.35): panels.append(b.part('SolarPanel',box((1.25,.06,.55),S),translation=(x,-.15,0),interaction='solar-deploy'))
    b.clip('hatch',1.5,[{'node':hatch,'path':'rotation','times':[0,.75,1.5],'values':[quat((0,0,1),math.pi/2),quat((0,1,0),-1.1),quat((0,1,0),-1.1)]}],False)
    b.clip('solar-deploy',2,[{'node':panels[0],'path':'translation','times':[0,1,2],'values':[[-.55,-.15,0],[-1,-.15,0],[-1.35,-.15,0]]},{'node':panels[1],'path':'translation','times':[0,1,2],'values':[[.55,-.15,0],[1,-.15,0],[1.35,-.15,0]]}],False)
  elif asset=='rover':
    chassis=b.part('Chassis',box((2.0,.45,1.4),M),translation=(0,.75,0),collider={'type':'box','size':[2,.45,1.4]})
    wheels=[]
    for x in (-.85,0,.85):
      for z in (-.82,.82): wheels.append(b.part('Wheel',cylinder(.27,.18,seg,D),translation=(x,.35,z),rotation=quat((1,0,0),math.pi/2),interaction='wheel',collider={'type':'cylinder','radius':.27,'height':.18}))
    mast=b.part('Mast',cylinder(.12,1.15,seg,V),translation=(0,1.45,0),parent=chassis)
    b.part('CameraHead',box((.55,.25,.28),D),translation=(0,.67,0),parent=mast,interaction='mast-camera')
    shoulder=b.part('ArmShoulder',cylinder(.11,.75,seg,V),translation=(.72,.7,0),rotation=quat((0,0,1),math.pi/2),parent=chassis,interaction='robotic-arm')
    elbow=b.part('ArmElbow',cylinder(.09,.7,seg,V),translation=(.42,0,0),rotation=quat((0,0,1),math.pi/2),parent=shoulder)
    b.part('ToolHead',uv_sphere(.16,seg,rings,G),translation=(.4,0,0),parent=elbow)
    channels=[]
    for w in wheels:channels.append({'node':w,'path':'rotation','times':[0,1,2],'values':[quat((1,0,0),0),quat((1,0,0),math.pi),quat((1,0,0),2*math.pi)]})
    b.clip('drive',2,channels)
    b.clip('arm-sample',3,[{'node':shoulder,'path':'rotation','times':[0,1.2,2.2,3],'values':[quat((0,0,1),math.pi/2),quat((0,0,1),.45),quat((0,0,1),.2),quat((0,0,1),math.pi/2)]},{'node':elbow,'path':'rotation','times':[0,1.2,2.2,3],'values':[quat((0,0,1),math.pi/2),quat((0,0,1),-.65),quat((0,0,1),-.9),quat((0,0,1),math.pi/2)]}])
    b.clip('mast-pan',2,[{'node':mast,'path':'rotation','times':[0,.5,1,1.5,2],'values':[quat((0,1,0),0),quat((0,1,0),.8),quat((0,1,0),0),quat((0,1,0),-.8),quat((0,1,0),0)]}])
  elif asset=='satellite':
    body=b.part('Bus',box((1,1,1),V),collider={'type':'box','size':[1,1,1]})
    left=b.part('PanelLeft',box((2.2,.07,.75),S),translation=(-1.65,0,0),interaction='solar-panel')
    right=b.part('PanelRight',box((2.2,.07,.75),S),translation=(1.65,0,0),interaction='solar-panel')
    dish=b.part('Dish',cone(.65,.25,seg,W),translation=(0,.72,0),interaction='antenna')
    b.clip('deploy',2,[{'node':left,'path':'scale','times':[0,1,2],'values':[[.08,1,1],[.55,1,1],[1,1,1]]},{'node':right,'path':'scale','times':[0,1,2],'values':[[.08,1,1],[.55,1,1],[1,1,1]]}],False)
    b.clip('scan',3,[{'node':dish,'path':'rotation','times':[0,.75,1.5,2.25,3],'values':[quat((0,1,0),0),quat((0,1,0),1),quat((0,1,0),0),quat((0,1,0),-1),quat((0,1,0),0)]}])
  elif asset=='station':
    core=b.part('CoreModule',cylinder(.55,3.2,seg,W),rotation=quat((0,0,1),math.pi/2),collider={'type':'capsule','radius':.55,'height':3.2})
    truss=b.part('MainTruss',box((5.4,.18,.22),V),parent=core)
    panels=[]
    for x in (-2,-.8,.8,2):panels.append(b.part('SolarArray',box((1.3,.07,1.4),S),translation=(x,.05,0),parent=truss,interaction='solar-track'))
    arm1=b.part('ArmBase',cylinder(.1,1.2,seg,V),translation=(0,.65,.45),rotation=quat((0,0,1),math.pi/2),parent=core,interaction='robotic-arm')
    arm2=b.part('ArmElbow',cylinder(.08,1.0,seg,V),translation=(.65,0,0),rotation=quat((0,0,1),math.pi/2),parent=arm1)
    b.part('Cupola',uv_sphere(.35,seg,rings,B),translation=(0,-.55,0),parent=core,interaction='cupola')
    b.clip('solar-track',4,[{'node':p,'path':'rotation','times':[0,1,2,3,4],'values':[quat((1,0,0),0),quat((1,0,0),.45),quat((1,0,0),0),quat((1,0,0),-.45),quat((1,0,0),0)]} for p in panels])
    b.clip('arm-capture',3,[{'node':arm1,'path':'rotation','times':[0,1,2,3],'values':[quat((0,0,1),math.pi/2),quat((0,0,1),.6),quat((0,0,1),.25),quat((0,0,1),math.pi/2)]},{'node':arm2,'path':'rotation','times':[0,1,2,3],'values':[quat((0,0,1),math.pi/2),quat((0,0,1),-.7),quat((0,0,1),-.3),quat((0,0,1),math.pi/2)]}])
  elif asset=='lander':
    body=b.part('DescentStage',box((1.5,.7,1.5),G),translation=(0,.8,0),collider={'type':'box','size':[1.5,.7,1.5]})
    ascent=b.part('AscentCabin',box((1.05,1.15,1.0),W),translation=(0,1.65,0),parent=body)
    hatch=b.part('Hatch',box((.46,.52,.08),D),translation=(0,1.68,.54),interaction='hatch')
    legs=[]
    for x,z in [(-.9,-.9),(.9,-.9),(-.9,.9),(.9,.9)]:legs.append(b.part('LandingLeg',cylinder(.07,1.3,seg,V),translation=(x,.1,z),rotation=quat((0,0,1),math.pi/4 if x>0 else -math.pi/4),interaction='landing-leg'))
    ladder=b.part('Ladder',box((.45,1.4,.08),V),translation=(0,.2,.83),interaction='ladder')
    b.clip('gear-deploy',2,[{'node':leg,'path':'rotation','times':[0,1,2],'values':[quat((0,0,1),0),b.nodes[leg].get('rotation',quat((0,0,1),.7)),b.nodes[leg].get('rotation',quat((0,0,1),.7))]} for leg in legs],False)
    b.clip('hatch',1.4,[{'node':hatch,'path':'rotation','times':[0,.7,1.4],'values':[quat((0,1,0),0),quat((0,1,0),-1.4),quat((0,1,0),-1.4)]}],False)
  elif asset=='suit':
    torso=b.part('Torso',box((.9,1.25,.48),F),translation=(0,1.45,0),collider={'type':'capsule','radius':.45,'height':1.8})
    helmet=b.part('Helmet',uv_sphere(.42,seg,rings,W),translation=(0,2.35,0),parent=torso,interaction='visor')
    left=b.part('LeftArm',cylinder(.16,1.05,seg,F),translation=(-.58,1.55,0),rotation=quat((0,0,1),-.15),parent=torso)
    right=b.part('RightArm',cylinder(.16,1.05,seg,F),translation=(.58,1.55,0),rotation=quat((0,0,1),.15),parent=torso)
    for x in (-.26,.26):b.part('Leg',cylinder(.19,1.15,seg,F),translation=(x,.35,0),parent=torso)
    b.part('Backpack',box((.72,.92,.32),V),translation=(0,1.48,-.42),parent=torso,interaction='life-support')
    b.clip('wave',2.4,[{'node':right,'path':'rotation','times':[0,.6,1.2,1.8,2.4],'values':[quat((0,0,1),.15),quat((0,0,1),-1.4),quat((1,0,0),-.5),quat((0,0,1),-1.4),quat((0,0,1),.15)]}])
    b.clip('point',2,[{'node':left,'path':'rotation','times':[0,1,2],'values':[quat((0,0,1),-.15),quat((0,0,1),1.4),quat((0,0,1),-.15)]}])
  return b

def pack_f32(vals):return struct.pack('<%sf'%len(vals),*vals)
def pack_u32(vals):return struct.pack('<%sI'%len(vals),*vals)
def align4_bytes(data):return data+b'\0'*((-len(data))%4)

def write_glb(builder,path):
  gltf={'asset':{'version':'2.0','generator':'COSMOS DS Animated Asset Pipeline','extras':{'phase':18,'tier':'hd-animated'}},'scene':0,'scenes':[{'nodes':[builder.root]}],'nodes':builder.nodes,'meshes':[],'buffers':[{'byteLength':0}],'bufferViews':[],'accessors':[],'animations':[]}
  binary=bytearray(); total_tri=total_vert=0
  def add_view(raw,target=None):
    nonlocal binary
    while len(binary)%4:binary.append(0)
    off=len(binary);binary.extend(raw);d={'buffer':0,'byteOffset':off,'byteLength':len(raw)}
    if target:d['target']=target
    gltf['bufferViews'].append(d);return len(gltf['bufferViews'])-1
  def add_accessor(vals,ctype,atype,count,minv=None,maxv=None,target=None):
    raw=pack_f32(vals) if ctype==5126 else pack_u32(vals)
    vi=add_view(raw,target);d={'bufferView':vi,'componentType':ctype,'count':count,'type':atype}
    if minv is not None:d['min']=minv
    if maxv is not None:d['max']=maxv
    gltf['accessors'].append(d);return len(gltf['accessors'])-1
  for name,(p,n,c,idx) in builder.parts:
    xs=p[0::3];ys=p[1::3];zs=p[2::3]
    pa=add_accessor(p,5126,'VEC3',len(p)//3,[min(xs),min(ys),min(zs)],[max(xs),max(ys),max(zs)],34962)
    na=add_accessor(n,5126,'VEC3',len(n)//3,target=34962);ca=add_accessor(c,5126,'VEC4',len(c)//4,target=34962);ia=add_accessor(idx,5125,'SCALAR',len(idx),target=34963)
    gltf['meshes'].append({'name':name,'primitives':[{'attributes':{'POSITION':pa,'NORMAL':na,'COLOR_0':ca},'indices':ia,'mode':4}]})
    total_tri+=len(idx)//3;total_vert+=len(p)//3
  for clip in builder.animations:
    samplers=[];channels=[]
    for ch in clip['channels']:
      times=ch['times'];vals=ch['values'];path_name=ch['path'];flat=[v for row in vals for v in row];width=len(vals[0]);typ={3:'VEC3',4:'VEC4'}[width]
      ia=add_accessor(times,5126,'SCALAR',len(times),[min(times)],[max(times)])
      oa=add_accessor(flat,5126,typ,len(vals))
      si=len(samplers);samplers.append({'input':ia,'output':oa,'interpolation':'LINEAR'});channels.append({'sampler':si,'target':{'node':ch['node'],'path':path_name}})
    gltf['animations'].append({'name':clip['name'],'samplers':samplers,'channels':channels,'extras':clip.get('extras',{})})
  gltf['buffers'][0]['byteLength']=len(binary)
  json_bytes=align4_bytes(json.dumps(gltf,separators=(',',':')).encode('utf-8')+b' ')
  bin_bytes=align4_bytes(bytes(binary))
  total=12+8+len(json_bytes)+8+len(bin_bytes)
  out=bytearray(struct.pack('<III',0x46546C67,2,total));out+=struct.pack('<II',len(json_bytes),0x4E4F534A)+json_bytes;out+=struct.pack('<II',len(bin_bytes),0x004E4942)+bin_bytes
  path.write_bytes(out);return {'bytes':len(out),'triangles':total_tri,'vertices':total_vert,'animations':[a['name'] for a in builder.animations],'parts':len(builder.parts)}

def main():
  manifest=json.loads(MANIFEST.read_text())
  manifest['schema']='cosmos-ds-premium-assets-v2';manifest['version']='18.0.0';manifest['generatedAt']='2026-08-04T04:10:00-03:00'
  manifest['policy'].update({'animations':'glTF animation channels with named nodes','colliders':'node extras with simplified collider metadata','tiers':'basic, hd and ultra-ready','interactions':'named node interaction points'})
  total=0
  for asset in manifest['assets']:
    asset['packageTier']='hd-animated';asset['interactions']=[];asset['colliders']=[]
    for lod in asset['lods']:
      b=build_asset(asset['id'],lod['level']);meta=write_glb(b,ROOT/lod['url'].replace('./',''))
      lod.update(meta);total+=meta['bytes']
      asset['animations']=meta['animations'];asset['parts']=meta['parts']
      if not asset['interactions']:
        for i,node in enumerate(b.nodes):
          ex=node.get('extras',{})
          if ex.get('interaction'):asset['interactions'].append({'node':i,'name':node['name'],'action':ex['interaction']})
          if ex.get('collider'):asset['colliders'].append({'node':i,'name':node['name'],**ex['collider']})
  manifest['summary']={'assets':len(manifest['assets']),'glbs':sum(len(a['lods']) for a in manifest['assets']),'animatedAssets':sum(bool(a.get('animations')) for a in manifest['assets']),'totalBytes':total}
  MANIFEST.write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
  print(json.dumps(manifest['summary'],indent=2))
if __name__=='__main__':main()
