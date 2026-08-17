import { AGC_SPEC, APOLLO_TASKS, ASSEMBLY_INSTRUCTIONS } from '../../data/lunarSystems.js';

const normalizeLine=line=>line.trim().replace(/\s+/g,' ').toUpperCase();
const clamp=(value,min,max)=>Math.min(max,Math.max(min,value));

export class ApolloComputer {
  constructor({ tasks=APOLLO_TASKS, cycleBudget=AGC_SPEC.cycleBudget, erasableWords=AGC_SPEC.erasableWords }={}) {
    this.baseTasks=tasks.map(task=>({...task,enabled:!['rendezvous-radar','science'].includes(task.id)}));
    this.cycleBudget=cycleBudget;
    this.erasableWords=erasableWords;
    this.tickCount=0;
    this.restartCount=0;
    this.alarms=[];
    this.lastSchedule=[];
    this.lastDropped=[];
    this.registers={A:0,B:0,C:0,ALT:0,VSPD:0,HSPD:0,FUEL:100,HAZARD:0};
    this.memory=new Map();
    this.actuators={THROTTLE:0,PITCH:0,MODE:'AUTO'};
  }
  reset(){
    this.baseTasks=this.baseTasks.map(task=>({...task,enabled:!['rendezvous-radar','science'].includes(task.id)}));
    this.tickCount=0;this.restartCount=0;this.alarms=[];this.lastSchedule=[];this.lastDropped=[];
    this.memory.clear();this.actuators={THROTTLE:0,PITCH:0,MODE:'AUTO'};
  }
  setTaskEnabled(id,enabled){const task=this.baseTasks.find(item=>item.id===id);if(task)task.enabled=Boolean(enabled);return this.snapshot();}
  injectRendezvousRadar(){return this.setTaskEnabled('rendezvous-radar',true);}
  updateSensors(sensors={}){
    for(const key of ['ALT','VSPD','HSPD','FUEL','HAZARD'])if(Number.isFinite(Number(sensors[key])))this.registers[key]=Number(sensors[key]);
  }
  schedule(){
    this.tickCount++;
    const tasks=this.baseTasks.filter(task=>task.enabled).sort((a,b)=>a.priority-b.priority||Number(b.critical)-Number(a.critical));
    let remaining=this.cycleBudget;const scheduled=[];const dropped=[];
    for(const task of tasks){
      if(task.cycles<=remaining){scheduled.push({...task,status:'RUN'});remaining-=task.cycles;}
      else dropped.push({...task,status:'DEFERRED'});
    }
    const criticalDropped=dropped.filter(task=>task.critical);
    const overloaded=dropped.length>0;
    if(overloaded){
      const code=criticalDropped.length?'1201':'1202';
      this.raiseAlarm(code,criticalDropped.length?'Tarefa crítica não encontrou slot executivo.':'Sobrecarga controlada: tarefas secundárias adiadas.');
    }
    this.lastSchedule=scheduled;this.lastDropped=dropped;
    return { scheduled, dropped, remaining, overloaded, alarm:this.alarms.at(-1)??null };
  }
  raiseAlarm(code,message){
    const duplicate=this.alarms.at(-1)?.code===code&&this.alarms.at(-1)?.tick===this.tickCount;
    if(!duplicate)this.alarms.push({code,message,tick:this.tickCount,time:Date.now()});
    if(this.alarms.length>20)this.alarms.shift();
  }
  priorityRestart(){
    this.restartCount++;
    for(const task of this.baseTasks)if(!task.critical&&task.priority>=4)task.enabled=false;
    this.lastDropped=[];
    return this.schedule();
  }
  memoryUsage(){
    const taskWords=this.baseTasks.filter(task=>task.enabled).reduce((sum,task)=>sum+task.erasableWords,0);
    return { used:taskWords+this.memory.size, total:this.erasableWords, percent:clamp((taskWords+this.memory.size)/this.erasableWords*100,0,100) };
  }
  validateProgram(source=''){
    const lines=source.split(/\r?\n/).map(normalizeLine).filter(Boolean).filter(line=>!line.startsWith(';'));
    const labels=new Set(lines.filter(line=>line.endsWith(':')).map(line=>line.slice(0,-1)));
    const instructions=[];const errors=[];let cost=0;
    lines.forEach((line,index)=>{
      if(line.endsWith(':'))return;
      const [mnemonic,...args]=line.split(' ');const spec=ASSEMBLY_INSTRUCTIONS.find(item=>item.mnemonic===mnemonic);
      if(!spec){errors.push(`Linha ${index+1}: instrução ${mnemonic||'(vazia)'} não reconhecida.`);return;}
      if(['JGT','JLT'].includes(mnemonic)&&args[0]&&!labels.has(args[0]))errors.push(`Linha ${index+1}: rótulo ${args[0]} não encontrado.`);
      instructions.push({line,index:index+1,mnemonic,args,spec});cost+=spec.cost;
    });
    if(!instructions.some(item=>item.mnemonic==='END'))errors.push('O programa precisa terminar com END.');
    if(instructions.length>32)errors.push('Programa excede o limite didático de 32 instruções.');
    return {ok:errors.length===0,errors,instructions,labels:[...labels],cost,words:instructions.length*2};
  }
  executeProgram(source='',sensors={}){
    this.updateSensors(sensors);const validation=this.validateProgram(source);if(!validation.ok)return {...validation,trace:[],registers:{...this.registers},actuators:{...this.actuators}};
    const rawLines=source.split(/\r?\n/).map(normalizeLine).filter(Boolean).filter(line=>!line.startsWith(';'));
    const labels={};rawLines.forEach((line,index)=>{if(line.endsWith(':'))labels[line.slice(0,-1)]=index;});
    const trace=[];let pc=0;let compare=0;let guard=0;
    while(pc<rawLines.length&&guard++<96){
      const line=rawLines[pc];if(line.endsWith(':')){pc++;continue;}
      const [op,...args]=line.split(' ');trace.push({pc,line});
      if(op==='LOAD')this.registers[args[0]]=Number(args[1])||0;
      if(op==='READ')this.registers[args[0]]=Number(this.registers[args[1]]??0);
      if(op==='CMP')compare=Number(this.registers[args[0]]??0)-Number(args[1]??0);
      if(op==='JGT'&&compare>0){pc=(labels[args[0]]??pc)+1;continue;}
      if(op==='JLT'&&compare<0){pc=(labels[args[0]]??pc)+1;continue;}
      if(op==='SET')this.actuators[args[0]]=Number.isFinite(Number(args[1]))?Number(args[1]):args.slice(1).join('_');
      if(op==='STORE'){const address=clamp(Number(args[0])||0,0,this.erasableWords-1);this.memory.set(address,Number(this.registers[args[1]]??0));}
      if(op==='ALARM')this.raiseAlarm(args[0]||'0000','Alarme emitido pelo programa didático.');
      if(op==='END')break;
      pc++;
    }
    return {...validation,trace,registers:{...this.registers},actuators:{...this.actuators},memory:this.memoryUsage()};
  }
  snapshot(){
    return {
      tick:this.tickCount,restarts:this.restartCount,cycleBudget:this.cycleBudget,
      tasks:this.baseTasks.map(task=>({...task})),schedule:this.lastSchedule.map(task=>({...task})),dropped:this.lastDropped.map(task=>({...task})),
      alarms:this.alarms.map(alarm=>({...alarm})),memory:this.memoryUsage(),registers:{...this.registers},actuators:{...this.actuators}
    };
  }
}
