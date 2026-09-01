export function realtimeFresh(peer,maxAge=2600){const ts=Number(peer?.realtime_ts)||0;return ts>0&&Date.now()-ts<=maxAge;}
export function remoteElevation(peer,{absolute=false}={}){if(!realtimeFresh(peer))return 0;const value=Math.max(0,Number(peer?.realtime_elevation)||0);return absolute?value:value;}
export function remoteHeading(peer){return realtimeFresh(peer)&&Number.isFinite(Number(peer?.heading))?Number(peer.heading):null;}
export function remoteAction(peer){return realtimeFresh(peer)?(peer?.local_action||null):null;}
export function remoteAppearance(peer){return peer?.avatar_style&&typeof peer.avatar_style==='object'?peer.avatar_style:null;}
export function applyRemoteAvatarState(avatarSystem,avatar,peer,{speed=0,time=0,dt=.016,jump=0,vertical=0}={}){
  if(!avatar)return;const appearance=remoteAppearance(peer),revision=String(peer?.avatar_style_revision||'');if(appearance&&(!revision||avatar.userData.remoteAppearanceRevision!==revision)){if(avatarSystem.updateAppearance?.(avatar,appearance)!==false||!revision)avatar.userData.remoteAppearanceRevision=revision||JSON.stringify(appearance);}
  avatar.userData.localAction=remoteAction(peer);avatarSystem.animate(avatar,{speed,time,dt,jump,vertical});avatarSystem.updateEmote(avatar,peer?.emote,peer?.emote_until);
}

