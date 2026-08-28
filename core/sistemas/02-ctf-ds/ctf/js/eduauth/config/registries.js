export const EDUAUTH_REGISTRIES = {
  platforms: { '01': 'ctfds' },
  classes: {
    '00': 'turma-nao-identificada',
    '01': '1ds-a',
    '02': '2ds-a',
    '03': '3ds-a',
    '04': 'subsequente-noturno',
  },
  subjects: { '01': 'ciberseguranca-seguranca-informacao' },
  lessons: { '00': 'geral', '01': 'campanha-ctf', '02': 'modo-guiado' },
  activities: { '01': 'campanha-principal' },
  actions: {
    '01': 'challenge-start', '02': 'lesson-start', '03': 'result-release', '04': 'profile-recovery',
    '05': 'progress-reset', '06': 'profile-delete', '07': 'recovery-setup',
  },
};

const normalize = (value) => String(value || '').trim().toLocaleLowerCase('pt-BR').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const reverse = (group) => Object.fromEntries(Object.entries(group).map(([code, id]) => [id, Number.parseInt(code, 10)]));
const reverseMaps = Object.fromEntries(Object.entries(EDUAUTH_REGISTRIES).map(([key, value]) => [key, reverse(value)]));

export const registryCodeFor = (group, value, fallback = 0) => {
  const normalized = normalize(value);
  const map = reverseMaps[group] || {};
  if (map[normalized] !== undefined) return map[normalized];
  const exact = Object.entries(EDUAUTH_REGISTRIES[group] || {}).find(([, label]) => normalize(label) === normalized);
  return exact ? Number.parseInt(exact[0], 10) : fallback;
};

export const registryLabelFor = (group, code) => EDUAUTH_REGISTRIES[group]?.[String(code).padStart(2, '0')] || 'desconhecido';
export const registryNumericMaps = reverseMaps;
