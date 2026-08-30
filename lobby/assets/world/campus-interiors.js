import { CAMPUS_DESTINATIONS } from './campus-destinations.js?v=14.10.8.65';
import { CAMPUS_GARAGES } from './campus-city-network.js?v=14.10.8.65';
import { CAMPUS_INTERIOR_LIVE_BLUEPRINTS } from './campus-live-systems.js?v=14.10.8.65';

const P=(x,z)=>Object.freeze({x:Number(x),z:Number(z)});
const byId=Object.freeze(Object.fromEntries(CAMPUS_DESTINATIONS.map(item=>[item.id,item])));
const garageMap=Object.freeze(Object.fromEntries(CAMPUS_GARAGES.map(item=>[item.id,item])));

const INTERIOR_LAYOUTS=Object.freeze({
  'unified-platform':{template:'institutional-hall',origin:[-36,0,72],floors:['Recepção e Hub','Coordenação e Projetos'],garageId:null,services:['Recepção AGV','Hub de Atividades','Sala de Projetos','Auditório Compacto']},
  bank:{template:'civic-bank',origin:[-28,0,72],floors:['Atendimento e Autoatendimento','Gestão Financeira'],garageId:null,services:['Recepção Financeira','Autoatendimento','Extrato','Gestão de Moedas']},
  store:{template:'showroom',origin:[-20,0,72],floors:['Showroom e Provadores','Coleções e Personalização'],garageId:null,services:['Recepção da Loja','Showroom','Personalização','Coleções']},
  'lab-virtual':{template:'research-lab',origin:[-12,0,72],floors:['Recepção e Laboratórios','Pesquisa e Simulação'],garageId:'garage-west',services:['Recepção Técnica','Laboratórios','Simulações','Bancada de Pesquisa']},
  'ctf-ds':{template:'cyber-ops',origin:[-4,0,72],floors:['Recepção Cyber e SOC','Investigação e CTF'],garageId:null,services:['Recepção Cyber','SOC Educacional','Sala CTF','Investigação']},
  cosmos:{template:'observatory',origin:[4,0,72],floors:['Recepção e Planetário','Observatório e Missões'],garageId:null,services:['Recepção COSMOS','Planetário','Observatório','Sala de Missões']},
  'desafio-ds':{template:'challenge-center',origin:[12,0,72],floors:['Recepção e Briefing','Missões e Debriefing'],garageId:null,services:['Recepção de Missões','Briefing','Sala de Desafios','Debriefing']},
  fliperama:{template:'arcade',origin:[20,0,72],floors:['Recepção e Arcade','Arena Multiplayer'],garageId:'garage-west',services:['Recepção Gamer','Arcade','Arena Multiplayer','Ranking']},
  'game-info':{template:'innovation-center',origin:[28,0,72],floors:['Recepção e Maker','Projetos e Demonstrações'],garageId:'garage-east',services:['Recepção Inovação','Maker Space','Demonstrações','Projetos']},
  'practical-exam':{template:'exam-center',origin:[36,0,72],floors:['Recepção e Triagem','Salas de Prova'],garageId:'garage-south',services:['Recepção de Provas','Triagem','Salas de Prova','Sala da Equipe']}
});

const makeProfile=(destination,layout)=>{
  const width=18,depth=12;
  const [ox,oy,oz]=layout.origin;
  const floors=Object.freeze(layout.floors.map((name,index)=>Object.freeze({index,name,code:index===0?'T':'1'})));
  const reception=P(ox-5.3,oz-2.9),portal=P(ox+5.5,oz+3.75),elevator=P(ox+6.3,oz-3.55),stairs=P(ox-6.4,oz+3.55),exit=P(ox,oz-5.45);
  const garage=layout.garageId&&garageMap[layout.garageId]?Object.freeze({id:layout.garageId,...garageMap[layout.garageId],access:P(ox,oz+4.9)}):null;
  const live=CAMPUS_INTERIOR_LIVE_BLUEPRINTS[destination.id]||null;
  const floorMaps=Object.freeze((live?.floors||[]).map(floor=>Object.freeze({
    index:floor.index,
    rooms:Object.freeze((floor.rooms||[]).map(room=>Object.freeze({...room,x:ox+Number(room.x||0),z:oz+Number(room.z||0)})))
  })));
  const guidedRoutes=Object.freeze((live?.guides||[]).map(guide=>Object.freeze({...guide,nodes:Object.freeze((guide.nodes||[]).map(node=>P(ox+node.x,oz+node.z)))})));
  const receptionist=live?.receptionist?Object.freeze({...live.receptionist,x:reception.x+.2,z:reception.z+1.15,floor:0}):null;
  return Object.freeze({
    id:destination.id,name:destination.name,label:destination.label,subtitle:destination.subtitle,accent:destination.accent,route:destination.route,staffRoute:destination.staffRoute||null,
    template:layout.template,origin:Object.freeze(layout.origin),width,depth,floors,services:Object.freeze(layout.services),entrance:destination.entrance,reception,portal,elevator,stairs,exit,garage,
    liveTheme:live?.theme||layout.template,floorMaps,guidedRoutes,receptionist,
    bounds:Object.freeze({minX:ox-width/2+.45,maxX:ox+width/2-.45,minZ:oz-depth/2+.45,maxZ:oz+depth/2-.45}),
    floorLabel:index=>floors.find(f=>f.index===index)?.name||floors[0].name
  });
};

