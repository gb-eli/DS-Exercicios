import { MissionPlan } from './MissionPlan.js';
export class MissionRepository {
  constructor(storage,profileId){this.storage=storage;this.profileId=profileId;this.planKey=`mission-plans-${profileId}`;this.sessionKey=`mission-sessions-${profileId}`;}
  listPlans(){return (this.storage.get(this.planKey,[])||[]).map(item=>MissionPlan.fromJSON(item));}
  getPlan(id){return this.listPlans().find(item=>item.id===id)??null;}
  savePlan(plan){const valid=plan instanceof MissionPlan?plan:MissionPlan.fromJSON(plan);const list=this.listPlans().map(item=>item.toJSON());const index=list.findIndex(item=>item.id===valid.id);if(index>=0)list[index]=valid.toJSON();else list.unshift(valid.toJSON());this.storage.set(this.planKey,list.slice(0,40));return valid;}
  removePlan(id){const next=this.listPlans().filter(item=>item.id!==id).map(item=>item.toJSON());this.storage.set(this.planKey,next);return next.length;}
  importPlan(data){return this.savePlan(MissionPlan.fromJSON(data));}
  listSessions(){return this.storage.get(this.sessionKey,[])||[];}
  saveSession(snapshot){const list=this.listSessions();const index=list.findIndex(item=>item.id===snapshot.id);if(index>=0)list[index]=snapshot;else list.unshift(snapshot);this.storage.set(this.sessionKey,list.slice(0,30));return snapshot;}
  getSession(id){return this.listSessions().find(item=>item.id===id)??null;}
  latestSession(){return this.listSessions()[0]??null;}
}
