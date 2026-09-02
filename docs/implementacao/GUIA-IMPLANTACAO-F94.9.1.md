# Implantação — F94.9.1 Hotfix Campus 3D

Base obrigatória: F94.9.

1. Aplicar o PATCH preservando a estrutura de diretórios.
2. Publicar os arquivos do Lobby.
3. Confirmar que o Service Worker novo usa `stage72-f9491-campus3d-hotfix`.
4. Fechar abas antigas do AGV World e abrir novamente o Lobby.
5. Entrar primeiro no Campus 2D.
6. Acionar o modo 3D.
7. Confirmar que o Campus chega ao primeiro frame e não retorna automaticamente ao 2D.
8. Testar movimento, câmera, Invert Y e uma interação simples.
9. Se houver nova falha, copiar o Diagnóstico Técnico; agora a falha `startAirdropSession is not defined` não deve mais existir.

Não é necessário fazer deploy de backend.
