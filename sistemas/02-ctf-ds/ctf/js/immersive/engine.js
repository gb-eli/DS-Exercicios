import { recommendQualityFromDiagnostics } from '../core/device-diagnostics.js';
const DEG = Math.PI / 180;

export const QUALITY_PRESETS = Object.freeze({
  low: { label: 'Baixo', pixelRatio: 0.65, maxObjects: 44, particles: 28, targetFps: 30, postFx: false },
  medium: { label: 'Médio', pixelRatio: 0.9, maxObjects: 72, particles: 60, targetFps: 45, postFx: true },
  high: { label: 'Alto', pixelRatio: 1.2, maxObjects: 110, particles: 110, targetFps: 60, postFx: true },
  ultra: { label: 'Ultra', pixelRatio: 1.55, maxObjects: 160, particles: 180, targetFps: 60, postFx: true },
});

export const detectWebGLSupport = () => {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2', { failIfMajorPerformanceCaveat: true }) || canvas.getContext('webgl', { failIfMajorPerformanceCaveat: true });
    return Boolean(gl);
  } catch {
    return false;
  }
};

export const chooseAutoQuality = () => {
  const stored = typeof document !== 'undefined' ? document.documentElement.dataset.autoQuality : '';
  if (QUALITY_PRESETS[stored]) return stored;
  return recommendQualityFromDiagnostics({
    hardware: { memoryGb: Number(navigator.deviceMemory || 4), cores: Number(navigator.hardwareConcurrency || 4) },
    viewport: { mobile: matchMedia('(max-width: 760px)').matches },
    preferences: { reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches },
    network: { saveData: Boolean(navigator.connection?.saveData) },
    support: { webgl: true },
    benchmark: { score: 0 },
  });
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const mix = (a, b, t) => a + (b - a) * t;
const color = (hex) => {
  const value = hex.replace('#', '');
  const full = value.length === 3 ? value.split('').map((part) => part + part).join('') : value;
  return [parseInt(full.slice(0, 2), 16) / 255, parseInt(full.slice(2, 4), 16) / 255, parseInt(full.slice(4, 6), 16) / 255];
};

const mat4 = {
  identity: () => new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]),
  multiply(a, b) {
    const out = new Float32Array(16);
    for (let row = 0; row < 4; row += 1) {
      for (let col = 0; col < 4; col += 1) {
        let sum = 0;
        for (let i = 0; i < 4; i += 1) sum += a[i * 4 + row] * b[col * 4 + i];
        out[col * 4 + row] = sum;
      }
    }
    return out;
  },
  perspective(fov, aspect, near, far) {
    const f = 1 / Math.tan(fov / 2);
    const nf = 1 / (near - far);
    return new Float32Array([f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) * nf, -1, 0, 0, 2 * far * near * nf, 0]);
  },
  lookAt(eye, target, up = [0, 1, 0]) {
    const z = normalize([eye[0] - target[0], eye[1] - target[1], eye[2] - target[2]]);
    const x = normalize(cross(up, z));
    const y = cross(z, x);
    return new Float32Array([
      x[0], y[0], z[0], 0,
      x[1], y[1], z[1], 0,
      x[2], y[2], z[2], 0,
      -dot(x, eye), -dot(y, eye), -dot(z, eye), 1,
    ]);
  },
  model(position, rotation, scale) {
    const [sx, sy, sz] = scale;
    const [rx, ry, rz] = rotation;
    const cx = Math.cos(rx); const sxr = Math.sin(rx);
    const cy = Math.cos(ry); const syr = Math.sin(ry);
    const cz = Math.cos(rz); const szr = Math.sin(rz);
    const m00 = cy * cz; const m01 = sxr * syr * cz - cx * szr; const m02 = cx * syr * cz + sxr * szr;
    const m10 = cy * szr; const m11 = sxr * syr * szr + cx * cz; const m12 = cx * syr * szr - sxr * cz;
    const m20 = -syr; const m21 = sxr * cy; const m22 = cx * cy;
    return new Float32Array([
      m00 * sx, m01 * sx, m02 * sx, 0,
      m10 * sy, m11 * sy, m12 * sy, 0,
      m20 * sz, m21 * sz, m22 * sz, 0,
      position[0], position[1], position[2], 1,
    ]);
  },
};

const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const normalize = (v) => {
  const length = Math.hypot(...v) || 1;
  return v.map((item) => item / length);
};

const cubeGeometry = () => {
  const vertices = new Float32Array([
    -1,-1, 1, 0,0,1,  1,-1, 1, 0,0,1,  1, 1, 1, 0,0,1, -1, 1, 1, 0,0,1,
     1,-1,-1, 0,0,-1, -1,-1,-1,0,0,-1, -1,1,-1,0,0,-1, 1,1,-1,0,0,-1,
    -1,-1,-1,-1,0,0, -1,-1,1,-1,0,0, -1,1,1,-1,0,0, -1,1,-1,-1,0,0,
     1,-1,1,1,0,0, 1,-1,-1,1,0,0, 1,1,-1,1,0,0, 1,1,1,1,0,0,
    -1,1,1,0,1,0, 1,1,1,0,1,0, 1,1,-1,0,1,0, -1,1,-1,0,1,0,
    -1,-1,-1,0,-1,0, 1,-1,-1,0,-1,0, 1,-1,1,0,-1,0, -1,-1,1,0,-1,0,
  ]);
  const indices = new Uint16Array([
    0,1,2,0,2,3, 4,5,6,4,6,7, 8,9,10,8,10,11,
    12,13,14,12,14,15, 16,17,18,16,18,19, 20,21,22,20,22,23,
  ]);
  return { vertices, indices };
};

