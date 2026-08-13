const vertexSource=`#version 300 es
precision highp float;
in vec2 a_position;
out vec2 v_uv;
void main(){v_uv=a_position*.5+.5;gl_Position=vec4(a_position,0.,1.);}`;

const fragmentSource=`#version 300 es
precision highp float;
precision highp int;
in vec2 v_uv;
out vec4 outColor;
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_yaw;
uniform float u_pitch;
uniform float u_zoom;
uniform float u_mode;
uniform float u_altitude;
uniform float u_stage;
uniform float u_separation;
uniform float u_throttle;
uniform float u_quality;
uniform float u_variant;
uniform float u_motion;
#define MAX_STEPS 76
#define FAR 40.0
mat2 rot(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}
float hash21(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash21(i),hash21(i+vec2(1,0)),f.x),mix(hash21(i+vec2(0,1)),hash21(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*noise(p);p=p*2.02+13.7;a*=.5;}return v;}
float sdBox(vec3 p,vec3 b){vec3 q=abs(p)-b;return length(max(q,0.))+min(max(q.x,max(q.y,q.z)),0.);}
float sdCyl(vec3 p,float h,float r){vec2 d=abs(vec2(length(p.xz),p.y))-vec2(r,h);return min(max(d.x,d.y),0.)+length(max(d,0.));}
float sdCone(vec3 p,float h,float r1,float r2){vec2 q=vec2(length(p.xz),p.y);vec2 k1=vec2(r2,h),k2=vec2(r2-r1,2.*h);vec2 ca=vec2(q.x-min(q.x,(q.y<0.?r1:r2)),abs(q.y)-h);vec2 cb=q-k1+k2*clamp(dot(k1-q,k2)/dot(k2,k2),0.,1.);float s=(cb.x<0.&&ca.y<0.)?-1.:1.;return s*sqrt(min(dot(ca,ca),dot(cb,cb)));}
vec2 opU(vec2 a,vec2 b){return a.x<b.x?a:b;}
vec2 rocketSdf(vec3 p){
  vec2 res=vec2(99.,0.);
  float width=mix(.27,.34,step(.5,u_variant));
  vec3 p1=p-vec3(0.,-.15,0.);
  if(u_stage<1.5||u_mode<.5){
    vec3 lower=p1;
    if(u_separation>.01)lower.y+=u_separation*2.2;
    res=opU(res,vec2(sdCyl(lower,.95,width),1.));
    res=opU(res,vec2(sdCyl(lower-vec3(0.,-.98,0.),.10,width*.82),5.));
    for(int i=0;i<4;i++){
      float a=float(i)*1.570796;
      vec3 fp=lower;fp.xz=rot(a)*fp.xz;fp-=vec3(width+.12,-.66,0.);
      res=opU(res,vec2(sdBox(fp,vec3(.17,.34,.045)),4.));
    }
  }
  vec3 upper=p-vec3(0.,1.18,0.);
  res=opU(res,vec2(sdCyl(upper,.52,width*.72),2.));
  vec3 cone=p-vec3(0.,1.98,0.);
  res=opU(res,vec2(sdCone(cone,.34,width*.72,.02),3.));
  res=opU(res,vec2(sdCyl(p-vec3(0.,2.35,0.),.05,.08),6.));
  if(u_variant>1.5&&u_stage<1.5){
    vec3 left=p-vec3(-width-.2,-.1,0.);vec3 right=p-vec3(width+.2,-.1,0.);
    res=opU(res,vec2(sdCyl(left,.73,.13),7.));res=opU(res,vec2(sdCyl(right,.73,.13),7.));
  }
  return res;
}
vec2 mapScene(vec3 p){
  vec2 res=rocketSdf(p);
  if(u_mode<.5){
    res=opU(res,vec2(p.y+1.23,10.));
    res=opU(res,vec2(sdBox(p-vec3(-1.55,.35,0.),vec3(.16,1.65,.18)),11.));
    res=opU(res,vec2(sdBox(p-vec3(1.55,.35,0.),vec3(.16,1.65,.18)),11.));
    res=opU(res,vec2(sdBox(p-vec3(0.,1.65,-.45),vec3(1.72,.08,.12)),12.));
    for(int i=0;i<5;i++){float y=-.8+float(i)*.55;res=opU(res,vec2(sdBox(p-vec3(-1.1,y,-.08),vec3(.45,.045,.1)),12.));}
  }
  return res;
}
vec3 normalAt(vec3 p){float e=.0015;vec2 h=vec2(e,0.);return normalize(vec3(mapScene(p+h.xyy).x-mapScene(p-h.xyy).x,mapScene(p+h.yxy).x-mapScene(p-h.yxy).x,mapScene(p+h.yyx).x-mapScene(p-h.yyx).x));}
vec3 material(float id,vec3 p){
  if(id<1.5)return mix(vec3(.08,.13,.19),vec3(.78,.84,.88),smoothstep(-1.,1.,sin(p.y*12.))*.12+.72);
  if(id<2.5)return vec3(.92,.94,.96);
  if(id<3.5)return vec3(.82,.86,.9);
  if(id<4.5)return vec3(.10,.24,.38);
  if(id<5.5)return vec3(.08,.08,.09);
  if(id<6.5)return vec3(.35,.85,1.);
  if(id<7.5)return vec3(.32,.38,.44);
  if(id<10.5)return vec3(.025,.04,.065);
  if(id<11.5)return vec3(.06,.18,.24);
  return vec3(.12,.4,.48);
}
vec3 background(vec2 uv,vec3 rd){
  if(u_mode<.5){
    float grid=(smoothstep(.97,1.,sin(uv.x*55.)*.5+.5)+smoothstep(.97,1.,sin(uv.y*55.)*.5+.5))*.06;
    vec3 bg=mix(vec3(.006,.012,.028),vec3(.025,.10,.16),max(0.,1.-length(uv)*.7));
    bg+=vec3(.05,.65,.8)*grid;
    float scan=sin((uv.y+u_time*.025*u_motion)*650.)*.5+.5;bg+=scan*.009;
    return bg;
  }
  float h=clamp(u_altitude,0.,1.);
  vec3 low=mix(vec3(.22,.48,.72),vec3(.015,.06,.16),smoothstep(.05,.55,h));
  vec3 high=mix(vec3(.015,.06,.16),vec3(.002,.005,.018),smoothstep(.35,1.,h));
  vec3 bg=mix(low,high,smoothstep(-.2,.8,rd.y));
  float stars=step(.9965,hash21(floor(uv*vec2(520.,300.))));bg+=stars*smoothstep(.35,.8,h)*vec3(.8,.9,1.);
  float horizon=exp(-abs(rd.y+.12)*18.)*(1.-smoothstep(.2,.8,h));bg+=vec3(1.,.42,.12)*horizon*.35;
  return bg;
}
void main(){
  vec2 frag=v_uv*u_resolution;vec2 uv=(frag-.5*u_resolution)/u_resolution.y;
  vec3 ro=vec3(0.,.45,4.6*u_zoom);vec3 ta=vec3(0.,.55,0.);
  ro.xz=rot(u_yaw)*ro.xz;ro.yz=rot(u_pitch)*ro.yz;
  vec3 ww=normalize(ta-ro),uu=normalize(cross(ww,vec3(0.,1.,0.))),vv=cross(uu,ww);
  vec3 rd=normalize(uu*uv.x+vv*uv.y+ww*1.75);
  vec3 color=background(uv,rd);
  float total=0.,id=0.;vec3 p=ro;int steps=int(mix(28.,72.,u_quality));
  for(int i=0;i<MAX_STEPS;i++){
    if(i>=steps)break; p=ro+rd*total;vec2 hit=mapScene(p);if(hit.x<.0018){id=hit.y;break;}total+=hit.x*.82;if(total>FAR)break;
  }
  if(id>0.){
    vec3 n=normalAt(p);vec3 light=normalize(vec3(-.6,.85,.7));float diff=max(dot(n,light),0.);float rim=pow(1.-max(dot(n,-rd),0.),3.);
    vec3 base=material(id,p);float spec=pow(max(dot(reflect(-light,n),-rd),0.),24.);
    color=base*(.18+.82*diff)+spec*.65+rim*vec3(.08,.55,.9)*.35;
    float fog=smoothstep(8.,25.,total);color=mix(color,background(uv,rd),fog);
  }
  float plumeY=u_mode<.5?-.32:-.28;float plumeX=uv.x;float py=uv.y-plumeY;float plume=exp(-abs(plumeX)*mix(34.,18.,u_throttle))*smoothstep(-.95,-.55,py)*(1.-smoothstep(-.12,.18,py));
  float flicker=.72+.28*noise(vec2(uv.y*28.-u_time*8.*u_motion,uv.x*22.));plume*=u_throttle*flicker;
  color+=plume*mix(vec3(.1,.45,1.5),vec3(1.8,.34,.03),smoothstep(-.2,-.72,uv.y))*1.3;
  float smoke=fbm(vec2(uv.x*8.+u_time*.12*u_motion,(uv.y+.7)*7.-u_time*.35*u_motion));smoke*=(1.-smoothstep(0.,.35,abs(uv.x)))*smoothstep(-.98,-.3,uv.y)*u_throttle*(1.-u_altitude);
  color=mix(color,vec3(.35,.42,.5),smoke*.22*(1.-u_quality*.45));
  float vignette=1.-smoothstep(.25,1.15,length(uv));color*=.68+.32*vignette;
  color=pow(max(color,0.),vec3(.82));outColor=vec4(color,1.);
}`;

