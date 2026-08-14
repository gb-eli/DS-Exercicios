const G0=9.80665, EARTH_RADIUS=6_371_000, RHO0=1.225, SCALE_HEIGHT=8_500;
const clamp=(v,min,max)=>Math.min(max,Math.max(min,v));

export class RocketFlightModel {
  constructor(config){this.reset(config);}
  reset(config=this.config){
    this.config=structuredClone(config);
    this.state='PRELAUNCH';this.elapsed=0;this.countdown=10;this.stage=1;this.stageTransition=0;
    this.altitude=0;this.verticalVelocity=0;this.horizontalVelocity=0;this.downrange=0;
    this.firstPropellant=config.firstStage.propellantKg;this.upperPropellant=config.upperStage.propellantKg;
    this.throttle=0;this.dynamicPressure=0;this.maxQ=0;this.acceleration=0;this.flightPathDeg=90;this.link=100;
    this.faults=new Set();this.resolved=new Set();this.events=[];this.abortReason='';this.orbitStableTicks=0;this.tick=0;
    return this.telemetry();
  }
  start(){if(this.state==='PRELAUNCH'){this.state='COUNTDOWN';this.events.push(this.event('COUNTDOWN','Contagem regressiva iniciada.'));return true;}return false;}
  abort(reason='Abortagem comandada'){if(['ORBIT','FAILED','ABORTED'].includes(this.state))return false;this.state='ABORTED';this.throttle=0;this.abortReason=reason;this.events.push(this.event('ABORT',reason));return true;}
  injectFault(id){this.faults.add(id);this.events.push(this.event('FAULT',`Falha injetada: ${id}.`));}
  resolveFault(id,solution){this.resolved.add(id);this.events.push(this.event('RECOVERY',`Procedimento ${solution} aplicado a ${id}.`));}
  mass(){
    const c=this.config;
    const upper=c.upperStage.dryMassKg+this.upperPropellant+c.payloadMassKg+c.guidanceMassKg+(this.altitude<105000?c.fairingMassKg:0);
    return this.stage===1?c.firstStage.dryMassKg+this.firstPropellant+upper:upper;
  }
  step(dt=.1){
    if(['PRELAUNCH','ORBIT','ABORTED','FAILED'].includes(this.state))return this.telemetry();
    this.tick++;this.elapsed+=dt;
    if(this.state==='COUNTDOWN'){
      this.countdown=Math.max(0,this.countdown-dt);
      if(this.countdown<=2.5)this.throttle=clamp((2.5-this.countdown)/2.5,0,1);
      if(this.countdown<=0){this.state='IGNITION';this.events.push(this.event('IGNITION','Motores em potência de lançamento.'));}
      return this.telemetry();
    }
    if(this.state==='IGNITION'){
      this.throttle=1;
      if(this.elapsed>=11){this.state='ASCENT_STAGE_1';this.events.push(this.event('LIFTOFF','Veículo liberado da plataforma.'));}
      return this.telemetry();
    }
    if(this.state==='STAGE_SEPARATION'){
      this.stageTransition+=dt;this.throttle=0;
      this.altitude+=Math.max(0,this.verticalVelocity)*dt;this.downrange+=Math.max(0,this.horizontalVelocity)*dt;
      if(this.stageTransition>=2.2){this.stage=2;this.state='ASCENT_STAGE_2';this.throttle=.82;this.events.push(this.event('UPPER_STAGE','Estágio superior em ignição.'));}
      return this.telemetry();
    }
    const c=this.config;const stage=this.stage===1?c.firstStage:c.upperStage;
    let thrust=stage.thrustN;let throttleTarget=this.stage===1?1:.88;
    if(this.faults.has('engine-loss')&&!this.resolved.has('engine-loss'))thrust*=.72;
    if(this.faults.has('max-q')&&!this.resolved.has('max-q')&&this.dynamicPressure>26000)throttleTarget=1;
    else if(this.dynamicPressure>32000)throttleTarget=.68;
    if(this.resolved.has('max-q')&&this.dynamicPressure>22000)throttleTarget=.58;
    if(this.resolved.has('engine-loss'))thrust*=.92;
    this.throttle+=clamp(throttleTarget-this.throttle,-.08,.08);
    const propellant=this.stage===1?this.firstPropellant:this.upperPropellant;
    const mass=Math.max(1,this.mass());
    const flow=thrust/(stage.ispS*G0)*this.throttle;
    const burn=Math.min(propellant,flow*dt);
    if(this.stage===1)this.firstPropellant-=burn;else this.upperPropellant-=burn;
    const speed=Math.hypot(this.verticalVelocity,this.horizontalVelocity);
    const rho=RHO0*Math.exp(-this.altitude/SCALE_HEIGHT);
    const drag=.5*rho*speed*speed*.31*c.dragAreaM2;
    this.dynamicPressure=.5*rho*speed*speed;this.maxQ=Math.max(this.maxQ,this.dynamicPressure);
    const pitchFromVertical=this.stage===1?clamp((this.altitude-900)/85000,0,.93)*78:clamp(72+(this.altitude-85000)/180000*16,72,88);
    this.flightPathDeg=90-pitchFromVertical;
    const pitch=pitchFromVertical*Math.PI/180;
    const gravity=G0*Math.pow(EARTH_RADIUS/(EARTH_RADIUS+this.altitude),2);
    const thrustAcceleration=thrust*this.throttle/mass;
    const dragAcceleration=drag/mass;
    const verticalA=thrustAcceleration*Math.cos(pitch)-gravity-dragAcceleration*(speed?this.verticalVelocity/speed:0);
    const horizontalA=thrustAcceleration*Math.sin(pitch)-dragAcceleration*(speed?this.horizontalVelocity/speed:0);
    this.verticalVelocity+=verticalA*dt;this.horizontalVelocity=Math.max(0,this.horizontalVelocity+horizontalA*dt);
    this.altitude=Math.max(0,this.altitude+this.verticalVelocity*dt);this.downrange+=this.horizontalVelocity*dt;
    this.acceleration=Math.hypot(verticalA,horizontalA)/G0;
    if(this.faults.has('link-loss')&&!this.resolved.has('link-loss'))this.link=Math.max(3,this.link-dt*28);else this.link=clamp(this.link+dt*9,0,100);
    if(this.state==='ASCENT_STAGE_1'&&this.dynamicPressure>25500&&this.dynamicPressure>=this.maxQ*.995){this.state='MAX_Q';this.events.push(this.event('MAX_Q','Região de maior pressão dinâmica.'));}
    if(this.state==='MAX_Q'&&this.altitude>30000)this.state='ASCENT_STAGE_1';
    if(this.stage===1&&(this.firstPropellant<=1||this.elapsed>stage.burnSeconds+14)){
      this.state='STAGE_SEPARATION';this.stageTransition=0;this.events.push(this.event('SEPARATION','Primeiro estágio separado.'));
    }
    if(this.stage===2&&this.altitude>120000&&this.state!=='ORBIT_INSERTION'){this.state='ORBIT_INSERTION';this.events.push(this.event('INSERTION','Iniciada a inserção orbital.'));}
    const orbitalVelocity=Math.sqrt(3.986004418e14/(EARTH_RADIUS+Math.max(this.altitude,180000)));
    const effectiveHorizontal=this.horizontalVelocity+(c.siteBonusMs||0);
    if(this.stage===2&&this.altitude>=Math.min(c.targetAltitudeKm*1000,185000)&&effectiveHorizontal>=orbitalVelocity*.89){this.orbitStableTicks++;}else this.orbitStableTicks=0;
    if(this.orbitStableTicks>18){this.state='ORBIT';this.throttle=0;this.events.push(this.event('ORBIT','Órbita didática alcançada.'));}
    if(this.stage===2&&this.upperPropellant<=1&&this.state!=='ORBIT'){
      if(this.altitude>155000&&effectiveHorizontal>orbitalVelocity*.80){this.state='ORBIT';this.throttle=0;this.events.push(this.event('ORBIT','Órbita elíptica de contingência alcançada.'));}
      else {this.state='FAILED';this.throttle=0;this.events.push(this.event('FAILED','Desempenho insuficiente para inserção orbital.'));}
    }
    if(this.altitude<=0&&this.elapsed>18){this.state='FAILED';this.throttle=0;this.events.push(this.event('FAILED','Veículo retornou ao solo.'));}
    return this.telemetry();
  }
  event(type,message){return{type,message,time:this.elapsed};}
  drainEvents(){const events=this.events.splice(0);return events;}
  telemetry(){
    const altitudeReported=this.faults.has('sensor-drift')&&!this.resolved.has('sensor-drift')?this.altitude+7200:this.altitude;
    return {
      tick:this.tick,state:this.state,elapsed:this.elapsed,countdown:this.countdown,stage:this.stage,throttle:this.throttle,
      altitudeM:this.altitude,reportedAltitudeM:altitudeReported,verticalVelocityMs:this.verticalVelocity,horizontalVelocityMs:this.horizontalVelocity,
      velocityMs:Math.hypot(this.verticalVelocity,this.horizontalVelocity),downrangeM:this.downrange,dynamicPressurePa:this.dynamicPressure,maxQPa:this.maxQ,
      accelerationG:this.acceleration,flightPathDeg:this.flightPathDeg,massKg:this.mass(),firstPropellantKg:this.firstPropellant,
      upperPropellantKg:this.upperPropellant,linkPercent:this.link,faults:[...this.faults],resolved:[...this.resolved],abortReason:this.abortReason
    };
  }
}
