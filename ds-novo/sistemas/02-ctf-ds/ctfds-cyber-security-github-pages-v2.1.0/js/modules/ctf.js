import { challenges, tracks, isUnlocked } from '../data/challenges.js';
import { operatorTools, getOperatorTool } from '../data/tool-catalog.js';
import { escapeHtml } from '../core/utils.js';
import { renderToolWorkspace } from './tools.js';
import { renderMissionScenario } from './mission-scenarios.js';

const trackName = (id) => tracks.find((track) => track.id === id)?.name || id;

const themePalettes = {
  blue: ['#27a7ff', '#00f5d4', '#03111d'],
  web: ['#8cff00', '#00f5d4', '#020b08'],
  crypto: ['#a970ff', '#00d4ff', '#0b0616'],
  network: ['#ffb000', '#00d4ff', '#120b02'],
  forensics: ['#d9f2ff', '#5ba7ff', '#07101a'],
  bank: ['#00e69a', '#ffd166', '#02110c'],
  pix: ['#32e0c4', '#4ca8ff', '#021414'],
  web3: ['#a970ff', '#ff8a00', '#10051b'],
  mobile: ['#ff4fa3', '#00e5ff', '#160511'],
  cloud: ['#55c8ff', '#a970ff', '#050b18'],
  devsecops: ['#ffb000', '#8cff00', '#111004'],
  reverse: ['#e8f3ff', '#ff3d71', '#0c0d12'],
  redteam: ['#ff3d71', '#ff8a00', '#160307'],
  math: ['#7c8cff', '#caff4a', '#080a18'],
};

export const getMissionThemeColors = (theme) => themePalettes[theme] || themePalettes.blue;
const themeStyle = (theme) => {
  const [primary, secondary, background] = getMissionThemeColors(theme);
  return `--mission-accent:${primary};--mission-accent-2:${secondary};--mission-bg:${background}`;
};

export const getHintCost = (challenge) => ({
  Recruta: 0, Básico: 0, Iniciante: 5, Intermediário: 15, Avançado: 25, Especialista: 40,
}[challenge.difficulty] ?? 10);

const interactionName = (type) => ({
  choice: 'Escolha única', text: 'Preenchimento', password: 'Análise local', inspect: 'Inspeção do DOM',
  'url-route': 'Navegação virtual', 'code-edit': 'Editor de código', 'code-select': 'Seleção de código',
  'multi-select': 'Múltipla seleção', sequence: 'Arrastar e ordenar', matching: 'Relacionar conceitos',
  calculation: 'Cálculo e raciocínio',
}[type] || 'Desafio interativo');

const difficultyRank = { Recruta: 0, Básico: 1, Iniciante: 2, Intermediário: 3, Avançado: 4, Especialista: 5 };

const renderCampaignPath = (missions, profile) => {
  const nextIndex = missions.findIndex((item) => isUnlocked(item, profile.completed) && !profile.completed[item.id]);
  const focus = nextIndex < 0 ? Math.max(0, missions.length - 1) : nextIndex;
  const start = Math.max(0, focus - 3);
  const visible = missions.slice(start, start + 12);
  const completed = missions.filter((item) => profile.completed[item.id]).length;
  const percentage = missions.length ? Math.round((completed / missions.length) * 100) : 0;
  return `<section class="campaign-map card">
    <div class="campaign-map-head"><div><p class="eyebrow">MAPA DA OPERAÇÃO</p><h3>${completed}/${missions.length} setores neutralizados</h3></div><div class="campaign-percent">${percentage}%</div></div>
    <div class="campaign-rail" role="list" aria-label="Progresso da campanha">
      ${visible.map((challenge, index) => {
        const done = Boolean(profile.completed[challenge.id]);
        const unlocked = isUnlocked(challenge, profile.completed);
        const current = !done && unlocked && challenge.id === missions[focus]?.id;
        return `<button type="button" role="listitem" class="campaign-node ${done ? 'done' : ''} ${current ? 'current' : ''} ${!unlocked ? 'locked' : ''}" ${unlocked ? `data-challenge="${escapeHtml(challenge.id)}"` : 'disabled'} title="${escapeHtml(challenge.title)}">
          <span>${done ? '✓' : String(start + index + 1).padStart(2, '0')}</span><small>${escapeHtml(challenge.title)}</small>
        </button>`;
      }).join('<i class="campaign-link" aria-hidden="true"></i>')}
    </div>
    <div class="campaign-legend"><span><i class="legend-dot done"></i> concluída</span><span><i class="legend-dot current"></i> próxima</span><span><i class="legend-dot locked"></i> bloqueada</span></div>
  </section>`;
};

