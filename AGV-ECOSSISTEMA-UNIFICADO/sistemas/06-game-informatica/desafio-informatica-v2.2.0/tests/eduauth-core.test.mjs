import assert from 'node:assert/strict';
import fs from 'node:fs';
import {
  parseRequestCode, generatePin, validatePinForRequest, validateRequestFreshness,
  verifySignedGrant, codeFor, createRequest
} from '../assets/js/eduauth/core.js';
import { savePendingRequest, getPendingRequest, consumeRequest, consumeAuthorization, incrementAttempt, remainingAttempts } from '../assets/js/eduauth/storage.js';
import { createPasswordEnvelope, unwrapPasswordEnvelope, importDataKey, encryptPayload, decryptPayload, createRecoveryEnvelope } from '../assets/js/storage.js';

const vectors=JSON.parse(fs.readFileSync(new URL('../eduauth/eduauth-test-vectors.json',import.meta.url),'utf8'));
const byId=id=>vectors.vectors.find(v=>v.id===id);
let passed=0;
const test=async(name,fn)=>{try{await fn();passed++;console.log(`✓ ${name}`)}catch(error){console.error(`✗ ${name}\n`,error);process.exitCode=1}};

await test('mecanismo legado de senha fixa permanece determinístico, embora não seja usado no acesso às aulas',async()=>{
  const first=await createRequest({actionId:'lesson-start',classId:'1ADM',lessonId:'1ADM-04',activityId:'guided-lesson',resourceId:'1ADM-04',nowMs:Date.parse('2026-08-04T12:00:00Z')});
  const later=await createRequest({actionId:'lesson-start',classId:'1ADM',lessonId:'1ADM-04',activityId:'guided-lesson',resourceId:'1ADM-04',nowMs:Date.parse('2026-09-04T12:00:00Z')});
  assert.equal(first.pin,later.pin);assert.equal(validateRequestFreshness(first.context,{nowMs:Date.parse('2027-01-01T00:00:00Z')}),true);
});
await test('código coletivo da turma vale somente na hora atual',async()=>{
  const now=Date.parse('2026-08-04T15:15:00Z');const request=await createRequest({actionId:'early-completion',classId:'1ADM',lessonId:'platform-general',activityId:'class-release',resourceId:'platform-general',nowMs:now});
  assert.equal((await validatePinForRequest(request,request.pin,{nowMs:now+20*60*1000})).valid,true);
  assert.equal((await validatePinForRequest(request,request.pin,{nowMs:now+60*60*1000})).valid,false);
});
await test('código coletivo muda entre turmas e horas',async()=>{
  const now=Date.parse('2026-08-04T15:15:00Z');const a=await createRequest({actionId:'early-completion',classId:'1ADM',lessonId:'platform-general',activityId:'class-release',resourceId:'platform-general',nowMs:now});const b=await createRequest({actionId:'early-completion',classId:'2ADM',lessonId:'platform-general',activityId:'class-release',resourceId:'platform-general',nowMs:now});const c=await createRequest({actionId:'early-completion',classId:'1ADM',lessonId:'platform-general',activityId:'class-release',resourceId:'platform-general',nowMs:now+60*60*1000});assert.notEqual(a.pin,b.pin);assert.notEqual(a.pin,c.pin);
});
await test('mecanismo legado mantém escopo por aula',async()=>{
  const first=await createRequest({actionId:'lesson-start',classId:'1ADM',lessonId:'1ADM-04',activityId:'guided-lesson',resourceId:'1ADM-04'});const second=await createRequest({actionId:'lesson-start',classId:'1ADM',lessonId:'1ADM-05',activityId:'guided-lesson',resourceId:'1ADM-05'});assert.notEqual(first.pin,second.pin);
});
await test('erro de digitação ou checksum é rejeitado',async()=>{
  for(const id of ['request-typo','checksum-invalid'])assert.throws(()=>parseRequestCode(byId(id).requestCode));
});
await test('código individual de recuperação reproduz o PIN esperado',async()=>{
  const now=Date.parse('2026-08-04T15:15:00Z');const request=await createRequest({actionId:'profile-recovery',classId:'1ADM',lessonId:'platform-general',activityId:'profile',resourceId:'profile-test',profileId:'profile-test',nowMs:now});assert.equal((await validatePinForRequest(request,request.pin,{nowMs:now+60*1000})).valid,true);
});
await test('PIN individual de recuperação é vinculado à sessão',async()=>{
  const request=await createRequest({actionId:'profile-recovery',classId:'1ADM',lessonId:'platform-general',activityId:'profile',resourceId:'profile-test',profileId:'profile-test'});assert.notEqual(await generatePin({...request.context,sessionNonce:'000000'}),request.pin);
});
await test('PIN individual de recuperação expira',async()=>{
  const now=Date.parse('2026-08-04T15:15:00Z');const request=await createRequest({actionId:'profile-recovery',classId:'1ADM',lessonId:'platform-general',activityId:'profile',resourceId:'profile-test',profileId:'profile-test',nowMs:now});const result=await validatePinForRequest(request,request.pin,{nowMs:(request.context.expiresAt+1)*1000});assert.equal(result.valid,false);assert.equal(result.reason,'expired');
});
await test('autorização não muda de ação',async()=>{
  const v=byId('unauthorized-action'),base=parseRequestCode(v.requestCode).context;
  assert.notEqual(await generatePin({...base,...v.mutatedContext}),v.pin);
});
await test('versão incompatível é rejeitada',async()=>assert.throws(()=>parseRequestCode(byId('incompatible-version').requestCode)));
await test('registro desconhecido é rejeitado',async()=>assert.throws(()=>codeFor('lessons','nao-cadastrada')));

