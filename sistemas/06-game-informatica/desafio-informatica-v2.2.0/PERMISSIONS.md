# Permissões, Finalidades e Alternativas

**Manifesto:** `permissions-manifest.json` · versão 1.0.0

A plataforma deve explicar a finalidade antes de qualquer solicitação. Nesta versão não são usados câmera, microfone, localização, notificações, Bluetooth, USB, biometria ou reconhecimento facial.

| Recurso | Finalidade educacional | Obrigatório | Alternativa |
|---|---|---:|---|
| Armazenamento persistente | Manter perfil criptografado, progresso e aceites | Não | Sessão temporária e exportação |
| Seleção de arquivo | Importar backup ou resultado escolhido pelo usuário | Não | Continuar sem importar |
| Download | Gerar PDF, termo, resultado ou backup | Não | Tentar novamente em navegador compatível |
| Área de transferência | Copiar código-base EduAuth ou texto solicitado | Não | Digitação manual |
| Síntese de voz | Ler código-base como acessibilidade | Não | Leitura visual ou cópia |

A seleção de arquivos e o download são iniciados pelo usuário. A plataforma não lê pastas inteiras, não acessa a área de transferência automaticamente e não mantém síntese de voz ativa após a ação.
