# Deploy e sessão única

## Recomendação principal

Hospedar o portal e as plataformas sob **a mesma origem** (mesmo protocolo, host e porta), usando caminhos diferentes. Exemplo conceitual:

- `/` — portal/central;
- `/apps/ctf/`;
- `/apps/lab-virtual/`;
- `/apps/planetario/`;
- `/apps/fliperama/`;
- `/apps/lab-ds1/` etc.

Isso reduz complexidade de sessão, CORS, compartilhamento de configuração e navegação.

## Se as plataformas ficarem em origens diferentes

Não copie token por query string e não tente sincronizar senha/localStorage entre domínios. Implemente um fluxo central de autenticação/redirect seguro e valide a sessão novamente no destino. A estratégia exata deve seguir a versão atual do Supabase Auth usada no projeto.

## Configuração compartilhada

Todas as plataformas devem apontar para o mesmo projeto/Auth/Core e usar a mesma versão do SDK. O frontend contém somente URL e publishable key; segredo administrativo fica no backend.

## Service Workers

Ao consolidar várias PWAs no mesmo domínio, revise cuidadosamente `scope` e caminhos de cache para um Service Worker de uma plataforma não interceptar arquivos de outra. Cada aplicação deve ter escopo explícito e cache prefixado pelo `platform_id`/versão.
