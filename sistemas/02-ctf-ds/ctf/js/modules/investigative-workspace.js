import { escapeHtml } from '../core/utils.js';
import {
  getMissionCase, isPilotMission, isAdvancedInvestigationMission, isNarrativeMission, isSimulationMission, getInvestigationReadiness,
} from '../data/mission-cases.js';
import {
  evidenceKey, findCaseItem, getEvidenceItems, isCaseItemUnlocked, getLockedReason,
  normalizeEvidenceAnnotations, getEvidenceAnnotationStats, normalizeTimelineOrder,
  moveTimelineEvent, getTimelineAssessment, getDecisionState, getAdaptiveHelp,
  getProgressiveUnlockDelta, getEvidenceRoleLabel, getUnlockedItemIds,
} from '../core/investigation-engine.js';
import { getNarrativeArc, getNarrativeCast, getNarrativeVariant, getNarrativeUpdates, getNarrativeCallback } from '../core/narrative-engine.js';

const drawerMeta = Object.freeze({
  briefing: ['◎', 'Caso', 'Objetivo e resultado esperado', 'case'],
  documents: ['▤', 'Documentos', 'Políticas, relatórios e manuais', 'case'],
  communications: ['✉', 'Comunicações', 'E-mails e mensagens fictícias', 'case'],
  records: ['≡', 'Registros', 'Logs e eventos correlacionados', 'investigation'],
  files: ['▣', 'Arquivos', 'Dados preparados para análise', 'investigation'],
  tools: ['⌘', 'Ferramentas', 'Recursos da investigação', 'investigation'],
  analysis: ['◇', 'Análise', 'Hipótese, linha do tempo e decisão', 'analysis'],
  evidence: ['★', 'Evidências', 'Itens fixados e analisados', 'analysis'],
  help: ['?', 'Ajuda extra', 'Orientação progressiva sem resposta', 'help'],
});

const drawerGroups = Object.freeze([
  ['case', 'CASO'], ['investigation', 'INVESTIGAÇÃO'], ['analysis', 'ANÁLISE'], ['help', 'AJUDA'],
]);

const cleanWorkspace = (draft = {}, caseData = null) => {
  const source = draft && typeof draft === 'object' ? draft : {};
  const workspace = source.workspace || {};
  return {
    activeDrawer: workspace.activeDrawer || 'briefing',
    currentItemId: workspace.currentItemId || '',
    viewedItems: Array.isArray(workspace.viewedItems) ? workspace.viewedItems : [],
    openedDrawers: Array.isArray(workspace.openedDrawers) ? workspace.openedDrawers : [],
    selectedEvidence: Array.isArray(workspace.selectedEvidence) ? workspace.selectedEvidence : [],
    usedTools: Array.isArray(workspace.usedTools) ? workspace.usedTools : [],
    evidenceAnnotations: normalizeEvidenceAnnotations(workspace.evidenceAnnotations),
    timelineOrder: normalizeTimelineOrder(caseData, workspace.timelineOrder),
    timelineMoves: Math.max(0, Number(workspace.timelineMoves) || 0),
    decisionChoice: workspace.decisionChoice || '',
    decisionHistory: Array.isArray(workspace.decisionHistory) ? workspace.decisionHistory : [],
    helpLevelsViewed: Array.isArray(workspace.helpLevelsViewed) ? workspace.helpLevelsViewed : [],
    narrativeUpdatesViewed: Array.isArray(workspace.narrativeUpdatesViewed) ? workspace.narrativeUpdatesViewed : [],
    openingSeen: Boolean(workspace.openingSeen),
    closingSeen: Boolean(workspace.closingSeen),
    supportRequests: Array.isArray(workspace.supportRequests) ? workspace.supportRequests : [],
    simulatorHistory: Array.isArray(workspace.simulatorHistory) ? workspace.simulatorHistory : [],
    lastSimulatorId: workspace.lastSimulatorId || '',
    hypothesis: workspace.hypothesis || '',
    timelineNotes: workspace.timelineNotes || '',
    recommendation: workspace.recommendation || '',
    conclusion: workspace.conclusion || '',
    activeSeconds: Math.max(0, Number(workspace.activeSeconds) || 0),
  };
};

export const formatActiveMissionTime = (seconds = 0) => {
  const safe = Math.max(0, Math.floor(Number(seconds) || 0));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const remaining = safe % 60;
  return hours
    ? `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remaining).padStart(2, '0')}`
    : `${String(minutes).padStart(2, '0')}:${String(remaining).padStart(2, '0')}`;
};

