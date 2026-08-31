import { CAMPUS_RIDES } from '../world/campus-experiences.js?v=14.10.8.65';

const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
const defaultClock=()=>performance.now();
const smooth=t=>t*t*(3-2*t);

function sampleNodes(nodes,progress){
  if(!nodes?.length)return null;if(nodes.length===1)return{...nodes[0],heading:0};
  const scaled=clamp(progress,0,1)*(nodes.length-1),index=Math.min(nodes.length-2,Math.floor(scaled)),t=smooth(scaled-index),a=nodes[index],b=nodes[index+1];
  return{x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t,z:a.z+(b.z-a.z)*t,heading:Math.atan2(b.x-a.x,b.z-a.z)};
}
function sampleRide(def,progress){
  if(def.loop){const angle=progress*Math.PI*2;return{x:def.center.x+Math.cos(angle)*def.radiusX,y:def.height+.22*Math.sin(angle*2),z:def.center.z+Math.sin(angle)*def.radiusZ,heading:-angle+Math.PI/2};}
  return sampleNodes(def.nodes,progress);
}

export function createRideManager({definitions=CAMPUS_RIDES,onEvent,clock=defaultClock,reducedMotion=false}={}){
  let current=null,startedAt=0,lastTick=0;
  const emit=(type,extra={})=>{const event={type,experience:current?.id||null,...extra};onEvent?.(event);return event;};
  function start(id){const def=definitions[id];if(!def)return false;current=def;startedAt=clock();lastTick=0;emit('experience-start',{title:id==='coaster'?'Montanha-russa Panorâmica':id==='slide'?'Escorregador Turbo':id==='tower'?'Torre Mirante':id==='tower-down'?'Descida do Mirante':id==='playground'?'Parquinho DS':'Piscina Neon',message:id==='coaster'?'Circuito panorâmico completo iniciado no trilho do Campus.':id==='slide'?'Subindo e preparando uma descida curta e segura.':id==='tower'?'Subida ao mirante iniciada. Você poderá permanecer no deck superior.':id==='tower-down'?'Descida segura do mirante iniciada.':id==='playground'?'Balanço ativado por alguns segundos.':'Pausa no deck da Piscina Neon.',camera:def.camera});return true;}
  function cancel({silent=false}={}){if(!current)return false;const id=current.id;current=null;startedAt=0;if(!silent)onEvent?.({type:'experience-cancel',experience:id,message:'Atração encerrada. Você voltou à exploração.'});return true;}
  function tick(now=clock()){
    if(!current)return null;const duration=reducedMotion?Math.min(1.2,current.duration):current.duration,progress=clamp((now-startedAt)/(duration*1000),0,1),sample=sampleRide(current,progress);
    if(now-lastTick>=250){lastTick=now;emit('experience-tick',{progress,duration});}
    const result={...sample,id:current.id,progress,camera:current.camera,done:progress>=1};
    if(progress>=1){const id=current.id;current=null;startedAt=0;onEvent?.({type:'experience-complete',experience:id,message:'Atração concluída. Continue explorando ou siga para sua atividade.'});}
    return result;
  }
  return{start,cancel,tick,isActive:()=>!!current,currentId:()=>current?.id||null,snapshot:()=>({active:!!current,id:current?.id||null,elapsed:current?(clock()-startedAt)/1000:0,duration:current?.duration||0})};
}
