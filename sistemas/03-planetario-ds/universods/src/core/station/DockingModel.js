import { DOCKING_PROFILES } from '../../data/stationSystems.js';
const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));

export class DockingModel {
  constructor({ profileId='training' }={}) {
    this.profile=DOCKING_PROFILES.find(item=>item.id===profileId)??DOCKING_PROFILES[0];
    this.reset();
  }
  reset(){
    this.state='IDLE';this.distanceM=this.profile.startDistanceM;this.closingMps=0;this.yawDeg=5.5;this.pitchDeg=-4.2;this.rollDeg=3.1;this.holdIndex=0;this.captured=false;this.hardDock=false;this.elapsed=0;this.events=[];this.assist=false;
  }
  start(){if(this.state!=='IDLE')return false;this.state='APPROACH';this.closingMps=Math.min(.06,this.profile.maxClosingMps);this.events.push({type:'docking',message:'Aproximação iniciada.'});return true;}
  setAssist(enabled){this.assist=Boolean(enabled);}
  adjust(axis,delta){if(!['yawDeg','pitchDeg','rollDeg'].includes(axis))return;this[axis]=clamp(this[axis]+delta,-12,12);}
  setClosing(value){this.closingMps=clamp(Number(value)||0,0,this.profile.maxClosingMps);}
  hold(){if(['APPROACH','FINAL'].includes(this.state)){this.state='HOLD';this.closingMps=0;this.events.push({type:'docking',message:`Ponto de espera confirmado a ${this.distanceM.toFixed(1)} m.`});return true;}return false;}
  resume(){if(this.state!=='HOLD')return false;this.state=this.distanceM<=12?'FINAL':'APPROACH';this.closingMps=Math.min(.05,this.profile.maxClosingMps);return true;}
  abort(){if(['HARD_DOCK','ABORTED'].includes(this.state))return false;this.state='ABORTED';this.closingMps=-.08;this.events.push({type:'warning',message:'Abortagem de acoplamento executada.'});return true;}
  alignmentError(){return Math.hypot(this.yawDeg,this.pitchDeg,this.rollDeg);}
  step(dt=.2){
    const delta=clamp(dt,0,.5);this.elapsed+=delta;
    if(this.assist&&['APPROACH','FINAL'].includes(this.state)){
      const factor=Math.min(1,delta*1.2);this.yawDeg*=1-factor;this.pitchDeg*=1-factor;this.rollDeg*=1-factor;
      const desired=this.distanceM<15?.025:this.distanceM<60?.055:this.profile.maxClosingMps*.82;this.closingMps+=(desired-this.closingMps)*Math.min(1,delta*2);
    }
    if(['APPROACH','FINAL'].includes(this.state)){
      this.distanceM=Math.max(0,this.distanceM-this.closingMps*delta*12);
      const hold=this.profile.holdPoints[this.holdIndex];
      if(hold!==undefined&&this.distanceM<=hold&&this.distanceM>12){this.distanceM=hold;this.state='HOLD';this.closingMps=0;this.holdIndex++;this.events.push({type:'hold',message:`Ponto de espera ${hold} m alcançado.`});}
      if(this.distanceM<=12&&this.state==='APPROACH')this.state='FINAL';
      if(this.distanceM<=1.2){
        if(this.alignmentError()<=this.profile.alignmentLimitDeg&&this.closingMps<=.06){this.distanceM=0;this.state='SOFT_CAPTURE';this.captured=true;this.closingMps=0;this.events.push({type:'capture',message:'Captura suave confirmada.'});}
        else {this.state='HOLD';this.distanceM=1.5;this.closingMps=0;this.events.push({type:'warning',message:'Captura bloqueada por desalinhamento ou velocidade.'});}
      }
    }
    if(this.state==='SOFT_CAPTURE'&&this.elapsed>1){this.state='HARD_DOCK';this.hardDock=true;this.events.push({type:'docking',message:'Acoplamento rígido e vedação confirmados.'});}
    if(this.state==='ABORTED')this.distanceM=Math.min(this.profile.startDistanceM,this.distanceM+Math.abs(this.closingMps)*delta*10);
    return this.snapshot();
  }
  autoComplete(){
    if(this.state==='IDLE')this.start();this.setAssist(true);
    for(let i=0;i<20000&&!['HARD_DOCK','ABORTED'].includes(this.state);i++){
      if(this.state==='HOLD')this.resume();this.step(.2);
    }
    return this.snapshot();
  }
  drainEvents(){const list=[...this.events];this.events=[];return list;}
  snapshot(){return {state:this.state,distanceM:this.distanceM,closingMps:this.closingMps,yawDeg:this.yawDeg,pitchDeg:this.pitchDeg,rollDeg:this.rollDeg,alignmentErrorDeg:this.alignmentError(),captured:this.captured,hardDock:this.hardDock,profileId:this.profile.id,holdIndex:this.holdIndex};}
}
