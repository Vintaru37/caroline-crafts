/**
 * useBlog – Supabase-backed composable for blog articles.
 *
 * Provides full CRUD (create, read, update, delete) for the
 * `blog_articles` table. Public reads are available without auth;
 * writes require an authenticated session.
 */

import { reactive, computed } from "vue";
import { supabase } from "../lib/supabase";

// ── Types ────────────────────────────────────────────────────────────────────

export interface BlogArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image: string;
  tags: string;
  is_published: boolean;
  published_at: string | null;
  sort_order: number | null;
  created_at: string;
  updated_at: string;
}

export type BlogArticleInput = Omit<
  BlogArticle,
  "id" | "created_at" | "updated_at"
>;

// ── Slug helper ──────────────────────────────────────────────────────────────

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

export function parseTags(tags: string | null | undefined): string[] {
  if (!tags) return [];
  return tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

// ── Singleton state ──────────────────────────────────────────────────────────

const state = reactive({
  articles: [] as BlogArticle[],
  loading: true,
  error: null as string | null,
});

_fetchAll();

async function _fetchAll(): Promise<void> {
  state.loading = true;
  state.error = null;

  const { data, error } = await supabase
    .from("blog_articles")
    .select("*")
    .order("sort_order", { ascending: true, nullsFirst: false })
    .order("published_at", { ascending: false });

  if (error) {
    state.error = error.message;
    state.articles = [];
  } else {
    state.articles = (data as BlogArticle[]) ?? [];
  }
  state.loading = false;
}

// ── Public composable ────────────────────────────────────────────────────────

export function useBlog() {
  const isLoading = computed(() => state.loading);
  const loadError = computed(() => state.error);
  const allArticles = computed(() => state.articles);
  const publishedArticles = computed(() =>
    state.articles.filter((a) => a.is_published),
  );

  async function reload() {
    await _fetchAll();
  }

  async function getBySlug(slug: string): Promise<BlogArticle | null> {
    const { data, error } = await supabase
      .from("blog_articles")
      .select("*")
      .eq("slug", slug)
      .single();
    if (error) return null;
    return data as BlogArticle;
  }

  async function addArticle(input: BlogArticleInput): Promise<BlogArticle> {
    const { data, error } = await supabase
      .from("blog_articles")
      .insert([input])
      .select()
      .single();
    if (error) throw new Error(error.message);
    const article = data as BlogArticle;
    state.articles.unshift(article);
    return article;
  }

  async function updateArticle(
    id: string,
    changes: Partial<BlogArticleInput>,
  ): Promise<void> {
    const { data, error } = await supabase
      .from("blog_articles")
      .update(changes)
      .eq("id", id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    const idx = state.articles.findIndex((a) => a.id === id);
    if (idx !== -1) state.articles[idx] = data as BlogArticle;
  }

  async function deleteArticle(id: string): Promise<void> {
    const { error } = await supabase
      .from("blog_articles")
      .delete()
      .eq("id", id);
    if (error) throw new Error(error.message);
    state.articles = state.articles.filter((a) => a.id !== id);
  }

  async function togglePublished(article: BlogArticle): Promise<void> {
    const nowPublished = !article.is_published;
    await updateArticle(article.id, {
      is_published: nowPublished,
      published_at: nowPublished ? new Date().toISOString() : null,
    });
  }

  return {
    isLoading,
    loadError,
    allArticles,
    publishedArticles,
    reload,
    getBySlug,
    addArticle,
    updateArticle,
    deleteArticle,
    togglePublished,
  };
}
