# Validação do pacote — v14.10.8

- Data: 21/08/2026
- Base operacional: v14.10.7
- Fase: P10.8 — prioridade da referência sincronizada e metadados reconciliados
- Testes Node: 204/204 PASS
- JavaScript: `node --check` PASS
- JSON: leitura e parse integral PASS
- Catálogo público: 62 atividades
- Referências: cobertura integral dos arquivos esperados no catálogo atual
- Supabase: referência sincronizada tem prioridade inclusive por aliases equivalentes
- Editor/referência: mesma fonte, tamanho, altura de linha e zoom conjunto de 11 a 22 px
- Mobile/notebook: regras de gutter, barra de arquivos, controles de fonte e abas de saída validadas
- GitHub/Classroom: ações permanentes e salvamento anterior à abertura preservados
- Autocorreção: conclusão durante a digitação; acerto/erro server-side após pausa
- Supervisão: eventos de saída registrados sem bloqueio automático por quantidade
- SQL novo nesta versão: NÃO
- Edge Function nova nesta versão: NÃO
- Backend: inalterado em relação à v14.10.7
- Regras privadas no bundle público: NÃO

A v14.10.8 é cumulativa e deve substituir integralmente o frontend anterior. Depois da publicação, execute um smoke autenticado de login, abertura de exercício, salvamento, autocorreção, entrega, GitHub, Classroom, logout e retorno de tela cheia.
