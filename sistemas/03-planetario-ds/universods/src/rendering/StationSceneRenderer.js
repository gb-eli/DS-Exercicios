const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));

export class StationSceneRenderer {
  constructor(canvas,settingsStore){
    this.canvas=canvas;this.settingsStore=settingsStore;this.gl=null;this.ctx=null;this.program=null;this.vao=null;this.raf=0;this.startTime=performance.now();this.mode='exterior';this.yaw=.25;this.pitch=.08;this.zoom=1;this.drag=null;this.contextLosses=0;this.telemetry={systems:{battery:86,co2:.42,sunlight:true,faults:[]},docking:{distanceM:240,hardDock:false},arm:{completion:0,state:'OFF'}};
    this.onPointerDown=e=>this.pointerDown(e);this.onPointerMove=e=>this.pointerMove(e);this.onPointerUp=()=>{this.drag=null;};this.onWheel=e=>this.wheel(e);this.onResize=()=>this.resize();this.onContextLost=e=>{e.preventDefault();this.contextLosses++;cancelAnimationFrame(this.raf);};this.onContextRestored=()=>{this.init();this.resize();this.start();};
    this.canvas.addEventListener('pointerdown',this.onPointerDown);addEventListener('pointermove',this.onPointerMove);addEventListener('pointerup',this.onPointerUp);this.canvas.addEventListener('wheel',this.onWheel,{passive:false});this.canvas.addEventListener('webglcontextlost',this.onContextLost);this.canvas.addEventListener('webglcontextrestored',this.onContextRestored);this.resizeObserver=typeof ResizeObserver!=='undefined'?new ResizeObserver(this.onResize):null;this.resizeObserver?.observe(canvas);if(!this.resizeObserver)addEventListener('resize',this.onResize);this.init();this.resize();
  }
  init(){
    const gl=this.canvas.getContext('webgl2',{antialias:false,alpha:false,powerPreference:this.settingsStore.getProfile().id==='performance'?'low-power':'high-performance'});
    if(!gl){this.ctx=this.canvas.getContext('2d');return false;}
    const vertex=`#version 300 es
      in vec2 a_position;out vec2 v_uv;void main(){v_uv=a_position*.5+.5;gl_Position=vec4(a_position,0.,1.);}`;
    const fragment=`#version 300 es
      precision highp float;out vec4 outColor;in vec2 v_uv;
      uniform vec2 u_resolution;uniform float u_time,u_yaw,u_pitch,u_zoom,u_mode,u_quality,u_motion,u_power,u_co2,u_docking,u_arm,u_fault;
      #define PI 3.14159265359
      float hash21(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
      float hash31(vec3 p){p=fract(p*.1031);p+=dot(p,p.yzx+33.33);return fract((p.x+p.y)*p.z);}
      float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash21(i),hash21(i+vec2(1,0)),f.x),mix(hash21(i+vec2(0,1)),hash21(i+vec2(1)),f.x),f.y);}
      mat2 rot(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}
      float sdBox(vec3 p,vec3 b){vec3 q=abs(p)-b;return length(max(q,0.))+min(max(q.x,max(q.y,q.z)),0.);}
      float sdSphere(vec3 p,float r){return length(p)-r;}
      float sdCylinderX(vec3 p,vec2 h){vec2 d=abs(vec2(length(p.yz),p.x))-h;return min(max(d.x,d.y),0.)+length(max(d,0.));}
      float sdCylinderZ(vec3 p,vec2 h){vec2 d=abs(vec2(length(p.xy),p.z))-h;return min(max(d.x,d.y),0.)+length(max(d,0.));}
      float sdCapsule(vec3 p,vec3 a,vec3 b,float r){vec3 pa=p-a,ba=b-a;float h=clamp(dot(pa,ba)/dot(ba,ba),0.,1.);return length(pa-ba*h)-r;}
      vec2 opU(vec2 a,vec2 b){return a.x<b.x?a:b;}
      vec2 stationMap(vec3 p){
        vec2 res=vec2(1e5,0.);vec3 q=p;
        res=opU(res,vec2(sdCylinderX(q,vec2(.42,1.25)),1.));
        q=p-vec3(2.0,0.,0.);res=opU(res,vec2(sdCylinderX(q,vec2(.34,.72)),1.));
        q=p+vec3(2.0,0.,0.);res=opU(res,vec2(sdCylinderX(q,vec2(.34,.72)),1.));
        q=p-vec3(0.,.7,0.);res=opU(res,vec2(sdBox(q,vec3(4.1,.07,.08)),2.));
        q=p-vec3(2.45,.72,1.0);res=opU(res,vec2(sdBox(q,vec3(1.25,.035,.58)),3.));
        q=p-vec3(2.45,.72,-1.0);res=opU(res,vec2(sdBox(q,vec3(1.25,.035,.58)),3.));
        q=p-vec3(-2.45,.72,1.0);res=opU(res,vec2(sdBox(q,vec3(1.25,.035,.58)),3.));
        q=p-vec3(-2.45,.72,-1.0);res=opU(res,vec2(sdBox(q,vec3(1.25,.035,.58)),3.));
        float approach=3.8-u_docking*3.1;q=p-vec3(0.,0.,approach);res=opU(res,vec2(sdCylinderZ(q,vec2(.25,.62)),4.));q-=vec3(0.,0.,.72);res=opU(res,vec2(sdSphere(q,.32),4.));
        vec3 a=vec3(-.9,.2,.2),b=vec3(-1.7,.8,.35),c=vec3(-2.25,.45,.65);float armMix=smoothstep(0.,1.,u_arm);b=mix(a+vec3(-.3,.1,.05),b,armMix);c=mix(b+vec3(-.25,.05,.05),c,armMix);res=opU(res,vec2(sdCapsule(p,a,b,.07),5.));res=opU(res,vec2(sdCapsule(p,b,c,.065),5.));
        if(u_mode>1.5){q=p-vec3(.3,-.75,1.1);res=opU(res,vec2(sdSphere(q,.18),6.));q=p-vec3(.3,-1.04,1.1);res=opU(res,vec2(sdCapsule(q,vec3(0),vec3(0,-.38,0),.12),6.));res=opU(res,vec2(sdCapsule(p,vec3(.3,-.92,1.1),vec3(-.05,-1.18,1.1),.055),6.));res=opU(res,vec2(sdCapsule(p,vec3(.3,-.92,1.1),vec3(.65,-1.18,1.1),.055),6.));}
        return res;
      }
      float corridorDist(vec3 p,out float mat){
        float wallX=1.65-abs(p.x),wallY=1.05-abs(p.y);float d=min(wallX,wallY);mat=wallX<wallY?7.:8.;
        float frame=abs(mod(p.z+1.5,3.)-1.5)-.055;float frameShape=max(frame,max(abs(p.x)-1.58,abs(p.y)-.98));if(frameShape<d){d=frameShape;mat=9.;}
        vec3 f=p-vec3(.0,-.5,-2.0);float floating=sdBox(f,vec3(.14,.08,.18));if(floating<d){d=floating;mat=10.;}
        return max(d,.001);
      }
      vec3 normalStation(vec3 p){float e=.0015;vec2 h=vec2(e,0);return normalize(vec3(stationMap(p+h.xyy).x-stationMap(p-h.xyy).x,stationMap(p+h.yxy).x-stationMap(p-h.yxy).x,stationMap(p+h.yyx).x-stationMap(p-h.yyx).x));}
      bool earthHit(vec3 ro,vec3 rd,out float t,out vec3 n){vec3 ce=vec3(0.,-14.,-25.);float r=12.;vec3 oc=ro-ce;float b=dot(oc,rd),c=dot(oc,oc)-r*r,h=b*b-c;if(h<0.)return false;t=-b-sqrt(h);if(t<0.)return false;n=normalize(ro+rd*t-ce);return true;}
      vec3 starfield(vec3 rd){vec2 p=rd.xy/(abs(rd.z)+1.4);float h=hash21(floor(p*700.));float star=step(.9965,h)*pow(h,18.);float neb=noise(p*4.+u_time*.008*u_motion)*.06;return vec3(.006,.012,.03)+vec3(.35,.55,1.)*star+vec3(.06,.02,.11)*neb;}
      vec3 background(vec3 ro,vec3 rd){vec3 col=starfield(rd);float t;vec3 n;if(earthHit(ro,rd,t,n)){vec3 sun=normalize(vec3(-.4,.7,.35));float diff=max(0.,dot(n,sun));float ocean=.5+.5*sin(n.x*25.+sin(n.z*17.));float land=smoothstep(.52,.72,noise(n.xy*7.+n.z*4.));vec3 base=mix(vec3(.025,.14,.34),vec3(.08,.28,.12),land);float cloud=smoothstep(.65,.84,noise(n.xy*18.+n.z*6.+u_time*.012*u_motion));base=mix(base,vec3(.8,.88,.95),cloud*.55);col=base*(.1+.95*diff);float rim=pow(1.-max(0.,dot(-rd,n)),3.);col+=vec3(.12,.55,1.)*rim*.8;}return col;}
      vec3 material(float id,vec3 p,vec3 n,vec3 rd){vec3 sun=normalize(vec3(-.55,.72,.4));float diff=max(.05,dot(n,sun));float fres=pow(1.-max(0.,dot(n,-rd)),3.);vec3 c=vec3(.65);if(id<1.5)c=vec3(.62,.67,.7);else if(id<2.5)c=vec3(.28,.32,.37);else if(id<3.5){float grid=step(.92,fract((p.x+p.z)*8.))* .3;c=vec3(.035,.12,.25)+vec3(.05,.34,.75)*grid;}else if(id<4.5)c=vec3(.75,.76,.7);else if(id<5.5)c=vec3(.7,.72,.75);else c=vec3(.9,.92,.94);c*=.22+diff*.95;c+=vec3(.18,.35,.55)*fres*.45;if(id>2.5&&id<3.5)c+=vec3(.04,.12,.35)*u_power;return c;}
      vec3 renderExterior(vec3 ro,vec3 rd){vec3 col=background(ro,rd);float t=0.;float mat=0.;bool hit=false;float maxSteps=mix(46.,92.,u_quality);for(int i=0;i<96;i++){if(float(i)>maxSteps)break;vec3 p=ro+rd*t;vec2 h=stationMap(p);if(h.x<.0018){mat=h.y;hit=true;break;}t+=h.x*.82;if(t>35.)break;}if(hit){vec3 p=ro+rd*t,n=normalStation(p);col=material(mat,p,n,rd);float shadow=.0;float st=.02;for(int i=0;i<18;i++){vec3 sp=p+n*.01+normalize(vec3(-.55,.72,.4))*st;float h=stationMap(sp).x;shadow=max(shadow,.08-h/st);st+=clamp(h,.02,.3);}col*=1.-clamp(shadow,0.,.6);}
        float particles=0.;if(u_fault>.1||u_docking>.65){for(int i=0;i<14;i++){float fi=float(i);vec3 pp=vec3(sin(fi*8.13),cos(fi*5.7),fract(fi*.37+u_time*.08*u_motion))*vec3(1.7,1.2,2.4)+vec3(0.,0.,1.8);vec3 q=cross(rd,vec3(0.,1.,0));float d=length(cross(pp-ro,rd));particles+=exp(-d*120.)*.06;}col+=vec3(.35,.65,1.)*particles;}
        return col;}
      vec3 renderInterior(vec3 ro,vec3 rd){float t=0.,mat=0.;vec3 col=vec3(.008,.012,.02);for(int i=0;i<90;i++){vec3 p=ro+rd*t;float m;float d=corridorDist(p,m);if(d<.002){mat=m;vec3 n=vec3(0);float e=.002;float mm;float dx=corridorDist(p+vec3(e,0,0),mm)-corridorDist(p-vec3(e,0,0),mm);float dy=corridorDist(p+vec3(0,e,0),mm)-corridorDist(p-vec3(0,e,0),mm);float dz=corridorDist(p+vec3(0,0,e),mm)-corridorDist(p-vec3(0,0,e),mm);n=normalize(vec3(dx,dy,dz));float light=.3+.7*max(0.,dot(n,normalize(vec3(.2,.7,.4))));vec3 base=mat<7.5?vec3(.45,.52,.58):mat<8.5?vec3(.55,.58,.6):mat<9.5?vec3(.12,.38,.55):vec3(.75,.45,.16);col=base*light;float stripe=smoothstep(.46,.5,abs(fract((p.z+10.)*.33)-.5));col+=vec3(.05,.25,.35)*stripe*.6;break;}t+=d*.75;if(t>28.)break;}
        vec2 uv=v_uv-.5;float dust=0.;for(int i=0;i<18;i++){float fi=float(i);vec2 p=fract(vec2(hash21(vec2(fi,2.)),hash21(vec2(fi,8.)))+vec2(.02,-.012)*u_time*u_motion*(.3+fi*.03))-.5;dust+=.006/(length(uv-p)+.01);}col+=vec3(.5,.72,.9)*dust*.08;float alert=smoothstep(.8,2.5,u_co2);col=mix(col,col*vec3(1.25,.45,.38),alert*.28);return col;}
      void main(){vec2 uv=(gl_FragCoord.xy*2.-u_resolution.xy)/min(u_resolution.x,u_resolution.y);float fov=mix(1.05,.68,u_zoom);vec3 ro,ta;if(u_mode<.5||u_mode>1.5){ro=vec3(0.,.4,6.4/u_zoom);ro.xz=rot(u_yaw)*ro.xz;ro.yz=rot(u_pitch)*ro.yz;ta=vec3(0.,.15,0.);}else{ro=vec3(0.,0.,5.2);ta=ro+vec3(sin(u_yaw),sin(u_pitch),-cos(u_yaw));}vec3 ww=normalize(ta-ro),uu=normalize(cross(ww,vec3(0.,1.,0.))),vv=cross(uu,ww);vec3 rd=normalize(uu*uv.x*fov+vv*uv.y*fov+ww);vec3 col=u_mode>0.5&&u_mode<1.5?renderInterior(ro,rd):renderExterior(ro,rd);float vign=1.-dot(v_uv-.5,v_uv-.5)*.58;col*=vign;col=pow(max(col,0.),vec3(.82));outColor=vec4(col,1.);}`;
    const compile=(type,source)=>{const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(shader));return shader;};
    try{const program=gl.createProgram();const vs=compile(gl.VERTEX_SHADER,vertex),fs=compile(gl.FRAGMENT_SHADER,fragment);gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(program));gl.deleteShader(vs);gl.deleteShader(fs);const vao=gl.createVertexArray();gl.bindVertexArray(vao);const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);const loc=gl.getAttribLocation(program,'a_position');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);this.gl=gl;this.ctx=null;this.program=program;this.vao=vao;return true;}catch(error){console.warn('Renderizador da estação indisponível.',error);this.gl=null;this.ctx=this.canvas.getContext('2d');return false;}
  }
  setMode(mode){if(['exterior','interior','eva'].includes(mode))this.mode=mode;}
  resetCamera(){this.yaw=.25;this.pitch=.08;this.zoom=1;}
  setTelemetry(payload){this.telemetry=payload??this.telemetry;}
  pointerDown(event){this.drag={x:event.clientX,y:event.clientY,yaw:this.yaw,pitch:this.pitch};this.canvas.setPointerCapture?.(event.pointerId);}
  pointerMove(event){if(!this.drag)return;this.yaw=this.drag.yaw+(event.clientX-this.drag.x)*.006;this.pitch=clamp(this.drag.pitch+(event.clientY-this.drag.y)*.005,-1.1,1.1);}
  wheel(event){event.preventDefault();this.zoom=clamp(this.zoom-Math.sign(event.deltaY)*.08,.55,1.55);}
  resize(){const rect=this.canvas.getBoundingClientRect();const profile=this.settingsStore.getProfile();const dpr=devicePixelRatio||1;const scale=profile.id==='performance'?.58:profile.id==='experience'?Math.min(1.35,dpr):Math.min(.92,dpr);this.canvas.width=Math.max(1,Math.round(rect.width*scale));this.canvas.height=Math.max(1,Math.round(rect.height*scale));this.gl?.viewport(0,0,this.canvas.width,this.canvas.height);}
  start(){cancelAnimationFrame(this.raf);this.startTime=performance.now();this.loop();}
  loop=()=>{this.draw();this.raf=requestAnimationFrame(this.loop);};
  draw(){
    const profile=this.settingsStore.getProfile(),settings=this.settingsStore.get(),elapsed=(performance.now()-this.startTime)/1000;const systems=this.telemetry.systems??{},docking=this.telemetry.docking??{},arm=this.telemetry.arm??{};
    if(this.gl){const gl=this.gl;gl.useProgram(this.program);gl.bindVertexArray(this.vao);const loc=name=>gl.getUniformLocation(this.program,name);gl.uniform2f(loc('u_resolution'),this.canvas.width,this.canvas.height);const one=(name,value)=>gl.uniform1f(loc(name),value);one('u_time',settings.reducedMotion?0:elapsed);one('u_yaw',this.yaw);one('u_pitch',this.pitch);one('u_zoom',this.zoom);one('u_mode',this.mode==='interior'?1:this.mode==='eva'?2:0);one('u_quality',profile.id==='performance'?.08:profile.id==='experience'?1:.52);one('u_motion',settings.reducedMotion?0:profile.motionFactor);one('u_power',(systems.battery??86)/100);one('u_co2',systems.co2??.42);const start=240;one('u_docking',clamp(1-(docking.distanceM??start)/start,0,1));one('u_arm',arm.completion??0);one('u_fault',(systems.faults?.length??0)>0?1:0);gl.drawArrays(gl.TRIANGLES,0,3);return;}
    this.drawFallback();
  }
  drawFallback(){if(!this.ctx)return;const ctx=this.ctx,w=this.canvas.width,h=this.canvas.height;ctx.clearRect(0,0,w,h);if(this.mode==='interior'){const g=ctx.createLinearGradient(0,0,0,h);g.addColorStop(0,'#07131d');g.addColorStop(1,'#182a33');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);ctx.strokeStyle='rgba(90,220,255,.35)';ctx.lineWidth=3;for(let i=0;i<8;i++){const inset=i*28;ctx.strokeRect(inset,inset*.5,w-inset*2,h-inset); }ctx.fillStyle='#d5d9d8';ctx.fillRect(w*.43,h*.38,w*.14,h*.18);ctx.fillStyle='#ffb45c';ctx.fillRect(w*.47,h*.42,w*.06,h*.1);return;}
    ctx.fillStyle='#020611';ctx.fillRect(0,0,w,h);for(let i=0;i<90;i++){const x=(i*83)%w,y=(i*47)%h;ctx.fillStyle=`rgba(180,220,255,${.25+(i%5)*.12})`;ctx.fillRect(x,y,1.5,1.5);}const earthR=Math.min(w,h)*.34;const ex=w*.72,ey=h*.74;const eg=ctx.createRadialGradient(ex-earthR*.25,ey-earthR*.35,earthR*.1,ex,ey,earthR);eg.addColorStop(0,'#74c8ff');eg.addColorStop(.52,'#155a9e');eg.addColorStop(1,'#04172d');ctx.fillStyle=eg;ctx.beginPath();ctx.arc(ex,ey,earthR,0,Math.PI*2);ctx.fill();ctx.save();ctx.translate(w*.46,h*.42);ctx.rotate(this.yaw*.18);ctx.fillStyle='#b9c1c5';ctx.fillRect(-w*.13,-h*.035,w*.26,h*.07);ctx.fillStyle='#27333c';ctx.fillRect(-w*.24,-h*.012,w*.48,h*.024);ctx.fillStyle='#174889';for(const side of [-1,1])for(const z of [-1,1])ctx.fillRect(side*w*.18-w*.09,z*h*.09-h*.045,w*.18,h*.09);ctx.restore();}
  metrics(){const profile=this.settingsStore.getProfile();return {renderer:this.gl?'WebGL2 / GLSL':'Canvas 2D',mode:this.mode,width:this.canvas.width,height:this.canvas.height,profile:profile.id,contextLosses:this.contextLosses};}
  destroy(){cancelAnimationFrame(this.raf);this.resizeObserver?.disconnect();if(!this.resizeObserver)removeEventListener('resize',this.onResize);this.canvas.removeEventListener('pointerdown',this.onPointerDown);removeEventListener('pointermove',this.onPointerMove);removeEventListener('pointerup',this.onPointerUp);this.canvas.removeEventListener('wheel',this.onWheel);this.canvas.removeEventListener('webglcontextlost',this.onContextLost);this.canvas.removeEventListener('webglcontextrestored',this.onContextRestored);if(this.gl&&this.program)this.gl.deleteProgram(this.program);if(this.gl&&this.vao)this.gl.deleteVertexArray(this.vao);this.gl=null;this.ctx=null;}
}
