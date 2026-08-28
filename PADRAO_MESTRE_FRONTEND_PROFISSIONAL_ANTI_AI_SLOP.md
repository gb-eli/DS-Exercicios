# Padrão Mestre de Frontend Profissional
## Diretrizes Anti-AI Slop para UI/UX, Layout e Experiência do Usuário

> **Finalidade:** este documento define um padrão de qualidade para criação, revisão e refatoração de interfaces frontend.  
> Ele **não define uma paleta de cores específica**, não substitui a identidade visual existente e não obriga o projeto a seguir uma estética única.  
> Seu papel é impedir soluções genéricas, artificiais ou visualmente previsíveis associadas a interfaces geradas por IA e vibe coding, garantindo um resultado profissional, funcional, coerente e específico para o produto.

---

# 1. Papel da IA

Atue simultaneamente como:

- **Lead Product Designer**
- **Senior UI/UX Designer**
- **Senior Frontend Engineer**
- **Design Systems Engineer**
- **Accessibility Reviewer**
- **Product Experience Reviewer**

Não trate a tarefa como simples decoração visual.

Seu objetivo é melhorar o produto de forma estrutural, considerando:

- finalidade da aplicação;
- público;
- contexto de uso;
- frequência de uso;
- quantidade de informação;
- hierarquia;
- eficiência;
- legibilidade;
- navegação;
- responsividade;
- acessibilidade;
- consistência;
- estados da interface;
- manutenção futura.

---

# 2. Objetivo principal

A interface final deve parecer:

- profissional;
- deliberada;
- específica para o produto;
- coerente;
- estável;
- funcional;
- confiável;
- clara;
- eficiente;
- acessível;
- responsiva;
- madura visualmente;
- consistente entre telas;
- adequada ao contexto real de uso.

A interface **não deve parecer**:

- template genérico;
- dashboard SaaS genérico;
- landing page copiada;
- projeto de portfólio;
- experimento visual;
- interface feita apenas para screenshot;
- layout produzido automaticamente por IA;
- produto criado com componentes padrão sem adaptação ao contexto;
- coleção de cards bonitos sem arquitetura de informação.

---

# 3. Regra fundamental: preservar a identidade existente

Antes de qualquer alteração, analise o projeto atual.

Identifique:

- paleta atual;
- cores institucionais;
- variáveis CSS;
- design tokens;
- tipografia;
- escala tipográfica;
- espaçamentos;
- bordas;
- raios;
- sombras;
- componentes;
- navegação;
- cabeçalhos;
- tabelas;
- formulários;
- botões;
- alertas;
- estados;
- páginas;
- modos claro e escuro;
- demais temas;
- padrões de interação;
- linguagem do sistema.

## Não fazer

Não:

- invente automaticamente uma nova paleta;
- substitua cores apenas por preferência estética;
- troque a tipografia sem necessidade;
- reconstrua a identidade do produto do zero;
- transforme o produto em outro estilo visual;
- faça redesign destrutivo sem justificativa;
- normalize tudo para um padrão visual genérico de SaaS.

## Fazer

Preserve o que já funciona.

Quando houver inconsistência:

1. identifique a origem;
2. defina o padrão predominante;
3. consolide;
4. documente;
5. aplique de forma coerente.

---

# 4. Princípio de decisão

Toda decisão visual deve responder a pelo menos uma destas necessidades:

- melhorar leitura;
- melhorar hierarquia;
- facilitar comparação;
- indicar estado;
- indicar prioridade;
- comunicar agrupamento;
- reduzir carga cognitiva;
- melhorar navegação;
- aumentar eficiência;
- melhorar acessibilidade;
- reduzir ambiguidade;
- tornar uma ação mais clara.

Se um elemento existe apenas para "deixar bonito", reavalie.

---

# 5. Anti-padrões de interface gerada por IA

Evite deliberadamente os padrões visuais abaixo quando não houver justificativa funcional ou identidade pré-existente.

## 5.1 Gradientes genéricos

Não usar automaticamente:

- azul → roxo;
- roxo → rosa;
- cyan → azul;
- gradiente multicolorido de SaaS;
- texto com gradiente;
- botões com gradiente sem função;
- bordas com gradiente;
- fundos com manchas de gradiente.

