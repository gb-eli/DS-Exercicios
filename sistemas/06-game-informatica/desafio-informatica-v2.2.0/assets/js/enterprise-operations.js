const clone=value=>JSON.parse(JSON.stringify(value));
const iso=()=>new Date().toISOString();
const clean=value=>String(value??'').replace(/[<>]/g,'').trim();
const uid=(prefix='ops')=>`${prefix}-${Math.random().toString(36).slice(2,10)}`;

export const ENTERPRISE_OPERATIONS_VERSION=1;

function normalizePriority(item={},index=0){
  return {id:clean(item.id||`priority-${index+1}`),label:clean(item.label||`Demanda ${index+1}`),detail:clean(item.detail||''),urgency:Math.max(1,Math.min(5,Number(item.urgency)||1)),impact:Math.max(1,Math.min(5,Number(item.impact)||1)),dueMinutes:Math.max(0,Number(item.dueMinutes)||0),status:clean(item.status||'pending'),selectedAt:item.selectedAt||null};
}
function normalizeIncident(item={},index=0){
  return {id:clean(item.id||`incident-${index+1}`),kind:clean(item.kind||'privacy'),title:clean(item.title||'Incidente operacional'),detail:clean(item.detail||''),severity:clean(item.severity||'medium'),status:clean(item.status||'open'),createdAt:item.createdAt||iso(),resolvedAt:item.resolvedAt||null,resolution:clean(item.resolution||''),acceptedStrategies:Array.isArray(item.acceptedStrategies)?item.acceptedStrategies.map(clean):[],fileId:clean(item.fileId||''),recipient:clean(item.recipient||'')};
}
function normalizeStrategy(item={},index=0){
  return {id:clean(item.id||`strategy-${index+1}`),label:clean(item.label||`Alternativa ${index+1}`),detail:clean(item.detail||''),accepted:item.accepted!==false,tradeoff:clean(item.tradeoff||''),selectedAt:item.selectedAt||null};
}

export function createInitialOperationsState(config={}){
  return {version:ENTERPRISE_OPERATIONS_VERSION,startedAt:iso(),deadlineMinutes:Math.max(1,Number(config.deadlineMinutes)||25),priorityDecision:'',strategyDecision:'',priorities:(config.priorities||[]).map(normalizePriority),incidents:(config.incidents||[]).map(normalizeIncident),strategies:(config.strategies||[]).map(normalizeStrategy),history:[{at:iso(),action:'operations-opened',detail:'Central de riscos e prioridades iniciada'}]};
}
export function normalizeOperationsState(saved,config={}){
  const base=createInitialOperationsState(config),state={...base,...clone(saved||{})};
  state.deadlineMinutes=Math.max(1,Number(state.deadlineMinutes)||base.deadlineMinutes);
  state.priorities=Array.isArray(state.priorities)?state.priorities.map(normalizePriority):base.priorities;
  state.incidents=Array.isArray(state.incidents)?state.incidents.map(normalizeIncident):base.incidents;
  state.strategies=Array.isArray(state.strategies)?state.strategies.map(normalizeStrategy):base.strategies;
  state.history=Array.isArray(state.history)?state.history:base.history;
  return state;
}

