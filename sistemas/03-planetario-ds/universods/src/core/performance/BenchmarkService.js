export class BenchmarkService {
  async run() {
    const hardwareConcurrency = navigator.hardwareConcurrency || 2;
    const memory = navigator.deviceMemory || 2;
    const mobile = matchMedia('(pointer: coarse)').matches || /Android|iPhone|iPad/i.test(navigator.userAgent);
    const start = performance.now();
    let accumulator = 0;
    for (let i = 0; i < 240000; i++) accumulator += Math.sin(i * .001) * Math.cos(i * .0007);
    const cpuMs = Math.max(1, performance.now() - start);
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2', { failIfMajorPerformanceCaveat: true });
    const webgl2 = Boolean(gl);
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
    let score = 0;
    score += Math.min(40, hardwareConcurrency * 4);
    score += Math.min(28, memory * 4);
    score += Math.max(0, 34 - cpuMs * 0.8);
    if (webgl2) score += 18;
    if (mobile) score -= 10;
    const recommendation = !webgl2 || score < 38 ? 'performance' : score < 70 ? 'balanced' : 'experience';
    return { score: Math.round(score), recommendation, hardwareConcurrency, memory, cpuMs: Math.round(cpuMs), webgl2, mobile, accumulator };
  }
}
