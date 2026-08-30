# AGV Education Core — v14.10.8.65
## Cidade Viva Avançada — Mobilidade, NPCs, Eventos e Interiores Identitários

Base obrigatória: **v14.10.8.64**.

## Implementado

- tráfego urbano dinâmico em 5 circuitos;
- 6 veículos de ambientação em movimento;
- 4 veículos do Campus utilizáveis em passeios guiados;
- HUD de veículo ativo com orientação `E sair`;
- 5 NPCs urbanos circulando entre distritos;
- 5 painéis de sinalização dinâmica;
- 5 eventos urbanos rotativos nas praças temáticas;
- cabine física de elevador no 3D com sequência de viagem antes da troca do piso lógico;
- assinatura visual específica para os 10 interiores principais;
- paridade funcional 2D/3D para tráfego, veículos, NPCs, eventos e interiores;
- boot, Service Worker e reparo passam a validar `campus-mobility-systems.js`.

## Segurança e compatibilidade

- nenhuma migration SQL;
- nenhuma alteração de schema Supabase;
- nenhuma `service_role`, `sb_secret` ou Client Secret adicionada ao frontend;
- login unificado preservado;
- 2D continua sendo a entrada oficial;
- 3D continua opcional;
- o mesmo repositório e o mesmo GitHub Pages continuam válidos.

## Aplicação

Aplique por **sobreposição** sobre a v14.10.8.64. Não exclua a árvore existente.

## Validação local

```bash
node core/tools/validate-campus-city-v62.mjs
node core/tools/validate-campus-interiors-v63.mjs
node core/tools/validate-campus-live-v64.mjs
node core/tools/validate-campus-mobility-v65.mjs
node core/tools/validate-unified-auth-v59.mjs .
```

## Smoke pós-publicação

1. abrir o Campus em 2D;
2. observar veículos trafegando pelas vias;
3. aproximar-se de um veículo em uma garagem e pressionar `E`;
4. confirmar o chip de veículo ativo e encerrar o passeio com `E`;
5. conversar com um NPC urbano em circulação;
6. consultar um painel dinâmico;
7. visitar a praça do evento urbano ativo;
8. entrar em Banco, Loja, CTF, COSMOS e Fliperama e conferir as assinaturas visuais próprias;
9. testar o elevador no 3D e aguardar a viagem antes da troca de pavimento;
10. repetir os pontos principais no Android.

> O empacotamento offline não executa validação visual real WebGL; ela deve ser feita depois do deploy.
