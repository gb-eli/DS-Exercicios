# Arquitetura orbital

## Fronteiras

A simulação não depende do WebGL. O renderizador recebe dados prontos e pode ser destruído ao sair da aba sem interromper regras, XP ou persistência.

```text
Configuração do estudante
        ↓
SatelliteSystem
        ↓
configuração serializável
        ↓
Worker orbital ← OrbitMath
        ↓
telemetria JSON
        ↓
EarthOrbitModule
        ├── HUD e mapa
        └── EarthGlobeRenderer
```

## Modelo matemático

A primeira versão usa:

- órbita circular;
- constante gravitacional terrestre;
- rotação sideral aproximada da Terra;
- inclinação e ascensão reta simplificadas;
- cobertura por geometria do horizonte;
- distância de superfície por Haversine.

As funções são puras e testáveis. Uma futura camada avançada poderá substituir o propagador sem alterar a interface do módulo.

## Worker orbital

Entradas:

- altitude;
- inclinação;
- geração solar;
- consumo;
- bateria;
- taxa de produção;
- capacidade de downlink;
- velocidade do tempo.

Saídas:

- latitude e longitude;
- velocidade e período;
- eclipse;
- potência gerada e consumida;
- bateria;
- dados armazenados;
- estação mais próxima;
- contato e qualidade do link.

## Política de assets

A Fase 4 não inclui modelos externos. O satélite visual é construído em CSS e o globo em shader. Isso mantém o pacote pequeno e define um núcleo confiável antes da inclusão de GLB, KTX2 e mapas reais opcionais.
