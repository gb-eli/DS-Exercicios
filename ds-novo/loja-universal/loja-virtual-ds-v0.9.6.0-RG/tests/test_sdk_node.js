const fs = require('fs');
const vm = require('vm');
const assert = require('assert');

const memory = new Map();
global.window = {
  DS_STORE_CONFIG: { discountTiers: [10,25,38,60,80,99,100] },
  DS_ECONOMY_CONFIG: JSON.parse(fs.readFileSync('config/economy.config.json','utf8')),
  DS_INTEGRATION_CONFIG: JSON.parse(fs.readFileSync('config/integration.config.json','utf8')),
  DS_CATALOG: { items: [] },
  localStorage: { getItem:k=>memory.get(k)||null, setItem:(k,v)=>memory.set(k,v), removeItem:k=>memory.delete(k) },
  addEventListener(){}, removeEventListener(){}, parent:null,
  location:{origin:'http://localhost'}
};
global.globalThis = global.window;
vm.runInThisContext(fs.readFileSync('dist/ds-store-foundation.js','utf8'));
vm.runInThisContext(fs.readFileSync('dist/ds-store-sdk.js','utf8'));

(async()=>{
  const store=window.DSStore;
  store.reset();
  const sdk=window.DSStoreSDK.createAdapter('desafio-ds',{profileId:'perfil-teste',store});
  const first=await sdk.missionCompleted({eventId:'desafio:missao-01:perfil-teste:done',amount:350,evidenceId:'ev-01',activityId:'missao-01'});
  assert.equal(first.ok,true); assert.equal(first.status,'AUTHORIZED');
  const duplicate=await sdk.missionCompleted({eventId:'desafio:missao-01:perfil-teste:done',amount:350,evidenceId:'ev-01',activityId:'missao-01'});
  assert.equal(duplicate.ok,false); assert.equal(duplicate.code,'DUPLICATE_EVENT');
  const invalid=await sdk.labCompleted({eventId:'desafio:lab-invalido:perfil-teste',amount:300,evidenceId:'ev-lab'});
  assert.equal(invalid.ok,false); assert.equal(invalid.code,'INVALID_EVENT');
  const teacher=window.DSStoreSDK.createAdapter('professor-admin',{profileId:'perfil-teste',store});
  const critical=await teacher.teacherReward({eventId:'professor:premio:perfil-teste:001',amount:50000,evidenceId:'voucher-assinado-001'});
  assert.equal(critical.ok,true); assert.equal(critical.status,'UNDER_REVIEW');
  let bridgeReply=null;
  const bridge=new window.DSStoreSDK.StoreBridge({store,allowedOrigins:['http://localhost']});
  bridge.handle({origin:'http://localhost',data:{protocol:'DS_STORE_EVENT_V1',requestId:'req-bridge-1',event:{eventId:'lab-virtual:lab-bridge:perfil-teste:001',profileId:'perfil-teste',platformId:'lab-virtual-ds',type:'LAB_COMPLETED',amount:700,evidenceId:'ev-bridge',activityId:'lab-bridge',metadata:{}}},source:{postMessage:message=>{bridgeReply=message}}});
  assert.equal(bridgeReply.result.ok,true); assert.equal(bridgeReply.result.status,'AUTHORIZED');
  const offline=window.DSStoreSDK.createAdapter('desafio-ds',{profileId:'perfil-teste',store,transport:'offline'});
  const queued=await offline.phaseCompleted({eventId:'desafio:fase-offline:perfil-teste',amount:500,evidenceId:'ev-offline'});
  assert.equal(queued.status,'QUEUED'); assert.equal(offline.getQueue().length,1);
  const flushed=await offline.flushQueue(); assert.equal(flushed.remaining,0);
  console.log(JSON.stringify({authorized:first.status,duplicate:duplicate.code,invalid:invalid.code,critical:critical.status,bridge:bridgeReply.result.status,queued:queued.status,flushed},null,2));
})().catch(error=>{console.error(error);process.exit(1)});