const renderNarrativeOpening = (missionId, caseData, workspace, profile) => {
  const narrative = caseData?.narrative;
  if (!narrative || workspace.openingSeen) return '';
  const arc = getNarrativeArc(narrative.arcId);
  const variant = getNarrativeVariant(profile, missionId, caseData);
  const cast = getNarrativeCast(caseData);
  return `<section class="narrative-opening scene-${escapeHtml(narrative.opening?.scene || 'command-center')}" data-narrative-opening>
    <div class="narrative-opening-visual" aria-hidden="true"><i></i><i></i><i></i><span>${String(narrative.episode || 1).padStart(2, '0')}</span></div>
    <div class="narrative-opening-copy"><p class="eyebrow">${escapeHtml(narrative.opening?.kicker || arc?.title || 'OPERAÇÃO SENTINEL')} · EPISÓDIO ${String(narrative.episode || 1).padStart(2, '0')}</p><h3>${escapeHtml(narrative.opening?.title || caseData.incident)}</h3><p>${escapeHtml(narrative.opening?.body || caseData.summary)}</p>
      <div class="narrative-variant-strip"><span>POSTO <b>${escapeHtml(variant.location)}</b></span><span>TURNO <b>${escapeHtml(variant.shiftCode)}</b></span><span>CODINOME <b>${escapeHtml(variant.callSign)}</b></span></div>
      <div class="narrative-cast">${cast.map((person) => `<span title="${escapeHtml(person.role)}"><b>${escapeHtml(person.avatar)}</b><i>${escapeHtml(person.name)}</i></span>`).join('')}</div>
      <div class="narrative-opening-actions"><button type="button" class="primary-button" data-narrative-enter>ENTRAR NO CASO →</button><button type="button" class="secondary-button" data-narrative-enter> PULAR ABERTURA</button></div>
    </div>
  </section>`;
};

const renderNarrativeCommand = (caseData, draft, workspace, profile) => {
  const narrative = caseData?.narrative;
  if (!narrative) return '';
  const arc = getNarrativeArc(narrative.arcId);
  const callback = getNarrativeCallback(profile, caseData);
  const updates = getNarrativeUpdates(caseData, draft);
  return `<section class="narrative-command-channel"><header><div><span>CANAL DA OPERAÇÃO</span><strong>${escapeHtml(arc?.title || 'Campanha Sentinel')}</strong></div><small>comunicações programadas pelo progresso</small></header>
    ${callback ? `<div class="narrative-callback quality-${escapeHtml(callback.decisionQuality || 'context')}"><b>${escapeHtml(callback.label)}</b><p>${escapeHtml(callback.message)}</p></div>` : ''}
    <div class="narrative-updates">${updates.map((update) => update.unlocked ? `<article class="${update.viewed ? 'viewed' : 'new'}"><span>${escapeHtml(update.character?.avatar || 'S')}</span><div><small>${escapeHtml(update.character?.name || 'Central Sentinel')}</small><strong>${escapeHtml(update.title)}</strong><p>${escapeHtml(update.body)}</p></div><button type="button" data-narrative-update="${escapeHtml(update.id)}">${update.viewed ? 'LIDA' : 'MARCAR COMO LIDA'}</button></article>` : `<article class="locked"><span>⌁</span><div><small>COMUNICAÇÃO BLOQUEADA</small><strong>Avance na investigação</strong><p>Uma nova transmissão será liberada após ações coerentes no caso.</p></div></article>`).join('')}</div>
  </section>`;
};

