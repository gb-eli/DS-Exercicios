const VERSION='14.10.8.79';
const repairUrl=()=>new URL('../repair-lobby.html',location.href).href;
const showRepairLink=()=>{
  const message=document.getElementById('login-message');
  if(!message||document.getElementById('lobby-repair-link'))return;
  const a=document.createElement('a');a.id='lobby-repair-link';a.href=repairUrl();a.textContent='Reparar Lobby / limpar versão antiga';a.style.cssText='display:inline-block;margin-top:10px;color:#67e8f9;font-weight:800;text-decoration:underline';message.insertAdjacentElement('afterend',a);
};
const showFatal=(error)=>{
  const code=String(error?.code||'boot_failed');
  const message=String(error?.message||error||'boot_failed');
  globalThis.__agvLobbyDiag?.record?.('error',{code,message,file:String(error?.fileName||error?.asset||''),line:Number(error?.lineNumber||0)||null,column:Number(error?.columnNumber||0)||null,stack:String(error?.stack||'')});
  globalThis.__agvLobbyDiag?.exposeError?.(code,message);
  console.error('Falha ao inicializar o AGV Lobby:',error);
  const login=document.getElementById('login');const game=document.getElementById('game-shell');const kicked=document.getElementById('kicked');const box=document.getElementById('login-message');
  login?.classList.remove('hidden');game?.classList.add('hidden');kicked?.classList.add('hidden');
  if(box){box.classList.add('error');box.textContent=`Não foi possível carregar o Lobby. Código: ${message.slice(0,100)}. As Atividades continuam disponíveis pelo Hub.`;}
  showRepairLink();
};
const ASSET_SIGNATURES={
  'lobby.js':['createLobbyState','createWorldManager','CAMPUS_WORLD_ADAPTER','SCHOOL_EMAIL_DOMAIN'],
  'core/lobby-state.js':['createLobbyState','snapshotWorldState','LOBBY_STATE_CONTRACT'],
  'core/world-manager.js':['createWorldManager','world_runtime_contract_invalid','diagnostics'],
  'core/world-adapter.js':['createWorldAdapter','CAMPUS_WORLD_ADAPTER','VALE_WORLD_ADAPTER','RURAL_WORLD_ADAPTER','MOON_WORLD_ADAPTER','MARS_WORLD_ADAPTER'],
  'supabase.js':['SUPABASE_URL','NETWORK_TIMEOUT_MS'],
  'config.js':['SUPABASE_URL','SUPABASE_PUBLISHABLE_KEY','LOBBY_VERSION'],
  'lobby3d.js':['createLobby3D'],
  'lobby-lite.js':['createLobbyLite'],
  'world/campus-manifest.js':['CAMPUS_ZONE_LAYOUT','presenceToWorld','worldToPresence'],
  'world/campus-environment.js':['createCampusEnvironment','createCampusLighting','campus-building'],
  'world/campus-experiences.js':['CAMPUS_EXPERIENCES','PARKOUR_PLATFORMS','nearestExperience'],
  'world/campus-destinations.js':['CAMPUS_DESTINATIONS','CAMPUS_TOOL_EXPERIENCES','CAMPUS_TOOL_BUILDING_COLLIDERS'],
  'world/campus-connections.js':['CAMPUS_CONNECTIONS','CAMPUS_DISTRICT_GATES','CAMPUS_SKYBRIDGES'],
  'world/campus-city-network.js':['CAMPUS_ROAD_HIERARCHY','CAMPUS_THEME_PLAZAS','CAMPUS_VALE_MONUMENTAL_LINK'],
  'world/campus-interiors.js':['CAMPUS_INTERIOR_PROFILES','CAMPUS_INTERIOR_MAP','CAMPUS_INTERIOR_INTERACTIONS'],
  'world/campus-live-systems.js':['CAMPUS_INTERIOR_LIVE_BLUEPRINTS','CAMPUS_GARAGE_FLEET','CAMPUS_STATION_LINKS','CAMPUS_VALE_CEREMONIAL_GATE'],
  'world/campus-mobility-systems.js':['CAMPUS_TRAFFIC_ROUTES','CAMPUS_DRIVABLE_VEHICLES','CAMPUS_TRAFFIC_SIGNALS','CAMPUS_SPEED_ZONES','resolveTrafficSignalState'],
  'world/cinema-media.js':['EMPTY_CINEMA_MEDIA','classifyCinemaSource','normalizeCinemaMedia','cinemaSourceLabel'],
  'world/security-cameras.js':['CAMPUS_SECURITY_CAMERAS','CAMPUS_SECURITY_CAMERA_MAP','securityCameraZoomFov'],
  'world/aerial-mobility.js':['CAMPUS_HELIPADS','CAMPUS_AERIAL_VEHICLES','aerialSpeedKmh'],
  'world/campus-viewpoints.js':['CAMPUS_VIEWPOINTS','CAMPUS_VIEWPOINT_LANDMARKS','viewpointZoomFov'],
  'render/camera-controller.js':['createCameraController','explore','campus'],
  'render/performance-manager.js':['detectPerformanceProfile','createResizeController','createAdaptiveQualityController'],
  'characters/avatar-system.js':['createAvatarSystem','createAvatarAppearance','rigged-glb-v2'],
  'game/portal-manager.js':['createPortalSystem','PORTAL ABERTO','AGUARDANDO'],
  'game/train-manager.js':['createTrainManager','startTrip','sampleVisual'],
  'world/dynamic-world.js':['resolveWorldTime','WORLD_TIME_MODES','skyPalette'],
  'world/weather-system.js':['WORLD_WEATHER_TYPES','resolveWorldWeather','createWorldWeatherEffects'],
  'social/proximity-chat.js':['createProximityChat','issue_chat','verify_chat'],
  'rigged-avatar.js':['loadRiggedAvatarAsset','createRiggedAvatar']
};
async function probeAsset(name){
  const url=new URL(`./${name}?v=${VERSION}&probe=${Date.now()}`,import.meta.url);
  try{
    const response=await fetch(url.href,{cache:'no-store'});
    const text=await response.text();
    const contentType=response.headers.get('content-type')||'';
    const htmlLike=/^\s*<!doctype|^\s*<html/i.test(text);
    const jsLike=/javascript|ecmascript|text\/plain/i.test(contentType)||/\.(?:m?js)(?:$|\?)/i.test(url.pathname);
    const signatures=ASSET_SIGNATURES[name]||[];
    const signaturesOk=signatures.every(sig=>text.includes(sig));
    const versionMarker=text.includes(VERSION);
    const evidence={asset:name,url:url.href,status:response.status,contentType,bytes:text.length,htmlLike,jsLike,signaturesOk,versionMarker};
    globalThis.__agvLobbyDiag?.record?.('boot_asset_probe',evidence);
    // A ausência de um marcador literal da release NÃO torna o módulo inválido.
    // config.js e lobby-lite.js podem ser estáveis entre releases. Validamos HTTP,
    // tipo de conteúdo, ausência de HTML e assinaturas mínimas do contrato do módulo.
    if(!response.ok||htmlLike||!jsLike||!signaturesOk){
      const reason=!response.ok?'http':htmlLike?'html':!jsLike?'content_type':'signature';
      const e=new Error(`asset_invalido:${name}:${reason}`);e.code='boot_asset_invalid';e.asset=url.href;throw e;
    }
    return evidence;
  }catch(error){if(error?.code)throw error;globalThis.__agvLobbyDiag?.record?.('boot_asset_probe_error',{asset:name,message:String(error?.message||error)});throw error;}
}
async function start(){
  globalThis.__agvLobbyDiag?.record?.('stage',{stage:'boot_module_loading'});
  for(const asset of ['lobby.js','supabase.js','config.js','core/lobby-state.js','core/world-manager.js','core/world-adapter.js','lobby3d.js','lobby-lite.js','world/campus-manifest.js','world/campus-environment.js','world/campus-experiences.js','world/campus-destinations.js','world/campus-connections.js','world/campus-city-network.js','world/campus-interiors.js','world/campus-live-systems.js','world/campus-mobility-systems.js','world/cinema-media.js','world/security-cameras.js','world/aerial-mobility.js','world/campus-viewpoints.js','world/dynamic-world.js','world/weather-system.js','render/camera-controller.js','render/performance-manager.js','characters/avatar-system.js','game/portal-manager.js','game/train-manager.js','social/proximity-chat.js'])await probeAsset(asset);
  try{await probeAsset('rigged-avatar.js')}catch(error){globalThis.__agvLobbyDiag?.record?.('boot_optional_asset_warning',{asset:'rigged-avatar.js',message:String(error?.message||error)});}
  const url=new URL(`./lobby.js?v=${VERSION}-stage48-solar-system`,import.meta.url);
  globalThis.__agvLobbyDiag?.record?.('stage',{stage:'lobby_module_import',url:url.href});
  await import(url.href);
  globalThis.__agvLobbyDiag?.record?.('stage',{stage:'lobby_module_loaded'});
}
start().catch(showFatal);
