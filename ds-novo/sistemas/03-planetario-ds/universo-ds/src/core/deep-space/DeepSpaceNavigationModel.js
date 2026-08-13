const clamp=(v,min,max)=>Math.min(max,Math.max(min,Number.isFinite(v)?v:0));
const lerp=(a,b,t)=>a+(b-a)*t;
const length=v=>Math.hypot(v.x,v.y,v.z);
const normalize=v=>{const l=length(v)||1;return{x:v.x/l,y:v.y/l,z:v.z/l};};
const cross=(a,b)=>({x:a.y*b.z-a.z*b.y,y:a.z*b.x-a.x*b.z,z:a.x*b.y-a.y*b.x});
const add=(a,b)=>({x:a.x+b.x,y:a.y+b.y,z:a.z+b.z});
const scale=(v,s)=>({x:v.x*s,y:v.y*s,z:v.z*s});

export class DeepSpaceNavigationModel {
  constructor({destinationId='stellar-nursery',cameraMode='orbit'}={}){
    this.destinationId=destinationId;this.cameraMode=cameraMode;this.yaw=.35;this.pitch=-.08;this.distance=4.8;this.zoom=1;
    this.position={x:0,y:0,z:-5};this.velocity={x:0,y:0,z:0};this.freeYaw=0;this.freePitch=0;this.roll=0;
    this.visited=new Set([destinationId]);this.scanned=new Set();this.warp={active:false,progress:0,duration:1.8,from:destinationId,to:destinationId};
    this.cinematicTime=0;this.photoMode=false;this.autopilot=true;this.energy=100;this.distanceTravelled=0;
  }
  selectDestination(id){if(!id||id===this.destinationId)return false;this.warp={active:true,progress:0,duration:1.65,from:this.destinationId,to:id};this.destinationId=id;this.visited.add(id);this.energy=Math.max(0,this.energy-2);return true;}
  setCameraMode(mode){if(!['orbit','free','cinematic','telescope'].includes(mode))return false;this.cameraMode=mode;if(mode==='cinematic')this.cinematicTime=0;return true;}
  cycleCamera(){const order=['orbit','free','telescope','cinematic'];this.setCameraMode(order[(order.indexOf(this.cameraMode)+1)%order.length]);return this.cameraMode;}
  togglePhotoMode(){this.photoMode=!this.photoMode;return this.photoMode;}
  toggleAutopilot(){this.autopilot=!this.autopilot;return this.autopilot;}
  scan(){this.scanned.add(this.destinationId);return {destinationId:this.destinationId,total:this.scanned.size};}
  reset(){this.yaw=.35;this.pitch=-.08;this.distance=4.8;this.zoom=1;this.position={x:0,y:0,z:-5};this.velocity={x:0,y:0,z:0};this.freeYaw=0;this.freePitch=0;this.roll=0;this.energy=100;}
  update(dt,input={}){
    dt=clamp(dt,0,.05);const lookX=Number(input.lookX)||0,lookY=Number(input.lookY)||0;
    if(this.cameraMode==='orbit'||this.cameraMode==='telescope'){
      this.yaw+=lookX*dt;this.pitch=clamp(this.pitch+lookY*dt,-1.35,1.35);
      this.distance=clamp(this.distance+(Number(input.zoom)||0)*dt*4,1.2,30);
      if(this.autopilot&&!input.pointerLook)this.yaw+=dt*(this.cameraMode==='telescope'?.015:.055);
    }else if(this.cameraMode==='free'){
      this.freeYaw+=lookX*dt;this.freePitch=clamp(this.freePitch+lookY*dt,-1.45,1.45);this.roll=clamp(this.roll+(Number(input.roll)||0)*dt*1.4,-Math.PI,Math.PI);
      const forward=normalize({x:Math.sin(this.freeYaw)*Math.cos(this.freePitch),y:Math.sin(this.freePitch),z:Math.cos(this.freeYaw)*Math.cos(this.freePitch)});
      const right=normalize(cross(forward,{x:0,y:1,z:0}));const up={x:0,y:1,z:0};
      let direction={x:0,y:0,z:0};direction=add(direction,scale(forward,Number(input.forward)||0));direction=add(direction,scale(right,Number(input.strafe)||0));direction=add(direction,scale(up,Number(input.lift)||0));
      const speed=(input.boost?24:8.5);const target=length(direction)>.001?scale(normalize(direction),speed):{x:0,y:0,z:0};
      this.velocity={x:lerp(this.velocity.x,target.x,dt*4),y:lerp(this.velocity.y,target.y,dt*4),z:lerp(this.velocity.z,target.z,dt*4)};
      const delta=scale(this.velocity,dt);this.position=add(this.position,delta);this.distanceTravelled+=length(delta);this.energy=clamp(this.energy-length(delta)*.015,0,100);
    }else{
      this.cinematicTime+=dt;this.yaw+=dt*.1;this.pitch=Math.sin(this.cinematicTime*.27)*.22;this.distance=4.8+Math.sin(this.cinematicTime*.19)*1.1;
    }
    if(this.warp.active){this.warp.progress=clamp(this.warp.progress+dt/this.warp.duration,0,1);if(this.warp.progress>=1)this.warp.active=false;}
    this.energy=clamp(this.energy+dt*.12,0,100);
  }
  snapshot(){return{destinationId:this.destinationId,cameraMode:this.cameraMode,yaw:this.yaw,pitch:this.pitch,distance:this.distance,zoom:this.zoom,position:{...this.position},velocity:{...this.velocity},freeYaw:this.freeYaw,freePitch:this.freePitch,roll:this.roll,visited:[...this.visited],scanned:[...this.scanned],warp:{...this.warp},photoMode:this.photoMode,autopilot:this.autopilot,energy:this.energy,distanceTravelled:this.distanceTravelled};}
}
