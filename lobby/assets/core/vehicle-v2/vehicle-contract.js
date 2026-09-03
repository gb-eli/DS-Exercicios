export const VEHICLE_CORE_VERSION=2;
export const VEHICLE_MOBILITY=Object.freeze({GROUND:'ground',AERIAL:'aerial'});
export const VEHICLE_ROLES=Object.freeze({DRIVER:'driver',PASSENGER:'passenger',REMOTE_PASSENGER:'network-passenger',AMBIENT:'ambient'});
export const VEHICLE_PHASES=Object.freeze(['parked','occupied','driving','flying','guided','remote','disabled']);
export const VEHICLE_KINDS=Object.freeze(['car','van','bus','bike','motorcycle','rover','helicopter','drone','utility']);

const KIND_DEFAULTS=Object.freeze({
  car:{maxSpeedKmh:34,reverseSpeedKmh:14,acceleration:4.6,reverseAcceleration:3,brake:7.8,coast:1.35,steerRate:1.55,collisionRadius:1.02},
  van:{maxSpeedKmh:32,reverseSpeedKmh:12,acceleration:3.8,reverseAcceleration:2.6,brake:7,coast:1.25,steerRate:1.34,collisionRadius:1.3},
  bus:{maxSpeedKmh:28,reverseSpeedKmh:9,acceleration:3.1,reverseAcceleration:2.2,brake:6.2,coast:1.05,steerRate:1.08,collisionRadius:1.55},
  bike:{maxSpeedKmh:30,reverseSpeedKmh:6,acceleration:5.4,reverseAcceleration:2.1,brake:8.5,coast:1.5,steerRate:1.78,collisionRadius:.62},
  motorcycle:{maxSpeedKmh:42,reverseSpeedKmh:7,acceleration:6.1,reverseAcceleration:2.4,brake:9.2,coast:1.45,steerRate:1.9,collisionRadius:.7},
  rover:{maxSpeedKmh:30,reverseSpeedKmh:12,acceleration:3.4,reverseAcceleration:2.4,brake:6.8,coast:1.0,steerRate:1.35,collisionRadius:1.15},
  helicopter:{maxSpeedKmh:72,reverseSpeedKmh:20,acceleration:5,reverseAcceleration:2.6,brake:7.5,coast:1.1,steerRate:1.18,collisionRadius:2.35,maxAltitude:34,climbRate:6.5},
  drone:{maxSpeedKmh:54,reverseSpeedKmh:16,acceleration:5.8,reverseAcceleration:3.2,brake:8.2,coast:1.1,steerRate:1.42,collisionRadius:1.35,maxAltitude:28,climbRate:7.2},
  utility:{maxSpeedKmh:26,reverseSpeedKmh:10,acceleration:3.3,reverseAcceleration:2.2,brake:6.5,coast:1.1,steerRate:1.28,collisionRadius:1.2}
});

const PRESET_FACTORS=Object.freeze({tour:.72,normal:1,sport:1.28});
const clamp=(v,a,b)=>Math.max(a,Math.min(b,Number(v)||0));

export function vehicleKindDefaults(kind='car'){return Object.freeze({...KIND_DEFAULTS[kind]||KIND_DEFAULTS.car});}
export function vehiclePresetFactor(preset='normal'){return PRESET_FACTORS[preset]||1;}

export function normalizeVehicleDefinition(definition={},overrides={}){
  const raw={...definition,...overrides},kind=VEHICLE_KINDS.includes(raw.kind)?raw.kind:'utility',mobilityType=raw.mobilityType==='aerial'||kind==='helicopter'||kind==='drone'?'aerial':'ground',defaults=KIND_DEFAULTS[kind]||KIND_DEFAULTS.utility;
  const seatCapacity=Math.max(1,Math.round(Number(raw.seatCapacity??raw.capacity??(kind==='bus'?8:kind==='van'?4:kind==='bike'||kind==='motorcycle'?1:2))||1));
  const maxSpeedKmh=Math.max(4,Number(raw.maxSpeedKmh)||defaults.maxSpeedKmh);
  return Object.freeze({...raw,id:String(raw.id||`vehicle-${kind}`),name:String(raw.name||raw.label||'Veículo AGV'),kind,mobilityType,seatCapacity,maxSpeedKmh,reverseSpeedKmh:Math.max(0,Number(raw.reverseSpeedKmh)||defaults.reverseSpeedKmh),acceleration:Math.max(.1,Number(raw.acceleration)||defaults.acceleration),reverseAcceleration:Math.max(.1,Number(raw.reverseAcceleration)||defaults.reverseAcceleration),brake:Math.max(.1,Number(raw.brake)||defaults.brake),coast:Math.max(.05,Number(raw.coast)||defaults.coast),steerRate:Math.max(.05,Number(raw.steerRate)||defaults.steerRate),collisionRadius:Math.max(.2,Number(raw.collisionRadius)||defaults.collisionRadius),maxAltitude:mobilityType==='aerial'?Math.max(4,Number(raw.maxAltitude)||defaults.maxAltitude||28):0,climbRate:mobilityType==='aerial'?Math.max(.5,Number(raw.climbRate)||defaults.climbRate||6):0});
}

export function vehicleSpeedLimitMps(definition,preset='normal',externalLimitKmh=null){
  const def=normalizeVehicleDefinition(definition),requested=def.maxSpeedKmh*vehiclePresetFactor(preset),limit=Number(externalLimitKmh)>0?Math.min(requested,Number(externalLimitKmh)):requested;return limit/3.6;
}

export function createVehiclePose({x=0,y=0,z=0,heading=0}={}){return{x:Number(x)||0,y:Number(y)||0,z:Number(z)||0,heading:Number(heading)||0};}
export function normalizeVehicleInput(input={}){return{throttle:clamp(input.throttle,-1,1),steer:clamp(input.steer,-1,1),brake:!!input.brake,climb:clamp(input.climb,-1,1)};}

export function vehicleRuntimeCapabilities(definition={}){
  const def=normalizeVehicleDefinition(definition);return Object.freeze({driver:true,passenger:def.seatCapacity>1,aerial:def.mobilityType==='aerial',ground:def.mobilityType==='ground',networkReady:true,rapierReady:false,cameraProfile:def.mobilityType==='aerial'?'aerial':'vehicle'});
}
