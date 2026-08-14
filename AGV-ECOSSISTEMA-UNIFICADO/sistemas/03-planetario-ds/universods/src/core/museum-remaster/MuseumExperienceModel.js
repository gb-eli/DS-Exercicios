const clamp=(v,min,max)=>Math.min(max,Math.max(min,Number.isFinite(v)?v:0));
const ZONE_ORDER=['launch','crew','robotics','orbital'];

export class MuseumExperienceModel {
  constructor({exhibitId='saturn-class',cameraMode='walk'}={}){
    this.exhibitId=exhibitId;this.cameraMode=cameraMode;this.zoneId='launch';this.position={x:0,y:1.7,z:10};this.yaw=Math.PI;this.pitch=0;this.orbitYaw=.45;this.orbitPitch=-.08;this.orbitDistance=5;
    this.visitedZones=new Set(['launch']);this.inspected=new Set();this.interiors=new Set();this.animations=new Set();this.cataloged=new Set();this.photoMode=false;this.cinematicTime=0;this.walkDistance=0;
  }
  selectExhibit(exhibit){if(!exhibit?.id)return false;this.exhibitId=exhibit.id;this.zoneId=exhibit.zone;this.visitedZones.add(exhibit.zone);this.cataloged.add(exhibit.id);this.cameraMode='orbit';this.orbitDistance=4.7;return true;}
  selectZone(id){if(!ZONE_ORDER.includes(id))return false;this.zoneId=id;this.visitedZones.add(id);return true;}
  setCameraMode(mode,{interiorAvailable=false}={}){if(!['walk','orbit','interior','cinematic'].includes(mode))return false;if(mode==='interior'&&!interiorAvailable)return false;this.cameraMode=mode;if(mode==='cinematic')this.cinematicTime=0;return true;}
  inspect(){this.inspected.add(this.exhibitId);return this.inspected.size;}
  openInterior(available){if(!available)return false;this.interiors.add(this.exhibitId);this.cameraMode='interior';return true;}
  activateAnimation(){this.animations.add(this.exhibitId);return this.animations.size;}
  togglePhotoMode(){this.photoMode=!this.photoMode;return this.photoMode;}
  resetCamera(){this.yaw=Math.PI;this.pitch=0;this.orbitYaw=.45;this.orbitPitch=-.08;this.orbitDistance=5;}
  update(dt,input={}){
    dt=clamp(dt,0,.05);const lookX=Number(input.lookX)||0,lookY=Number(input.lookY)||0;
    if(this.cameraMode==='walk'){
      this.yaw+=lookX*dt;this.pitch=clamp(this.pitch+lookY*dt,-1.2,1.2);const f=Number(input.forward)||0,s=Number(input.strafe)||0;const speed=input.boost?8:3.5;
      const dx=(Math.sin(this.yaw)*f+Math.cos(this.yaw)*s)*speed*dt;const dz=(Math.cos(this.yaw)*f-Math.sin(this.yaw)*s)*speed*dt;
      this.position.x=clamp(this.position.x+dx,-24,24);this.position.z=clamp(this.position.z+dz,-18,22);this.walkDistance+=Math.hypot(dx,dz);
      const zoneIndex=clamp(Math.floor((this.position.x+24)/12),0,3);this.zoneId=ZONE_ORDER[zoneIndex];this.visitedZones.add(this.zoneId);
    }else if(this.cameraMode==='orbit'){
      this.orbitYaw+=lookX*dt;this.orbitPitch=clamp(this.orbitPitch+lookY*dt,-1.25,1.25);this.orbitDistance=clamp(this.orbitDistance+(Number(input.zoom)||0)*dt*3,1.3,14);
    }else if(this.cameraMode==='interior'){
      this.yaw+=lookX*dt*.7;this.pitch=clamp(this.pitch+lookY*dt*.7,-1.15,1.15);
    }else{
      this.cinematicTime+=dt;this.orbitYaw+=dt*.13;this.orbitPitch=Math.sin(this.cinematicTime*.3)*.18;this.orbitDistance=5+Math.sin(this.cinematicTime*.22)*.8;
    }
  }
  progress(){return{zones:this.visitedZones.size,inspected:this.inspected.size,interiors:this.interiors.size,animations:this.animations.size,cataloged:this.cataloged.size};}
  snapshot(){return{exhibitId:this.exhibitId,cameraMode:this.cameraMode,zoneId:this.zoneId,position:{...this.position},yaw:this.yaw,pitch:this.pitch,orbitYaw:this.orbitYaw,orbitPitch:this.orbitPitch,orbitDistance:this.orbitDistance,visitedZones:[...this.visitedZones],inspected:[...this.inspected],interiors:[...this.interiors],animations:[...this.animations],cataloged:[...this.cataloged],photoMode:this.photoMode,walkDistance:this.walkDistance};}
}
