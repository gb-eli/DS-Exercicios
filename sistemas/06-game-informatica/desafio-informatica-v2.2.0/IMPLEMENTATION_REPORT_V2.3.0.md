# Relatório de implementação — v2.3.0

Data: 03/08/2026

## Objetivo

Elevar a experiência das aulas, avaliações e recuperações para situações administrativas realistas, coerentes com o curso de Administração e com a disciplina de Informática Empresarial.

## Mudança central

As avaliações deixaram de funcionar como uma sequência de laboratórios desconectados. Elas agora utilizam um desktop empresarial integrado, no qual o estudante recebe uma demanda, consulta e-mail e anexos, trabalha em planilha, confere RH, produz documento, configura permissões, usa segurança e encerra a operação com evidências.

## Casos implementados

- 1ADM-07: capacitação interna;
- 1ADM-08: regularização do setor;
- 2ADM-04: implantação de núcleo administrativo;
- 2ADM-05: continuidade operacional.

Cada recuperação possui cenário, dados e percurso diferentes da avaliação correspondente.

## Ferramentas

- correio corporativo simulado com solicitação, anexo, resposta e PDF;
- planilha com menus, fórmula, filtro, ordenação, validação e contagem de registros;
- estação de RH com jornada e divergência;
- editor de documentos com título, data, permissões e PDF;
- estação 3D/360 leve com rotação, vista explodida, SSD e impressora;
- central de segurança com 2FA e bloqueio de acesso suspeito;
- painel com KPIs, fila da operação, progresso e trilha de auditoria.

## Avaliação

O sistema gera indicadores de aplicação prática, resolução de problemas, comunicação, evidência e uso responsável. Esses indicadores não representam nota automática e devem ser revisados pelo professor. O PDF registra uma página específica da avaliação prática.

## Compatibilidade

- Aulas 1 e 2 do 1º ADM preservadas;
- 2º ADM continua com trilha integralmente reformulada;
- esquema de dados: 16;
- cache: `desafio-informatica-agv-2.3.0-r20`;
- pasta pública preservada: `desafio-informatica-agv-v2.2.0`.

## Testes

- suíte completa `npm test` aprovada;
- 13 aulas e 35 arquivos JavaScript;
- 19 testes EduAuth e 6 testes dos geradores;
- PDF diagnóstico com 14 páginas e comprovante com 7 páginas no teste;
- 100 questões guiadas equilibradas em A, B, C e D;
- teste específico das quatro operações empresariais;
- teste de rubrica com pesos totalizando 100 e revisão humana obrigatória.

## Limitações honestas

As ferramentas são simulações educacionais. Não acessam Gmail, Google Planilhas, Google Docs, folha de pagamento real ou dados de empresas. A representação 3D foi otimizada para dispositivos escolares e não utiliza modelos WebGL fotorealistas pesados.
