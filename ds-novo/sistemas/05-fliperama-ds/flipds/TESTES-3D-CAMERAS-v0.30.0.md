# Testes 3D e câmeras — Fliperama DS v0.30.0

Gerado em: 2026-08-04T20:29:09.671Z

- Testes executados: **26**
- Aprovados: **26**
- Reprovados: **0**

## Resultados

- **PASS — Setor Poligonal 94 · plataforma alta bloqueia lateral:** A plataforma central bloqueia a entrada pelo chão, mas aceita o avatar sobre sua superfície.
- **PASS — Setor Poligonal 94 · sem subida instantânea:** O avatar não pode subir diretamente para 2,7 m apenas entrando no volume da plataforma.
- **PASS — Setor Poligonal 94 · rampa progressiva:** A rampa central sobe progressivamente do solo ao topo da plataforma.
- **PASS — Setor Poligonal 94 · percurso completo:** Núcleos/lentes, checkpoints, rampa central e portal pertencem ao mesmo percurso navegável.
- **PASS — Setor Poligonal 94 · coyote time:** O salto ainda é aceito por alguns milissegundos após deixar uma borda.
- **PASS — Setor Poligonal 94 · jump buffer:** O salto pressionado pouco antes da aterrissagem é executado automaticamente.
- **PASS — Setor Poligonal 94 · sensibilidade:** O nível Alto produz rotação perceptivelmente maior que o nível Médio.
- **PASS — Setor Poligonal 94 · arraste de câmera:** Arraste horizontal gira o avatar e arraste vertical altera a inclinação da câmera.
- **PASS — Setor Poligonal 94 · recuperação anti-travamento:** Posições inválidas retornam ao último ponto seguro.
- **PASS — Setor Poligonal 94 · câmera fora dos obstáculos:** A posição final da câmera não fica dentro de paredes, pilares ou plataformas.
- **PASS — Setor Poligonal 94 · migração de save:** Save schema 1 é convertido para schema 2 com os novos campos físicos e de câmera.
- **PASS — Setor Poligonal 94 · portal exige aprendizagem:** Coletar os itens sem experimentar câmeras/material/FOV não libera o portal.
- **PASS — Setor Poligonal 94 · portal educativo:** O portal é concluível depois de cumprir as coletas e comparações educativas.
- **PASS — Câmeras em Evolução · plataforma alta bloqueia lateral:** A plataforma central bloqueia a entrada pelo chão, mas aceita o avatar sobre sua superfície.
- **PASS — Câmeras em Evolução · sem subida instantânea:** O avatar não pode subir diretamente para 2,7 m apenas entrando no volume da plataforma.
- **PASS — Câmeras em Evolução · rampa progressiva:** A rampa central sobe progressivamente do solo ao topo da plataforma.
- **PASS — Câmeras em Evolução · percurso completo:** Núcleos/lentes, checkpoints, rampa central e portal pertencem ao mesmo percurso navegável.
- **PASS — Câmeras em Evolução · coyote time:** O salto ainda é aceito por alguns milissegundos após deixar uma borda.
- **PASS — Câmeras em Evolução · jump buffer:** O salto pressionado pouco antes da aterrissagem é executado automaticamente.
- **PASS — Câmeras em Evolução · sensibilidade:** O nível Alto produz rotação perceptivelmente maior que o nível Médio.
- **PASS — Câmeras em Evolução · arraste de câmera:** Arraste horizontal gira o avatar e arraste vertical altera a inclinação da câmera.
- **PASS — Câmeras em Evolução · recuperação anti-travamento:** Posições inválidas retornam ao último ponto seguro.
- **PASS — Câmeras em Evolução · câmera fora dos obstáculos:** A posição final da câmera não fica dentro de paredes, pilares ou plataformas.
- **PASS — Câmeras em Evolução · migração de save:** Save schema 1 é convertido para schema 2 com os novos campos físicos e de câmera.
- **PASS — Câmeras em Evolução · portal exige aprendizagem:** Coletar os itens sem experimentar câmeras/material/FOV não libera o portal.
- **PASS — Câmeras em Evolução · portal educativo:** O portal é concluível depois de cumprir as coletas e comparações educativas.

## Observação

A suíte valida regras, física, percurso e posicionamento matemático da câmera. O conforto visual, a sensação da sensibilidade e o tamanho dos controles ainda devem ser conferidos em celulares, tablets e computadores reais.
