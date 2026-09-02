# Implantação — F94.6 Runtime Contract V2

## Base exigida

F94.5.1 Hotfix Boot/Auditoria v14.10.8.96.

## Tipo de alteração

Somente frontend/Service Worker. Não há migration, Edge Function ou alteração Supabase.

## Publicação

1. Aplicar o PATCH F94.6 sobre a F94.5.1.
2. Publicar todos os arquivos do patch, mantendo caminhos.
3. Confirmar que `lobby/sw.js` contém `stage68-f946-runtime-v2`.
4. Abrir o Lobby uma vez online para o novo Service Worker instalar o critical shell.
5. Recarregar após o controller do novo Service Worker assumir.

## Smoke test obrigatório

1. Login abre normalmente.
2. Campus 2D abre.
3. Campus 3D abre e chega ao primeiro frame.
4. Caminhar/correr/pular no Campus.
5. Entrar em um interior e caminhar.
6. Abrir Vale 3D e testar caminhar/correr/pular.
7. Abrir Rural 3D e repetir.
8. Abrir Parque 3D e testar pulo normal + parkour.
9. Abrir Colégio AGV e testar movimento.
10. Abrir Museu e testar movimento.
11. Trocar qualidade e confirmar que o runtime continua respondendo.
12. Trocar de mundo e voltar ao Campus para validar stop/dispose do Contract V2.

## Rollback

Reaplicar o PATCH/ZIP da F94.5.1. Nenhum rollback de banco é necessário.
