export const SUSPICIOUS_AUDIT_STATUSES = new Set([
  'subject_scope_mismatch',
  'identity_scope_mismatch',
  'wrong_exercise'
]);

export function normalizeName(value = '') {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toUpperCase();
}

export function normalizeRepo(value = '') {
  let s = String(value).trim();
  s = s.replace(/^https?:\/\/(www\.)?github\.com\//i, '');
  s = s.split(/[?#]/)[0];
  s = s.replace(/\.git$/i, '');
  const parts = s.split('/').filter(Boolean);
  if (parts.length >= 2) return `${parts[0]}/${parts[1]}`.toLowerCase();
  return s.toLowerCase();
}

export function clampScore10(value) {
  if (value === null || value === undefined || value === '') return null;
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  return Math.round(Math.max(0, Math.min(10, n)) * 10) / 10;
}

export function score10To100(value) {
  const n = clampScore10(value);
  return n === null ? null : Math.round(n * 10 * 100) / 100;
}

export function buildCurrentKey(row = {}) {
  return [
    normalizeName(row.student),
    String(row.subject || '').toLowerCase(),
    Number(row.exercise_number || 0),
    normalizeRepo(row.repository || row.repository_url || '')
  ].join('|');
}

export function deriveProposal(decision, current) {
  const proposal = {
    claim_status: current?.claim_status ?? null,
    exercise_status: current?.exercise_status ?? null,
    progress_percent: current?.progress_percent ?? null,
    approval_status: current?.approval_status ?? null,
    completion_source: current?.completion_source ?? null,
    submitted_score: current?.submitted_score ?? null,
    teacher_feedback: current?.teacher_feedback ?? null,
    operation: decision?.decision || null
  };

  const feedback = String(decision?.feedback || '').trim() || null;
  const score10 = clampScore10(decision?.final_score ?? decision?.suggested_score);
  const score100 = score10To100(score10);

  switch (decision?.decision) {
    case 'approved':
    case 'score_adjusted':
      proposal.claim_status = 'approved';
      proposal.exercise_status = 'completed';
      proposal.progress_percent = 100;
      proposal.approval_status = 'approved';
      proposal.completion_source = current?.completion_source || 'legacy_claim';
      proposal.submitted_score = score100;
      proposal.teacher_feedback = feedback;
      break;
    case 'request_fix':
      proposal.claim_status = current?.claim_status || 'pending';
      proposal.exercise_status = 'in_progress';
      proposal.approval_status = 'changes_requested';
      proposal.teacher_feedback = feedback || 'Revisão solicitada pelo professor.';
      break;
    case 'not_corresponding':
      proposal.claim_status = 'rejected';
      proposal.exercise_status = 'in_progress';
      proposal.approval_status = 'changes_requested';
      proposal.teacher_feedback = feedback || 'O repositório informado não corresponde a esta atividade.';
      break;
    case 'review':
      break;
    default:
      break;
  }
  return proposal;
}

function changed(a, b) {
  if (a === null && b === undefined) return false;
  if (a === undefined && b === null) return false;
  if (typeof a === 'number' || typeof b === 'number') {
    const na = a === null || a === undefined ? null : Number(a);
    const nb = b === null || b === undefined ? null : Number(b);
    if (na === null || nb === null) return na !== nb;
    return Math.abs(na - nb) > 0.0001;
  }
  return String(a ?? '') !== String(b ?? '');
}

export function simulateDecision(decision, current, context = {}) {
  const reasons = [];
  const warnings = [];
  const proposal = deriveProposal(decision, current || {});
  const auditStatus = String(decision?.status || '');
  const currentSubmitted = current?.submitted_score == null ? null : Number(current.submitted_score);
  const nextSubmitted = proposal.submitted_score == null ? null : Number(proposal.submitted_score);

  if (!current) reasons.push('current_claim_not_found');
  if (context.ambiguous) reasons.push('current_claim_ambiguous');
  if (SUSPICIOUS_AUDIT_STATUSES.has(auditStatus) && ['approved', 'score_adjusted'].includes(decision?.decision)) reasons.push('suspicious_link_cannot_auto_approve');
  if (current && current.claim_status && current.claim_status !== 'pending') reasons.push('claim_is_no_longer_pending');
  if (['approved', 'score_adjusted'].includes(decision?.decision) && nextSubmitted === null) reasons.push('approved_without_score');
  if (currentSubmitted !== null && nextSubmitted !== null && nextSubmitted < currentSubmitted) reasons.push('would_reduce_existing_submitted_score');
  if (current?.completion_source && current.completion_source !== 'legacy_claim' && ['approved', 'score_adjusted', 'request_fix', 'not_corresponding'].includes(decision?.decision)) reasons.push('different_completion_source');
  if (context.changedAfterDecision) reasons.push('student_state_changed_after_teacher_decision');

  if (current?.exercise_status === 'completed' && current?.approval_status === 'pending') warnings.push('already_completed_pending_review');
  if (current?.teacher_feedback && proposal.teacher_feedback && current.teacher_feedback !== proposal.teacher_feedback) warnings.push('would_replace_existing_teacher_feedback');
  if (['approved', 'score_adjusted'].includes(decision?.decision) && ['nonfunctional', 'not_found', 'incomplete'].includes(auditStatus)) warnings.push('approval_of_low_confidence_result');
  if (decision?.decision === 'review') warnings.push('review_decision_has_no_database_mutation');

  const fields = ['claim_status','exercise_status','progress_percent','approval_status','completion_source','submitted_score','teacher_feedback'];
  const diff = {};
  for (const field of fields) {
    const before = current?.[field] ?? null;
    const after = proposal[field] ?? null;
    if (changed(before, after)) diff[field] = { before, after };
  }

  const noOp = decision?.decision === 'review' || Object.keys(diff).length === 0;
  const blocked = reasons.length > 0;
  return {
    decision,
    current: current || null,
    proposal,
    diff,
    blocked,
    no_op: noOp,
    reasons,
    warnings
  };
}

export function buildApplicationPlan({ decisions = [], currentRows = [], generatedAt = null, sourceHash = null } = {}) {
  const index = new Map();
  for (const row of currentRows) {
    const key = buildCurrentKey(row);
    if (!index.has(key)) index.set(key, []);
    index.get(key).push(row);
  }

  const items = decisions.map(decision => {
    const key = buildCurrentKey(decision);
    const candidates = index.get(key) || [];
    const current = candidates[0] || null;
    const decisionAt = Date.parse(decision?.reviewed_at || generatedAt || '') || 0;
    const currentAt = Date.parse(current?.last_activity_at || current?.claim_updated_at || '') || 0;
    return simulateDecision(decision, current, {
      ambiguous: candidates.length > 1,
      changedAfterDecision: decisionAt > 0 && currentAt > decisionAt
    });
  });

  const counts = {
    decisions: items.length,
    safe_to_apply: items.filter(x => !x.blocked && !x.no_op).length,
    blocked: items.filter(x => x.blocked).length,
    no_op: items.filter(x => x.no_op && !x.blocked).length,
    approvals: items.filter(x => ['approved','score_adjusted'].includes(x.decision?.decision)).length,
    correction_requests: items.filter(x => x.decision?.decision === 'request_fix').length,
    rejected_links: items.filter(x => x.decision?.decision === 'not_corresponding').length,
    manual_review: items.filter(x => x.decision?.decision === 'review').length
  };

  return {
    schema: 'agv-legacy-github-application-plan-v1',
    generated_at: new Date().toISOString(),
    source_decisions_generated_at: generatedAt,
    source_decisions_sha256: sourceHash,
    production_write_applied: false,
    policy: {
      score_scale_source: '0-10',
      score_scale_student_exercises: '0-100',
      score_conversion: 'submitted_score = final_score * 10',
      suspicious_links_auto_approval: false,
      lower_existing_score_without_review: false,
      different_completion_source_without_review: false
    },
    counts,
    items
  };
}
