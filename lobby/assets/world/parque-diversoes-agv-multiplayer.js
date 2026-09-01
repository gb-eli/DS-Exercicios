export const PARQUE_MULTIPLAYER_VERSION='14.10.8.80-f7';
export const PARQUE_COMPETITION_PROTOCOL=1;
export const PARQUE_COMPETITION_TTL_MS=10000;
export const PARQUE_COMPETITION_PUBLISH_MS=250;
export const PARQUE_COMPETITION_LIMITS=Object.freeze({coasterSeats:12,raceKarts:8,scoreboardRows:8});

const WORLD_ID='parque-diversoes-agv',SCENE='parque';
const nowSafe=()=>globalThis.performance?.now?.()??Date.now();
const text=(value,fallback='')=>String(value??fallback).slice(0,80);
const num=(value,fallback=0)=>Number.isFinite(Number(value))?Number(value):fallback;
const bool=value=>value===true;
const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));

export function createCompetitionSessionId(kind='session',at=Date.now(),bucketMs=15000){
  const bucket=Math.floor(Number(at||Date.now())/Math.max(1000,Number(bucketMs)||15000));
  return`${text(kind,'session')}:${bucket}`;
}

function normalizeRace(raw={}){
  if(!raw||typeof raw!=='object')return null;
  const phase=['idle','countdown','racing','finished'].includes(raw.phase)?raw.phase:'idle';
  return Object.freeze({phase,active:bool(raw.active),lap:Math.max(0,Math.trunc(num(raw.lap))),nextCheckpoint:Math.max(0,Math.trunc(num(raw.nextCheckpoint))),totalLaps:Math.max(1,Math.trunc(num(raw.totalLaps,3))),x:num(raw.x),z:num(raw.z),heading:num(raw.heading),speed:num(raw.speed),kmh:Math.max(0,Math.round(num(raw.kmh))),elapsedMs:Math.max(0,num(raw.elapsedMs)),complete:bool(raw.complete)});
}
function normalizeCoaster(raw={}){
  if(!raw||typeof raw!=='object')return null;
  return Object.freeze({active:bool(raw.active),t:clamp(num(raw.t),0,1),startedAt:Math.max(0,num(raw.startedAt)),finishedAt:Math.max(0,num(raw.finishedAt)),complete:bool(raw.complete)||(!raw.active&&num(raw.finishedAt)>0)});
}
function normalizeShooting(raw={}){
  if(!raw||typeof raw!=='object')return null;
  return Object.freeze({active:bool(raw.active),score:Math.max(0,Math.trunc(num(raw.score))),shots:Math.max(0,Math.trunc(num(raw.shots))),hits:Math.max(0,Math.trunc(num(raw.hits))),accuracy:clamp(Math.round(num(raw.accuracy,100)),0,100),streak:Math.max(0,Math.trunc(num(raw.streak))),remainingMs:Math.max(0,num(raw.remainingMs)),complete:bool(raw.complete)});
}
function normalizeParkour(raw={}){
  if(!raw||typeof raw!=='object')return null;
  return Object.freeze({active:bool(raw.active),routeId:text(raw.routeId,'medium'),difficulty:text(raw.difficulty,'Médio'),index:Math.max(0,Math.trunc(num(raw.index))),total:Math.max(1,Math.trunc(num(raw.total,1))),elapsedMs:Math.max(0,num(raw.elapsedMs)),falls:Math.max(0,Math.trunc(num(raw.falls))),complete:bool(raw.complete)});
}

