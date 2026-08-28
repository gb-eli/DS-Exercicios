const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
const hexToRgb=hex=>{const value=String(hex||'#58dfff').replace('#','');const full=value.length===3?value.split('').map(c=>c+c).join(''):value;return [parseInt(full.slice(0,2),16)/255,parseInt(full.slice(2,4),16)/255,parseInt(full.slice(4,6),16)/255];};

const vertex=`#version 300 es
in vec2 a_position;
out vec2 v_uv;
void main(){v_uv=a_position*.5+.5;gl_Position=vec4(a_position,0.,1.);}`;
const fragment=`#version 300 es
precision highp float;
in vec2 v_uv;out vec4 outColor;
uniform vec2 u_resolution;uniform float u_time;uniform float u_yaw;uniform float u_pitch;uniform float u_zoom;uniform float u_style;uniform float u_motion;uniform vec3 u_colorA;uniform vec3 u_colorB;uniform vec3 u_colorC;
#define PI 3.14159265359
float hash21(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash21(i),hash21(i+vec2(1,0)),f.x),mix(hash21(i+vec2(0,1)),hash21(i+vec2(1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*noise(p);p=p*2.03+17.1;a*=.5;}return v;}
mat2 rot(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}
vec3 rotateView(vec3 p){p.xz=rot(u_yaw)*p.xz;p.yz=rot(u_pitch)*p.yz;return p;}
float sdSphere(vec3 p,float r){return length(p)-r;}
float sdBox(vec3 p,vec3 b){vec3 q=abs(p)-b;return length(max(q,0.))+min(max(q.x,max(q.y,q.z)),0.);}
float sdCapsuleY(vec3 p,float h,float r){p.y-=clamp(p.y,-h,h);return length(p)-r;}
float mapTech(vec3 p,float style){
  p=rotateView(p);
  float body=sdBox(p,vec3(.56,.72,.38));
  float ring=abs(length(p.xz)-.78)-.055;
  float mast=sdCapsuleY(p-vec3(0,.92,0),.28,.07);
  float dish=sdSphere(p-vec3(0,1.28,0),.28);
  if(style>29.){body=sdCapsuleY(p,.78,.42);ring=abs(length(p.xz)-.63)-.035;dish=sdSphere(p-vec3(0,1.05,0),.22);}
  return min(min(body,ring),min(mast,dish));
}
vec3 surfaceColor(vec3 n,vec3 p,float style){
  float longitude=atan(n.z,n.x)/PI;float latitude=asin(clamp(n.y,-1.,1.))/PI;
  vec2 uv=vec2(longitude*.5+.5,latitude+.5);uv.x+=u_time*.008*u_motion;
  float f=fbm(uv*vec2(5.,3.)+style*1.7);
  vec3 col=mix(u_colorA,u_colorB,smoothstep(.28,.72,f));
  if(style<.5){col=mix(u_colorB,u_colorC,pow(max(0.,f),2.));col+=u_colorC*pow(max(0.,1.-length(uv-.5)*1.3),3.);}
  else if(style<2.5){float bands=sin((uv.y+f*.08)*42.);col=mix(col,u_colorC,smoothstep(.25,.85,bands*.5+.5)*.28);}
  else if(style<3.5){float land=fbm(uv*vec2(7.,4.)+3.);col=land>.54?mix(vec3(.04,.24,.11),u_colorC,land):mix(u_colorA,u_colorB,f);float cloud=fbm(uv*vec2(13.,6.)+u_time*.02);col=mix(col,vec3(.9),smoothstep(.69,.8,cloud)*.55);}
  else if(style<4.5){float cr=fbm(uv*14.);col=mix(u_colorB,u_colorA,cr);col*=.72+.28*noise(uv*45.);}
  else if(style<5.5){col=mix(u_colorA,u_colorB,f);float dust=fbm(uv*vec2(12.,5.));col+=u_colorC*smoothstep(.65,.85,dust)*.25;}
  else if(style<8.){float bands=.5+.5*sin((uv.y+f*.08)*50.);col=mix(u_colorA,u_colorB,bands);col=mix(col,u_colorC,smoothstep(.72,.9,f)*.25);}
  else if(style<10.){col=mix(u_colorA,u_colorB,f*.45);}
  return col;
}
void main(){
  vec2 p=(gl_FragCoord.xy*2.-u_resolution)/min(u_resolution.x,u_resolution.y);
  vec3 bg=mix(vec3(.002,.006,.018),vec3(.018,.035,.085),max(0.,1.-length(p))*.4);
  float star=step(.997,hash21(floor(gl_FragCoord.xy/2.)+floor(u_time*.02)));
  bg+=star*vec3(.65,.82,1.);
  float vignette=smoothstep(1.35,.25,length(p));
  vec3 ro=vec3(0,0,3.2*u_zoom);vec3 rd=normalize(vec3(p,-1.8));
  float t=0.;bool hit=false;vec3 pos=vec3(0);float style=u_style;
  for(int i=0;i<92;i++){
    pos=ro+rd*t;float d=style>=20.?mapTech(pos,style):sdSphere(rotateView(pos),.86);
    if(d<.0015){hit=true;break;}t+=d*.72;if(t>8.)break;
  }
  vec3 color=bg;
  if(hit){
    vec2 e=vec2(.003,0);float c=style>=20.?mapTech(pos,style):sdSphere(rotateView(pos),.86);
    vec3 n=normalize(vec3((style>=20.?mapTech(pos+e.xyy,style):sdSphere(rotateView(pos+e.xyy),.86))-c,(style>=20.?mapTech(pos+e.yxy,style):sdSphere(rotateView(pos+e.yxy),.86))-c,(style>=20.?mapTech(pos+e.yyx,style):sdSphere(rotateView(pos+e.yyx),.86))-c));
    vec3 light=normalize(vec3(-.7,.8,1.));float diff=max(.05,dot(n,light));float spec=pow(max(0.,dot(reflect(-light,n),-rd)),34.);
    vec3 base=style>=20.?mix(u_colorA,u_colorB,.35+.45*fbm(pos.xy*4.)):surfaceColor(n,rotateView(pos),style);
    color=base*(.18+.92*diff)+spec*u_colorC*.8;
    float fres=pow(1.-max(0.,dot(n,-rd)),3.);color+=u_colorC*fres*(style<10.?.34:.18);
  } else if(style<10.){
    float r=length(p);float glow=exp(-18.*abs(r-.43/u_zoom));color+=u_colorC*glow*.12;
    if(style>6.5&&style<9.){vec2 q=p;q=rot(-u_yaw*.22)*q;float ring=exp(-65.*abs(length(q*vec2(1.,2.9))-.62/u_zoom));color+=mix(u_colorA,u_colorC,.55)*ring*.9;}
  }
  color*=.62+.38*vignette;outColor=vec4(pow(color,vec3(.82)),1.);
}`;

