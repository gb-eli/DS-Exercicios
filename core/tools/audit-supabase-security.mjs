import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const dbDir = path.join(root, 'core', 'database');
const edgeDir = path.join(root, 'core', 'edge-functions');
const findings = [];
const info = [];

function walk(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p)); else out.push(p);
  }
  return out;
}

for (const file of walk(dbDir).filter(f => f.endsWith('.sql'))) {
  const rel = path.relative(root, file).replaceAll('\\', '/');
  const txt = fs.readFileSync(file, 'utf8');
  const funcs = [...txt.matchAll(/create\s+or\s+replace\s+function\s+([^\s(]+)\s*\(([^)]*)\)[\s\S]*?(?=create\s+or\s+replace\s+function|$)/gi)];
  for (const m of funcs) {
    const block = m[0];
    if (!/security\s+definer/i.test(block)) continue;
    const name = m[1];
    const hasRevoke = new RegExp(`revoke[\\s\\S]{0,180}function\\s+${name.replace('.', '\\.')}`, 'i').test(txt);
    if (name.toLowerCase().startsWith('public.') && !hasRevoke) findings.push(`${rel}: SECURITY DEFINER ${name} sem REVOKE explícito no mesmo arquivo`);
    if (!/set\s+search_path\s*(?:=|to)\s*(''|[^;\n]+)/i.test(block)) findings.push(`${rel}: SECURITY DEFINER ${name} sem search_path explícito`);
  }
}

for (const file of walk(root).filter(f => /\.(js|mjs|ts|html|json)$/.test(f) && !f.includes(`${path.sep}core${path.sep}edge-functions${path.sep}`))) {
  const txt = fs.readFileSync(file, 'utf8');
  if (/SUPABASE_SERVICE_ROLE_KEY\s*[:=]|['\"]service_role['\"]\s*[:=]/i.test(txt) && !file.includes(`${path.sep}core${path.sep}tests${path.sep}`)) {
    const rel = path.relative(root, file).replaceAll('\\', '/');
    findings.push(`${rel}: possível segredo/configuração service_role fora de Edge Function`);
  }
}

const privileged = ['staff-dashboard','admin-profile-user','admin-roster','staff-directory','agv-teacher-activity','security-telemetry'];
for (const fn of privileged) {
  const file = path.join(edgeDir, fn, 'index.ts');
  const txt = fs.readFileSync(file, 'utf8');
  if (!/must_change_password/.test(txt)) findings.push(`core/edge-functions/${fn}/index.ts: sem gate must_change_password`);
  info.push(`${fn}: gate senha temporária presente`);
}

const revokeSql = fs.readFileSync(path.join(dbDir, '030_p76_auth_session_revocation.sql'), 'utf8');
for (const sig of ['admin_auth_session_count_service(uuid)','admin_revoke_auth_sessions_service(uuid)']) {
  if (!new RegExp(`revoke all on function public\\.${sig.replace(/[()]/g, x => `\\${x}`)} from public, anon, authenticated`, 'i').test(revokeSql)) {
    findings.push(`030_p76_auth_session_revocation.sql: falta REVOKE para ${sig}`);
  }
}

console.log('P7.6 Supabase security audit (local snapshot)');
for (const i of info) console.log('INFO', i);
if (findings.length) {
  for (const f of findings) console.error('FAIL', f);
  process.exit(1);
}
console.log('PASS: nenhum achado bloqueante no snapshot local.');
console.log('OBS: isto NÃO substitui Security Advisors/RLS/grants do projeto Supabase ao vivo.');
