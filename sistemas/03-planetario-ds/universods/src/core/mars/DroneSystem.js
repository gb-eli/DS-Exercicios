export class DroneSystem {
  constructor(){this.reset();}
  reset(){this.state='STOWED';this.battery=100;this.altitudeM=0;this.distanceM=0;this.surveyed=[];this.flightSeconds=0;}
  launch(){if(this.state!=='STOWED'||this.battery<35)return {ok:false,reason:'Drone indisponível ou bateria insuficiente.'};this.state='FLYING';this.altitudeM=8;return {ok:true};}
  survey(sector){if(this.state!=='FLYING')return {ok:false,reason:'Lance o drone primeiro.'};if(this.surveyed.includes(sector))return {ok:false,reason:'Setor já mapeado.'};const cost=12+String(sector).length%5;if(this.battery<cost+18)return {ok:false,reason:'Reserva insuficiente para mapear e retornar.'};this.battery-=cost;this.distanceM+=90+sector.charCodeAt(0)%80;this.flightSeconds+=42;this.surveyed.push(sector);return {ok:true,sector,hazardScore:(sector.charCodeAt(sector.length-1)*7)%61,scienceScore:35+(sector.charCodeAt(0)*5)%65};}
  returnHome(){if(this.state!=='FLYING')return {ok:false,reason:'Drone não está em voo.'};this.battery=Math.max(0,this.battery-15);this.state='STOWED';this.altitudeM=0;return {ok:true};}
  snapshot(){return {state:this.state,battery:Number(this.battery.toFixed(1)),altitudeM:this.altitudeM,distanceM:this.distanceM,flightSeconds:this.flightSeconds,surveyed:[...this.surveyed]};}
}
