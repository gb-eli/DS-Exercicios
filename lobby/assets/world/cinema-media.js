// v14.10.8.66 — Cinema AGV: programação de vídeo segura e normalizada.
export const EMPTY_CINEMA_MEDIA=Object.freeze({
  id:'main',enabled:false,title:'',source_type:'none',source_url:null,loop:false,updated_at:null,updated_by:null
});

const safeText=(value,max=120)=>String(value??'').replace(/[\u0000-\u001f\u007f]/g,' ').replace(/\s+/g,' ').trim().slice(0,max);
const HTTP=/^https?:\/\//i;

export function extractCinemaSource(value){
  const raw=String(value??'').trim();
  if(!raw)return'';
  const iframe=raw.match(/<iframe\b[^>]*\bsrc\s*=\s*(["'])(.*?)\1/i);
  return String(iframe?.[2]||raw).trim();
}

function youtubeId(url){
  try{
    const u=new URL(url),host=u.hostname.replace(/^www\./,'').toLowerCase();
    if(host==='youtu.be')return u.pathname.split('/').filter(Boolean)[0]||null;
    if(host==='youtube.com'||host==='m.youtube.com'||host==='youtube-nocookie.com'){
      if(u.pathname==='/watch')return u.searchParams.get('v');
      const parts=u.pathname.split('/').filter(Boolean);
      if(['embed','shorts','live'].includes(parts[0]))return parts[1]||null;
    }
  }catch{}
  return null;
}
function vimeoId(url){
  try{
    const u=new URL(url),host=u.hostname.replace(/^www\./,'').toLowerCase();
    if(host!=='vimeo.com'&&host!=='player.vimeo.com')return null;
    return u.pathname.split('/').filter(Boolean).find(part=>/^\d+$/.test(part))||null;
  }catch{}
  return null;
}

export function classifyCinemaSource(value){
  const source_url=extractCinemaSource(value);
  if(!source_url)return{source_type:'none',source_url:null};
  if(!HTTP.test(source_url))return{source_type:'invalid',source_url:null};
  const yt=youtubeId(source_url);
  if(yt&&/^[A-Za-z0-9_-]{6,20}$/.test(yt))return{source_type:'youtube',source_url:`https://www.youtube-nocookie.com/embed/${yt}`};
  const vi=vimeoId(source_url);
  if(vi)return{source_type:'vimeo',source_url:`https://player.vimeo.com/video/${vi}`};
  return{source_type:'direct',source_url};
}

export function normalizeCinemaMedia(raw={}){
  const classified=classifyCinemaSource(raw.source_url??raw.url??'');
  let source_type=classified.source_type,source_url=classified.source_url;
  if(!raw.enabled||!source_url||source_type==='invalid'){source_type='none';source_url=null;}
  return{
    id:'main',enabled:!!raw.enabled&&!!source_url,title:safeText(raw.title||'',120),
    source_type,source_url,loop:!!raw.loop,updated_at:raw.updated_at||null,updated_by:raw.updated_by||null
  };
}

export function cinemaSourceLabel(media){
  const type=normalizeCinemaMedia(media).source_type;
  return type==='youtube'?'YouTube':type==='vimeo'?'Vimeo':type==='direct'?'Vídeo direto':'Sem programação';
}
