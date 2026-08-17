const assert = require('assert');
const calls=[];
global.AGVCore={
  rewards:{claim:async(payload)=>{calls.push(payload);return {ok:true,status:'AUTHORIZED',wallet:{balance:321},rewards:{coins:50}}}}
};
const SDK=require('../dist/ds-store-sdk.js');
(async()=>{
  const client=SDK.createAdapter('ctf-ds',{core:global.AGVCore,transport:'agv-core',profileId:'perfil-legado'});
  const result=await client.reward({eventId:'ctf:mission:001:user',type:'MISSION_COMPLETED',amount:999999,activityId:'mission-001',metadata:{source:'test'}});
  assert.equal(result.ok,true);
  assert.equal(result.authority,'AGV_EDUCATION_CORE');
  assert.equal(calls.length,1);
  assert.equal(calls[0].eventType,'MISSION_COMPLETED');
  assert.equal(calls[0].activityId,'mission-001');
  assert.equal(Object.prototype.hasOwnProperty.call(calls[0],'amount'),false);
  console.log('DSStoreSDK -> AGVCore: amount legado não é enviado ao Core');
})().catch(err=>{console.error(err);process.exit(1)});
