const MAX_MESSAGE=180;
const clean=value=>String(value||'').replace(/[\u0000-\u001f\u007f]/g,' ').replace(/\s+/g,' ').trim().slice(0,MAX_MESSAGE);
export function createProximityChat({supabase,state,onMessage,onError}={}){
  let channel=null,ready=null;
  async function ensure(){
    if(channel)return ready;channel=supabase.channel('agv-lobby-proximity-chat-v1').on('broadcast',{event:'proximity-chat'},async event=>{
      const token=event?.payload?.token,targetHint=String(event?.payload?.target_id||'');if(!token||targetHint!==state.user?.id)return;
      try{const {data,error}=await supabase.functions.invoke('lobby-presence',{body:{action:'verify_chat',token}});if(error||!data?.ok||!data?.chat)return;const chat=data.chat;if(chat.sender_id===state.user?.id)return;if(chat.target_id&&chat.target_id!==state.user?.id)return;if(chat.scene!==state.scene)return;
        const sender=(state.others||[]).find(o=>o.student_id===chat.sender_id);if(!sender)return;const dx=Number(sender.x)-Number(state.player?.x||0),dy=Number(sender.y)-Number(state.player?.y||0);if(Math.hypot(dx,dy)>110)return;onMessage?.({...chat,sender});
      }catch(error){onError?.(error);}
    });ready=new Promise(resolve=>{let settled=false;const done=value=>{if(settled)return;settled=true;resolve(value);};channel.subscribe(status=>{if(status==='SUBSCRIBED')done(true);else if(['CHANNEL_ERROR','TIMED_OUT','CLOSED'].includes(status))done(false);});setTimeout(()=>done(false),4500);});return ready;
  }
  async function send(message,targetId=null){const text=clean(message);if(!text)return false;const available=await ensure();if(!available||!channel)throw new Error('chat_channel_unavailable');const {data,error}=await supabase.functions.invoke('lobby-presence',{body:{action:'issue_chat',message:text,scene:state.scene,x:Math.round(state.player.x),y:Math.round(state.player.y),target_id:targetId||null}});if(error||!data?.token)throw new Error(data?.error||error?.message||'chat_token_failed');const sent=await channel.send({type:'broadcast',event:'proximity-chat',payload:{token:data.token,target_id:targetId}});if(sent!=='ok'&&sent!==undefined)throw new Error(`chat_broadcast_${sent}`);return{text,sender_id:state.user.id,target_id:targetId,scene:state.scene,expires_at:data.expires_at};}
  async function stop(){if(channel){try{await supabase.removeChannel(channel)}catch{}channel=null;ready=null;}}
  return{ensure,send,stop};
}
