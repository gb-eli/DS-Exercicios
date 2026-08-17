import { MarsGrid } from './MarsGrid.js';
import { MarsCommandQueue } from './MarsCommandQueue.js';
import { DroneSystem } from './DroneSystem.js';

const clamp=(v,min,max)=>Math.min(max,Math.max(min,v));
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);

export class MarsMissionModel {
  constructor(config={}){this.configure(config);}
  configure(config={}){
    this.grid=new MarsGrid(config.grid);this.position={x:config.startX??0,y:config.startY??11};this.heading=0;this.battery=100;this.temperatureC=-22;this.wheelSlip=0;this.elapsed=0;this.distanceM=0;this.dataMb=0;this.state='READY';this.events=[];this.activeFault=null;this.commandHistory=[];this.currentRoute=[];this.routeIndex=0;this.commandQueue=new MarsCommandQueue({oneWaySeconds:config.oneWaySeconds??4,packetLoss:config.packetLoss??0});this.drone=new DroneSystem();this.stormLevel=0;this.sampleCount=0;this.armState='STOWED';this.cameraMode='NAV';this.missionId=config.missionId??'engineering';return this.telemetry();
  }
  log(type,message){this.events.push({type,message,time:this.elapsed});}
  start(){if(this.state==='READY'||this.state==='PAUSED'){this.state='ACTIVE';this.log('state','Missão de superfície ativa.');return true;}return false;}
  pause(){if(this.state==='ACTIVE'){this.state='PAUSED';this.log('state','Operação pausada.');return true;}return false;}
  enqueue(command,priority='normal'){const result=this.commandQueue.enqueue(command,this.elapsed,priority);this.log(result.accepted?'uplink':'warning',result.accepted?`${result.id} enviado; chegada prevista em ${result.item.deliverAt.toFixed(1)} s.`:result.reason);return result;}
  setRoute(path=[]){this.currentRoute=path.map(p=>({x:Number(p.x),y:Number(p.y)}));this.routeIndex=0;}
  injectFault(id){this.activeFault=id;if(id==='wheel-slip')this.wheelSlip=.62;if(id==='dust-storm')this.stormLevel=.88;if(id==='packet-loss')this.commandQueue.configure({packetLoss:.42});if(id==='thermal')this.temperatureC=-63;this.log('fault',`Falha injetada: ${id}.`);}
  resolveFault(id,action){
    const correct={ 'wheel-slip':'traction-control','dust-storm':'safe-power','packet-loss':'idempotent-retry','thermal':'thermal-safe' }[id];if(action!==correct)return false;
    if(id==='wheel-slip')this.wheelSlip=.12;if(id==='dust-storm')this.stormLevel=.18;if(id==='packet-loss')this.commandQueue.configure({packetLoss:.04});if(id==='thermal')this.temperatureC=-28;this.activeFault=null;this.log('recovery',`Falha ${id} estabilizada por ${action}.`);return true;
  }
  execute(command){
    if(command.type==='route'){this.setRoute(command.path??[]);this.commandHistory.push({id:command.id,type:'route',time:this.elapsed});this.log('command',`Rota com ${this.currentRoute.length} pontos carregada.`);return;}
    if(command.type==='turn'){this.heading=(this.heading+Number(command.degrees||0)+360)%360;this.battery-=.3;}
    if(command.type==='capture'){this.cameraMode=command.quality==='science'?'SCIENCE':'NAV';this.dataMb+=command.quality==='science'?48:12;this.battery-=.6;}
    if(command.type==='sample'){this.armState='DEPLOYED';this.sampleCount++;this.dataMb+=36;this.battery-=3.8;this.log('science',`Amostra ${command.sampleId??this.sampleCount} coletada.`);}
    if(command.type==='drone'){const launched=this.drone.launch();if(launched.ok){const result=this.drone.survey(command.sector??'A1');this.drone.returnHome();if(result.ok){this.dataMb+=28;this.log('drone',`Setor ${result.sector} mapeado.`);}}}
    if(command.type==='wait')this.temperatureC+=Math.min(5,Number(command.seconds||0)*.04);
    this.commandHistory.push({id:command.id,type:command.type,time:this.elapsed});
  }
  moveStep(dt){
    if(!this.currentRoute.length||this.routeIndex>=this.currentRoute.length)return;
    const target=this.currentRoute[this.routeIndex];if(target.x===this.position.x&&target.y===this.position.y){this.routeIndex++;return;}
    const terrain=this.grid.terrainAt(target.x,target.y);const slip=this.activeFault==='wheel-slip'?this.wheelSlip:.04+terrain.risk/260;const energy=(.34*terrain.cost)*(1+slip)*dt;this.battery-=energy;this.wheelSlip=slip;this.position={x:target.x,y:target.y};this.distanceM+=25*(1-slip*.25);this.temperatureC+=.08*terrain.cost*dt;this.dataMb+=.18;this.routeIndex++;
    this.log('drive',`Posição ${target.x},${target.y} · ${terrain.label}.`);
    if(this.routeIndex>=this.currentRoute.length){this.currentRoute=[];this.routeIndex=0;this.log('navigation','Rota concluída.');}
  }
  step(dt=.2){
    dt=clamp(Number(dt)||.2,.02,5);if(this.state!=='ACTIVE')return this.telemetry();this.elapsed+=dt;
    for(const command of this.commandQueue.due(this.elapsed))this.execute(command);
    this.moveStep(dt);
    const solar=1-this.stormLevel*.72;this.battery+=.018*solar*dt;this.battery-=.012*dt;this.battery=clamp(this.battery,0,100);
    const targetTemp=this.activeFault==='thermal'?-72:-24+this.stormLevel*8;this.temperatureC+=(targetTemp-this.temperatureC)*.018*dt;
    if(this.battery<=4){this.state='SAFE';this.currentRoute=[];this.log('safe','Bateria crítica: modo seguro ativado.');}
    if(this.temperatureC<-65){this.state='SAFE';this.currentRoute=[];this.log('safe','Temperatura crítica: movimento suspenso.');}
    return this.telemetry();
  }
  telemetry(){
    return {state:this.state,elapsed:Number(this.elapsed.toFixed(1)),position:{...this.position},heading:Number(this.heading.toFixed(1)),battery:Number(this.battery.toFixed(1)),temperatureC:Number(this.temperatureC.toFixed(1)),wheelSlip:Number(this.wheelSlip.toFixed(2)),distanceM:Number(this.distanceM.toFixed(1)),dataMb:Number(this.dataMb.toFixed(1)),sampleCount:this.sampleCount,armState:this.armState,cameraMode:this.cameraMode,stormLevel:Number(this.stormLevel.toFixed(2)),activeFault:this.activeFault,queue:this.commandQueue.snapshot(),route:[...this.currentRoute],routeIndex:this.routeIndex,drone:this.drone.snapshot(),missionId:this.missionId};
  }
  drainEvents(){const result=this.events.map(item=>({...item}));this.events=[];return result;}
}
