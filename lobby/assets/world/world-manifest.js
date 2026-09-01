export const WORLD_MANIFEST_SCHEMA=1;
export const WORLD_MANIFEST_REQUIRED_FIELDS=Object.freeze([
  'id','scene','name','version','category','enabled','spawn','bounds','portals','connections','destinations','interiors','npcProfiles','vehicles','environment','identity'
]);

const plainObject=value=>!!value&&typeof value==='object'&&!Array.isArray(value);
const text=(value,field)=>{const out=String(value??'').trim();if(!out)throw new TypeError(`world_manifest_${field}_required`);return out;};
const finiteOrNull=value=>Number.isFinite(Number(value))?Number(value):null;
const uniqueStrings=value=>Object.freeze([...new Set((Array.isArray(value)?value:[]).map(item=>String(item??'').trim()).filter(Boolean))]);

export function deepFreezeManifest(value,seen=new WeakSet()){
  if(!value||typeof value!=='object'||seen.has(value))return value;
  seen.add(value);
  for(const child of Object.values(value))deepFreezeManifest(child,seen);
  return Object.freeze(value);
}

function normalizeSpawn(value){
  if(!plainObject(value))throw new TypeError('world_manifest_spawn_invalid');
  const x=finiteOrNull(value.x),z=finiteOrNull(value.z),y=value.y==null?0:finiteOrNull(value.y);
  if(x==null||y==null||z==null)throw new TypeError('world_manifest_spawn_invalid');
  return {x,y,z,...(value.id?{id:String(value.id)}:{})};
}
function normalizeBounds(value){
  if(!plainObject(value))throw new TypeError('world_manifest_bounds_invalid');
  const minX=finiteOrNull(value.minX),maxX=finiteOrNull(value.maxX),minZ=finiteOrNull(value.minZ),maxZ=finiteOrNull(value.maxZ);
  if([minX,maxX,minZ,maxZ].some(v=>v==null)||minX>=maxX||minZ>=maxZ)throw new TypeError('world_manifest_bounds_invalid');
  return {minX,maxX,minZ,maxZ};
}
function normalizeRecords(value,field){
  if(!Array.isArray(value))throw new TypeError(`world_manifest_${field}_invalid`);
  return value.map((record,index)=>{
    if(typeof record==='string')return {id:text(record,`${field}_${index}_id`)};
    if(!plainObject(record))throw new TypeError(`world_manifest_${field}_invalid`);
    const id=text(record.id,`${field}_${index}_id`);
    return {...record,id};
  });
}

export function createWorldManifest(definition={}){
  if(!plainObject(definition))throw new TypeError('world_manifest_invalid');
  const manifest={
    schemaVersion:WORLD_MANIFEST_SCHEMA,
    id:text(definition.id,'id'),
    scene:text(definition.scene,'scene'),
    name:text(definition.name,'name'),
    version:text(definition.version,'version'),
    category:text(definition.category,'category'),
    enabled:definition.enabled!==false,
    spawn:normalizeSpawn(definition.spawn),
    bounds:normalizeBounds(definition.bounds),
    portals:normalizeRecords(definition.portals,'portals'),
    connections:uniqueStrings(definition.connections),
    destinations:normalizeRecords(definition.destinations,'destinations'),
    interiors:normalizeRecords(definition.interiors,'interiors'),
    npcProfiles:normalizeRecords(definition.npcProfiles,'npcProfiles'),
    vehicles:normalizeRecords(definition.vehicles,'vehicles'),
    environment:plainObject(definition.environment)?{...definition.environment}:{},
    identity:plainObject(definition.identity)?{...definition.identity}:{},
    aliases:uniqueStrings(definition.aliases),
    sceneAliases:uniqueStrings(definition.sceneAliases),
    presenceArea:String(definition.presenceArea||definition.id),
    presenceAreas:uniqueStrings(definition.presenceAreas?.length?definition.presenceAreas:[definition.presenceArea||definition.id]),
    source:plainObject(definition.source)?{...definition.source}:{},
    capabilities:plainObject(definition.capabilities)?{...definition.capabilities}:{}
  };
  validateWorldManifest(manifest);
  return deepFreezeManifest(manifest);
}

export function validateWorldManifest(manifest){
  if(!plainObject(manifest))throw new TypeError('world_manifest_invalid');
  for(const field of WORLD_MANIFEST_REQUIRED_FIELDS)if(!(field in manifest))throw new TypeError(`world_manifest_missing_${field}`);
  text(manifest.id,'id');text(manifest.scene,'scene');text(manifest.name,'name');text(manifest.version,'version');text(manifest.category,'category');
  normalizeSpawn(manifest.spawn);normalizeBounds(manifest.bounds);
  for(const field of ['portals','connections','destinations','interiors','npcProfiles','vehicles'])if(!Array.isArray(manifest[field]))throw new TypeError(`world_manifest_${field}_invalid`);
  if(!plainObject(manifest.environment)||!plainObject(manifest.identity))throw new TypeError('world_manifest_metadata_invalid');
  return true;
}

export function isWorldManifest(value){try{return validateWorldManifest(value)}catch(_){return false;}}