export function normalizeCompetitionPacket(raw,receivedAt=Date.now()){
  const value=raw?.parqueCompetition||raw?.parque_competition||raw?.competition||raw;
  if(!value||typeof value!=='object')return null;
  const participantId=text(value.participantId||value.participant_id||raw?.student_id||raw?.user_id);
  if(!participantId)return null;
  const worldId=text(value.worldId||value.world_id||raw?.worldId||raw?.world_id||WORLD_ID);
  const scene=text(value.scene||raw?.scene||SCENE);
  if(worldId!==WORLD_ID||scene!==SCENE)return null;
  const experience=['coaster','race','shooting','parkour','slide','spectator','free'].includes(value.experience)?value.experience:'free';
  return Object.freeze({
    protocol:Math.max(1,Math.trunc(num(value.protocol,PARQUE_COMPETITION_PROTOCOL))),worldId:WORLD_ID,scene:SCENE,
    participantId,displayName:text(value.displayName||value.display_name||raw?.display_name||'Jogador','Jogador'),
    at:Math.max(0,num(value.at||value.timestamp,receivedAt)),receivedAt:Math.max(0,num(receivedAt)),area:text(value.area||raw?.area||'parque-diversoes-agv'),experience,
    sessionId:text(value.sessionId||value.session_id||''),role:value.role==='spectator'?'spectator':'player',spectatorExperience:text(value.spectatorExperience||value.spectator_experience||''),
    position:Object.freeze({x:num(value.position?.x),y:num(value.position?.y),z:num(value.position?.z),heading:num(value.position?.heading)}),
    race:normalizeRace(value.race),coaster:normalizeCoaster(value.coaster),shooting:normalizeShooting(value.shooting),parkour:normalizeParkour(value.parkour)
  });
}

export function buildCompetitionPacket({participantId,displayName='Jogador',area='parque-diversoes-agv',experience='free',sessionId='',role='player',spectatorExperience='',position={},race=null,coaster=null,shooting=null,parkour=null,at=Date.now()}={}){
  return normalizeCompetitionPacket({protocol:PARQUE_COMPETITION_PROTOCOL,worldId:WORLD_ID,scene:SCENE,participantId,displayName,at,area,experience,sessionId,role,spectatorExperience,position,race,coaster,shooting,parkour},at);
}

function raceProgress(packet){
  const r=packet.race;if(!r)return-1;
  const cpTotal=12;return Math.max(0,r.lap)*cpTotal+Math.max(0,r.nextCheckpoint);
}
function raceSort(a,b){
  const ar=a.race,br=b.race;if(!ar&&!br)return 0;if(!ar)return 1;if(!br)return-1;
  if(ar.complete!==br.complete)return ar.complete?-1:1;
  if(ar.complete&&br.complete)return ar.elapsedMs-br.elapsedMs||a.displayName.localeCompare(b.displayName);
  return raceProgress(b)-raceProgress(a)||br.kmh-ar.kmh||ar.elapsedMs-br.elapsedMs||a.displayName.localeCompare(b.displayName);
}
function shootingSort(a,b){return (b.shooting?.score||0)-(a.shooting?.score||0)||(b.shooting?.accuracy||0)-(a.shooting?.accuracy||0)||(b.shooting?.hits||0)-(a.shooting?.hits||0)||a.displayName.localeCompare(b.displayName);}
function parkourSort(a,b){
  const ap=a.parkour,bp=b.parkour;if(!ap&&!bp)return 0;if(!ap)return 1;if(!bp)return-1;
  if(ap.complete!==bp.complete)return ap.complete?-1:1;if(ap.complete&&bp.complete)return ap.elapsedMs-bp.elapsedMs||ap.falls-bp.falls;
  return bp.index-ap.index||ap.elapsedMs-bp.elapsedMs||ap.falls-bp.falls;
}

