const ACTION_CLIPS={open:'Open',close:'Close',deploy:'Deploy',retract:'Retract',rotate:'Scan',scan:'Scan',wave:'Wave',point:'Point',capture:'Capture',separate:'Separation',gimbal:'Gimbal'};
export class InteriorInteractionSystem{
 constructor(scene){this.scene=scene;this.active=null;this.history=[];}
 list(){return(this.scene?.interactions||[]).map((item,index)=>{const node=this.scene.nodes[item.node];return{...item,index,label:node?.extras?.label||node?.name||item.name,description:node?.extras?.description||this.describe(item.action),camera:node?.extras?.camera||null,audio:node?.extras?.audio||this.audioFor(item.action)};});}
 describe(action){const text=String(action||'inspect').replace(/[-_]/g,' ');return `Componente interativo: ${text}.`;}
 audioFor(action){const value=String(action||'');if(/open|close|hatch|door|gear|separate/i.test(value))return'latch';if(/wheel|motor|gimbal|rotate|scan|deploy/i.test(value))return'motor';return'servo';}
 resolveClip(action,available=[]){const wanted=ACTION_CLIPS[String(action||'').split(/[-_:]/)[0]]||String(action||'');return available.find(name=>name.toLowerCase().includes(wanted.toLowerCase()))||available.find(name=>name.toLowerCase().includes(String(action||'').toLowerCase()))||available[0]||null;}
 activate(index){const item=this.list()[index];if(!item)return null;this.active=item;this.history.push({node:item.node,action:item.action,at:Date.now()});if(this.history.length>40)this.history.shift();return item;}
 clear(){this.active=null;}
}
