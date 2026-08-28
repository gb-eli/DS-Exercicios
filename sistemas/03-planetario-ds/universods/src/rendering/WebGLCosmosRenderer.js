const VERTEX_SHADER = `#version 300 es
precision highp float;
out vec2 vUv;
void main() {
  vec2 positions[3] = vec2[3](vec2(-1.0,-1.0), vec2(3.0,-1.0), vec2(-1.0,3.0));
  vec2 p = positions[gl_VertexID];
  vUv = p * 0.5 + 0.5;
  gl_Position = vec4(p, 0.0, 1.0);
}`;

const FRAGMENT_SHADER = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 outColor;
uniform vec2 uResolution;
uniform vec2 uPointer;
uniform float uTime;
uniform float uMotion;
uniform int uStarLayers;
uniform bool uAtmosphere;
uniform bool uOrbit;

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float starLayer(vec2 uv, float scale, float threshold, float t) {
  vec2 grid = floor(uv * scale);
  vec2 cell = fract(uv * scale) - .5;
  float h = hash21(grid);
  vec2 offset = vec2(hash21(grid + 7.1), hash21(grid + 19.7)) - .5;
  float d = length(cell - offset * .68);
  float star = smoothstep(.045, 0.0, d) * step(threshold, h);
  float twinkle = .58 + .42 * sin(t * (1.0 + h * 2.8) + h * 29.0);
  return star * twinkle * (1.0 + h * 1.8);
}

float ellipseLine(vec2 p, vec2 radii, float width) {
  float q = abs(length(p / radii) - 1.0);
  return smoothstep(width, 0.0, q);
}

