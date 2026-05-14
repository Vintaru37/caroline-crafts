<script setup lang="ts">
import { computed, ref } from "vue";
import type { BlogArticle } from "../../composables/useBlog";
import { parseTags } from "../../composables/useBlog";

const props = defineProps<{
  articles: BlogArticle[];
  isLoading: boolean;
  loadError: string | null;
}>();

const emit = defineEmits<{
  edit: [article: BlogArticle];
  delete: [article: BlogArticle];
  togglePublish: [article: BlogArticle];
  reload: [];
}>();

const search = ref("");

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase();
  if (!q) return props.articles;
  return props.articles.filter(
    (a) =>
      a.title.toLowerCase().includes(q) ||
      a.excerpt.toLowerCase().includes(q) ||
      a.tags.toLowerCase().includes(q),
  );
});

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
</script>

<template>
  <section class="blog-table-wrap">
    <!-- Toolbar -->
    <div class="blog-toolbar">
      <div class="blog-toolbar__search">
        <span class="search-icon">🔍</span>
        <input
          v-model="search"
          type="search"
          placeholder="Search articles…"
          class="search-input"
        />
      </div>
      <div class="blog-toolbar__stats">
        <span class="stat-pill stat-pill--total"
          >{{ articles.length }} articles</span
        >
        <span class="stat-pill stat-pill--pub">
          {{ articles.filter((a) => a.is_published).length }} published
        </span>
        <span class="stat-pill stat-pill--draft">
          {{ articles.filter((a) => !a.is_published).length }} drafts
        </span>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="blog-table-state">
      <span class="spinner" /> Loading articles…
    </div>

    <!-- Error -->
    <div v-else-if="loadError" class="blog-table-state blog-table-state--error">
      <span>⚠️</span>
      <span>{{ loadError }}</span>
      <button class="retry-btn" @click="$emit('reload')">Retry</button>
    </div>

    <!-- Empty -->
    <div
      v-else-if="articles.length === 0"
      class="blog-table-state blog-table-state--empty"
    >
      <span class="empty-icon">✍️</span>
      <p>
        No articles yet. Click <strong>+ New Article</strong> to get started!
      </p>
    </div>

    <!-- No results -->
    <div
      v-else-if="filtered.length === 0"
      class="blog-table-state blog-table-state--empty"
    >
      <span>🔍</span>
      <p>
        No articles match "<em>{{ search }}</em
        >"
      </p>
    </div>

    <!-- Table -->
    <div v-else class="blog-table-scroll">
      <table class="blog-table">
        <thead>
          <tr>
            <th class="col-cover">Cover</th>
            <th class="col-title">Title &amp; Excerpt</th>
            <th class="col-tags">Tags</th>
            <th class="col-date">Published</th>
            <th class="col-status">Status</th>
            <th class="col-actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="article in filtered" :key="article.id" class="blog-row">
            <!-- Cover thumbnail -->
            <td class="col-cover">
              <div class="thumb-wrap">
                <img
                  v-if="article.cover_image"
                  :src="article.cover_image"
                  :alt="article.title"
                  class="thumb"
                  loading="lazy"
                />
                <div v-else class="thumb-placeholder">✍️</div>
              </div>
            </td>

            <!-- Title & excerpt -->
            <td class="col-title">
              <p class="article-title">{{ article.title }}</p>
              <p class="article-excerpt">{{ article.excerpt }}</p>
            </td>

            <!-- Tags -->
            <td class="col-tags">
              <div class="tag-list">
                <span
                  v-for="tag in parseTags(article.tags)"
                  :key="tag"
                  class="tag-chip"
                  >{{ tag }}</span
                >
                <span v-if="!parseTags(article.tags).length" class="no-tags"
                  >—</span
                >
              </div>
            </td>

            <!-- Date -->
            <td class="col-date">
              <span class="date-text">{{
                formatDate(article.published_at)
              }}</span>
            </td>

            <!-- Status toggle -->
            <td class="col-status">
              <button
                class="status-badge"
                :class="
                  article.is_published
                    ? 'status-badge--live'
                    : 'status-badge--draft'
                "
                :title="
                  article.is_published
                    ? 'Click to unpublish'
                    : 'Click to publish'
                "
                @click="$emit('togglePublish', article)"
              >
                {{ article.is_published ? "✅ Live" : "📝 Draft" }}
              </button>
            </td>

            <!-- Actions -->
            <td class="col-actions">
              <div class="action-group">
                <button
                  class="action-btn action-btn--edit"
                  title="Edit article"
                  @click="$emit('edit', article)"
                >
                  ✏️
                </button>
                <button
                  class="action-btn action-btn--delete"
                  title="Delete article"
                  @click="$emit('delete', article)"
                >
                  🗑️
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<style scoped>
.blog-table-wrap {
  margin: 0 24px 32px;
  background: #fff;
  border-radius: var(--radius-md);
  box-shadow: 0 2px 16px rgba(200, 100, 120, 0.07);
  overflow: hidden;
}

