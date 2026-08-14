# Ordem de atualização no GitHub — Fase 17

## Opção recomendada

Extraia `cosmos-ds-fase-17-arquivos-alterados.zip` na raiz do repositório, preservando as pastas e substituindo os arquivos existentes.

## Ordem manual

1. Envie os arquivos novos da integração:

```text
src/core/assets/PremiumIntegrationOrchestrator.js
src/data/premiumIntegrationSystems.js
src/rendering/PremiumAssetOverlayRenderer.js
```

2. Substitua os arquivos de aplicação:

```text
src/app/CosmosApp.js
src/styles.css
service-worker.js
public/manifest.webmanifest
index.html
package.json
```

3. Substitua os arquivos de validação:

```text
scripts/check-project.mjs
scripts/audit-graphics.mjs
tests/run-tests.mjs
```

4. Envie a documentação da Fase 17.

5. Aguarde a publicação do GitHub Pages e faça recarregamento completo no navegador.

## Teste rápido após publicar

Abra:

```text
?module=launch-remaster
?module=station-remaster
?module=planetary-remaster
?module=visual-museum
```

Confirme que o indicador `GLB PREMIUM` aparece e informa LOD, triângulos e tempo de carga. Ao tocar no indicador, a camada GLB deve ocultar e o cenário procedural deve continuar funcionando.
