import { challenges, tracks, isUnlocked } from '../data/challenges.js';
import { getOperatorTool } from '../data/tool-catalog.js';
import { escapeHtml, safeExternalUrl } from '../core/utils.js';
import { getMissionDraft, getMissionProgressState } from '../core/mission-progress.js';
import { missionSequence, missionBlocks, getMissionBlock, getBlockState, getBlockStats, getActiveMissionBlock, getCampaignBlockSummary } from '../core/mission-blocks.js';
import { renderMissionScenario } from './mission-scenarios.js';
import { renderInvestigativeWorkspace, hasInvestigativeCase, renderInvestigationProcessGate, formatActiveMissionTime, renderInvestigationResolution } from './investigative-workspace.js';
import { isAdvancedInvestigationMission, isNarrativeMission } from '../data/mission-cases.js';
import { getChallengeArtifact, resolveChallengePrompt } from '../security/challenge-verifier.js';
import { getImmersiveScenarioForMission } from '../data/immersive-scenarios.js';

const trackName = (id) => tracks.find((track) => track.id === id)?.name || id;

const themePalettes = {
  blue: ['#27a7ff', '#00f5d4', '#03111d'], web: ['#8cff00', '#00f5d4', '#020b08'],
  crypto: ['#a970ff', '#00d4ff', '#0b0616'], network: ['#ffb000', '#00d4ff', '#120b02'],
  forensics: ['#d9f2ff', '#5ba7ff', '#07101a'], bank: ['#00e69a', '#ffd166', '#02110c'],
  pix: ['#32e0c4', '#4ca8ff', '#021414'], web3: ['#a970ff', '#ff8a00', '#10051b'],
  mobile: ['#ff4fa3', '#00e5ff', '#160511'], cloud: ['#55c8ff', '#a970ff', '#050b18'],
  devsecops: ['#ffb000', '#8cff00', '#111004'], reverse: ['#e8f3ff', '#ff3d71', '#0c0d12'],
  redteam: ['#ff3d71', '#ff8a00', '#160307'], math: ['#7c8cff', '#caff4a', '#080a18'],
};

export const getMissionThemeColors = (theme) => themePalettes[theme] || themePalettes.blue;
const themeStyle = (theme) => {
  const [primary, secondary, background] = getMissionThemeColors(theme);
  return `--mission-accent:${primary};--mission-accent-2:${secondary};--mission-bg:${background}`;
};

export const getHintCost = (challenge) => ({ Recruta: 0, Básico: 0, Iniciante: 5, Intermediário: 15, Avançado: 25, Especialista: 40 }[challenge.difficulty] ?? 10);

const interactionName = (type) => ({
  choice: 'Escolha única', text: 'Preenchimento', password: 'Análise local', inspect: 'Inspeção do DOM',
  'url-route': 'Navegação virtual', 'code-edit': 'Editor de código', 'code-select': 'Seleção de código',
  'multi-select': 'Múltipla seleção', sequence: 'Arrastar e ordenar', matching: 'Relacionar conceitos',
  calculation: 'Cálculo e raciocínio',
}[type] || 'Desafio interativo');

const sortedChallenges = () => missionSequence.slice();
const formattedTime = (value) => value ? new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(value)) : '';

const blockStateLabel = (state) => ({ completed: 'Concluído', 'in-progress': 'Em andamento', available: 'Disponível', locked: 'Bloqueado' }[state] || state);

const renderCampaignPath = (missions, profile, block = null) => {
  const nextIndex = missions.findIndex((item) => ['available', 'in-progress'].includes(getMissionProgressState(item, profile).id));
  const focus = nextIndex < 0 ? Math.max(0, missions.length - 1) : nextIndex;
  const completed = missions.filter((item) => profile.completed[item.id]).length;
  const percentage = missions.length ? Math.round((completed / missions.length) * 100) : 0;
  return `<section class="campaign-map card">
    <div class="campaign-map-head"><div><p class="eyebrow">${block ? `ROTA DO BLOCO ${String(block.number).padStart(2, '0')}` : 'MAPA DA OPERAÇÃO'}</p><h3>${completed}/${missions.length} missões concluídas</h3></div><div class="campaign-percent">${percentage}%</div></div>
    <div class="campaign-rail block-mission-rail" role="list" aria-label="Progresso do bloco">
      ${missions.map((challenge, index) => {
        const state = getMissionProgressState(challenge, profile);
        const current = state.id !== 'completed' && state.id !== 'locked' && index === focus;
        return `<button type="button" role="listitem" class="campaign-node ${state.id} ${current ? 'current' : ''}" ${state.id !== 'locked' ? `data-challenge="${escapeHtml(challenge.id)}"` : 'disabled'} title="${escapeHtml(challenge.title)}">
          <span>${state.id === 'completed' ? '✓' : state.id === 'in-progress' ? '↻' : String(index + 1).padStart(2, '0')}</span><small>${escapeHtml(challenge.title)}</small>
        </button>`;
      }).join('<i class="campaign-link" aria-hidden="true"></i>')}
    </div>
    <div class="campaign-legend"><span><i class="legend-dot done"></i> concluída</span><span><i class="legend-dot current"></i> próxima</span><span><i class="legend-dot progress"></i> em andamento</span><span><i class="legend-dot locked"></i> bloqueada</span></div>
  </section>`;
};

const trackStats = (trackId, profile) => {
  const missions = challenges.filter((item) => item.track === trackId);
  const completed = missions.filter((item) => profile.completed[item.id]).length;
  const inProgress = missions.filter((item) => getMissionProgressState(item, profile).id === 'in-progress').length;
  return { total: missions.length, completed, inProgress, percentage: missions.length ? Math.round((completed / missions.length) * 100) : 0 };
};