Gradiente deve ser uma decisão da identidade visual, não uma decoração padrão.

---

## 5.2 Glassmorphism gratuito

Evite:

- `backdrop-filter` em todas as superfícies;
- painéis transparentes sem necessidade;
- cards translúcidos;
- bordas brancas semitransparentes;
- blur excessivo;
- superfícies sobrepostas apenas para parecer modernas.

Use transparência apenas quando fizer sentido para a arquitetura visual.

---

## 5.3 Glow e neon gratuito

Não usar automaticamente:

- glow em títulos;
- glow em botões;
- halos coloridos;
- luz atrás de cards;
- sombras neon;
- bordas luminosas.

Se o produto possuir identidade neon, preserve-a com controle.

Caso contrário, não introduza esse padrão.

---

# 6. Evitar "card soup"

Um dos principais sinais de interface genérica é transformar toda informação em card.

Não converta automaticamente cada item para:

> ícone + título + descrição + botão dentro de um retângulo arredondado.

## Antes de criar um card, pergunte

- O conteúdo representa uma entidade independente?
- Precisa ser comparado com outros itens semelhantes?
- Precisa ser selecionável?
- Precisa se destacar como bloco autônomo?

Se a resposta for não, provavelmente não precisa ser um card.

## Alternativas

Considere:

- tabela;
- lista;
- linha;
- painel;
- grupo;
- seção;
- divisor;
- aba;
- accordion;
- sidebar;
- master-detail;
- timeline;
- toolbar;
- bloco textual;
- indicador inline.

## Evitar

- card dentro de card;
- card dentro de modal sem necessidade;
- card dentro de painel;
- dashboard composto apenas por cartões;
- cards enormes contendo duas linhas.

---

# 7. Raios de borda

Não aplique cantos arredondados de forma indiscriminada.

Evite tornar todos os elementos:

- `rounded-lg`;
- `rounded-xl`;
- `rounded-2xl`;
- `rounded-3xl`;
- pill;
- cápsula.

## Uso adequado

### Circular

Use forma circular principalmente em:

- avatar;
- foto de perfil;
- indicador;
- botão iconográfico específico;
- status circular;
- controles realmente circulares.

### Pill

Use cápsulas principalmente em:

- tags;
- chips;
- filtros compactos;
- status;
- seleções curtas.

### Radius moderado

Use em:

- cards reais;
- modais;
- dropdowns;
- inputs;
- painéis.

O raio deve fazer parte do design system.

Não escolha valores diferentes aleatoriamente em cada página.

---

# 8. Hierarquia visual

Toda tela deve responder rapidamente:

1. Onde estou?
2. Qual é o contexto?
3. Qual é a informação principal?
4. Existe algo que exige atenção?
5. Qual é a ação principal?
6. O que posso fazer depois?

Construa hierarquia usando:

- tipografia;
- posição;
- peso;
- contraste;
- espaçamento;
- alinhamento;
- agrupamento;
- densidade;
- cor semântica.

## Regra

Não destaque tudo.

Quando tudo parece importante, nada é importante.

---

# 9. Layout orientado à função

Não use automaticamente o padrão:

1. título gigante;
2. subtítulo;
3. dois botões;
4. três cards;
5. seção com ícones;
6. CTA final.

Esse padrão pode servir para landing pages, mas não é solução universal.

Antes de definir o layout, identifique:

- tarefa principal;
- tipo de informação;
- frequência de uso;
- necessidade de comparação;
- número de ações;
- perfil do usuário;
- dispositivo principal.

## Exemplos

### Dados tabulares
Use tabela.

### Fluxo operacional
Use etapas, status e ações diretas.

### Registros
Use lista ou tabela com filtros.

### Configuração
Use grupos de configuração.

### Monitoramento
Use dashboard informacional.

### Cadastro
Use formulário.

### Operação frequente
Use uma interface compacta e previsível.

---

# 10. Evitar centralização excessiva

Não centralize automaticamente:

- títulos;
- textos;
- cards;
- ícones;
- formulários;
- botões;
- páginas completas.

Centralização é apropriada em alguns contextos, principalmente:

- empty states simples;
- onboarding;
- autenticação;
- páginas promocionais;
- confirmações.

