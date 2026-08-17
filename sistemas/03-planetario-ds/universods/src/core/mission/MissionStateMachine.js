export class MissionStateMachine {
  constructor({ initial, states, transitions }) {
    if (!initial || !states?.includes(initial)) throw new Error('Estado inicial inválido.');
    this.initial = initial;
    this.states = [...states];
    this.transitions = transitions.map(item => ({ ...item }));
    this.current = initial;
    this.history = [{ from: null, to: initial, action: 'INIT', accepted: true, at: Date.now() }];
  }

  availableActions() {
    return this.transitions.filter(item => item.from === this.current).map(item => item.action);
  }

  can(action) {
    return this.transitions.some(item => item.from === this.current && item.action === action);
  }

  send(action, metadata = {}) {
    const transition = this.transitions.find(item => item.from === this.current && item.action === action);
    const at = Date.now();
    if (!transition) {
      const result = {
        from: this.current,
        to: this.current,
        action,
        accepted: false,
        reason: `Ação ${action} bloqueada no estado ${this.current}.`,
        metadata,
        at
      };
      this.history.push(result);
      return result;
    }
    const from = this.current;
    this.current = transition.to;
    const result = { from, to: this.current, action, accepted: true, metadata, at };
    this.history.push(result);
    return result;
  }

  reset() {
    this.current = this.initial;
    this.history = [{ from: null, to: this.initial, action: 'RESET', accepted: true, at: Date.now() }];
  }

  snapshot() {
    return {
      initial: this.initial,
      current: this.current,
      states: [...this.states],
      availableActions: this.availableActions(),
      history: this.history.map(item => ({ ...item }))
    };
  }
}
