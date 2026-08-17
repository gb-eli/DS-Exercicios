import { escapeHtml } from '../core/utils.js';
import { IMMERSIVE_SCENARIOS, getImmersiveScenarioForMission } from '../data/immersive-scenarios.js';
import { ImmersiveRuntime, QUALITY_PRESETS, chooseAutoQuality, detectWebGLSupport } from '../immersive/engine.js';

export const immersiveCatalog = Object.freeze(Object.values(IMMERSIVE_SCENARIOS).map((scenario) => ({
  id: scenario.id,
  label: scenario.shortLabel,
  icon: scenario.icon,
  category: scenario.category,
})));

export const isImmersiveTool = (toolId = '') => Boolean(IMMERSIVE_SCENARIOS[toolId]);

const qualityOptions = ['auto', 'low', 'medium', 'high', 'ultra'].map((id) => `<option value="${id}">${id === 'auto' ? 'Automático' : QUALITY_PRESETS[id].label}</option>`).join('');

const fallbackNodes = (scene) => {
  const common = `<span class="immersive-2d-node node-a"></span><span class="immersive-2d-node node-b"></span><span class="immersive-2d-node node-c"></span><span class="immersive-2d-node node-d"></span><span class="immersive-2d-link link-a"></span><span class="immersive-2d-link link-b"></span><span class="immersive-2d-link link-c"></span>`;
  if (scene === 'server-room') return `<div class="fallback-racks">${Array.from({ length: 10 }, (_, index) => `<i style="--i:${index}"><b></b><b></b><b></b></i>`).join('')}</div>${common}`;
  if (scene === 'soc-center') return `<div class="fallback-soc-wall">${Array.from({ length: 7 }, (_, index) => `<i style="--i:${index}"></i>`).join('')}</div><div class="fallback-desks"></div>${common}`;
  if (scene === 'satellite-station') return `<div class="fallback-earth"></div><div class="fallback-orbit orbit-a"><i></i></div><div class="fallback-orbit orbit-b"><i></i></div>${common}`;
  if (scene === 'incident-response') return `<div class="fallback-bank"><strong>CONTA PROTEGIDA</strong><span>R$ 84.920,00</span></div>${common}`;
  if (scene === 'application-lab') return `<div class="fallback-app-flow"><i>ENTRADA</i><i>VALIDAÇÃO</i><i>AUTORIZAÇÃO</i><i>DADOS</i><i>SAÍDA</i></div>${common}`;
  if (scene === 'forensic-vault') return `<div class="fallback-evidence-vault"><i>HASH</i><i>LOG</i><i>MEMÓRIA</i><i>ARQUIVO</i></div>${common}`;
  if (scene === 'mobile-lab') return `<div class="fallback-mobile-devices"><i>APP</i><i>IDENTIDADE</i><i>PERMISSÕES</i></div>${common}`;
  return `<div class="fallback-network-core">SOC</div>${common}`;
};

