const DEFAULT_PROFILE = {
  id: 'visitante', name: 'Explorador DS', className: 'Modo demonstração', callsign: 'DS-01',
  level: 1, xp: 0, completedExperiences: [], createdAt: new Date().toISOString(), lastSavedAt: new Date().toISOString()
};
const normalizeProfile=(profile={})=>({
  ...DEFAULT_PROFILE,...profile,
  id:String(profile.id||DEFAULT_PROFILE.id),name:String(profile.name||DEFAULT_PROFILE.name).slice(0,48),
  className:String(profile.className||DEFAULT_PROFILE.className).slice(0,40),callsign:String(profile.callsign||DEFAULT_PROFILE.callsign).slice(0,12).toUpperCase(),
  xp:Math.max(0,Number(profile.xp||0)),level:Math.max(1,Number(profile.level||1)),
  completedExperiences:Array.isArray(profile.completedExperiences)?[...new Set(profile.completedExperiences.map(String))]:[],
  createdAt:profile.createdAt||new Date().toISOString(),lastSavedAt:profile.lastSavedAt||profile.createdAt||new Date().toISOString()
});

export class ProfileStore {
  constructor(storage, bus) {
    this.storage = storage;
    this.bus = bus;
    const saved=this.storage.get('profiles', [DEFAULT_PROFILE]);
    this.profiles = (Array.isArray(saved)&&saved.length?saved:[DEFAULT_PROFILE]).map(normalizeProfile);
    this.activeId = this.storage.get('active-profile', this.profiles[0]?.id ?? DEFAULT_PROFILE.id);
    this.ensureActive();
  }
  ensureActive() { if (!this.profiles.some(profile => profile.id === this.activeId)) this.activeId = this.profiles[0]?.id; }
  list() { return structuredClone(this.profiles); }
  active() { return structuredClone(this.profiles.find(p => p.id === this.activeId) ?? DEFAULT_PROFILE); }
  create({ name, className, callsign }) {
    const cleanName = name.trim().slice(0, 48);
    if (!cleanName) throw new Error('Informe o nome do estudante.');
    const now=new Date().toISOString();
    const profile = normalizeProfile({
      id: crypto.randomUUID?.() ?? `p-${Date.now()}`, name: cleanName,
      className: (className || 'Turma não informada').trim().slice(0, 40),
      callsign: (callsign || `DS-${String(this.profiles.length + 1).padStart(2, '0')}`).trim().slice(0, 12).toUpperCase(),
      level: 1, xp: 0, completedExperiences: [], createdAt: now,lastSavedAt:now
    });
    this.profiles.push(profile);this.activeId = profile.id;this.persist();return structuredClone(profile);
  }
  select(id) {if (!this.profiles.some(profile => profile.id === id)) return false;this.activeId = id;this.storage.set('active-profile', id);this.bus.emit('profile:changed', this.active());return true;}
  remove(id) {if (this.profiles.length <= 1) throw new Error('Mantenha pelo menos um perfil local.');this.profiles = this.profiles.filter(profile => profile.id !== id);this.ensureActive();this.persist();}
  addXp(amount, experienceId) {
    const profile = this.profiles.find(p => p.id === this.activeId);if (!profile) return false;
    if (experienceId && profile.completedExperiences.includes(experienceId)) return false;
    if (experienceId) profile.completedExperiences.push(experienceId);
    profile.xp += Math.max(0, Math.round(amount));profile.level = Math.max(1, Math.floor(profile.xp / 250) + 1);this.persist();return true;
  }
  hasCompleted(experienceId) { return this.active().completedExperiences.includes(experienceId); }
  exportSnapshot(){return {schema:'cosmos-ds-profiles-v1',activeId:this.activeId,profiles:this.list(),exportedAt:new Date().toISOString()};}
  importSnapshot(snapshot){
    if(snapshot?.schema!=='cosmos-ds-profiles-v1'||!Array.isArray(snapshot.profiles)||!snapshot.profiles.length)throw new Error('Backup de perfis inválido.');
    const incoming=snapshot.profiles.map(normalizeProfile);const byId=new Map(this.profiles.map(item=>[item.id,item]));
    for(const profile of incoming)byId.set(profile.id,profile);
    this.profiles=[...byId.values()].slice(0,100);this.activeId=byId.has(snapshot.activeId)?snapshot.activeId:this.activeId;this.ensureActive();this.persist();return this.list();
  }
  persist() {
    const active=this.profiles.find(item=>item.id===this.activeId);if(active)active.lastSavedAt=new Date().toISOString();
    this.storage.set('profiles', this.profiles);this.storage.set('active-profile', this.activeId);this.bus.emit('profile:changed', this.active());
  }
}
