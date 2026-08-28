function safeText(value){return String(value??'');}

export function crc32(bytes){
  let crc=-1;
  for(let i=0;i<bytes.length;i+=1){
    crc^=bytes[i];
    for(let bit=0;bit<8;bit+=1)crc=(crc>>>1)^(0xEDB88320&-(crc&1));
  }
  return (crc^-1)>>>0;
}
function u16(value){return [value&255,(value>>>8)&255];}
function u32(value){return [value&255,(value>>>8)&255,(value>>>16)&255,(value>>>24)&255];}
function dosDateTime(date=new Date()){
  const year=Math.max(1980,date.getFullYear());
  const time=(date.getHours()<<11)|(date.getMinutes()<<5)|Math.floor(date.getSeconds()/2);
  const day=(date.getDate()&31)|(((date.getMonth()+1)&15)<<5)|(((year-1980)&127)<<9);
  return {time,date:day};
}
function sanitizeArchiveName(name,index){
  const clean=String(name||'').replace(/\\/g,'/').split('/').filter(part=>part&&part!=='.'&&part!=='..').join('/');
  return clean||`arquivo-${index+1}.txt`;
}

export function createStoreZip(files,{date=new Date()}={}){
  const list=Array.isArray(files)?files:[];
  const encoder=new TextEncoder(),localParts=[],centralParts=[];
  const dt=dosDateTime(date);let offset=0;
  list.forEach((file,index)=>{
    const filename=sanitizeArchiveName(file?.filename,index);
    const nameBytes=encoder.encode(filename),contentBytes=encoder.encode(safeText(file?.content)),crc=crc32(contentBytes);
    const localHeader=new Uint8Array([
      ...u32(0x04034b50),...u16(20),...u16(0x0800),...u16(0),...u16(dt.time),...u16(dt.date),
      ...u32(crc),...u32(contentBytes.length),...u32(contentBytes.length),...u16(nameBytes.length),...u16(0)
    ]);
    const localRecord=new Uint8Array(localHeader.length+nameBytes.length+contentBytes.length);
    localRecord.set(localHeader);localRecord.set(nameBytes,localHeader.length);localRecord.set(contentBytes,localHeader.length+nameBytes.length);
    localParts.push(localRecord);
    const centralHeader=new Uint8Array([
      ...u32(0x02014b50),...u16(20),...u16(20),...u16(0x0800),...u16(0),...u16(dt.time),...u16(dt.date),
      ...u32(crc),...u32(contentBytes.length),...u32(contentBytes.length),...u16(nameBytes.length),...u16(0),...u16(0),...u16(0),...u16(0),...u32(0),...u32(offset)
    ]);
    const centralRecord=new Uint8Array(centralHeader.length+nameBytes.length);
    centralRecord.set(centralHeader);centralRecord.set(nameBytes,centralHeader.length);centralParts.push(centralRecord);
    offset+=localRecord.length;
  });
  const centralSize=centralParts.reduce((sum,part)=>sum+part.length,0);
  const end=new Uint8Array([...u32(0x06054b50),...u16(0),...u16(0),...u16(list.length),...u16(list.length),...u32(centralSize),...u32(offset),...u16(0)]);
  return new Blob([...localParts,...centralParts,end],{type:'application/zip'});
}

export function downloadBlob(blob,filename){
  const url=URL.createObjectURL(blob),anchor=document.createElement('a');
  anchor.href=url;anchor.download=String(filename||'download');anchor.rel='noopener';
  document.body.appendChild(anchor);anchor.click();anchor.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1500);
}

export function downloadTextFile(filename,content){
  downloadBlob(new Blob([safeText(content)],{type:'text/plain;charset=utf-8'}),filename);
}