export const renderImmersiveWorkspace = (toolId, context = {}) => {
  const scenario = IMMERSIVE_SCENARIOS[toolId] || getImmersiveScenarioForMission(context?.missionId);
  if (!scenario) return '';
  const profileQuality = context?.profile?.settings?.qualityPreset || 'auto';
  return `<section class="immersive-suite" data-immersive-root data-tool-id="${escapeHtml(scenario.id)}" data-scene-id="${escapeHtml(scenario.scene)}" data-mission-id="${escapeHtml(context?.missionId || '')}">
    <header class="immersive-header">
      <div><span>IMMERSIVE 3D/360 · SANDBOX LOCAL</span><h2>${escapeHtml(scenario.label)}</h2><p>${escapeHtml(scenario.objective)}</p></div>
      <div class="immersive-safety"><i></i><b>SEM ACESSO EXTERNO</b><small>Dados, equipamentos e comunicações fictícios</small></div>
    </header>
    <div class="immersive-stage" data-immersive-stage>
      <canvas class="immersive-canvas" data-immersive-canvas tabindex="0" aria-label="${escapeHtml(scenario.label)}. Arraste para olhar ao redor; use setas ou WASD; roda do mouse controla o zoom."></canvas>
      <div class="immersive-fallback" data-immersive-fallback aria-label="Visualização bidimensional alternativa" hidden>${fallbackNodes(scenario.scene)}<div class="immersive-fallback-status"><span>MODO 2D ACESSÍVEL</span><strong>${escapeHtml(scenario.label)}</strong><small data-fallback-message>Representação estática pronta para análise.</small></div></div>
      <div class="immersive-vignette" aria-hidden="true"></div>
      <div class="immersive-objective"><span>OBJETIVO</span><strong>${escapeHtml(scenario.objective)}</strong></div>
      <div class="immersive-metrics" aria-live="polite"><span data-immersive-health>ANALISANDO</span><span data-immersive-fps>FPS --</span><span data-immersive-objects>OBJ --</span><span data-immersive-draws>DRAW --</span></div>
      <div class="immersive-compass" aria-hidden="true"><i>N</i><span></span><b>360°</b></div>
      <div class="immersive-controls-hint"><span>ARRASTAR: câmera</span><span>RODA / + −: zoom</span><span>WASD / SETAS: olhar</span></div><div class="immersive-orientation-note" data-immersive-orientation-note hidden>Gire o aparelho para paisagem e ampliar a área 3D.</div>
    </div>
    <div class="immersive-control-panel">
      <div class="immersive-actions" role="group" aria-label="Ações da simulação">${scenario.actions.map((action, index) => `<button type="button" class="${index === 0 ? 'active' : ''}" data-immersive-action="${escapeHtml(action.id)}"><span>${String(index + 1).padStart(2, '0')}</span>${escapeHtml(action.label)}</button>`).join('')}</div>
      <div class="immersive-settings">
        <label>QUALIDADE<select data-immersive-quality>${qualityOptions}</select></label>
        <button type="button" class="secondary-button compact" data-immersive-reset>REINICIAR CÂMERA</button>
        <button type="button" class="secondary-button compact" data-immersive-toggle-fallback>MODO 2D</button>
        <button type="button" class="secondary-button compact" data-immersive-fullscreen>MODO IMERSIVO</button>
      </div>
    </div>
    <div class="immersive-report" role="status"><div><span>ESTADO DA OPERAÇÃO</span><strong data-immersive-status>Inicializando ambiente local...</strong></div><small data-immersive-profile-quality>Preferência do perfil: ${escapeHtml(profileQuality.toUpperCase())}</small></div>
  </section>`;
};

const runtimes = new WeakMap();
const workspaceCleanups = new WeakMap();

const setFallbackState = (root, action = 'scan') => {
  root.dataset.immersiveState = action;
  const messages = {
    scan: 'Fluxos e ativos relevantes foram destacados para inspeção.',
    attack: 'Incidente fictício ativado. Os elementos críticos aparecem em vermelho.',
    contain: 'Contenção simulada aplicada. O fluxo suspeito foi isolado.',
    recover: 'Recuperação concluída. O ambiente voltou ao estado operacional.',
  };
  const message = root.querySelector('[data-fallback-message]');
  if (message) message.textContent = messages[action] || messages.scan;
};

const dispatchAction = (root, detail) => root.dispatchEvent(new CustomEvent('ctfds:immersive-action', { bubbles: true, detail }));

export const disposeImmersiveWorkspaces = (container = document) => {
  container.querySelectorAll?.('[data-immersive-root]').forEach((root) => {
    runtimes.get(root)?.dispose?.();
    runtimes.delete(root);
    workspaceCleanups.get(root)?.forEach?.((cleanup) => cleanup());
    workspaceCleanups.delete(root);
  });
};

