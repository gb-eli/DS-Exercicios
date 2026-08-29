# Preflight — Core sobre o Supabase existente

## Colisões detectadas e decisão

| Nome do modelo de referência | Já existia? | Decisão |
|---|---:|---|
| `profiles` | sim | reutilizar `profiles.id = auth.users.id`; não recriar |
| `platforms` | sim | reutilizar UUID; SDK envia `platformId` textual e backend resolve por `platforms.code` |
| `security_events` | sim | preservar supervisão de exercícios; criar `agv_core_security_events` para o Core |
| demais tabelas de aprendizagem/economia | não | criar conforme modelo adaptado |

O campo `platforms.code` possui constraint UNIQUE, permitindo usar códigos estáveis como `ctf-ds` sem trocar a PK UUID do portal atual.