export const renderCTF = (profile, filter = 'available') => {
  const sorted = challenges.slice().sort((a, b) => ((a.order ?? 0) - (b.order ?? 0)) || (difficultyRank[a.difficulty] - difficultyRank[b.difficulty]));
  const visible = filter === 'available'
    ? sorted.filter((item) => isUnlocked(item, profile.completed) && !profile.completed[item.id])
    : filter === 'completed'
      ? sorted.filter((item) => profile.completed[item.id])
      : filter === 'all'
        ? sorted
        : sorted.filter((item) => item.track === filter);
  const mapMissions = tracks.some((track) => track.id === filter) ? sorted.filter((item) => item.track === filter) : sorted;
  const completeCount = Object.keys(profile.completed).length;
  const next = sorted.find((item) => isUnlocked(item, profile.completed) && !profile.completed[item.id]);
  return `
    <div class="page-head">
      <div><p class="eyebrow">CAPTURE THE FLAG // AMBIENTE ISOLADO</p><h1>Missões CTF</h1><p>Investigue cenários, marque evidências, use ferramentas, capture flags e desbloqueie operações mais complexas.</p></div>
      <div class="actions"><span class="resource-pill">⚑ ${completeCount}/${challenges.length}</span><span class="resource-pill">★ ${profile.stars}</span><span class="resource-pill combo-pill">COMBO ×${profile.combo || 0}</span></div>
    </div>
    <article class="card campaign-banner">
      <div><p class="eyebrow">CAMPANHA // OPERAÇÃO SOMBRA DIGITAL</p><h3>${next ? `Próximo alvo: ${escapeHtml(next.title)}` : 'Rede protegida: campanha concluída'}</h3><p>Cada ambiente muda conforme o setor. Resultados anteriores liberam rotas, chaves e pistas; não existe salto direto entre as fases encadeadas.</p></div>
      ${next ? `<button class="primary-button" data-challenge="${escapeHtml(next.id)}">RETOMAR OPERAÇÃO ↗</button>` : '<span class="mission-complete-seal">MISSÃO CUMPRIDA</span>'}
    </article>
    ${renderCampaignPath(mapMissions, profile)}
    <div class="filter-bar" role="tablist" aria-label="Filtrar trilha">
      <button class="filter-button ${filter === 'available' ? 'active' : ''}" data-filter="available">⚡ Disponíveis</button>
      <button class="filter-button ${filter === 'completed' ? 'active' : ''}" data-filter="completed">✓ Concluídas</button>
      <button class="filter-button ${filter === 'all' ? 'active' : ''}" data-filter="all">Todas</button>
      ${tracks.map((track) => `<button class="filter-button ${filter === track.id ? 'active' : ''}" data-filter="${track.id}">${track.icon} ${track.name}</button>`).join('')}
    </div>
    <div class="mission-grid">
      ${visible.length ? visible.map((challenge) => renderMissionCard(challenge, profile)).join('') : `<article class="card empty-missions"><span>SEM ALVOS NESTE FILTRO</span><h3>${filter === 'available' ? 'Conclua a próxima etapa encadeada para liberar novas operações.' : 'Nenhuma missão corresponde ao filtro atual.'}</h3><button class="secondary-button" data-filter="all">EXIBIR TODAS AS MISSÕES</button></article>`}
    </div>`;
};

