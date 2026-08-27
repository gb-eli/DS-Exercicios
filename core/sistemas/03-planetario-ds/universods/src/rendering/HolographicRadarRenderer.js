const vertexSource = `#version 300 es
in vec2 a_position;
out vec2 v_uv;
void main(){v_uv=a_position*.5+.5;gl_Position=vec4(a_position,0.,1.);}`;

const fragmentSource = `#version 300 es
precision highp float;
in vec2 v_uv;
out vec4 outColor;
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_density;
uniform float u_motion;

float line(float value,float width){return 1.-smoothstep(width,width+1.5/u_resolution.y,abs(value));}
float circle(vec2 p,float radius,float width){return line(length(p)-radius,width);}
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
void main(){
  vec2 p=(gl_FragCoord.xy-.5*u_resolution)/min(u_resolution.x,u_resolution.y);
  float angle=atan(p.y,p.x);
  float radius=length(p);
  float rings=0.;
  for(int i=1;i<6;i++) rings+=circle(p,float(i)*.09,.0025);
  float spokes=line(sin(angle*6.),.025)*(1.-smoothstep(.02,.5,radius))*.18;
  float sweepAngle=mod(u_time*u_motion,6.2831853)-3.1415926;
  float delta=abs(atan(sin(angle-sweepAngle),cos(angle-sweepAngle)));
  float sweep=(1.-smoothstep(0.,.62,delta))*(1.-smoothstep(.08,.52,radius));
  float beam=line(delta,.014)*(1.-smoothstep(.03,.5,radius));
  float blips=0.;
  for(int i=0;i<12;i++){
    float fi=float(i);
    vec2 seed=vec2(fi,fi*2.13);
    float a=hash(seed)*6.2831853;
    float r=.07+hash(seed+3.2)*.39;
    vec2 b=vec2(cos(a),sin(a))*r;
    float d=length(p-b);
    float enabled=step(fi,4.+u_density*7.);
    blips+=enabled*(1.-smoothstep(.006,.018,d))*(.35+.65*(1.-smoothstep(0.,1.1,abs(atan(sin(a-sweepAngle),cos(a-sweepAngle))))));
  }
  float noise=(hash(floor(v_uv*u_resolution*.08))-.5)*.035*u_density;
  vec3 cyan=vec3(.16,.86,1.);
  vec3 violet=vec3(.62,.38,1.);
  vec3 color=cyan*(rings*.4+spokes+sweep*.23+beam*.85+blips*1.5)+violet*blips*.34;
  float vignette=1.-smoothstep(.42,.7,radius);
  outColor=vec4(color+noise,max(color.r,max(color.g,color.b))*vignette);
}`;

export class HolographicRadarRenderer {
  constructor(canvas, settingsStore) {
    this.canvas = canvas;
    this.settingsStore = settingsStore;
    this.gl = null;
    this.ctx = null;
    this.program = null;
    this.raf = 0;
    this.startTime = performance.now();
    this.resizeObserver = null;
    this.resize = this.resize.bind(this);
  }

  start() {
    if (!this.canvas) return;
    if (!this.startWebGL()) this.startFallback();
    if ('ResizeObserver' in globalThis) {
      this.resizeObserver = new ResizeObserver(() => this.resize());
      this.resizeObserver.observe(this.canvas);
    } else {
      addEventListener('resize', this.resize);
    }
    this.resize();
    this.loop();
  }

  startWebGL() {
    const gl = this.canvas.getContext('webgl2', { alpha: true, antialias: false, powerPreference: this.settingsStore.getProfile().id === 'experience' ? 'high-performance' : 'low-power' });
    if (!gl) return false;
    const compile = (type, source) => {
      const shader = gl.createShader(type); gl.shaderSource(shader, source); gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader));
      return shader;
    };
    try {
      const program = gl.createProgram();
      gl.attachShader(program, compile(gl.VERTEX_SHADER, vertexSource));
      gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragmentSource));
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
      gl.useProgram(program);
      const location = gl.getAttribLocation(program, 'a_position');
      gl.enableVertexAttribArray(location);
      gl.vertexAttribPointer(location, 2, gl.FLOAT, false, 0, 0);
      this.gl = gl;
      this.program = program;
      return true;
    } catch (error) {
      console.warn('Radar WebGL2 indisponível; fallback 2D ativado.', error);
      return false;
    }
  }

  startFallback() {
    this.ctx = this.canvas.getContext('2d');
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    const quality = this.settingsStore.getProfile().id;
    const scale = quality === 'experience' ? 1.5 : quality === 'performance' ? .75 : 1;
    this.canvas.width = Math.max(1, Math.round(rect.width * scale));
    this.canvas.height = Math.max(1, Math.round(rect.height * scale));
    this.gl?.viewport(0, 0, this.canvas.width, this.canvas.height);
  }

  loop = () => {
    this.draw();
    this.raf = requestAnimationFrame(this.loop);
  };

  draw() {
    const elapsed = (performance.now() - this.startTime) / 1000;
    const profile = this.settingsStore.getProfile();
    const reduced = this.settingsStore.get().reducedMotion;
    if (this.gl && this.program) {
      const gl = this.gl;
      gl.useProgram(this.program);
      gl.uniform2f(gl.getUniformLocation(this.program,'u_resolution'), this.canvas.width, this.canvas.height);
      gl.uniform1f(gl.getUniformLocation(this.program,'u_time'), reduced ? 0 : elapsed);
      gl.uniform1f(gl.getUniformLocation(this.program,'u_density'), profile.id === 'experience' ? 1 : profile.id === 'performance' ? .25 : .58);
      gl.uniform1f(gl.getUniformLocation(this.program,'u_motion'), reduced ? 0 : profile.motionFactor);
      gl.clearColor(0,0,0,0); gl.clear(gl.COLOR_BUFFER_BIT);
      gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
      gl.drawArrays(gl.TRIANGLES,0,6);
      return;
    }
    if (!this.ctx) return;
    const ctx = this.ctx;
    const w=this.canvas.width,h=this.canvas.height,cx=w/2,cy=h/2,r=Math.min(w,h)*.42;
    ctx.clearRect(0,0,w,h); ctx.strokeStyle='rgba(63,220,255,.45)'; ctx.lineWidth=1;
    for(let i=1;i<=5;i++){ctx.beginPath();ctx.arc(cx,cy,r*i/5,0,Math.PI*2);ctx.stroke();}
    const a=(reduced?0:elapsed*profile.motionFactor)%(Math.PI*2);
    ctx.strokeStyle='rgba(93,235,255,.9)';ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r);ctx.stroke();
  }

  destroy() {
    cancelAnimationFrame(this.raf);
    this.resizeObserver?.disconnect();
    if (!this.resizeObserver) removeEventListener('resize', this.resize);
    if (this.gl && this.program) this.gl.deleteProgram(this.program);
    this.gl = null; this.ctx = null; this.program = null;
  }
}
