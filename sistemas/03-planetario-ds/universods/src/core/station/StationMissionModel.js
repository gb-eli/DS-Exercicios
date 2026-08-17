import { StationSystemsModel } from './StationSystemsModel.js';
import { DockingModel } from './DockingModel.js';
import { RoboticArmModel } from './RoboticArmModel.js';

export class StationMissionModel {
  constructor(config={}){this.systems=new StationSystemsModel();this.docking=new DockingModel({profileId:config.dockingProfileId??'training'});this.arm=new RoboticArmModel();this.speed=1;this.events=[];}
  start(){this.systems.start();}
  pause(){this.systems.pause();}
  setSpeed(speed){this.speed=Math.max(.25,Math.min(20,Number(speed)||1));this.systems.speed=this.speed;}
  step(dt=.2){const systems=this.systems.step(dt);const docking=this.docking.step(dt*this.speed);this.events.push(...this.systems.drainEvents(),...this.docking.drainEvents(),...this.arm.drainEvents());return {systems,docking,arm:this.arm.snapshot()};}
  command(type,payload={}){
    if(type==='docking-start')return this.docking.start();if(type==='docking-assist'){this.docking.setAssist(payload.enabled);return true;}if(type==='docking-resume')return this.docking.resume();if(type==='docking-hold')return this.docking.hold();if(type==='docking-abort')return this.docking.abort();if(type==='docking-axis'){this.docking.adjust(payload.axis,payload.delta);return true;}if(type==='docking-speed'){this.docking.setClosing(payload.value);return true;}if(type==='docking-auto'){return this.docking.autoComplete();}
    if(type==='arm-step')return this.arm.execute(payload.command);if(type==='arm-adjust')return this.arm.adjust(payload.joint,payload.delta);if(type==='inject')return this.systems.injectFault(payload.id);if(type==='resolve')return this.systems.resolveFault(payload.id,payload.action);if(type==='load'){this.systems.setLoad(payload.value);return true;}return false;
  }
  drainEvents(){const events=[...this.events];this.events=[];return events;}
  telemetry(){return {systems:this.systems.telemetry(),docking:this.docking.snapshot(),arm:this.arm.snapshot()};}
}
