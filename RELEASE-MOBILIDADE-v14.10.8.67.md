# RELEASE v14.10.8.67 — Mobilidade do Campus

## Escopo desta etapa
Implementação da próxima fase do Lobby AGV após o Cinema:
- minimapa no Campus 3D
- veículos com seleção de modo e velocidade
- melhoria visual da frota

## O que entrou
1. **Minimapa do Campus**
   - aparece no modo 3D externo do Campus
   - mostra jogador, outros usuários, estações, destinos e veículos

2. **Veículos utilizáveis**
   - interação abre modal de escolha
   - opções: **Motorista** ou **Carona**
   - velocidades: **Passeio**, **Normal** e **Ágil**
   - HUD mostra o status do veículo em uso

3. **Melhoria visual da frota**
   - carros, vans, ônibus e bikes menos blocados
   - faróis, lanternas, cabine e acabamento extra

## Limites desta etapa
- o passeio ainda é **guiado**, não direção livre
- ainda não há aceleração/freio manuais
- ainda não há múltiplos passageiros sincronizados em rede

## Banco de dados
- sem nova migration nesta etapa
- a `065_lobby_cinema_media.sql` continua sendo a migration necessária apenas para o Cinema persistente

## Próxima etapa sugerida
1. embarque multiusuário real
2. direção manual com acelerar/frear
3. minimapa expandido + zoom
4. central de câmeras
5. veículos aéreos
