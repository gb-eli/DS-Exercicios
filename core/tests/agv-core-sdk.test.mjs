import assert from 'node:assert/strict';
import { AGVCoreSDK } from '../sdk/agv-core-sdk.js';

const calls=[];
const supabase={
  auth:{
    getUser:async()=>({data:{user:{id:'00000000-0000-0000-0000-000000000001'}},error:null}),
    getSession:async()=>({data:{session:{user:{id:'00000000-0000-0000-0000-000000000001'}}},error:null}),
    signInWithPassword:async()=>({data:{session:{}},error:null}),
    signOut:async()=>({error:null})
  },
  functions:{invoke:async(name,{body})=>{calls.push({name,body});return {data:{ok:true,status:'AUTHORIZED',wallet:{balance:10}},error:null}}},
  from:()=>({
    select(){return this},eq(){return this},order(){return this},limit(){return this},lt(){return this},
    async single(){return {data:{balance:10,lifetime_earned:10,lifetime_spent:0,status:'active'},error:null}},
    async maybeSingle(){return {data:{id:'00000000-0000-0000-0000-000000000001'},error:null}},
    then(resolve){return Promise.resolve({data:[],error:null}).then(resolve)}
  }),
  rpc:async()=>({data:{ok:true},error:null})
};

const core=new AGVCoreSDK({supabase,platformId:'ctf-ds',platformVersion:'3.2.0'});
const claim=await core.rewards.claim({activityId:'mission-01',eventType:'MISSION_COMPLETED',idempotencyKey:'ctf:mission-01:user-1'});
assert.equal(claim.ok,true);
const call=calls.at(-1);
assert.equal(call.name,'agv-reward-claim');
assert.equal(call.body.platformId,'ctf-ds');
assert.equal(Object.hasOwn(call.body,'amount'),false,'reward claim não pode conter amount');
assert.equal(call.body.eventType,'MISSION_COMPLETED');

const progress=await core.progress.report({activityId:'mission-01',eventType:'activity.completed',progress:100,idempotencyKey:'progress:mission-01:user-1'});
assert.equal(progress.ok,true);
assert.equal(calls.at(-1).name,'agv-progress-event');
assert.equal(calls.at(-1).body.progress,100);

console.log('AGVCoreSDK v0.2.0: reward sem amount + progresso idempotente OK');
