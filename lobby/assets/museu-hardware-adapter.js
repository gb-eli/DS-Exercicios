import { createWorldAdapter } from './core/world-adapter.js?v=14.10.8.96-f945-world-audit';
import { createMuseuHardwareLite } from './museu-hardware-lite.js?v=0.8.0';
import { createMuseuHardware3D } from './museu-hardware3d.js?v=14.10.8.95-f93-special-graphics';

export const MUSEU_HARDWARE_WORLD_ADAPTER=createWorldAdapter({
  id:'museu-hardware-agv',
  scene:'museu-hardware',
  label:'Museu do Hardware AGV',
  createLite:createMuseuHardwareLite,
  create3D:createMuseuHardware3D
});
