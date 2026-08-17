import {
  ASTRO_CAMERA_BY_ID,ASTRO_CAMERAS,ASTRO_TARGET_BY_ID,ASTRO_TARGETS,ASTRO_PRESET_BY_ID,ASTRO_CAPTURE_PRESETS,
  ASTRO_CONDITION_BY_ID,ASTRO_SESSION_CONDITIONS,ASTRO_CALIBRATION_FRAMES,ASTRO_STACK_BY_ID,ASTRO_PALETTE_BY_ID,
  ASTRO_OPTICAL_BY_ID,ASTRO_OPTICAL_SETUPS
} from '../../data/astrophotographySystems.js';

const clamp=(value,min,max)=>Math.max(min,Math.min(max,Number(value)||0));
const round=(value,digits=1)=>Number(Number(value||0).toFixed(digits));
const seeded=(seed,index)=>{let x=Math.sin((seed+1)*(index+11)*12.9898)*43758.5453;return x-Math.floor(x);};
const clone=value=>JSON.parse(JSON.stringify(value));

const defaults=()=>({
  schema:'cosmos-ds-astrophotography-session-v1',cameraId:'planetary-color',targetId:'jupiter',presetId:'planetary',conditionId:'excellent',opticalId:'sct-150',
  exposureMs:10,subSeconds:0,gain:62,requestedFrames:2200,coolingC:0,dither:false,keepPercent:25,stackMethod:'sigma',paletteId:'natural',
  denoise:38,stretch:55,saturation:52,sharpen:42,planned:false,plan:null,capture:null,calibration:{bias:0,dark:0,flat:0,applied:false},
  alignment:null,stack:null,processing:null,notes:[],gallery:[],history:[],updatedAt:new Date().toISOString()
});

