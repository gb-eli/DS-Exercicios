export const WORLD_WEATHER_TYPES=Object.freeze(['clear','rain','snow','storm']);
export const WORLD_WEATHER_INTENSITIES=Object.freeze(['light','normal','strong']);
const INTENSITY_VALUE=Object.freeze({light:.38,normal:.68,strong:1});
const WEATHER_META=Object.freeze({
  clear:{label:'Limpo',icon:'☀️',precipitation:'none',cloudCover:0,fogAdd:0,exposureDelta:0,skyDarken:0,fogColor:0x7897a2},
  rain:{label:'Chuva',icon:'🌧️',precipitation:'rain',cloudCover:.72,fogAdd:.0017,exposureDelta:-.08,skyDarken:.34,fogColor:0x596d78},
  snow:{label:'Neve',icon:'🌨️',precipitation:'snow',cloudCover:.58,fogAdd:.00125,exposureDelta:.015,skyDarken:.16,fogColor:0xb7c6c9},
  storm:{label:'Tempestade',icon:'⛈️',precipitation:'rain',cloudCover:.96,fogAdd:.0024,exposureDelta:-.16,skyDarken:.52,fogColor:0x3f505c}
});
const QUALITY_COUNTS=Object.freeze({low:90,medium:190,high:330,ultra:520,lite:110});
const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));

export function normalizeWeatherType(value){const type=String(value||'clear').toLowerCase();return WORLD_WEATHER_TYPES.includes(type)?type:'clear';}
export function normalizeWeatherIntensity(value){const level=String(value||'normal').toLowerCase();return WORLD_WEATHER_INTENSITIES.includes(level)?level:'normal';}
export function normalizeWorldWeatherControl(control){if(!control||control.active===false)return null;const type=normalizeWeatherType(control.type),intensity=normalizeWeatherIntensity(control.intensity);return Object.freeze({active:true,type,intensity,issuer:control.issuer||null,issuedAt:control.issuedAt||null,source:control.source||'session'});}
export function resolveWorldWeather(control=null){const normalized=normalizeWorldWeatherControl(control),type=normalized?.type||'clear',level=normalized?.intensity||'normal',meta=WEATHER_META[type],strength=type==='clear'?0:INTENSITY_VALUE[level];return Object.freeze({...meta,id:type,type,label:meta.label,icon:meta.icon,intensity:level,strength,controlled:!!normalized,controlSource:normalized?.source||null});}
export function weatherParticleBudget(quality='medium',weather='clear',{reducedMotion=false,saveData=false}={}){const type=normalizeWeatherType(weather),base=QUALITY_COUNTS[quality]??QUALITY_COUNTS.medium;if(type==='clear')return 0;const kindMul=type==='snow'?.78:type==='storm'?1: .88;const motionMul=reducedMotion?.52:1,saveMul=saveData?.58:1;return Math.max(24,Math.round(base*kindMul*motionMul*saveMul));}
export function stormFlashAt(timeSeconds=0,weather=null,{reducedMotion=false}={}){const resolved=weather?.id?weather:resolveWorldWeather(weather);if(resolved.id!=='storm'||reducedMotion)return 0;const t=((Number(timeSeconds)||0)+2.35)%9.7;if(t<.055)return 1;if(t>.13&&t<.18)return .58;if(t>.32&&t<.36)return .32;return 0;}

