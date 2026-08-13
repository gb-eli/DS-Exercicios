export class JsonStorage {
  constructor(prefix = 'cosmos-ds') { this.prefix = prefix; }
  key(name) { return `${this.prefix}:${name}`; }
  get(name, fallback) {
    try {
      const raw = localStorage.getItem(this.key(name));
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      console.warn('[COSMOS DS] Falha ao ler armazenamento local.', error);
      return fallback;
    }
  }
  set(name, value) {
    try {
      localStorage.setItem(this.key(name), JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn('[COSMOS DS] Falha ao salvar armazenamento local.', error);
      return false;
    }
  }
  remove(name) { localStorage.removeItem(this.key(name)); }
  clearProject() {
    const keys = [];
    for (let index = 0; index < localStorage.length; index++) {
      const key = localStorage.key(index);
      if (key?.startsWith(`${this.prefix}:`)) keys.push(key);
    }
    keys.forEach(key => localStorage.removeItem(key));
  }
}
