import { createColegioAgvLite } from '../colegio-agv-lite.js';
import { createColegioAgv3D } from '../colegio-agv3d.js';
import { MAP_ID, SCENE_ID, MAP_LABEL } from './colegio-agv-shared.js';

// Não registra o mapa globalmente. A integração central deve chamar esta função
// com o createWorldAdapter já existente no Core do AGV World.
export function createColegioAgvWorldAdapter(createWorldAdapter) {
  if (typeof createWorldAdapter !== 'function') {
    throw new TypeError('[colegio-agv] createWorldAdapter do Core é obrigatório.');
  }
  return createWorldAdapter({
    id: MAP_ID,
    scene: SCENE_ID,
    label: MAP_LABEL,
    createLite: createColegioAgvLite,
    create3D: createColegioAgv3D
  });
}
