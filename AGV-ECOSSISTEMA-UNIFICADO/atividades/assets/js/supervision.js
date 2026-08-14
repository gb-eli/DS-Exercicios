import { supabase } from './supabase.js';

const $ = (id) => document.getElementById(id);
const state = {
  profile:null,
  exercise:null,
  sessionId:null,
  channelKey:null,
  channel:null,
  policy:null,
  armed:false,
  locked:false,
  heartbeatTimer:null,
  devtoolsTimer:null,
  snapshotTimer:null,
  lastFocusAt:0,
  lastPasteAt:0,
  lastRapidAt:0,
  lastDevtoolsAt:0,
  lastDevtoolsShortcutAt:0,
  lastSecurityFingerprints:new Map(),
  lastInput:{at:0,length:0},
  callbacks:{},
};

const DEFAULT_POLICY = {
  require_fullscreen:true,
  max_focus_violations:3,
  block_paste:true,
  detect_devtools:true,
  detect_rapid_input:true,
  block_external_network:false,
  allowed_origins:[],
  teacher_live_edit:true,
};

async function invokeFunction(name, body) {
  const { data, error } = await supabase.functions.invoke(name, { body });
  if (!error && !data?.error) return data || {};
  let details = data || null;
  try {
    if (!details && error?.context?.clone) details = await error.context.clone().json();
    else if (!details && error?.context?.json) details = await error.context.json();
  } catch (_) {}
  const err = new Error(details?.reason || details?.error || error?.message || 'Falha na operação.');
  err.code = details?.error || 'function_error';
  err.status = error?.context?.status || null;
  err.details = details;
  throw err;
}

export async function callActivityProgress(body) {
  return invokeFunction('activity-progress', body);
}
export async function submitLegacyExercise(body) {
  return invokeFunction('supervision', { action:'legacy_submit', ...body });
}

function chip(text, level='ok') {
  const el = $('supervision-chip');
  if (!el) return;
  el.textContent = text;
  el.className = `supervision-chip ${level}`;
}
function warning(message, level='warning', fullscreenAction=false) {
  const box = $('supervision-banner');
  const text = $('supervision-warning-text');
  const action = $('supervision-return-fullscreen');
  if (!box || !text) return;
  text.textContent = message;
  box.className = `supervision-banner ${level}`;
  box.classList.remove('hidden');
  if (action) action.classList.toggle('hidden', !fullscreenAction);
}
function hideWarning() {
  $('supervision-banner')?.classList.add('hidden');
}
function updateViolationChip(count=0) {
  const max = Number(state.policy?.max_focus_violations || 3);
  chip(`Supervisionado • ${count}/${max} saídas`, count ? 'warning' : 'ok');
}
function editorState() {
  try { return state.callbacks.getEditorState?.() || {}; }
  catch { return {}; }
}

function isFullscreenSupported() {
  return Boolean(document.fullscreenEnabled && document.documentElement?.requestFullscreen);
}
async function requestFullscreen() {
  if (!state.policy?.require_fullscreen) return true;
  if (!isFullscreenSupported()) {
    await safeEvent('fullscreen_unsupported','info','objective',{api_supported:false});
    return true;
  }
  try {
    if (!document.fullscreenElement) await document.documentElement.requestFullscreen({ navigationUI:'hide' });
    hideWarning();
    state.callbacks.onPause?.(false);
    return true;
  } catch (error) {
    warning('A atividade exige tela cheia. Clique novamente em “Entrar em tela cheia” para continuar.','high',true);
    return false;
  }
}

function lockStudent(reason) {
  if (state.locked) return;
  state.locked = true;
  state.callbacks.onLock?.(reason || 'Atividade bloqueada pelo professor.');
  chip('Atividade bloqueada','danger');
  const dialog = $('security-lock-dialog');
  if ($('security-lock-reason')) $('security-lock-reason').textContent = reason || 'A atividade foi bloqueada e precisa ser liberada pelo professor.';
  if (dialog && !dialog.open) dialog.showModal();
}

