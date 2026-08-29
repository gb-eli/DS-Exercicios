# Validação — AGV Campus DS v14.10.8.51

## Escopo
Fase H — Lobby 2D-first, escolha 2D/3D e primeira expansão do espaço de espera.

## Resultado
**APROVADO para patch incremental**, com smoke visual final a ser feito no navegador real após publicação.

### Validações executadas
- 18 arquivos JavaScript do runtime verificados com `node --check`: **18 PASS / 0 FAIL**.
- 17 imports relativos verificados: **0 ausentes**.
- Referências ativas à v14.10.8.50 após o bump: **0**.
- Contrato 2D-first em `lobby.js`: **PASS** (`default_2d_first`).
- Botão explícito 2D/3D e `data-runtime-mode="lite"` no HTML: **PASS**.
- `campus-experiences.js`: **6 experiências**, **6 plataformas**, **5 checkpoints**: **PASS**.
- `parkourPlatformAt()` testado para plataforma e área externa: **PASS**.
- Service Worker: **22 recursos críticos / 0 ausentes**, incluindo `campus-experiences.js`: **PASS**.
- Hotfix v14.10.8.50 (`presentation` / `activeStation`) permanece presente no `lobby3d.js`: **PASS**.
- Nenhuma alteração de Supabase/schema introduzida: **PASS por diff de escopo**.

### Smoke visual automatizado
O Chromium disponível no ambiente de validação não consegue inicializar EGL/GPU em modo headless. A tentativa de captura 2D/3D ficou bloqueada pela inicialização gráfica do próprio container. Por isso a validação visual não foi marcada artificialmente como aprovada.

### Smoke pós-publicação recomendado
1. Abrir o Lobby em desktop e confirmar entrada direta no 2D.
2. Confirmar botão `Entrar no 3D`.
3. Alternar 2D → 3D → 2D sem perder a sessão.
4. No 2D, aproximar-se de Piscina, Parquinho, Escorregador, Trilho, Torre e Parkour.
5. Iniciar o Parkour no 2D e passar pelos 5 checkpoints.
6. Entrar no 3D e testar as mesmas áreas.
7. No Parkour 3D, pular sobre as plataformas e passar pelos checkpoints.
8. Confirmar que Portal/Atividades continuam funcionando.
9. Testar celular e uma máquina mais fraca, mantendo o 2D como opção permanente.

## Segurança de publicação
O pacote inclui aplicador e validador PowerShell que recusam árvores Git com menos de 3.000 arquivos e bloqueiam publicação se houver exclusões acidentais.