const renderBriefing = (missionId, caseData, advanced, profile, draft, workspace) => `<section class="investigation-briefing investigation-panel">
  ${renderNarrativeOpening(missionId, caseData, workspace, profile)}
  <div class="case-opening"><div><span>${escapeHtml(caseData.caseId)}</span><h3>${escapeHtml(caseData.incident)}</h3><p>${escapeHtml(caseData.summary)}</p></div><div class="case-status"><small>ORGANIZAÇÃO FICTÍCIA</small><strong>${escapeHtml(caseData.organization)}</strong><small>PAPEL</small><strong>${escapeHtml(caseData.role)}</strong><small>PRIORIDADE</small><strong>${escapeHtml(caseData.urgency)}</strong></div></div>
  <div class="case-expected"><span>RESULTADO ESPERADO</span><ol>${caseData.expected.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ol></div>
  ${advanced ? '<div class="advanced-case-notice"><b>INVESTIGAÇÃO AVANÇADA</b><span>Alguns materiais serão liberados conforme documentos, ferramentas, linha do tempo e decisões forem analisados.</span></div>' : ''}${isSimulationMission(missionId) ? '<div class="advanced-case-notice simulation-case-notice"><b>SIMULATION SUITE</b><span>Este caso utiliza uma interface profissional simulada. Todos os ativos, mensagens, dispositivos e redes são fictícios.</span></div>' : ''}
  ${renderNarrativeCommand(caseData, draft, workspace, profile)}
  <div class="case-start-actions"><button type="button" class="primary-button" data-workspace-drawer="documents">ABRIR PRIMEIROS DOCUMENTOS →</button><button type="button" class="secondary-button" data-workspace-drawer="analysis">ABRIR ÁREA DE ANÁLISE</button></div>
</section>`;

const itemCard = (drawer, item, workspace, unlocked) => {
  const viewed = workspace.viewedItems.includes(item.id);
  const selected = workspace.selectedEvidence.includes(evidenceKey(drawer, item.id));
  if (!unlocked) return `<article class="investigation-item-card locked"><div class="investigation-item-locked"><span>⌁</span><div><strong>MATERIAL BLOQUEADO</strong><small>${escapeHtml(getLockedReason(item))}</small></div></div></article>`;
  return `<article class="investigation-item-card ${viewed ? 'viewed' : ''} ${selected ? 'pinned' : ''}">
    <button type="button" class="investigation-item-open" data-workspace-item="${escapeHtml(item.id)}" data-workspace-item-drawer="${drawer}"><span>${viewed ? '✓' : '•'}</span><div><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.type || item.from || item.purpose || 'Material investigativo')}</small></div><em>${viewed ? 'REABRIR' : 'ABRIR'}</em></button>
    ${drawer === 'tools' ? '' : `<button type="button" class="investigation-pin-button" data-workspace-evidence="${escapeHtml(evidenceKey(drawer, item.id))}" aria-pressed="${selected ? 'true' : 'false'}">${selected ? '★ FIXADA' : '☆ FIXAR EVIDÊNCIA'}</button>`}
  </article>`;
};

const renderItemList = (drawer, caseData, workspace, draft, completed) => {
  const items = caseData[drawer] || [];
  if (!items.length) return '<div class="investigation-empty">Nenhum material disponível nesta gaveta.</div>';
  const available = items.filter((item) => isCaseItemUnlocked(item, draft, caseData));
  const currentFound = findCaseItem(caseData, workspace.currentItemId);
  const currentItem = currentFound?.drawer === drawer && isCaseItemUnlocked(currentFound.item, draft, caseData)
    ? currentFound.item : available[0];
  return `<section class="investigation-panel investigation-library"><div class="investigation-library-list"><header><span>${escapeHtml(drawerMeta[drawer][1])}</span><small>${available.length}/${items.length} disponível(is) · abra somente o necessário</small></header>${items.map((item) => itemCard(drawer, item, workspace, isCaseItemUnlocked(item, draft, caseData))).join('')}</div><div class="investigation-reader">${currentItem ? renderReader(drawer, currentItem, workspace, completed) : '<div class="investigation-empty">Continue a investigação para liberar o primeiro material desta gaveta.</div>'}</div></section>`;
};

const renderRoleReveal = (item, completed) => completed ? `<div class="evidence-role-reveal role-${escapeHtml(item.role || 'neutral')}"><span>CLASSIFICAÇÃO DO DEBRIEF</span><strong>${escapeHtml(getEvidenceRoleLabel(item.role))}</strong></div>` : '';

