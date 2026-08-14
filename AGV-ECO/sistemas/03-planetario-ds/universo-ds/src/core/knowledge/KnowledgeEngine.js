const normalize=value=>String(value??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
const searchable=item=>normalize([item.name,item.category,item.type,item.summary,item.quickFact,...(item.tags||[]),...(item.facts||[]),...(item.curiosities||[]),...(item.technical?.systems||[]),...(item.technical?.languages||[])].join(' '));

export class KnowledgeEngine {
  constructor(entries=[],sources={}){
    this.entries=entries.map(item=>structuredClone(item));
    this.sources=sources;
    this.byId=new Map(this.entries.map(item=>[item.id,item]));
    this.index=new Map(this.entries.map(item=>[item.id,searchable(item)]));
    this.validate();
  }
  validate(){
    const ids=new Set();
    for(const item of this.entries){
      if(!item.id||ids.has(item.id))throw new Error(`Item de conhecimento inválido ou duplicado: ${item.id||'sem id'}`);
      ids.add(item.id);
      if(!item.name||!item.summary||!item.sourceIds?.length)throw new Error(`Item incompleto: ${item.id}`);
      for(const sourceId of item.sourceIds)if(!this.sources[sourceId])throw new Error(`Fonte ausente em ${item.id}: ${sourceId}`);
    }
    return true;
  }
  get(id){const item=this.byId.get(id);return item?structuredClone(item):null;}
  list(){return this.entries.map(item=>structuredClone(item));}
  categories(){return [...new Set(this.entries.map(item=>item.category))].sort((a,b)=>a.localeCompare(b,'pt-BR'));}
  search(query='',options={}){
    const needle=normalize(query),type=options.type||'all',category=options.category||'all';
    const favorites=new Set(options.favorites||[]),discovered=new Set(options.discovered||[]);
    return this.entries.filter(item=>{
      if(type!=='all'&&item.type!==type)return false;
      if(category!=='all'&&item.category!==category)return false;
      if(options.onlyFavorites&&!favorites.has(item.id))return false;
      if(options.onlyUndiscovered&&discovered.has(item.id))return false;
      return !needle||this.index.get(item.id).includes(needle);
    }).map(item=>structuredClone(item));
  }
  related(id,limit=6){const item=this.byId.get(id);if(!item)return[];return (item.relations||[]).map(key=>this.byId.get(key)).filter(Boolean).slice(0,limit).map(entry=>structuredClone(entry));}
  sourcesFor(id){const item=this.byId.get(id);return item?(item.sourceIds||[]).map(sourceId=>this.sources[sourceId]).filter(Boolean).map(source=>structuredClone(source)):[];}
  compare(ids=[]){
    const items=[...new Set(ids)].map(id=>this.byId.get(id)).filter(Boolean).slice(0,3);
    const metricKeys=[...new Set(items.flatMap(item=>Object.keys(item.metrics||{})))];
    return {items:items.map(item=>structuredClone(item)),metrics:metricKeys.map(key=>({key,values:items.map(item=>item.metrics?.[key]??'—')}))};
  }
  random(exclude=[]){const blocked=new Set(exclude),pool=this.entries.filter(item=>!blocked.has(item.id));return structuredClone((pool.length?pool:this.entries)[Math.floor(Math.random()*(pool.length||this.entries.length))]);}
}
