<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, RouterLink } from "vue-router";
import { useBlog, parseTags } from "../composables/useBlog";
import type { BlogArticle } from "../composables/useBlog";

const route = useRoute();
const { getBySlug } = useBlog();

const article = ref<BlogArticle | null>(null);
const loading = ref(true);
const notFound = ref(false);

async function load(slug: string) {
  loading.value = true;
  notFound.value = false;
  const result = await getBySlug(slug);
  if (!result || !result.is_published) {
    notFound.value = true;
    article.value = null;
  } else {
    article.value = result;
  }
  loading.value = false;
}

onMounted(() => load(route.params.slug as string));
watch(
  () => route.params.slug,
  (slug) => load(slug as string),
);

// ── Markdown → HTML renderer ──────────────────────────────────────────────────
function renderMarkdown(text: string): string {
  if (!text) return "";

  // Escape raw HTML to prevent XSS (admin-authored content, but belt-and-suspenders)
  const escape = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // Trim trailing whitespace so the last line never emits a spacer
  const lines = text.trimEnd().split("\n");
  const out: string[] = [];
  let inList = false;
  let inOl = false;

  const closeLists = () => {
    if (inList) {
      out.push("</ul>");
      inList = false;
    }
    if (inOl) {
      out.push("</ol>");
      inOl = false;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line: string = lines[i] ?? "";

    // Headings
    if (line.startsWith("### ")) {
      closeLists();
      out.push(`<h3>${inlineFormat(escape(line.slice(4)))}</h3>`);
      continue;
    }
    if (line.startsWith("## ")) {
      closeLists();
      out.push(`<h2>${inlineFormat(escape(line.slice(3)))}</h2>`);
      continue;
    }
    if (line.startsWith("# ")) {
      closeLists();
      out.push(`<h2>${inlineFormat(escape(line.slice(2)))}</h2>`);
      continue;
    }

    // Blockquote
    if (line.startsWith("> ")) {
      closeLists();
      out.push(
        `<blockquote>${inlineFormat(escape(line.slice(2)))}</blockquote>`,
      );
      continue;
    }

    // Unordered list
    if (line.startsWith("- ") || line.startsWith("* ")) {
      if (inOl) {
        out.push("</ol>");
        inOl = false;
      }
      if (!inList) {
        out.push("<ul>");
        inList = true;
      }
      out.push(`<li>${inlineFormat(escape(line.slice(2)))}</li>`);
      continue;
    }

    // Ordered list
    if (/^\d+\. /.test(line)) {
      if (inList) {
        out.push("</ul>");
        inList = false;
      }
      if (!inOl) {
        out.push("<ol>");
        inOl = true;
      }
      out.push(`<li>${inlineFormat(escape(line.replace(/^\d+\. /, "")))}</li>`);
      continue;
    }

    // Horizontal rule
    if (/^---+$/.test(line.trim())) {
      closeLists();
      out.push("<hr>");
      continue;
    }

    closeLists();

    // Empty line = small spacer (not a full paragraph)
    if (line.trim() === "") {
      out.push('<div class="md-br"></div>');
      continue;
    }

    out.push(`<p>${inlineFormat(escape(line))}</p>`);
  }

  closeLists();
  return out.join("\n");
}

function inlineFormat(s: string): string {
  s = s.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/\*(.+?)\*/g, "<em>$1</em>");
  s = s.replace(/~~(.+?)~~/g, "<del>$1</del>");
  s = s.replace(/`(.+?)`/g, "<code>$1</code>");
  s = s.replace(
    /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
  );
  return s;
}

const renderedContent = computed(() =>
  article.value ? renderMarkdown(article.value.content) : "",
);

const formattedDate = computed(() => {
  if (!article.value) return "";
  const raw = article.value.published_at ?? article.value.created_at;
  return new Date(raw).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
});

const readTime = computed(() => {
  if (!article.value) return "";
  const words = article.value.content.trim().split(/\s+/).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
});
</script>