const renderReader = (drawer, item, workspace, completed) => {
  if (!item) return '<div class="investigation-empty">Selecione um item.</div>';
  const pinned = workspace.selectedEvidence.includes(evidenceKey(drawer, item.id));
  if (drawer === 'tools') return `<article class="reader-document tool-reader ${String(item.toolId || '').startsWith('sim-') ? 'simulation-tool-reader' : ''}"><p class="eyebrow">${String(item.toolId || '').startsWith('sim-') ? 'SIMULADOR REALISTA · SANDBOX' : 'FERRAMENTA LOCAL'}</p><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.description)}</p><div class="reader-callout"><span>FINALIDADE</span><p>${escapeHtml(item.purpose)}</p></div><button type="button" class="primary-button" data-open-tools-drawer="${escapeHtml(item.toolId)}">ABRIR ${escapeHtml(item.title.toUpperCase())}</button><p class="reader-footnote">${String(item.toolId || '').startsWith('sim-') ? 'O simulador reproduz uma interface profissional com dados fictícios. Não acessa e-mail, navegador, celular, rede ou sistema real.' : 'A ferramenta processa somente dados do laboratório e não executa varredura real.'}</p></article>`;
  if (drawer === 'records') return `<article class="reader-document"><p class="eyebrow">REGISTRO SIMULADO</p><h3>${escapeHtml(item.title)}</h3><div class="investigation-log-table">${item.rows.map((row) => `<div>${row.map((cell, index) => `<${index === 1 ? 'code' : 'span'}>${escapeHtml(cell)}</${index === 1 ? 'code' : 'span'}>`).join('')}</div>`).join('')}</div>${renderRoleReveal(item, completed)}${renderEvidenceAction(drawer, item, pinned)}</article>`;
  if (drawer === 'communications') return `<article class="reader-document email-reader"><div class="email-reader-head"><span>DE</span><strong>${escapeHtml(item.from)}</strong><span>ASSUNTO</span><strong>${escapeHtml(item.subject)}</strong></div><div class="email-reader-body">${escapeHtml(item.body)}</div>${renderRoleReveal(item, completed)}${renderEvidenceAction(drawer, item, pinned)}</article>`;
  return `<article class="reader-document"><p class="eyebrow">${escapeHtml(item.type || 'ARQUIVO')}</p><h3>${escapeHtml(item.title)}</h3>${item.date ? `<div class="reader-meta"><span>DATA ${escapeHtml(item.date)}</span><span>ORIGEM ${escapeHtml(item.source || 'laboratório')}</span></div>` : ''}<pre>${escapeHtml(item.content)}</pre>${renderRoleReveal(item, completed)}${renderEvidenceAction(drawer, item, pinned)}</article>`;
};

const renderEvidenceAction = (drawer, item, pinned) => `<div class="reader-evidence-action"><p>${escapeHtml(item.evidence || 'Este item pode apoiar a investigação.')}</p><button type="button" class="${pinned ? 'secondary-button' : 'primary-button'}" data-workspace-evidence="${escapeHtml(evidenceKey(drawer, item.id))}" aria-pressed="${pinned ? 'true' : 'false'}">${pinned ? 'REMOVER DO MURAL' : 'FIXAR NO MURAL'}</button></div>`;

const relationOptions = (value) => [
  ['', 'Selecione a relação'], ['supports', 'Apoia a hipótese'], ['contradicts', 'Contradiz a hipótese'], ['context', 'Contextualiza o caso'],
].map(([id, label]) => `<option value="${id}" ${value === id ? 'selected' : ''}>${label}</option>`).join('');
const confidenceOptions = (value) => [
  ['', 'Selecione a confiança'], ['low', 'Baixa'], ['medium', 'Média'], ['high', 'Alta'],
].map(([id, label]) => `<option value="${id}" ${value === id ? 'selected' : ''}>${label}</option>`).join('');

const renderEvidenceWall = (caseData, workspace, completed) => {
  const all = getEvidenceItems(caseData);
  const selected = all.filter(({ drawer, item }) => workspace.selectedEvidence.includes(evidenceKey(drawer, item.id)));
  const stats = getEvidenceAnnotationStats(workspace);
  return `<section class="investigation-panel evidence-wall"><header><div><span>MURAL DE EVIDÊNCIAS</span><h3>${selected.length} item(ns) fixado(s)</h3></div><small>${stats.complete}/${selected.length} com análise completa</small></header>${selected.length ? `<div class="evidence-wall-grid advanced">${selected.map(({ drawer, item }, index) => {
    const id = evidenceKey(drawer, item.id); const annotation = workspace.evidenceAnnotations[id] || {};
    return `<article class="evidence-analysis-card"><div class="evidence-analysis-head"><span>${String(index + 1).padStart(2, '0')}</span><div><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(drawerMeta[drawer][1])}</small></div><button type="button" data-workspace-evidence="${escapeHtml(id)}" aria-label="Remover evidência">×</button></div><p>${escapeHtml(item.evidence)}</p>${renderRoleReveal(item, completed)}<label>MINHA ANÁLISE<textarea data-evidence-annotation="${escapeHtml(id)}" data-annotation-field="note" placeholder="Explique por que este item importa para sua hipótese.">${escapeHtml(annotation.note || '')}</textarea></label><div class="evidence-analysis-selects"><label>RELAÇÃO<select data-evidence-annotation="${escapeHtml(id)}" data-annotation-field="relation">${relationOptions(annotation.relation)}</select></label><label>CONFIANÇA<select data-evidence-annotation="${escapeHtml(id)}" data-annotation-field="confidence">${confidenceOptions(annotation.confidence)}</select></label></div></article>`;
  }).join('')}</div>` : '<div class="investigation-empty">Abra documentos, registros, comunicações ou arquivos e fixe os itens importantes.</div>'}<button type="button" class="primary-button" data-workspace-drawer="analysis">ORGANIZAR ANÁLISE →</button></section>`;
};

