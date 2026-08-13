# Prompt de integração — Loja Virtual DS v0.5.0

Integre a Loja Virtual DS v0.5.0 à plataforma preservando perfis, carteira, extrato, inventário, compras e recompensas existentes. Não recrie os modelos ou a interface.

Use `assets/equipment/equipment-manifest.json` como fonte oficial dos equipamentos, `assets/equipment/presets.json` para conjuntos e `assets/avatars/avatar-tech-v1/slots.json` para os pontos de encaixe.

Carregue inicialmente apenas catálogo, miniaturas e resumo do avatar. Carregue um GLB somente quando o usuário abrir a visualização 3D, solicitar prévia, experimentar, equipar ou selecionar um preset. Mantenha os modelos carregados em cache durante a sessão e descarte-os somente por pressão de memória ou troca explícita de perfil.

A plataforma deve consultar o inventário validado antes de permitir equipar um item adquirido. O renderer não é fonte de verdade para propriedade de itens. Ao concluir missões, fases, desafios, laboratórios ou tutoriais, envie eventos ao núcleo financeiro; não altere diretamente o saldo.

Preserve os modos Econômico, Equilibrado, Alta Qualidade, Ultra e Automático. Utilize LOD2 no Econômico, LOD1 no Equilibrado/Automático e LOD0 em Alta/Ultra. Preserve o fallback 2D, a redução de movimento e o funcionamento móvel.

Ao finalizar, teste: carregamento da página, avatar 360°, cinco presets, troca de itens conflitantes, botas nos dois pés, equipamento nas duas mãos, mochila/jetpack, companheiro, veículo, persistência do inventário e ausência de erros no console.
