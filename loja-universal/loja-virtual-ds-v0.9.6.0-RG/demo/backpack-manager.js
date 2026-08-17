(() => {
  'use strict';
  const cfg=window.DS_BACKPACK_CONFIG;
  const memory=new Map();
  const clone=value=>JSON.parse(JSON.stringify(value));
  const now=()=>new Date().toISOString();
  const profileId=()=>window.DSAvatarProfile?.getState?.().profileId||'perfil-demo';
  const key=()=>`${cfg.storage.keyPrefix}:${profileId()}`;
  const getRaw=k=>{try{return localStorage.getItem(k)}catch(_){return memory.get(k)||null}};
  const setRaw=(k,v)=>{try{localStorage.setItem(k,v)}catch(_){memory.set(k,v)}};
  const catalog=()=>window.DS_CATALOG?.items||[];
  const storeItem=id=>window.DSStore?.getItem?.(id)||catalog().find(x=>x.id===id)||null;
  const owned=id=>!!window.DSStore?.getState?.().inventory?.includes(id);
  const groupFor=item=>Object.entries(cfg.groups).find(([,g])=>g.categories.includes(item?.category))?.[0]||null;
  const validOwnedIds=ids=>[...new Set(Array.isArray(ids)?ids:[])].filter(id=>storeItem(id)&&owned(id)&&storeItem(id).category!=='animation');
  const validAnimations=values=>[...new Set(Array.isArray(values)?values:[])].filter(Boolean).slice(0,cfg.capacity.quickAnimations);
  const validMessages=values=>[...new Set(Array.isArray(values)?values:[])].map(x=>String(x).trim().slice(0,100)).filter(Boolean).slice(0,cfg.capacity.quickMessages);
  const defaults=()=>({schemaVersion:1,profileId:profileId(),itemIds:[],quickAnimations:[...cfg.defaultAnimations],quickMessages:[...cfg.defaultMessages],selectedItemId:null,updatedAt:null,lastAction:null});
  function normalize(value={}){
    const base=defaults();
    let items=validOwnedIds(value.itemIds).slice(0,cfg.capacity.items);
    const counts={};
    items=items.filter(id=>{const g=groupFor(storeItem(id));if(!g)return false;counts[g]=(counts[g]||0)+1;return counts[g]<=cfg.groups[g].limit});
    return {...base,...value,schemaVersion:1,profileId:profileId(),itemIds:items,quickAnimations:validAnimations(value.quickAnimations||base.quickAnimations),quickMessages:validMessages(value.quickMessages||base.quickMessages),updatedAt:value.updatedAt||now()};
  }
  function read(){try{return normalize(JSON.parse(getRaw(key())||'null')||{})}catch(_){return normalize({})}}
  let state=read();
  function emit(source='backpack'){
    state=normalize({...state,updatedAt:now()});setRaw(key(),JSON.stringify(state));
    document.dispatchEvent(new CustomEvent('ds-backpack-change',{detail:{source,state:getState(),diagnostics:getDiagnostics()}}));
    return getState();
  }
  function getState(){return clone(state)}
  function countByGroup(){const out={wearable:0,tool:0,effect:0};for(const id of state.itemIds){const g=groupFor(storeItem(id));if(g)out[g]=(out[g]||0)+1}return out}
  function canAddItem(id){
    const item=storeItem(id);if(!item)return {ok:false,code:'UNKNOWN_ITEM',message:'Item não reconhecido.'};
    if(!owned(id))return {ok:false,code:'NOT_OWNED',message:'O item precisa estar no Inventário Geral.'};
    if(item.category==='animation')return {ok:false,code:'ANIMATION_ACTION',message:'Use o atalho de animação.'};
    if(state.itemIds.includes(id))return {ok:false,code:'ALREADY_ADDED',message:'Item já está na mochila.'};
    if(state.itemIds.length>=cfg.capacity.items)return {ok:false,code:'FULL',message:'A Mochila DS está cheia.'};
    const group=groupFor(item);if(!group)return {ok:false,code:'UNSUPPORTED',message:'Categoria ainda não aceita na mochila.'};
    const used=countByGroup()[group]||0;const limit=cfg.groups[group].limit;
    if(used>=limit)return {ok:false,code:'GROUP_FULL',message:`Limite de ${cfg.groups[group].label.toLowerCase()} atingido.`};
    return {ok:true,item,group};
  }
  function addItem(id,{source='inventory'}={}){const check=canAddItem(id);if(!check.ok)return check;state={...state,itemIds:[...state.itemIds,id],selectedItemId:id,lastAction:{type:'ADD_ITEM',id,at:now()}};emit(source);return {ok:true,item:check.item,state:getState()}}
  function removeItem(id,{source='backpack'}={}){if(!state.itemIds.includes(id))return {ok:false,code:'NOT_FOUND',message:'Item não está na mochila.'};state={...state,itemIds:state.itemIds.filter(x=>x!==id),selectedItemId:state.selectedItemId===id?null:state.selectedItemId,lastAction:{type:'REMOVE_ITEM',id,at:now()}};emit(source);return {ok:true,state:getState()}}
  function toggleItem(id,options={}){return state.itemIds.includes(id)?removeItem(id,options):addItem(id,options)}
  function addAnimation(clip,{source='inventory'}={}){if(!clip)return {ok:false,code:'INVALID_ANIMATION',message:'Animação inválida.'};if(state.quickAnimations.includes(clip))return {ok:false,code:'ALREADY_ADDED',message:'Animação já está nos atalhos.'};if(state.quickAnimations.length>=cfg.capacity.quickAnimations)return {ok:false,code:'FULL',message:'Atalhos de animação completos.'};state={...state,quickAnimations:[...state.quickAnimations,clip],lastAction:{type:'ADD_ANIMATION',clip,at:now()}};emit(source);return {ok:true,state:getState()}}
  function removeAnimation(clip,{source='backpack'}={}){state={...state,quickAnimations:state.quickAnimations.filter(x=>x!==clip),lastAction:{type:'REMOVE_ANIMATION',clip,at:now()}};emit(source);return {ok:true,state:getState()}}
  function setMessages(messages,{source='backpack'}={}){state={...state,quickMessages:validMessages(messages),lastAction:{type:'SET_MESSAGES',at:now()}};return emit(source)}
  function addMessage(message,{source='backpack'}={}){const value=String(message||'').trim().slice(0,100);if(!value)return {ok:false,code:'EMPTY',message:'Digite uma mensagem.'};if(state.quickMessages.includes(value))return {ok:false,code:'ALREADY_ADDED',message:'Mensagem já adicionada.'};if(state.quickMessages.length>=cfg.capacity.quickMessages)return {ok:false,code:'FULL',message:'Atalhos de mensagem completos.'};state={...state,quickMessages:[...state.quickMessages,value],lastAction:{type:'ADD_MESSAGE',at:now()}};emit(source);return {ok:true,state:getState()}}
  function removeMessage(message,{source='backpack'}={}){state={...state,quickMessages:state.quickMessages.filter(x=>x!==message),lastAction:{type:'REMOVE_MESSAGE',at:now()}};emit(source);return {ok:true,state:getState()}}
  function useItem(id){const item=storeItem(id);if(!item||!state.itemIds.includes(id))return {ok:false,code:'NOT_AVAILABLE',message:'Item não está disponível na mochila.'};const equipped=window.DSAvatarProfile?.toggleItem?.(id,{source:'backpack'});state={...state,selectedItemId:id,lastAction:{type:'USE_ITEM',id,equipped,at:now()}};emit('use-item');return {ok:true,item,equipped}}
  function playAnimation(clip){if(!state.quickAnimations.includes(clip))return {ok:false,code:'NOT_AVAILABLE',message:'Animação não está nos atalhos.'};window.DSAvatarProfile?.setAnimation?.(clip);window.DSAvatarViewer?.play?.(clip);window.DSAvatarShowcase?.play?.(clip);state={...state,lastAction:{type:'PLAY_ANIMATION',clip,at:now()}};emit('quick-animation');return {ok:true,clip}}
  function sayMessage(message){if(!state.quickMessages.includes(message))return {ok:false,code:'NOT_AVAILABLE',message:'Mensagem não está nos atalhos.'};window.DSAvatarProfile?.setMessage?.(message);window.DSAvatarShowcase?.say?.(message);state={...state,lastAction:{type:'SAY_MESSAGE',message,at:now()}};emit('quick-message');return {ok:true,message}}
  function autoOrganize(){
    const ownedItems=(window.DSStore?.getState?.().inventory||[]).map(storeItem).filter(Boolean);
    const selected=[];const counts={wearable:0,tool:0,effect:0};
    for(const item of ownedItems){if(item.category==='animation')continue;const g=groupFor(item);if(!g||counts[g]>=cfg.groups[g].limit||selected.length>=cfg.capacity.items)continue;selected.push(item.id);counts[g]++}
    state={...state,itemIds:selected,lastAction:{type:'AUTO_ORGANIZE',at:now()}};emit('auto-organize');return getState();
  }
  function importState(value,{source='import'}={}){state=normalize(value);emit(source);return getState()}
  function reset(){state=normalize({});emit('reset');return getState()}
  function getDiagnostics(){const groups=countByGroup();return {version:'0.9.6.0-RG',profileId:profileId(),storageKey:key(),items:{used:state.itemIds.length,limit:cfg.capacity.items},animations:{used:state.quickAnimations.length,limit:cfg.capacity.quickAnimations},messages:{used:state.quickMessages.length,limit:cfg.capacity.quickMessages},groups:Object.fromEntries(Object.entries(cfg.groups).map(([id,g])=>[id,{used:groups[id]||0,limit:g.limit,label:g.label}])),updatedAt:state.updatedAt}}
  function animationForItem(id){return cfg.animationMap[id]||null}
  state=normalize(state);setRaw(key(),JSON.stringify(state));
  window.DSBackpack={version:'0.9.6.0-RG',getState,getDiagnostics,canAddItem,addItem,removeItem,toggleItem,addAnimation,removeAnimation,setMessages,addMessage,removeMessage,useItem,playAnimation,sayMessage,autoOrganize,importState,reset,animationForItem,groupFor,storeItem,config:cfg};
})();
