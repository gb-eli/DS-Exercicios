import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read=(p)=>readFile(new URL(`../../${p}`,import.meta.url),'utf8');

test('Página dedicada de recuperação por link permanece pronta para retorno do Resend',async()=>{
  const page=await read('reset-password/reset-password.js');
  assert.match(page,/recoveryType==='recovery'/);
  assert.match(page,/verifyOtp\(\{token_hash:tokenHash,type:'recovery'\}\)/);
  assert.match(page,/updateUser\(\{password/);
});

test('Fluxo antigo por e-mail não é acionado pelas superfícies públicas durante contingência',async()=>{
  const hub=await read('assets/hub.js');
  const activities=await read('atividades/assets/js/app.js');
  const lobby=await read('lobby/assets/lobby.js');
  assert.doesNotMatch(hub,/resetPasswordForEmail\(/);
  assert.doesNotMatch(activities,/resetPasswordForEmail\(/);
  assert.doesNotMatch(lobby,/resetPasswordForEmail\(/);
});
