# Auditoria de referências e metadados — v14.10.8

Data: 21/08/2026

## Correções

- A referência sincronizada do Supabase agora tem prioridade sobre a contingência local mesmo quando o banco e o exercício usam nomes equivalentes, como `style.css`/`estilo.css`, `app.js`/`script.js`, `atividade.md`/`referencia.md` e `main.kt`/`MainActivity.kt`.
- Dentro da mesma fonte, o nome exato do arquivo continua tendo prioridade.
- Metadados de fase, versão visual, release pública e cache bust foram sincronizados em v14.10.8 / UI 0.22.8.
- O histórico cumulativo das fases 10.6 e 10.7 foi preservado; esta atualização não exige nova migração ou nova Edge Function.

## Verificações

- Catálogo público: 62 atividades.
- Cobertura de referências de programação: integral para os arquivos esperados pelo catálogo atual.
- Referência e editor: mesma família, tamanho e altura de linha, com zoom conjunto de 11 a 22 px.
- GitHub e Classroom: ações permanentes, com barreira de salvamento antes da abertura.
- Autocorreção: conclusão local durante a digitação e acerto/erro server-side após pausa.
- Supervisão: saídas continuam registradas, sem bloqueio automático por quantidade.
- Regressão: suíte Node completa e validações específicas da v14.10.8.
