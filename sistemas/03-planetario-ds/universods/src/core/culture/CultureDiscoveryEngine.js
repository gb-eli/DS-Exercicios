const normalize=value=>String(value??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const clone=value=>structuredClone(value);

export class CultureDiscoveryEngine {
  constructor({organizations=[],careers=[],works=[],trails=[],sources={}}={}){
    this.organizations=organizations;this.careers=careers;this.works=works;this.trails=trails;this.sources=sources;
    this.index=[
      ...organizations.map(item=>({...item,entityType:'organization',searchText:[item.name,item.region,item.summary,item.focus,item.technology,item.examples].flat().join(' ')})),
      ...careers.map(item=>({...item,entityType:'career',searchText:[item.name,item.area,item.summary,item.skills,item.tools,item.challenge].flat().join(' ')})),
      ...works.map(item=>({...item,entityType:'work',searchText:[item.title,item.type,item.entry,item.science,item.fiction,item.discussion,item.tone].flat().join(' ')}))
    ];
  }
  search(query='',type='all'){
    const needle=normalize(query);
    return this.index.filter(item=>(type==='all'||item.entityType===type)&&(!needle||normalize(item.searchText).includes(needle))).map(clone);
  }
  get(type,id){const collection=type==='organization'?this.organizations:type==='career'?this.careers:type==='work'?this.works:[];const item=collection.find(entry=>entry.id===id);return item?clone(item):null;}
  source(id){const source=this.sources[id];return source?clone(source):null;}
  recommend(interests=[]){
    const wanted=new Set(interests);
    const trail=this.trails.find(item=>wanted.has(item.interest))||this.trails[0]||null;
    const careers=this.careers.filter(item=>wanted.has('programação')?['Programação','Dados','Segurança'].includes(item.area):wanted.has('tecnologia')?['Integração','Hardware','Robótica','Comunicação'].includes(item.area):wanted.has('carreiras')).slice(0,4);
    const works=this.works.filter(item=>wanted.has('astronomia')?item.modules.some(module=>['observatory','telescope-lab','deep-space-remaster'].includes(module)):wanted.has('história')?item.modules.includes('history'):wanted.has('cultura')).slice(0,4);
    const organizations=this.organizations.filter(item=>wanted.has('tecnologia')?item.technology.length>=3:wanted.has('história')?item.founded<1990:true).slice(0,4);
    return {trail:trail?clone(trail):null,careers:clone(careers),works:clone(works),organizations:clone(organizations)};
  }
  scienceFictionBalance(workId){
    const work=this.works.find(item=>item.id===workId);if(!work)return null;
    const science=work.science?.length||0,fiction=work.fiction?.length||0,total=Math.max(1,science+fiction);
    return {science,fiction,sciencePercent:Math.round(science/total*100),fictionPercent:Math.round(fiction/total*100)};
  }
  validate(){
    const ids=this.index.map(item=>`${item.entityType}:${item.id}`);const unique=new Set(ids);
    const missingSources=this.organizations.filter(item=>!this.sources[item.sourceId]).map(item=>item.id);
    const brokenModules=this.index.filter(item=>!Array.isArray(item.modules)||item.modules.length===0).map(item=>item.id);
    return {ok:ids.length===unique.size&&!missingSources.length&&!brokenModules.length,total:ids.length,missingSources,brokenModules};
  }
}
