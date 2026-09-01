export const MUSEU_HARDWARE_VERSION='0.8.0';
export const MUSEU_HARDWARE_BASE_AGV_WORLD='14.10.8.73';
export const MUSEU_HARDWARE_MAP_ID='museu-hardware-agv';
export const MUSEU_HARDWARE_SCENE_ID='museu-hardware';
export const MUSEU_HARDWARE_AREA='museu-hardware';

export const MUSEU_HARDWARE_BOUNDS=Object.freeze({minX:-178,maxX:178,minZ:-142,maxZ:158});
export const MUSEU_HARDWARE_SPAWN=Object.freeze({x:0,y:0.2,z:132});
export const MUSEU_HARDWARE_RETURN_PORTAL=Object.freeze({
  id:'museu_hardware_agv_portal_campus',type:'return-portal',name:'Portal de Retorno ao Campus DS',
  label:'VOLTAR AO CAMPUS DS',x:0,z:148,radius:7,interaction:'Voltar ao Campus DS',
  targetWorldId:'campus-ds',targetSpawn:'central'
});

export const MUSEU_HARDWARE_CENTER=Object.freeze({id:'museu_hardware_agv_atrio',name:'Átrio da Evolução',x:0,z:4,radius:28});
export const MUSEU_HARDWARE_MEETING_POINT=Object.freeze({id:'museu_hardware_agv_meeting_point',type:'meeting-point',name:'Ponto de encontro do museu',x:0,z:22,radius:9,interaction:'Reunir grupo no átrio'});

const galleries=[
  ['01','museu_hardware_agv_galeria_origens','Origens da Computação','1940–1970','#9be564',-112,-86,54,40,'mainframe','terminal','Dos grandes computadores às primeiras interfaces interativas.'],
  ['02','museu_hardware_agv_galeria_home','Revolução Doméstica','1970–1984','#ffd166',-48,-92,54,38,'home-computer','maze','Microcomputadores e sistemas domésticos aproximam a computação das famílias.'],
  ['03','museu_hardware_agv_galeria_console','Primeiros Consoles','1972–1984','#ff9f43',22,-94,52,38,'early-console','pong','O videogame chega à televisão e transforma a sala em espaço de jogo.'],
  ['04','museu_hardware_agv_galeria_8bit','Era 8-bit','1983–1992','#ff6b6b',92,-82,50,42,'cartridge-console','platform','Cartuchos, mascotes e jogos domésticos ganham escala global.'],
  ['05','museu_hardware_agv_galeria_16_32','16/32-bit e 3D','1988–2001','#ff4d8d',118,-24,48,44,'disc-console','fighter','Sprites avançados, áudio digital e a transição definitiva para o 3D.'],
  ['06','museu_hardware_agv_galeria_arcade','Arcades','1970–2000','#d66efd',102,48,50,44,'arcade-cabinet','shooter','Gabinetes, fichas, placares e experiências sociais dos fliperamas.'],
  ['07','museu_hardware_agv_galeria_portateis','Portáteis','1989–Atual','#9ee493',54,100,56,38,'handheld','handheld','Jogos no bolso: telas compactas, baterias e mobilidade.'],
  ['08','museu_hardware_agv_galeria_pc','PC Pessoal','1981–2009','#5eead4',-18,105,58,38,'retro-pc','desktop','Da interface textual ao desktop gráfico e à internet doméstica.'],
  ['09','museu_hardware_agv_galeria_pc_gamer','PC Gamer','2010–Atual','#48a9ff',-86,92,52,42,'gaming-pc','fps','GPUs dedicadas, alto FPS, eSports e personalização de hardware.'],
  ['10','museu_hardware_agv_galeria_atual','Geração Atual','2020–Atual','#a78bfa',-120,28,52,44,'current-console','adventure','SSDs rápidos, ray tracing, serviços online e ecossistemas multiplataforma.']
];

export const MUSEU_HARDWARE_GALLERIES=Object.freeze(galleries.map(([order,id,name,years,accent,x,z,w,d,device,demo,description])=>Object.freeze({
  order,id,type:'museum-gallery',name,label:`${order} · ${name.toUpperCase()}`,years,accent,x,z,w,d,device,demo,description,
  screen:Object.freeze({id:`${id}_screen`,type:'museum-screen',name:`Tela — ${name}`,interaction:'Assistir demonstração',x,z:z-3,radius:7}),
  exhibit:Object.freeze({id:`${id}_exhibit`,type:'museum-exhibit',name:`Exposição — ${name}`,interaction:'Inspecionar equipamento',x,z:z+5,radius:7})
})));

