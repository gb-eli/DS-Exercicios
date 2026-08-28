import { DEFAULT_MARS_GRID, TERRAIN_TYPES } from '../../data/marsSystems.js';

const key=(x,y)=>`${x},${y}`;

export class MarsGrid {
  constructor(cells=DEFAULT_MARS_GRID){
    this.cells=cells.map(row=>[...row]);
    this.height=this.cells.length;
    this.width=this.cells[0]?.length??0;
  }
  inBounds(x,y){return x>=0&&y>=0&&x<this.width&&y<this.height;}
  typeAt(x,y){return this.inBounds(x,y)?this.cells[y][x]:'blocked';}
  terrainAt(x,y){return TERRAIN_TYPES[this.typeAt(x,y)]??TERRAIN_TYPES.blocked;}
  neighbors(node){
    return [[1,0],[-1,0],[0,1],[0,-1]].map(([dx,dy])=>({x:node.x+dx,y:node.y+dy})).filter(n=>this.inBounds(n.x,n.y)&&Number.isFinite(this.terrainAt(n.x,n.y).cost));
  }
  heuristic(a,b){return Math.abs(a.x-b.x)+Math.abs(a.y-b.y);}
  findPath(start,goal){
    if(!this.inBounds(start.x,start.y)||!this.inBounds(goal.x,goal.y)||!Number.isFinite(this.terrainAt(goal.x,goal.y).cost)) return {ok:false,path:[],cost:Infinity,visited:0,reason:'Destino inválido ou bloqueado.'};
    const open=[{...start,f:this.heuristic(start,goal)}],came=new Map(),g=new Map([[key(start.x,start.y),0]]),closed=new Set();
    let visited=0;
    while(open.length){
      open.sort((a,b)=>a.f-b.f);const current=open.shift();const ck=key(current.x,current.y);if(closed.has(ck))continue;closed.add(ck);visited++;
      if(current.x===goal.x&&current.y===goal.y){
        const path=[{x:goal.x,y:goal.y}];let cursor=ck;
        while(came.has(cursor)){const prev=came.get(cursor);path.push({...prev});cursor=key(prev.x,prev.y);}path.reverse();
        return {ok:true,path,cost:Number((g.get(ck)??0).toFixed(2)),visited,reason:''};
      }
      for(const next of this.neighbors(current)){
        const nk=key(next.x,next.y);if(closed.has(nk))continue;const diagonal=1;const tentative=(g.get(ck)??Infinity)+this.terrainAt(next.x,next.y).cost*diagonal;
        if(tentative<(g.get(nk)??Infinity)){came.set(nk,{x:current.x,y:current.y});g.set(nk,tentative);open.push({...next,f:tentative+this.heuristic(next,goal)});}
      }
    }
    return {ok:false,path:[],cost:Infinity,visited,reason:'Nenhuma rota segura encontrada.'};
  }
  serialize(){return this.cells.map(row=>[...row]);}
}
