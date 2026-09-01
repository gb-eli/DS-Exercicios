export const MAZE_WALLS = Object.freeze([
  { id:'labirinto_armadilhas_wall_001', x:0, z:49, w:98, d:2 },
  { id:'labirinto_armadilhas_wall_002', x:0, z:-49, w:98, d:2 },
  { id:'labirinto_armadilhas_wall_003', x:-49, z:0, w:2, d:98 },
  { id:'labirinto_armadilhas_wall_004', x:49, z:0, w:2, d:98 },

  { id:'labirinto_armadilhas_wall_010', x:-36, z:35, w:2, d:24 },
  { id:'labirinto_armadilhas_wall_011', x:-25, z:24, w:22, d:2 },
  { id:'labirinto_armadilhas_wall_012', x:-14, z:35, w:2, d:24 },
  { id:'labirinto_armadilhas_wall_013', x:-2, z:43, w:24, d:2 },
  { id:'labirinto_armadilhas_wall_014', x:10, z:32, w:2, d:22 },
  { id:'labirinto_armadilhas_wall_015', x:22, z:21, w:26, d:2 },
  { id:'labirinto_armadilhas_wall_016', x:35, z:10, w:2, d:24 },

  { id:'labirinto_armadilhas_wall_020', x:-39, z:9, w:18, d:2 },
  { id:'labirinto_armadilhas_wall_021', x:-30, z:-2, w:2, d:24 },
  { id:'labirinto_armadilhas_wall_022', x:-18, z:-13, w:24, d:2 },
  { id:'labirinto_armadilhas_wall_023', x:-6, z:-1, w:2, d:24 },
  { id:'labirinto_armadilhas_wall_024', x:6, z:10, w:24, d:2 },
  { id:'labirinto_armadilhas_wall_025', x:18, z:-2, w:2, d:26 },
  { id:'labirinto_armadilhas_wall_026', x:30, z:-14, w:24, d:2 },

  { id:'labirinto_armadilhas_wall_030', x:-40, z:-26, w:18, d:2 },
  { id:'labirinto_armadilhas_wall_031', x:-31, z:-37, w:2, d:22 },
  { id:'labirinto_armadilhas_wall_032', x:-18, z:-46, w:26, d:2 },
  { id:'labirinto_armadilhas_wall_033', x:-5, z:-35, w:2, d:22 },
  { id:'labirinto_armadilhas_wall_034', x:7, z:-24, w:24, d:2 },
  { id:'labirinto_armadilhas_wall_035', x:19, z:-35, w:2, d:22 },
  { id:'labirinto_armadilhas_wall_036', x:31, z:-45, w:24, d:2 },

  { id:'labirinto_armadilhas_wall_040', x:40, z:25, w:16, d:2 },
  { id:'labirinto_armadilhas_wall_041', x:43, z:-8, w:12, d:2 },
  { id:'labirinto_armadilhas_wall_042', x:7, z:33, w:8, d:2 },
  { id:'labirinto_armadilhas_wall_043', x:-39, z:-12, w:18, d:2 }
]);

