# Arquitetura — Observatório e Universo Profundo

## Separação de responsabilidades

```text
ObservatoryModule
├── TelescopeSystem          seleção, foco, apontamento e compatibilidade
├── ImagePipeline            geração/calibração/composição de quadro científico
├── SpectrumAnalyzer         correspondência de linhas espectrais
├── ObservationDatabase      persistência, proveniência e exportação
├── observatory.worker       processamento de imagem fora da interface
└── UniverseSceneRenderer    WebGL2, shader, câmera 360° e fallback
```

O renderizador não é a fonte de verdade. Alterar resolução, partículas ou shader não altera as decisões científicas, os registros nem o XP.

## Fluxo de observação

```text
Escolher alvo
→ escolher faixa espectral
→ validar compatibilidade
→ alinhar e focar
→ configurar exposição e filtros
→ processar em Worker
→ analisar SNR
→ identificar espectro
→ registrar metadados
→ exportar evidência
```

## Perfis gráficos

- Desempenho: 24 passos volumétricos, resolução 32×32 no pipeline e partículas reduzidas.
- Equilibrado: 40 passos, imagem 48×48 e densidade moderada.
- Experiência: 58 passos, imagem 64×64 e maior densidade visual.

A imagem científica é ampliada no Canvas, mas o tamanho de processamento é controlado para não bloquear celulares.

## Segurança de ciclo de vida

Ao sair do módulo são encerrados:

- Worker;
- RAF;
- ResizeObserver ou listener alternativo;
- listeners de ponteiro, zoom e contexto;
- programa WebGL;
- referências ao contexto.