await test('validade individual de recuperação preserva o TTL completo',async()=>{
  const request=await createRequest({actionId:'profile-recovery',classId:'1ADM',lessonId:'platform-general',activityId:'profile',resourceId:'profile-test',profileId:'profile-test'});assert.equal(request.context.expiresAt-request.context.issuedAt,180);assert.equal(request.context.issuedAt%5,0);
});
await test('solicitação individual é consumida uma única vez na sessão',async()=>{
  const memory=new Map();globalThis.sessionStorage={getItem:key=>memory.has(key)?memory.get(key):null,setItem:(key,value)=>memory.set(key,String(value)),removeItem:key=>memory.delete(key)};
  const request=await createRequest({actionId:'profile-recovery',classId:'1ADM',lessonId:'platform-general',activityId:'profile',resourceId:'profile-session-test',profileId:'profile-session-test'});
  savePendingRequest(request);assert.equal(getPendingRequest('profile-recovery','profile-session-test').context.requestId,request.context.requestId);
  consumeRequest(request);assert.equal(consumeAuthorization('profile-recovery','profile-session-test'),true);assert.equal(consumeAuthorization('profile-recovery','profile-session-test'),false);
});
await test('cinco tentativas esgotam a solicitação local',async()=>{
  const memory=new Map();globalThis.sessionStorage={getItem:key=>memory.has(key)?memory.get(key):null,setItem:(key,value)=>memory.set(key,String(value)),removeItem:key=>memory.delete(key)};
  const request=await createRequest({actionId:'result-release',classId:'1ADM',lessonId:'diagnostico',activityId:'diagnostic-class',resourceId:'resultado'});savePendingRequest(request);
  let current;for(let i=0;i<5;i++)current=incrementAttempt('result-release','resultado');assert.equal(remainingAttempts(current),0);
});

await test('envelope da senha protege e recupera a chave de dados',async()=>{
  const raw=crypto.getRandomValues(new Uint8Array(32)),envelope=await createPasswordEnvelope(raw,'senha-de-teste-forte');
  const recovered=await unwrapPasswordEnvelope(envelope,'senha-de-teste-forte');assert.deepEqual([...recovered],[...raw]);
  await assert.rejects(()=>unwrapPasswordEnvelope(envelope,'senha-incorreta'));
});
await test('chave aleatória cifra e decifra os dados do perfil',async()=>{
  const raw=crypto.getRandomValues(new Uint8Array(32)),key=await importDataKey(raw),payload={profile:{id:'teste',name:'Aluno'},progress:{aula:1}};
  const data=await encryptPayload(payload,key),recovered=await decryptPayload({formatVersion:2,crypto:{data}},key);assert.deepEqual(recovered,payload);
});
await test('envelope de recuperação usa somente a chave pública',async()=>{
  const raw=crypto.getRandomValues(new Uint8Array(32)),envelope=await createRecoveryEnvelope(raw);assert.equal(envelope.algorithm,'RSA-OAEP-256');assert.equal(envelope.environment,'development');assert.ok(envelope.wrappedDataKey.length>200);
});
await test('autorização assinada válida é verificada',async()=>{
  const v=byId('signed-valid');const result=await verifySignedGrant(v.token,{platformId:v.payload.platformId,actionId:v.payload.actionId,resourceIdHash:v.payload.resourceIdHash,sessionId:v.payload.sessionId});assert.equal(result.valid,true);
});
await test('autorização assinada alterada é rejeitada',async()=>assert.equal((await verifySignedGrant(byId('signed-altered').token)).valid,false));

if(process.exitCode)throw new Error('Falha nos testes EduAuth Core.');
console.log(`\n${passed} testes EduAuth Core aprovados.`);
