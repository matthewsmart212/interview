-- Interview Coach schema
-- Run this in Supabase Dashboard → SQL Editor → New query → Run
-- Project: qxybmhzwnykahvtuvmkq

-- Extensions
create extension if not exists "pgcrypto";

-- Profiles (1:1 with auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  goal text check (goal is null or goal in ('interview','apply','practice','both')),
  preferences jsonb not null default '{"interviewFormat":"In-person","voicePractice":true}'::jsonb,
  streak integer not null default 0,
  onboarding_completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Master CV (one active per user)
create table if not exists public.master_cvs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  exists boolean not null default false,
  source text check (source is null or source in ('upload','create','seed')),
  file_name text not null default '',
  storage_path text,
  updated_at text not null default '',
  score integer not null default 0,
  summary text not null default '',
  sections jsonb not null default '{"experience":[],"education":[],"skills":[]}'::jsonb,
  created_at timestamptz not null default now(),
  unique (user_id)
);

-- CV history
create table if not exists public.cv_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  file_name text not null,
  storage_path text,
  uploaded_at text not null,
  score integer not null default 0,
  is_current boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists cv_history_user_idx on public.cv_history(user_id, created_at desc);

-- Interviews
create table if not exists public.interviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null,
  company text not null default 'Company',
  initials text not null default '?',
  accent text not null default '#7c3aed',
  type text not null default 'In-person',
  date text not null default '',
  date_chip jsonb not null default '{"d":"—","m":"—"}'::jsonb,
  days_away integer not null default 0,
  status text not null default 'upcoming' check (status in ('upcoming','past')),
  outcome text,
  readiness integer not null default 0,
  has_jd boolean not null default false,
  jd text,
  jd_highlights jsonb not null default '[]'::jsonb,
  tailored_cv jsonb not null default '{"exists":false}'::jsonb,
  mock_ids jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists interviews_user_idx on public.interviews(user_id, created_at desc);

-- Tailored CVs
create table if not exists public.tailored_cvs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  interview_id uuid not null references public.interviews(id) on delete cascade,
  score integer not null default 0,
  updated_at text not null default '',
  changes jsonb not null default '[]'::jsonb,
  content jsonb,
  created_at timestamptz not null default now(),
  unique (interview_id)
);

-- Mock sessions / history
create table if not exists public.mock_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  interview_id uuid references public.interviews(id) on delete set null,
  context_mode text not null default 'generic',
  context_label text not null default 'Generic Practice',
  role text not null default 'Practice interview',
  company text not null default 'Generic',
  date text not null default '',
  time text not null default '',
  score integer not null default 0,
  headline text not null default '',
  questions integer not null default 5,
  duration_min integer not null default 10,
  best text not null default '',
  weakest text not null default '',
  skills jsonb not null default '[]'::jsonb,
  feedback jsonb,
  answers jsonb,
  completed_at timestamptz not null default now()
);

create index if not exists mock_sessions_user_idx on public.mock_sessions(user_id, completed_at desc);

-- Saved practice questions
create table if not exists public.saved_questions (
  user_id uuid not null references public.profiles(id) on delete cascade,
  question_id text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, question_id)
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'full_name', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- updated_at helper
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists interviews_updated_at on public.interviews;
create trigger interviews_updated_at
  before update on public.interviews
  for each row execute function public.set_updated_at();

-- RLS
alter table public.profiles enable row level security;
alter table public.master_cvs enable row level security;
alter table public.cv_history enable row level security;
alter table public.interviews enable row level security;
alter table public.tailored_cvs enable row level security;
alter table public.mock_sessions enable row level security;
alter table public.saved_questions enable row level security;

-- Profiles policies
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);
drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);

-- Generic owner policies
drop policy if exists "master_cvs_all_own" on public.master_cvs;
create policy "master_cvs_all_own" on public.master_cvs for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "cv_history_all_own" on public.cv_history;
create policy "cv_history_all_own" on public.cv_history for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "interviews_all_own" on public.interviews;
create policy "interviews_all_own" on public.interviews for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "tailored_cvs_all_own" on public.tailored_cvs;
create policy "tailored_cvs_all_own" on public.tailored_cvs for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "mock_sessions_all_own" on public.mock_sessions;
create policy "mock_sessions_all_own" on public.mock_sessions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "saved_questions_all_own" on public.saved_questions;
create policy "saved_questions_all_own" on public.saved_questions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Storage bucket for CVs
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'cvs',
  'cvs',
  false,
  10485760,
  array['application/pdf','application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/msword','text/plain']
)
on conflict (id) do update set
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "cvs_select_own" on storage.objects;
create policy "cvs_select_own" on storage.objects
  for select using (bucket_id = 'cvs' and auth.uid()::text = (storage.foldername(name))[1]);

drop policy if exists "cvs_insert_own" on storage.objects;
create policy "cvs_insert_own" on storage.objects
  for insert with check (bucket_id = 'cvs' and auth.uid()::text = (storage.foldername(name))[1]);

drop policy if exists "cvs_update_own" on storage.objects;
create policy "cvs_update_own" on storage.objects
  for update using (bucket_id = 'cvs' and auth.uid()::text = (storage.foldername(name))[1]);

drop policy if exists "cvs_delete_own" on storage.objects;
create policy "cvs_delete_own" on storage.objects
  for delete using (bucket_id = 'cvs' and auth.uid()::text = (storage.foldername(name))[1]);