async function safeEvent(event_type, severity='warning', confidence='objective', details={}) {
  if (!state.sessionId) return null;
  try {
    const data = await invokeFunction('supervision', {
      action:'event',
      session_id:state.sessionId,
      event_type,
      severity,
      confidence,
      details,
    });
    updateViolationChip(data.focus_violation_count || 0);
    if (data.locked) lockStudent(data.reason);
    return data;
  } catch (error) {
    if (error.status === 423 || error.code === 'activity_locked') {
      lockStudent(error.details?.reason || error.message);
      return error.details || {locked:true};
    }
    console.warn('Falha ao registrar evento de supervisão', error);
    return null;
  }
}

async function focusViolation(type) {
  const now = Date.now();
  if (now - state.lastFocusAt < 1300) return; // evita contar fullscreen + visibility na mesma troca
  state.lastFocusAt = now;
  const label = type === 'visibility_hidden' ? 'troca de guia/janela' : 'saída da tela cheia';
  const result = await safeEvent(type,'high','objective',{label});
  if (result?.locked) return;
  const count = Number(result?.focus_violation_count || 0);
  const max = Number(state.policy?.max_focus_violations || 3);
  warning(`Atenção: ${label} registrada (${count}/${max}). Ao atingir ${max}, a atividade será bloqueada.`, 'high', state.policy?.require_fullscreen && isFullscreenSupported() && !document.fullscreenElement);
  if (state.policy?.require_fullscreen && isFullscreenSupported() && !document.fullscreenElement) state.callbacks.onPause?.(true);
}

function bindGlobalEvents() {
  if (bindGlobalEvents.bound) return;
  bindGlobalEvents.bound = true;

  document.addEventListener('visibilitychange', () => {
    if (!state.armed || state.locked) return;
    if (document.visibilityState === 'hidden') focusViolation('visibility_hidden');
    else if (state.policy?.require_fullscreen && isFullscreenSupported() && !document.fullscreenElement) {
      state.callbacks.onPause?.(true);
      warning('Retorne à tela cheia para continuar a atividade.', 'high', true);
    }
  });

  document.addEventListener('fullscreenchange', () => {
    if (!state.armed || state.locked || !state.policy?.require_fullscreen || !isFullscreenSupported()) return;
    if (!document.fullscreenElement) focusViolation('fullscreen_exit');
    else {
      hideWarning();
      state.callbacks.onPause?.(false);
    }
  });

  document.addEventListener('keydown', (event) => {
    if (!state.armed || state.locked || !state.policy?.detect_devtools) return;
    const k = String(event.key || '').toLowerCase();
    const shortcut =
      event.key === 'F12' ||
      (event.ctrlKey && event.shiftKey && ['i','j','c'].includes(k)) ||
      (event.metaKey && event.altKey && ['i','j','c'].includes(k)) ||
      (event.ctrlKey && k === 'u');
    if (!shortcut) return;
    event.preventDefault();
    const now = Date.now();
    if (now - state.lastDevtoolsShortcutAt < 3000) return;
    state.lastDevtoolsShortcutAt = now;
    safeEvent('devtools_shortcut','warning','heuristic',{key:event.key,ctrl:event.ctrlKey,shift:event.shiftKey,meta:event.metaKey,alt:event.altKey});
    warning('Atalho de ferramentas de desenvolvimento bloqueado e registrado.','warning');
  }, true);

  $('supervision-return-fullscreen')?.addEventListener('click', requestFullscreen);
  $('security-lock-back')?.addEventListener('click', () => {
    $('security-lock-dialog')?.close();
    document.dispatchEvent(new CustomEvent('epds:security-back'));
  });
}

