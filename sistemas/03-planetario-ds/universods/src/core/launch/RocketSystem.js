import { LAUNCH_MISSIONS, FIRST_STAGES, UPPER_STAGES, PAYLOADS, GUIDANCE_SYSTEMS, FAIRINGS, LAUNCH_SITES } from '../../data/launchSystems.js';

const G0 = 9.80665;
const byId = (items,id) => items.find(item=>item.id===id) ?? items[0];
const rocketDeltaV = (wet,dry,isp) => G0 * isp * Math.log(Math.max(1.0001,wet/dry));

export class RocketSystem {
  constructor(config={}) {
    this.config={
      missionId:'leo-lab', firstStageId:'core-h2', upperStageId:'upper-v', payloadId:'orbital-lab',
      guidanceId:'dual', fairingId:'standard', siteId:'coastal', recovery:false, reservePercent:6,
      ...config
    };
  }
  set(key,value){this.config={...this.config,[key]:value};return this.summary();}
  summary(){
    const mission=byId(LAUNCH_MISSIONS,this.config.missionId);
    const firstStage=byId(FIRST_STAGES,this.config.firstStageId);
    const upperStage=byId(UPPER_STAGES,this.config.upperStageId);
    const payload=byId(PAYLOADS,this.config.payloadId);
    const guidance=byId(GUIDANCE_SYSTEMS,this.config.guidanceId);
    const fairing=byId(FAIRINGS,this.config.fairingId);
    const site=byId(LAUNCH_SITES,this.config.siteId);
    const recoveryReserveKg=this.config.recovery && firstStage.recoveryReserveKg ? firstStage.recoveryReserveKg : 0;
    const reserveFraction=Math.max(0,Math.min(15,Number(this.config.reservePercent)||0))/100;
    const firstUsablePropellant=Math.max(1,firstStage.propellantKg*(1-reserveFraction)-recoveryReserveKg);
    const upperUsablePropellant=Math.max(1,upperStage.propellantKg*(1-reserveFraction*.45));
    const upperWet=upperStage.dryMassKg+upperUsablePropellant+payload.massKg+fairing.massKg+guidance.massKg;
    const upperDry=upperStage.dryMassKg+payload.massKg+guidance.massKg;
    const firstWet=firstStage.dryMassKg+firstUsablePropellant+upperWet;
    const firstDry=firstStage.dryMassKg+upperWet;
    const deltaV1=rocketDeltaV(firstWet,firstDry,firstStage.ispS);
    const deltaV2=rocketDeltaV(upperWet,upperDry,upperStage.ispS);
    const rotationBonus=site.rotationBonusMs*Math.max(0,Math.cos((mission.inclination-site.latitude)*Math.PI/180));
    const totalDeltaV=deltaV1+deltaV2+rotationBonus;
    const liftOffMassKg=firstWet;
    const twr=firstStage.thrustN/(liftOffMassKg*G0);
    const structuralLimit=Math.min(firstStage.maxPayloadKg,upperStage.maxPayloadKg,fairing.maxPayloadKg);
    const deltaVMargin=totalDeltaV-mission.requiredDeltaV;
    const issues=[];
    if(payload.massKg>mission.maxPayloadKg)issues.push(`A carga excede o limite didático da missão em ${Math.round(payload.massKg-mission.maxPayloadKg)} kg.`);
    if(payload.massKg>structuralLimit)issues.push('A carga excede o limite de um estágio ou da coifa selecionada.');
    if(twr<1.18)issues.push(`Relação empuxo/peso insuficiente (${twr.toFixed(2)}).`);
    if(deltaVMargin<0)issues.push(`Faltam aproximadamente ${Math.abs(Math.round(deltaVMargin))} m/s de Δv.`);
    if(this.config.recovery&&!firstStage.recoveryReserveKg)issues.push('O primeiro estágio selecionado não possui reserva configurada para recuperação.');
    if(mission.id==='polar-observer'&&site.id!=='polar'&&site.id!=='alcantara')issues.push('A base selecionada não é ideal para o corredor polar.');
    if(mission.id==='lunar-demo'&&upperStage.id!=='upper-deep')issues.push('A demonstração translunar requer o estágio superior Deep.');
    if(payload.type==='deep-space'&&guidance.redundancy<2)issues.push('A sonda de espaço profundo exige navegação redundante.');
    const warnings=[];
    if(twr<1.3&&twr>=1.18)warnings.push('Decolagem possível, porém com baixa margem de empuxo.');
    if(deltaVMargin<350&&deltaVMargin>=0)warnings.push('Margem de Δv pequena; vento e dispersões podem comprometer a missão.');
    if(site.weatherRisk>.2)warnings.push('A base possui maior risco meteorológico didático.');
    return {
      config:{...this.config}, mission, firstStage, upperStage, payload, guidance, fairing, site,
      liftOffMassKg, firstUsablePropellant, upperUsablePropellant, recoveryReserveKg,
      deltaV1, deltaV2, totalDeltaV, deltaVMargin, twr, structuralLimit,
      validation:{ok:issues.length===0,issues,warnings},
      flightConfig:{
        firstStage:{...firstStage,propellantKg:firstUsablePropellant}, upperStage:{...upperStage,propellantKg:upperUsablePropellant},
        payloadMassKg:payload.massKg, fairingMassKg:fairing.massKg, guidanceMassKg:guidance.massKg,
        dragAreaM2:fairing.dragAreaM2, guidanceGain:guidance.guidanceGain, reliability:guidance.reliability,
        targetAltitudeKm:mission.id==='leo-lab'?400:mission.id==='polar-observer'?650:mission.id==='transfer-relay'?900:1200,
        requiredDeltaV:mission.requiredDeltaV, missionId:mission.id, siteBonusMs:rotationBonus
      }
    };
  }
}
