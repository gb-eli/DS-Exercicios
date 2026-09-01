export const MAP_ID = 'labirinto-armadilhas';
export const SCENE_ID = 'labyrinth-traps';
export const MAP_VERSION = '1.1.0';
export const BASE_AGV_WORLD = '14.10.8.73';
export const MAP_LABEL = 'Labirinto com Armadilhas';

export const MAP_BOUNDS = Object.freeze({ minX: -50, maxX: 50, minZ: -50, maxZ: 50 });
export const MAP_SPAWN_ID = 'labirinto_armadilhas_spawn';
export const MAP_SPAWN = Object.freeze({ x: -43, y: 0, z: 43 });

export const MAP_RETURN_PORTAL = Object.freeze({
  id: 'labirinto_armadilhas_portal_lobby',
  type: 'world-portal',
  name: 'Portal do Lobby',
  label: 'Voltar ao Lobby',
  x: -45,
  z: 45,
  radius: 3.4,
  interaction: 'return-to-lobby',
  targetWorldId: 'campus-ds',
  targetSpawn: 'default'
});

export const LABYRINTH_RULES = Object.freeze({
  startingLives: 5,
  maxLives: 5,
  trapDamage: 1,
  invulnerabilityMs: 1350,
  checkpointScore: 250,
  finishScore: 2500,
  lifeBonusScore: 500,
  scorePerSecondUnderPar: 12,
  parTimeSeconds: 240,
  xpBaseFinish: 350,
  xpPerRemainingLife: 60,
  xpCheckpoint: 40,
  xpNoDeathBonus: 300,
  xpDefeat: 0,
  xpGiveUp: 0,
  requireSequentialCheckpoints: true
});

export const CHECKPOINTS = Object.freeze([
  { id:'labirinto_armadilhas_cp_01', order:1, label:'Checkpoint 01', sector:1, x:-31, z:22, radius:2.6, color:'#27b7ff' },
  { id:'labirinto_armadilhas_cp_02', order:2, label:'Checkpoint 02', sector:2, x:-14, z:-4, radius:2.6, color:'#c05cff' },
  { id:'labirinto_armadilhas_cp_03', order:3, label:'Checkpoint 03', sector:3, x:13, z:-9, radius:2.6, color:'#46e56d' },
  { id:'labirinto_armadilhas_cp_04', order:4, label:'Checkpoint 04', sector:4, x:35, z:-31, radius:2.6, color:'#ffd64a' }
]);

export const FINISH_ZONE = Object.freeze({
  id: 'labirinto_armadilhas_finish',
  label: 'Chegada',
  x: 43,
  z: -43,
  radius: 3.6
});

export const SECTORS = Object.freeze([
  { id:'labirinto_armadilhas_sector_01', order:1, label:'Setor 1 — Aquecimento', minX:-48, maxX:-16, minZ:8, maxZ:48 },
  { id:'labirinto_armadilhas_sector_02', order:2, label:'Setor 2 — Reflexo', minX:-48, maxX:0, minZ:-24, maxZ:12 },
  { id:'labirinto_armadilhas_sector_03', order:3, label:'Setor 3 — Sincronização', minX:-2, maxX:30, minZ:-24, maxZ:28 },
  { id:'labirinto_armadilhas_sector_04', order:4, label:'Setor 4 — Final', minX:16, maxX:48, minZ:-48, maxZ:4 }
]);

export const DESTINATIONS = Object.freeze([
  { id:'labirinto_armadilhas_dest_inicio', name:'Entrada do Labirinto', x:MAP_SPAWN.x, z:MAP_SPAWN.z, kind:'spawn', district:'Labirinto' },
  ...CHECKPOINTS.map(cp => ({ id:`${cp.id}_dest`, name:cp.label, x:cp.x, z:cp.z, kind:'checkpoint', district:cp.label })),
  { id:'labirinto_armadilhas_dest_chegada', name:'Chegada', x:FINISH_ZONE.x, z:FINISH_ZONE.z, kind:'challenge-finish', district:'Labirinto' }
]);

export function clampToBounds(position) {
  return {
    x: Math.max(MAP_BOUNDS.minX, Math.min(MAP_BOUNDS.maxX, Number(position?.x) || 0)),
    y: Number(position?.y) || 0,
    z: Math.max(MAP_BOUNDS.minZ, Math.min(MAP_BOUNDS.maxZ, Number(position?.z) || 0))
  };
}

export function distance2D(a, b) {
  const dx = (Number(a?.x) || 0) - (Number(b?.x) || 0);
  const dz = (Number(a?.z) || 0) - (Number(b?.z) || 0);
  return Math.hypot(dx, dz);
}

export function getSectorForPosition(position) {
  if (!position) return null;
  return SECTORS.find(s => position.x >= s.minX && position.x <= s.maxX && position.z >= s.minZ && position.z <= s.maxZ) || null;
}
