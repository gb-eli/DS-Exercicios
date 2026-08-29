import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { webcrypto } from 'node:crypto';

const sessionCode=fs.readFileSync('core/session/agv-session.js','utf8');
const hub=fs.readFileSync('assets/hub.js','utf8');
const adminHtml=fs.readFileSync('admin/index.html','utf8');
const adminJs=fs.readFileSync('admin/assets/admin.js','utf8');

function memoryStorage(seed={}){
  const m=new Map(Object.entries(seed));
  return {
    getItem:k=>m.has(k)?m.get(k):null,
    setItem:(k,v)=>m.set(String(k),String(v)),
    removeItem:k=>m.delete(k),
    key:i=>[...m.keys()][i]??null,
    get length(){return m.size;},
    dump:()=>Object.fromEntries(m)
  };
}
function response(status,payload={}){
  return {ok:status>=200&&status<300,status,json:async()=>payload};
}
function buildContext({fetchImpl,storage}){
  const listeners=new Map();
  const docListeners=new Map();
  const ctx={
    console, URL, encodeURIComponent, setTimeout, clearTimeout, Math, Date,
    crypto:webcrypto,
    localStorage:storage,
    fetch:fetchImpl,
    navigator:{onLine:true,locks:{request:async(_name,_opts,fn)=>fn()}},
    document:{hidden:false,addEventListener:(t,f)=>docListeners.set(t,f),removeEventListener:(t)=>docListeners.delete(t)},
    addEventListener:(t,f)=>listeners.set(t,f),removeEventListener:(t)=>listeners.delete(t),
    location:{reload(){}}
  };
  ctx.window=ctx;
  ctx.globalThis=ctx;
  vm.createContext(ctx);
  vm.runInContext(sessionCode,ctx);
  return ctx;
}

const key='sb-iresvqwyaqotghjssncg-auth-token';
const expired=JSON.stringify({access_token:'old-access',refresh_token:'keep-me',expires_at:Math.floor(Date.now()/1000)-60});

test('P7.4: camada comum coordena refresh e logout global',()=>{
  assert.match(sessionCode,/navigator\.locks/);
  assert.match(sessionCode,/refresh-lock/);
  assert.match(sessionCode,/scope=\$\{encodeURIComponent\(chosen\)\}/);
  assert.match(sessionCode,/scope='global'/);
  assert.match(sessionCode,/visibilitychange/);
  assert.match(sessionCode,/online/);
});

test('P7.4: falha transitória de rede não destrói refresh token local',async()=>{
  const storage=memoryStorage({[key]:expired});
  const ctx=buildContext({storage,fetchImpl:async()=>{throw new TypeError('network down')}});
  const auth=ctx.AGVSession.create({supabaseUrl:'https://iresvqwyaqotghjssncg.supabase.co',publishableKey:'anon'});
  const s=await auth.getSession();
  assert.equal(s,null);
  assert.ok(storage.getItem(key),'sessão foi apagada após falha de rede');
  assert.equal(JSON.parse(storage.getItem(key)).refresh_token,'keep-me');
});

test('P7.4: rejeição Auth definitiva remove sessão inválida',async()=>{
  const storage=memoryStorage({[key]:expired});
  const ctx=buildContext({storage,fetchImpl:async()=>response(401,{error:'invalid_grant'})});
  const auth=ctx.AGVSession.create({supabaseUrl:'https://iresvqwyaqotghjssncg.supabase.co',publishableKey:'anon'});
  const s=await auth.getSession();
  assert.equal(s,null);
  assert.equal(storage.getItem(key),null);
});

test('P7.4: senha temporária direciona ao fluxo obrigatório e Admin não promete revogação Auth',()=>{
  assert.match(hub,/must_change_password/);
  assert.match(hub,/location\.(?:href=|replace\()'atividades\/'/);
  assert.match(adminHtml,/Encerrar sessões de atividade/);
  assert.match(adminJs,/NÃO revoga a sessão de login do Supabase/);
});
