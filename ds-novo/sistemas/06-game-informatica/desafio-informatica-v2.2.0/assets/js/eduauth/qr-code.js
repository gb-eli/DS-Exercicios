import QRCode from './vendor/qr/index.js';
import QRErrorCorrectLevel from './vendor/qr/QRErrorCorrectLevel.js';

export function renderQrToCanvas(canvas,text,{size=248,margin=4}={}){
  const qr=new QRCode(-1,QRErrorCorrectLevel.M);
  qr.addData(String(text));
  qr.make();
  const modules=qr.getModuleCount();
  const total=modules+margin*2;
  const scale=Math.max(2,Math.floor(size/total));
  const px=total*scale;
  canvas.width=px;canvas.height=px;
  canvas.style.width=`${Math.min(size,px)}px`;
  canvas.style.height=`${Math.min(size,px)}px`;
  const ctx=canvas.getContext('2d');
  ctx.imageSmoothingEnabled=false;
  ctx.fillStyle='#fff';ctx.fillRect(0,0,px,px);
  ctx.fillStyle='#000';
  for(let row=0;row<modules;row++)for(let col=0;col<modules;col++){
    if(qr.isDark(row,col))ctx.fillRect((col+margin)*scale,(row+margin)*scale,scale,scale);
  }
  return {modules,size:px};
}
