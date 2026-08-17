export class CentralDsAdapter {
  constructor(sdk) { this.sdk = sdk; this.platformId = 'central-ds'; }
  reward(payload) { return this.sdk.reward({ ...payload, platformId: this.platformId }); }
  toolResultCreated(payload) { return this.sdk.reward({ ...payload, type: 'TOOL_RESULT_CREATED', platformId: this.platformId }); }
  tutorialCompleted(payload) { return this.sdk.reward({ ...payload, type: 'TUTORIAL_COMPLETED', platformId: this.platformId }); }
  achievementUnlocked(payload) { return this.sdk.reward({ ...payload, type: 'ACHIEVEMENT_UNLOCKED', platformId: this.platformId }); }
}
export default CentralDsAdapter;
