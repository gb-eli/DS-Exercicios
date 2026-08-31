(()=>{
  'use strict';
  const KEY='agv:lobby-avatar-context:v1';
  const CHANNEL='agv-lobby-avatar-context-v34';
  const VALID_STATES=new Set(['idle','waiting','exam-running','exam-paused','exam-finished','lab-waiting','lab-active','platform-active']);
  const VALID_INTERIORS=new Set(['practical-exam','lab-virtual','unified-platform','ctf-ds','cosmos','desafio-ds','fliperama','game-info','bank','store']);
  const listeners=new Set();
  let channel=null;
  const safeString=(v,max=80)=>String(v??'').replace(/[\u0000-\u001f]/g,' ').trim().slice(0,max);
  const normalize=input=>{
    const raw=input&&typeof input==='object'?input:{};
    const state=VALID_STATES.has(raw.state)?raw.state:'idle';
    const interiorId=VALID_INTERIORS.has(raw.interiorId)?raw.interiorId:null;
    const now=Date.now(),updatedAt=Number(raw.updatedAt)||now,ttl=Math.max(30000,Math.min(4*60*60*1000,Number(raw.ttlMs)||2*60*60*1000));
    return Object.freeze({
      version:1,state,interiorId,
      platform:safeString(raw.platform||interiorId||'lobby',40),
      activity:safeString(raw.activity||'',80),
      detail:safeString(raw.detail||'',120),
      sessionId:safeString(raw.sessionId||'',80),
      updatedAt,expiresAt:Number(raw.expiresAt)||updatedAt+ttl
    });
  };
  const expired=value=>!value||Number(value.expiresAt||0)<=Date.now();
  const read=()=>{try{const value=normalize(JSON.parse(sessionStorage.getItem(KEY)||'null'));if(expired(value)){sessionStorage.removeItem(KEY);return normalize({state:'idle'});}return value;}catch{return normalize({state:'idle'});}};
  const notify=(value,source='local')=>{for(const fn of listeners){try{fn(value,{source});}catch{}}};
  const ensureChannel=()=>{if(channel||typeof BroadcastChannel!=='function')return channel;try{channel=new BroadcastChannel(CHANNEL);channel.onmessage=event=>{const value=normalize(event.data);if(expired(value))return;try{sessionStorage.setItem(KEY,JSON.stringify(value));}catch{}notify(value,'broadcast');};}catch{}return channel;};
  const set=input=>{const value=normalize({...input,updatedAt:Date.now()});try{sessionStorage.setItem(KEY,JSON.stringify(value));}catch{}try{ensureChannel()?.postMessage(value);}catch{}notify(value,'local');return value;};
  const clear=detail=>set({state:'idle',detail:detail||''});
  const subscribe=fn=>{if(typeof fn!=='function')return()=>{};listeners.add(fn);ensureChannel();queueMicrotask(()=>{try{fn(read(),{source:'initial'});}catch{}});return()=>listeners.delete(fn);};
  const actionFor=value=>{const c=normalize(value);return c.state==='exam-running'?'exam':c.state==='exam-paused'?'exam-paused':c.state==='lab-active'?'program':null;};
  const isLocked=value=>['exam-running','exam-paused','lab-active'].includes(normalize(value).state);
  window.AGVAvatarContext=Object.freeze({set,get:read,clear,subscribe,normalize,actionFor,isLocked,channel:CHANNEL,states:Object.freeze([...VALID_STATES])});
  ensureChannel();
})();
