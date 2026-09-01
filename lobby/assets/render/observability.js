const MB=1024*1024;
const round=(value,digits=2)=>Number.isFinite(Number(value))?Number(Number(value).toFixed(digits)):null;
const finite=value=>value==null||value===''?null:(Number.isFinite(Number(value))?Number(value):null);

function bufferBytes(value,seen){
  const array=value?.array||value;
  if(!array||typeof array!=='object'||typeof array.byteLength!=='number'||seen.has(array))return 0;
  seen.add(array);return Math.max(0,Number(array.byteLength)||0);
}

function textureImageBytes(image){
  if(!image)return 0;
  if(Array.isArray(image))return image.reduce((sum,item)=>sum+textureImageBytes(item),0);
  if(image.data&&typeof image.data.byteLength==='number')return Number(image.data.byteLength)||0;
  if(Array.isArray(image.mipmaps))return image.mipmaps.reduce((sum,item)=>sum+textureImageBytes(item),0);
  const width=Number(image.videoWidth||image.naturalWidth||image.width||0),height=Number(image.videoHeight||image.naturalHeight||image.height||0);
  return width>0&&height>0?width*height*4:0;
}

function collectMaterialTextures(material,textures){
  if(!material||typeof material!=='object')return;
  for(const value of Object.values(material)){
    if(value?.isTexture)textures.add(value);
    else if(Array.isArray(value))for(const item of value)if(item?.isTexture)textures.add(item);
  }
}

export function estimateSceneMemory(scene){
  const geometries=new Set(),materials=new Set(),textures=new Set(),arrays=new Set();
  let geometryBytes=0,textureBytes=0,objects=0,visibleObjects=0;
  scene?.traverse?.(object=>{
    objects++;
    if(object.visible!==false)visibleObjects++;
    const geometry=object.geometry;
    if(geometry&&!geometries.has(geometry)){
      geometries.add(geometry);
      if(geometry.index)geometryBytes+=bufferBytes(geometry.index,arrays);
      for(const attribute of Object.values(geometry.attributes||{}))geometryBytes+=bufferBytes(attribute,arrays);
      for(const morphList of Object.values(geometry.morphAttributes||{}))for(const attribute of morphList||[])geometryBytes+=bufferBytes(attribute,arrays);
    }
    for(const material of(Array.isArray(object.material)?object.material:[object.material])){
      if(!material||materials.has(material))continue;
      materials.add(material);collectMaterialTextures(material,textures);
    }
  });
  for(const texture of textures){
    const source=texture.source?.data??texture.image;
    const base=textureImageBytes(source);
    const mipFactor=texture.generateMipmaps===false?1:4/3;
    textureBytes+=base*mipFactor;
  }
  return{
    geometryBytes:Math.round(geometryBytes),textureBytes:Math.round(textureBytes),estimatedGpuBytes:Math.round(geometryBytes+textureBytes),
    geometryMemoryMb:round(geometryBytes/MB),textureMemoryMb:round(textureBytes/MB),estimatedGpuMemoryMb:round((geometryBytes+textureBytes)/MB),
    objectCount:objects,visibleObjectCount:visibleObjects,uniqueGeometries:geometries.size,uniqueMaterials:materials.size,uniqueTextures:textures.size
  };
}

export function captureRenderTelemetry({renderer,scene,fps=null,quality=null,npcCount=null,vehicleCount=null,worldId=null,interior=null,source='runtime'}={}){
  const info=renderer?.info||{},render=info.render||{},memory=info.memory||{},sceneMemory=scene?estimateSceneMemory(scene):null;
  const jsMemory=globalThis.performance?.memory;
  const fpsNumber=finite(fps);
  return{
    source:String(source||'runtime'),worldId:worldId==null?null:String(worldId),interior:interior==null?null:String(interior),
    fps:fpsNumber,frameTimeMs:fpsNumber&&fpsNumber>0?round(1000/fpsNumber):null,quality:quality==null?null:String(quality),
    dpr:round(renderer?.getPixelRatio?.()??globalThis.devicePixelRatio??1),
    drawCalls:finite(render.calls),triangles:finite(render.triangles),points:finite(render.points),lines:finite(render.lines),
    geometries:finite(memory.geometries),textures:finite(memory.textures),programs:Array.isArray(info.programs)?info.programs.length:null,
    npcCount:finite(npcCount),vehicleCount:finite(vehicleCount),
    sceneObjects:sceneMemory?.objectCount??null,visibleSceneObjects:sceneMemory?.visibleObjectCount??null,
    geometryMemoryMb:sceneMemory?.geometryMemoryMb??null,textureMemoryMb:sceneMemory?.textureMemoryMb??null,estimatedGpuMemoryMb:sceneMemory?.estimatedGpuMemoryMb??null,
    estimatedMemoryMethod:sceneMemory?'geometry-buffer-bytes + discovered-textures-RGBA-estimate':null,
    jsHeapUsedMb:jsMemory?round(Number(jsMemory.usedJSHeapSize||0)/MB):null,
    jsHeapTotalMb:jsMemory?round(Number(jsMemory.totalJSHeapSize||0)/MB):null,
    jsHeapLimitMb:jsMemory?round(Number(jsMemory.jsHeapSizeLimit||0)/MB):null
  };
}

export function createRuntimeObservability(getSnapshot,{sampleIntervalMs=1000}={}){
  let lastAt=0,last=null;
  return()=>{
    const now=globalThis.performance?.now?.()??Date.now();
    if(last&&now-lastAt<sampleIntervalMs)return last;
    lastAt=now;
    try{last=getSnapshot?.()||null;}catch(error){last={error:String(error?.message||error||'observability_snapshot_failed').slice(0,180)};}
    return last;
  };
}


export function createFrameRateCounter(initialNow=globalThis.performance?.now?.()??Date.now()){
  let frames=0,sampleStart=Number(initialNow)||0,fps=null;
  return{
    tick(now=globalThis.performance?.now?.()??Date.now()){
      const time=Number(now)||0;frames++;
      const elapsed=time-sampleStart;
      if(elapsed>=1000){fps=Math.max(0,Math.round(frames*1000/Math.max(1,elapsed)));frames=0;sampleStart=time;}
      return fps;
    },
    getFPS:()=>fps,
    reset(now=globalThis.performance?.now?.()??Date.now()){frames=0;sampleStart=Number(now)||0;fps=null;}
  };
}