const sphereGeometry = (segments = 18, rings = 12) => {
  const vertices = [];
  const indices = [];
  for (let y = 0; y <= rings; y += 1) {
    const v = y / rings;
    const phi = v * Math.PI;
    for (let x = 0; x <= segments; x += 1) {
      const u = x / segments;
      const theta = u * Math.PI * 2;
      const px = Math.sin(phi) * Math.cos(theta);
      const py = Math.cos(phi);
      const pz = Math.sin(phi) * Math.sin(theta);
      vertices.push(px, py, pz, px, py, pz);
    }
  }
  for (let y = 0; y < rings; y += 1) {
    for (let x = 0; x < segments; x += 1) {
      const a = y * (segments + 1) + x;
      const b = a + segments + 1;
      indices.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }
  return { vertices: new Float32Array(vertices), indices: new Uint16Array(indices) };
};

const createShader = (gl, type, source) => {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader) || 'Falha ao compilar shader.');
  return shader;
};

const createProgram = (gl) => {
  const vertex = createShader(gl, gl.VERTEX_SHADER, `
    attribute vec3 aPosition;
    attribute vec3 aNormal;
    uniform mat4 uModel;
    uniform mat4 uViewProjection;
    uniform float uTime;
    uniform float uPulse;
    varying vec3 vNormal;
    varying vec3 vWorld;
    varying float vPulse;
    void main(){
      vec4 world = uModel * vec4(aPosition, 1.0);
      vWorld = world.xyz;
      vNormal = normalize(mat3(uModel) * aNormal);
      vPulse = uPulse;
      gl_Position = uViewProjection * world;
    }
  `);
  const fragment = createShader(gl, gl.FRAGMENT_SHADER, `
    precision mediump float;
    uniform vec3 uColor;
    uniform vec3 uEmissive;
    uniform vec3 uCamera;
    uniform float uTime;
    uniform float uFog;
    uniform float uIncident;
    uniform float uContainment;
    uniform float uRecovery;
    varying vec3 vNormal;
    varying vec3 vWorld;
    varying float vPulse;
    void main(){
      vec3 lightDir = normalize(vec3(-0.4, 0.8, 0.45));
      float diffuse = max(dot(normalize(vNormal), lightDir), 0.0);
      float rim = pow(1.0 - max(dot(normalize(uCamera - vWorld), normalize(vNormal)), 0.0), 2.0);
      float pulse = 0.5 + 0.5 * sin(uTime * 2.2 + vWorld.y * 2.0);
      float scanline = 0.5 + 0.5 * sin(vWorld.y * 18.0 - uTime * 5.5 + vWorld.x * 0.8);
      vec3 base = uColor * (0.22 + diffuse * 0.74) + uEmissive * (0.42 + pulse * vPulse) + rim * vec3(0.07,0.24,0.34);
      base += vPulse * scanline * vec3(0.015,0.07,0.09);
      base += uIncident * vec3(0.22, 0.012, 0.008) * (0.45 + pulse * 0.75);
      base += uContainment * vec3(0.01, 0.14, 0.075) * (0.35 + pulse * 0.65);
      base += uRecovery * vec3(0.025, 0.11, 0.17) * (0.4 + rim);
      float distanceToCamera = length(uCamera - vWorld);
      float fogAmount = clamp((distanceToCamera - 8.0) / 34.0, 0.0, 1.0) * uFog;
      vec3 fogColor = mix(vec3(0.005,0.012,0.024), vec3(0.012,0.03,0.055), pulse * 0.15);
      gl_FragColor = vec4(mix(base, fogColor, fogAmount), 1.0);
    }
  `);
  const program = gl.createProgram();
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) || 'Falha ao ligar shader.');
  return program;
};

const createParticleProgram = (gl) => {
  const vertex = createShader(gl, gl.VERTEX_SHADER, `
    attribute vec3 aPosition;
    attribute float aSeed;
    uniform mat4 uViewProjection;
    uniform float uTime;
    uniform float uSize;
    uniform float uIncident;
    varying float vAlpha;
    void main(){
      vec3 p = aPosition;
      p.y += sin(uTime * (0.4 + aSeed * 0.8) + aSeed * 9.0) * 0.3;
      p.x += cos(uTime * 0.25 + aSeed * 7.0) * 0.12;
      gl_Position = uViewProjection * vec4(p, 1.0);
      gl_PointSize = uSize * (1.0 + uIncident * 0.45);
      vAlpha = 0.35 + fract(aSeed * 13.37) * 0.65;
    }
  `);
  const fragment = createShader(gl, gl.FRAGMENT_SHADER, `
    precision mediump float;
    uniform vec3 uColor;
    uniform float uIncident;
    varying float vAlpha;
    void main(){
      vec2 p = gl_PointCoord - 0.5;
      float d = length(p);
      if(d > 0.5) discard;
      float glow = smoothstep(0.5, 0.0, d);
      vec3 color = mix(uColor, vec3(1.0,0.18,0.06), uIncident);
      gl_FragColor = vec4(color, glow * vAlpha);
    }
  `);
  const program = gl.createProgram();
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) || 'Falha no shader de partículas.');
  return program;
};