const renderBlockRoute = (profile, selectedBlockId) => `<section class="mission-block-route" aria-label="Pacotes de missões">
  ${missionBlocks.map((block) => {
    const state = getBlockState(profile, block);
    const selected = block.id === selectedBlockId;
    return `<article class="mission-block-route-card ${state.state} ${selected ? 'selected' : ''}">
      <button type="button" class="mission-block-route-main" data-filter="${block.id}" ${state.unlocked ? '' : 'disabled'}>
        <span class="mission-block-number">${String(block.number).padStart(2, '0')}</span>
        <div><small>PACOTE ${String(block.number).padStart(2, '0')} · ${block.total} MISSÕES</small><strong>${escapeHtml(block.title)}</strong><i><b style="width:${state.percentage}%"></b></i><em>${state.completed}/${state.total} · ${state.percentage}%</em></div>
        <span class="mission-block-state">${state.complete ? '✓' : state.state === 'locked' ? '🔒' : state.state === 'in-progress' ? '↻' : '→'}</span>
      </button>
      ${state.complete ? `<button type="button" class="mission-block-checkpoint-link" data-view-block-checkpoint="${block.id}">${state.claimed ? 'VER CHECKPOINT' : 'RESGATAR CHECKPOINT'}</button>` : ''}
    </article>`;
  }).join('')}
</section>`;

const renderBlockSummary = (profile, block) => {
  const state = getBlockState(profile, block);
  const nextMission = block.missionIds.map((id) => challenges.find((item) => item.id === id)).find((item) => item && ['available', 'in-progress'].includes(getMissionProgressState(item, profile).id));
  return `<article class="card mission-block-summary ${state.complete ? 'completed' : ''}">
    <div class="mission-block-summary-title"><span>${escapeHtml(block.icon)}</span><div><p class="eyebrow">BLOCO ${String(block.number).padStart(2, '0')} // CHECKPOINT PEDAGÓGICO</p><h2>${escapeHtml(block.title)}</h2><p>${escapeHtml(block.subtitle)}</p></div><strong>${state.percentage}%</strong></div>
    <div class="mission-block-summary-progress"><i><b style="width:${state.percentage}%"></b></i><span>${state.completed}/${state.total} missões</span></div>
    <div class="mission-block-performance-grid"><div><span>DESEMPENHO ATUAL</span><b>${escapeHtml(state.performance)}</b></div><div><span>PRECISÃO</span><b>${state.accuracy}%</b></div><div><span>MÉDIA DE ESTRELAS</span><b>${state.averageStars}/3</b></div><div><span>FERRAMENTAS/TESTES</span><b>${state.toolRuns + state.localTests}</b></div></div>
    <div class="mission-block-reward"><div><span>RECOMPENSA DO CHECKPOINT</span><strong>+${block.xpBonus} XP · +${block.coinBonus} ◇ · +${block.starBonus} ★</strong><small>${escapeHtml(block.badge)}</small></div>${state.complete ? `<button class="primary-button" data-view-block-checkpoint="${block.id}">${state.claimed ? 'VER RELATÓRIO' : 'CONCLUIR CHECKPOINT'}</button>` : nextMission ? `<button class="primary-button" data-challenge="${nextMission.id}">${getMissionProgressState(nextMission, profile).id === 'in-progress' ? 'RETOMAR MISSÃO' : 'INICIAR PRÓXIMA'}</button>` : '<span class="resource-pill">AGUARDANDO PRÉ-REQUISITO</span>'}</div>
  </article>`;
};

const renderMissionNavigation = (profile, filter) => `<aside class="mission-navigation card" aria-label="Organização das missões">
  <div class="mission-navigation-head"><p class="eyebrow">PACOTES DE MISSÕES</p><h2>Progresso em blocos</h2><p>Conclua um pacote por vez. Cada checkpoint gera relatório, emblema e bônus sem transformar a atividade em uma sequência cansativa.</p></div>
  <div class="mission-block-nav-list">
    ${missionBlocks.map((block) => {
      const state = getBlockState(profile, block);
      return `<button type="button" class="mission-block-nav ${filter === block.id ? 'active' : ''} ${state.state}" data-filter="${block.id}" ${state.unlocked ? '' : 'disabled'}><span>${String(block.number).padStart(2, '0')}</span><div><strong>${escapeHtml(block.title)}</strong><small>${state.completed}/${state.total} · ${blockStateLabel(state.state)}</small><i><b style="width:${state.percentage}%"></b></i></div><em>${state.complete ? '✓' : `${state.percentage}%`}</em></button>`;
    }).join('')}
  </div>
  <details class="mission-track-explorer"><summary>EXPLORAR TAMBÉM POR ÁREA TÉCNICA</summary><div class="mission-nav-groups">
    ${tracks.map((track) => {
      const stats = trackStats(track.id, profile);
      return `<button type="button" class="mission-nav-track ${filter === track.id ? 'active' : ''}" data-filter="${escapeHtml(track.id)}"><span class="mission-nav-icon">${escapeHtml(track.icon)}</span><span><strong>${escapeHtml(track.name)}</strong><small>${stats.completed}/${stats.total} concluídas</small><i><b style="width:${stats.percentage}%"></b></i></span><em>${stats.percentage}%</em></button>`;
    }).join('')}
  </div></details>
</aside>`;

