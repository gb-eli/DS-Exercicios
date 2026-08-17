const clone=value=>structuredClone(value);
export class GuidedTrailStore {
  constructor(storage,profileId){this.storage=storage;this.profileId=String(profileId||'visitante');this.key=`guided-trails:${this.profileId}`;this.state=this.normalize(storage.get(this.key,{}));}
  normalize(input={}){return {schema:'cosmos-ds-guided-trails-v1',activeTrailId:input.activeTrailId||null,trails:input.trails&&typeof input.trails==='object'?clone(input.trails):{},updatedAt:input.updatedAt||new Date().toISOString()};}
  snapshot(){return clone(this.state);}
  save(){this.state.updatedAt=new Date().toISOString();this.storage.set(this.key,this.state);return this.snapshot();}
  trail(id){return clone(this.state.trails[id]||null);}
  setTrail(id,value){this.state.trails[id]=clone(value);return this.save();}
  setActive(id){this.state.activeTrailId=id||null;return this.save();}
  reset(id){delete this.state.trails[id];if(this.state.activeTrailId===id)this.state.activeTrailId=null;return this.save();}
}
