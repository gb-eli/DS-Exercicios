export const proficiencyRubric = Object.freeze({
  rubricId: 'ctfds-proficiency-v1', activityId: 'ctfds-campaign', version: '1.0.0',
  levels: ['Não iniciado', 'Em desenvolvimento', 'Básico', 'Adequado', 'Proficiente', 'Avançado'],
  criteria: [
    { id: 'investigation', name: 'Investigação e raciocínio', weight: 30, description: 'Formula hipóteses, identifica evidências e escolhe uma estratégia coerente.' },
    { id: 'tool-use', name: 'Uso das ferramentas', weight: 25, description: 'Utiliza ferramentas locais e interpreta resultados sem sair do escopo autorizado.' },
    { id: 'secure-practice', name: 'Prática defensiva e segura', weight: 25, description: 'Relaciona vulnerabilidade, impacto, prevenção e mitigação.' },
    { id: 'evidence', name: 'Evidência e explicação', weight: 20, description: 'Registra processo, resultado, correções e aprendizados de forma compreensível.' },
  ],
  notes: ['Moedas, itens, temas e compras não influenciam a proficiência.', 'XP e níveis são indicadores de progressão e não são convertidos automaticamente em nota.', 'A revisão final pertence ao professor e pode considerar adaptações autorizadas.'],
});

export const estimateProficiency = (profile) => {
  const completed = Object.keys(profile.completed || {}).length;
  const attempts = Object.values(profile.attempts || {}).reduce((sum, value) => sum + Number(value || 0), 0);
  const accuracy = attempts ? completed / attempts : 0;
  const notes = Object.values(profile.missionNotes || {}).filter((value) => String(value).trim().length >= 20).length;
  const toolUse = Number(profile.dailyStats?.tools || 0) + Object.keys(profile.tutorialProgress?.tools || {}).length;
  const score = Math.min(100, Math.round((completed / 68) * 55 + Math.min(1, accuracy) * 20 + Math.min(1, notes / Math.max(1, completed)) * 15 + Math.min(1, toolUse / 13) * 10));
  const level = score >= 90 ? 'Avançado' : score >= 75 ? 'Proficiente' : score >= 55 ? 'Adequado' : score >= 35 ? 'Básico' : score > 0 ? 'Em desenvolvimento' : 'Não iniciado';
  return { score, level, teacherReviewRequired: true };
};
