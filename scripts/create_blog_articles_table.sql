-- ============================================================
-- CarolineCrafts – Blog Articles Table
-- Safe to re-run at any time (idempotent).
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

create table if not exists public.blog_articles (
  id           uuid         primary key default gen_random_uuid(),
  slug         text         unique not null,
  title        text         not null,
  excerpt      text         not null default '',
  content      text         not null default '',
  cover_image  text         not null default '',
  tags         text         not null default '',
  is_published boolean      not null default false,
  published_at timestamptz,
  sort_order   integer,
  created_at   timestamptz  not null default now(),
  updated_at   timestamptz  not null default now()
);

-- Auto-update updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists blog_articles_updated_at on public.blog_articles;
create trigger blog_articles_updated_at
  before update on public.blog_articles
  for each row execute procedure public.set_updated_at();

-- Indexes
create index if not exists blog_articles_slug_idx        on public.blog_articles (slug);
create index if not exists blog_articles_published_idx   on public.blog_articles (is_published, published_at desc);

-- RLS disabled – access via GRANTs (same pattern as page_views)
alter table public.blog_articles disable row level security;

drop policy if exists "anon_select_published" on public.blog_articles;
drop policy if exists "auth_full"             on public.blog_articles;

-- Schema access
grant usage on schema public to anon;
grant usage on schema public to authenticated;

-- Table-level privileges
grant select                          on public.blog_articles to anon;
grant select, insert, update, delete  on public.blog_articles to authenticated;
