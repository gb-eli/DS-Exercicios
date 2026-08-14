import { intelCategories, vulnerabilities, realCases, mediaInspirations, getRealCase } from '../data/intel.js';
import { escapeHtml } from '../core/utils.js';

const links = (items = []) => items.map((source) => `<a class="source-link" href="${source.url}" target="_blank" rel="noopener noreferrer">${escapeHtml(source.label)} ↗</a>`).join('');
const tags = (items = []) => `<div class="tag-list">${items.map((item) => `<span>${escapeHtml(item)}</span>`).join('')}</div>`;

export const renderIntel = (profile, filter = 'all', query = '') => {
  const mode = profile.settings?.explanationMode || 'short';
  const term = query.trim().toLocaleLowerCase('pt-BR');
  const filtered = vulnerabilities.filter((item) => {
    const categoryOk = filter === 'all' || item.category === filter;
    const searchText = [item.title, item.short, item.detailed, item.owasp, item.cwe, ...(item.aliases || []), ...(item.languages || []), ...(item.systems || [])].join(' ').toLocaleLowerCase('pt-BR');
    return categoryOk && (!term || searchText.includes(term));
  });
  return `
    <div class="page-head"><div><p class="eyebrow">THREAT INTEL // CASOS REAIS // FONTES OFICIAIS</p><h1>Vulnerabilidades & Casos Reais</h1><p>Estude como a falha aparece, onde pode acontecer, quais tecnologias estão envolvidas, como defender e quais incidentes públicos ajudam a compreender o impacto.</p></div><span class="resource-pill">${mode === 'short' ? 'RESUMO ATIVO' : 'DETALHADO ATIVO'}</span></div>
    <article class="card intel-search-panel"><label>BUSCAR TEMA, LINGUAGEM, SISTEMA, OWASP OU CWE<input data-intel-search value="${escapeHtml(query)}" placeholder="ex.: XSS, Instagram, Java, API, sanitização"></label></article>
    <div class="filter-bar" role="tablist" aria-label="Filtrar vulnerabilidades">
      <button class="filter-button ${filter === 'all' ? 'active' : ''}" data-intel-filter="all">Todas</button>
      ${intelCategories.map((category) => `<button class="filter-button ${filter === category.id ? 'active' : ''}" data-intel-filter="${category.id}">${category.icon} ${escapeHtml(category.name)}</button>`).join('')}
    </div>
    <div class="intel-grid">${filtered.length ? filtered.map((item) => renderVulnerabilityCard(item, mode)).join('') : '<div class="empty-state">Nenhum conteúdo corresponde ao filtro atual.</div>'}</div>
    <div class="section-title"><h2>CASOS REAIS E BOLETINS</h2><small>RESUMOS EDUCACIONAIS COM FONTE EXTERNA</small></div>
    <div class="case-grid">${realCases.map(renderCaseCard).join('')}</div>
    <div class="section-title"><h2>CINEMA, SÉRIES E REALIDADE</h2><small>REFERÊNCIA CULTURAL SEM COPIAR CENAS OU MARCAS VISUAIS</small></div>
    <div class="grid grid-3">${mediaInspirations.map((item) => `<article class="card media-card"><p class="eyebrow">FICÇÃO COMO PONTO DE PARTIDA</p><h3>${escapeHtml(item.title)}</h3>${tags(item.concepts)}<p>${escapeHtml(item.note)}</p></article>`).join('')}</div>
    <article class="card intel-disclaimer"><strong>Como as marcas serão usadas:</strong> Facebook, Instagram, Chrome, Apple e outras empresas aparecem somente em estudos de caso históricos e notícias oficiais. Os laboratórios utilizam nomes, contas, domínios e dados fictícios para evitar imitação de login, phishing ou teste contra serviços reais.</article>`;
};