export const renderMissionCard = (challenge, profile) => {
  const completed = profile.completed[challenge.id];
  const unlocked = isUnlocked(challenge, profile.completed);
  const stars = completed?.stars || 0;
  const reason = challenge.requires?.filter((id) => !profile.completed[id]).map((id) => challenges.find((item) => item.id === id)?.title).join(', ');
  const attempts = profile.attempts[challenge.id] || 0;
  return `<article class="mission-card mission-theme-${escapeHtml(challenge.theme)} ${completed ? 'completed' : ''} ${!unlocked ? 'locked' : ''}" style="${themeStyle(challenge.theme)}">
    <div class="mission-head"><span class="mission-code">${trackName(challenge.track).toUpperCase()} // ${challenge.id.toUpperCase()}</span><span class="difficulty difficulty-${escapeHtml(challenge.difficulty.toLowerCase())}">${challenge.difficulty}</span></div>
    <div class="mission-sector">${escapeHtml(challenge.role)} · ${escapeHtml(challenge.sector)}</div>
    <h3>${escapeHtml(challenge.title)}</h3>
    <p>${escapeHtml(challenge.description)}</p>
    <div class="mission-meta-row"><span class="interaction-tag">${escapeHtml(challenge.interaction || interactionName(challenge.type))}</span>${attempts ? `<span class="attempt-tag">${attempts} tentativa(s)</span>` : ''}</div>
    ${completed ? `<div class="stars" aria-label="${stars} estrelas">${'★'.repeat(stars)}${'☆'.repeat(3 - stars)}</div>` : ''}
    <div class="mission-rewards"><span><b>+${challenge.xp}</b> XP</span><span><b>+${challenge.coins}</b> ◇</span><span><b>+1–3</b> ★</span></div>
    ${unlocked
      ? `<button class="${completed ? 'secondary-button' : 'primary-button'} full" data-challenge="${challenge.id}">${completed ? 'REPETIR SIMULAÇÃO' : 'INICIAR MISSÃO'}</button>`
      : `<div class="lock-reason">🔒 Requer: ${escapeHtml(reason || 'missões anteriores')}</div>`}
  </article>`;
};

const renderChoice = (challenge, multiple = false) => `<div class="choice-list">${challenge.options.map((option, index) => `<label class="choice"><input type="${multiple ? 'checkbox' : 'radio'}" name="challenge-answer" value="${index}"><span><b>${String.fromCharCode(65 + index)}</b>${escapeHtml(option)}</span></label>`).join('')}</div>`;

const renderCodeSelect = (challenge) => `<div class="code-select-list">${challenge.codeLines.map((line, index) => `<label class="code-choice"><input type="checkbox" name="challenge-answer" value="${index}"><span class="line-number">${String(index + 1).padStart(2, '0')}</span><code>${escapeHtml(line)}</code></label>`).join('')}</div>`;

const renderSequence = (challenge) => `<div class="sequence-list" data-sequence-list>${challenge.items.map((item, index) => `<div class="sequence-item" draggable="true" data-sequence-item="${item.id}"><span class="sequence-grip" aria-hidden="true">⠿</span><span class="sequence-index">${index + 1}</span><strong>${escapeHtml(item.label)}</strong><div class="sequence-actions"><button type="button" class="icon-button small" data-move-sequence="up" aria-label="Mover para cima">↑</button><button type="button" class="icon-button small" data-move-sequence="down" aria-label="Mover para baixo">↓</button></div></div>`).join('')}</div>`;

const renderMatching = (challenge) => `<div class="matching-list">${challenge.pairs.map((pair) => `<label class="matching-row"><strong>${escapeHtml(pair.label)}</strong><select name="match-${escapeHtml(pair.id)}" data-match-id="${escapeHtml(pair.id)}"><option value="">Selecione a função</option>${pair.options.map((option, index) => `<option value="${index}">${escapeHtml(option)}</option>`).join('')}</select></label>`).join('')}</div>`;