async function connectLiveChannel() {
  if (!state.channelKey || state.channel) return;
  const topic = `epds-live:${state.channelKey}`;
  state.channel = supabase
    .channel(topic, { config:{ broadcast:{ self:false }, presence:{ key:state.profile?.id || crypto.randomUUID() } } })
    .on('broadcast', { event:'teacher_edit' }, ({payload}) => {
      if (!payload?.filename || typeof payload?.content !== 'string') return;
      state.callbacks.onTeacherEdit?.(payload);
    })
    .on('broadcast', { event:'teacher_editing' }, ({payload}) => {
      state.callbacks.onTeacherEditing?.(Boolean(payload?.editing), payload?.teacher_name || 'Professor');
    })
    .subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        try {
          await state.channel.track({ role:'student', exercise_id:state.exercise?.id, online_at:new Date().toISOString() });
        } catch (_) {}
      }
    });
}

function startHeartbeat() {
  clearInterval(state.heartbeatTimer);
  const beat = async () => {
    if (!state.sessionId || !state.armed) return;
    const s = editorState();
    try {
      const data = await invokeFunction('supervision', {
        action:'heartbeat',
        session_id:state.sessionId,
        current_file:s.filename || '',
        cursor_start:Number(s.cursor_start || 0),
        cursor_end:Number(s.cursor_end || 0),
        fullscreen:Boolean(document.fullscreenElement) || !isFullscreenSupported(),
        visibility_state:document.visibilityState || 'visible',
      });
      if (data.locked) lockStudent(data.reason);
    } catch (error) {
      if (error.status === 423) lockStudent(error.details?.reason || error.message);
    }
  };
  beat();
  state.heartbeatTimer = setInterval(beat, 2000);
}

function startDevtoolsHeuristic() {
  clearInterval(state.devtoolsTimer);
  if (!state.policy?.detect_devtools) return;
  state.devtoolsTimer = setInterval(() => {
    if (!state.armed || state.locked || window.innerWidth < 800 || /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)) return;
    const gapW = Math.max(0, window.outerWidth - window.innerWidth);
    const gapH = Math.max(0, window.outerHeight - window.innerHeight);
    if (gapW < 180 && gapH < 180) return;
    const now = Date.now();
    if (now - state.lastDevtoolsAt < 30000) return;
    state.lastDevtoolsAt = now;
    safeEvent('devtools_heuristic','warning','heuristic',{outer_width:window.outerWidth,inner_width:window.innerWidth,outer_height:window.outerHeight,inner_height:window.innerHeight});
    warning('Uma alteração incomum na área do navegador foi registrada como sinal de supervisão.','warning');
  }, 1800);
}

export async function prepareSupervision({ profile, exercise, getEditorState, onArmed, onPause, onLock, onTeacherEdit, onTeacherEditing }) {
  await stopSupervision({exitFullscreen:false});
  state.profile = profile;
  state.exercise = exercise;
  state.callbacks = { getEditorState, onArmed, onPause, onLock, onTeacherEdit, onTeacherEditing };
  state.locked = false;
  state.armed = false;
  state.lastFocusAt = 0;
  state.lastSecurityFingerprints.clear();
  bindGlobalEvents();

  let data;
  try {
    data = await invokeFunction('supervision', { action:'start_session', exercise_id:exercise.id });
  } catch (error) {
    if (error.status === 423 || error.code === 'activity_locked') {
      lockStudent(error.details?.reason || error.message);
      return {locked:true};
    }
    throw error;
  }

  state.sessionId = data.session?.id || null;
  state.channelKey = data.channel_key || null;
  state.policy = { ...DEFAULT_POLICY, ...(data.policy || {}) };
  updateViolationChip(Number(data.session?.focus_violation_count || 0));

  const dialog = $('supervision-start-dialog');
  if ($('supervision-policy-summary')) {
    const full = state.policy.require_fullscreen
      ? (isFullscreenSupported() ? 'Tela cheia obrigatória' : 'Tela cheia não suportada neste dispositivo')
      : 'Tela cheia opcional';
    $('supervision-policy-summary').innerHTML = `
      <span>${full}</span>
      <span>${state.policy.max_focus_violations} saídas antes do bloqueio</span>
      <span>${state.policy.block_paste ? 'Colar código bloqueado' : 'Colar código permitido'}</span>
      <span>IP e eventos de segurança registrados</span>`;
  }
  if (dialog && !dialog.open) dialog.showModal();

  const startBtn = $('supervision-start-btn');
  if (startBtn) startBtn.onclick = async () => {
    startBtn.disabled = true;
    startBtn.textContent = 'Iniciando...';
    const ok = await requestFullscreen();
    if (!ok) {
      startBtn.disabled = false;
      startBtn.textContent = 'Iniciar em tela cheia';
      return;
    }
    state.armed = true;
    dialog?.close();
    await connectLiveChannel();
    startHeartbeat();
    startDevtoolsHeuristic();
    state.callbacks.onArmed?.();
    sendEditorSnapshot(true);
  };
  return data;
}

