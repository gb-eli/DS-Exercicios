import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const root=path.resolve(import.meta.dirname,'../..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const hub=read('index.html');
const hubJs=read('assets/hub.js');
const authHtml=read('auth/index.html');
const authJs=read('auth/auth.js');
const authCss=read('auth/auth.css');
const session=read('core/session/agv-session.js');

assert.match(authHtml,/id="google-btn"/,'botão Google ausente no login único');
assert.match(authHtml,/Continuar com Google/,'rótulo do login Google ausente');
assert.match(authCss,/\.button\.google/,'estilo do botão Google ausente');
assert.match(session,/function signInWithOAuth\(/,'início OAuth não foi implementado na sessão comum');
assert.match(session,/\/auth\/v1\/authorize\?/,'endpoint authorize do Supabase ausente');
assert.match(session,/function consumeAuthRedirect\(/,'retorno OAuth não é consumido');
assert.match(session,/history\?\.replaceState/,'tokens OAuth devem ser removidos da URL após consumo');
assert.match(session,/refresh_token/,'refresh token OAuth deve entrar na sessão compartilhada');
assert.match(authJs,/auth\.signInWithOAuth\('google'/,'login único não chama o Google pelo AGVSession');
assert.match(authJs,/Conta autenticada, mas ainda não cadastrada no AGV/,'conta social sem perfil AGV deve ser bloqueada');
assert.match(authJs,/auth\.signIn\(email,password\)/,'login por e-mail e senha deve permanecer disponível');
assert.match(hubJs,/AGVUnifiedAuth\?\.redirect/,'Hub sem sessão deve encaminhar ao login único');
assert.doesNotMatch(hubJs,/signInWithOAuth|signIn\(email,password\)/,'Hub não deve duplicar autenticação local');
assert.doesNotMatch(`${hub}\n${hubJs}\n${authHtml}\n${authJs}\n${session}`,/GOCSPX-|client[_ -]?secret|service_role|sb_secret_/i,'segredo privilegiado/OAuth exposto no frontend');
assert.match(authHtml,/connect-src 'self' https:\/\/iresvqwyaqotghjssncg\.supabase\.co/,'CSP deve manter conexão restrita ao Supabase');
console.log('PASS p10921-google-oauth-login-v14.10.8.57: Google centralizado em /auth/');
