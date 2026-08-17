const ORDER = ['performance', 'balanced', 'experience'];

export class AdaptiveQualityController {
  constructor(settingsStore, bus) {
    this.settingsStore = settingsStore;
    this.bus = bus;
    this.lowSamples = 0;
    this.highSamples = 0;
    this.lastAdjustment = 0;
    this.unsubscribe = this.bus.on('performance:fps', fps => this.evaluate(fps));
  }

  evaluate(fps) {
    const settings = this.settingsStore.get();
    if (!settings.autoReduceQuality || settings.qualityMode !== 'automatic') {
      this.lowSamples = 0;
      this.highSamples = 0;
      return;
    }

    const now = performance.now();
    if (now - this.lastAdjustment < 12000) return;

    if (fps > 0 && fps < 38) {
      this.lowSamples++;
      this.highSamples = 0;
    } else if (fps >= 57) {
      this.highSamples++;
      this.lowSamples = 0;
    } else {
      this.lowSamples = Math.max(0, this.lowSamples - 1);
      this.highSamples = Math.max(0, this.highSamples - 1);
    }

    const current = this.settingsStore.get().resolvedQuality;
    const index = ORDER.indexOf(current);

    if (this.lowSamples >= 4 && index > 0) {
      const next = ORDER[index - 1];
      this.settingsStore.resolveAutomatic(next);
      this.lastAdjustment = now;
      this.lowSamples = 0;
      this.bus.emit('quality:auto-adjusted', { mode: next, reason: 'fps-low' });
    } else if (this.highSamples >= 10 && index >= 0 && index < ORDER.length - 1) {
      const next = ORDER[index + 1];
      this.settingsStore.resolveAutomatic(next);
      this.lastAdjustment = now;
      this.highSamples = 0;
      this.bus.emit('quality:auto-adjusted', { mode: next, reason: 'fps-stable' });
    }
  }

  destroy() { this.unsubscribe?.(); }
}
