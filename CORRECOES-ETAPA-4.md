# Correções — Etapa 4

Base: DS-Exercicios v14.10.8.65 com Etapas 1, 2 e 3 aplicadas.

Escopo isolado desta etapa:
- painel Admin;
- compatibilidade de navegação da gestão de usuários;
- contratos de sessão administrativa e revogação já existentes;
- sem alterações no CTF.

## Diagnóstico

Os fluxos administrativos modernos já estavam íntegros. Passaram os testes de:
- Admin Central;
- Gestão de Atividades P3;
- sessão compartilhada;
- senha temporária e `must_change_password`;
- revogação Auth controlada;
- live-session guard;
- auto-probe de revogação;
- supervisão e auditoria.

A falha remanescente era de compatibilidade de navegação: o contrato legado ainda exigia os identificadores visuais `Usuários`, `Correções` e `Código dos Alunos`, enquanto o redesign havia renomeado esses itens.

## Correção

O redesign foi preservado e apenas os rótulos de navegação foram reconciliados:
- `Alunos e Turmas` → `Usuários e Turmas`;
- `Fila de correções` → `Correções — fila de revisão`;
- `Código dos alunos` → `Código dos Alunos`.

Nenhuma função administrativa, endpoint, permissão, migration ou fluxo de autenticação foi alterado.

## Validação

- contrato Admin P0/P1/P2 legado: PASS;
- Admin P3: PASS;
- Admin Central: PASS;
- sessão/Auth P7.4–P7.8: PASS;
- supervisão/auditoria P8.10: PASS;
- resiliência de sessão P10.6: PASS;
- validadores oficiais da v14.10.8.65: PASS;
- suíte geral: 308/368 PASS; 60 falhas restantes.

As 60 falhas restantes ficam fora desta etapa e serão tratadas incrementalmente.