const renderTimeline = (caseData, workspace) => {
  const assessment = getTimelineAssessment(caseData, workspace);
  if (!assessment.events.length) return `<label>LINHA DO TEMPO / RELAÇÕES<textarea data-workspace-field="timelineNotes" placeholder="Relacione horários, pessoas, dispositivos e eventos.">${escapeHtml(workspace.timelineNotes)}</textarea></label>`;
  const byId = new Map(assessment.events.map((event) => [event.id, event]));
  return `<section class="timeline-workspace ${assessment.correct ? 'correct' : ''}"><header><div><span>LINHA DO TEMPO VISUAL</span><strong>${assessment.correct ? 'Ordem coerente registrada' : 'Organize os eventos'}</strong></div><small>${workspace.timelineMoves} movimento(s)</small></header><div class="timeline-event-list">${assessment.order.map((id, index) => { const event = byId.get(id); if (!event) return ''; return `<article><div class="timeline-marker"><b>${String(index + 1).padStart(2, '0')}</b><i></i></div><div><time>${escapeHtml(event.time)}</time><strong>${escapeHtml(event.title)}</strong><p>${escapeHtml(event.detail)}</p></div><div class="timeline-controls"><button type="button" data-timeline-move="${escapeHtml(id)}" data-direction="up" ${index === 0 ? 'disabled' : ''} aria-label="Mover evento para cima">↑</button><button type="button" data-timeline-move="${escapeHtml(id)}" data-direction="down" ${index === assessment.order.length - 1 ? 'disabled' : ''} aria-label="Mover evento para baixo">↓</button></div></article>`; }).join('')}</div><label>OBSERVAÇÃO DA LINHA DO TEMPO<textarea data-workspace-field="timelineNotes" placeholder="Explique a relação temporal mais importante.">${escapeHtml(workspace.timelineNotes)}</textarea></label></section>`;
};

const renderDecision = (caseData, workspace) => {
  const state = getDecisionState(caseData, workspace);
  if (!state.decision) return '';
  return `<section class="investigation-decision"><header><span>DECISÃO INVESTIGATIVA</span><h4>${escapeHtml(state.decision.prompt)}</h4><small>A decisão é educativa e pode ser revisada antes da resposta final.</small></header><div class="decision-options">${state.decision.options.map((option) => `<button type="button" class="${state.choice === option.id ? `selected quality-${escapeHtml(option.quality)}` : ''}" data-workspace-decision="${escapeHtml(option.id)}"><b>${state.choice === option.id ? '✓' : '○'}</b><span>${escapeHtml(option.label)}</span></button>`).join('')}</div>${state.option ? `<div class="decision-consequence quality-${escapeHtml(state.option.quality)}"><span>CONSEQUÊNCIA EDUCATIVA</span><p>${escapeHtml(state.option.feedback)}</p></div>` : ''}</section>`;
};

const renderAnalysis = (caseData, workspace) => `<section class="investigation-panel analysis-workspace"><header><div><span>ÁREA DE ANÁLISE</span><h3>Organize o raciocínio antes de responder</h3></div><small>Salvo automaticamente no perfil criptografado</small></header><div class="analysis-fields"><label>HIPÓTESE ATUAL<textarea data-workspace-field="hypothesis" placeholder="O que você acredita que aconteceu?">${escapeHtml(workspace.hypothesis)}</textarea></label>${renderTimeline(caseData, workspace)}${renderDecision(caseData, workspace)}<label>RECOMENDAÇÃO DEFENSIVA<textarea data-workspace-field="recommendation" placeholder="Qual medida reduz o risco sem causar impacto desnecessário?">${escapeHtml(workspace.recommendation)}</textarea></label><label>CONCLUSÃO EM RASCUNHO<textarea data-workspace-field="conclusion" placeholder="Resuma sua conclusão com base nas evidências.">${escapeHtml(workspace.conclusion)}</textarea></label></div></section>`;

