const freezePoint=([x,z])=>Object.freeze({x:Number(x),z:Number(z)});
const freezeRoute=item=>Object.freeze({...item,nodes:Object.freeze(item.nodes.map(freezePoint))});

// Etapa 12 — malha viária única. Mais larga, com anel externo e calçadas contínuas.
export const CAMPUS_ROAD_HIERARCHY=Object.freeze([
  freezeRoute({id:'arterial-north',name:'Avenida Acadêmica',class:'arterial',width:6.8,sidewalk:1.35,accent:'#36d2ff',nodes:[[0,10],[0,18],[0,24],[0,30]]}),
  freezeRoute({id:'arterial-south',name:'Avenida Vale AGV',class:'arterial',width:7.0,sidewalk:1.4,accent:'#51e7a3',nodes:[[0,-10],[0,-18],[0,-24],[0,-30]]}),
  freezeRoute({id:'arterial-west',name:'Avenida Tech Oeste',class:'arterial',width:6.4,sidewalk:1.3,accent:'#ff7fd5',nodes:[[-10,0],[-20,0],[-32,0],[-44,0],[-49,0]]}),
  freezeRoute({id:'arterial-east',name:'Avenida Inovação',class:'arterial',width:6.4,sidewalk:1.3,accent:'#61e7a6',nodes:[[10,0],[20,0],[32,0],[44,0],[49,0]]}),
  freezeRoute({id:'collector-north',name:'Anel Norte',class:'collector',width:4.8,sidewalk:1.0,accent:'#8fdcf3',nodes:[[-44,24],[0,24],[44,24]]}),
  freezeRoute({id:'collector-south',name:'Anel Sul',class:'collector',width:4.8,sidewalk:1.0,accent:'#ffae63',nodes:[[-44,-24],[0,-24],[44,-24]]}),
  freezeRoute({id:'collector-west',name:'Anel Oeste',class:'collector',width:4.6,sidewalk:.95,accent:'#ff7fd5',nodes:[[-44,-24],[-44,0],[-44,24]]}),
  freezeRoute({id:'collector-east',name:'Anel Leste',class:'collector',width:4.6,sidewalk:.95,accent:'#61e7a6',nodes:[[44,-24],[44,0],[44,24]]}),
  freezeRoute({id:'service-civic',name:'Via Cívica',class:'service',width:3.2,sidewalk:.75,accent:'#d5f5ff',nodes:[[-18,30],[0,30],[18,30]]}),
  freezeRoute({id:'service-mobility',name:'Via de Avaliação',class:'service',width:3.2,sidewalk:.75,accent:'#ffcc8a',nodes:[[-21,-30],[0,-30],[21,-30]]})
]);

export const CAMPUS_THEME_PLAZAS=Object.freeze([
  Object.freeze({id:'plaza-academic',name:'Praça Acadêmica',x:0,z:19.5,radius:5.6,accent:'#36d2ff',icon:'⌘',detail:'Plataforma • salas • serviços'}),
  Object.freeze({id:'plaza-civic',name:'Praça Cívica',x:0,z:29.3,radius:4.3,accent:'#61e7a6',icon:'◇',detail:'Banco • loja • hub'}),
  Object.freeze({id:'plaza-gamer',name:'Praça Gamer',x:-18.0,z:0,radius:5.0,accent:'#ff7fd5',icon:'✦',detail:'Fliperama • CTF • torre'}),
  Object.freeze({id:'plaza-innovation',name:'Praça da Inovação',x:18.0,z:0,radius:5.0,accent:'#61e7a6',icon:'⬡',detail:'COSMOS • desafios • tecnologia'}),
  Object.freeze({id:'plaza-mobility',name:'Praça da Mobilidade',x:0,z:-19.5,radius:5.0,accent:'#ffae63',icon:'⇄',detail:'Provas • estações • Vale'})
]);

export const CAMPUS_GARAGES=Object.freeze([
  Object.freeze({id:'garage-west',name:'Garagem Tech Oeste',x:-39,z:-9.5,w:8.4,d:4.8,capacity:8,accent:'#ff7fd5'}),
  Object.freeze({id:'garage-east',name:'Garagem Inovação Leste',x:39,z:9.5,w:8.4,d:4.8,capacity:8,accent:'#61e7a6'}),
  Object.freeze({id:'garage-south',name:'Garagem Mobilidade',x:31,z:-30,w:9.0,d:4.0,capacity:10,accent:'#ffae63'})
]);

export const CAMPUS_CROSSWALKS=Object.freeze([
  Object.freeze({id:'cross-north',x:0,z:11.5,w:6.8,d:2.7,axis:'x'}),
  Object.freeze({id:'cross-south',x:0,z:-11.5,w:7.0,d:2.7,axis:'x'}),
  Object.freeze({id:'cross-west',x:-11.5,z:0,w:2.7,d:6.4,axis:'z'}),
  Object.freeze({id:'cross-east',x:11.5,z:0,w:2.7,d:6.4,axis:'z'}),
  Object.freeze({id:'cross-ring-north',x:0,z:24,w:6.8,d:2.7,axis:'x'}),
  Object.freeze({id:'cross-ring-south',x:0,z:-24,w:7.0,d:2.7,axis:'x'}),
  Object.freeze({id:'cross-vale',x:0,z:-28.2,w:7.0,d:2.7,axis:'x'})
]);

