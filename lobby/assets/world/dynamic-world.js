export const WORLD_TIME_MODES=Object.freeze(['auto','day','night']);
const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));

export function normalizeWorldTimeMode(value){return WORLD_TIME_MODES.includes(String(value))?String(value):'auto';}
export function resolveWorldTime(mode='auto',date=new Date()){
  const selected=normalizeWorldTimeMode(mode);let hour=date.getHours()+date.getMinutes()/60+date.getSeconds()/3600;
  if(selected==='day')hour=12.5;else if(selected==='night')hour=22.5;
  const daylight=selected==='day'?1:selected==='night'?0:clamp(Math.sin(((hour-6)/12)*Math.PI),0,1);
  const night=1-daylight;
  const dusk=clamp(1-Math.abs(hour-18)/2.2,0,1);
  const phase=selected==='auto'?(daylight>.63?'day':daylight>.12?'dusk':'night'):selected;
  return{mode:selected,hour,daylight,night,dusk,phase,label:phase==='day'?'DIA':phase==='dusk'?'ENTARDECER':'NOITE',clock:formatWorldClock(hour)};
}
export function formatWorldClock(hour){const normalized=((hour%24)+24)%24,h=Math.floor(normalized),m=Math.floor((normalized-h)*60);return`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;}
export function skyPalette(world){
  const t=world.daylight,d=world.dusk;
  const mix=(a,b,k)=>{const ar=(a>>16)&255,ag=(a>>8)&255,ab=a&255,br=(b>>16)&255,bg=(b>>8)&255,bb=b&255;return`rgb(${Math.round(ar+(br-ar)*k)},${Math.round(ag+(bg-ag)*k)},${Math.round(ab+(bb-ab)*k)})`;};
  const top=mix(0x06101f,0x3e9bd0,t),bottom=mix(0x081416,0xbfe4d5,t);
  return{top,bottom,glow:d>.25?`rgba(255,151,91,${.08+d*.18})`:t>.5?'rgba(113,204,255,.12)':'rgba(68,111,160,.08)'};
}
