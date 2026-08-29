import { SOLAR_BODIES, ORBITAL_FLEET, BODY_BY_ID, SATELLITE_BY_ID, SOLAR_TOUR } from '../data/solarSystemBodies.js';

const TAU=Math.PI*2;
const clamp=(v,min,max)=>Math.min(max,Math.max(min,v));
const vec3=(x=0,y=0,z=0)=>({x,y,z});
const sub=(a,b)=>vec3(a.x-b.x,a.y-b.y,a.z-b.z);
const add=(a,b)=>vec3(a.x+b.x,a.y+b.y,a.z+b.z);
const scale=(a,s)=>vec3(a.x*s,a.y*s,a.z*s);
const length=a=>Math.hypot(a.x,a.y,a.z);
const normalize=a=>{const l=length(a)||1;return scale(a,1/l);};
const cross=(a,b)=>vec3(a.y*b.z-a.z*b.y,a.z*b.x-a.x*b.z,a.x*b.y-a.y*b.x);
const dot=(a,b)=>a.x*b.x+a.y*b.y+a.z*b.z;
const hex=value=>{const text=value.replace('#','');const n=parseInt(text,16);return[(n>>16&255)/255,(n>>8&255)/255,(n&255)/255];};

function perspective(out,fovy,aspect,near,far){const f=1/Math.tan(fovy/2),nf=1/(near-far);out.set([f/aspect,0,0,0,0,f,0,0,0,0,(far+near)*nf,-1,0,0,2*far*near*nf,0]);return out;}
function lookAt(out,eye,center,up){const z=normalize(sub(eye,center)),x=normalize(cross(up,z)),y=cross(z,x);out.set([x.x,y.x,z.x,0,x.y,y.y,z.y,0,x.z,y.z,z.z,0,-dot(x,eye),-dot(y,eye),-dot(z,eye),1]);return out;}
function identity(){return new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]);}
function modelMatrix(position,rotationY=0,rotationZ=0,size=1,scaleY=size,scaleZ=size){
  const cy=Math.cos(rotationY),sy=Math.sin(rotationY),cz=Math.cos(rotationZ),sz=Math.sin(rotationZ);
  return new Float32Array([
    cy*cz*size, sz*scaleY, -sy*cz*scaleZ,0,
    -cy*sz*size,cz*scaleY,sy*sz*scaleZ,0,
    sy*size,0,cy*scaleZ,0,
    position.x,position.y,position.z,1
  ]);
}
function multiply(out,a,b){for(let c=0;c<4;c++)for(let r=0;r<4;r++)out[c*4+r]=a[0*4+r]*b[c*4+0]+a[1*4+r]*b[c*4+1]+a[2*4+r]*b[c*4+2]+a[3*4+r]*b[c*4+3];return out;}

function sphereGeometry(segments=64,rings=40){const p=[],n=[],uv=[],idx=[];for(let y=0;y<=rings;y++){const v=y/rings,phi=v*Math.PI;for(let x=0;x<=segments;x++){const u=x/segments,theta=u*TAU,sx=Math.sin(phi)*Math.cos(theta),sy=Math.cos(phi),sz=Math.sin(phi)*Math.sin(theta);p.push(sx,sy,sz);n.push(sx,sy,sz);uv.push(u,1-v);}}for(let y=0;y<rings;y++)for(let x=0;x<segments;x++){const a=y*(segments+1)+x,b=a+segments+1;idx.push(a,b,a+1,b,a+1,b+1);}return{positions:new Float32Array(p),normals:new Float32Array(n),uvs:new Float32Array(uv),indices:new Uint32Array(idx)};}
function cubeGeometry(){const p=[-1,-1,1,1,-1,1,1,1,1,-1,1,1,1,-1,-1,-1,-1,-1,-1,1,-1,1,1,-1,-1,1,1,1,1,1,1,1,-1,-1,1,-1,-1,-1,-1,-1,-1,1,1,-1,1,1,-1,1,1,-1,1,-1,1,1,1,1,-1,-1,-1,1,-1,1,1,1,1,1,1,-1,1,-1,-1,-1,-1,-1,1,-1,1,-1,1,1,-1,1,-1];const idx=[];for(let f=0;f<6;f++){const o=f*4;idx.push(o,o+1,o+2,o,o+2,o+3);}return{positions:new Float32Array(p),indices:new Uint16Array(idx)};}
function ringGeometry(segments=160){const p=[],uv=[],idx=[];for(let i=0;i<=segments;i++){const a=i/segments*TAU,c=Math.cos(a),s=Math.sin(a);p.push(c,0,s,c,0,s);uv.push(0,i/segments,1,i/segments);}for(let i=0;i<segments;i++){const o=i*2;idx.push(o,o+1,o+2,o+1,o+3,o+2);}return{positions:new Float32Array(p),uvs:new Float32Array(uv),indices:new Uint16Array(idx)};}
function circleGeometry(segments=192){const p=[];for(let i=0;i<=segments;i++){const a=i/segments*TAU;p.push(Math.cos(a),0,Math.sin(a));}return new Float32Array(p);}
function seededRandom(seed){let s=seed>>>0;return()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296;};}
function starCloud(count,radiusMin,radiusMax,seed=11){const rnd=seededRandom(seed),p=[],s=[];for(let i=0;i<count;i++){const z=rnd()*2-1,a=rnd()*TAU,r=radiusMin+(radiusMax-radiusMin)*Math.pow(rnd(),.45),q=Math.sqrt(1-z*z);p.push(Math.cos(a)*q*r,z*r,Math.sin(a)*q*r);s.push(.5+rnd()*1.5);}return{positions:new Float32Array(p),sizes:new Float32Array(s)};}

