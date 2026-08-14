import { ARM_TASKS } from '../../data/stationSystems.js';
const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));

export class RoboticArmModel {
  constructor(){this.reset();}
  reset(){this.state='OFF';this.taskIndex=0;this.joints={base:0,shoulder:0,elbow:0,wrist:0};this.payload=false;this.berth=false;this.events=[];}
  adjust(joint,delta){if(!(joint in this.joints))return {ok:false,reason:'Junta desconhecida.'};if(['OFF','STOWED'].includes(this.state))return {ok:false,reason:'Energize o braço antes de movimentar.'};const limits={base:180,shoulder:95,elbow:120,wrist:180};this.joints[joint]=clamp(this.joints[joint]+delta,-limits[joint],limits[joint]);return {ok:true,snapshot:this.snapshot()};}
  execute(command){
    const task=ARM_TASKS[this.taskIndex];if(!task)return {ok:false,reason:'Sequência já concluída.'};if(task.command!==command)return {ok:false,reason:`Próxima etapa: ${task.label}.`};
    if(command==='power')this.state='READY';
    if(command==='align'){this.state='ALIGNED';this.joints={base:28,shoulder:34,elbow:-42,wrist:18};}
    if(command==='grapple'){if(this.state!=='ALIGNED')return {ok:false,reason:'Efetuador não alinhado.'};this.state='GRAPPLED';this.payload=true;}
    if(command==='translate'){if(!this.payload)return {ok:false,reason:'Nenhuma carga capturada.'};this.state='TRANSLATING';this.joints={base:72,shoulder:18,elbow:-22,wrist:6};}
    if(command==='berth'){if(this.state!=='TRANSLATING')return {ok:false,reason:'Carga fora do envelope do berço.'};this.state='BERTHED';this.payload=false;this.berth=true;}
    if(command==='stow'){if(!this.berth)return {ok:false,reason:'Finalize a fixação antes de recolher.'};this.state='STOWED';this.joints={base:0,shoulder:0,elbow:0,wrist:0};}
    this.events.push({type:'arm',message:task.label});this.taskIndex++;return {ok:true,task,snapshot:this.snapshot()};
  }
  completion(){return this.taskIndex/ARM_TASKS.length;}
  drainEvents(){const events=[...this.events];this.events=[];return events;}
  snapshot(){return {state:this.state,taskIndex:this.taskIndex,joints:{...this.joints},payload:this.payload,berth:this.berth,complete:this.taskIndex>=ARM_TASKS.length,completion:this.completion()};}
}