const createMesh = (gl, geometry) => {
  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, geometry.vertices, gl.STATIC_DRAW);
  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, geometry.indices, gl.STATIC_DRAW);
  return { vertexBuffer, indexBuffer, count: geometry.indices.length };
};

const box = (position, scale, hex, options = {}) => ({
  mesh: 'cube', position, scale, rotation: options.rotation || [0, 0, 0], color: color(hex), emissive: color(options.emissive || '#000000'), pulse: options.pulse || 0, tag: options.tag || '', phase: options.phase || 'always', spin: options.spin || 0,
});
const sphere = (position, scale, hex, options = {}) => ({ ...box(position, scale, hex, options), mesh: 'sphere' });

const gridObjects = (size = 14, y = -1.5, hex = '#102844') => {
  const objects = [];
  for (let i = -size; i <= size; i += 2) {
    objects.push(box([i, y, 0], [0.018, 0.018, size], hex, { emissive: '#072038' }));
    objects.push(box([0, y, i], [size, 0.018, 0.018], hex, { emissive: '#072038' }));
  }
  return objects;
};

const buildServerRoom = () => {
  const objects = [...gridObjects(15, -1.55, '#123454')];
  objects.push(box([0, 5.2, 0], [15, 0.12, 15], '#071221'));
  for (const side of [-1, 1]) {
    for (let row = 0; row < 5; row += 1) {
      const z = -9 + row * 4.5;
      objects.push(box([side * 6.2, 1.2, z], [2.2, 2.7, 1.25], '#18293b', { emissive: '#071421', tag: `rack-${side}-${row}` }));
      for (let led = 0; led < 7; led += 1) {
        objects.push(box([side * 4.92, 0.1 + led * 0.42, z - 0.55], [0.035, 0.07, 0.12], led % 4 === 0 ? '#ffc15d' : '#4bffe1', { emissive: led % 4 === 0 ? '#ff6b1a' : '#1ad8ff', pulse: 0.8, phase: 'status' }));
      }
    }
  }
  objects.push(box([0, 0.5, -12], [3.4, 1.8, 0.3], '#132d48', { emissive: '#0b84a8', pulse: 0.35 }));
  objects.push(box([0, 0.65, 11], [2.3, 1.5, 0.35], '#10253c', { emissive: '#1cb6ff', pulse: 0.5, phase: 'scan' }));
  return { objects, camera: { yaw: 0, pitch: -0.08, distance: 16, target: [0, 1, 0] }, particleColor: '#41e8ff', label: 'Sala de servidores' };
};

const buildSoc = () => {
  const objects = [...gridObjects(14, -1.4, '#112b48')];
  objects.push(box([0, 2.7, -8.5], [9.5, 3.8, 0.25], '#0a182b', { emissive: '#09344d' }));
  for (let x = -7.2; x <= 7.2; x += 2.4) {
    objects.push(box([x, 2.8, -8.15], [1.02, 1.05, 0.08], '#0b2b42', { emissive: x === 0 ? '#ff3d55' : '#1cd7ff', pulse: 0.75, phase: x === 0 ? 'incident' : 'status' }));
  }
  for (let row = 0; row < 3; row += 1) {
    for (let col = -2; col <= 2; col += 1) {
      objects.push(box([col * 3.1, -0.35, row * 3.2 - 1], [1.25, 0.08, 0.7], '#203348', { emissive: '#09263a' }));
      objects.push(box([col * 3.1, 0.45, row * 3.2 - 1.5], [0.95, 0.65, 0.08], '#11283c', { emissive: '#18c7f3', pulse: 0.3 }));
    }
  }
  objects.push(sphere([0, 4.8, 0], [0.55, 0.55, 0.55], '#255577', { emissive: '#31dbff', pulse: 0.8, spin: 0.2 }));
  return { objects, camera: { yaw: 0.1, pitch: -0.12, distance: 17, target: [0, 1.2, -1] }, particleColor: '#48d9ff', label: 'Centro de operações' };
};

const linkBetween = (a, b, hex, options = {}) => {
  const dx = b[0] - a[0]; const dy = b[1] - a[1]; const dz = b[2] - a[2];
  const length = Math.hypot(dx, dy, dz);
  const position = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2];
  const yaw = Math.atan2(dx, dz);
  const pitch = -Math.atan2(dy, Math.hypot(dx, dz));
  return box(position, [0.035, 0.035, length / 2], hex, { ...options, rotation: [pitch, yaw, 0] });
};