<template>
  <main class="post-page">
    <!-- Loading -->
    <div v-if="loading" class="post-loading">
      <span class="spinner" />
    </div>

    <!-- 404 -->
    <div v-else-if="notFound" class="post-not-found">
      <h2>Article not found</h2>
      <p>This article may have been moved or unpublished.</p>
      <RouterLink to="/blog" class="btn-back">← Back to Blog</RouterLink>
    </div>

    <!-- Article -->
    <template v-else-if="article">
      <div class="container post-layout">
        <!-- Back link -->
        <RouterLink to="/blog" class="post-back">← All articles</RouterLink>

        <!-- Header -->
        <header class="post-header">
          <div class="post-header__meta">
            <time>{{ formattedDate }}</time>
            <span>·</span>
            <span>{{ readTime }}</span>
          </div>
          <!-- Cover image: after meta, before title -->
          <div v-if="article.cover_image" class="post-article-cover">
            <img
              :src="article.cover_image"
              :alt="article.title"
              loading="eager"
            />
          </div>
          <h1 class="post-header__title">{{ article.title }}</h1>
          <p v-if="article.excerpt" class="post-header__excerpt">
            {{ article.excerpt }}
          </p>
          <div v-if="parseTags(article.tags).length" class="post-header__tags">
            <span
              v-for="tag in parseTags(article.tags)"
              :key="tag"
              class="post-tag"
              >{{ tag }}</span
            >
          </div>
        </header>

        <!-- Content -->
        <article class="post-content prose" v-html="renderedContent" />

        <!-- Footer CTA -->
        <div class="post-footer">
          <div class="post-footer__inner">
            <div>
              <p class="post-footer__title">Love coloring &amp; crafting?</p>
              <p class="post-footer__sub">
                Check out Caroline's books on Amazon.
              </p>
            </div>
            <a
              href="https://www.amazon.com/stores/Caroline-Crafts/author/B0FD432Q7J"
              target="_blank"
              rel="noopener noreferrer"
              class="btn-amazon"
              >Shop on Amazon →</a
            >
          </div>
        </div>
      </div>
    </template>
  </main>
</template>

<style scoped>
.post-page {
  padding-top: 70px;
  min-height: 100vh;
}

/* ── Loading ──────────────────────────────────────── */
.post-loading {
  display: flex;
  justify-content: center;
  padding: 120px 20px;
}

.spinner {
  width: 36px;
  height: 36px;
  border: 3px solid var(--pinktone);
  border-top-color: var(--primrose);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  display: inline-block;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ── Not found ──────────────────────────────────────── */
.post-not-found {
  text-align: center;
  padding: 100px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.post-not-found h2 {
  font-family: var(--font-heading);
  font-size: 1.8rem;
  color: var(--dark);
}

.post-not-found p {
  color: var(--mid);
}

.btn-back {
  margin-top: 8px;
  padding: 10px 22px;
  background: var(--primrose-light);
  color: var(--primrose-deep);
  border-radius: var(--radius-md);
  font-weight: 700;
  font-size: 0.9rem;
  text-decoration: none;
  transition: background var(--transition);
}

.btn-back:hover {
  background: var(--pinktone);
}

/* ── Layout ──────────────────────────────────────── */
.post-layout {
  max-width: 780px;
  padding-top: 48px;
  padding-bottom: 80px;
}

/* ── Article cover (inline, between meta and title) ─ */
.post-article-cover {
  margin: 20px 0 30px;
  aspect-ratio: 16 / 9;
}

.post-article-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  border-radius: 4px;
  /* Fade out on all four sides */
  -webkit-mask-image:
    linear-gradient(
      to right,
      transparent 0%,
      black 2%,
      black 98%,
      transparent 100%
    ),
    linear-gradient(
      to bottom,
      transparent 0%,
      black 2%,
      black 98%,
      transparent 100%
    );
  -webkit-mask-composite: destination-in;
  mask-image:
    linear-gradient(
      to right,
      transparent 0%,
      black 2%,
      black 98%,
      transparent 100%
    ),
    linear-gradient(
      to bottom,
      transparent 0%,
      black 2%,
      black 98%,
      transparent 100%
    );
  mask-composite: intersect;
}

/* ── Back link ──────────────────────────────────── */
.post-back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--primrose-deep);
  text-decoration: none;
  margin-bottom: 28px;
  transition: opacity var(--transition);
}

