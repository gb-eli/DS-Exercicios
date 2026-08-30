# AGV Education Core — v14.10.8.64
## Fase 62C — Cidade Viva e Integração Sistêmica

Base obrigatória: **v14.10.8.63**

### Implementado
- interiores especializados para os 10 prédios conectados;
- recepcionistas/NPCs contextuais por prédio;
- mapa interno por pavimento;
- rotas guiadas visíveis em 2D e 3D;
- ambientes especializados com função própria;
- elevadores com feedback/animação local no 3D;
- frota leve nas garagens do Campus;
- conectores físicos entre estações e distritos;
- Portal Metropolitano AGV reforçando a transição Campus ↔ Vale;
- botão `🗺 Interior` visível apenas dentro de prédio conectado;
- continuidade de sessão AGV e portais reais preservada.

### Segurança e arquitetura
- nenhuma migration SQL;
- nenhuma alteração de schema Supabase;
- nenhuma service_role/sb_secret adicionada ao frontend;
- 2D continua sendo a entrada oficial;
- 3D continua opcional;
- presença pública continua ancorada no exterior do prédio.

### Aplicação
Aplicar por **sobreposição** sobre a v14.10.8.63.
Não excluir arquivos do repositório.

### Validadores
```bash
node core/tools/validate-campus-city-v62.mjs
node core/tools/validate-campus-interiors-v63.mjs
node core/tools/validate-campus-live-v64.mjs
node core/tools/validate-unified-auth-v59.mjs .
```

### Pós-publicação
Validar em navegador real:
1. entrar em um dos 10 prédios;
2. abrir `🗺 Interior`;
3. iniciar uma rota guiada;
4. testar elevador e escada;
5. conversar com o recepcionista;
6. sair pela garagem onde disponível;
7. circular pela conexão de estação;
8. testar transição visual Campus ↔ Vale;
9. repetir em modo 2D e modo 3D;
10. smoke mobile/Android.

> Teste visual real WebGL não foi executado neste empacotamento offline.
