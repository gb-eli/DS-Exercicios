import { escapeHtml } from '../core/utils.js';
import { SIMULATOR_SCENARIOS } from '../data/simulator-scenarios.js';

export const simulatorCatalog = Object.freeze([
  { id: 'sim-email', label: 'E-mail Lab', icon: 'MAIL', category: 'Comunicação' },
  { id: 'sim-browser', label: 'Navegador Lab', icon: 'WEB', category: 'Web' },
  { id: 'sim-mobile', label: 'Celular Lab', icon: 'MOB', category: 'Mobile' },
  { id: 'sim-loglab', label: 'Log Lab', icon: 'LOG', category: 'Investigação' },
  { id: 'sim-netscan', label: 'Scanner de Rede', icon: 'NET', category: 'Redes' },
  { id: 'sim-soc', label: 'Central SOC', icon: 'SOC', category: 'Operações' },
]);

export const isSimulationTool = (toolId = '') => simulatorCatalog.some((tool) => tool.id === toolId);

const hiddenContext = (missionId = '') => `<input type="hidden" name="missionId" value="${escapeHtml(missionId || 'demo')}">`;
const simulatorHeader = (title, subtitle, status = 'AMBIENTE FICTÍCIO') => `<div class="simulator-topbar"><div><span>${escapeHtml(status)}</span><h2>${escapeHtml(title)}</h2><p>${escapeHtml(subtitle)}</p></div><div class="simulator-live"><i></i> LOCAL · SEM REDE REAL</div></div>`;
const output = () => '<pre class="tool-result simulator-output" data-tool-output>Selecione uma ação no simulador.</pre>';

const renderEmail = (missionId) => {
  const messages = SIMULATOR_SCENARIOS.email.inbox;
  return `${simulatorHeader('Sentinel Mail', 'Caixa de e-mail simulada com cabeçalhos, anexos e validação de domínio.')}
  <div class="simulator-window email-simulator">
    <aside class="sim-mail-folders"><strong>CAIXAS</strong><button class="active" type="button">Entrada <b>${messages.length}</b></button><button type="button">Enviados</button><button type="button">Spam</button><button type="button">Quarentena</button></aside>
    <section class="sim-mail-list">${messages.map((mail, index) => `<label class="sim-mail-row ${mail.status === 'suspeito' ? 'warning' : ''}"><input type="radio" name="messageId" value="${escapeHtml(mail.id)}" ${index === 0 ? 'checked' : ''}><span><b>${escapeHtml(mail.from)}</b><strong>${escapeHtml(mail.subject)}</strong><small>${escapeHtml(mail.preview)}</small></span><time>${escapeHtml(mail.time)}</time></label>`).join('')}</section>
    <section class="sim-mail-reader"><div class="sim-mail-placeholder"><span>✉</span><strong>Selecione uma mensagem</strong><p>Depois valide remetente, Reply-To, domínio e anexo sem abrir conteúdo externo.</p></div></section>
  </div>
  <form class="simulator-actions" data-tool-form="sim-email">${hiddenContext(missionId)}<label>MENSAGEM<select name="messageId">${messages.map((mail) => `<option value="${escapeHtml(mail.id)}">${escapeHtml(mail.subject)}</option>`).join('')}</select></label><label>AÇÃO<select name="action"><option value="headers">Validar cabeçalhos</option><option value="domain">Comparar domínio e Reply-To</option><option value="attachment">Inspecionar anexo sem executar</option><option value="classify">Classificar mensagem</option></select></label><button class="primary-button" type="submit">EXECUTAR ANÁLISE LOCAL</button></form>${output()}`;
};

