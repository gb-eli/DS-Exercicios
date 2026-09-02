# Contexto de continuidade — F94.8 Camera V2

## Base atual
F94.8 sobre F94.7, release 14.10.8.96, cache `stage70-f948-camera-v2`.

## Concluído
- Runtime Contract V2 (F94.6)
- Locomoção real unificada 2D/3D (F94.7)
- Camera V2 (F94.8)
- Invert Y persistente
- olhar para o céu em terceira pessoa
- sensibilidade global
- presets de câmera de veículo
- rovers Lua/Marte integrados à câmera veicular
- Mirante 360° com zoom óptico até 50×

## Próxima ordem aprovada
1. F94.9 — Interaction V2
2. carregamento modular / interiores
3. qualidade gráfica e pipeline de assets
4. Vehicle Core V2
5. Rapier
6. NetworkManager
7. Colyseus no notebook/PC como acelerador opcional
8. failover Colyseus → Supabase Realtime → Solo

## Regras
- Three.js permanece núcleo;
- não transformar Colyseus em dependência de boot;
- não remover Supabase Realtime antes de fallback validado;
- mudanças grandes sempre com patch + rollback;
- testes visuais reais ainda são necessários para validar sensação de câmera.

## Requisito separado pendente
O instalador da Central de Notebooks deve perguntar localmente o nome físico do dispositivo antes do cadastro, seguindo o padrão informado pelo operador (ex.: `NT_DS_<ETIQUETA>`). Esse requisito é de outro pacote/projeto e não foi misturado na F94.8.
