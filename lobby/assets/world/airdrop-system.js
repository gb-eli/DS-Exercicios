export const AIRDROP_CONFIG=Object.freeze({
  altitude:96,
  leadMs:3000,
  flightMs:28000,
  sessionMs:70000,
  autoDeployAltitude:24,
  freefallSpeed:24,
  parachuteSpeed:6.8,
  glideSpeed:12,
  steerRate:2.2,
  proxyDistrictAltitude:65,
  prefetchAltitude:56,
  proxyFullAltitude:34,
  route:Object.freeze({from:Object.freeze({x:-72,z:-28}),to:Object.freeze({x:72,z:28})})
});
const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
const finite=(value,fallback)=>{const n=Number(value);return Number.isFinite(n)?n:fallback;};
export function normalizeAirdropSession(input={}){
  const startedAt=finite(input.startedAt??input.started_at,Date.now()+AIRDROP_CONFIG.leadMs);
  return Object.freeze({
    id:String(input.id||input.session_id||''),
    startedAt,
    altitude:clamp(finite(input.altitude,AIRDROP_CONFIG.altitude),55,150),
    flightMs:clamp(finite(input.flightMs??input.flight_ms,AIRDROP_CONFIG.flightMs),16000,45000),
    from:Object.freeze({x:clamp(finite(input.from?.x??input.from_x,AIRDROP_CONFIG.route.from.x),-90,90),z:clamp(finite(input.from?.z??input.from_z,AIRDROP_CONFIG.route.from.z),-60,60)}),
    to:Object.freeze({x:clamp(finite(input.to?.x??input.to_x,AIRDROP_CONFIG.route.to.x),-90,90),z:clamp(finite(input.to?.z??input.to_z,AIRDROP_CONFIG.route.to.z),-60,60)})
  });
}
export function sampleAirdropPlane(sessionInput,nowMs=Date.now()){
  const session=normalizeAirdropSession(sessionInput),raw=(Number(nowMs)-session.startedAt)/session.flightMs,t=clamp(raw,0,1),x=session.from.x+(session.to.x-session.from.x)*t,z=session.from.z+(session.to.z-session.from.z)*t,heading=Math.atan2(session.to.x-session.from.x,session.to.z-session.from.z);
  return{x,z,y:session.altitude,heading,progress:t,active:raw>=0&&raw<=1,departed:raw>1,pending:raw<0};
}
export function airdropDetailLevel(altitude){const y=Number(altitude)||0;return y>AIRDROP_CONFIG.proxyDistrictAltitude?'overview':y>AIRDROP_CONFIG.proxyFullAltitude?'district':'full';}
export function airdropDescentRate(mode){return mode==='parachute'?AIRDROP_CONFIG.parachuteSpeed:AIRDROP_CONFIG.freefallSpeed;}
export function shouldAutoDeploy(altitude){return Number(altitude)<=AIRDROP_CONFIG.autoDeployAltitude;}
export function clampAirdropPosition(x,z,{minX=null,maxX=null,minZ=null,maxZ=null,worldX=56,worldZ=38,margin=1}={}){const mx=minX!==null&&Number.isFinite(Number(minX))?Number(minX):-Math.abs(finite(worldX,56))+finite(margin,1),Mx=maxX!==null&&Number.isFinite(Number(maxX))?Number(maxX):Math.abs(finite(worldX,56))-finite(margin,1),mz=minZ!==null&&Number.isFinite(Number(minZ))?Number(minZ):-Math.abs(finite(worldZ,38))+finite(margin,1),Mz=maxZ!==null&&Number.isFinite(Number(maxZ))?Number(maxZ):Math.abs(finite(worldZ,38))-finite(margin,1);return{x:clamp(finite(x,0),mx,Mx),z:clamp(finite(z,0),mz,Mz)};}
