const VERSION='14.10.8.96';
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
  'core/world-manager.js':['createWorldManager','world_runtime_contract_invalid','worldAudit'],
  'core/runtime-v2/world-runtime-contract.js':['WORLD_RUNTIME_CONTRACT_VERSION','normalizeWorldRuntime','assertWorldRuntimeV2'],
  'core/runtime-v2/world-context.js':['WORLD_CONTEXT_VERSION','createWorldContext'],
  'core/interaction-v2/interaction-contract.js':['INTERACTION_CONTRACT_VERSION','describeInteraction','INTERACTION_LEVELS'],
  'core/interaction-v2/interaction-manager.js':['createInteractionManager','interaction_debounced'],
  'core/runtime-v2/player-locomotion.js':['LOCOMOTION_CONTRACT_VERSION','createPlayerLocomotion','locomotionProfileForWorld'],
  'world/gameplay-settings.js':['PLAYER_MOVEMENT','playerMoveSpeed','playerJumpImpulse','playerGravity'],
  'core/world-adapter.js':['createWorldAdapter','AIRDROP_TRANSIT_ADAPTER','CAMPUS_WORLD_ADAPTER','VILLAGE_1DS_WORLD_ADAPTER','VILLAGE_SUB_WORLD_ADAPTER','CAMPUS_LIBRARY_WORLD_ADAPTER','CAMPUS_LABS_WORLD_ADAPTER','CAMPUS_NEON_WORLD_ADAPTER','VALE_WORLD_ADAPTER','RURAL_WORLD_ADAPTER','MOON_WORLD_ADAPTER','MARS_WORLD_ADAPTER','PARQUE_WORLD_ADAPTER','COLEGIO_WORLD_ADAPTER','LABIRINTO_WORLD_ADAPTER','MUSEU_WORLD_ADAPTER'],
  'supabase.js':['SUPABASE_URL','NETWORK_TIMEOUT_MS'],
  'config.js':['SUPABASE_URL','SUPABASE_PUBLISHABLE_KEY','LOBBY_VERSION'],
  'lobby3d.js':['createLobby3D'],
  'lobby-lite.js':['createLobbyLite'],
  'world/campus-manifest.js':['CAMPUS_ZONE_LAYOUT','presenceToWorld','worldToPresence'],
  'world/village-world.js':['VILLAGE_CONFIGS','villageWorldToPresence','villagePresenceToWorld'],
  'world/campus-module-world.js':['CAMPUS_MODULE_CONFIGS','campusModuleWorldToPresence','campusModulePresenceToWorld'],
  'world/airdrop-sectors.js':['AIRDROP_SECTORS','AIRDROP_GROUND_WORLD_IDS','airdropStrategicSnapshot'],
  'world/world-manifests.js':['VILLAGE_1DS_WORLD_MANIFEST','CAMPUS_LIBRARY_WORLD_MANIFEST','CAMPUS_NEON_WORLD_MANIFEST','WORLD_MANIFESTS'],
  'village-lite.js':['createVillageLite'],
  'campus-module-lite.js':['createCampusModuleLite'],
  'world/campus-environment.js':['createCampusEnvironment','createCampusLighting','campus-building'],
  'world/campus-experiences.js':['CAMPUS_EXPERIENCES','CAMPUS_TRAIN_STATIONS','nearestExperience'],
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
  'render/graphics-calibrator.js':['createGraphicsCalibrator','summarizeCalibrationWindow','manual-lock'],
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
  const requiredAssets=['lobby.js','supabase.js','config.js','core/lobby-state.js','core/world-manager.js','core/runtime-v2/world-runtime-contract.js','core/runtime-v2/world-context.js','core/interaction-v2/interaction-contract.js','core/interaction-v2/interaction-manager.js','core/runtime-v2/player-locomotion.js','world/gameplay-settings.js','core/world-adapter.js','lobby-lite.js','world/campus-manifest.js','world/village-world.js','world/campus-module-world.js','world/airdrop-sectors.js','world/world-manifests.js','village-lite.js','campus-module-lite.js','world/campus-experiences.js','world/campus-destinations.js','world/campus-connections.js','world/campus-city-network.js','world/campus-interiors.js','world/campus-live-systems.js','world/campus-mobility-systems.js','world/cinema-media.js','world/security-cameras.js','world/aerial-mobility.js','world/campus-viewpoints.js','world/dynamic-world.js','world/weather-system.js','render/camera-controller.js','render/performance-manager.js','render/graphics-calibrator.js','characters/avatar-system.js','game/portal-manager.js','game/train-manager.js','social/proximity-chat.js'];
  // F85: validação do boot em pequenos lotes paralelos. Mantém o gate de integridade sem bloquear o Lobby em 29 requests sequenciais.
  const probeConcurrency=6;
  for(let i=0;i<requiredAssets.length;i+=probeConcurrency)await Promise.all(requiredAssets.slice(i,i+probeConcurrency).map(probeAsset));
  try{await probeAsset('rigged-avatar.js')}catch(error){globalThis.__agvLobbyDiag?.record?.('boot_optional_asset_warning',{asset:'rigged-avatar.js',message:String(error?.message||error)});}
  const url=new URL(`./lobby.js?v=${VERSION}-stage74-f9411-graphics-streaming`,import.meta.url);
  globalThis.__agvLobbyDiag?.record?.('stage',{stage:'lobby_module_import',url:url.href});
  await import(url.href);
  globalThis.__agvLobbyDiag?.record?.('stage',{stage:'lobby_module_loaded'});
}
start().catch(showFatal);
