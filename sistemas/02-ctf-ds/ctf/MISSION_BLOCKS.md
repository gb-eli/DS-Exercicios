# Progressão por blocos e checkpoints — CTF DS v2.5.0

## Estrutura geral

As 68 missões foram divididas em sete pacotes:

1. **Treinamento e primeiros acessos** — 10 missões;
2. **Decodificação e reconhecimento** — 10 missões;
3. **Identidade, redes e investigação** — 10 missões;
4. **Proteção de dados e hardening** — 10 missões;
5. **Desenvolvimento seguro e resposta** — 10 missões;
6. **APIs, infraestrutura e defesa** — 10 missões;
7. **Operação final integrada** — 8 missões.

## Regra de liberação

- O primeiro bloco começa disponível.
- O próximo bloco é liberado quando todas as missões do bloco anterior forem concluídas.
- Os pré-requisitos internos de cada missão continuam válidos.
- Missões já concluídas em perfis antigos são preservadas.
- Caso um perfil antigo já possua progresso em um bloco posterior, esse progresso não é apagado.

## Checkpoint

Ao finalizar todas as missões de um bloco, a plataforma registra um checkpoint único contendo:

- quantidade de missões concluídas;
- percentual do bloco;
- precisão estimada;
- número de tentativas;
- estrelas conquistadas;
- média de estrelas;
- pistas utilizadas;
- testes locais realizados;
- uso das ferramentas;
- indicador formativo;
- data do checkpoint;
- identificador do registro.

## Indicador de desempenho

O indicador combina:

- 55% de conclusão do bloco;
- 25% de precisão;
- 20% de média de estrelas.

Faixas utilizadas:

- **Excelente**;
- **Proficiente**;
- **Adequado**;
- **Em desenvolvimento**;
- **Iniciando**.

O indicador é formativo e não gera nota automática.

## Recompensas

Cada checkpoint pode conceder uma única vez:

- XP;
- Cyber Coins;
- estrelas;
- emblema temático.

As recompensas são registradas no ledger e não influenciam diretamente a nota.

## Persistência

Os checkpoints ficam dentro do perfil criptografado no IndexedDB. O relatório também aparece:

- na Central de Missões;
- no dashboard;
- no perfil;
- na Central de Entrega;
- na evidência HTML exportada.

## Limitação

Como a plataforma funciona somente no front-end, os checkpoints são registros locais protegidos e reconciliáveis, mas não substituem uma validação central por servidor.