const renderVulnerabilityCard = (item, mode) => `<article class="intel-card card">
  <div class="intel-card-top"><span class="intel-icon">${escapeHtml(item.icon)}</span><span class="risk-tag risk-${item.risk.toLowerCase()}">${escapeHtml(item.risk)}</span></div>
  <p class="eyebrow">${escapeHtml(item.owasp)}</p><h3>${escapeHtml(item.title)}</h3>
  <p>${escapeHtml(mode === 'short' ? item.short : item.detailed)}</p>
  ${tags(item.aliases.slice(0, 3))}
  <div class="intel-meta"><span>${escapeHtml(item.cwe)}</span><span>${item.cases.length} caso(s)</span></div>
  <button class="secondary-button full" data-vulnerability="${item.id}">ABRIR DOSSIÊ</button>
</article>`;

const renderCaseCard = (item) => `<article class="case-card card">
  <div class="case-date">${item.year}</div><p class="eyebrow">${escapeHtml(item.company)}</p><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.summary)}</p>
  ${tags(item.tags)}<div class="case-lesson"><strong>LIÇÃO DEFENSIVA</strong><p>${escapeHtml(item.lesson)}</p></div>
  <a class="source-link" href="${item.source.url}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.source.label)} ↗</a>
</article>`;

export const renderVulnerabilityModal = (item, profile) => {
  const mode = profile.settings?.explanationMode || 'short';
  const cases = item.cases.map(getRealCase).filter(Boolean);
  return `<div class="modal-layer" data-modal-close="true"><article class="intel-modal panel" role="dialog" aria-modal="true" aria-labelledby="intel-title">
    <div class="modal-head"><div><p class="eyebrow">${escapeHtml(item.owasp)} // ${escapeHtml(item.cwe)}</p><h2 id="intel-title">${escapeHtml(item.title)}</h2><p class="muted">Modo ${mode === 'short' ? 'curto' : 'detalhado'} ativo.</p><button type="button" class="mode-status mode-status-button" data-toggle-explanation>ALTERAR PARA ${mode === 'short' ? 'DETALHADO' : 'CURTO'} ↔</button></div><button class="icon-button" data-close-modal aria-label="Fechar">×</button></div>
    <section class="lesson-section"><h3>${mode === 'short' ? 'EM POUCAS PALAVRAS' : 'EXPLICAÇÃO DETALHADA'}</h3><p>${escapeHtml(mode === 'short' ? item.short : item.detailed)}</p></section>
    <section class="lesson-section"><h3>APLICAÇÃO PRÁTICA NO CTF DS</h3><p>${escapeHtml(item.practice)}</p></section>
    <div class="grid grid-2 intel-detail-grid">
      <section class="lesson-section"><h3>LINGUAGENS E TECNOLOGIAS</h3>${tags(item.languages)}</section>
      <section class="lesson-section"><h3>SISTEMAS QUE PODEM SER AFETADOS</h3>${tags(item.systems)}</section>
      <section class="lesson-section"><h3>FERRAMENTAS EM LABORATÓRIO AUTORIZADO</h3><ul class="intel-list">${item.tools.map((value) => `<li>${escapeHtml(value)}</li>`).join('')}</ul></section>
      <section class="lesson-section"><h3>COMO PREVENIR OU MITIGAR</h3><ul class="intel-list">${item.defenses.map((value) => `<li>${escapeHtml(value)}</li>`).join('')}</ul></section>
    </div>
    ${cases.length ? `<section class="lesson-section"><h3>CASOS REAIS RELACIONADOS</h3><div class="mini-case-list">${cases.map((itemCase) => `<div><strong>${itemCase.year} // ${escapeHtml(itemCase.company)}</strong><p>${escapeHtml(itemCase.title)}</p><a class="source-link" href="${itemCase.source.url}" target="_blank" rel="noopener noreferrer">Abrir fonte oficial ↗</a></div>`).join('')}</div></section>` : ''}
    <section class="lesson-section"><h3>FONTES PARA CONTINUAR O ESTUDO</h3><div class="source-list">${links(item.sources)}</div></section>
    <p class="safety-note"><strong>Limite ético:</strong> o dossiê explica risco, detecção e correção. Testes técnicos devem ocorrer somente nas simulações locais ou em sistemas para os quais exista autorização explícita.</p>
    <div class="challenge-actions"><button class="secondary-button" data-close-modal>FECHAR DOSSIÊ</button><button class="primary-button" data-view="ctf">IR PARA MISSÕES CTF</button></div>
  </article></div>`;
};