const renderHelp = (caseData, draft) => {
  const levels = getAdaptiveHelp(caseData, draft);
  return `<section class="investigation-panel help-drawer"><header><span>AJUDA EM CAMADAS</span><h3>Orientação progressiva sem entregar a resposta</h3></header><div class="help-levels advanced">${levels.map((level, index) => `<article class="${level.viewed ? 'viewed' : ''} ${level.available ? 'available' : 'locked'}"><b>${String(index + 1).padStart(2, '0')}</b><div><strong>${escapeHtml(level.title)}</strong>${level.viewed ? `<p>${escapeHtml(level.body)}</p>` : `<p>${level.available ? 'Esta orientação está disponível. Abra somente quando precisar.' : 'Conclua a orientação anterior e avance na investigação.'}</p>`}<button type="button" class="secondary-button compact" data-help-level="${escapeHtml(level.id)}" ${!level.available ? 'disabled' : ''}>${level.viewed ? 'ORIENTAÇÃO ABERTA' : 'ABRIR ORIENTAÇÃO'}</button></div></article>`).join('')}</div><div class="support-request-panel"><span>PRECISA DE APOIO HUMANO?</span><p>O registro fica apenas neste dispositivo; procure o professor após selecionar o motivo.</p><div><button type="button" data-workspace-support="nao-entendi">NÃO ENTENDI O CASO</button><button type="button" data-workspace-support="ferramenta">DIFICULDADE NA FERRAMENTA</button><button type="button" data-workspace-support="tecnico">PROBLEMA TÉCNICO</button><button type="button" data-workspace-support="acessibilidade">RECURSO DE ACESSIBILIDADE</button></div></div><p class="help-safety">A ajuda não mostra resposta, flag, sequência pronta ou dado avaliado. Ela orienta método, conceito e uso da ferramenta.</p></section>`;
};

const renderActiveDrawer = (challenge, caseData, workspace, draft, completed, profile) => {
  switch (workspace.activeDrawer) {
    case 'briefing': return renderBriefing(challenge.id, caseData, isAdvancedInvestigationMission(challenge.id), profile, draft, workspace);
    case 'tools': case 'documents': case 'records': case 'communications': case 'files': return renderItemList(workspace.activeDrawer, caseData, workspace, draft, completed);
    case 'analysis': return renderAnalysis(caseData, workspace);
    case 'evidence': return renderEvidenceWall(caseData, workspace, completed);
    case 'help': return renderHelp(caseData, draft);
    default: return renderBriefing(challenge.id, caseData, isAdvancedInvestigationMission(challenge.id), profile, draft, workspace);
  }
};

export const renderInvestigationProcessGate = (missionId, draft = {}, { compact = false } = {}) => {
  const readiness = getInvestigationReadiness(missionId, draft);
  return `<section class="investigation-process-gate ${readiness.ready ? 'ready' : ''} ${compact ? 'compact' : ''}" data-investigation-process-gate>
    <header><div><span>CHECKLIST DE INVESTIGAÇÃO</span><strong>${readiness.ready ? 'Pronto para validar' : `${readiness.completedCount}/${readiness.requiredCount} etapas concluídas`}</strong></div><em>${readiness.percent}%</em></header>
    <div class="investigation-process-bar"><i style="width:${readiness.percent}%"></i></div>
    <div class="investigation-process-checks">${readiness.checks.filter((check) => check.required > 0).map((check) => `<button type="button" class="${check.complete ? 'complete' : ''}" data-workspace-drawer="${check.drawer}"><b>${check.complete ? '✓' : '○'}</b><span>${escapeHtml(check.label)}</span><small>${['materials','tools','evidence','annotations'].includes(check.id) ? `${Math.min(check.current, check.required)}/${check.required}` : check.complete ? 'registrado' : 'pendente'}</small></button>`).join('')}</div>
    ${readiness.ready ? '<p>O processo mínimo foi registrado. Confira sua resposta antes de validar.</p>' : `<p>Próxima etapa recomendada: <strong>${escapeHtml(readiness.firstMissing?.label || 'continue a investigação')}</strong>.</p>`}
  </section>`;
};

