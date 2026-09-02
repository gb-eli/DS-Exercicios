import { createWorldAdapter } from './core/world-adapter.js?v=14.10.8.96-f948-camera-v2';
import { createMuseuHardwareLite } from './museu-hardware-lite.js?v=14.10.8.96-f948-camera-v2';
import { createMuseuHardware3D } from './museu-hardware3d.js?v=14.10.8.96-f948-camera-v2';

export const MUSEU_HARDWARE_WORLD_ADAPTER=createWorldAdapter({
  id:'museu-hardware-agv',
  scene:'museu-hardware',
  label:'Museu do Hardware AGV',
  createLite:createMuseuHardwareLite,
  create3D:createMuseuHardware3D
});