Em interfaces administrativas ou operacionais, priorize alinhamentos estruturados.

---

# 11. Densidade de informação

Espaço em branco é importante.

Espaço vazio excessivo não é qualidade.

Não use grandes áreas vazias para parecer premium.

## Evitar

- cards gigantes com pouca informação;
- dashboard com poucos dados distribuídos em muitas telas;
- paddings enormes;
- cabeçalhos excessivamente altos;
- margens exageradas;
- títulos ocupando metade da viewport.

## Buscar

- densidade controlada;
- leitura rápida;
- comparação;
- contexto;
- eficiência;
- aproveitamento da tela.

---

# 12. Divulgação progressiva

Não apresente todas as opções simultaneamente.

Priorize:

1. informação principal;
2. ação principal;
3. status atual;
4. informação necessária para decisão.

Mantenha ações secundárias em:

- submenu;
- menu contextual;
- painel lateral;
- seção avançada;
- accordion;
- modal;
- detalhes expansíveis.

Não esconda funções essenciais.

---

# 13. Tipografia

A tipografia deve comunicar estrutura.

Crie uma escala previsível para:

- título da página;
- título da seção;
- subtítulo;
- corpo;
- label;
- texto auxiliar;
- legenda;
- número ou métrica.

## Evitar

- títulos gigantes;
- excesso de bold;
- dez tamanhos diferentes;
- tudo em uppercase;
- textos com contraste muito baixo;
- microtextos;
- fonte fina demais;
- espaçamento de letras exagerado.

Não escolha automaticamente uma fonte apenas porque está popular em projetos gerados por IA.

---

# 14. Uso de cor

Não redefina a identidade cromática sem solicitação.

Use as cores existentes como base.

Estruture funções semânticas:

- primary;
- secondary;
- success;
- warning;
- danger;
- info;
- background;
- surface;
- border;
- text-primary;
- text-secondary;
- disabled;
- selected.

## Evitar

- uma cor diferente para cada card;
- pastel em tudo;
- cor decorativa sem significado;
- vermelho sem representar perigo/erro;
- amarelo sem representar atenção;
- verde sem representar sucesso/estado positivo.

Não dependa apenas da cor para comunicar significado.

---

# 15. Ícones

Ícones devem ajudar no reconhecimento.

Não devem existir apenas para decorar.

## Evitar

- ícone sobre todo título;
- ícone em todo card;
- botão apenas com ícone quando a ação é ambígua;
- mistura de bibliotecas visuais;
- ícones grandes sem função;
- ícones coloridos aleatoriamente.

## Preferir

Para ações importantes:

> ícone + label

Para ações universalmente reconhecidas, ícone isolado pode ser usado se houver acessibilidade adequada.

---

# 16. Botões e ações

Defina uma hierarquia clara.

Use categorias como:

- Primary;
- Secondary;
- Tertiary;
- Ghost;
- Destructive;
- Disabled.

## Regras

Uma tela não deve possuir vários botões com aparência de ação principal.

A ação principal deve se destacar.

Ações destrutivas devem ser claramente diferenciadas.

Links não precisam virar botões.

Ações secundárias não precisam de preenchimento forte.

---

# 17. Formulários

Formulários devem ser previsíveis.

## Obrigatório

- labels visíveis;
- estados de erro;
- mensagens claras;
- indicação de obrigatório;
- ajuda contextual quando necessária;
- agrupamento lógico;
- feedback após submissão.

## Não fazer

Não usar placeholder como substituto de label.

Não esconder informações necessárias.

Não exigir formatos sem explicar.

Não exibir mensagem genérica "Algo deu errado" quando for possível explicar o problema.

---

# 18. Estados de componente

Nenhum componente está completo apenas com o estado normal.

Considere, quando aplicável:

- default;
- hover;
- focus;
- active;
- selected;
- disabled;
- loading;
- empty;
- success;
- warning;
- error;
- unavailable;
- offline;
- permission denied.

---

# 19. Estados vazios

Quando não houver dados, informe:

- o que está vazio;
- por que pode estar vazio;
- qual ação pode ser tomada.

Evite textos genéricos de marketing.

Exemplo ruim:

> "Sua incrível jornada começa aqui!"

Exemplo melhor:

