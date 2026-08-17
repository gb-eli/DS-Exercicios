const COMPONENTS={5120:{Ctor:Int8Array,bytes:1},5121:{Ctor:Uint8Array,bytes:1},5122:{Ctor:Int16Array,bytes:2},5123:{Ctor:Uint16Array,bytes:2},5125:{Ctor:Uint32Array,bytes:4},5126:{Ctor:Float32Array,bytes:4}};
const WIDTH={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16};
const decoder=new TextDecoder();
function align4(value){return (value+3)&~3;}
function copyAccessor(json,bin,index){
  const accessor=json.accessors[index],view=json.bufferViews[accessor.bufferView],spec=COMPONENTS[accessor.componentType],width=WIDTH[accessor.type];
  if(!accessor||!view||!spec||!width)throw new Error(`Accessor GLB não suportado: ${index}`);
  const count=accessor.count,offset=(view.byteOffset||0)+(accessor.byteOffset||0),stride=view.byteStride||spec.bytes*width;
  if(stride===spec.bytes*width){const raw=new spec.Ctor(bin.buffer,bin.byteOffset+offset,count*width);return new spec.Ctor(raw);}
  const out=new spec.Ctor(count*width),dv=new DataView(bin.buffer,bin.byteOffset+offset,view.byteLength-(accessor.byteOffset||0));
  const getter={5120:'getInt8',5121:'getUint8',5122:'getInt16',5123:'getUint16',5125:'getUint32',5126:'getFloat32'}[accessor.componentType];
  for(let i=0;i<count;i++)for(let c=0;c<width;c++)out[i*width+c]=dv[getter](i*stride+c*spec.bytes,true);
  return out;
}
function normalizedFloat(array,componentType){
  if(array instanceof Float32Array)return array;
  const out=new Float32Array(array.length),max={5120:127,5121:255,5122:32767,5123:65535,5125:4294967295}[componentType]||1;
  for(let i=0;i<array.length;i++)out[i]=array[i]/max;
  return out;
}
export class GlbGeometryParser{
  static parse(input){
    const bytes=input instanceof Uint8Array?input:new Uint8Array(input);
    if(bytes.byteLength<20)throw new Error('GLB incompleto.');
    const view=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength);
    if(view.getUint32(0,true)!==0x46546c67)throw new Error('Assinatura GLB inválida.');
    if(view.getUint32(4,true)!==2)throw new Error('Somente GLB 2.0 é suportado.');
    const declared=view.getUint32(8,true);if(declared>bytes.byteLength)throw new Error('Comprimento GLB inválido.');
    let cursor=12,json=null,bin=null;
    while(cursor+8<=declared){const length=view.getUint32(cursor,true),type=view.getUint32(cursor+4,true);cursor+=8;const chunk=bytes.subarray(cursor,cursor+length);cursor+=align4(length);if(type===0x4e4f534a)json=JSON.parse(decoder.decode(chunk).replace(/\0+$/,'').trim());if(type===0x004e4942)bin=chunk;}
    if(!json||!bin)throw new Error('GLB precisa conter JSON e BIN.');
    const primitive=json.meshes?.[0]?.primitives?.[0];if(!primitive)throw new Error('GLB sem primitive renderizável.');
    const positionIndex=primitive.attributes?.POSITION,normalIndex=primitive.attributes?.NORMAL,colorIndex=primitive.attributes?.COLOR_0;
    if(positionIndex===undefined||primitive.indices===undefined)throw new Error('GLB sem POSITION ou índices.');
    const positions=copyAccessor(json,bin,positionIndex),indices=copyAccessor(json,bin,primitive.indices);
    const normals=normalIndex===undefined?new Float32Array(positions.length):copyAccessor(json,bin,normalIndex);
    const colors=colorIndex===undefined?new Float32Array((positions.length/3)*4).fill(1):normalizedFloat(copyAccessor(json,bin,colorIndex),json.accessors[colorIndex].componentType);
    const min=json.accessors[positionIndex].min||[0,0,0],max=json.accessors[positionIndex].max||[0,0,0];
    const center=min.map((value,i)=>(value+max[i])/2),radius=Math.hypot(max[0]-min[0],max[1]-min[1],max[2]-min[2])/2||1;
    return{json,positions:new Float32Array(positions),normals:new Float32Array(normals),colors:new Float32Array(colors),indices,indexType:indices instanceof Uint32Array?5125:5123,bounds:{min,max,center,radius},vertices:positions.length/3,triangles:indices.length/3};
  }
}
