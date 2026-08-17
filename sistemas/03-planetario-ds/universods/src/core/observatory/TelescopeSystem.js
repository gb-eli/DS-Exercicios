import { TELESCOPES, TARGETS } from '../../data/observatorySystems.js';

export class TelescopeSystem {
  constructor({ telescopeId='optical', targetId='nebula' }={}) {
    this.telescopeId=telescopeId;this.targetId=targetId;this.trackingError=0.18;this.focus=0.72;this.temperature=18;this.exposure=60;this.events=[];
  }
  telescope(){return TELESCOPES.find(item=>item.id===this.telescopeId)??TELESCOPES[0];}
  target(){return TARGETS.find(item=>item.id===this.targetId)??TARGETS[0];}
  configure(patch={}){if(patch.telescopeId&&TELESCOPES.some(i=>i.id===patch.telescopeId))this.telescopeId=patch.telescopeId;if(patch.targetId&&TARGETS.some(i=>i.id===patch.targetId))this.targetId=patch.targetId;if(Number.isFinite(Number(patch.exposure)))this.exposure=Math.max(1,Math.min(900,Number(patch.exposure)));return this.snapshot();}
  align(){this.trackingError=Math.max(.01,this.trackingError*.18);this.focus=Math.min(1,this.focus+.38);this.events.push({type:'alignment',message:'Alinhamento e foco refinados.'});return this.snapshot();}
  disturb(){this.trackingError=Math.min(2.5,this.trackingError+.7);this.focus=Math.max(.25,this.focus-.28);this.events.push({type:'warning',message:'Perturbação simulada alterou apontamento e foco.'});return this.snapshot();}
  compatibility(){const telescope=this.telescope(),target=this.target();const supported=target.bands.includes(telescope.band);const base=telescope.sensitivity*telescope.resolution;const alignment=Math.max(0,1-this.trackingError/2.2);const focus=Math.max(.15,this.focus);const score=Math.round(100*base*alignment*focus*(supported?1:.22));return {supported,score,reason:supported?'Faixa espectral compatível com o alvo.':'O alvo possui pouca emissão útil para este instrumento.'};}
  snapshot(){return {telescope:this.telescope(),target:this.target(),trackingError:this.trackingError,focus:this.focus,temperature:this.temperature,exposure:this.exposure,compatibility:this.compatibility()};}
  drainEvents(){return this.events.splice(0);}
}
