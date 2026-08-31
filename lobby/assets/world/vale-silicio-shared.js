export const VALE_VERSION='14.10.8.66';
export const VALE_BOUNDS=Object.freeze({minX:-420,maxX:420,minZ:-420,maxZ:420});
export const VALE_SPAWN=Object.freeze({x:0,y:.2,z:-18});
export const VALE_RETURN_PORTAL=Object.freeze({id:'portal_retorno_lobby',type:'return-portal',name:'Portal de Retorno ao Lobby',label:'VOLTAR AO CAMPUS DS',x:0,z:-360,radius:7,interaction:'Voltar ao Lobby'});

export const VALE_NPCS=Object.freeze([
  Object.freeze({id:'tirza',type:'vale-npc',interaction:'Conversar',name:'Tirza',role:'Diretora',x:-13,z:-7,accent:'#ffd166',message:'Bem-vindo ao Campus Virtual AGV. Explore os projetos e use este espaço de espera com responsabilidade.'}),
  Object.freeze({id:'vitor',type:'vale-npc',interaction:'Conversar',name:'Vitor',role:'Diretor',x:13,z:-7,accent:'#7dd3fc',message:'O Vale reúne empresas e projetos estudantis. Use o mapa para localizar cada equipe.'}),
  Object.freeze({id:'pedagoga',type:'vale-npc',interaction:'Conversar',name:'Pedagoga',role:'Equipe pedagógica',x:0,z:20,accent:'#c4b5fd',message:'Antes da atividade, você pode explorar o Vale. Quando a prova for liberada, o acesso continua disponível pelo Lobby.'}),
  Object.freeze({id:'marcia',type:'vale-npc',interaction:'Conversar',name:'Márcia',role:'Inspetora',x:-28,z:-20,accent:'#fb7185',message:'Circule pelas áreas sinalizadas e aproveite as atrações sem bloquear as passagens.'}),
  Object.freeze({id:'arlene',type:'vale-npc',interaction:'Conversar',name:'Arlene',role:'Inspetora',x:28,z:-20,accent:'#f9a8d4',message:'Se quiser uma experiência mais leve, o modo 2D continua disponível a qualquer momento.'})
]);

export const VALE_ENVIRONMENTS=Object.freeze([
  Object.freeze({id:'auditorio',type:'vale-environment',interaction:'Conhecer ambiente',name:'Auditório AGV',label:'AUDITÓRIO',x:-80,z:112,w:44,d:28,accent:'#8b5cf6',description:'Palco, telão, cadeiras e espaço para apresentações e orientações coletivas.',props:['palco','telão','cadeiras','caixas de som']}),
  Object.freeze({id:'refeitorio',type:'vale-environment',interaction:'Conhecer ambiente',name:'Refeitório AGV',label:'REFEITÓRIO',x:80,z:112,w:42,d:30,accent:'#22c55e',description:'Área social com mesas, balcão e cozinha visual.',props:['mesas','cadeiras','balcão','cozinha visual']}),
  Object.freeze({id:'sala-pedra',type:'vale-environment',interaction:'Conhecer ambiente',name:'Sala de Pedra',label:'SALA DE PEDRA',x:-80,z:-120,w:34,d:26,accent:'#f59e0b',description:'Ambiente rochoso temático preparado para exploração, desafio e easter egg.',props:['rochas','luzes indiretas','passagem temática']}),
  Object.freeze({id:'hall-inovacao',type:'vale-environment',interaction:'Conhecer ambiente',name:'Hall da Inovação AGV',label:'HALL DA INOVAÇÃO',x:80,z:-120,w:48,d:30,accent:'#38bdf8',description:'Museu e espaço de exposição dos projetos, marcos e destaques do Vale.',props:['totens','painéis de projetos','linha do tempo']})
]);

export const VALE_SPORTS=Object.freeze([
  Object.freeze({id:'futsal',type:'vale-sport',interaction:'Explorar quadra',name:'Quadra de Futsal',label:'FUTSAL',x:-72,z:338,w:52,d:30,accent:'#34d399',sport:'futsal'}),
  Object.freeze({id:'basquete',type:'vale-sport',interaction:'Explorar quadra',name:'Quadra de Basquete',label:'BASQUETE',x:0,z:338,w:44,d:30,accent:'#fb923c',sport:'basquete'}),
  Object.freeze({id:'volei',type:'vale-sport',interaction:'Explorar quadra',name:'Quadra de Vôlei',label:'VÔLEI',x:68,z:338,w:42,d:30,accent:'#60a5fa',sport:'volei'}),
  Object.freeze({id:'pingpong',type:'vale-sport',interaction:'Explorar quadra',name:'Mesa de Ping Pong',label:'PING PONG',x:0,z:382,w:20,d:14,accent:'#e879f9',sport:'pingpong'})
]);

