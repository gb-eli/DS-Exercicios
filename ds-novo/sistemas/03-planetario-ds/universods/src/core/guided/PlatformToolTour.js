import { TOOL_TOUR_STEPS } from '../../data/guidedJourneySystems.js';
const clone=value=>structuredClone(value);
export class PlatformToolTour {
  constructor(storage,profileId){this.storage=storage;this.key=`tool-tour:${profileId||'visitante'}`;this.state=this.normalize(storage.get(this.key,{}));}
  normalize(input={}){return {schema:'cosmos-ds-tool-tour-v1',active:Boolean(input.active),index:Math.max(0,Math.min(Number(input.index||0),TOOL_TOUR_STEPS.length-1)),completed:Boolean(input.completed),updatedAt:input.updatedAt||null};}
  snapshot(){const step=TOOL_TOUR_STEPS[this.state.index]||null;return {...clone(this.state),step:step?clone(step):null,total:TOOL_TOUR_STEPS.length};}
  save(){this.state.updatedAt=new Date().toISOString();this.storage.set(this.key,this.state);return this.snapshot();}
  start(){this.state.active=true;this.state.index=0;return this.save();}
  next(){if(this.state.index>=TOOL_TOUR_STEPS.length-1){this.state.active=false;this.state.completed=true;}else this.state.index++;return this.save();}
  previous(){this.state.index=Math.max(0,this.state.index-1);return this.save();}
  stop(){this.state.active=false;return this.save();}
  reset(){this.state={active:false,index:0,completed:false,updatedAt:null};return this.save();}
}
