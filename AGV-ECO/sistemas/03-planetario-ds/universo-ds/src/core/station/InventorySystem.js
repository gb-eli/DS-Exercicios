import { INITIAL_INVENTORY, MAINTENANCE_TASKS } from '../../data/stationSystems.js';

export class InventorySystem {
  constructor(items=INITIAL_INVENTORY){this.items=items.map(item=>({...item}));this.completed=[];this.log=[];}
  list(){return this.items.map(item=>({...item,status:item.quantity<item.minimum?'LOW':'OK'}));}
  consume(id,quantity=1){const item=this.items.find(entry=>entry.id===id);if(!item)return {ok:false,reason:'Item não encontrado.'};if(item.quantity<quantity)return {ok:false,reason:`Estoque insuficiente de ${item.label}.`};item.quantity-=quantity;return {ok:true,item:{...item}};}
  restock(id,quantity=1){const item=this.items.find(entry=>entry.id===id);if(!item)return false;item.quantity+=Math.max(0,Math.round(quantity));return true;}
  completeTask(id){const task=MAINTENANCE_TASKS.find(item=>item.id===id);if(!task)return {ok:false,reason:'Tarefa desconhecida.'};if(this.completed.includes(id))return {ok:false,reason:'Tarefa já registrada.'};const result=this.consume(task.item,task.quantity);if(!result.ok)return result;this.completed.push(id);this.log.push({id,time:new Date().toISOString(),label:task.label,item:task.item});return {ok:true,task,item:result.item};}
  snapshot(){return {items:this.list(),completed:[...this.completed],log:[...this.log],lowStock:this.list().filter(item=>item.status==='LOW').length};}
  export(){return JSON.stringify({schema:'cosmos-ds-station-logistics-v1',createdAt:new Date().toISOString(),...this.snapshot()},null,2);}
}
