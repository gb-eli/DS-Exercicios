# CORREÇÕES — ETAPA 27 / FASE 2.1

## Estrutura visual dos prédios e construções

Escopo deliberadamente restrito ao acabamento arquitetônico externo e à eficiência visual do Campus/Vale.

### Vale do Silício
- as 27 empresas continuam nas mesmas posições, footprints e colliders;
- categorias reais do catálogo passam a alimentar cor e arquitetura;
- foram introduzidas famílias arquitetônicas leves: `academic`, `tech-tower`, `arcade`, `maker`, `immersive`, `media`, `sport` e `tech`;
- massas, coberturas, marquises, painéis, módulos laterais e detalhes de cobertura variam conforme a categoria;
- entradas físicas e degraus existentes foram preservados;
- LOD e culling existentes continuam ativos;
- janelas deixam de ser dezenas de meshes repetidos por piso e passam a usar faixas compartilhadas + montantes consolidados;
- no catálogo atual, a estimativa de meshes de janela cai de 600 para 282 (~53% de redução nesse componente).

### Campus
- as dez arquiteturas de prédios/ferramentas existentes permanecem preservadas;
- nenhuma colisão, interior, rota ou masterplan foi alterado nesta fase.

### Cache/publicação
- `vale3d.js` usa cache-bust `14.10.8.65-stage27` em `lobby.js` e no Service Worker para impedir reutilização do runtime anterior.

### Fora do escopo
- clima;
- veículos usáveis;
- NPCs inteligentes;
- subsolo;
- novas animações de avatar;
- mudanças em banco, migrations ou Edge Functions.

## Validação
- `validate-building-personality-stage27-v65.mjs`: 28/28 PASS;
- Etapa 20 atualizada para validar a nova silhueta arquitetônica: 12/12 PASS;
- física do Vale: PASS;
- urbanismo do Vale: PASS;
- Cidade/Interiores/Cidade Viva/Mobilidade/Auth: PASS;
- suíte completa: 376/376 PASS.
