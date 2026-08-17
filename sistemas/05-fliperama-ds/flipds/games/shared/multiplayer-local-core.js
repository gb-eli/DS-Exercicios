export class MultiplayerLocalCore {
  constructor(mode = 'solo') {
    this.mode = mode === 'local' ? 'local' : 'solo';
    this.activePlayer = 0;
    this.held = [new Set(), new Set()];
    this.justPressed = [new Set(), new Set()];
    this.gamepadPrevious = new Map();
  }

  setMode(mode) {
    this.mode = mode === 'local' ? 'local' : 'solo';
    if (this.mode === 'solo') this.activePlayer = Math.min(this.activePlayer, 1);
  }

  clear() {
    this.held.forEach(set => set.clear());
    this.justPressed.forEach(set => set.clear());
    this.gamepadPrevious.clear();
  }

  switchActivePlayer() {
    if (this.mode !== 'solo') return this.activePlayer;
    this.activePlayer = this.activePlayer === 0 ? 1 : 0;
    return this.activePlayer;
  }

  dispatch(action, active) {
    if (action === 'switch-player' && active) {
      this.switchActivePlayer();
      return;
    }
    const mapping = this.#mapAction(action);
    if (!mapping) return;
    const { player, control } = mapping;
    if (this.mode === 'solo' && player !== this.activePlayer && action.startsWith('p')) return;
    if (active) {
      if (!this.held[player].has(control)) this.justPressed[player].add(control);
      this.held[player].add(control);
    } else {
      this.held[player].delete(control);
    }
  }

  isHeld(player, control) {
    return this.held[player]?.has(control) ?? false;
  }

  consumePressed(player, control) {
    const set = this.justPressed[player];
    if (!set?.has(control)) return false;
    set.delete(control);
    return true;
  }

  endFrame() {
    this.justPressed.forEach(set => set.clear());
  }

  pollGamepads() {
    const pads = navigator.getGamepads?.() ?? [];
    if (this.mode === 'solo') {
      const pad = pads[0];
      if (pad) this.#applyPad(pad, this.activePlayer, true);
      return;
    }
    if (pads[0]) this.#applyPad(pads[0], 0, false);
    if (pads[1]) this.#applyPad(pads[1], 1, false);
  }

  #applyPad(pad, player, solo) {
    const axisX = Math.abs(pad.axes?.[0] ?? 0) > 0.22 ? pad.axes[0] : 0;
    this.#setVirtual(player, 'left', axisX < -0.22 || !!pad.buttons?.[14]?.pressed);
    this.#setVirtual(player, 'right', axisX > 0.22 || !!pad.buttons?.[15]?.pressed);
    this.#setVirtual(player, 'jump', !!pad.buttons?.[0]?.pressed || !!pad.buttons?.[12]?.pressed);
    const switchPressed = !!pad.buttons?.[3]?.pressed;
    const switchKey = `switch:${pad.index}`;
    const wasSwitch = this.gamepadPrevious.get(switchKey) ?? false;
    if (solo && switchPressed && !wasSwitch) this.switchActivePlayer();
    this.gamepadPrevious.set(switchKey, switchPressed);
  }

  #setVirtual(player, control, active) {
    const key = `pad:${player}:${control}`;
    const previous = this.gamepadPrevious.get(key) ?? false;
    if (active && !previous) this.justPressed[player].add(control);
    if (active) this.held[player].add(control);
    else this.held[player].delete(control);
    this.gamepadPrevious.set(key, active);
  }

  #mapAction(action) {
    const explicit = /^p([12])-(left|right|jump)$/.exec(action);
    if (explicit) return { player: Number(explicit[1]) - 1, control: explicit[2] };
    if (action === 'move-left') return { player: this.mode === 'solo' ? this.activePlayer : 0, control: 'left' };
    if (action === 'move-right') return { player: this.mode === 'solo' ? this.activePlayer : 0, control: 'right' };
    if (action === 'jump') return { player: this.mode === 'solo' ? this.activePlayer : 0, control: 'jump' };
    return null;
  }
}