export function getSupervisionPolicy() { return state.policy || DEFAULT_POLICY; }
export function getSupervisionSessionId() { return state.sessionId; }
export function isSupervisionLocked() { return state.locked; }

export async function handlePaste(event) {
  if (!state.armed || state.locked) return false;
  const now = Date.now();
  if (now - state.lastPasteAt < 800) {
    if (state.policy?.block_paste) event?.preventDefault?.();
    return state.policy?.block_paste;
  }
  state.lastPasteAt = now;
  const text = event?.clipboardData?.getData?.('text/plain') || '';
  if (state.policy?.block_paste) event?.preventDefault?.();
  await safeEvent('paste_attempt','high','objective',{chars:text.length,blocked:Boolean(state.policy?.block_paste)});
  warning(state.policy?.block_paste ? 'Colagem bloqueada. Digite o código no editor.' : 'Colagem registrada pelo modo supervisionado.','high');
  return Boolean(state.policy?.block_paste);
}

export async function handleDrop(event) {
  if (!state.armed || state.locked) return false;
  event?.preventDefault?.();
  await safeEvent('drop_attempt','high','objective',{blocked:true});
  warning('Arrastar/soltar conteúdo no editor foi bloqueado e registrado.','high');
  return true;
}

export function handleEditorInput(content, inputEvent=null) {
  if (!state.armed || state.locked) return;
  const now = performance.now();
  const length = String(content || '').length;
  const delta = length - Number(state.lastInput.length || 0);
  const elapsed = now - Number(state.lastInput.at || 0);
  const pasteLike = inputEvent?.inputType === 'insertFromPaste' || (delta >= 24 && elapsed > 0 && elapsed < 140);
  state.lastInput = {at:now,length};

  if (state.policy?.detect_rapid_input && pasteLike && Date.now() - state.lastRapidAt > 5000) {
    state.lastRapidAt = Date.now();
    safeEvent('rapid_insert','warning','heuristic',{delta_chars:delta,elapsed_ms:Math.round(elapsed),input_type:inputEvent?.inputType || null});
    warning('Entrada muito rápida detectada e registrada para conferência do professor.','warning');
  }
  sendEditorSnapshot(false);
}

export function sendEditorSnapshot(immediate=false) {
  if (!state.armed || !state.channel || state.locked) return;
  clearTimeout(state.snapshotTimer);
  const send = () => {
    const s = editorState();
    state.channel?.send({
      type:'broadcast',
      event:'code_snapshot',
      payload:{
        filename:s.filename || '',
        content:String(s.content || ''),
        cursor_start:Number(s.cursor_start || 0),
        cursor_end:Number(s.cursor_end || 0),
        at:new Date().toISOString(),
      }
    });
  };
  if (immediate) send();
  else state.snapshotTimer = setTimeout(send, 220);
}

export function sendCursor() {
  if (!state.armed || !state.channel || state.locked) return;
  const s = editorState();
  state.channel.send({
    type:'broadcast',
    event:'cursor',
    payload:{
      filename:s.filename || '',
      cursor_start:Number(s.cursor_start || 0),
      cursor_end:Number(s.cursor_end || 0),
      at:new Date().toISOString(),
    }
  });
}

