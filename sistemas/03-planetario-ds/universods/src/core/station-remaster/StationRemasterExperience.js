import { STATION_BY_ID, ORBITAL_VEHICLE_BY_ID, SATELLITE_BY_ID, STATION_CAMERA_BY_ID, STATION_INSPECTIONS } from '../../data/stationRemasterSystems.js';
const clamp=(value,min,max)=>Math.min(max,Math.max(min,value));
export class StationRemasterExperience {
  constructor({stationId='horizon-modular',vehicleId='crew-capsule',satelliteId='earth-observer',cameraId='station-orbit'}={}){
    this.stationId=stationId;this.vehicleId=vehicleId;this.satelliteId=satelliteId;this.cameraId=cameraId;this.yaw=.25;this.pitch=-.08;this.roll=0;this.zoom=1;this.photoMode=false;this.autopilotCamera=false;this.inspections=new Set();this.visited=new Set([stationId]);this.replay=[];this.replayIndex=0;this.replayPlaying=false;this.tourTime=0;
  }
  selectStation(id){if(!STATION_BY_ID[id])return false;this.stationId=id;this.visited.add(id);return true;}
  selectVehicle(id){if(!ORBITAL_VEHICLE_BY_ID[id])return false;this.vehicleId=id;return true;}
  selectSatellite(id){if(!SATELLITE_BY_ID[id])return false;this.satelliteId=id;return true;}
  setCamera(id){if(!STATION_CAMERA_BY_ID[id])return false;this.cameraId=id;return true;}
  cycleCamera(){const ids=Object.keys(STATION_CAMERA_BY_ID);const next=ids[(ids.indexOf(this.cameraId)+1)%ids.length];this.cameraId=next;return next;}
  update(dt,input={}){
    const camera=STATION_CAMERA_BY_ID[this.cameraId];
    if(camera?.mode==='orbit'||camera?.mode==='station'||camera?.mode==='satellite'||camera?.mode==='eva'||camera?.mode==='arm'||camera?.mode==='payload'){
      this.yaw+=input.lookX*.014;this.pitch=clamp(this.pitch+input.lookY*.012,-1.2,1.2);this.zoom=clamp(this.zoom-input.zoom*.055,.48,2.2);
    }
    if(camera?.mode==='cinematic'||this.autopilotCamera){this.tourTime+=dt;this.yaw+=dt*.11;this.pitch=Math.sin(this.tourTime*.23)*.15;this.zoom=1+.16*Math.sin(this.tourTime*.17);}
    if(camera?.mode==='free'){this.yaw+=input.lookX*.012;this.pitch=clamp(this.pitch+input.lookY*.011,-1.45,1.45);this.roll=clamp(this.roll+(input.roll||0)*dt,-Math.PI,Math.PI);}
  }
  completeInspection(id){const item=STATION_INSPECTIONS.find(entry=>entry.id===id);if(!item)return {ok:false,reason:'Inspeção desconhecida.'};if(this.cameraId!==item.camera)return {ok:false,reason:`Use a câmera ${STATION_CAMERA_BY_ID[item.camera]?.label}.`};this.inspections.add(id);return {ok:true,item};}
  togglePhotoMode(){this.photoMode=!this.photoMode;return this.photoMode;}
  toggleAutopilotCamera(){this.autopilotCamera=!this.autopilotCamera;return this.autopilotCamera;}
  record(telemetry){if(!telemetry)return;this.replay.push(JSON.parse(JSON.stringify(telemetry)));if(this.replay.length>1200)this.replay.shift();if(!this.replayPlaying)this.replayIndex=Math.max(0,this.replay.length-1);}
  setReplayIndex(index){this.replayIndex=clamp(Number(index)||0,0,Math.max(0,this.replay.length-1));return this.replay[this.replayIndex]??null;}
  snapshot(){return {stationId:this.stationId,vehicleId:this.vehicleId,satelliteId:this.satelliteId,cameraId:this.cameraId,yaw:this.yaw,pitch:this.pitch,roll:this.roll,zoom:this.zoom,photoMode:this.photoMode,autopilotCamera:this.autopilotCamera,inspections:[...this.inspections],visited:[...this.visited],inspectionReady:this.inspections.size===STATION_INSPECTIONS.length,replayLength:this.replay.length,replayIndex:this.replayIndex,replayPlaying:this.replayPlaying};}
}
