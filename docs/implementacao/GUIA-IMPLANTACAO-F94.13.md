# Guia de implantação — F94.13

1. Aplicar sobre F94.12 ou usar o ZIP completo.
2. Publicar e aguardar o Service Worker `stage76-f9413-rapier-bvh-pilot` assumir controle.
3. Primeiro teste sem forçar física: abrir Campus 3D e confirmar primeiro frame, caminhada, interior e veículo.
4. Em uma máquina de teste, abrir o Lobby com `?physics=rapier&diag=1` e entrar no Campus 3D.
5. Dirigir um veículo terrestre contra limites/prédios e observar correção de colisão.
6. Consultar o runtime/diagnóstico técnico; `getPhysicsPilotDiagnostics()` deve indicar `status: rapier` quando os módulos externos carregarem.
7. Testar também `?physics=kinematic` para confirmar rollback instantâneo sem remover arquivos.
8. Confirmar que drone/helicóptero continuam funcionando pelo adapter legado.

Se a rede escolar bloquear jsDelivr, o resultado esperado é `fallback`/`kinematic`, não falha do Campus.