const renderBrowser = (missionId) => {
  const scenario = SIMULATOR_SCENARIOS.browser;
  return `${simulatorHeader('Sentinel Browser', 'Navegador isolado para estudar URL, certificado, cookies e requisições fictícias.')}
  <div class="simulator-window browser-simulator"><div class="sim-browser-tabs"><button class="active" type="button">Portal fictício</button><button type="button">+</button></div><div class="sim-address-bar"><span>🔒</span><input value="${escapeHtml(scenario.url)}" readonly aria-label="Endereço fictício"><button type="button">⋮</button></div><div class="sim-browser-page"><div class="sim-login-card"><span>SENTINEL PORTAL</span><h3>Ambiente de treinamento</h3><label>Usuário<input value="analista-07" readonly></label><label>Senha<input value="••••••••" readonly></label><button type="button">ENTRAR</button></div></div><div class="sim-devtools"><header><button class="active" type="button">Rede</button><button type="button">Armazenamento</button><button type="button">Segurança</button></header><div>${scenario.requests.map((req) => `<span><b>${req.method}</b><code>${escapeHtml(req.path)}</code><em>${req.status}</em><small>${req.duration} ms</small></span>`).join('')}</div></div></div>
  <form class="simulator-actions" data-tool-form="sim-browser">${hiddenContext(missionId)}<label>PAINEL<select name="action"><option value="url">Inspecionar URL</option><option value="certificate">Validar certificado</option><option value="cookies">Revisar cookies</option><option value="network">Correlacionar requisições</option><option value="headers">Avaliar cabeçalhos</option></select></label><button class="primary-button" type="submit">INSPECIONAR NO SANDBOX</button></form>${output()}`;
};

const renderMobile = (missionId) => {
  const scenario = SIMULATOR_SCENARIOS.mobile;
  return `${simulatorHeader('Sentinel Mobile', 'Celular virtual para revisar aplicativos, permissões, notificações e armazenamento.')}
  <div class="mobile-simulator-shell"><div class="sim-phone"><div class="sim-phone-notch"></div><div class="sim-phone-status"><span>09:41</span><span>5G ▮▮▮ ◉</span></div><div class="sim-phone-screen"><div class="sim-mobile-alert">${escapeHtml(scenario.notifications[1])}</div><div class="sim-app-grid">${scenario.apps.map((app) => `<label><input type="radio" name="appId" value="${escapeHtml(app.id)}"><span>${escapeHtml(app.name.slice(0, 2).toUpperCase())}</span><small>${escapeHtml(app.name)}</small></label>`).join('')}</div></div><div class="sim-phone-home"></div></div><section class="sim-mobile-details"><h3>PAINEL DO DISPOSITIVO</h3>${scenario.apps.map((app) => `<article><div><strong>${escapeHtml(app.name)}</strong><small>${escapeHtml(app.package)}</small></div><span class="risk-${app.status === 'atenção' ? 'high' : 'low'}">${escapeHtml(app.status)}</span><p>Permissões: ${escapeHtml(app.permissions.join(', '))}</p><p>Armazenamento: ${escapeHtml(app.storage)}</p></article>`).join('')}</section></div>
  <form class="simulator-actions" data-tool-form="sim-mobile">${hiddenContext(missionId)}<label>APLICATIVO<select name="appId">${scenario.apps.map((app) => `<option value="${escapeHtml(app.id)}">${escapeHtml(app.name)}</option>`).join('')}</select></label><label>AÇÃO<select name="action"><option value="permissions">Auditar permissões</option><option value="storage">Revisar armazenamento</option><option value="notifications">Correlacionar notificações</option><option value="contain">Simular contenção</option></select></label><button class="primary-button" type="submit">ANALISAR DISPOSITIVO</button></form>${output()}`;
};

