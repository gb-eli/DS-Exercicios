const clamp=(v,min,max)=>Math.min(max,Math.max(min,v));
const deadzone=(v,d=.12)=>Math.abs(v)<d?0:Math.sign(v)*(Math.abs(v)-d)/(1-d);

export class ImmersiveInputController {
  constructor({canvas,root,leftStick,rightStick}={}){
    this.canvas=canvas;this.root=root;this.leftStick=leftStick;this.rightStick=rightStick;
    this.keys=new Set();this.pointer=null;this.lookDelta={x:0,y:0};this.zoomDelta=0;
    this.left={x:0,y:0};this.right={x:0,y:0};this.sticks=new Map();this.enabled=true;
    this.onKeyDown=e=>this.keyDown(e);this.onKeyUp=e=>this.keyUp(e);this.onPointerDown=e=>this.pointerDown(e);this.onPointerMove=e=>this.pointerMove(e);this.onPointerUp=e=>this.pointerUp(e);this.onWheel=e=>this.wheel(e);
  }
  attach(){
    addEventListener('keydown',this.onKeyDown);addEventListener('keyup',this.onKeyUp);
    this.canvas?.addEventListener('pointerdown',this.onPointerDown);addEventListener('pointermove',this.onPointerMove);addEventListener('pointerup',this.onPointerUp);addEventListener('pointercancel',this.onPointerUp);
    this.canvas?.addEventListener('wheel',this.onWheel,{passive:false});
    [this.leftStick,this.rightStick].filter(Boolean).forEach(el=>el.addEventListener('pointerdown',this.onPointerDown));
  }
  detach(){
    removeEventListener('keydown',this.onKeyDown);removeEventListener('keyup',this.onKeyUp);
    this.canvas?.removeEventListener('pointerdown',this.onPointerDown);removeEventListener('pointermove',this.onPointerMove);removeEventListener('pointerup',this.onPointerUp);removeEventListener('pointercancel',this.onPointerUp);
    this.canvas?.removeEventListener('wheel',this.onWheel);
    [this.leftStick,this.rightStick].filter(Boolean).forEach(el=>el.removeEventListener('pointerdown',this.onPointerDown));
  }
  keyDown(e){if(['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName))return;this.keys.add(e.code);}
  keyUp(e){this.keys.delete(e.code);}
  pointerDown(e){
    const stick=e.target.closest?.('[data-stick]');
    if(stick){e.preventDefault();stick.setPointerCapture?.(e.pointerId);this.sticks.set(e.pointerId,{el:stick,type:stick.dataset.stick,startX:e.clientX,startY:e.clientY});return;}
    if(e.currentTarget===this.canvas||e.target===this.canvas){this.pointer={id:e.pointerId,x:e.clientX,y:e.clientY};this.canvas.setPointerCapture?.(e.pointerId);}
  }
  pointerMove(e){
    const stick=this.sticks.get(e.pointerId);
    if(stick){
      const rect=stick.el.getBoundingClientRect();const max=Math.max(28,Math.min(rect.width,rect.height)*.34);
      const dx=clamp(e.clientX-stick.startX,-max,max),dy=clamp(e.clientY-stick.startY,-max,max);
      const state={x:dx/max,y:dy/max};if(stick.type==='left')this.left=state;else this.right=state;
      const knob=stick.el.querySelector('.joystick-knob');if(knob)knob.style.transform=`translate(${dx}px,${dy}px)`;return;
    }
    if(this.pointer?.id===e.pointerId){const dx=e.clientX-this.pointer.x,dy=e.clientY-this.pointer.y;this.pointer.x=e.clientX;this.pointer.y=e.clientY;this.lookDelta.x+=dx*.0048;this.lookDelta.y+=dy*.0048;}
  }
  pointerUp(e){
    const stick=this.sticks.get(e.pointerId);if(stick){this.sticks.delete(e.pointerId);if(stick.type==='left')this.left={x:0,y:0};else this.right={x:0,y:0};const knob=stick.el.querySelector('.joystick-knob');if(knob)knob.style.transform='translate(0,0)';}
    if(this.pointer?.id===e.pointerId)this.pointer=null;
  }
  wheel(e){e.preventDefault();this.zoomDelta+=Math.sign(e.deltaY);}
  gamepadState(){
    const gamepad=navigator.getGamepads?.()?.find(Boolean);if(!gamepad)return null;
    return {lx:deadzone(gamepad.axes[0]||0),ly:deadzone(gamepad.axes[1]||0),rx:deadzone(gamepad.axes[2]||0),ry:deadzone(gamepad.axes[3]||0),lift:(gamepad.buttons[7]?.value||0)-(gamepad.buttons[6]?.value||0),roll:(gamepad.buttons[5]?.value||0)-(gamepad.buttons[4]?.value||0),boost:Boolean(gamepad.buttons[0]?.pressed)};
  }
  sample(){
    const gp=this.gamepadState();
    const key=(...codes)=>codes.some(code=>this.keys.has(code));
    const forward=(key('KeyW','ArrowUp')?1:0)-(key('KeyS','ArrowDown')?1:0)-this.left.y-(gp?.ly||0);
    const strafe=(key('KeyD')?1:0)-(key('KeyA')?1:0)+this.left.x+(gp?.lx||0);
    const lift=(key('KeyE','Space')?1:0)-(key('KeyQ','ControlLeft')?1:0)+(gp?.lift||0);
    const lookX=(this.lookDelta.x+this.right.x*.05+(gp?.rx||0)*.05)*18;
    const lookY=(this.lookDelta.y+this.right.y*.05+(gp?.ry||0)*.05)*18;
    const roll=(key('KeyX')?1:0)-(key('KeyZ')?1:0)+(gp?.roll||0);
    const zoom=this.zoomDelta*2;
    const result={forward:clamp(forward,-1,1),strafe:clamp(strafe,-1,1),lift:clamp(lift,-1,1),roll:clamp(roll,-1,1),lookX,lookY,zoom,boost:key('ShiftLeft','ShiftRight')||Boolean(gp?.boost),pointerLook:Boolean(this.pointer||Math.abs(this.right.x)+Math.abs(this.right.y)>.05)};
    this.lookDelta={x:0,y:0};this.zoomDelta=0;return result;
  }
}
