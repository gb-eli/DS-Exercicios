let audioContext = null;

const canAnimate = () => document.documentElement.dataset.reducedMotion !== 'true';
const particlesEnabled = () => document.documentElement.dataset.reducedParticles !== 'true' && document.documentElement.dataset.quality !== 'low';

const playTone = (kind = 'success', enabled = false) => {
  if (!enabled) return;
  try {
    audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
    const now = audioContext.currentTime;
    const frequencies = kind === 'error' ? [180, 120] : kind === 'level' ? [320, 480, 720] : [260, 390, 520];
    frequencies.forEach((frequency, index) => {
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.type = kind === 'error' ? 'sawtooth' : 'square';
      oscillator.frequency.setValueAtTime(frequency, now + index * .07);
      gain.gain.setValueAtTime(.0001, now + index * .07);
      gain.gain.exponentialRampToValueAtTime(.045, now + index * .07 + .01);
      gain.gain.exponentialRampToValueAtTime(.0001, now + index * .07 + .12);
      oscillator.connect(gain).connect(audioContext.destination);
      oscillator.start(now + index * .07);
      oscillator.stop(now + index * .07 + .14);
    });
  } catch {
    // Som é opcional; falhas do Web Audio não interrompem o laboratório.
  }
};

const createCyberBurst = (kind = 'success') => {
  if (!canAnimate() || !particlesEnabled()) return;
  const root = document.querySelector('#fx-root') || document.body;
  const burst = document.createElement('div');
  burst.className = `cyber-burst cyber-burst-${kind}`;
  const quality = document.documentElement.dataset.quality || 'auto';
  const base = kind === 'level' ? 34 : 22;
  const amount = quality === 'medium' ? Math.ceil(base * .7) : quality === 'high' ? base : Math.ceil(base * .5);
  for (let index = 0; index < amount; index += 1) {
    const shard = document.createElement('i');
    const angle = (360 / amount) * index + Math.random() * 16;
    const distance = 90 + Math.random() * (kind === 'level' ? 250 : 150);
    shard.style.setProperty('--angle', `${angle}deg`);
    shard.style.setProperty('--distance', `${distance}px`);
    shard.style.setProperty('--delay', `${Math.random() * 140}ms`);
    shard.style.setProperty('--size', `${2 + Math.random() * 5}px`);
    burst.append(shard);
  }
  root.append(burst);
  setTimeout(() => burst.remove(), 1300);
};

export const showLevelUp = (level, sound = false) => {
  playTone('level', sound);
  createCyberBurst('level');
  const layer = document.createElement('div');
  layer.className = 'level-up-layer';
  layer.innerHTML = `<div><span>ACESSO ELEVADO</span><strong>NÍVEL ${Number(level)}</strong><small>NOVAS MISSÕES E RECOMPENSAS PODEM ESTAR DISPONÍVEIS</small></div>`;
  document.body.append(layer);
  setTimeout(() => layer.classList.add('visible'), 20);
  setTimeout(() => layer.classList.remove('visible'), 2100);
  setTimeout(() => layer.remove(), 2600);
};

export const startMatrix = (canvas, initialReducedMotion = false) => {
  const context = canvas.getContext('2d');
  let columns = [];
  let animationId;
  let lastFrame = 0;
  const chars = '01アイウエオカキクケコサシスセソ{}[]<>/\\#@$%&';

  const resize = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * ratio;
    canvas.height = window.innerHeight * ratio;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    const quality = document.documentElement.dataset.quality || 'auto';
    const spacing = quality === 'low' ? 32 : quality === 'medium' ? 24 : 18;
    columns = Array.from({ length: Math.ceil(window.innerWidth / spacing) }, () => Math.random() * -60);
    canvas.dataset.spacing = String(spacing);
  };

  const draw = (timestamp = 0) => {
    const reduced = initialReducedMotion || document.documentElement.dataset.reducedMotion === 'true';
    const quality = document.documentElement.dataset.quality || 'auto';
    const frameDelay = quality === 'low' ? 90 : quality === 'medium' ? 50 : 33;
    if (!reduced && timestamp - lastFrame > frameDelay) {
      context.fillStyle = 'rgba(5,9,13,.12)';
      context.fillRect(0, 0, window.innerWidth, window.innerHeight);
      context.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#00f5d4';
      context.font = '12px monospace';
      columns.forEach((position, index) => {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const spacing = Number(canvas.dataset.spacing || 18);
        context.fillText(char, index * spacing, position * 18);
        columns[index] = position * 18 > window.innerHeight && Math.random() > .985 ? 0 : position + .45;
      });
      lastFrame = timestamp;
    }
    animationId = requestAnimationFrame(draw);
  };

  resize();
  draw();
  window.addEventListener('resize', resize);
  return () => { cancelAnimationFrame(animationId); window.removeEventListener('resize', resize); };
};

export const triggerEffect = (effectId = 'effect-matrix', options = {}) => {
  const target = document.querySelector('.app-shell');
  if (!target) return;
  const { sound = false, kind = 'success' } = options;
  playTone(kind === 'error' ? 'error' : 'success', sound);
  createCyberBurst(kind === 'error' ? 'error' : 'success');

  if (!canAnimate()) return;
  if (effectId === 'effect-lightning') {
    document.body.classList.add('lightning-flash');
    setTimeout(() => document.body.classList.remove('lightning-flash'), 520);
  } else if (effectId === 'effect-glitch' || kind === 'error') {
    target.classList.add('glitch');
    setTimeout(() => target.classList.remove('glitch'), 650);
  } else {
    document.body.classList.add('matrix-surge');
    setTimeout(() => document.body.classList.remove('matrix-surge'), 850);
  }
};
