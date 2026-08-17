export class ObservationDatabase {
  constructor(records=[]){this.records=Array.isArray(records)?structuredClone(records):[];}
  add(record){const id=String(record?.id??'').trim();if(!id)return {ok:false,reason:'Informe um identificador.'};if(this.records.some(item=>item.id===id))return {ok:false,reason:'Identificador já registrado.'};const normalized={id,targetId:String(record.targetId??''),telescopeId:String(record.telescopeId??''),filters:[...(record.filters??[])],exposure:Number(record.exposure??0),snr:Number(record.snr??0),classification:String(record.classification??''),notes:String(record.notes??'').slice(0,240),createdAt:record.createdAt??new Date().toISOString(),provenance:'COSMOS DS · simulação didática'};this.records.push(normalized);return {ok:true,record:structuredClone(normalized)};}
  list(){return structuredClone(this.records);}
  stats(){const bands={};for(const item of this.records)bands[item.telescopeId]=(bands[item.telescopeId]??0)+1;return {count:this.records.length,averageSnr:this.records.length?Number((this.records.reduce((s,i)=>s+i.snr,0)/this.records.length).toFixed(2)):0,bands};}
  export(){return JSON.stringify({schema:'cosmos-ds-observatory-v1',exportedAt:new Date().toISOString(),records:this.records},null,2);}
}
