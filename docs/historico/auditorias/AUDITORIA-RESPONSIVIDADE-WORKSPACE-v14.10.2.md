# Auditoria — Responsividade e estabilidade do workspace v14.10.2

Data: 19/08/2026  
Base auditada: v14.10.1 / Atividades 0.22.1  
Resultado: **APROVADO — 169/169 testes**

## Escopo da fase

Esta fase concentrou-se em bugs que aparecem ao mudar o tamanho da tela ou aumentar a fonte do código: alinhamento entre editor/referência, gutter, abas de arquivos, status de salvamento, controles de zoom e navegação das abas de saída.

## Achados e correções

### 1. Gutter estreito com fonte grande
Na v14.10.1 o gutter tinha largura fixa (44/54 px). Com fonte em 18–22 px, números de 3 ou 4 dígitos podiam ficar apertados ou cortados.

**Correção:** o gutter passa a ser calculado junto com o zoom e varia entre 52 e 70 px. A mesma variável `--code-gutter-width` é aplicada a:
- números de linha do editor;
- deslocamento do textarea;
- camada de syntax highlight;
- coluna de números da referência.

### 2. Barra de arquivos mobile usava sobreposição frágil
A subbar usava `margin-top:-34px` no status de salvamento e `width:calc(100% - 76px)` nas abas. Essa combinação podia sobrepor arquivos/status em celulares e com textos maiores.

**Correção:** a barra agora usa grid responsivo, sem margem negativa e sem largura calculada artificial. Abaixo de 430 px o status passa para sua própria linha.

### 3. Controles de fonte espremidos no mobile
Os controles `− / tamanho / +` dividiam a grade com botões de download/GitHub/Classroom.

**Correção:** em telas até 760 px os controles ocupam a largura completa e ficam centralizados em linha própria.

### 4. Abas Referência / Preview / Terminal
Em telas muito estreitas, as abas poderiam ultrapassar a largura útil.

**Correção:** a faixa ganhou rolagem horizontal segura e cada aba mantém largura própria sem compressão.

### 5. Metadata do pacote estava inconsistente
`PUBLIC-DEPLOY.json` ainda informava v14.9.1/UI 0.21.1. O `release-current.json` também podia ser interpretado como frontend já publicado apesar de ainda haver smoke/deploy pendente.

**Correção:** metadata consolidada para v14.10.2 / UI 0.22.2 e `liveDeployApplied=false` até a publicação real ser verificada.

## Itens preservados da fase anterior

- saída/troca de foco registrada sem bloqueio automático por quantidade;
- referência e editor com mesma tipografia e line-height;
- zoom de 11 a 22 px com persistência local;
- uma linha visual por linha real do código;
- nenhuma linha final fantasma;
- referência, editor e highlight sincronizados;
- botões Classroom/GitHub/download/salvar preservados;
- autocorreção e métricas Conclusão/Acerto/Erro preservadas;
- preview isolado e `defer` preservado.

## Validação

- Suíte Node: **169 testes / 169 aprovados / 0 falhas**.
- JavaScript: **711 arquivos verificados com `node --check` / 0 falhas**.
- CSS principal: chaves balanceadas (**644 / 644**).
- Teste novo: `core/tests/p102-responsive-workspace-v14.10.2.test.mjs`.

## Publicação

Não há mudança de banco nem nova Edge Function nesta fase.  
O backend permanece o mesmo da v14.10.1.  
É necessário publicar o frontend v14.10.2 e fazer smoke autenticado em desktop e celular.

## Higiene do pacote público

Durante a montagem do deploy foram encontradas pastas internas `tools/` e `tests/` dentro de plataformas integradas. Elas não são necessárias em produção. A v14.10.2 remove essas pastas somente do ZIP público, preservando-as no projeto completo para desenvolvimento. A varredura final do deploy público não encontrou service role, `sb_secret_` nem regras privadas do corretor.