const RISKY = [
  {type:'malicious_code_pattern',label:'eval()',rx:/\beval\s*\(/i},
  {type:'malicious_code_pattern',label:'new Function',rx:/\bnew\s+Function\s*\(/i},
  {type:'malicious_code_pattern',label:'document.cookie',rx:/\bdocument\s*\.\s*cookie\b/i},
  {type:'malicious_code_pattern',label:'navegação da janela superior',rx:/\b(?:window\s*\.\s*top|top\s*\.\s*location|parent\s*\.\s*location)\b/i},
  {type:'malicious_code_pattern',label:'sendBeacon',rx:/\bnavigator\s*\.\s*sendBeacon\s*\(/i},
  {type:'malicious_code_pattern',label:'WebSocket/EventSource',rx:/\b(?:WebSocket|EventSource)\s*\(/i},
  {type:'malicious_code_pattern',label:'iframe/object/embed',rx:/<\s*(?:iframe|object|embed)\b/i},
  {type:'malicious_code_pattern',label:'javascript: URL',rx:/javascript\s*:/i},
  {type:'malicious_code_pattern',label:'Python subprocess/os.system/socket',rx:/\b(?:subprocess|os\s*\.\s*system|import\s+socket|from\s+socket)\b/i},
  {type:'malicious_code_pattern',label:'Python bridge JS',rx:/\b(?:import\s+js|from\s+js\s+import|pyfetch|micropip)\b/i},
];
const NETWORK = [
  {label:'fetch',rx:/\bfetch\s*\(/i},
  {label:'XMLHttpRequest',rx:/\bXMLHttpRequest\b/i},
  {label:'script externo',rx:/<script[^>]+src\s*=\s*["']https?:\/\//i},
  {label:'importScripts',rx:/\bimportScripts\s*\(/i},
];

export async function inspectCode(files=[]) {
  if (!state.armed || state.locked) return {ok:!state.locked, findings:[]};
  const findings=[];
  for (const f of files) {
    const content = String(f.content || '');
    for (const p of RISKY) if (p.rx.test(content)) findings.push({type:p.type,label:p.label,filename:f.filename});
    if (state.policy?.block_external_network) {
      for (const p of NETWORK) if (p.rx.test(content)) findings.push({type:'external_network_attempt',label:p.label,filename:f.filename});
    }
  }
  if (!findings.length) return {ok:true,findings:[]};

  for (const finding of findings.slice(0,6)) {
    const fp = `${finding.type}:${finding.filename}:${finding.label}`;
    const last = state.lastSecurityFingerprints.get(fp) || 0;
    if (Date.now()-last < 15000) continue;
    state.lastSecurityFingerprints.set(fp,Date.now());
    await safeEvent(finding.type,'critical','objective',{filename:finding.filename,pattern:finding.label,execution_blocked:true});
  }
  warning(`Execução bloqueada: foi detectado um padrão não permitido (${findings[0].label}). O professor recebeu o registro.`,'danger');
  return {ok:false,findings};
}

export async function stopSupervision({exitFullscreen=true}={}) {
  state.armed = false;
  clearInterval(state.heartbeatTimer);
  clearInterval(state.devtoolsTimer);
  clearTimeout(state.snapshotTimer);
  if (state.channel) {
    try { await state.channel.untrack(); } catch (_) {}
    try { await supabase.removeChannel(state.channel); } catch (_) {}
  }
  state.channel = null;
  if (state.sessionId) {
    try { await invokeFunction('supervision',{action:'end_session',session_id:state.sessionId}); } catch (_) {}
  }
  state.sessionId = null;
  state.channelKey = null;
  state.policy = null;
  state.callbacks = {};
  hideWarning();
  chip('Supervisão inativa','');
  if (exitFullscreen && document.fullscreenElement) {
    try { await document.exitFullscreen(); } catch (_) {}
  }
}
