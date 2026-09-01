import {
  PARKOUR_DEFAULT_ROUTE,parkourRoute,SLIDE_TOWER,SLIDE_PATH,sampleSlidePath,
  COASTER,sampleCoasterPath,RACE_TRACK,clampRaceToTrack,SHOOTING_GALLERY
} from './parque-diversoes-agv-shared.js?v=14.10.8.80-f7';

export const PARQUE_EXPERIENCES=Object.freeze([
  Object.freeze({id:'coaster',type:'ride',name:'Montanha-Russa Vulcão',status:'playable-f7',camera:'wide',players:COASTER.seatCount}),
  Object.freeze({id:'race',type:'race',name:'Circuito AGV Racing',status:'playable-f7',laps:RACE_TRACK.laps,maxPlayers:RACE_TRACK.maxKarts}),
  Object.freeze({id:'parkour',type:'challenge',name:'Sky Obby AGV',status:'playable-f2',routes:['easy','medium','hard']}),
  Object.freeze({id:'mega-slide',type:'ride',name:'Mega Escorregador',status:'playable-f2',elevator:true,height:SLIDE_TOWER.height}),
  Object.freeze({id:'shooting',type:'challenge',name:'Tiro ao Alvo',status:'playable-f7',seconds:SHOOTING_GALLERY.roundSeconds})
]);

const nowSafe=()=>globalThis.performance?.now?.()??Date.now();
const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));

export function createParkourState({routeId=PARKOUR_DEFAULT_ROUTE}={}){
  let route=parkourRoute(routeId),active=false,index=0,startedAt=0,finishedAt=0,falls=0,lastCheckpointAt=0;
  const snapshot=(now=nowSafe())=>({
    active,routeId:route.id,routeName:route.name,difficulty:route.difficulty,index,total:route.checkpoints.length,
    checkpoint:route.checkpoints[Math.min(index,route.checkpoints.length-1)]?.id||null,startedAt,finishedAt,falls,
    elapsedMs:startedAt?Math.max(0,(finishedAt||now)-startedAt):0,complete:!!finishedAt,rewardXp:finishedAt?route.rewardXp:0
  });
  return Object.freeze({
    setRoute(id){if(active)return snapshot();route=parkourRoute(id);index=0;finishedAt=0;falls=0;return snapshot();},
    start(id=route.id,now=nowSafe()){route=parkourRoute(id);active=true;index=0;startedAt=now;finishedAt=0;falls=0;lastCheckpointAt=now;return snapshot(now);},
    cancel(){active=false;return snapshot();},
    restart(now=nowSafe()){active=true;index=0;startedAt=now;finishedAt=0;falls=0;lastCheckpointAt=now;return snapshot(now);},
    tick(position,now=nowSafe()){
      if(!active)return snapshot(now);const target=route.checkpoints[index];if(!target)return snapshot(now);
      const d=Math.hypot(Number(position.x)-target.x,(Number(position.y)||0)-target.y,Number(position.z)-target.z);
      const radius=Math.max(1.55,Math.min(2.55,Math.min(Number(target.w||4),Number(target.d||4))*.48));
      if(d<radius){index++;lastCheckpointAt=now;if(index>=route.checkpoints.length){active=false;finishedAt=now;}}
      return snapshot(now);
    },
    registerFall(){falls++;return snapshot();},
    respawn(){const target=route.checkpoints[Math.max(0,index-1)]||route.checkpoints[0];return{x:target.x,y:target.y+.28,z:target.z,checkpointId:target.id};},
    currentRoute:()=>route,currentTarget:()=>route.checkpoints[index]||route.checkpoints.at(-1),lastCheckpointAt:()=>lastCheckpointAt,snapshot
  });
}

