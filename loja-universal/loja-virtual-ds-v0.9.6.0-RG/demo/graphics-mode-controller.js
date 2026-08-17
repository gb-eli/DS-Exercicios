(() => {
'use strict';
const MODES={
 basic:{label:'Básico',scene:'Estúdio Essencial',texture:'até 512 px',particles:'60',target:'60 FPS',summary:'Máxima fluidez e baixo consumo.'},
 intermediate:{label:'Intermediário',scene:'Neon Balanceado',texture:'até 1K',particles:'220',target:'60 FPS',summary:'Equilíbrio recomendado para a maioria.'},
 advanced:{label:'Avançado',scene:'Tech Avançado',texture:'até 2K',particles:'650',target:'60 FPS',summary:'Materiais e iluminação superiores.'},
 ultra:{label:'Ultra',scene:'Ultra Holográfico',texture:'até 4K seletivo',particles:'1.400',target:'60 FPS',summary:'Qualidade premium com pacote sob demanda.'},
 realism:{label:'Modo Realismo',scene:'Realismo Cinematográfico',texture:'4K seletivo',particles:'2.200',target:'45 FPS',summary:'Apresentação máxima, fotografia e desfile.'}
};
const viewScene={homeView:'home',storeView:'store',walletView:'utility',inventoryView:'inventory',avatarView:'avatar',profileView:'profile',effectsView:'vfx',performanceView:'diagnostics',packagesView:'packages'};
function normalize(m){return window.DSPerformance?.normalize?.(m)||({economy:'basic',balanced:'intermediate',high:'advanced',ultraAdvanced:'realism'}[m]||m)}
function apply(detail={}){const mode=normalize(detail.actual||window.DSPerformance?.actualMode||'intermediate'),m=MODES[mode]||MODES.intermediate;document.body.dataset.quality=mode;document.documentElement.style.setProperty('--quality-particle-budget',m.particles);const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v};set('modeSceneName',m.scene);set('modeTexture',m.texture);set('modeParticles',m.particles);set('modeTarget',m.target);set('currentModeSummary',m.summary);set('avatarModeBadge',m.label);set('productModeBadge',m.label);document.querySelectorAll('[data-mode-preview]').forEach(card=>card.classList.toggle('active',card.dataset.modePreview===mode));}
document.addEventListener('ds-quality-change',e=>apply(e.detail));document.addEventListener('ds-view-change',e=>{document.body.dataset.sceneContext=viewScene[e.detail.current]||'utility'});document.addEventListener('DOMContentLoaded',()=>{apply();const active=document.querySelector('.view.active')?.id;document.body.dataset.sceneContext=viewScene[active]||'home'});
window.DSGraphicsModes={modes:MODES,apply,normalize};
})();