const buildNetwork = () => {
  const objects = [...gridObjects(16, -2.1, '#0d2640')];
  const nodes = [
    { p: [0, 1.2, 0], s: 1.05, c: '#6cecff', e: '#28cfff' },
    { p: [-7, 0.2, -5], s: 0.78, c: '#32b7ff', e: '#188cf0' },
    { p: [7, 0.5, -5], s: 0.82, c: '#32d2a2', e: '#18ffb1' },
    { p: [-8, -0.2, 5], s: 0.72, c: '#ffbf5a', e: '#ff7a18' },
    { p: [7.8, 0.1, 5.5], s: 0.78, c: '#ff496c', e: '#ff1538' },
    { p: [0, 4.8, -2], s: 0.62, c: '#927cff', e: '#704bff' },
  ];
  nodes.forEach((node, index) => objects.push(sphere(node.p, [node.s, node.s, node.s], node.c, { emissive: node.e, pulse: index === 4 ? 1 : 0.55, phase: index === 4 ? 'incident' : 'status', spin: 0.15 })));
  nodes.slice(1).forEach((node, index) => objects.push(linkBetween(nodes[0].p, node.p, index === 3 ? '#ff3152' : '#1fc8f3', { emissive: index === 3 ? '#ff1538' : '#0b7ea8', pulse: 0.7, phase: index === 3 ? 'incident' : 'scan' })));
  return { objects, camera: { yaw: 0.35, pitch: -0.28, distance: 19, target: [0, 0.5, 0] }, particleColor: '#39e1ff', label: 'Topologia tridimensional' };
};

const buildSatellite = () => {
  const objects = [];
  objects.push(sphere([0, 0, 0], [4.7, 4.7, 4.7], '#0d4d77', { emissive: '#08325d', pulse: 0.18, spin: 0.035 }));
  objects.push(sphere([0, 0, 0], [4.9, 4.9, 4.9], '#0a1b2c', { emissive: '#045279', pulse: 0.12 }));
  const satellitePositions = [[8, 3, 1], [-7, 4, -2], [2, -2, 9]];
  satellitePositions.forEach((p, index) => {
    objects.push(box(p, [0.7, 0.45, 0.6], '#c8d9e8', { emissive: index === 1 ? '#ff3d4f' : '#52dcff', pulse: 0.6, phase: index === 1 ? 'incident' : 'status', spin: 0.16 }));
    objects.push(box([p[0] - 1.45, p[1], p[2]], [0.7, 0.06, 0.55], '#194c78', { emissive: '#0d8ed4' }));
    objects.push(box([p[0] + 1.45, p[1], p[2]], [0.7, 0.06, 0.55], '#194c78', { emissive: '#0d8ed4' }));
    objects.push(linkBetween([0, 0, 0], p, index === 1 ? '#ff334f' : '#32d8ff', { emissive: index === 1 ? '#ff1538' : '#0d8ed4', pulse: 0.65, phase: index === 1 ? 'incident' : 'scan' }));
  });
  objects.push(box([0, -6.5, 0], [2.4, 0.25, 2.4], '#203449', { emissive: '#16b5df', pulse: 0.5 }));
  return { objects, camera: { yaw: -0.45, pitch: -0.12, distance: 22, target: [0, 0, 0] }, particleColor: '#7edfff', label: 'Central orbital fictícia' };
};

const buildIncident = () => {
  const objects = [...gridObjects(15, -1.8, '#16283c')];
  const accounts = [[-7, 0, -5], [-3.5, 2.5, -1], [0, 0.4, 3], [4.5, 2, -1.5], [8, 0, 5]];
  accounts.forEach((p, index) => objects.push(box(p, [1.15, 0.75, 0.2], index === 4 ? '#ff405d' : '#1f6381', { emissive: index === 4 ? '#ff1538' : '#1ad8ff', pulse: 0.75, phase: index === 4 ? 'incident' : 'status' })));
  for (let index = 0; index < accounts.length - 1; index += 1) objects.push(linkBetween(accounts[index], accounts[index + 1], '#ff3558', { emissive: '#ff1538', pulse: 0.95, phase: 'incident' }));
  objects.push(sphere([0, 5.5, 0], [1.2, 1.2, 1.2], '#f7c251', { emissive: '#ff7d1a', pulse: 0.9, phase: 'scan', spin: 0.2 }));
  return { objects, camera: { yaw: -0.2, pitch: -0.22, distance: 20, target: [0, 0.8, 0] }, particleColor: '#ff5b78', label: 'Incidente financeiro fictício' };
};


const buildApplicationLab = () => {
  const objects = [...gridObjects(15, -1.8, '#10233a')];
  const layers = [
    { p: [-8, 0.2, 0], c: '#2ec8ff', e: '#0876a8', tag: 'input' },
    { p: [-4, 1.3, 0], c: '#62e7c5', e: '#14a67e', tag: 'validation' },
    { p: [0, 2.1, 0], c: '#ffd166', e: '#ff8c1a', tag: 'authorization' },
    { p: [4, 1.3, 0], c: '#b79cff', e: '#6f4bff', tag: 'query' },
    { p: [8, 0.2, 0], c: '#59e3ff', e: '#0c8fd1', tag: 'output' },
  ];
  layers.forEach((layer, index) => {
    objects.push(box(layer.p, [1.25, 1.05, 0.32], layer.c, { emissive: layer.e, pulse: 0.55, tag: layer.tag, phase: index === 0 ? 'incident' : 'status' }));
    if (index < layers.length - 1) objects.push(linkBetween(layer.p, layers[index + 1].p, index === 0 ? '#ff405f' : '#36d9ff', { emissive: index === 0 ? '#ff1538' : '#0b7fa8', pulse: 0.7, phase: index === 0 ? 'incident' : 'scan' }));
  });
  for (let row = 0; row < 3; row += 1) {
    objects.push(box([0, -0.7, -7 + row * 5.2], [6.8, 0.08, 0.6], '#152b42', { emissive: '#0a3048' }));
    objects.push(box([0, 0.25, -7 + row * 5.2], [2.2, 0.95, 0.1], '#0d263c', { emissive: row === 1 ? '#ff2f55' : '#23cff6', pulse: 0.45, phase: row === 1 ? 'incident' : 'status' }));
  }
  return { objects, camera: { yaw: 0.15, pitch: -0.18, distance: 19, target: [0, 0.7, 0] }, particleColor: '#4ee4ff', label: 'Laboratório de aplicações' };
};

