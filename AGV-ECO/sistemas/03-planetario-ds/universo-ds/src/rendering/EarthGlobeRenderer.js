const vertexSource = `#version 300 es
precision highp float;
in vec3 a_position;
in vec3 a_normal;
in vec2 a_uv;
uniform float u_yaw;
uniform float u_pitch;
uniform float u_distance;
uniform float u_aspect;
out vec3 v_normal;
out vec3 v_position;
out vec2 v_uv;
mat3 rotY(float a){float c=cos(a),s=sin(a);return mat3(c,0.,-s,0.,1.,0.,s,0.,c);}
mat3 rotX(float a){float c=cos(a),s=sin(a);return mat3(1.,0.,0.,0.,c,s,0.,-s,c);}
void main(){
  mat3 r=rotX(u_pitch)*rotY(u_yaw);
  vec3 p=r*a_position;
  vec3 n=normalize(r*a_normal);
  float f=2.05;
  float viewZ=p.z-u_distance;
  float near=.1,far=20.;
  gl_Position=vec4((p.x*f)/u_aspect,p.y*f,((far+near)/(near-far))*viewZ+(2.*far*near)/(near-far),-viewZ);
  v_normal=n;v_position=p;v_uv=a_uv;
}`;

const fragmentSource = `#version 300 es
precision highp float;
in vec3 v_normal;
in vec3 v_position;
in vec2 v_uv;
out vec4 outColor;
uniform float u_time;
uniform float u_clouds;
uniform float u_grid;
uniform float u_atmosphere;
uniform float u_detail;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*noise(p);p=p*2.03+17.1;a*=.5;}return v;}
void main(){
  vec3 n=normalize(v_normal);
  float lon=(v_uv.x-.5)*6.2831853;
  float lat=(v_uv.y-.5)*3.1415926;
  vec2 landUv=vec2(lon*1.1,lat*2.1);
  float continent=fbm(landUv+vec2(.35*sin(lat*3.),.18*sin(lon*2.)));
  continent+=.12*sin(lon*2.7+sin(lat*4.2))+.08*cos(lat*6.-lon*.7);
  float land=smoothstep(.49,.57,continent);
  float polar=smoothstep(.72,.96,abs(sin(lat)));
  vec3 ocean=mix(vec3(.006,.055,.15),vec3(.015,.24,.42),.45+.55*n.y);
  vec3 ground=mix(vec3(.08,.20,.09),vec3(.33,.28,.11),smoothstep(.48,.78,continent));
  ground=mix(ground,vec3(.84,.91,.93),polar);
  vec3 base=mix(ocean,ground,land);
  vec3 sun=normalize(vec3(.72,.28,.64));
  float light=max(dot(n,sun),0.);
  float twilight=smoothstep(-.12,.18,dot(n,sun));
  vec3 color=base*(.08+.92*light);
  float city=noise(floor(landUv*80.));
  color+=land*(1.-twilight)*step(.84,city)*vec3(1.,.55,.14)*.65;
  float clouds=fbm(vec2(lon*2.6+u_time*.018,lat*5.4));
  float cloudMask=smoothstep(.62,.76,clouds)*u_clouds*twilight;
  color=mix(color,vec3(.92,.97,1.),cloudMask*.72);
  float lonGrid=1.-smoothstep(.008,.024,abs(fract(v_uv.x*18.)-.5));
  float latGrid=1.-smoothstep(.008,.024,abs(fract(v_uv.y*9.)-.5));
  color+=vec3(.10,.78,1.)*max(lonGrid,latGrid)*u_grid*.11;
  vec3 viewDir=normalize(vec3(0.,0.,3.6)-v_position);
  float rim=pow(1.-max(dot(n,viewDir),0.),2.8)*u_atmosphere;
  color+=vec3(.08,.55,1.)*rim*(.55+.45*twilight);
  float scan=(sin((v_uv.y+u_time*.015)*900.)*.5+.5)*.012*u_detail;
  color+=scan;
  outColor=vec4(pow(color,vec3(.82)),1.);
}`;

