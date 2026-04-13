-- ============================================================
-- CarolineCrafts – Page Views Analytics Table
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

create table if not exists public.page_views (
  id           bigserial    primary key,
  created_at   timestamptz  not null default now(),
  page         text         not null,          -- e.g. "/products"
  referrer     text,                           -- document.referrer hostname (null = direct)
  device_type  text,                           -- 'mobile' | 'tablet' | 'desktop'
  session_id   text,                           -- random ID per browser session
  user_agent   text                            -- raw UA string (optional, for debugging)
);

-- Index for fast time-range queries
create index if not exists page_views_created_at_idx on public.page_views (created_at desc);

-- Enable RLS
alter table public.page_views enable row level security;

-- Anonymous visitors can INSERT (needed for tracking)
create policy "anon_insert"
  on public.page_views
  for insert
  to anon
  with check (true);

-- Only authenticated users (admin) can SELECT
create policy "auth_select"
  on public.page_views
  for select
  to authenticated
  using (true);
