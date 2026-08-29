const cleanList=value=>Array.isArray(value)?[...new Set(value.map(String))]:[];
const cleanObject=value=>value&&typeof value==='object'&&!Array.isArray(value)?{...value}:{};
export class KnowledgeProfileStore {
  constructor(storage,profileId){this.storage=storage;this.profileId=profileId;this.state=this.load();}
  key(){return `knowledge-profile:${this.profileId}`;}
  load(){const data=this.storage.get(this.key(),{});return {schema:'cosmos-ds-knowledge-profile-v2',favorites:cleanList(data.favorites),discovered:cleanList(data.discovered),comparison:cleanList(data.comparison).slice(0,3),timelineViewed:cleanList(data.timelineViewed),recordsViewed:cleanList(data.recordsViewed),mythAnswers:cleanObject(data.mythAnswers),lastViewed:String(data.lastViewed||'earth'),narrationEnabled:data.narrationEnabled!==false,updatedAt:data.updatedAt||new Date().toISOString()};}
  save(){this.state.updatedAt=new Date().toISOString();this.storage.set(this.key(),this.state);return this.snapshot();}
  snapshot(){return structuredClone(this.state);}
  isFavorite(id){return this.state.favorites.includes(id);}
  toggleFavorite(id){this.state.favorites=this.isFavorite(id)?this.state.favorites.filter(key=>key!==id):[...this.state.favorites,id];return this.save();}
  discover(id){const fresh=!this.state.discovered.includes(id);if(fresh)this.state.discovered.push(id);this.state.lastViewed=id;this.save();return fresh;}
  setLastViewed(id){this.state.lastViewed=id;return this.save();}
  toggleComparison(id){const has=this.state.comparison.includes(id);if(has)this.state.comparison=this.state.comparison.filter(key=>key!==id);else if(this.state.comparison.length<3)this.state.comparison.push(id);else this.state.comparison=[...this.state.comparison.slice(1),id];return this.save();}
  clearComparison(){this.state.comparison=[];return this.save();}
  viewTimeline(id){const fresh=!this.state.timelineViewed.includes(id);if(fresh)this.state.timelineViewed.push(id);this.save();return fresh;}
  viewRecord(id){const fresh=!this.state.recordsViewed.includes(id);if(fresh)this.state.recordsViewed.push(id);this.save();return fresh;}
  answerMyth(id,answer,correct){const previous=this.state.mythAnswers[id];this.state.mythAnswers[id]={answer:Boolean(answer),correct:Boolean(correct),attempts:(previous?.attempts||0)+1,answeredAt:new Date().toISOString()};this.save();return !previous;}
  setNarration(enabled){this.state.narrationEnabled=Boolean(enabled);return this.save();}
}
