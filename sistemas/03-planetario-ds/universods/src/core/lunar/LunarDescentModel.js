import { LANDING_SITES } from '../../data/lunarSystems.js';

const clamp=(value,min,max)=>Math.min(max,Math.max(min,value));
const lerp=(a,b,t)=>a+(b-a)*t;

export class LunarDescentModel {
  constructor(config={}){this.configure(config);}
  configure(config={}){
    const site=LANDING_SITES.find(item=>item.id===config.siteId)??LANDING_SITES[0];
    this.config={siteId:site.id,assist:config.assist!==false,computerMode:config.computerMode??'priority',...config};
    this.site=site;this.state='ORBIT';this.elapsed=0;this.altitudeM=15000;this.verticalSpeedMs=-1;this.horizontalSpeedMs=1620;
    this.downrangeM=18500;this.lateralOffsetM=site.hazard*2.5;this.fuelKg=8200;this.initialFuelKg=8200;this.massKg=15100;
    this.throttle=.12;this.pitchDeg=0;this.radarQuality=100;this.computerLoad=64;this.linkQuality=98;this.hazard=site.hazard;
    this.events=[];this.activeFault=null;this.resolvedFaults=[];this.landed=false;this.maxComputerLoad=this.computerLoad;this.minimumFuelPercent=100;
    return this.telemetry();
  }
  start(){if(this.state!=='ORBIT')return false;this.state='SEPARATION';this.events.push(this.event('STATE','Separação do módulo lunar confirmada.'));return true;}
  setControls({throttle,pitch,assist}={}){if(Number.isFinite(Number(throttle)))this.throttle=clamp(Number(throttle),0,1);if(Number.isFinite(Number(pitch)))this.pitchDeg=clamp(Number(pitch),-25,25);if(typeof assist==='boolean')this.config.assist=assist;}
  injectFault(id){
    if(this.activeFault)return false;this.activeFault=id;
    if(id==='radar-noise')this.radarQuality=38;
    if(id==='computer-overload')this.computerLoad=116;
    if(id==='fuel-margin')this.fuelKg=Math.max(1200,this.fuelKg-1250);
    this.events.push(this.event('FAULT',`Falha injetada: ${id}.`));return true;
  }
  resolveFault(id,action){
    if(this.activeFault!==id)return false;
    const correct=(id==='radar-noise'&&action==='cross-check')||(id==='computer-overload'&&action==='priority-restart')||(id==='fuel-margin'&&action==='safe-site');
    if(!correct){this.events.push(this.event('WARN','Procedimento incorreto; condição permanece ativa.'));return false;}
    if(id==='radar-noise')this.radarQuality=93;
    if(id==='computer-overload')this.computerLoad=72;
    if(id==='fuel-margin'){this.hazard=Math.max(12,this.hazard-18);this.lateralOffsetM*=.55;}
    this.resolvedFaults.push(id);this.activeFault=null;this.events.push(this.event('RECOVERY',`Falha ${id} tratada com sucesso.`));return true;
  }
  abort(){if(['LANDED','CRASHED','ABORTED'].includes(this.state))return false;this.state='ABORTED';this.events.push(this.event('ABORT','Estágio de subida acionado; descida interrompida.'));return true;}
  step(dt=.1){
    dt=clamp(Number(dt)||.1,.01,1.2);if(['ORBIT','LANDED','CRASHED','ABORTED'].includes(this.state))return this.telemetry();
    this.elapsed+=dt;
    this.updateState();
    const profile=this.descentProfile();
    if(this.config.assist){
      this.throttle=lerp(this.throttle,profile.throttle,clamp(dt*1.6,0,1));
      this.pitchDeg=lerp(this.pitchDeg,profile.pitch,clamp(dt*1.3,0,1));
    }
    let targetVertical=profile.vertical;let targetHorizontal=profile.horizontal;
    if(this.activeFault==='radar-noise')targetVertical*=1.12;
    if(this.activeFault==='computer-overload')targetHorizontal*=1.08;
    this.verticalSpeedMs=lerp(this.verticalSpeedMs,targetVertical,clamp(dt*profile.response,0,1));
    this.horizontalSpeedMs=lerp(this.horizontalSpeedMs,targetHorizontal,clamp(dt*(profile.response*.7),0,1));
    this.altitudeM=Math.max(0,this.altitudeM+this.verticalSpeedMs*dt);
    this.downrangeM=Math.max(0,this.downrangeM-this.horizontalSpeedMs*dt);
    const lateralCorrection=Math.sin(this.pitchDeg*Math.PI/180)*Math.max(1,this.horizontalSpeedMs)*dt*.16;
    this.lateralOffsetM=Math.max(0,this.lateralOffsetM-lateralCorrection-(this.config.assist?dt*profile.lateralAssist:0));
    const flow=5+this.throttle*17+(this.state==='BRAKING'?3:0);this.fuelKg=Math.max(0,this.fuelKg-flow*dt);this.massKg=6900+this.fuelKg;
    const phaseLoad=this.state==='FINAL'?18:this.state==='APPROACH'?12:this.state==='BRAKING'?8:4;
    this.computerLoad=clamp(54+phaseLoad+Math.sin(this.elapsed*.7)*3,30,130);
    if(this.activeFault==='computer-overload')this.computerLoad=Math.max(112,this.computerLoad);
    this.maxComputerLoad=Math.max(this.maxComputerLoad,this.computerLoad);this.minimumFuelPercent=Math.min(this.minimumFuelPercent,this.fuelPercent());
    if(this.fuelKg<=0&&this.altitudeM>2){this.state='CRASHED';this.events.push(this.event('FAIL','Propelente esgotado antes do contato.'));}
    if(this.altitudeM<=0&&!['CRASHED','ABORTED'].includes(this.state))this.evaluateLanding();
    return this.telemetry();
  }
  updateState(){
    const previous=this.state;
    if(this.state==='SEPARATION'&&this.elapsed>=5)this.state='PDI';
    if(['PDI','SEPARATION'].includes(this.state)&&this.altitudeM<13500)this.state='BRAKING';
    if(this.state==='BRAKING'&&this.altitudeM<2600)this.state='APPROACH';
    if(this.state==='APPROACH'&&this.altitudeM<180)this.state='FINAL';
    if(previous!==this.state)this.events.push(this.event('STATE',`Estado alterado para ${this.state}.`));
  }
  descentProfile(){
    if(this.state==='SEPARATION')return{vertical:-8,horizontal:1580,throttle:.18,pitch:4,response:.18,lateralAssist:.2};
    if(this.state==='PDI')return{vertical:-42,horizontal:1450,throttle:.52,pitch:12,response:.2,lateralAssist:.5};
    if(this.state==='BRAKING')return{vertical:-58,horizontal:Math.max(120,this.altitudeM*.085),throttle:.67,pitch:18,response:.34,lateralAssist:1.2};
    if(this.state==='APPROACH')return{vertical:-14,horizontal:Math.max(8,this.altitudeM*.035),throttle:.58,pitch:12,response:.55,lateralAssist:2.5};
    return{vertical:-1.6,horizontal:.8,throttle:.49,pitch:5,response:.9,lateralAssist:5.5};
  }
  evaluateLanding(){
    const vertical=Math.abs(this.verticalSpeedMs),horizontal=Math.abs(this.horizontalSpeedMs),offset=this.lateralOffsetM;
    const safe=vertical<=3.4&&horizontal<=2.8&&offset<=85&&this.hazard<=70;
    this.state=safe?'LANDED':'CRASHED';this.landed=safe;
    this.events.push(this.event(safe?'LANDING':'FAIL',safe?'Contato confirmado. Motor de descida desligado.':`Contato inseguro: vertical ${vertical.toFixed(1)} m/s, horizontal ${horizontal.toFixed(1)} m/s, desvio ${offset.toFixed(0)} m.`));
  }
  fuelPercent(){return this.fuelKg/this.initialFuelKg*100;}
  event(type,message){return{type,message,time:this.elapsed,state:this.state};}
  drainEvents(){const events=[...this.events];this.events.length=0;return events;}
  telemetry(){
    const reportedAltitudeM=this.activeFault==='radar-noise'?Math.max(0,this.altitudeM*(.82+Math.sin(this.elapsed*3)*.14)):this.altitudeM;
    return{
      state:this.state,elapsed:this.elapsed,altitudeM:this.altitudeM,reportedAltitudeM,verticalSpeedMs:this.verticalSpeedMs,horizontalSpeedMs:this.horizontalSpeedMs,
      downrangeM:this.downrangeM,lateralOffsetM:this.lateralOffsetM,fuelKg:this.fuelKg,fuelPercent:this.fuelPercent(),massKg:this.massKg,throttle:this.throttle,
      pitchDeg:this.pitchDeg,radarQuality:this.radarQuality,computerLoad:this.computerLoad,linkQuality:this.linkQuality,hazard:this.hazard,siteId:this.site.id,
      activeFault:this.activeFault,resolvedFaults:[...this.resolvedFaults],landed:this.landed,maxComputerLoad:this.maxComputerLoad,minimumFuelPercent:this.minimumFuelPercent
    };
  }
}
