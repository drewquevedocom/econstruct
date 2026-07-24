-- Per-user CRM auth: profiles table linking auth.users to a role.
-- Seeding (Drew/Frank owner, Katie staff) is a one-time script, not run here.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null unique,
  role text not null check (role in ('owner','staff')),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Users can read their own profile
create policy "read own profile" on public.profiles
  for select using (auth.uid() = id);