export const renderCTF = (profile, filter = 'current-block', query = '') => {
  const sorted = sortedChallenges();
  const activeBlock = getActiveMissionBlock(profile);
  const selectedBlock = missionBlocks.find((block) => block.id === filter) || activeBlock;
  const normalizedFilter = filter === 'current-block' ? selectedBlock.id : filter;
  const normalizedQuery = String(query || '').trim().toLocaleLowerCase('pt-BR');
  const byStatus = (item) => {
    const state = getMissionProgressState(item, profile).id;
    if (missionBlocks.some((block) => block.id === normalizedFilter)) return getMissionBlock(item)?.id === normalizedFilter;
    if (normalizedFilter === 'available') return state === 'available' || state === 'in-progress';
    if (normalizedFilter === 'in-progress') return state === 'in-progress';
    if (normalizedFilter === 'completed') return state === 'completed';
    if (normalizedFilter === 'locked') return state === 'locked';
    if (normalizedFilter === 'all') return true;
    return item.track === normalizedFilter;
  };
  const visible = sorted.filter(byStatus).filter((item) => !normalizedQuery || [item.title, item.description, item.role, item.sector, trackName(item.track), item.interaction].some((value) => String(value || '').toLocaleLowerCase('pt-BR').includes(normalizedQuery)));
  const selectedBlockMissions = selectedBlock.missionIds.map((id) => challenges.find((item) => item.id === id)).filter(Boolean);
  const mapMissions = tracks.some((track) => track.id === normalizedFilter) ? sorted.filter((item) => item.track === normalizedFilter) : selectedBlockMissions;
  const completeCount = Object.keys(profile.completed || {}).length;
  const inProgressCount = sorted.filter((item) => getMissionProgressState(item, profile).id === 'in-progress').length;
  const lockedCount = sorted.filter((item) => getMissionProgressState(item, profile).id === 'locked').length;
  const next = sorted.find((item) => ['available', 'in-progress'].includes(getMissionProgressState(item, profile).id));
  const campaign = getCampaignBlockSummary(profile);
  return `
    <div class="page-head mission-page-head">
      <div><p class="eyebrow">CAPTURE THE FLAG // PROGRESSÃO MODULAR</p><h1>Central de Missões por Blocos</h1><p>Sete pacotes curtos, checkpoints de desempenho e retomada automática por perfil.</p></div>
      <div class="actions"><span class="resource-pill">▦ ${campaign.completed}/${campaign.total} blocos</span><span class="resource-pill">⚑ ${completeCount}/${challenges.length}</span><span class="resource-pill">★ ${profile.stars}</span></div>
    </div>
    ${renderBlockRoute(profile, selectedBlock.id)}
    ${renderBlockSummary(profile, selectedBlock)}
    <section class="mission-overview-grid" aria-label="Resumo das missões">
      <button class="mission-overview-card next" data-filter="${activeBlock.id}"><span>BLOCO ATUAL</span><strong>${String(activeBlock.number).padStart(2, '0')}</strong><small>${escapeHtml(activeBlock.title)}</small></button>
      <button class="mission-overview-card" data-filter="in-progress"><span>EM ANDAMENTO</span><strong>${inProgressCount}</strong><small>Rascunhos protegidos no perfil.</small></button>
      <button class="mission-overview-card" data-filter="completed"><span>MISSÕES CONCLUÍDAS</span><strong>${completeCount}</strong><small>Não precisam ser refeitas.</small></button>
      <button class="mission-overview-card" data-filter="locked"><span>FUTURAS/BLOQUEADAS</span><strong>${lockedCount}</strong><small>Liberadas por bloco e pré-requisito.</small></button>
    </section>
    <article class="card campaign-banner mission-resume-banner">
      <div><p class="eyebrow">PRÓXIMA AÇÃO DO BLOCO ${String(activeBlock.number).padStart(2, '0')}</p><h3>${next ? `${getMissionProgressState(next, profile).id === 'in-progress' ? 'Retomar' : 'Próximo desafio'}: ${escapeHtml(next.title)}` : 'Campanha concluída'}</h3><p>O sistema salva respostas em elaboração, seleções, evidências, testes e anotações no perfil criptografado.</p></div>
      ${next ? `<button class="primary-button" data-challenge="${escapeHtml(next.id)}">${getMissionProgressState(next, profile).id === 'in-progress' ? 'CONTINUAR MISSÃO' : 'INICIAR PRÓXIMA'} ↗</button>` : '<span class="mission-complete-seal">CAMPANHA CUMPRIDA</span>'}
    </article>
    ${renderCampaignPath(mapMissions, profile, tracks.some((track) => track.id === normalizedFilter) ? null : selectedBlock)}
    <div class="mission-workspace">
      ${renderMissionNavigation(profile, normalizedFilter)}
      <section class="mission-catalog">
        <div class="mission-catalog-toolbar card">
          <div class="filter-bar" role="tablist" aria-label="Filtrar missões"><button class="filter-button ${normalizedFilter === activeBlock.id ? 'active' : ''}" data-filter="${activeBlock.id}">▦ Bloco atual</button><button class="filter-button ${normalizedFilter === 'in-progress' ? 'active' : ''}" data-filter="in-progress">↻ Em andamento</button><button class="filter-button ${normalizedFilter === 'completed' ? 'active' : ''}" data-filter="completed">✓ Concluídas</button><button class="filter-button ${normalizedFilter === 'all' ? 'active' : ''}" data-filter="all">Todas</button></div>
          <label class="mission-search"><span>⌕</span><input type="search" data-mission-search value="${escapeHtml(query)}" placeholder="Buscar no bloco ou na campanha" aria-label="Buscar missões"></label>
        </div>
        <div class="mission-results-head"><div><p class="eyebrow">${missionBlocks.some((block) => block.id === normalizedFilter) ? `PACOTE ${String(selectedBlock.number).padStart(2, '0')}` : 'MISSÕES ENCONTRADAS'}</p><h2>${visible.length} operação(ões)</h2></div><small>Faça um bloco por vez e conclua o checkpoint antes de avançar.</small></div>
        <div class="mission-grid mission-grid-organized">${visible.length ? visible.map((challenge) => renderMissionCard(challenge, profile)).join('') : `<article class="card empty-missions"><span>SEM MISSÕES NESTE FILTRO</span><h3>Ajuste o bloco, o status ou a busca.</h3><button class="secondary-button" data-filter="${activeBlock.id}">VOLTAR AO BLOCO ATUAL</button></article>`}</div>
      </section>
    </div>`;
};