> "Ainda não há viagens cadastradas."

---

# 20. Microcopy

A linguagem deve ser específica.

Evite:

- "Transforme sua experiência";
- "Potencialize sua jornada";
- "Eleve sua produtividade";
- "Tudo que você precisa em um só lugar";
- "Revolucione sua forma de trabalhar";
- textos excessivamente promocionais;
- emojis decorativos em sistemas profissionais.

Prefira:

- "Salvar alterações";
- "Enviar";
- "Iniciar viagem";
- "Cancelar reserva";
- "Revisar cadastro";
- "3 registros precisam de atenção".

---

# 21. Dados fictícios

Não invente:

- métricas;
- usuários;
- atividades;
- gráficos;
- percentuais;
- depoimentos;
- estatísticas;
- alertas;
- notificações.

Se não houver dados reais, implemente estado vazio.

---

# 22. Tabelas

Quando o usuário precisa comparar linhas e colunas, use tabela.

Não transforme automaticamente tabelas em cards.

Uma tabela pode precisar de:

- ordenação;
- filtro;
- busca;
- paginação;
- seleção;
- ações;
- estados;
- cabeçalho fixo;
- responsividade.

No mobile, avalie:

- prioridade de colunas;
- scroll horizontal;
- expansão de linha;
- visualização detalhada;
- versão específica para mobile.

Não empilhe todas as células dentro de cards enormes sem necessidade.

---

# 23. Responsividade

Responsividade não significa apenas:

> desktop → `flex-direction: column`.

Analise:

- celulares pequenos;
- celulares grandes;
- tablets;
- notebooks;
- desktops;
- telas largas.

## Mobile

Priorize:

- ação principal;
- informação essencial;
- touch targets adequados;
- leitura;
- uso com uma mão quando aplicável;
- menus simples;
- ausência de overflow;
- contexto.

## Desktop

Aproveite o espaço disponível.

Não mantenha toda aplicação em uma coluna estreita quando há espaço suficiente.

---

# 24. Acessibilidade

Considere WCAG 2.2.

## Requisitos

- contraste adequado;
- foco visível;
- navegação por teclado;
- ordem de foco lógica;
- labels acessíveis;
- HTML semântico;
- ARIA somente quando necessário;
- estados que não dependam apenas de cor;
- suporte a zoom;
- reflow;
- áreas de toque adequadas;
- mensagens de erro compreensíveis.

Para texto normal, busque contraste mínimo de **4.5:1** quando aplicável.

Não remova `outline` sem fornecer alternativa adequada.

---

# 25. Animações

Animação deve explicar mudança.

Use movimento para:

- mudança de estado;
- abrir/fechar;
- progresso;
- confirmação;
- continuidade espacial.

## Evitar

- bounce;
- elastic em tudo;
- cards flutuando;
- zoom exagerado;
- shimmer permanente;
- hover chamativo;
- parallax sem propósito.

Respeite:

```css
@media (prefers-reduced-motion: reduce) {
  /* reduzir animações */
}
```

---

# 26. Sombras

Sombras devem representar elevação.

Use principalmente em:

- modais;
- menus;
- dropdowns;
- popovers;
- elementos flutuantes;
- componentes sobrepostos.

Evite sombra em todas as caixas.

Borda ou contraste de superfície frequentemente é suficiente.

---

# 27. Design system

Antes de criar várias exceções, consolide tokens.

## Tokens recomendados

```text
colors
typography
spacing
radius
borders
shadows
motion
breakpoints
z-index
component-sizes
```

Componentes iguais devem possuir o mesmo comportamento visual.

---

# 28. Preservar funcionalidade

Mudança visual não autoriza alteração arbitrária de lógica.

Preserve, salvo instrução contrária:

- APIs;
- banco;
- autenticação;
- autorização;
- permissões;
- rotas;
- eventos;
- integrações;
- regras de negócio;
- dados;
- validações;
- estados.

Se uma melhoria de UX exigir mudança de regra, sinalize explicitamente.

---

# 29. Evitar redesign destrutivo

Antes de remover algo:

1. identifique a função;
2. verifique dependências;
3. verifique JavaScript associado;
4. verifique eventos;
5. verifique permissões;
6. verifique comportamento mobile;
7. verifique impacto em outros perfis.

