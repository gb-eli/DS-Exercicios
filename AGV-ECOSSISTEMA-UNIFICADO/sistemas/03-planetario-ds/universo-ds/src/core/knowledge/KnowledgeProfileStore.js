const cleanList=value=>Array.isArray(value)?[...new Set(value.map(String))]:[];
export class KnowledgeProfileStore {
  constructor(storage,profileId){this.storage=storage;this.profileId=profileId;this.state=this.load();}
  key(){return `knowledge-profile:${this.profileId}`;}
  load(){const data=this.storage.get(this.key(),{});return {schema:'cosmos-ds-knowledge-profile-v1',favorites:cleanList(data.favorites),discovered:cleanList(data.discovered),comparison:cleanList(data.comparison).slice(0,3),lastViewed:String(data.lastViewed||'earth'),updatedAt:data.updatedAt||new Date().toISOString()};}
  save(){this.state.updatedAt=new Date().toISOString();this.storage.set(this.key(),this.state);return this.snapshot();}
  snapshot(){return structuredClone(this.state);}
  isFavorite(id){return this.state.favorites.includes(id);}
  toggleFavorite(id){this.state.favorites=this.isFavorite(id)?this.state.favorites.filter(key=>key!==id):[...this.state.favorites,id];return this.save();}
  discover(id){const fresh=!this.state.discovered.includes(id);if(fresh)this.state.discovered.push(id);this.state.lastViewed=id;this.save();return fresh;}
  setLastViewed(id){this.state.lastViewed=id;return this.save();}
  toggleComparison(id){const has=this.state.comparison.includes(id);if(has)this.state.comparison=this.state.comparison.filter(key=>key!==id);else if(this.state.comparison.length<3)this.state.comparison.push(id);else this.state.comparison=[...this.state.comparison.slice(1),id];return this.save();}
  clearComparison(){this.state.comparison=[];return this.save();}
}
