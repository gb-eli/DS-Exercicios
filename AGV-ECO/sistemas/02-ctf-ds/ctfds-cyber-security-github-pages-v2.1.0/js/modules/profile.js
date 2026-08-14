import { getStoreItem } from '../data/store-items.js';
import { challenges } from '../data/challenges.js';
import { escapeHtml, xpForNextLevel } from '../core/utils.js';
import { careers } from '../data/careers.js';
import { platformConfig } from '../config/platform-config.js';

const formatDate = (value) => value ? new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short', timeZone: platformConfig.timezone }).format(new Date(value)) : 'não registrado';
const daysUntil = (value) => Math.max(0, Math.ceil((Number(value || 0) - Date.now()) / 86400000));

export const renderProfile = (profile) => {
  const avatar = getStoreItem(profile.equipped.avatar)?.preview || '👻';
  const nextXp = xpForNextLevel(profile.level);
  const levelStart = Math.pow(profile.level - 1, 2) * 120;
  const progress = Math.min(100, ((profile.xp - levelStart) / Math.max(1, nextXp - levelStart)) * 100);
  const completed = Object.keys(profile.completed).length;
  const careerGoal = careers.find((item) => item.id === profile.careerGoal)?.title || 'Ainda não definida';
  const attempts = Object.values(profile.attempts || {}).reduce((total, value) => total + Number(value || 0), 0);
  const accuracy = attempts ? Math.round((completed / attempts) * 100) : 100;
  const expiryDays = daysUntil(profile.expiresAt);
  const auditCount = profile.audit?.events?.length || 0;
  return `
    <div class="page-head"><div><p class="eyebrow">IDENTIDADE // PERFIL LOCAL PROTEGIDO</p><h1>Perfil do aluno</h1><p>Gerencie acessibilidade, segurança, backup, bloqueio e continuidade neste dispositivo.</p></div><span class="security-badge">AES-256-GCM · IndexedDB</span></div>
    <div class="profile-layout">
      <article class="identity-card card">
        <div class="big-avatar">${escapeHtml(avatar)}</div>
        <p class="eyebrow">ALUNO // ${escapeHtml(profile.className || 'TURMA NÃO INFORMADA')}</p><h2>${escapeHtml(profile.studentName || 'Aluno')}</h2><span class="title-tag">${escapeHtml(profile.title)}</span>
        <div class="progress-track"><span class="progress-fill" style="width:${progress}%"></span></div><div class="level-row"><span>${profile.xp} XP</span><span>${nextXp} XP</span></div>
        <div class="identity-stat-grid"><div><span>FLAGS</span><b>${completed}</b></div><div><span>PRECISÃO</span><b>${accuracy}%</b></div><div><span>COMBO</span><b>×${profile.combo || 0}</b></div><div><span>RECORDE</span><b>×${profile.maxCombo || 0}</b></div></div>
        <p>${completed}/${challenges.length} bandeiras · ${profile.stars} estrelas · ${profile.coins} moedas</p><p><strong style="color:var(--accent)">Rota profissional:</strong> ${escapeHtml(careerGoal)}</p>
        <div class="profile-expiry ${expiryDays <= 1 ? 'urgent' : ''}"><span>◷</span><div><strong>Expira em ${expiryDays} ${expiryDays === 1 ? 'dia' : 'dias'}</strong><small>Última gravação: ${formatDate(profile.updatedAt)}</small></div></div>
      </article>
      <div class="grid">
        <article class="card"><div class="section-title" style="margin-top:0"><h2>HABILIDADES</h2><small>0–100</small></div><div class="skill-list">${Object.entries(profile.skills).map(([skill, value]) => `<div class="skill-row"><span>${escapeHtml(skill)}</span><div class="progress-track"><span class="progress-fill" style="width:${Math.min(100,value)}%"></span></div><b>${Math.round(value)}</b></div>`).join('')}</div></article>
        <article class="card"><div class="section-title" style="margin-top:0"><h2>EMBLEMAS</h2><small>${profile.badges.length} CONQUISTAS</small></div><div class="badge-list">${profile.badges.map((badge) => `<span class="badge">◆ ${escapeHtml(badge)}</span>`).join('')}</div></article>
        <article class="card"><div class="section-title" style="margin-top:0"><h2>EXPERIÊNCIA E ACESSIBILIDADE</h2><small>PREFERÊNCIAS PROTEGIDAS</small></div><div class="settings-grid">
          <button class="setting-card ${profile.settings.sound ? 'active' : ''}" data-toggle-sound><span>♫</span><div><strong>Sons sintéticos</strong><small>${profile.settings.sound ? 'Ativados' : 'Desativados'} · feedback curto em acertos e erros</small></div><b>${profile.settings.sound ? 'ON' : 'OFF'}</b></button>
          <button class="setting-card ${profile.settings.reducedMotion ? 'active' : ''}" data-toggle-motion><span>≈</span><div><strong>Movimento reduzido</strong><small>${profile.settings.reducedMotion ? 'Ativado' : 'Desativado'} · reduz partículas e transições</small></div><b>${profile.settings.reducedMotion ? 'ON' : 'OFF'}</b></button>
          <button class="setting-card active" data-toggle-explanation><span>≡</span><div><strong>Nível de explicação</strong><small>Alterne entre resumo e aprofundamento</small></div><b>${profile.settings.explanationMode === 'detailed' ? 'DETALHADO' : 'CURTO'}</b></button>
          <button class="setting-card ${profile.settings.tutorialAutoPlay !== false ? 'active' : ''}" data-toggle-tutorial-autoplay><span>▶</span><div><strong>Tutorial automático</strong><small>Inicia o guia animado nas primeiras missões</small></div><b>${profile.settings.tutorialAutoPlay !== false ? 'ON' : 'OFF'}</b></button>
          <button class="setting-card ${profile.settings.scheduleNotifications !== false ? 'active' : ''}" data-toggle-schedule-notifications><span>◷</span><div><strong>Lembretes do horário</strong><small>Informa aula atual, salvamento e últimos minutos sem bloquear</small></div><b>${profile.settings.scheduleNotifications !== false ? 'ON' : 'OFF'}</b></button>
          <button class="setting-card ${profile.settings.showRemainingTime !== false ? 'active' : ''}" data-toggle-remaining-time><span>⌛</span><div><strong>Tempo restante</strong><small>Exibe o indicador compacto no topo</small></div><b>${profile.settings.showRemainingTime !== false ? 'ON' : 'OFF'}</b></button>
        </div><div class="tutorial-profile-actions"><button class="primary-button" data-open-tutorial-center>ABRIR CENTRAL DE TUTORIAIS</button><small>${Object.keys(profile.tutorialProgress?.tools || {}).length}/13 ferramentas com tutorial assistido</small></div></article>
        <article class="card"><div class="section-title" style="margin-top:0"><h2>PROTEÇÃO E CONTINUIDADE</h2><small>PERFIL CRIPTOGRAFADO</small></div>
          <div class="security-summary"><div><span>▣</span><strong>Dados protegidos</strong><small>Nome, turma, respostas, progresso, configurações e histórico ficam cifrados no IndexedDB.</small></div><div><span>⌁</span><strong>Integridade verificável</strong><small>${auditCount} eventos registrados em cadeia de hashes.</small></div><div><span>◷</span><strong>Retenção temporária</strong><small>Expiração renovada por ${platformConfig.profile.retentionDays} dias após o salvamento.</small></div><div><span>EA</span><strong>EduAuth Offline</strong><small>Autorizações contextuais sem senha mestre estática. Provisionamento de produção ainda necessário.</small></div></div>
          <div class="data-actions"><button class="primary-button" data-export-progress>EXPORTAR BACKUP CRIPTOGRAFADO</button><label class="secondary-button" style="display:inline-flex;margin:0;cursor:pointer">IMPORTAR BACKUP<input data-import-progress type="file" accept=".edu-profile,application/json" hidden></label><button class="secondary-button" data-request-persistent-storage>SOLICITAR ARMAZENAMENTO PERSISTENTE</button><button class="secondary-button" data-change-password>ALTERAR SENHA LOCAL</button><button class="secondary-button" data-change-identity>CORRIGIR NOME OU TURMA</button><button class="secondary-button" data-verify-integrity>VERIFICAR INTEGRIDADE</button><button class="secondary-button" data-open-eduauth-center>EDUAUTH E RECUPERAÇÃO</button></div>
        </article>
        <article class="card"><div class="section-title" style="margin-top:0"><h2>SESSÃO E EQUIPAMENTO COMPARTILHADO</h2><small>SAIR COM SEGURANÇA</small></div><p>Ao bloquear, a chave de descriptografia é removida da memória. O progresso permanece salvo e exige a senha novamente.</p><div class="data-actions"><button class="primary-button" data-lock-session>SAIR E BLOQUEAR</button><button class="secondary-button" data-view="delivery">CONCLUSÃO E ENTREGA</button><button class="danger-button" data-delete-profile>EXCLUIR DESTE COMPUTADOR</button><button class="danger-button" data-reset-progress>ZERAR SOMENTE O PROGRESSO</button></div></article>
      </div>
    </div>`;
};
