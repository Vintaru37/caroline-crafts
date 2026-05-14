<script setup lang="ts">
import { computed } from "vue";
import { useBlog } from "../composables/useBlog";
import { useReveal } from "../composables/useReveal";
import BlogCard from "../components/BlogCard.vue";

const { publishedArticles, isLoading } = useBlog();

// Sort by published_at desc on the client side
const sorted = computed(() =>
  [...publishedArticles.value].sort((a, b) => {
    const da = new Date(a.published_at ?? a.created_at).getTime();
    const db = new Date(b.published_at ?? b.created_at).getTime();
    return db - da;
  }),
);

useReveal();
</script>

<template>
  <main class="blog-page">
    <!-- Hero -->
    <section class="blog-hero reveal">
      <div class="container blog-hero__inner">
        <span class="eyebrow">From the desk of Caroline</span>
        <h1 class="blog-hero__title">My Blog</h1>
        <p class="blog-hero__sub">
          Tips, inspiration, and behind-the-scenes looks at the world of
          coloring books and creative journaling.
        </p>
      </div>
      <div class="blog-hero__deco" aria-hidden="true">
        <span class="deco-circle deco-circle--1" />
        <span class="deco-circle deco-circle--2" />
        <span class="deco-circle deco-circle--3" />
      </div>
    </section>

    <!-- Grid -->
    <section class="blog-section">
      <div class="container">
        <!-- Loading skeleton -->
        <div v-if="isLoading" class="blog-grid">
          <div v-for="n in 6" :key="n" class="blog-skeleton" />
        </div>

        <!-- Empty state -->
        <div v-else-if="sorted.length === 0" class="blog-empty reveal">
          <h2 class="blog-empty__title">Articles coming soon!</h2>
          <p class="blog-empty__text">
            Check back later for tips, tutorials, and creative inspiration.
          </p>
        </div>

        <!-- Article cards -->
        <div v-else class="blog-grid">
          <BlogCard
            v-for="article in sorted"
            :key="article.id"
            :article="article"
            class="reveal"
          />
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
/* ── Hero ──────────────────────────────────────────────────────── */
.blog-page {
  padding-top: 70px;
}

.blog-hero {
  position: relative;
  overflow: hidden;
  background: linear-gradient(
    160deg,
    var(--pink-bg) 0%,
    var(--primrose-light) 50%,
    var(--yucca) 100%
  );
  padding: 80px 0 70px;
  text-align: center;
}

.blog-hero__inner {
  position: relative;
  z-index: 2;
}

.blog-hero__title {
  font-family: var(--font-heading);
  font-size: clamp(2.6rem, 5vw, 4rem);
  color: var(--dark);
  margin-top: 4px;
  margin-bottom: 18px;
}

.blog-hero__sub {
  max-width: 560px;
  margin: 0 auto;
  color: var(--mid);
  font-size: 1.05rem;
  line-height: 1.7;
}

/* Decorative circles */
.blog-hero__deco {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
}

.deco-circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.12;
  background: var(--primrose);
}

.deco-circle--1 {
  width: 280px;
  height: 280px;
  top: -80px;
  right: -60px;
}

.deco-circle--2 {
  width: 160px;
  height: 160px;
  bottom: -40px;
  left: 40px;
  opacity: 0.08;
}

.deco-circle--3 {
  width: 100px;
  height: 100px;
  top: 30px;
  left: 12%;
  opacity: 0.07;
}

/* ── Blog section ──────────────────────────────────────────────── */
.blog-section {
  padding: 60px 0 100px;
}

.blog-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(310px, 1fr));
  gap: 32px;
}

/* ── Skeleton ──────────────────────────────────────────────────── */
.blog-skeleton {
  height: 380px;
  background: linear-gradient(90deg, #fceef0 25%, #fde8eb 50%, #fceef0 75%);
  background-size: 400% 100%;
  border-radius: var(--radius-md);
  animation: shimmer 1.6s infinite ease-in-out;
}

@keyframes shimmer {
  0% {
    background-position: 100% 0;
  }
  100% {
    background-position: -100% 0;
  }
}

/* ── Empty state ──────────────────────────────────────────────── */
.blog-empty {
  text-align: center;
  padding: 80px 20px;
}

.blog-empty__title {
  font-family: var(--font-heading);
  font-size: 1.8rem;
  color: var(--dark);
  margin-bottom: 12px;
}

.blog-empty__text {
  color: var(--mid);
  font-size: 1rem;
}

/* ── Reveal animation (works with useReveal) ──────────────────── */
.reveal {
  opacity: 0;
  transform: translateY(24px);
  transition:
    opacity 0.55s ease,
    transform 0.55s ease;
}

.reveal.is-visible {
  opacity: 1;
  transform: none;
}
</style>