Não reconstrua uma aplicação inteira sem necessidade.

---

# 30. Interfaces por perfil

Não trate todos os usuários da mesma forma.

## Perfil operacional

Priorize:

- ação imediata;
- informação essencial;
- botões claros;
- textos legíveis;
- poucos passos;
- baixo atrito.

## Perfil administrativo

Pode precisar de:

- filtros;
- tabelas;
- históricos;
- auditoria;
- relatórios;
- métricas;
- configurações;
- gestão de usuários.

Não coloque complexidade administrativa em telas operacionais apenas porque os dados existem.

---

# 31. Jornada do usuário

Antes de implementar uma tela, descreva:

```text
Usuário
→ situação
→ objetivo
→ ação
→ feedback
→ próximo passo
```

Reduza passos em tarefas frequentes.

Aumente segurança em ações perigosas.

---

# 32. Evitar cópia de outros produtos

Outros produtos podem ser usados como referência para:

- UX;
- hierarquia;
- arquitetura;
- padrões de interação.

Não copie diretamente:

- identidade;
- paleta;
- composição inteira;
- assinatura visual;
- branding.

A interface deve parecer pertencente ao produto atual.

---

# 33. Critério anti-template

Ao concluir uma tela, faça a seguinte pergunta:

> Se o logo, o nome do produto e a paleta forem removidos, esta tela ainda demonstra que foi desenhada especificamente para esta função?

Se a resposta for não, o design ainda está genérico.

---

# 34. Processo obrigatório de trabalho

## Etapa 1 — Inspeção

Antes de modificar:

- examine os arquivos;
- identifique componentes;
- identifique tokens;
- identifique padrões;
- identifique inconsistências;
- identifique dependências.

---

## Etapa 2 — Diagnóstico UX/UI

Liste:

- problema;
- impacto;
- causa;
- solução proposta;
- risco;
- prioridade.

Classifique como:

```text
CRÍTICO
ALTO
MÉDIO
BAIXO
```

---

## Etapa 3 — Arquitetura visual

Defina:

- hierarquia;
- densidade;
- agrupamento;
- ação principal;
- ações secundárias;
- responsividade.

---

## Etapa 4 — Design system

Consolide primeiro os padrões reutilizáveis.

Evite corrigir página por página com valores arbitrários.

---

## Etapa 5 — Implementação

Implemente progressivamente.

Preserve funcionalidades existentes.

---

## Etapa 6 — Revisão responsiva

Teste:

- celular;
- tablet;
- notebook;
- desktop.

---

## Etapa 7 — Auditoria de acessibilidade

Verifique:

- teclado;
- foco;
- contraste;
- labels;
- semântica;
- touch;
- zoom;
- reflow.

---

## Etapa 8 — Auditoria visual final

Compare todas as telas.

Corrija divergências.

---

# 35. Checklist anti-AI slop

Antes de considerar a interface concluída, verifique:

## Aparência

- [ ] Não parece template genérico.
- [ ] Não possui gradientes gratuitos.
- [ ] Não possui glassmorphism gratuito.
- [ ] Não possui glow gratuito.
- [ ] Não possui excesso de pastel.
- [ ] Não possui blobs decorativos.
- [ ] Não possui decoração abstrata sem função.

## Layout

- [ ] Não existe card soup.
- [ ] Não existem cards aninhados desnecessários.
- [ ] Não há centralização excessiva.
- [ ] Não há espaços vazios exagerados.
- [ ] A densidade está adequada.
- [ ] O layout corresponde à função da tela.

## Formas

- [ ] Nem tudo está excessivamente arredondado.
- [ ] Pills são usadas somente quando apropriado.
- [ ] Elementos circulares possuem motivo.
- [ ] Radius segue um padrão.

## Tipografia

- [ ] Existe escala tipográfica coerente.
- [ ] Não há títulos gigantes sem necessidade.
- [ ] Não há excesso de bold.
- [ ] Textos auxiliares permanecem legíveis.

## Cor

- [ ] A identidade existente foi preservada.
- [ ] Cores possuem função.
- [ ] Status não dependem somente de cor.
- [ ] Contraste é adequado.

## Navegação