export const MUSEU_HARDWARE_NPCS=Object.freeze([
  Object.freeze({id:'museu_hardware_agv_npc_guia',type:'museum-guide',name:'Guia AGV',role:'Recepção',x:-8,z:126,accent:'#72e6ff',interaction:'Conversar',message:'Siga a numeração das galerias para percorrer a evolução do hardware em ordem cronológica.'}),
  Object.freeze({id:'museu_hardware_agv_npc_curador',type:'museum-guide',name:'Curador Tech',role:'Curadoria',x:14,z:10,accent:'#ffd166',interaction:'Conversar',message:'Cada estação reúne uma tela em movimento e um modelo 3D do equipamento representativo daquela geração.'}),
  Object.freeze({id:'museu_hardware_agv_npc_arcade',type:'museum-guide',name:'Monitor Arcade',role:'Interatividade',x:84,z:56,accent:'#ff4d8d',interaction:'Conversar',message:'As demonstrações atuais são loops genéricos. O mapa já aceita mídia local real por exposição em uma etapa posterior.'})
]);

export const MUSEU_HARDWARE_DESTINATIONS=Object.freeze([
  Object.freeze({id:'museu-hardware:entrada',name:'Entrada do Museu do Hardware',x:0,z:132,kind:'entrance',district:'Museu do Hardware'}),
  Object.freeze({id:'museu-hardware:atrio',name:'Átrio da Evolução',x:0,z:4,kind:'landmark',district:'Museu do Hardware'}),
  Object.freeze({id:'museu-hardware:meeting-point',name:'Ponto de encontro',x:MUSEU_HARDWARE_MEETING_POINT.x,z:MUSEU_HARDWARE_MEETING_POINT.z,kind:'meeting-point',district:'Museu do Hardware',description:'Área central para reunir visitantes e professor/guia.'}),
  ...MUSEU_HARDWARE_GALLERIES.map(g=>Object.freeze({id:`museu-hardware:${g.id}`,name:g.name,x:g.x,z:g.z+12,kind:'gallery',district:g.years,description:g.description})),
  Object.freeze({id:'museu-hardware:retorno',name:'Portal de Retorno ao Campus DS',x:0,z:144,kind:'portal',district:'Entrada'})
]);

export const MUSEU_HARDWARE_WORLD_OBJECTS=Object.freeze([
  MUSEU_HARDWARE_RETURN_PORTAL,
  MUSEU_HARDWARE_MEETING_POINT,
  ...MUSEU_HARDWARE_NPCS,
  ...MUSEU_HARDWARE_GALLERIES.flatMap(g=>[g.screen,g.exhibit])
]);

export function clampMuseuHardware(v,min,max){return Math.max(min,Math.min(max,v));}
export function museuHardwareWorldToPresence(x,z){
  const px=((Number(x)||0)-MUSEU_HARDWARE_BOUNDS.minX)/(MUSEU_HARDWARE_BOUNDS.maxX-MUSEU_HARDWARE_BOUNDS.minX)*1600;
  const py=((Number(z)||0)-MUSEU_HARDWARE_BOUNDS.minZ)/(MUSEU_HARDWARE_BOUNDS.maxZ-MUSEU_HARDWARE_BOUNDS.minZ)*1000;
  return{x:Math.round(clampMuseuHardware(px,0,1600)),y:Math.round(clampMuseuHardware(py,0,1000))};
}
export function museuHardwarePresenceToWorld(x,y){
  return{
    x:MUSEU_HARDWARE_BOUNDS.minX+(clampMuseuHardware(Number(x)||800,0,1600)/1600)*(MUSEU_HARDWARE_BOUNDS.maxX-MUSEU_HARDWARE_BOUNDS.minX),
    z:MUSEU_HARDWARE_BOUNDS.minZ+(clampMuseuHardware(Number(y)||500,0,1000)/1000)*(MUSEU_HARDWARE_BOUNDS.maxZ-MUSEU_HARDWARE_BOUNDS.minZ)
  };
}
export function nearestMuseuHardwareObject(x,z,objects=MUSEU_HARDWARE_WORLD_OBJECTS,maxDistance=10){
  let best=null,bestDistance=maxDistance;
  for(const object of objects||[]){const d=Math.hypot(x-Number(object.x||0),z-Number(object.z||0)),r=Math.max(2,Number(object.radius||6));if(d<Math.min(bestDistance,r)){best=object;bestDistance=d;}}
  return best?{...best,distance:bestDistance}:null;
}
export function galleryByObjectId(id){
  return MUSEU_HARDWARE_GALLERIES.find(g=>g.id===id||g.screen.id===id||g.exhibit.id===id)||null;
}
