-- GINOVO 관리자 로그인 권한 기반
-- Supabase SQL Editor 또는 CLI migration으로 실행합니다.

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'publisher' check (role = 'publisher'),
  active boolean not null default true,
  display_name text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists admin_users_active_user_idx
  on public.admin_users (user_id)
  where active = true;

alter table public.admin_users enable row level security;
revoke all on table public.admin_users from anon, authenticated;
grant select on table public.admin_users to authenticated;

drop policy if exists "publisher reads own membership" on public.admin_users;
create policy "publisher reads own membership"
  on public.admin_users
  for select
  to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id);

create or replace function public.is_active_publisher()
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = (select auth.uid())
      and role = 'publisher'
      and active = true
  );
$$;

revoke all on function public.is_active_publisher() from public;
grant execute on function public.is_active_publisher() to authenticated;

comment on table public.admin_users is
  'Supabase Auth 사용자 중 GINOVO 관리자 접근이 허용된 publisher 목록';