const buildForensicVault = () => {
  const objects = [...gridObjects(14, -1.7, '#14283d')];
  for (let shelf = -2; shelf <= 2; shelf += 1) {
    objects.push(box([shelf * 3.4, 1.2, -7.5], [1.35, 2.7, 0.55], '#172d42', { emissive: '#0b2235' }));
    for (let slot = 0; slot < 5; slot += 1) {
      objects.push(box([shelf * 3.4, -0.55 + slot * 0.85, -6.9], [0.72, 0.22, 0.12], slot === 2 && shelf === 1 ? '#ff4968' : '#56d9ff', { emissive: slot === 2 && shelf === 1 ? '#ff1538' : '#168eb9', pulse: 0.55, phase: slot === 2 && shelf === 1 ? 'incident' : 'status' }));
    }
  }
  const evidenceNodes = [[-7,0,3],[0,1.4,2.5],[7,0,3],[-3.5,3.5,6],[4,3.1,6]];
  evidenceNodes.forEach((p,index)=>{
    objects.push(sphere(p,[0.72,0.72,0.72],index===3?'#ffbf5d':'#6ae4ff',{emissive:index===3?'#ff7a18':'#1dbde8',pulse:0.7,phase:index===3?'incident':'status',spin:0.12}));
    if(index>0) objects.push(linkBetween(evidenceNodes[0],p,index===3?'#ff405f':'#30d7ff',{emissive:index===3?'#ff1538':'#0d8eb5',pulse:0.55,phase:index===3?'incident':'scan'}));
  });
  return { objects, camera: { yaw: -0.12, pitch: -0.16, distance: 18, target: [0, 1, 0] }, particleColor: '#78e6ff', label: 'Cofre forense' };
};

const buildMobileLab = () => {
  const objects = [...gridObjects(13, -1.9, '#10283d')];
  const phones = [[-6,1,0],[0,1.8,-2],[6,1,0]];
  phones.forEach((p,index)=>{
    objects.push(box(p,[1.4,2.5,0.24],index===1?'#ff4f6d':'#1f6383',{emissive:index===1?'#ff1538':'#24cfff',pulse:0.65,phase:index===1?'incident':'status'}));
    for(let app=0; app<6; app+=1){
      const x=p[0]-0.75+(app%3)*0.75;
      const y=p[1]+0.9-Math.floor(app/3)*0.9;
      objects.push(box([x,y,p[2]+0.3],[0.22,0.22,0.05],app===4&&index===1?'#ffbf5a':'#65e3ff',{emissive:app===4&&index===1?'#ff7a18':'#0f91bb',pulse:0.45,phase:app===4&&index===1?'incident':'scan'}));
    }
  });
  objects.push(sphere([0,5.2,4.5],[1.05,1.05,1.05],'#7d66ff',{emissive:'#5233ff',pulse:0.7,spin:0.18}));
  phones.forEach((p,index)=>objects.push(linkBetween([0,5.2,4.5],p,index===1?'#ff3f60':'#32dbff',{emissive:index===1?'#ff1538':'#0e8fb9',pulse:0.62,phase:index===1?'incident':'scan'})));
  return { objects, camera: { yaw: 0.28, pitch: -0.2, distance: 18, target: [0, 1.1, 0] }, particleColor: '#5fe1ff', label: 'Centro mobile' };
};

const buildScene = (sceneId) => {
  if (sceneId === 'soc-center') return buildSoc();
  if (sceneId === 'network-map') return buildNetwork();
  if (sceneId === 'satellite-station') return buildSatellite();
  if (sceneId === 'incident-response') return buildIncident();
  if (sceneId === 'application-lab') return buildApplicationLab();
  if (sceneId === 'forensic-vault') return buildForensicVault();
  if (sceneId === 'mobile-lab') return buildMobileLab();
  return buildServerRoom();
};

const createParticleData = (count, sceneId) => {
  const data = new Float32Array(count * 4);
  for (let index = 0; index < count; index += 1) {
    const angle = index * 2.399963;
    const radius = 3 + (index % 19) * 0.62;
    let x = Math.cos(angle) * radius;
    let y = ((index * 7) % 31) / 31 * 10 - 3;
    let z = Math.sin(angle) * radius;
    if (sceneId === 'server-room') { x = (index % 2 ? -1 : 1) * (5 + (index % 5) * 0.18); z = ((index * 11) % 41) - 20; }
    if (sceneId === 'soc-center') { x *= 0.65; z *= 0.65; y = ((index * 5) % 23) / 23 * 7 - 1; }
    if (sceneId === 'incident-response') { x *= 0.8; z *= 0.8; y *= 0.55; }
    if (sceneId === 'application-lab') { x *= 0.9; z *= 0.55; y = ((index * 9) % 29) / 29 * 8 - 2; }
    if (sceneId === 'forensic-vault') { x *= 0.75; z *= 0.8; y = ((index * 13) % 37) / 37 * 9 - 2; }
    if (sceneId === 'mobile-lab') { x *= 0.7; z *= 0.65; y = ((index * 11) % 31) / 31 * 8 - 1; }
    data[index * 4] = x; data[index * 4 + 1] = y; data[index * 4 + 2] = z; data[index * 4 + 3] = (index * 0.618033) % 1;
  }
  return data;
};

