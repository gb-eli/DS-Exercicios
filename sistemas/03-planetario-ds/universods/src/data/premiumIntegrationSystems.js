export const PREMIUM_INTEGRATION_MODULES = ['launch-remaster','station-remaster','planetary-remaster','visual-museum'];

export const PREMIUM_MODULE_CONFIG = {
  'launch-remaster': {
    stageSelector:'#launch-remaster-stage',
    assetSelector:'[data-action="select-vehicle"].active',
    assetData:'vehicle',
    cameraSelector:'[data-action="select-camera"].active',
    cameraData:'camera',
    defaultAsset:'rocket'
  },
  'station-remaster': {
    stageSelector:'#station-remaster-stage',
    assetSelector:'[data-action="select-station"].active',
    assetData:'station',
    vehicleSelector:'[data-action="select-vehicle"].active',
    vehicleData:'vehicle',
    satelliteSelector:'[data-action="select-satellite"].active',
    satelliteData:'satellite',
    cameraSelector:'[data-action="select-camera"].active',
    cameraData:'camera',
    defaultAsset:'station'
  },
  'planetary-remaster': {
    stageSelector:'#planetary-remaster-stage',
    worldSelector:'[data-action="select-world"].active',
    worldData:'world',
    vehicleSelector:'[data-action="select-vehicle"].active',
    vehicleData:'vehicle',
    cameraSelector:'[data-action="select-camera"].active',
    cameraData:'camera',
    defaultAsset:'lander'
  },
  'visual-museum': {
    stageSelector:'#visual-museum-stage',
    assetSelector:'[data-action="select-exhibit"].active',
    assetData:'exhibit',
    cameraSelector:'[data-action="set-camera"].active',
    cameraData:'camera',
    defaultAsset:'shuttle'
  }
};

const LAUNCH_ASSET = {
  'aurora-l':'rocket',
  'atlas-h':'rocket',
  'phoenix-r':'rocket',
  'horizon-sts':'shuttle'
};

const STATION_VEHICLE_ASSET = {
  'crew-capsule':'capsule',
  'cargo-capsule':'capsule',
  'orbital-shuttle':'shuttle',
  'orbital-tug':'satellite'
};

const PLANETARY_ASSET = {
  astronaut:'suit',
  'lunar-rover':'rover',
  'mars-rover':'rover',
  'mars-drone':'satellite'
};

const MUSEUM_ASSET = {
  'saturn-class':'rocket',
  'reusable-booster':'rocket',
  'command-capsule':'capsule',
  'lunar-module':'lander',
  'space-shuttle':'shuttle',
  spacesuit:'suit',
  'mars-rover':'rover',
  'space-telescope':'satellite',
  'comms-satellite':'satellite',
  'deep-space-probe':'satellite',
  'modular-station':'station',
  'lunar-gateway':'station'
};

