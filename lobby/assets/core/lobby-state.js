const SESSION_FIELDS=Object.freeze([
  'user','profile','currentClass','classes','exercises','studentReleases','classReleases','progress','others','available','scheduled',
  'lastPresence','toastTimer','zoneTimer','stopped','lastTargetSignal','portalState','emoteRequested','bootingRuntime',
  'lastGatherToken','teleportDestinations','chatTarget','graphics','worldTimeControl','lastWorldTimeToken','worldTimeAdminControl',
  'worldWeatherControl','lastWorldWeatherToken','worldWeatherAdminControl','cinemaMedia','vehicleSessions','vehiclePassengers','vehicleMembership','avatarContext','avatarStyle'
]);

const WORLD_FIELDS=Object.freeze([
  'worldId','scene','runtimeMode','runtimeStatus','runtimeRevision','player','nearPortal','nearStudent','nearSeat','nearWorldObject',
  'seated','interior','interiorFloor','savedCampusPlayer','campusVisited','campusFlags','localAction','valeVisited','valeRuntime',
  'selectedValeCompany'
]);

function createSessionDefaults(){
  return{
    user:null,profile:null,currentClass:null,classes:[],exercises:[],studentReleases:[],classReleases:[],progress:[],others:[],available:[],scheduled:[],
    lastPresence:0,toastTimer:null,zoneTimer:null,stopped:false,lastTargetSignal:'',portalState:null,emoteRequested:null,bootingRuntime:false,
    lastGatherToken:null,teleportDestinations:[],chatTarget:null,
    graphics:{fov:65,fpsCap:60,worldTimeMode:'cycle',showPerf:false},
    worldTimeControl:null,lastWorldTimeToken:null,worldTimeAdminControl:null,
    worldWeatherControl:null,lastWorldWeatherToken:null,worldWeatherAdminControl:null,
    cinemaMedia:null,vehicleSessions:[],vehiclePassengers:[],vehicleMembership:null,
    avatarContext:null,avatarStyle:{}
  };
}

function createWorldDefaults(){
  return{
    worldId:'campus-ds',scene:'campus',runtimeMode:null,runtimeStatus:'idle',runtimeRevision:0,
    player:{x:800,y:500,area:'central'},nearPortal:null,nearStudent:null,nearSeat:null,nearWorldObject:null,seated:false,interior:null,interiorFloor:null,
    savedCampusPlayer:null,campusVisited:new Set(['central']),campusFlags:{greet:false,sit:false,action:false,monitor:false},localAction:null,
    valeVisited:new Set(),valeRuntime:null,selectedValeCompany:null
  };
}

function exposeAliases(target,owner,fields){
  for(const field of fields){
    Object.defineProperty(target,field,{enumerable:true,configurable:false,get:()=>owner[field],set:value=>{owner[field]=value;}});
  }
}

export function createLobbyState({session={},world={}}={}){
  const sessionState={...createSessionDefaults(),...session};
  const worldState={...createWorldDefaults(),...world};
  const state={session:sessionState,world:worldState};
  exposeAliases(state,sessionState,SESSION_FIELDS);
  exposeAliases(state,worldState,WORLD_FIELDS);
  return state;
}

export function snapshotWorldState(worldState={}){
  return{
    worldId:String(worldState.worldId||'campus-ds'),
    scene:String(worldState.scene||'campus'),
    mode:worldState.runtimeMode||null,
    status:String(worldState.runtimeStatus||'idle'),
    revision:Number(worldState.runtimeRevision||0),
    player:worldState.player?{...worldState.player}:null,
    interior:worldState.interior||null,
    interiorFloor:Number.isFinite(worldState.interiorFloor)?worldState.interiorFloor:null,
    seated:!!worldState.seated,
    savedCampusPlayer:worldState.savedCampusPlayer?{...worldState.savedCampusPlayer}:null
  };
}

export const LOBBY_STATE_CONTRACT=Object.freeze({sessionFields:SESSION_FIELDS,worldFields:WORLD_FIELDS});
