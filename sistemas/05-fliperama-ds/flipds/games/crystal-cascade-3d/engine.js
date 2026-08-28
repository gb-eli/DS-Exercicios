(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports) module.exports=api;
  root.CrystalCascadeEngine=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  const COLOR_NAMES=['cyan','amber','emerald','violet','rose','azure'];
  const SPECIAL={ROW:'row',COL:'col',BOMB:'bomb'};
  function mulberry32(seed){let a=seed>>>0;return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
  class Engine{
    constructor(level,seed=1){this.level=JSON.parse(JSON.stringify(level));this.rows=8;this.cols=8;this.colors=6;this.rng=mulberry32(seed||1);this.reset();}
    reset(){this.moves=this.level.moves;this.score=0;this.combo=0;this.status='playing';this.collected=Object.fromEntries(COLOR_NAMES.map(n=>[n,0]));this.board=[];this.blockers=new Map();for(const group of this.level.blockers||[])for(const i of group.cells||[])this.blockers.set(i,group.type==='ice'?1:1);this.board=this.makeBoard();this.ensureMove();}
    cell(color,special=null){return {color,special};}
    makeBoard(){const b=Array(this.rows*this.cols);for(let i=0;i<b.length;i++){let choices=[0,1,2,3,4,5];const r=Math.floor(i/this.cols),c=i%this.cols;if(c>=2&&b[i-1]?.color===b[i-2]?.color)choices=choices.filter(x=>x!==b[i-1].color);if(r>=2&&b[i-this.cols]?.color===b[i-2*this.cols]?.color)choices=choices.filter(x=>x!==b[i-this.cols].color);b[i]=this.cell(choices[Math.floor(this.rng()*choices.length)]);}return b;}
    adjacent(a,b){const ar=Math.floor(a/8),ac=a%8,br=Math.floor(b/8),bc=b%8;return Math.abs(ar-br)+Math.abs(ac-bc)===1;}
    swapRaw(a,b){[this.board[a],this.board[b]]=[this.board[b],this.board[a]];}
    findMatches(){const groups=[];const seen=new Set();for(let r=0;r<8;r++){let s=0;for(let c=1;c<=8;c++){const same=c<8&&this.board[r*8+c]&&this.board[r*8+s]&&this.board[r*8+c].color===this.board[r*8+s].color;if(!same){if(c-s>=3)groups.push(Array.from({length:c-s},(_,k)=>r*8+s+k));s=c;}}}for(let c=0;c<8;c++){let s=0;for(let r=1;r<=8;r++){const same=r<8&&this.board[r*8+c]&&this.board[s*8+c]&&this.board[r*8+c].color===this.board[s*8+c].color;if(!same){if(r-s>=3)groups.push(Array.from({length:r-s},(_,k)=>(s+k)*8+c));s=r;}}}const indices=[];for(const g of groups)for(const i of g)if(!seen.has(i)){seen.add(i);indices.push(i);}return {groups,indices};}
    hasValidMove(){for(let i=0;i<64;i++){for(const j of [i+1,i+8]){if(j>=64||!this.adjacent(i,j))continue;this.swapRaw(i,j);const ok=this.findMatches().indices.length>0;this.swapRaw(i,j);if(ok)return true;}}return false;}
    ensureMove(){let guard=0;while(!this.hasValidMove()&&guard++<20){for(let i=63;i>0;i--){const j=Math.floor(this.rng()*(i+1));this.swapRaw(i,j);}if(this.findMatches().indices.length){this.board=this.makeBoard();}}return this.hasValidMove();}
    activateSpecial(index,clear){const p=this.board[index];if(!p?.special)return;const r=Math.floor(index/8),c=index%8;if(p.special===SPECIAL.ROW)for(let x=0;x<8;x++)clear.add(r*8+x);if(p.special===SPECIAL.COL)for(let y=0;y<8;y++)clear.add(y*8+c);if(p.special===SPECIAL.BOMB)for(let y=Math.max(0,r-1);y<=Math.min(7,r+1);y++)for(let x=Math.max(0,c-1);x<=Math.min(7,c+1);x++)clear.add(y*8+x);}
    resolveMatches(preferred=-1){let cascades=0,totalCleared=0,createdSpecials=[];while(true){const m=this.findMatches();if(!m.indices.length)break;cascades++;const clear=new Set(m.indices);for(const i of [...clear])this.activateSpecial(i,clear);let specialAt=-1,specialType=null;for(const g of m.groups){if(g.length>=5){specialType=SPECIAL.BOMB;specialAt=g.includes(preferred)?preferred:g[Math.floor(g.length/2)];break;}if(g.length===4&&!specialType){const horizontal=Math.floor(g[0]/8)===Math.floor(g[1]/8);specialType=horizontal?SPECIAL.ROW:SPECIAL.COL;specialAt=g.includes(preferred)?preferred:g[1];}}
      if(specialAt>=0)clear.delete(specialAt);
      for(const i of clear){const p=this.board[i];if(p){this.collected[COLOR_NAMES[p.color]]++;totalCleared++;this.score+=100*cascades;if(this.blockers.has(i)){this.blockers.delete(i);this.score+=120;}}this.board[i]=null;}
      if(specialAt>=0&&this.board[specialAt]){this.board[specialAt].special=specialType;createdSpecials.push({index:specialAt,type:specialType});}
      for(let c=0;c<8;c++){let write=7;for(let r=7;r>=0;r--){const i=r*8+c;if(this.board[i]){const w=write*8+c;this.board[w]=this.board[i];if(w!==i)this.board[i]=null;write--;}}while(write>=0){this.board[write*8+c]=this.cell(Math.floor(this.rng()*this.colors));write--;}}
    }
    this.combo=Math.max(this.combo,cascades);this.score+=Math.max(0,cascades-1)*250;this.ensureMove();return {cascades,totalCleared,createdSpecials};}
    goalsMet(){if(this.score<this.level.targetScore)return false;if(this.blockers.size>0)return false;for(const [name,count] of Object.entries(this.level.collect||{}))if((this.collected[name]||0)<count)return false;return true;}
    swap(a,b){if(this.status!=='playing'||this.moves<=0||!this.adjacent(a,b))return {ok:false,reason:'invalid'};const specialA=this.board[a]?.special,specialB=this.board[b]?.special;this.swapRaw(a,b);let m=this.findMatches();if(!m.indices.length&&!specialA&&!specialB){this.swapRaw(a,b);return {ok:false,reason:'no-match'};}this.moves--;let result;if(specialA||specialB){const clear=new Set([a,b]);this.activateSpecial(a,clear);this.activateSpecial(b,clear);for(const i of clear){const p=this.board[i];if(p){this.collected[COLOR_NAMES[p.color]]++;this.score+=120;if(this.blockers.has(i)){this.blockers.delete(i);this.score+=120;}}this.board[i]=null;}for(let c=0;c<8;c++){let vals=[];for(let r=7;r>=0;r--){const p=this.board[r*8+c];if(p)vals.push(p);}for(let r=7;r>=0;r--)this.board[r*8+c]=vals[7-r]||this.cell(Math.floor(this.rng()*this.colors));}result=this.resolveMatches(b);result.specialActivated=true;}else result=this.resolveMatches(b);
      if(this.goalsMet())this.status='victory';else if(this.moves<=0)this.status='defeat';return {ok:true,...result,status:this.status};}
    stars(){if(this.status!=='victory')return 0;const ratio=this.moves/Math.max(1,this.level.moves);return ratio>=.35&&this.combo>=2?3:ratio>=.15?2:1;}
    snapshot(){return {schemaVersion:1,moves:this.moves,score:this.score,combo:this.combo,status:this.status,collected:{...this.collected},board:this.board.map(p=>p?{...p}:null),blockers:[...this.blockers.entries()]};}
    restore(s){if(!s||!Array.isArray(s.board)||s.board.length!==64)return false;this.moves=s.moves;this.score=s.score;this.combo=s.combo||0;this.status=s.status||'playing';this.collected={...this.collected,...s.collected};this.board=s.board.map(p=>p?{...p}:null);this.blockers=new Map(s.blockers||[]);return true;}
  }
  return {Engine,COLOR_NAMES,SPECIAL};
});
