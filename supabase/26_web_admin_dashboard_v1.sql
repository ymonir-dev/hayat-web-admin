-- Hayat Web Admin / Dashboard V1
-- Additive migration for the WEB PLATFORM ADMIN layer only.
-- Existing hospital Owner/Admin/Manager/Auditor pages use the already-installed V16-V20.4 RPCs.
-- IMPORTANT: Never expose a Supabase service-role key in the browser.

create table if not exists public.hayat_platform_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.hayat_platform_admins enable row level security;
drop policy if exists hayat_platform_admins_no_direct_access on public.hayat_platform_admins;
create policy hayat_platform_admins_no_direct_access on public.hayat_platform_admins
for all to authenticated using(false) with check(false);

create or replace function public.hayat_is_platform_admin()
returns boolean language sql stable security definer set search_path=public as $$
  select exists(
    select 1 from public.hayat_platform_admins a
    where a.user_id=auth.uid() and a.is_active=true
  );
$$;
grant execute on function public.hayat_is_platform_admin() to authenticated;

create or replace function public.hayat_platform_guard()
returns void language plpgsql security definer set search_path=public as $$
begin
  if not public.hayat_is_platform_admin() then
    raise exception 'Hayat Platform Administrator access required';
  end if;
end $$;
grant execute on function public.hayat_platform_guard() to authenticated;

create or replace function public.hayat_platform_overview()
returns jsonb language plpgsql security definer set search_path=public as $$
begin
  perform public.hayat_platform_guard();
  return jsonb_build_object(
    'total_hospitals',(select count(*) from public.hospitals),
    'active_hospitals',(select count(*) from public.hospitals where coalesce(is_active,true)=true),
    'provider_accounts',(select count(*) from public.provider_accounts),
    'pending_accounts',(select count(*) from public.provider_accounts where status='pending'),
    'owners',(select count(*) from public.provider_accounts where role='owner' and status='approved'),
    'branches',(select count(*) from public.hospital_branches)
  );
end $$;
grant execute on function public.hayat_platform_overview() to authenticated;

create or replace function public.hayat_platform_hospitals()
returns table(
  id uuid,
  name text,
  is_active boolean,
  branch_count bigint,
  staff_count bigint,
  owner_name text,
  owner_email text
)
language plpgsql security definer set search_path=public as $$
begin
  perform public.hayat_platform_guard();
  return query
  select h.id,h.name::text,coalesce(h.is_active,true),
    (select count(*) from public.hospital_branches b where b.hospital_id=h.id),
    (select count(*) from public.provider_accounts a where a.hospital_id=h.id),
    (select a.full_name::text from public.provider_accounts a where a.hospital_id=h.id and a.role='owner' and a.status='approved' order by a.created_at limit 1),
    (select a.email::text from public.provider_accounts a where a.hospital_id=h.id and a.role='owner' and a.status='approved' order by a.created_at limit 1)
  from public.hospitals h
  order by coalesce(h.is_active,true) desc,h.name;
end $$;
grant execute on function public.hayat_platform_hospitals() to authenticated;

create or replace function public.hayat_platform_accounts()
returns table(
  id uuid,
  hospital_id uuid,
  hospital_name text,
  full_name text,
  email text,
  role text,
  status text,
  job_title text,
  created_at timestamptz
)
language plpgsql security definer set search_path=public as $$
begin
  perform public.hayat_platform_guard();
  return query
  select a.id,a.hospital_id,h.name::text,a.full_name::text,a.email::text,a.role::text,a.status::text,a.job_title::text,a.created_at
  from public.provider_accounts a
  join public.hospitals h on h.id=a.hospital_id
  order by a.created_at desc
  limit 1000;
end $$;
grant execute on function public.hayat_platform_accounts() to authenticated;

create or replace function public.hayat_platform_set_hospital_active(p_hospital_id uuid,p_active boolean)
returns void language plpgsql security definer set search_path=public as $$
begin
  perform public.hayat_platform_guard();
  update public.hospitals set is_active=p_active where id=p_hospital_id;
  if not found then raise exception 'Hospital not found'; end if;
end $$;
grant execute on function public.hayat_platform_set_hospital_active(uuid,boolean) to authenticated;

create or replace function public.hayat_platform_set_provider_status(p_account_id uuid,p_status text)
returns void language plpgsql security definer set search_path=public as $$
begin
  perform public.hayat_platform_guard();
  if p_status not in ('pending','approved','suspended','rejected') then raise exception 'Invalid status'; end if;
  update public.provider_accounts set status=p_status,updated_at=now() where id=p_account_id;
  if not found then raise exception 'Provider account not found'; end if;
end $$;
grant execute on function public.hayat_platform_set_provider_status(uuid,text) to authenticated;

-- ONE-TIME PLATFORM SUPER ADMIN BOOTSTRAP
-- 1) Create/sign up a Supabase Auth user for the Hayat platform administrator.
-- 2) Replace the email below and run this statement ONCE in Supabase SQL Editor:
--
-- insert into public.hayat_platform_admins(user_id)
-- select id from auth.users where lower(email)=lower('YOUR_PLATFORM_ADMIN_EMAIL@example.com')
-- on conflict (user_id) do update set is_active=true;
--
-- This is a platform-level root account, not a hospital Owner account.
