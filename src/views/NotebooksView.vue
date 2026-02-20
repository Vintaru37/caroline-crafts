<script setup lang="ts">
import { notebooks } from "../data/notebooks";
import FloatingDecor from "../components/FloatingDecor.vue";
</script>

<template>
  <main>
    <!-- ── Page Header ──────────────────────────────────── -->
    <section class="page-hero page-hero--green">
      <FloatingDecor />
      <div class="container page-hero__content">
        <p class="page-hero__eyebrow">My Products</p>
        <h1 class="page-hero__title">Notebooks</h1>
        <p class="page-hero__sub">
          Elegant notebooks, bullet journals and planners with hand-designed
          covers. Your everyday life in a beautiful edition 🌿
        </p>
      </div>
    </section>

    <!-- ── Products ─────────────────────────────────────── -->
    <section class="section">
      <div class="container">
        <div class="filter-bar">
          <span class="filter-count">{{ notebooks.length }} notebooks</span>
          <a
            href="https://www.amazon.com"
            target="_blank"
            rel="noopener noreferrer"
            class="btn btn-lime filter-amazon"
          >
            🛒 Shop on Amazon
          </a>
        </div>

        <div class="card-grid">
          <div v-for="nb in notebooks" :key="nb.id" class="product-card">
            <div
              class="product-card__cover"
              :style="{ background: nb.gradient }"
            >
              <span>{{ nb.emoji }}</span>
              <span v-if="nb.tag" class="product-card__tag">{{ nb.tag }}</span>
            </div>
            <div class="product-card__body">
              <h3 class="product-card__title">{{ nb.title }}</h3>
              <p class="product-card__desc">{{ nb.desc }}</p>
              <div class="product-card__meta">
                <span class="meta-pill">{{ nb.pages }}</span>
                <span class="meta-pill meta-pill--green">{{ nb.type }}</span>
              </div>
              <a
                href="https://www.amazon.com"
                target="_blank"
                rel="noopener noreferrer"
                class="product-card__link product-card__link--green"
              >
                🛒 Buy on Amazon →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── Bottom CTA ─────────────────────────────────────── -->
    <section class="bottom-cta">
      <div class="container bottom-cta__inner">
        <h2 class="bottom-cta__title">Designed with you in mind 📓</h2>
        <p class="bottom-cta__sub">
          Each notebook is a unique design available on Amazon!
        </p>
        <a
          href="https://www.amazon.com"
          target="_blank"
          rel="noopener noreferrer"
          class="btn btn-lime"
        >
          Shop on Amazon →
        </a>
      </div>
    </section>
  </main>
</template>

<style scoped>
.page-hero {
  padding: 120px 0 60px;
  position: relative;
  overflow: hidden;
}

.page-hero--green {
  background: linear-gradient(135deg, #dfe3c0 0%, var(--yucca) 100%);
}

.page-hero__content {
  position: relative;
  z-index: 1;
}

.page-hero__eyebrow {
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--lime-dark);
  margin-bottom: 8px;
}

.page-hero__title {
  font-size: clamp(2.5rem, 6vw, 4rem);
  color: var(--dark);
  margin-bottom: 14px;
}

.page-hero__sub {
  color: var(--mid);
  font-size: 1rem;
  max-width: 500px;
  line-height: 1.7;
}

.filter-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 36px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--yucca-dark);
  flex-wrap: wrap;
  gap: 12px;
}

.filter-count {
  font-size: 0.9rem;
  color: var(--mid);
}
.filter-amazon {
  font-size: 0.88rem;
}

.product-card {
  position: relative;
}

.product-card__tag {
  position: absolute;
  top: 12px;
  right: 12px;
  background: var(--dark);
  color: var(--white);
  font-size: 0.72rem;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 50px;
  font-family: var(--font-body);
}

.product-card__meta {
  display: flex;
  gap: 8px;
  margin-bottom: 14px;
  flex-wrap: wrap;
}

.meta-pill {
  background: var(--yucca);
  color: var(--mid);
  font-size: 0.75rem;
  font-weight: 500;
  padding: 3px 10px;
  border-radius: 50px;
}

.meta-pill--green {
  background: #dfe3c0;
  color: var(--lime-dark);
}

.product-card__link--green {
  color: var(--lime-dark);
}

.bottom-cta {
  background: #dfe3c0;
  padding: 60px 0;
  text-align: center;
}

.bottom-cta__inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.bottom-cta__title {
  font-size: 1.8rem;
  color: var(--dark);
}
.bottom-cta__sub {
  color: var(--mid);
  margin-bottom: 8px;
}
</style>