export const renderMissionCard = (challenge, profile) => {
  const progress = getMissionProgressState(challenge, profile);
  const completed = progress.id === 'completed';
  const unlocked = progress.id !== 'locked';
  const stars = profile.completed?.[challenge.id]?.stars || 0;
  const block = getMissionBlock(challenge);
  const blockState = getBlockState(profile, block);
  const position = block ? block.missionIds.indexOf(challenge.id) + 1 : 0;
  const prerequisiteReason = challenge.requires?.filter((id) => !profile.completed[id]).map((id) => challenges.find((item) => item.id === id)?.title).join(', ');
  const reason = !blockState?.unlocked ? `Conclua o Bloco ${String((block?.number || 1) - 1).padStart(2, '0')} e o checkpoint anterior` : prerequisiteReason;
  const attempts = profile.attempts?.[challenge.id] || 0;
  const draft = progress.draft;
  const investigative = hasInvestigativeCase(challenge.id);
  const advancedInvestigation = isAdvancedInvestigationMission(challenge.id);
  const narrativeInvestigation = isNarrativeMission(challenge.id);
  const immersiveScenario = getImmersiveScenarioForMission(challenge.id);
  const statusText = progress.id === 'in-progress' ? `Salvo ${formattedTime(draft?.lastSavedAt)}` : progress.label;
  return `<article class="mission-card mission-theme-${escapeHtml(challenge.theme)} status-${progress.id} ${completed ? 'completed' : ''} ${!unlocked ? 'locked' : ''}" style="${themeStyle(challenge.theme)}">
    <div class="mission-card-topline"><div class="mission-block-chip">BLOCO ${String(block?.number || 1).padStart(2, '0')} · MISSÃO ${String(position).padStart(2, '0')}/${block?.total || 10}</div>${investigative ? `<span class="investigative-case-chip ${advancedInvestigation ? 'advanced' : ''}">◉ ${narrativeInvestigation ? 'CASO NARRATIVO' : advancedInvestigation ? 'INVESTIGAÇÃO AVANÇADA' : 'CASO INVESTIGATIVO'}</span>` : ''}</div>
    <div class="mission-head"><span class="mission-code">${trackName(challenge.track).toUpperCase()} // ${challenge.id.toUpperCase()}</span><span class="difficulty difficulty-${escapeHtml(challenge.difficulty.toLowerCase())}">${challenge.difficulty}</span></div>
    <div class="mission-card-status"><span class="status-dot-card"></span><strong>${escapeHtml(statusText)}</strong></div>
    <div class="mission-sector">${escapeHtml(challenge.role)} · ${escapeHtml(challenge.sector)}</div>
    <h3>${escapeHtml(challenge.title)}</h3>
    <p>${escapeHtml(challenge.description)}</p>
    <div class="mission-card-objective"><span>TIPO DE ENTREGA</span><strong>${escapeHtml(challenge.interaction || interactionName(challenge.type))}</strong></div>
    <div class="mission-meta-row">${attempts ? `<span class="attempt-tag">${attempts} tentativa(s)</span>` : '<span class="attempt-tag">sem tentativa</span>'}${draft?.localTests ? `<span class="interaction-tag">${draft.localTests} teste(s)</span>` : ''}</div>
    ${completed ? `<div class="stars" aria-label="${stars} estrelas">${'★'.repeat(stars)}${'☆'.repeat(3 - stars)}</div>` : ''}
    <div class="mission-rewards"><span><b>+${challenge.xp}</b> XP</span><span><b>+${challenge.coins}</b> ◇</span><span><b>+1–3</b> ★</span></div>
    ${unlocked
      ? `<button class="${completed ? 'secondary-button' : 'primary-button'} full" data-challenge="${challenge.id}">${completed ? 'REVISAR MISSÃO' : progress.id === 'in-progress' ? 'CONTINUAR DE ONDE PAREI' : 'ABRIR MISSÃO'}</button>`
      : `<div class="lock-reason">🔒 Requer: ${escapeHtml(reason || 'missões anteriores')}</div>`}
  </article>`;
};

const isSelected = (draft, value) => draft?.selected?.includes(String(value));
const renderChoice = (challenge, draft, multiple = false) => `<div class="choice-list">${challenge.options.map((option, index) => `<label class="choice"><input type="${multiple ? 'checkbox' : 'radio'}" name="challenge-answer" value="${index}" ${isSelected(draft, index) ? 'checked' : ''}><span><b>${String.fromCharCode(65 + index)}</b>${escapeHtml(option)}</span></label>`).join('')}</div>`;
const renderCodeSelect = (challenge, draft) => `<div class="code-select-list">${challenge.codeLines.map((line, index) => `<label class="code-choice"><input type="checkbox" name="challenge-answer" value="${index}" ${isSelected(draft, index) ? 'checked' : ''}><span class="line-number">${String(index + 1).padStart(2, '0')}</span><code>${escapeHtml(line)}</code></label>`).join('')}</div>`;
const renderSequence = (challenge, draft) => {
  const order = draft?.sequence?.length ? draft.sequence : challenge.items.map((item) => item.id);
  const items = order.map((id) => challenge.items.find((item) => item.id === id)).filter(Boolean);
  challenge.items.forEach((item) => { if (!items.some((current) => current.id === item.id)) items.push(item); });
  return `<div class="sequence-list" data-sequence-list>${items.map((item, index) => `<div class="sequence-item" draggable="true" data-sequence-item="${escapeHtml(item.id)}"><span class="sequence-grip" aria-hidden="true">⠿</span><span class="sequence-index">${index + 1}</span><strong>${escapeHtml(item.label)}</strong><div class="sequence-actions"><button type="button" class="icon-button small" data-move-sequence="up" aria-label="Mover para cima">↑</button><button type="button" class="icon-button small" data-move-sequence="down" aria-label="Mover para baixo">↓</button></div></div>`).join('')}</div>`;
};
const renderMatching = (challenge, draft) => `<div class="matching-list">${challenge.pairs.map((pair) => `<label class="matching-row"><strong>${escapeHtml(pair.label)}</strong><select name="match-${escapeHtml(pair.id)}" data-match-id="${escapeHtml(pair.id)}"><option value="">Selecione a função</option>${pair.options.map((option, index) => `<option value="${index}" ${String(draft?.matches?.[pair.id] ?? '') === String(index) ? 'selected' : ''}>${escapeHtml(option)}</option>`).join('')}</select></label>`).join('')}</div>`;

