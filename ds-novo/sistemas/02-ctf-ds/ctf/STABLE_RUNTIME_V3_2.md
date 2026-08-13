# Runtime estável e acabamento — CTF DS v3.2.0

A versão 3.2.0 estabiliza a campanha integral antes da publicação definitiva. Ela não altera respostas, recompensas, blocos ou competências avaliadas. O foco é impedir perda de progresso durante atualizações, adaptar a camada gráfica ao dispositivo e melhorar leitura, mobile, tela cheia e acessibilidade.

## Atualização segura

O Service Worker usa caches separados para arquivos estáticos e respostas de execução. O `version-manifest.json` e o `sw.js` usam prioridade de rede. A navegação usa o shell cacheado da versão ativa para não misturar builds. Uma nova versão permanece em espera até o aluno selecionar **Salvar e atualizar**.

Antes de ativar a versão:

1. o tempo ativo é consolidado;
2. o rascunho atual é salvo;
3. o perfil criptografado é persistido;
4. o novo Service Worker assume o controle;
5. a página é recarregada com um conjunto coerente de arquivos.

A plataforma não força atualização no meio da investigação.

## Diagnóstico local

O perfil pode executar um diagnóstico que verifica localmente:

- WebGL e WebGL 2;
- núcleos de CPU e memória informada pelo navegador;
- benchmark curto de processamento;
- tamanho e orientação da tela;
- preferência de movimento reduzido;
- modo de economia de dados;
- uso e limite estimado do armazenamento;
- suporte a tela cheia, bloqueio de orientação, Service Worker e IndexedDB.

Nada é enviado a servidores. O resultado produz uma recomendação entre Baixo, Médio, Alto e Ultra. O aluno pode manter o modo Automático ou aplicar a recomendação ao perfil.

## Estabilidade 3D/360

- FPS, escala dinâmica e orientação passam a ser registrados no histórico imersivo.
- O modo Automático reduz também a quantidade de objetos conforme a escala dinâmica.
- FPS crítico persistente ativa o fallback 2D quando essa proteção estiver habilitada.
- Perda de contexto WebGL direciona a missão para o modo 2D sem apagar o rascunho.
- O modo imersivo tenta tela cheia e, quando autorizado, paisagem no celular.
- O aluno pode desativar a tentativa de paisagem e o fallback por baixo desempenho nas preferências.
- WebGL indisponível sempre utiliza o equivalente 2D, pois nenhuma missão pode ficar inacessível.

## Acabamento visual

- fontes auxiliares essenciais foram ampliadas;
- foco de teclado foi reforçado;
- safe areas foram aplicadas em celulares e tela cheia;
- HUD imersivo apresenta estado Estável, Ajustando ou Modo seguro;
- o objetivo permanece visível sem cobrir a maior parte da cena;
- avisos de orientação aparecem somente quando úteis;
- o banner de atualização não cobre a navegação móvel;
- movimento reduzido e modo foco continuam respeitados.

## Estruturas

- plataforma: 3.2.0;
- perfil: schema 15;
- workspace: versão 9;
- rascunho: versão 8;
- Service Worker: caches `ctfds-static-v3.2.0` e `ctfds-runtime-v3.2.0`.