export class AstrophotographySessionModel{
  constructor(saved={}){
    this.state={...defaults(),...clone(saved||{})};
    this.state.calibration={...defaults().calibration,...clone(saved?.calibration||{})};
    this.state.notes=Array.isArray(saved?.notes)?saved.notes.slice(-30):[];
    this.state.gallery=Array.isArray(saved?.gallery)?saved.gallery.slice(-12):[];
    this.state.history=Array.isArray(saved?.history)?saved.history.slice(-120):[];
    if(!ASTRO_CAMERA_BY_ID[this.state.cameraId])this.state.cameraId=defaults().cameraId;
    if(!ASTRO_TARGET_BY_ID[this.state.targetId])this.state.targetId=defaults().targetId;
    if(!ASTRO_PRESET_BY_ID[this.state.presetId])this.state.presetId=defaults().presetId;
    if(!ASTRO_CONDITION_BY_ID[this.state.conditionId])this.state.conditionId=defaults().conditionId;
    if(!ASTRO_OPTICAL_BY_ID[this.state.opticalId])this.state.opticalId=defaults().opticalId;
  }
  camera(){return ASTRO_CAMERA_BY_ID[this.state.cameraId]||ASTRO_CAMERAS[0];}
  target(){return ASTRO_TARGET_BY_ID[this.state.targetId]||ASTRO_TARGETS[0];}
  preset(){return ASTRO_PRESET_BY_ID[this.state.presetId]||ASTRO_CAPTURE_PRESETS[0];}
  condition(){return ASTRO_CONDITION_BY_ID[this.state.conditionId]||ASTRO_SESSION_CONDITIONS[0];}
  optical(){return ASTRO_OPTICAL_BY_ID[this.state.opticalId]||ASTRO_OPTICAL_SETUPS[0];}
  stackMethod(){return ASTRO_STACK_BY_ID[this.state.stackMethod];}
  palette(){return ASTRO_PALETTE_BY_ID[this.state.paletteId];}
  snapshot(){return clone({...this.state,progress:this.progress(),metrics:this.metrics(),readiness:this.readiness()});}
  touch(){this.state.updatedAt=new Date().toISOString();}
  log(type,message,data={}){this.state.history.push({type,message,data,at:new Date().toISOString()});this.state.history=this.state.history.slice(-120);this.touch();}
  resetPipeline(reason='Configuração alterada'){
    this.state.planned=false;this.state.plan=null;this.state.capture=null;this.state.calibration.applied=false;this.state.alignment=null;this.state.stack=null;this.state.processing=null;
    this.log('reset',reason);
  }
  selectCamera(id){if(!ASTRO_CAMERA_BY_ID[id])return false;this.state.cameraId=id;this.resetPipeline('Câmera alterada');return true;}
  selectTarget(id){if(!ASTRO_TARGET_BY_ID[id])return false;this.state.targetId=id;const target=this.target();this.applyPreset(target.recommendedPreset,false);if(!this.camera().idealFor.includes(id)){const compatible=ASTRO_CAMERAS.find(item=>item.idealFor.includes(id));if(compatible)this.state.cameraId=compatible.id;}const optical=ASTRO_OPTICAL_SETUPS.find(item=>item.idealFor.includes(id));if(optical)this.state.opticalId=optical.id;this.resetPipeline('Alvo alterado');return true;}
  selectCondition(id){if(!ASTRO_CONDITION_BY_ID[id])return false;this.state.conditionId=id;this.resetPipeline('Condição do céu alterada');return true;}
  selectOptical(id){if(!ASTRO_OPTICAL_BY_ID[id])return false;this.state.opticalId=id;this.resetPipeline('Conjunto óptico alterado');return true;}
  applyPreset(id,reset=true){const preset=ASTRO_PRESET_BY_ID[id];if(!preset)return false;this.state.presetId=id;this.state.exposureMs=preset.exposureMs;this.state.subSeconds=preset.subSeconds;this.state.gain=preset.gain;this.state.requestedFrames=preset.frames;this.state.coolingC=preset.coolingC;this.state.dither=preset.dither;this.state.keepPercent=preset.qualityKeep;if(reset)this.resetPipeline('Preset aplicado');return true;}
  setCaptureParameter(key,value){
    const ranges={exposureMs:[1,1000],subSeconds:[0,600],gain:[0,100],requestedFrames:[10,10000],coolingC:[-25,20],keepPercent:[5,100]};
    if(!(key in ranges))return false;this.state[key]=clamp(value,...ranges[key]);this.resetPipeline(`Parâmetro ${key} alterado`);return true;
  }
  setDither(value){this.state.dither=Boolean(value);this.resetPipeline('Dithering alterado');}
  setStackMethod(id){if(!ASTRO_STACK_BY_ID[id])return false;this.state.stackMethod=id;this.state.stack=null;this.state.processing=null;this.log('stack-method',`Método ${id} selecionado`);return true;}
  setPalette(id){if(!ASTRO_PALETTE_BY_ID[id])return false;this.state.paletteId=id;this.state.processing=null;this.log('palette',`Paleta ${id} selecionada`);return true;}
  setProcessing(key,value){if(!['denoise','stretch','saturation','sharpen'].includes(key))return false;this.state[key]=clamp(value,0,100);this.state.processing=null;this.touch();return true;}
  metrics(){
    const camera=this.camera(),optical=this.optical(),preset=this.preset();
    const exposureSeconds=preset.mode==='video'?this.state.exposureMs/1000:Math.max(1,this.state.subSeconds);
    const overhead=preset.mode==='video'?0.002:(this.state.dither?7:2);
    const totalSeconds=this.state.requestedFrames*(exposureSeconds+overhead);
    const rawFrameMb=camera.megapixels*(camera.bitDepth/8)*1.08;
    const dataMb=rawFrameMb*this.state.requestedFrames;
    const fovWidth=57.3*camera.sensorWidthMm/Math.max(1,optical.focalLengthMm);
    const fovHeight=57.3*camera.sensorHeightMm/Math.max(1,optical.focalLengthMm);
    const pixelScale=206.265*camera.pixelSizeUm/Math.max(1,optical.focalLengthMm);
    return {exposureSeconds:round(exposureSeconds,3),totalSeconds:round(totalSeconds,1),durationMinutes:round(totalSeconds/60,1),rawFrameMb:round(rawFrameMb,2),dataMb:round(dataMb,1),dataGb:round(dataMb/1024,2),fovWidth:round(fovWidth,2),fovHeight:round(fovHeight,2),pixelScale:round(pixelScale,2)};
  }
  readiness(){
    const camera=this.camera(),target=this.target(),condition=this.condition(),optical=this.optical(),preset=this.preset(),m=this.metrics();
    const warnings=[];
    if(!camera.idealFor.includes(target.id))warnings.push('A câmera não é a opção mais indicada para este alvo.');
    if(!optical.idealFor.includes(target.id))warnings.push('O conjunto óptico pode enquadrar ou ampliar o alvo de forma menos eficiente.');
    if(target.kind==='deep-sky'&&optical.tracking==='altaz'&&this.state.subSeconds>30)warnings.push('Exposição longa em montagem altazimutal pode produzir rotação de campo.');
    if(target.kind==='deep-sky'&&!camera.cooled)warnings.push('Céu profundo com câmera não refrigerada tende a apresentar mais ruído térmico.');
    if(target.kind==='planetary'&&camera.maxFps<50)warnings.push('Taxa de quadros baixa reduz a seleção de momentos estáveis.');
    if(preset.mode==='sequence'&&condition.tracking<.6&&this.state.subSeconds>60)warnings.push('Rastreamento insuficiente para a exposição planejada.');
    if(preset.mode==='sequence'&&condition.skyGlow>.4&&this.state.subSeconds>180)warnings.push('Fundo de céu brilhante pode saturar antes do fim da exposição.');
    if(m.dataGb>20)warnings.push('A sequência exige grande volume de armazenamento.');
    const compatibility=clamp(100-warnings.length*16+(camera.idealFor.includes(target.id)?8:0)+(optical.idealFor.includes(target.id)?8:0),20,100);
    return {ok:warnings.length<=2,warnings,compatibility};
  }
  planSession(){
    const metrics=this.metrics(),ready=this.readiness();
    this.state.plan={createdAt:new Date().toISOString(),cameraId:this.state.cameraId,targetId:this.state.targetId,opticalId:this.state.opticalId,presetId:this.state.presetId,conditionId:this.state.conditionId,metrics,readiness:ready};
    this.state.planned=true;this.log('plan','Sessão planejada',{compatibility:ready.compatibility,durationMinutes:metrics.durationMinutes,dataGb:metrics.dataGb});return clone(this.state.plan);
  }
  captureSequence(){
    if(!this.state.planned)return {ok:false,reason:'Planeje a sessão antes da captura.'};
    const target=this.target(),condition=this.condition(),camera=this.camera(),preset=this.preset(),requested=Math.round(this.state.requestedFrames);
    const sampleCount=Math.min(240,Math.max(12,Math.round(requested/(preset.mode==='video'?10:1))));
    const seed=target.id.length*31+camera.id.length*17+requested+Math.round(this.state.gain*3);
    const frames=[];
    for(let i=0;i<sampleCount;i++){
      const turbulence=(seeded(seed,i)-.5)*(1-condition.seeing)*55;
      const trackingPenalty=(1-condition.tracking)*(preset.mode==='sequence'?45:12)*seeded(seed+7,i);
      const cloudPenalty=condition.clouds*45*seeded(seed+19,i);
      const gainNoise=(this.state.gain/100)*camera.readNoiseE*4;
      const quality=clamp(42+target.brightness*24+condition.seeing*25+condition.transparency*14-turbulence-trackingPenalty-cloudPenalty-gainNoise+seeded(seed+41,i)*20,2,100);
      frames.push({id:`f-${Date.now()}-${i}`,index:i+1,quality:round(quality,1),starsRoundness:round(clamp(condition.tracking*100-trackingPenalty+seeded(seed+3,i)*8,5,100),1),noise:round(clamp(camera.readNoiseE*8+this.state.gain*.22+condition.skyGlow*32-seeded(seed+5,i)*8,2,100),1)});
    }
    const mean=frames.reduce((sum,item)=>sum+item.quality,0)/frames.length,best=Math.max(...frames.map(item=>item.quality));
    const metrics=this.metrics();
    this.state.capture={createdAt:new Date().toISOString(),requestedFrames:requested,sampledFrames:frames,totalDurationSeconds:metrics.totalSeconds,dataMb:metrics.dataMb,meanQuality:round(mean,1),bestQuality:round(best,1),mode:preset.mode};
    this.state.calibration.applied=false;this.state.alignment=null;this.state.stack=null;this.state.processing=null;
    this.log('capture',`Sequência capturada: ${requested} quadros`,{meanQuality:round(mean,1),bestQuality:round(best,1)});
    return {ok:true,capture:clone(this.state.capture)};
  }
  addCalibration(type,count=1){
    const definition=ASTRO_CALIBRATION_FRAMES.find(item=>item.id===type);if(!definition)return {ok:false,reason:'Tipo de calibração inválido.'};
    const amount=Math.max(1,Math.round(Number(count)||1));this.state.calibration[type]=Math.min(200,this.state.calibration[type]+amount);this.state.calibration.applied=false;this.state.alignment=null;this.state.stack=null;this.state.processing=null;this.log('calibration-frame',`${amount} ${definition.name} adicionados`);return {ok:true,count:this.state.calibration[type]};
  }
  calibrationStatus(){return ASTRO_CALIBRATION_FRAMES.map(item=>({...item,count:this.state.calibration[item.id]||0,complete:(this.state.calibration[item.id]||0)>=item.minimum}));}
  calibrationReady(){return this.calibrationStatus().every(item=>item.complete);}
  applyCalibration(){
    if(!this.state.capture)return {ok:false,reason:'Capture uma sequência antes da calibração.'};
    if(!this.calibrationReady())return {ok:false,reason:'Complete bias, dark e flat mínimos.'};
    this.state.calibration.applied=true;this.state.calibration.appliedAt=new Date().toISOString();this.state.alignment=null;this.state.stack=null;this.state.processing=null;this.log('calibration','Calibração aplicada');return {ok:true,status:this.calibrationStatus()};
  }
  alignFrames(){
    if(!this.state.calibration.applied)return {ok:false,reason:'Aplique a calibração antes do alinhamento.'};
    const frames=this.state.capture.sampledFrames.slice().sort((a,b)=>b.quality-a.quality),keepCount=Math.max(3,Math.round(frames.length*this.state.keepPercent/100));
    const kept=frames.slice(0,keepCount),virtualKept=Math.max(1,Math.round(this.state.capture.requestedFrames*this.state.keepPercent/100));
    const mean=kept.reduce((sum,item)=>sum+item.quality,0)/kept.length;
    this.state.alignment={createdAt:new Date().toISOString(),sampledKept:kept.length,virtualKept,meanQuality:round(mean,1),rejected:this.state.capture.requestedFrames-virtualKept,registered:true};
    this.state.stack=null;this.state.processing=null;this.log('align',`${virtualKept} quadros alinhados`,{meanQuality:round(mean,1)});return {ok:true,alignment:clone(this.state.alignment)};
  }
  stackFrames(){
    if(!this.state.alignment?.registered)return {ok:false,reason:'Alinhe os quadros antes do empilhamento.'};
    const method=this.stackMethod(),condition=this.condition(),base=this.state.alignment.meanQuality;
    const snrGain=Math.sqrt(Math.max(1,this.state.alignment.virtualKept));
    const methodBonus=this.state.stackMethod==='sigma'?8:this.state.stackMethod==='median'?4:6;
    const score=clamp(base*.7+Math.min(26,Math.log2(snrGain+1)*6)+methodBonus-condition.skyGlow*8,5,100);
    this.state.stack={createdAt:new Date().toISOString(),method:method.id,methodName:method.name,frames:this.state.alignment.virtualKept,snrGain:round(snrGain,2),score:round(score,1),histogram:this.histogram(score)};
    this.state.processing=null;this.log('stack',`${this.state.alignment.virtualKept} quadros empilhados`,{method:method.id,score:round(score,1)});return {ok:true,stack:clone(this.state.stack)};
  }
  histogram(score=this.state.stack?.score||45){
    const bins=[];for(let i=0;i<32;i++){const x=i/31,peak=Math.exp(-Math.pow((x-(.18+score/450))/.16,2)),high=Math.exp(-Math.pow((x-.72)/.21,2))*.18;bins.push(round(clamp((peak+high)*100,0,100),1));}return bins;
  }
  processImage(){
    if(!this.state.stack)return {ok:false,reason:'Empilhe os quadros antes do processamento.'};
    const palette=this.palette();
    const overprocess=Math.max(0,this.state.denoise-78)+Math.max(0,this.state.sharpen-78)+Math.max(0,this.state.saturation-84);
    const improvement=this.state.denoise*.08+this.state.stretch*.1+this.state.sharpen*.08+this.state.saturation*.025;
    const finalScore=clamp(this.state.stack.score+improvement-overprocess*.24,5,100);
    this.state.processing={createdAt:new Date().toISOString(),paletteId:palette.id,paletteName:palette.name,denoise:this.state.denoise,stretch:this.state.stretch,saturation:this.state.saturation,sharpen:this.state.sharpen,finalScore:round(finalScore,1),histogram:this.histogram(finalScore),warnings:overprocess>25?['Parâmetros extremos podem apagar detalhes ou criar artefatos.']:[]};
    this.log('process',`Imagem processada em ${palette.name}`,{finalScore:round(finalScore,1)});return {ok:true,processing:clone(this.state.processing)};
  }
  addNote(text){const value=String(text||'').trim();if(value.length<3)return false;this.state.notes.push({text:value,at:new Date().toISOString(),targetId:this.state.targetId});this.state.notes=this.state.notes.slice(-30);this.log('note','Nota adicionada');return true;}
  saveResult(){
    if(!this.state.processing)return {ok:false,reason:'Processe a imagem antes de salvar o resultado.'};
    const result={id:`astro-${Date.now()}`,createdAt:new Date().toISOString(),targetId:this.state.targetId,targetName:this.target().name,cameraId:this.state.cameraId,cameraName:this.camera().name,opticalId:this.state.opticalId,presetId:this.state.presetId,conditionId:this.state.conditionId,frames:this.state.stack.frames,score:this.state.processing.finalScore,paletteId:this.state.paletteId,thumbnailSeed:this.target().id.length*17+this.state.stack.frames};
    this.state.gallery.unshift(result);this.state.gallery=this.state.gallery.slice(0,12);this.log('gallery',`Resultado salvo: ${result.targetName}`);return {ok:true,result:clone(result)};
  }
  progress(){
    const steps=[Boolean(this.state.planned),Boolean(this.state.capture),Boolean(this.state.calibration.applied),Boolean(this.state.alignment?.registered),Boolean(this.state.stack),Boolean(this.state.processing),this.state.gallery.length>0];
    const completed=steps.filter(Boolean).length;return {completed,total:steps.length,percent:Math.round(completed/steps.length*100),planned:steps[0],captured:steps[1],calibrated:steps[2],aligned:steps[3],stacked:steps[4],processed:steps[5],saved:steps[6]};
  }
  evidence(profile={}){
    return {schema:'cosmos-ds-astrophotography-evidence-v1',generatedAt:new Date().toISOString(),profile:{id:profile.id||'',name:profile.name||'',className:profile.className||'',callsign:profile.callsign||''},session:{camera:this.camera(),target:this.target(),optical:this.optical(),preset:this.preset(),condition:this.condition(),parameters:{exposureMs:this.state.exposureMs,subSeconds:this.state.subSeconds,gain:this.state.gain,requestedFrames:this.state.requestedFrames,coolingC:this.state.coolingC,dither:this.state.dither,keepPercent:this.state.keepPercent},plan:this.state.plan,capture:this.state.capture,calibration:this.state.calibration,alignment:this.state.alignment,stack:this.state.stack,processing:this.state.processing,notes:this.state.notes,gallery:this.state.gallery,progress:this.progress(),history:this.state.history}};
  }
}