export const CAMPUS_PEDESTRIAN_BRIDGES=Object.freeze([
  Object.freeze({id:'bridge-west-central',name:'Passarela Oeste',x:-24,z:0,axis:'z',length:8.2,width:1.8,height:1.45,rampLength:4.2,accent:'#ff7fd5'}),
  Object.freeze({id:'bridge-east-central',name:'Passarela Leste',x:24,z:0,axis:'z',length:8.2,width:1.8,height:1.45,rampLength:4.2,accent:'#61e7a6'})
]);

const bridgeSurfaces=[];
for(const bridge of CAMPUS_PEDESTRIAN_BRIDGES){
  const steps=8;
  if(bridge.axis==='z'){
    bridgeSurfaces.push(Object.freeze({id:`${bridge.id}-deck`,type:'bridge',x:bridge.x,z:bridge.z,w:bridge.width,d:bridge.length,h:bridge.height}));
    for(const side of[-1,1])for(let i=0;i<steps;i++){
      const t=(steps-i)/steps,h=bridge.height*t;
      bridgeSurfaces.push(Object.freeze({id:`${bridge.id}-ramp-${side}-${i}`,type:'ramp',x:bridge.x,z:bridge.z+side*(bridge.length/2+(i+.5)*(bridge.rampLength/steps)),w:bridge.width,d:bridge.rampLength/steps+.08,h}));
    }
  }else{
    bridgeSurfaces.push(Object.freeze({id:`${bridge.id}-deck`,type:'bridge',x:bridge.x,z:bridge.z,w:bridge.length,d:bridge.width,h:bridge.height}));
    for(const side of[-1,1])for(let i=0;i<steps;i++){
      const t=(steps-i)/steps,h=bridge.height*t;
      bridgeSurfaces.push(Object.freeze({id:`${bridge.id}-ramp-${side}-${i}`,type:'ramp',x:bridge.x+side*(bridge.length/2+(i+.5)*(bridge.rampLength/steps)),z:bridge.z,w:bridge.rampLength/steps+.08,d:bridge.width,h}));
    }
  }
}
export const CAMPUS_PEDESTRIAN_SURFACES=Object.freeze(bridgeSurfaces);

export const CAMPUS_STATION_PROFILES=Object.freeze({
  central:Object.freeze({name:'Praça Central',code:'CEN',type:'interchange',accent:'#36d2ff',district:'Núcleo Central'}),
  '1ds':Object.freeze({name:'Pesquisa / 1DS',code:'PES',type:'district',accent:'#36d2ff',district:'Distrito Pesquisa'}),
  parkour:Object.freeze({name:'Arena Parkour',code:'ARK',type:'recreation',accent:'#ff6b7a',district:'Praça Gamer'}),
  '3ds':Object.freeze({name:'Cyber / 3DS',code:'CYB',type:'district',accent:'#b58cff',district:'Distrito Cyber'}),
  pool:Object.freeze({name:'Convivência',code:'CNV',type:'recreation',accent:'#43d9ff',district:'Piscina Neon'}),
  sub:Object.freeze({name:'Inovação / SUB',code:'INO',type:'district',accent:'#ffae63',district:'Distrito Inovação'}),
  vale:Object.freeze({name:'Terminal Vale AGV',code:'VAL',type:'terminal',accent:'#51e7a3',district:'Eixo Vale do Silício'}),
  '2ds':Object.freeze({name:'Ciência / 2DS',code:'CIE',type:'district',accent:'#51e7a3',district:'Distrito Ciência'})
});

export const CAMPUS_VALE_MONUMENTAL_LINK=Object.freeze({
  id:'vale-causeway',name:'Eixo Monumental Campus ↔ Vale',accent:'#51e7a3',width:7.2,
  nodes:Object.freeze([[0,-10],[0,-14],[0,-18],[0,-22],[0,-26],[0,-30.5]].map(freezePoint)),
  arches:Object.freeze([-17.2,-22.2,-27.2,-30.5]),
  skylineZ:-35.5
});

export const CAMPUS_CITY_LANDMARKS=Object.freeze([
  ...CAMPUS_THEME_PLAZAS.map(item=>Object.freeze({id:item.id,name:item.name,x:item.x,z:item.z,kind:'plaza'})),
  ...CAMPUS_GARAGES.map(item=>Object.freeze({id:item.id,name:item.name,x:item.x,z:item.z,kind:'garage'})),
  ...CAMPUS_PEDESTRIAN_BRIDGES.map(item=>Object.freeze({id:item.id,name:item.name,x:item.x,z:item.z,kind:'bridge'})),
  Object.freeze({id:'vale-causeway',name:'Eixo Monumental do Vale',x:0,z:-25,kind:'landmark'})
]);
