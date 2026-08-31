# Validação — AGV World F63A

## Resultado

**Fase 63A aprovada no escopo da fundação.** A experiência visual e os quatro runtimes existentes foram preservados.

## Verificações executadas

- Sintaxe de 43 arquivos JavaScript do Lobby: **43/43 PASS**.
- Teste específico `validate-world-foundation-f63a.mjs`: **6/6 PASS**.
- Validadores `core/tools/validate-*.mjs`: **26/30 PASS**.
- Suíte completa: **364/382 PASS**.
- Smoke Campus 2D no navegador: **PASS**, sem o erro `CAMPUS_RIDES`.
- Smoke Campus 3D com interior `lab-virtual`: **PASS**, sem `reducedMotion` indefinido.
- Smoke Vale 2D no navegador: **PASS**.
- Smoke Vale 3D no navegador: **PASS**.

## Comparação com o baseline da Fase 0

O baseline tinha 358/376 testes e 18 falhas. A F63A adicionou seis testes aprovados, resultando em 364/382 e mantendo exatamente as mesmas 18 falhas preexistentes. Não foi introduzida falha nova na suíte completa.

Os validadores passaram de 25/29 para 26/30 pelo novo validador F63A. Permanecem as mesmas quatro falhas do baseline:

1. `validate-legacy-routes-stage26.mjs`: conflito histórico do diretório FLIPDS, que não é alias mínimo.
2. `validate-lobby-v61.mjs`: exige versão histórica `.61`.
3. `validate-stage19-visual-polish.mjs`: constrói caminho inválido `C:\\C:\\...` no Windows.
4. `validate-vale-minimap-overlay-stage21-v65.mjs`: exige cache-bust histórico `stage21` em release `stage34`.

## Gate preservado

A base continua `RELEASE_CANDIDATE`. A pendência da migration 063 no Supabase de produção pertence à release recebida e não foi alterada pela F63A.
