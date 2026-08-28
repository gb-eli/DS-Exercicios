import { STATION_FAULTS } from '../../data/stationSystems.js';
const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));

export class StationSystemsModel {
  constructor(){this.reset();}
  reset(){
    this.state='STANDBY';this.time=0;this.speed=1;this.orbitProgress=0;this.sunlight=true;this.powerGenerationKw=92;this.powerLoadKw=70;this.battery=86;this.oxygen=20.9;this.co2=.42;this.pressureKpa=101.2;this.temperatureC=22.1;this.humidity=44;this.water=84;this.coolantPressure=94;this.attitudeErrorDeg=.18;this.link=99;this.crew=4;this.faults=new Set();this.events=[];this.modules={habitat:'NOMINAL',laboratory:'NOMINAL',airlock:'NOMINAL',power:'NOMINAL',thermal:'NOMINAL'};
  }
  start(){if(this.state==='STANDBY'||this.state==='PAUSED'){this.state='ACTIVE';this.events.push({type:'system',message:'Operação orbital iniciada.'});return true;}return false;}
  pause(){if(this.state==='ACTIVE'){this.state='PAUSED';return true;}return false;}
  injectFault(id){if(!STATION_FAULTS.some(item=>item.id===id))return false;this.faults.add(id);this.events.push({type:'fault',message:`Falha injetada: ${id}.`});return true;}
  resolveFault(id,action){const fault=STATION_FAULTS.find(item=>item.id===id);if(!fault||fault.answer!==action||!this.faults.has(id))return false;this.faults.delete(id);if(id==='co2-scrubber')this.co2=Math.min(this.co2,.68);if(id==='coolant-leak')this.coolantPressure=Math.max(this.coolantPressure,78);if(id==='solar-shadow')this.powerLoadKw=Math.min(this.powerLoadKw,58);if(id==='micro-leak')this.pressureKpa=Math.max(this.pressureKpa,99.4);this.events.push({type:'recovery',message:`Falha ${id} estabilizada por ${fault.concept}.`});return true;}
  setLoad(value){this.powerLoadKw=clamp(value,42,110);}
  step(dt=.2){
    const delta=clamp(dt,0,.5)*this.speed;if(this.state!=='ACTIVE')return this.telemetry();this.time+=delta;this.orbitProgress=(this.orbitProgress+delta/5400)%1;this.sunlight=Math.sin(this.orbitProgress*Math.PI*2)>.05;
    const panelEfficiency=this.faults.has('solar-shadow')?.38:1;this.powerGenerationKw=this.sunlight?92*panelEfficiency:0;
    const net=this.powerGenerationKw-this.powerLoadKw;this.battery=clamp(this.battery+net*delta/180,0,100);
    const scrubber=this.faults.has('co2-scrubber')?.12:1;this.co2=clamp(this.co2+(this.crew*.0007-scrubber*.0022)*delta,.35,4.5);this.oxygen=clamp(this.oxygen-(this.crew*.00012)*delta+(scrubber*.00008)*delta,17,21);
    const thermalLoss=this.faults.has('coolant-leak')?.028:0;this.coolantPressure=clamp(this.coolantPressure-thermalLoss*delta,0,100);const cooling=this.coolantPressure/100;this.temperatureC=clamp(this.temperatureC+((this.powerLoadKw-65)*.0008+(1-cooling)*.018)*delta,14,42);
    if(this.faults.has('micro-leak'))this.pressureKpa=clamp(this.pressureKpa-.0028*delta,0,103);else this.pressureKpa+=(101.2-this.pressureKpa)*.002*delta;
    this.humidity=clamp(this.humidity+(this.crew*.001-.004)*delta,20,75);this.water=clamp(this.water-this.crew*.00009*delta,0,100);this.attitudeErrorDeg=clamp(.15+Math.sin(this.time*.12)*.08+(this.faults.has('solar-shadow')?.12:0),0,5);this.link=clamp(98.5+Math.sin(this.time*.07)*1.1,90,100);
    if(this.battery<18||this.oxygen<18.5||this.co2>2||this.pressureKpa<92||this.temperatureC>36)this.state='SAFE';
    this.modules.power=this.battery<30?'DEGRADED':'NOMINAL';this.modules.thermal=this.coolantPressure<70?'DEGRADED':'NOMINAL';this.modules.habitat=this.co2>1.2||this.pressureKpa<97?'DEGRADED':'NOMINAL';
    return this.telemetry();
  }
  drainEvents(){const events=[...this.events];this.events=[];return events;}
  telemetry(){return {state:this.state,time:this.time,orbitProgress:this.orbitProgress,sunlight:this.sunlight,powerGenerationKw:this.powerGenerationKw,powerLoadKw:this.powerLoadKw,battery:this.battery,oxygen:this.oxygen,co2:this.co2,pressureKpa:this.pressureKpa,temperatureC:this.temperatureC,humidity:this.humidity,water:this.water,coolantPressure:this.coolantPressure,attitudeErrorDeg:this.attitudeErrorDeg,link:this.link,crew:this.crew,faults:[...this.faults],modules:{...this.modules}};}
}
