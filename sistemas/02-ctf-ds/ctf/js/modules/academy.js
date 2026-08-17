import { lessons } from '../data/lessons.js';
import { escapeHtml } from '../core/utils.js';

export const renderAcademy = (profile) => {
  const done = Object.keys(profile.lessonProgress).filter((id) => profile.lessonProgress[id]?.completed).length;
  const mode = profile.settings?.explanationMode || 'short';
  return `
    <div class="page-head"><div><p class="eyebrow">ACADEMIA // APRENDIZADO GUIADO</p><h1>Modo Guiado</h1><p>Aulas progressivas conectadas às missões. O modo curto entrega o essencial; o detalhado amplia contexto, aplicação e defesa.</p></div><div class="actions"><span class="resource-pill">${mode === 'short' ? 'RESUMO' : 'DETALHADO'}</span><span class="resource-pill">◫ ${done}/${lessons.length}</span></div></div>
    <div class="lesson-list">
      ${lessons.map((lesson, index) => {
        const completed = profile.lessonProgress[lesson.id]?.completed;
        return `<article class="lesson-card"><div class="lesson-icon">${lesson.icon}</div><div><div class="lesson-meta">MÓDULO ${String(index + 1).padStart(2, '0')} // ${escapeHtml(lesson.track)} // ${lesson.duration}</div><h3>${escapeHtml(lesson.title)} ${completed ? '<span class="lesson-done">✓</span>' : ''}</h3><p>${escapeHtml(lesson.summary)}</p></div><button class="${completed ? 'secondary-button' : 'primary-button'}" data-lesson="${lesson.id}">${completed ? 'REVISAR' : 'INICIAR'}</button></article>`;
      }).join('')}
    </div>
  `;
};

export const renderLessonModal = (lesson, completed = false, mode = 'short') => {
  const visibleSections = mode === 'short' ? lesson.sections.slice(0, 2) : lesson.sections;
  return `
  <div class="modal-layer" data-modal-close="true">
    <article class="lesson-modal panel" role="dialog" aria-modal="true" aria-labelledby="lesson-title">
      <div class="modal-head"><div><p class="eyebrow">${escapeHtml(lesson.track)} // ${lesson.duration}</p><h2 id="lesson-title">${escapeHtml(lesson.title)}</h2><p class="muted">${escapeHtml(lesson.summary)}</p><button type="button" class="mode-status mode-status-button" data-toggle-explanation>MODO ${mode === 'short' ? 'CURTO' : 'DETALHADO'} ↔</button></div><button class="icon-button" data-close-modal aria-label="Fechar">×</button></div>
      ${visibleSections.map((section, index) => `<section class="lesson-section"><p class="eyebrow">ETAPA ${index + 1}</p><h3>${escapeHtml(section.title)}</h3><p>${escapeHtml(section.text)}</p></section>`).join('')}
      ${mode === 'short' ? '<p class="hint-box"><strong>Quer aprofundar?</strong> Altere para MODO DETALHADO no topo e reabra a aula para visualizar todas as etapas.</p>' : ''}
      <div class="challenge-actions"><button class="secondary-button" data-close-modal>VOLTAR</button><button class="primary-button" data-complete-lesson="${lesson.id}">${completed ? 'AULA JÁ CONCLUÍDA' : 'CONCLUIR E RECEBER +40 XP'}</button></div>
    </article>
  </div>`;
};
