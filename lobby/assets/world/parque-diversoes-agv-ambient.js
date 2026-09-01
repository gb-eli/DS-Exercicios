export const PARQUE_AMBIENT_VERSION='14.10.8.80-f7';

const freeze=o=>Object.freeze({...o});
const freezeRoute=points=>Object.freeze(points.map(([x,z])=>freeze({x,z})));

export const PARQUE_NPCS=Object.freeze([
  freeze({id:'npc-bia-guia',type:'park-npc',name:'Bia',role:'Guia do Parque',accent:'#ffd166',x:-8,z:120,radius:4.2,interaction:'Conversar',message:'Bem-vindo ao Parque AGV! A praça central conecta todas as atrações. Use as placas ou o mapa rápido para se localizar.',route:freezeRoute([[-8,120],[-5,85],[0,48],[-4,22],[-8,55]]) ,speed:2.0}),
  freeze({id:'npc-caio-monitor-obby',type:'park-npc',name:'Caio',role:'Monitor do Sky Obby',accent:'#a78bfa',x:47,z:-34,radius:4.2,interaction:'Conversar',message:'No Sky Obby há três rotas. Comece pela Fácil e use os checkpoints: ao cair, você volta ao último ponto seguro.',route:freezeRoute([[47,-34],[58,-38],[72,-35],[91,-39],[80,-31],[60,-30]]),speed:1.7}),
  freeze({id:'npc-luna-coaster',type:'park-npc',name:'Luna',role:'Operadora da Montanha-Russa',accent:'#ff7b35',x:-70,z:-36,radius:4.2,interaction:'Conversar',message:'A Montanha-Russa Vulcão está pronta. Entre na estação e use a interação para embarcar.',route:freezeRoute([[-70,-36],[-82,-38],[-91,-45],[-79,-48]]),speed:1.4}),
  freeze({id:'npc-davi-racing',type:'park-npc',name:'Davi',role:'Fiscal AGV Racing',accent:'#51e7a3',x:-82,z:52,radius:4.2,interaction:'Conversar',message:'São três voltas. Acelere com correr/W e freie com pular/Espaço. Sair da faixa principal reduz seu rendimento.',route:freezeRoute([[-82,52],[-64,64],[-53,82],[-68,99],[-86,112],[-101,112]]),speed:2.1}),
  freeze({id:'npc-maya-slide',type:'park-npc',name:'Maya',role:'Monitora do Mega Slide',accent:'#fb7185',x:139,z:43,radius:4.2,interaction:'Conversar',message:'Chame o elevador no térreo, suba até o mirante e depois use a entrada do escorregador para descer até a piscina.',route:freezeRoute([[139,43],[140,28],[136,18],[143,36]]),speed:1.5}),
  freeze({id:'npc-neo-tiro',type:'park-npc',name:'Neo',role:'Instrutor de Tiro ao Alvo',accent:'#facc15',x:69,z:108,radius:4.2,interaction:'Conversar',message:'A rodada dura 45 segundos. Os alvos valem pontos diferentes e acertos seguidos aumentam seu combo.',route:freezeRoute([[69,108],[70,95],[77,91],[94,92],[96,106],[84,112]]),speed:1.3}),
  freeze({id:'npc-socorrista',type:'park-npc',name:'Rafa',role:'Primeiros Socorros',accent:'#22c55e',x:24,z:116,radius:4.2,interaction:'Conversar',message:'Se precisar se orientar, o posto de primeiros socorros fica próximo à entrada. Todas as atrações possuem saída rápida.',route:freezeRoute([[24,116],[18,110],[28,105],[32,118]]),speed:1.25}),
  freeze({id:'npc-fotografa',type:'park-npc',name:'Nina',role:'Fotógrafa do Parque',accent:'#38bdf8',x:-24,z:16,radius:4.2,interaction:'Conversar',message:'Os melhores pontos de vista são a praça, o mirante do Mega Slide e o mirante da Montanha-Russa.',route:freezeRoute([[-24,16],[-8,5],[8,6],[22,18],[8,34],[-8,34]]),speed:1.55})
]);

export const PARQUE_QUEUE_LINES=Object.freeze([
  freeze({id:'fila-coaster',attraction:'coaster',accent:'#ff7b35',points:freezeRoute([[-64,-31],[-70,-31],[-70,-36],[-76,-36],[-76,-42],[-82,-42]])}),
  freeze({id:'fila-race',attraction:'race',accent:'#51e7a3',points:freezeRoute([[-78,49],[-84,49],[-84,54],[-90,54],[-90,48],[-96,48]])}),
  freeze({id:'fila-slide',attraction:'slide',accent:'#fb7185',points:freezeRoute([[145,42],[138,42],[138,37],[132,37],[132,34]])}),
  freeze({id:'fila-shooting',attraction:'shooting',accent:'#facc15',points:freezeRoute([[64,111],[70,111],[70,106],[76,106],[76,102],[82,102]])})
]);

