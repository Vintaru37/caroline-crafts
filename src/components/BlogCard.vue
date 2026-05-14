<script setup lang="ts">
import { computed } from "vue";
import { RouterLink } from "vue-router";
import type { BlogArticle } from "../composables/useBlog";
import { parseTags } from "../composables/useBlog";

const props = defineProps<{
  article: BlogArticle;
}>();

const formattedDate = computed(() => {
  const raw = props.article.published_at ?? props.article.created_at;
  return new Date(raw).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
});

const readTime = computed(() => {
  const words = props.article.content.trim().split(/\s+/).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
});
</script>

<template>
  <RouterLink :to="`/blog/${article.slug}`" class="blog-card">
    <div class="blog-card__cover">
      <img
        v-if="article.cover_image"
        :src="article.cover_image"
        :alt="article.title"
        class="blog-card__img"
        loading="lazy"
        decoding="async"
      />
      <div v-else class="blog-card__placeholder">
        <span>✍️</span>
      </div>
      <div v-if="parseTags(article.tags).length" class="blog-card__tags">
        <span
          v-for="tag in parseTags(article.tags).slice(0, 2)"
          :key="tag"
          class="blog-card__tag"
          >{{ tag }}</span
        >
      </div>
    </div>

    <div class="blog-card__body">
      <div class="blog-card__meta">
        <time class="blog-card__date">{{ formattedDate }}</time>
        <span class="blog-card__dot">·</span>
        <span class="blog-card__read">{{ readTime }}</span>
      </div>

      <h3 class="blog-card__title">{{ article.title }}</h3>
      <p class="blog-card__excerpt">{{ article.excerpt }}</p>

      <span class="blog-card__cta">Read more →</span>
    </div>
  </RouterLink>
</template>

<style scoped>
.blog-card {
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-card);
  transition:
    transform var(--transition),
    box-shadow var(--transition);
  text-decoration: none;
  color: inherit;
}

.blog-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-hover);
}

/* ── Cover ── */
.blog-card__cover {
  position: relative;
  aspect-ratio: 16 / 9;
  background: var(--primrose-light);
  overflow: hidden;
  flex-shrink: 0;
}

.blog-card__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.blog-card:hover .blog-card__img {
  transform: scale(1.04);
}

.blog-card__placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--primrose-light), var(--pinktone));
  font-size: 3rem;
}

.blog-card__tags {
  position: absolute;
  bottom: 10px;
  left: 10px;
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.blog-card__tag {
  background: rgba(255, 255, 255, 0.92);
  color: var(--primrose-deep);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  padding: 3px 9px;
  border-radius: 99px;
}

/* ── Body ── */
.blog-card__body {
  padding: 22px 24px 24px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.blog-card__meta {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.78rem;
  color: var(--light-text);
  margin-bottom: 10px;
}

.blog-card__dot {
  opacity: 0.5;
}

.blog-card__title {
  font-family: var(--font-heading);
  font-size: 1.15rem;
  color: var(--dark);
  line-height: 1.35;
  margin-bottom: 10px;
}

.blog-card__excerpt {
  font-size: 0.88rem;
  color: var(--mid);
  line-height: 1.6;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.blog-card__cta {
  margin-top: 16px;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--primrose-deep);
  letter-spacing: 0.02em;
}
</style>
