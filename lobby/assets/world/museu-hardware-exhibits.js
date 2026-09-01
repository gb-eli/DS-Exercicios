const DEVICE_PROFILES=Object.freeze({
  mainframe:Object.freeze({body:[5.8,4.2,1.5],screen:[2.4,1.5],details:'panel'}),
  'home-computer':Object.freeze({body:[4.4,1.1,2.3],screen:[2.8,2.1],details:'keyboard'}),
  'early-console':Object.freeze({body:[4.5,.75,2.4],screen:[0,0],details:'paddles'}),
  'cartridge-console':Object.freeze({body:[4.2,.8,2.4],screen:[0,0],details:'cartridge'}),
  'disc-console':Object.freeze({body:[4.4,.68,3],screen:[0,0],details:'disc'}),
  'arcade-cabinet':Object.freeze({body:[3.4,6.2,3.1],screen:[2.4,1.8],details:'arcade'}),
  handheld:Object.freeze({body:[4.2,2.4,.7],screen:[2.2,1.35],details:'buttons'}),
  'retro-pc':Object.freeze({body:[3.2,3.1,2.7],screen:[2.25,1.6],details:'keyboard'}),
  'gaming-pc':Object.freeze({body:[3.2,5.5,2.8],screen:[0,0],details:'tower'}),
  'current-console':Object.freeze({body:[2.4,6.3,2.4],screen:[0,0],details:'controller'})
});
export function museumHardwareDeviceProfile(kind){return DEVICE_PROFILES[kind]||DEVICE_PROFILES['current-console'];}

export function drawMuseumDemo2D(ctx,{demo='platform',accent='#72e6ff',t=0,x=0,y=0,w=160,h=90}={}){
  ctx.save();ctx.translate(x,y);ctx.beginPath();ctx.rect(0,0,w,h);ctx.clip();ctx.fillStyle='#061017';ctx.fillRect(0,0,w,h);
  const pulse=.5+.5*Math.sin(t*2.2);ctx.globalAlpha=.18+.08*pulse;ctx.fillStyle=accent;ctx.fillRect(0,0,w,h);ctx.globalAlpha=1;
  const px=Math.max(2,Math.round(w/80));
  if(demo==='terminal'){
    ctx.fillStyle='#8cff9a';ctx.font=`${Math.max(6,px*3)}px monospace`;for(let i=0;i<7;i++){const s=`${String(i+1).padStart(2,'0')}  LOAD 0x${((t*90+i*713)|0).toString(16).padStart(4,'0')}`;ctx.fillText(s,8,14+i*11);}ctx.fillRect(8,77,(t*22)%110,2);
  }else if(demo==='pong'){
    ctx.fillStyle='#eafcff';ctx.fillRect(10,26+Math.sin(t*1.9)*18,4,28);ctx.fillRect(w-14,32+Math.cos(t*2.1)*16,4,28);ctx.beginPath();ctx.arc(w/2+Math.sin(t*2.8)*w*.34,h/2+Math.cos(t*2.2)*h*.28,4,0,Math.PI*2);ctx.fill();ctx.setLineDash([3,5]);ctx.strokeStyle='rgba(255,255,255,.35)';ctx.beginPath();ctx.moveTo(w/2,0);ctx.lineTo(w/2,h);ctx.stroke();
  }else if(demo==='platform'||demo==='handheld'){
    ctx.fillStyle='#173b61';ctx.fillRect(0,h*.72,w,h*.28);ctx.fillStyle='#57d889';for(let i=0;i<5;i++){const bx=(i*43-(t*20)%43)-10;ctx.fillRect(bx,h*.55,28,8);}ctx.fillStyle='#ffe270';const heroX=w*.36,heroY=h*.48-Math.abs(Math.sin(t*3.2))*18;ctx.fillRect(heroX,heroY,10,14);ctx.fillStyle='#ffffff';ctx.fillRect(heroX+6,heroY+3,2,2);
  }else if(demo==='maze'||demo==='desktop'){
    ctx.strokeStyle=accent;ctx.lineWidth=2;for(let i=0;i<6;i++){ctx.strokeRect(8+i*17,8+(i%2)*9,32,h-18-i*4);}ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(20+((t*26)%(w-40)),h*.56,4,0,Math.PI*2);ctx.fill();
  }else if(demo==='fighter'){
    ctx.fillStyle='#251b3b';ctx.fillRect(0,h*.7,w,h*.3);ctx.fillStyle='#ffcf6e';ctx.fillRect(28,h*.42,14,28);ctx.fillStyle='#77d3ff';ctx.fillRect(w-44,h*.42,14,28);ctx.fillStyle='#ff6b6b';ctx.fillRect(12,8,58,5);ctx.fillStyle='#5eead4';ctx.fillRect(w-70,8,58,5);ctx.fillStyle='#fff';ctx.font='bold 10px sans-serif';ctx.fillText('ROUND',w/2-18,18);
  }else if(demo==='shooter'||demo==='fps'){
    ctx.strokeStyle='rgba(255,255,255,.55)';ctx.beginPath();ctx.moveTo(w/2-10,h/2);ctx.lineTo(w/2+10,h/2);ctx.moveTo(w/2,h/2-10);ctx.lineTo(w/2,h/2+10);ctx.stroke();for(let i=0;i<7;i++){const r=12+i*11+Math.sin(t+i)*4;ctx.strokeStyle=i%2?accent:'rgba(255,255,255,.18)';ctx.strokeRect(w/2-r,h/2-r*.45,r*2,r*.9);}ctx.fillStyle='#ffcf6e';ctx.fillRect(w*.47,h*.72,10,18);
  }else{
    ctx.fillStyle='#2d4d66';for(let i=0;i<7;i++){const xx=(i*41-(t*16)%41)-20,hh=12+(i%4)*8;ctx.fillRect(xx,h-hh,30,hh);}ctx.fillStyle=accent;ctx.beginPath();ctx.arc(w*.52+Math.sin(t)*18,h*.48+Math.cos(t*.8)*9,7,0,Math.PI*2);ctx.fill();
  }
  ctx.strokeStyle='rgba(255,255,255,.16)';ctx.lineWidth=1;for(let yy=2;yy<h;yy+=4){ctx.beginPath();ctx.moveTo(0,yy);ctx.lineTo(w,yy);ctx.stroke();}
  ctx.restore();
}

export function createMuseumDemoCanvas({width=384,height=216}={}){const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;return canvas;}
