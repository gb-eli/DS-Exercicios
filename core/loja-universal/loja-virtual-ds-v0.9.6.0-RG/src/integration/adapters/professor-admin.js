export class ProfessorAdminAdapter {
  constructor(sdk) { this.sdk = sdk; this.platformId = 'professor-admin'; }
  teacherReward(payload) { return this.sdk.reward({ ...payload, type: 'TEACHER_REWARD', platformId: this.platformId }); }
  collaborationValidated(payload) { return this.sdk.reward({ ...payload, type: 'COLLABORATION_VALIDATED', platformId: this.platformId }); }
  feedbackConfirmed(payload) { return this.sdk.reward({ ...payload, type: 'FEEDBACK_CONFIRMED', platformId: this.platformId }); }
  bugReportConfirmed(payload) { return this.sdk.reward({ ...payload, type: 'BUG_REPORT_CONFIRMED', platformId: this.platformId }); }
}
export default ProfessorAdminAdapter;