void main() {
  vec2 uv = vUv;
  vec2 p = (uv * 2.0 - 1.0);
  p.x *= uResolution.x / max(1.0, uResolution.y);
  float t = uTime * uMotion;
  vec2 parallax = (uPointer - .5) * .055;
  vec2 spaceUv = uv + parallax;

  vec3 color = mix(vec3(.006,.012,.035), vec3(.018,.035,.092), clamp(uv.y * 1.15, 0.0, 1.0));
  float nebula = sin((p.x * 1.7 + p.y * .9) * 2.2 + t * .025) * .5 + .5;
  nebula *= exp(-length(p - vec2(.35,.15)) * 1.2);
  color += vec3(.03,.04,.12) * nebula;

  float stars = 0.0;
  for (int i = 0; i < 4; i++) {
    if (i >= uStarLayers) continue;
    float fi = float(i);
    stars += starLayer(spaceUv + fi * .137, 68.0 + fi * 37.0, .968 + fi * .006, t * (.45 + fi * .15)) * (.75 - fi * .11);
  }
  color += vec3(.68,.86,1.0) * stars;

  vec2 planetCenter = vec2(.43, .11) + parallax * .45;
  float radius = .40;
  vec2 q = p - planetCenter;
  float r2 = dot(q, q);
  if (r2 < radius * radius) {
    float z = sqrt(max(0.0, radius * radius - r2));
    vec3 n = normalize(vec3(q, z));
    vec3 lightDir = normalize(vec3(-.75, .42, .9));
    float diffuse = max(dot(n, lightDir), 0.0);
    float rim = pow(1.0 - max(n.z, 0.0), 2.5);
    float bands = sin((n.y * 14.0 + sin(n.x * 8.0 + t * .025) * 1.7) * 2.1);
    float continents = smoothstep(.1, .72, sin(n.x * 13.0 + sin(n.y * 9.0) * 2.3) * sin(n.y * 17.0 - n.x * 3.0));
    vec3 ocean = vec3(.015,.16,.35);
    vec3 land = vec3(.035,.42,.46);
    vec3 planet = mix(ocean, land, continents * .68);
    planet += vec3(.05,.13,.18) * bands * .1;
    planet *= .22 + diffuse * .98;
    planet += vec3(.08,.55,.88) * rim * .72;
    float night = smoothstep(.2, -.28, dot(n, lightDir));
    float cities = step(.83, hash21(floor((n.xy + 1.0) * 78.0))) * continents * night;
    planet += vec3(1.0,.55,.18) * cities * 1.5;
    color = planet;
  } else if (uAtmosphere) {
    float dist = length(q);
    float glow = exp(-abs(dist - radius) * 42.0) * smoothstep(radius + .12, radius, dist);
    color += vec3(.12,.63,1.0) * glow * .9;
  }

  if (uOrbit) {
    vec2 orbitP = q;
    orbitP = mat2(cos(-.28),-sin(-.28),sin(-.28),cos(-.28)) * orbitP;
    float orbit = ellipseLine(orbitP, vec2(.68,.20), .006);
    float maskFront = smoothstep(-.02,.08,q.y);
    color += vec3(.25,.78,1.0) * orbit * (.22 + .46 * maskFront);
    float satAngle = t * .17;
    vec2 sat = vec2(cos(satAngle) * .68, sin(satAngle) * .20);
    sat = mat2(cos(.28),-sin(.28),sin(.28),cos(.28)) * sat;
    float satGlow = smoothstep(.025,0.0,length(q - sat));
    color += vec3(.85,.96,1.0) * satGlow * 2.2;
  }

  float vignette = smoothstep(1.25, .18, length(p * vec2(.62,.82)));
  color *= .52 + .48 * vignette;
  color = pow(color, vec3(.86));
  outColor = vec4(color, 1.0);
}`;

function compile(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`Erro de shader: ${message}`);
  }
  return shader;
}

export class WebGLCosmosRenderer {
  constructor(canvas, settingsStore, bus) {
    this.canvas = canvas;
    this.settingsStore = settingsStore;
    this.bus = bus;
    this.gl = null;
    this.program = null;
    this.running = false;
    this.rafId = 0;
    this.contextLost = false;
    this.pointer = { x: .5, y: .5 };
    this.frames = 0;
    this.fps = 0;
    this.lastFpsUpdate = performance.now();
    this.lastFrame = performance.now();
    this.resizeObserver = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(() => this.resize())
      : { observe() {}, disconnect() {} };
    this.onPointerMove = event => {
      this.pointer.x = event.clientX / Math.max(1, innerWidth);
      this.pointer.y = 1 - event.clientY / Math.max(1, innerHeight);
    };
    this.onContextLost = event => { event.preventDefault(); this.contextLost = true; this.bus.emit('renderer:lost'); };
    this.onContextRestored = () => { this.contextLost = false; this.initialize(); this.bus.emit('renderer:restored'); };
  }

  initialize() {
    const gl = this.canvas.getContext('webgl2', {
      alpha: false, antialias: false, powerPreference: 'high-performance',
      preserveDrawingBuffer: false, failIfMajorPerformanceCaveat: false
    });
    if (!gl) {
      this.bus.emit('renderer:fallback', { reason: 'WebGL2 indisponível' });
      return false;
    }
    this.gl = gl;
    const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    const program = gl.createProgram();
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
    if (this.program) gl.deleteProgram(this.program);
    this.program = program;
    this.uniforms = {
      resolution: gl.getUniformLocation(program, 'uResolution'),
      pointer: gl.getUniformLocation(program, 'uPointer'),
      time: gl.getUniformLocation(program, 'uTime'),
      motion: gl.getUniformLocation(program, 'uMotion'),
      starLayers: gl.getUniformLocation(program, 'uStarLayers'),
      atmosphere: gl.getUniformLocation(program, 'uAtmosphere'),
      orbit: gl.getUniformLocation(program, 'uOrbit')
    };
    this.resize();
    return true;
  }

  start() {
    if (!this.gl && !this.initialize()) return;
    if (this.running) return;
    this.running = true;
    this.resizeObserver.observe(document.documentElement);
    addEventListener('pointermove', this.onPointerMove, { passive:true });
    this.canvas.addEventListener('webglcontextlost', this.onContextLost);
    this.canvas.addEventListener('webglcontextrestored', this.onContextRestored);
    this.rafId = requestAnimationFrame(time => this.frame(time));
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.rafId);
    this.rafId = 0;
    this.resizeObserver.disconnect();
    removeEventListener('pointermove', this.onPointerMove);
    this.canvas.removeEventListener('webglcontextlost', this.onContextLost);
    this.canvas.removeEventListener('webglcontextrestored', this.onContextRestored);
  }

  resize() {
    if (!this.gl) return;
    const profile = this.settingsStore.getProfile();
    const dpr = Math.min(devicePixelRatio || 1, 2) * profile.renderScale;
    const width = Math.max(1, Math.floor(innerWidth * dpr));
    const height = Math.max(1, Math.floor(innerHeight * dpr));
    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width;
      this.canvas.height = height;
      this.canvas.style.width = `${innerWidth}px`;
      this.canvas.style.height = `${innerHeight}px`;
      this.gl.viewport(0, 0, width, height);
    }
  }

  destroy() {
    this.stop();
    if (this.gl && this.program) this.gl.deleteProgram(this.program);
    this.program = null;
    this.gl = null;
  }

  frame(time) {
    if (!this.running) return;
    if (!this.contextLost && this.gl && this.program) {
      this.resize();
      const gl = this.gl;
      const settings = this.settingsStore.get();
      const profile = this.settingsStore.getProfile();
      gl.useProgram(this.program);
      gl.uniform2f(this.uniforms.resolution, this.canvas.width, this.canvas.height);
      gl.uniform2f(this.uniforms.pointer, this.pointer.x, this.pointer.y);
      gl.uniform1f(this.uniforms.time, time * .001);
      gl.uniform1f(this.uniforms.motion, settings.reducedMotion ? .12 : profile.motionFactor);
      gl.uniform1i(this.uniforms.starLayers, profile.starLayers);
      gl.uniform1i(this.uniforms.atmosphere, profile.atmosphere ? 1 : 0);
      gl.uniform1i(this.uniforms.orbit, profile.orbitalLines ? 1 : 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    this.frames++;
    if (time - this.lastFpsUpdate >= 750) {
      this.fps = Math.round((this.frames * 1000) / (time - this.lastFpsUpdate));
      this.frames = 0;
      this.lastFpsUpdate = time;
      this.bus.emit('performance:fps', this.fps);
    }
    this.lastFrame = time;
    this.rafId = requestAnimationFrame(next => this.frame(next));
  }
}