const renderDrawerButtons = (caseData, workspace, draft) => drawerGroups.map(([groupId, groupLabel]) => {
  const buttons = Object.entries(drawerMeta).filter(([, meta]) => meta[3] === groupId).map(([id, [icon, label, description]]) => {
    const items = caseData[id] || [];
    const unlocked = items.filter((item) => isCaseItemUnlocked(item, draft, caseData));
    const count = ['tools', 'documents', 'records', 'communications', 'files'].includes(id)
      ? unlocked.filter((item) => !workspace.viewedItems.includes(item.id)).length
      : id === 'evidence' ? workspace.selectedEvidence.length : 0;
    const locked = items.length && unlocked.length === 0;
    return `<button type="button" class="investigation-drawer-button ${workspace.activeDrawer === id ? 'active' : ''} ${locked ? 'locked' : ''}" data-workspace-drawer="${id}" ${locked ? 'aria-disabled="true"' : ''}><span>${locked ? '⌁' : icon}</span><div><strong>${label}</strong><small>${locked ? 'Libere durante a investigação' : description}</small></div>${count ? `<em>${count}</em>` : ''}</button>`;
  }).join('');
  return `<div class="investigation-drawer-group" data-drawer-group="${groupId}"><p>${groupLabel}</p>${buttons}</div>`;
}).join('');

export const renderInvestigativeWorkspace = (challenge, draft = {}, { completed = false, profile = null } = {}) => {
  const caseData = getMissionCase(challenge.id);
  if (!caseData) return '';
  const workspace = cleanWorkspace(draft, caseData);
  const unlockedCount = getUnlockedItemIds(caseData, draft).length;
  const totalItems = ['tools','documents','records','communications','files'].reduce((total, drawer) => total + (caseData[drawer]?.length || 0), 0);
  return `<section class="investigative-workspace ${isAdvancedInvestigationMission(challenge.id) ? 'advanced-investigation' : ''} ${isNarrativeMission(challenge.id) ? 'narrative-investigation' : ''}" data-investigative-workspace data-pilot-mission="${isPilotMission(challenge.id)}">
    <aside class="investigation-drawers" aria-label="Gavetas da investigação"><div class="investigation-drawers-head"><span>PAINEL INVESTIGATIVO</span><strong>${escapeHtml(caseData.caseId)}</strong><small><i>${unlockedCount}/${totalItems} materiais</i><b data-mission-active-time>${formatActiveMissionTime(workspace.activeSeconds)}</b></small></div>${renderDrawerButtons(caseData, workspace, draft)}<div class="investigation-safety-mini"><b>AMBIENTE AUTORIZADO</b><span>${escapeHtml(caseData.authorizedEnvironment)}</span><span>${escapeHtml(caseData.prohibited)}</span></div></aside>
    <main class="investigation-content">${renderActiveDrawer(challenge, caseData, workspace, draft, completed, profile)}</main>
    <aside class="investigation-mini-wall"><header><span>MURAL DE EVIDÊNCIAS</span><strong>${workspace.selectedEvidence.length}</strong></header><div>${workspace.selectedEvidence.slice(0, 4).map((id, index) => { const [, itemId] = id.split(':'); const found = findCaseItem(caseData, itemId); const annotation = workspace.evidenceAnnotations[id] || {}; return found ? `<button type="button" data-workspace-item="${escapeHtml(itemId)}" data-workspace-item-drawer="${escapeHtml(found.drawer)}"><b>${String(index + 1).padStart(2, '0')}</b><span>${escapeHtml(found.item.title)}<small>${annotation.note ? 'analisada' : 'anotação pendente'}</small></span></button>` : ''; }).join('') || '<p>Nenhuma evidência fixada.</p>'}</div><button type="button" class="secondary-button compact" data-workspace-drawer="evidence">ABRIR MURAL</button>${renderInvestigationProcessGate(challenge.id, draft, { compact: true })}</aside>
  </section>`;
};

