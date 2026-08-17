# Validação — Loja Virtual DS v0.7.0

Data: 31/07/2026

## Resultado geral

**Aprovado para demonstração e integração progressiva.**

A versão foi verificada em três camadas: validação estática, navegador sem WebGL e visualizador WebGL2 isolado.

## 1. Validação estática

Resultados:

- 71 produtos válidos no catálogo.
- 36 produtos com modelo GLB.
- 36 arquivos GLB estruturalmente válidos.
- 16 slots equipáveis reconhecidos.
- 17 efeitos VFX e 8 falas animadas.
- 12 telas e 90 seletores de interface conferidos.
- Nenhum ID duplicado no HTML.
- JavaScript aprovado por `node --check`.
- Catálogo, equipamentos, avatar, VFX e design system aprovados pelos validadores locais.

## 2. Teste funcional sem WebGL

O navegador foi iniciado com WebGL desativado para confirmar a experiência em dispositivos incompatíveis ou bloqueados.

Resultados:

- Página carregada com 12 telas.
- 71 cards renderizados.
- Navegação para gráficos, loja e produto concluída.
- Fallback vetorial exibido corretamente na ausência de WebGL.
- Compra de baixo valor autorizada.
- Saldo alterado de 4.800 para 4.764 moedas.
- Item incluído no inventário.
- Operação registrada no livro-caixa.
- Layout móvel testado em 390 × 844.
- Nenhuma rolagem horizontal indevida.
- Navegação móvel exibida em grade.
- Nenhuma exceção JavaScript capturada.

Registro: `docs/browser-test-fallback.json`.

## 3. Teste WebGL2 do produto GLB

O visualizador de produto foi testado isoladamente com Chromium e renderização SwiftShader, evitando que as políticas administrativas de navegação local impedissem o teste.

Resultados:

- Contexto WebGL2 criado.
- Modelo GLB decodificado a partir do pacote local incorporado.
- Geometria enviada à GPU.
- Materiais PBR simplificados renderizados.
- Rotação 360° iniciada.
- Canvas ativo em 900 × 800.
- Nenhuma exceção JavaScript.

Registro: `docs/browser-test-webgl.json`.

A captura correspondente está em `assets/previews/v0.7.0-product-webgl.png`.

## 4. Modos gráficos

Foram conferidos os perfis:

- Econômico.
- Equilibrado.
- Alta qualidade.
- Ultra.
- Ultra avançado.
- Automático.

O perfil Automático avalia WebGL, limite de textura, processadores lógicos, memória informada, resolução e benchmark de CPU. Durante o uso, o monitor de FPS pode reduzir ou elevar o perfil de forma gradual.

## 5. Limitação do ambiente de teste

O Chromium disponível neste ambiente possui política administrativa que bloqueia navegação direta para endereços locais. Para testar a interface, o documento e os assets necessários foram inseridos diretamente no navegador pelo Chrome DevTools Protocol.

O teste WebGL2 foi realizado com renderização por software SwiftShader. Ele comprova o funcionamento do pipeline e da visualização GLB, mas não mede o desempenho de uma GPU dedicada real. O benchmark de uma máquina com NVIDIA, AMD ou Intel dedicada deve ser executado no próprio dispositivo após a implantação.

## Conclusão

A v0.7.0 mantém uma experiência funcional quando WebGL não está disponível e ativa a prévia tridimensional real quando WebGL2 é suportado. O modo Ultra avançado está implementado como perfil opcional; o modo Automático evita ativá-lo em equipamentos que não sustentem a carga.
