# Relatório de implementação — v2.2.9

Data: 03/08/2026

## Objetivo da fase

Criar ambientes administrativos especializados e corrigir a regra curricular: somente as Aulas 1 e 2 do 1º ADM já foram aplicadas; o 2º ADM começa com uma trilha totalmente reformulada.

## Currículo

### 1º ADM

- Aulas 1 e 2 preservadas com a revisão `2026T2-preserved`;
- Aulas 3 a 8 migradas para `2026T2-admin-v229`;
- cálculos administrativos, RH, documentos/PDF, hardware e segurança;
- avaliação integrada e recuperação com cenário diferente.

### 2º ADM

Todas as aulas usam `2026T2-admin2-v229`:

1. estação administrativa digital e arquitetura do computador;
2. RH, gestão de pessoas e análise financeira aplicada;
3. documentos, PDF, colaboração e comunicação gerencial;
4. avaliação prática de operação administrativa integrada;
5. recuperação prática de continuidade operacional.

Nenhum checkpoint de uma revisão anterior do 2º ADM é reaproveitado como se correspondesse à nova aula.

## Laboratório de hardware 3D/360

- rotação por botões e gesto de arrastar;
- vista explodida;
- CPU, RAM, SSD e placa-mãe;
- monitor, teclado, mouse, scanner e impressora;
- missão contextual, progresso e feedback;
- registro das ações e tentativas;
- representação CSS 3D adaptativa, sem dependência WebGL pesada.

## Estação de RH

- jornada fictícia e identificação de divergência;
- entrada de horas adicionais e ausências;
- cálculo educacional de proventos e descontos;
- demonstrativo simplificado e confirmação de valor líquido;
- nomes e valores fictícios;
- aviso de ausência de validade trabalhista ou contábil.

## Central de documentos

- título, negrito, centralização, lista, data e responsável;
- permissões Leitor, Comentador e Editor;
- exportação PDF simulada;
- integração com e-mail administrativo simulado;
- checkpoints e auditoria de ações.

## Experiência e responsividade

- layouts específicos para celular, tablet, notebook e desktop;
- controles com áreas de toque adequadas;
- componentes que reduzem escala em telas pequenas;
- suporte a movimento reduzido;
- conteúdo textual em DOM para preservar acessibilidade e desempenho.

## Segurança e dados

- `APP_VERSION`: 2.2.9;
- `DATA_SCHEMA_VERSION`: 15;
- cache: `desafio-informatica-agv-2.2.9-r19`;
- senha mestre continua representada somente por salt e verificador PBKDF2;
- nenhum dado real é solicitado pelos novos simuladores.

## Testes

Passaram:

- validação estática;
- termos e segurança;
- PDFs;
- EduAuth Core;
- geradores do professor;
- qualidade das questões;
- retomada e tempo;
- contas e termos assistidos;
- laboratórios práticos;
- plano curricular.

Resultado da auditoria guiada: 100 questões, 25 respostas corretas em cada posição e 0% de pista significativa pela alternativa mais longa.

## Limitação visual

A política administrativa do Chromium bloqueou o carregamento de `localhost`. A verificação completa no navegador deve ser repetida no GitHub Pages após a publicação. Essa limitação não afetou os testes de sintaxe, estrutura, estado, currículo ou lógica dos laboratórios.
