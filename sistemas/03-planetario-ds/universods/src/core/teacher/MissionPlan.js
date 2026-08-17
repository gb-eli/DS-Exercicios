import { MISSION_MODULES } from '../../data/missionDirectorSystems.js';

const clean = (value, max=200) => String(value ?? '').trim().slice(0,max);
const validCode = value => /^[A-Z0-9-]{4,12}$/.test(value);
const makeCode = (seed='COSMOS') => {
  let hash=2166136261;
  for(const char of `${seed}-${Date.now()}-${Math.random()}`){hash^=char.charCodeAt(0);hash=Math.imul(hash,16777619);}
  return Math.abs(hash>>>0).toString(36).toUpperCase().slice(0,6).padEnd(6,'0');
};

export class MissionPlan {
  constructor(input={}) {
    this.schema='cosmos-ds-mission-plan-v1';
    this.id=clean(input.id || `mission-${Date.now()}`,80).replace(/[^a-zA-Z0-9_-]/g,'-');
    this.title=clean(input.title || 'Missão COSMOS DS',80);
    this.moduleId=clean(input.moduleId || 'academy',60);
    this.durationMinutes=Number(input.durationMinutes ?? 25);
    this.difficulty=clean(input.difficulty || 'guided',30);
    this.objective=clean(input.objective || 'Concluir a missão com evidências técnicas.',500);
    this.className=clean(input.className || '',80);
    this.classroomUrl=clean(input.classroomUrl || '',500);
    this.teacherCode=clean(input.teacherCode || makeCode(this.title),12).toUpperCase();
    this.checkpoints=(input.checkpoints ?? []).map((item,index)=>({
      id:clean(item.id || `checkpoint-${index+1}`,80).replace(/[^a-zA-Z0-9_-]/g,'-'),
      title:clean(item.title || `Checkpoint ${index+1}`,120),
      evidence:clean(item.evidence || 'Registro da atividade.',300),
      order:index+1
    }));
    this.createdAt=input.createdAt || new Date().toISOString();
    this.updatedAt=new Date().toISOString();
    this.validate();
  }
  validate(){
    const errors=[];
    if(this.title.length<4)errors.push('O título deve possuir pelo menos 4 caracteres.');
    if(!MISSION_MODULES.some(item=>item.id===this.moduleId))errors.push('Selecione um módulo disponível.');
    if(!Number.isFinite(this.durationMinutes)||this.durationMinutes<25||this.durationMinutes>180)errors.push('A duração deve ficar entre 25 e 180 minutos.');
    if(this.checkpoints.length<3||this.checkpoints.length>10)errors.push('A missão deve possuir de 3 a 10 checkpoints.');
    if(new Set(this.checkpoints.map(item=>item.id)).size!==this.checkpoints.length)errors.push('IDs de checkpoint devem ser únicos.');
    if(this.classroomUrl && (!/^https:\/\//i.test(this.classroomUrl)||this.classroomUrl.length>500))errors.push('O link do Classroom deve usar HTTPS.');
    if(!validCode(this.teacherCode))errors.push('O código do professor deve ter 4 a 12 caracteres, usando letras, números ou hífen.');
    if(errors.length)throw new Error(errors.join(' '));
    return true;
  }
  toJSON(){return {
    schema:this.schema,id:this.id,title:this.title,moduleId:this.moduleId,durationMinutes:this.durationMinutes,
    difficulty:this.difficulty,objective:this.objective,className:this.className,classroomUrl:this.classroomUrl,
    teacherCode:this.teacherCode,checkpoints:this.checkpoints.map(item=>({...item})),createdAt:this.createdAt,updatedAt:this.updatedAt
  };}
  clone(patch={}){return new MissionPlan({...this.toJSON(),...patch,id:patch.id??this.id});}
  static fromTemplate(template,patch={}){return new MissionPlan({...template,...patch,id:patch.id||`${template.id}-${Date.now()}`});}
  static fromJSON(data){if(data?.schema && data.schema!=='cosmos-ds-mission-plan-v1')throw new Error('Formato de missão incompatível.');return new MissionPlan(data);}
  static generateCode(seed){return makeCode(seed);}
}
