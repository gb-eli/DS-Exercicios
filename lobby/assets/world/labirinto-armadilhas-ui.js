import { MAP_ID, CHECKPOINTS } from './labirinto-armadilhas-shared.js';

const esc = value => String(value ?? '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

export function createLabyrinthUI(context = {}, handlers = {}) {
  const host = context.uiRoot || document.body;
  const root = document.createElement('div');
  root.dataset.agvMapUi = MAP_ID;
  root.innerHTML = `
    <style>
      [data-agv-map-ui="${MAP_ID}"]{position:fixed;inset:0;z-index:40;pointer-events:none;font-family:Inter,system-ui,sans-serif;color:#fff}
      .lab-hud{position:absolute;left:14px;top:14px;display:grid;grid-template-columns:repeat(2,minmax(128px,1fr));gap:8px;max-width:min(560px,calc(100vw - 90px))}
      .lab-card{background:linear-gradient(180deg,#101720e8,#111117e8);border:1px solid #ffffff24;border-radius:14px;padding:9px 11px;box-shadow:0 10px 28px #0006;backdrop-filter:blur(8px)}
      .lab-card small{display:block;opacity:.7;font-size:11px;text-transform:uppercase;letter-spacing:.08em}.lab-card b{font-size:19px}
      .lab-hearts{letter-spacing:2px;color:#ff4d58}.lab-progress{grid-column:1/-1}.lab-track{display:flex;gap:5px;margin-top:6px}.lab-node{width:26px;height:7px;border-radius:999px;background:#ffffff24}.lab-node.done{background:#48e36d}.lab-node.current{background:#27b7ff;box-shadow:0 0 10px #27b7ff}
      .lab-objective{position:absolute;top:14px;left:50%;transform:translateX(-50%);background:#0e1721dc;border:1px solid #27b7ff66;border-radius:12px;padding:9px 15px;font-weight:700;max-width:38vw;text-align:center}
      .lab-actions{pointer-events:auto;position:absolute;right:14px;top:14px;display:flex;gap:8px;flex-direction:column}.lab-btn{border:0;border-radius:12px;padding:11px 14px;color:#fff;font-weight:800;cursor:pointer;box-shadow:0 8px 24px #0005}.lab-giveup{background:#b32632}.lab-lobby{background:#1669a6}
      .lab-toast{position:absolute;left:50%;bottom:28px;transform:translateX(-50%);background:#111d;border:1px solid #fff2;border-radius:12px;padding:9px 13px;opacity:0;transition:opacity .18s}.lab-toast.show{opacity:1}
      .lab-modal[hidden]{display:none}.lab-modal{pointer-events:auto;position:absolute;inset:0;display:grid;place-items:center;background:#000a;padding:20px}.lab-panel{width:min(620px,92vw);background:linear-gradient(180deg,#171f2a,#0d1118);border:1px solid #ffffff22;border-radius:22px;padding:24px;box-shadow:0 30px 100px #000b;text-align:center}.lab-panel h2{font-size:clamp(30px,6vw,58px);margin:0 0 8px}.lab-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:18px 0}.lab-stat{background:#ffffff0b;border-radius:12px;padding:10px}.lab-stat small{display:block;opacity:.7}.lab-stat b{font-size:20px}.lab-modal-actions{display:flex;justify-content:center;gap:9px;flex-wrap:wrap}.lab-retry{background:#1673b9}.lab-return{background:#168446}.lab-continue{background:#6b5ea8}
      @media(max-width:720px){.lab-objective{display:none}.lab-hud{grid-template-columns:1fr 1fr;max-width:calc(100vw - 116px)}.lab-card{padding:7px 9px}.lab-card b{font-size:15px}.lab-stats{grid-template-columns:1fr 1fr}.lab-actions{right:8px;top:8px}.lab-btn{padding:9px 10px;font-size:12px}}
    </style>
    <div class="lab-hud">
      <div class="lab-card"><small>Vidas</small><b class="lab-hearts" data-hearts>❤ ❤ ❤ ❤ ❤</b></div>
      <div class="lab-card"><small>Pontuação</small><b data-score>0</b></div>
      <div class="lab-card"><small>XP</small><b data-xp>0</b></div>
      <div class="lab-card"><small>Tempo</small><b data-time>00:00</b></div>
      <div class="lab-card lab-progress"><small>Progresso • <span data-sector>Setor 1</span></small><div class="lab-track" data-track></div></div>
    </div>
    <div class="lab-objective">Objetivo: atravesse os 4 checkpoints e alcance a CHEGADA</div>
    <div class="lab-actions"><button class="lab-btn lab-giveup" data-giveup>⚑ Desistir</button><button class="lab-btn lab-lobby" data-lobby-fast>⌂ Lobby</button></div>
    <div class="lab-toast" data-toast></div>
    <div class="lab-modal" data-modal hidden><div class="lab-panel"><h2 data-title></h2><p data-text></p><div class="lab-stats" data-stats></div><div class="lab-modal-actions"><button class="lab-btn lab-retry" data-retry>Tentar novamente</button><button class="lab-btn lab-return" data-lobby>Voltar ao Lobby</button><button class="lab-btn lab-continue" data-continue>Continuar</button></div></div></div>`;
  host.appendChild(root);
  const q = s => root.querySelector(s);
  const modal=q('[data-modal]'), title=q('[data-title]'), text=q('[data-text]'), stats=q('[data-stats]');
  const retry=q('[data-retry]'), lobby=q('[data-lobby]'), cont=q('[data-continue]');
  const track=q('[data-track]');
  track.innerHTML = CHECKPOINTS.map((_,i)=>`<span class="lab-node" data-node="${i+1}"></span>`).join('');
  let toastTimer=0;

  function formatTime(sec=0){const m=Math.floor(sec/60),s=String(sec%60).padStart(2,'0');return `${String(m).padStart(2,'0')}:${s}`;}
  function setStats(items){stats.innerHTML=items.map(([label,value])=>`<div class="lab-stat"><small>${esc(label)}</small><b>${esc(value)}</b></div>`).join('');}
  function open(t, body, {canRetry=false,canContinue=false,items=[]}={}){title.textContent=t;text.textContent=body;setStats(items);retry.hidden=!canRetry;cont.hidden=!canContinue;modal.hidden=false;}
  function close(){modal.hidden=true;}
  function toast(message){q('[data-toast]').textContent=message;q('[data-toast]').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>q('[data-toast]')?.classList.remove('show'),1800);}

  q('[data-giveup]').onclick=()=>handlers.onGiveUp?.();
  q('[data-lobby-fast]').onclick=()=>handlers.onReturnLobby?.('hud');
  retry.onclick=()=>{close();handlers.onRetry?.();};
  lobby.onclick=()=>handlers.onReturnLobby?.('modal');
  cont.onclick=close;

  return {
    update(s){
      q('[data-hearts]').textContent=[0,1,2,3,4].map(i=>i<s.lives?'❤':'♡').join(' ');
      q('[data-score]').textContent=Number(s.score||0).toLocaleString('pt-BR');
      q('[data-xp]').textContent=Number(s.xp||0).toLocaleString('pt-BR');
      q('[data-time]').textContent=formatTime(s.elapsedSeconds);
      q('[data-sector]').textContent=`Setor ${s.currentSector || 1}`;
      root.querySelectorAll('[data-node]').forEach(el=>{const n=Number(el.dataset.node);el.classList.toggle('done',n<=s.checkpointsReached);el.classList.toggle('current',n===s.checkpointsReached+1);});
    },
    showCheckpoint(cp){toast(`${cp.label} ativado`);},
    showCheckpointLocked(){toast('Passe pelos checkpoints na ordem correta');},
    showFinishLocked(){toast('A CHEGADA libera após os 4 checkpoints');},
    showDefeat(s){open('DERROTA!','Você perdeu as 5 vidas.',{canRetry:true,items:[['Tempo',formatTime(s.elapsedSeconds)],['Pontuação',s.score],['XP',s.xp],['Armadilhas',s.deaths],['Último checkpoint',s.checkpointOrder],['Vidas','0/5']]});},
    showVictory(s){open('VITÓRIA!','Você conquistou o Labirinto com Armadilhas.',{canRetry:true,items:[['Tempo',formatTime(s.elapsedSeconds)],['Vidas',`${s.lives}/5`],['Pontuação',s.score],['XP ganho',s.xp],['Checkpoints','4/4'],['Bônus perfeito',s.deaths===0?'+2.000':'—']]});},
    showPaused(){open('Pausado','Continue o desafio ou volte ao lobby.',{canContinue:true});},
    showReturning(){open('Saindo do desafio','Solicitando retorno seguro ao lobby…');},
    close,
    destroy(){clearTimeout(toastTimer);root.remove();}
  };
}
