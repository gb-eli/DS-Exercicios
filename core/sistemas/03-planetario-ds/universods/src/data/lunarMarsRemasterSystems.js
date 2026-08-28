export const PLANETARY_WORLDS=[
{id:'moon',name:'Lua',subtitle:'Mare Tranquillitatis',symbol:'◐',color:'#d9e0e7',accent:'#7ad8ff',gravity:1.62,atmosphere:0,description:'Superfície sem atmosfera, crateras, sombras duras, módulo lunar, rover e Terra no céu.'},
{id:'mars',name:'Marte',subtitle:'Jezero e vale de exploração',symbol:'●',color:'#d96a3e',accent:'#ffb46b',gravity:3.71,atmosphere:.012,description:'Planícies, dunas, rochas, tempestades, rover científico, drone e braço robótico.'}
];
export const PLANETARY_VEHICLES=[
{id:'astronaut',worlds:['moon','mars'],name:'Astronauta',symbol:'♙',speed:3.2,energyUse:.22,description:'Exploração a pé em primeira ou terceira pessoa.'},
{id:'lunar-rover',worlds:['moon'],name:'Rover Lunar',symbol:'▣',speed:12,energyUse:.48,description:'Veículo aberto com suspensão e baixa gravidade.'},
{id:'mars-rover',worlds:['mars'],name:'Rover Científico',symbol:'▦',speed:7,energyUse:.38,description:'Seis rodas, suspensão rocker-bogie, mastro e braço.'},
{id:'mars-drone',worlds:['mars'],name:'Drone Marciano',symbol:'✣',speed:16,energyUse:1.15,description:'Reconhecimento aéreo e mapeamento de setores.'}
];
export const PLANETARY_CAMERAS=[
{id:'first-person',label:'Primeira pessoa',short:'1P',worlds:['moon','mars']},{id:'third-person',label:'Terceira pessoa',short:'3P',worlds:['moon','mars']},{id:'vehicle',label:'Veículo',short:'VCL',worlds:['moon','mars']},{id:'cockpit',label:'Cabine / mastro',short:'CAB',worlds:['moon','mars']},{id:'orbit',label:'Visão orbital',short:'ORB',worlds:['moon','mars']},{id:'cinematic',label:'Cinematográfica',short:'CIN',worlds:['moon','mars']},{id:'module-interior',label:'Interior do módulo',short:'INT',worlds:['moon']},{id:'drone',label:'Drone',short:'DRN',worlds:['mars']}
];
export const PLANETARY_MISSIONS={moon:[
{id:'moon-module',label:'Inspecionar o módulo lunar por fora e por dentro',camera:'module-interior',xp:140},{id:'moon-rover',label:'Percorrer 1,2 km com o rover lunar',vehicle:'lunar-rover',target:1.2,xp:220},{id:'moon-sample',label:'Coletar duas amostras de regolito',target:2,xp:200},{id:'moon-beacon',label:'Instalar o sinalizador científico',xp:160}
],mars:[
{id:'mars-route',label:'Percorrer 1,8 km com o rover científico',vehicle:'mars-rover',target:1.8,xp:260},{id:'mars-arm',label:'Coletar uma amostra com o braço robótico',vehicle:'mars-rover',xp:220},{id:'mars-drone',label:'Mapear três setores com o drone',vehicle:'mars-drone',target:3,xp:240},{id:'mars-storm',label:'Sobreviver a uma tempestade e retornar ao normal',xp:220}
]};
export const PLANETARY_LANDMARKS={moon:[{id:'lander',name:'Módulo lunar',x:0,z:0},{id:'crater',name:'Cratera Sul',x:28,z:-32},{id:'ridge',name:'Crista iluminada',x:-42,z:24},{id:'science',name:'Estação científica',x:36,z:38}],mars:[{id:'rover-base',name:'Base do rover',x:0,z:0},{id:'delta',name:'Delta sedimentar',x:54,z:-36},{id:'dunes',name:'Campo de dunas',x:-46,z:42},{id:'canyon',name:'Cânion de pesquisa',x:74,z:58}]};
export const WORLD_BY_ID=Object.fromEntries(PLANETARY_WORLDS.map(item=>[item.id,item]));
export const VEHICLE_BY_ID=Object.fromEntries(PLANETARY_VEHICLES.map(item=>[item.id,item]));
