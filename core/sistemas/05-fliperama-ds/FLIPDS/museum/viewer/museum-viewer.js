const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

function hexToRgb(hex) {
  const value = String(hex || '#49e7ff').replace('#', '');
  const normalized = value.length === 3 ? value.split('').map((part) => part + part).join('') : value.padEnd(6, '0').slice(0, 6);
  const number = Number.parseInt(normalized, 16);
  return {
    r: (number >> 16) & 255,
    g: (number >> 8) & 255,
    b: number & 255,
  };
}

function shade(hex, factor, alpha = 1) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${Math.round(clamp(r * factor, 0, 255))},${Math.round(clamp(g * factor, 0, 255))},${Math.round(clamp(b * factor, 0, 255))},${alpha})`;
}

function rotatePoint(point, yaw, pitch) {
  const cosY = Math.cos(yaw);
  const sinY = Math.sin(yaw);
  const cosX = Math.cos(pitch);
  const sinX = Math.sin(pitch);
  const x1 = point.x * cosY - point.z * sinY;
  const z1 = point.x * sinY + point.z * cosY;
  return {
    x: x1,
    y: point.y * cosX - z1 * sinX,
    z: point.y * sinX + z1 * cosX,
  };
}

function project(point, width, height, scale) {
  const distance = 4.8;
  const depth = Math.max(1.5, distance + point.z);
  const perspective = scale / depth;
  return {
    x: width / 2 + point.x * perspective,
    y: height / 2 + point.y * perspective,
    z: point.z,
  };
}

function cuboid(x, y, z, width, height, depth, color, round = 0) {
  return { type: 'box', x, y, z, width, height, depth, color, round };
}

function cylinder(x, y, z, radius, depth, color, axis = 'z') {
  return { type: 'cylinder', x, y, z, radius, depth, color, axis };
}

function buildScene(shape, accent, secondary) {
  const dark = '#111827';
  const light = '#dcecff';
  const parts = [];
  const add = (...values) => parts.push(...values);
  switch (shape) {
    case 'box':
      add(cuboid(0, .25, 0, 2.7, .85, 1.65, dark, .08), cuboid(0, -.22, -.88, 2.15, .16, .12, accent), cuboid(0, -.12, .18, .9, .12, 1.5, secondary));
      add(cylinder(-1.05, .05, -.88, .08, .08, light), cylinder(-.78, .05, -.88, .08, .08, accent));
      break;
    case 'discbox':
      add(cylinder(0, .18, 0, 1.35, .55, dark, 'y'), cylinder(0, -.15, 0, .68, .62, secondary, 'y'), cuboid(0, -.28, -.7, .72, .12, .22, accent));
      break;
    case 'tower':
      add(cuboid(0, .05, 0, 1.55, 2.4, 1.15, dark, .15), cuboid(0, .05, -.62, .23, 2.05, .08, accent), cylinder(.48, .55, -.65, .1, .06, secondary));
      break;
    case 'hybrid':
      add(cuboid(0, 0, 0, 1.85, 1.25, .35, dark, .12), cuboid(-1.18, 0, 0, .48, 1.35, .42, accent, .18), cuboid(1.18, 0, 0, .48, 1.35, .42, secondary, .18));
      add(cuboid(0, 0, -.22, 1.5, .92, .05, '#17294a'), cylinder(-1.18, -.22, -.25, .12, .06, light), cylinder(1.18, .22, -.25, .12, .06, light));
      break;
    case 'stick':
      add(cuboid(0, .42, 0, 2.55, .42, 1.45, dark, .12), cylinder(-.55, -.22, -.05, .12, 1.25, accent, 'y'), cylinder(-.55, -.9, -.05, .27, .2, secondary, 'y'));
      add(cylinder(.48, .1, -.72, .18, .08, accent), cylinder(.9, .1, -.72, .18, .08, secondary));
      break;
    case 'pad':
      add(cuboid(0, .1, 0, 2.7, .75, .45, dark, .16), cuboid(-.72, .04, -.27, .58, .14, .08, accent), cuboid(-.72, .04, -.27, .14, .58, .08, accent));
      add(cylinder(.78, .02, -.28, .17, .08, secondary), cylinder(1.08, .28, -.28, .17, .08, accent));
      break;
    case 'gamepad':
      add(cuboid(0, .05, 0, 2.15, .82, .55, dark, .3), cuboid(-.86, .48, .08, .62, 1.35, .62, dark, .28), cuboid(.86, .48, .08, .62, 1.35, .62, dark, .28));
      add(cylinder(-.48, -.12, -.34, .16, .08, accent), cylinder(.28, .06, -.34, .16, .08, secondary), cylinder(.72, -.16, -.34, .12, .08, light));
      break;
    case 'wheel':
      add(cylinder(-.35, -.05, 0, .92, .28, dark), cylinder(-.35, -.05, -.2, .54, .3, '#07101f'));
      add(cuboid(-.35, -.05, -.26, 1.55, .14, .12, accent), cuboid(-.35, -.05, -.26, .14, 1.55, .12, accent));
      add(cuboid(1.05, .28, 0, .78, 1.55, .55, dark, .12), cuboid(1.05, .02, -.32, .48, .14, .08, secondary));
      break;
    case 'gun':
      add(cuboid(-.12, -.12, 0, 2.55, .58, .62, dark, .16), cuboid(-.1, .67, .12, .48, 1.15, .52, dark, .12), cuboid(1.28, -.12, 0, .42, .34, .42, accent, .08));
      break;
    case 'bar':
      add(cuboid(0, 0, 0, 2.85, .62, .55, dark, .24), cylinder(-.78, 0, -.34, .16, .08, accent), cylinder(0, 0, -.34, .16, .08, secondary), cylinder(.78, 0, -.34, .16, .08, accent));
      break;
    case 'headset':
      add(cuboid(0, -.15, 0, 2.65, .92, .82, dark, .18), cuboid(-.68, -.15, -.46, .92, .56, .08, '#19345b'), cuboid(.68, -.15, -.46, .92, .56, .08, '#19345b'));
      add(cuboid(0, .75, .2, 1.7, .22, .45, accent, .12));
      break;
    case 'hotas':
      add(cuboid(-.72, .65, 0, 1.25, .36, 1.05, dark, .15), cylinder(-.72, -.05, 0, .2, 1.65, accent, 'y'), cylinder(-.72, -.98, 0, .32, .28, secondary, 'y'));
      add(cuboid(.9, .42, 0, 1.1, .8, 1, dark, .15), cuboid(.9, -.3, 0, .3, 1.3, .35, secondary, .1));
      break;
    default:
      add(cuboid(0, 0, 0, 2.4, 1.2, 1.2, dark, .12));
  }
  return parts;
}

function drawBox(ctx, part, yaw, pitch, width, height, scale) {
  const { x, y, z, width: w, height: h, depth: d } = part;
  const vertices = [
    { x: x-w/2, y: y-h/2, z: z-d/2 }, { x: x+w/2, y: y-h/2, z: z-d/2 },
    { x: x+w/2, y: y+h/2, z: z-d/2 }, { x: x-w/2, y: y+h/2, z: z-d/2 },
    { x: x-w/2, y: y-h/2, z: z+d/2 }, { x: x+w/2, y: y-h/2, z: z+d/2 },
    { x: x+w/2, y: y+h/2, z: z+d/2 }, { x: x-w/2, y: y+h/2, z: z+d/2 },
  ].map((point) => project(rotatePoint(point, yaw, pitch), width, height, scale));
  const faces = [
    { ids:[0,1,2,3], factor:.72 }, { ids:[4,5,6,7], factor:1.05 },
    { ids:[0,4,7,3], factor:.58 }, { ids:[1,5,6,2], factor:.88 },
    { ids:[3,2,6,7], factor:1.18 }, { ids:[0,1,5,4], factor:.45 },
  ].map((face) => ({ ...face, z: face.ids.reduce((sum, index) => sum + vertices[index].z, 0) / face.ids.length }))
   .sort((a,b) => b.z-a.z);
  for (const face of faces) {
    ctx.beginPath();
    face.ids.forEach((index, position) => position ? ctx.lineTo(vertices[index].x, vertices[index].y) : ctx.moveTo(vertices[index].x, vertices[index].y));
    ctx.closePath();
    ctx.fillStyle = shade(part.color, face.factor, .96);
    ctx.fill();
    ctx.strokeStyle = shade(part.color, 1.35, .7);
    ctx.lineWidth = 1.2;
    ctx.stroke();
  }
}

function drawCylinder(ctx, part, yaw, pitch, width, height, scale) {
  const rotated = rotatePoint({ x: part.x, y: part.y, z: part.z }, yaw, pitch);
  const center = project(rotated, width, height, scale);
  const depth = Math.max(1.5, 4.8 + rotated.z);
  const radius = part.radius * scale / depth;
  const length = part.depth * scale / depth;
  ctx.save();
  ctx.translate(center.x, center.y);
  ctx.rotate(part.axis === 'y' ? yaw * .35 : yaw);
  ctx.fillStyle = shade(part.color, .65, .96);
  ctx.strokeStyle = shade(part.color, 1.35, .85);
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.ellipse(0, 0, Math.max(2, radius), Math.max(2, part.axis === 'y' ? length/2 : radius*.55), 0, 0, Math.PI*2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

export function mountMuseumViewer(container, record, options = {}) {
  if (!container) throw new Error('Contêiner do visualizador não encontrado.');
  const canvas = document.createElement('canvas');
  canvas.className = 'museum-360-canvas';
  canvas.setAttribute('aria-label', `Visualização 360 graus de ${record.title || record.id}`);
  canvas.tabIndex = 0;
  container.replaceChildren(canvas);
  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) throw new Error('Canvas 2D indisponível.');

  const scene = buildScene(record.viewerShape, record.accent || '#49e7ff', record.accentSecondary || '#9273ff');
  let yaw = .45;
  let pitch = -.18;
  let paused = Boolean(options.reducedMotion);
  let destroyed = false;
  let frame = 0;
  let dragging = false;
  let lastX = 0;
  let lastY = 0;
  let lastTime = performance.now();
  const resize = () => {
    const rect = container.getBoundingClientRect();
    const ratio = Math.min(2, window.devicePixelRatio || 1);
    const width = Math.max(280, Math.floor(rect.width));
    const height = Math.max(250, Math.floor(rect.height));
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  };

  const draw = (time) => {
    if (destroyed) return;
    const width = Number.parseFloat(canvas.style.width) || 600;
    const height = Number.parseFloat(canvas.style.height) || 360;
    const delta = Math.min(40, time - lastTime);
    lastTime = time;
    if (!paused && !dragging) yaw += delta * .00022;
    const gradient = ctx.createRadialGradient(width*.5, height*.36, 10, width*.5, height*.5, Math.max(width,height)*.72);
    gradient.addColorStop(0, shade(record.accent || '#49e7ff', .28, 1));
    gradient.addColorStop(.45, '#0c1426');
    gradient.addColorStop(1, '#050912');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = shade(record.accent || '#49e7ff', 1, .13);
    ctx.lineWidth = 1;
    const horizon = height*.72;
    for (let index=-7; index<=7; index++) {
      ctx.beginPath();
      ctx.moveTo(width/2 + index*22, horizon);
      ctx.lineTo(width/2 + index*86, height);
      ctx.stroke();
    }
    for (let index=0; index<6; index++) {
      const y = horizon + Math.pow(index/5, 1.7)*(height-horizon);
      ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(width,y); ctx.stroke();
    }
    const scale = Math.min(width, height) * 2.55;
    const ordered = scene.map((part) => ({ part, z: rotatePoint({x:part.x,y:part.y,z:part.z},yaw,pitch).z })).sort((a,b)=>b.z-a.z);
    for (const {part} of ordered) {
      if (part.type === 'box') drawBox(ctx, part, yaw, pitch, width, height, scale);
      else drawCylinder(ctx, part, yaw, pitch, width, height, scale);
    }
    ctx.fillStyle = 'rgba(230,241,255,.78)';
    ctx.font = '700 12px ui-monospace, monospace';
    ctx.fillText('ARRASTE PARA GIRAR · 360° PROCEDURAL', 18, 26);
    ctx.fillStyle = 'rgba(230,241,255,.48)';
    ctx.font = '11px system-ui, sans-serif';
    ctx.fillText('Fallback leve preparado para futura substituição por GLB/glTF.', 18, height - 18);
    frame = requestAnimationFrame(draw);
  };

  const pointerDown = (event) => {
    dragging = true;
    lastX = event.clientX;
    lastY = event.clientY;
    canvas.setPointerCapture?.(event.pointerId);
  };
  const pointerMove = (event) => {
    if (!dragging) return;
    yaw += (event.clientX-lastX)*.012;
    pitch = clamp(pitch + (event.clientY-lastY)*.008, -.65, .45);
    lastX = event.clientX;
    lastY = event.clientY;
  };
  const pointerUp = () => { dragging = false; };
  canvas.addEventListener('pointerdown', pointerDown);
  canvas.addEventListener('pointermove', pointerMove);
  canvas.addEventListener('pointerup', pointerUp);
  canvas.addEventListener('pointercancel', pointerUp);
  canvas.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') yaw -= .12;
    if (event.key === 'ArrowRight') yaw += .12;
    if (event.key === 'ArrowUp') pitch = clamp(pitch-.08,-.65,.45);
    if (event.key === 'ArrowDown') pitch = clamp(pitch+.08,-.65,.45);
  });
  const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(resize) : undefined;
  if (observer) observer.observe(container);
  else window.addEventListener('resize', resize);
  resize();
  frame = requestAnimationFrame(draw);

  return {
    pause() { paused = true; },
    resume() { paused = false; },
    toggle() { paused = !paused; return paused; },
    get paused() { return paused; },
    destroy() {
      destroyed = true;
      cancelAnimationFrame(frame);
      observer?.disconnect();
      if (!observer) window.removeEventListener('resize', resize);
      canvas.removeEventListener('pointerdown', pointerDown);
      canvas.removeEventListener('pointermove', pointerMove);
      canvas.removeEventListener('pointerup', pointerUp);
      canvas.removeEventListener('pointercancel', pointerUp);
      container.replaceChildren();
    },
  };
}