export const PARQUE_SIGNS=Object.freeze([
  freeze({id:'sign-central-coaster',type:'wayfinding',radius:3.5,interaction:'Ler placa',name:'Placa Montanha-Russa',label:'← MONTANHA-RUSSA',x:-12,z:18,rotation:Math.PI/2,accent:'#ff7b35'}),
  freeze({id:'sign-central-race',type:'wayfinding',radius:3.5,interaction:'Ler placa',name:'Placa Corrida',label:'CORRIDA ↙',x:-8,z:28,rotation:Math.PI/2,accent:'#51e7a3'}),
  freeze({id:'sign-central-obby',type:'wayfinding',radius:3.5,interaction:'Ler placa',name:'Placa Sky Obby',label:'SKY OBBY →',x:12,z:12,rotation:-Math.PI/2,accent:'#a78bfa'}),
  freeze({id:'sign-central-slide',type:'wayfinding',radius:3.5,interaction:'Ler placa',name:'Placa Mega Slide',label:'MEGA SLIDE →',x:12,z:24,rotation:-Math.PI/2,accent:'#fb7185'}),
  freeze({id:'sign-central-shoot',type:'wayfinding',radius:3.5,interaction:'Ler placa',name:'Placa Tiro ao Alvo',label:'TIRO AO ALVO ↗',x:8,z:34,rotation:-Math.PI/2,accent:'#facc15'}),
  freeze({id:'sign-campus',type:'wayfinding',radius:3.5,interaction:'Ler placa',name:'Placa Campus',label:'CAMPUS / SAÍDA ↑',x:0,z:126,rotation:0,accent:'#38bdf8'}),
]);

export const PARQUE_KIOSKS=Object.freeze([
  freeze({id:'kiosk-pipoca',type:'service',name:'Pipoca & Snacks',label:'PIPOCA',radius:5,interaction:'Visitar',x:-19,z:37,accent:'#f97316'}),
  freeze({id:'kiosk-sorvete',type:'service',name:'Sorvetes AGV',label:'SORVETES',radius:5,interaction:'Visitar',x:18,z:42,accent:'#60a5fa'}),
  freeze({id:'kiosk-sucos',type:'service',name:'Sucos & Água',label:'BEBIDAS',radius:5,interaction:'Visitar',x:36,z:72,accent:'#22c55e'}),
  freeze({id:'kiosk-games',type:'service',name:'Arcade AGV',label:'ARCADE',radius:5,interaction:'Visitar',x:53,z:112,accent:'#a78bfa'}),
]);

export const PARQUE_DECOR=Object.freeze({
  lamps:Object.freeze([
    [-12,135],[12,135],[-12,112],[12,112],[-9,78],[9,78],[-13,45],[13,45],[-30,18],[30,18],
    [-58,-28],[-36,-15],[-50,65],[-35,78],[36,-28],[47,-45],[95,-22],[111,4],[103,54],[62,74],[47,101],[23,106]
  ].map(([x,z],i)=>freeze({id:`lamp-${i}`,x,z}))),
  benches:Object.freeze([
    [-16,8,0],[16,8,Math.PI],[-18,30,0],[18,30,Math.PI],[-4,43,Math.PI/2],[4,-8,-Math.PI/2],[-33,96,0],[47,88,Math.PI]
  ].map(([x,z,rotation],i)=>freeze({id:`bench-${i}`,x,z,rotation}))),
  planters:Object.freeze([
    [-24,3],[-24,34],[24,3],[24,34],[-8,-10],[8,-10],[-35,45],[35,52],[-48,-20],[47,-20],[-30,112],[33,115]
  ].map(([x,z],i)=>freeze({id:`planter-${i}`,x,z}))),
  balloons:Object.freeze([
    [-18,126,'#fb7185'],[18,126,'#38bdf8'],[-24,22,'#facc15'],[24,22,'#a78bfa'],[-54,54,'#51e7a3'],[55,64,'#f97316']
  ].map(([x,z,accent],i)=>freeze({id:`balloon-${i}`,x,z,accent})))
});