export class RocketSceneRenderer{
  constructor(canvas,settingsStore){
    this.canvas=canvas;this.settingsStore=settingsStore;this.gl=null;this.ctx=null;this.program=null;this.vao=null;this.raf=0;this.resizeObserver=null;
    this.mode='hangar';this.yaw=.15;this.pitch=-.06;this.zoom=1;this.drag=null;this.startTime=performance.now();
    this.telemetry={altitudeM:0,stage:1,throttle:0,state:'PRELAUNCH'};this.variant=1;
    this.onPointerDown=e=>this.pointerDown(e);this.onPointerMove=e=>this.pointerMove(e);this.onPointerUp=()=>this.drag=null;this.onWheel=e=>this.wheel(e);this.resize=this.resize.bind(this);
  }
  start(){
    if(!this.canvas)return;if(!this.startWebGL())this.ctx=this.canvas.getContext('2d');
    this.canvas.addEventListener('pointerdown',this.onPointerDown);addEventListener('pointermove',this.onPointerMove);addEventListener('pointerup',this.onPointerUp);this.canvas.addEventListener('wheel',this.onWheel,{passive:false});
    if('ResizeObserver'in globalThis){this.resizeObserver=new ResizeObserver(()=>this.resize());this.resizeObserver.observe(this.canvas);}else addEventListener('resize',this.resize);
    this.resize();this.loop();
  }
  startWebGL(){
    const gl=this.canvas.getContext('webgl2',{antialias:false,powerPreference:this.settingsStore.getProfile().id==='experience'?'high-performance':'low-power'});if(!gl)return false;
    const compile=(type,source)=>{const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(shader));return shader;};
    try{
      const program=gl.createProgram();gl.attachShader(program,compile(gl.VERTEX_SHADER,vertexSource));gl.attachShader(program,compile(gl.FRAGMENT_SHADER,fragmentSource));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(program));
      const vao=gl.createVertexArray();gl.bindVertexArray(vao);const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);const loc=gl.getAttribLocation(program,'a_position');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
      this.gl=gl;this.program=program;this.vao=vao;return true;
    }catch(error){console.warn('Cena de foguete WebGL2 indisponível.',error);return false;}
  }
  setMode(mode){this.mode=mode;}
  setRocket(summary){this.variant=summary?.firstStage?.id==='core-l1'?0:summary?.firstStage?.id==='core-r3'?2:1;}
  setTelemetry(telemetry){this.telemetry={...this.telemetry,...telemetry};}
  resetCamera(){this.yaw=.15;this.pitch=-.06;this.zoom=1;}
  pointerDown(e){this.drag={x:e.clientX,y:e.clientY,yaw:this.yaw,pitch:this.pitch};this.canvas.setPointerCapture?.(e.pointerId);}
  pointerMove(e){if(!this.drag)return;this.yaw=this.drag.yaw+(e.clientX-this.drag.x)*.006;this.pitch=Math.max(-.55,Math.min(.42,this.drag.pitch+(e.clientY-this.drag.y)*.006));}
  wheel(e){e.preventDefault();this.zoom=Math.max(.72,Math.min(1.5,this.zoom+Math.sign(e.deltaY)*.08));}
  resize(){const rect=this.canvas.getBoundingClientRect();const q=this.settingsStore.getProfile();let scale=q.id==='performance'?.62:q.id==='experience'?Math.min(1.55,devicePixelRatio||1):Math.min(1.05,devicePixelRatio||1);this.canvas.width=Math.max(1,Math.round(rect.width*scale));this.canvas.height=Math.max(1,Math.round(rect.height*scale));this.gl?.viewport(0,0,this.canvas.width,this.canvas.height);}
  loop=()=>{this.draw();this.raf=requestAnimationFrame(this.loop);};
  draw(){
    const elapsed=(performance.now()-this.startTime)/1000;const profile=this.settingsStore.getProfile();const settings=this.settingsStore.get();const t=this.telemetry;const altitude=Math.min(1,(t.altitudeM||0)/220000);const separation=t.state==='STAGE_SEPARATION'?Math.min(1,((t.elapsed||0)%3)/2.2):t.stage>1?1:0;
    if(this.gl){const gl=this.gl;gl.disable(gl.DEPTH_TEST);gl.clearColor(0,0,0,1);gl.clear(gl.COLOR_BUFFER_BIT);gl.useProgram(this.program);gl.bindVertexArray(this.vao);const set1=(name,value)=>gl.uniform1f(gl.getUniformLocation(this.program,name),value);gl.uniform2f(gl.getUniformLocation(this.program,'u_resolution'),this.canvas.width,this.canvas.height);set1('u_time',settings.reducedMotion?0:elapsed);set1('u_yaw',this.yaw);set1('u_pitch',this.pitch);set1('u_zoom',this.zoom);set1('u_mode',this.mode==='flight'?1:0);set1('u_altitude',altitude);set1('u_stage',t.stage||1);set1('u_separation',separation);set1('u_throttle',t.throttle||0);set1('u_quality',profile.id==='performance'?.15:profile.id==='experience'?1:.58);set1('u_variant',this.variant);set1('u_motion',settings.reducedMotion?0:profile.motionFactor);gl.drawArrays(gl.TRIANGLES,0,3);return;}
    if(!this.ctx)return;const ctx=this.ctx,w=this.canvas.width,h=this.canvas.height;ctx.clearRect(0,0,w,h);const sky=ctx.createLinearGradient(0,0,0,h);if(this.mode==='flight'){sky.addColorStop(0,altitude>.6?'#010513':'#0a315d');sky.addColorStop(1,altitude>.25?'#031126':'#4e85a7');}else{sky.addColorStop(0,'#020817');sky.addColorStop(1,'#07233a');}ctx.fillStyle=sky;ctx.fillRect(0,0,w,h);const cx=w/2,scale=Math.min(w,h)*.18,base=h*.72;ctx.save();ctx.translate(cx,base);ctx.fillStyle='#dce6ed';ctx.fillRect(-scale*.45,-scale*3.2,scale*.9,scale*2.25);ctx.beginPath();ctx.moveTo(-scale*.45,-scale*3.2);ctx.lineTo(0,-scale*4.15);ctx.lineTo(scale*.45,-scale*3.2);ctx.fill();ctx.fillStyle='#243b50';ctx.fillRect(-scale*.58,-scale*.95,scale*1.16,scale*.22);ctx.fillStyle='#111';ctx.fillRect(-scale*.32,-scale*.74,scale*.64,scale*.18);if((t.throttle||0)>0){const flicker=.8+Math.sin(elapsed*24)*.15;const grad=ctx.createLinearGradient(0,-scale*.55,0,scale*2);grad.addColorStop(0,'#dffcff');grad.addColorStop(.25,'#4acbff');grad.addColorStop(.55,'#ffb22e');grad.addColorStop(1,'rgba(255,70,10,0)');ctx.fillStyle=grad;ctx.beginPath();ctx.moveTo(-scale*.28,-scale*.56);ctx.quadraticCurveTo(-scale*.6,scale*.8,0,scale*2*flicker);ctx.quadraticCurveTo(scale*.6,scale*.8,scale*.28,-scale*.56);ctx.fill();}ctx.restore();
  }
  destroy(){cancelAnimationFrame(this.raf);this.resizeObserver?.disconnect();if(!this.resizeObserver)removeEventListener('resize',this.resize);this.canvas?.removeEventListener('pointerdown',this.onPointerDown);removeEventListener('pointermove',this.onPointerMove);removeEventListener('pointerup',this.onPointerUp);this.canvas?.removeEventListener('wheel',this.onWheel);if(this.gl&&this.program)this.gl.deleteProgram(this.program);this.gl=null;this.ctx=null;}
}
