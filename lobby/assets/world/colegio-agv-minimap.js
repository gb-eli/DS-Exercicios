import { MAP_BOUNDS, MAP_ID, MAP_RETURN_PORTAL, DESTINATIONS } from './colegio-agv-shared.js';
import { CAMPUS_BLOCKS, ROOM_ZONES, OUTDOOR_FEATURES, EXPANSION_2026_FEATURES } from './colegio-agv-data.js';

export function getColegioAgvMinimapData({ includeExpansion = false } = {}) {
  return {
    worldId: MAP_ID,
    bounds: { ...MAP_BOUNDS },
    portal: { ...MAP_RETURN_PORTAL },
    destinations: DESTINATIONS.map((item) => ({ ...item })),
    buildings: CAMPUS_BLOCKS.map((item) => ({ id: item.id, name: item.name, x: item.x, z: item.z, width: item.width, depth: item.depth })),
    rooms: ROOM_ZONES.map((item) => ({ id: item.id, name: item.name, x: item.x, z: item.z, width: item.width, depth: item.depth, door: { ...item.door }, interiorId: item.interiorId })),
    features: OUTDOOR_FEATURES.map((item) => ({ id: item.id, name: item.name, kind: item.kind, x: item.x, z: item.z, width: item.width, depth: item.depth })),
    expansion: includeExpansion ? EXPANSION_2026_FEATURES.map((item) => ({ ...item })) : []
  };
}
