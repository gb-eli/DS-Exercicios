# Relatório de implementação — v2.2.7

Data: 03/08/2026

## Objetivo

Diversificar as aulas guiadas e reduzir repetição por meio de experiências práticas de escritório, comunicação e segurança digital, preservando progresso, logs, PDF, tutorial e funcionamento estático no GitHub Pages.

## Entregas

- laboratório de planilha com ações de formatação, filtro, ordenação, congelamento, gráfico e compartilhamento;
- Correio AGV simulado, com composição, anexo, checklist e envio fictício;
- Central de Segurança simulada para autenticação em dois fatores;
- Aula 8 e Aula 9 para o 1º ADM;
- Aula 4 para o 2º ADM, com maior autonomia e complexidade;
- HUD de aprendizagem com acertos, ajustes, tentativas, dicas e domínio estimado;
- animação de preparação da evidência e do comprovante;
- contextos administrativos do AGV, Paranaguá, RH, financeiro e logística portuária simulada;
- checkpoints específicos para cada novo laboratório;
- layout adaptativo entre 320 px e desktop.

## Segurança pedagógica

Nenhum simulador envia e-mail real, acessa conta externa ou solicita credenciais verdadeiras. Os códigos temporários são gerados apenas para a atividade local. Endereços e dados de empresas são fictícios quando usados em cenários de prática.

## Compatibilidade

As etapas antigas mantêm a mesma ordem. As novas experiências foram adicionadas antes dos desafios finais de aulas selecionadas e como novas aulas, reduzindo risco de corrupção dos checkpoints existentes. Perfis concluídos permanecem reconhecidos pelo histórico salvo.

## Testes

- 13 aulas validadas;
- 35 arquivos JavaScript;
- 19 testes EduAuth;
- 6 testes dos geradores do professor;
- PDF e segurança aprovados;
- 269 questões guiadas, posições 68/67/67/67;
- pista significativa de tamanho: 4,1% no guiado e 0% no diagnóstico;
- teste específico dos laboratórios de planilha, e-mail, 2FA, métricas e responsividade.

## Limitação visual do ambiente

O navegador automatizado do ambiente bloqueia endereços locais e `file://`. A validação foi feita por sintaxe, estrutura, testes automatizados e renderização isolada dos componentes. Recomenda-se conferência final no endereço real do GitHub Pages.
