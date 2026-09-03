# Continuidade após F94.13

- Base oficial desta linha: F94.13 sobre F94.12.
- Cache: `stage76-f9413-rapier-bvh-pilot`.
- Vehicle Core V2 continua sendo a API de veículos.
- Rapier 3D é piloto opcional e lazy, não dependência de boot.
- three-mesh-bvh é consulta espacial opcional do Campus.
- Fallback obrigatório: kinematic F94.12.
- Não migrar Parque/Airdrop/aéreo para Rapier sem teste específico.
- Próxima fase: NetworkManager central com transports PERFORMANCE/CONTINGENCY/SOLO; Colyseus somente depois do contrato de rede.
- Futuro instalador do servidor Windows deve perguntar localmente o nome do dispositivo segundo etiqueta física (`NT_DS_<ETIQUETA>`) antes do primeiro cadastro.
