export const DB_SCALE=20;
// Etapa 12 — masterplan: campus ampliado para separar circulação, prédios e lazer.
export const WORLD_X=56;
export const WORLD_Z=38;

export const CAMPUS_ZONE_LAYOUT=Object.freeze({
  '1ds':Object.freeze({
    building:Object.freeze([-30,0,-18]),
    buildingRotation:0,
    portal:Object.freeze([-17.5,0,-12.4]),
    portal2d:Object.freeze([-17.5,-12.4]),
    portalRotation:Math.PI/2,
    portalKind:'arch',
    liteBuilding:Object.freeze({x:-30,z:-18,w:17,h:9,door:Object.freeze([-30,-12.8])}),
    interiorOrigin:Object.freeze([-54,0,55]),
    exteriorEntrance:Object.freeze({x:-30,z:-12.8,rot:0})
  }),
  '2ds':Object.freeze({
    building:Object.freeze([30,0,-18]),
    buildingRotation:0,
    portal:Object.freeze([17.5,0,-12.4]),
    portal2d:Object.freeze([17.5,-12.4]),
    portalRotation:-Math.PI/2,
    portalKind:'arch',
    liteBuilding:Object.freeze({x:30,z:-18,w:17,h:9,door:Object.freeze([30,-12.8])}),
    interiorOrigin:Object.freeze([-18,0,55]),
    exteriorEntrance:Object.freeze({x:30,z:-12.8,rot:0})
  }),
  '3ds':Object.freeze({
    building:Object.freeze([-30,0,18]),
    buildingRotation:Math.PI,
    portal:Object.freeze([-17.5,0,12.4]),
    portal2d:Object.freeze([-17.5,12.4]),
    portalRotation:Math.PI/2,
    portalKind:'arch',
    liteBuilding:Object.freeze({x:-30,z:18,w:17,h:9,door:Object.freeze([-30,12.8])}),
    interiorOrigin:Object.freeze([18,0,55]),
    exteriorEntrance:Object.freeze({x:-30,z:12.8,rot:Math.PI})
  }),
  sub:Object.freeze({
    building:Object.freeze([30,0,18]),
    buildingRotation:Math.PI,
    portal:Object.freeze([17.5,0,12.4]),
    portal2d:Object.freeze([17.5,12.4]),
    portalRotation:-Math.PI/2,
    portalKind:'arch',
    liteBuilding:Object.freeze({x:30,z:18,w:17,h:9,door:Object.freeze([30,12.8])}),
    interiorOrigin:Object.freeze([54,0,55]),
    exteriorEntrance:Object.freeze({x:30,z:12.8,rot:Math.PI})
  })
});

// Vegetação e mobiliário ficam nas bordas e praças, liberando os eixos de circulação.
export const CAMPUS_DECOR=Object.freeze({
  trees:Object.freeze([[-49,-15],[-49,15],[49,-15],[49,15],[-38,-31],[38,-31],[-38,31],[38,31],[-20,-31],[20,-31],[-20,31],[20,31]]),
  lamps:Object.freeze([[-10,-10],[10,-10],[-10,10],[10,10],[-24,0],[24,0],[0,-22],[0,22]]),
  benches:Object.freeze([[-8,0,.5],[8,0,-.5],[0,-8,0],[0,8,Math.PI/2]])
});

export const EXTERIOR_BUILDING_COLLIDERS=Object.freeze(Object.values(CAMPUS_ZONE_LAYOUT).map(layout=>{
  const [x,,z]=layout.building;
  return Object.freeze({minX:x-8.8,maxX:x+8.8,minZ:z-4.9,maxZ:z+4.9});
}));

export function clampWorld(value,min,max){return Math.max(min,Math.min(max,value));}
export function presenceToWorld(x,y){return{x:(Number(x||800)-800)/DB_SCALE,z:(Number(y||500)-500)/DB_SCALE};}
export function worldToPresence(x,z){return{x:Math.round(clampWorld(800+x*DB_SCALE,0,1600)),y:Math.round(clampWorld(500+z*DB_SCALE,0,1000))};}
export function areaAtWorld(x,z){return x<-14&&z<-8?'1ds':x>14&&z<-8?'2ds':x<-14&&z>8?'3ds':x>14&&z>8?'sub':'central';}
export function zoneLayout(key){return CAMPUS_ZONE_LAYOUT[key]||null;}
