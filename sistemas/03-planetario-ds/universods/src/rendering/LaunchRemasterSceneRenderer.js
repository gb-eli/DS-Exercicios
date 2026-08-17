const vertexSource=`#version 300 es
precision highp float;
in vec2 a_position;out vec2 v_uv;
void main(){v_uv=a_position*.5+.5;gl_Position=vec4(a_position,0.,1.);}`;

const fragmentSource=`#version 300 es
precision highp float;precision highp int;
in vec2 v_uv;out vec4 outColor;
uniform vec2 u_resolution;
uniform float u_time,u_yaw,u_pitch,u_zoom,u_quality,u_motion;
uniform float u_variant,u_camera,u_altitude,u_velocity,u_throttle,u_stage,u_separation,u_state;
#define MAX_STEPS 104
#define FAR 75.0
#define PI 3.14159265
mat2 rot(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}
float hash21(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);}
float hash31(vec3 p){return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash21(i),hash21(i+vec2(1,0)),f.x),mix(hash21(i+vec2(0,1)),hash21(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<6;i++){v+=a*noise(p);p=p*2.03+17.2;a*=.5;}return v;}
float sdSphere(vec3 p,float r){return length(p)-r;}
float sdBox(vec3 p,vec3 b){vec3 q=abs(p)-b;return length(max(q,0.))+min(max(q.x,max(q.y,q.z)),0.);}
float sdRoundBox(vec3 p,vec3 b,float r){vec3 q=abs(p)-b+r;return min(max(q.x,max(q.y,q.z)),0.)+length(max(q,0.))-r;}
float sdCyl(vec3 p,float h,float r){vec2 d=abs(vec2(length(p.xz),p.y))-vec2(r,h);return min(max(d.x,d.y),0.)+length(max(d,0.));}
float sdCone(vec3 p,float h,float r1,float r2){vec2 q=vec2(length(p.xz),p.y);vec2 k1=vec2(r2,h),k2=vec2(r2-r1,2.*h);vec2 ca=vec2(q.x-min(q.x,(q.y<0.?r1:r2)),abs(q.y)-h);vec2 cb=q-k1+k2*clamp(dot(k1-q,k2)/dot(k2,k2),0.,1.);float s=(cb.x<0.&&ca.y<0.)?-1.:1.;return s*sqrt(min(dot(ca,ca),dot(cb,cb)));}
float sdCapsule(vec3 p,vec3 a,vec3 b,float r){vec3 pa=p-a,ba=b-a;float h=clamp(dot(pa,ba)/dot(ba,ba),0.,1.);return length(pa-ba*h)-r;}
vec2 opU(vec2 a,vec2 b){return a.x<b.x?a:b;}
vec2 opS(vec2 a,vec2 b){return vec2(max(-b.x,a.x),a.y);}

vec2 engineCluster(vec3 p,float y,float scale,float countMode){
  vec2 res=vec2(99.,0.);vec3 q=p-vec3(0.,y,0.);
  for(int i=0;i<9;i++){
    float fi=float(i);float ring=i==0?0.:.22*scale;float a=fi*PI*.25;vec3 e=q-vec3(cos(a)*ring,0.,sin(a)*ring);
    if(i==0||fi<=countMode)res=opU(res,vec2(sdCone(e,.13*scale,.075*scale,.035*scale),7.));
  }
  return res;
}

vec2 rocketBody(vec3 p){
  vec2 res=vec2(99.,0.);float w=u_variant<.5?.29:u_variant<2.5?.37:.0;
  if(u_variant<2.5){
    vec3 lower=p-vec3(0.,-.15,0.);if(u_separation>.02)lower.y+=u_separation*2.8;
    if(u_stage<1.5||u_state<7.){
      res=opU(res,vec2(sdCyl(lower,1.18,w),1.));
      res=opU(res,engineCluster(lower,-1.28,1.,u_variant<.5?6.:8.));
      for(int i=0;i<4;i++){float a=float(i)*PI*.5;vec3 f=lower;f.xz=rot(a)*f.xz;f-=vec3(w+.12,-.76,0.);res=opU(res,vec2(sdRoundBox(f,vec3(.17,.38,.035),.03),5.));}
    }
    vec3 upper=p-vec3(0.,1.48,0.);res=opU(res,vec2(sdCyl(upper,.64,w*.72),2.));
    res=opU(res,vec2(sdCone(p-vec3(0.,2.35,0.),.38,w*.72,.015),3.));
    res=opU(res,vec2(sdCyl(p-vec3(0.,2.78,0.),.055,.065),9.));
    if(u_variant>1.5){
      vec3 l=p-vec3(-w-.23,-.12,0.),r=p-vec3(w+.23,-.12,0.);if(u_separation>.02){l.x-=u_separation*.45;r.x+=u_separation*.45;l.y+=u_separation*1.4;r.y+=u_separation*1.4;}
      res=opU(res,vec2(sdCyl(l,.94,.15),6.));res=opU(res,vec2(sdCyl(r,.94,.15),6.));
      res=opU(res,vec2(sdCone(l-vec3(0.,1.08,0.),.18,.15,.02),3.));res=opU(res,vec2(sdCone(r-vec3(0.,1.08,0.),.18,.15,.02),3.));
    }
  }else{
    // Orbiter alado didático com tanque e propulsores
    vec3 tank=p-vec3(.0,-.1,.18);if(u_separation>.02)tank.y+=u_separation*2.4;
    res=opU(res,vec2(sdCyl(tank,1.3,.31),8.));res=opU(res,vec2(sdCone(tank-vec3(0.,1.5,0.),.28,.31,.03),8.));
    for(int s=-1;s<=1;s+=2){vec3 booster=p-vec3(float(s)*.52,-.18,.08);if(u_separation>.02){booster.x+=float(s)*u_separation*.65;booster.y+=u_separation*1.8;}res=opU(res,vec2(sdCyl(booster,1.18,.15),6.));res=opU(res,vec2(sdCone(booster-vec3(0.,1.36,0.),.2,.15,.02),3.));}
    vec3 orb=p-vec3(0.,.18,-.28);orb.xz=rot(.0)*orb.xz;
    float fus=sdCapsule(orb,vec3(0.,-1.0,0.),vec3(0.,1.15,0.),.2);res=opU(res,vec2(fus,2.));
    res=opU(res,vec2(sdCone(orb-vec3(0.,1.28,0.),.22,.2,.04),3.));
    vec3 wing=orb-vec3(0.,-.18,0.);float wings=max(abs(wing.y)-.09,max(abs(wing.z)-.06,abs(wing.x)*.55+wing.y*.18-.5));res=opU(res,vec2(wings,2.));
    res=opU(res,vec2(sdRoundBox(orb-vec3(0.,.63,-.17),vec3(.13,.13,.05),.025),10.));
  }
  return res;
}

vec2 launchPad(vec3 p){
  vec2 res=vec2(p.y+1.48,20.);
  res=opU(res,vec2(sdCyl(p-vec3(0.,-1.35,0.),.12,1.08),21.));
  vec3 tower=p-vec3(-1.38,.25,.08);res=opU(res,vec2(sdBox(tower,vec3(.18,1.78,.2)),22.));
  for(int i=0;i<7;i++){float y=-1.12+float(i)*.52;res=opU(res,vec2(sdBox(p-vec3(-.78,y,.02),vec3(.62,.035,.08)),23.));}
  res=opU(res,vec2(sdBox(p-vec3(-.7,1.73,.04),vec3(.85,.055,.11)),23.));
  res=opU(res,vec2(sdBox(p-vec3(1.28,-.92,.1),vec3(.46,.25,.55)),24.));
  for(int s=-1;s<=1;s+=2)res=opU(res,vec2(sdCyl(p-vec3(float(s)*.66,-1.25,.54),.24,.13),25.));
  return res;
}

vec2 cockpit(vec3 p){
  vec2 res=vec2(99.,0.);
  res=opU(res,vec2(sdRoundBox(p-vec3(0.,-.48,1.42),vec3(2.05,.55,.12),.09),31.));
  res=opU(res,vec2(sdRoundBox(p-vec3(-1.72,.15,.84),vec3(.15,1.15,.7),.08),32.));
  res=opU(res,vec2(sdRoundBox(p-vec3(1.72,.15,.84),vec3(.15,1.15,.7),.08),32.));
  res=opU(res,vec2(sdRoundBox(p-vec3(0,1.08,.8),vec3(1.7,.12,.7),.08),32.));
  for(int x=-3;x<=3;x++){for(int y=0;y<2;y++){vec3 q=p-vec3(float(x)*.42-.05,float(y)*.28-.55,1.25);res=opU(res,vec2(sdRoundBox(q,vec3(.16,.09,.03),.018),33.+mod(float(x+y+10),3.)));}}
  for(int s=-1;s<=1;s+=2)res=opU(res,vec2(sdRoundBox(p-vec3(float(s)*.72,-.1,.48),vec3(.38,.12,.5),.08),37.));
  return res;
}

vec2 mapScene(vec3 p){
  if(u_camera>2.5&&u_camera<3.5)return cockpit(p);
  vec3 q=p;
  if(u_camera>4.5){float rise=min(9.,u_altitude*9.);q.y+=rise;}
  vec2 res=rocketBody(q);
  if(u_camera<2.5||u_camera>7.5)res=opU(res,launchPad(p));
  return res;
}

vec3 normalAt(vec3 p){float e=.0018;vec2 h=vec2(e,0.);return normalize(vec3(mapScene(p+h.xyy).x-mapScene(p-h.xyy).x,mapScene(p+h.yxy).x-mapScene(p-h.yxy).x,mapScene(p+h.yyx).x-mapScene(p-h.yyx).x));}
vec3 material(float id,vec3 p){
  if(id<1.5)return mix(vec3(.055,.09,.13),vec3(.75,.82,.87),.78+.12*sin(p.y*18.));
  if(id<2.5)return vec3(.78,.84,.9);
  if(id<3.5)return vec3(.91,.94,.98);
  if(id<5.5)return vec3(.07,.18,.3);
  if(id<7.5)return vec3(.28,.33,.38);
  if(id<8.5)return vec3(.78,.27,.07);
  if(id<10.5)return vec3(.16,.46,.68);
  if(id<20.5)return vec3(.025,.035,.05);
  if(id<22.5)return vec3(.11,.14,.17);
  if(id<24.5)return vec3(.08,.28,.34);
  if(id<26.5)return vec3(.17,.19,.21);
  if(id<32.5)return vec3(.035,.055,.08);
  if(id<33.5)return vec3(.1,.17,.23);
  if(id<34.5)return vec3(.04,.6,.88);
  if(id<35.5)return vec3(.95,.45,.08);
  if(id<36.5)return vec3(.3,.95,.55);
  return vec3(.15,.18,.22);
}

vec3 atmosphere(vec2 uv,vec3 rd){
  float h=clamp(u_altitude,0.,1.);vec3 day=mix(vec3(.28,.55,.82),vec3(.012,.04,.13),smoothstep(.04,.55,h));vec3 space=mix(day,vec3(.001,.004,.014),smoothstep(.38,.92,h));
  vec3 bg=mix(space,vec3(.018,.035,.07),max(0.,rd.y)*(.2-h*.15));
  float stars=step(mix(.998,.994,u_quality),hash21(floor((uv+13.)*vec2(780.,440.))));bg+=stars*smoothstep(.28,.72,h)*vec3(.8,.9,1.);
  float neb=fbm(uv*2.1+vec2(2.2,-1.3));bg+=vec3(.08,.025,.16)*pow(neb,3.)*smoothstep(.45,.9,h)*u_quality;
  float horizon=exp(-abs(rd.y+.13)*20.)*(1.-smoothstep(.18,.72,h));bg+=vec3(1.,.42,.11)*horizon*.42;
  if(u_camera<2.5){float grid=(smoothstep(.985,1.,sin(uv.x*48.)*.5+.5)+smoothstep(.985,1.,sin(uv.y*48.)*.5+.5))*.025;bg+=vec3(.02,.3,.42)*grid;}
  return bg;
}

void cameraSetup(vec2 uv,out vec3 ro,out vec3 rd){
  vec3 ta=vec3(0.,.55,0.);float cam=u_camera;
  if(cam<.5){ro=vec3(0.,.55,5.15*u_zoom);ro.xz=rot(u_yaw)*ro.xz;ro.yz=rot(u_pitch)*ro.yz;}
  else if(cam<1.5){ro=vec3(3.8,1.15,4.8);ro.xz=rot(u_yaw*.25)*ro.xz;ta=vec3(0.,.25,0.);}
  else if(cam<2.5){ro=vec3(.72,-.92,1.45*u_zoom);ro.xz=rot(u_yaw*.35)*ro.xz;ta=vec3(0.,-1.02,0.);}
  else if(cam<3.5){ro=vec3(0.,.08,-.05);ta=vec3(0.,.08,1.2);}
  else if(cam<4.5){ro=vec3(2.8,1.3,6.2);ta=vec3(0.,.7,0.);}
  else if(cam<5.5){ro=vec3(0.,.9,-.45);ta=vec3(0.,1.1,4.);}
  else if(cam<6.5){ro=vec3(1.8,-.3,4.4);ta=vec3(0.,.3,0.);}
  else {float a=u_time*.12*u_motion+.8;ro=vec3(cos(a)*5.4,1.4+sin(a*.7)*.7,sin(a)*5.4);ta=vec3(0.,.65,0.);}
  vec3 ww=normalize(ta-ro),uu=normalize(cross(ww,vec3(0.,1.,0.))),vv=cross(uu,ww);rd=normalize(uu*uv.x+vv*uv.y+ww*1.72);
}

void main(){
  vec2 frag=v_uv*u_resolution;vec2 uv=(frag-.5*u_resolution)/u_resolution.y;vec3 ro,rd;cameraSetup(uv,ro,rd);vec3 color=atmosphere(uv,rd);
  float total=0.,id=0.;vec3 p=ro;int steps=int(mix(34.,100.,u_quality));
  for(int i=0;i<MAX_STEPS;i++){if(i>=steps)break;p=ro+rd*total;vec2 hit=mapScene(p);if(hit.x<.0018){id=hit.y;break;}total+=max(.002,hit.x*.78);if(total>FAR)break;}
  if(id>0.){vec3 n=normalAt(p);vec3 light=normalize(vec3(-.65,.9,.55));float diff=max(dot(n,light),0.);float rim=pow(1.-max(dot(n,-rd),0.),3.);float spec=pow(max(dot(reflect(-light,n),-rd),0.),mix(20.,70.,u_quality));vec3 base=material(id,p);color=base*(.15+.85*diff)+spec*.75+rim*vec3(.08,.48,.9)*.34;float fog=smoothstep(11.,44.,total);color=mix(color,atmosphere(uv,rd),fog);}
  // Pluma: larga e com fumaça apenas na atmosfera baixa
  float active=step(.04,u_throttle);float nozzleY=u_camera>1.5&&u_camera<2.5?-.38:-.25;float py=uv.y-nozzleY;float core=exp(-abs(uv.x)*mix(42.,16.,u_throttle))*smoothstep(-1.05,-.48,py)*(1.-smoothstep(-.08,.17,py));
  float flick=.68+.32*noise(vec2(uv.y*38.-u_time*11.*u_motion,uv.x*29.));core*=active*u_throttle*flick*(u_camera<3.5?1.:.42);color+=core*mix(vec3(.18,.7,2.2),vec3(2.5,.38,.025),smoothstep(-.18,-.9,uv.y))*1.45;
  float atmo=1.-smoothstep(.12,.58,u_altitude);float smoke=fbm(vec2(uv.x*7.+u_time*.1*u_motion,(uv.y+.8)*6.-u_time*.42*u_motion));smoke*=smoothstep(.44,.72,smoke)*(1.-smoothstep(.12,.5,abs(uv.x)))*smoothstep(-1.1,-.18,uv.y)*active*atmo;color=mix(color,vec3(.34,.39,.44),smoke*.46*u_quality);
  float vapor=(noise(vec2(uv.x*15.+u_time*.18,uv.y*12.))- .53)*smoothstep(.5,.86,u_throttle)*(1.-smoothstep(.15,.45,u_altitude));color+=max(0.,vapor)*vec3(.55,.72,.85)*.15;
  // Faíscas/debris na ignição e separação
  float spark=step(.997,hash21(floor((uv+u_time*.08)*vec2(620.,340.))))*active*(1.-smoothstep(.1,.45,u_altitude));color+=spark*vec3(1.8,.58,.08)*u_quality;
  float debris=step(.9975,hash21(floor((uv+vec2(u_time*.2,-u_time*.16))*vec2(420.,260.))))*smoothstep(.05,.9,u_separation);color+=debris*vec3(.9,.72,.42)*u_quality;
  float scan=sin((uv.y+u_time*.015*u_motion)*850.)*.5+.5;color+=scan*.006*(1.-smoothstep(.4,1.,u_altitude));float vignette=1.-smoothstep(.25,1.2,length(uv));color*=.65+.35*vignette;color=pow(max(color,0.),vec3(.82));outColor=vec4(color,1.);
}`;

