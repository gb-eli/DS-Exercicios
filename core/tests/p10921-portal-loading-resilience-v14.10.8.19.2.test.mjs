import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read=(p)=>readFile(new URL(`../../${p}`,import.meta.url),'utf8');

test('carregamento possui watchdog e timeout nas etapas críticas',async()=>{
  const js=await read('atividades/assets/js/app.js');
  assert.match(js,/GLOBAL_BOOT_WATCHDOG_MS/);
  assert.match(js,/withTimeout\(supabase\.auth\.getUser\(\)/);
  assert.match(js,/withTimeout\([\s\S]*?class_memberships/);
  assert.match(js,/withTimeout\([\s\S]*?class_subjects/);
  assert.match(js,/AGV_BOOT_TIMEOUT/);
});

test('staff e acomodações não podem prender aluno em loading',async()=>{
  const js=await read('atividades/assets/js/app.js');
  assert.match(js,/OPTIONAL_REQUEST_TIMEOUT_MS/);
  assert.match(js,/staff_status/);
  assert.match(js,/Verificação complementar de staff indisponível/);
  assert.match(js,/student_accommodations/);
  assert.match(js,/acesso seguirá com a política padrão/);
});

test('hub de plataformas é assíncrono e não bloqueia dashboard principal',async()=>{
  const js=await read('atividades/assets/js/app.js');
  assert.doesNotMatch(js,/\n\s*await renderPlatformHub\(\);/);
  assert.match(js,/void withTimeout\(renderPlatformHub\(\)/);
  assert.match(js,/platform_hub/);
});

test('tela de recuperação oferece retry e renovação de sessão',async()=>{
  const html=await read('atividades/index.html');
  const js=await read('atividades/assets/js/app.js');
  assert.match(html,/id="loading-detail"/);
  assert.match(html,/id="retry-loading-btn"/);
  assert.match(html,/id="renew-session-btn"/);
  assert.match(js,/retry-loading-btn/);
  assert.match(js,/renew-session-btn/);
  assert.match(js,/Sessão renovada\. Entre novamente/);
});

test('cache bust do hotfix está aplicado ao CSS e entrypoint',async()=>{
  const html=await read('atividades/index.html');
  assert.match(html,/app\.css\?v=14\.10\.8\.(?:19\.2|20)/);
  assert.match(html,/app\.js\?v=14\.10\.8\.(?:19\.2|20)/);
});