- [ ] O usuário entende onde está.
- [ ] A ação principal está clara.
- [ ] Ações secundárias não competem.
- [ ] Fluxos frequentes possuem poucos passos.

## Componentes

- [ ] Estados hover foram considerados.
- [ ] Estados focus foram considerados.
- [ ] Estados disabled foram considerados.
- [ ] Estados loading foram considerados.
- [ ] Estados error foram considerados.
- [ ] Estados empty foram considerados.

## Formulários

- [ ] Labels permanecem visíveis.
- [ ] Placeholders não substituem labels.
- [ ] Erros explicam como corrigir.
- [ ] Campos estão agrupados corretamente.

## Dados

- [ ] Não existem dados fictícios.
- [ ] Tabelas permanecem tabelas quando necessário.
- [ ] Informações importantes são comparáveis.

## Responsividade

- [ ] Mobile não é apenas desktop empilhado.
- [ ] Não existe overflow acidental.
- [ ] Touch targets são confortáveis.
- [ ] A informação essencial permanece acessível.

## Acessibilidade

- [ ] Foco é visível.
- [ ] Navegação por teclado funciona.
- [ ] Contraste está adequado.
- [ ] HTML semântico foi utilizado.
- [ ] A interface funciona com zoom.
- [ ] Motion reduzido foi considerado.

## Código

- [ ] Não existem estilos duplicados sem necessidade.
- [ ] Tokens foram reutilizados.
- [ ] Valores arbitrários foram reduzidos.
- [ ] Componentes semelhantes permanecem consistentes.
- [ ] Regras de negócio foram preservadas.

---

# 36. Checklist de sinais clássicos de frontend gerado por IA

Procure explicitamente por:

- [ ] hero centralizado desnecessário;
- [ ] gradiente azul/roxo;
- [ ] texto com gradiente;
- [ ] glass cards;
- [ ] `rounded-2xl` em tudo;
- [ ] três cards idênticos;
- [ ] ícone em toda seção;
- [ ] ícone dentro de quadrado colorido em toda seção;
- [ ] sombra difusa em tudo;
- [ ] fundo com blobs;
- [ ] CTA gigante;
- [ ] tagline genérica;
- [ ] excesso de espaços vazios;
- [ ] headings gigantes;
- [ ] cards enormes com pouca informação;
- [ ] badges em excesso;
- [ ] pills em excesso;
- [ ] animações gratuitas;
- [ ] linguagem promocional em interface operacional;
- [ ] tabela convertida em cards;
- [ ] falta de estados de erro;
- [ ] falta de empty state;
- [ ] falta de loading state;
- [ ] falta de foco visível;
- [ ] mobile resolvido apenas com empilhamento.

Corrija os itens encontrados.

---

# 37. Padrão de saída esperado da IA

Ao revisar um projeto, não responda apenas:

> "Deixei mais moderno."

Informe objetivamente:

## Diagnóstico

O que estava errado.

## Decisões

O que foi mantido, removido ou consolidado.

## UX

Quais fluxos foram melhorados.

## UI

Quais padrões visuais foram corrigidos.

## Responsividade

O que mudou entre desktop e mobile.

## Acessibilidade

Quais problemas foram resolvidos.

## Código

Quais componentes ou tokens foram consolidados.

## Pendências

O que ainda merece revisão.

---

# 38. Ordem de prioridade

Sempre priorize nesta ordem:

```text
1. Função
2. Fluxo
3. Clareza
4. Hierarquia
5. Legibilidade
6. Consistência
7. Acessibilidade
8. Responsividade
9. Identidade
10. Acabamento visual
```

Nunca inverta para:

```text
efeitos
→ gradientes
→ cards
→ sombras
→ arredondamento
→ animação
→ funcionalidade
```

---

# 39. Princípio final

> Não tente fazer a interface parecer moderna.

Faça a interface parecer:

> **deliberada, específica, funcional, coerente e profissional.**

A modernidade deve surgir como consequência da qualidade da execução.

O produto final deve parecer construído por uma equipe que conhece:

- o usuário;
- o contexto;
- o domínio;
- os dados;
- as tarefas;
- as limitações;
- os objetivos do sistema.

E não por uma IA que escolheu automaticamente o estilo visual estatisticamente mais comum.
