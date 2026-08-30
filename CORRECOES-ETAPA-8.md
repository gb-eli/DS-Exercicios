# Correções — Etapa 8

## Escopo

Fullscreen Global do aluno. Nenhuma alteração de banco, Edge Function, CTF, Admin, Lobby 3D ou regra pedagógica.

## Diagnóstico

As duas falhas remanescentes deste bloco tinham causas diferentes:

1. A Plataforma Unificada marcava fullscreen como obrigatório, mas não fazia a tentativa silenciosa de preservar/retomar o modo ao concluir a identificação do aluno.
2. O teste das 10 plataformas ainda exigia os assets completos de fullscreen também nas quatro rotas legadas que hoje são apenas stubs de redirecionamento para `atividades/`.

A API Fullscreen continua dependente de gesto do usuário ao trocar de documento. Por isso a tentativa automática é best-effort: quando o navegador rejeita, a proteção visual permanece ativa e exige o botão de retorno.

## Correções funcionais

- `atividades/assets/js/app.js`: após resolver perfil e acomodação, alunos sujeitos à política fazem `requestPortalFullscreen({silent:true})`; alunos dispensados não são bloqueados.
- `core/session/fullscreen-portal.js`: `AGVFullscreen.require(true)` centraliza a tentativa silenciosa de manter/retomar fullscreen, com fallback para a trava visual já existente.
- Hub, Lobby e plataformas integradas continuam apenas declarando a política por perfil; não há múltiplas tentativas duplicadas.
- Saída/logout continua liberando fullscreen pela API compartilhada.

## Contratos atualizados

- P9 valida tentativa silenciosa no SPA de Atividades e política global centralizada.
- P9.1 exige os quatro assets de fullscreen apenas nas plataformas ativas.
- As quatro rotas legadas (`DS Sub`, `1DS`, `2DS`, `3DS`) são validadas como stubs autenticados que redirecionam para `atividades/`, evitando carregar runtime desnecessário antes do redirect.
- `validacao-antiga/` continua sendo a única exceção explícita de fullscreen.

## Resultado

- testes focados Fullscreen: 14/14 PASS;
- cinco validadores oficiais: PASS;
- suíte geral: 355/368 PASS;
- falhas remanescentes: 13, todas fora do escopo desta etapa.

## Banco / deploy

Nenhuma migration nova e nenhuma Edge Function nova nesta etapa. A migration 063 da Etapa 2 continua sendo a única pendência de banco já documentada.
