import assert from 'node:assert/strict';

class FakeContext{
  scale(){} fillRect(){} beginPath(){} moveTo(){} lineTo(){} arcTo(){} closePath(){} fill(){} stroke(){} arc(){} fillText(){}
  measureText(text){return {width:String(text??'').length*9}}
  set fillStyle(v){} set strokeStyle(v){} set lineWidth(v){} set font(v){} set textAlign(v){} set lineCap(v){}
}
class FakeCanvas{
  constructor(){this.width=0;this.height=0;this.ctx=new FakeContext()}
  getContext(){return this.ctx}
  toBlob(callback,type){callback(new Blob([new Uint8Array([0xff,0xd8,0xff,0xd9])],{type:type||'image/jpeg'}))}
}
globalThis.document={createElement(tag){if(tag==='canvas')return new FakeCanvas();throw new Error(`Elemento inesperado: ${tag}`)}};

const {buildResultPDFBlob}=await import('../assets/js/result-pdf.js');
const {buildCompletionPDFBlob}=await import('../assets/js/completion-pdf.js');
const termsAcceptance={status:'aceito',generalTermsVersion:'1.0.0',activityTermsVersion:'1.0.0',acceptedAt:'2026-07-30T21:00:00.000Z',generalAcceptanceId:'general123456',activityAcceptanceId:'activity1234',recordIntegrity:true,educationalPurpose:true};
const answers=Array.from({length:66},(_,i)=>({questionId:`q${i+1}`,area:'Planilhas',difficulty:i%3===0?'advanced':'basic',type:'single',question:`Questão ${i+1} com enunciado de teste para validar paginação e quebra de texto.`,choice:'Resposta do aluno',correctAnswer:'Resposta correta',correct:i%2===0,explanation:'Explicação pedagógica da resposta e orientação de revisão.',at:'2026-07-30T21:00:00.000Z'}));
const result={kind:'agv-diagnostic-result',id:'result-pdf-test',version:'2.2.2',student:{id:'student',name:'Aluno Teste',classId:'1ADM'},diagnosticMode:'general',diagnosticModeLabel:'Diagnóstico geral',selectedClass:'1ADM',startedAt:'2026-07-30T20:30:00.000Z',endedAt:'2026-07-30T21:00:00.000Z',durationSeconds:1800,totalQuestions:66,answered:66,correct:33,accuracy:50,proficiency:55,classification:'Adequado',validity:'Válido',advancedAccuracy:50,strongAreas:1,xp:330,maxStreak:4,powerupsUsed:0,finishReason:'completed',integrity:{score:100,events:[]},areas:[{area:'Planilhas',percent:55}],answers,termsAcceptance,delivery:{}};
const resultBlob=await buildResultPDFBlob(result);assert.equal(resultBlob.type,'application/pdf');const resultText=Buffer.from(await resultBlob.arrayBuffer()).toString('latin1');const resultPages=(resultText.match(/\/Type \/Page\b/g)||[]).length;assert.ok(resultPages>=5,`Esperadas várias páginas, obtidas ${resultPages}`);assert.ok(resultText.startsWith('%PDF-1.4'));

const completion={kind:'agv-guided-completion',id:'completion-test',version:'2.2.2',student:{id:'student',name:'Aluno Teste'},classId:'1ADM',lessonId:'1ADM-01',lessonOrder:1,lessonTitle:'Aula de teste',startedAt:'2026-07-30T20:30:00.000Z',endedAt:'2026-07-30T21:00:00.000Z',durationSeconds:1800,minimumRequiredSeconds:1500,minimumMet:true,interactions:8,accuracy:90,teacherRelease:null,stages:[{index:1,title:'Introdução',type:'explain',completed:true,completedAt:'2026-07-30T20:35:00.000Z',actions:2}],activityLog:Array.from({length:30},(_,i)=>({id:`a${i}`,type:i===0?'session_started':i===29?'lesson_completed':'answer_submitted',label:`Ação ${i+1}`,detail:'Registro de atividade para validar a paginação do comprovante.',at:`2026-07-30T20:${String(30+Math.min(i,29)).padStart(2,'0')}:00.000Z`,stageIndex:0,correct:i%2===0})),answers:[],assessmentProfile:{reviewRequired:true,automaticGradeConversion:false,overall:82,level:'Proficiente',criteria:[{id:'aplicacao-pratica',label:'Aplicação prática',score:86},{id:'resolucao-problemas',label:'Resolução de problemas',score:78},{id:'comunicacao',label:'Comunicação e documentos',score:90},{id:'evidencia',label:'Qualidade da evidência',score:84},{id:'uso-responsavel',label:'Uso responsável',score:72}],note:'Indicadores para revisão humana.'},termsAcceptance};
const completionBlob=await buildCompletionPDFBlob(completion);assert.equal(completionBlob.type,'application/pdf');const completionText=Buffer.from(await completionBlob.arrayBuffer()).toString('latin1');const completionPages=(completionText.match(/\/Type \/Page\b/g)||[]).length;assert.ok(completionPages>=5,`Esperadas pelo menos 5 páginas no comprovante com indicadores, obtidas ${completionPages}`);assert.ok(completionText.startsWith('%PDF-1.4'));

console.log(`Estrutura de PDF aprovada: diagnóstico com ${resultPages} páginas e comprovante com ${completionPages} páginas.`);
