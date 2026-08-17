# Validação — Loja Virtual DS v0.9.4.3

## Escopo

Validação da revisão gráfica estrutural e dos modos oficiais **Básico, Intermediário, Avançado, Ultra e Modo Realismo**. A fase preserva catálogo, carteira, SDK, equipamentos, VFX e modelos 3D da v0.9.4.2.

## Resultado geral

**APROVADO**, com a limitação ambiental descrita ao final.

## Testes estruturais

| Validação | Resultado |
|---|---:|
| Modos gráficos oficiais | 18 verificações aprovadas |
| Regressão geral | 11 grupos aprovados |
| Catálogo | 71 produtos válidos |
| Equipamentos 3D | 36 GLBs preservados |
| Avatar | 3 LODs válidos, 18 clips por LOD |
| VFX | 17 efeitos e 8 falas |
| Pacotes | 8 pacotes, 321 referências |
| JSON | 90 arquivos válidos |
| JavaScript | 20 arquivos aprovados no `node --check` |
| Referências HTML locais | 82 verificadas, nenhuma ausente |
| GitHub Pages | ponto de entrada e caminhos aprovados |

## Teste dos cinco modos no Chromium

O runtime foi alternado programaticamente entre os cinco modos. Em todos os casos, o modo solicitado, o modo efetivo, o atributo `data-quality` e o card ativo permaneceram sincronizados:

- Básico → `basic`
- Intermediário → `intermediate`
- Avançado → `advanced`
- Ultra → `ultra`
- Modo Realismo → `realism`

Não houve erro de console nem exceção de página durante a alternância.

## Responsividade

Teste em **390 × 844**:

- largura do documento: 390 px;
- largura útil: 390 px;
- nenhuma rolagem horizontal indevida;
- seis opções gráficas reconhecidas, incluindo Automático;
- cinco botões na navegação móvel.

## Persistência e migração

Foram validados:

- aliases das configurações antigas;
- `economy` migrado para `basic`;
- `balanced` migrado para `intermediate`;
- `high` migrado para `advanced`;
- `ultraAdvanced` migrado para `realism`;
- prioridade de FPS/qualidade preservada;
- modo preferido persistido por dispositivo;
- pacotes altos continuam dependentes de preparação explícita.

## Contratos visuais e de desempenho

Cada modo possui limites próprios para DPR, LOD, sombras, partículas, pós-processamento, qualidade de materiais, cenário e meta de FPS. A troca de modo atualiza avatar, prévia de produto, VFX, orçamento de memória e identificação visual sem remover funções.

## Animações

Os 18 clips existentes em cada LOD foram preservados. O catálogo agora declara suporte por modo, transição, fallback, perfil de movimento e cenário de prévia. O Modo Básico reduz apenas movimento e efeitos não essenciais; os modos superiores mantêm a animação completa.

Esta fase não reconstrói o esqueleto rígido atual. A reconstrução profunda de rig, cotovelos, joelhos, coluna e blending corporal permanece planejada para a v0.9.4.4.

## Limitação ambiental

A política administrativa do Chromium bloqueou navegação direta para `localhost`. A interface foi testada por injeção integral do HTML, CSS, configurações e scripts reais. Nesse ambiente, WebGL ficou indisponível e o fallback 2D foi usado. Portanto, GLBs, slots e clips foram validados estruturalmente, mas não se afirma inspeção visual automatizada das animações WebGL nesta execução.
