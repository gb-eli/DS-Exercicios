# Relatório de testes — CTF DS v2.2.0

## Testes automatizados executados

- 68 missões, pré-requisitos e renderização estrutural;
- dez aulas, 25 dossiês, 15 casos, oito carreiras e 13 ferramentas;
- tutoriais, gaveta, mapa de campanha e evidências;
- EduAuth coletivo, sessão, assinatura, escopo, expiração, consumo e tentativas;
- PBKDF2, AES-GCM, backup, bloqueio, alteração de senha e recuperação;
- migração do perfil para schema 4;
- ledger encadeado, saldos disponível/em análise/bloqueado;
- compra, item já possuído, recibo e reconciliação;
- alteração de milhões de moedas, inventário inserido e cadeia modificada;
- bloqueio persistente e liberação somente por revisão registrada;
- aceite dos termos, hash, evidência e escopo autorizado;
- escape de HTML, URL `javascript:` e chaves de poluição de protótipo;
- arquivos do Service Worker, imports e documentação obrigatória.

## Verificação visual em Chromium

Foi realizada uma inspeção isolada equivalente em 1366×768 e 390×844, cobrindo:

- termo obrigatório;
- navegação após aceite;
- loja e três saldos;
- abertura de missão;
- escopo autorizado;
- gaveta de ferramentas;
- ausência de erros no console;
- ausência de rolagem horizontal indevida.

O ambiente bloqueia navegação automatizada para endereços locais. Por isso, a interface foi carregada com os mesmos módulos estáticos por interceptação local; criptografia e IndexedDB foram validados separadamente pelos testes automatizados.

## Validação após publicação

Ainda deve ser conferido no endereço real do GitHub Pages:

- Chrome/Edge em computador escolar;
- Chrome e Brave no Android;
- Firefox quando disponível;
- download e compartilhamento de evidência;
- atualização do Service Worker;
- modo offline após o primeiro carregamento;
- políticas específicas de armazenamento dos equipamentos da escola.
