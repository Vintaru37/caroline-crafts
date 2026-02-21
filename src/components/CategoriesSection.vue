<script setup lang="ts">
import { RouterLink } from "vue-router";

const features = [
  {
    icon: "🎨",
    title: "Coloring Books",
    desc: "Beautiful floral, mandala and nature patterns. Perfect relaxation for adults and children.",
    to: { path: "/products", query: { kind: "coloring-books" } },
    color: "var(--primrose)",
    bg: "var(--pinktone)",
  },
  {
    icon: "📓",
    title: "Notebooks",
    desc: "Elegant bullet journals, notebooks and diaries in soft pastel covers.",
    to: { path: "/products", query: { kind: "notebooks" } },
    color: "var(--lime-dark)",
    bg: "#dfe3c0",
  },
];
</script>

<template>
  <section class="section categories">
    <div class="container">
      <p class="section-eyebrow reveal">What I create</p>
      <h2 class="section-title reveal reveal-delay-1">My Products</h2>
      <p class="section-subtitle reveal reveal-delay-2">
        Each product is a unique design – take a look and find something for
        yourself
      </p>

      <div class="features-grid">
        <RouterLink
          v-for="(feat, i) in features"
          :key="feat.title"
          :to="feat.to"
          class="feature-card reveal"
          :class="`reveal-delay-${i + 2}`"
          :style="{ '--accent': feat.color, '--bg': feat.bg }"
        >
          <div class="feature-card__icon">{{ feat.icon }}</div>
          <h3 class="feature-card__title">{{ feat.title }}</h3>
          <p class="feature-card__desc">{{ feat.desc }}</p>
          <span class="feature-card__cta">Discover →</span>
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.categories {
  background: var(--pink-bg);
}

.section-eyebrow {
  font-family: var(--font-accent);
  font-size: 1.8rem;
  font-weight: 400;
  color: var(--primrose);
  display: block;
  margin-bottom: 6px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 28px;
}

.feature-card {
  background: var(--white);
  border-radius: var(--radius-lg);
  padding: 40px 36px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: var(--shadow-card);
  transition:
    transform var(--transition),
    box-shadow var(--transition);
  border-top: 4px solid var(--accent);
}

.feature-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 48px rgba(61, 43, 43, 0.16);
}

.feature-card__icon {
  font-size: 2.8rem;
  width: 64px;
  height: 64px;
  background: var(--bg);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
}

.feature-card__title {
  font-size: 1.5rem;
  color: var(--dark);
}

.feature-card__desc {
  font-size: 0.9rem;
  color: var(--mid);
  line-height: 1.65;
  flex: 1;
}

.feature-card__cta {
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--accent);
}

@media (max-width: 900px) {
  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>
