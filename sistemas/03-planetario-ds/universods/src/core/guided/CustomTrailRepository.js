import { CustomTrailPlan } from './CustomTrailPlan.js';
export class CustomTrailRepository {
  constructor(storage){this.storage=storage;this.key='teacher-trails-c23';}
  list(){return (this.storage.get(this.key,[])||[]).map(item=>CustomTrailPlan.fromJSON(item));}
  getPlan(id){return this.list().find(item=>item.id===id)||null;}
  findByCode(code){const clean=String(code||'').trim().toUpperCase();return this.list().find(item=>item.accessCode===clean)||null;}
  save(plan){const valid=plan instanceof CustomTrailPlan?plan:CustomTrailPlan.fromJSON(plan);const list=this.list().map(item=>item.toJSON());const index=list.findIndex(item=>item.id===valid.id);if(index>=0)list[index]=valid.toJSON();else list.unshift(valid.toJSON());this.storage.set(this.key,list.slice(0,50));return valid;}
  remove(id){const next=this.list().filter(item=>item.id!==id).map(item=>item.toJSON());this.storage.set(this.key,next);return next.length;}
  importPlan(data){return this.save(CustomTrailPlan.fromJSON(data));}
  duplicate(id){const source=this.getPlan(id);if(!source)throw new Error('Trilha não encontrada.');return this.save(source.clone({id:`${source.id}-copia-${Date.now()}`,title:`${source.title} — cópia`,accessCode:CustomTrailPlan.generateCode(source.title),createdAt:new Date().toISOString()}));}
  exportAll(){return JSON.stringify({schema:'cosmos-ds-custom-trail-pack-v1',exportedAt:new Date().toISOString(),plans:this.list().map(item=>item.toJSON())},null,2);}
  importPack(data){const plans=data?.schema==='cosmos-ds-custom-trail-pack-v1'?data.plans:[data];if(!Array.isArray(plans))throw new Error('Pacote de trilhas inválido.');return plans.map(item=>this.importPlan(item));}
}
