const clamp=(value,min,max)=>Math.min(max,Math.max(min,value));

export class LunarSceneRenderer{
  constructor(canvas,settingsStore){
    this.canvas=canvas;this.settingsStore=settingsStore;this.gl=null;this.ctx=null;this.program=null;this.vao=null;this.raf=0;this.startTime=performance.now();
    this.mode='surface';this.yaw=.18;this.pitch=-.12;this.zoom=1;this.drag=null;this.siteRisk=.22;this.telemetry={altitudeM:15000,state:'ORBIT',throttle:0,lateralOffsetM:0,verticalSpeedMs:0,horizontalSpeedMs:0};
    this.onPointerDown=e=>this.pointerDown(e);this.onPointerMove=e=>this.pointerMove(e);this.onPointerUp=()=>{this.drag=null;};this.onWheel=e=>this.wheel(e);this.onResize=()=>this.resize();
    if(!this.initWebGL())this.initFallback();
    this.resizeObserver=typeof ResizeObserver!=='undefined'?new ResizeObserver(()=>this.resize()):null;this.resizeObserver?.observe(canvas);if(!this.resizeObserver)addEventListener('resize',this.onResize);
    canvas.addEventListener('pointerdown',this.onPointerDown);addEventListener('pointermove',this.onPointerMove);addEventListener('pointerup',this.onPointerUp);canvas.addEventListener('wheel',this.onWheel,{passive:false});this.resize();
  }
  initWebGL(){
    const gl=this.canvas.getContext('webgl2',{antialias:false,alpha:false,powerPreference:'high-performance'});if(!gl)return false;
    const vertex=`#version 300 es
      in vec2 a_position;out vec2 v_uv;void main(){v_uv=a_position*.5+.5;gl_Position=vec4(a_position,0.,1.);}`;
    const fragment=`#version 300 es
      precision highp float;in vec2 v_uv;out vec4 outColor;
      uniform vec2 u_resolution;uniform float u_time;uniform float u_yaw;uniform float u_pitch;uniform float u_zoom;uniform float u_mode;uniform float u_altitude;uniform float u_throttle;uniform float u_risk;uniform float u_quality;uniform float u_motion;
      #define PI 3.14159265359
      mat2 rot(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);} 
      float hash21(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);} 
      float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash21(i),hash21(i+vec2(1,0)),f.x),mix(hash21(i+vec2(0,1)),hash21(i+vec2(1)),f.x),f.y);} 
      float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*noise(p);p=p*2.03+17.1;a*=.5;}return v;} 
      float crater(vec2 p,vec2 c,float r){float d=length(p-c)/r;float bowl=smoothstep(1.,.18,d);float rim=smoothstep(1.34,.96,d)*smoothstep(.72,1.,d);return -bowl*.38+rim*.24;} 
      float terrain(vec2 p){float h=(fbm(p*.035)-.5)*7.;h+=(fbm(p*.14)-.5)*2.2;float cell=34.;vec2 id=floor(p/cell);for(int y=-1;y<=1;y++)for(int x=-1;x<=1;x++){vec2 o=vec2(x,y);vec2 g=id+o;vec2 c=(g+.18+.64*vec2(hash21(g),hash21(g+8.3)))*cell;float r=3.+hash21(g+3.2)*8.;h+=crater(p,c,r)*(2.5+r*.25);}return h;} 
      float mapScene(vec3 p){float ground=p.y-terrain(p.xz);if(u_mode<.5)return ground;vec3 q=p-vec3(0.,terrain(vec2(0.))+6.2,0.);q.xz*=rot(u_yaw*.15);float body=max(length(q.xz)-1.1,abs(q.y)-2.0);float cabin=max(length(q.xz)-1.55,abs(q.y-.5)-1.15);float legs=1e4;for(int i=0;i<4;i++){float a=float(i)*PI*.5+.785;vec3 l=q-vec3(cos(a)*2.1,-2.1,sin(a)*2.1);l.xz*=rot(-a);legs=min(legs,max(length(l.xz)-.12,abs(l.y)-1.8));}float engine=max(length(q.xz)-.55,abs(q.y+2.25)-.45);return min(ground,min(min(body,cabin),min(legs,engine)));} 
      vec3 normalAt(vec3 p){vec2 e=vec2(.02,0.);float d=mapScene(p);return normalize(vec3(mapScene(p+e.xyy)-d,mapScene(p+e.yxy)-d,mapScene(p+e.yyx)-d));} 
      float raymarch(vec3 ro,vec3 rd,out vec3 p){float t=0.;int steps=int(mix(54.,110.,u_quality));for(int i=0;i<120;i++){if(i>=steps)break;p=ro+rd*t;float d=mapScene(p);if(abs(d)<.018||t>220.)break;t+=max(.018,d*.66);}return t;} 
      vec3 stars(vec3 rd){float h=hash21(floor((rd.xy/(abs(rd.z)+.2))*420.));float s=step(.9965,h)*pow(h,38.);float band=pow(max(0.,1.-abs(rd.y+.12)),7.)*.08*(.3+fbm(rd.xz*60.));return vec3(s)+vec3(.06,.08,.12)*band;} 
      void main(){
        vec2 uv=(gl_FragCoord.xy-.5*u_resolution.xy)/u_resolution.y;uv/=u_zoom;vec3 ro,ta;
        float altitudeNorm=clamp(u_altitude,0.,1.);
        if(u_mode<.5){ro=vec3(sin(u_yaw)*44.,18.+u_pitch*35.,cos(u_yaw)*44.);ta=vec3(0.,2.,0.);}else{float camDist=mix(21.,50.,altitudeNorm);ro=vec3(sin(u_yaw)*camDist,12.+altitudeNorm*28.+u_pitch*26.,cos(u_yaw)*camDist);ta=vec3(0.,3.+altitudeNorm*10.,0.);} 
        vec3 f=normalize(ta-ro),r=normalize(cross(f,vec3(0,1,0))),u=cross(r,f);vec3 rd=normalize(f+uv.x*r+uv.y*u);vec3 p;float t=raymarch(ro,rd,p);vec3 col=stars(rd);
        if(t<220.){vec3 n=normalAt(p);vec3 sun=normalize(vec3(-.62,.72,.34));float diff=max(0.,dot(n,sun));float rim=pow(1.-max(0.,dot(n,-rd)),3.);float rock=.33+.3*noise(p.xz*.22)+.14*noise(p.xz*1.8);col=vec3(rock*.78,rock*.75,rock*.68)*(diff*.85+.12)+vec3(.22,.26,.34)*rim*.22;float shadow=smoothstep(.01,.45,mapScene(p+sun*.2));col*=mix(.55,1.,shadow);if(u_mode>.5&&p.y>terrain(p.xz)+.12){col=mix(col,vec3(.72,.74,.68),.35);}}
        if(u_mode>.5&&u_throttle>.02){vec2 flameUv=uv-vec2(0,-.28);float plume=exp(-abs(flameUv.x)*28.)*smoothstep(.38,-.38,flameUv.y)*smoothstep(-.7,-.12,flameUv.y);plume*=.6+.4*sin(u_time*35.*u_motion+flameUv.y*90.);col+=vec3(.3,.72,1.2)*plume*u_throttle;float dust=fbm(uv*vec2(38,10)+vec2(u_time*u_motion*2.,0.));dust*=smoothstep(.35,.02,abs(uv.y+.42))*smoothstep(.45,.05,abs(uv.x));col+=vec3(.42,.34,.22)*dust*u_throttle*(1.-altitudeNorm);}
        float vignette=1.-dot(v_uv-.5,v_uv-.5)*.65;col*=vignette;col=pow(col,vec3(.86));outColor=vec4(col,1.);
      }`;
    const compile=(type,source)=>{const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(shader));return shader;};
    try{const program=gl.createProgram();gl.attachShader(program,compile(gl.VERTEX_SHADER,vertex));gl.attachShader(program,compile(gl.FRAGMENT_SHADER,fragment));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(program));const vao=gl.createVertexArray();gl.bindVertexArray(vao);const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);const loc=gl.getAttribLocation(program,'a_position');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);this.gl=gl;this.program=program;this.vao=vao;return true;}catch(error){console.warn('Renderizador lunar WebGL2 indisponível.',error);return false;}
  }
  initFallback(){this.ctx=this.canvas.getContext('2d');}
  setMode(mode){this.mode=mode;}
  setRisk(value){this.siteRisk=clamp(Number(value)||0,0,100)/100;}
  setTelemetry(telemetry){this.telemetry={...this.telemetry,...telemetry};}
  resetCamera(){this.yaw=.18;this.pitch=-.12;this.zoom=1;}
  pointerDown(event){this.drag={x:event.clientX,y:event.clientY,yaw:this.yaw,pitch:this.pitch};this.canvas.setPointerCapture?.(event.pointerId);}
  pointerMove(event){if(!this.drag)return;this.yaw=this.drag.yaw+(event.clientX-this.drag.x)*.006;this.pitch=clamp(this.drag.pitch+(event.clientY-this.drag.y)*.006,-.5,.48);}
  wheel(event){event.preventDefault();this.zoom=clamp(this.zoom+Math.sign(event.deltaY)*.08,.68,1.55);}
  resize(){const rect=this.canvas.getBoundingClientRect();const profile=this.settingsStore.getProfile();const dpr=devicePixelRatio||1;const scale=profile.id==='performance'?.58:profile.id==='experience'?Math.min(1.5,dpr):Math.min(1,dpr);this.canvas.width=Math.max(1,Math.round(rect.width*scale));this.canvas.height=Math.max(1,Math.round(rect.height*scale));this.gl?.viewport(0,0,this.canvas.width,this.canvas.height);}
  start(){cancelAnimationFrame(this.raf);this.startTime=performance.now();this.loop();}
  loop=()=>{this.draw();this.raf=requestAnimationFrame(this.loop);};
  draw(){
    const profile=this.settingsStore.getProfile(),settings=this.settingsStore.get(),elapsed=(performance.now()-this.startTime)/1000;
    const altitude=clamp((this.telemetry.altitudeM??15000)/15000,0,1),mode=this.mode==='surface'?0:1;
    if(this.gl){const gl=this.gl;gl.disable(gl.DEPTH_TEST);gl.clearColor(0,0,0,1);gl.clear(gl.COLOR_BUFFER_BIT);gl.useProgram(this.program);gl.bindVertexArray(this.vao);const one=(name,value)=>gl.uniform1f(gl.getUniformLocation(this.program,name),value);gl.uniform2f(gl.getUniformLocation(this.program,'u_resolution'),this.canvas.width,this.canvas.height);one('u_time',settings.reducedMotion?0:elapsed);one('u_yaw',this.yaw);one('u_pitch',this.pitch);one('u_zoom',this.zoom);one('u_mode',mode);one('u_altitude',altitude);one('u_throttle',this.telemetry.throttle??0);one('u_risk',this.siteRisk);one('u_quality',profile.id==='performance'?.12:profile.id==='experience'?1:.55);one('u_motion',settings.reducedMotion?0:profile.motionFactor);gl.drawArrays(gl.TRIANGLES,0,3);return;}
    if(!this.ctx)return;const ctx=this.ctx,w=this.canvas.width,h=this.canvas.height;ctx.clearRect(0,0,w,h);ctx.fillStyle='#01030a';ctx.fillRect(0,0,w,h);for(let i=0;i<90;i++){const x=(i*71%997)/997*w,y=(i*137%991)/991*h*.62;ctx.fillStyle=`rgba(220,235,255,${.15+(i%7)/12})`;ctx.fillRect(x,y,1+(i%3===0),1+(i%3===0));}const horizon=h*(.52+altitude*.2);const gradient=ctx.createLinearGradient(0,horizon,0,h);gradient.addColorStop(0,'#4c4a46');gradient.addColorStop(1,'#171716');ctx.fillStyle=gradient;ctx.beginPath();ctx.moveTo(0,horizon);for(let x=0;x<=w;x+=20){const y=horizon+Math.sin(x*.035)*9+Math.sin(x*.012+1.5)*14;ctx.lineTo(x,y);}ctx.lineTo(w,h);ctx.lineTo(0,h);ctx.fill();for(let i=0;i<12;i++){const x=(i*83%101)/101*w,y=horizon+35+(i*47%83)/83*(h-horizon-55),r=8+(i%5)*5;ctx.strokeStyle='rgba(10,10,10,.5)';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(x,y,r*1.8,r*.55,0,0,Math.PI*2);ctx.stroke();}if(mode>0){const cx=w/2,cy=h*(.34+altitude*.12),s=Math.min(w,h)*.08;ctx.strokeStyle='#d9d7c8';ctx.fillStyle='#9c9b91';ctx.lineWidth=4;ctx.fillRect(cx-s*.7,cy-s,s*1.4,s*1.65);ctx.strokeRect(cx-s*.7,cy-s,s*1.4,s*1.65);ctx.beginPath();for(const dir of [-1,1]){ctx.moveTo(cx+dir*s*.55,cy+s*.3);ctx.lineTo(cx+dir*s*1.5,cy+s*1.9);ctx.lineTo(cx+dir*s*1.85,cy+s*2.05);}ctx.stroke();if((this.telemetry.throttle??0)>.02){const plume=ctx.createLinearGradient(cx,cy+s*.7,cx,cy+s*3);plume.addColorStop(0,'rgba(220,250,255,.9)');plume.addColorStop(.35,'rgba(50,170,255,.65)');plume.addColorStop(1,'rgba(255,180,70,0)');ctx.fillStyle=plume;ctx.beginPath();ctx.moveTo(cx-s*.35,cy+s*.7);ctx.lineTo(cx,cy+s*(2.4+Math.sin(elapsed*18)*.3));ctx.lineTo(cx+s*.35,cy+s*.7);ctx.fill();}}}
  destroy(){cancelAnimationFrame(this.raf);this.resizeObserver?.disconnect();if(!this.resizeObserver)removeEventListener('resize',this.onResize);this.canvas?.removeEventListener('pointerdown',this.onPointerDown);removeEventListener('pointermove',this.onPointerMove);removeEventListener('pointerup',this.onPointerUp);this.canvas?.removeEventListener('wheel',this.onWheel);if(this.gl&&this.program)this.gl.deleteProgram(this.program);this.gl=null;this.ctx=null;}
}
