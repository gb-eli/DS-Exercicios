export const EDUAUTH_ACTIONS = {
  CHALLENGE_START: {
    id: 'challenge-start', numericCode: 1, label: 'Iniciar desafio supervisionado', risk: 'LOW',
    preferredMode: 'CLASS_SHARED_PIN', pinLength: 8, ttlSeconds: 900,
    sharedAcrossClass: true, sessionBound: false, singleUse: false, requireReason: false,
  },
  LESSON_START: {
    id: 'lesson-start', numericCode: 2, label: 'Iniciar aula guiada supervisionada', risk: 'LOW',
    preferredMode: 'CLASS_SHARED_PIN', pinLength: 8, ttlSeconds: 900,
    sharedAcrossClass: true, sessionBound: false, singleUse: false, requireReason: false,
  },
  RESULT_RELEASE: {
    id: 'result-release', numericCode: 3, label: 'Liberar resultado individual', risk: 'MEDIUM',
    preferredMode: 'SESSION_SCOPED_PIN', pinLength: 8, ttlSeconds: 300,
    sharedAcrossClass: false, sessionBound: true, singleUse: true, requireReason: false,
  },
  PROFILE_RECOVERY: {
    id: 'profile-recovery', numericCode: 4, label: 'Redefinir senha do perfil', risk: 'HIGH',
    preferredMode: 'SESSION_SCOPED_PIN', strongerMode: 'PROFILE_RECOVERY_ENVELOPE', pinLength: 10, ttlSeconds: 180,
    sharedAcrossClass: false, sessionBound: true, singleUse: true, requireReason: true,
  },
  PROGRESS_RESET: {
    id: 'progress-reset', numericCode: 5, label: 'Zerar progresso preservando identidade', risk: 'HIGH',
    preferredMode: 'SESSION_SCOPED_PIN', strongerMode: 'SIGNED_GRANT', pinLength: 10, ttlSeconds: 180,
    sharedAcrossClass: false, sessionBound: true, singleUse: true, requireReason: true,
  },
  PROFILE_DELETE: {
    id: 'profile-delete', numericCode: 6, label: 'Excluir perfil deste dispositivo', risk: 'CRITICAL',
    preferredMode: 'SIGNED_GRANT', pinLength: 0, ttlSeconds: 120,
    sharedAcrossClass: false, sessionBound: true, singleUse: true, requireReason: true, requireTeacherReauthentication: true,
  },
  RECOVERY_SETUP: {
    id: 'recovery-setup', numericCode: 7, label: 'Configurar chave administrativa de recuperação', risk: 'CRITICAL',
    preferredMode: 'SIGNED_GRANT', pinLength: 0, ttlSeconds: 120,
    sharedAcrossClass: false, sessionBound: true, singleUse: true, requireReason: true, requireTeacherReauthentication: true,
  },
};

export const findEduAuthAction = (id) => Object.values(EDUAUTH_ACTIONS).find((action) => action.id === id) || null;
