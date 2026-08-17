export class ProfileBackupService {
  create({profileStore,settingsStore}){
    const snapshot={schema:'cosmos-ds-backup-v1',createdAt:new Date().toISOString(),profiles:profileStore.exportSnapshot(),settings:settingsStore.get()};
    snapshot.summary={profiles:snapshot.profiles.profiles.length,activeId:snapshot.profiles.activeId};
    return snapshot;
  }
  validate(data){
    if(data?.schema!=='cosmos-ds-backup-v1')throw new Error('Backup incompatível com o COSMOS DS.');
    if(!Array.isArray(data.profiles?.profiles)||!data.settings)throw new Error('Backup incompleto.');
    return true;
  }
  restore(data,{profileStore,settingsStore}){this.validate(data);profileStore.importSnapshot(data.profiles);settingsStore.importState(data.settings);return {profiles:profileStore.list().length};}
  toJson(snapshot){return JSON.stringify(snapshot,null,2);}
}
