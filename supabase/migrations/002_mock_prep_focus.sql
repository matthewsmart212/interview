-- Scope tighten: mock interview prep only
-- Drop CV versioning + tailored CV product surfaces.
-- Safe to run after 001_init.sql

-- Remove tailored CV table
drop table if exists public.tailored_cvs cascade;

-- Remove CV version history
drop table if exists public.cv_history cascade;

-- Interviews no longer store tailored_cv blobs
alter table public.interviews
  drop column if exists tailored_cv;

-- Master CV: keep one file per user; allow raw text for AI context
alter table public.master_cvs
  add column if not exists raw_text text;

-- Profiles: apply goal retired (keep check loose for existing rows)
alter table public.profiles
  drop constraint if exists profiles_goal_check;

alter table public.profiles
  add constraint profiles_goal_check
  check (goal is null or goal in ('interview','practice','both','apply'));

-- Mock context_mode is now generic | interview (jd retired as a mode)
comment on column public.mock_sessions.context_mode is
  'generic | interview — JD comes from the linked interview when present';
