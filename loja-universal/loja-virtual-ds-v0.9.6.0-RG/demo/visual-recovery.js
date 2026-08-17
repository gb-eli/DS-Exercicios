(() => {
'use strict';
const ANGLES=['front','three-quarter','side','back'];
const src=a=>`../assets/runtime/recovery/avatar-${a}-hq.webp`;
let angleIndex=1;
function mountFallback(){
 const old=document.getElementById('avatarFallback'); const scene=old?.parentElement; if(!scene||scene.querySelector('.recovery-fallback-stage'))return;
 const stage=document.createElement('div');stage.className='recovery-fallback-stage';stage.hidden=true;stage.innerHTML=`<span class="recovery-badge">Fallback visual HQ • 4 ângulos</span><img alt="Personagem DS em alta qualidade" src="${src(ANGLES[angleIndex])}"><div class="recovery-fallback-controls">${ANGLES.map((a,i)=>`<button type="button" data-recovery-angle="${a}" class="${i===angleIndex?'active':''}">${['Frente','¾','Lado','Costas'][i]}</button>`).join('')}</div>`;
 scene.appendChild(stage); if(old)old.hidden=true;
 stage.querySelectorAll('[data-recovery-angle]').forEach((b,i)=>b.addEventListener('click',()=>setFallbackAngle(i)));
}
function setFallbackAngle(i){angleIndex=(i+ANGLES.length)%ANGLES.length;const stage=document.querySelector('.recovery-fallback-stage');if(!stage)return;const img=stage.querySelector('img');img.style.opacity='.15';setTimeout(()=>{img.src=src(ANGLES[angleIndex]);img.style.opacity='1'},80);stage.querySelectorAll('button').forEach((b,j)=>b.classList.toggle('active',j===angleIndex));}
function showFallback(reason='WebGL indisponível'){
 mountFallback();const stage=document.querySelector('.recovery-fallback-stage');if(stage)stage.hidden=false;const canvas=document.getElementById('avatarCanvas');if(canvas)canvas.hidden=true;const loading=document.getElementById('avatar3dLoading');if(loading)loading.hidden=true;const status=document.getElementById('avatar3dStatus');if(status)status.textContent=`${reason} — fallback HQ preservado`;document.body.dataset.visualFallback='hq';notice('A visualização 3D não abriu neste navegador. A plataforma manteve a arte HQ e quatro ângulos, sem usar o avatar simplificado.');}
function hideFallback(){const stage=document.querySelector('.recovery-fallback-stage');if(stage)stage.hidden=true;document.body.dataset.visualFallback='none'}
function notice(text){let n=document.getElementById('visualRecoveryNotice');if(!n){n=document.createElement('div');n.id='visualRecoveryNotice';n.className='visual-recovery-notice';n.innerHTML='<span>✦</span><div><strong>Proteção gráfica ativa</strong><small></small></div><button type="button" aria-label="Fechar">×</button>';document.body.appendChild(n);n.querySelector('button').onclick=()=>n.hidden=true;}n.querySelector('small').textContent=text;n.hidden=false;}
function protectAutoMode(){const perf=window.DSPerformance;if(!perf)return;const r=perf.getReport?.();document.body.dataset.basicExplicit=String(r?.requestedMode==='basic');if(r?.requestedMode==='auto'&&r?.actualMode==='basic'){perf.setMode('intermediate');notice('O modo Automático tentou abrir no Básico. A correção aplicou o piso visual Intermediário; o Básico continua disponível quando escolhido manualmente.');}}
function audit(){const q=window.DSPerformance?.actualMode||document.body.dataset.quality||'intermediate';const renderer=window.DSRendererProfile?.state?.actual||document.body.dataset.renderer||'lite';const premium=window.DSRendererProfile?.state?.premiumStatus||'idle';const report={version:'0.9.6.0-RG',quality:q,renderer,premium,webgl:!!document.createElement('canvas').getContext('webgl'),fallback:document.body.dataset.visualFallback||'none',assets:['front','three-quarter','side','back'].map(a=>src(a))};window.DS_VISUAL_RECOVERY_REPORT=Object.freeze(report);document.dispatchEvent(new CustomEvent('ds-visual-recovery-audit',{detail:report}));return report}
document.addEventListener('DOMContentLoaded',()=>{document.body.dataset.visualRecovery='active';mountFallback();protectAutoMode();setTimeout(audit,600)});
document.addEventListener('ds-avatar-ready',e=>{if(e.detail?.mode==='fallback2d')showFallback('WebGL indisponível');else hideFallback();audit()});
document.addEventListener('ds-quality-change',()=>{protectAutoMode();setTimeout(audit,100)});
document.addEventListener('click',e=>{if(e.target.closest('[data-camera="360"]')&&document.body.dataset.visualFallback==='hq')setFallbackAngle(angleIndex+1)});
window.DSVisualRecovery={version:'0.9.6.0-RG',showFallback,hideFallback,setFallbackAngle,audit,notice};
})();
