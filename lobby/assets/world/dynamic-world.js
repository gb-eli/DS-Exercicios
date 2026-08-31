export const WORLD_REAL_CYCLE_MS=24*60*1000;
export const WORLD_GAME_MINUTES_PER_REAL_SECOND=1;
export const WORLD_TIME_EPOCH_MS=Date.UTC(2026,0,1,0,0,0);
export const WORLD_TIME_MODES=Object.freeze(['cycle','auto','day','night','fixed']);
const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
const mod=(value,size)=>((value%size)+size)%size;

export function normalizeWorldTimeMode(value){const mode=String(value||'cycle');if(mode==='auto')return'cycle';return WORLD_TIME_MODES.includes(mode)?mode:'cycle';}
export function normalizeFixedHour(value,fallback=12){const hour=Number(value);return Number.isFinite(hour)?mod(hour,24):fallback;}
export function acceleratedWorldHour(nowMs=Date.now(),offsetMinutes=0){const elapsed=mod(Number(nowMs)-WORLD_TIME_EPOCH_MS,WORLD_REAL_CYCLE_MS),base=elapsed/WORLD_REAL_CYCLE_MS*24;return mod(base+Number(offsetMinutes||0)/60,24);}
export function normalizeWorldTimeControl(control){if(!control||control.active===false)return null;const mode=normalizeWorldTimeMode(control.mode);if(mode!=='cycle'&&mode!=='fixed')return null;return Object.freeze({active:true,mode,fixedHour:mode==='fixed'?normalizeFixedHour(control.fixedHour):null,issuer:control.issuer||null,issuedAt:control.issuedAt||null,source:control.source||'session'});}
export function resolveWorldTime(mode='cycle',dateOrMs=Date.now(),control=null){
  const requested=normalizeWorldTimeMode(mode),globalControl=normalizeWorldTimeControl(control),selected=globalControl?.mode||requested,nowMs=dateOrMs instanceof Date?dateOrMs.getTime():Number(dateOrMs)||Date.now();let hour;
  if(selected==='day')hour=12.5;else if(selected==='night')hour=22.5;else if(selected==='fixed')hour=normalizeFixedHour(globalControl?.fixedHour??12);else hour=acceleratedWorldHour(nowMs);
  const solar=Math.sin(((hour-6)/12)*Math.PI),daylight=clamp((solar+.08)/1.08,0,1),night=1-daylight,dawn=clamp(1-Math.abs(hour-6)/1.7,0,1),dusk=clamp(1-Math.abs(hour-18)/1.7,0,1),twilight=Math.max(dawn,dusk);
  let phase='night';if(daylight>.64)phase='day';else if(dawn>.28)phase='dawn';else if(dusk>.28)phase='dusk';
  const label=phase==='day'?'DIA':phase==='dawn'?'AMANHECER':phase==='dusk'?'ENTARDECER':'NOITE';
  return{mode:selected,requestedMode:requested,hour,daylight,night,dawn,dusk,twilight,phase,label,clock:formatWorldClock(hour),cycleRealMs:WORLD_REAL_CYCLE_MS,gameMinutesPerRealSecond:WORLD_GAME_MINUTES_PER_REAL_SECOND,controlled:!!globalControl,controlSource:globalControl?.source||null};
}
export function formatWorldClock(hour){const normalized=mod(hour,24),h=Math.floor(normalized),m=Math.floor((normalized-h)*60);return`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;}
export function skyPalette(world){
  const t=world.daylight,tw=world.twilight??world.dusk??0;
  const mix=(a,b,k)=>{const ar=(a>>16)&255,ag=(a>>8)&255,ab=a&255,br=(b>>16)&255,bg=(b>>8)&255,bb=b&255;return`rgb(${Math.round(ar+(br-ar)*k)},${Math.round(ag+(bg-ag)*k)},${Math.round(ab+(bb-ab)*k)})`;};
  const top=mix(0x06101f,0x3e9bd0,t),bottom=mix(0x081416,0xbfe4d5,t);
  return{top,bottom,glow:tw>.25?`rgba(255,151,91,${.08+tw*.18})`:t>.5?'rgba(113,204,255,.12)':'rgba(68,111,160,.08)'};
}
