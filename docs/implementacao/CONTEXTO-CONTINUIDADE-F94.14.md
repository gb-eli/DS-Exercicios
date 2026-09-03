# Continuidade — AGV World F94.14

## Versão atual
F94.14 — NetworkManager + Transport Contract.
Base: F94.13.
Cache: `stage77-f9414-network-manager`.

## Contrato arquitetural vigente
- Three.js continua núcleo do cliente.
- Rapier/BVH continuam piloto opcional da F94.13.
- `NetworkManager` é a única camada nova de roteamento de gameplay.
- Ordem: `ColyseusTransport -> SupabaseTransport -> SoloTransport`.
- Colyseus nunca é requisito de boot.
- Supabase continua identidade, persistência e contingência.
- Falha de transport não pode impedir abertura do mundo.

## Implementado na F94.14
- Network Protocol V3.
- Transport Contract V1.
- NetworkManager V2 com failover/failback/anti-flapping/dedupe/world scope.
- SupabaseTransport encapsulando o avatar realtime v2 atual.
- Broadcast genérico para veículo/interação.
- ColyseusTransport preparado, sem endpoint/cliente oficial ativo.
- SoloTransport.
- estado do Lobby: `networkMode`, `networkTransport`, `networkRevision`.
- diagnóstico `__agvNetworkManager.getDiagnostics()`.
- integração de `vehicle_state` como fast path auxiliar, mantendo banco/Edge Function como autoridade atual.

## Não implementado ainda
- servidor Colyseus no notebook;
- pacote Windows/serviço;
- cliente Colyseus vendorizado;
- endpoint WSS oficial/CSP allowlist;
- prediction/interpolation/reconciliation;
- AOI/rooms por chunk;
- load test real multiusuário;
- migração dos canais administrativos Supabase para o NetworkManager.

## Próxima fase
F94.15 — servidor Colyseus local/Windows com scripts operacionais, sala AGV, health check, cliente local vendorizado e conexão segura. Depois: F94.16 prediction/interpolation + AOI + load test.

## Regra de dispositivo já registrada para o projeto de gerenciamento de máquinas
O instalador do agente de gerenciamento dos notebooks deve perguntar **localmente** o nome do dispositivo antes do primeiro cadastro, usando a etiqueta física da escola (ex.: `NT_DS_<ETIQUETA>`). Não definir esse nome previamente pela central.
