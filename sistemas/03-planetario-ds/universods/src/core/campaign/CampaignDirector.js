const clone=v=>structuredClone(v);const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export class CampaignDirector{
 constructor(campaigns,{storage=null,profileId='visitante'}={}){this.campaigns=campaigns;this.storage=storage;this.profileId=profileId;this.activeId=null;this.stageIndex=0;this.completed=[];this.choices=[];this.events=[];this.score=0;this.startedAt=null;this.status='idle';this.restore();}
 key(){return`cosmos-campaign-${this.profileId}`;}
 restore(){try{const data=this.storage?.getItem?.(this.key());if(data){const parsed=JSON.parse(data);Object.assign(this,parsed);}}catch{}return this.snapshot();}
 persist(){try{this.storage?.setItem?.(this.key(),JSON.stringify({activeId:this.activeId,stageIndex:this.stageIndex,completed:this.completed,choices:this.choices,events:this.events,score:this.score,startedAt:this.startedAt,status:this.status}));}catch{}}
 start(id){if(!this.campaigns.some(c=>c.id===id))return false;this.activeId=id;this.stageIndex=0;this.completed=[];this.choices=[];this.events=[];this.score=0;this.startedAt=Date.now();this.status='active';this.persist();return true;}
 campaign(){return this.campaigns.find(c=>c.id===this.activeId)||null;}
 stage(){return this.campaign()?.stages?.[this.stageIndex]||null;}
 completeStage({quality=1,choice=null}={}){const stage=this.stage();if(!stage||this.status!=='active')return{ok:false};this.completed.push(stage.id);this.score+=Math.round(stage.points*clamp(quality,0,1.25));if(choice)this.choices.push({stage:stage.id,choice,at:Date.now()});this.events.push({type:'stage-complete',stage:stage.id,at:Date.now()});this.stageIndex++;if(!this.stage()){this.status='completed';this.events.push({type:'campaign-complete',at:Date.now()});}this.persist();return{ok:true,stage:clone(stage),status:this.status,score:this.score};}
 injectEvent(id,severity='medium'){const event={id,severity,at:Date.now(),resolved:false};this.events.push(event);this.persist();return clone(event);}
 resolveEvent(id,procedure){const event=[...this.events].reverse().find(e=>e.id===id&&!e.resolved);if(!event)return false;event.resolved=true;event.procedure=procedure;event.resolvedAt=Date.now();this.score+=severityPoints(event.severity);this.persist();return true;}
 evidence(){return{schema:'cosmos-ds-campaign-v1',campaign:this.campaign()?.title||this.activeId,status:this.status,score:this.score,completed:this.completed,choices:this.choices,events:this.events,durationMs:this.startedAt?Date.now()-this.startedAt:0,generatedAt:new Date().toISOString()};}
 snapshot(){return clone({activeId:this.activeId,stageIndex:this.stageIndex,completed:this.completed,choices:this.choices,events:this.events,score:this.score,startedAt:this.startedAt,status:this.status,campaign:this.campaign(),stage:this.stage()});}
}
function severityPoints(level){return level==='critical'?180:level==='high'?120:level==='medium'?80:40;}
