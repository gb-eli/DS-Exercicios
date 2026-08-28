(function(global){'use strict';
const FILES='abcdefgh';
const START_FEN='rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
const KNIGHT=[[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
const KING=[[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
const ORTH=[[-1,0],[1,0],[0,-1],[0,1]],DIAG=[[-1,-1],[-1,1],[1,-1],[1,1]];
const color=p=>p?(p===p.toUpperCase()?'w':'b'):null, type=p=>p?.toLowerCase();
const rc=i=>[Math.floor(i/8),i%8], idx=(r,c)=>r*8+c, inside=(r,c)=>r>=0&&r<8&&c>=0&&c<8;
const sqName=i=>FILES[i%8]+(8-Math.floor(i/8));
const sqIndex=s=>{if(!/^[a-h][1-8]$/.test(s))return -1;return (8-Number(s[1]))*8+FILES.indexOf(s[0]);};
function cloneMove(m){return m?{...m}:m}
class ChessEngine{
  constructor(fen=START_FEN){this.loadFEN(fen)}
  loadFEN(fen){const [placement,turn='w',castling='-',ep='-',half='0',full='1']=String(fen).trim().split(/\s+/);this.board=Array(64).fill(null);let r=0,c=0;for(const ch of placement){if(ch==='/'){r++;c=0}else if(/\d/.test(ch)){c+=Number(ch)}else{if(!inside(r,c))throw new Error('FEN inválido');this.board[idx(r,c++)]=ch}}this.turn=turn==='b'?'b':'w';this.castling=castling==='-'?'':castling;this.enPassant=ep==='-'?-1:sqIndex(ep);this.halfmove=Number(half)||0;this.fullmove=Number(full)||1;this.moveLog=[];this.positionHistory=[this.positionKey()];return this}
  toFEN(){let p='';for(let r=0;r<8;r++){let empty=0;for(let c=0;c<8;c++){const x=this.board[idx(r,c)];if(!x)empty++;else{if(empty){p+=empty;empty=0}p+=x}}if(empty)p+=empty;if(r<7)p+='/'}return `${p} ${this.turn} ${this.castling||'-'} ${this.enPassant<0?'-':sqName(this.enPassant)} ${this.halfmove} ${this.fullmove}`}
  positionKey(){return this.toFEN().split(' ').slice(0,4).join(' ')}
  snapshot(){return{schemaVersion:1,fen:this.toFEN(),moveLog:this.moveLog.map(cloneMove),positionHistory:[...this.positionHistory]}}
  restore(s){if(!s||s.schemaVersion!==1||typeof s.fen!=='string')return false;this.loadFEN(s.fen);this.moveLog=Array.isArray(s.moveLog)?s.moveLog.map(cloneMove):[];this.positionHistory=Array.isArray(s.positionHistory)&&s.positionHistory.length?[...s.positionHistory]:[this.positionKey()];return true}
  clone(){const e=new ChessEngine(this.toFEN());e.moveLog=this.moveLog.map(cloneMove);e.positionHistory=[...this.positionHistory];return e}
  kingSquare(side){const k=side==='w'?'K':'k';return this.board.indexOf(k)}
  isSquareAttacked(square,by){const [r,c]=rc(square);const pawn=by==='w'?'P':'p',dir=by==='w'?-1:1;for(const dc of[-1,1]){const rr=r-dir,cc=c-dc;if(inside(rr,cc)&&this.board[idx(rr,cc)]===pawn)return true}
    const knight=by==='w'?'N':'n';for(const[dR,dC]of KNIGHT){const rr=r+dR,cc=c+dC;if(inside(rr,cc)&&this.board[idx(rr,cc)]===knight)return true}
    const king=by==='w'?'K':'k';for(const[dR,dC]of KING){const rr=r+dR,cc=c+dC;if(inside(rr,cc)&&this.board[idx(rr,cc)]===king)return true}
    const scan=(dirs,types)=>{for(const[dR,dC]of dirs){let rr=r+dR,cc=c+dC;while(inside(rr,cc)){const p=this.board[idx(rr,cc)];if(p){if(color(p)===by&&types.includes(type(p)))return true;break}rr+=dR;cc+=dC}}return false};
    return scan(ORTH,['r','q'])||scan(DIAG,['b','q']);}
  inCheck(side=this.turn){const k=this.kingSquare(side);return k>=0&&this.isSquareAttacked(k,side==='w'?'b':'w')}
  pseudoMoves(side=this.turn){const out=[];for(let from=0;from<64;from++){const p=this.board[from];if(!p||color(p)!==side)continue;const t=type(p),[r,c]=rc(from),push=(to,extra={})=>{const cap=this.board[to];if(!cap||color(cap)!==side)out.push({from,to,piece:p,captured:cap||null,...extra})};
      if(t==='p'){const dir=side==='w'?-1:1,start=side==='w'?6:1,promo=side==='w'?0:7;const oneR=r+dir;if(inside(oneR,c)&&!this.board[idx(oneR,c)]){const to=idx(oneR,c);if(oneR===promo)for(const pr of['q','r','b','n'])push(to,{promotion:pr});else push(to);const twoR=r+2*dir;if(r===start&&!this.board[idx(twoR,c)])push(idx(twoR,c),{doublePawn:true})}for(const dc of[-1,1]){const rr=r+dir,cc=c+dc;if(!inside(rr,cc))continue;const to=idx(rr,cc),cap=this.board[to];if(cap&&color(cap)!==side){if(rr===promo)for(const pr of['q','r','b','n'])push(to,{promotion:pr});else push(to)}else if(to===this.enPassant)push(to,{enPassant:true,captured:side==='w'?'p':'P'})}}
      else if(t==='n'){for(const[dR,dC]of KNIGHT){const rr=r+dR,cc=c+dC;if(inside(rr,cc))push(idx(rr,cc))}}
      else if(t==='b'||t==='r'||t==='q'){const dirs=t==='b'?DIAG:t==='r'?ORTH:[...ORTH,...DIAG];for(const[dR,dC]of dirs){let rr=r+dR,cc=c+dC;while(inside(rr,cc)){const to=idx(rr,cc),cap=this.board[to];if(!cap)push(to);else{if(color(cap)!==side)push(to);break}rr+=dR;cc+=dC}}}
      else if(t==='k'){for(const[dR,dC]of KING){const rr=r+dR,cc=c+dC;if(inside(rr,cc))push(idx(rr,cc))}const enemy=side==='w'?'b':'w',home=side==='w'?60:4;if(from===home&&!this.inCheck(side)){const rights=side==='w'?['K','Q']:['k','q'];if(this.castling.includes(rights[0])){const f=home+1,g=home+2,rook=home+3;if(!this.board[f]&&!this.board[g]&&type(this.board[rook])==='r'&&color(this.board[rook])===side&&!this.isSquareAttacked(f,enemy)&&!this.isSquareAttacked(g,enemy))push(g,{castle:'K'})}if(this.castling.includes(rights[1])){const d=home-1,c2=home-2,b=home-3,rook=home-4;if(!this.board[d]&&!this.board[c2]&&!this.board[b]&&type(this.board[rook])==='r'&&color(this.board[rook])===side&&!this.isSquareAttacked(d,enemy)&&!this.isSquareAttacked(c2,enemy))push(c2,{castle:'Q'})}}}
    }return out}
  legalMoves(side=this.turn){const result=[];for(const m of this.pseudoMoves(side)){const e=this.clone();e.turn=side;e._apply(m,false);if(!e.inCheck(side))result.push(m)}return result}
  legalMovesFrom(square){return this.legalMoves().filter(m=>m.from===square)}
  _apply(move,record=true){const side=color(move.piece)||this.turn,piece=this.board[move.from],target=this.board[move.to];if(!piece)throw new Error('Casa de origem vazia');this.board[move.from]=null;let captured=target||null;if(move.enPassant){const capSq=move.to+(side==='w'?8:-8);captured=this.board[capSq];this.board[capSq]=null}this.board[move.to]=move.promotion?(side==='w'?move.promotion.toUpperCase():move.promotion.toLowerCase()):piece;if(move.castle){const kingSide=move.castle==='K',rookFrom=move.from+(kingSide?3:-4),rookTo=move.from+(kingSide?1:-1);this.board[rookTo]=this.board[rookFrom];this.board[rookFrom]=null}
    const fromName=sqName(move.from),toName=sqName(move.to);const movingType=type(piece);if(movingType==='k')this.castling=this.castling.replace(side==='w'?/[KQ]/g:/[kq]/g,'');if(movingType==='r'){if(move.from===63)this.castling=this.castling.replace('K','');if(move.from===56)this.castling=this.castling.replace('Q','');if(move.from===7)this.castling=this.castling.replace('k','');if(move.from===0)this.castling=this.castling.replace('q','')}if(captured&&type(captured)==='r'){if(move.to===63)this.castling=this.castling.replace('K','');if(move.to===56)this.castling=this.castling.replace('Q','');if(move.to===7)this.castling=this.castling.replace('k','');if(move.to===0)this.castling=this.castling.replace('q','')}
    this.enPassant=move.doublePawn?(move.from+move.to)>>1:-1;this.halfmove=(movingType==='p'||captured)?0:this.halfmove+1;if(side==='b')this.fullmove++;this.turn=side==='w'?'b':'w';const rec={...move,piece,captured,fromName,toName,fen:this.toFEN()};if(record){this.moveLog.push(rec);this.positionHistory.push(this.positionKey())}return rec}
  play(moveOrFrom,to,promotion='q'){let move;if(typeof moveOrFrom==='object')move=moveOrFrom;else move=this.legalMoves().find(m=>m.from===moveOrFrom&&m.to===to&&(!m.promotion||m.promotion===promotion));if(!move)return{ok:false,reason:'illegal'};const rec=this._apply(move,true);return{ok:true,move:rec,outcome:this.outcome()}}
  playUci(uci){const from=sqIndex(uci.slice(0,2)),to=sqIndex(uci.slice(2,4)),pr=uci[4]||'q';return this.play(from,to,pr)}
  repetitionCount(){const k=this.positionKey();return this.positionHistory.filter(x=>x===k).length}
  insufficientMaterial(){const pieces=this.board.map((p,i)=>p?{p,i}:null).filter(Boolean);const nonKings=pieces.filter(x=>type(x.p)!=='k');if(nonKings.length===0)return true;if(nonKings.some(x=>['p','r','q'].includes(type(x.p))))return false;if(nonKings.length===1)return['b','n'].includes(type(nonKings[0].p));if(nonKings.every(x=>type(x.p)==='b')){const colors=nonKings.map(x=>{const[r,c]=rc(x.i);return(r+c)%2});return new Set(colors).size===1}return false}
  outcome(){const legal=this.legalMoves();const check=this.inCheck();if(!legal.length)return check?{status:'checkmate',winner:this.turn==='w'?'b':'w',check:true}:{status:'stalemate',winner:null,check:false};if(this.halfmove>=100)return{status:'draw-50',winner:null,check};if(this.repetitionCount()>=3)return{status:'draw-threefold',winner:null,check};if(this.insufficientMaterial())return{status:'draw-insufficient',winner:null,check};return{status:'playing',winner:null,check,legalMoves:legal.length}}
  static squareName=sqName;static squareIndex=sqIndex;static START_FEN=START_FEN;
}
const api={ChessEngine,START_FEN,squareName:sqName,squareIndex:sqIndex};if(typeof module!=='undefined'&&module.exports)module.exports=api;global.ChessArenaEngine=api;
})(typeof globalThis!=='undefined'?globalThis:this);
