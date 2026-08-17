import { TELESCOPE_BY_ID,TELESCOPE_CATALOG,EYEPIECE_BY_ID,TELESCOPE_EYEPIECES,FILTER_BY_ID,TELESCOPE_FILTERS,TARGET_BY_ID,TELESCOPE_TARGETS,SKY_BY_ID,SKY_CONDITIONS,TELESCOPE_MOUNTS,ALIGNMENT_STARS } from '../../data/telescopeLabSystems.js';

const clamp=(v,min,max)=>Math.min(max,Math.max(min,Number(v)||0));
const round=(v,d=1)=>Number(Number(v).toFixed(d));

export class ImmersiveTelescopeModel{
  constructor(saved={}){
    this.telescopeId=TELESCOPE_BY_ID[saved.telescopeId]?saved.telescopeId:'refractor-70';
    this.targetId=TARGET_BY_ID[saved.targetId]?saved.targetId:'moon';
    this.eyepieceId=EYEPIECE_BY_ID[saved.eyepieceId]?saved.eyepieceId:'ep-25';
    this.filterId=FILTER_BY_ID[saved.filterId]?saved.filterId:'none';
    this.skyId=SKY_BY_ID[saved.skyId]?saved.skyId:'suburban';
    this.focus=clamp(saved.focus??.68,0,1);this.exposure=clamp(saved.exposure??45,1,180);
    this.assembly=new Set(Array.isArray(saved.assembly)?saved.assembly:[]);
    this.alignmentStars=new Set(Array.isArray(saved.alignmentStars)?saved.alignmentStars:[]);
    this.observations=Array.isArray(saved.observations)?saved.observations.slice(-40):[];
    this.compareIds=new Set(Array.isArray(saved.compareIds)?saved.compareIds:[]);
    this.actions=Array.isArray(saved.actions)?saved.actions.slice(-100):[];
  }
  telescope(){return TELESCOPE_BY_ID[this.telescopeId]||TELESCOPE_CATALOG[0];}
  target(){return TARGET_BY_ID[this.targetId]||TELESCOPE_TARGETS[0];}
  eyepiece(){return EYEPIECE_BY_ID[this.eyepieceId]||TELESCOPE_EYEPIECES[0];}
  filter(){return FILTER_BY_ID[this.filterId]||TELESCOPE_FILTERS[0];}
  sky(){return SKY_BY_ID[this.skyId]||SKY_CONDITIONS[0];}
  mount(){return TELESCOPE_MOUNTS.find(item=>item.id===this.telescope().mount)||TELESCOPE_MOUNTS[0];}
  log(type,payload={}){this.actions.push({type,payload,at:new Date().toISOString()});this.actions=this.actions.slice(-100);}
  selectTelescope(id){if(!TELESCOPE_BY_ID[id])return false;this.telescopeId=id;this.assembly.clear();this.alignmentStars.clear();const target=this.target();if(this.telescope().band!==target.band)this.targetId=this.telescope().band==='radio'?'hydrogen-line':'moon';this.filterId='none';this.log('telescope-selected',{id});return true;}
  selectTarget(id){if(!TARGET_BY_ID[id])return false;this.targetId=id;if(this.target().band!==this.telescope().band)this.telescopeId=this.target().band==='radio'?'radio-dish':'refractor-70';if(!this.target().recommendedFilters.includes(this.filterId))this.filterId='none';this.log('target-selected',{id});return true;}
  setEyepiece(id){if(!EYEPIECE_BY_ID[id])return false;this.eyepieceId=id;this.log('eyepiece-selected',{id});return true;}
  setFilter(id){if(!FILTER_BY_ID[id])return false;this.filterId=id;this.log('filter-selected',{id});return true;}
  setSky(id){if(!SKY_BY_ID[id])return false;this.skyId=id;this.log('sky-selected',{id});return true;}
  setFocus(value){this.focus=clamp(value,0,1);return this.focus;}
  setExposure(value){this.exposure=clamp(value,1,180);return this.exposure;}
  assemblySteps(){return this.telescope().parts.map((part,index)=>({id:part,label:this.partLabel(part),done:this.assembly.has(part),order:index+1}));}
  partLabel(id){return ({tripod:'Abrir e nivelar o tripé',mount:'Instalar a montagem',tube:'Fixar o tubo óptico',finder:'Instalar e alinhar o buscador',eyepiece:'Inserir a ocular',counterweight:'Balancear contrapeso',base:'Nivelar a base Dobsoniana',diagonal:'Instalar diagonal',controller:'Conectar controle e energia','smart-tube':'Fixar tubo inteligente',dish:'Orientar a parábola',feed:'Instalar alimentador RF',receiver:'Conectar receptor',computer:'Conectar computador de aquisição'})[id]||id;}
  completeAssembly(part){if(!this.telescope().parts.includes(part))return {ok:false,reason:'Componente não pertence ao instrumento.'};const index=this.telescope().parts.indexOf(part);const previous=this.telescope().parts[index-1];if(previous&&!this.assembly.has(previous))return {ok:false,reason:`Conclua primeiro: ${this.partLabel(previous)}.`};this.assembly.add(part);this.log('assembly-step',{part});return {ok:true,complete:this.assemblyComplete()};}
  assemblyComplete(){return this.telescope().parts.every(part=>this.assembly.has(part));}
  align(starId){const star=ALIGNMENT_STARS.find(item=>item.id===starId);if(!star)return {ok:false,reason:'Estrela de referência inválida.'};if(!this.assemblyComplete())return {ok:false,reason:'Monte o instrumento antes de alinhar.'};this.alignmentStars.add(starId);this.log('alignment-star',{starId});return {ok:true,complete:this.alignmentComplete()};}
  alignmentRequired(){return this.mount().alignmentStars;}
  alignmentComplete(){return this.alignmentStars.size>=this.alignmentRequired();}
  metrics(){
    const telescope=this.telescope(),target=this.target(),eyepiece=this.eyepiece(),sky=this.sky(),filter=this.filter();
    const radio=telescope.band==='radio';
    const magnification=radio?1:telescope.focalLengthMm/eyepiece.focalMm;
    const maxUseful=radio?1:telescope.apertureMm*2;
    const exitPupil=radio?0:telescope.apertureMm/Math.max(1,magnification);
    const trueFov=radio?12:eyepiece.apparentFov/Math.max(1,magnification);
    const resolutionArcsec=radio?120:116/Math.max(1,telescope.apertureMm);
    const lightGathering=radio?999:Math.pow(telescope.apertureMm/7,2);
    const compatibleBand=telescope.band===target.band;
    const apertureFactor=radio?1:clamp(telescope.apertureMm/Math.max(1,target.minimumApertureMm),.25,1);
    const fieldFactor=target.angularSizeArcsec>3600?clamp(trueFov/(target.angularSizeArcsec/3600),.25,1):1;
    const magnificationFactor=radio?1:magnification>maxUseful?clamp(maxUseful/magnification,.2,1):magnification<18&&target.kind==='planet'?.55:1;
    const filterFactor=target.recommendedFilters.includes(filter.id)?1:.78;
    const focusFactor=clamp(1-Math.abs(this.focus-.86)*2.2,.15,1);
    const alignmentFactor=this.alignmentRequired()===0?1:clamp(this.alignmentStars.size/this.alignmentRequired(),.25,1);
    const skyFactor=radio?clamp(1-sky.wind*.25,.55,1):clamp(sky.seeing*(1-sky.clouds*.75)*(target.kind==='nebula'||target.kind==='galaxy'?sky.darkness:.8+sky.darkness*.2),.12,1);
    const exposureFactor=target.kind==='nebula'||target.kind==='galaxy'?clamp(this.exposure/60,.3,1):clamp(1-Math.max(0,this.exposure-90)/150,.6,1);
    const score=Math.round(100*clamp((compatibleBand?1:0)*apertureFactor*fieldFactor*magnificationFactor*filterFactor*focusFactor*alignmentFactor*skyFactor*exposureFactor,0,1));
    return {magnification:round(magnification),maxUseful:round(maxUseful),exitPupil:round(exitPupil,2),trueFov:round(trueFov,2),resolutionArcsec:round(resolutionArcsec,2),lightGathering:Math.round(lightGathering),score,compatibleBand,overMagnified:magnification>maxUseful*1.05,focusFactor:round(focusFactor,2),skyFactor:round(skyFactor,2),alignmentFactor:round(alignmentFactor,2)};
  }
  readiness(){const metrics=this.metrics(),reasons=[];if(!this.assemblyComplete())reasons.push('montagem incompleta');if(!this.alignmentComplete())reasons.push('alinhamento pendente');if(!metrics.compatibleBand)reasons.push('faixa espectral incompatível');if(metrics.overMagnified)reasons.push('ampliação acima do limite didático');if(this.focus<.66)reasons.push('foco insuficiente');if(metrics.score<35)reasons.push('qualidade baixa para registro');return {ok:reasons.length===0,reasons,score:metrics.score};}
  observe(){const ready=this.readiness();if(!ready.ok)return {ok:false,reason:`Ajuste: ${ready.reasons.join(', ')}.`};const record={id:`OBS-${Date.now().toString(36).toUpperCase()}`,at:new Date().toISOString(),telescopeId:this.telescopeId,targetId:this.targetId,eyepieceId:this.eyepieceId,filterId:this.filterId,skyId:this.skyId,focus:round(this.focus,2),exposure:round(this.exposure),metrics:this.metrics(),features:this.target().features};this.observations.push(record);this.observations=this.observations.slice(-40);this.log('observation-recorded',{id:record.id,targetId:record.targetId});return {ok:true,record};}
  toggleCompare(id){if(!TELESCOPE_BY_ID[id])return false;if(this.compareIds.has(id))this.compareIds.delete(id);else if(this.compareIds.size<3)this.compareIds.add(id);return true;}
  compare(){return [...this.compareIds].map(id=>{const t=TELESCOPE_BY_ID[id];return {id:t.id,name:t.name,type:t.type,apertureMm:t.apertureMm,focalLengthMm:t.focalLengthMm,fRatio:t.fRatio,weightKg:t.weightKg,portability:t.portability,difficulty:t.difficulty,priceBandBRL:t.priceBandBRL,band:t.band};});}
  progress(){return {assembly:this.assemblyComplete(),alignment:this.alignmentComplete(),observations:this.observations.length,compare:this.compareIds.size,percent:Math.round((Number(this.assemblyComplete())+Number(this.alignmentComplete())+Math.min(1,this.observations.length/3)+Math.min(1,this.compareIds.size/3))/4*100)};}
  snapshot(){return {telescopeId:this.telescopeId,targetId:this.targetId,eyepieceId:this.eyepieceId,filterId:this.filterId,skyId:this.skyId,focus:this.focus,exposure:this.exposure,assembly:[...this.assembly],alignmentStars:[...this.alignmentStars],observations:[...this.observations],compareIds:[...this.compareIds],actions:[...this.actions],metrics:this.metrics(),readiness:this.readiness(),progress:this.progress()};}
  evidence(profile={}){return {schema:'cosmos-ds-telescope-lab-evidence-v1',generatedAt:new Date().toISOString(),profile:{id:profile.id||'visitante',name:profile.name||'Explorador DS',className:profile.className||'',callsign:profile.callsign||''},instrument:{...this.telescope()},configuration:{target:this.target(),eyepiece:this.eyepiece(),filter:this.filter(),sky:this.sky(),focus:round(this.focus,2),exposure:round(this.exposure)},session:{progress:this.progress(),metrics:this.metrics(),assembly:[...this.assembly],alignmentStars:[...this.alignmentStars],observations:[...this.observations],comparison:this.compare(),actions:this.actions.slice(-40)},disclaimer:'Simulação educacional. Preços são faixas aproximadas e procedimentos não substituem manuais ou supervisão.'};}
}
