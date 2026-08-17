(() => {
  'use strict';
  const KEY = 'ds-avatar-profile-v2';
  const LEGACY_KEY = 'ds-avatar-loadout-v1';
  const memory = new Map();
  const defaults = Object.freeze({
    schemaVersion: 2,
    profileId: 'perfil-demo',
    displayName: 'Estudante DS',
    baseAvatarId: 'avatar-tech-v1',
    equippedItems: [],
    quickAnimations: ['Wave','Jump','DanceLoop','VictoryPose','WalkShowcase','ThumbsUp'],
    quickMessages: ['Olá!','Bom dia!','Vamos estudar!','Vamos programar!','Vamos fazer um desafio!','Meu nome é Estudante DS.'],
    currentAnimation: 'Idle',
    currentMessage: '',
    activeTheme: 'tech-default',
    updatedAt: null
  });
  const getRaw = key => { try { return localStorage.getItem(key); } catch (_) { return memory.get(key) || null; } };
  const setRaw = (key,value) => { try { localStorage.setItem(key,value); } catch (_) { memory.set(key,value); } };
  const catalog = () => window.DS_EQUIPMENT?.items || [];
  const itemById = id => catalog().find(item => item.id === id) || null;
  const validIds = values => [...new Set((Array.isArray(values) ? values : []).filter(id => itemById(id)))];
  function migrate() {
    try {
      const current = JSON.parse(getRaw(KEY) || 'null');
      if (current?.schemaVersion === 2) return current;
    } catch (_) {}
    let legacy = [];
    try { legacy = JSON.parse(getRaw(LEGACY_KEY) || 'null')?.items || []; } catch (_) {}
    return { ...defaults, equippedItems: validIds(legacy), updatedAt: new Date().toISOString() };
  }
  let state = migrate();
  function normalize(next) {
    return {
      ...defaults,
      ...next,
      schemaVersion: 2,
      equippedItems: validIds(next?.equippedItems),
      quickAnimations: [...new Set(next?.quickAnimations || defaults.quickAnimations)].slice(0,8),
      quickMessages: [...new Set(next?.quickMessages || defaults.quickMessages)].slice(0,8),
      updatedAt: new Date().toISOString()
    };
  }
  function persist(source='profile') {
    state = normalize(state);
    setRaw(KEY, JSON.stringify(state));
    setRaw(LEGACY_KEY, JSON.stringify({version:1,items:state.equippedItems,updatedAt:state.updatedAt}));
    document.dispatchEvent(new CustomEvent('ds-avatar-profile-change',{detail:{source,state:getState(),snapshot:getSnapshot()}}));
    return getState();
  }
  function getState(){ return JSON.parse(JSON.stringify(state)); }
  function slotMap(items=state.equippedItems){
    const out={};
    for(const id of items){
      const item=itemById(id); if(!item) continue;
      for(const attachment of item.attachments || []) if(!attachment.variant) out[attachment.slot]=item;
    }
    return out;
  }
  function getSnapshot(extraItems=[]){
    const ids=validIds([...state.equippedItems,...extraItems]);
    const items=ids.map(itemById).filter(Boolean);
    return { profileId:state.profileId,displayName:state.displayName,baseAvatarId:state.baseAvatarId,items,slots:slotMap(ids),currentAnimation:state.currentAnimation,currentMessage:state.currentMessage,updatedAt:state.updatedAt };
  }
  function setEquipped(items,{source='external'}={}){ state={...state,equippedItems:validIds(items)}; return persist(source); }
  function equipItem(id,{source='external'}={}){
    const item=itemById(id); if(!item) return null;
    const slots=new Set((item.attachments||[]).filter(a=>!a.variant).map(a=>a.slot));
    const keep=state.equippedItems.filter(oldId=>{
      const old=itemById(oldId); return !(old?.attachments||[]).some(a=>slots.has(a.slot));
    });
    state={...state,equippedItems:validIds([...keep,id])}; persist(source);
    if(source!=='viewer' && window.DSAvatarViewer?.equip) window.DSAvatarViewer.equip(id,true,false).catch?.(()=>{});
    return item;
  }
  function unequipItem(id,{source='external'}={}){
    if(!state.equippedItems.includes(id)) return false;
    state={...state,equippedItems:state.equippedItems.filter(x=>x!==id)}; persist(source);
    if(source!=='viewer') window.DSAvatarViewer?.unequip?.(id,true,false);
    return true;
  }
  function toggleItem(id,options={}){ return state.equippedItems.includes(id) ? (unequipItem(id,options),false) : !!equipItem(id,options); }
  function isEquipped(id){ return state.equippedItems.includes(id); }
  function setAnimation(name){ state={...state,currentAnimation:name||'Idle'}; return persist('animation'); }
  function setMessage(message){ state={...state,currentMessage:String(message||'').slice(0,100)}; return persist('message'); }
  function owns(id){ return !!window.DSStore?.getState?.().inventory?.includes(id); }
  state=normalize(state); setRaw(KEY,JSON.stringify(state));
  window.DSAvatarProfile={version:'0.9.6.0-RG',getState,getSnapshot,slotMap,itemById,setEquipped,equipItem,unequipItem,toggleItem,isEquipped,setAnimation,setMessage,owns,storageKey:KEY};
})();
