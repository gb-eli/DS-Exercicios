import { escapeHtml } from '../core/utils.js';

const scenarioByTheme = {
  web: {
    label: 'BROWSER SANDBOX', icon: '⌘', status: 'DOM / API / STORAGE',
    clues: ['Atributo inesperado no DOM', 'Valor confiado pelo cliente', 'Rota ou parâmetro não validado'],
    rows: [
      ['GET', '/portal/conta', '200'],
      ['DOM', 'data-role="viewer"', 'MUTÁVEL'],
      ['API', '/v1/profile/1042', 'REVISAR'],
    ],
  },
  blue: {
    label: 'SOC COMMAND GRID', icon: '🛡', status: 'SIEM / ENDPOINT / ALERTAS',
    clues: ['Evento fora do horário', 'Origem incomum', 'Sequência de falhas correlacionadas'],
    rows: [
      ['AUTH', 'FAIL user=operator', 'ALERTA'],
      ['EDR', 'processo não reconhecido', 'QUARENTENA'],
      ['SIEM', 'correlação 3 sinais', 'ALTO'],
    ],
  },
  crypto: {
    label: 'CIPHER ANALYSIS CORE', icon: '◇', status: 'HASH / ENTROPIA / CODIFICAÇÃO',
    clues: ['Formato não é criptografia', 'Chave reutilizada', 'Integridade sem autenticação'],
    rows: [
      ['DATA', '53 50 45 43 54 45 52', 'HEX'],
      ['HASH', 'sha256:9b7…', 'INTEGRIDADE'],
      ['KEY', 'rotation=disabled', 'RISCO'],
    ],
  },
  math: {
    label: 'QUANTUM MATH GRID', icon: '∑', status: 'PROBABILIDADE / ENTROPIA / RISCO',
    clues: ['Espaço de busca', 'Limite de tentativas', 'Probabilidade acumulada'],
    rows: [
      ['10⁶', 'combinações possíveis', 'BASE'],
      ['RATE', '5 tentativas/min', 'CONTROLE'],
      ['RISK', '0.82', 'ALTO'],
    ],
  },
  network: {
    label: 'NETWORK TELEMETRY', icon: '◉', status: 'DNS / FIREWALL / PACOTES',
    clues: ['Volume anormal', 'Portas variadas', 'Domínio recém-observado'],
    rows: [
      ['DNS', 'q7x4.example.local', 'NOVO'],
      ['TCP', '10.0.4.18 → :445', 'NEGADO'],
      ['FLOW', '824 conexões/min', 'ANÔMALO'],
    ],
  },
  forensics: {
    label: 'FORENSIC EVIDENCE LAB', icon: '⌕', status: 'HASH / TIMELINE / CUSTÓDIA',
    clues: ['Timestamp divergente', 'Hash precisa ser preservado', 'Evento correlacionado a usuário'],
    rows: [
      ['E01', 'disk-image.E01', 'SHA256 OK'],
      ['LOG', '2026-07-28 02:14:09', 'ANOMALIA'],
      ['USER', 'svc_backup', 'REVISAR'],
    ],
  },
  reverse: {
    label: 'BINARY ANALYSIS CELL', icon: 'HEX', status: 'MAGIC BYTES / STRINGS / MEMÓRIA',
    clues: ['Extensão não corresponde ao conteúdo', 'String suspeita no binário', 'Persistência observada'],
    rows: [
      ['0000', '50 4B 03 04', 'ZIP'],
      ['0010', '2F 61 75 74 6F 72 75 6E', 'STRING'],
      ['RAM', 'proc_0x7ff2', 'ANALISAR'],
    ],
  },
  redteam: {
    label: 'ADVERSARY SIMULATION', icon: '⚠', status: 'ESCOPO / HIPÓTESE / VALIDAÇÃO',
    clues: ['Teste precisa estar autorizado', 'Impacto deve ser controlado', 'Evidência precisa ser documentada'],
    rows: [
      ['SCOPE', 'ctfds.local', 'AUTORIZADO'],
      ['ACTION', 'simulation-only', 'SEGURO'],
      ['REPORT', 'finding-07', 'ABERTO'],
    ],
  },
  pix: {
    label: 'PIX FRAUD INTELLIGENCE', icon: 'R$', status: 'IDENTIDADE / VELOCIDADE / MED',
    clues: ['Recebedor divergente', 'Dispositivo novo', 'Transferências em sequência'],
    rows: [
      ['PIX', 'R$ 1.280,00', 'PENDENTE'],
      ['DEVICE', 'android-new-91', 'NOVO'],
      ['RISK', '82/100', 'ALTO'],
    ],
  },
  bank: {
    label: 'BANKING SECURITY VAULT', icon: '▰', status: 'CORE / CARTÕES / APROVAÇÃO',
    clues: ['Valor calculado no cliente', 'Credencial compartilhada', 'Ausência de dupla aprovação'],
    rows: [
      ['TX', 'R$ 24.900,00', 'REVISÃO'],
      ['AUTH', 'maker-checker', 'ATIVO'],
      ['TOKEN', 'card_ref_8fd2', 'PROTEGIDO'],
    ],
  },
  web3: {
    label: 'BLOCKCHAIN TRACE NODE', icon: '⛓', status: 'WALLET / CONTRATO / TRANSAÇÃO',
    clues: ['Permissão excessiva', 'Endereço divergente', 'Assinatura fora do contexto'],
    rows: [
      ['BLOCK', '#19,445,021', 'FINAL'],
      ['WALLET', '0xA7…9F', 'NOVO'],
      ['ALLOW', 'unlimited', 'RISCO'],
    ],
  },
  mobile: {
    label: 'MOBILE APP SANDBOX', icon: '▣', status: 'ANDROID / IOS / DEEP LINK',
    clues: ['Permissão desnecessária', 'Segredo dentro do aplicativo', 'Deep link sem validação'],
    rows: [
      ['APP', 'com.ctfds.wallet', 'DEBUG'],
      ['PERM', 'READ_SMS', 'REVISAR'],
      ['LINK', 'ctfds://pay?id=77', 'EXTERNO'],
    ],
  },
  cloud: {
    label: 'CLOUD CONTROL PLANE', icon: '☁', status: 'IAM / STORAGE / AUDITORIA',
    clues: ['Política ampla', 'Bucket público', 'Chave de longa duração'],
    rows: [
      ['IAM', 'Action: *', 'CRÍTICO'],
      ['BUCKET', 'public-read', 'EXPOSTO'],
      ['AUDIT', 'trail=enabled', 'OK'],
    ],
  },
  devsecops: {
    label: 'PIPELINE SECURITY GRID', icon: 'CI', status: 'BUILD / DEPENDÊNCIAS / SEGREDOS',
    clues: ['Dependência sem versão fixa', 'Segredo no log', 'Artefato sem assinatura'],
    rows: [
      ['BUILD', '#8421', 'RUNNING'],
      ['SCA', '2 critical', 'FAIL'],
      ['IMAGE', 'sha256:7c1…', 'UNSIGNED'],
    ],
  },
};

