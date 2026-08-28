import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL(`../../${p}`,import.meta.url),'utf8');
const lab=read('sistemas/01-lab-virtual/LABDS/lab/js/agv-core-bridge.js');
const ctf=read('sistemas/02-ctf-ds/ctf/js/core/agv-core-bridge.js');
test('P6.7 wave2 Lab Virtual reuses canonical ecosystem session',()=>{assert.match(lab,/sb-iresvqwyaqotghjssncg-auth-token/);assert.match(lab,/localStorage/);assert.match(lab,/LEGACY_SESSION_KEY/);assert.doesNotMatch(lab,/const store=\(\)=>sessionStorage/);});
test('P6.7 wave2 CTF bridge is a valid Core ES module surface',()=>{for(const name of ['centralSignIn','changeCentralPassword','centralSignOut','loadCoreCTFState','completeCoreChallenge','startCoreLesson','completeCoreLesson','recordCoreToolUse','syncCoreDaily','purchaseCoreHint','purchaseCoreStoreItem'])assert.match(ctf,new RegExp(`export (?:async function|const) ${name}`));assert.match(ctf,/ctf-complete-challenge/);assert.match(ctf,/ctf-core-actions/);});
test('P6.7 wave2 CTF uses canonical session and keeps rewards server-side',()=>{assert.match(ctf,/sb-iresvqwyaqotghjssncg-auth-token/);assert.match(ctf,/localStorage/);assert.doesNotMatch(ctf,/service_role/i);assert.doesNotMatch(ctf,/claim_core_reward/);});
