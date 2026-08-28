const reservedHosts = Object.freeze([
  { ip: '10.20.8.12', name: 'mail-gateway', type: 'Gateway', os: 'SentinelOS', services: ['25/tcp', '443/tcp'], risk: 'baixo' },
  { ip: '10.20.8.23', name: 'finance-ws-07', type: 'Estação', os: 'Windows Lab', services: ['445/tcp', '5985/tcp'], risk: 'alto' },
  { ip: '10.20.8.31', name: 'mobile-test-03', type: 'Dispositivo móvel', os: 'Android Lab', services: ['5555/tcp'], risk: 'médio' },
  { ip: '10.20.8.44', name: 'storage-node', type: 'Storage', os: 'ObjectLab', services: ['443/tcp'], risk: 'médio' },
]);

const inbox = Object.freeze([
  { id: 'mail-01', from: 'alertas@sentinel.local', replyTo: 'alertas@sentinel.local', subject: 'Alerta de autenticação fora do horário', time: '02:18', status: 'interno', attachment: '', preview: 'A conta de laboratório registrou um acesso fora do perfil esperado.' },
  { id: 'mail-02', from: 'suporte@conta-segura.example', replyTo: 'verificacao@portal-confirmacao.example', subject: 'URGENTE: confirme sua credencial', time: '02:21', status: 'suspeito', attachment: 'verificar-conta.html', preview: 'A mensagem usa urgência e um domínio diferente no campo de resposta.' },
  { id: 'mail-03', from: 'infra@sentinel.local', replyTo: 'infra@sentinel.local', subject: 'Janela de manutenção concluída', time: '01:40', status: 'interno', attachment: 'relatorio-manutencao.txt', preview: 'Comunicado previsto sobre a manutenção do ambiente fictício.' },
]);

const browserScenario = Object.freeze({
  url: 'https://portal-ficticio.example/login?next=%2Ffinanceiro',
  certificate: { issuer: 'Sentinel Training CA', valid: true, hostMatch: true, expires: '2027-08-03' },
  cookies: [
    { name: 'session_lab', flags: 'Secure; HttpOnly; SameSite=Lax' },
    { name: 'theme', flags: 'SameSite=Lax' },
  ],
  requests: [
    { method: 'GET', path: '/login', status: 200, type: 'document', duration: 84 },
    { method: 'POST', path: '/api/session', status: 401, type: 'fetch', duration: 121 },
    { method: 'GET', path: '/assets/app.js', status: 200, type: 'script', duration: 36 },
  ],
});

const mobileApps = Object.freeze([
  { id: 'app-bank', name: 'Banco Escola', package: 'edu.sentinel.bank', permissions: ['internet', 'biometria'], storage: 'Keystore/Keychain', status: 'revisado' },
  { id: 'app-helper', name: 'Assistente QR', package: 'example.qr.helper', permissions: ['camera', 'contatos', 'microfone', 'localizacao'], storage: 'arquivo local', status: 'atenção' },
  { id: 'app-chat', name: 'Chat Interno', package: 'edu.sentinel.chat', permissions: ['internet', 'notificacoes'], storage: 'token curto no armazenamento seguro', status: 'revisado' },
]);

const logEvents = Object.freeze([
  { time: '02:14:03', source: 'auth', level: 'WARN', user: 'analista-07', ip: '10.20.8.23', event: 'password_reset' },
  { time: '02:16:12', source: 'auth', level: 'FAIL', user: 'analista-07', ip: '10.20.8.23', event: 'mfa_failed' },
  { time: '02:16:29', source: 'auth', level: 'FAIL', user: 'analista-07', ip: '10.20.8.23', event: 'mfa_failed' },
  { time: '02:17:01', source: 'finance', level: 'ALERT', user: 'analista-07', ip: '10.20.8.23', event: 'rapid_transfers' },
  { time: '02:19:44', source: 'gateway', level: 'INFO', user: 'system', ip: '10.20.8.12', event: 'containment_started' },
]);

const socAlerts = Object.freeze([
  { id: 'A-1042', severity: 'alta', title: 'Sequência de autenticação e transação', source: 'Identity + Finance', status: 'novo' },
  { id: 'A-1043', severity: 'média', title: 'Dispositivo móvel com permissões excessivas', source: 'Mobile', status: 'triagem' },
  { id: 'A-1044', severity: 'baixa', title: 'Mudança de política em storage fictício', source: 'Cloud', status: 'monitorando' },
]);

export const SIMULATOR_SCENARIOS = Object.freeze({
  email: { inbox },
  browser: browserScenario,
  mobile: { apps: mobileApps, notifications: ['Nova sessão iniciada às 02:17', 'Aplicativo Assistente QR solicitou acesso aos contatos'] },
  logs: { events: logEvents },
  network: { devices: reservedHosts },
  soc: { alerts: socAlerts, playbook: ['Confirmar escopo', 'Preservar evidências', 'Conter impacto', 'Validar recuperação'] },
});

export const MISSION_SIMULATOR_MAP = Object.freeze({
  'pix-02': 'sim-soc',
  'crypto-ledger-01': 'sim-loglab',
  'mobile-storage-01': 'sim-mobile',
  'cloud-bucket-01': 'sim-browser',
  'memory-01': 'sim-loglab',
  'xss-fix-01': 'sim-browser',
  'headers-01': 'sim-browser',
  'entropy-math-01': 'sim-soc',
  'dns-mail-01': 'sim-email',
  'fraud-math-01': 'sim-soc',
  'network-02': 'sim-netscan',
  'intro-01': 'sim-email',
  'mobile-permissions-01': 'sim-mobile',
  'pcap-01': 'sim-netscan',
  'bank-01': 'sim-soc',
});

export const getMissionSimulator = (missionId) => MISSION_SIMULATOR_MAP[missionId] || '';
