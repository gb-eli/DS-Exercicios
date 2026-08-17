// Adaptador fino entre uma plataforma e AGV Education Core.
export function createAGVPlatformAdapter(core) {
  return {
    async onActivityStarted(activityId) {
      return core.progress.report({ activityId, eventType: 'activity.started', idempotencyKey: crypto.randomUUID() });
    },
    async onActivityCompleted(activityId, { score = null, evidence = {} } = {}) {
      return core.progress.report({ activityId, eventType: 'activity.completed', progress: 100, score, payload: { evidence }, idempotencyKey: crypto.randomUUID() });
    }
  };
}