/* ── Toolbar ── */
.blog-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid #f8e8eb;
}

.blog-toolbar__search {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fdf5f7;
  border: 1.5px solid #f2d0d5;
  border-radius: var(--radius-sm);
  padding: 6px 14px;
  flex: 1;
  max-width: 340px;
}

.search-icon {
  font-size: 0.9rem;
  opacity: 0.6;
}

.search-input {
  border: none;
  background: transparent;
  font-family: var(--font-body);
  font-size: 0.88rem;
  color: var(--dark);
  width: 100%;
  outline: none;
}

.search-input::placeholder {
  color: var(--light-text);
}

.blog-toolbar__stats {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.stat-pill {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 99px;
}

.stat-pill--total {
  background: #f0ecf5;
  color: #7c5a9a;
}
.stat-pill--pub {
  background: #eaf7ed;
  color: #2d7a3a;
}
.stat-pill--draft {
  background: #fff4e0;
  color: #9a6a00;
}

/* ── States ── */
.blog-table-state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 60px 20px;
  color: var(--mid);
  font-size: 0.95rem;
  flex-direction: column;
}

.blog-table-state--error {
  color: #c04060;
}

.empty-icon {
  font-size: 2.5rem;
}

.spinner {
  width: 24px;
  height: 24px;
  border: 2px solid var(--pinktone);
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

.retry-btn {
  padding: 6px 16px;
  border: 1.5px solid #f2c0c8;
  border-radius: var(--radius-sm);
  background: #fff;
  font-family: var(--font-body);
  font-size: 0.85rem;
  cursor: pointer;
  color: var(--dark);
  transition: background 0.15s;
}

.retry-btn:hover {
  background: #fdf0f2;
}

/* ── Table ── */
.blog-table-scroll {
  overflow-x: auto;
}

.blog-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.88rem;
}

.blog-table thead th {
  background: #fdf0f2;
  text-align: left;
  padding: 12px 14px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--mid);
  border-bottom: 1px solid #f8e0e4;
  white-space: nowrap;
}

.blog-row {
  border-bottom: 1px solid #fef0f2;
  transition: background 0.14s;
}

.blog-row:hover {
  background: #fffbfc;
}
.blog-row:last-child {
  border-bottom: none;
}

.blog-table td {
  padding: 12px 14px;
  vertical-align: middle;
}

/* Columns */
.col-cover {
  width: 72px;
}
.col-title {
  min-width: 220px;
}
.col-tags {
  min-width: 120px;
}
.col-date {
  width: 120px;
  white-space: nowrap;
}
.col-status {
  width: 110px;
}
.col-actions {
  width: 90px;
}

/* Thumbnail */
.thumb-wrap {
  width: 60px;
  height: 60px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  background: var(--primrose-light);
  flex-shrink: 0;
}

.thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumb-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
}

/* Title / excerpt */
.article-title {
  font-weight: 700;
  color: var(--dark);
  line-height: 1.3;
  margin-bottom: 3px;
}

.article-excerpt {
  color: var(--mid);
  font-size: 0.82rem;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Tags */
.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.tag-chip {
  font-size: 0.7rem;
  font-weight: 700;
  padding: 2px 8px;
  background: var(--primrose-light);
  color: var(--primrose-deep);
  border-radius: 99px;
  white-space: nowrap;
}

.no-tags {
  color: var(--light-text);
}

/* Date */
.date-text {
  color: var(--mid);
}

/* Status badge (clickable toggle) */
.status-badge {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 99px;
  border: 1.5px solid transparent;
  cursor: pointer;
  font-family: var(--font-body);
  transition: opacity 0.15s;
}

.status-badge:hover {
  opacity: 0.75;
}

.status-badge--live {
  background: #e8f7ec;
  color: #2d7a3a;
  border-color: #b8e8c4;
}
.status-badge--draft {
  background: #fff4e0;
  color: #9a6a00;
  border-color: #f8d890;
}

/* Action buttons */
.action-group {
  display: flex;
  gap: 6px;
}

.action-btn {
  width: 34px;
  height: 34px;
  border-radius: var(--radius-sm);
  border: 1.5px solid transparent;
  background: transparent;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    background 0.15s,
    border-color 0.15s;
}

.action-btn--edit:hover {
  background: #fff4e0;
  border-color: #f8d890;
}

.action-btn--delete:hover {
  background: #fde8ec;
  border-color: #f8c0c8;
}
</style>
