# Relatório de testes — CTF DS v3.2.0

## Validações automatizadas concluídas

- 68 missões, pré-requisitos e verificadores;
- sete blocos na distribuição 10 + 10 + 10 + 10 + 10 + 10 + 8;
- 68 casos investigativos materializados individualmente;
- 58 investigações avançadas e 68 casos narrativos;
- 36 casos integrados diretamente à Simulation Suite;
- sete arcos narrativos e personagens recorrentes;
- documentos, registros, comunicações, arquivos, ferramentas e evidências em todos os casos;
- alcance de todos os materiais e percurso de conclusão possível nas 68 missões;
- linhas do tempo, decisões, anotações, ajuda em camadas e desbloqueios progressivos;
- seis simuladores locais sem conexão externa;
- oito ambientes 3D/360 e 55 associações com missões;
- fallback 2D para todos os ambientes;
- presets Automático, Baixo, Médio, Alto e Ultra;
- adaptação dinâmica de escala e partículas por FPS;
- pausa de renderização com página oculta e descarte ao fechar;
- workspace versão 9, rascunho versão 8 e perfil schema 15;
- tempo ativo, retomada e trava entre abas;
- 62 comprovantes AES-GCM e seis validadores estruturais;
- EduAuth, IndexedDB, PBKDF2, AES-GCM, backup e recuperação;
- ledger, três saldos, compras e detecção de adulteração;
- termos, evidência, XSS e escopo autorizado;
- sintaxe de todos os módulos JavaScript;
- validade de todos os arquivos JSON;
- existência dos 125 recursos declarados no Service Worker;
- ausência de arquivos privados de construção no pacote público.

## Comandos executados

```text
npm test
node --check <todos os módulos JavaScript>
JSON.parse <todos os arquivos JSON>
verificação de todos os recursos do Service Worker
```

Resultado: todas as suítes automatizadas concluídas sem falhas no diretório de trabalho. A mesma suíte também deve ser executada sobre o ZIP extraído antes da publicação.

## Verificação visual

Foi tentada captura com Chromium headless em 1366 × 768. O navegador não concluiu dentro do limite porque o ambiente não conseguiu inicializar EGL/ANGLE e o processo de GPU. Nenhuma captura válida foi produzida.

Por isso, esta entrega não declara validação visual automatizada completa. A inspeção definitiva deve seguir `VISUAL_QA_MATRIX.md` no endereço publicado do GitHub Pages, especialmente em:

- Chrome e Edge no Windows;
- Chrome Android;
- Chromebook;
- modo offline;
- orientação retrato e paisagem;
- qualidade Automático e Ultra;
- fallback 2D;
- troca entre ambientes e liberação de GPU.
