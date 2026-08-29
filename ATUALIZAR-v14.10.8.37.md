# Atualização v14.10.8.37 — estrutura normalizada

## Motivo

Foi confirmada duplicação de praticamente toda a aplicação dentro de `core/`, incluindo um segundo nível `core/core/`. Alguns espelhos estavam em releases diferentes da raiz e podiam ser copiados/publicados por engano.

## Regra a partir desta versão

A **raiz do repositório é a única fonte pública**. Não devem existir `core/lobby`, `core/prova`, `core/atividades`, `core/admin`, `core/sistemas` ou outros espelhos de frontend.

O diretório `core/` fica reservado a recursos técnicos compartilhados e backend.

## Publicação

Extraia/copiei o conteúdo deste ZIP diretamente na raiz do repositório. Para garantir que restos antigos não sobrevivam, prefira substituir a árvore de trabalho limpa em vez de copiar por cima seletivamente.

Após o push, abra `repair-lobby.html`, confirme a release 14.10.8.37 e então entre no Campus.
