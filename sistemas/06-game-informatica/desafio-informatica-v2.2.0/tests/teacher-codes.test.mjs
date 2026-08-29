import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {LESSONS} from '../assets/js/data.js';
import {getLessonCodeSnapshot,getClassReleaseCodeSnapshot,getAuthorizationPinSnapshot} from '../assets/js/teacher-codes.js';
import {createRequest,validatePinForRequest} from '../assets/js/eduauth/core.js';
let passed=0;const test=async(name,fn)=>{try{await fn();passed++;console.log(`✓ ${name}`)}catch(error){console.error(`✗ ${name}
`,error);process.exitCode=1}};
const fixedNow=Date.parse('2026-08-06T15:15:00Z');
await test('aulas informam acesso aberto sem PIN',async()=>{const lesson=LESSONS.find(item=>item.id==='1ADM-04');const snapshot=await getLessonCodeSnapshot({lesson,nowMs:fixedNow});assert.equal(snapshot.openAccess,true);assert.equal(snapshot.pin,'');assert.equal(snapshot.code,'')});
await test('código coletivo respeita a hora atual',async()=>{const snapshot=await getClassReleaseCodeSnapshot({classId:'1ADM',nowMs:fixedNow});assert.ok(snapshot.secondsRemaining>0&&snapshot.secondsRemaining<=3600);const next=await getClassReleaseCodeSnapshot({classId:'1ADM',nowMs:fixedNow+3600*1000});assert.notEqual(snapshot.pin,next.pin)});
await test('turmas diferentes recebem códigos coletivos diferentes',async()=>{const a=await getClassReleaseCodeSnapshot({classId:'1ADM',nowMs:fixedNow});const b=await getClassReleaseCodeSnapshot({classId:'2ADM',nowMs:fixedNow});assert.notEqual(a.pin,b.pin)});
await test('leitura técnica do código coletivo reproduz o PIN',async()=>{const request=await createRequest({actionId:'early-completion',classId:'1ADM',lessonId:'platform-general',activityId:'class-release',resourceId:'platform-general',nowMs:fixedNow});const snapshot=await getAuthorizationPinSnapshot(request.code,{nowMs:fixedNow});assert.equal(snapshot.pin,request.pin);assert.equal((await validatePinForRequest(request,request.pin,{nowMs:fixedNow})).valid,true)});
await test('painel informa acesso livre e mantém revisão de aulas',async()=>{const source=await fs.readFile(new URL('../assets/js/teacher-codes.js',import.meta.url),'utf8');assert.match(source,/ACESSO LIVRE/);assert.match(source,/Aulas abertas e liberação coletiva/);assert.match(source,/1ADM-04/);assert.match(source,/2ADM-01/);assert.doesNotMatch(source,/Copiar senha da aula/)});
if(process.exitCode)throw new Error('Falha nos testes do painel de acesso.');console.log(`
${passed} testes do painel de acesso aprovados.`);
