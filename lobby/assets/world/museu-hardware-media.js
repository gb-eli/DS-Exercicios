const MANIFEST_URL=new URL('../../data/museu-hardware/media-manifest.json?v=0.8.0',import.meta.url).href;
let manifestCache=null;

export async function loadMuseumMediaManifest({signal}={}){
  if(manifestCache)return manifestCache;
  const response=await fetch(MANIFEST_URL,{cache:'force-cache',signal});
  if(!response.ok)throw new Error(`museu_hardware_media_manifest_http_${response.status}`);
  const data=await response.json();
  if(!data||!data.entries)throw new Error('museu_hardware_media_manifest_invalid');
  manifestCache=Object.freeze(data);return manifestCache;
}

function resolvedUrl(path){return new URL(`../../data/museu-hardware/${String(path||'')}`,import.meta.url).href;}

export function createMuseumMediaController({manifest,onState=()=>{}}={}){
  const entries=manifest?.entries||{},videos=new Map(),pending=new Map(),active=new Set();let disposed=false;
  const emit=(id,state,detail={})=>{try{onState({id,state,...detail})}catch{}};
  async function ensure(id){
    if(disposed||!entries[id]?.webm)return null;if(videos.has(id))return videos.get(id);if(pending.has(id))return pending.get(id);
    const promise=new Promise(resolve=>{
      const video=document.createElement('video');video.muted=true;video.loop=true;video.playsInline=true;video.preload='metadata';video.crossOrigin='anonymous';video.setAttribute('aria-hidden','true');
      const done=()=>{cleanup();videos.set(id,video);pending.delete(id);emit(id,'ready',{caption:entries[id]?.caption||''});resolve(video);};
      const fail=()=>{cleanup();pending.delete(id);emit(id,'error');try{video.removeAttribute('src');video.load();}catch{}resolve(null);};
      const cleanup=()=>{video.removeEventListener('canplay',done);video.removeEventListener('error',fail);};
      video.addEventListener('canplay',done,{once:true});video.addEventListener('error',fail,{once:true});video.src=resolvedUrl(entries[id].webm);video.load();
    });pending.set(id,promise);return promise;
  }
  async function activate(id){if(disposed)return null;active.add(id);const video=await ensure(id);if(!video||disposed||!active.has(id))return video;try{await video.play();emit(id,'playing');}catch{emit(id,'blocked');}return video;}
  function deactivate(id){active.delete(id);const video=videos.get(id);if(video&&!video.paused){try{video.pause();emit(id,'paused');}catch{}}}
  function getVideo(id){return videos.get(id)||null;}
  function isActive(id){return active.has(id);}
  function caption(id){return entries[id]?.caption||'';}
  function dispose(){disposed=true;active.clear();for(const video of videos.values()){try{video.pause();video.removeAttribute('src');video.load();}catch{}}videos.clear();pending.clear();}
  return{ensure,activate,deactivate,getVideo,isActive,caption,dispose};
}
