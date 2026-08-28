-- RLS de referência. Operações de escrita críticas devem ocorrer por RPC/Edge Functions protegidas.

alter table public.platforms enable row level security;
alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.activity_catalog enable row level security;
alter table public.progress_events enable row level security;
alter table public.activity_progress enable row level security;
alter table public.metric_ledger enable row level security;
alter table public.wallets enable row level security;
alter table public.wallet_ledger enable row level security;
alter table public.transaction_intents enable row level security;
alter table public.coin_transfers enable row level security;
alter table public.store_items enable row level security;
alter table public.inventory_instances enable row level security;
alter table public.inventory_ownership_history enable row level security;
alter table public.store_purchases enable row level security;
alter table public.marketplace_listings enable row level security;
alter table public.marketplace_sales enable row level security;
alter table public.admin_audit_log enable row level security;
alter table public.security_events enable row level security;

-- Catálogos públicos para usuários autenticados.
create policy "authenticated read active platforms" on public.platforms for select to authenticated using (is_active = true);
create policy "authenticated read activity catalog" on public.activity_catalog for select to authenticated using (is_active = true);
create policy "authenticated read store catalog" on public.store_items for select to authenticated using (is_active = true);

-- Diretório mínimo: perfis ativos podem ser pesquisados para destinatário P2P.
-- A tabela profiles foi propositalmente limitada a campos de exposição aceitável.
create policy "authenticated read active profiles" on public.profiles for select to authenticated using (is_active = true);
create policy "user update own profile" on public.profiles for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

-- Usuário enxerga seus próprios dados oficiais. Escrita é bloqueada por ausência de policies de insert/update.
create policy "user read own roles" on public.user_roles for select to authenticated using ((select auth.uid()) = user_id);
create policy "user read own progress events" on public.progress_events for select to authenticated using ((select auth.uid()) = user_id);
create policy "user read own activity progress" on public.activity_progress for select to authenticated using ((select auth.uid()) = user_id);
create policy "user read own metrics" on public.metric_ledger for select to authenticated using ((select auth.uid()) = user_id);
create policy "user read own wallet" on public.wallets for select to authenticated using ((select auth.uid()) = user_id);
create policy "user read own wallet ledger" on public.wallet_ledger for select to authenticated using ((select auth.uid()) = user_id);
create policy "user read own intents" on public.transaction_intents for select to authenticated using ((select auth.uid()) = actor_user_id);
create policy "user read own transfers" on public.coin_transfers for select to authenticated using ((select auth.uid()) in (from_user_id, to_user_id));
create policy "user read own inventory" on public.inventory_instances for select to authenticated using ((select auth.uid()) = owner_user_id);
create policy "current owner reads item provenance" on public.inventory_ownership_history for select to authenticated using (exists (select 1 from public.inventory_instances ii where ii.id=inventory_instance_id and ii.owner_user_id=(select auth.uid())));
create policy "user read own store purchases" on public.store_purchases for select to authenticated using ((select auth.uid()) = buyer_user_id);

-- Marketplace ativo é visível aos autenticados; vendas próprias são visíveis aos participantes.
create policy "authenticated read active marketplace" on public.marketplace_listings for select to authenticated using (status = 'active' or (select auth.uid()) = seller_user_id);
create policy "participants read marketplace sales" on public.marketplace_sales for select to authenticated using ((select auth.uid()) in (seller_user_id, buyer_user_id));

-- Audit/security ficam sem policy de leitura de cliente. Painel admin deve usar backend autorizado.

-- Grants mínimos sugeridos para Data API. Ajustar se o projeto usar configuração diferente.
revoke insert, update, delete on public.user_roles from anon, authenticated;
revoke insert, update, delete on public.progress_events from anon, authenticated;
revoke insert, update, delete on public.activity_progress from anon, authenticated;
revoke insert, update, delete on public.metric_ledger from anon, authenticated;
revoke insert, update, delete on public.wallets from anon, authenticated;
revoke insert, update, delete on public.wallet_ledger from anon, authenticated;
revoke insert, update, delete on public.transaction_intents from anon, authenticated;
revoke insert, update, delete on public.coin_transfers from anon, authenticated;
revoke insert, update, delete on public.inventory_instances from anon, authenticated;
revoke insert, update, delete on public.inventory_ownership_history from anon, authenticated;
revoke insert, update, delete on public.store_purchases from anon, authenticated;
revoke insert, update, delete on public.marketplace_sales from anon, authenticated;
revoke insert, update, delete on public.admin_audit_log from anon, authenticated;
revoke insert, update, delete on public.security_events from anon, authenticated;

-- O aluno pode alterar somente campos visuais do próprio perfil.
revoke update on public.profiles from authenticated;
grant update (display_name, avatar_url) on public.profiles to authenticated;

-- Catálogos/estado administrativo: sem escrita direta pelo cliente.
revoke insert, update, delete on public.platforms from anon, authenticated;
revoke insert, update, delete on public.activity_catalog from anon, authenticated;
revoke insert, update, delete on public.store_items from anon, authenticated;
revoke insert, update, delete on public.marketplace_listings from anon, authenticated;
revoke insert, delete on public.profiles from anon, authenticated;
