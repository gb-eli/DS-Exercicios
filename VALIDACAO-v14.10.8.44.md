# Validação v14.10.8.44

## Escopo

Release estrutural do Campus DS com manifesto compartilhado e Camera V2. Nenhum contrato de backend foi alterado.

## Verificações executadas

- `node --check`: 16/16 arquivos JavaScript do pacote aprovados.
- Imports locais versionados conferidos: 0 caminhos ausentes.
- Teste do manifesto aprovado: quatro zonas, colliders, conversão presença ↔ mundo e mapeamento de áreas.
- Service Worker atualizado para pré-cache dos novos módulos.
- Modos de câmera ligados ao HUD existente.
- Fallback 2D preservado.
- Integração Supabase não modificada.

## Limite da validação automatizada

O Chromium headless disponível no ambiente de empacotamento não inicializou EGL/GPU, portanto o smoke visual WebGL não foi marcado como aprovado. A release mantém a lista abaixo como gate obrigatório no navegador real.

## Testes de regressão recomendados no navegador

1. abrir Lobby 3D e mover com WASD;
2. girar câmera 360°;
3. testar scroll/zoom;
4. alternar Exploração → Ampla → Campus pelo botão e tecla C;
5. encostar em fachadas e observar a câmera aproximar sem atravessar o prédio;
6. entrar em cada laboratório e testar câmera perto das paredes;
7. sentar, usar terminal, apresentação e sair do interior;
8. alternar 3D ↔ 2D e conferir posição/portal;
9. testar mobile com joystick, correr e pular;
10. validar presença de segundo usuário.

## Banco

Nenhuma migration ou alteração de dados é necessária para esta release.
