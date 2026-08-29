const defaultClock=()=>performance.now();

export function createCheckpointChallenge({id='parkour',title='Circuito Parkour',checkpoints=[],start=null,radius=1.35,onEvent,clock=defaultClock}={}){
  let active=false,index=0,startedAt=0,cooldownUntil=0,lastTick=0;
  const total=checkpoints.length;
  const pointAt=i=>{const point=checkpoints[Math.max(0,Math.min(total-1,i))]||start||{x:0,z:0,y:0};return Array.isArray(point)?{x:point[0],z:point[1],y:point[2]||0}:{...point};};
  const emit=(type,extra={})=>{const now=clock(),elapsed=active&&startedAt?Math.max(0,(now-startedAt)/1000):0,event={type,id,title,index,total,elapsed,...extra};onEvent?.(event);return event;};
  function begin({restart=false}={}){active=true;index=0;startedAt=clock();cooldownUntil=0;lastTick=0;emit(restart?'restart':'start',{message:restart?'Circuito reiniciado. Passe pelos checkpoints 1 a 5.':'Passe pelos 5 checkpoints na ordem. Corra, pule e use reiniciar se precisar.'});return true;}
  function cancel(){if(!active)return false;active=false;const event=emit('cancel',{message:'Circuito encerrado. A exploração do Campus continua liberada.'});index=0;startedAt=0;return event;}
  function tick(position,now=clock()){
    if(!active||!position)return null;
    if(now-lastTick>=250){lastTick=now;emit('tick');}
    if(now<cooldownUntil)return null;
    const point=pointAt(index);
    if(Math.hypot(Number(position.x)-point.x,Number(position.z)-point.z)>radius)return null;
    index++;cooldownUntil=now+420;
    if(index>=total){const elapsed=Math.max(1,(now-startedAt)/1000);active=false;const event=emit('complete',{index:total,elapsed,message:`Circuito concluído em ${elapsed.toFixed(1).replace('.',',')} s. Treino local: não altera nota, XP ou atividade.`});startedAt=0;return event;}
    return emit('checkpoint',{message:`Checkpoint ${index}/${total}`});
  }
  function respawnPoint(){return index>0?pointAt(index-1):{...(start||pointAt(0))};}
  return{start:()=>begin(),restart:()=>begin({restart:true}),cancel,tick,isActive:()=>active,respawnPoint,snapshot:()=>({id,title,active,index,total,elapsed:active&&startedAt?Math.max(0,(clock()-startedAt)/1000):0})};
}