const CAMERA_PRESETS = {
  orbit:{ yaw:.62,pitch:-.12,distance:5.1,scale:1,offset:[0,0,0] },
  pad:{ yaw:.2,pitch:-.24,distance:6.2,scale:.92,offset:[0,-.18,0] },
  engine:{ yaw:2.8,pitch:.18,distance:3.7,scale:1.3,offset:[0,.38,0] },
  interior:{ yaw:.05,pitch:.03,distance:3.1,scale:1.2,offset:[0,0,0] },
  chase:{ yaw:.72,pitch:-.35,distance:6.5,scale:.9,offset:[0,-.1,0] },
  onboard:{ yaw:.1,pitch:-.02,distance:4.1,scale:1.05,offset:[0,0,0] },
  booster:{ yaw:2.5,pitch:-.12,distance:5.5,scale:1,offset:[0,0,0] },
  cinematic:{ yaw:1.2,pitch:-.2,distance:6.1,scale:.92,offset:[0,0,0] },
  'station-orbit':{ yaw:.7,pitch:-.22,distance:6.8,scale:.88,offset:[0,0,0] },
  'free-flight':{ yaw:.35,pitch:-.08,distance:5.3,scale:1,offset:[0,0,0] },
  cockpit:{ yaw:.04,pitch:.02,distance:3.3,scale:1.16,offset:[0,0,0] },
  cupola:{ yaw:.9,pitch:-.04,distance:4.8,scale:1.05,offset:[0,0,0] },
  eva:{ yaw:1.8,pitch:-.12,distance:5,scale:1,offset:[0,0,0] },
  'docking-port':{ yaw:.08,pitch:.01,distance:3.7,scale:1.12,offset:[0,0,0] },
  'robotic-arm':{ yaw:1.25,pitch:-.1,distance:5.1,scale:1,offset:[0,0,0] },
  'satellite-chase':{ yaw:.62,pitch:-.04,distance:4.4,scale:1.08,offset:[0,0,0] },
  'payload-bay':{ yaw:.2,pitch:.08,distance:3.8,scale:1.15,offset:[0,0,0] },
  'first-person':{ yaw:.05,pitch:.02,distance:3.5,scale:1.14,offset:[0,-.05,0] },
  'third-person':{ yaw:.8,pitch:-.16,distance:5.2,scale:1,offset:[0,0,0] },
  vehicle:{ yaw:.55,pitch:-.12,distance:4.7,scale:1.04,offset:[0,0,0] },
  module:{ yaw:.45,pitch:-.08,distance:4.6,scale:1.05,offset:[0,0,0] },
  'module-interior':{ yaw:.08,pitch:.01,distance:3.4,scale:1.16,offset:[0,0,0] },
  drone:{ yaw:.75,pitch:-.24,distance:4.4,scale:1.02,offset:[0,0,0] },
  walk:{ yaw:.3,pitch:-.08,distance:5.6,scale:.96,offset:[0,0,0] }
};

export function resolvePremiumIntegration(moduleId,state={}){
  if(moduleId==='launch-remaster'){const assetId=LAUNCH_ASSET[state.assetKey]||'rocket',cameraKey=state.cameraKey||'orbit',animation=assetId==='shuttle'?(cameraKey==='interior'?'cargo-bay':'landing-gear'):(cameraKey==='booster'?'stage-separation':cameraKey==='engine'?'gimbal-1':'idle');return{assetId,camera:CAMERA_PRESETS[cameraKey]||CAMERA_PRESETS.orbit,animation};}
  if(moduleId==='station-remaster'){
    const camera=state.cameraKey||'station-orbit';
    let assetId='station';
    if(camera==='satellite-chase')assetId='satellite';
    else if(['cockpit','free-flight','docking-port','payload-bay'].includes(camera))assetId=STATION_VEHICLE_ASSET[state.vehicleKey]||'capsule';
    const animation=assetId==='station'?(camera==='robotic-arm'?'arm-capture':'solar-track'):assetId==='satellite'?'scan':assetId==='capsule'?'solar-deploy':assetId==='shuttle'?'cargo-bay':null;return {assetId,camera:CAMERA_PRESETS[camera]||CAMERA_PRESETS['station-orbit'],animation};
  }
  if(moduleId==='planetary-remaster'){
    const camera=state.cameraKey||'third-person';
    let assetId=PLANETARY_ASSET[state.vehicleKey]||'rover';
    if(state.worldKey==='moon'&&['module-interior','cockpit'].includes(camera))assetId='lander';
    if(state.worldKey==='moon'&&state.vehicleKey==='astronaut'&&camera==='orbit')assetId='lander';
    const animation=assetId==='rover'?(camera==='vehicle'?'drive':'arm-sample'):assetId==='suit'?'wave':assetId==='lander'?'hatch':assetId==='satellite'?'scan':null;return {assetId,camera:CAMERA_PRESETS[camera]||CAMERA_PRESETS['third-person'],animation};
  }
  if(moduleId==='visual-museum'){const assetId=MUSEUM_ASSET[state.assetKey]||'shuttle',animation={rocket:'stage-separation',shuttle:'cargo-bay',capsule:'hatch',lander:'gear-deploy',suit:'wave',rover:'arm-sample',satellite:'deploy',station:'solar-track'}[assetId];return{assetId,camera:CAMERA_PRESETS[state.cameraKey]||CAMERA_PRESETS.orbit,animation};}
  return {assetId:'shuttle',camera:CAMERA_PRESETS.orbit};
}
