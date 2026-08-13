import { unicodeToBase64, base64ToUnicode, caesar, textToBinary, binaryToText, passwordScore } from '../core/utils.js';

export const toolCatalog = Object.freeze([
  { id: 'base64', label: 'Base64', icon: 'B64' },
  { id: 'caesar', label: 'Cifra César', icon: 'C+' },
  { id: 'binary', label: 'Binário', icon: '01' },
  { id: 'hex', label: 'Hex ↔ Texto', icon: 'HEX' },
  { id: 'rot13', label: 'ROT13', icon: 'R13' },
  { id: 'hash', label: 'SHA-256', icon: '#' },
  { id: 'json', label: 'JSON', icon: '{}' },
  { id: 'jwt', label: 'JWT Viewer', icon: 'JWT' },
  { id: 'url', label: 'URL Inspector', icon: 'URL' },
  { id: 'password', label: 'Senha', icon: '⚿' },
  { id: 'logs', label: 'Logs', icon: '⌕' },
  { id: 'headers', label: 'Headers', icon: 'H' },
  { id: 'risk', label: 'Risco Transacional', icon: 'R$' },
]);

const output = (title = 'SAÍDA') => `<div class="section-title"><h2>${title}</h2></div><pre class="tool-result card" data-tool-output>aguardando entrada...</pre>`;

