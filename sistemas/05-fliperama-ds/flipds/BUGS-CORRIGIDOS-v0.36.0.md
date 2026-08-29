# Bugs e inconsistências corrigidos — Fliperama DS v0.36.0

## Reator de Blocos

- O runtime criava saves em `schemaVersion: 2`, mas a restauração aceitava apenas schema 1.
- A restauração agora aceita schema 1 e 2, migrando estados antigos para schema 2.
- Ficha principal ainda mencionava uma campanha de três fases, embora a lógica já tivesse cinco desde v0.34.0; descrição sincronizada para cinco fases.

## Vector Fleet

- Textos antigos ainda descreviam uma campanha fixa de cinco ondas.
- A documentação agora reflete corretamente campanhas de 5, 6 ou 7 ondas conforme a dificuldade.

## Sentinela Orbital

- Textos antigos ainda descreviam quatro ondas fixas.
- A documentação agora reflete campanhas de 4, 5 ou 6 ondas conforme a dificuldade.

## Ponte 8→16 Bits

Durante a expansão foram detectados e corrigidos antes da publicação:

- último apoio inicialmente dentro da zona de contenção do portal;
- checkpoint novo inicialmente sobreposto a uma área de dano.

Os cinco checkpoints finais foram validados como seguros.

## Diagnósticos

- `diagnostico.html` ainda exibia um rótulo antigo de fase;
- `diagnostico-jogos.html` ainda incorporava resultados da auditoria v0.34.1.

Os dois painéis foram sincronizados com a v0.36.0.
