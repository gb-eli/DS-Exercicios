export class EventBus {
  #listeners = new Map();
  on(event, callback) {
    const set = this.#listeners.get(event) ?? new Set();
    set.add(callback);
    this.#listeners.set(event, set);
    return () => set.delete(callback);
  }
  emit(event, payload) {
    this.#listeners.get(event)?.forEach(callback => callback(payload));
  }
}
