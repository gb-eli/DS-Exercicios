const normalize=value=>String(value??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
const searchable=item=>normalize([item.name,item.category,item.type,item.role,item.year,item.summary,item.quickFact,...(item.tags||[]),...(item.facts||[]),...(item.curiosities||[]),...(item.technical?.systems||[]),...(item.technical?.languages||[])].join(' '));
const formatNumber=(value,unit)=>`${new Intl.NumberFormat('pt-BR',{maximumFractionDigits:value<10?2:0}).format(value)} ${unit}`.trim();

export class KnowledgeEngine {
  constructor(entries=[],sources={}){
    this.entries=entries.map(item=>structuredClone(item));this.sources=sources;
    this.byId=new Map(this.entries.map(item=>[item.id,item]));this.index=new Map(this.entries.map(item=>[item.id,searchable(item)]));this.validate();
  }
  validate(){const ids=new Set();for(const item of this.entries){if(!item.id||ids.has(item.id))throw new Error(`Item de conhecimento inválido ou duplicado: ${item.id||'sem id'}`);ids.add(item.id);if(!item.name||!item.summary||!item.sourceIds?.length)throw new Error(`Item incompleto: ${item.id}`);for(const sourceId of item.sourceIds)if(!this.sources[sourceId])throw new Error(`Fonte ausente em ${item.id}: ${sourceId}`);}return true;}
  get(id){const item=this.byId.get(id);return item?structuredClone(item):null;}
  list(){return this.entries.map(item=>structuredClone(item));}
  categories(){return [...new Set(this.entries.map(item=>item.category))].sort((a,b)=>a.localeCompare(b,'pt-BR'));}
  types(){return [...new Set(this.entries.map(item=>item.type))];}
  stats(){return {total:this.entries.length,types:Object.fromEntries(this.types().map(type=>[type,this.entries.filter(item=>item.type===type).length])),categories:this.categories().length,sources:Object.keys(this.sources).length};}
  search(query='',options={}){const needle=normalize(query),type=options.type||'all',category=options.category||'all';const favorites=new Set(options.favorites||[]),discovered=new Set(options.discovered||[]);return this.entries.filter(item=>{if(type!=='all'&&item.type!==type)return false;if(category!=='all'&&item.category!==category)return false;if(options.onlyFavorites&&!favorites.has(item.id))return false;if(options.onlyUndiscovered&&discovered.has(item.id))return false;return !needle||this.index.get(item.id).includes(needle);}).map(item=>structuredClone(item));}
  related(id,limit=8){const item=this.byId.get(id);if(!item)return[];return (item.relations||[]).map(key=>this.byId.get(key)).filter(Boolean).slice(0,limit).map(entry=>structuredClone(entry));}
  sourcesFor(id){const item=this.byId.get(id);return item?(item.sourceIds||[]).map(sourceId=>this.sources[sourceId]).filter(Boolean).map(source=>structuredClone(source)):[];}
  compare(ids=[]){const items=[...new Set(ids)].map(id=>this.byId.get(id)).filter(Boolean).slice(0,3);const metricKeys=[...new Set(items.flatMap(item=>Object.keys(item.metrics||{})))];return {items:items.map(item=>structuredClone(item)),metrics:metricKeys.map(key=>({key,values:items.map(item=>item.metrics?.[key]??'—')}))};}
  compareAdvanced(ids=[],dimensions=[]){const items=[...new Set(ids)].map(id=>this.byId.get(id)).filter(Boolean).slice(0,3);const rows=dimensions.map(dimension=>{const values=items.map(item=>Number(item.compare?.[dimension.id]));const finite=values.filter(Number.isFinite);if(!finite.length)return null;const min=Math.min(...finite),max=Math.max(...finite);const widths=values.map(value=>{if(!Number.isFinite(value))return 0;if(dimension.scale==='log'){const top=Math.log10(Math.max(1,max)+1);return top?Math.max(4,Math.log10(Math.max(0,value)+1)/top*100):100;}if(dimension.scale==='range'){const span=max-min||1;return Math.max(4,(value-min)/span*86+14);}return max?Math.max(4,value/max*100):100;});return {...dimension,values:values.map((value,index)=>({raw:Number.isFinite(value)?value:null,label:Number.isFinite(value)?formatNumber(value,dimension.unit):'—',width:widths[index]}))};}).filter(Boolean);return {items:items.map(item=>structuredClone(item)),rows};}
  random(exclude=[]){const blocked=new Set(exclude),pool=this.entries.filter(item=>!blocked.has(item.id));return structuredClone((pool.length?pool:this.entries)[Math.floor(Math.random()*(pool.length||this.entries.length))]);}
}
