<script setup lang="ts">
import { coloringBooks as books } from "../data/coloringBooks";
import FloatingDecor from "../components/FloatingDecor.vue";
</script>

<template>
  <main>
    <!-- ── Page Header ─────────────────────────────────── -->
    <section class="page-hero page-hero--pink">
      <FloatingDecor />
      <div class="container page-hero__content">
        <p class="page-hero__eyebrow">My Products</p>
        <h1 class="page-hero__title">Coloring Books</h1>
        <p class="page-hero__sub">
          Hand-designed patterns for adults and children. Relaxation, meditation
          and pure joy of creation 🌸
        </p>
      </div>
    </section>

    <!-- ── Products ──────────────────────────────────────── -->
    <section class="section">
      <div class="container">
        <div class="filter-bar">
          <span class="filter-count">{{ books.length }} coloring books</span>
          <a
            href="https://www.amazon.com"
            target="_blank"
            rel="noopener noreferrer"
            class="btn btn-primary filter-amazon"
          >
            🛒 Shop on Amazon
          </a>
        </div>

        <div class="card-grid">
          <div v-for="book in books" :key="book.id" class="product-card">
            <div
              class="product-card__cover"
              :style="{ background: book.gradient }"
            >
              <span>{{ book.emoji }}</span>
              <span v-if="book.tag" class="product-card__tag">{{
                book.tag
              }}</span>
            </div>
            <div class="product-card__body">
              <h3 class="product-card__title">{{ book.title }}</h3>
              <p class="product-card__desc">{{ book.desc }}</p>
              <div class="product-card__meta">
                <span class="meta-pill">{{ book.pages }}</span>
                <span class="meta-pill">{{ book.size }}</span>
              </div>
              <a
                href="https://www.amazon.com"
                target="_blank"
                rel="noopener noreferrer"
                class="product-card__link"
              >
                🛒 Buy on Amazon →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── Amazon CTA ─────────────────────────────────────── -->
    <section class="bottom-cta">
      <div class="container bottom-cta__inner">
        <h2 class="bottom-cta__title">Can't decide? 🌸</h2>
        <p class="bottom-cta__sub">
          Browse all my products on Amazon and pick your favourite!
        </p>
        <a
          href="https://www.amazon.com"
          target="_blank"
          rel="noopener noreferrer"
          class="btn btn-primary"
        >
          Shop on Amazon →
        </a>
      </div>
    </section>
  </main>
</template>

<style scoped>
/* ── Page Hero ─────────────────────────────────── */
.page-hero {
  padding: 120px 0 60px;
  position: relative;
  overflow: hidden;
}

.page-hero--pink {
  background: linear-gradient(135deg, var(--pinktone) 0%, var(--yucca) 100%);
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
  color: var(--primrose);
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

/* ── Filter bar ─────────────────────────────────── */
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

/* ── Tag on card ─────────────────────────────────── */
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

/* ── Meta pills ──────────────────────────────────── */
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

/* ── Bottom CTA ──────────────────────────────────── */
.bottom-cta {
  background: var(--pinktone);
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