export const mountImmersiveWorkspaces = (container = document) => {
  container.querySelectorAll?.('[data-immersive-root]').forEach((root) => {
    if (root.dataset.mounted === 'true') return;
    root.dataset.mounted = 'true';
    const cleanups = [];
    workspaceCleanups.set(root, cleanups);
    const canvas = root.querySelector('[data-immersive-canvas]');
    const fallback = root.querySelector('[data-immersive-fallback]');
    const status = root.querySelector('[data-immersive-status]');
    const qualitySelect = root.querySelector('[data-immersive-quality]');
    const toolId = root.dataset.toolId;
    const missionId = root.dataset.missionId || '';
    const sceneId = root.dataset.sceneId || 'server-room';
    const profileQuality = document.documentElement.dataset.quality || 'auto';
    qualitySelect.value = ['auto', 'low', 'medium', 'high', 'ultra'].includes(profileQuality) ? profileQuality : 'auto';
    let fallbackMode = !detectWebGLSupport();
    let runtime = null;
    let criticalMetrics = 0;
    const autoFallbackEnabled = document.documentElement.dataset.autoFallback3d !== 'false';
    const preferLandscape = document.documentElement.dataset.preferLandscape3d !== 'false';

    const updateStatus = (message) => { if (status) status.textContent = message; };
    const updateOrientationNote = () => {
      const note = root.querySelector('[data-immersive-orientation-note]');
      const portrait = window.innerHeight > window.innerWidth && window.innerWidth <= 760;
      if (note) note.hidden = !portrait || Boolean(document.fullscreenElement);
      root.dataset.orientation = portrait ? 'portrait' : 'landscape';
    };
    const updateMetrics = ({ fps, objects, drawCalls, preset, scale = 1 }) => {
      const fpsNode = root.querySelector('[data-immersive-fps]');
      const objectNode = root.querySelector('[data-immersive-objects]');
      const drawNode = root.querySelector('[data-immersive-draws]');
      const healthNode = root.querySelector('[data-immersive-health]');
      const health = fps >= 45 ? 'stable' : fps >= 27 ? 'attention' : 'critical';
      if (fpsNode) fpsNode.textContent = `FPS ${fps}`;
      if (objectNode) objectNode.textContent = `OBJ ${objects}`;
      if (drawNode) drawNode.textContent = `DRAW ${drawCalls}`;
      if (healthNode) healthNode.textContent = health === 'stable' ? 'ESTÁVEL' : health === 'attention' ? 'AJUSTANDO' : 'MODO SEGURO';
      root.dataset.performanceHealth = health;
      root.dataset.lastFps = String(fps || 0);
      root.dataset.lastScale = String(scale || 1);
      const qualityNode = root.querySelector('[data-immersive-profile-quality]');
      if (qualityNode) qualityNode.textContent = `Renderização: ${String(preset || 'auto').toUpperCase()} · escala ${Math.round(scale * 100)}% · ${healthNode?.textContent || ''}`;
      root.dataset.activeQuality = preset;
      if (autoFallbackEnabled && !fallbackMode && fps > 0 && fps < 18) criticalMetrics += 1;
      else criticalMetrics = Math.max(0, criticalMetrics - 1);
      if (criticalMetrics >= 5) {
        criticalMetrics = 0;
        showFallback(true, 'Desempenho crítico persistente. O modo 2D foi ativado automaticamente para preservar a fluidez e o progresso.');
      }
    };

    const showFallback = (enabled, reason = '') => {
      fallbackMode = enabled;
      if (canvas) canvas.hidden = enabled;
      if (fallback) fallback.hidden = !enabled;
      root.classList.toggle('fallback-active', enabled);
      if (enabled) {
        runtime?.dispose?.();
        runtime = null;
        runtimes.delete(root);
        updateStatus(reason || 'Modo 2D acessível ativo. As ações educativas continuam disponíveis.');
      }
    };

    const startRuntime = (quality = qualitySelect.value) => {
      runtime?.dispose?.();
      runtime = null;
      if (fallbackMode) showFallback(false);
      try {
        runtime = new ImmersiveRuntime(canvas, { sceneId, quality, onStatus: updateStatus, onMetrics: updateMetrics, onContextLost: () => showFallback(true, 'Contexto WebGL perdido. O modo 2D foi ativado automaticamente para preservar a missão.') });
        runtimes.set(root, runtime);
        root.dataset.activeQuality = quality === 'auto' ? chooseAutoQuality() : quality;
      } catch (error) {
        showFallback(true, `${error.message || 'WebGL indisponível.'} Modo 2D ativado automaticamente.`);
      }
    };

    root.querySelectorAll('[data-immersive-action]').forEach((button) => button.addEventListener('click', () => {
      const action = button.dataset.immersiveAction || 'scan';
      root.querySelectorAll('[data-immersive-action]').forEach((item) => item.classList.toggle('active', item === button));
      if (fallbackMode) setFallbackState(root, action); else runtime?.setAction(action);
      dispatchAction(root, { toolId, missionId, sceneId, action, quality: root.dataset.activeQuality || qualitySelect.value, fallback: fallbackMode, fps: Number(root.dataset.lastFps || 0), scale: Number(root.dataset.lastScale || 0), orientation: root.dataset.orientation || (window.innerWidth >= window.innerHeight ? 'landscape' : 'portrait'), at: Date.now() });
    }));

    qualitySelect.addEventListener('change', () => {
      if (!fallbackMode) startRuntime(qualitySelect.value);
      dispatchAction(root, { toolId, missionId, sceneId, action: 'quality', quality: qualitySelect.value, fallback: fallbackMode, fps: Number(root.dataset.lastFps || 0), scale: Number(root.dataset.lastScale || 0), orientation: root.dataset.orientation || (window.innerWidth >= window.innerHeight ? 'landscape' : 'portrait'), at: Date.now() });
    });
    root.querySelector('[data-immersive-reset]')?.addEventListener('click', () => { runtime?.resetCamera?.(); updateStatus('Câmera centralizada no objetivo da missão.'); });
    root.querySelector('[data-immersive-toggle-fallback]')?.addEventListener('click', (event) => {
      if (fallbackMode) { fallbackMode = false; startRuntime(qualitySelect.value); event.currentTarget.textContent = 'MODO 2D'; }
      else { showFallback(true); setFallbackState(root, root.dataset.immersiveState || 'scan'); event.currentTarget.textContent = 'ATIVAR 3D'; }
    });
    const fullscreenButton = root.querySelector('[data-immersive-fullscreen]');
    fullscreenButton?.addEventListener('click', async () => {
      const stage = root.querySelector('[data-immersive-stage]');
      try {
        if (!document.fullscreenElement) {
          await stage?.requestFullscreen?.({ navigationUI: 'hide' });
          if (preferLandscape) { try { await screen.orientation?.lock?.('landscape'); } catch { /* bloqueio de orientação é opcional */ } }
        } else {
          await document.exitFullscreen?.();
          try { screen.orientation?.unlock?.(); } catch { /* opcional */ }
        }
      } catch { updateStatus('O navegador não autorizou o modo imersivo. A atividade continua na janela atual.'); }
    });
    const handleFullscreen = () => {
      const active = Boolean(document.fullscreenElement);
      root.classList.toggle('fullscreen-active', active);
      if (fullscreenButton) fullscreenButton.textContent = active ? 'SAIR DO MODO IMERSIVO' : 'MODO IMERSIVO';
      updateOrientationNote();
      runtime?.resize?.();
    };
    document.addEventListener('fullscreenchange', handleFullscreen);
    window.addEventListener('orientationchange', updateOrientationNote);
    window.addEventListener('resize', updateOrientationNote);
    cleanups.push(() => document.removeEventListener('fullscreenchange', handleFullscreen));
    cleanups.push(() => window.removeEventListener('orientationchange', updateOrientationNote));
    cleanups.push(() => window.removeEventListener('resize', updateOrientationNote));

    setFallbackState(root, 'scan');
    updateOrientationNote();
    if (fallbackMode) showFallback(true, 'WebGL indisponível ou bloqueado. Modo 2D ativado automaticamente.'); else startRuntime(qualitySelect.value);
  });
};

export const immersiveActionReport = ({ toolId, action, quality, fallback, fps = 0, scale = 0, orientation = '' }) => {
  const scenario = IMMERSIVE_SCENARIOS[toolId];
  const actionLabel = scenario?.actions.find((item) => item.id === action)?.label || action;
  return `${scenario?.label || 'Ambiente imersivo'}\nAÇÃO: ${actionLabel}\nQUALIDADE: ${(quality || 'auto').toUpperCase()}\nRENDERIZAÇÃO: ${fallback ? 'fallback 2D' : 'WebGL 3D/360'}${fps ? ` · ${fps} FPS` : ''}${scale ? ` · escala ${Math.round(scale * 100)}%` : ''}${orientation ? ` · ${orientation}` : ''}\nESCOPO: simulação local com dados fictícios; nenhuma rede, conta, satélite ou dispositivo real foi acessado.`;
};
