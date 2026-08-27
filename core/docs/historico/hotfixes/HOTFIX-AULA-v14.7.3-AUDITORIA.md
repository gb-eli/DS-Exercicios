# Hotfix aula v14.7.3 — auditoria de liberação

## Correções imediatas
- rolagem do Admin endurecida para notebook/mobile;
- dialogs do Admin agora possuem rolagem própria segura;
- starter HTML passa a apontar para o CSS/JS real do exercício (`estilo.css` ou `style.css`);
- conclusão exige conteúdo significativo em todos os arquivos definidos; comentário isolado não conta como entrega;
- exercícios sem cobertura integral do validador não podem virar falso `Concluído`: o trabalho é salvo e fica para validação do professor;
- em notebooks de 1101–1280 px, editor e Preview/Terminal ficam lado a lado quando Orientações estão recolhidas.

## Auditoria
- todos os JS do pacote passam em `node --check`;
- referências locais das páginas raiz/Atividades/Admin/Professor/Lobby existem;
- IDs duplicados não foram encontrados nas páginas principais;
- 3DS 01–03 possuem validação HTML estrutural suportada no cliente;
- os validadores antigos de parte do 2DS/SUB ainda usam formatos que o validador unificado não executa integralmente. Por segurança, esses exercícios não recebem conclusão automática até a migração.

## Limite conhecido
A validação final antifraude ainda deve ser movida para backend. Esta versão evita falso positivo óbvio no frontend, mas não transforma o validador público em autoridade de nota.
