import { TOOL_CATALOG, CROSS_PROMOTION_CONFIG } from './data.js?v=20260811r38';
import { getSettings, getRecommendationHistory, saveRecommendationHistory } from './storage.js?v=20260811r38';
import { safeUrl } from './security.js?v=20260811r38';

const SESSION_KEY='agv.recommendation.session.v7';
function sessionState(){try{return JSON.parse(sessionStorage.getItem(SESSION_KEY))||{shown:0,closed:[],opened:[]}}catch{return{shown:0,closed:[],opened:[]}}}
function saveSession(value){try{sessionStorage.setItem(SESSION_KEY,JSON.stringify(value))}catch{}}
function hoursSince(value){return value?(Date.now()-new Date(value).getTime())/3600000:Infinity}
function statusLabel(status){return({available:'Disponível',pilot:'Piloto',development:'Em desenvolvimento',unavailable:'Indisponível',archived:'Arquivado'})[status]||status}
export function getToolCatalog(){return TOOL_CATALOG.map(item=>{const url=safeUrl(item.url,{allowHttp:false,allowRelative:false});return{...item,url,statusLabel:statusLabel(item.status),canOpen:Boolean(url&&item.status==='available')}})}
export function pickToolRecommendation({currentToolId='desafio-informatica',relatedAreas=[]}={}){
  const settings=getSettings(),session=sessionState(),history=getRecommendationHistory();
  if(!CROSS_PROMOTION_CONFIG.enabled||settings.recommendationsEnabled===false||history.disabled)return null;
  if(session.shown>=CROSS_PROMOTION_CONFIG.maxPerSession)return null;
  const recentShown=(history.recentShownAt||[]).filter(at=>hoursSince(at)<24);
  if(recentShown.length>=CROSS_PROMOTION_CONFIG.maxPerDay)return null;
  if(history.snoozedUntil&&new Date(history.snoozedUntil)>new Date())return null;
  const items=getToolCatalog().filter(item=>item.id!==currentToolId&&item.status!=='archived'&&item.status!=='unavailable').filter(item=>hoursSince(history.items?.[item.id]?.lastShownAt)>=CROSS_PROMOTION_CONFIG.sameItemCooldownHours);
  if(!items.length)return null;
  const weighted=items.map(item=>{const relevance=item.areas?.some(area=>relatedAreas.includes(area))?5:0;const unseen=history.items?.[item.id]?.shownCount?0:4;const openable=item.url&&item.status==='available'?2:0;return{item,score:(item.priority||1)+relevance+unseen+openable+Math.random()}}).sort((a,b)=>b.score-a.score);
  return weighted[0].item;
}
function update(itemId,action){
  const history=getRecommendationHistory(),session=sessionState(),item=history.items[itemId]||{shownCount:0,openedCount:0};const at=new Date().toISOString();
  if(action==='shown'){item.lastShownAt=at;item.shownCount=(item.shownCount||0)+1;session.shown=(session.shown||0)+1;history.recentShownAt=[...(history.recentShownAt||[]).filter(value=>hoursSince(value)<24),at]}
  if(action==='closed')item.lastClosedAt=at;
  if(action==='opened'){item.lastOpenedAt=at;item.openedCount=(item.openedCount||0)+1;session.opened=[...(session.opened||[]),itemId]}
  history.items={...(history.items||{}),[itemId]:item};saveRecommendationHistory(history);saveSession(session);return history;
}
export function recordRecommendationShown(id){return update(id,'shown')}
export function recordRecommendationClosed(id){return update(id,'closed')}
export function recordRecommendationOpened(id){return update(id,'opened')}
export function snoozeRecommendations(minutes=CROSS_PROMOTION_CONFIG.snoozeMinutes){const history=getRecommendationHistory();history.snoozedUntil=new Date(Date.now()+minutes*60000).toISOString();saveRecommendationHistory(history);return history}
