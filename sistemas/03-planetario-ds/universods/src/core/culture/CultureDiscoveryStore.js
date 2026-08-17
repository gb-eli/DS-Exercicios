const defaults=()=>({schema:'cosmos-ds-culture-profile-v1',visited:[],favorites:[],interests:[],discussions:{},openedModules:[],selectedTrail:null,lastViewed:null,updatedAt:null});
const unique=list=>[...new Set(list)];
export class CultureDiscoveryStore {
  constructor(storage,profileId){this.storage=storage;this.key=`culture-discovery:${profileId}`;}
  snapshot(){return {...defaults(),...(this.storage.get(this.key,null)||{})};}
  save(state){const next={...defaults(),...state,visited:unique(state.visited||[]),favorites:unique(state.favorites||[]),interests:unique(state.interests||[]),openedModules:unique(state.openedModules||[]),updatedAt:new Date().toISOString()};this.storage.set(this.key,next);return next;}
  visit(type,id){const state=this.snapshot(),key=`${type}:${id}`;state.visited=unique([...state.visited,key]);state.lastViewed=key;return this.save(state);}
  toggleFavorite(type,id){const state=this.snapshot(),key=`${type}:${id}`;state.favorites=state.favorites.includes(key)?state.favorites.filter(item=>item!==key):[...state.favorites,key];return this.save(state);}
  setInterests(interests){const state=this.snapshot();state.interests=unique(interests);return this.save(state);}
  chooseTrail(id){const state=this.snapshot();state.selectedTrail=id;return this.save(state);}
  recordDiscussion(id,text){const state=this.snapshot();state.discussions={...state.discussions,[id]:String(text||'').trim()};return this.save(state);}
  openedModule(id){const state=this.snapshot();state.openedModules=unique([...state.openedModules,id]);return this.save(state);}
}
