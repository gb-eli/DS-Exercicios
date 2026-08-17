const clamp=(value,min,max)=>Math.min(max,Math.max(min,value));
const length=v=>Math.hypot(v.x,v.y,v.z);

export class OrbitalFlightModel {
  constructor({vehicleId='crew-capsule',fuelKg=520}={}){
    this.vehicleId=vehicleId;this.initialFuelKg=fuelKg;this.reset();
  }
  reset(){
    this.position={x:0,y:0,z:18};this.velocity={x:0,y:0,z:0};this.rotation={yaw:0,pitch:0,roll:0};this.angularVelocity={yaw:0,pitch:0,roll:0};
    this.fuelKg=this.initialFuelKg;this.distanceM=18;this.relativeSpeed=0;this.alignmentErrorDeg=0;this.state='FREE';this.docked=false;this.collision=false;this.elapsed=0;this.events=[];this.autopilot=false;
    return this.telemetry();
  }
  configure({vehicleId,fuelKg}={}){if(vehicleId)this.vehicleId=vehicleId;if(Number.isFinite(fuelKg)){this.initialFuelKg=fuelKg;this.fuelKg=Math.min(this.fuelKg,fuelKg);}return this.telemetry();}
  setAutopilot(value){this.autopilot=Boolean(value);if(this.autopilot&&!this.docked)this.state='APPROACH';}
  abort(){this.autopilot=false;this.state='RETREAT';this.velocity.z=Math.max(this.velocity.z,1.2);this.events.push({type:'abort',message:'Aproximação interrompida; veículo em recuo seguro.'});}
  impulse({forward=0,strafe=0,lift=0,yaw=0,pitch=0,roll=0,boost=false}={},dt=.016){
    if(this.docked||this.fuelKg<=0)return;
    const thrust=boost?1.8:1;const linear=1.25*thrust;const angular=.9*thrust;
    this.velocity.x+=strafe*linear*dt;this.velocity.y+=lift*linear*dt;this.velocity.z-=forward*linear*dt;
    this.angularVelocity.yaw+=yaw*angular*dt;this.angularVelocity.pitch+=pitch*angular*dt;this.angularVelocity.roll+=roll*angular*dt;
    const usage=(Math.abs(forward)+Math.abs(strafe)+Math.abs(lift)+Math.abs(yaw)+Math.abs(pitch)+Math.abs(roll))*dt*(boost?.42:.22);
    this.fuelKg=clamp(this.fuelKg-usage,0,this.initialFuelKg);
  }
  autopilotStep(dt){
    if(!this.autopilot||this.docked)return;
    const target={x:0,y:0,z:1.15};const error={x:target.x-this.position.x,y:target.y-this.position.y,z:target.z-this.position.z};
    this.velocity.x+=clamp(error.x*.22-this.velocity.x*.6,-.18,.18)*dt;
    this.velocity.y+=clamp(error.y*.22-this.velocity.y*.6,-.18,.18)*dt;
    this.velocity.z+=clamp(error.z*.13-this.velocity.z*.75,-.12,.12)*dt;
    this.angularVelocity.yaw+=(-this.rotation.yaw*.6-this.angularVelocity.yaw*.8)*dt;
    this.angularVelocity.pitch+=(-this.rotation.pitch*.6-this.angularVelocity.pitch*.8)*dt;
    this.angularVelocity.roll+=(-this.rotation.roll*.6-this.angularVelocity.roll*.8)*dt;
    this.fuelKg=clamp(this.fuelKg-dt*.08,0,this.initialFuelKg);
  }
  step(dt=.016,input={}){
    dt=clamp(dt,0,.08);this.elapsed+=dt;this.autopilotStep(dt);
    if(!this.autopilot)this.impulse(input,dt);
    const damping=Math.pow(.992,dt*60),angularDamping=Math.pow(.975,dt*60);
    this.position.x+=this.velocity.x*dt;this.position.y+=this.velocity.y*dt;this.position.z+=this.velocity.z*dt;
    this.rotation.yaw+=this.angularVelocity.yaw*dt;this.rotation.pitch+=this.angularVelocity.pitch*dt;this.rotation.roll+=this.angularVelocity.roll*dt;
    this.velocity.x*=damping;this.velocity.y*=damping;this.velocity.z*=damping;this.angularVelocity.yaw*=angularDamping;this.angularVelocity.pitch*=angularDamping;this.angularVelocity.roll*=angularDamping;
    this.distanceM=length(this.position);this.relativeSpeed=length(this.velocity);this.alignmentErrorDeg=(Math.abs(this.rotation.yaw)+Math.abs(this.rotation.pitch)+Math.abs(this.rotation.roll))*57.2958;
    if(!this.docked&&this.distanceM<1.35){
      if(this.relativeSpeed<.18&&this.alignmentErrorDeg<4.5){this.docked=true;this.autopilot=false;this.state='DOCKED';this.position={x:0,y:0,z:1.15};this.velocity={x:0,y:0,z:0};this.events.push({type:'dock',message:'Acoplamento rígido confirmado.'});}
      else{this.collision=true;this.autopilot=false;this.state='COLLISION';this.velocity.z=Math.max(.7,Math.abs(this.velocity.z));this.events.push({type:'collision',message:'Contato fora do envelope seguro. Recuo obrigatório.'});}
    }else if(!this.docked){
      if(this.distanceM<6)this.state='FINAL';else if(this.distanceM<14)this.state='APPROACH';else if(this.state!=='RETREAT')this.state='FREE';
    }
    return this.telemetry();
  }
  clearCollision(){this.collision=false;if(!this.docked)this.state='RETREAT';}
  drainEvents(){const events=[...this.events];this.events.length=0;return events;}
  telemetry(){return {vehicleId:this.vehicleId,state:this.state,position:{...this.position},velocity:{...this.velocity},rotation:{...this.rotation},fuelKg:this.fuelKg,fuelPercent:this.initialFuelKg?this.fuelKg/this.initialFuelKg*100:0,distanceM:this.distanceM,relativeSpeed:this.relativeSpeed,alignmentErrorDeg:this.alignmentErrorDeg,docked:this.docked,collision:this.collision,autopilot:this.autopilot,elapsed:this.elapsed};}
}
