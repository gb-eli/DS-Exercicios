# Bugs corrigidos — Fliperama DS v0.31.0

## VoxelCraft DS

1. **Falha de armazenamento:** IndexedDB bloqueado podia impedir salvar e continuar.
   - Correção: fallback para localStorage e memória, com cópia de recuperação.

2. **Gravações concorrentes:** salvamento automático e manual podiam ocorrer ao mesmo tempo.
   - Correção: fila única de gravação.

3. **Spawn inválido:** save antigo podia restaurar o personagem dentro do terreno ou em coordenada insegura.
   - Correção: validação de ocupação e busca de spawn seguro.

4. **Queda permanente:** posição inválida ou abaixo do mundo podia manter a sessão travada.
   - Correção: último ponto seguro e recuperação automática.

5. **Autoaprisionamento:** era possível construir um bloco dentro do corpo do jogador.
   - Correção: teste de interseção antes da construção.

6. **Bordas de chunks:** editar na borda reconstruía somente um lado, deixando faces antigas.
   - Correção: reconstrução do chunk atual e dos vizinhos afetados.

7. **Primeiro clique:** o clique usado para capturar o mouse também podia quebrar um bloco.
   - Correção: a primeira ação solicita Pointer Lock; a ferramenta só age depois da captura.

8. **Pointer Lock bloqueado:** não havia orientação útil quando o navegador recusava a captura.
   - Correção: aviso e atalhos Q/E/V.

9. **Câmera atravessando terreno:** terceira pessoa não verificava obstáculos.
   - Correção: raycast entre o personagem e a posição desejada da câmera.

10. **Salto rígido:** comando pouco antes da aterrissagem ou logo após a borda era perdido.
    - Correção: jump buffer e coyote time.

11. **Crescimento indefinido:** o mapa de alterações podia crescer continuamente.
    - Correção: limite de 15.000 alterações por mundo e aviso visível.

12. **GPU incompatível:** falha na qualidade selecionada encerrava o carregamento.
    - Correção: nova tentativa automática em qualidade Econômica e botão de modo seguro.

13. **Status incorreto:** o catálogo mantinha o módulo como Protótipo.
    - Correção: promoção para Jogável após a auditoria.
