-- Public website content. Run after 202609210001_admin_auth.sql.
create table if not exists public.site_content (
  content_key text primary key,
  content_value jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;

revoke all on table public.site_content from anon, authenticated;
grant select on table public.site_content to anon, authenticated;
grant insert, update, delete on table public.site_content to authenticated;

drop policy if exists "Everyone can read site content" on public.site_content;
create policy "Everyone can read site content"
  on public.site_content for select to anon, authenticated using (true);

drop policy if exists "Publishers can add site content" on public.site_content;
create policy "Publishers can add site content"
  on public.site_content for insert to authenticated
  with check ((select public.is_active_publisher()));

drop policy if exists "Publishers can update site content" on public.site_content;
create policy "Publishers can update site content"
  on public.site_content for update to authenticated
  using ((select public.is_active_publisher()))
  with check ((select public.is_active_publisher()));

drop policy if exists "Publishers can delete site content" on public.site_content;
create policy "Publishers can delete site content"
  on public.site_content for delete to authenticated
  using ((select public.is_active_publisher()));
