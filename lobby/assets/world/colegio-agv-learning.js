import { MAP_ID } from './colegio-agv-shared.js';

function clone(value) { return value == null ? value : JSON.parse(JSON.stringify(value)); }

export const LEARNING_ACTIVITIES = Object.freeze([
  Object.freeze({
    id: 'colegio_agv_learning_hardware_match',
    interiorId: 'colegio_agv_interior_lab_info',
    title: 'Desafio de Hardware',
    description: 'Associe componentes às suas funções em uma atividade curta do laboratório.',
    questions: Object.freeze([
      { id: 'q1', prompt: 'Qual componente executa instruções do programa?', options: ['CPU', 'Monitor', 'Teclado'], answer: 0 },
      { id: 'q2', prompt: 'Qual memória é usada como área de trabalho temporária?', options: ['RAM', 'SSD', 'Fonte'], answer: 0 },
      { id: 'q3', prompt: 'Qual dispositivo armazena dados de forma persistente?', options: ['SSD', 'Cooler', 'Mouse'], answer: 0 }
    ])
  }),
  Object.freeze({
    id: 'colegio_agv_learning_network_path',
    interiorId: 'colegio_agv_interior_lab_info',
    title: 'Rota da Rede',
    description: 'Identifique a função básica dos equipamentos de rede.',
    questions: Object.freeze([
      { id: 'q1', prompt: 'Qual equipamento normalmente conecta dispositivos na mesma rede local?', options: ['Switch', 'Projetor', 'Scanner'], answer: 0 },
      { id: 'q2', prompt: 'Qual serviço traduz nomes como exemplo.com em endereços IP?', options: ['DNS', 'HDMI', 'USB'], answer: 0 }
    ])
  }),
  Object.freeze({
    id: 'colegio_agv_learning_science_method',
    interiorId: 'colegio_agv_interior_lab_ciencias',
    title: 'Método Científico',
    description: 'Organize decisões seguras de uma investigação científica virtual.',
    questions: Object.freeze([
      { id: 'q1', prompt: 'Antes de testar uma hipótese, qual ação ajuda a manter o experimento comparável?', options: ['Definir variáveis e procedimento', 'Mudar tudo ao mesmo tempo', 'Ignorar registros'], answer: 0 },
      { id: 'q2', prompt: 'Qual atitude é adequada ao trabalhar em laboratório?', options: ['Seguir orientação e EPI aplicável', 'Improvisar substâncias', 'Consumir materiais'], answer: 0 }
    ])
  })
]);

export const LEARNING_INTERACTABLES = Object.freeze([
  { id: 'colegio_agv_interact_learning_hardware', type: 'learning', name: 'Desafio de Hardware', interiorId: 'colegio_agv_interior_lab_info', x: 0, z: -1, radius: 1.8, interaction: 'start-learning', targetId: 'colegio_agv_learning_hardware_match' },
  { id: 'colegio_agv_interact_learning_network', type: 'learning', name: 'Rota da Rede', interiorId: 'colegio_agv_interior_lab_info', x: 4, z: -1, radius: 1.8, interaction: 'start-learning', targetId: 'colegio_agv_learning_network_path' },
  { id: 'colegio_agv_interact_learning_science', type: 'learning', name: 'Método Científico', interiorId: 'colegio_agv_interior_lab_ciencias', x: 0, z: -1, radius: 1.8, interaction: 'start-learning', targetId: 'colegio_agv_learning_science_method' }
]);

export function createColegioAgvLearningController(context = {}) {
  let session = null;

  function start(activityId) {
    const activity = LEARNING_ACTIVITIES.find((item) => item.id === activityId);
    if (!activity) return null;
    session = { activityId, questionIndex: 0, correct: 0, attempts: 0, completed: false, startedAt: Date.now() };
    context.onLearningActivity?.({ worldId: MAP_ID, active: true, activity: clone(activity), session: clone(session) });
    return getCurrent();
  }

  function getCurrent() {
    if (!session) return null;
    const activity = LEARNING_ACTIVITIES.find((item) => item.id === session.activityId);
    const question = activity?.questions?.[session.questionIndex] || null;
    return { session: clone(session), activity: clone(activity), question: clone(question) };
  }

  function answer(optionIndex) {
    if (!session || session.completed) return { ok: false, reason: 'no-active-session' };
    const activity = LEARNING_ACTIVITIES.find((item) => item.id === session.activityId);
    const question = activity?.questions?.[session.questionIndex];
    if (!question) return { ok: false, reason: 'question-not-found' };
    const correct = Number(optionIndex) === question.answer;
    session.attempts += 1;
    if (correct) session.correct += 1;
    session.questionIndex += 1;
    if (session.questionIndex >= activity.questions.length) session.completed = true;
    const result = { ok: true, correct, completed: session.completed, score: session.correct, total: activity.questions.length, current: getCurrent() };
    context.onLearningProgress?.({ worldId: MAP_ID, activityId: activity.id, ...clone(result) });
    return result;
  }

  function end() {
    if (!session) return null;
    const result = getCurrent();
    context.onLearningActivity?.({ worldId: MAP_ID, active: false, result: clone(result) });
    session = null;
    return result;
  }

  return {
    start, answer, end,
    getCurrent,
    getActivities: () => LEARNING_ACTIVITIES.map(clone),
    getInteractables: (interiorId) => LEARNING_INTERACTABLES.filter((item) => !interiorId || item.interiorId === interiorId).map(clone)
  };
}