const resolutionVisuals = Object.freeze({
  stabilize: ['✓', 'Caso estabilizado'],
  decode: ['⌁', 'Pacote interpretado'],
  'dom-scan': ['⌗', 'Estrutura inspecionada'],
  'interface-unlock': ['▦', 'Interface corrigida'],
  shield: ['◆', 'Entrada protegida'],
  'identity-lock': ['⚿', 'Identidade reforçada'],
  'network-isolate': ['◎', 'Dispositivo isolado'],
  'forensic-seal': ['◈', 'Integridade preservada'],
  'finance-freeze': ['◇', 'Operações contidas'],
  'api-verify': ['↔', 'Contrato validado'],
  'network-trace': ['⌁', 'Tráfego correlacionado'],
  'simulation-sync': ['◉', 'Simulação sincronizada'],
  'soc-contain': ['▦', 'Operação contida'],
  'log-correlation': ['≡', 'Eventos correlacionados'],
  'mobile-secure': ['▣', 'Dispositivo protegido'],
  'browser-shield': ['◇', 'Navegador endurecido'],
  'mail-verified': ['✉', 'Domínio validado'],
  'data-decode': ['01', 'Dados interpretados'],
  'browser-scan': ['⌗', 'Interface inspecionada'],
  'code-seal': ['</>', 'Código protegido'],
  'cloud-seal': ['☁', 'Segredo rotacionado'],
  'forensic-preserve': ['◈', 'Evidência preservada'],
  'finance-shield': ['R$', 'Fluxo financeiro protegido'],
  'incident-finance': ['◇', 'Incidente financeiro contido'],
  'mobile-lock': ['▣', 'Dispositivo endurecido'],
  'pipeline-secure': ['CI', 'Pipeline sob custódia'],
  'server-recover': ['▦', 'Serviços restaurados'],
  'campaign-stabilize': ['✓', 'Operação estabilizada'],
});

export const renderInvestigationResolution = (missionId, profile = null) => {
  const caseData = getMissionCase(missionId);
  if (!caseData?.resolution) return '';
  const animation = caseData.resolution.animation || 'stabilize';
  const [symbol, visualLabel] = resolutionVisuals[animation] || resolutionVisuals.stabilize;
  const closing = caseData.narrative?.closing;
  const arc = getNarrativeArc(caseData.narrative?.arcId);
  const cast = getNarrativeCast(caseData);
  const completedCount = Object.keys(profile?.completed || {}).length;
  const campaignFinale = Number(caseData.narrative?.episode || 0) === 68
    ? `<section class="campaign-finale"><div><span>CAMPANHA SENTINEL CONCLUÍDA</span><strong>68 operações integradas</strong><p>Você encerrou os sete arcos, preservou evidências e documentou medidas defensivas em toda a campanha. O relatório final permanece vinculado ao seu perfil local.</p></div><dl><div><dt>Missões registradas</dt><dd>${completedCount}/68</dd></div><div><dt>Arcos</dt><dd>7/7</dd></div><div><dt>Ambientes</dt><dd>2D · 3D · 360°</dd></div></dl></section>`
    : '';
  return `<section class="case-resolution-animation animation-${escapeHtml(animation)}" aria-label="${escapeHtml(visualLabel)}"><div class="case-resolution-visual" aria-hidden="true"><i></i><i></i><i></i><span>${escapeHtml(symbol)}</span><small>${escapeHtml(visualLabel)}</small></div><div><span>CONSEQUÊNCIA DA RESOLUÇÃO</span><strong>${escapeHtml(caseData.resolution.title)}</strong><p>${escapeHtml(caseData.resolution.status)}</p></div></section>${closing ? `<section class="narrative-closing"><span>${escapeHtml(arc?.title || 'Campanha Sentinel')} · EPISÓDIO ${String(caseData.narrative?.episode || 1).padStart(2, '0')}</span><strong>${escapeHtml(closing.title)}</strong><p>${escapeHtml(closing.body)}</p><div>${cast.map((person) => `<i title="${escapeHtml(person.name)}">${escapeHtml(person.avatar)}</i>`).join('')}</div></section>` : ''}${campaignFinale}`;
};

export const hasInvestigativeCase = (missionId) => isPilotMission(missionId);
export const getWorkspaceUnlockDelta = (missionId, previousDraft, nextDraft) => {
  const caseData = getMissionCase(missionId);
  return caseData ? getProgressiveUnlockDelta(caseData, previousDraft, nextDraft) : [];
};
export const getWorkspaceTimelineMove = (missionId, currentOrder, eventId, direction) => {
  const caseData = getMissionCase(missionId);
  return caseData ? moveTimelineEvent(caseData, currentOrder, eventId, direction) : currentOrder;
};
export const getWorkspaceCase = (missionId) => getMissionCase(missionId);
