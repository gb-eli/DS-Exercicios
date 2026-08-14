const clone=value=>structuredClone(value);
export class GuidedLessonPlanStore {
  constructor(storage){this.storage=storage;this.key='guided-lesson-plan-c22';this.state=this.normalize(storage.get(this.key,{}));}
  normalize(input={}){return {schema:'cosmos-ds-guided-lesson-plan-v1',trailId:input.trailId||'technology',className:String(input.className||'Turma não definida').slice(0,48),minimumMinutes:Math.max(10,Math.min(180,Number(input.minimumMinutes||40))),lockSequence:input.lockSequence!==false,narration:Boolean(input.narration),updatedAt:input.updatedAt||null};}
  snapshot(){return clone(this.state);}
  update(patch={}){this.state=this.normalize({...this.state,...patch,updatedAt:new Date().toISOString()});this.storage.set(this.key,this.state);return this.snapshot();}
  export(){return JSON.stringify({...this.snapshot(),exportedAt:new Date().toISOString()},null,2);}
}
