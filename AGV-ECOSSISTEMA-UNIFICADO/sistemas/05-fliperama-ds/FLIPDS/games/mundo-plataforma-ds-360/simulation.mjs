const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
const dist2=(a,b)=>(a.x-b.x)**2+(a.z-b.z)**2;
const copy3=a=>({x:Number(a?.[0])||0,y:Number(a?.[1])||0,z:Number(a?.[2])||0});
const pointInXZBox=(x,z,box,pad=0)=>Math.abs(x-box.position[0])<=box.size[0]/2+pad&&Math.abs(z-box.position[2])<=box.size[2]/2+pad;
const pointIn3DBox=(p,box,padXZ=0,padY=.45)=>pointInXZBox(p.x,p.z,box,padXZ)&&Math.abs(p.y-box.position[1])<=box.size[1]/2+padY;
const cloneCheckpoint=(cp,fallback)=>({id:String(cp?.id||'spawn'),position:Array.isArray(cp?.position)?cp.position.map(Number):[...fallback]});

export class Mundo360Simulation{
  constructor(source){
    this.worldMode=!!source?.regions;
    this.regions=this.worldMode?source.regions:[source];
    this.radius=.42;this.height=1.45;this.gravity=18.8;this.jumpSpeed=7.6;this.speed=6.0;
    this.resetAll();
  }
  resetAll(){
    this.time=0;this.lives=3;this.score=0;this.completed=false;this.invulnerable=0;this.events=[];this.regionIndex=0;this.regionProgress={};this.valeCompleted=false;this.villageCompleted=false;this.forestCompleted=false;this.industrialCompleted=false;
    this.quest={stage:0,talked:new Set(),activated:new Set(),relays:new Set(),uploaded:false,forestNodes:new Set(),industrialStage:0,industrialPower:new Set(),cargoRoutes:new Set(),controlSynced:false,towerStage:0,towerSync:new Set(),towerCore:false};
    this.#loadRegion(0,false);
  }
  #blankProgress(region){return{collected:new Set(),beacons:new Set(),checkpoint:{id:'spawn',position:[...region.spawn]}}}
  #storeRegion(){if(!this.region)return;this.regionProgress[this.region.id]={collected:new Set(this.collected||[]),beacons:new Set(this.beacons||[]),checkpoint:cloneCheckpoint(this.checkpoint,this.region.spawn)};}
  #loadRegion(index,store=true){
    if(store&&this.region)this.#storeRegion();
    this.regionIndex=clamp(index,0,this.regions.length-1);this.region=this.regions[this.regionIndex];
    const saved=this.regionProgress[this.region.id]||this.#blankProgress(this.region);
    this.collected=new Set(saved.collected);this.beacons=new Set(saved.beacons);this.checkpoint=cloneCheckpoint(saved.checkpoint,this.region.spawn);
    this.moving=(this.region.movingPlatforms||[]).map((p,i)=>({...p,current:[...p.position],last:[...p.position],phase:Number.isFinite(p.phase)?p.phase:i*.9}));
    this.enemies=(this.region.enemies||[]).map((e,i)=>({...e,current:[...e.position],phase:Number.isFinite(e.phase)?e.phase:i*.7}));
    const start=this.checkpoint.id==='spawn'?this.region.spawn:this.checkpoint.position;
    this.player={pos:copy3(start),vel:{x:0,y:0,z:0},grounded:false,coyote:0,jumpBuffer:0};
    this.invulnerable=1.0;
  }
  snapshot(){
    if(!this.worldMode)return{schemaVersion:1,lives:this.lives,score:this.score,collected:[...this.collected],beacons:[...this.beacons],checkpoint:this.checkpoint,completed:this.completed,player:{position:[this.player.pos.x,this.player.pos.y,this.player.pos.z]}};
    this.#storeRegion();
    const regionProgress={};
    for(const [id,p] of Object.entries(this.regionProgress))regionProgress[id]={collected:[...p.collected],beacons:[...p.beacons],checkpoint:p.checkpoint};
    return{schemaVersion:5,lives:this.lives,score:this.score,activeRegion:this.regionIndex,valeCompleted:this.valeCompleted,villageCompleted:this.villageCompleted,forestCompleted:this.forestCompleted,industrialCompleted:this.industrialCompleted,regionProgress,quest:{stage:this.quest.stage,talked:[...this.quest.talked],activated:[...this.quest.activated],relays:[...this.quest.relays],uploaded:this.quest.uploaded,forestNodes:[...this.quest.forestNodes],industrialStage:this.quest.industrialStage,industrialPower:[...this.quest.industrialPower],cargoRoutes:[...this.quest.cargoRoutes],controlSynced:this.quest.controlSynced,towerStage:this.quest.towerStage,towerSync:[...this.quest.towerSync],towerCore:this.quest.towerCore},completed:this.completed,player:{position:[this.player.pos.x,this.player.pos.y,this.player.pos.z]}};
  }
  restore(s){
    if(!s)return false;
    if(!this.worldMode){
      if(s.schemaVersion!==1)return false;this.lives=clamp(Number(s.lives)||3,1,9);this.score=Math.max(0,Number(s.score)||0);this.collected=new Set((s.collected||[]).filter(id=>(this.region.collectibles||[]).some(c=>c.id===id)));this.beacons=new Set((s.beacons||[]).filter(id=>(this.region.beacons||[]).some(b=>b.id===id)));if(s.checkpoint&&Array.isArray(s.checkpoint.position)&&s.checkpoint.position.length===3)this.checkpoint=cloneCheckpoint(s.checkpoint,this.region.spawn);this.completed=!!s.completed;const start=Array.isArray(s.player?.position)&&s.player.position.length===3?s.player.position:this.checkpoint.position;this.player.pos=copy3(start);this.player.vel={x:0,y:0,z:0};return true;
    }
    this.lives=clamp(Number(s.lives)||3,1,9);this.score=Math.max(0,Number(s.score)||0);this.completed=!!s.completed;
    if(s.schemaVersion===1){
      const vale=this.regions[0];this.regionProgress[vale.id]={collected:new Set((s.collected||[]).filter(id=>(vale.collectibles||[]).some(c=>c.id===id))),beacons:new Set((s.beacons||[]).filter(id=>(vale.beacons||[]).some(b=>b.id===id))),checkpoint:cloneCheckpoint(s.checkpoint,vale.spawn)};
      if(s.completed){this.completed=false;this.valeCompleted=true;this.quest.stage=0;this.#loadRegion(Math.min(1,this.regions.length-1),false);this.events.push({type:'migration',fromSchema:1,toSchema:5,region:this.regionIndex+1});}
      else{this.valeCompleted=false;this.#loadRegion(0,false);if(Array.isArray(s.player?.position)&&s.player.position.length===3)this.player.pos=copy3(s.player.position);}
      return true;
    }
    if(s.schemaVersion===2){
      this.valeCompleted=!!s.valeCompleted;this.villageCompleted=!!s.completed&&this.regions.length>2;this.completed=this.regions.length>2?false:!!s.completed;
      for(const region of this.regions){const rp=s.regionProgress?.[region.id];if(!rp)continue;this.regionProgress[region.id]={collected:new Set((rp.collected||[]).filter(id=>(region.collectibles||[]).some(c=>c.id===id))),beacons:new Set((rp.beacons||[]).filter(id=>(region.beacons||[]).some(b=>b.id===id))),checkpoint:cloneCheckpoint(rp.checkpoint,region.spawn)};}
      this.quest={stage:clamp(Number(s.quest?.stage)||0,0,9),talked:new Set(s.quest?.talked||[]),activated:new Set(s.quest?.activated||[]),relays:new Set(s.quest?.relays||[]),uploaded:!!s.quest?.uploaded,forestNodes:new Set(),industrialStage:0,industrialPower:new Set(),cargoRoutes:new Set(),controlSynced:false,towerStage:0,towerSync:new Set(),towerCore:false};
      const target=this.villageCompleted?Math.min(2,this.regions.length-1):clamp(Number(s.activeRegion)||0,0,this.regions.length-1);this.#loadRegion(target,false);
      if(!this.villageCompleted&&Array.isArray(s.player?.position)&&s.player.position.length===3)this.player.pos=copy3(s.player.position);
      this.events.push({type:'migration',fromSchema:2,toSchema:5,region:this.regionIndex+1});return true;
    }
    if(s.schemaVersion===3){
      this.valeCompleted=!!s.valeCompleted;this.villageCompleted=!!s.villageCompleted;this.forestCompleted=!!s.completed&&this.regions.length>3;this.completed=this.regions.length>3?false:!!s.completed;
      for(const region of this.regions){const rp=s.regionProgress?.[region.id];if(!rp)continue;this.regionProgress[region.id]={collected:new Set((rp.collected||[]).filter(id=>(region.collectibles||[]).some(c=>c.id===id))),beacons:new Set((rp.beacons||[]).filter(id=>(region.beacons||[]).some(b=>b.id===id))),checkpoint:cloneCheckpoint(rp.checkpoint,region.spawn)};}
      this.quest={stage:clamp(Number(s.quest?.stage)||0,0,9),talked:new Set(s.quest?.talked||[]),activated:new Set(s.quest?.activated||[]),relays:new Set(s.quest?.relays||[]),uploaded:!!s.quest?.uploaded,forestNodes:new Set((s.quest?.forestNodes||[]).filter(id=>this.regions.some(r=>(r.interactables||[]).some(x=>x.type==='energy-node'&&x.id===id)))),industrialStage:0,industrialPower:new Set(),cargoRoutes:new Set(),controlSynced:false,towerStage:0,towerSync:new Set(),towerCore:false};
      const target=this.forestCompleted?Math.min(3,this.regions.length-1):clamp(Number(s.activeRegion)||0,0,this.regions.length-1);this.#loadRegion(target,false);
      if(!this.forestCompleted&&Array.isArray(s.player?.position)&&s.player.position.length===3)this.player.pos=copy3(s.player.position);
      this.events.push({type:'migration',fromSchema:3,toSchema:5,region:this.regionIndex+1});return true;
    }
    if(s.schemaVersion===4){
      this.valeCompleted=!!s.valeCompleted;this.villageCompleted=!!s.villageCompleted;this.forestCompleted=!!s.forestCompleted;this.industrialCompleted=!!s.completed&&this.regions.length>4;this.completed=this.regions.length>4?false:!!s.completed;
      for(const region of this.regions){const rp=s.regionProgress?.[region.id];if(!rp)continue;this.regionProgress[region.id]={collected:new Set((rp.collected||[]).filter(id=>(region.collectibles||[]).some(c=>c.id===id))),beacons:new Set((rp.beacons||[]).filter(id=>(region.beacons||[]).some(b=>b.id===id))),checkpoint:cloneCheckpoint(rp.checkpoint,region.spawn)};}
      this.quest={stage:clamp(Number(s.quest?.stage)||0,0,9),talked:new Set(s.quest?.talked||[]),activated:new Set(s.quest?.activated||[]),relays:new Set(s.quest?.relays||[]),uploaded:!!s.quest?.uploaded,forestNodes:new Set((s.quest?.forestNodes||[]).filter(id=>this.regions.some(r=>(r.interactables||[]).some(x=>x.type==='energy-node'&&x.id===id)))),industrialStage:clamp(Number(s.quest?.industrialStage)||0,0,3),industrialPower:new Set((s.quest?.industrialPower||[]).filter(id=>this.regions.some(r=>(r.interactables||[]).some(x=>x.type==='industrial-power'&&x.id===id)))),cargoRoutes:new Set((s.quest?.cargoRoutes||[]).filter(id=>this.regions.some(r=>(r.interactables||[]).some(x=>x.type==='cargo-console'&&x.id===id)))),controlSynced:!!s.quest?.controlSynced,towerStage:0,towerSync:new Set(),towerCore:false};
      const target=this.industrialCompleted?Math.min(4,this.regions.length-1):clamp(Number(s.activeRegion)||0,0,this.regions.length-1);this.#loadRegion(target,false);
      if(!this.industrialCompleted&&Array.isArray(s.player?.position)&&s.player.position.length===3)this.player.pos=copy3(s.player.position);
      this.events.push({type:'migration',fromSchema:4,toSchema:5,region:this.regionIndex+1});return true;
    }
    if(s.schemaVersion!==5)return false;
    this.valeCompleted=!!s.valeCompleted;this.villageCompleted=!!s.villageCompleted;this.forestCompleted=!!s.forestCompleted;this.industrialCompleted=!!s.industrialCompleted;
    for(const region of this.regions){const rp=s.regionProgress?.[region.id];if(!rp)continue;this.regionProgress[region.id]={collected:new Set((rp.collected||[]).filter(id=>(region.collectibles||[]).some(c=>c.id===id))),beacons:new Set((rp.beacons||[]).filter(id=>(region.beacons||[]).some(b=>b.id===id))),checkpoint:cloneCheckpoint(rp.checkpoint,region.spawn)};}
    this.quest={stage:clamp(Number(s.quest?.stage)||0,0,9),talked:new Set(s.quest?.talked||[]),activated:new Set(s.quest?.activated||[]),relays:new Set(s.quest?.relays||[]),uploaded:!!s.quest?.uploaded,forestNodes:new Set((s.quest?.forestNodes||[]).filter(id=>this.regions.some(r=>(r.interactables||[]).some(x=>x.type==='energy-node'&&x.id===id)))),industrialStage:clamp(Number(s.quest?.industrialStage)||0,0,3),industrialPower:new Set((s.quest?.industrialPower||[]).filter(id=>this.regions.some(r=>(r.interactables||[]).some(x=>x.type==='industrial-power'&&x.id===id)))),cargoRoutes:new Set((s.quest?.cargoRoutes||[]).filter(id=>this.regions.some(r=>(r.interactables||[]).some(x=>x.type==='cargo-console'&&x.id===id)))),controlSynced:!!s.quest?.controlSynced,towerStage:clamp(Number(s.quest?.towerStage)||0,0,2),towerSync:new Set((s.quest?.towerSync||[]).filter(id=>this.regions.some(r=>(r.interactables||[]).some(x=>x.type==='tower-sync'&&x.id===id)))),towerCore:!!s.quest?.towerCore};
    this.#loadRegion(clamp(Number(s.activeRegion)||0,0,this.regions.length-1),false);
    if(Array.isArray(s.player?.position)&&s.player.position.length===3)this.player.pos=copy3(s.player.position);
    return true;
  }
  consumeEvents(){const out=this.events;this.events=[];return out;}
  platformRecords(){const ground={id:'ground',position:[0,-.5,0],size:this.region.size};return[ground,...(this.region.platforms||[]),...this.moving.map(m=>({...m,position:m.current}))];}
  updateMoving(dt){this.time+=dt;for(const m of this.moving){m.last=[...m.current];m.current=[...m.position];const offset=Math.sin(this.time*m.speed+m.phase)*m.range;const idx=m.axis==='x'?0:m.axis==='y'?1:2;m.current[idx]=m.position[idx]+offset;}}
  updateEnemies(){for(const e of this.enemies){e.current=[...e.position];const offset=Math.sin(this.time*e.speed+e.phase)*e.range;const idx=e.axis==='x'?0:2;e.current[idx]=e.position[idx]+offset;}}
  topCollision(prevY,newY,x,z){let best=null;for(const p of this.platformRecords()){const top=p.position[1]+p.size[1]/2;if(Math.abs(x-p.position[0])<=p.size[0]/2+this.radius*.75&&Math.abs(z-p.position[2])<=p.size[2]/2+this.radius*.75&&prevY>=top-.12&&newY<=top+.18){if(!best||top>best.top)best={platform:p,top};}}return best;}
  resolveObstacles(nx,nz,oldX,oldZ){let x=nx,z=nz;for(const box of this.region.obstacles||[]){if(pointInXZBox(x,z,box,this.radius)){const xBlocked=pointInXZBox(x,oldZ,box,this.radius),zBlocked=pointInXZBox(oldX,z,box,this.radius);if(xBlocked)x=oldX;if(zBlocked)z=oldZ;if(!xBlocked&&!zBlocked){x=oldX;z=oldZ;}}}return{x,z};}
  damage(reason='hazard'){if(this.invulnerable>0||this.completed)return;this.lives--;this.score=Math.max(0,this.score-175);this.events.push({type:'damage',reason,lives:this.lives,score:this.score});if(this.lives<=0){this.lives=3;this.events.push({type:'continue'});}this.respawn();}
  respawn(){const p=this.checkpoint.position;this.player.pos=copy3(p);this.player.vel={x:0,y:0,z:0};this.player.grounded=false;this.invulnerable=1.4;}
  #near(position,radius=1.8){return dist2(this.player.pos,{x:position[0],z:position[2]})<=radius*radius&&Math.abs(this.player.pos.y-position[1])<2.2;}
  #missionEvent(label,detail={}){this.events.push({type:'mission',stage:this.quest.stage,label,...detail});}
  #dialog(npc,text){this.events.push({type:'dialog',npc,text});}
  interactionHint(){
    if(!['village','forest','industrial','tower'].includes(this.region.kind))return null;
    const candidates=[...(this.region.npcs||[]).map(x=>({...x,kind:'npc'})),...(this.region.interactables||[]).map(x=>({...x,kind:'interactable'}))].filter(x=>this.#near(x.position,2.1));
    if(!candidates.length)return null;candidates.sort((a,b)=>dist2(this.player.pos,{x:a.position[0],z:a.position[2]})-dist2(this.player.pos,{x:b.position[0],z:b.position[2]}));
    return{kind:candidates[0].kind,id:candidates[0].id,name:candidates[0].name};
  }
  #interact(){
    if(!['village','forest','industrial','tower'].includes(this.region.kind))return;
    const hint=this.interactionHint();if(!hint)return;
    if(this.region.kind==='forest'){const item=(this.region.interactables||[]).find(x=>x.id===hint.id);if(!item)return;if(item.type==='energy-node'){if(!this.quest.forestNodes.has(item.id)){this.quest.forestNodes.add(item.id);this.score+=600;this.events.push({type:'forest-node',id:item.id,name:item.name,count:this.quest.forestNodes.size});this.#missionEvent(this.quest.forestNodes.size>=3?'Três Nós restaurados · retorne ao Portal-Raiz':`Nó restaurado (${this.quest.forestNodes.size}/3)`);}else this.events.push({type:'notice',text:'Este Nó de Energia já está restaurado.'});}return;}
    if(this.region.kind==='industrial'){const item=(this.region.interactables||[]).find(x=>x.id===hint.id);if(!item)return;if(item.type==='industrial-power'){if(this.quest.industrialStage>0){this.events.push({type:'notice',text:'A alimentação principal já está estabilizada.'});return;}if(!this.quest.industrialPower.has(item.id)){this.quest.industrialPower.add(item.id);this.score+=420;this.events.push({type:'industrial-power',id:item.id,name:item.name,count:this.quest.industrialPower.size});if(this.quest.industrialPower.size>=3){this.quest.industrialStage=1;this.#missionEvent('Energia estabilizada · direcione as três cargas');}}return;}if(item.type==='cargo-console'){if(this.quest.industrialStage<1){this.events.push({type:'notice',text:'Estabilize os três Painéis de Energia antes da logística.'});return;}if(this.quest.industrialStage>1){this.events.push({type:'notice',text:'Esta carga já foi processada.'});return;}if(!this.quest.cargoRoutes.has(item.id)){this.quest.cargoRoutes.add(item.id);this.score+=480;this.events.push({type:'cargo-route',id:item.id,name:item.name,count:this.quest.cargoRoutes.size});if(this.quest.cargoRoutes.size>=3){this.quest.industrialStage=2;this.#missionEvent('Logística concluída · suba à Sala de Controle');}}return;}if(item.type==='control-console'){if(this.quest.industrialStage===2&&this.quest.cargoRoutes.size>=3){this.quest.controlSynced=true;this.quest.industrialStage=3;this.score+=1100;this.events.push({type:'industrial-control',name:item.name});this.#missionEvent('Controle sincronizado · Portal Industrial liberado');}else this.events.push({type:'notice',text:'O Console Mestre exige energia e três cargas processadas.'});return;}return;}
    if(this.region.kind==='tower'){const item=(this.region.interactables||[]).find(x=>x.id===hint.id);if(!item)return;if(item.type==='tower-sync'){if(this.quest.towerCore){this.events.push({type:'notice',text:'A Torre Central já está sincronizada.'});return;}if(!this.quest.towerSync.has(item.id)){this.quest.towerSync.add(item.id);this.score+=650;this.events.push({type:'tower-sync',id:item.id,name:item.name,count:this.quest.towerSync.size});if(this.quest.towerSync.size>=3){this.quest.towerStage=1;this.#missionEvent('Três níveis sincronizados · alcance o Núcleo Central');}}else this.events.push({type:'notice',text:'Este console já está sincronizado.'});return;}if(item.type==='tower-core'){if(this.quest.towerSync.size>=3){this.quest.towerCore=true;this.quest.towerStage=2;this.score+=1800;this.events.push({type:'tower-core',name:item.name});this.#missionEvent('Núcleo Central ativo · Portal de Conclusão liberado');}else this.events.push({type:'notice',text:'O Núcleo Central exige os três consoles de sincronização.'});return;}return;}
    if(hint.kind==='npc'){
      if(hint.id==='lia'){
        if(this.quest.stage===0){this.quest.talked.add('lia-intro');this.quest.stage=1;this.#dialog('Lia','A oficina perdeu sincronismo. Ative os três módulos internos e volte aqui.');this.#missionEvent('Oficina em Sincronia');return;}
        if(this.quest.stage===2){this.quest.talked.add('lia-done');this.quest.stage=3;this.score+=500;this.#dialog('Lia','Ótimo. A oficina voltou. Ivo precisa de ajuda na Estação de Dados.');this.#missionEvent('Missão 1 concluída',{mission:1});return;}
        this.#dialog('Lia',this.quest.stage<2?'Os três módulos da oficina ainda precisam ser ativados.':'A oficina está estável. Procure Ivo ou siga a missão atual.');return;
      }
      if(hint.id==='ivo'){
        if(this.quest.stage===3){this.quest.talked.add('ivo-intro');this.quest.stage=4;this.#dialog('Ivo','Quatro pacotes escaparam pela vila. Recupere todos e use o terminal de upload.');this.#missionEvent('Pacotes Perdidos');return;}
        this.#dialog('Ivo',this.quest.stage<3?'Lia ainda precisa concluir a manutenção da oficina.':this.quest.stage<6?'Recupere os quatro pacotes e finalize o upload.':'Os dados estão íntegros. Dara coordena a última etapa.');return;
      }
      if(hint.id==='dara'){
        if(this.quest.stage===6){this.quest.talked.add('dara-intro');this.quest.stage=7;this.#dialog('Dara','Ative os três relés externos. Depois sincronize o Núcleo da Vila no Centro de Rede.');this.#missionEvent('Rede da Vila');return;}
        this.#dialog('Dara',this.quest.stage<6?'A rede central aguarda a recuperação da Estação de Dados.':this.quest.stage<9?'Complete os relés e o Núcleo da Vila.':'O Portal de Continuidade está liberado ao norte.');return;
      }
    }
    const item=(this.region.interactables||[]).find(x=>x.id===hint.id);if(!item)return;
    if(item.type==='repair'){
      if(this.quest.stage!==1){this.events.push({type:'notice',text:'Este módulo não precisa de ajuste agora.'});return;}
      if(!this.quest.activated.has(item.id)){this.quest.activated.add(item.id);this.score+=180;this.events.push({type:'activate',id:item.id,name:item.name});if(this.quest.activated.size>=3){this.quest.stage=2;this.#missionEvent('Retorne à Lia');}}return;
    }
    if(item.type==='data-terminal'){
      if(this.quest.stage===5&&this.collected.size>=4){this.quest.uploaded=true;this.quest.stage=6;this.score+=650;this.events.push({type:'upload',name:item.name});this.#missionEvent('Missão 2 concluída',{mission:2});}else this.events.push({type:'notice',text:'O terminal aguarda os quatro pacotes de dados.'});return;
    }
    if(item.type==='relay'){
      if(this.quest.stage!==7){this.events.push({type:'notice',text:'Os relés ainda não estão liberados para sincronização.'});return;}
      if(!this.quest.relays.has(item.id)){this.quest.relays.add(item.id);this.score+=240;this.events.push({type:'activate',id:item.id,name:item.name});if(this.quest.relays.size>=3){this.quest.stage=8;this.#missionEvent('Sincronize o Núcleo da Vila');}}return;
    }
    if(item.type==='core'){
      if(this.quest.stage===8&&this.quest.relays.size>=3){this.quest.stage=9;this.score+=900;this.events.push({type:'core',name:item.name});this.#missionEvent('Portal de Continuidade liberado');}else this.events.push({type:'notice',text:'O Núcleo exige os três relés sincronizados.'});
    }
  }
  portalOpen(){if(!this.worldMode)return this.collected.size===(this.region.collectibles||[]).length&&this.beacons.size===(this.region.beacons||[]).length;if(this.regionIndex===0)return this.collected.size===(this.region.collectibles||[]).length&&this.beacons.size===(this.region.beacons||[]).length;if(this.region.kind==='village')return this.quest.stage>=9;if(this.region.kind==='forest')return this.quest.forestNodes.size>=(this.region.interactables||[]).filter(x=>x.type==='energy-node').length;if(this.region.kind==='industrial')return this.quest.industrialStage>=3&&this.quest.controlSynced;if(this.region.kind==='tower')return this.quest.towerCore&&this.quest.towerSync.size>=(this.region.interactables||[]).filter(x=>x.type==='tower-sync').length;return false;}
  tick(dt,input={}){
    if(this.completed)return;dt=Math.min(.04,Math.max(0,dt||0));this.updateMoving(dt);this.updateEnemies();this.invulnerable=Math.max(0,this.invulnerable-dt);const p=this.player;const mx=clamp(Number(input.x)||0,-1,1),mz=clamp(Number(input.z)||0,-1,1);const len=Math.hypot(mx,mz)||1;p.vel.x=mx/len*this.speed;p.vel.z=mz/len*this.speed;if(input.jump)p.jumpBuffer=.1;p.jumpBuffer=Math.max(0,p.jumpBuffer-dt);p.coyote=Math.max(0,p.coyote-dt);if(p.grounded)p.coyote=.12;if(p.jumpBuffer>0&&p.coyote>0){p.vel.y=this.jumpSpeed;p.grounded=false;p.coyote=0;p.jumpBuffer=0;this.events.push({type:'jump'});}p.vel.y-=this.gravity*dt;const prevY=p.pos.y,oldX=p.pos.x,oldZ=p.pos.z;const boundsX=this.region.size[0]/2-.7,boundsZ=this.region.size[2]/2-.7;let nx=clamp(oldX+p.vel.x*dt,-boundsX,boundsX),nz=clamp(oldZ+p.vel.z*dt,-boundsZ,boundsZ);({x:nx,z:nz}=this.resolveObstacles(nx,nz,oldX,oldZ));p.pos.x=nx;p.pos.z=nz;const ny=p.pos.y+p.vel.y*dt;const hit=p.vel.y<=0?this.topCollision(prevY,ny,nx,nz):null;if(hit){p.pos.y=hit.top;p.vel.y=0;p.grounded=true;const moving=this.moving.find(m=>m.id===hit.platform.id);if(moving){p.pos.x+=moving.current[0]-moving.last[0];p.pos.y+=moving.current[1]-moving.last[1];p.pos.z+=moving.current[2]-moving.last[2];}}else{p.pos.y=ny;p.grounded=false;}if(p.pos.y<-6)this.damage('fall');
    if(p.grounded)for(const belt of this.region.conveyors||[]){if(pointInXZBox(p.pos.x,p.pos.z,belt,.05)&&p.pos.y<1.25){const dx=(Number(belt.direction?.[0])||0)*(Number(belt.speed)||0)*dt,dz=(Number(belt.direction?.[1])||0)*(Number(belt.speed)||0)*dt;const bx=clamp(p.pos.x+dx,-boundsX,boundsX),bz=clamp(p.pos.z+dz,-boundsZ,boundsZ);const moved=this.resolveObstacles(bx,bz,p.pos.x,p.pos.z);p.pos.x=moved.x;p.pos.z=moved.z;}}
    for(const h of this.region.hazards||[]){if(pointIn3DBox(p.pos,h,.05,.45))this.damage('glitch-field');}
    for(const e of this.enemies){const ep={x:e.current[0],z:e.current[2]};if(dist2(p.pos,ep)<1.35**2&&Math.abs(p.pos.y-e.current[1])<1.8)this.damage('patrol');}
    const canCollect=this.region.kind!=='village'||this.quest.stage===4;
    if(canCollect)for(const c of this.region.collectibles||[]){if(this.collected.has(c.id))continue;const cp={x:c.position[0],z:c.position[2]};if(dist2(p.pos,cp)<1.15**2&&Math.abs(p.pos.y-c.position[1])<1.7){this.collected.add(c.id);this.score+=350;this.events.push({type:'collect',id:c.id,name:c.name,score:this.score});if(this.region.kind==='village'&&this.collected.size===(this.region.collectibles||[]).length){this.quest.stage=5;this.#missionEvent('Envie os pacotes no Terminal de Upload');}}}
    for(const b of this.region.beacons||[]){if(this.beacons.has(b.id))continue;const bp={x:b.position[0],z:b.position[2]};if(dist2(p.pos,bp)<1.4**2&&Math.abs(p.pos.y-b.position[1])<1.9){this.beacons.add(b.id);this.score+=500;this.events.push({type:'beacon',id:b.id,name:b.name,score:this.score});}}
    for(const cp of this.region.checkpoints||[]){const q={x:cp.position[0],z:cp.position[2]};if(dist2(p.pos,q)<1.3**2&&Math.abs(p.pos.y-cp.position[1])<1.6&&this.checkpoint.id!==cp.id){this.checkpoint={id:cp.id,position:[...cp.position]};this.score+=125;this.events.push({type:'checkpoint',id:cp.id,score:this.score});}}
    if(input.interact)this.#interact();
    const po={x:this.region.portal.position[0],z:this.region.portal.position[2]};if(this.portalOpen()&&dist2(p.pos,po)<1.75**2&&Math.abs(p.pos.y-this.region.portal.position[1])<2.2){
      if(this.worldMode&&this.regionIndex<this.regions.length-1){if(this.regionIndex===0)this.valeCompleted=true;if(this.region.kind==='village'){this.villageCompleted=true;this.events.push({type:'mission-complete',mission:3,label:'Rede da Vila'});}if(this.region.kind==='forest'){this.forestCompleted=true;this.events.push({type:'mission-complete',mission:1,label:'Restauração dos Nós de Energia'});}if(this.region.kind==='industrial'){this.industrialCompleted=true;this.events.push({type:'mission-complete',mission:1,label:'Fluxo Industrial'});}this.score+=1200;this.#storeRegion();this.#loadRegion(this.regionIndex+1,false);this.events.push({type:'region-change',region:this.regionIndex+1,totalRegions:this.regions.length,name:this.region.name});}
      else{this.completed=true;this.score+=2200;if(this.worldMode&&this.region.kind==='tower')this.events.push({type:'mission-complete',mission:1,label:'Convergência Central'});else if(this.worldMode&&this.region.kind==='industrial')this.events.push({type:'mission-complete',mission:1,label:'Fluxo Industrial'});else if(this.worldMode&&this.region.kind==='forest')this.events.push({type:'mission-complete',mission:1,label:'Restauração dos Nós de Energia'});this.events.push({type:'victory',score:this.score,region:this.regionIndex+1,totalRegions:this.regions.length});}
    }
  }
  objective(){
    if(!this.worldMode||this.regionIndex===0){const remO=(this.region.collectibles||[]).length-this.collected.size,remB=(this.region.beacons||[]).length-this.beacons.size;return this.portalOpen()?'Portal Nexus liberado — retorne ao centro do Vale.':`Sincronize ${remO} orbe(s) e ${remB} baliza(s). Explore todas as direções.`;}
    if(this.region.kind==='tower'){const sync=this.quest.towerSync.size;if(this.quest.towerStage===0)return `Suba pela Torre Central e sincronize os consoles de nível (${sync}/3). Use elevadores e plataformas externas.`;if(this.quest.towerStage===1)return 'Alcance a Coroa da Torre e ative o Núcleo Central.';return 'Núcleo Central ativo — atravesse o Portal de Conclusão no topo.';}
    if(this.region.kind==='industrial'){const power=this.quest.industrialPower.size,cargo=this.quest.cargoRoutes.size;if(this.quest.industrialStage===0)return `Estabilize os Painéis de Energia (${power}/3). Cruze docas, esteiras e elevadores industriais.`;if(this.quest.industrialStage===1)return `Direcione as cargas pelos consoles logísticos (${cargo}/3). Observe o sentido das esteiras.`;if(this.quest.industrialStage===2)return 'Suba à Sala de Controle e sincronize o Console Mestre.';return 'Portal Industrial liberado — atravesse-o ao norte da Sala de Controle.';}
    if(this.region.kind==='forest'){const nodes=this.quest.forestNodes.size;return this.portalOpen()?'Três Nós restaurados — atravesse o Portal-Raiz ao norte.':`Restaure os Nós de Energia (${nodes}/3). Explore as trilhas ramificadas e use os elevadores da copa.`;}
    const repairs=this.quest.activated.size,relays=this.quest.relays.size,data=this.collected.size;
    return[
      'Fale com Lia na entrada da Oficina de Manutenção.',
      `Ative os módulos da oficina (${repairs}/3). Use E / INTERAGIR.`,
      'Retorne à Lia para concluir a manutenção.',
      'Fale com Ivo na entrada da Estação de Dados.',
      `Recupere os pacotes de dados espalhados pela vila (${data}/4).`,
      'Entre na Estação de Dados e use o Terminal de Upload.',
      'Fale com Dara na Praça de Conexão.',
      `Ative os relés externos da vila (${relays}/3).`,
      'Entre no Centro de Rede e sincronize o Núcleo da Vila.',
      'Portal de Continuidade liberado — atravesse-o ao norte do Centro de Rede.'
    ][this.quest.stage]||'Explore a Vila Tecnológica.';
  }
  progress(){
    const base={region:this.regionIndex+1,totalRegions:this.regions.length,lives:this.lives,score:this.score,checkpoint:this.checkpoint.id,completed:this.completed,regionId:this.region.id,regionName:this.region.name};
    if(this.region.kind==='village')return{...base,mission:Math.min(3,this.quest.stage<3?1:this.quest.stage<6?2:3),missionStage:this.quest.stage,data:this.collected.size,totalData:(this.region.collectibles||[]).length,repairs:this.quest.activated.size,totalRepairs:3,relays:this.quest.relays.size,totalRelays:3,portalOpen:this.portalOpen()};
    if(this.region.kind==='forest')return{...base,nodes:this.quest.forestNodes.size,totalNodes:(this.region.interactables||[]).filter(x=>x.type==='energy-node').length,mission:1,portalOpen:this.portalOpen()};
    if(this.region.kind==='industrial')return{...base,industrialStage:this.quest.industrialStage,power:this.quest.industrialPower.size,totalPower:3,cargo:this.quest.cargoRoutes.size,totalCargo:3,controlSynced:this.quest.controlSynced,mission:1,portalOpen:this.portalOpen()};
    if(this.region.kind==='tower')return{...base,towerStage:this.quest.towerStage,sync:this.quest.towerSync.size,totalSync:(this.region.interactables||[]).filter(x=>x.type==='tower-sync').length,towerCore:this.quest.towerCore,mission:1,portalOpen:this.portalOpen()};
    return{...base,orbs:this.collected.size,totalOrbs:(this.region.collectibles||[]).length,beacons:this.beacons.size,totalBeacons:(this.region.beacons||[]).length,portalOpen:this.portalOpen()};
  }
}
