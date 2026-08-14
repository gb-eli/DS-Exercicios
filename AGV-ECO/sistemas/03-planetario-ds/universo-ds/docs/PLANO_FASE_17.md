# Planejamento — Fase 17

## Tema

Integração dos assets premium nos laboratórios já existentes.

## Prioridade

1. substituir o ônibus espacial procedural do remaster de lançamentos por GLB;
2. substituir estação, cápsula e satélite no remaster orbital;
3. integrar rover e módulo lunar ao remaster Lua/Marte;
4. integrar peças GLB ao Museu Visual;
5. manter fallback procedural quando um pacote não estiver instalado.

## Evoluções previstas

- hierarquia de nós e animações glTF;
- portas, braços, rodas, painéis e trem de pouso animados;
- colisores simplificados;
- pontos de interação definidos no manifesto;
- KTX2/BasisU quando a ferramenta de compressão estiver disponível;
- iluminação híbrida dinâmica e baked;
- pacotes opcionais Básico, HD e Ultra;
- benchmark de VRAM e tempo de decodificação;
- substituição gradual do starter pack por modelos artísticos mais detalhados.

## Critério principal

Nenhum asset premium poderá impedir a aula. Sempre existirão:

- LOD baixo;
- fallback procedural;
- fallback Canvas 2D;
- carregamento sob demanda;
- opção de remover o pacote offline.
