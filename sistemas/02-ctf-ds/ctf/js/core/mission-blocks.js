import { challenges } from '../data/challenges.js';

export const MISSION_BLOCK_SIZE = 10;

const difficultyRank = { Recruta: 0, Básico: 1, Iniciante: 2, Intermediário: 3, Avançado: 4, Especialista: 5 };

export const missionSequence = Object.freeze(challenges.slice().sort((a, b) =>
  ((a.order ?? 0) - (b.order ?? 0)) ||
  ((difficultyRank[a.difficulty] ?? 99) - (difficultyRank[b.difficulty] ?? 99))
));

const blockCatalog = [
  { title: 'Treinamento e primeiros acessos', subtitle: 'Conheça o laboratório, o arsenal e as regras de investigação.', icon: '◈', badge: 'Checkpoint 01 · Recruta Operacional', xpBonus: 200, coinBonus: 80, starBonus: 3 },
  { title: 'Decodificação e reconhecimento', subtitle: 'Interprete dados, navegue em ambientes locais e reconheça riscos iniciais.', icon: '⌁', badge: 'Checkpoint 02 · Analista de Campo', xpBonus: 250, coinBonus: 100, starBonus: 3 },
  { title: 'Identidade, redes e investigação', subtitle: 'Proteja acessos, tráfego, serviços conectados e preserve evidências.', icon: '▦', badge: 'Checkpoint 03 · Guardião de Acesso', xpBonus: 300, coinBonus: 120, starBonus: 4 },
  { title: 'Proteção de dados e hardening', subtitle: 'Proteja aplicações, dispositivos, dados e configurações contra exposição.', icon: '⌕', badge: 'Checkpoint 04 · Investigador Digital', xpBonus: 350, coinBonus: 140, starBonus: 4 },
  { title: 'Desenvolvimento seguro e resposta', subtitle: 'Corrija código, responda a incidentes e aplique controles defensivos.', icon: '⌘', badge: 'Checkpoint 05 · Operador de Resposta', xpBonus: 400, coinBonus: 160, starBonus: 5 },
  { title: 'APIs, infraestrutura e defesa', subtitle: 'Integre aplicações, infraestrutura, análise de rede e proteção em camadas.', icon: '⬡', badge: 'Checkpoint 06 · Analista Sênior', xpBonus: 450, coinBonus: 180, starBonus: 5 },
  { title: 'Operação final integrada', subtitle: 'Conecte todas as competências em missões avançadas de encerramento.', icon: '⚑', badge: 'Checkpoint Final · Especialista CTF DS', xpBonus: 600, coinBonus: 250, starBonus: 8 },
];

export const missionBlocks = Object.freeze(blockCatalog.map((metadata, index) => {
  const start = index * MISSION_BLOCK_SIZE;
  const missions = missionSequence.slice(start, start + MISSION_BLOCK_SIZE);
  return Object.freeze({
    id: `block-${String(index + 1).padStart(2, '0')}`,
    number: index + 1,
    startIndex: start,
    endIndex: start + missions.length - 1,
    missionIds: Object.freeze(missions.map((mission) => mission.id)),
    total: missions.length,
    ...metadata,
  });
}));

export const getMissionBlock = (challengeOrId) => {
  const id = typeof challengeOrId === 'string' ? challengeOrId : challengeOrId?.id;
  return missionBlocks.find((block) => block.missionIds.includes(id)) || null;
};

export const normalizeMissionBlocks = (profile) => {
  if (!profile.missionBlocks || typeof profile.missionBlocks !== 'object' || Array.isArray(profile.missionBlocks)) profile.missionBlocks = {};
  for (const [blockId, raw] of Object.entries(profile.missionBlocks)) {
    if (!missionBlocks.some((block) => block.id === blockId) || !raw || typeof raw !== 'object' || Array.isArray(raw)) {
      delete profile.missionBlocks[blockId];
      continue;
    }
    profile.missionBlocks[blockId] = {
      version: 1,
      completedAt: Number(raw.completedAt) || 0,
      checkpointClaimedAt: Number(raw.checkpointClaimedAt) || 0,
      reportViewedAt: Number(raw.reportViewedAt) || 0,
      checkpointId: String(raw.checkpointId || '').slice(0, 120),
      snapshot: raw.snapshot && typeof raw.snapshot === 'object' && !Array.isArray(raw.snapshot) ? raw.snapshot : null,
    };
  }
  return profile.missionBlocks;
};

const draftHasProgress = (draft) => Boolean(draft && (
  draft.answer || draft.selected?.length || draft.sequence?.length || Object.keys(draft.matches || {}).length ||
  draft.evidence?.length || draft.localTests || draft.toolRuns || draft.submissions || draft.status === 'completed'
));