const renderAnswerField = (challenge) => {
  if (challenge.type === 'choice') return renderChoice(challenge, false);
  if (challenge.type === 'multi-select') return renderChoice(challenge, true);
  if (challenge.type === 'code-select') return renderCodeSelect(challenge);
  if (challenge.type === 'sequence') return renderSequence(challenge);
  if (challenge.type === 'matching') return renderMatching(challenge);
  if (challenge.type === 'code-edit') return `<div class="editor-shell"><header><span>● ● ●</span><strong>${escapeHtml((challenge.language || 'código').toUpperCase())} // SANDBOX</strong></header><label class="code-editor-label"><textarea id="challenge-answer" class="code-editor" spellcheck="false">${escapeHtml(challenge.starterCode || '')}</textarea></label><div class="local-test-row"><button type="button" class="secondary-button" data-run-local-test="${challenge.id}">▶ EXECUTAR TESTES LOCAIS</button><output data-local-test-output>Testes aguardando execução.</output></div></div>`;
  if (challenge.type === 'url-route') return `<div class="virtual-browser"><header><span>◀ ▶ ↻</span><strong>CTFDS VIRTUAL BROWSER</strong></header><label>ENDEREÇO VIRTUAL<div class="virtual-address"><span>https://ctfds.local</span><input id="challenge-answer" type="text" placeholder="${escapeHtml(challenge.placeholder || '/rota')}"></div></label><div class="local-test-row"><button type="button" class="secondary-button" data-run-local-test="${challenge.id}">ABRIR ROTA LOCAL</button><output data-local-test-output>HTTP // aguardando endereço</output></div></div>`;
  const inputMode = challenge.type === 'calculation' ? ' inputmode="numeric"' : '';
  return `<label class="answer-label">RESPOSTA<input id="challenge-answer" ${challenge.type === 'password' ? 'type="password" autocomplete="new-password"' : 'type="text"'}${inputMode} placeholder="${escapeHtml(challenge.placeholder || 'Digite sua resposta')}" autofocus></label>`;
};

const inlineToolMap = {
  cyberchef: 'base64', openssl: 'hash', burp: 'url', zap: 'headers', postman: 'json', insomnia: 'json',
  splunk: 'logs', wazuh: 'logs', wireshark: 'logs', zeek: 'logs', riskengine: 'risk', pixmed: 'risk',
  devtools: 'url', semgrep: 'json', cloudtrail: 'logs', blockexplorer: 'hex',
};

const renderToolkit = (challenge) => {
  const recommended = (challenge.tools || []).map(getOperatorTool).filter(Boolean);
  const inlineToolMap = { cyberchef: 'base64', openssl: 'hash', devtools: 'url', splunk: 'logs', wazuh: 'logs', riskengine: 'risk', pixmed: 'risk' };
  const functional = recommended.map((tool) => ({ tool, localId: inlineToolMap[tool.id] })).find((item) => item.localId);
  if (challenge.tutorial) return '';
  const guided = ['Recruta', 'Básico', 'Iniciante'].includes(challenge.difficulty);
  return `<section class="mission-tool-access ${guided ? 'guided' : 'autonomous'}">
    <div><span>${guided ? 'FERRAMENTAS SUGERIDAS' : 'ESCOLHA DA FERRAMENTA'}</span><strong>${guided ? escapeHtml(recommended.map((tool) => tool.name).join(' · ') || 'Gaveta local') : 'Não revelada neste nível'}</strong><small>${guided ? 'A orientação diminui conforme o nível aumenta.' : 'Abra o arsenal, formule uma hipótese e teste sem receber a solução.'}</small></div>
    <button type="button" class="${guided ? 'primary-button' : 'secondary-button'}" data-open-tools-drawer="${guided && functional ? functional.localId : ''}">ABRIR GAVETA ↗</button>
  </section>`;
};