const planetVertex=`#version 300 es
precision highp float;
in vec3 a_position;in vec3 a_normal;in vec2 a_uv;
uniform mat4 u_model,u_view,u_projection;
out vec3 v_world;out vec3 v_normal;out vec2 v_uv;
void main(){vec4 world=u_model*vec4(a_position,1.);v_world=world.xyz;v_normal=normalize(mat3(u_model)*a_normal);v_uv=a_uv;gl_Position=u_projection*u_view*world;}`;
const planetFragment=`#version 300 es
precision highp float;
in vec3 v_world;in vec3 v_normal;in vec2 v_uv;out vec4 outColor;
uniform vec3 u_colorA,u_colorB,u_colorC,u_sunPos,u_cameraPos,u_atmosphereColor;
uniform float u_time,u_emissive,u_atmosphere,u_selected,u_shell,u_detail,u_rotation;
uniform int u_style;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<6;i++){v+=a*noise(p);p=p*2.03+19.7;a*=.5;}return v;}
void main(){
 vec3 n=normalize(v_normal),viewDir=normalize(u_cameraPos-v_world),sunDir=normalize(u_sunPos-v_world);
 float ndl=max(dot(n,sunDir),0.),rim=pow(1.-max(dot(n,viewDir),0.),2.7);
 if(u_shell>.5){float alpha=rim*u_atmosphere*(.35+.5*ndl);outColor=vec4(u_atmosphereColor*(.65+ndl),alpha);return;}
 vec2 uv=vec2(fract(v_uv.x+u_rotation),v_uv.y);float lat=(uv.y-.5)*3.14159,lon=(uv.x-.5)*6.28318;
 float f=fbm(vec2(lon*1.35,lat*2.5)+u_time*.006);float f2=fbm(vec2(lon*3.8-u_time*.009,lat*7.));
 vec3 base=mix(u_colorA,u_colorB,smoothstep(.35,.72,f));
 if(u_style==0){float cells=fbm(vec2(lon*3.+u_time*.035,lat*5.));base=mix(u_colorA,u_colorB,cells);base+=u_colorC*pow(max(cells-.48,0.),1.8)*2.2;}
 else if(u_style==1||u_style==4||u_style==5){float craters=smoothstep(.82,.91,f2);base=mix(base,u_colorC,craters*.38);base*=.78+.35*f;}
 else if(u_style==2){float cloud=fbm(vec2(lon*2.2+u_time*.02,lat*6.));base=mix(u_colorB,u_colorC,smoothstep(.25,.75,cloud));}
 else if(u_style==3){float land=smoothstep(.49,.57,f+.08*sin(lon*2.7+sin(lat*4.)));vec3 ocean=mix(u_colorA,u_colorB,.4+.5*n.y);vec3 ground=mix(u_colorC,vec3(.28,.25,.08),smoothstep(.45,.8,f));base=mix(ocean,ground,land);float clouds=smoothstep(.62,.76,f2);base=mix(base,vec3(.96,1.,1.),clouds*.55);float city=step(.9,hash(floor(vec2(lon,lat)*65.)))*land*(1.-smoothstep(-.08,.12,dot(n,sunDir)));base+=city*vec3(1.,.52,.12)*.85;}
 else if(u_style==6||u_style==7){float bands=.5+.5*sin(lat*(u_style==6?22.:30.)+f*4.);base=mix(u_colorA,u_colorB,bands);base=mix(base,u_colorC,smoothstep(.72,.92,f2)*.25);if(u_style==6){float storm=exp(-pow((uv.x-.69)/.10,2.)-pow((uv.y-.43)/.055,2.));base=mix(base,vec3(.72,.19,.08),storm*.75);}}
 else {float bands=.5+.5*sin(lat*18.+f*2.);base=mix(u_colorA,u_colorB,bands*.45);base=mix(base,u_colorC,f2*.22);}
 float light=u_emissive>.5?1.15:(.055+.945*ndl);vec3 color=base*light;
 color+=u_atmosphereColor*rim*u_atmosphere*(.2+.3*ndl);color+=u_selected*vec3(.12,.72,1.)*pow(rim,1.4)*1.4;
 float micro=(noise(uv*vec2(120.,80.))-.5)*.035*u_detail;color+=micro;
 outColor=vec4(pow(max(color,0.),vec3(.82)),1.);
}`;
const colorVertex=`#version 300 es
precision highp float;in vec3 a_position;uniform mat4 u_model,u_view,u_projection;void main(){gl_Position=u_projection*u_view*u_model*vec4(a_position,1.);}`;
const colorFragment=`#version 300 es
precision highp float;out vec4 outColor;uniform vec4 u_color;void main(){outColor=u_color;}`;
const ringVertex=`#version 300 es
precision highp float;in vec3 a_position;in vec2 a_uv;uniform mat4 u_model,u_view,u_projection;uniform float u_inner,u_outer;out vec2 v_uv;void main(){float r=mix(u_inner,u_outer,a_uv.x);vec3 p=vec3(a_position.x*r,a_position.y,a_position.z*r);v_uv=a_uv;gl_Position=u_projection*u_view*u_model*vec4(p,1.);}`;
const ringFragment=`#version 300 es
precision highp float;in vec2 v_uv;out vec4 outColor;uniform vec3 u_colorA,u_colorB;uniform float u_time;float hash(float n){return fract(sin(n)*43758.5453);}void main(){float bands=.5+.5*sin(v_uv.x*240.+hash(floor(v_uv.x*80.))*2.);float gaps=smoothstep(.12,.18,abs(sin(v_uv.x*74.)));vec3 c=mix(u_colorA,u_colorB,bands);float alpha=(.18+.55*bands)*gaps;outColor=vec4(c,alpha);}`;
const pointVertex=`#version 300 es
precision highp float;in vec3 a_position;in float a_size;uniform mat4 u_view,u_projection,u_model;uniform float u_pointScale;out float v_brightness;void main(){vec4 view=u_view*u_model*vec4(a_position,1.);gl_Position=u_projection*view;gl_PointSize=clamp(a_size*u_pointScale/max(.3,-view.z*.025),1.,18.);v_brightness=a_size;}`;
const pointFragment=`#version 300 es
precision highp float;in float v_brightness;out vec4 outColor;uniform vec3 u_color;void main(){vec2 p=gl_PointCoord-.5;float d=length(p);float a=smoothstep(.5,0.,d);outColor=vec4(u_color*(.7+v_brightness*.45),a);}`;
const bgVertex=`#version 300 es
precision highp float;const vec2 p[3]=vec2[](vec2(-1.,-1.),vec2(3.,-1.),vec2(-1.,3.));out vec2 v_uv;void main(){gl_Position=vec4(p[gl_VertexID],0.,1.);v_uv=gl_Position.xy*.5+.5;}`;
const bgFragment=`#version 300 es
precision highp float;in vec2 v_uv;out vec4 outColor;uniform float u_time,u_yaw,u_pitch,u_detail;uniform vec2 u_resolution;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*noise(p);p=p*2.1+13.;a*=.5;}return v;}
void main(){vec2 uv=(v_uv-.5)*vec2(u_resolution.x/u_resolution.y,1.);uv+=vec2(u_yaw,u_pitch)*.08;float n=fbm(uv*2.4+vec2(u_time*.006,-u_time*.003));float neb=pow(max(0.,n-.42),2.)*1.8*u_detail;vec3 col=mix(vec3(.001,.003,.012),vec3(.018,.01,.07),v_uv.y);col+=neb*mix(vec3(.05,.08,.25),vec3(.22,.04,.30),fbm(uv*4.));float stars=step(.9965,hash(floor((uv+20.)*220.)));col+=stars*vec3(.7,.85,1.)*(.65+.35*sin(u_time*2.+hash(uv)*20.));outColor=vec4(col,1.);}`;