export class ImmersiveRuntime {
  constructor(canvas, { sceneId = 'server-room', quality = 'auto', onStatus = () => {}, onMetrics = () => {}, onContextLost = () => {} } = {}) {
    this.canvas = canvas;
    this.sceneId = sceneId;
    this.requestedQuality = quality;
    this.qualityId = quality === 'auto' ? chooseAutoQuality() : (QUALITY_PRESETS[quality] ? quality : 'medium');
    this.quality = QUALITY_PRESETS[this.qualityId];
    this.autoManaged = quality === 'auto';
    this.dynamicScale = 1;
    this.lowFpsStrikes = 0;
    this.highFpsStrikes = 0;
    this.suspended = typeof document !== 'undefined' ? document.hidden : false;
    this.visibilityRatio = 1;
    this.onStatus = onStatus;
    this.onMetrics = onMetrics;
    this.onContextLost = onContextLost;
    this.scene = buildScene(sceneId);
    this.camera = { ...this.scene.camera };
    this.mode = 'scan';
    this.incident = 0;
    this.containment = 0;
    this.recovery = 0;
    this.running = false;
    this.dragging = false;
    this.lastPointer = [0, 0];
    this.frame = 0;
    this.lastFrame = performance.now();
    this.fpsWindow = [];
    this.bound = [];
    this.observer = null;
    this.init();
  }

