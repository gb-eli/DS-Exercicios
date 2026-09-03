const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
const round=(v,p=100)=>Math.round((Number(v)||0)*p)/p;
const VALID_ACTIONS=new Set(['dance','cheer','crouch','sit','wave']);
const VALID_EMOTES=new Set(['wave','like','spark']);
const VALID_MODES=new Set(['ground','plane','freefall','parachute']);

export function sanitizeAvatarStyle(input={}){
  const out={};
  if(typeof input.accentCss==='string'&&/^#[0-9a-f]{6}$/i.test(input.accentCss))out.accentCss=input.accentCss;
  for(const key of ['skin','hair','pants','shoes']){const n=Number(input[key]);if(Number.isFinite(n)&&n>=0&&n<=0xffffff)out[key]=Math.round(n);}
  for(const key of ['backpack','glasses','headset','wrist'])if(typeof input[key]==='boolean')out[key]=input[key];
  if(['cap','short','soft'].includes(input.hairStyle))out.hairStyle=input.hairStyle;
  return out;
}
export function avatarStyleSignature(style={}){try{return JSON.stringify(sanitizeAvatarStyle(style))}catch{return '{}'}}

export function createRealtimeAvatarPacketBuilder({state,getSnapshot=()=>({})}={}){
  let seq=0,lastStyleSig='';
  function packetSnapshot(full=false){
    const raw=getSnapshot?.()||{},now=Date.now(),style=sanitizeAvatarStyle(raw.avatarStyle||{}),styleSig=avatarStyleSignature(style);
    const action=VALID_ACTIONS.has(String(raw.localAction||''))?String(raw.localAction):null;
    const emote=VALID_EMOTES.has(String(raw.emote||''))?String(raw.emote):null;
    const mode=VALID_MODES.has(String(raw.movementMode||''))?String(raw.movementMode):'ground';
    const packet={
      v:2,userId:String(state?.user?.id||''),seq:++seq,ts:now,
      scene:String(raw.scene||state?.scene||'campus').slice(0,24),area:String(raw.area||state?.player?.area||'central').slice(0,64),
      x:round(raw.x??state?.player?.x,10),y:round(raw.y??state?.player?.y,10),
      elevation:round(clamp(raw.elevation??0,0,180),100),heading:round(Number(raw.heading)||0,1000),
      moving:!!raw.moving,running:!!raw.running,onGround:raw.onGround!==false,
      movementMode:mode,localAction:action,emote,emoteUntil:emote?now+4600:0,
      airdropTargetWorldId:String(raw.airdropTargetWorldId||'').slice(0,48)||null,airdropX:round(raw.airdropX??0,10),airdropZ:round(raw.airdropZ??0,10)
    };
    if(full||styleSig!==lastStyleSig){packet.avatarStyle=style;packet.styleRevision=styleSig;lastStyleSig=styleSig;}
    return packet;
  }
  return{packetSnapshot};
}

export function avatarMotionSignature(p={}){return[p.scene,p.area,p.x,p.y,p.elevation,p.heading,p.moving?1:0,p.running?1:0,p.onGround?1:0,p.movementMode,p.localAction||'',p.emote||'',p.airdropTargetWorldId||'',p.airdropX,p.airdropZ].join('|');}

export function createRealtimeAvatarPeerMerger({state,onUnknownPeer=()=>{}}={}){
  const lastSeen=new Map();let lastUnknownRefreshAt=0;
  function mergePeer(packet){
    if(!packet||packet.v!==2)return false;const id=String(packet.userId||'');if(!id||id===state?.user?.id)return false;
    const ts=Number(packet.ts)||0;if(Math.abs(Date.now()-ts)>10000)return false;const nseq=Number(packet.seq)||0,seen=lastSeen.get(id);if(seen&&nseq<=seen.seq&&ts<=seen.ts)return false;lastSeen.set(id,{seq:nseq,ts});
    let row=(state?.others||[]).find(o=>o.student_id===id);if(!row){const now=Date.now();if(now-lastUnknownRefreshAt>1400){lastUnknownRefreshAt=now;try{onUnknownPeer(id)}catch(_){}}return false;}
    if(String(packet.scene||'')!==String(state?.scene||''))return false;
    row.x=Number(packet.x);row.y=Number(packet.y);row.heading=Number(packet.heading)||0;row.realtime_elevation=Number(packet.elevation)||0;
    row.moving=!!packet.moving;row.running=!!packet.running;row.on_ground=packet.onGround!==false;row.movement_mode=String(packet.movementMode||'ground');
    row.local_action=packet.localAction||null;row.realtime_ts=ts;row.airdrop_target_world_id=packet.airdropTargetWorldId||null;row.airdrop_x=Number(packet.airdropX)||0;row.airdrop_z=Number(packet.airdropZ)||0;
    if(packet.emote){row.emote=packet.emote;row.emote_until=new Date(Number(packet.emoteUntil)||Date.now()+4200).toISOString();}
    if(packet.avatarStyle&&typeof packet.avatarStyle==='object'){row.avatar_style=sanitizeAvatarStyle(packet.avatarStyle);row.avatar_style_revision=String(packet.styleRevision||avatarStyleSignature(packet.avatarStyle));}
    return true;
  }
  function reset(){lastSeen.clear();lastUnknownRefreshAt=0;}
  return{mergePeer,reset};
}

export function createRealtimeAvatarSync({supabase,state,getSnapshot,onStatus=()=>{},onUnknownPeer=()=>{},onPeerPacket=()=>{}}={}){
  let channel=null,readyPromise=null,timer=null,stopped=false,lastSentAt=0,lastFullAt=0,lastMotionSig='';
  const interval=matchMedia('(pointer:coarse)').matches?125:100;
  const heartbeatMs=900;
  const topic='agv-lobby-avatar-state-v85';
  const builder=createRealtimeAvatarPacketBuilder({state,getSnapshot});
  const merger=createRealtimeAvatarPeerMerger({state,onUnknownPeer});

  function tick(){
    if(stopped||!channel||!state.user||document.hidden)return;const now=Date.now(),full=now-lastFullAt>=heartbeatMs,p=builder.packetSnapshot(full),sig=avatarMotionSignature(p),changed=sig!==lastMotionSig;
    if(!changed&&!full)return;if(now-lastSentAt<interval-8)return;lastSentAt=now;if(full)lastFullAt=now;lastMotionSig=sig;
    channel.send({type:'broadcast',event:'avatar-state',payload:p}).catch?.(()=>{});
  }
  function handlePeer(packet){const accepted=merger.mergePeer(packet);if(accepted)try{onPeerPacket(packet)}catch(_){}return accepted;}
  function ensure(){
    if(readyPromise)return readyPromise;stopped=false;readyPromise=new Promise(resolve=>{
      let settled=false,deadline=null;const finish=value=>{if(settled)return;settled=true;if(deadline)clearTimeout(deadline);resolve(value);};
      try{
        deadline=setTimeout(()=>finish(false),4500);
        channel=supabase.channel(topic,{config:{broadcast:{self:false,ack:false}}}).on('broadcast',{event:'avatar-state'},message=>handlePeer(message?.payload)).subscribe(status=>{
          onStatus(status);if(status==='SUBSCRIBED'){timer=setInterval(tick,interval);tick();finish(true);}else if(['CHANNEL_ERROR','TIMED_OUT','CLOSED'].includes(status))finish(false);
        });
      }catch(error){console.warn('Realtime do avatar indisponível:',error);finish(false);}
    });return readyPromise;
  }
  async function stop(){stopped=true;if(timer){clearInterval(timer);timer=null;}if(channel){try{await supabase.removeChannel(channel)}catch(_){}channel=null;}readyPromise=null;merger.reset();}
  function burst(){lastMotionSig='';lastFullAt=0;tick();}
  return{ensure,stop,burst,mergePeer:handlePeer,packetSnapshot:builder.packetSnapshot};
}
