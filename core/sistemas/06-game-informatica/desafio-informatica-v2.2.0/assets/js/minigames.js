export function renderCellHunt(container,onFinish){
  let score=0,time=35,target=randomCell(),ended=false;
  container.innerHTML=`<div class="game-shell"><h3>Caça às Células</h3><p>Clique na célula indicada antes do tempo acabar.</p><div class="tag-row" style="justify-content:center"><span class="tag">Alvo: <strong id="huntTarget">${target}</strong></span><span class="tag">Pontos: <strong id="huntScore">0</strong></span><span class="tag">Tempo: <strong id="huntTime">35</strong>s</span></div><div id="huntGrid" class="sheet-grid" style="grid-template-columns:48px repeat(7,74px);margin:14px auto;max-width:570px"></div><button class="btn btn-secondary btn-small" id="endHunt">Encerrar jogo</button></div>`;
  const grid=container.querySelector('#huntGrid');
  buildGrid(grid,(cell)=>{
    if(ended)return;
    if(cell===target){score+=10;target=randomCell();container.querySelector('#huntTarget').textContent=target;container.querySelector('#huntScore').textContent=score;}
    else score=Math.max(0,score-2);
  });
  const timer=setInterval(()=>{time--;const el=container.querySelector('#huntTime');if(el)el.textContent=time;if(time<=0)finish()},1000);
  container.querySelector('#endHunt').onclick=finish;
  function finish(){if(ended)return;ended=true;clearInterval(timer);container.querySelector('.game-shell').innerHTML=`<h3>Jogo concluído</h3><p>Você marcou <strong>${score} pontos</strong> localizando células.</p>`;onFinish?.({game:'cell-hunt',score});}
}

export function renderSnake(container,onFinish){
  container.innerHTML=`<div class="game-shell"><h3>Cobrinha dos Dados</h3><p>Colete células e evite os erros da planilha.</p><div class="tag-row" style="justify-content:center"><span class="tag">Pontos: <strong id="snakeScore">0</strong></span></div><canvas id="snakeCanvas" width="420" height="300" aria-label="Jogo da cobrinha"></canvas><div class="game-controls"><button class="up">▲</button><button class="left">◀</button><button class="down">▼</button><button class="right">▶</button></div><button class="btn btn-secondary btn-small" id="endSnake">Encerrar jogo</button></div>`;
  const canvas=container.querySelector('#snakeCanvas'),ctx=canvas.getContext('2d'),size=20;
  let snake=[{x:8,y:7},{x:7,y:7},{x:6,y:7}],dir={x:1,y:0},next={x:1,y:0},food=spawn(),score=0,ended=false,last=0;
  function spawn(){return {x:Math.floor(Math.random()*(canvas.width/size)),y:Math.floor(Math.random()*(canvas.height/size))}}
  function setDir(x,y){if(x===-dir.x&&y===-dir.y)return;next={x,y}}
  const controls={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]};
  Object.entries(controls).forEach(([c,[x,y]])=>container.querySelector('.'+c).onclick=()=>setDir(x,y));
  const key=e=>{if(e.key==='ArrowUp')setDir(0,-1);if(e.key==='ArrowDown')setDir(0,1);if(e.key==='ArrowLeft')setDir(-1,0);if(e.key==='ArrowRight')setDir(1,0)};window.addEventListener('keydown',key);
  container.querySelector('#endSnake').onclick=finish;
  function loop(ts){if(ended)return;if(ts-last>130){last=ts;step();draw()}requestAnimationFrame(loop)}
  function step(){dir=next;const head={x:snake[0].x+dir.x,y:snake[0].y+dir.y};if(head.x<0||head.y<0||head.x>=canvas.width/size||head.y>=canvas.height/size||snake.some(p=>p.x===head.x&&p.y===head.y)){finish();return}snake.unshift(head);if(head.x===food.x&&head.y===food.y){score+=10;container.querySelector('#snakeScore').textContent=score;food=spawn()}else snake.pop()}
  function draw(){ctx.fillStyle='#081b2b';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.strokeStyle='rgba(41,212,242,.08)';for(let x=0;x<canvas.width;x+=size){for(let y=0;y<canvas.height;y+=size)ctx.strokeRect(x,y,size,size)}ctx.fillStyle='#ffd65a';ctx.fillRect(food.x*size+3,food.y*size+3,size-6,size-6);snake.forEach((p,i)=>{ctx.fillStyle=i===0?'#29d4f2':'#4ee69a';ctx.fillRect(p.x*size+2,p.y*size+2,size-4,size-4)})}
  function finish(){if(ended)return;ended=true;window.removeEventListener('keydown',key);container.querySelector('.game-shell').innerHTML=`<h3>Jogo concluído</h3><p>Você marcou <strong>${score} pontos</strong> na Cobrinha dos Dados.</p>`;onFinish?.({game:'data-snake',score})}
  requestAnimationFrame(loop);
}

function randomCell(){const cols='ABCDEFG';return cols[Math.floor(Math.random()*cols.length)]+(1+Math.floor(Math.random()*9))}
function buildGrid(grid,onCell){const cols='ABCDEFG';grid.innerHTML='<div class="sheet-cell header"></div>'+cols.split('').map(c=>`<div class="sheet-cell header">${c}</div>`).join('');for(let r=1;r<=9;r++){grid.insertAdjacentHTML('beforeend',`<div class="sheet-cell rowhead">${r}</div>`);for(const c of cols){const el=document.createElement('button');el.className='sheet-cell data';el.textContent='';el.type='button';el.onclick=()=>onCell(c+r);grid.appendChild(el)}}}