  init() {
    const gl = this.canvas.getContext('webgl2', { antialias: this.qualityId !== 'low', alpha: false, powerPreference: this.qualityId === 'low' ? 'low-power' : 'high-performance' }) || this.canvas.getContext('webgl', { antialias: this.qualityId !== 'low', alpha: false, powerPreference: 'default' });
    if (!gl) throw new Error('WebGL não está disponível neste dispositivo.');
    this.gl = gl;
    this.program = createProgram(gl);
    this.particleProgram = createParticleProgram(gl);
    this.meshes = { cube: createMesh(gl, cubeGeometry()), sphere: createMesh(gl, sphereGeometry(this.qualityId === 'low' ? 10 : 18, this.qualityId === 'low' ? 7 : 12)) };
    this.locations = {
      position: gl.getAttribLocation(this.program, 'aPosition'), normal: gl.getAttribLocation(this.program, 'aNormal'),
      model: gl.getUniformLocation(this.program, 'uModel'), viewProjection: gl.getUniformLocation(this.program, 'uViewProjection'), color: gl.getUniformLocation(this.program, 'uColor'), emissive: gl.getUniformLocation(this.program, 'uEmissive'), camera: gl.getUniformLocation(this.program, 'uCamera'), time: gl.getUniformLocation(this.program, 'uTime'), pulse: gl.getUniformLocation(this.program, 'uPulse'), fog: gl.getUniformLocation(this.program, 'uFog'), incident: gl.getUniformLocation(this.program, 'uIncident'), containment: gl.getUniformLocation(this.program, 'uContainment'), recovery: gl.getUniformLocation(this.program, 'uRecovery'),
    };
    this.particleLocations = {
      position: gl.getAttribLocation(this.particleProgram, 'aPosition'), seed: gl.getAttribLocation(this.particleProgram, 'aSeed'), viewProjection: gl.getUniformLocation(this.particleProgram, 'uViewProjection'), time: gl.getUniformLocation(this.particleProgram, 'uTime'), size: gl.getUniformLocation(this.particleProgram, 'uSize'), color: gl.getUniformLocation(this.particleProgram, 'uColor'), incident: gl.getUniformLocation(this.particleProgram, 'uIncident'),
    };
    const particles = createParticleData(this.quality.particles, this.sceneId);
    this.particleCount = this.quality.particles;
    this.particleBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.particleBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, particles, gl.STATIC_DRAW);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    gl.clearColor(0.003, 0.008, 0.016, 1);
    this.bindControls();
    this.resize();
    this.running = true;
    this.onStatus(`WebGL ativo · preset ${this.quality.label}`);
    requestAnimationFrame((time) => this.render(time));
  }

  bind(target, event, handler, options) {
    target.addEventListener(event, handler, options);
    this.bound.push(() => target.removeEventListener(event, handler, options));
  }

  bindControls() {
    this.bind(this.canvas, 'pointerdown', (event) => { this.dragging = true; this.lastPointer = [event.clientX, event.clientY]; this.canvas.setPointerCapture?.(event.pointerId); });
    this.bind(this.canvas, 'pointermove', (event) => {
      if (!this.dragging) return;
      const dx = event.clientX - this.lastPointer[0]; const dy = event.clientY - this.lastPointer[1];
      this.camera.yaw -= dx * 0.006;
      this.camera.pitch = clamp(this.camera.pitch - dy * 0.005, -1.25, 1.1);
      this.lastPointer = [event.clientX, event.clientY];
    });
    this.bind(this.canvas, 'pointerup', () => { this.dragging = false; });
    this.bind(this.canvas, 'pointercancel', () => { this.dragging = false; });
    this.bind(this.canvas, 'wheel', (event) => { event.preventDefault(); this.camera.distance = clamp(this.camera.distance + event.deltaY * 0.012, 6, 32); }, { passive: false });
    this.bind(this.canvas, 'keydown', (event) => {
      const step = event.shiftKey ? 0.18 : 0.08;
      if (['ArrowLeft', 'a', 'A'].includes(event.key)) this.camera.yaw += step;
      if (['ArrowRight', 'd', 'D'].includes(event.key)) this.camera.yaw -= step;
      if (['ArrowUp', 'w', 'W'].includes(event.key)) this.camera.pitch = clamp(this.camera.pitch + step, -1.25, 1.1);
      if (['ArrowDown', 's', 'S'].includes(event.key)) this.camera.pitch = clamp(this.camera.pitch - step, -1.25, 1.1);
      if (event.key === '+' || event.key === '=') this.camera.distance = clamp(this.camera.distance - 1, 6, 32);
      if (event.key === '-') this.camera.distance = clamp(this.camera.distance + 1, 6, 32);
    });
    this.bind(window, 'resize', () => this.resize());
    this.bind(document, 'visibilitychange', () => { this.suspended = document.hidden; if (!this.suspended) this.lastFrame = performance.now(); });
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver((entries) => {
        this.visibilityRatio = entries[0]?.intersectionRatio || 0;
        if (this.visibilityRatio > 0) this.lastFrame = performance.now();
      }, { threshold: [0, 0.05, 0.25] });
      this.observer.observe(this.canvas);
    }
    this.bind(this.canvas, 'webglcontextlost', (event) => { event.preventDefault(); this.running = false; this.onStatus('Contexto WebGL interrompido. O fallback 2D foi ativado para preservar a atividade.'); this.onContextLost?.(); });
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, this.quality.pixelRatio * this.dynamicScale);
    const width = Math.max(320, Math.floor(rect.width * dpr));
    const height = Math.max(220, Math.floor(rect.height * dpr));
    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width; this.canvas.height = height;
      this.gl.viewport(0, 0, width, height);
    }
  }

  setAction(action = 'scan') {
    this.mode = action;
    if (action === 'attack') { this.incident = 1; this.containment = 0; this.recovery = 0; }
    if (action === 'contain') { this.incident = 0.58; this.containment = 1; this.recovery = 0; }
    if (action === 'recover') { this.incident = 0; this.containment = 0.35; this.recovery = 1; }
    if (action === 'scan') { this.incident = 0; this.containment = 0; this.recovery = 0; }
    this.onStatus(this.actionReport(action));
  }

  actionReport(action) {
    const labels = {
      scan: 'Varredura visual ativada; objetos e fluxos relevantes estão destacados.',
      attack: 'Incidente fictício em andamento; alertas, partículas e enlaces mudaram para estado crítico.',
      contain: 'Contenção educativa aplicada; o fluxo anômalo foi reduzido e as evidências foram preservadas.',
      recover: 'Recuperação simulada concluída; serviços e comunicações retornaram ao estado estável.',
    };
    return labels[action] || labels.scan;
  }

  resetCamera() { Object.assign(this.camera, this.scene.camera); }

  cameraPosition() {
    const cp = Math.cos(this.camera.pitch);
    return [
      this.camera.target[0] + Math.sin(this.camera.yaw) * cp * this.camera.distance,
      this.camera.target[1] + Math.sin(this.camera.pitch) * this.camera.distance,
      this.camera.target[2] + Math.cos(this.camera.yaw) * cp * this.camera.distance,
    ];
  }

  visibleObjects(time) {
    const max = Math.max(24, Math.floor(this.quality.maxObjects * (this.autoManaged ? Math.max(0.62, this.dynamicScale) : 1)));
    return this.scene.objects.filter((object) => {
      if (object.phase === 'incident') return this.incident > 0.08;
      if (object.phase === 'scan') return this.mode === 'scan' || this.recovery > 0.2;
      return true;
    }).slice(0, max).map((object, index) => ({
      ...object,
      rotation: [object.rotation[0], object.rotation[1] + (object.spin || 0) * time + (index % 3) * 0.003, object.rotation[2]],
    }));
  }

  render(timeMs) {
    if (!this.running) return;
    if (this.suspended || this.visibilityRatio <= 0) { this.lastFrame = timeMs; requestAnimationFrame((time) => this.render(time)); return; }
    const interval = 1000 / this.quality.targetFps;
    if (timeMs - this.lastFrame < interval * 0.82) { requestAnimationFrame((time) => this.render(time)); return; }
    const delta = Math.max(1, timeMs - this.lastFrame);
    this.lastFrame = timeMs;
    this.frame += 1;
    const time = timeMs / 1000;
    const gl = this.gl;
    this.resize();
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    const camera = this.cameraPosition();
    const projection = mat4.perspective(56 * DEG, this.canvas.width / this.canvas.height, 0.1, 80);
    const view = mat4.lookAt(camera, this.camera.target);
    const viewProjection = mat4.multiply(projection, view);
    gl.useProgram(this.program);
    gl.uniformMatrix4fv(this.locations.viewProjection, false, viewProjection);
    gl.uniform3fv(this.locations.camera, camera);
    gl.uniform1f(this.locations.time, time);
    gl.uniform1f(this.locations.fog, this.quality.postFx ? 0.82 : 0.45);
    gl.uniform1f(this.locations.incident, this.incident);
    gl.uniform1f(this.locations.containment, this.containment);
    gl.uniform1f(this.locations.recovery, this.recovery);
    const objects = this.visibleObjects(time);
    let drawCalls = 0;
    for (const object of objects) {
      const mesh = this.meshes[object.mesh] || this.meshes.cube;
      gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vertexBuffer);
      gl.enableVertexAttribArray(this.locations.position);
      gl.vertexAttribPointer(this.locations.position, 3, gl.FLOAT, false, 24, 0);
      gl.enableVertexAttribArray(this.locations.normal);
      gl.vertexAttribPointer(this.locations.normal, 3, gl.FLOAT, false, 24, 12);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.indexBuffer);
      const model = mat4.model(object.position, object.rotation, object.scale);
      gl.uniformMatrix4fv(this.locations.model, false, model);
      let objectColor = object.color;
      let emissive = object.emissive;
      if (this.containment > 0.5 && object.phase === 'incident') { objectColor = color('#2ad6a0'); emissive = color('#1affb5'); }
      if (this.recovery > 0.5 && object.phase === 'status') emissive = color('#42f0c4');
      gl.uniform3fv(this.locations.color, objectColor);
      gl.uniform3fv(this.locations.emissive, emissive);
      gl.uniform1f(this.locations.pulse, object.pulse || 0);
      gl.drawElements(gl.TRIANGLES, mesh.count, gl.UNSIGNED_SHORT, 0);
      drawCalls += 1;
    }
    gl.useProgram(this.particleProgram);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.particleBuffer);
    gl.enableVertexAttribArray(this.particleLocations.position);
    gl.vertexAttribPointer(this.particleLocations.position, 3, gl.FLOAT, false, 16, 0);
    gl.enableVertexAttribArray(this.particleLocations.seed);
    gl.vertexAttribPointer(this.particleLocations.seed, 1, gl.FLOAT, false, 16, 12);
    gl.uniformMatrix4fv(this.particleLocations.viewProjection, false, viewProjection);
    gl.uniform1f(this.particleLocations.time, time);
    gl.uniform1f(this.particleLocations.size, this.qualityId === 'ultra' ? 4.2 : this.qualityId === 'low' ? 2.2 : 3.2);
    gl.uniform3fv(this.particleLocations.color, color(this.scene.particleColor));
    gl.uniform1f(this.particleLocations.incident, this.incident);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    const activeParticles = Math.max(12, Math.floor(this.particleCount * (0.5 + this.dynamicScale * 0.5)));
    gl.drawArrays(gl.POINTS, 0, activeParticles);
    gl.disable(gl.BLEND);
    drawCalls += 1;
    const fps = 1000 / delta;
    this.fpsWindow.push(fps);
    if (this.fpsWindow.length > 45) this.fpsWindow.shift();
    if (this.frame % 15 === 0) {
      const averageFps = Math.round(this.fpsWindow.reduce((sum, item) => sum + item, 0) / this.fpsWindow.length);
      if (this.autoManaged) {
        const target = this.quality.targetFps;
        if (averageFps < target * 0.62) { this.lowFpsStrikes += 1; this.highFpsStrikes = 0; }
        else if (averageFps > target * 0.9) { this.highFpsStrikes += 1; this.lowFpsStrikes = 0; }
        else { this.lowFpsStrikes = Math.max(0, this.lowFpsStrikes - 1); this.highFpsStrikes = 0; }
        if (this.lowFpsStrikes >= 3 && this.dynamicScale > 0.56) {
          this.dynamicScale = Math.max(0.56, this.dynamicScale - 0.12);
          this.lowFpsStrikes = 0;
          this.resize();
          this.onStatus(`Qualidade automática ajustada para ${Math.round(this.dynamicScale * 100)}% para estabilizar o FPS.`);
        } else if (this.highFpsStrikes >= 8 && this.dynamicScale < 1) {
          this.dynamicScale = Math.min(1, this.dynamicScale + 0.08);
          this.highFpsStrikes = 0;
          this.resize();
        }
      }
      this.onMetrics({ fps: averageFps, drawCalls, objects: objects.length, preset: this.qualityId, scale: this.dynamicScale, scene: this.scene.label });
    }
    requestAnimationFrame((next) => this.render(next));
  }

  dispose() {
    this.running = false;
    this.bound.forEach((unbind) => unbind());
    this.bound = [];
    this.observer?.disconnect?.();
    this.observer = null;
    if (!this.gl) return;
    Object.values(this.meshes || {}).forEach((mesh) => {
      this.gl.deleteBuffer(mesh.vertexBuffer);
      this.gl.deleteBuffer(mesh.indexBuffer);
    });
    this.gl.deleteBuffer(this.particleBuffer);
    this.gl.deleteProgram(this.program);
    this.gl.deleteProgram(this.particleProgram);
  }
}
