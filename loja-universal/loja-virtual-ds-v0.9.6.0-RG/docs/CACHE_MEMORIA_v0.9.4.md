# CACHE E MEMÓRIA 2.0 — v0.9.4

## Objetivo

Manter a experiência visual completa sem carregar ou conservar em RAM/GPU recursos que não estão sendo usados.

## Políticas de rede e cache

| Classe | Estratégia |
|---|---|
| Navegação | Network First com fallback local |
| Manifestos e configurações | Network First |
| CSS e JavaScript | Stale While Revalidate |
| GLB, imagens e texturas versionadas | Cache First |
| Pacotes opcionais | Preparação explícita pelo usuário |

## Atualização incremental

Os arquivos opcionais são armazenados em um cache compartilhado. O SHA-256 do manifesto identifica se o conteúdo já existe. Uma nova versão reutiliza arquivos iguais e baixa apenas os que mudaram.

## Memória

O orçamento padrão varia entre 64 MB no Econômico e 768 MB no Ultra avançado. O sistema registra buffers do avatar, equipamentos, prévias e partículas. Ao atingir 80% do orçamento, aplica LRU; acima de 92%, considera pressão crítica.

## Preservação

- O estado equipado não é apagado ao liberar GPU.
- Compras, carteira e inventário não entram no LRU.
- O avatar base é marcado como recurso fixo.
- Somente prévias, partículas e equipamentos não usados são descartados.

## WebGL

Os canvas detectam `webglcontextlost` e `webglcontextrestored`. Na perda, recursos temporários são liberados e a interface permanece com fallback. Na restauração, o módulo pode reconstruir seus buffers.
