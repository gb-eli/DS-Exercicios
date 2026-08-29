# Validação — AGV Campus DS v14.10.8.48

Release: **Fase F — Produção, Performance e Mobile**  
Pacote: **cumulativo Fase E + F sobre a base completa v14.10.8.46**

## Resultado

- JavaScript verificado com `node --check`: **18/18 PASS**.
- Imports relativos encontrados: **14**; ausentes: **0**.
- Recursos locais listados no Service Worker: **17**; ausentes: **0**.
- Rotas públicas do Hub e Lobby preservadas: **PASS**.
- Assinaturas Fase F (`ResizeObserver`, pausa de aba, `webglcontextlost`, interiores sob demanda, adaptive quality): **PASS**.
- `performance-manager.js`: perfil low-end, `Save-Data`, clamp de Ultra no mobile, qualidade adaptativa, manual hold e resize controller: **PASS**.
- Portal V2: **4/4 portais** criados com Three.js local.
- Portal V2 fechado/aberto: **PASS**.
- Perfis Portal Eco/Ultra: **PASS**.
- Dispose do Portal V2: **PASS**.
- Nenhuma migration, SQL ou alteração de schema incluída: **PASS**.

## Observações

O smoke desta release foi executado em nível de módulo usando o Three.js local do projeto. O ambiente de validação não foi usado como evidência de render visual final em GPU real; o teste visual deve ser feito após publicação no navegador dos dispositivos-alvo.

O ZIP é um patch. A regra de aplicação é **copiar por cima sem exclusões**.