export const VALE_HANGAR=Object.freeze({id:'hangar',type:'vale-hangar',interaction:'Explorar hangar',name:'Hangar AGV',label:'HANGAR',x:-350,z:-340,w:64,d:42,accent:'#38bdf8',description:'Hangar de mobilidade com área de pouso, drone, helicóptero e veículos especiais.'});
export const VALE_RACETRACK=Object.freeze({id:'pista-corrida',type:'vale-racetrack',interaction:'Explorar pista',name:'Pista de Corrida AGV',label:'PISTA DE CORRIDA',x:-235,z:-310,rx:68,rz:42,accent:'#f43f5e',description:'Circuito navegável para caminhada, corrida, parkour e futuras experiências com bicicleta/kart.'});

export const VALE_VEHICLES=Object.freeze([
  Object.freeze({id:'carro-01',type:'vale-vehicle',interaction:'Observar veículo',kind:'carro',name:'Carro elétrico',x:-95,z:0,state:'PATH_FOLLOW',accent:'#38bdf8',path:[[-95,0],[95,0],[210,0],[95,0],[-95,0]]}),
  Object.freeze({id:'onibus-01',type:'vale-vehicle',interaction:'Observar veículo',kind:'ônibus',name:'Ônibus do Campus',x:0,z:86,state:'PATH_FOLLOW',accent:'#fbbf24',path:[[0,86],[0,270],[0,86]]}),
  Object.freeze({id:'caminhao-01',type:'vale-vehicle',interaction:'Observar veículo',kind:'caminhão',name:'Caminhão de logística',x:-112,z:92,state:'PATH_FOLLOW',accent:'#94a3b8',path:[[-112,92],[-315,92],[-315,-92],[-112,-92],[-112,92]]}),
  Object.freeze({id:'moto-01',type:'vale-vehicle',interaction:'Observar veículo',kind:'moto',name:'Moto elétrica',x:115,z:-130,state:'PATH_FOLLOW',accent:'#f97316',path:[[115,-130],[318,-130],[318,95],[115,95],[115,-130]]}),
  Object.freeze({id:'bike-01',type:'vale-vehicle',interaction:'Observar veículo',kind:'bicicleta',name:'Bicicleta AGV',x:36,z:58,state:'INTERACTIVE_READY',accent:'#22c55e',path:[]}),
  Object.freeze({id:'drone-01',type:'vale-vehicle',interaction:'Observar veículo',kind:'drone',name:'Drone AGV',x:-340,z:-330,y:18,state:'PATH_FOLLOW',accent:'#a78bfa',path:[[-340,-330],[-285,-285],[-370,-260],[-340,-330]]}),
  Object.freeze({id:'heli-01',type:'vale-vehicle',interaction:'Observar veículo',kind:'helicóptero',name:'Helicóptero AGV',x:-360,z:-350,y:2,state:'STATIC',accent:'#67e8f9',path:[]})
]);

export const VALE_FAST_TRAVEL_STATIC=Object.freeze([
  Object.freeze({id:'praca',name:'Praça Central da Inovação',x:0,z:-18,kind:'landmark'}),
  Object.freeze({id:'auditorio',name:'Auditório AGV',x:-80,z:92,kind:'environment'}),
  Object.freeze({id:'refeitorio',name:'Refeitório AGV',x:80,z:90,kind:'environment'}),
  Object.freeze({id:'sala-pedra',name:'Sala de Pedra',x:-80,z:-100,kind:'environment'}),
  Object.freeze({id:'hall-inovacao',name:'Hall da Inovação AGV',x:80,z:-100,kind:'environment'}),
  Object.freeze({id:'esportes',name:'Complexo Esportivo',x:0,z:315,kind:'sport'}),
  Object.freeze({id:'hangar',name:'Hangar AGV',x:-350,z:-315,kind:'mobility'}),
  Object.freeze({id:'pista',name:'Pista de Corrida',x:-235,z:-310,kind:'mobility'}),
  Object.freeze({id:'retorno',name:'Portal de Retorno',x:0,z:-350,kind:'portal'})
]);

export function clampVale(v,min,max){return Math.max(min,Math.min(max,v));}
export function valeWorldToPresence(x,z){
  const px=((Number(x)||0)-VALE_BOUNDS.minX)/(VALE_BOUNDS.maxX-VALE_BOUNDS.minX)*1600;
  const py=((Number(z)||0)-VALE_BOUNDS.minZ)/(VALE_BOUNDS.maxZ-VALE_BOUNDS.minZ)*1000;
  return{x:Math.round(clampVale(px,0,1600)),y:Math.round(clampVale(py,0,1000))};
}
export function valePresenceToWorld(x,y){
  return{x:VALE_BOUNDS.minX+(clampVale(Number(x)||800,0,1600)/1600)*(VALE_BOUNDS.maxX-VALE_BOUNDS.minX),z:VALE_BOUNDS.minZ+(clampVale(Number(y)||500,0,1000)/1000)*(VALE_BOUNDS.maxZ-VALE_BOUNDS.minZ)};
}
export function nearestValeObject(x,z,objects,maxDistance=9){
  let best=null,bestDistance=maxDistance;
  for(const object of objects||[]){const d=Math.hypot(x-Number(object.x||0),z-Number(object.z||0));const r=Math.max(2,Number(object.radius||object.trigger_radius||5));if(d<Math.min(bestDistance,r)){best=object;bestDistance=d;}}
  return best?{...best,distance:bestDistance}:null;
}