const renderDossier = (challenge, mode) => {
  const detailed = mode === 'detailed';
  return `<details class="mission-dossier" ${detailed ? 'open' : ''}>
    <summary><span>INTEL TÉCNICO</span><small>${detailed ? 'modo detalhado ativo' : 'abra para consultar contexto e defesa'}</small></summary>
    <div class="dossier-grid">
      <div><span>SETOR</span><strong>${escapeHtml(challenge.sector)}</strong></div>
      <div><span>PAPEL</span><strong>${escapeHtml(challenge.role)}</strong></div>
      <div><span>LINGUAGENS</span><strong>${escapeHtml((challenge.languages || []).join(' · '))}</strong></div>
      <div><span>SISTEMAS</span><strong>${escapeHtml((challenge.systems || []).join(' · '))}</strong></div>
    </div>
    <div class="explanation-panel"><span>${detailed ? 'VISÃO DETALHADA' : 'RESUMO OPERACIONAL'}</span><p>${escapeHtml(detailed ? challenge.deepDive : challenge.brief)}</p></div>
    ${challenge.reference ? `<a class="mission-reference" href="${escapeHtml(challenge.reference.url)}" target="_blank" rel="noopener noreferrer">↗ REFERÊNCIA REAL: ${escapeHtml(challenge.reference.label)}</a>` : ''}
  </details>`;
};

const supportLevel = (challenge) => {
  if (challenge.tutorial) return { label: 'TUTORIAL COMPLETO', detail: 'Passo a passo disponível e pista gratuita.' };
  if (['Recruta', 'Básico'].includes(challenge.difficulty)) return { label: 'SUPORTE ALTO', detail: 'Objetivo explícito, ferramentas sugeridas e pista gratuita.' };
  if (challenge.difficulty === 'Iniciante') return { label: 'SUPORTE MODERADO', detail: 'Objetivo claro e ferramentas sugeridas.' };
  if (challenge.difficulty === 'Intermediário') return { label: 'SUPORTE REDUZIDO', detail: 'Você escolhe a abordagem; pistas descontam XP.' };
  return { label: 'OPERAÇÃO AUTÔNOMA', detail: 'Situação e objetivo; descubra ferramentas e estratégia.' };
};

const renderTutorialPanel = (challenge, visible) => {
  if (!challenge.tutorial) return '';
  return `<section class="mission-tutorial ${visible ? 'open' : 'collapsed'}">
    <header><div><span>TUTORIAL DA FERRAMENTA</span><strong>${escapeHtml(challenge.interaction || 'Operação guiada')}</strong></div><button type="button" class="secondary-button compact" data-toggle-tutorial="${challenge.id}">${visible ? 'OCULTAR PASSOS' : 'MOSTRAR PASSOS'}</button></header>
    ${visible ? `<div class="tutorial-demo-callout"><span class="tutorial-demo-icon">▶</span><div><strong>Demonstração animada</strong><p>O sistema destaca cada ponto, move um cursor virtual, preenche um exemplo e executa a ferramenta na tela.</p></div><button type="button" class="primary-button" data-start-animated-tutorial="${challenge.id}">INICIAR TUTORIAL</button></div><ol>${challenge.tutorial.steps.map((step, index) => `<li><b>${String(index + 1).padStart(2, '0')}</b><span>${escapeHtml(step)}</span></li>`).join('')}</ol><div class="tutorial-panel-actions"><button type="button" class="secondary-button" data-open-tools-drawer="${escapeHtml(challenge.tutorial.toolId)}">ABRIR SEM DEMONSTRAÇÃO</button><button type="button" class="text-button" data-toggle-tutorial="${challenge.id}">PULAR PASSO A PASSO</button></div><small>Você pode pular a demonstração completa ou avançar etapa por etapa. O tutorial sempre poderá ser aberto novamente.</small>` : `<div class="tutorial-collapsed-copy"><p>O passo a passo está oculto. Você pode resolver sozinho ou iniciar a demonstração animada.</p><button type="button" class="primary-button" data-start-animated-tutorial="${challenge.id}">▶ VER TUTORIAL ANIMADO</button></div>`}
  </section>`;
};

