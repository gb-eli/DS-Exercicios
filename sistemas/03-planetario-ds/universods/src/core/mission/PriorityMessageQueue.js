const PRIORITY_WEIGHT = { critical: 0, high: 1, normal: 2, low: 3 };

export class PriorityMessageQueue {
  constructor(maxSize = 40) {
    this.maxSize = Math.max(4, maxSize);
    this.items = [];
    this.sequence = 0;
    this.dropped = 0;
    this.processed = 0;
    this.backpressure = false;
  }

  enqueue(message, priority = 'normal') {
    if (this.backpressure && priority === 'low') {
      this.dropped++;
      return { accepted: false, reason: 'backpressure' };
    }
    if (this.items.length >= this.maxSize) {
      const lowIndex = this.findDroppableIndex(priority);
      if (lowIndex === -1) {
        this.dropped++;
        return { accepted: false, reason: 'full' };
      }
      this.items.splice(lowIndex, 1);
      this.dropped++;
    }
    const item = {
      id: `msg-${++this.sequence}`,
      priority: PRIORITY_WEIGHT[priority] === undefined ? 'normal' : priority,
      payload: structuredClone(message),
      createdAt: Date.now(),
      order: this.sequence
    };
    this.items.push(item);
    this.sort();
    return { accepted: true, item: structuredClone(item) };
  }

  findDroppableIndex(incomingPriority) {
    const incomingWeight = PRIORITY_WEIGHT[incomingPriority] ?? PRIORITY_WEIGHT.normal;
    let candidate = -1;
    let candidateWeight = -1;
    for (let i = 0; i < this.items.length; i++) {
      const weight = PRIORITY_WEIGHT[this.items[i].priority];
      if (weight > incomingWeight && weight > candidateWeight) {
        candidate = i;
        candidateWeight = weight;
      }
    }
    return candidate;
  }

  sort() {
    this.items.sort((a, b) => (PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority]) || (a.order - b.order));
  }

  dequeue(count = 1) {
    const amount = Math.max(0, Math.min(this.items.length, Math.round(count)));
    const result = this.items.splice(0, amount);
    this.processed += result.length;
    return result.map(item => ({ ...item, payload: structuredClone(item.payload) }));
  }

  setBackpressure(enabled) {
    this.backpressure = Boolean(enabled);
  }

  clear() {
    this.items = [];
  }

  metrics() {
    const now = Date.now();
    const oldest = this.items.at(-1);
    return {
      size: this.items.length,
      maxSize: this.maxSize,
      utilization: this.items.length / this.maxSize,
      dropped: this.dropped,
      processed: this.processed,
      backpressure: this.backpressure,
      oldestAgeMs: oldest ? Math.max(0, now - oldest.createdAt) : 0,
      byPriority: ['critical','high','normal','low'].reduce((acc, priority) => {
        acc[priority] = this.items.filter(item => item.priority === priority).length;
        return acc;
      }, {})
    };
  }

  snapshot(limit = this.maxSize) {
    return this.items.slice(0, limit).map(item => ({ ...item, payload: structuredClone(item.payload) }));
  }
}
