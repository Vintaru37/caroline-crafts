-- ============================================================
-- CarolineCrafts – Page Views Analytics Table
-- Safe to re-run at any time (idempotent).
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

-- !! RLS is intentionally DISABLED on this table.
-- This table stores no PII (no IP, no name, no email).
-- RLS is designed for per-row user isolation ("users see only their rows"),
-- which doesn't apply here. Access control is handled purely via GRANTs:
--   - anon   : INSERT only  (visitors write analytics rows)
--   - authenticated : SELECT + full write (admin reads the dashboard)
-- Trying to combine RLS with anonymous inserts in Supabase is error-prone
-- and causes 42501 errors when the anon role has no session context.
alter table public.page_views disable row level security;

-- Drop any leftover policies from previous attempts
drop policy if exists "anon_insert" on public.page_views;
drop policy if exists "auth_select"  on public.page_views;

-- Schema access (required for PostgREST to expose the table)
grant usage on schema public to anon;
grant usage on schema public to authenticated;

-- Table-level privileges
grant insert                          on public.page_views to anon;
grant select, insert, update, delete  on public.page_views to authenticated;

