const normalize=value=>String(value??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
export class KnowledgeTimelineEngine{
  constructor(events=[],sources={},entryIds=[]){this.events=events.map(item=>structuredClone(item)).sort((a,b)=>a.year-b.year);this.sources=sources;this.entryIds=new Set(entryIds);this.validate();}
  validate(){const ids=new Set();for(const event of this.events){if(!event.id||ids.has(event.id))throw new Error(`Evento inválido: ${event.id}`);ids.add(event.id);if(!Number.isFinite(event.year)||!event.title||!event.relatedId)throw new Error(`Evento incompleto: ${event.id}`);if(!this.entryIds.has(event.relatedId))throw new Error(`Relação ausente: ${event.relatedId}`);for(const sourceId of event.sourceIds||[])if(!this.sources[sourceId])throw new Error(`Fonte ausente no evento ${event.id}: ${sourceId}`);}return true;}
  categories(){return [...new Set(this.events.map(item=>item.era))].sort((a,b)=>a.localeCompare(b,'pt-BR'));}
  list({era='all',query=''}={}){const needle=normalize(query);return this.events.filter(item=>(era==='all'||item.era===era)&&(!needle||normalize([item.year,item.title,item.summary,item.technology,item.era].join(' ')).includes(needle))).map(item=>structuredClone(item));}
  get(id){const item=this.events.find(event=>event.id===id);return item?structuredClone(item):null;}
  range(){return this.events.length?{start:this.events[0].year,end:this.events.at(-1).year,count:this.events.length}:{start:0,end:0,count:0};}
}