const renderAnswerField = (challenge, draft) => {
  if (challenge.type === 'choice') return renderChoice(challenge, draft, false);
  if (challenge.type === 'multi-select') return renderChoice(challenge, draft, true);
  if (challenge.type === 'code-select') return renderCodeSelect(challenge, draft);
  if (challenge.type === 'sequence') return renderSequence(challenge, draft);
  if (challenge.type === 'matching') return renderMatching(challenge, draft);
  if (challenge.type === 'code-edit') return `<div class="editor-shell"><header><span>● ● ●</span><strong>${escapeHtml((challenge.language || 'código').toUpperCase())} // SANDBOX</strong></header><label class="code-editor-label"><textarea id="challenge-answer" class="code-editor" spellcheck="false">${escapeHtml(draft?.answer || challenge.starterCode || '')}</textarea></label><div class="local-test-row"><button type="button" class="secondary-button" data-run-local-test="${challenge.id}">▶ EXECUTAR TESTES LOCAIS</button><output data-local-test-output>${draft?.localTests ? `${draft.localTests} teste(s) executado(s) nesta retomada.` : 'Testes aguardando execução.'}</output></div></div>`;
  if (challenge.type === 'url-route') return `<div class="virtual-browser"><header><span>◀ ▶ ↻</span><strong>CTFDS VIRTUAL BROWSER</strong></header><label>ENDEREÇO VIRTUAL<div class="virtual-address"><span>https://ctfds.local</span><input id="challenge-answer" type="text" value="${escapeHtml(draft?.answer || '')}" placeholder="${escapeHtml(challenge.placeholder || '/rota')}"></div></label><div class="local-test-row"><button type="button" class="secondary-button" data-run-local-test="${challenge.id}">ABRIR ROTA LOCAL</button><output data-local-test-output>${draft?.localTests ? `${draft.localTests} teste(s) registrado(s).` : 'HTTP // aguardando endereço'}</output></div></div>`;
  const inputMode = challenge.type === 'calculation' ? ' inputmode="numeric"' : '';
  return `<label class="answer-label"><span>RESPOSTA DA MISSÃO</span><input id="challenge-answer" ${challenge.type === 'password' ? 'type="password" autocomplete="new-password"' : 'type="text"'}${inputMode} value="${escapeHtml(draft?.answer || '')}" placeholder="${escapeHtml(challenge.placeholder || 'Digite sua resposta')}"></label>`;
};

const inlineToolMap = { cyberchef: 'base64', openssl: 'hash', burp: 'url', zap: 'headers', postman: 'json', insomnia: 'json', splunk: 'logs', wazuh: 'logs', wireshark: 'logs', zeek: 'logs', riskengine: 'risk', pixmed: 'risk', devtools: 'url', semgrep: 'json', cloudtrail: 'logs', blockexplorer: 'hex' };
const renderToolkit = (challenge) => {
  const recommended = (challenge.tools || []).map(getOperatorTool).filter(Boolean);
  const functional = recommended.map((tool) => ({ tool, localId: inlineToolMap[tool.id] })).find((item) => item.localId);
  const guided = ['Recruta', 'Básico', 'Iniciante'].includes(challenge.difficulty);
  return `<section class="mission-tool-access ${guided ? 'guided' : 'autonomous'}">
    <div><span>${guided ? 'FERRAMENTAS SUGERIDAS' : 'ESCOLHA DA FERRAMENTA'}</span><strong>${guided ? escapeHtml(recommended.map((tool) => tool.name).join(' · ') || challenge.interaction || 'Gaveta local') : 'A ferramenta não é revelada neste nível'}</strong><small>${guided ? 'O guia ensina o funcionamento da ferramenta, mas não preenche nem mostra a resposta da missão.' : 'Formule uma hipótese e escolha a ferramenta adequada.'}</small></div>
    <button type="button" class="${guided ? 'primary-button' : 'secondary-button'}" data-open-tools-drawer="${guided && functional ? functional.localId : challenge.tutorial?.toolId || ''}">ABRIR FERRAMENTAS ↗</button>
  </section>`;
};

const renderDossier = (challenge, mode) => {
  const detailed = mode === 'detailed';
  return `<details class="mission-dossier" ${detailed ? 'open' : ''}><summary><span>CONTEXTO TÉCNICO E DEFESA</span><small>${detailed ? 'modo detalhado ativo' : 'conteúdo complementar'}</small></summary><div class="dossier-grid"><div><span>SETOR</span><strong>${escapeHtml(challenge.sector)}</strong></div><div><span>PAPEL</span><strong>${escapeHtml(challenge.role)}</strong></div><div><span>LINGUAGENS</span><strong>${escapeHtml((challenge.languages || []).join(' · '))}</strong></div><div><span>SISTEMAS</span><strong>${escapeHtml((challenge.systems || []).join(' · '))}</strong></div></div><div class="explanation-panel"><span>${detailed ? 'VISÃO DETALHADA' : 'RESUMO OPERACIONAL'}</span><p>${escapeHtml(detailed ? challenge.deepDive : challenge.brief)}</p></div>${challenge.reference ? `<a class="mission-reference" href="${escapeHtml(safeExternalUrl(challenge.reference.url))}" target="_blank" rel="noopener noreferrer">↗ REFERÊNCIA: ${escapeHtml(challenge.reference.label)}</a>` : ''}</details>`;
};

const supportLevel = (challenge) => {
  if (challenge.tutorial) return { label: 'GUIA DE FERRAMENTA', detail: 'Demonstra o uso da ferramenta com exemplo diferente; não revela a resposta.' };
  if (['Recruta', 'Básico'].includes(challenge.difficulty)) return { label: 'SUPORTE ALTO', detail: 'Objetivo explícito, ferramenta sugerida e pista gratuita.' };
  if (challenge.difficulty === 'Iniciante') return { label: 'SUPORTE MODERADO', detail: 'Objetivo claro e ferramentas sugeridas.' };
  if (challenge.difficulty === 'Intermediário') return { label: 'SUPORTE REDUZIDO', detail: 'Você escolhe a abordagem; pistas descontam XP.' };
  return { label: 'OPERAÇÃO AUTÔNOMA', detail: 'Situação e objetivo; descubra ferramentas e estratégia.' };
};

