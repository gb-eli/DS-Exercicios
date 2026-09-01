const COLLECTION_URL=new URL('../../data/museu-hardware/collection-v1.json',import.meta.url);
let cache=null;
export async function loadMuseumCollection({signal}={}){if(cache)return cache;const response=await fetch(COLLECTION_URL,{signal,cache:'force-cache'});if(!response.ok)throw new Error(`museum_collection_http_${response.status}`);const data=await response.json();cache=Object.freeze({...data,items:Object.freeze((data.items||[]).map(item=>Object.freeze({...item,tags:Object.freeze([...(item.tags||[])])})))});return cache;}
export function galleryCollection(collection,galleryId){return (collection?.items||[]).filter(item=>item.gallery_id===galleryId);}
export function collectionItem(collection,id){return (collection?.items||[]).find(item=>item.id===id)||null;}
export function searchMuseumCollection(collection,query=''){const q=String(query||'').trim().toLocaleLowerCase('pt-BR');if(!q)return [...(collection?.items||[])];return (collection?.items||[]).filter(item=>`${item.name} ${item.maker} ${item.year} ${item.kind} ${(item.tags||[]).join(' ')} ${item.significance}`.toLocaleLowerCase('pt-BR').includes(q));}
