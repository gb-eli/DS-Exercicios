# Continuidade — F94.9.1

Estado atual:

- F94.7: Locomoção Real Unificada.
- F94.8: Camera V2.
- F94.9: Interaction V2.
- F94.9.1: Hotfix obrigatório do Campus 3D.

Causa do Campus 3D: cinco funções de Airdrop eram expostas no retorno de `createLobby3D()` sem terem definição. Isso causava `ReferenceError` antes do runtime ser entregue ao `WorldManager`.

A correção restaurou a API de compatibilidade e adicionou teste de regressão específico.

Próxima fase, somente após smoke real do Campus 3D: F94.10 — carregamento modular, interiores e identidade ambiental.