const genericToolSteps = (challenge) => [
  `Abra a ferramenta ${challenge.interaction || 'indicada'} pela gaveta lateral.`,
  'Identifique os campos de entrada, as opções e a área de saída.',
  'Teste a ferramenta com o exemplo fictício apresentado pelo tutorial — diferente dos dados desta missão.',
  'Observe como o resultado muda quando você altera uma opção ou parâmetro.',
  'Feche o guia e aplique o mesmo raciocínio aos dados da missão por conta própria.',
];

const renderTutorialPanel = (challenge, visible) => {
  if (!challenge.tutorial) return '';
  return `<section class="mission-tutorial ${visible ? 'open' : 'collapsed'}">
    <header><div><span>GUIA DE USO DA FERRAMENTA</span><strong>${escapeHtml(challenge.interaction || 'Operação guiada')}</strong></div><button type="button" class="secondary-button compact" data-toggle-tutorial="${challenge.id}">${visible ? 'OCULTAR GUIA' : 'MOSTRAR GUIA'}</button></header>
    ${visible ? `<div class="tutorial-safety-callout"><span>✓</span><div><strong>O guia não entrega a resposta</strong><p>Ele usa um exemplo separado e ensina somente onde clicar, o que cada campo faz e como interpretar a saída.</p></div></div><ol>${genericToolSteps(challenge).map((step, index) => `<li><b>${String(index + 1).padStart(2, '0')}</b><span>${escapeHtml(step)}</span></li>`).join('')}</ol><div class="tutorial-panel-actions"><button type="button" class="primary-button" data-start-animated-tutorial="${challenge.id}">▶ VER DEMONSTRAÇÃO GENÉRICA</button><button type="button" class="secondary-button" data-open-tools-drawer="${escapeHtml(challenge.tutorial.toolId)}">ABRIR FERRAMENTA</button></div><small>A missão continua aberta e seu rascunho é salvo automaticamente.</small>` : `<div class="tutorial-collapsed-copy"><p>O guia está oculto. Ele pode ser reaberto sem perder o rascunho e sem mostrar a solução.</p><button type="button" class="primary-button" data-start-animated-tutorial="${challenge.id}">▶ COMO USAR A FERRAMENTA</button></div>`}
  </section>`;
};

const renderTrainingStage = (challenge) => `<section class="training-stage"><div><span>ETAPA</span><b>${String(Math.max(1, 9 + Number(challenge.order || 0))).padStart(2, '0')}/08</b></div><div><span>FERRAMENTA</span><b>${escapeHtml(challenge.interaction || 'Ferramenta local')}</b></div><div><span>META</span><b>APRENDER O USO · RESOLVER SOZINHO</b></div></section>`;

const renderNotebook = (challenge, profile) => `<details class="mission-notebook" ${profile.missionNotes?.[challenge.id] ? 'open' : ''}><summary>DIÁRIO DE INVESTIGAÇÃO <small>salvo automaticamente</small></summary><label>ANOTAÇÕES<textarea data-mission-notes="${challenge.id}" placeholder="Registre hipóteses, testes e conclusões. Não inclua senha pessoal ou dado real.">${escapeHtml(profile.missionNotes?.[challenge.id] || '')}</textarea></label><span data-notes-status>protegido no perfil local</span></details>`;

const renderAuthorizedScope = (challenge) => `<details class="authorized-scope"><summary>ESCOPO AUTORIZADO E FINALIDADE EDUCACIONAL</summary><div><span>AMBIENTE AUTORIZADO</span><strong>CTF DS · sandbox local · dados fictícios</strong></div><div class="scope-columns"><div><b>PERMITIDO</b><p>Investigar a missão, usar as ferramentas locais, editar o código preparado e registrar o aprendizado.</p></div><div><b>PROIBIDO</b><p>Testar sites, redes, contas, dispositivos, credenciais ou pessoas reais.</p></div></div><small>Objetivo defensivo: ${escapeHtml(challenge.defense || 'compreender o risco, prevenir e mitigar a falha demonstrada.')}</small></details>`;
const nextAvailableMission = (profile, currentId) => sortedChallenges().find((item) => item.id !== currentId && isUnlocked(item, profile.completed) && !profile.completed[item.id]);

