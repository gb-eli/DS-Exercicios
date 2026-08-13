const MODES = new Set(['CLASS_SHARED_PIN', 'SESSION_SCOPED_PIN', 'SIGNED_GRANT', 'PROFILE_RECOVERY_ENVELOPE']);
export const validateContext = (context) => {
  if (!context || context.protocol !== 'EDUAUTH' || Number(context.version) !== 1) throw new Error('Contexto EduAuth incompatível.');
  if (!MODES.has(context.mode)) throw new Error('Modalidade EduAuth desconhecida.');
  for (const key of ['platformCode', 'classCode', 'subjectCode', 'lessonCode', 'activityCode', 'actionCode', 'timeSlot']) {
    if (!Number.isInteger(Number(context[key])) || Number(context[key]) < 0) throw new Error(`Campo EduAuth inválido: ${key}.`);
  }
  return true;
};
