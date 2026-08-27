const priorities={critical:0,high:1,normal:2,low:3};

export class MarsCommandQueue {
  constructor({oneWaySeconds=4,maxSize=24,packetLoss=0}={}){
    this.oneWaySeconds=oneWaySeconds;this.maxSize=maxSize;this.packetLoss=packetLoss;this.items=[];this.acks=[];this.seen=new Set();this.sequence=0;
  }
  configure({oneWaySeconds=this.oneWaySeconds,packetLoss=this.packetLoss}={}){this.oneWaySeconds=Math.max(0,Number(oneWaySeconds)||0);this.packetLoss=Math.min(.8,Math.max(0,Number(packetLoss)||0));}
  enqueue(command,now=0,priority='normal'){
    const id=command.id??`CMD-${String(++this.sequence).padStart(4,'0')}`;
    if(this.seen.has(id)||this.items.some(item=>item.id===id))return {accepted:false,id,reason:'Comando duplicado.'};
    if(this.items.length>=this.maxSize){
      const worst=this.items.reduce((a,b)=>(priorities[a.priority]??2)>(priorities[b.priority]??2)?a:b);
      if((priorities[priority]??2)>=(priorities[worst.priority]??2))return {accepted:false,id,reason:'Fila cheia; comando sem prioridade suficiente.'};
      this.items.splice(this.items.indexOf(worst),1);
    }
    const item={...structuredClone(command),id,priority,sentAt:now,deliverAt:now+this.oneWaySeconds,status:'in-transit',attempt:command.attempt??1};
    this.items.push(item);this.items.sort((a,b)=>(priorities[a.priority]-priorities[b.priority])||a.deliverAt-b.deliverAt);return {accepted:true,id,item:structuredClone(item)};
  }
  due(now,random=Math.random){
    const due=[],remaining=[];
    for(const item of this.items){
      if(item.deliverAt>now){remaining.push(item);continue;}
      if(random()<this.packetLoss){this.acks.push({id:item.id,status:'lost',time:now,attempt:item.attempt});continue;}
      this.seen.add(item.id);due.push({...item,status:'delivered'});this.acks.push({id:item.id,status:'ack',time:now+this.oneWaySeconds,attempt:item.attempt});
    }
    this.items=remaining;return due;
  }
  retry(id,command,now=0,priority='normal'){
    if(this.seen.has(id))return {accepted:false,id,reason:'Comando já executado; repetição idempotente ignorada.'};
    this.items=this.items.filter(item=>item.id!==id);return this.enqueue({...command,id,attempt:(command.attempt??1)+1},now,priority);
  }
  snapshot(){return {oneWaySeconds:this.oneWaySeconds,packetLoss:this.packetLoss,size:this.items.length,maxSize:this.maxSize,items:structuredClone(this.items),acks:structuredClone(this.acks.slice(-20))};}
  clear(){this.items=[];this.acks=[];this.seen.clear();}
}
