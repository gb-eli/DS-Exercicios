import { MAP_BOUNDS, MAP_ID } from './colegio-agv-shared.js';
import { CAMPUS_BLOCKS, FENCES } from './colegio-agv-data.js';
import { getInteriorDefinition } from './colegio-agv-interiors.js';

function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
function clone(v) { return v == null ? v : JSON.parse(JSON.stringify(v)); }

const EXTERIOR_BLOCKERS = Object.freeze([
  ...CAMPUS_BLOCKS
    .filter((b) => b.facade !== 'open-corridor')
    .map((b) => Object.freeze({ id: `${b.id}_collision`, sourceId: b.id, x: b.x, z: b.z, width: b.width, depth: b.depth, kind: 'building' })),
  ...FENCES.map((f) => Object.freeze({ id: `${f.id}_collision`, sourceId: f.id, x: f.x, z: f.z, width: Math.max(f.width, 0.5), depth: Math.max(f.depth, 0.5), kind: 'fence' }))
]);

function insideRect(p, rect, radius = 0) {
  return Math.abs(p.x - rect.x) < rect.width / 2 + radius && Math.abs(p.z - rect.z) < rect.depth / 2 + radius;
}

function resolveAgainstRect(from, to, rect, radius) {
  if (!insideRect(to, rect, radius)) return to;
  const xOnly = { ...to, z: from.z };
  if (!insideRect(xOnly, rect, radius)) return xOnly;
  const zOnly = { ...to, x: from.x };
  if (!insideRect(zOnly, rect, radius)) return zOnly;
  return { ...from, blockedBy: rect.id };
}

export function getColegioAgvCollisionGeometry(activeInteriorId = null) {
  if (activeInteriorId) {
    const def = getInteriorDefinition(activeInteriorId);
    return def ? { worldId: MAP_ID, interiorId: activeInteriorId, bounds: { minX: -def.size.width / 2, maxX: def.size.width / 2, minZ: -def.size.depth / 2, maxZ: def.size.depth / 2 }, blockers: [] } : null;
  }
  return { worldId: MAP_ID, interiorId: null, bounds: clone(MAP_BOUNDS), blockers: EXTERIOR_BLOCKERS.map(clone) };
}

/**
 * Resolver geométrico do mapa; não executa física nem cria loop próprio.
 * O Core pode chamá-lo antes de aplicar o movimento do avatar/veículo.
 */
export function resolveColegioAgvMovement(from = {}, desired = {}, { radius = 0.42, activeInteriorId = null } = {}) {
  const start = { x: Number(from.x) || 0, y: Number(from.y) || 0, z: Number(from.z) || 0 };
  let next = { x: Number(desired.x) || 0, y: Number.isFinite(desired.y) ? desired.y : start.y, z: Number(desired.z) || 0 };
  if (activeInteriorId) {
    const def = getInteriorDefinition(activeInteriorId);
    if (!def) return { ...next, collided: false };
    const margin = Math.max(radius, 0.2);
    const before = { ...next };
    next.x = clamp(next.x, -def.size.width / 2 + margin, def.size.width / 2 - margin);
    next.z = clamp(next.z, -def.size.depth / 2 + margin, def.size.depth / 2 - margin);
    return { ...next, collided: next.x !== before.x || next.z !== before.z, space: 'interior' };
  }
  next.x = clamp(next.x, MAP_BOUNDS.minX + radius, MAP_BOUNDS.maxX - radius);
  next.z = clamp(next.z, MAP_BOUNDS.minZ + radius, MAP_BOUNDS.maxZ - radius);
  let blockedBy = null;
  for (const blocker of EXTERIOR_BLOCKERS) {
    const resolved = resolveAgainstRect(start, next, blocker, radius);
    if (resolved.blockedBy) blockedBy = resolved.blockedBy;
    next = resolved;
  }
  return { x: next.x, y: next.y, z: next.z, collided: Boolean(blockedBy) || next.x !== desired.x || next.z !== desired.z, blockedBy, space: 'exterior' };
}