export const TRAPS = Object.freeze([
  { id:'labirinto_armadilhas_trap_spikes_01', kind:'spikes', sector:1, x:-41, z:32, shape:'circle', radius:2.2, cycleMs:1800, activeFrom:.15, activeTo:.72 },
  { id:'labirinto_armadilhas_trap_floor_01', kind:'collapse-floor', sector:1, x:-26, z:35, shape:'box', w:5.0, d:4.0, cycleMs:3000, activeFrom:.50, activeTo:.92 },
  { id:'labirinto_armadilhas_trap_laser_01', kind:'laser', sector:1, x:-22, z:17, shape:'box', w:8.5, d:1.15, cycleMs:2100, activeFrom:.08, activeTo:.63 },

  { id:'labirinto_armadilhas_trap_saw_01', kind:'saw', sector:2, x:-39, z:-4, shape:'circle', radius:2.4, cycleMs:2200, activeFrom:0, activeTo:1 },
  { id:'labirinto_armadilhas_trap_crusher_01', kind:'crusher', sector:2, x:-25, z:-20, shape:'box', w:6.5, d:2.2, cycleMs:2600, activeFrom:.38, activeTo:.72 },
  { id:'labirinto_armadilhas_trap_spikes_02', kind:'spikes', sector:2, x:-13, z:-8, shape:'circle', radius:2.2, cycleMs:1700, activeFrom:.22, activeTo:.78 },
  { id:'labirinto_armadilhas_trap_rock_01', kind:'falling-rock', sector:2, x:-11, z:-20, shape:'circle', radius:2.6, cycleMs:2800, activeFrom:.62, activeTo:.92 },

  { id:'labirinto_armadilhas_trap_laser_02', kind:'laser', sector:3, x:4, z:4, shape:'box', w:1.15, d:9.0, cycleMs:1700, activeFrom:.10, activeTo:.70 },
  { id:'labirinto_armadilhas_trap_saw_02', kind:'saw', sector:3, x:14, z:2, shape:'circle', radius:2.4, cycleMs:1900, activeFrom:0, activeTo:1 },
  { id:'labirinto_armadilhas_trap_floor_02', kind:'collapse-floor', sector:3, x:25, z:11, shape:'box', w:5.0, d:4.5, cycleMs:2400, activeFrom:.48, activeTo:.95 },
  { id:'labirinto_armadilhas_trap_laser_03', kind:'laser', sector:3, x:24, z:-8, shape:'box', w:9.5, d:1.15, cycleMs:1550, activeFrom:.05, activeTo:.58 },

  { id:'labirinto_armadilhas_trap_spikes_03', kind:'spikes', sector:4, x:29, z:-22, shape:'circle', radius:2.35, cycleMs:1450, activeFrom:.18, activeTo:.84 },
  { id:'labirinto_armadilhas_trap_saw_03', kind:'saw', sector:4, x:39, z:-25, shape:'circle', radius:2.55, cycleMs:1750, activeFrom:0, activeTo:1 },
  { id:'labirinto_armadilhas_trap_crusher_02', kind:'crusher', sector:4, x:26, z:-37, shape:'box', w:7.0, d:2.4, cycleMs:2100, activeFrom:.28, activeTo:.70 },
  { id:'labirinto_armadilhas_trap_laser_04', kind:'laser', sector:4, x:38, z:-39, shape:'box', w:1.15, d:8.5, cycleMs:1350, activeFrom:.08, activeTo:.66 }
]);

export const PRESSURE_PLATES = Object.freeze([
  { id:'labirinto_armadilhas_plate_01', x:-20, z:31, radius:1.8, linkedTrapId:'labirinto_armadilhas_trap_laser_01' },
  { id:'labirinto_armadilhas_plate_02', x:20, z:15, radius:1.8, linkedTrapId:'labirinto_armadilhas_trap_floor_02' },
  { id:'labirinto_armadilhas_plate_03', x:34, z:-18, radius:1.8, linkedTrapId:'labirinto_armadilhas_trap_laser_04' }
]);

export const DECORATIONS = Object.freeze([
  { id:'labirinto_armadilhas_torch_01', kind:'torch', x:-45, z:39 },
  { id:'labirinto_armadilhas_torch_02', kind:'torch', x:-31, z:26 },
  { id:'labirinto_armadilhas_torch_03', kind:'torch', x:-14, z:8 },
  { id:'labirinto_armadilhas_torch_04', kind:'torch', x:12, z:-5 },
  { id:'labirinto_armadilhas_torch_05', kind:'torch', x:29, z:-21 },
  { id:'labirinto_armadilhas_torch_06', kind:'torch', x:43, z:-40 }
]);

export const ROUTE_POINTS = Object.freeze([
  [-43,43],[-39,31],[-31,22],[-22,17],[-39,-4],[-25,-20],[-14,-4],[-4,4],[14,2],[13,-9],[25,-15],[29,-22],[35,-31],[43,-43]
]);

export function getTrapPhase(trap, nowMs) {
  const cycle = Math.max(1, Number(trap.cycleMs) || 1);
  return ((Number(nowMs) || 0) % cycle) / cycle;
}

export function isTrapActive(trap, nowMs, forceActive = false) {
  if (forceActive) return true;
  const p = getTrapPhase(trap, nowMs);
  const from = Number(trap.activeFrom ?? 0);
  const to = Number(trap.activeTo ?? 1);
  return from <= to ? p >= from && p <= to : p >= from || p <= to;
}

export function pointHitsTrap(point, trap) {
  if (trap.shape === 'box') {
    return Math.abs(point.x - trap.x) <= trap.w / 2 && Math.abs(point.z - trap.z) <= trap.d / 2;
  }
  return Math.hypot(point.x - trap.x, point.z - trap.z) <= Number(trap.radius || 1);
}