export const renderChallengeModal = (challenge, profile, result = null, showHint = false, tutorialVisible = Boolean(challenge.tutorial && profile.settings?.tutorialEnabled !== false)) => {
  const attempts = profile.attempts?.[challenge.id] || 0;
  const draft = getMissionDraft(profile, challenge.id);
  const inspectValue = getChallengeArtifact(challenge.artifactId || challenge.id, 'inspectValue');
  const customAttribute = challenge.inspectAttribute ? `${challenge.inspectAttribute}="${escapeHtml(inspectValue)}"` : `data-local-flag="${escapeHtml(inspectValue)}"`;
  const recoveredValue = getChallengeArtifact(challenge.revealArtifactId || challenge.id, 'reveal');
  const resolvedPrompt = resolveChallengePrompt(challenge);
  const inspectTarget = challenge.type === 'inspect' ? `<div class="inspect-lab"><header>DOM INSPECTOR TARGET</header><div class="inspect-target" ${customAttribute}>ALVO LOCAL #mission-${challenge.id} // existe uma pista em um atributo deste elemento</div><small>Examine somente este laboratório local autorizado.</small></div>` : '';
  const cost = getHintCost(challenge);
  const support = supportLevel(challenge);
  const block = getMissionBlock(challenge);
  const blockState = getBlockState(profile, block);
  const blockPosition = block ? block.missionIds.indexOf(challenge.id) + 1 : 1;
  const next = result?.success ? nextAvailableMission(profile, challenge.id) : null;
  const savedAt = draft?.lastSavedAt ? formattedTime(draft.lastSavedAt) : 'ao começar a interagir';
  const investigative = hasInvestigativeCase(challenge.id);
  const advancedInvestigation = isAdvancedInvestigationMission(challenge.id);
  const narrativeInvestigation = isNarrativeMission(challenge.id);
  const immersiveScenario = getImmersiveScenarioForMission(challenge.id);
  const answerContent = `<form id="challenge-form" data-challenge-id="${challenge.id}" class="mission-answer-workspace">
    <div class="mission-answer-head"><div><span>ENTREGA DA MISSÃO</span><strong>Registre sua resposta e a conclusão do caso</strong></div><small>As evidências ficam no mural e o guia não preenche este campo.</small></div>
    ${investigative ? renderInvestigationProcessGate(challenge.id, draft) : ''}
    ${renderAnswerField(challenge, draft)}
    ${showHint ? `<div class="hint-box"><strong>PISTA TÁTICA:</strong> ${escapeHtml(challenge.hint)}</div>` : ''}
    ${result ? `<div class="result-box ${result.success ? 'success' : 'error'}"><strong>${result.success ? 'CASO RESOLVIDO' : 'RESPOSTA AINDA NÃO VALIDADA'}</strong><p>${escapeHtml(result.message)}</p>${result.success ? `${renderInvestigationResolution(challenge.id, profile)}<div class="after-action"><span>DEBRIEF DEFENSIVO</span><p>${escapeHtml(challenge.defense)}</p></div>` : ''}${result.success && recoveredValue ? `<div class="recovered-data"><span>DADO RECUPERADO</span><code>${escapeHtml(recoveredValue)}</code><small>Este dado pertence ao encadeamento pedagógico da próxima fase.</small></div>` : ''}</div>` : ''}
    ${investigative ? '' : renderNotebook(challenge, profile)}
    <div class="challenge-actions sticky-actions"><button type="button" class="secondary-button" data-use-hint="${challenge.id}">${showHint ? 'PISTA EXIBIDA' : cost ? `SOLICITAR PISTA · -${cost} XP` : 'SOLICITAR PISTA GRATUITA'}</button><button type="submit" class="primary-button">VALIDAR RESPOSTA ↗</button>${next ? `<button type="button" class="secondary-button" data-open-next="${next.id}">PRÓXIMA MISSÃO →</button>` : ''}</div>
  </form>`;
  return `<div class="modal-layer mission-modal-layer mission-theme-${escapeHtml(challenge.theme)}" style="${themeStyle(challenge.theme)}" data-modal-close="true">
    <section class="challenge-modal panel mission-command-center ${investigative ? 'investigative-mode' : ''}" data-local-flag="${escapeHtml(inspectValue)}" role="dialog" aria-modal="true" aria-labelledby="challenge-title">
      <div class="mission-scanline" aria-hidden="true"></div>
      <header class="modal-head mission-modal-head"><div><p class="eyebrow">BLOCO ${String(block?.number || 1).padStart(2, '0')} · MISSÃO ${String(blockPosition).padStart(2, '0')}/${block?.total || 10} // ${trackName(challenge.track)} // ${challenge.difficulty}</p><h2 id="challenge-title">${escapeHtml(challenge.title)}</h2><p class="muted">${escapeHtml(challenge.role)} · ${escapeHtml(challenge.sector)}</p></div><div class="modal-head-actions">${immersiveScenario ? `<button type="button" class="secondary-button mission-immersive-button" data-open-tools-drawer="${escapeHtml(immersiveScenario.id)}">◉ 3D/360</button>` : ''}${investigative ? `<button type="button" class="secondary-button mission-guide-button" data-workspace-drawer="help">? AJUDA</button><button type="button" class="primary-button mission-tools-button" data-workspace-drawer="tools">⌘ INVESTIGAR</button>` : `<button type="button" class="secondary-button mission-guide-button" data-start-animated-tutorial="${challenge.id}">? COMO USAR</button><button type="button" class="primary-button mission-tools-button" data-open-tools-drawer="${escapeHtml(challenge.tutorial?.toolId || draft?.lastToolId || '')}">⌘ ABRIR FERRAMENTAS</button>`}<button class="icon-button" data-close-modal aria-label="Fechar e manter rascunho">×</button></div></header>
      <section class="mission-primary-objective" aria-labelledby="mission-objective-label"><div><span id="mission-objective-label">OBJETIVO PRINCIPAL DA MISSÃO</span><strong>${escapeHtml(resolvedPrompt)}</strong></div><div class="mission-objective-badges"><span>${escapeHtml(challenge.interaction || interactionName(challenge.type))}</span><span>${investigative ? (narrativeInvestigation ? 'CASO NARRATIVO' : advancedInvestigation ? 'INVESTIGAÇÃO AVANÇADA' : 'CASO INVESTIGATIVO') : escapeHtml(support.label)}</span>${immersiveScenario ? '<span>IMERSÃO 3D/360</span>' : ''}</div></section>
      <div class="mission-resume-strip"><span>●</span><div><strong>SALVAMENTO AUTOMÁTICO ATIVO</strong><small>Gavetas, materiais lidos, mural, análise e resposta ficam protegidos no perfil. Último registro: ${escapeHtml(savedAt)}.</small></div><button type="button" class="text-button" data-clear-mission-draft="${challenge.id}">LIMPAR RASCUNHO</button></div>
      ${investigative ? '' : `<section class="mission-situation"><span>SITUAÇÃO-PROBLEMA</span><p>${escapeHtml(challenge.description)}</p></section>`}
      <div class="mission-hud compact-hud"><div><span>BLOCO</span><strong>${String(block?.number || 1).padStart(2, '0')} · ${blockState?.completed || 0}/${block?.total || 10}</strong></div><div><span>TENTATIVAS</span><strong>${attempts}</strong></div><div><span>RECOMPENSA</span><strong>${challenge.xp} XP · ${challenge.coins} ◇</strong></div><div><span>EVIDÊNCIAS</span><strong>${draft?.workspace?.selectedEvidence?.length || draft?.evidence?.length || 0}</strong></div>${investigative ? `<div><span>TEMPO ATIVO</span><strong data-mission-active-time>${formatActiveMissionTime(draft?.workspace?.activeSeconds || 0)}</strong></div>` : ''}<div><span>STATUS</span><strong>${profile.completed?.[challenge.id] ? 'CONCLUÍDA' : draft ? 'EM ANDAMENTO' : 'NOVA'}</strong></div></div>
      ${investigative ? `<div class="mission-investigative-shell">${renderInvestigativeWorkspace(challenge, draft, { completed: Boolean(profile.completed?.[challenge.id]), profile })}<details class="mission-submit-drawer" ${result ? 'open' : ''}><summary><span>04</span><div><strong>RESPONDER E CONCLUIR</strong><small>Abra quando tiver evidências suficientes.</small></div><em>↗</em></summary>${inspectTarget}${answerContent}</details></div>` : `<div class="mission-command-layout"><main class="mission-main-column">${challenge.tutorial ? renderTrainingStage(challenge) : renderMissionScenario(challenge, draft)}${renderTutorialPanel(challenge, tutorialVisible)}${inspectTarget}${answerContent}</main><aside class="mission-side-column"><section class="mission-instructions-panel"><header><span>INSTRUÇÕES DA MISSÃO</span><strong>Quatro etapas simples</strong></header><ol class="mission-flow" aria-label="Fluxo recomendado da missão"><li><b>01</b><span>LEIA O OBJETIVO<small>Identifique exatamente o que deve entregar.</small></span></li><li><b>02</b><span>ABRA A FERRAMENTA<small>Use o guia somente para aprender os controles.</small></span></li><li><b>03</b><span>TESTE E REGISTRE<small>Faça o procedimento com os dados da missão.</small></span></li><li><b>04</b><span>VALIDE A RESPOSTA<small>Confira formato, símbolos e sequência.</small></span></li></ol></section>${renderToolkit(challenge)}<section class="mission-progress-panel"><span>PROGRESSO DESTA MISSÃO</span><div><b>${draft?.toolRuns || 0}</b><small>aberturas de ferramenta</small></div><div><b>${draft?.localTests || 0}</b><small>testes locais</small></div><div><b>${draft?.evidence?.length || 0}</b><small>evidências marcadas</small></div><div><b>${draft?.submissions || 0}</b><small>validações</small></div></section>${renderAuthorizedScope(challenge)}${renderDossier(challenge, profile.settings?.explanationMode || 'short')}</aside></div>`}
      <p class="safety-note"><strong>Finalidade educacional:</strong> esta atividade ocorre em ambiente autorizado, local e simulado. Aprenda a identificar riscos, corrigir falhas e proteger sistemas.</p>
    </section>
  </div>`;
};