const renderLogs = (missionId) => {
  const events = SIMULATOR_SCENARIOS.logs.events;
  return `${simulatorHeader('Sentinel Log Lab', 'Console de correlação com filtros sobre registros preparados para a missão.')}
  <div class="simulator-window log-simulator"><header><div><span>EVENTOS</span><b>${events.length}</b></div><div><span>ALERTAS</span><b>${events.filter((event) => event.level === 'ALERT').length}</b></div><div><span>FONTES</span><b>${new Set(events.map((event) => event.source)).size}</b></div></header><div class="sim-log-toolbar"><input value="source:* AND time:[02:14 TO 02:20]" readonly><button type="button">PESQUISAR</button></div><div class="sim-log-table"><div class="head"><span>HORA</span><span>NÍVEL</span><span>FONTE</span><span>USUÁRIO</span><span>ORIGEM</span><span>EVENTO</span></div>${events.map((event) => `<div class="level-${event.level.toLowerCase()}"><time>${event.time}</time><b>${event.level}</b><span>${event.source}</span><span>${event.user}</span><code>${event.ip}</code><strong>${event.event}</strong></div>`).join('')}</div></div>
  <form class="simulator-actions" data-tool-form="sim-loglab">${hiddenContext(missionId)}<label>ANÁLISE<select name="action"><option value="failures">Filtrar falhas</option><option value="source">Agrupar por origem</option><option value="timeline">Montar linha do tempo</option><option value="correlate">Correlacionar identidade e transação</option></select></label><button class="primary-button" type="submit">EXECUTAR CONSULTA LOCAL</button></form>${output()}`;
};

const renderNetwork = (missionId) => {
  const devices = SIMULATOR_SCENARIOS.network.devices;
  return `${simulatorHeader('Sentinel Network Scanner', 'Inventário passivo de uma rede totalmente fictícia; nenhuma varredura real é executada.')}
  <div class="simulator-window network-simulator"><div class="sim-network-map"><i class="core"></i>${devices.map((device, index) => `<button type="button" class="node risk-${escapeHtml(device.risk)}" style="--node:${index}" title="${escapeHtml(device.name)}"><span>${escapeHtml(device.type.slice(0, 2).toUpperCase())}</span><small>${escapeHtml(device.ip)}</small></button>`).join('')}<svg viewBox="0 0 100 60" preserveAspectRatio="none" aria-hidden="true"><path d="M50 30 L20 12 M50 30 L80 12 M50 30 L20 48 M50 30 L80 48"></path></svg></div><section class="sim-device-table"><header><span>DISPOSITIVO</span><span>IP RESERVADO</span><span>SERVIÇOS</span><span>RISCO</span></header>${devices.map((device) => `<article><strong>${escapeHtml(device.name)}<small>${escapeHtml(device.type)} · ${escapeHtml(device.os)}</small></strong><code>${escapeHtml(device.ip)}</code><span>${escapeHtml(device.services.join(', '))}</span><em class="risk-${escapeHtml(device.risk)}">${escapeHtml(device.risk)}</em></article>`).join('')}</section></div>
  <form class="simulator-actions" data-tool-form="sim-netscan">${hiddenContext(missionId)}<label>AÇÃO<select name="action"><option value="inventory">Inventário passivo</option><option value="services">Comparar serviços</option><option value="anomaly">Identificar anomalia</option><option value="isolate">Simular isolamento</option></select></label><button class="primary-button" type="submit">PROCESSAR REDE FICTÍCIA</button></form>${output()}`;
};

const renderSoc = (missionId) => {
  const scenario = SIMULATOR_SCENARIOS.soc;
  return `${simulatorHeader('Sentinel Operations Center', 'Central de operações para correlacionar alertas, evidências e resposta defensiva.')}
  <div class="simulator-window soc-simulator"><section class="soc-kpis"><article><span>ALERTAS ABERTOS</span><strong>${scenario.alerts.length}</strong></article><article><span>CASOS EM TRIAGEM</span><strong>02</strong></article><article><span>ATIVOS PROTEGIDOS</span><strong>14</strong></article><article><span>RISCO ATUAL</span><strong>72</strong></article></section><div class="soc-main"><section class="soc-alerts"><header>FILA DE ALERTAS</header>${scenario.alerts.map((alert) => `<label class="severity-${escapeHtml(alert.severity)}"><input type="radio" name="alertId" value="${escapeHtml(alert.id)}"><b>${escapeHtml(alert.id)}</b><span><strong>${escapeHtml(alert.title)}</strong><small>${escapeHtml(alert.source)} · ${escapeHtml(alert.status)}</small></span><em>${escapeHtml(alert.severity)}</em></label>`).join('')}</section><section class="soc-playbook"><header>PLAYBOOK</header>${scenario.playbook.map((step, index) => `<article><b>${String(index + 1).padStart(2, '0')}</b><span>${escapeHtml(step)}</span><i class="${index < 2 ? 'done' : ''}"></i></article>`).join('')}</section></div></div>
  <form class="simulator-actions" data-tool-form="sim-soc">${hiddenContext(missionId)}<label>ALERTA<select name="alertId">${scenario.alerts.map((alert) => `<option value="${escapeHtml(alert.id)}">${escapeHtml(alert.id)} — ${escapeHtml(alert.title)}</option>`).join('')}</select></label><label>AÇÃO<select name="action"><option value="triage">Executar triagem</option><option value="correlate">Correlacionar sinais</option><option value="contain">Simular contenção</option><option value="report">Gerar resumo do caso</option></select></label><button class="primary-button" type="submit">ATUALIZAR OPERAÇÃO</button></form>${output()}`;
};

