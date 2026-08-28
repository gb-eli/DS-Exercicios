import assert from 'node:assert/strict';
import {buildWorkbook,setCellInput,getCellValue,evaluateFormula,visibleRowIndexes,selectedRefs,columnName,parseCellRef} from '../assets/js/spreadsheet-engine.js';

const book=buildWorkbook(['Item','Setor','Quantidade','Situação'],[
  ['Toner','TI','12','Pendente'],
  ['Papel','Secretaria','30','Concluído'],
  ['Crachá','RH','8','Pendente']
]);
assert.equal(columnName(0),'A');assert.equal(columnName(27),'AB');assert.deepEqual(parseCellRef('C12'),{col:2,row:11});
setCellInput(book,'E1','=SOMA(C2:C4)');assert.equal(getCellValue(book,'E1'),50);
setCellInput(book,'E2','=MÉDIA(C2:C4)');assert.equal(getCellValue(book,'E2'),50/3);
setCellInput(book,'E3','=SE(C2>10;"Repor";"Ok")');assert.equal(getCellValue(book,'E3'),'Repor');
setCellInput(book,'E4','=CONT.SE(D2:D4;"Pendente")');assert.equal(getCellValue(book,'E4'),2);
book.filter={col:3,value:'Pendente'};assert.deepEqual(visibleRowIndexes(book),[1,3]);
book.sort={col:2,dir:'desc'};assert.deepEqual(visibleRowIndexes(book),[1,3]);
assert.deepEqual(selectedRefs({anchor:'A1',focus:'B2'}),['A1','B1','A2','B2']);
assert.equal(evaluateFormula(book,'=C2+C3'),42);

// Regressões de edição e fórmulas com comportamento mais próximo do Google Planilhas.
const mixed=buildWorkbook(['Valor'],[['10'],['texto'],['20'],['']]);
assert.equal(evaluateFormula(mixed,'=MÉDIA(A2:A5)'),15,'MÉDIA deve ignorar texto e células vazias');
assert.equal(evaluateFormula(mixed,'=SOMA(1,5;2,5)'),4,'fórmula em pt-BR deve aceitar vírgula decimal com ponto e vírgula entre argumentos');
assert.equal(evaluateFormula(mixed,'=SUM(1,2)'),3,'função em inglês deve aceitar vírgula entre argumentos');
setCellInput(mixed,'B2','Produto 2');
setCellInput(mixed,'B3','Produto 10');
mixed.sort={col:1,dir:'asc'};
assert.deepEqual(visibleRowIndexes(mixed).slice(0,2),[1,2],'texto com algarismos deve continuar sendo ordenado como texto natural');

console.log('spreadsheet-engine: ok');
