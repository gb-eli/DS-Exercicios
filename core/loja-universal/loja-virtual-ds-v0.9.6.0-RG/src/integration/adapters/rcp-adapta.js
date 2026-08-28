export class RcpAdaptaAdapter {
  constructor(sdk) { this.sdk = sdk; this.platformId = 'rcp-adapta'; }
  reward(payload) { return this.sdk.reward({ ...payload, platformId: this.platformId }); }
  tutorialCompleted(payload) { return this.sdk.reward({ ...payload, type: 'TUTORIAL_COMPLETED', platformId: this.platformId }); }
  phaseCompleted(payload) { return this.sdk.reward({ ...payload, type: 'PHASE_COMPLETED', platformId: this.platformId }); }
  missionCompleted(payload) { return this.sdk.reward({ ...payload, type: 'MISSION_COMPLETED', platformId: this.platformId }); }
  learningProgress(payload) { return this.sdk.reward({ ...payload, type: 'LEARNING_PROGRESS', platformId: this.platformId }); }
  recoveryCompleted(payload) { return this.sdk.reward({ ...payload, type: 'RECOVERY_COMPLETED', platformId: this.platformId }); }
  evidenceExported(payload) { return this.sdk.reward({ ...payload, type: 'EVIDENCE_EXPORTED', platformId: this.platformId }); }
}
export default RcpAdaptaAdapter;