export const getBlockStats = (profile, blockOrId) => {
  const block = typeof blockOrId === 'string' ? missionBlocks.find((item) => item.id === blockOrId) : blockOrId;
  if (!block) return null;
  const completedMissions = block.missionIds.filter((id) => profile.completed?.[id]);
  const inProgressMissions = block.missionIds.filter((id) => !profile.completed?.[id] && draftHasProgress(profile.missionDrafts?.[id]));
  const attempts = block.missionIds.reduce((total, id) => total + Math.max(0, Number(profile.attempts?.[id]) || 0), 0);
  const stars = completedMissions.reduce((total, id) => total + Math.max(0, Number(profile.completed?.[id]?.stars) || 0), 0);
  const hints = block.missionIds.reduce((total, id) => total + (profile.hintsUsed?.[id] ? 1 : 0), 0);
  const toolRuns = block.missionIds.reduce((total, id) => total + Math.max(0, Number(profile.missionDrafts?.[id]?.toolRuns) || 0), 0);
  const localTests = block.missionIds.reduce((total, id) => total + Math.max(0, Number(profile.missionDrafts?.[id]?.localTests) || 0), 0);
  const completed = completedMissions.length;
  const percentage = block.total ? Math.round((completed / block.total) * 100) : 0;
  const accuracy = attempts ? Math.min(100, Math.round((completed / attempts) * 100)) : (completed ? 100 : 0);
  const averageStars = completed ? Number((stars / completed).toFixed(1)) : 0;
  const score = Math.round((percentage * 0.55) + (accuracy * 0.25) + ((averageStars / 3) * 100 * 0.2));
  const performance = score >= 90 ? 'Excelente' : score >= 78 ? 'Proficiente' : score >= 65 ? 'Adequado' : score >= 45 ? 'Em desenvolvimento' : 'Iniciando';
  return { block, completed, total: block.total, percentage, inProgress: inProgressMissions.length, attempts, stars, hints, toolRuns, localTests, accuracy, averageStars, score, performance, completedMissions, inProgressMissions };
};

export const isBlockUnlocked = (profile, blockOrId) => {
  const block = typeof blockOrId === 'string' ? missionBlocks.find((item) => item.id === blockOrId) : blockOrId;
  if (!block) return false;
  if (block.number === 1) return true;
  const own = getBlockStats(profile, block);
  if (own.completed || own.inProgress) return true; // preserva progressos de versões anteriores
  const previous = missionBlocks[block.number - 2];
  return Boolean(previous && getBlockStats(profile, previous).completed === previous.total);
};

export const getBlockState = (profile, blockOrId) => {
  normalizeMissionBlocks(profile);
  const block = typeof blockOrId === 'string' ? missionBlocks.find((item) => item.id === blockOrId) : blockOrId;
  const stats = getBlockStats(profile, block);
  if (!block || !stats) return null;
  const unlocked = isBlockUnlocked(profile, block);
  const complete = stats.completed === stats.total;
  const checkpoint = profile.missionBlocks?.[block.id] || null;
  const state = complete ? 'completed' : !unlocked ? 'locked' : (stats.completed || stats.inProgress) ? 'in-progress' : 'available';
  return { ...stats, state, unlocked, complete, checkpoint, claimed: Boolean(checkpoint?.checkpointClaimedAt) };
};

export const getActiveMissionBlock = (profile) => {
  for (const block of missionBlocks) {
    const state = getBlockState(profile, block);
    if (state.unlocked && !state.complete) return block;
  }
  return missionBlocks.at(-1);
};

export const isMissionBlockUnlocked = (profile, challengeOrId) => {
  const block = getMissionBlock(challengeOrId);
  return Boolean(block && isBlockUnlocked(profile, block));
};


export const getCheckpointRewardRecord = (profile, blockOrId) => {
  const block = typeof blockOrId === 'string' ? missionBlocks.find((item) => item.id === blockOrId) : blockOrId;
  if (!block) return null;
  const sourceId = `block:${block.id}`;
  return profile?.wallet?.ledger?.find((transaction) => transaction.sourceId === sourceId && transaction.status === 'APPROVED') || null;
};

export const hasCheckpointReward = (profile, blockOrId) => Boolean(getCheckpointRewardRecord(profile, blockOrId));

export const getCampaignBlockSummary = (profile) => {
  const states = missionBlocks.map((block) => getBlockState(profile, block));
  const completed = states.filter((state) => state.complete).length;
  const claimed = states.filter((state) => state.claimed).length;
  return { states, completed, claimed, total: missionBlocks.length, percentage: Math.round((completed / missionBlocks.length) * 100) };
};

export const checkpointSnapshot = (profile, blockOrId) => {
  const stats = getBlockStats(profile, blockOrId);
  if (!stats) return null;
  return {
    blockId: stats.block.id,
    blockNumber: stats.block.number,
    title: stats.block.title,
    completed: stats.completed,
    total: stats.total,
    percentage: stats.percentage,
    attempts: stats.attempts,
    stars: stats.stars,
    hints: stats.hints,
    toolRuns: stats.toolRuns,
    localTests: stats.localTests,
    accuracy: stats.accuracy,
    averageStars: stats.averageStars,
    score: stats.score,
    performance: stats.performance,
    generatedAt: new Date().toISOString(),
  };
};