export class EnterpriseOperations{
  constructor(config={},saved=null){this.config=config;this.state=normalizeOperationsState(saved,config)}
  serialize(){return clone(this.state)}
  #history(action,detail=''){this.state.history.push({at:iso(),action,detail});this.state.history=this.state.history.slice(-220)}
  elapsedMinutes(activeSeconds=0){return Math.max(0,Math.floor(Number(activeSeconds)||0)/60)}
  deadlineStatus(activeSeconds=0){const elapsed=this.elapsedMinutes(activeSeconds),remaining=Math.max(0,this.state.deadlineMinutes-elapsed);return {elapsed,remaining,ratio:Math.min(1,elapsed/this.state.deadlineMinutes),status:remaining<=0?'expired':remaining<=5?'critical':remaining<=10?'attention':'on-track'}}
  priorityScore(item){return Number(item.urgency)*2+Number(item.impact)+(item.dueMinutes>0&&item.dueMinutes<=10?3:item.dueMinutes<=20?1:0)}
  recommendedPriorities(){const scored=this.state.priorities.filter(item=>item.status==='pending').map(item=>({...item,score:this.priorityScore(item)}));const max=Math.max(0,...scored.map(item=>item.score));return scored.filter(item=>item.score===max)}
  choosePriority(id){const item=this.state.priorities.find(entry=>entry.id===id);if(!item)return {ok:false,reason:'Demanda não encontrada.'};const acceptedIds=Array.isArray(this.config.acceptedPriorityIds)&&this.config.acceptedPriorityIds.length?this.config.acceptedPriorityIds:this.recommendedPriorities().map(entry=>entry.id);if(!acceptedIds.includes(id))return {ok:false,reason:'Essa demanda pode ser importante, mas outra combinação de prazo e impacto exige atendimento primeiro.',item:clone(item)};this.state.priorityDecision=id;item.status='selected';item.selectedAt=iso();this.#history('priority-selected',`${item.label} · urgência ${item.urgency} · impacto ${item.impact}`);return {ok:true,item:clone(item),alternatives:acceptedIds.length}}
  addIncident(data={}){const incident=normalizeIncident({...data,id:data.id||uid('incident'),createdAt:iso()},this.state.incidents.length);const existing=this.state.incidents.find(item=>item.id===incident.id&&item.status==='open');if(existing)return clone(existing);this.state.incidents.push(incident);this.#history('incident-created',`${incident.kind} · ${incident.title}`);return clone(incident)}
  openIncidents(){return this.state.incidents.filter(item=>item.status==='open')}
  resolveIncident(id,strategy){const incident=this.state.incidents.find(item=>item.id===id);if(!incident||incident.status!=='open')return {ok:false,reason:'Incidente não encontrado ou já resolvido.'};const accepted=incident.acceptedStrategies.length?incident.acceptedStrategies:(this.config.acceptedIncidentStrategies||[]);if(accepted.length&&!accepted.includes(strategy))return {ok:false,reason:'A resposta escolhida não contém o risco de forma suficiente.',incident:clone(incident)};incident.status='resolved';incident.resolution=clean(strategy);incident.resolvedAt=iso();this.#history('incident-resolved',`${incident.title} · ${strategy}`);return {ok:true,incident:clone(incident),alternatives:accepted.length}}
  chooseStrategy(id){const strategy=this.state.strategies.find(item=>item.id===id);if(!strategy)return {ok:false,reason:'Estratégia não encontrada.'};if(!strategy.accepted)return {ok:false,reason:'A estratégia gera risco desnecessário ou não atende ao briefing.',strategy:clone(strategy)};this.state.strategyDecision=id;strategy.selectedAt=iso();this.#history('strategy-selected',`${strategy.label} · ${strategy.tradeoff}`);return {ok:true,strategy:clone(strategy),acceptedAlternatives:this.state.strategies.filter(item=>item.accepted).length}}
  ready({requiredIncidents=true,requirePriority=true,requireStrategy=false}={}){const issues=[];if(requirePriority&&this.state.priorities.length&&!this.state.priorityDecision)issues.push('A prioridade principal ainda não foi definida.');if(requiredIncidents&&this.openIncidents().length)issues.push('Existem incidentes operacionais sem tratamento.');if(requireStrategy&&this.state.strategies.length&&!this.state.strategyDecision)issues.push('A estratégia de execução ainda não foi registrada.');return {ready:issues.length===0,issues}}
  metrics(){return {priorities:this.state.priorities.length,prioritySelected:Boolean(this.state.priorityDecision),openIncidents:this.openIncidents().length,resolvedIncidents:this.state.incidents.filter(item=>item.status==='resolved').length,strategySelected:Boolean(this.state.strategyDecision),history:this.state.history.length}}
}
