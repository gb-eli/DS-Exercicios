window.VersionManager = (() => {
  const config = () => window.APP_CONFIG || {};
  const setAll = (selector, value) => document.querySelectorAll(selector).forEach(el => { el.textContent = value; });
  function formatDate(value) {
    if (!value) return 'não informada';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return new Intl.DateTimeFormat('pt-BR', { dateStyle:'short', timeStyle:'short', timeZone:'America/Sao_Paulo' }).format(date);
  }
  function setStatus(text, state='checking') { document.querySelectorAll('[data-version-status]').forEach(el => { el.textContent=text; el.dataset.state=state; }); }
  async function check() {
    const app=config(); setStatus('Verificando versão pública…','checking');
    try {
      const response=await fetch(`${app.versionManifest||'version.json'}?v=${Date.now()}`,{cache:'no-store',headers:{Accept:'application/json'}});
      if(!response.ok)throw new Error(`HTTP ${response.status}`);
      const manifest=await response.json(); setAll('[data-public-version]',`v${manifest.version||app.version}`);
      setStatus(manifest.version===app.version?'Você está usando a versão pública mais recente.':`Versão pública: v${manifest.version||app.version}`,manifest.version===app.version?'current':'outdated');
      return manifest;
    } catch {
      setStatus(location.protocol==='file:'?'Modo local: a conferência pública exige HTTP/HTTPS.':'Não foi possível conferir a versão pública agora.','offline');
      return null;
    }
  }
  function openDetails(){const drawer=document.querySelector('#versionDrawer');if(!drawer)return;drawer.hidden=false;drawer.setAttribute('aria-hidden','false');drawer.focus();}
  function closeDetails(){const drawer=document.querySelector('#versionDrawer');if(!drawer)return;drawer.hidden=true;drawer.setAttribute('aria-hidden','true');}
  function init(){const app=config();setAll('[data-app-version]',`v${app.version||'0.0.0'}`);setAll('[data-app-updated]',formatDate(app.releasedAt));setAll('[data-app-name]',app.name||'Plataforma 1DS');document.querySelectorAll('[data-check-version]').forEach(b=>b.addEventListener('click',check));document.querySelectorAll('[data-version-details]').forEach(b=>b.addEventListener('click',openDetails));document.querySelectorAll('[data-close-version]').forEach(b=>b.addEventListener('click',closeDetails));document.querySelector('#versionDrawer')?.addEventListener('click',e=>{if(e.target.id==='versionDrawer')closeDetails();});check();}
  return {init,check};
})();
document.addEventListener('DOMContentLoaded',()=>VersionManager.init());
