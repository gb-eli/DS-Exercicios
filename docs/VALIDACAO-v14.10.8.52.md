# Validação — AGV Campus DS v14.10.8.52

## Escopo

Lobby Visual Advanced 2D/3D, entregue como PATCH incremental sobre `v14.10.8.51`.

## Resultado

**APROVADO nas validações estáticas, funcionais isoladas e no smoke visual local.** Login, presença multiusuário, atividades reais e publicação no GitHub Pages permanecem como validações pós-publicação, porque exigem o ambiente autenticado real.

## Validações automatizadas executadas

- JavaScript do runtime: **21/21 arquivos válidos**, `0` falhas de sintaxe.
- Imports relativos: **22 verificados**, `0` ausentes.
- Contrato de entrada 2D-first: **PASS**.
- Alternância e recuperação 2D/3D: **PASS por inspeção estática do fluxo**.
- HUD avançado e controles de desafio: **PASS**.
- Proteções de `presentation` e `activeStation`: **PASS**.
- Recuperação de `webglcontextlost`: **PASS por inspeção estática do fluxo**.
- `prefers-reduced-motion` e `Save-Data`: **PASS**.
- Escopo sem schema/Supabase: **PASS por comparação com a base**; nenhum SQL ou migração foi adicionado.
- Service Worker: **24 recursos críticos**, incluindo `challenge-manager.js` e `ride-manager.js`.
- Cache-busting/versionamento: **PASS**, `v14.10.8.52`.
- Ciclo do Parkour: iniciar, avançar checkpoint, concluir, reiniciar, abandonar e respawn: **PASS em teste funcional isolado**.
- Ciclo de passeios: iniciar, percorrer trajetória, concluir e cancelar: **PASS em teste funcional isolado**.
- Comparação do pacote: **0 exclusões** em relação à base `v14.10.8.51`.

## Smoke visual local

O runtime foi servido localmente e inspecionado no navegador com Console limpo:

- 2D em `1366×768` e `1920×1080`: composição, sinalização, estado de atividade e HUD legíveis.
- 2D em `390×844` e `844×390`: zoom/enquadramento responsivo, rodapé oculto quando necessário e área útil preservada.
- HUD do Parkour 2D: cronômetro, progresso, reinício e saída visíveis.
- 3D em `1366×768`: cena carregada, spawn seguro e rótulos normalizados.
- Parkour 3D: câmera temporária e checkpoints legíveis sem colisão indevida da câmera.
- 3D em `390×844`: rótulos compactados e cena funcional.
- Nenhum erro ou aviso de Console foi observado nesses cenários.

## Matriz dos 28 critérios do prompt

| # | Critério | Resultado nesta entrega |
|---:|---|---|
| 1 | Login | Pendente no ambiente autenticado |
| 2 | Lobby inicia em 2D | PASS |
| 3 | Movimentação 2D | PASS no runtime local |
| 4 | Troca 2D → 3D | PASS por fluxo estático; repetir autenticado |
| 5 | Troca 3D → 2D | PASS por fluxo estático; repetir autenticado |
| 6 | Falha WebGL → 2D | PASS por fluxo estático |
| 7 | Câmera | PASS no smoke 3D |
| 8 | Pulo | PASS por fluxo estático |
| 9 | Parkour | PASS |
| 10 | Checkpoints | PASS |
| 11 | Piscina | PASS visual/funcional isolado |
| 12 | Parquinho | PASS visual/funcional isolado |
| 13 | Escorregador | PASS visual/funcional isolado |
| 14 | Torre | PASS visual/funcional isolado |
| 15 | Trilho | PASS visual/funcional isolado |
| 16 | Portais | Preservado; repetir autenticado |
| 17 | Entrada/saída de laboratório | PASS por fluxo estático |
| 18 | Presença de outros usuários | Pendente com dois usuários reais |
| 19 | HUD desktop | PASS visual |
| 20 | HUD mobile | PASS visual |
| 21 | Atividade fechada | PASS por estado local; repetir com dados reais |
| 22 | Atividade liberada | PASS por estado local; repetir com dados reais |
| 23 | Service Worker | PASS estático; repetir após publicação |
| 24 | Cache-busting/versionamento | PASS |
| 25 | Ausência de erros no Console | PASS no smoke local |
| 26 | `presentation`/`activeStation` sem ReferenceError | PASS |
| 27 | `webglcontextlost` preserva sessão | Fluxo preservado; confirmar em sessão real |
| 28 | Reduced motion | PASS |

## Smoke pós-publicação obrigatório

1. Entrar com aluno e professor reais e confirmar que ambos iniciam no 2D.
2. Alternar 2D → 3D → 2D sem perder autenticação ou presença.
3. Abrir duas sessões e confirmar movimento/presença entre usuários.
4. Validar atividade fechada, programada e liberada com dados reais.
5. Entrar e sair dos quatro laboratórios e testar os portais existentes.
6. Executar Parkour e cada passeio em desktop e celular.
7. Forçar perda de contexto WebGL e confirmar recuperação em 2D sem logout.
8. Recarregar a publicação e confirmar ativação do Service Worker/cache `v14.10.8.52`.

Nenhuma validação dependente de autenticação ou infraestrutura remota foi marcada artificialmente como concluída.