const workspace = (toolId) => {
  switch (toolId) {
    case 'caesar': return `<h2>Cifra de César</h2><p class="muted">Desloque letras para estudar cifras clássicas. Não use César para proteger dados reais.</p><form class="tool-form" data-tool-form="caesar"><label>TEXTO<textarea name="input" placeholder="VHFXULWB"></textarea></label><label>DESLOCAMENTO<input name="shift" type="number" value="-3" min="-25" max="25"></label><button class="primary-button" type="submit">EXECUTAR LOCALMENTE</button></form>${output()}`;
    case 'binary': return `<h2>Texto ↔ Binário</h2><p class="muted">Converta texto UTF-8 para bytes binários ou reconstrua texto a partir de grupos de 8 bits.</p><form class="tool-form" data-tool-form="binary"><label>DADOS<textarea name="input" placeholder="FLAG ou 01000110 01001100 01000001 01000111"></textarea></label><label>AÇÃO<select name="action"><option value="encode">Texto para binário</option><option value="decode">Binário para texto</option></select></label><button class="primary-button" type="submit">CONVERTER</button></form>${output()}`;
    case 'hex': return `<h2>Hexadecimal ↔ Texto</h2><p class="muted">Converta bytes hexadecimais e identifique assinaturas de arquivos de laboratório.</p><form class="tool-form" data-tool-form="hex"><label>DADOS<textarea name="input" placeholder="50 4B 03 04 ou FLAG"></textarea></label><label>AÇÃO<select name="action"><option value="decode">Hex para texto</option><option value="encode">Texto para hex</option></select></label><button class="primary-button" type="submit">CONVERTER</button></form>${output()}`;
    case 'rot13': return `<h2>ROT13</h2><p class="muted">Transformação reversível usada em desafios e ofuscação simples; não oferece segurança.</p><form class="tool-form" data-tool-form="rot13"><label>TEXTO<textarea name="input" placeholder="FRPHEVGL"></textarea></label><button class="primary-button" type="submit">APLICAR ROT13</button></form>${output()}`;
    case 'hash': return `<h2>Hash SHA-256</h2><p class="muted">Calcule um resumo criptográfico no navegador. O conteúdo não é enviado para nenhum servidor.</p><form class="tool-form" data-tool-form="hash"><label>CONTEÚDO<textarea name="input" placeholder="Digite um texto para calcular o hash"></textarea></label><button class="primary-button" type="submit">CALCULAR HASH</button></form>${output('SAÍDA HEXADECIMAL')}`;
    case 'json': return `<h2>Formatador JSON</h2><p class="muted">Valide e organize objetos fictícios usados em APIs, logs e configurações.</p><form class="tool-form" data-tool-form="json"><label>JSON<textarea name="input" placeholder='{"event":"pix","risk":80}'></textarea></label><button class="primary-button" type="submit">VALIDAR E FORMATAR</button></form>${output()}`;
    case 'jwt': return `<h2>JWT Viewer Local</h2><p class="muted">Decodifica header e payload para estudo. Decodificar não comprova assinatura nem autorização.</p><form class="tool-form" data-tool-form="jwt"><label>TOKEN FICTÍCIO<textarea name="input" placeholder="xxxxx.yyyyy.zzzzz"></textarea></label><button class="primary-button" type="submit">DECODIFICAR PARTES</button></form>${output()}`;
    case 'url': return `<h2>Inspetor de URL</h2><p class="muted">Analisa estrutura textual sem abrir o endereço nem fazer requisições.</p><form class="tool-form" data-tool-form="url"><label>URL OU ROTA<textarea name="input" placeholder="https://portal.exemplo.local/login?next=%2Fadmin"></textarea></label><button class="primary-button" type="submit">INSPECIONAR SEM ACESSAR</button></form>${output('RELATÓRIO')}`;
    case 'password': return `<h2>Analisador de Senha</h2><p class="muted">A análise é feita apenas em memória. A senha não entra no progresso nem no armazenamento local.</p><form class="tool-form" data-tool-form="password"><label>SENHA TEMPORÁRIA<input name="input" type="password" autocomplete="new-password" placeholder="Teste uma frase-senha"></label><button class="primary-button" type="submit">ANALISAR</button></form>${output('RESULTADO')}`;
    case 'logs': return `<h2>Analisador de Logs</h2><p class="muted">Heurística educacional para destacar falhas, IPs frequentes e palavras de alerta em dados fictícios.</p><form class="tool-form" data-tool-form="logs"><label>LOGS<textarea name="input" placeholder="2026-07-28T10:20:11Z auth FAIL user=admin ip=10.0.0.23"></textarea></label><button class="primary-button" type="submit">ANALISAR EVENTOS</button></form>${output('RELATÓRIO LOCAL')}`;
    case 'headers': return `<h2>Checklist de Headers</h2><p class="muted">Cole headers de uma resposta fictícia para verificar controles defensivos comuns.</p><form class="tool-form" data-tool-form="headers"><label>HEADERS<textarea name="input" placeholder="content-security-policy: default-src 'self'\nx-content-type-options: nosniff"></textarea></label><button class="primary-button" type="submit">VERIFICAR</button></form>${output('CHECKLIST')}`;
    case 'risk': return `<h2>Motor Antifraude Didático</h2><p class="muted">Informe sinais fictícios, um por linha: device_new, password_reset, unusual_value, rapid_transfers, new_country.</p><form class="tool-form" data-tool-form="risk"><label>SINAIS<textarea name="input" placeholder="device_new\npassword_reset\nunusual_value"></textarea></label><button class="primary-button" type="submit">CALCULAR ESCORE LOCAL</button></form>${output()}`;
    case 'base64':
    default: return `<h2>Codificador Base64</h2><p class="muted">Base64 altera a representação, mas não oferece confidencialidade. Use para aprender formatos e transporte de dados.</p><form class="tool-form" data-tool-form="base64"><label>DADOS<textarea name="input" placeholder="CIBERSEGURANÇA"></textarea></label><label>AÇÃO<select name="action"><option value="encode">Codificar</option><option value="decode">Decodificar</option></select></label><button class="primary-button" type="submit">PROCESSAR</button></form>${output()}`;
  }
};

