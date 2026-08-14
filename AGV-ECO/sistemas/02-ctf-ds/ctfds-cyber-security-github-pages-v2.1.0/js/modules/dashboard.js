import { challenges, tracks, isUnlocked } from '../data/challenges.js';
import { formatNumber, xpForNextLevel } from '../core/utils.js';
import { getStoreItem } from '../data/store-items.js';
import { escapeHtml } from '../core/utils.js';

const completionCount = (profile, trackId) => challenges.filter((item) => item.track === trackId && profile.completed[item.id]).length;
const todayKey = () => new Date().toISOString().slice(0, 10);

const renderDailyObjective = (label, value, target, icon) => {
  const done = value >= target;
  return `<div class="daily-objective ${done ? 'done' : ''}"><span>${icon}</span><div><strong>${escapeHtml(label)}</strong><small>${Math.min(value, target)}/${target}</small></div><b>${done ? '✓' : '○'}</b></div>`;
};

export const renderDashboard = (profile) => {
  const completed = Object.keys(profile.completed).length;
  const unlocked = challenges.filter((item) => isUnlocked(item, profile.completed)).length;
  const nextXp = xpForNextLevel(profile.level);
  const levelStart = Math.pow(profile.level - 1, 2) * 120;
  const levelProgress = Math.min(100, ((profile.xp - levelStart) / Math.max(1, nextXp - levelStart)) * 100);
  const nextMission = challenges.find((item) => isUnlocked(item, profile.completed) && !profile.completed[item.id]);
  const avatar = getStoreItem(profile.equipped.avatar)?.preview || '👻';
  const totalAttempts = Object.values(profile.attempts || {}).reduce((total, value) => total + Number(value || 0), 0);
  const accuracy = totalAttempts ? Math.round((completed / totalAttempts) * 100) : 100;
  const daily = profile.dailyStats?.date === todayKey() ? profile.dailyStats : { missions: 0, lessons: 0, tools: 0 };
  const dailyDone = daily.missions >= 1 && daily.lessons >= 1 && daily.tools >= 1;

  return `
    <section class="hero-panel card operator-hero">
      <div>
        <p class="eyebrow">OPERADOR ${escapeHtml((profile.studentName || 'Aluno').toUpperCase())} // NÍVEL ${profile.level}</p>
        <h1>Você nunca está <span>100% invisível.</span></h1>
        <p>Investigue como atacante ético, pense como defensor e registre evidências. Cada missão altera o ambiente, exige uma ação e abre uma parte nova da campanha.</p>
        <div class="actions">
          <button class="primary-button" data-open-next="${nextMission?.id || ''}">${nextMission ? 'CONTINUAR OPERAÇÃO' : 'CAMPANHA CONCLUÍDA'} <b>↗</b></button>
          <button class="secondary-button" data-view="academy">TREINAMENTO GUIADO</button>
          <button class="secondary-button" data-view="tools">ABRIR ARSENAL</button>
        </div>
        <div class="operator-live-stats"><span>SEQUÊNCIA <b>${profile.streak || 0} DIA(S)</b></span><span>COMBO <b>×${profile.combo || 0}</b></span><span>PRECISÃO <b>${accuracy}%</b></span><span>RECORDE <b>×${profile.maxCombo || 0}</b></span></div>
      </div>
      <div class="radar-orb" aria-label="Radar decorativo"><span class="radar-core">${avatar}</span><i class="radar-blip one"></i><i class="radar-blip two"></i><i class="radar-blip three"></i></div>
    </section>

    <div class="grid grid-4" style="margin-top:16px">
      <article class="metric-card card"><div class="metric-top"><span>EXPERIÊNCIA</span><span class="metric-icon">↗</span></div><div class="metric-value">${formatNumber(profile.xp)} XP</div><div class="progress-track"><span class="progress-fill" style="width:${levelProgress}%"></span></div><div class="level-row"><span>NÍVEL ${profile.level}</span><span>${formatNumber(nextXp)} XP</span></div></article>
      <article class="metric-card card"><div class="metric-top"><span>BANDEIRAS</span><span class="metric-icon">⚑</span></div><div class="metric-value">${completed}/${challenges.length}</div><div class="metric-sub">${unlocked} missões acessíveis</div></article>
      <article class="metric-card card"><div class="metric-top"><span>CYBER COINS</span><span class="metric-icon">◇</span></div><div class="metric-value">${formatNumber(profile.coins)}</div><div class="metric-sub">Pistas, temas e personalização</div></article>
      <article class="metric-card card"><div class="metric-top"><span>ESTRELAS</span><span class="metric-icon">★</span></div><div class="metric-value">${formatNumber(profile.stars)}</div><div class="metric-sub">Precisão, autonomia e estratégia</div></article>
    </div>

    <div class="command-grid">
      <article class="card daily-ops-card">
        <div class="section-title" style="margin-top:0"><h2>OPERAÇÃO DO DIA</h2><small>${dailyDone ? 'BÔNUS CONCLUÍDO' : '+50 ◇ AO COMPLETAR'}</small></div>
        <p>Uma rotina curta para incentivar prática, estudo e uso das ferramentas sem transformar a plataforma em uma corrida.</p>
        <div class="daily-objectives">
          ${renderDailyObjective('Capturar uma bandeira', daily.missions || 0, 1, '⚑')}
          ${renderDailyObjective('Concluir ou revisar uma aula', daily.lessons || 0, 1, '◫')}
          ${renderDailyObjective('Usar uma ferramenta local', daily.tools || 0, 1, '⌘')}
        </div>
        <div class="daily-bonus ${dailyDone ? 'done' : ''}"><span>${dailyDone ? 'PROTOCOLO DIÁRIO COMPLETO' : 'TRÊS AÇÕES PARA LIBERAR O BÔNUS'}</span><b>${dailyDone ? '✓' : '50 ◇'}</b></div>
      </article>
      <article class="card next-operation-card">
        <p class="eyebrow">ALVO PRIORITÁRIO</p>
        ${nextMission ? `<h2>${escapeHtml(nextMission.title)}</h2><p>${escapeHtml(nextMission.description)}</p><div class="next-operation-meta"><span>${escapeHtml(nextMission.difficulty)}</span><span>${escapeHtml(nextMission.role)}</span><span>+${nextMission.xp} XP</span></div><button class="primary-button full" data-challenge="${escapeHtml(nextMission.id)}">ENTRAR NO AMBIENTE ↗</button>` : '<h2>Todas as operações foram concluídas</h2><p>Revise missões para buscar três estrelas, experimentar outros caminhos e fortalecer habilidades.</p><button class="secondary-button full" data-view="ctf">ABRIR MAPA COMPLETO</button>'}
      </article>
    </div>

    <div class="section-title"><h2>TRILHAS DE ESPECIALIZAÇÃO</h2><small>SELECIONE UMA ÁREA PARA FILTRAR AS MISSÕES</small></div>
    <div class="grid grid-3">
      ${tracks.map((track) => {
        const total = challenges.filter((item) => item.track === track.id).length;
        const done = completionCount(profile, track.id);
        const percentage = total ? Math.round((done / total) * 100) : 0;
        return `<article class="track-card card" data-track="${track.id}">
          <div class="track-icon">${track.icon}</div>
          <h3>${track.name}</h3><p>${track.description}</p>
          <div class="track-progress"><div class="progress-track"><span class="progress-fill" style="width:${percentage}%"></span></div><span>${done}/${total}</span></div>
        </article>`;
      }).join('')}
    </div>

    <div class="section-title"><h2>INTELIGÊNCIA DE AMEAÇAS</h2><small>CASOS, VULNERABILIDADES E DEFESA</small></div>
    <article class="card intel-callout"><div><strong>Aprender com incidentes reais sem reproduzir ataques:</strong><p>Consulte dossiês sobre aplicações, bancos, Pix, criptoativos, APIs, mobile, nuvem, IoT, supply chain, IA e privacidade.</p></div><button class="secondary-button" data-view="intel">ABRIR THREAT INTEL</button></article>`;
};
