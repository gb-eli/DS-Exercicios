export class ReplayBuffer {
  constructor(maxSamples = 180) {
    this.maxSamples = Math.max(10, maxSamples);
    this.samples = [];
  }

  push(sample) {
    const safe = structuredClone(sample);
    this.samples.push(safe);
    if (this.samples.length > this.maxSamples) this.samples.splice(0, this.samples.length - this.maxSamples);
    return safe;
  }

  clear() { this.samples = []; }
  size() { return this.samples.length; }
  list() { return this.samples.map(sample => structuredClone(sample)); }
  at(index) { return this.samples[index] ? structuredClone(this.samples[index]) : null; }

  range(start = 0, end = this.samples.length) {
    return this.samples.slice(Math.max(0, start), Math.min(this.samples.length, end)).map(sample => structuredClone(sample));
  }

  summarize(keys = ['temperature','latency','link','queueDepth']) {
    if (!this.samples.length) return {};
    return Object.fromEntries(keys.map(key => {
      const values = this.samples.map(sample => Number(sample[key])).filter(Number.isFinite);
      if (!values.length) return [key, null];
      const min = Math.min(...values);
      const max = Math.max(...values);
      const avg = values.reduce((total, value) => total + value, 0) / values.length;
      const peakIndex = this.samples.findIndex(sample => Number(sample[key]) === max);
      return [key, { min, max, avg, peakIndex }];
    }));
  }

  detectAnomalies() {
    return this.samples.flatMap((sample, index) => {
      const anomalies = [];
      if (sample.temperature > 760) anomalies.push({ index, key: 'temperature', value: sample.temperature, severity: 'critical' });
      if (sample.latency > 900) anomalies.push({ index, key: 'latency', value: sample.latency, severity: 'high' });
      if (sample.link < 72) anomalies.push({ index, key: 'link', value: sample.link, severity: 'high' });
      if (sample.queueDepth > 32) anomalies.push({ index, key: 'queueDepth', value: sample.queueDepth, severity: 'medium' });
      return anomalies;
    });
  }
}
