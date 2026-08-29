export class StorageDiagnostics {
  constructor(navigatorRef=globalThis.navigator,storageRef=globalThis.localStorage){this.navigator=navigatorRef;this.storage=storageRef;}
  async run(prefix='cosmos-ds-v1'){
    let writable=false,error='';
    try{const key=`${prefix}:diagnostic`;this.storage.setItem(key,'ok');writable=this.storage.getItem(key)==='ok';this.storage.removeItem(key);}catch(err){error=err?.message||'Falha desconhecida';}
    let estimate={usage:0,quota:0},persisted=null;
    try{estimate=await this.navigator?.storage?.estimate?.()??estimate;}catch{}
    try{persisted=await this.navigator?.storage?.persisted?.()??null;}catch{}
    let keys=0;try{for(let i=0;i<this.storage.length;i++)if(this.storage.key(i)?.startsWith(`${prefix}:`))keys++;}catch{}
    return {writable,error,usage:Number(estimate.usage||0),quota:Number(estimate.quota||0),persisted,keys,storageApi:Boolean(this.navigator?.storage),checkedAt:new Date().toISOString()};
  }
}
