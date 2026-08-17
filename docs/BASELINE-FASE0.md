# Baseline Fase 0 — AGV Education Core

## Escopo

Levantamento executado nas árvores canônicas definidas em `manifesto-plataformas.json`, priorizando a Loja Universal (P0) e as quatro plataformas P1. Nenhuma pasta histórica foi usada como base.

## Resultado de regressão

- Loja Virtual DS `validate_v0960rg.py`: **PASS**.
- Loja Virtual DS `test_sdk_node.js`: **PASS** quando executado na raiz canônica da loja. O primeiro erro observado foi apenas `cwd` incorreto, não falha do código.
- CTF DS `npm test`: **PASS**.
- Game Informática `npm test`: **PASS**.

Os logs completos estão em `docs/BASELINE-TESTES-FASE0.txt`.

## Autoridades locais encontradas

| Componente | Auth atual | Progresso/XP atual | Economia atual | Risco |
|---|---|---|---|---|
| `loja-virtual-ds` 0.9.6.0-RG | não deve ser standalone após migração | não aplicável como plataforma principal | LOCAL em src/core/foundation.js (saldo, ledger, inventário, reward, purchase) | **CRÍTICO — navegador ainda é autoridade econômica no modo legado/demo** |
| `lab-virtual` 4.28.0 | EduAuth local + chaves/PINs no bundle | IndexedDB/localStorage via lab/js/storage.js | XP/progresso local; referências parciais a wallet | **ALTO** |
| `ctf-ds` 3.2.0 | EduAuth local | mission progress/storage local | wallet/ledger local em js/core/wallet.js | **CRÍTICO** |
| `desafio-ds` 33.0.0-pilot | EduAuth local | guided/runtime local | XP ledger local; moedas apenas referências | **ALTO** |
| `game-informatica` 2.5.7 build 20260811r38 | EduAuth/perfil protegido local | IndexedDB/perfil criptografado + progresso local | wallet não aplicável; XP/progresso local | **ALTO** |

## Primeira implementação realizada

- `core/sdk/agv-core-sdk.js` promovido para **v0.2.0 funcional**.
- Incluídos Auth, perfil, progresso idempotente, fila offline apenas de progresso, wallet/ledger, compra por intent/confirmação, inventário, transferência e marketplace.
- Criado `core/contracts/reward-claim.schema.json`: o contrato **proíbe `amount`** no claim oficial enviado pelo cliente.
- `DSStoreSDK` da Loja passou a suportar transporte `agv-core`. Quando esse transporte está ativo, o SDK ignora o valor legado enviado pelo navegador e delega a recompensa ao Core.
- Recompensa econômica em modo Core **não usa fila offline**. Se o Core estiver indisponível, ela falha em vez de criar saldo local oficial.
- Adicionado `config/agv-core.config.js` à Loja, inicialmente `enabled: false` até o backend central estar implantado.

## O que ainda não foi ativado

`src/core/foundation.js` continua existindo para preservar os testes e o modo demonstrativo da Loja. Nesta etapa ele **não foi removido nem convertido em backend oficial**. A ativação do Core só deve ocorrer depois da migration compatível e das Edge Functions centrais.

## Próxima alteração segura

1. Executar preflight no Supabase central existente e gerar migration compatível, evitando colisão com tabelas já usadas pelo portal de exercícios.
2. Implantar `agv-progress-event` e `agv-reward-claim`.
3. Ativar a Loja em ambiente de teste e trocar `purchase()` local pelo fluxo intenção → confirmação.
4. Só depois ligar CTF, LAB Virtual, Desafio e Game Informática.
