function lerp(a,b,t){return a+(b-a)*t;}
function norm(q){const l=Math.hypot(...q)||1;return q.map(v=>v/l);}
function slerp(a,b,t){let dot=a.reduce((s,v,i)=>s+v*b[i],0),bb=[...b];if(dot<0){dot=-dot;bb=bb.map(v=>-v);}if(dot>.9995)return norm(a.map((v,i)=>lerp(v,bb[i],t)));const theta=Math.acos(Math.min(1,dot)),s=Math.sin(theta);return a.map((v,i)=>(Math.sin((1-t)*theta)*v+Math.sin(t*theta)*bb[i])/s);}
function sample(channel,time){const ts=channel.times,values=channel.values,w=channel.width;if(ts.length===1)return Array.from(values.slice(0,w));let i=0;while(i<ts.length-2&&time>ts[i+1])i++;const span=Math.max(.00001,ts[i+1]-ts[i]),t=Math.max(0,Math.min(1,(time-ts[i])/span)),a=Array.from(values.slice(i*w,i*w+w)),b=Array.from(values.slice((i+1)*w,(i+2)*w));return channel.path==='rotation'?slerp(a,b,t):a.map((v,j)=>lerp(v,b[j],t));}
export class GltfAnimationPlayer{
 constructor(scene){this.scene=scene;this.clip=null;this.time=0;this.playing=false;this.speed=1;this.loop=true;}
 list(){return this.scene.animations.map(a=>({name:a.name,duration:a.duration,loop:a.loop,channels:a.channels.length}));}
 play(name,{loop,speed=1,restart=true}={}){const clip=this.scene.animations.find(a=>a.name===name);if(!clip)return false;this.clip=clip;this.loop=loop??clip.loop;this.speed=speed;if(restart)this.time=0;this.playing=true;return true;}
 pause(){this.playing=false;}
 stop(){this.playing=false;this.time=0;this.clip=null;}
 update(dt){if(this.clip&&this.playing){this.time+=dt*this.speed;if(this.clip.duration>0&&this.time>this.clip.duration){if(this.loop)this.time%=this.clip.duration;else{this.time=this.clip.duration;this.playing=false;}}}const overrides=new Map();if(!this.clip)return overrides;const t=this.clip.duration?Math.min(this.time,this.clip.duration):0;for(const ch of this.clip.channels){const item=overrides.get(ch.node)||{};item[ch.path]=sample(ch,t);overrides.set(ch.node,item);}return overrides;}
 get state(){return{clip:this.clip?.name||null,time:this.time,playing:this.playing,loop:this.loop,speed:this.speed};}
}
