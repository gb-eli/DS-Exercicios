export class LabDs3DVrAdapter {
  constructor(sdk) { this.sdk = sdk; this.platformId = 'lab-ds-3d-vr'; }
  reward(payload) { return this.sdk.reward({ ...payload, platformId: this.platformId }); }
  tutorialCompleted(payload) { return this.sdk.reward({ ...payload, type: 'TUTORIAL_COMPLETED', platformId: this.platformId }); }
  toolResultCreated(payload) { return this.sdk.reward({ ...payload, type: 'TOOL_RESULT_CREATED', platformId: this.platformId }); }
  labCompleted(payload) { return this.sdk.reward({ ...payload, type: 'LAB_COMPLETED', platformId: this.platformId }); }
  missionCompleted(payload) { return this.sdk.reward({ ...payload, type: 'MISSION_COMPLETED', platformId: this.platformId }); }
  evidenceExported(payload) { return this.sdk.reward({ ...payload, type: 'EVIDENCE_EXPORTED', platformId: this.platformId }); }
}
export default LabDs3DVrAdapter;
