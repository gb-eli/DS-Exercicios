import { createWorldAdapter } from './core/world-adapter.js?v=14.10.8.96-f9411-graphics-streaming';
import { MAP_ID, SCENE_ID, MAP_LABEL } from './world/labirinto-armadilhas-shared.js';
import { createLabirintoArmadilhasLite } from './labirinto-armadilhas-lite.js';
import { createLabirintoArmadilhas3D } from './labirinto-armadilhas3d.js';

export const labirintoArmadilhasAdapter = createWorldAdapter({
  id: MAP_ID,
  scene: SCENE_ID,
  label: MAP_LABEL,
  createLite: createLabirintoArmadilhasLite,
  create3D: createLabirintoArmadilhas3D
});

export default labirintoArmadilhasAdapter;
