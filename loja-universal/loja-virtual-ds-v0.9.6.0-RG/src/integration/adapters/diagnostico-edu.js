export class DiagnosticoEduAdapter {
  constructor(sdk) { this.sdk = sdk; this.platformId = 'diagnostico-edu'; }
  reward(payload) { return this.sdk.reward({ ...payload, platformId: this.platformId }); }
  phaseCompleted(payload) { return this.sdk.reward({ ...payload, type: 'PHASE_COMPLETED', platformId: this.platformId }); }
  sessionCompleted(payload) { return this.sdk.reward({ ...payload, type: 'SESSION_COMPLETED', platformId: this.platformId }); }
  learningProgress(payload) { return this.sdk.reward({ ...payload, type: 'LEARNING_PROGRESS', platformId: this.platformId }); }
  evidenceExported(payload) { return this.sdk.reward({ ...payload, type: 'EVIDENCE_EXPORTED', platformId: this.platformId }); }
  achievementUnlocked(payload) { return this.sdk.reward({ ...payload, type: 'ACHIEVEMENT_UNLOCKED', platformId: this.platformId }); }
}
export default DiagnosticoEduAdapter;
