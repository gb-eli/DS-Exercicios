export class DSPlatformAdapter {
  constructor(sdk, platformId) {
    if (!sdk) throw new Error('Instância do DSStoreSDK obrigatória.');
    this.sdk = sdk.configure({ platformId });
    this.platformId = platformId;
  }
  reward(payload) { return this.sdk.reward({ ...payload, platformId: this.platformId }); }
  phaseCompleted(payload) { return this.reward({ ...payload, type: 'PHASE_COMPLETED' }); }
  missionCompleted(payload) { return this.reward({ ...payload, type: 'MISSION_COMPLETED' }); }
  labCompleted(payload) { return this.reward({ ...payload, type: 'LAB_COMPLETED' }); }
  tutorialCompleted(payload) { return this.reward({ ...payload, type: 'TUTORIAL_COMPLETED' }); }
  challengeCompleted(payload) { return this.reward({ ...payload, type: 'CHALLENGE_COMPLETED' }); }
  toolResultCreated(payload) { return this.reward({ ...payload, type: 'TOOL_RESULT_CREATED' }); }
  evidenceExported(payload) { return this.reward({ ...payload, type: 'EVIDENCE_EXPORTED' }); }
  projectPublished(payload) { return this.reward({ ...payload, type: 'PROJECT_PUBLISHED' }); }
  achievementUnlocked(payload) { return this.reward({ ...payload, type: 'ACHIEVEMENT_UNLOCKED' }); }
}
