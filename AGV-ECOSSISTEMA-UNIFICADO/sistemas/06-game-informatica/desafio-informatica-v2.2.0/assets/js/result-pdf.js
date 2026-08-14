import { APP_VERSION, SCHOOL, TEACHER, CLASSES } from './data.js?v=20260811r38';
import { createValidationToken, downloadBlob } from './crypto.js?v=20260811r38';

const PAGE_WIDTH=1240;
const PAGE_HEIGHT=1754;
const RASTER_SCALE=0.6;
const RASTER_WIDTH=Math.round(PAGE_WIDTH*RASTER_SCALE);
const RASTER_HEIGHT=Math.round(PAGE_HEIGHT*RASTER_SCALE);
const PAGE_MARGIN=76;
const FOOTER_HEIGHT=76;
const COLORS={
  navy:'#0b1d36',blue:'#1d5fe9',cyan:'#08b6d8',green:'#0a9f70',red:'#d9485f',
  purple:'#6b4de6',ink:'#172640',muted:'#5f718d',line:'#d8e1ee',paper:'#f5f8fc',white:'#ffffff'
};

function formatDuration(seconds){
  const s=Math.max(0,Math.floor(Number(seconds)||0));
  return `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
}
function formatDate(value){
  try{return new Date(value).toLocaleString('pt-BR',{dateStyle:'short',timeStyle:'short'})}catch{return String(value||'')}
}
function cleanText(value){return String(value??'').replace(/[\u0000-\u001f\u007f]/g,' ').replace(/\s+/g,' ').trim()}
function safeName(value){return cleanText(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9]+/g,'-').replace(/^-|-$/g,'').toLowerCase()||'estudante'}
function roundRect(ctx,x,y,w,h,r,fill,stroke=null,lineWidth=1){
  const radius=Math.min(r,w/2,h/2);ctx.beginPath();ctx.moveTo(x+radius,y);ctx.arcTo(x+w,y,x+w,y+h,radius);ctx.arcTo(x+w,y+h,x,y+h,radius);ctx.arcTo(x,y+h,x,y,radius);ctx.arcTo(x,y,x+w,y,radius);ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.lineWidth=lineWidth;ctx.strokeStyle=stroke;ctx.stroke()}
}
function splitText(ctx,text,maxWidth){
  const raw=cleanText(text);if(!raw)return [''];const words=raw.split(' '),lines=[];let line='';
  for(const word of words){const test=line?`${line} ${word}`:word;if(ctx.measureText(test).width<=maxWidth){line=test;continue}if(line)lines.push(line);if(ctx.measureText(word).width<=maxWidth){line=word;continue}let part='';for(const ch of word){const next=part+ch;if(ctx.measureText(next).width>maxWidth&&part){lines.push(part);part=ch}else part=next}line=part}
  if(line)lines.push(line);return lines;
}
function drawWrapped(ctx,text,x,y,maxWidth,lineHeight,options={}){
  const lines=splitText(ctx,text,maxWidth);const maxLines=options.maxLines||Infinity;const visible=lines.slice(0,maxLines);visible.forEach((line,i)=>ctx.fillText(line,x,y+i*lineHeight));return {height:visible.length*lineHeight,lines:visible.length,truncated:lines.length>visible.length};
}
function drawSectionTitle(ctx,title,y,subtitle=''){
  ctx.fillStyle=COLORS.ink;ctx.font='700 31px Arial, sans-serif';ctx.fillText(cleanText(title),PAGE_MARGIN,y);
  let height=40;if(subtitle){ctx.fillStyle=COLORS.muted;ctx.font='400 19px Arial, sans-serif';height+=drawWrapped(ctx,subtitle,PAGE_MARGIN,y+36,PAGE_WIDTH-PAGE_MARGIN*2,27).height+6}
  return y+height;
}
function drawMetric(ctx,x,y,w,label,value,accent=COLORS.blue){
  roundRect(ctx,x,y,w,112,18,COLORS.white,COLORS.line,2);ctx.fillStyle=accent;ctx.fillRect(x,y,8,112);ctx.fillStyle=COLORS.muted;ctx.font='600 17px Arial, sans-serif';ctx.fillText(cleanText(label).toUpperCase(),x+26,y+34);ctx.fillStyle=COLORS.ink;ctx.font='700 31px Arial, sans-serif';drawWrapped(ctx,value,x+26,y+76,w-48,34,{maxLines:1});
}
function createPage(title=''){
  const canvas=document.createElement('canvas');canvas.width=RASTER_WIDTH;canvas.height=RASTER_HEIGHT;const ctx=canvas.getContext('2d',{alpha:false});ctx.scale(RASTER_SCALE,RASTER_SCALE);ctx.fillStyle=COLORS.paper;ctx.fillRect(0,0,PAGE_WIDTH,PAGE_HEIGHT);
  ctx.fillStyle=COLORS.navy;ctx.fillRect(0,0,PAGE_WIDTH,106);ctx.fillStyle=COLORS.white;ctx.font='700 29px Arial, sans-serif';ctx.fillText('DESAFIO DE INFORMÁTICA',PAGE_MARGIN,48);ctx.font='400 18px Arial, sans-serif';ctx.fillText(cleanText(SCHOOL),PAGE_MARGIN,79);ctx.textAlign='right';ctx.font='600 18px Arial, sans-serif';ctx.fillText(cleanText(title||'Relatório de resultado'),PAGE_WIDTH-PAGE_MARGIN,62);ctx.textAlign='left';
  return {canvas,ctx,y:148,title};
}
function drawFooter(page,token,index,total){
  const {ctx}=page;const y=PAGE_HEIGHT-FOOTER_HEIGHT;ctx.strokeStyle=COLORS.line;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(PAGE_MARGIN,y);ctx.lineTo(PAGE_WIDTH-PAGE_MARGIN,y);ctx.stroke();ctx.fillStyle=COLORS.muted;ctx.font='400 15px Arial, sans-serif';ctx.fillText(`Versão ${APP_VERSION} · ${TEACHER}`,PAGE_MARGIN,y+31);ctx.textAlign='center';ctx.fillText(`Token: ${cleanText(token)}`,PAGE_WIDTH/2,y+31);ctx.textAlign='right';ctx.fillText(`Página ${index+1} de ${total}`,PAGE_WIDTH-PAGE_MARGIN,y+31);ctx.textAlign='left';
}
function ensureSpace(pages,page,needed,title){
  if(page.y+needed<=PAGE_HEIGHT-FOOTER_HEIGHT-28)return page;const next=createPage(title);pages.push(next);return next;
}
function drawSummaryPage(result,token){
  const page=createPage('Relatório do diagnóstico');const {ctx}=page;let y=page.y;
  ctx.fillStyle=COLORS.ink;ctx.font='700 42px Arial, sans-serif';ctx.fillText('Relatório individual de desempenho',PAGE_MARGIN,y);y+=46;ctx.fillStyle=COLORS.muted;ctx.font='400 21px Arial, sans-serif';ctx.fillText(cleanText(result.diagnosticModeLabel||'Diagnóstico de informática'),PAGE_MARGIN,y);y+=36;
  roundRect(ctx,PAGE_MARGIN,y,PAGE_WIDTH-PAGE_MARGIN*2,168,22,COLORS.white,COLORS.line,2);ctx.fillStyle=COLORS.muted;ctx.font='600 17px Arial, sans-serif';ctx.fillText('ESTUDANTE',PAGE_MARGIN+28,y+38);ctx.fillStyle=COLORS.ink;ctx.font='700 31px Arial, sans-serif';drawWrapped(ctx,result.student?.name||'Estudante',PAGE_MARGIN+28,y+78,720,36,{maxLines:2});ctx.fillStyle=COLORS.muted;ctx.font='600 17px Arial, sans-serif';ctx.fillText('TURMA',PAGE_WIDTH-360,y+38);ctx.fillStyle=COLORS.ink;ctx.font='700 27px Arial, sans-serif';ctx.fillText(CLASSES[result.selectedClass]?.label||cleanText(result.selectedClass),PAGE_WIDTH-360,y+77);ctx.fillStyle=COLORS.muted;ctx.font='400 17px Arial, sans-serif';ctx.fillText(`Realizado em ${formatDate(result.endedAt)}`,PAGE_WIDTH-360,y+116);y+=198;
  const circleX=230,circleY=y+142,r=118;ctx.beginPath();ctx.arc(circleX,circleY,r,0,Math.PI*2);ctx.fillStyle=COLORS.white;ctx.fill();ctx.lineWidth=20;ctx.strokeStyle='#dce6f4';ctx.stroke();ctx.beginPath();ctx.arc(circleX,circleY,r,-Math.PI/2,-Math.PI/2+Math.PI*2*Math.max(0,Math.min(100,result.proficiency||0))/100);ctx.strokeStyle=COLORS.blue;ctx.lineCap='round';ctx.stroke();ctx.lineCap='butt';ctx.textAlign='center';ctx.fillStyle=COLORS.ink;ctx.font='700 52px Arial, sans-serif';ctx.fillText(`${result.proficiency??0}%`,circleX,circleY+12);ctx.font='600 17px Arial, sans-serif';ctx.fillStyle=COLORS.muted;ctx.fillText('PROFICIÊNCIA',circleX,circleY+48);ctx.textAlign='left';ctx.fillStyle=COLORS.ink;ctx.font='700 33px Arial, sans-serif';drawWrapped(ctx,result.classification||'',410,y+65,700,39,{maxLines:2});ctx.fillStyle=COLORS.muted;ctx.font='400 20px Arial, sans-serif';drawWrapped(ctx,result.validity||'Válido',410,y+153,700,29,{maxLines:3});y+=306;
  const gap=16,w=(PAGE_WIDTH-PAGE_MARGIN*2-gap*3)/4;drawMetric(ctx,PAGE_MARGIN,y,w,'Acertos',`${result.correct||0}/${result.answered||0}`,COLORS.green);drawMetric(ctx,PAGE_MARGIN+w+gap,y,w,'XP motivacional',String(result.xp||0),COLORS.purple);drawMetric(ctx,PAGE_MARGIN+(w+gap)*2,y,w,'Tempo',formatDuration(result.durationSeconds),COLORS.cyan);drawMetric(ctx,PAGE_MARGIN+(w+gap)*3,y,w,'Integridade',`${result.integrity?.score??100}%`,COLORS.blue);y+=148;
  y=drawSectionTitle(ctx,'Desempenho por área',y,'Percentual ponderado de acertos em cada área avaliada.');y+=6;
  const areas=result.areas||[];for(const area of areas){ctx.fillStyle=COLORS.ink;ctx.font='600 17px Arial, sans-serif';ctx.fillText(cleanText(area.area),PAGE_MARGIN,y+20);roundRect(ctx,PAGE_MARGIN+310,y,PAGE_WIDTH-PAGE_MARGIN*2-390,24,12,'#dfe7f2');roundRect(ctx,PAGE_MARGIN+310,y,Math.max(8,(PAGE_WIDTH-PAGE_MARGIN*2-390)*(Math.max(0,Math.min(100,area.percent||0))/100)),24,12,(area.percent||0)>=70?COLORS.green:(area.percent||0)>=50?COLORS.cyan:COLORS.red);ctx.fillStyle=COLORS.ink;ctx.font='700 18px Arial, sans-serif';ctx.textAlign='right';ctx.fillText(`${area.percent||0}%`,PAGE_WIDTH-PAGE_MARGIN,y+20);ctx.textAlign='left';y+=43}
  y+=10;roundRect(ctx,PAGE_MARGIN,y,PAGE_WIDTH-PAGE_MARGIN*2,92,16,'#eef3ff','#cad8f5',2);ctx.fillStyle=COLORS.blue;ctx.font='700 17px Arial, sans-serif';ctx.fillText('VALIDAÇÃO DO RELATÓRIO',PAGE_MARGIN+24,y+31);ctx.fillStyle=COLORS.ink;ctx.font='600 19px Arial, sans-serif';ctx.fillText(cleanText(token),PAGE_MARGIN+24,y+62);if(result.teacherRelease?.authorized){ctx.fillStyle=COLORS.red;ctx.font='700 17px Arial, sans-serif';ctx.textAlign='right';ctx.fillText('LIBERAÇÃO EXCEPCIONAL DO PROFESSOR',PAGE_WIDTH-PAGE_MARGIN-24,y+48);ctx.textAlign='left'}
  page.y=y+110;return page;
}
function drawTermsPage(result){
  const page=createPage('Termos e compromisso pedagógico');const {ctx}=page;let y=page.y;
  y=drawSectionTitle(ctx,'Termo e compromisso pedagógico',y,'Comprovação resumida das regras vigentes durante a atividade.');y+=20;
  const terms=result.termsAcceptance||{};const valid=terms.status==='aceito'&&terms.recordIntegrity;
  roundRect(ctx,PAGE_MARGIN,y,PAGE_WIDTH-PAGE_MARGIN*2,132,18,valid?'#edf9f4':'#fff5f6',valid?'#b7dfcf':'#efbdc5',2);
  ctx.fillStyle=valid?COLORS.green:COLORS.red;ctx.font='700 20px Arial, sans-serif';ctx.fillText(valid?'ACEITE VALIDADO':'ACEITE NÃO VALIDADO',PAGE_MARGIN+24,y+36);
  ctx.fillStyle=COLORS.ink;ctx.font='400 18px Arial, sans-serif';drawWrapped(ctx,valid?'O registro do termo geral e das regras da atividade foi incluído na evidência.':'O resultado não contém comprovação completa de um aceite válido para esta atividade.',PAGE_MARGIN+24,y+70,PAGE_WIDTH-PAGE_MARGIN*2-48,27,{maxLines:2});
  y+=160;
  const rows=[
    ['Status',terms.status||'não validado'],['Termo geral',terms.generalTermsVersion||'não registrado'],
    ['Regras da atividade',terms.activityTermsVersion||'não registrado'],['Data do aceite',terms.acceptedAt?formatDate(terms.acceptedAt):'não registrada'],
    ['Registro geral',terms.generalAcceptanceId||'não registrado'],['Registro da atividade',terms.activityAcceptanceId||'não registrado'],
    ['Integridade do registro',terms.recordIntegrity?'verificada':'não verificada'],['Finalidade educacional',terms.educationalPurpose?'confirmada':'não registrada']
  ];
  for(let i=0;i<rows.length;i+=2){const pair=rows.slice(i,i+2);for(let j=0;j<pair.length;j++){const [label,value]=pair[j],x=PAGE_MARGIN+j*((PAGE_WIDTH-PAGE_MARGIN*2-18)/2+18),w=(PAGE_WIDTH-PAGE_MARGIN*2-18)/2;roundRect(ctx,x,y,w,92,15,COLORS.white,COLORS.line,2);ctx.fillStyle=COLORS.muted;ctx.font='600 15px Arial, sans-serif';ctx.fillText(cleanText(label).toUpperCase(),x+20,y+28);ctx.fillStyle=COLORS.ink;ctx.font='700 20px Arial, sans-serif';drawWrapped(ctx,value,x+20,y+59,w-40,25,{maxLines:2})}y+=108}
  y+=10;roundRect(ctx,PAGE_MARGIN,y,PAGE_WIDTH-PAGE_MARGIN*2,118,16,'#eef3ff','#cad8f5',2);ctx.fillStyle=COLORS.blue;ctx.font='700 17px Arial, sans-serif';ctx.fillText('AVALIAÇÃO E GAMIFICAÇÃO',PAGE_MARGIN+24,y+31);ctx.fillStyle=COLORS.ink;ctx.font='400 18px Arial, sans-serif';drawWrapped(ctx,'O XP deste relatório é somente motivacional. A nota deve considerar proficiência, evidências, participação efetiva e critérios definidos pelo professor.',PAGE_MARGIN+24,y+65,PAGE_WIDTH-PAGE_MARGIN*2-48,27,{maxLines:2});
  page.y=y+140;return page;
}

function drawRecordPage(result){
  const page=createPage('Registro e indicadores');const {ctx}=page;let y=page.y;y=drawSectionTitle(ctx,'Registro da realização',y,'Dados necessários para conferência, correção e arquivamento.');y+=18;
  const rows=[
    ['Modalidade',result.diagnosticModeLabel||''],['Turma',CLASSES[result.selectedClass]?.label||result.selectedClass],['Início',formatDate(result.startedAt)],['Término',formatDate(result.endedAt)],['Duração',formatDuration(result.durationSeconds)],['Questões previstas',String(result.totalQuestions||0)],['Questões respondidas',String(result.answered||0)],['Acertos',String(result.correct||0)],['Precisão simples',`${result.accuracy??0}%`],['Proficiência ponderada',`${result.proficiency??0}%`],['Nível avançado',`${result.advancedAccuracy??0}%`],['Áreas fortes',String(result.strongAreas??0)],['Maior sequência',String(result.maxStreak??0)],['Power-ups utilizados',String(result.powerupsUsed??0)],['Integridade',`${result.integrity?.score??100}%`],['Eventos de integridade',String(result.integrity?.events?.length||0)],['Motivo do encerramento',result.finishReason||'completed'],['Validade',result.validity||'Válido']
  ];
  for(let i=0;i<rows.length;i+=2){const pair=rows.slice(i,i+2);for(let j=0;j<pair.length;j++){const [label,value]=pair[j],x=PAGE_MARGIN+j*((PAGE_WIDTH-PAGE_MARGIN*2-18)/2+18),w=(PAGE_WIDTH-PAGE_MARGIN*2-18)/2;roundRect(ctx,x,y,w,92,15,COLORS.white,COLORS.line,2);ctx.fillStyle=COLORS.muted;ctx.font='600 15px Arial, sans-serif';ctx.fillText(cleanText(label).toUpperCase(),x+20,y+28);ctx.fillStyle=COLORS.ink;ctx.font='700 20px Arial, sans-serif';drawWrapped(ctx,value,x+20,y+59,w-40,25,{maxLines:2})}y+=108}
  if(result.teacherRelease?.authorized){roundRect(ctx,PAGE_MARGIN,y,PAGE_WIDTH-PAGE_MARGIN*2,128,18,'#fff3e8','#f0b36b',2);ctx.fillStyle='#9a4d00';ctx.font='700 19px Arial, sans-serif';ctx.fillText('LIBERAÇÃO ANTECIPADA AUTORIZADA',PAGE_MARGIN+24,y+34);ctx.fillStyle=COLORS.ink;ctx.font='400 18px Arial, sans-serif';drawWrapped(ctx,result.teacherRelease.note||'Resultado liberado pelo professor em situação excepcional.',PAGE_MARGIN+24,y+67,PAGE_WIDTH-PAGE_MARGIN*2-48,26,{maxLines:2});ctx.fillStyle=COLORS.muted;ctx.font='400 16px Arial, sans-serif';ctx.fillText(`Autorizado em ${formatDate(result.teacherRelease.at)}`,PAGE_MARGIN+24,y+108);y+=150}
  const events=result.integrity?.events||[];roundRect(ctx,PAGE_MARGIN,y,PAGE_WIDTH-PAGE_MARGIN*2,82,14,events.length?'#fff5f6':'#edf9f4',events.length?'#efbdc5':'#b7dfcf',2);ctx.fillStyle=events.length?COLORS.red:COLORS.green;ctx.font='700 18px Arial, sans-serif';ctx.fillText(events.length?`${events.length} evento(s) de integridade registrado(s) no anexo.`:'Nenhum evento de integridade registrado.',PAGE_MARGIN+22,y+48);y+=100;
  page.y=y;return page;
}
function drawIntegrityPages(result,pages){
  const events=result.integrity?.events||[];if(!events.length)return;let page=createPage('Eventos de integridade');pages.push(page);let y=drawSectionTitle(page.ctx,'Eventos de integridade',page.y,'Registro automático de troca de aba, cópia, colagem, atalhos e outras ocorrências.');y+=14;
  events.forEach((event,index)=>{const h=92;if(y+h>PAGE_HEIGHT-FOOTER_HEIGHT-24){page.y=y;page=createPage('Eventos de integridade');pages.push(page);y=page.y}roundRect(page.ctx,PAGE_MARGIN,y,PAGE_WIDTH-PAGE_MARGIN*2,h,14,COLORS.white,COLORS.line,2);page.ctx.fillStyle=COLORS.red;page.ctx.font='700 16px Arial, sans-serif';page.ctx.fillText(`${index+1}. ${cleanText(event.type).toUpperCase()}`,PAGE_MARGIN+22,y+30);page.ctx.fillStyle=COLORS.ink;page.ctx.font='400 17px Arial, sans-serif';drawWrapped(page.ctx,event.detail||'',PAGE_MARGIN+22,y+60,PAGE_WIDTH-PAGE_MARGIN*2-260,23,{maxLines:2});page.ctx.fillStyle=COLORS.muted;page.ctx.textAlign='right';page.ctx.fillText(formatDate(event.at),PAGE_WIDTH-PAGE_MARGIN-20,y+52);page.ctx.textAlign='left';y+=h+14});page.y=y;
}
function answerBlockHeight(ctx,answer){
  ctx.font='700 20px Arial, sans-serif';const q=splitText(ctx,answer.question||'',PAGE_WIDTH-PAGE_MARGIN*2-56).length;ctx.font='400 17px Arial, sans-serif';const c=splitText(ctx,`Resposta do aluno: ${answer.choice||''}`,PAGE_WIDTH-PAGE_MARGIN*2-56).length;const r=splitText(ctx,`Resposta correta: ${answer.correctAnswer||''}`,PAGE_WIDTH-PAGE_MARGIN*2-56).length;const e=splitText(ctx,answer.explanation||'',PAGE_WIDTH-PAGE_MARGIN*2-56).length;return 92+q*28+c*24+r*24+Math.min(e,4)*24+24;
}
function drawAnswer(ctx,answer,index,y){
  const h=answerBlockHeight(ctx,answer);roundRect(ctx,PAGE_MARGIN,y,PAGE_WIDTH-PAGE_MARGIN*2,h,18,COLORS.white,answer.correct?'#a8dfca':'#f1b5bf',2);ctx.fillStyle=answer.correct?COLORS.green:COLORS.red;roundRect(ctx,PAGE_MARGIN+20,y+20,96,34,17,answer.correct?'#e5f7f0':'#fdecef');ctx.font='700 15px Arial, sans-serif';ctx.fillText(answer.correct?'CORRETA':'REVISAR',PAGE_MARGIN+34,y+43);ctx.fillStyle=COLORS.muted;ctx.font='600 15px Arial, sans-serif';ctx.fillText(`${index+1}. ${cleanText(answer.area||'Questão')} · ${cleanText(answer.difficulty||'')}`,PAGE_MARGIN+132,y+43);let cy=y+80;ctx.fillStyle=COLORS.ink;ctx.font='700 20px Arial, sans-serif';cy+=drawWrapped(ctx,answer.question||'',PAGE_MARGIN+28,cy,PAGE_WIDTH-PAGE_MARGIN*2-56,28).height+10;ctx.font='400 17px Arial, sans-serif';ctx.fillStyle=COLORS.ink;cy+=drawWrapped(ctx,`Resposta do aluno: ${answer.choice||''}`,PAGE_MARGIN+28,cy,PAGE_WIDTH-PAGE_MARGIN*2-56,24).height+7;ctx.fillStyle=COLORS.green;cy+=drawWrapped(ctx,`Resposta correta: ${answer.correctAnswer||''}`,PAGE_MARGIN+28,cy,PAGE_WIDTH-PAGE_MARGIN*2-56,24).height+9;ctx.fillStyle=COLORS.muted;drawWrapped(ctx,answer.explanation||'',PAGE_MARGIN+28,cy,PAGE_WIDTH-PAGE_MARGIN*2-56,24,{maxLines:4});return h;
}
function drawAnswerPages(result,pages){
  let page=createPage('Revisão das respostas');pages.push(page);let y=drawSectionTitle(page.ctx,'Revisão detalhada',page.y,'Cada item apresenta a resposta do aluno, a solução correta e a justificativa.');y+=14;const answers=result.answers||[];
  if(!answers.length){roundRect(page.ctx,PAGE_MARGIN,y,PAGE_WIDTH-PAGE_MARGIN*2,90,16,COLORS.white,COLORS.line,2);page.ctx.fillStyle=COLORS.muted;page.ctx.font='600 19px Arial, sans-serif';page.ctx.fillText('Nenhuma resposta foi registrada antes do encerramento.',PAGE_MARGIN+24,y+52);page.y=y+110;return}
  answers.forEach((answer,index)=>{const needed=answerBlockHeight(page.ctx,answer)+18;if(y+needed>PAGE_HEIGHT-FOOTER_HEIGHT-24){page.y=y;page=createPage('Revisão das respostas');pages.push(page);y=page.y}y+=drawAnswer(page.ctx,answer,index,y)+18});page.y=y;
}
async function canvasToJpegBytes(canvas){
  const blob=await new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new Error('Falha ao gerar a página do PDF.')),'image/jpeg',0.9));return new Uint8Array(await blob.arrayBuffer());
}
function asciiBytes(text){return new TextEncoder().encode(text)}
function concatBytes(parts){const size=parts.reduce((sum,p)=>sum+p.length,0),out=new Uint8Array(size);let offset=0;for(const p of parts){out.set(p,offset);offset+=p.length}return out}
export function buildImagePdf(images){
  const pageCount=images.length;const objects=[];const catalogId=1,pagesId=2;let nextId=3;const pageIds=[];
  for(let i=0;i<pageCount;i++){const imageId=nextId++,contentId=nextId++,pageId=nextId++;pageIds.push(pageId);const image=images[i];const imageHead=asciiBytes(`<< /Type /XObject /Subtype /Image /Width ${RASTER_WIDTH} /Height ${RASTER_HEIGHT} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${image.length} >>\nstream\n`);objects[imageId]=concatBytes([imageHead,image,asciiBytes('\nendstream')]);const content=asciiBytes(`q\n595.28 0 0 841.89 0 0 cm\n/Im${i+1} Do\nQ`);objects[contentId]=concatBytes([asciiBytes(`<< /Length ${content.length} >>\nstream\n`),content,asciiBytes('\nendstream')]);objects[pageId]=asciiBytes(`<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 595.28 841.89] /Resources << /XObject << /Im${i+1} ${imageId} 0 R >> >> /Contents ${contentId} 0 R >>`)}
  objects[catalogId]=asciiBytes(`<< /Type /Catalog /Pages ${pagesId} 0 R >>`);objects[pagesId]=asciiBytes(`<< /Type /Pages /Count ${pageCount} /Kids [${pageIds.map(id=>`${id} 0 R`).join(' ')}] >>`);
  const header=asciiBytes('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n');const chunks=[header];const offsets=new Array(objects.length).fill(0);let position=header.length;
  for(let i=1;i<objects.length;i++){offsets[i]=position;const chunk=concatBytes([asciiBytes(`${i} 0 obj\n`),objects[i],asciiBytes('\nendobj\n')]);chunks.push(chunk);position+=chunk.length}
  const xrefOffset=position;let xref=`xref\n0 ${objects.length}\n0000000000 65535 f \n`;for(let i=1;i<objects.length;i++)xref+=`${String(offsets[i]).padStart(10,'0')} 00000 n \n`;xref+=`trailer\n<< /Size ${objects.length} /Root ${catalogId} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;chunks.push(asciiBytes(xref));return concatBytes(chunks);
}
export async function buildResultPDFBlob(result){
  const token=result.validationToken||await createValidationToken(result);const pages=[drawSummaryPage(result,token),drawRecordPage(result),drawTermsPage(result)];drawIntegrityPages(result,pages);drawAnswerPages(result,pages);pages.forEach((page,index)=>drawFooter(page,token,index,pages.length));const images=[];for(const page of pages)images.push(await canvasToJpegBytes(page.canvas));return new Blob([buildImagePdf(images)],{type:'application/pdf'});
}
export async function downloadResultPDF(result,filename){
  const blob=await buildResultPDFBlob(result);downloadBlob(blob,filename||`resultado-${safeName(result.student?.name)}.pdf`);
}