export const CAMPUS_INTERIOR_PROFILES=Object.freeze(CAMPUS_DESTINATIONS.map(destination=>makeProfile(destination,INTERIOR_LAYOUTS[destination.id])));
export const CAMPUS_INTERIOR_MAP=Object.freeze(Object.fromEntries(CAMPUS_INTERIOR_PROFILES.map(item=>[item.id,item])));

export const CAMPUS_INTERIOR_INTERACTIONS=Object.freeze(CAMPUS_INTERIOR_PROFILES.flatMap(profile=>{
  const refs=[
    Object.freeze({id:`tool-int-${profile.id}-exit`,type:'tool-interior-exit',interiorId:profile.id,floor:0,name:`Saída • ${profile.name}`,x:profile.exit.x,z:profile.exit.z,radius:1.8}),
    Object.freeze({id:`tool-int-${profile.id}-reception`,type:'tool-reception',interiorId:profile.id,floor:0,name:`Recepção • ${profile.name}`,x:profile.reception.x,z:profile.reception.z,radius:1.85,services:profile.services}),
    Object.freeze({id:`tool-int-${profile.id}-portal`,type:'tool-interior-portal',interiorId:profile.id,floor:0,name:`Portal • ${profile.name}`,x:profile.portal.x,z:profile.portal.z,radius:1.85,route:profile.route,staffRoute:profile.staffRoute}),
  ];
  for(const floor of profile.floors){
    refs.push(Object.freeze({id:`tool-int-${profile.id}-elevator-${floor.index}`,type:'tool-elevator',interiorId:profile.id,floor:floor.index,name:`Elevador • ${profile.name}`,x:profile.elevator.x,z:profile.elevator.z,radius:1.65}));
    refs.push(Object.freeze({id:`tool-int-${profile.id}-stairs-${floor.index}`,type:'tool-stairs',interiorId:profile.id,floor:floor.index,name:`Escada • ${profile.name}`,x:profile.stairs.x,z:profile.stairs.z,radius:1.65}));
  }
  if(profile.garage)refs.push(Object.freeze({id:`tool-int-${profile.id}-garage`,type:'tool-garage',interiorId:profile.id,floor:0,name:`Acesso à ${profile.garage.name}`,x:profile.garage.access.x,z:profile.garage.access.z,radius:1.8,garageId:profile.garage.id,garageX:profile.garage.x,garageZ:profile.garage.z}));
  if(profile.receptionist)refs.push(Object.freeze({id:`tool-int-${profile.id}-receptionist`,type:'tool-receptionist',interiorId:profile.id,floor:0,name:profile.receptionist.name,x:profile.receptionist.x,z:profile.receptionist.z,radius:1.9,role:profile.receptionist.role,message:profile.receptionist.message}));
  for(const floorMap of profile.floorMaps){
    refs.push(Object.freeze({id:`tool-int-${profile.id}-map-${floorMap.index}`,type:'tool-interior-map',interiorId:profile.id,floor:floorMap.index,name:`Mapa interno • ${profile.name}`,x:profile.origin[0]-7.2,z:profile.origin[2]-3.5,radius:1.7}));
    for(const room of floorMap.rooms)refs.push(Object.freeze({id:`tool-int-${profile.id}-room-${floorMap.index}-${room.id}`,type:'tool-service-zone',interiorId:profile.id,floor:floorMap.index,name:room.label,x:room.x,z:room.z,radius:Math.max(1.55,Math.min(2.15,(Number(room.w)||3)/2)),description:room.description,kind:room.kind}));
  }
  for(const guide of profile.guidedRoutes){
    const first=guide.nodes[0]||profile.reception;refs.push(Object.freeze({id:`tool-int-${profile.id}-guide-${guide.id}`,type:'tool-guided-route',interiorId:profile.id,floor:Number(guide.floor||0),name:`Rota • ${guide.label}`,x:first.x,z:first.z,radius:1.6,routeId:guide.id,label:guide.label}));
  }
  return refs;
}));

export const CAMPUS_INTERIOR_FLOOR_MAPS=Object.freeze(Object.fromEntries(CAMPUS_INTERIOR_PROFILES.map(profile=>[profile.id,profile.floorMaps])));
export const CAMPUS_INTERIOR_GUIDED_ROUTES=Object.freeze(Object.fromEntries(CAMPUS_INTERIOR_PROFILES.map(profile=>[profile.id,profile.guidedRoutes])));
export function interiorProfile(id){return CAMPUS_INTERIOR_MAP[id]||null;}
export function interiorInteractions(id,floor=0){return CAMPUS_INTERIOR_INTERACTIONS.filter(item=>item.interiorId===id&&item.floor===floor);}
export function interiorFloorMap(id,floor=0){return (CAMPUS_INTERIOR_MAP[id]?.floorMaps||[]).find(item=>item.index===Number(floor))||null;}
export function interiorGuide(id,routeId){return (CAMPUS_INTERIOR_MAP[id]?.guidedRoutes||[]).find(item=>item.id===routeId)||null;}