export function createSlideState(){
  let elevator='ground',elevatorProgress=0,slideActive=false,slideT=0,rideStartedAt=0,rideFinishedAt=0;
  const snapshot=()=>({elevator,elevatorProgress,slideActive,slideT,rideStartedAt,rideFinishedAt,position:slideActive?sampleSlidePath(slideT):null});
  return Object.freeze({
    callUp(){if(slideActive||elevator==='moving-up'||elevator==='moving-down')return snapshot();elevator='moving-up';elevatorProgress=0;return snapshot();},
    callDown(){if(slideActive||elevator==='moving-up'||elevator==='moving-down')return snapshot();elevator='moving-down';elevatorProgress=1;return snapshot();},
    startSlide(now=nowSafe()){if(slideActive||elevator!=='top')return snapshot();slideActive=true;slideT=0;rideStartedAt=now;rideFinishedAt=0;return snapshot();},
    cancel(){slideActive=false;slideT=0;return snapshot();},
    reset(){elevator='ground';elevatorProgress=0;slideActive=false;slideT=0;rideStartedAt=0;rideFinishedAt=0;return snapshot();},
    tick(dt,now=nowSafe()){
      const duration=Math.max(1,SLIDE_TOWER.elevator.rideSeconds);
      if(elevator==='moving-up'){elevatorProgress=Math.min(1,elevatorProgress+dt/duration);if(elevatorProgress>=1)elevator='top';}
      else if(elevator==='moving-down'){elevatorProgress=Math.max(0,elevatorProgress-dt/duration);if(elevatorProgress<=0)elevator='ground';}
      if(slideActive){slideT=Math.min(1,slideT+dt/4.8);if(slideT>=1){slideActive=false;rideFinishedAt=now;}}
      return snapshot();
    },
    elevatorY(){const a=SLIDE_TOWER.elevator.bottom.y,b=SLIDE_TOWER.elevator.top.y;return a+(b-a)*elevatorProgress;},
    slidePosition(){return sampleSlidePath(slideT);},snapshot
  });
}

export function createCoasterState(){
  let active=false,t=0,startedAt=0,finishedAt=0,rides=0;
  const snapshot=()=>({active,t,startedAt,finishedAt,rides,position:sampleCoasterPath(t),durationSeconds:COASTER.durationSeconds,rewardXp:finishedAt?COASTER.rewardXp:0});
  return Object.freeze({
    start(now=nowSafe()){if(active)return snapshot();active=true;t=0;startedAt=now;finishedAt=0;return snapshot();},
    cancel(){active=false;t=0;return snapshot();},
    tick(dt,now=nowSafe()){if(active){t=Math.min(1,t+Math.max(0,dt)/COASTER.durationSeconds);if(t>=1){active=false;finishedAt=now;rides++;}}return snapshot();},
    position:()=>sampleCoasterPath(t),snapshot
  });
}

export function createRaceState(){
  let active=false,phase='idle',x=RACE_TRACK.start.x,z=RACE_TRACK.start.z,heading=RACE_TRACK.start.heading,speed=0,lap=0,nextCheckpoint=1,startedAt=0,finishedAt=0,countdownUntil=0,offTrack=false;
  const snapshot=(now=nowSafe())=>({
    active,phase,x,z,heading,speed,kmh:Math.round(Math.abs(speed)*6.5),lap,nextCheckpoint,totalLaps:RACE_TRACK.laps,
    startedAt,finishedAt,elapsedMs:startedAt?Math.max(0,(finishedAt||now)-startedAt):0,
    countdownMs:phase==='countdown'?Math.max(0,countdownUntil-now):0,offTrack,complete:phase==='finished',rewardXp:phase==='finished'?RACE_TRACK.rewardXp:0
  });
  const resetPosition=()=>{x=RACE_TRACK.start.x;z=RACE_TRACK.start.z;heading=RACE_TRACK.start.heading;speed=0;offTrack=false;};
  return Object.freeze({
    start(now=nowSafe()){active=true;phase='countdown';lap=0;nextCheckpoint=1;startedAt=0;finishedAt=0;countdownUntil=now+RACE_TRACK.countdownMs;resetPosition();return snapshot(now);},
    cancel(){active=false;phase='idle';resetPosition();return snapshot();},
    tick(input={},dt=.016,now=nowSafe()){
      if(!active)return snapshot(now);
      if(phase==='countdown'){if(now>=countdownUntil){phase='racing';startedAt=now;}return snapshot(now);}
      if(phase!=='racing')return snapshot(now);
      const throttle=clamp(Number(input.throttle)||0,-1,1),brake=clamp(Number(input.brake)||0,0,1),steer=clamp(Number(input.steer)||0,-1,1);
      if(throttle>0)speed+=RACE_TRACK.acceleration*throttle*dt;else if(throttle<0)speed+=RACE_TRACK.acceleration*.7*throttle*dt;
      if(brake>0){const sign=Math.sign(speed)||1;speed-=sign*Math.min(Math.abs(speed),RACE_TRACK.brakePower*brake*dt);}
      const drag=Math.min(Math.abs(speed),RACE_TRACK.drag*dt*(Math.abs(throttle)<.05?1:.28));speed-=Math.sign(speed)*drag;
      speed=clamp(speed,-RACE_TRACK.reverseMaxSpeed,RACE_TRACK.maxSpeed);
      const steerScale=clamp(Math.abs(speed)/5,.25,1.15);heading+=steer*RACE_TRACK.steerRate*steerScale*dt*(speed<0?-1:1);
      x+=Math.sin(heading)*speed*dt;z+=Math.cos(heading)*speed*dt;
      const constrained=clampRaceToTrack(x,z);offTrack=constrained.offTrack;if(offTrack){x+=(constrained.x-x)*Math.min(1,dt*5);z+=(constrained.z-z)*Math.min(1,dt*5);speed*=Math.max(0,1-dt*1.8);}
      const cp=RACE_TRACK.checkpoints[nextCheckpoint],distance=Math.hypot(x-cp.x,z-cp.z);
      if(distance<=cp.radius){if(nextCheckpoint===0){lap++;if(lap>=RACE_TRACK.laps){phase='finished';active=false;finishedAt=now;speed=0;return snapshot(now);}nextCheckpoint=1;}else{nextCheckpoint++;if(nextCheckpoint>=RACE_TRACK.checkpoints.length)nextCheckpoint=0;}}
      return snapshot(now);
    },
    setPosition(next){if(!next)return snapshot();x=Number(next.x)||x;z=Number(next.z)||z;if(Number.isFinite(Number(next.heading)))heading=Number(next.heading);return snapshot();},
    snapshot
  });
}