const defaultScenario = scenarioByTheme.blue;

export const renderMissionScenario = (challenge) => {
  const scene = scenarioByTheme[challenge.theme] || defaultScenario;
  return `
    <section class="mission-simulator" aria-label="Cenário visual da missão">
      <header class="simulator-head">
        <div><span class="simulator-icon">${escapeHtml(scene.icon)}</span><div><strong>${escapeHtml(scene.label)}</strong><small>${escapeHtml(scene.status)}</small></div></div>
        <span class="live-chip"><i></i> SIMULAÇÃO LOCAL</span>
      </header>
      <div class="simulator-screen">
        <div class="simulator-grid-lines" aria-hidden="true"></div>
        <div class="simulator-console">
          ${scene.rows.map(([kind, value, status], index) => `<div class="sim-row" style="--delay:${index * 90}ms"><span>${escapeHtml(kind)}</span><code>${escapeHtml(value)}</code><b>${escapeHtml(status)}</b></div>`).join('')}
        </div>
        <div class="simulator-radar" aria-hidden="true"><span></span><i></i></div>
      </div>
      <div class="evidence-board" data-evidence-board>
        <div><strong>QUADRO DE EVIDÊNCIAS</strong><small>Marque pistas enquanto investiga. Elas organizam seu raciocínio, mas não entregam a resposta.</small></div>
        <div class="evidence-chips">
          ${scene.clues.map((clue, index) => `<button type="button" class="evidence-chip" data-evidence-clue="${index}" aria-pressed="false"><span>0${index + 1}</span>${escapeHtml(clue)}</button>`).join('')}
        </div>
        <output class="evidence-counter">0/${scene.clues.length} pistas marcadas</output>
      </div>
    </section>`;
};