const renderTrainingStage = (challenge) => `<section class="training-stage">
  <div><span>ETAPA</span><b>${String(Math.max(1, 9 + Number(challenge.order || 0))).padStart(2, '0')}/08</b></div>
  <div><span>FERRAMENTA</span><b>${escapeHtml(challenge.interaction || 'Ferramenta local')}</b></div>
  <div><span>META</span><b>APRENDER · TESTAR · VALIDAR</b></div>
</section>`;

const renderNotebook = (challenge, profile) => challenge.tutorial
  ? `<details class="mission-notebook tutorial-notebook"><summary>ANOTAÇÕES OPCIONAIS</summary><label>DIÁRIO DE INVESTIGAÇÃO<textarea data-mission-notes="${challenge.id}" placeholder="Anote o que a ferramenta faz e o resultado encontrado.">${escapeHtml(profile.missionNotes?.[challenge.id] || '')}</textarea></label><span data-notes-status>salvamento local automático</span></details>`
  : `<section class="mission-notebook"><label>DIÁRIO DE INVESTIGAÇÃO<textarea data-mission-notes="${challenge.id}" placeholder="Registre hipóteses, pistas, comandos e conclusões. As anotações ficam apenas neste perfil local.">${escapeHtml(profile.missionNotes?.[challenge.id] || '')}</textarea></label><span data-notes-status>salvamento local automático</span></section>`;

const nextAvailableMission = (profile, currentId) => challenges.find((item) => item.id !== currentId && isUnlocked(item, profile.completed) && !profile.completed[item.id]);

