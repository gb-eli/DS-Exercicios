# Segurança do CTF DS

## Arquitetura

Aplicação estática para GitHub Pages. Perfis são cifrados no navegador com AES-GCM e chave protegida por PBKDF2. EduAuth Offline usa provisionamento de desenvolvimento até a geração das chaves definitivas.

## Carteira

Moedas, XP, estrelas, itens e emblemas são derivados de um ledger encadeado. Cada transação possui sequência, nonce, hash, tag de integridade, saldos anterior/posterior e origem. Divergências bloqueiam compras e recompensas.

## XSS e importação

- Conteúdo do usuário é exibido com escape;
- CSP restringe scripts a arquivos locais;
- URLs aceitam apenas HTTP/HTTPS;
- Backups têm limite de tamanho e schema;
- Chaves `__proto__`, `constructor` e `prototype` são rejeitadas;
- Não há `eval` ou execução de código importado.

## Limitações

Um usuário com controle completo do navegador pode alterar o ambiente em execução. O objetivo é impedir adulterações casuais, detectar inconsistências e não premiar estados incoerentes. Isso não equivale a uma autoridade de servidor.

## Relato responsável

Interrompa a exploração e informe módulo, versão, navegador, dispositivo, passos e resultado observado ao professor. Não inclua senhas ou dados pessoais.
