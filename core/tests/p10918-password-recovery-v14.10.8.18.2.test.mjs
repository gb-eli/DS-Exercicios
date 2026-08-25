import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read=path=>readFile(new URL(`../../${path}`,import.meta.url),'utf8');

test('Hub e Lobby oferecem recuperação por e-mail com redirect dedicado',async()=>{
  const hub=await read('assets/hub.js');
  const lobby=await read('lobby/assets/lobby.js');
  assert.match(hub,/resetPasswordForEmail/);
  assert.match(hub,/reset-password\//);
  assert.match(lobby,/resetPasswordForEmail/);
  assert.match(lobby,/reset-password\//);
  assert.match(hub,/Se a conta existir/);
  assert.match(lobby,/Se a conta existir/);
});

test('Atividades usa a página dedicada de recuperação',async()=>{
  const app=await read('atividades/assets/js/app.js');
  assert.match(app,/\.\.\/reset-password\//);
  assert.match(app,/Se a conta existir/);
});

test('Página de reset só libera alteração após contexto recovery validado',async()=>{
  const page=await read('reset-password/reset-password.js');
  assert.match(page,/recoveryType==='recovery'/);
  assert.match(page,/verifyOtp\(\{token_hash:tokenHash,type:'recovery'\}\)/);
  assert.match(page,/setSession\(\{access_token:accessToken,refresh_token:refreshToken\}\)/);
  assert.match(page,/auth\.getUser\(\)/);
  assert.match(page,/\.eq\('id',user\.id\)/);
  assert.match(page,/!profile\?\.active/);
  assert.match(page,/updateUser\(\{password\}\)/);
  assert.match(page,/signOut\(\{scope:'global'\}\)/);
});

test('AGVSession expõe recover endpoint sem autenticação prévia',async()=>{
  const session=await read('core/session/agv-session.js');
  assert.match(session,/\/auth\/v1\/recover\?redirect_to=/);
  assert.match(session,/resetPasswordForEmail/);
});
