# Relatório de implementação — GameInformática v2.5.0

## Objetivo da versão

A versão 2.5.0 reorganiza autenticação, tempo, conclusão, persistência e currículo do Modo Guiado para Informática Empresarial no curso de Administração.

## Regras de acesso

- Cada aula possui uma senha fixa de oito dígitos.
- A senha é específica para a combinação turma + aula e não muda com data ou horário.
- O Painel do Professor protegido apresenta a senha da aula selecionada.
- A liberação antecipada do resultado ou do comprovante usa um único código coletivo de oito dígitos.
- O código coletivo é comum a todos os alunos da turma e muda de acordo com turma, data e hora atual.
- O código coletivo vale apenas na hora correspondente.
- A senha mestre do painel continua protegida por PBKDF2-HMAC-SHA-256; não é armazenada em texto aberto.

## Tempos

- Tempo automático para liberar o PDF da aula guiada: 12 minutos e 30 segundos.
- Tempo mínimo do teste/diagnóstico: 15 minutos.
- O tempo de leitura antes de responder às questões foi reduzido em 50%.
- A duração pedagógica típica das aulas continua planejada para 15–25 minutos.

## Correção do fluxo de conclusão

A atividade é marcada como concluída imediatamente após a última etapa válida.

O registro salvo inclui:

- `completed: true`;
- horário real de conclusão;
- etapa final;
- respostas e atividades;
- tempo ativo;
- horário absoluto de liberação do PDF;
- estado de entrega.

Quando o tempo necessário ainda não foi atingido, somente o botão de gerar PDF permanece bloqueado. O aluno pode sair, fechar a guia e retornar. O horário absoluto fica salvo no perfil e no checkpoint redundante.

O comprovante distingue:

- conclusão da atividade;
- liberação automática do PDF pelo horário salvo;
- liberação antecipada do PDF pelo código coletivo do professor.

A liberação do PDF não altera artificialmente o campo de tempo mínimo cumprido.

## Persistência e retomada

Foram preservados e reforçados:

- IndexedDB criptografado;
- checkpoint redundante local;
- retenção renovável de 10 dias;
- recuperação após falha temporária do IndexedDB;
- estado concluído aguardando PDF;
- tempo de sessão e horário absoluto;
- progresso das ferramentas;
- teste/diagnóstico em andamento;
- troca de perfil e logout.

O teste salva questões, respostas, índice atual e horário de início. Reabrir a plataforma não reinicia o tempo.

## Ferramentas e janelas

As ferramentas práticas e janelas de apoio podem ser fechadas e reabertas. A regra cobre:

- planilha;
- fórmulas;
- correio eletrônico;
- documentos e PDF;
- apresentações;
- painéis de ajuda.

O gráfico da planilha pode ser fechado e sua remoção é persistida, evitando sobreposição em atividades posteriores.

O botão `Preciso de ajuda` fornece explicações progressivas e detalhadas sem entregar a resposta.

## Currículo

### 1º ADM

As Aulas 1, 2 e 3 estão congeladas em conteúdo por já terem sido aplicadas. Recebem somente correções de estabilidade, progresso, tempo e interface.

1. Criando, organizando e compartilhando planilhas — preservada.
2. Formatação profissional de planilhas — preservada.
3. Cálculos administrativos básicos — preservada.
4. Fórmulas administrativas para RH e financeiro.
5. Gmail, Drive e envio profissional de documentos.
6. Google Apresentações aplicado à Administração.
7. Avaliação prática integrada.
8. Recuperação prática diferenciada.

### 2º ADM

1. Rotina administrativa com planilhas, fórmulas e comunicação.
2. Fórmulas para RH e financeiro.
3. Gmail, documentos, PDF e apresentações.
4. Avaliação integrada.
5. Recuperação diferenciada.

As trilhas atuais não exigem hardware, jogos, 3D ou 360°. O foco é Informática Empresarial: planilhas, fórmulas, RH, financeiro, Gmail, Drive, documentos, PDF, apresentações, compartilhamento e comunicação profissional.

## Questões

- 65 questões guiadas auditadas.
- Distribuição das corretas: A=17, B=16, C=16 e D=16.
- 0% de pista significativa pela maior alternativa.
- 68 questões diagnósticas auditadas.
- Distribuição diagnóstica: 17 em cada posição.
- 0% de pista significativa pelo tamanho.

## Cache e publicação

- Versão: 2.5.0.
- Esquema de dados: 23.
- Cache: `desafio-informatica-agv-2.5.0-r30`.
- A pasta pública permanece `desafio-informatica-agv-v2.2.0` para preservar os links existentes.

## Limitação técnica conhecida

O projeto continua hospedável no GitHub Pages. A proteção do painel reduz acesso casual, mas autenticação institucional completa exigiria backend ou provedor externo. As ferramentas Google são simulações educacionais e não acessam contas reais.