export const renderBlockCheckpointModal = (block, profile, { newlyClaimed = false } = {}) => {
  const state = getBlockState(profile, block);
  if (!state) return '';
  const nextBlock = missionBlocks[block.number] || null;
  const checkpoint = profile.missionBlocks?.[block.id];
  return `<div class="modal-layer checkpoint-modal-layer" data-modal-close="true">
    <section class="panel block-checkpoint-modal ${state.claimed ? 'claimed' : ''}" role="dialog" aria-modal="true" aria-labelledby="checkpoint-title">
      <div class="checkpoint-celebration" aria-hidden="true"><i></i><i></i><i></i><span>${escapeHtml(block.icon)}</span></div>
      <p class="eyebrow">CHECKPOINT ${String(block.number).padStart(2, '0')} // PACOTE DE MISSÕES</p>
      <h2 id="checkpoint-title">${state.claimed ? 'Bloco concluído e registrado' : 'Bloco pronto para conclusão'}</h2>
      <p>${escapeHtml(block.title)} · ${state.completed}/${state.total} missões finalizadas.</p>
      <div class="checkpoint-performance"><div><span>INDICADOR</span><strong>${escapeHtml(state.performance)}</strong><small>${state.score}/100</small></div><div><span>PRECISÃO</span><strong>${state.accuracy}%</strong><small>${state.attempts} tentativa(s)</small></div><div><span>ESTRELAS</span><strong>${state.stars}</strong><small>média ${state.averageStars}/3</small></div><div><span>PRÁTICA</span><strong>${state.toolRuns + state.localTests}</strong><small>ferramentas e testes</small></div></div>
      <div class="checkpoint-detail-grid"><div><span>PISTAS UTILIZADAS</span><b>${state.hints}</b></div><div><span>MISSÕES DO BLOCO</span><b>${state.completed}/${state.total}</b></div><div><span>EMBLEMA</span><b>${escapeHtml(block.badge)}</b></div></div>
      <div class="checkpoint-reward-box ${state.claimed ? 'claimed' : ''}"><span>${state.claimed ? 'RECOMPENSAS REGISTRADAS NO EXTRATO' : 'RECOMPENSAS DO CHECKPOINT'}</span><strong>+${block.xpBonus} XP · +${block.coinBonus} ◇ · +${block.starBonus} ★</strong><small>${state.claimed ? `Registro: ${escapeHtml(checkpoint?.checkpointId || block.id)}` : 'O bônus é concedido uma única vez e não influencia a nota.'}</small></div>
      <div class="checkpoint-actions">
        ${state.claimed ? '' : `<button type="button" class="primary-button" data-claim-block="${block.id}">CONCLUIR E RESGATAR CHECKPOINT</button>`}
        ${nextBlock && state.claimed ? `<button type="button" class="primary-button" data-open-block="${nextBlock.id}">ABRIR BLOCO ${String(nextBlock.number).padStart(2, '0')} →</button>` : ''}
        <button type="button" class="secondary-button" data-close-modal>${newlyClaimed ? 'VOLTAR À CENTRAL' : 'FECHAR RELATÓRIO'}</button>
      </div>
      <p class="checkpoint-note">O indicador é formativo: considera conclusão, precisão, estrelas e participação prática. A avaliação final continua dependente dos critérios definidos pelo professor.</p>
    </section>
  </div>`;
};
