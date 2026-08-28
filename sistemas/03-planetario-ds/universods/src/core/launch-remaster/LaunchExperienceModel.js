import { IMMERSIVE_INSPECTIONS, IMMERSIVE_VEHICLES, VEHICLE_BY_ID, LAUNCH_CAMERA_PRESETS } from '../../data/launchRemasterSystems.js';

const clamp=(value,min,max)=>Math.min(max,Math.max(min,value));

export class LaunchExperienceModel {
  constructor({vehicleId='atlas-h'}={}){
    this.vehicleId=VEHICLE_BY_ID[vehicleId]?vehicleId:IMMERSIVE_VEHICLES[0].id;
    this.cameraId='orbit';this.yaw=.15;this.pitch=-.06;this.zoom=1;this.photoMode=false;this.autopilot=true;
    this.inspections=new Set();this.replay=[];this.replayIndex=0;this.replayPlaying=false;this.cinematicClock=0;this.visitedCameras=new Set(['orbit']);
  }
  selectVehicle(id){if(!VEHICLE_BY_ID[id])return false;this.vehicleId=id;this.inspections.clear();this.replay=[];this.replayIndex=0;return true;}
  setCamera(id){if(!LAUNCH_CAMERA_PRESETS.some(item=>item.id===id))return false;this.cameraId=id;this.visitedCameras.add(id);return true;}
  cycleCamera(step=1){const index=LAUNCH_CAMERA_PRESETS.findIndex(item=>item.id===this.cameraId);const next=LAUNCH_CAMERA_PRESETS[(index+step+LAUNCH_CAMERA_PRESETS.length)%LAUNCH_CAMERA_PRESETS.length];this.setCamera(next.id);return next.id;}
  completeInspection(id){const inspection=IMMERSIVE_INSPECTIONS.find(item=>item.id===id);if(!inspection)return {ok:false,reason:'Inspeção desconhecida.'};if(this.cameraId!==inspection.camera)return {ok:false,reason:`Use a câmera ${inspection.camera.toUpperCase()} para validar este item.`};this.inspections.add(id);return {ok:true,inspection};}
  inspectionReady(){return IMMERSIVE_INSPECTIONS.every(item=>this.inspections.has(item.id));}
  update(dt,input={}){
    if(this.cameraId==='orbit'||this.cameraId==='pad'||this.cameraId==='engine'){
      this.yaw+=input.lookX*.65;this.pitch=clamp(this.pitch+input.lookY*.55,-.72,.62);this.zoom=clamp(this.zoom+input.zoom*.035,.55,1.85);
      if(this.autopilot&&!input.pointerLook)this.yaw+=dt*.045;
    }
    if(this.cameraId==='cinematic'){
      this.cinematicClock+=dt;const sequence=['pad','engine','chase','booster','onboard','orbit'];const id=sequence[Math.floor(this.cinematicClock/5)%sequence.length];this.visitedCameras.add(id);
    }
  }
  effectiveCamera(){if(this.cameraId!=='cinematic')return this.cameraId;const sequence=['pad','engine','chase','booster','onboard','orbit'];return sequence[Math.floor(this.cinematicClock/5)%sequence.length];}
  record(telemetry){if(!telemetry)return;this.replay.push(structuredClone(telemetry));if(this.replay.length>900)this.replay.shift();this.replayIndex=Math.max(0,this.replay.length-1);}
  setReplayIndex(index){this.replayIndex=clamp(Number(index)||0,0,Math.max(0,this.replay.length-1));return this.replay[this.replayIndex]??null;}
  replayTelemetry(){return this.replay[this.replayIndex]??null;}
  toggleReplay(){this.replayPlaying=!this.replayPlaying;return this.replayPlaying;}
  stepReplay(step=1){return this.setReplayIndex(this.replayIndex+step);}
  togglePhotoMode(){this.photoMode=!this.photoMode;return this.photoMode;}
  snapshot(){return{vehicleId:this.vehicleId,cameraId:this.cameraId,effectiveCamera:this.effectiveCamera(),yaw:this.yaw,pitch:this.pitch,zoom:this.zoom,photoMode:this.photoMode,autopilot:this.autopilot,inspections:[...this.inspections],inspectionReady:this.inspectionReady(),replayLength:this.replay.length,replayIndex:this.replayIndex,visitedCameras:[...this.visitedCameras]};}
}