.post-back:hover {
  opacity: 0.7;
}

/* ── Header ──────────────────────────────────────── */
.post-header {
  margin-bottom: 40px;
}

.post-header__meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.82rem;
  color: var(--light-text);
  margin-bottom: 14px;
}

.post-header__title {
  font-family: var(--font-heading);
  font-size: clamp(1.8rem, 3.5vw, 2.8rem);
  color: var(--primrose-deep);
  line-height: 1.22;
  margin-bottom: 16px;
}

.post-header__excerpt {
  font-size: 1.05rem;
  color: var(--mid);
  line-height: 1.7;
  margin-bottom: 16px;
  border-left: 3px solid var(--primrose);
  padding-left: 16px;
}

.post-header__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.post-tag {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--primrose-deep);
  background: var(--primrose-light);
  padding: 4px 12px;
  border-radius: 99px;
}

/* ── Prose content ────────────────────────────────── */
.post-content.prose {
  font-size: 1rem;
  line-height: 1.85;
  color: var(--dark);
}

:deep(.prose h2) {
  font-family: var(--font-heading);
  font-size: 1.5rem;
  color: var(--dark);
  margin: 2rem 0 0.8rem;
}

:deep(.prose h3) {
  font-family: var(--font-heading);
  font-size: 1.2rem;
  color: var(--dark);
  margin: 1.6rem 0 0.6rem;
}

:deep(.prose p) {
  margin-bottom: 0.5rem;
}

:deep(.prose ul) {
  padding-left: 1.4rem;
  margin-bottom: 0.5rem;
}

:deep(.prose li) {
  margin-bottom: 0.4rem;
}

:deep(.prose strong) {
  color: var(--dark);
  font-weight: 700;
}

:deep(.prose em) {
  color: var(--mid);
}

:deep(.prose code) {
  background: var(--primrose-light);
  color: var(--primrose-deep);
  padding: 1px 6px;
  border-radius: 4px;
  font-size: 0.88em;
  font-family: monospace;
}

:deep(.prose a) {
  color: var(--primrose-deep);
  text-decoration: underline;
  text-underline-offset: 3px;
}

:deep(.prose a:hover) {
  opacity: 0.75;
}

:deep(.prose hr) {
  border: none;
  border-top: 1px solid var(--pinktone);
  margin: 2rem 0;
}

:deep(.prose blockquote) {
  border-left: 4px solid var(--primrose);
  background: var(--primrose-light);
  padding: 10px 18px;
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  color: var(--mid);
  font-style: italic;
  margin: 1rem 0;
}

:deep(.prose ol) {
  padding-left: 1.4rem;
  margin-bottom: 1rem;
}

:deep(.prose del) {
  color: var(--light-text);
  text-decoration: line-through;
}

:deep(.prose .md-br) {
  height: 0rem;
}

/* ── Footer CTA ──────────────────────────────────── */
.post-footer {
  margin-top: 24px;
  padding-top: 36px;
  border-top: 1px solid var(--pinktone);
}

.post-footer__inner {
  display: flex;
  align-items: center;
  gap: 20px;
  background: linear-gradient(135deg, var(--primrose-light), var(--yucca));
  border-radius: var(--radius-md);
  padding: 24px 28px;
  flex-wrap: wrap;
}

.post-footer__title {
  font-family: var(--font-heading);
  font-size: 1.1rem;
  color: var(--dark);
  font-weight: 700;
}

.post-footer__sub {
  font-size: 0.88rem;
  color: var(--mid);
}

.btn-amazon {
  margin-left: auto;
  white-space: nowrap;
  padding: 12px 22px;
  background: linear-gradient(135deg, var(--primrose), var(--primrose-deep));
  color: #fff;
  border-radius: var(--radius-md);
  font-weight: 700;
  font-size: 0.88rem;
  text-decoration: none;
  transition: opacity var(--transition);
}

.btn-amazon:hover {
  opacity: 0.88;
}

@media (max-width: 520px) {
  .post-footer__inner {
    flex-direction: column;
    align-items: flex-start;
  }
  .btn-amazon {
    margin-left: 0;
  }
}
</style>
