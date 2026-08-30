# Correções — Etapa 5

Base: DS-Exercicios v14.10.8.65 com Etapas 1, 2, 3 e 4 aplicadas.

Escopo isolado desta etapa:
- CTF DS;
- bridge do AGV Education Core;
- sessão única e controles de conta do CTF;
- contratos de teste P6.7/CTF incompatíveis com a migração para `/auth/`;
- sem alterações em Admin, banco, migrations ou Edge Functions.

## Diagnóstico

A integração oficial já usa a sessão canônica do Supabase (`sb-iresvqwyaqotghjssncg-auth-token`) e o CTF não possui mais login por senha próprio. Entretanto, dois testes históricos ainda exigiam `centralSignIn`/`changeCentralPassword` no bridge, contrariando o validador atual de autenticação unificada.

Também foi encontrada uma regressão funcional real: os botões do Perfil para trocar de conta e sair acionavam `switchAccount()` e `logout()`, mas essas funções não existiam mais em `app.js` após a migração. Em clique real isso poderia gerar `ReferenceError` e impedir a saída/troca de usuário.

## Correções

- mantido o Login Único em `/auth/`;
- não reintroduzido `grant_type=password` no CTF;
- implementados `switchAccount` e `logout` como wrappers seguros do encerramento de sessão central;
- checkpoint/salvamento local continua executado antes da saída;
- `centralSignOut` continua sendo a autoridade para logout Supabase;
- controles do Perfil reconciliados para `TROCAR DE CONTA` e `SAIR E BLOQUEAR`;
- contrato P6.7 atualizado para exigir sessão canônica, `centralSignOut`, operações server-side e ausência de login paralelo;
- teste piloto do CTF atualizado para a mesma arquitetura.

## Validação

- P6.7 Wave 2: 3/3 PASS;
- CTF Core Pilot: PASS;
- CTF Validate: PASS;
- CTF Runtime Stability: PASS;
- CTF Security/Wallet: PASS;
- autenticação unificada: PASS;
- validadores oficiais Cidade/Interiores/Cidade Viva/Mobilidade/Auth: PASS;
- suíte geral: 309/368 PASS; 59 falhas restantes.

Nenhuma migration, Edge Function ou configuração do Supabase foi alterada nesta etapa.
