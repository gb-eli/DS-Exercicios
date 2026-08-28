import { SURFACE_OBJECTIVES } from '../../data/lunarSystems.js';

export class SurfaceMissionModel {
  constructor(){this.reset();}
  reset(){this.completed=[];this.samples=[];this.instruments=[];this.roverKm=0;this.energy=100;this.elapsedMinutes=0;this.logs=[];}
  complete(id){
    const objective=SURFACE_OBJECTIVES.find(item=>item.id===id);if(!objective)return{ok:false,message:'Objetivo não encontrado.'};
    if(this.completed.includes(id))return{ok:false,message:'Objetivo já registrado.'};
    if(this.energy<objective.energy)return{ok:false,message:'Energia insuficiente para esta atividade.'};
    const previous=SURFACE_OBJECTIVES[this.completed.length];if(previous&&previous.id!==id)return{ok:false,message:`Conclua primeiro: ${previous.label}.`};
    this.energy-=objective.energy;this.elapsedMinutes+=objective.minutes;this.completed.push(id);
    if(objective.sample)this.samples.push({name:objective.sample,id:`AM-${String(this.samples.length+1).padStart(2,'0')}`,massG:280+this.samples.length*145});
    if(objective.instrument)this.instruments.push({name:objective.instrument,status:'ONLINE'});
    if(objective.roverKm)this.roverKm+=objective.roverKm;
    this.logs.unshift({minute:this.elapsedMinutes,message:`${objective.label} concluído.`});
    return{ok:true,objective:{...objective},snapshot:this.snapshot()};
  }
  canReturn(){return this.completed.includes('return-lm');}
  snapshot(){return{completed:[...this.completed],samples:this.samples.map(item=>({...item})),instruments:this.instruments.map(item=>({...item})),roverKm:this.roverKm,energy:this.energy,elapsedMinutes:this.elapsedMinutes,logs:this.logs.map(item=>({...item})),complete:this.completed.length===SURFACE_OBJECTIVES.length};}
}