export const renderTools = (activeTool = 'base64') => `
  <div class="page-head"><div><p class="eyebrow">TOOLKIT // PROCESSAMENTO LOCAL</p><h1>Ferramentas do Operador</h1><p>Conversores e analisadores seguros para missões web, criptografia, dados, APIs, investigação e antifraude. Nenhuma ferramenta faz requisição externa.</p></div></div>
  <article class="card educational-use-banner"><div><strong>USO EXCLUSIVAMENTE EDUCACIONAL</strong><p>Estas ferramentas processam apenas os dados inseridos no navegador. Não use os conhecimentos para testar, modificar ou acessar sistemas, redes, contas ou dispositivos sem autorização.</p></div><button class="secondary-button" data-open-terms>VER ESCOPO</button></article>
  <div class="tool-layout">
    <aside class="tool-tabs panel">${toolCatalog.map((tool) => `<button class="tool-tab ${activeTool === tool.id ? 'active' : ''}" data-tool="${tool.id}">${tool.icon} // ${tool.label}</button>`).join('')}</aside>
    <section class="tool-workspace panel" data-tool-workspace>${renderToolWorkspace(activeTool)}</section>
  </div>`;

export const renderToolWorkspace = (toolId = 'base64') => `<div class="tool-tutorial-inline"><div><span>TUTORIAL DISPONÍVEL</span><small>Veja o cursor virtual preencher e executar um exemplo seguro.</small></div><button type="button" class="secondary-button compact" data-start-tool-tutorial="${toolId}">▶ COMO USAR</button></div>${workspace(toolId)}`;

const decodeBase64UrlJson = (part) => {
  const normalized = part.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(part.length / 4) * 4, '=');
  return JSON.parse(base64ToUnicode(normalized));
};

export const runTool = async (toolId, formData) => {
  const input = String(formData.get('input') || '');
  if (!input && toolId !== 'password') throw new Error('Insira dados para processar.');
  switch (toolId) {
    case 'base64': return formData.get('action') === 'decode' ? base64ToUnicode(input.trim()) : unicodeToBase64(input);
    case 'caesar': return caesar(input, Number(formData.get('shift') || 0));
    case 'binary': return formData.get('action') === 'decode' ? binaryToText(input) : textToBinary(input);
    case 'hex': {
      if (formData.get('action') === 'encode') return [...new TextEncoder().encode(input)].map((byte) => byte.toString(16).padStart(2, '0').toUpperCase()).join(' ');
      const clean = input.replace(/0x/gi, '').replace(/[^0-9a-f]/gi, '');
      if (!clean || clean.length % 2) throw new Error('Use pares de dígitos hexadecimais.');
      return new TextDecoder().decode(new Uint8Array(clean.match(/.{2}/g).map((part) => parseInt(part, 16))));
    }
    case 'rot13': return input.replace(/[a-z]/gi, (char) => {
      const base = char.charCodeAt(0) <= 90 ? 65 : 97;
      return String.fromCharCode(base + ((char.charCodeAt(0) - base + 13) % 26));
    });
    case 'hash': {
      const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
      return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
    }
    case 'json': return JSON.stringify(JSON.parse(input), null, 2);
    case 'jwt': {
      const parts = input.trim().split('.');
      if (parts.length < 2) throw new Error('JWT precisa de header e payload separados por ponto.');
      return `HEADER\n${JSON.stringify(decodeBase64UrlJson(parts[0]), null, 2)}\n\nPAYLOAD\n${JSON.stringify(decodeBase64UrlJson(parts[1]), null, 2)}\n\nAVISO: conteúdo decodificado não prova assinatura válida.`;
    }
    case 'url': {
      let parsed;
      try { parsed = new URL(input.trim(), 'https://ctfds.local'); } catch { throw new Error('URL inválida.'); }
      const suspicious = [];
      if (/^(?:\d{1,3}\.){3}\d{1,3}$/.test(parsed.hostname)) suspicious.push('host em formato IP');
      if (parsed.username || parsed.password) suspicious.push('credenciais embutidas');
      if (parsed.hostname.split('.').length > 4) suspicious.push('muitos subdomínios');
      if ([...parsed.searchParams.keys()].some((key) => /redirect|next|url|return/i.test(key))) suspicious.push('parâmetro de redirecionamento');
      return [`PROTOCOLO: ${parsed.protocol}`, `HOST: ${parsed.host}`, `CAMINHO: ${decodeURIComponent(parsed.pathname)}`, `PARÂMETROS: ${[...parsed.searchParams].map(([key, value]) => `${key}=${value}`).join(' | ') || 'nenhum'}`, '', `SINAIS PARA REVISÃO: ${suspicious.join(', ') || 'nenhum sinal estrutural óbvio'}`, 'Nenhum endereço foi acessado.'].join('\n');
    }
    case 'password': {
      const result = passwordScore(input);
      const labels = { length: '12 ou mais caracteres', long: '16 ou mais caracteres', upper: 'Letra maiúscula', lower: 'Letra minúscula', digit: 'Número', symbol: 'Símbolo', noCommon: 'Sem padrão comum' };
      return [`PONTUAÇÃO: ${result.score}/${result.max}`, result.score >= 6 ? 'CLASSIFICAÇÃO: FORTE PARA O LABORATÓRIO' : result.score >= 4 ? 'CLASSIFICAÇÃO: MODERADA' : 'CLASSIFICAÇÃO: FRACA', '', ...Object.entries(result.checks).map(([key, ok]) => `${ok ? '[OK]' : '[--]'} ${labels[key]}`)].join('\n');
    }
    case 'logs': {
      const lines = input.split(/\r?\n/).filter(Boolean);
      const ips = {};
      const alerts = [];
      lines.forEach((line, index) => {
        const matches = line.match(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g) || [];
        matches.forEach((ip) => { ips[ip] = (ips[ip] || 0) + 1; });
        if (/fail|denied|malware|blocked|unauthorized|brute|fraud|pix/i.test(line)) alerts.push(`L${index + 1}: ${line}`);
      });
      const ranked = Object.entries(ips).sort((a, b) => b[1] - a[1]);
      return [`EVENTOS: ${lines.length}`, `ALERTAS HEURÍSTICOS: ${alerts.length}`, '', 'ORIGENS MAIS FREQUENTES:', ...(ranked.length ? ranked.map(([ip, count]) => `${ip} -> ${count} ocorrência(s)`) : ['nenhum IP reconhecido']), '', 'LINHAS DESTACADAS:', ...(alerts.length ? alerts : ['nenhuma palavra de alerta encontrada'])].join('\n');
    }
    case 'headers': {
      const lower = input.toLowerCase();
      const required = [['content-security-policy', 'Restringe fontes de conteúdo'], ['x-content-type-options', 'Evita interpretação MIME indevida'], ['referrer-policy', 'Controla informações de referência'], ['permissions-policy', 'Limita recursos do navegador'], ['strict-transport-security', 'Força HTTPS após confiança inicial']];
      return required.map(([header, description]) => `${lower.includes(`${header}:`) ? '[OK]' : '[AUSENTE]'} ${header}\n    ${description}`).join('\n\n');
    }
    case 'risk': {
      const weights = { device_new: 25, password_reset: 30, unusual_value: 20, rapid_transfers: 25, new_country: 20 };
      const signals = input.split(/\r?\n|,|;/).map((item) => item.trim().toLowerCase()).filter(Boolean);
      const recognized = [...new Set(signals)].filter((signal) => signal in weights);
      const score = Math.min(100, recognized.reduce((total, signal) => total + weights[signal], 0));
      const level = score >= 75 ? 'ALTO — exigir verificação e análise' : score >= 40 ? 'MÉDIO — aplicar fricção proporcional' : 'BAIXO — manter monitoramento';
      return [`ESCORE DIDÁTICO: ${score}/100`, `CLASSIFICAÇÃO: ${level}`, '', ...recognized.map((signal) => `+${weights[signal]} ${signal}`), '', 'Este cálculo é educacional e não decide transações reais.'].join('\n');
    }
    default: throw new Error('Ferramenta desconhecida.');
  }
};
