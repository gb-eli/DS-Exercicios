# Guia de implantação — F94.10

## Base exigida

Aplicar sobre **F94.9.1 — Hotfix Campus 3D**.

Se a instalação atual não estiver nessa base, prefira o ZIP completo da F94.10 em vez do PATCH.

## Implantação do PATCH

1. Fazer backup da versão publicada.
2. Descompactar o PATCH na raiz do projeto, preservando a estrutura de pastas.
3. Substituir os arquivos existentes quando solicitado.
4. Publicar os arquivos estáticos.
5. Não executar migration e não redeployar Edge Functions: esta fase não altera backend.
6. Limpar/purgar cache do CDN se a publicação não fizer isso automaticamente.
7. Abrir o Lobby e confirmar o cache `stage73-f9410-modular-streaming`.

## Smoke test mínimo

### Boot
- login/restauração de sessão funciona;
- Lobby abre;
- Campus 2D abre;
- Campus 3D chega ao primeiro frame.

### Streaming Campus
- caminhar Hub → distrito → outro distrito → Hub;
- verificar ausência de sumiços abruptos próximos ao jogador;
- testar teleporte;
- abrir diagnóstico e confirmar `streaming.errors = 0`.

### Interiores
- entrar e sair de pelo menos um laboratório;
- entrar e sair de um interior de ferramenta/andar;
- conferir que a iluminação interna não fica preta;
- repetir em Econômico e Ultra.

### Mirante
- abrir Mirante;
- testar panorama e zoom até 50×;
- confirmar presença dos setores distantes;
- sair do Mirante e continuar a navegação.

## Rollback

Se houver regressão bloqueante:

1. restaurar arquivos da F94.9.1;
2. restaurar o Service Worker da F94.9.1;
3. limpar cache do site/CDN;
4. recarregar com hard refresh;
5. registrar o erro e o trecho de `streamingDiagnostics()` antes de uma nova tentativa.

## Observação de compatibilidade

O novo streaming é **Campus-first**. Não interpretar os perfis dos demais mundos como migração completa. Vale/Rural/etc. continuarão usando seus runtimes atuais até suas ondas específicas de integração.
