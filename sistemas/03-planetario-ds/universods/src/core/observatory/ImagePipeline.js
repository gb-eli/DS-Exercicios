const clamp=(v,min=0,max=1)=>Math.max(min,Math.min(max,v));
const hash=(x,y,seed)=>{let n=(x*374761393+y*668265263+seed*1442695040888963407)%2147483647;n=(n^(n>>13))*1274126177;return ((n^(n>>16))>>>0)/4294967295;};

export class ImagePipeline {
  constructor({size=48}={}){this.size=Math.max(16,Math.min(96,size));}
  generate({scene='nebula',exposure=60,noise=0.18,calibration=true,channels=['R','G','B'],seed=17}={}){
    const size=this.size,data=new Float32Array(size*size*3);let sum=0,max=0;
    for(let y=0;y<size;y++)for(let x=0;x<size;x++){
      const u=(x/(size-1))*2-1,v=(y/(size-1))*2-1;const r=Math.hypot(u,v);let signal=0;
      if(scene==='galaxy'||scene==='deep'){const a=Math.atan2(v,u)+r*7;signal=Math.exp(-r*2.8)*(.72+.28*Math.cos(a*2))+Math.exp(-r*r*34)*1.6;}
      else if(scene==='pulsar'){signal=Math.exp(-r*r*100)*2.2+Math.exp(-Math.abs(v)*45)*.28;}
      else if(scene==='supernova'){signal=Math.exp(-Math.abs(r-.45)*26)*1.2+Math.exp(-r*r*28)*.45;}
      else if(scene==='blackhole'){signal=Math.exp(-Math.abs(r-.3)*34)*1.55*(.7+.3*Math.cos(Math.atan2(v,u)*3));if(r<.13)signal*=.05;}
      else if(scene==='exoplanet'){signal=Math.exp(-((u+.2)**2+(v+.05)**2)*120)*1.8+Math.exp(-((u-.28)**2+(v-.1)**2)*640)*.45;}
      else {const cloud=Math.sin(u*4.2+Math.sin(v*3.3))*Math.cos(v*5.1-u*1.8);signal=Math.max(0,cloud*.35+.38)*Math.exp(-r*1.35)+Math.exp(-((u-.25)**2+(v+.12)**2)*32);}
      const gain=Math.log2(1+Math.max(1,exposure))/6;const n=(hash(x,y,seed)-.5)*noise;let luminance=signal*gain+n;
      if(calibration)luminance=(luminance-noise*.08)*1.08;
      luminance=clamp(luminance);
      const palette=scene==='nebula'||scene==='supernova'?[1.0,.38,.72]:scene==='galaxy'||scene==='deep'?[.72,.8,1.0]:scene==='blackhole'?[1,.58,.2]:scene==='pulsar'?[.35,.78,1]:[.8,.88,1];
      const idx=(y*size+x)*3;for(let c=0;c<3;c++){const enabled=channels.includes(['R','G','B'][c])||channels.includes('L')||channels.includes('IR')||channels.includes('X');const value=enabled?clamp(luminance*palette[c]):0;data[idx+c]=value;sum+=value;max=Math.max(max,value);}
    }
    const mean=sum/data.length;let variance=0;for(const value of data)variance+=(value-mean)**2;variance/=data.length;const snr=mean/Math.max(.001,Math.sqrt(variance)*noise+.006);
    return {size,data:Array.from(data),stats:{mean:Number(mean.toFixed(4)),max:Number(max.toFixed(4)),snr:Number(snr.toFixed(2)),dynamicRange:Number((max/Math.max(.001,mean)).toFixed(2)),pixels:size*size,calibrated:calibration}};
  }
  toRgba(frame,{contrast=1.15,gamma=.86}={}){const out=new Uint8ClampedArray(frame.size*frame.size*4);for(let i=0,j=0;i<frame.data.length;i+=3,j+=4){for(let c=0;c<3;c++){let v=(frame.data[i+c]-.5)*contrast+.5;v=Math.pow(clamp(v),gamma);out[j+c]=Math.round(v*255);}out[j+3]=255;}return out;}
}
