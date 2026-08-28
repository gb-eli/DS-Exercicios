import { SPACE_TECHNOLOGIES, SPACE_LANGUAGES_C2, SPACE_SENSORS, DIGITAL_ARCHITECTURE_LAYERS } from '../../data/technologyGuidedSystems.js';

const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
export class SpaceTechnologyEngine {
  technologies(){return SPACE_TECHNOLOGIES.map(item=>structuredClone(item));}
  languages(){return SPACE_LANGUAGES_C2.map(item=>structuredClone(item));}
  sensors(){return SPACE_SENSORS.map(item=>structuredClone(item));}
  architecture(){return DIGITAL_ARCHITECTURE_LAYERS.map(item=>structuredClone(item));}
  getTechnology(id){return structuredClone(SPACE_TECHNOLOGIES.find(item=>item.id===id)||SPACE_TECHNOLOGIES[0]);}
  getLanguage(id){return structuredClone(SPACE_LANGUAGES_C2.find(item=>item.id===id)||SPACE_LANGUAGES_C2[0]);}
  getSensor(id){return structuredClone(SPACE_SENSORS.find(item=>item.id===id)||SPACE_SENSORS[0]);}
  sensorReading(id,time=Date.now(),fault=false){
    const sensor=SPACE_SENSORS.find(item=>item.id===id)||SPACE_SENSORS[0];
    const [low,high]=sensor.normal;const span=high-low;const wave=(Math.sin(time/1450+sensor.id.length)+1)/2;
    let value=low+span*(.18+.64*wave);
    if(fault)value=sensor.max+(sensor.max-sensor.min)*.18;
    value=clamp(value,sensor.min-(fault?999:0),sensor.max+(fault?999:0));
    return {sensorId:sensor.id,value:Number(value.toFixed(Math.abs(span)<10?2:1)),unit:sensor.unit,status:fault?'invalid':value<low||value>high?'warning':'ok',at:new Date(time).toISOString()};
  }
  validatePacket(packet,{previousSequence=null}={}){
    const sensor=SPACE_SENSORS.find(item=>item.id===packet?.sensor);const reasons=[];
    if(!sensor)reasons.push('Sensor desconhecido.');
    if(sensor&&packet.unit!==sensor.unit)reasons.push('Unidade incompatível com o contrato.');
    const value=Number(packet?.value);if(!Number.isFinite(value))reasons.push('Valor não numérico.');
    else if(sensor&&(value<sensor.min||value>sensor.max))reasons.push('Valor fora do limite físico configurado.');
    const sequence=Number(packet?.sequence);if(!Number.isInteger(sequence)||sequence<0)reasons.push('Sequência inválida.');
    const gap=Number.isInteger(previousSequence)&&Number.isInteger(sequence)&&sequence>previousSequence+1;
    return {status:reasons.length?'invalid':gap||packet.status==='warning'?'warning':'ok',reasons,gap,packet:structuredClone(packet)};
  }
  search(query=''){
    const needle=String(query).trim().toLocaleLowerCase('pt-BR');if(!needle)return this.technologies();
    return SPACE_TECHNOLOGIES.filter(item=>[item.name,item.summary,item.category,...item.tools,...item.modules].join(' ').toLocaleLowerCase('pt-BR').includes(needle)).map(item=>structuredClone(item));
  }
}