export function createWorldWeatherEffects({THREE,scene,quality='medium',reducedMotion=false,saveData=false,extent=62,height=54}={}){
  if(!THREE||!scene)throw new Error('weather_three_scene_required');
  const MAX=QUALITY_COUNTS.ultra,positions=new Float32Array(MAX*3),seeds=new Float32Array(MAX);
  for(let i=0;i<MAX;i++){const a=((i*16807)%2147483647)/2147483647,b=((i*48271+17)%2147483647)/2147483647,c=((i*69621+73)%2147483647)/2147483647;positions[i*3]=(a-.5)*extent;positions[i*3+1]=(b-.5)*height;positions[i*3+2]=(c-.5)*extent;seeds[i]=((i*9301+49297)%233280)/233280;}
  const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));geometry.setAttribute('aSeed',new THREE.BufferAttribute(seeds,1));geometry.setDrawRange(0,0);
  const material=new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.NormalBlending,uniforms:{uTime:{value:0},uMode:{value:0},uStrength:{value:0},uHeight:{value:height},uReduced:{value:reducedMotion?1:0},uColor:{value:new THREE.Color(0xaed9ef)}},vertexShader:`attribute float aSeed;uniform float uTime;uniform float uMode;uniform float uStrength;uniform float uHeight;uniform float uReduced;varying float vMode;varying float vAlpha;void main(){float speed=mix(16.0,28.0,uStrength)*(uMode==2.0 ? .13 : 1.0);speed*=mix(1.0,.38,uReduced);float y=mod(position.y-uTime*speed+aSeed*uHeight+uHeight*.5,uHeight)-uHeight*.5;float sway=uMode==2.0?sin(uTime*.8+aSeed*19.0)*1.8*(1.0-uReduced*.7):0.0;vec3 p=vec3(position.x+sway,y,position.z);vec4 mv=modelViewMatrix*vec4(p,1.0);gl_Position=projectionMatrix*mv;float base=uMode==2.0?4.2:2.4;gl_PointSize=clamp(base*(95.0/max(20.0,-mv.z)),1.0,uMode==2.0?5.2:3.2);vMode=uMode;vAlpha=.38+.52*uStrength;}` ,fragmentShader:`uniform vec3 uColor;varying float vMode;varying float vAlpha;void main(){vec2 p=gl_PointCoord-.5;if(vMode==2.0){if(length(p)>.48)discard;}else{if(abs(p.x)>.16||abs(p.y)>.49)discard;}gl_FragColor=vec4(uColor,vAlpha);}`});
  const points=new THREE.Points(geometry,material);points.frustumCulled=false;points.renderOrder=7;points.visible=false;scene.add(points);
  let currentQuality=quality,currentWeather=resolveWorldWeather(null);
  function setQuality(next){currentQuality=['low','medium','high','ultra'].includes(next)?next:'medium';return currentQuality;}
  function update({time=0,weather=null,center=null}={}){currentWeather=weather?.id?weather:resolveWorldWeather(weather);const count=weatherParticleBudget(currentQuality,currentWeather.id,{reducedMotion,saveData});geometry.setDrawRange(0,count);points.visible=count>0&&currentWeather.id!=='clear';material.uniforms.uTime.value=Number(time)||0;material.uniforms.uMode.value=currentWeather.id==='snow'?2:currentWeather.id==='storm'?3:currentWeather.id==='rain'?1:0;material.uniforms.uStrength.value=currentWeather.strength;material.uniforms.uColor.value.setHex(currentWeather.id==='snow'?0xf1f7fb:currentWeather.id==='storm'?0x92b9d4:0xaed9ef);if(center)points.position.set(Number(center.x)||0,(Number(center.y)||0)+height*.42,Number(center.z)||0);return{weather:currentWeather,count,flash:stormFlashAt(time,currentWeather,{reducedMotion})};}
  function dispose(){scene.remove(points);geometry.dispose();material.dispose();}
  return{points,update,setQuality,getQuality:()=>currentQuality,getWeather:()=>currentWeather,dispose};
}

export function drawWorldWeather2D(ctx,w,h,weather,timeSeconds=0,{quality='lite',reducedMotion=false,saveData=false}={}){
  const wx=weather?.id?weather:resolveWorldWeather(weather);if(!ctx||wx.id==='clear')return{count:0,flash:0};const count=Math.min(180,weatherParticleBudget(quality,wx.id,{reducedMotion,saveData})),t=Number(timeSeconds)||0;ctx.save();if(wx.id==='snow'){ctx.fillStyle=`rgba(240,248,252,${.28+.42*wx.strength})`;for(let i=0;i<count;i++){const seed=(i*71)%997,x=(seed/997*w+Math.sin(t*.45+i)*7)%w,y=((i*43+t*18*(1-reducedMotion*.55))%(h+20))-10,r=1+(i%3)*.45;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();}}else{ctx.strokeStyle=`rgba(159,207,232,${.22+.38*wx.strength})`;ctx.lineWidth=wx.id==='storm'?1.35:1;ctx.beginPath();for(let i=0;i<count;i++){const x=((i*83+t*46)% (w+50))-25,y=((i*47+t*92*(1-reducedMotion*.55))%(h+40))-20;ctx.moveTo(x,y);ctx.lineTo(x-3,y+9+(i%3)*2);}ctx.stroke();}const flash=stormFlashAt(t,wx,{reducedMotion});if(flash){ctx.fillStyle=`rgba(220,238,255,${flash*.42})`;ctx.fillRect(0,0,w,h);}ctx.restore();return{count,flash};
}
