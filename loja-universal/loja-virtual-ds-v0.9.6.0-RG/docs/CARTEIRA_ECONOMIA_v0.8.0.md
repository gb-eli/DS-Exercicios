# Carteira e Economia v0.8.0

## Estados do saldo

- `available`: moedas confirmadas e gastáveis.
- `reserved`: valor separado durante uma compra.
- `pending`: recompensa reconhecida, mas ainda não emitida.
- `underReview`: crédito com origem em verificação.
- `blocked`: valor não liberado após revisão.

## Fluxo de recompensa

1. A plataforma envia um evento único.
2. O módulo valida tipo, faixa de valor e duplicidade.
3. Define o nível de análise pelo valor.
4. Verifica crescimento anormal, acúmulo rápido e checkpoints.
5. Autoriza o crédito ou cria uma revisão.
6. Registra a operação no livro-caixa.
7. Atualiza o saldo correspondente.

## Tempos-alvo

| Valor | Nível | Meta |
|---:|---|---:|
| até 99 | Instantânea | 5–8 s |
| 100–499 | Rápida | 8–12 s |
| 500–999 | Ampliada | 12–20 s |
| 1.000–4.999 | Avançada | 20–45 s |
| 5.000–9.999 | Reforçada | 45–90 s |
| 10.000–49.999 | Profunda | 90–180 s |
| 50.000–500.000 | Crítica | 180–300 s |

Nenhuma análise automática deve ultrapassar cinco minutos. Caso a confirmação externa ainda não exista, a operação permanece em análise sem bloquear as atividades educacionais.

## Crescimento anormal

Uma recompensa pode ser encaminhada à revisão quando:

- for igual ou superior a 50.000 moedas;
- representar crescimento quatro vezes superior ao saldo anterior, a partir de 5.000 moedas;
- somada a créditos recentes, ultrapassar 25.000 moedas em dez minutos;
- atravessar um checkpoint ainda não validado;
- exigir revisão do professor pela política do nível.

## Livro-caixa

Cada registro contém:

- identificador da transação;
- perfil e plataforma;
- tipo e estado;
- valor;
- origem ou item;
- nível e tempo-alvo de análise;
- saldo anterior e posterior;
- hash anterior;
- hash da operação;
- data e horário.

## Integridade e penalidades

Anomalias técnicas não geram multa. Penalidades exigem ocorrência confirmada:

1. advertência formal sem multa;
2. multa de 10%, limitada a 1.000 moedas;
3. multa de 30%, limitada a 5.000 moedas;
4. multa de 50%, limitada a 15.000 moedas.

O módulo registra estornos, decisões e justificativas sem apagar o histórico original.