export class SolarSystemSceneRenderer {
  constructor(canvas,settingsStore,input,navigation,{onTelemetry,onTargetChange,onContextState}={}){
    this.canvas=canvas;this.settingsStore=settingsStore;this.input=input;this.navigation=navigation;this.onTelemetry=onTelemetry;this.onTargetChange=onTargetChange;this.onContextState=onContextState;
    this.gl=null;this.ctx=null;this.raf=0;this.resizeObserver=null;this.startTime=performance.now();this.lastTime=this.startTime;this.lastTelemetry=0;this.frames=0;this.fps=0;this.fpsClock=this.startTime;this.resources=[];this.programs={};this.buffers={};this.active=true;this.cinematicIndex=SOLAR_TOUR.indexOf(navigation.targetId);this.lastCinematicSwitch=0;
    this.onResize=()=>this.resize();this.onContextLost=e=>{e.preventDefault();this.active=false;this.onContextState?.('lost');};this.onContextRestored=()=>{this.onContextState?.('restored');location.reload();};
  }
  start(){if(!this.canvas)return;if(!this.initWebGL())this.initFallback();this.canvas.addEventListener('webglcontextlost',this.onContextLost);this.canvas.addEventListener('webglcontextrestored',this.onContextRestored);if('ResizeObserver'in globalThis){this.resizeObserver=new ResizeObserver(this.onResize);this.resizeObserver.observe(this.canvas);}else addEventListener('resize',this.onResize);this.resize();this.active=true;this.lastTime=performance.now();this.raf=requestAnimationFrame(t=>this.loop(t));}
  compile(type,source){const gl=this.gl,s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(s));this.resources.push(['shader',s]);return s;}
  program(vs,fs){const gl=this.gl,p=gl.createProgram();gl.attachShader(p,this.compile(gl.VERTEX_SHADER,vs));gl.attachShader(p,this.compile(gl.FRAGMENT_SHADER,fs));gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(p));this.resources.push(['program',p]);return p;}
  buffer(data,target=this.gl.ARRAY_BUFFER,usage=this.gl.STATIC_DRAW){const b=this.gl.createBuffer();this.gl.bindBuffer(target,b);this.gl.bufferData(target,data,usage);this.resources.push(['buffer',b]);return b;}
  initWebGL(){
    try{
      const profile=this.settingsStore.getProfile();const gl=this.canvas.getContext('webgl2',{antialias:profile.id!=='performance',alpha:false,powerPreference:profile.id==='experience'?'high-performance':'default',desynchronized:true});if(!gl)return false;this.gl=gl;
      this.programs.planet=this.program(planetVertex,planetFragment);this.programs.color=this.program(colorVertex,colorFragment);this.programs.ring=this.program(ringVertex,ringFragment);this.programs.point=this.program(pointVertex,pointFragment);this.programs.bg=this.program(bgVertex,bgFragment);
      const sphere=sphereGeometry(profile.id==='experience'?96:profile.id==='performance'?40:68,profile.id==='experience'?64:profile.id==='performance'?26:46);this.buffers.sphere={position:this.buffer(sphere.positions),normal:this.buffer(sphere.normals),uv:this.buffer(sphere.uvs),index:this.buffer(sphere.indices,gl.ELEMENT_ARRAY_BUFFER),count:sphere.indices.length,type:gl.UNSIGNED_INT};
      const cube=cubeGeometry();this.buffers.cube={position:this.buffer(cube.positions),index:this.buffer(cube.indices,gl.ELEMENT_ARRAY_BUFFER),count:cube.indices.length,type:gl.UNSIGNED_SHORT};
      const ring=ringGeometry(profile.id==='performance'?88:160);this.buffers.ring={position:this.buffer(ring.positions),uv:this.buffer(ring.uvs),index:this.buffer(ring.indices,gl.ELEMENT_ARRAY_BUFFER),count:ring.indices.length};
      const circle=circleGeometry(profile.id==='performance'?96:192);this.buffers.circle={position:this.buffer(circle),count:circle.length/3};
      const stars=starCloud(profile.id==='performance'?700:profile.id==='experience'?2600:1500,70,170,101);this.buffers.stars={position:this.buffer(stars.positions),size:this.buffer(stars.sizes),count:stars.positions.length/3};
      const corona=starCloud(profile.id==='performance'?80:profile.id==='experience'?380:210,3.7,7.2,73);this.buffers.corona={position:this.buffer(corona.positions),size:this.buffer(corona.sizes),count:corona.positions.length/3};
      gl.enable(gl.DEPTH_TEST);gl.enable(gl.CULL_FACE);gl.cullFace(gl.BACK);return true;
    }catch(error){console.warn('Sistema Solar WebGL2 indisponível.',error);this.disposeGL();this.gl=null;return false;}
  }
  initFallback(){this.ctx=this.canvas.getContext('2d');}
  resize(){const rect=this.canvas.getBoundingClientRect(),profile=this.settingsStore.getProfile();let scale=Math.min(globalThis.devicePixelRatio||1,profile.id==='experience'?1.75:1.2);if(profile.id==='performance')scale=.68;this.canvas.width=Math.max(1,Math.round(rect.width*scale));this.canvas.height=Math.max(1,Math.round(rect.height*scale));this.gl?.viewport(0,0,this.canvas.width,this.canvas.height);}
  bodyPosition(body,elapsed){if(body.id==='sun')return vec3();if(body.parent==='earth'){const earth=this.bodyPosition(BODY_BY_ID.earth,elapsed);const a=elapsed*body.orbitSpeed*.35+1.1;return add(earth,vec3(Math.cos(a)*body.localOrbitRadius,Math.sin(a*.7)*.16,Math.sin(a)*body.localOrbitRadius));}const phase=SOLAR_BODIES.indexOf(body)*.71;const a=elapsed*body.orbitSpeed*.055+phase;return vec3(Math.cos(a)*body.orbitRadius,Math.sin(a*.37+phase)*.22,Math.sin(a)*body.orbitRadius);}
  satellitePosition(item,elapsed){const earth=this.bodyPosition(BODY_BY_ID.earth,elapsed),a=elapsed*item.speed*.42+ORBITAL_FLEET.indexOf(item)*.95,inc=item.inclination*Math.PI/180,r=.92+item.altitude*.32;return add(earth,vec3(Math.cos(a)*r,Math.sin(a)*Math.sin(inc)*r,Math.sin(a)*Math.cos(inc)*r));}
  resolveTarget(elapsed){const id=this.navigation.targetId;if(id.startsWith('sat:')){const sat=SATELLITE_BY_ID[id.slice(4)];return sat?{position:this.satellitePosition(sat,elapsed),radius:sat.scale*.7,label:sat.name,kind:'satellite',data:sat}:{position:vec3(),radius:1,label:'Sol',kind:'body',data:BODY_BY_ID.sun};}const body=BODY_BY_ID[id]??BODY_BY_ID.earth;return{position:this.bodyPosition(body,elapsed),radius:body.radius,label:body.name,kind:'body',data:body};}
  preferredDistance(id){if(id.startsWith('sat:'))return 1.45;const b=BODY_BY_ID[id]??BODY_BY_ID.earth;if(id==='sun')return 10.5;return clamp(b.radius*3.35+1.45,2.2,9.5);}
  selectTarget(id){const changed=this.navigation.selectTarget(id,this.preferredDistance(id));if(changed)this.onTargetChange?.(id);return changed;}
  cycleTarget(direction=1){const ids=SOLAR_BODIES.map(b=>b.id),current=Math.max(0,ids.indexOf(this.navigation.targetId));this.selectTarget(ids[(current+direction+ids.length)%ids.length]);}
  overview(){this.navigation.targetId='sun';this.navigation.visited.add('sun');this.navigation.setCameraMode('orbit');this.navigation.distance=56;this.navigation.autopilot=true;this.onTargetChange?.('sun');}
  toggleCamera(){return this.navigation.cycleCamera();}
  toggleAutopilot(){return this.navigation.toggleAutopilot();}
  resetCamera(){this.navigation.reset();}
  requestFullscreen(){const stage=this.canvas.closest('.solar-immersive-stage')??this.canvas;return stage.requestFullscreen?.();}
  loop(now){if(!this.active)return;const dt=Math.min(.05,(now-this.lastTime)/1000||.016);this.lastTime=now;const elapsed=(now-this.startTime)/1000;const input=this.input?.sample?.()??{};this.navigation.update(dt,input);
    if(this.navigation.cameraMode==='cinematic'&&elapsed-this.lastCinematicSwitch>10){this.lastCinematicSwitch=elapsed;this.cinematicIndex=(this.cinematicIndex+1)%SOLAR_TOUR.length;this.selectTarget(SOLAR_TOUR[this.cinematicIndex]);}
    this.draw(elapsed);this.frames++;if(now-this.fpsClock>800){this.fps=Math.round(this.frames*1000/(now-this.fpsClock));this.frames=0;this.fpsClock=now;}if(now-this.lastTelemetry>120){this.lastTelemetry=now;this.emitTelemetry(elapsed);}this.raf=requestAnimationFrame(t=>this.loop(t));}
  emitTelemetry(elapsed){const target=this.resolveTarget(elapsed),camera=this.navigation.cameraFor(target.position),distance=length(sub(camera.position,target.position));this.onTelemetry?.({targetId:this.navigation.targetId,targetName:target.label,targetKind:target.kind,cameraMode:this.navigation.cameraMode,autopilot:this.navigation.autopilot,distance,speed:this.navigation.speed,fps:this.fps,visited:this.navigation.visited.size,position:camera.position,quality:this.settingsStore.getProfile().id,photoMode:this.navigation.photoMode});}
  uniform(program,name){return this.gl.getUniformLocation(program,name);}
  attrib(program,name,buffer,size){const gl=this.gl,loc=gl.getAttribLocation(program,name);if(loc<0)return;gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,size,gl.FLOAT,false,0,0);}
  matrices(camera){const projection=new Float32Array(16),view=new Float32Array(16);perspective(projection,55*Math.PI/180,this.canvas.width/this.canvas.height,.03,420);lookAt(view,camera.position,camera.target,camera.up);return{projection,view};}
  draw(elapsed){if(this.gl)this.drawGL(elapsed);else this.drawFallback(elapsed);}
  drawGL(elapsed){const gl=this.gl,profile=this.settingsStore.getProfile(),settings=this.settingsStore.get(),target=this.resolveTarget(elapsed),camera=this.navigation.cameraFor(target.position),mat=this.matrices(camera);gl.viewport(0,0,this.canvas.width,this.canvas.height);gl.disable(gl.DEPTH_TEST);gl.disable(gl.BLEND);gl.useProgram(this.programs.bg);gl.uniform1f(this.uniform(this.programs.bg,'u_time'),settings.reducedMotion?0:elapsed);gl.uniform1f(this.uniform(this.programs.bg,'u_yaw'),this.navigation.cameraMode==='free'?this.navigation.freeYaw:this.navigation.yaw);gl.uniform1f(this.uniform(this.programs.bg,'u_pitch'),this.navigation.cameraMode==='free'?this.navigation.freePitch:this.navigation.pitch);gl.uniform1f(this.uniform(this.programs.bg,'u_detail'),profile.id==='performance'?.35:profile.id==='experience'?1:.68);gl.uniform2f(this.uniform(this.programs.bg,'u_resolution'),this.canvas.width,this.canvas.height);gl.drawArrays(gl.TRIANGLES,0,3);
    gl.enable(gl.DEPTH_TEST);gl.clear(gl.DEPTH_BUFFER_BIT);
    this.drawPoints(this.buffers.stars,identity(),mat,[.55,.72,1],profile.id==='experience'?8:5);
    if(profile.orbitalLines)this.drawOrbits(elapsed,mat,profile);
    const ordered=[...SOLAR_BODIES].sort((a,b)=>{const pa=this.bodyPosition(a,elapsed),pb=this.bodyPosition(b,elapsed);return length(sub(pb,camera.position))-length(sub(pa,camera.position));});
    ordered.forEach(body=>this.drawBody(body,elapsed,mat,camera.position));
    this.drawPoints(this.buffers.corona,modelMatrix(vec3(),elapsed*.02,0,1),mat,[1,.38,.06],profile.id==='experience'?13:8);
    if(this.navigation.targetId==='earth'||this.navigation.targetId.startsWith('sat:')||length(sub(camera.position,this.bodyPosition(BODY_BY_ID.earth,elapsed)))<18)this.drawFleet(elapsed,mat,camera.position);
  }
  drawOrbits(elapsed,mat,profile){const gl=this.gl,p=this.programs.color;gl.useProgram(p);this.attrib(p,'a_position',this.buffers.circle.position,3);gl.uniformMatrix4fv(this.uniform(p,'u_view'),false,mat.view);gl.uniformMatrix4fv(this.uniform(p,'u_projection'),false,mat.projection);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE);gl.depthMask(false);for(const body of SOLAR_BODIES){if(!body.orbitRadius||body.parent)continue;const selected=this.navigation.targetId===body.id;gl.uniformMatrix4fv(this.uniform(p,'u_model'),false,modelMatrix(vec3(),0,0,body.orbitRadius,1,body.orbitRadius));const color=hex(selected?'#57e8ff':'#385b8f');gl.uniform4f(this.uniform(p,'u_color'),...color,selected?.44:profile.id==='experience'?.16:.09);gl.drawArrays(gl.LINE_STRIP,0,this.buffers.circle.count);}gl.depthMask(true);gl.disable(gl.BLEND);}
  drawBody(body,elapsed,mat,cameraPosition){const gl=this.gl,p=this.programs.planet,pos=this.bodyPosition(body,elapsed),selected=this.navigation.targetId===body.id,rotation=elapsed*body.rotationSpeed*.08,tilt=body.axialTilt*Math.PI/180;gl.useProgram(p);this.attrib(p,'a_position',this.buffers.sphere.position,3);this.attrib(p,'a_normal',this.buffers.sphere.normal,3);this.attrib(p,'a_uv',this.buffers.sphere.uv,2);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this.buffers.sphere.index);const model=modelMatrix(pos,rotation,tilt,body.radius);gl.uniformMatrix4fv(this.uniform(p,'u_model'),false,model);gl.uniformMatrix4fv(this.uniform(p,'u_view'),false,mat.view);gl.uniformMatrix4fv(this.uniform(p,'u_projection'),false,mat.projection);const [a,b,c]=body.colors.map(hex),atm=hex(body.atmosphere);gl.uniform3f(this.uniform(p,'u_colorA'),...a);gl.uniform3f(this.uniform(p,'u_colorB'),...b);gl.uniform3f(this.uniform(p,'u_colorC'),...c);gl.uniform3f(this.uniform(p,'u_sunPos'),0,0,0);gl.uniform3f(this.uniform(p,'u_cameraPos'),cameraPosition.x,cameraPosition.y,cameraPosition.z);gl.uniform3f(this.uniform(p,'u_atmosphereColor'),...atm);gl.uniform1f(this.uniform(p,'u_time'),elapsed);gl.uniform1f(this.uniform(p,'u_emissive'),body.id==='sun'?1:0);gl.uniform1f(this.uniform(p,'u_atmosphere'),body.atmosphereStrength||0);gl.uniform1f(this.uniform(p,'u_selected'),selected?1:0);gl.uniform1f(this.uniform(p,'u_shell'),0);gl.uniform1f(this.uniform(p,'u_detail'),this.settingsStore.getProfile().id==='performance'?.25:1);gl.uniform1f(this.uniform(p,'u_rotation'),rotation*.04);gl.uniform1i(this.uniform(p,'u_style'),body.style);gl.disable(gl.BLEND);gl.depthMask(true);gl.drawElements(gl.TRIANGLES,this.buffers.sphere.count,this.buffers.sphere.type,0);
    if(body.rings)this.drawRing(body,pos,elapsed,mat);
    if(body.atmosphereStrength&&this.settingsStore.getProfile().atmosphere){gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE);gl.depthMask(false);gl.uniformMatrix4fv(this.uniform(p,'u_model'),false,modelMatrix(pos,rotation,tilt,body.radius*(1.055+body.atmosphereStrength*.035)));gl.uniform1f(this.uniform(p,'u_shell'),1);gl.drawElements(gl.TRIANGLES,this.buffers.sphere.count,this.buffers.sphere.type,0);gl.depthMask(true);gl.disable(gl.BLEND);}
  }
  drawRing(body,pos,elapsed,mat){const gl=this.gl,p=this.programs.ring;gl.useProgram(p);this.attrib(p,'a_position',this.buffers.ring.position,3);this.attrib(p,'a_uv',this.buffers.ring.uv,2);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this.buffers.ring.index);gl.uniformMatrix4fv(this.uniform(p,'u_model'),false,modelMatrix(pos,elapsed*body.rotationSpeed*.01,(body.axialTilt||0)*Math.PI/180,body.radius));gl.uniformMatrix4fv(this.uniform(p,'u_view'),false,mat.view);gl.uniformMatrix4fv(this.uniform(p,'u_projection'),false,mat.projection);gl.uniform1f(this.uniform(p,'u_inner'),body.ringInner);gl.uniform1f(this.uniform(p,'u_outer'),body.ringOuter);const a=hex(body.colors[0]),b=hex(body.colors[2]);gl.uniform3f(this.uniform(p,'u_colorA'),...a);gl.uniform3f(this.uniform(p,'u_colorB'),...b);gl.uniform1f(this.uniform(p,'u_time'),elapsed);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.depthMask(false);gl.disable(gl.CULL_FACE);gl.drawElements(gl.TRIANGLES,this.buffers.ring.count,gl.UNSIGNED_SHORT,0);gl.enable(gl.CULL_FACE);gl.depthMask(true);gl.disable(gl.BLEND);}
  drawFleet(elapsed,mat){for(const item of ORBITAL_FLEET)this.drawSatellite(item,this.satellitePosition(item,elapsed),elapsed,mat);}
  drawSatellite(item,pos,elapsed,mat){const gl=this.gl,p=this.programs.color,selected=this.navigation.targetId===`sat:${item.id}`,base=item.scale*(selected?1.28:1),color=hex(item.color);gl.useProgram(p);this.attrib(p,'a_position',this.buffers.cube.position,3);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this.buffers.cube.index);gl.uniformMatrix4fv(this.uniform(p,'u_view'),false,mat.view);gl.uniformMatrix4fv(this.uniform(p,'u_projection'),false,mat.projection);const drawPart=(offset,sx,sy,sz,c)=>{gl.uniformMatrix4fv(this.uniform(p,'u_model'),false,modelMatrix(add(pos,offset),elapsed*.15,0,sx,sy,sz));gl.uniform4f(this.uniform(p,'u_color'),...c,1);gl.drawElements(gl.TRIANGLES,this.buffers.cube.count,this.buffers.cube.type,0);};drawPart(vec3(),base,base*.55,base*.7,color);drawPart(vec3(base*1.8,0,0),base*1.45,base*.08,base*.48,[.05,.25,.55]);drawPart(vec3(-base*1.8,0,0),base*1.45,base*.08,base*.48,[.05,.25,.55]);if(selected){gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE);drawPart(vec3(),base*1.35,base*.9,base*1.05,[.12,.75,1]);gl.disable(gl.BLEND);}}
  drawPoints(buffer,model,mat,color,scaleValue){const gl=this.gl,p=this.programs.point;gl.useProgram(p);this.attrib(p,'a_position',buffer.position,3);this.attrib(p,'a_size',buffer.size,1);gl.uniformMatrix4fv(this.uniform(p,'u_model'),false,model);gl.uniformMatrix4fv(this.uniform(p,'u_view'),false,mat.view);gl.uniformMatrix4fv(this.uniform(p,'u_projection'),false,mat.projection);gl.uniform1f(this.uniform(p,'u_pointScale'),scaleValue);gl.uniform3f(this.uniform(p,'u_color'),...color);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE);gl.depthMask(false);gl.drawArrays(gl.POINTS,0,buffer.count);gl.depthMask(true);gl.disable(gl.BLEND);}
  drawFallback(elapsed){const ctx=this.ctx;if(!ctx)return;const w=this.canvas.width,h=this.canvas.height;ctx.fillStyle='#020611';ctx.fillRect(0,0,w,h);const rnd=seededRandom(9);ctx.fillStyle='#bfe9ff';for(let i=0;i<180;i++){const x=rnd()*w,y=rnd()*h,r=rnd()*1.6+.3;ctx.globalAlpha=.3+rnd()*.7;ctx.fillRect(x,y,r,r);}ctx.globalAlpha=1;const target=this.resolveTarget(elapsed),body=target.kind==='body'?target.data:BODY_BY_ID.earth;const r=Math.min(w,h)*.24,center={x:w*.5,y:h*.47};const gradient=ctx.createRadialGradient(center.x-r*.35,center.y-r*.4,r*.08,center.x,center.y,r);gradient.addColorStop(0,body.colors?.[2]??'#fff');gradient.addColorStop(.45,body.colors?.[0]??'#58a');gradient.addColorStop(1,body.colors?.[1]??'#124');ctx.fillStyle=gradient;ctx.beginPath();ctx.arc(center.x,center.y,r,0,TAU);ctx.fill();if(body.rings){ctx.strokeStyle='rgba(255,225,170,.55)';ctx.lineWidth=r*.18;ctx.beginPath();ctx.ellipse(center.x,center.y,r*1.7,r*.38,-.18,0,TAU);ctx.stroke();}ctx.fillStyle='#dff7ff';ctx.font=`700 ${Math.max(16,w*.018)}px system-ui`;ctx.textAlign='center';ctx.fillText(target.label,center.x,center.y+r+42);}
  disposeGL(){if(!this.gl)return;for(const[type,resource]of this.resources.reverse()){if(type==='buffer')this.gl.deleteBuffer(resource);if(type==='program')this.gl.deleteProgram(resource);if(type==='shader')this.gl.deleteShader(resource);}this.resources=[];}
  destroy(){this.active=false;cancelAnimationFrame(this.raf);this.resizeObserver?.disconnect();if(!this.resizeObserver)removeEventListener('resize',this.onResize);this.canvas?.removeEventListener('webglcontextlost',this.onContextLost);this.canvas?.removeEventListener('webglcontextrestored',this.onContextRestored);this.disposeGL();this.gl=null;this.ctx=null;}
}