const clamp=(value,min,max)=>Math.min(max,Math.max(min,value));
const CAMERA_INDEX={orbit:0,pad:1,engine:2,interior:3,chase:4,onboard:5,booster:6,cinematic:7};
const STATE_INDEX={PRELAUNCH:0,COUNTDOWN:1,IGNITION:2,ASCENT_STAGE_1:3,MAX_Q:4,STAGE_SEPARATION:5,ASCENT_STAGE_2:6,ORBIT_INSERTION:7,ORBIT:8,ABORTED:9,FAILED:10};

export class LaunchRemasterSceneRenderer {
  constructor(canvas,settingsStore,input,experience,{onTelemetry,onContextState}={}){
    this.canvas=canvas;this.settingsStore=settingsStore;this.input=input;this.experience=experience;this.onTelemetry=onTelemetry;this.onContextState=onContextState;
    this.gl=null;this.ctx=null;this.program=null;this.vao=null;this.buffer=null;this.raf=0;this.resizeObserver=null;this.last=performance.now();this.startedAt=this.last;this.fpsClock=this.last;this.frames=0;this.fps=0;
    this.telemetry={state:'PRELAUNCH',altitudeM:0,velocityMs:0,throttle:0,stage:1,elapsed:0};this.variant=1;this.destroyed=false;this.fallbackReason='';
    this.resize=this.resize.bind(this);this.onLost=e=>this.contextLost(e);this.onRestored=()=>this.contextRestored();
  }
  start(){if(!this.canvas)return false;this.destroyed=false;if(!this.startWebGL()){this.ctx=this.canvas.getContext('2d');this.fallbackReason='WebGL2 indisponível';}
    this.canvas.addEventListener('webglcontextlost',this.onLost);this.canvas.addEventListener('webglcontextrestored',this.onRestored);
    if('ResizeObserver'in globalThis){this.resizeObserver=new ResizeObserver(()=>this.resize());this.resizeObserver.observe(this.canvas);}else addEventListener('resize',this.resize);
    this.resize();this.last=performance.now();this.raf=requestAnimationFrame(now=>this.loop(now));return Boolean(this.gl);
  }
  startWebGL(){const profile=this.settingsStore.getProfile();const gl=this.canvas.getContext('webgl2',{antialias:false,alpha:false,powerPreference:profile.id==='experience'?'high-performance':'low-power',preserveDrawingBuffer:false});if(!gl)return false;
    const compile=(type,source)=>{const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){const message=gl.getShaderInfoLog(shader);gl.deleteShader(shader);throw new Error(message);}return shader;};
    try{const vs=compile(gl.VERTEX_SHADER,vertexSource),fs=compile(gl.FRAGMENT_SHADER,fragmentSource);const program=gl.createProgram();gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);gl.deleteShader(vs);gl.deleteShader(fs);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(program));const vao=gl.createVertexArray();gl.bindVertexArray(vao);const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);const loc=gl.getAttribLocation(program,'a_position');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);this.gl=gl;this.program=program;this.vao=vao;this.buffer=buffer;return true;}catch(error){console.warn('Remaster de lançamento WebGL2 indisponível.',error);this.fallbackReason=String(error.message||error);return false;}
  }
  contextLost(event){event.preventDefault();cancelAnimationFrame(this.raf);this.onContextState?.('lost');}
  contextRestored(){this.gl=null;this.program=null;this.vao=null;this.buffer=null;if(this.startWebGL()){this.resize();this.last=performance.now();this.raf=requestAnimationFrame(now=>this.loop(now));this.onContextState?.('restored');}}
  setVehicle(vehicle){this.variant=Number(vehicle?.variant)||0;}
  setTelemetry(telemetry){this.telemetry={...this.telemetry,...telemetry};}
  resetCamera(){this.experience.yaw=.15;this.experience.pitch=-.06;this.experience.zoom=1;}
  requestFullscreen(){const root=this.canvas.closest('.launch-remaster-stage')||this.canvas;if(document.fullscreenElement)return document.exitFullscreen?.();return root.requestFullscreen?.();}
  resize(){const rect=this.canvas.getBoundingClientRect();const profile=this.settingsStore.getProfile();const dpr=Math.min(profile.id==='experience'?1.65:profile.id==='balanced'?1.15:.72,devicePixelRatio||1);this.canvas.width=Math.max(1,Math.round(rect.width*dpr));this.canvas.height=Math.max(1,Math.round(rect.height*dpr));this.gl?.viewport(0,0,this.canvas.width,this.canvas.height);}
  loop(now){if(this.destroyed)return;const dt=Math.min(.05,(now-this.last)/1000||.016);this.last=now;const input=this.input?.sample?.()??{};this.experience.update(dt,input);this.draw(now);this.frames++;if(now-this.fpsClock>=500){this.fps=Math.round(this.frames*1000/(now-this.fpsClock));this.frames=0;this.fpsClock=now;this.onTelemetry?.({fps:this.fps,camera:this.experience.effectiveCamera(),profile:this.settingsStore.getProfile().id,webgl:Boolean(this.gl),resolution:`${this.canvas.width}×${this.canvas.height}`});}this.raf=requestAnimationFrame(t=>this.loop(t));}
  uniform1(name,value){const loc=this.gl.getUniformLocation(this.program,name);if(loc!==null)this.gl.uniform1f(loc,value);}
  draw(now){if(this.gl)return this.drawWebGL(now);return this.drawFallback(now);}
  drawWebGL(now){const gl=this.gl,settings=this.settingsStore.get(),profile=this.settingsStore.getProfile(),t=this.telemetry,s=this.experience.snapshot();const elapsed=(now-this.startedAt)/1000;const altitude=clamp((t.altitudeM||0)/230000,0,1);const separation=t.state==='STAGE_SEPARATION'?clamp(((t.elapsed||0)%3)/2,0,1):(t.stage||1)>1?1:0;gl.disable(gl.DEPTH_TEST);gl.clearColor(0,0,0,1);gl.clear(gl.COLOR_BUFFER_BIT);gl.useProgram(this.program);gl.bindVertexArray(this.vao);gl.uniform2f(gl.getUniformLocation(this.program,'u_resolution'),this.canvas.width,this.canvas.height);this.uniform1('u_time',settings.reducedMotion?0:elapsed);this.uniform1('u_yaw',s.yaw);this.uniform1('u_pitch',s.pitch);this.uniform1('u_zoom',s.zoom);this.uniform1('u_quality',profile.id==='performance'?.14:profile.id==='experience'?1:.58);this.uniform1('u_motion',settings.reducedMotion?0:profile.motionFactor);this.uniform1('u_variant',this.variant);this.uniform1('u_camera',CAMERA_INDEX[s.effectiveCamera]??0);this.uniform1('u_altitude',altitude);this.uniform1('u_velocity',clamp((t.velocityMs||0)/7800,0,1));this.uniform1('u_throttle',t.throttle||0);this.uniform1('u_stage',t.stage||1);this.uniform1('u_separation',separation);this.uniform1('u_state',STATE_INDEX[t.state]??0);gl.drawArrays(gl.TRIANGLES,0,3);}
  drawFallback(now){const ctx=this.ctx;if(!ctx)return;const w=this.canvas.width,h=this.canvas.height,t=this.telemetry,s=this.experience.snapshot(),elapsed=(now-this.startedAt)/1000,altitude=clamp((t.altitudeM||0)/230000,0,1);ctx.clearRect(0,0,w,h);const sky=ctx.createLinearGradient(0,0,0,h);sky.addColorStop(0,altitude>.55?'#010514':'#082a50');sky.addColorStop(1,altitude>.3?'#031127':'#517f9e');ctx.fillStyle=sky;ctx.fillRect(0,0,w,h);for(let i=0;i<90;i++){const x=(Math.sin(i*92.3)*.5+.5)*w,y=(Math.sin(i*37.7+2)*.5+.5)*h*.72;ctx.fillStyle=`rgba(220,238,255,${.18+(i%5)*.07})`;ctx.fillRect(x,y,1+(i%3===0),1+(i%3===0));}
    const scale=Math.min(w,h)*(s.effectiveCamera==='engine'?.31:s.effectiveCamera==='interior'?.42:.19)/s.zoom,cx=w/2,base=h*(s.effectiveCamera==='interior'?.58:.72);ctx.save();ctx.translate(cx,base);if(s.effectiveCamera==='interior'){ctx.fillStyle='#07111d';ctx.fillRect(-scale*2.5,-scale*1.5,scale*5,scale*2.5);ctx.strokeStyle='#36cfff';ctx.lineWidth=2;for(let x=-2;x<=2;x++)for(let y=0;y<2;y++)ctx.strokeRect(x*scale*.65-scale*.22,y*scale*.42-scale*.65,scale*.44,scale*.25);ctx.fillStyle='#0b2633';ctx.fillRect(-scale*2.2,scale*.72,scale*4.4,scale*.55);}else{ctx.rotate(s.yaw*.15);ctx.fillStyle=this.variant===3?'#d8e2ef':'#dfe9ee';ctx.fillRect(-scale*.42,-scale*3.5,scale*.84,scale*2.65);ctx.beginPath();ctx.moveTo(-scale*.42,-scale*3.5);ctx.lineTo(0,-scale*4.45);ctx.lineTo(scale*.42,-scale*3.5);ctx.fill();if(this.variant===3){ctx.fillStyle='#dce4ee';ctx.beginPath();ctx.moveTo(-scale*.15,-scale*2.8);ctx.lineTo(-scale*1.65,-scale*1.15);ctx.lineTo(-scale*.12,-scale*1.45);ctx.fill();ctx.beginPath();ctx.moveTo(scale*.15,-scale*2.8);ctx.lineTo(scale*1.65,-scale*1.15);ctx.lineTo(scale*.12,-scale*1.45);ctx.fill();ctx.fillStyle='#d35e24';ctx.fillRect(-scale*.3,-scale*2.9,scale*.6,scale*2.1);}
      ctx.fillStyle='#15202a';ctx.fillRect(-scale*.34,-scale*.86,scale*.68,scale*.18);if((t.throttle||0)>.03){const grad=ctx.createLinearGradient(0,-scale*.65,0,scale*2.3);grad.addColorStop(0,'#f5ffff');grad.addColorStop(.22,'#45ccff');grad.addColorStop(.55,'#ffae28');grad.addColorStop(1,'rgba(255,55,5,0)');ctx.fillStyle=grad;ctx.beginPath();ctx.moveTo(-scale*.3,-scale*.7);ctx.quadraticCurveTo(-scale*.7,scale*.75,0,scale*(1.8+Math.sin(elapsed*22)*.12));ctx.quadraticCurveTo(scale*.7,scale*.75,scale*.3,-scale*.7);ctx.fill();}}
    ctx.restore();ctx.fillStyle='rgba(255,255,255,.7)';ctx.font=`${Math.max(11,w/75)}px ui-monospace`;ctx.fillText(`FALLBACK 2D · ${s.effectiveCamera.toUpperCase()} · ${Math.round(altitude*100)}% ALT`,20,h-20);}
  destroy(){this.destroyed=true;cancelAnimationFrame(this.raf);this.resizeObserver?.disconnect();if(!this.resizeObserver)removeEventListener('resize',this.resize);this.canvas?.removeEventListener('webglcontextlost',this.onLost);this.canvas?.removeEventListener('webglcontextrestored',this.onRestored);if(this.gl){if(this.buffer)this.gl.deleteBuffer(this.buffer);if(this.vao)this.gl.deleteVertexArray(this.vao);if(this.program)this.gl.deleteProgram(this.program);}this.gl=null;this.ctx=null;this.program=null;this.vao=null;this.buffer=null;}
}
