# Bugs e ajustes — v0.38.2

- A expansão foi construída preservando o comportamento legado da simulação: quando instanciada somente com o Vale Nexus, ela continua usando schema 1 e vitória no Portal Nexus.
- A nova campanha usa schema 2 apenas quando recebe as duas regiões.
- Checkpoints da Vila foram verificados contra paredes e campos Glitch.
- NPCs, terminais, relés, pacotes e núcleo foram verificados para não nascer dentro de colisores.
- Missões possuem bloqueio por etapa: módulos não ativam antes de Lia; dados não são coletados antes de Ivo; terminal exige 4/4 pacotes; relés exigem Dara; Núcleo exige 3/3 relés.
- O Portal de Continuidade permanece fechado até o Núcleo da Vila ser sincronizado.
- Testes históricos com expectativas literais de versões antigas foram executados com metadados de herança ajustados e seus relatórios históricos foram restaurados depois da regressão.