export const renderChallengeModal = (challenge, profile, result = null, showHint = false, tutorialVisible = Boolean(challenge.tutorial && profile.settings?.tutorialEnabled !== false)) => {
  const attempts = profile.attempts[challenge.id] || 0;
  const customAttribute = challenge.inspectAttribute ? `${challenge.inspectAttribute}="${escapeHtml(challenge.localFlag || '')}"` : `data-local-flag="${escapeHtml(challenge.localFlag || '')}"`;
  const inspectTarget = challenge.type === 'inspect'
    ? `<div class="inspect-lab"><header>DOM INSPECTOR TARGET</header><div class="inspect-target" ${customAttribute}>ALVO LOCAL #mission-${challenge.id} // existe uma pista em um atributo deste elemento</div><small>Abra o inspetor do navegador ou examine o elemento dentro deste laboratório.</small></div>` : '';
  const cost = getHintCost(challenge);
  const support = supportLevel(challenge);
  const next = result?.success ? nextAvailableMission(profile, challenge.id) : null;
  return `<div class="modal-layer mission-modal-layer mission-theme-${escapeHtml(challenge.theme)}" style="${themeStyle(challenge.theme)}" data-modal-close="true">
    <section class="challenge-modal panel" data-local-flag="${escapeHtml(challenge.localFlag || '')}" role="dialog" aria-modal="true" aria-labelledby="challenge-title">
      <div class="mission-scanline" aria-hidden="true"></div>
      <div class="modal-head"><div><p class="eyebrow">${trackName(challenge.track)} // ${challenge.difficulty} // ${escapeHtml(challenge.interaction || interactionName(challenge.type))}</p><h2 id="challenge-title">${escapeHtml(challenge.title)}</h2><p class="muted">${escapeHtml(challenge.role)} · Tentativas: ${attempts} · Combo atual: ×${profile.combo || 0}</p></div><div class="modal-head-actions"><button type="button" class="secondary-button mission-guide-button" data-start-animated-tutorial="${challenge.id}">? GUIA</button><button type="button" class="secondary-button mission-tools-button" data-open-tools-drawer="${escapeHtml(challenge.tutorial?.toolId || '')}">⌘ FERRAMENTAS</button><button class="icon-button" data-close-modal aria-label="Fechar">×</button></div></div>
      <div class="mission-hud">
        <div><span>OBJETIVO</span><strong>CAPTURAR A BANDEIRA</strong></div>
        <div><span>AMEAÇA</span><strong>${escapeHtml(challenge.difficulty.toUpperCase())}</strong></div>
        <div><span>RECOMPENSA</span><strong>${challenge.xp} XP · ${challenge.coins} ◇</strong></div>
        <div><span>SUPORTE</span><strong>${escapeHtml(support.label)}</strong></div>
      </div>
      <div class="support-strip"><span>${escapeHtml(support.label)}</span><p>${escapeHtml(support.detail)}</p></div>
      <div class="mission-scoreboard"><span>TENTATIVAS <b>${attempts}</b></span><span>PISTA <b>${profile.hintsUsed[challenge.id] ? 'USADA' : 'NÃO'}</b></span><span>ESTRELAS POSSÍVEIS <b>${profile.hintsUsed[challenge.id] ? '2' : attempts === 0 ? '3' : attempts < 3 ? '2' : '1'}</b></span></div>
      <ol class="mission-flow" aria-label="Fluxo recomendado da missão">
        <li><b>01</b><span>INVESTIGUE<small>Observe cenário e evidências</small></span></li>
        <li><b>02</b><span>TESTE<small>Use editor, rota ou ferramenta</small></span></li>
        <li><b>03</b><span>REGISTRE<small>Anote sua hipótese</small></span></li>
        <li><b>04</b><span>CAPTURE<small>Valide a resposta ou flag</small></span></li>
      </ol>
      ${challenge.tutorial ? renderTrainingStage(challenge) : renderMissionScenario(challenge)}
      <div class="mission-brief-grid">
        <section class="objective-panel situation-panel"><span>SITUAÇÃO-PROBLEMA</span><p>${escapeHtml(challenge.description)}</p></section>
        <section class="objective-panel goal-panel"><span>OBJETIVO DA MISSÃO</span><div class="challenge-prompt">${escapeHtml(challenge.prompt)}</div></section>
      </div>
      ${renderTutorialPanel(challenge, tutorialVisible)}
      ${inspectTarget}
      <form id="challenge-form" data-challenge-id="${challenge.id}">
        ${renderAnswerField(challenge)}
        ${showHint ? `<div class="hint-box"><strong>PISTA TÁTICA:</strong> ${escapeHtml(challenge.hint)}</div>` : ''}
        ${result ? `<div class="result-box ${result.success ? 'success' : 'error'}"><strong>${result.success ? 'BANDEIRA CAPTURADA' : 'ACESSO NEGADO'}</strong><p>${escapeHtml(result.message)}</p>${result.success ? `<div class="after-action"><span>DEBRIEF DEFENSIVO</span><p>${escapeHtml(challenge.defense)}</p></div>` : ''}${result.success && challenge.reveal ? `<div class="recovered-data"><span>DADO RECUPERADO</span><code>${escapeHtml(challenge.reveal)}</code><small>Guarde este valor: ele será usado na próxima fase.</small></div>` : ''}</div>` : ''}
        ${renderNotebook(challenge, profile)}
        ${renderToolkit(challenge)}
        ${renderDossier(challenge, profile.settings?.explanationMode || 'short')}
        <div class="challenge-actions sticky-actions"><button type="button" class="secondary-button" data-use-hint="${challenge.id}">${showHint ? 'PISTA EXIBIDA' : cost ? `SOLICITAR PISTA · -${cost} XP` : 'SOLICITAR PISTA GRÁTIS'}</button><button type="submit" class="primary-button">VALIDAR RESPOSTA ↗</button>${next ? `<button type="button" class="secondary-button" data-open-next="${next.id}">PRÓXIMA MISSÃO →</button>` : ''}</div>
      </form>
      <p class="safety-note"><strong>Escopo:</strong> exercício local e fictício. Ferramentas reais são apresentadas para reconhecimento profissional, nunca para testar sistemas de terceiros sem autorização formal.</p>
    </section>
  </div>`;
};
