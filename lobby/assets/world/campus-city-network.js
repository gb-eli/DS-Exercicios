const freezePoint=([x,z])=>Object.freeze({x:Number(x),z:Number(z)});
const freezeRoute=item=>Object.freeze({...item,nodes:Object.freeze(item.nodes.map(freezePoint))});

export const CAMPUS_ROAD_HIERARCHY=Object.freeze([
  freezeRoute({id:'arterial-north',name:'Avenida Acadêmica',class:'arterial',width:5.4,sidewalk:1.05,accent:'#36d2ff',nodes:[[0,10.5],[0,17.2],[0,24.2]]}),
  freezeRoute({id:'arterial-south',name:'Avenida Vale AGV',class:'arterial',width:5.7,sidewalk:1.1,accent:'#51e7a3',nodes:[[0,-10.5],[0,-15.4],[0,-20.5],[0,-24.2]]}),
  freezeRoute({id:'arterial-west',name:'Avenida Tech Oeste',class:'arterial',width:5.0,sidewalk:1.0,accent:'#ff7fd5',nodes:[[-10.5,0],[-20,0],[-29,0],[-36.7,0]]}),
  freezeRoute({id:'arterial-east',name:'Avenida Inovação',class:'arterial',width:5.0,sidewalk:1.0,accent:'#61e7a6',nodes:[[10.5,0],[20,0],[29,0],[36.7,0]]}),
  freezeRoute({id:'collector-north',name:'Anel Norte',class:'collector',width:4.2,sidewalk:.8,accent:'#8fdcf3',nodes:[[-34,22],[0,22],[34,22]]}),
  freezeRoute({id:'collector-south',name:'Anel Sul',class:'collector',width:4.2,sidewalk:.8,accent:'#ffae63',nodes:[[-34,-22],[0,-22],[34,-22]]}),
  freezeRoute({id:'collector-west',name:'Anel Oeste',class:'collector',width:4.0,sidewalk:.78,accent:'#ff7fd5',nodes:[[-37,-18],[-37,0],[-37,18]]}),
  freezeRoute({id:'collector-east',name:'Anel Leste',class:'collector',width:4.0,sidewalk:.78,accent:'#61e7a6',nodes:[[37,-18],[37,0],[37,18]]}),
  freezeRoute({id:'service-civic',name:'Via Cívica',class:'service',width:2.8,sidewalk:.62,accent:'#d5f5ff',nodes:[[-15.8,24.2],[0,24.2],[15.8,24.2]]}),
  freezeRoute({id:'service-mobility',name:'Via Mobilidade',class:'service',width:2.8,sidewalk:.62,accent:'#ffcc8a',nodes:[[-29,-23.6],[0,-23.6],[29,-23.6]]})
]);

export const CAMPUS_THEME_PLAZAS=Object.freeze([
  Object.freeze({id:'plaza-academic',name:'Praça Acadêmica',x:0,z:18.4,radius:5.4,accent:'#36d2ff',icon:'⌘',detail:'Plataforma • Banco • Loja'}),
  Object.freeze({id:'plaza-civic',name:'Praça Cívica',x:0,z:24.0,radius:4.0,accent:'#61e7a6',icon:'◇',detail:'Serviços • Economia • Hub'}),
  Object.freeze({id:'plaza-gamer',name:'Praça Gamer',x:-20.0,z:0,radius:4.8,accent:'#ff7fd5',icon:'✦',detail:'Fliperama • CTF • Torre'}),
  Object.freeze({id:'plaza-innovation',name:'Praça da Inovação',x:20.0,z:0,radius:4.8,accent:'#61e7a6',icon:'⬡',detail:'COSMOS • Desafios • Tecnologia'}),
  Object.freeze({id:'plaza-mobility',name:'Praça da Mobilidade',x:0,z:-18.7,radius:4.6,accent:'#ffae63',icon:'⇄',detail:'Provas • Monotrilho • Vale'})
]);

export const CAMPUS_GARAGES=Object.freeze([
  Object.freeze({id:'garage-west',name:'Garagem Tech Oeste',x:-32.4,z:-8.0,w:7.2,d:4.4,capacity:8,accent:'#ff7fd5'}),
  Object.freeze({id:'garage-east',name:'Garagem Inovação Leste',x:32.4,z:8.0,w:7.2,d:4.4,capacity:8,accent:'#61e7a6'}),
  Object.freeze({id:'garage-south',name:'Garagem Mobilidade',x:28.6,z:-23.2,w:8.2,d:3.6,capacity:10,accent:'#ffae63'})
]);

export const CAMPUS_CROSSWALKS=Object.freeze([
  Object.freeze({id:'cross-north',x:0,z:11.4,w:5.4,d:2.2,axis:'x'}),
  Object.freeze({id:'cross-south',x:0,z:-11.4,w:5.4,d:2.2,axis:'x'}),
  Object.freeze({id:'cross-west',x:-11.4,z:0,w:2.2,d:5.0,axis:'z'}),
  Object.freeze({id:'cross-east',x:11.4,z:0,w:2.2,d:5.0,axis:'z'}),
  Object.freeze({id:'cross-vale',x:0,z:-20.7,w:5.7,d:2.2,axis:'x'})
]);

export const CAMPUS_PEDESTRIAN_BRIDGES=Object.freeze([
  Object.freeze({id:'bridge-west-central',name:'Passarela Oeste',x:-8.4,z:0,axis:'z',length:7.2,width:1.65,height:1.35,rampLength:3.8,accent:'#ff7fd5'}),
  Object.freeze({id:'bridge-east-central',name:'Passarela Leste',x:8.4,z:0,axis:'z',length:7.2,width:1.65,height:1.35,rampLength:3.8,accent:'#61e7a6'})
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
  id:'vale-causeway',name:'Eixo Monumental Campus ↔ Vale',accent:'#51e7a3',width:6.2,
  nodes:Object.freeze([[0,-9.8],[0,-13.0],[0,-15.4],[0,-18.4],[0,-21.4],[0,-24.4]].map(freezePoint)),
  arches:Object.freeze([-13.1,-16.7,-20.4,-23.6]),
  skylineZ:-30.5
});

export const CAMPUS_CITY_LANDMARKS=Object.freeze([
  ...CAMPUS_THEME_PLAZAS.map(item=>Object.freeze({id:item.id,name:item.name,x:item.x,z:item.z,kind:'plaza'})),
  ...CAMPUS_GARAGES.map(item=>Object.freeze({id:item.id,name:item.name,x:item.x,z:item.z,kind:'garage'})),
  ...CAMPUS_PEDESTRIAN_BRIDGES.map(item=>Object.freeze({id:item.id,name:item.name,x:item.x,z:item.z,kind:'bridge'})),
  Object.freeze({id:'vale-causeway',name:'Eixo Monumental do Vale',x:0,z:-20.5,kind:'landmark'})
]);
