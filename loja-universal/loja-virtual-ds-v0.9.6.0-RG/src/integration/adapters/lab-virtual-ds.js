export class LabVirtualDsAdapter {
  constructor(sdk) { this.sdk = sdk; this.platformId = 'lab-virtual-ds'; }
  reward(payload) { return this.sdk.reward({ ...payload, platformId: this.platformId }); }
  tutorialCompleted(payload) { return this.sdk.reward({ ...payload, type: 'TUTORIAL_COMPLETED', platformId: this.platformId }); }
  toolResultCreated(payload) { return this.sdk.reward({ ...payload, type: 'TOOL_RESULT_CREATED', platformId: this.platformId }); }
  labCompleted(payload) { return this.sdk.reward({ ...payload, type: 'LAB_COMPLETED', platformId: this.platformId }); }
  evidenceExported(payload) { return this.sdk.reward({ ...payload, type: 'EVIDENCE_EXPORTED', platformId: this.platformId }); }
  learningProgress(payload) { return this.sdk.reward({ ...payload, type: 'LEARNING_PROGRESS', platformId: this.platformId }); }
}
export default LabVirtualDsAdapter;
