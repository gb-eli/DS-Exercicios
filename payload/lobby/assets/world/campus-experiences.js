export const CAMPUS_EXPERIENCES=Object.freeze([
  Object.freeze({id:'vale-portal',type:'vale-portal',name:'Portal Vale do Silício AGV',label:'VALE DO SILÍCIO AGV',x:0,z:-23.5,radius:4.4,accent:'#51e7a3',interaction:'Entrar no Vale',description:'Empresas e projetos criados pelos alunos. Atravesse para a cidade tecnológica estudantil.'}),
  Object.freeze({id:'parkour',type:'parkour',name:'Circuito Parkour',label:'PARKOUR 01—05',x:-10.5,z:18.4,radius:4.4,accent:'#ff6b7a',interaction:'Iniciar circuito',description:'Circuito de plataformas e checkpoints para usar enquanto a atividade não começa.'}),
  Object.freeze({id:'pool',type:'pool',name:'Piscina Neon',label:'PISCINA NEON',x:10.4,z:18.2,radius:3.7,accent:'#43d9ff',interaction:'Relaxar no deck',description:'Área de convivência com água animada e deck iluminado.'}),
  Object.freeze({id:'playground',type:'playground',name:'Parquinho DS',label:'PARQUINHO DS',x:-10.6,z:-18.1,radius:3.6,accent:'#ffd166',interaction:'Usar o balanço',description:'Área recreativa com balanços, gangorra, barras e piso emborrachado.'}),
  Object.freeze({id:'slide',type:'slide',name:'Escorregador Turbo',label:'ESCORREGADOR',x:10.5,z:-18.2,radius:3.5,accent:'#7cf29a',interaction:'Descer',description:'Suba os degraus e faça uma descida curta com retorno seguro.'}),
  Object.freeze({id:'coaster',type:'coaster',name:'Trilho Panorâmico',label:'TRILHO PANORÂMICO',x:20.0,z:0,radius:3.8,accent:'#b58cff',interaction:'Embarcar',description:'Passeio automático curto pelo trilho panorâmico do Campus.'}),
  Object.freeze({id:'tower',type:'tower',name:'Torre de Escadas',label:'TORRE MIRANTE',x:-20.0,z:0,radius:3.6,accent:'#ffae63',interaction:'Subir ao mirante',description:'Escadas, plataformas intermediárias e mirante com sinalização de altura.'})
]);

// Plataformas compartilhadas entre render e colisão do parkour 3D.
// Coordenadas em metros no mundo do Campus; h é a altura da superfície superior.
export const PARKOUR_PLATFORMS=Object.freeze([
  Object.freeze({id:'start',x:-13.15,z:16.80,w:1.55,d:1.00,h:.18,checkpoint:false}),
  Object.freeze({id:'p1',x:-12.85,z:18.90,w:.95,d:.95,h:.55,checkpoint:true}),
  Object.freeze({id:'p2',x:-11.65,z:17.68,w:.95,d:.95,h:.82,checkpoint:true}),
  Object.freeze({id:'p3',x:-10.45,z:19.08,w:.95,d:.95,h:1.05,checkpoint:true}),
  Object.freeze({id:'p4',x:-9.18,z:17.80,w:.95,d:.95,h:.72,checkpoint:true}),
  Object.freeze({id:'p5',x:-8.15,z:18.88,w:.95,d:.95,h:1.18,checkpoint:true})
]);

export const LITE_PARKOUR_CHECKPOINTS=Object.freeze(
  PARKOUR_PLATFORMS.filter(item=>item.checkpoint).map(item=>Object.freeze([item.x,item.z]))
);

export const PARKOUR_START=Object.freeze({x:PARKOUR_PLATFORMS[0].x,z:PARKOUR_PLATFORMS[0].z,y:PARKOUR_PLATFORMS[0].h});

const freezeNodes=nodes=>Object.freeze(nodes.map(([x,y,z])=>Object.freeze({x,y,z})));

// Trajetos locais e puramente recreativos. Não são persistidos nem enviados ao backend.
export const CAMPUS_RIDES=Object.freeze({
  slide:Object.freeze({id:'slide',duration:4.6,camera:'wide',loop:false,nodes:freezeNodes([
    [8.55,.05,-18.75],[8.85,.45,-18.7],[9.15,.9,-18.65],[9.5,1.45,-18.55],[9.85,2.05,-18.45],
    [10.25,2.28,-18.25],[10.85,2.05,-18.0],[11.45,1.35,-17.75],[12.05,.55,-17.55],[12.45,.05,-17.45]
  ])}),
  coaster:Object.freeze({id:'coaster',duration:8.5,camera:'wide',loop:true,center:Object.freeze({x:20,z:0}),radiusX:2.55,radiusZ:2.0,height:1.25}),
  tower:Object.freeze({id:'tower',duration:7.2,camera:'wide',loop:false,nodes:freezeNodes([
    [-22.45,.05,.15],[-21.9,.45,.1],[-21.35,.88,.05],[-20.8,1.32,0],[-20.25,1.76,-.05],[-19.7,2.2,-.08],[-19.15,2.75,0],[-18.25,3.05,0],
    [-18.25,3.05,0],[-18.9,2.2,.08],[-19.6,1.35,.12],[-20.4,.55,.16],[-21.0,.05,.2]
  ])}),
  playground:Object.freeze({id:'playground',duration:4.2,camera:'explore',loop:false,nodes:freezeNodes([[-10.6,.05,-18.1],[-10.6,.35,-18.0],[-10.6,.05,-18.1]])}),
  pool:Object.freeze({id:'pool',duration:4.2,camera:'explore',loop:false,nodes:freezeNodes([[10.4,.05,20.35],[10.4,.05,20.35]])})
});

export function parkourPlatformAt(x,z,padding=0){
  let best=null;
  for(const platform of PARKOUR_PLATFORMS){
    if(Math.abs(x-platform.x)<=platform.w/2+padding&&Math.abs(z-platform.z)<=platform.d/2+padding){
      if(!best||platform.h>best.h)best=platform;
    }
  }
  return best;
}

export function nearestExperience(x,z,maxDistance=3.0){
  let best=null,bestDistance=maxDistance;
  for(const experience of CAMPUS_EXPERIENCES){
    const distance=Math.hypot(x-experience.x,z-experience.z);
    if(distance<bestDistance){best=experience;bestDistance=distance;}
  }
  return best?{...best,distance:bestDistance}:null;
}