export function createShootingState(){
  let active=false,startedAt=0,finishedAt=0,score=0,shots=0,hits=0,streak=0,bestStreak=0,lastHitAt=0,cooldowns=new Map();
  const snapshot=(now=nowSafe())=>({
    active,score,shots,hits,streak,bestStreak,accuracy:shots?Math.round(hits/shots*100):100,startedAt,finishedAt,
    remainingMs:active?Math.max(0,SHOOTING_GALLERY.roundSeconds*1000-(now-startedAt)):0,
    cooldowns:Object.fromEntries([...cooldowns.entries()].map(([id,until])=>[id,Math.max(0,until-now)])),
    complete:!!finishedAt,rewardXp:finishedAt?Math.min(SHOOTING_GALLERY.rewardXpMax,Math.max(25,Math.round(score/4))):0
  });
  const finish=now=>{if(active){active=false;finishedAt=now;}return snapshot(now);};
  return Object.freeze({
    start(now=nowSafe()){active=true;startedAt=now;finishedAt=0;score=0;shots=0;hits=0;streak=0;bestStreak=0;lastHitAt=0;cooldowns=new Map();return snapshot(now);},
    cancel(){active=false;return snapshot();},
    shoot(targetId=null,now=nowSafe()){
      if(!active)return snapshot(now);if(now-startedAt>=SHOOTING_GALLERY.roundSeconds*1000)return finish(now);
      const target=SHOOTING_GALLERY.targets.find(item=>item.id===targetId),ready=target&&Number(cooldowns.get(target.id)||0)<=now;
      if(target&&!ready)return snapshot(now);shots++;if(!target){streak=0;return snapshot(now);}hits++;streak=lastHitAt&&now-lastHitAt<2600?streak+1:1;bestStreak=Math.max(bestStreak,streak);lastHitAt=now;
      const comboBonus=Math.min(25,Math.max(0,streak-1)*2);score+=target.points+comboBonus;cooldowns.set(target.id,now+SHOOTING_GALLERY.respawnMs);return snapshot(now);
    },
    tick(now=nowSafe()){for(const [id,until] of cooldowns)if(until<=now)cooldowns.delete(id);if(active&&now-startedAt>=SHOOTING_GALLERY.roundSeconds*1000)return finish(now);return snapshot(now);},
    isTargetReady(id,now=nowSafe()){return Number(cooldowns.get(id)||0)<=now;},snapshot
  });
}

export const EXPERIENCE_SPAWNS=Object.freeze({
  parkour:parkourRoute(PARKOUR_DEFAULT_ROUTE).checkpoints[0],slideTop:SLIDE_TOWER.top,
  coaster:COASTER.station,race:RACE_TRACK.start,shooting:SHOOTING_GALLERY.player
});
export { SLIDE_PATH };
