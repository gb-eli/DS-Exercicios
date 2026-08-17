export class ScienceDatabase {
  constructor(records=[]){this.records=records.map(item=>({...item}));}
  add(record){
    if(!record?.id||!record.classification) return {ok:false,reason:'Registro incompleto.'};
    if(this.records.some(item=>item.id===record.id)) return {ok:false,reason:'Amostra já registrada.'};
    const clean={id:String(record.id),name:String(record.name??record.id),classification:String(record.classification),confidence:Number(record.confidence)||0,x:Number(record.x)||0,y:Number(record.y)||0,massG:Number(record.massG)||0,notes:String(record.notes??''),capturedAt:record.capturedAt??new Date().toISOString()};
    this.records.push(clean);return {ok:true,record:{...clean}};
  }
  list(filter='all'){
    const data=filter==='all'?this.records:this.records.filter(item=>item.classification===filter);return data.map(item=>({...item}));
  }
  stats(){
    const byClass={};let massG=0;for(const item of this.records){byClass[item.classification]=(byClass[item.classification]??0)+1;massG+=item.massG;}
    return {count:this.records.length,massG:Number(massG.toFixed(1)),byClass};
  }
  export(){return JSON.stringify({schema:'cosmos-ds-mars-science-v1',exportedAt:new Date().toISOString(),records:this.records},null,2);}
  clear(){this.records=[];}
}
