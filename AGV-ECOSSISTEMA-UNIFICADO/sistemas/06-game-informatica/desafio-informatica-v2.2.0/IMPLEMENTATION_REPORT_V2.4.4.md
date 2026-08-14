# Relatório de implementação — v2.4.4

## Escopo aprovado

Fase 2 da auditoria: avaliação mais flexível e realista, preservando a confiabilidade da v2.4.3 e as Aulas 1 e 2 já aplicadas no 1º ADM.

## Implementações

- novo motor de fluxo empresarial baseado em tarefas e dependências;
- diferentes ordens válidas para executar uma mesma operação administrativa;
- distinção entre exploração, repetição, bloqueio por dependência e decisão realmente incorreta;
- navegação e exploração válidas sem redução automática do desempenho;
- orientações sobre pré-requisitos sem revelar a solução da avaliação;
- uso do motor completo de planilha dentro das avaliações e recuperações;
- uso do motor completo de documentos, comentários, versões, Drive e PDF;
- integração real dos artefatos: Documento → PDF → Downloads/Drive → seletor do correio;
- validação de permissão quando o aluno envia um link restrito;
- correio empresarial completo nas quatro operações avaliativas;
- checkpoint do fluxo, da planilha, do documento, dos arquivos, do e-mail e das decisões;
- migração de checkpoints antigos baseados em sequência rígida;
- novos indicadores de exploração, tentativas bloqueadas e decisões inválidas;
- atualização das avaliações e recuperações do 1º e 2º ADM para a revisão curricular v2.4.4.

## Modelo pedagógico

A avaliação não exige mais que todas as ações sejam executadas em uma única sequência. Após compreender o briefing, o estudante pode trabalhar em planilha, RH, documentos, segurança e infraestrutura conforme as dependências reais da operação.

Exemplos de dependências preservadas:

- o PDF só pode ser exportado depois da preparação do documento;
- o arquivo só pode ser anexado depois de ser gerado;
- o envio só é concluído depois da revisão do destinatário, do anexo e das permissões;
- a aprovação de RH depende da identificação da divergência;
- o encerramento depende das evidências obrigatórias.

## Compatibilidade

- as Aulas 1 e 2 do 1º ADM permanecem com identidade e progresso preservados;
- os dados da v2.4.3 são mantidos;
- checkpoints das avaliações anteriores são convertidos para o novo grafo quando possível;
- contas, retenção de 10 dias, backup e checkpoint redundante continuam ativos;
- o caminho público continua `desafio-informatica-agv-v2.2.0`.

## Limitações

O Chromium administrado do ambiente de desenvolvimento não concluiu a validação visual automatizada por problemas de inicialização/DBus. A suíte de lógica, estados, persistência, sintaxe e integração passou integralmente. Recomenda-se a conferência final no GitHub Pages em celular e notebook após a publicação.