function createSphere(segments = 64, rings = 40) {
  const positions=[]; const normals=[]; const uvs=[]; const indices=[];
  for(let y=0;y<=rings;y++){
    const v=y/rings; const phi=v*Math.PI;
    for(let x=0;x<=segments;x++){
      const u=x/segments; const theta=u*Math.PI*2;
      const sx=Math.sin(phi)*Math.cos(theta), sy=Math.cos(phi), sz=Math.sin(phi)*Math.sin(theta);
      positions.push(sx,sy,sz); normals.push(sx,sy,sz); uvs.push(u,1-v);
    }
  }
  for(let y=0;y<rings;y++) for(let x=0;x<segments;x++){
    const a=y*(segments+1)+x,b=a+segments+1;
    indices.push(a,b,a+1,b,a+1,b+1);
  }
  return { positions:new Float32Array(positions), normals:new Float32Array(normals), uvs:new Float32Array(uvs), indices:new Uint32Array(indices) };
}

export class EarthGlobeRenderer {
  constructor(canvas, settingsStore) {
    this.canvas=canvas; this.settingsStore=settingsStore; this.gl=null; this.ctx=null; this.program=null; this.raf=0;
    this.yaw=.35; this.pitch=-.18; this.distance=3.35; this.drag=null; this.startTime=performance.now(); this.resizeObserver=null;
    this.onPointerDown=e=>this.pointerDown(e); this.onPointerMove=e=>this.pointerMove(e); this.onPointerUp=()=>this.drag=null; this.onWheel=e=>this.wheel(e); this.resize=this.resize.bind(this);
  }
  start(){
    if(!this.canvas)return;
    if(!this.startWebGL())this.startFallback();
    this.canvas.addEventListener('pointerdown',this.onPointerDown); addEventListener('pointermove',this.onPointerMove); addEventListener('pointerup',this.onPointerUp); this.canvas.addEventListener('wheel',this.onWheel,{passive:false});
    if('ResizeObserver'in globalThis){this.resizeObserver=new ResizeObserver(()=>this.resize());this.resizeObserver.observe(this.canvas);}else addEventListener('resize',this.resize);
    this.resize();this.loop();
  }
  startWebGL(){
    const gl=this.canvas.getContext('webgl2',{antialias:this.settingsStore.getProfile().id!=='performance',powerPreference:this.settingsStore.getProfile().id==='experience'?'high-performance':'low-power'});
    if(!gl)return false;
    const compile=(type,source)=>{const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(s));return s;};
    try{
      const program=gl.createProgram();gl.attachShader(program,compile(gl.VERTEX_SHADER,vertexSource));gl.attachShader(program,compile(gl.FRAGMENT_SHADER,fragmentSource));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(program));
      const quality=this.settingsStore.getProfile().id; const sphere=createSphere(quality==='experience'?96:quality==='performance'?36:64,quality==='experience'?64:quality==='performance'?24:42);
      const vao=gl.createVertexArray();gl.bindVertexArray(vao);
      const bind=(name,data,size)=>{const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);const loc=gl.getAttribLocation(program,name);gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,size,gl.FLOAT,false,0,0);};
      bind('a_position',sphere.positions,3);bind('a_normal',sphere.normals,3);bind('a_uv',sphere.uvs,2);
      const ib=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ib);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,sphere.indices,gl.STATIC_DRAW);
      this.gl=gl;this.program=program;this.vao=vao;this.indexCount=sphere.indices.length;return true;
    }catch(error){console.warn('Globo WebGL2 indisponível; fallback 2D.',error);return false;}
  }
  startFallback(){this.ctx=this.canvas.getContext('2d');}
  resize(){const rect=this.canvas.getBoundingClientRect();const q=this.settingsStore.getProfile();let scale=Math.min(1.15,globalThis.devicePixelRatio||1);if(q.id==='experience')scale=Math.min(1.7,globalThis.devicePixelRatio||1);if(q.id==='performance')scale=.72;this.canvas.width=Math.max(1,Math.round(rect.width*scale));this.canvas.height=Math.max(1,Math.round(rect.height*scale));this.gl?.viewport(0,0,this.canvas.width,this.canvas.height);}
  pointerDown(e){this.drag={x:e.clientX,y:e.clientY,yaw:this.yaw,pitch:this.pitch};this.canvas.setPointerCapture?.(e.pointerId);}
  pointerMove(e){if(!this.drag)return;this.yaw=this.drag.yaw+(e.clientX-this.drag.x)*.008;this.pitch=Math.max(-1.15,Math.min(1.15,this.drag.pitch+(e.clientY-this.drag.y)*.008));}
  wheel(e){e.preventDefault();this.distance=Math.max(2.35,Math.min(5.2,this.distance+Math.sign(e.deltaY)*.22));}
  reset(){this.yaw=.35;this.pitch=-.18;this.distance=3.35;}
  loop=()=>{this.draw();this.raf=requestAnimationFrame(this.loop);};
  draw(){const elapsed=(performance.now()-this.startTime)/1000;const profile=this.settingsStore.getProfile();const settings=this.settingsStore.get();if(!settings.reducedMotion&&!this.drag)this.yaw+=.00075*profile.motionFactor;
    if(this.gl&&this.program){const gl=this.gl;gl.enable(gl.DEPTH_TEST);gl.disable(gl.BLEND);gl.clearColor(.004,.008,.025,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.useProgram(this.program);gl.bindVertexArray(this.vao);const u=(name)=>gl.getUniformLocation(this.program,name);gl.uniform1f(u('u_yaw'),this.yaw);gl.uniform1f(u('u_pitch'),this.pitch);gl.uniform1f(u('u_distance'),this.distance);gl.uniform1f(u('u_aspect'),this.canvas.width/this.canvas.height);gl.uniform1f(u('u_time'),settings.reducedMotion?0:elapsed);gl.uniform1f(u('u_clouds'),profile.id==='performance'?0:profile.id==='experience'?1:.55);gl.uniform1f(u('u_grid'),profile.id==='experience'?.55:.22);gl.uniform1f(u('u_atmosphere'),profile.atmosphere?1:0);gl.uniform1f(u('u_detail'),profile.id==='experience'?1:.35);gl.drawElements(gl.TRIANGLES,this.indexCount,gl.UNSIGNED_INT,0);return;}
    if(!this.ctx)return;const ctx=this.ctx,w=this.canvas.width,h=this.canvas.height,r=Math.min(w,h)*.34,cx=w/2,cy=h/2;ctx.clearRect(0,0,w,h);const g=ctx.createRadialGradient(cx-r*.3,cy-r*.4,r*.1,cx,cy,r);g.addColorStop(0,'#2b8fd0');g.addColorStop(.65,'#06336a');g.addColorStop(1,'#031225');ctx.fillStyle=g;ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.fill();ctx.strokeStyle='rgba(80,220,255,.55)';ctx.lineWidth=3;ctx.stroke();ctx.save();ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.clip();ctx.fillStyle='rgba(61,139,75,.8)';for(let i=0;i<8;i++){const a=i*.85+this.yaw;ctx.beginPath();ctx.ellipse(cx+Math.cos(a)*r*.55,cy+Math.sin(a*1.7)*r*.42,r*.23,r*.12,a*.4,0,Math.PI*2);ctx.fill();}ctx.restore();}
  destroy(){cancelAnimationFrame(this.raf);this.resizeObserver?.disconnect();if(!this.resizeObserver)removeEventListener('resize',this.resize);this.canvas?.removeEventListener('pointerdown',this.onPointerDown);removeEventListener('pointermove',this.onPointerMove);removeEventListener('pointerup',this.onPointerUp);this.canvas?.removeEventListener('wheel',this.onWheel);if(this.gl&&this.program)this.gl.deleteProgram(this.program);this.gl=null;this.ctx=null;}
}