export const renderSimulationWorkspace = (toolId, context = {}) => {
  const missionId = context?.missionId || '';
  switch (toolId) {
    case 'sim-email': return renderEmail(missionId);
    case 'sim-browser': return renderBrowser(missionId);
    case 'sim-mobile': return renderMobile(missionId);
    case 'sim-loglab': return renderLogs(missionId);
    case 'sim-netscan': return renderNetwork(missionId);
    case 'sim-soc': return renderSoc(missionId);
    default: return '';
  }
};

const missionLine = (formData) => `Missão: ${String(formData.get('missionId') || 'demonstração local')}`;

export const runSimulation = async (toolId, formData) => {
  const action = String(formData.get('action') || 'inspect');
  if (toolId === 'sim-email') {
    const mail = SIMULATOR_SCENARIOS.email.inbox.find((item) => item.id === formData.get('messageId')) || SIMULATOR_SCENARIOS.email.inbox[0];
    const reports = {
      headers: `REMETENTE: ${mail.from}\nREPLY-TO: ${mail.replyTo}\nSTATUS: ${mail.from === mail.replyTo ? 'campos coerentes' : 'divergência encontrada'}\nANEXO: ${mail.attachment || 'nenhum'}`,
      domain: `DOMÍNIO DO FROM: ${mail.from.split('@')[1]}\nDOMÍNIO DO REPLY-TO: ${mail.replyTo.split('@')[1]}\nRESULTADO: ${mail.from.split('@')[1] === mail.replyTo.split('@')[1] ? 'coincidem' : 'não coincidem; validar por canal oficial'}`,
      attachment: `ANEXO: ${mail.attachment || 'nenhum'}\nAÇÃO SEGURA: manter em quarentena e analisar sem execução.`,
      classify: `CLASSIFICAÇÃO FORMATIVA: ${mail.status === 'suspeito' ? 'mensagem com sinais que exigem reporte e validação' : 'mensagem interna prevista no cenário'}`,
    };
    return `${missionLine(formData)}\n${reports[action] || reports.headers}\n\nNenhum e-mail real foi acessado ou enviado.`;
  }
  if (toolId === 'sim-browser') {
    const scenario = SIMULATOR_SCENARIOS.browser;
    const reports = {
      url: `ESQUEMA: HTTPS\nHOST: portal-ficticio.example\nROTA: /login\nPARÂMETRO: next=/financeiro\nAÇÃO: validar destino e autorização antes do redirecionamento.`,
      certificate: `EMISSOR: ${scenario.certificate.issuer}\nHOST CORRESPONDE: sim\nVALIDADE: ${scenario.certificate.expires}\nOBSERVAÇÃO: certificado válido não garante que a página ou solicitação seja legítima.`,
      cookies: scenario.cookies.map((cookie) => `${cookie.name}: ${cookie.flags}`).join('\n'),
      network: scenario.requests.map((req) => `${req.method} ${req.path} → ${req.status} (${req.duration} ms)`).join('\n'),
      headers: `CHECKLIST: CSP, HSTS, nosniff e Referrer-Policy devem ser avaliados em conjunto; CORS irrestrito exige justificativa explícita.`,
    };
    return `${missionLine(formData)}\n${reports[action] || reports.url}\n\nO navegador não realizou nenhuma requisição externa.`;
  }
  if (toolId === 'sim-mobile') {
    const app = SIMULATOR_SCENARIOS.mobile.apps.find((item) => item.id === formData.get('appId')) || SIMULATOR_SCENARIOS.mobile.apps[0];
    const reports = {
      permissions: `APP: ${app.name}\nPERMISSÕES: ${app.permissions.join(', ')}\nAVALIAÇÃO: ${app.status === 'atenção' ? 'solicitações amplas; revisar necessidade e escopo' : 'conjunto compatível com a função simulada'}`,
      storage: `APP: ${app.name}\nARMAZENAMENTO: ${app.storage}\nRECOMENDAÇÃO: credenciais sensíveis devem ser curtas, rotacionáveis e protegidas pelo sistema.`,
      notifications: `EVENTOS: ${SIMULATOR_SCENARIOS.mobile.notifications.join(' | ')}\nAÇÃO: correlacionar horário, aplicativo e identidade.`,
      contain: `CONTENÇÃO SIMULADA: permissões de alto risco suspensas e aplicativo mantido para análise. Nenhum dispositivo real foi alterado.`,
    };
    return `${missionLine(formData)}\n${reports[action] || reports.permissions}`;
  }
  if (toolId === 'sim-loglab') {
    const events = SIMULATOR_SCENARIOS.logs.events;
    const reports = {
      failures: events.filter((event) => ['FAIL', 'ALERT'].includes(event.level)).map((event) => `${event.time} ${event.level} ${event.source} ${event.event}`).join('\n'),
      source: Object.entries(events.reduce((acc, event) => ({ ...acc, [event.ip]: (acc[event.ip] || 0) + 1 }), {})).map(([ip, count]) => `${ip}: ${count} evento(s)`).join('\n'),
      timeline: events.map((event) => `${event.time} → ${event.event}`).join('\n'),
      correlate: `CORRELAÇÃO: redefinição de senha → falhas de MFA → transferências rápidas → contenção.\nA sequência merece investigação; não prova autoria isoladamente.`,
    };
    return `${missionLine(formData)}\n${reports[action] || reports.timeline}`;
  }
  if (toolId === 'sim-netscan') {
    const devices = SIMULATOR_SCENARIOS.network.devices;
    const reports = {
      inventory: devices.map((device) => `${device.ip} ${device.name} ${device.type}`).join('\n'),
      services: devices.map((device) => `${device.name}: ${device.services.join(', ')}`).join('\n'),
      anomaly: devices.filter((device) => device.risk !== 'baixo').map((device) => `${device.name} (${device.ip}) risco=${device.risk}`).join('\n'),
      isolate: `ISOLAMENTO SIMULADO: finance-ws-07 movido para segmento de quarentena. Evidências preservadas; nenhuma rede real foi modificada.`,
    };
    return `${missionLine(formData)}\n${reports[action] || reports.inventory}`;
  }
  if (toolId === 'sim-soc') {
    const alert = SIMULATOR_SCENARIOS.soc.alerts.find((item) => item.id === formData.get('alertId')) || SIMULATOR_SCENARIOS.soc.alerts[0];
    const reports = {
      triage: `ALERTA ${alert.id}\nSEVERIDADE: ${alert.severity}\nFONTE: ${alert.source}\nTRIAGEM: verificar identidade, dispositivo, horário e impacto antes de conter.`,
      correlate: `CORRELAÇÃO: identidade + dispositivo + velocidade + contexto. Um único sinal não deve produzir conclusão automática.`,
      contain: `CONTENÇÃO EDUCATIVA: credencial suspensa temporariamente, sessão revogada e evidências preservadas para revisão humana.`,
      report: `RESUMO: ${alert.title}. Estado atualizado para investigação; recomendação de validação independente e registro do processo.`,
    };
    return `${missionLine(formData)}\n${reports[action] || reports.triage}`;
  }
  throw new Error('Simulador não reconhecido.');
};
