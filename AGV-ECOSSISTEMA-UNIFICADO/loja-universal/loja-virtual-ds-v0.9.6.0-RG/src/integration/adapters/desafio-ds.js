export class DesafioDsAdapter {
  constructor(sdk) { this.sdk = sdk; this.platformId = 'desafio-ds'; }
  reward(payload) { return this.sdk.reward({ ...payload, platformId: this.platformId }); }
  phaseCompleted(payload) { return this.sdk.reward({ ...payload, type: 'PHASE_COMPLETED', platformId: this.platformId }); }
  missionCompleted(payload) { return this.sdk.reward({ ...payload, type: 'MISSION_COMPLETED', platformId: this.platformId }); }
  challengeCompleted(payload) { return this.sdk.reward({ ...payload, type: 'CHALLENGE_COMPLETED', platformId: this.platformId }); }
  projectPublished(payload) { return this.sdk.reward({ ...payload, type: 'PROJECT_PUBLISHED', platformId: this.platformId }); }
  evidenceExported(payload) { return this.sdk.reward({ ...payload, type: 'EVIDENCE_EXPORTED', platformId: this.platformId }); }
  achievementUnlocked(payload) { return this.sdk.reward({ ...payload, type: 'ACHIEVEMENT_UNLOCKED', platformId: this.platformId }); }
}
export default DesafioDsAdapter;
