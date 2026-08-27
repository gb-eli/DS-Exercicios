import { TEACHER_TRAIL_EVENT_TYPES, TEACHER_TRAIL_ADAPTATIONS, DEFAULT_CLASSROOM_INSTRUCTIONS } from '../../data/teacherTrailSystems.js';
const clean=(value,max=300)=>String(value??'').trim().slice(0,max);
const slug=value=>clean(value,90).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const eventIds=new Set(TEACHER_TRAIL_EVENT_TYPES.map(item=>item.id));
const adaptationIds=new Set(TEACHER_TRAIL_ADAPTATIONS.map(item=>item.id));
const makeCode=(seed='COSMOS')=>{let hash=2166136261;for(const char of `${seed}-${Date.now()}-${Math.random()}`){hash^=char.charCodeAt(0);hash=Math.imul(hash,16777619);}return Math.abs(hash>>>0).toString(36).toUpperCase().slice(0,6).padEnd(6,'0');};
const normalizeStep=(item={},index=0)=>({
  id:clean(item.id||`step-${index+1}`,80).replace(/[^a-zA-Z0-9_-]/g,'-'),
  moduleId:clean(item.moduleId||'academy',70),title:clean(item.title||`Etapa ${index+1}`,120),
  objective:clean(item.objective||'Explore o laboratório e registre o que aprendeu.',500),
  why:clean(item.why||'Esta ferramenta ajuda a cumprir o objetivo da missão.',500),
  expected:clean(item.expected||item.evidence||'Registro da atividade.',400),
  evidencePrompt:clean(item.evidencePrompt||'Descreva brevemente o que você observou ou decidiu.',300),
  minimumMinutes:Math.max(0,Math.min(90,Number(item.minimumMinutes??3))),
  requiredEvent:eventIds.has(item.requiredEvent)?item.requiredEvent:'module-opened',
  narration:clean(item.narration||item.objective||'',700),supportHint:clean(item.supportHint||'',400),advancedChallenge:clean(item.advancedChallenge||'',400),order:index+1
});

export class CustomTrailPlan {
  constructor(input={}){
    this.schema='cosmos-ds-custom-trail-v1';
    this.id=clean(input.id||`custom-${slug(input.title||'trilha')}-${Date.now()}`,90).replace(/[^a-zA-Z0-9_-]/g,'-');
    this.title=clean(input.title||'Nova trilha do professor',100);this.icon=clean(input.icon||'◆',4);this.accent=/^#[0-9a-f]{6}$/i.test(input.accent||'')?input.accent:'#64e0ff';
    this.summary=clean(input.summary||input.mission||'Percurso personalizado do COSMOS DS.',300);
    this.role=clean(input.role||'Explorador em treinamento',120);this.opening=clean(input.opening||'Uma nova jornada foi preparada para esta turma.',600);
    this.mission=clean(input.mission||'Concluir as etapas e registrar evidências.',500);this.completion=clean(input.completion||'Jornada concluída com sucesso.',400);
    this.className=clean(input.className||'Turma não definida',60);this.accessCode=clean(input.accessCode||makeCode(this.title),12).toUpperCase();this.teacherCode=clean(input.teacherCode||makeCode(`${this.title}-PROF`),12).toUpperCase();
    this.lockSequence=input.lockSequence!==false;this.narration=Boolean(input.narration);this.adaptationMode=adaptationIds.has(input.adaptationMode)?input.adaptationMode:'standard';
    this.classroomUrl=clean(input.classroomUrl||'',500);this.classroomInstructions=clean(input.classroomInstructions||DEFAULT_CLASSROOM_INSTRUCTIONS,700);
    this.steps=(Array.isArray(input.steps)?input.steps:[]).map(normalizeStep);
    if(!this.steps.length)this.steps=[normalizeStep({},0),normalizeStep({moduleId:'technology-hub',title:'Relacionar tecnologia e missão'},1)];
    this.minimumTotalMinutes=Math.max(25,Math.min(360,Number(input.minimumTotalMinutes||this.steps.reduce((sum,item)=>sum+item.minimumMinutes,0)||25)));
    this.createdAt=input.createdAt||new Date().toISOString();this.updatedAt=new Date().toISOString();this.validate();
  }
  validate(){const errors=[];if(this.title.length<4)errors.push('O título deve possuir pelo menos 4 caracteres.');if(!/^[A-Z0-9-]{4,12}$/.test(this.accessCode))errors.push('O código de acesso deve possuir 4 a 12 letras, números ou hífen.');if(!/^[A-Z0-9-]{4,12}$/.test(this.teacherCode))errors.push('O código do professor deve possuir 4 a 12 letras, números ou hífen.');if(this.steps.length<2||this.steps.length>12)errors.push('Use de 2 a 12 etapas.');if(new Set(this.steps.map(item=>item.id)).size!==this.steps.length)errors.push('IDs de etapas precisam ser únicos.');if(this.steps.some(item=>!item.moduleId||item.title.length<3))errors.push('Cada etapa precisa de laboratório e título.');if(this.classroomUrl&&!/^https:\/\//i.test(this.classroomUrl))errors.push('O link do Classroom deve usar HTTPS.');if(errors.length)throw new Error(errors.join(' '));return true;}
  toGuidedDefinition(){return {id:this.id,title:this.title,icon:this.icon,accent:this.accent,duration:`${this.minimumTotalMinutes} min ou mais`,level:'Definida pelo professor',summary:this.summary,custom:true,accessCode:this.accessCode,teacherCode:this.teacherCode,className:this.className,narration:this.narration,adaptationMode:this.adaptationMode,classroomUrl:this.classroomUrl,classroomInstructions:this.classroomInstructions,story:{role:this.role,opening:this.opening,mission:this.mission,completion:this.completion,color:this.accent},steps:this.steps.map(item=>({...item,evidence:item.expected}))};}
  toJSON(){return {schema:this.schema,id:this.id,title:this.title,icon:this.icon,accent:this.accent,summary:this.summary,role:this.role,opening:this.opening,mission:this.mission,completion:this.completion,className:this.className,accessCode:this.accessCode,teacherCode:this.teacherCode,minimumTotalMinutes:this.minimumTotalMinutes,lockSequence:this.lockSequence,narration:this.narration,adaptationMode:this.adaptationMode,classroomUrl:this.classroomUrl,classroomInstructions:this.classroomInstructions,steps:this.steps.map(item=>({...item})),createdAt:this.createdAt,updatedAt:this.updatedAt};}
  clone(patch={}){return new CustomTrailPlan({...this.toJSON(),...patch,id:patch.id??this.id});}
  static fromJSON(data){if(data?.schema&&data.schema!=='cosmos-ds-custom-trail-v1')throw new Error('Formato de trilha incompatível.');return new CustomTrailPlan(data);}
  static fromTemplate(template,patch={}){return new CustomTrailPlan({...template,...patch,id:patch.id||`custom-${slug(template.title)}-${Date.now()}`,accessCode:patch.accessCode||makeCode(template.title)});}
  static generateCode(seed){return makeCode(seed);}
}
