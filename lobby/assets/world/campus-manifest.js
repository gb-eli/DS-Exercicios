export const DB_SCALE=20;
export const WORLD_X=40;
export const WORLD_Z=25;

export const CAMPUS_ZONE_LAYOUT=Object.freeze({
  '1ds':Object.freeze({
    building:Object.freeze([-27,0,-17]),
    buildingRotation:0,
    portal:Object.freeze([-13.2,0,-13.2]),
    portal2d:Object.freeze([-13.2,-12.8]),
    portalRotation:Math.PI/2,
    portalKind:'arch',
    liteBuilding:Object.freeze({x:-31,z:-17,w:17,h:9,door:Object.freeze([-23,-12.4])}),
    interiorOrigin:Object.freeze([-54,0,55]),
    exteriorEntrance:Object.freeze({x:-27,z:-11.95,rot:0})
  }),
  '2ds':Object.freeze({
    building:Object.freeze([27,0,-17]),
    buildingRotation:0,
    portal:Object.freeze([13.2,0,-13.2]),
    portal2d:Object.freeze([13.2,-12.8]),
    portalRotation:-Math.PI/2,
    portalKind:'arch',
    liteBuilding:Object.freeze({x:31,z:-17,w:17,h:9,door:Object.freeze([23,-12.4])}),
    interiorOrigin:Object.freeze([-18,0,55]),
    exteriorEntrance:Object.freeze({x:27,z:-11.95,rot:0})
  }),
  '3ds':Object.freeze({
    building:Object.freeze([-27,0,17]),
    buildingRotation:Math.PI,
    portal:Object.freeze([-13.2,0,13.2]),
    portal2d:Object.freeze([-13.2,12.8]),
    portalRotation:Math.PI/2,
    portalKind:'arch',
    liteBuilding:Object.freeze({x:-31,z:17,w:17,h:9,door:Object.freeze([-23,12.4])}),
    interiorOrigin:Object.freeze([18,0,55]),
    exteriorEntrance:Object.freeze({x:-27,z:11.95,rot:Math.PI})
  }),
  sub:Object.freeze({
    building:Object.freeze([27,0,17]),
    buildingRotation:Math.PI,
    portal:Object.freeze([13.2,0,13.2]),
    portal2d:Object.freeze([13.2,12.8]),
    portalRotation:-Math.PI/2,
    portalKind:'arch',
    liteBuilding:Object.freeze({x:31,z:17,w:17,h:9,door:Object.freeze([23,12.4])}),
    interiorOrigin:Object.freeze([54,0,55]),
    exteriorEntrance:Object.freeze({x:27,z:11.95,rot:Math.PI})
  })
});

export const CAMPUS_DECOR=Object.freeze({
  trees:Object.freeze([[-37,-7],[-37,6],[37,-7],[37,6],[-18,-22],[18,-22],[-18,22],[18,22],[-6,-19],[6,-19],[-6,19],[6,19]]),
  lamps:Object.freeze([[-8,-8],[8,-8],[-8,8],[8,8],[-20,0],[20,0],[0,-18],[0,18]]),
  benches:Object.freeze([[-8,0,.5],[8,0,-.5],[0,-8,0],[0,8,Math.PI/2]])
});

export const EXTERIOR_BUILDING_COLLIDERS=Object.freeze(Object.values(CAMPUS_ZONE_LAYOUT).map(layout=>{
  const [x,,z]=layout.building;
  return Object.freeze({minX:x-8.8,maxX:x+8.8,minZ:z-4.9,maxZ:z+4.9});
}));

export function clampWorld(value,min,max){return Math.max(min,Math.min(max,value));}
export function presenceToWorld(x,y){return{x:(Number(x||800)-800)/DB_SCALE,z:(Number(y||500)-500)/DB_SCALE};}
export function worldToPresence(x,z){return{x:Math.round(clampWorld(800+x*DB_SCALE,0,1600)),y:Math.round(clampWorld(500+z*DB_SCALE,0,1000))};}
export function areaAtWorld(x,z){return x<-11&&z<-6?'1ds':x>11&&z<-6?'2ds':x<-11&&z>6?'3ds':x>11&&z>6?'sub':'central';}
export function zoneLayout(key){return CAMPUS_ZONE_LAYOUT[key]||null;}
