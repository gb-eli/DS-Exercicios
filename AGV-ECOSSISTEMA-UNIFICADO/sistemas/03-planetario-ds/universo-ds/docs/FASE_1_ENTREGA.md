# Fase 1 — Entrega implementada

## Objetivo

Criar uma fundação executável, modular e publicável que prove a identidade visual e os limites arquiteturais antes de inserir modelos 3D pesados.

## Componentes entregues

1. **App shell responsivo** com portal, cards, mapa de fases e modais.
2. **WebGL2 procedural** com estrelas, nebulosa, planeta, atmosfera e órbita.
3. **Fallback CSS** para equipamentos sem WebGL2.
4. **Benchmark** baseado em CPU, memória disponível, threads, dispositivo e WebGL2.
5. **Perfis gráficos** aplicados em tempo real, com redução automática após queda persistente de FPS.
6. **Perfis locais de estudante**, troca, exclusão, XP e nível.
7. **Academia Espacial DS** com pipeline, anomalia e segurança por estados.
8. **Centro de Controle** com telemetria, logs, pausa, anomalia e mitigação.
9. **Módulos lazy-loaded**, sem importar experiências futuras no início.
10. **PWA**, manifesto, ícone e cache básico.
11. **GitHub Actions** para Pages.
12. **Documentação e checklists**.

## Decisões técnicas

- A Fase 1 não depende de CDN nem de bibliotecas externas.
- O shader é escrito em GLSL e executado por um renderer WebGL2 pequeno.
- O DOM é responsável por menus, textos, formulários e acessibilidade.
- Estado e progresso não ficam dentro do shader ou da cena.
- Módulos precisam implementar `mount` e `unmount` e limpar timers/eventos.

## Limites conscientes

- Ainda não há física 3D, modelos GLB, CesiumJS ou WebXR.
- O salvamento é local e não autentica usuários reais.
- A evidência da Fase 1 é registro local; PDF entra em fase posterior.
- O benchmark é orientativo e deverá ser calibrado com os notebooks reais da escola.
