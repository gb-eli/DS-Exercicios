# Relatório de implementação — v2.2.3

## Objetivo

Fortalecer o acesso ao painel do professor, eliminar pistas previsíveis nas alternativas e reorganizar visualmente aulas, exercícios e área docente sem alterar o endereço publicado da plataforma.

## Segurança do painel

- A opção de qualquer navegador criar a primeira senha foi removida.
- O painel agora exige uma senha mestre definida antes da publicação.
- Somente salt e verificador PBKDF2-HMAC-SHA-256 com 310.000 iterações ficam no front-end.
- Cinco tentativas incorretas iniciam bloqueio temporário progressivo.
- A sessão é bloqueada depois de 12 minutos sem atividade.
- Há botão de bloqueio imediato.
- O conteúdo do painel não é renderizado antes da autenticação.
- `professor.html` recebeu `noindex`, `nofollow` e `noarchive`.
- O cofre local passou a usar uma base versionada nova para evitar conflito com credenciais antigas.

A senha mestre foi entregue separadamente ao professor e não faz parte deste relatório nem do repositório.

## Revisão pedagógica das alternativas

- Criado módulo de qualidade para revisar e auditar questões.
- Alternativas das Aulas 1 e 2 foram reescritas com distratores plausíveis e comprimentos mais equilibrados.
- Respostas corretas foram distribuídas igualmente entre as quatro posições de origem.
- A apresentação continua embaralhada a cada sessão.
- O teste automático reprova regressões de posição ou excesso de pistas pelo tamanho.

## Reorganização visual

### Aulas

- cabeçalho de comando mais claro;
- barra lateral com progresso, tempo e etapas;
- painel principal com melhor hierarquia;
- navegação responsiva;
- feedback e orientação destacados.

### Exercícios

- opções em cartões com letras fixas;
- alturas mínimas equilibradas;
- layout em duas colunas no computador e uma no celular;
- tipografia adaptativa para textos extensos;
- estados de foco, acerto e erro mais visíveis.

### Professor

- tela de login própria;
- indicadores de sessão protegida;
- painel inicial com métricas;
- gerador de senha da aula em destaque;
- importação com área de arrastar arquivos;
- rotina recomendada;
- filtros e resultados agrupados.

## Limitação técnica

GitHub Pages entrega arquivos estáticos ao navegador. Assim, a senha reduz acesso casual e dificulta descoberta direta, mas um usuário avançado ainda pode modificar o JavaScript localmente. Para segurança equivalente a conta institucional, o painel precisa de autenticação no servidor ou de um controle de acesso externo.
