-- ============================================================
-- CarolineCrafts – blog-images Storage Bucket Setup
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor)
-- Safe to re-run at any time (idempotent).
-- ============================================================

-- 1. Create the bucket if it doesn't exist yet
--    public = true  → uploaded files have a publicly accessible URL
--    (matches the behaviour of product-images)
insert into storage.buckets (id, name, public)
values ('blog-images', 'blog-images', true)
on conflict (id) do update set public = true;

-- ============================================================
-- 2. Storage RLS policies
--    Storage in Supabase uses storage.objects, NOT the table
--    RLS you set on public.* tables.  Each operation (SELECT,
--    INSERT, UPDATE, DELETE) needs its own policy here.
-- ============================================================

-- Drop any leftover policies from previous attempts
drop policy if exists "blog_images_public_read"   on storage.objects;
drop policy if exists "blog_images_auth_insert"   on storage.objects;
drop policy if exists "blog_images_auth_update"   on storage.objects;
drop policy if exists "blog_images_auth_delete"   on storage.objects;

-- Anyone can read (needed so public URLs actually work)
create policy "blog_images_public_read"
  on storage.objects for select
  using ( bucket_id = 'blog-images' );

-- Only authenticated users (= the admin) can upload
create policy "blog_images_auth_insert"
  on storage.objects for insert
  to authenticated
  with check ( bucket_id = 'blog-images' );

-- Only authenticated users can overwrite / update
create policy "blog_images_auth_update"
  on storage.objects for update
  to authenticated
  using ( bucket_id = 'blog-images' );

-- Only authenticated users can delete (used when replacing/removing covers)
create policy "blog_images_auth_delete"
  on storage.objects for delete
  to authenticated
  using ( bucket_id = 'blog-images' );
