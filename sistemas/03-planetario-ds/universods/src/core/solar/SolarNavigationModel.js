const clamp=(value,min,max)=>Math.min(max,Math.max(min,value));
const lerp=(a,b,t)=>a+(b-a)*t;
const ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
const length=v=>Math.hypot(v.x,v.y,v.z);
const normalize=v=>{const l=length(v)||1;return{x:v.x/l,y:v.y/l,z:v.z/l};};
const cross=(a,b)=>({x:a.y*b.z-a.z*b.y,y:a.z*b.x-a.x*b.z,z:a.x*b.y-a.y*b.x});
const add=(a,b)=>({x:a.x+b.x,y:a.y+b.y,z:a.z+b.z});
const scale=(v,s)=>({x:v.x*s,y:v.y*s,z:v.z*s});

export class SolarNavigationModel {
  constructor({ targetId='earth', cameraMode='orbit' }={}) {
    this.targetId=targetId;
    this.cameraMode=cameraMode;
    this.autopilot=true;
    this.yaw=.72;
    this.pitch=-.22;
    this.distance=4.8;
    this.freePosition={x:0,y:4,z:18};
    this.freeYaw=Math.PI;
    this.freePitch=-.08;
    this.speed=0;
    this.visited=new Set([targetId]);
    this.transition={active:false,time:0,duration:1.7,fromDistance:this.distance,toDistance:this.distance};
    this.cinematicElapsed=0;
    this.lastTargetChange=0;
    this.photoMode=false;
  }

  selectTarget(id, preferredDistance=4.8) {
    if(!id||id===this.targetId)return false;
    this.targetId=id;
    this.visited.add(id);
    this.transition={active:true,time:0,duration:1.65,fromDistance:this.distance,toDistance:preferredDistance};
    this.autopilot=true;
    this.lastTargetChange=performance?.now?.()??Date.now();
    return true;
  }

  setCameraMode(mode) {
    if(!['orbit','free','cinematic'].includes(mode))return false;
    this.cameraMode=mode;
    if(mode==='cinematic'){this.autopilot=true;this.cinematicElapsed=0;}
    return true;
  }

  cycleCamera() {
    const order=['orbit','free','cinematic'];
    this.setCameraMode(order[(order.indexOf(this.cameraMode)+1)%order.length]);
    return this.cameraMode;
  }

  setAutopilot(value){this.autopilot=Boolean(value);return this.autopilot;}
  toggleAutopilot(){this.autopilot=!this.autopilot;return this.autopilot;}
  togglePhotoMode(){this.photoMode=!this.photoMode;return this.photoMode;}
  reset(){this.yaw=.72;this.pitch=-.22;this.distance=4.8;this.freePosition={x:0,y:4,z:18};this.freeYaw=Math.PI;this.freePitch=-.08;this.speed=0;this.autopilot=true;}

  update(dt,input={}) {
    const lookRate=input.pointerLook?1:.75;
    if(this.cameraMode==='orbit'){
      this.yaw+=Number(input.lookX||0)*dt*lookRate;
      this.pitch=clamp(this.pitch+Number(input.lookY||0)*dt*lookRate,-1.35,1.35);
      this.distance=clamp(this.distance+Number(input.zoom||0)*dt*3.2,1.5,80);
      if(this.autopilot&&!input.pointerLook)this.yaw+=dt*.075;
    } else if(this.cameraMode==='free') {
      this.freeYaw+=Number(input.lookX||0)*dt*1.15;
      this.freePitch=clamp(this.freePitch+Number(input.lookY||0)*dt*1.15,-1.45,1.45);
      const forward=normalize({x:Math.sin(this.freeYaw)*Math.cos(this.freePitch),y:Math.sin(this.freePitch),z:Math.cos(this.freeYaw)*Math.cos(this.freePitch)});
      const right=normalize(cross(forward,{x:0,y:1,z:0}));
      const up={x:0,y:1,z:0};
      const throttle=Number(input.forward||0);
      const strafe=Number(input.strafe||0);
      const lift=Number(input.lift||0);
      const boost=input.boost?2.8:1;
      const desired=Math.hypot(throttle,strafe,lift)*9*boost;
      this.speed=lerp(this.speed,desired,clamp(dt*3.5,0,1));
      let delta={x:0,y:0,z:0};
      delta=add(delta,scale(forward,throttle));
      delta=add(delta,scale(right,strafe));
      delta=add(delta,scale(up,lift));
      if(length(delta)>.001)this.freePosition=add(this.freePosition,scale(normalize(delta),this.speed*dt));
    } else {
      this.cinematicElapsed+=dt;
      this.yaw+=dt*.12;
      this.pitch=Math.sin(this.cinematicElapsed*.22)*.22-.12;
      this.distance=lerp(this.distance,5.2+Math.sin(this.cinematicElapsed*.31)*.75,clamp(dt*.7,0,1));
    }
    if(this.transition.active){
      this.transition.time+=dt;
      const t=clamp(this.transition.time/this.transition.duration,0,1);
      this.distance=lerp(this.transition.fromDistance,this.transition.toDistance,ease(t));
      if(t>=1)this.transition.active=false;
    }
  }

  cameraFor(targetPosition={x:0,y:0,z:0}) {
    if(this.cameraMode==='free'){
      const forward=normalize({x:Math.sin(this.freeYaw)*Math.cos(this.freePitch),y:Math.sin(this.freePitch),z:Math.cos(this.freeYaw)*Math.cos(this.freePitch)});
      return {position:{...this.freePosition},target:add(this.freePosition,forward),up:{x:0,y:1,z:0}};
    }
    const cp=Math.cos(this.pitch),sp=Math.sin(this.pitch),cy=Math.cos(this.yaw),sy=Math.sin(this.yaw);
    const position={x:targetPosition.x+sy*cp*this.distance,y:targetPosition.y+sp*this.distance,z:targetPosition.z+cy*cp*this.distance};
    return {position,target:{...targetPosition},up:{x:0,y:1,z:0}};
  }

  snapshot(){return {targetId:this.targetId,cameraMode:this.cameraMode,autopilot:this.autopilot,distance:this.distance,speed:this.speed,visited:[...this.visited],photoMode:this.photoMode,transitioning:this.transition.active,freePosition:{...this.freePosition}};}
}