export class KnowledgeOrbRenderer {
  constructor(canvas,settingsStore,{onTelemetry=()=>{},onContextState=()=>{}}={}){
    this.canvas=canvas;this.settingsStore=settingsStore;this.onTelemetry=onTelemetry;this.onContextState=onContextState;
    this.gl=null;this.ctx2d=null;this.program=null;this.buffer=null;this.vao=null;this.uniforms={};this.rafId=0;this.running=false;this.startTime=performance.now();this.lastFrame=this.startTime;this.frames=0;this.fps=0;
    this.yaw=.35;this.pitch=-.08;this.zoom=1;this.target={id:'earth',visual:{style:3,colors:['#06255d','#188fd2','#4aa464']}};this.dragging=false;this.lastPointer=null;
    this.onResize=()=>this.resize();this.onPointerDown=e=>this.pointerDown(e);this.onPointerMove=e=>this.pointerMove(e);this.onPointerUp=()=>this.pointerUp();this.onWheel=e=>this.wheel(e);
    this.onLost=e=>{e.preventDefault();this.onContextState('lost');};this.onRestored=()=>{this.destroyGl();this.init();this.onContextState('restored');};
  }
  start(){if(this.running)return;this.running=true;this.attach();this.init();this.resize();this.loop(performance.now());}
  attach(){addEventListener('resize',this.onResize);this.canvas.addEventListener('pointerdown',this.onPointerDown);addEventListener('pointermove',this.onPointerMove);addEventListener('pointerup',this.onPointerUp);this.canvas.addEventListener('wheel',this.onWheel,{passive:false});this.canvas.addEventListener('webglcontextlost',this.onLost);this.canvas.addEventListener('webglcontextrestored',this.onRestored);}
  init(){try{this.gl=this.canvas.getContext('webgl2',{antialias:false,alpha:false,powerPreference:this.settingsStore.getProfile().id==='experience'?'high-performance':'default'});if(!this.gl)throw new Error('WebGL2 indisponível');this.initGl();}catch(error){this.startFallback(error.message);}}
  compile(type,source){const shader=this.gl.createShader(type);this.gl.shaderSource(shader,source);this.gl.compileShader(shader);if(!this.gl.getShaderParameter(shader,this.gl.COMPILE_STATUS)){const message=this.gl.getShaderInfoLog(shader);this.gl.deleteShader(shader);throw new Error(message||'Falha no shader');}return shader;}
  initGl(){const gl=this.gl,vs=this.compile(gl.VERTEX_SHADER,vertex),fs=this.compile(gl.FRAGMENT_SHADER,fragment);this.program=gl.createProgram();gl.attachShader(this.program,vs);gl.attachShader(this.program,fs);gl.linkProgram(this.program);gl.deleteShader(vs);gl.deleteShader(fs);if(!gl.getProgramParameter(this.program,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(this.program));this.vao=gl.createVertexArray();this.buffer=gl.createBuffer();gl.bindVertexArray(this.vao);gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);const location=gl.getAttribLocation(this.program,'a_position');gl.enableVertexAttribArray(location);gl.vertexAttribPointer(location,2,gl.FLOAT,false,0,0);for(const name of ['u_resolution','u_time','u_yaw','u_pitch','u_zoom','u_style','u_motion','u_colorA','u_colorB','u_colorC'])this.uniforms[name]=gl.getUniformLocation(this.program,name);}
  startFallback(reason='WebGL2 indisponível'){this.gl=null;this.ctx2d=this.canvas.getContext('2d');this.onContextState(`fallback:${reason}`);}
  setTarget(item){this.target=item||this.target;this.yaw=.35;this.pitch=-.08;this.zoom=1;}
  pointerDown(event){this.dragging=true;this.lastPointer={x:event.clientX,y:event.clientY};this.canvas.setPointerCapture?.(event.pointerId);}
  pointerMove(event){if(!this.dragging||!this.lastPointer)return;const dx=event.clientX-this.lastPointer.x,dy=event.clientY-this.lastPointer.y;this.yaw+=dx*.007;this.pitch=clamp(this.pitch+dy*.006,-1.15,1.15);this.lastPointer={x:event.clientX,y:event.clientY};}
  pointerUp(){this.dragging=false;this.lastPointer=null;}
  wheel(event){event.preventDefault();this.zoom=clamp(this.zoom+event.deltaY*.0007,.62,1.85);}
  reset(){this.yaw=.35;this.pitch=-.08;this.zoom=1;}
  resize(){const profile=this.settingsStore.getProfile(),scale=profile.id==='performance'?.62:profile.id==='experience'?1:.82;const dpr=Math.min(devicePixelRatio||1,profile.id==='experience'?1.75:1.25);const width=Math.max(1,Math.floor(this.canvas.clientWidth*dpr*scale)),height=Math.max(1,Math.floor(this.canvas.clientHeight*dpr*scale));if(this.canvas.width!==width||this.canvas.height!==height){this.canvas.width=width;this.canvas.height=height;}this.gl?.viewport(0,0,width,height);}
  loop(now){if(!this.running)return;this.rafId=requestAnimationFrame(time=>this.loop(time));const settings=this.settingsStore.get(),dt=Math.min(.05,(now-this.lastFrame)/1000);this.lastFrame=now;if(!settings.reducedMotion&&!this.dragging)this.yaw+=dt*.09;this.frames++;if(now-this.startTime>=1000){this.fps=Math.round(this.frames*1000/(now-this.startTime));this.frames=0;this.startTime=now;}this.draw(now*.001);this.onTelemetry({fps:this.fps,yaw:this.yaw,pitch:this.pitch,zoom:this.zoom,renderer:this.gl?'WebGL2':'Canvas 2D'});}
  draw(time){if(this.gl)this.drawGl(time);else this.drawFallback(time);}
  drawGl(time){const gl=this.gl,profile=this.settingsStore.getProfile(),colors=(this.target.visual?.colors||['#58dfff','#765cff','#f5fbff']).map(hexToRgb);gl.useProgram(this.program);gl.bindVertexArray(this.vao);gl.uniform2f(this.uniforms.u_resolution,this.canvas.width,this.canvas.height);gl.uniform1f(this.uniforms.u_time,time);gl.uniform1f(this.uniforms.u_yaw,this.yaw);gl.uniform1f(this.uniforms.u_pitch,this.pitch);gl.uniform1f(this.uniforms.u_zoom,this.zoom);gl.uniform1f(this.uniforms.u_style,Number(this.target.visual?.style??20));gl.uniform1f(this.uniforms.u_motion,this.settingsStore.get().reducedMotion?0:1);gl.uniform3fv(this.uniforms.u_colorA,colors[0]);gl.uniform3fv(this.uniforms.u_colorB,colors[1]);gl.uniform3fv(this.uniforms.u_colorC,colors[2]);gl.drawArrays(gl.TRIANGLES,0,3);}
  drawFallback(time){const ctx=this.ctx2d;if(!ctx)return;const w=this.canvas.width,h=this.canvas.height,colors=this.target.visual?.colors||['#58dfff','#765cff','#f5fbff'];ctx.clearRect(0,0,w,h);const g=ctx.createRadialGradient(w*.5,h*.45,0,w*.5,h*.45,Math.max(w,h)*.7);g.addColorStop(0,'#101d45');g.addColorStop(1,'#01030b');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);ctx.fillStyle='rgba(200,230,255,.65)';for(let i=0;i<70;i++){const x=(i*83%997)/997*w,y=(i*151%991)/991*h;ctx.fillRect(x,y,i%11===0?2:1,i%11===0?2:1);}const r=Math.min(w,h)*.22/this.zoom,x=w/2,y=h/2;ctx.save();ctx.translate(x,y);ctx.rotate(this.yaw*.15);const orb=ctx.createRadialGradient(-r*.35,-r*.4,r*.04,0,0,r);orb.addColorStop(0,colors[2]);orb.addColorStop(.48,colors[1]);orb.addColorStop(1,colors[0]);ctx.fillStyle=orb;ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);ctx.fill();if((this.target.visual?.style??0)>=20){ctx.strokeStyle=colors[2];ctx.lineWidth=Math.max(2,r*.04);ctx.strokeRect(-r*.65,-r*.65,r*1.3,r*1.3);ctx.beginPath();ctx.ellipse(0,0,r*1.1,r*.32,0,0,Math.PI*2);ctx.stroke();}ctx.restore();}
  requestFullscreen(){return this.canvas.parentElement?.requestFullscreen?.();}
  destroyGl(){if(!this.gl)return;const gl=this.gl;if(this.buffer)gl.deleteBuffer(this.buffer);if(this.vao)gl.deleteVertexArray(this.vao);if(this.program)gl.deleteProgram(this.program);this.buffer=null;this.vao=null;this.program=null;}
  destroy(){this.running=false;cancelAnimationFrame(this.rafId);removeEventListener('resize',this.onResize);this.canvas.removeEventListener('pointerdown',this.onPointerDown);removeEventListener('pointermove',this.onPointerMove);removeEventListener('pointerup',this.onPointerUp);this.canvas.removeEventListener('wheel',this.onWheel);this.canvas.removeEventListener('webglcontextlost',this.onLost);this.canvas.removeEventListener('webglcontextrestored',this.onRestored);this.destroyGl();this.ctx2d=null;}
}
