export const CAMPUS_EXPERIENCES=Object.freeze([
  Object.freeze({id:'parkour',type:'parkour',name:'Circuito Parkour',label:'PARKOUR',x:-10.5,z:18.4,radius:4.2,accent:'#ff6b7a',description:'Circuito de plataformas e checkpoints para usar enquanto a atividade não começa.'}),
  Object.freeze({id:'pool',type:'pool',name:'Piscina Neon',label:'PISCINA',x:10.4,z:18.2,radius:3.4,accent:'#43d9ff',description:'Área de convivência com água animada e deck iluminado.'}),
  Object.freeze({id:'playground',type:'playground',name:'Parquinho DS',label:'PARQUINHO',x:-10.6,z:-18.1,radius:3.2,accent:'#ffd166',description:'Área recreativa com balanços, barras e piso emborrachado.'}),
  Object.freeze({id:'slide',type:'slide',name:'Escorregador Turbo',label:'ESCORREGADOR',x:10.5,z:-18.2,radius:3.1,accent:'#7cf29a',description:'Rampa recreativa e escadas do campus de espera.'}),
  Object.freeze({id:'coaster',type:'coaster',name:'Trilho Panorâmico',label:'TRILHO',x:20.0,z:0,radius:3.4,accent:'#b58cff',description:'Mini trilho cenográfico com carrinho animado para dar vida ao lobby.'}),
  Object.freeze({id:'tower',type:'tower',name:'Torre de Escadas',label:'TORRE',x:-20.0,z:0,radius:3.2,accent:'#ffae63',description:'Escadas, plataformas e mirante para desafios verticais.'})
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
