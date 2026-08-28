const clone=value=>JSON.parse(JSON.stringify(value));

export const ENTERPRISE_WORKFLOW_VERSION=1;

export function normalizeEnterpriseTasks(tasks=[]){
  return tasks.map((task,index)=>({
    id:String(task.id||task.action||`task-${index+1}`),
    requires:Array.isArray(task.requires)?[...new Set(task.requires.map(String))]:[],
    optional:Boolean(task.optional),
    ...clone(task)
  }));
}

export function createEnterpriseWorkflow(tasks=[],saved={}){
  const normalized=normalizeEnterpriseTasks(tasks);
  const validIds=new Set(normalized.map(task=>task.id));
  const legacyApplied=new Set(Array.isArray(saved.applied)?saved.applied.map(String):[]);
  const completed=new Set(
    (Array.isArray(saved.completedTaskIds)?saved.completedTaskIds:normalized.filter(task=>legacyApplied.has(task.action)).map(task=>task.id))
      .map(String)
      .filter(id=>validIds.has(id))
  );
  return {
    version:ENTERPRISE_WORKFLOW_VERSION,
    tasks:normalized,
    completed,
    attemptsByTask:{...(saved.attemptsByTask||{})},
    explorations:Number(saved.explorations)||0,
    blockedAttempts:Number(saved.blockedAttempts)||0
  };
}

export function taskStatus(workflow,taskOrId){
  const task=typeof taskOrId==='string'?workflow.tasks.find(item=>item.id===taskOrId):taskOrId;
  if(!task)return 'unknown';
  if(workflow.completed.has(task.id))return 'completed';
  return task.requires.every(id=>workflow.completed.has(id))?'available':'blocked';
}

export function availableTasks(workflow){return workflow.tasks.filter(task=>taskStatus(workflow,task)==='available')}
export function blockedTasks(workflow){return workflow.tasks.filter(task=>taskStatus(workflow,task)==='blocked')}
export function completedTasks(workflow){return workflow.tasks.filter(task=>taskStatus(workflow,task)==='completed')}
export function requiredTasks(workflow){return workflow.tasks.filter(task=>!task.optional)}
export function workflowComplete(workflow){return requiredTasks(workflow).every(task=>workflow.completed.has(task.id))}

export function taskByAction(workflow,action){return workflow.tasks.find(task=>task.action===action)||null}
export function missingRequirements(workflow,taskOrId){
  const task=typeof taskOrId==='string'?workflow.tasks.find(item=>item.id===taskOrId):taskOrId;
  if(!task)return [];
  return task.requires.filter(id=>!workflow.completed.has(id)).map(id=>workflow.tasks.find(item=>item.id===id)).filter(Boolean);
}

export function resolveEnterpriseAction(workflow,action){
  const task=taskByAction(workflow,action);
  if(!task)return {kind:'exploration',task:null,missing:[]};
  const status=taskStatus(workflow,task);
  if(status==='completed')return {kind:'repeat',task,missing:[]};
  if(status==='blocked')return {kind:'blocked',task,missing:missingRequirements(workflow,task)};
  return {kind:'available',task,missing:[]};
}

export function completeEnterpriseTask(workflow,taskOrId){
  const task=typeof taskOrId==='string'?workflow.tasks.find(item=>item.id===taskOrId):taskOrId;
  if(!task||taskStatus(workflow,task)!=='available')return false;
  workflow.completed.add(task.id);
  return true;
}

export function registerEnterpriseAttempt(workflow,taskOrId){
  const task=typeof taskOrId==='string'?workflow.tasks.find(item=>item.id===taskOrId):taskOrId;
  if(!task)return;
  workflow.attemptsByTask[task.id]=(Number(workflow.attemptsByTask[task.id])||0)+1;
}

export function serializeEnterpriseWorkflow(workflow){
  return {
    version:ENTERPRISE_WORKFLOW_VERSION,
    completedTaskIds:[...workflow.completed],
    attemptsByTask:{...workflow.attemptsByTask},
    explorations:Number(workflow.explorations)||0,
    blockedAttempts:Number(workflow.blockedAttempts)||0
  };
}
