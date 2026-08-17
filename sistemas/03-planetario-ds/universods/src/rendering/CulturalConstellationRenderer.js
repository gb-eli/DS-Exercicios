const TAU=Math.PI*2;
const palette={organization:'#5ee3ff',career:'#7af0bc',work:'#c8a8ff'};
export class CulturalConstellationRenderer {
  constructor({canvas,reducedMotion=false,onSelect=null}={}){this.canvas=canvas;this.ctx=canvas?.getContext('2d');this.reducedMotion=reducedMotion;this.onSelect=onSelect;this.items=[];this.selected=null;this.raf=0;this.time=0;this.pointer=this.pointer.bind(this);this.resize=this.resize.bind(this);}
  getProfile(){return {id:'culture-2d',label:'Canvas cultural'};}
  start(items=[]){if(!this.ctx)return;this.items=items.slice(0,36);this.canvas.addEventListener('pointerdown',this.pointer);addEventListener('resize',this.resize,{passive:true});this.resize();this.loop();}
  setItems(items=[]){this.items=items.slice(0,36);}
  setSelected(key){this.selected=key;}
  resize(){if(!this.canvas)return;const rect=this.canvas.getBoundingClientRect(),dpr=Math.min(2,devicePixelRatio||1);this.canvas.width=Math.max(1,Math.floor(rect.width*dpr));this.canvas.height=Math.max(1,Math.floor(rect.height*dpr));this.ctx.setTransform(dpr,0,0,dpr,0,0);}
  positions(){const w=this.canvas.clientWidth,h=this.canvas.clientHeight,cx=w*.5,cy=h*.5,base=Math.min(w,h)*.16;return this.items.map((item,index)=>{const ring=index%3,slot=Math.floor(index/3),count=Math.ceil(this.items.length/3),angle=(slot/Math.max(1,count))*TAU+ring*.72+(this.reducedMotion?0:this.time*.00004*(ring%2?1:-1));const radius=base+(ring+1)*Math.min(w,h)*.095;return {...item,x:cx+Math.cos(angle)*radius,y:cy+Math.sin(angle)*radius,r:item.entityType==='work'?7:9,key:`${item.entityType}:${item.id}`};});}
  pointer(event){const rect=this.canvas.getBoundingClientRect(),x=event.clientX-rect.left,y=event.clientY-rect.top;const hit=this.positions().find(item=>Math.hypot(item.x-x,item.y-y)<18);if(hit)this.onSelect?.(hit.entityType,hit.id);}
  loop(time=0){this.time=time;this.draw();this.raf=requestAnimationFrame(t=>this.loop(t));}
  draw(){const ctx=this.ctx,w=this.canvas.clientWidth,h=this.canvas.clientHeight;if(!w||!h)return;ctx.clearRect(0,0,w,h);const grad=ctx.createRadialGradient(w*.5,h*.46,10,w*.5,h*.5,Math.max(w,h)*.68);grad.addColorStop(0,'rgba(45,80,130,.24)');grad.addColorStop(.45,'rgba(12,23,52,.56)');grad.addColorStop(1,'rgba(2,5,15,.96)');ctx.fillStyle=grad;ctx.fillRect(0,0,w,h);
    const seed=Math.floor(w+h);for(let i=0;i<80;i++){const x=(i*97+seed*13)%w,y=(i*53+seed*7)%h,a=.14+((i*17)%55)/100;ctx.fillStyle=`rgba(220,240,255,${a})`;ctx.fillRect(x,y,i%9===0?2:1,i%9===0?2:1);}
    const points=this.positions(),cx=w*.5,cy=h*.5;ctx.strokeStyle='rgba(108,190,255,.10)';ctx.lineWidth=1;for(let ring=0;ring<3;ring++){ctx.beginPath();ctx.arc(cx,cy,Math.min(w,h)*(.255+ring*.095),0,TAU);ctx.stroke();}
    for(const point of points){ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(point.x,point.y);ctx.strokeStyle='rgba(125,190,255,.065)';ctx.stroke();}
    const pulse=this.reducedMotion?1:.86+Math.sin(this.time*.002)*.14;ctx.beginPath();ctx.arc(cx,cy,23*pulse,0,TAU);ctx.fillStyle='rgba(255,205,105,.16)';ctx.fill();ctx.strokeStyle='rgba(255,218,130,.75)';ctx.stroke();ctx.fillStyle='#fff4ca';ctx.font='700 12px system-ui';ctx.textAlign='center';ctx.fillText('CULTURA',cx,cy+4);
    for(const point of points){const selected=point.key===this.selected;colorPoint(ctx,point,selected);}
  }
  destroy(){cancelAnimationFrame(this.raf);this.canvas?.removeEventListener('pointerdown',this.pointer);removeEventListener('resize',this.resize);this.items=[];this.ctx=null;}
}
function colorPoint(ctx,point,selected){const color=palette[point.entityType]||'#fff';ctx.beginPath();ctx.arc(point.x,point.y,point.r+(selected?5:0),0,TAU);ctx.fillStyle=selected?color:`${color}cc`;ctx.shadowColor=color;ctx.shadowBlur=selected?18:7;ctx.fill();ctx.shadowBlur=0;if(selected){ctx.strokeStyle='#fff';ctx.lineWidth=1.5;ctx.stroke();}ctx.fillStyle='rgba(235,245,255,.9)';ctx.font=`${selected?'700':'600'} 10px system-ui`;ctx.textAlign='center';ctx.fillText((point.name||point.title||'').slice(0,18),point.x,point.y+point.r+16);}
