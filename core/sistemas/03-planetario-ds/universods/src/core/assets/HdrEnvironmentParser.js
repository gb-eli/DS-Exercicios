const decoder=new TextDecoder();
function decodeRGBE(r,g,b,e){if(!e)return[0,0,0,1];const scale=Math.pow(2,e-128)/256;return[r*scale,g*scale,b*scale,1];}
export class HdrEnvironmentParser{
  static parse(input){
    const bytes=input instanceof Uint8Array?input:new Uint8Array(input);let cursor=0;
    const line=()=>{const start=cursor;while(cursor<bytes.length&&bytes[cursor]!==10)cursor++;const text=decoder.decode(bytes.subarray(start,cursor)).replace(/\r$/,'');cursor++;return text;};
    const signature=line();if(!signature.startsWith('#?RADIANCE')&&!signature.startsWith('#?RGBE'))throw new Error('Arquivo HDR inválido.');
    let format='';while(cursor<bytes.length){const value=line();if(!value)break;if(value.startsWith('FORMAT='))format=value.slice(7);}
    const resolution=line();const match=resolution.match(/-Y\s+(\d+)\s+\+X\s+(\d+)/);if(!match)throw new Error('Resolução HDR não suportada.');
    const height=Number(match[1]),width=Number(match[2]),pixels=new Float32Array(width*height*4);
    if(width>=8&&width<=32767&&bytes[cursor]===2&&bytes[cursor+1]===2){
      for(let y=0;y<height;y++){
        if(bytes[cursor++]!==2||bytes[cursor++]!==2)throw new Error('Scanline HDR inválida.');cursor+=2;const channels=[new Uint8Array(width),new Uint8Array(width),new Uint8Array(width),new Uint8Array(width)];
        for(let c=0;c<4;c++){let x=0;while(x<width){const code=bytes[cursor++];if(code>128){const count=code-128,value=bytes[cursor++];channels[c].fill(value,x,x+count);x+=count;}else{for(let i=0;i<code;i++)channels[c][x++]=bytes[cursor++];}}}
        for(let x=0;x<width;x++)pixels.set(decodeRGBE(channels[0][x],channels[1][x],channels[2][x],channels[3][x]),(y*width+x)*4);
      }
    }else{
      for(let i=0;i<width*height;i++){const rgba=decodeRGBE(bytes[cursor++],bytes[cursor++],bytes[cursor++],bytes[cursor++]);pixels.set(rgba,i*4);}
    }
    return{width,height,pixels,format};
  }
}
