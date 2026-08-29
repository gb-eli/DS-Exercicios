import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const root=path.resolve(import.meta.dirname,'../..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const hub=read('index.html');
const hubJs=read('assets/hub.js');
const session=read('core/session/agv-session.js');
const css=read('assets/hub.css');

assert.match(hub,/id="google-login-btn"/,'botão Google ausente no Hub');
assert.match(hub,/Entrar com Google/,'rótulo do login Google ausente');
assert.match(css,/\.google-auth-btn/,'estilo do botão Google ausente');
assert.match(session,/function signInWithOAuth\(/,'início OAuth não foi implementado na sessão comum');
assert.match(session,/\/auth\/v1\/authorize\?/,'endpoint authorize do Supabase ausente');
assert.match(session,/function consumeAuthRedirect\(/,'retorno OAuth não é consumido');
assert.match(session,/history\?\.replaceState/,'tokens OAuth devem ser removidos da URL após consumo');
assert.match(session,/refresh_token/,'refresh token OAuth deve entrar na sessão compartilhada');
assert.match(hubJs,/auth\.signInWithOAuth\('google'/,'Hub não chama o Google pelo AGVSession');
assert.match(hubJs,/Esta conta foi autenticada, mas ainda não está cadastrada no AGV/,'conta social sem perfil AGV deve ser bloqueada');
assert.match(hubJs,/auth\.signIn\(email,password\)/,'login por e-mail e senha deve permanecer disponível');
assert.doesNotMatch(`${hub}\n${hubJs}\n${session}`,/GOCSPX-|client[_ -]?secret|service_role|sb_secret_/i,'segredo privilegiado/OAuth exposto no frontend');
assert.match(hub,/connect-src 'self' https:\/\/iresvqwyaqotghjssncg\.supabase\.co/,'CSP deve manter conexão restrita ao Supabase');
console.log('PASS p10921-google-oauth-login-v14.10.8.57');
