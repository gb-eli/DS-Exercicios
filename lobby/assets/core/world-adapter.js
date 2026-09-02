import { createLobbyLite } from '../lobby-lite.js?v=14.10.8.96-f948-camera-v2';
import { createValeLite } from '../vale-lite.js?v=14.10.8.96-f948-camera-v2';

const MODES=Object.freeze(['lite','3d']);
const worldAudit=()=>globalThis.__agvWorldRuntimeAudit||null;

function moduleName(specifier){return String(specifier||'').split('?')[0].replace(/^\.\.\//,'');}
function staticFactory(worldId,mode,factory,label='static-import'){
  return context=>{
    worldAudit()?.markImport?.(worldId,mode,'pass',{module:label,static:true});
    return factory(context);
  };
}
function lazyFactory(worldId,mode,specifier,exportName,extendContext=context=>context){
  return async context=>{
    const module=moduleName(specifier);
    worldAudit()?.markImport?.(worldId,mode,'running',{module});
    let loaded;
    try{loaded=await import(specifier);worldAudit()?.markImport?.(worldId,mode,'pass',{module});}
    catch(error){worldAudit()?.markImport?.(worldId,mode,'fail',{module,message:String(error?.message||error).slice(0,160)});throw error;}
    const factory=loaded?.[exportName];
    if(typeof factory!=='function')throw new TypeError(`world_runtime_export_missing:${worldId}:${mode}:${exportName}`);
    return factory(extendContext(context));
  };
}

export function createWorldAdapter({id,scene,label,createLite,create3D,auditId=null,auditEnabled=true}){
  if(!id||!scene||typeof createLite!=='function'||typeof create3D!=='function')throw new TypeError('world_adapter_invalid');
  const factories=Object.freeze({lite:createLite,'3d':create3D});
  return Object.freeze({
    id:String(id),scene:String(scene),label:String(label||id),modes:MODES,auditId:auditId?String(auditId):String(id),auditEnabled:auditEnabled!==false,
    supports(mode){return MODES.includes(mode);},
    createRuntime(mode,context={}){
      const factory=factories[mode];
      if(!factory)throw new RangeError(`world_mode_unsupported:${id}:${mode}`);
      if(auditEnabled!==false)worldAudit()?.markRuntime?.(auditId||id,mode,'running',{factory:'createRuntime'});
      return factory(context);
    }
  });
}

export const CAMPUS_WORLD_ADAPTER=createWorldAdapter({
  id:'campus-ds',scene:'campus',label:'Campus DS',
  createLite:staticFactory('campus-ds','lite',createLobbyLite,'lobby-lite.js'),
  create3D:lazyFactory('campus-ds','3d','../lobby3d.js?v=14.10.8.96-f9411-graphics-streaming','createLobby3D')
});

function createVillageAdapter(key,label){
  const id=`village-${key}`;
  return createWorldAdapter({
    id,scene:id,label,
    createLite:lazyFactory(id,'lite','../village-lite.js?v=14.10.8.96-f948-camera-v2','createVillageLite',context=>({...context,villageKey:key})),
    create3D:lazyFactory(id,'3d','../village3d.js?v=14.10.8.96-f948-camera-v2','createVillage3D',context=>({...context,villageKey:key}))
  });
}
export const VILLAGE_1DS_WORLD_ADAPTER=createVillageAdapter('1ds','Vila 1DS');
export const VILLAGE_2DS_WORLD_ADAPTER=createVillageAdapter('2ds','Vila 2DS');
export const VILLAGE_3DS_WORLD_ADAPTER=createVillageAdapter('3ds','Vila 3DS');
export const VILLAGE_SUB_WORLD_ADAPTER=createVillageAdapter('sub','Vila SUB');

function createCampusModuleAdapter(key,label){
  const id=`campus-${key}`;
  return createWorldAdapter({
    id,scene:id,label,
    createLite:lazyFactory(id,'lite','../campus-module-lite.js?v=14.10.8.96-f948-camera-v2','createCampusModuleLite',context=>({...context,moduleKey:key})),
    create3D:lazyFactory(id,'3d','../campus-module3d.js?v=14.10.8.96-f948-camera-v2','createCampusModule3D',context=>({...context,moduleKey:key}))
  });
}
export const CAMPUS_LIBRARY_WORLD_ADAPTER=createCampusModuleAdapter('library','Biblioteca Central AGV');
export const CAMPUS_LABS_WORLD_ADAPTER=createCampusModuleAdapter('labs','Distrito de Laboratórios AGV');
export const CAMPUS_NEON_WORLD_ADAPTER=createCampusModuleAdapter('neon','Parque Neon & Lazer AGV');

export const VALE_WORLD_ADAPTER=createWorldAdapter({
  id:'vale-silicio',scene:'vale',label:'Vale do Silício AGV',
  createLite:staticFactory('vale-silicio','lite',createValeLite,'vale-lite.js'),
  create3D:lazyFactory('vale-silicio','3d','../vale3d.js?v=14.10.8.96-f9411-graphics-streaming','createVale3D')
});

function standardAdapter({id,scene,label,liteModule,liteExport,threeModule,threeExport}){
  return createWorldAdapter({id,scene,label,createLite:lazyFactory(id,'lite',liteModule,liteExport),create3D:lazyFactory(id,'3d',threeModule,threeExport)});
}
export const RURAL_WORLD_ADAPTER=standardAdapter({id:'rural-agv',scene:'rural',label:'Mundo Rural AGV',liteModule:'../rural-lite.js?v=14.10.8.96-f948-camera-v2',liteExport:'createRuralLite',threeModule:'../rural3d.js?v=14.10.8.96-f9411-graphics-streaming',threeExport:'createRural3D'});
export const MILITARY_WORLD_ADAPTER=standardAdapter({id:'military-agv',scene:'military',label:'Base de Operações AGV',liteModule:'../military-lite.js?v=14.10.8.96-f948-camera-v2',liteExport:'createMilitaryLite',threeModule:'../military3d.js?v=14.10.8.96-f948-camera-v2',threeExport:'createMilitary3D'});
export const SPACE_WORLD_ADAPTER=standardAdapter({id:'space-agv',scene:'space',label:'Estação Orbital AGV',liteModule:'../space-lite.js?v=14.10.8.96-f948-camera-v2',liteExport:'createSpaceLite',threeModule:'../space3d.js?v=14.10.8.96-f948-camera-v2',threeExport:'createSpace3D'});
export const MOON_WORLD_ADAPTER=standardAdapter({id:'moon-agv',scene:'moon',label:'Lua AGV',liteModule:'../moon-lite.js?v=14.10.8.96-f948-camera-v2',liteExport:'createMoonLite',threeModule:'../moon3d.js?v=14.10.8.96-f948-camera-v2',threeExport:'createMoon3D'});
export const MARS_WORLD_ADAPTER=standardAdapter({id:'mars-agv',scene:'mars',label:'Marte AGV',liteModule:'../mars-lite.js?v=14.10.8.96-f948-camera-v2',liteExport:'createMarsLite',threeModule:'../mars3d.js?v=14.10.8.96-f948-camera-v2',threeExport:'createMars3D'});
export const PARQUE_WORLD_ADAPTER=standardAdapter({id:'parque-diversoes-agv',scene:'parque',label:'Parque de Diversões AGV',liteModule:'../parque-diversoes-agv-lite.js?v=14.10.8.96-f948-camera-v2',liteExport:'createParqueDiversoesLite',threeModule:'../parque-diversoes-agv3d.js?v=14.10.8.96-f948-camera-v2',threeExport:'createParqueDiversoes3D'});
export const COLEGIO_WORLD_ADAPTER=standardAdapter({id:'colegio-agv',scene:'colegio',label:'Colégio AGV — Alberto Gomes Veiga',liteModule:'../colegio-agv-host.js?v=14.10.8.96-f948-camera-v2',liteExport:'createColegioAgvHostedLite',threeModule:'../colegio-agv-host.js?v=14.10.8.96-f948-camera-v2',threeExport:'createColegioAgvHosted3D'});
export const LABIRINTO_WORLD_ADAPTER=standardAdapter({id:'labirinto-armadilhas',scene:'labirinto',label:'Labirinto com Armadilhas',liteModule:'../labirinto-armadilhas-host.js?v=14.10.8.96-f948-camera-v2',liteExport:'createLabirintoArmadilhasHostedLite',threeModule:'../labirinto-armadilhas-host.js?v=14.10.8.96-f948-camera-v2',threeExport:'createLabirintoArmadilhasHosted3D'});
export const MUSEU_WORLD_ADAPTER=standardAdapter({id:'museu-hardware-agv',scene:'museu',label:'Museu do Hardware AGV',liteModule:'../museu-hardware-lite.js?v=14.10.8.96-f948-camera-v2',liteExport:'createMuseuHardwareLite',threeModule:'../museu-hardware3d.js?v=14.10.8.96-f948-camera-v2',threeExport:'createMuseuHardware3D'});

// Runtime transitório: não deve contaminar a matriz persistente do Campus.
export const AIRDROP_TRANSIT_ADAPTER=createWorldAdapter({
  id:'campus-ds',scene:'campus',label:'Airdrop setorial',auditEnabled:false,
  createLite:async()=>{throw new Error('airdrop_transit_3d_only')},
  create3D:async context=>(await import('../airdrop-transit3d.js?v=14.10.8.96-f94-auto-calibration')).createAirdropTransit3D(context)
});

export const WORLD_ADAPTERS=Object.freeze([
  CAMPUS_WORLD_ADAPTER,VILLAGE_1DS_WORLD_ADAPTER,VILLAGE_2DS_WORLD_ADAPTER,VILLAGE_3DS_WORLD_ADAPTER,VILLAGE_SUB_WORLD_ADAPTER,CAMPUS_LIBRARY_WORLD_ADAPTER,CAMPUS_LABS_WORLD_ADAPTER,CAMPUS_NEON_WORLD_ADAPTER,VALE_WORLD_ADAPTER,RURAL_WORLD_ADAPTER,MILITARY_WORLD_ADAPTER,SPACE_WORLD_ADAPTER,MOON_WORLD_ADAPTER,MARS_WORLD_ADAPTER,PARQUE_WORLD_ADAPTER,COLEGIO_WORLD_ADAPTER,LABIRINTO_WORLD_ADAPTER,MUSEU_WORLD_ADAPTER
]);
const WORLD_ADAPTER_INDEX=new Map(WORLD_ADAPTERS.flatMap(adapter=>[[adapter.id,adapter],[adapter.scene,adapter]]));
export function getWorldAdapter(ref){return WORLD_ADAPTER_INDEX.get(String(ref||''))||null;}
