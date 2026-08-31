import { CAMPUS_TRAIN_STATIONS, CAMPUS_TRAIN_ROUTE } from '../world/campus-experiences.js?v=14.10.8.66-stage28';
import { CAMPUS_STATION_PROFILES } from '../world/campus-city-network.js?v=14.10.8.66';
const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
const smooth=t=>t*t*(3-2*t);
const dist=(a,b)=>Math.hypot(b.x-a.x,b.z-a.z);

function routeMetrics(){let total=0;const segments=[];for(let i=0;i<CAMPUS_TRAIN_ROUTE.length-1;i++){const a=CAMPUS_TRAIN_ROUTE[i],b=CAMPUS_TRAIN_ROUTE[i+1],length=dist(a,b);segments.push({a,b,length,start:total,end:total+length});total+=length;}return{segments,total};}
const METRICS=routeMetrics();
const STATIONS=CAMPUS_TRAIN_STATIONS.map(station=>Object.freeze({...station,...(CAMPUS_STATION_PROFILES[station.id]||{}),name:CAMPUS_STATION_PROFILES[station.id]?.name||station.name}));
function sampleDistance(distance){const d=((distance%METRICS.total)+METRICS.total)%METRICS.total;const seg=METRICS.segments.find(s=>d<=s.end)||METRICS.segments.at(-1),t=clamp((d-seg.start)/Math.max(.001,seg.length),0,1),k=smooth(t);return{x:seg.a.x+(seg.b.x-seg.a.x)*k,y:.7,z:seg.a.z+(seg.b.z-seg.a.z)*k,heading:Math.atan2(seg.b.x-seg.a.x,seg.b.z-seg.a.z)};}
function closestStationIndex(x,z){let best=0,bestD=Infinity;STATIONS.forEach((s,i)=>{const d=Math.hypot(x-s.x,z-s.z);if(d<bestD){bestD=d;best=i;}});return best;}
function distanceAtStation(station){let best=0,bestD=Infinity;METRICS.segments.forEach(s=>{const d=Math.hypot(station.x-s.a.x,station.z-s.a.z);if(d<bestD){bestD=d;best=s.start;}});return best;}

export function createTrainManager({clock=()=>performance.now(),onEvent,reducedMotion=false}={}){
  let visualStart=clock(),trip=null;
  const visualSpeed=reducedMotion?0:9.2,visualDwell=1.35;
  const stationTimeline=STATIONS.map(station=>({...station,routeDistance:distanceAtStation(station)})).sort((a,b)=>a.routeDistance-b.routeDistance);
  function sampleVisual(now=clock()){
    if(reducedMotion){const station=stationTimeline[0];return{x:station.x,y:.7,z:station.z,heading:0,station:station.id,stopped:true};}
    const travelSeconds=METRICS.total/visualSpeed,cycle=travelSeconds+stationTimeline.length*visualDwell,elapsed=((now-visualStart)/1000%cycle+cycle)%cycle;let cursor=0,previous=stationTimeline[0];
    for(let i=0;i<stationTimeline.length;i++){
      const current=stationTimeline[i],next=stationTimeline[(i+1)%stationTimeline.length];
      const dwellEnd=cursor+visualDwell;if(elapsed<dwellEnd){const heading=sampleDistance(current.routeDistance+.04).heading;return{x:current.x,y:.7,z:current.z,heading,station:current.id,stopped:true};}cursor=dwellEnd;
      let gap=next.routeDistance-current.routeDistance;if(gap<=0)gap+=METRICS.total;const travel=gap/visualSpeed;
      if(elapsed<cursor+travel){const t=(elapsed-cursor)/travel;const p=sampleDistance(current.routeDistance+gap*t);return{...p,station:null,stopped:false};}cursor+=travel;previous=current;
    }
    return{...sampleDistance(previous.routeDistance),station:previous.id,stopped:true};
  }
  function startTrip(destinationId,from={x:0,z:0}){
    const dest=STATIONS.find(s=>s.id===destinationId);if(!dest)return false;
    const origin=STATIONS[closestStationIndex(from.x,from.z)],startD=distanceAtStation(origin),endRaw=distanceAtStation(dest);let delta=endRaw-startD;if(delta<=1)delta+=METRICS.total;
    trip={origin,dest,startD,distance:delta,startedAt:clock(),duration:Math.max(2.6,delta/12.5)+1.1};onEvent?.({type:'train-start',origin,destination:dest,duration:trip.duration,message:`Monotrilho: ${origin.name} → ${dest.name}`});return true;
  }
  function tickTrip(now=clock()){
    if(!trip)return null;const elapsed=(now-trip.startedAt)/1000,dwell=.55,travel=Math.max(.8,trip.duration-dwell*2),raw=clamp((elapsed-dwell)/travel,0,1),progress=smooth(raw),p=sampleDistance(trip.startD+trip.distance*progress),done=elapsed>=trip.duration;
    if(done){const dest=trip.dest;trip=null;onEvent?.({type:'train-complete',destination:dest,message:`Chegada: ${dest.name}.`});return{x:dest.x,y:0,z:dest.z,heading:p.heading,done:true,station:dest.id};}
    return{...p,progress,done:false,station:raw<=0?trip.origin.id:raw>=1?trip.dest.id:null};
  }
  return{stations:()=>STATIONS.map(s=>({...s})),sampleVisual,startTrip,tickTrip,cancel(){if(!trip)return false;trip=null;onEvent?.({type:'train-cancel',message:'Viagem de monotrilho cancelada.'});return true;},isTraveling:()=>!!trip};
}
