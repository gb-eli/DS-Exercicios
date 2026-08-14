# Revisão urgente de pré-publicação — v2.4.7

Data: 04/08/2026

## Resultado

Pacote aprovado para publicação imediata no GitHub Pages, com as limitações documentadas abaixo.

## Correção aplicada

- O painel do professor abria na Aula 2 do 1º ADM. Agora inicia na Aula 3.
- Ao trocar para o 2º ADM, inicia na Aula 1.
- Cache atualizado para r28.

## Validações

- ZIP íntegro;
- suíte completa `npm test`;
- senha mestre correta aceita e incorreta rejeitada;
- recursos relativos e imports servidos em subpasta HTTP;
- service worker e arquivos obrigatórios presentes;
- perfis, retomada, tempo, PDF, Drive, e-mail, avaliações e recuperações validados.

## Atenções operacionais

1. `activityUrl` do Classroom está vazio; o botão abre o Classroom geral.
2. EduAuth permanece em modo local/piloto com chaves de desenvolvimento públicas. Funciona para controle presencial casual, mas não é autenticação institucional contra aluno tecnicamente avançado.
3. Publicar preservando a pasta `desafio-informatica-agv-v2.2.0` e usar o endereço dessa pasta.
4. Depois de publicar, usar Ctrl+F5 ou fechar e reabrir a guia no celular.