export const PARQUE_AMBIENT_AUDIO=Object.freeze({
  defaultVolume:.18,
  zones:Object.freeze({
    entrada:{baseHz:196,chimeHz:523},'praca-central':{baseHz:220,chimeHz:659},'montanha-russa':{baseHz:110,chimeHz:440},
    corrida:{baseHz:98,chimeHz:392},parkour:{baseHz:247,chimeHz:740},'mega-slide':{baseHz:174,chimeHz:587},'tiro-alvo':{baseHz:147,chimeHz:494}
  })
});

function hashText(value='agv'){let h=2166136261;for(const ch of String(value)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;}
export function sampleNpcRoute(npc,timeSeconds=0){
  const route=npc?.route||[];if(route.length<2)return{x:Number(npc?.x)||0,z:Number(npc?.z)||0,heading:0};
  const speed=Math.max(.2,Number(npc.speed)||1.5),phase=(hashText(npc.id)%1000)/1000,total=route.length;
  const u=(timeSeconds*speed*.055+phase)%1,scaled=u*total,i=Math.floor(scaled)%total,f=scaled-i,a=route[i],b=route[(i+1)%total];
  const smooth=f*f*(3-2*f),x=a.x+(b.x-a.x)*smooth,z=a.z+(b.z-a.z)*smooth;
  return{x,z,heading:Math.atan2(b.x-a.x,b.z-a.z)};
}

export function resolveParqueWeather(control,now=Date.now()){
  const raw=typeof control==='string'?control:control?.id||control?.mode||'auto';
  let id=String(raw||'auto').toLowerCase();
  if(id==='auto'||id==='cycle'){
    const slot=Math.floor(now/(1000*60*8))%20;
    id=slot===7?'rain':slot===13?'fog':slot===17?'storm':'clear';
  }
  if(!['clear','rain','storm','fog'].includes(id))id='clear';
  const strength=id==='storm'?.9:id==='rain'?.65:id==='fog'?.55:0;
  return Object.freeze({id,strength,label:id==='clear'?'Céu limpo':id==='rain'?'Chuva':id==='storm'?'Tempestade':'Névoa'});
}

export function createParqueAudioController({volume=.18,enabled=true}={}){
  let ctx=null,master=null,base=null,zone='praca-central',stopped=false,lastChime=0,currentVolume=Math.max(0,Math.min(1,Number(volume)||0));
  const AudioCtx=globalThis.AudioContext||globalThis.webkitAudioContext;
  function ensure(){
    if(stopped||!enabled||!AudioCtx)return false;
    if(!ctx){ctx=new AudioCtx();master=ctx.createGain();master.gain.value=currentVolume*.18;master.connect(ctx.destination);base=ctx.createOscillator();const g=ctx.createGain();g.gain.value=.035;base.type='sine';base.frequency.value=220;base.connect(g);g.connect(master);base.start();}
    if(ctx.state==='suspended')ctx.resume?.().catch(()=>{});return true;
  }
  function setZone(next){zone=next||zone;if(!ctx||stopped)return zone;const cfg=PARQUE_AMBIENT_AUDIO.zones[zone]||PARQUE_AMBIENT_AUDIO.zones['praca-central'];base?.frequency?.setTargetAtTime?.(cfg.baseHz,ctx.currentTime,.35);return zone;}
  function cue(kind='chime'){
    if(!ensure())return false;const cfg=PARQUE_AMBIENT_AUDIO.zones[zone]||PARQUE_AMBIENT_AUDIO.zones['praca-central'],osc=ctx.createOscillator(),g=ctx.createGain(),now=ctx.currentTime;
    const mult=kind==='success'?1.35:kind==='ride'?0.72:kind==='hit'?1.65:1;osc.type=kind==='ride'?'sawtooth':'sine';osc.frequency.setValueAtTime(cfg.chimeHz*mult,now);g.gain.setValueAtTime(.0001,now);g.gain.exponentialRampToValueAtTime(.11,now+.015);g.gain.exponentialRampToValueAtTime(.0001,now+.22);osc.connect(g);g.connect(master);osc.start(now);osc.stop(now+.24);return true;
  }
  function tick(nowMs=performance.now()){if(stopped||!ctx||ctx.state!=='running')return;if(nowMs-lastChime>18000){lastChime=nowMs;cue('chime');}}
  function setVolume(v){currentVolume=Math.max(0,Math.min(1,Number(v)||0));if(master)master.gain.setTargetAtTime(currentVolume*.18,ctx.currentTime,.15);return currentVolume;}
  function stop(){if(stopped)return;stopped=true;try{base?.stop?.();ctx?.close?.();}catch{}base=null;master=null;ctx=null;}
  return Object.freeze({ensure,setZone,cue,tick,setVolume,getVolume:()=>currentVolume,stop,isActive:()=>!!ctx&&!stopped});
}
