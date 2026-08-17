# Matriz de validação visual e operacional — CTF DS v3.2.0

Esta matriz deve ser executada no endereço publicado do GitHub Pages. Ela complementa a suíte automatizada, pois screenshots e WebGL não puderam ser concluídos no ambiente de construção.

## Dispositivos mínimos

| Perfil | Resolução/orientação | Navegador | Qualidade inicial |
|---|---:|---|---|
| Computador escolar | 1366 × 768 | Chrome ou Edge | Automático |
| Chromebook | 1366 × 768 | ChromeOS Chrome | Automático |
| Android pequeno | 360 × 800, retrato/paisagem | Chrome | Automático/Baixo |
| Android médio | 390 × 844, retrato/paisagem | Chrome | Automático |
| Computador com GPU melhor | 1920 × 1080 | Chrome ou Edge | Alto/Ultra |

## Fluxo principal

- [ ] A página inicial abre sem rolagem horizontal.
- [ ] Cadastro, login, troca de conta e bloqueio funcionam.
- [ ] Objetivo da missão é identificado antes das gavetas.
- [ ] Gavetas não cobrem objetivo, progresso ou ações principais.
- [ ] Documento, registro, comunicação, arquivo e ferramenta abrem individualmente.
- [ ] Evidência pode ser fixada, anotada e removida.
- [ ] Hipótese, linha do tempo, recomendação e resposta permanecem após recarregar.
- [ ] A missão informa claramente o que falta no percurso investigativo.
- [ ] Conclusão apresenta debriefing e avanço do bloco.

## Mobile e tela cheia

- [ ] Safe areas não escondem botões ou HUD.
- [ ] Gavetas agrupadas podem ser usadas por toque sem gesto obrigatório de arrastar.
- [ ] Teclado virtual não cobre o campo de resposta.
- [ ] O modo imersivo entra e sai de tela cheia.
- [ ] A orientação paisagem é solicitada apenas quando suportada e autorizada.
- [ ] Ao voltar ao retrato, a missão permanece utilizável.
- [ ] O banner de atualização não cobre a navegação inferior.

## 3D/360 e fallback

- [ ] Câmera responde a mouse, toque, WASD e setas.
- [ ] Zoom e reinicialização da câmera funcionam.
- [ ] Objetivo e métricas não bloqueiam a cena.
- [ ] Estados Varredura, Incidente, Contenção e Recuperação são distinguíveis também por texto.
- [ ] O modo Automático reduz carga quando o FPS permanece baixo.
- [ ] FPS crítico persistente ativa o fallback 2D quando habilitado.
- [ ] Perda de WebGL não apaga o rascunho.
- [ ] Fechar o ambiente libera a GPU e não duplica listeners.
- [ ] Movimento reduzido elimina transições dispensáveis.
- [ ] Ultra não é necessário para concluir a missão.

## Atualização e offline

- [ ] A versão atual continua coerente enquanto uma atualização aguarda.
- [ ] O aviso **Salvar e atualizar** aparece quando existe novo Service Worker.
- [ ] Rascunho, tempo ativo e perfil são salvos antes da atualização.
- [ ] A aplicação recarrega na nova versão sem misturar HTML e módulos antigos.
- [ ] Após uma visita online, a página abre offline.
- [ ] Limpar apenas o cache da interface não remove perfis.
- [ ] Importar um backup anterior preserva progresso e aplica migração de schema.

## Acessibilidade

- [ ] Todo fluxo principal funciona por teclado.
- [ ] Foco visível aparece em botões, campos, gavetas e controles 3D.
- [ ] Leitor de tela anuncia títulos, objetivo, progresso e estado dos controles.
- [ ] Nenhuma informação depende somente de cor, animação ou áudio.
- [ ] Fontes essenciais permanecem legíveis a 200% de zoom.
- [ ] Alto contraste e modo foco preservam hierarquia.
- [ ] Redução de movimento e fallback 2D permitem concluir todas as missões.

## Registro do teste

Para cada falha, registrar:

1. versão publicada;
2. aparelho e navegador;
3. missão e ambiente;
4. passos para reproduzir;
5. screenshot ou gravação quando possível;
6. impacto: crítico, alto, médio ou baixo;
7. resultado esperado e resultado observado.