export function createParqueMultiplayerController({participantId='local',displayName='Jogador',onEvent=()=>{},transport=null,now=nowSafe}={}){
  participantId=text(participantId,'local');displayName=text(displayName,'Jogador');
  const peers=new Map();let local=null,stopped=false,unsubscribe=null,lastPublishAt=0;
  const emit=(type,detail={})=>{try{onEvent({type,worldId:WORLD_ID,scene:SCENE,...detail});}catch(_){}};
  function ingest(rows,at=Date.now()){
    const list=Array.isArray(rows)?rows:[rows];let accepted=0;
    for(const row of list){const packet=normalizeCompetitionPacket(row,at);if(!packet||packet.participantId===participantId)continue;peers.set(packet.participantId,packet);accepted++;}
    prune(at);return accepted;
  }
  function prune(at=Date.now()){let removed=0;for(const[id,p]of peers){const age=Math.max(0,Number(at)-Number(p.at||p.receivedAt||0));if(age>PARQUE_COMPETITION_TTL_MS){peers.delete(id);removed++;}}return removed;}
  function participants(at=Date.now()){prune(at);return[...(local?[local]:[]),...peers.values()];}
  function coasterSeats(sessionId=''){
    const active=participants().filter(p=>p.experience==='coaster'&&p.coaster?.active&&(!sessionId||p.sessionId===sessionId)).sort((a,b)=>(a.coaster?.startedAt||a.at)-(b.coaster?.startedAt||b.at)||a.participantId.localeCompare(b.participantId));
    return active.slice(0,PARQUE_COMPETITION_LIMITS.coasterSeats).map((p,index)=>({...p,seatIndex:index}));
  }
  function raceRanking(){return participants().filter(p=>p.experience==='race'&&p.race&&(p.race.active||p.race.complete||p.race.phase==='countdown')).sort(raceSort).slice(0,PARQUE_COMPETITION_LIMITS.scoreboardRows).map((p,index)=>({...p,position:index+1}));}
  function shootingRanking(){return participants().filter(p=>p.experience==='shooting'&&p.shooting).sort(shootingSort).slice(0,PARQUE_COMPETITION_LIMITS.scoreboardRows).map((p,index)=>({...p,position:index+1}));}
  function parkourRanking(){return participants().filter(p=>p.experience==='parkour'&&p.parkour).sort(parkourSort).slice(0,PARQUE_COMPETITION_LIMITS.scoreboardRows).map((p,index)=>({...p,position:index+1}));}
  function spectators(experienceId=''){return participants().filter(p=>p.role==='spectator'&&(!experienceId||p.spectatorExperience===experienceId));}
  function scoreboard(){return Object.freeze({race:raceRanking(),shooting:shootingRanking(),parkour:parkourRanking(),coasterSeats:coasterSeats(),spectators:Object.freeze({race:spectators('race').length,coaster:spectators('coaster').length,shooting:spectators('shooting').length,parkour:spectators('parkour').length})});}
  function setLocal(packet){const normalized=normalizeCompetitionPacket({...packet,participantId,displayName},Date.now());if(normalized)local=normalized;return local;}
  function publish(packet,{force=false}={}){
    if(stopped)return false;const t=now();if(!force&&t-lastPublishAt<PARQUE_COMPETITION_PUBLISH_MS)return false;lastPublishAt=t;const normalized=setLocal({...packet,participantId,displayName,at:Date.now()});if(!normalized)return false;
    try{transport?.publish?.(normalized);}catch(error){emit('competition-transport-error',{message:String(error?.message||error)});}emit('competition-packet',{packet:normalized});return true;
  }
  function connect(next=transport){
    transport=next||transport;if(!transport||typeof transport.subscribe!=='function')return false;
    try{unsubscribe=transport.subscribe(data=>ingest(data,Date.now()))||null;return true;}catch(error){emit('competition-transport-error',{message:String(error?.message||error)});return false;}
  }
  function stop(){if(stopped)return;stopped=true;try{unsubscribe?.();}catch(_){}unsubscribe=null;try{transport?.stop?.();}catch(_){}peers.clear();local=null;}
  if(transport)connect(transport);
  return Object.freeze({ingest,prune,participants,coasterSeats,raceRanking,shootingRanking,parkourRanking,spectators,scoreboard,setLocal,publish,connect,stop,getLocal:()=>local,getPeer:id=>peers.get(String(id))||null,getPeerCount:()=>peers.size});
}

export function createLocalBroadcastCompetitionTransport({channelName='agv-parque-competition-f5'}={}){
  if(typeof BroadcastChannel==='undefined')return null;const channel=new BroadcastChannel(channelName),listeners=new Set();channel.onmessage=e=>{for(const fn of listeners)try{fn(e.data);}catch(_){}};
  return Object.freeze({publish(packet){channel.postMessage(packet);return true;},subscribe(fn){if(typeof fn!=='function')return()=>{};listeners.add(fn);return()=>listeners.delete(fn);},stop(){listeners.clear();channel.close();}});
}
