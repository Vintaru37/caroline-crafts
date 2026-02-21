<script setup lang="ts">
import { computed, nextTick, ref, watch, watchEffect } from "vue";
import { useRoute } from "vue-router";
import FloatingDecor from "../components/FloatingDecor.vue";
import ColoringBookCard from "../components/ColoringBookCard.vue";
import NotebookCard from "../components/NotebookCard.vue";
import { useReveal } from "../composables/useReveal";
import { coloringBooks } from "../data/coloringBooks";
import { notebooks } from "../data/notebooks";

const { refresh } = useReveal();

type ProductKind = "all" | "coloring-books" | "notebooks";

type Product = {
  id: string;
  kind: Exclude<ProductKind, "all">;
  image: string;
  title: string;
  desc: string;
  tag: string;
};

const CardComponentByKind = {
  "coloring-books": ColoringBookCard,
  notebooks: NotebookCard,
} as const;

const allProducts = computed<Product[]>(() => {
  const books: Product[] = coloringBooks.map((b) => ({
    id: `book-${b.id}`,
    kind: "coloring-books",
    image: b.image,
    title: b.title,
    desc: b.desc,
    tag: b.tag,
  }));

  const nbs: Product[] = notebooks.map((n) => ({
    id: `nb-${n.id}`,
    kind: "notebooks",
    image: n.image,
    title: n.title,
    desc: n.desc,
    metaB: n.type,
    tag: n.tag,
  }));

  return [...books, ...nbs];
});

const route = useRoute();

const selected = ref<ProductKind>("all");

watchEffect(() => {
  const q = (route.query.kind ?? "all") as string;
  if (q === "coloring-books" || q === "notebooks" || q === "all") {
    selected.value = q;
  } else {
    selected.value = "all";
  }
});

function setFilter(kind: ProductKind) {
  // update local state immediately
  selected.value = kind;

  // update the URL query string without triggering router navigation
  const params = new URLSearchParams();
  if (kind !== "all") params.set("kind", kind);

  const base = window.location.pathname;
  const qs = params.toString();
  const nextUrl = qs ? `${base}?${qs}` : base;
  window.history.replaceState({}, "", nextUrl);
}

const filtered = computed(() => {
  if (selected.value === "all") return allProducts.value;
  return allProducts.value.filter((p) => p.kind === selected.value);
});

// After a filter change Vue may reposition cards into the viewport without
// the IntersectionObserver detecting it (it only fires on state *changes*).
// Unobserving then re-observing forces the IO to report current visibility.
watch(filtered, () => nextTick(refresh));
</script>

<template>
  <main>
    <!-- ── Header ─────────────────────────────────── -->
    <section class="page-hero">
      <FloatingDecor />
      <div class="container page-hero__content reveal">
        <p class="page-hero__eyebrow">my products on Amazon</p>
        <h1 class="page-hero__title">Products</h1>
        <p class="page-hero__sub">
          Handcrafted designs made with care — perfect for you or as a gift.
        </p>
      </div>
    </section>

    <!-- ── Grid ───────────────────────────────────── -->
    <section class="section products">
      <div class="container">
        <div class="products__top reveal">
          <span class="products__count">{{ filtered.length }} items</span>

          <div class="filters" role="tablist" aria-label="Product filters">
            <button
              class="filter-pill"
              :class="{ active: selected === 'all' }"
              type="button"
              role="tab"
              :aria-selected="selected === 'all'"
              @click="setFilter('all')"
            >
              All
            </button>
            <button
              class="filter-pill"
              :class="{ active: selected === 'coloring-books' }"
              type="button"
              role="tab"
              :aria-selected="selected === 'coloring-books'"
              @click="setFilter('coloring-books')"
            >
              Coloring Books
            </button>
            <button
              class="filter-pill"
              :class="{ active: selected === 'notebooks' }"
              type="button"
              role="tab"
              :aria-selected="selected === 'notebooks'"
              @click="setFilter('notebooks')"
            >
              Notebooks
            </button>
          </div>

          <a
            class="btn btn-primary"
            href="https://www.amazon.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            🛒 Shop on Amazon
          </a>
        </div>

        <div class="card-grid">
          <component
            v-for="(p, i) in filtered"
            :is="CardComponentByKind[p.kind]"
            :key="p.id"
            :product="p"
            class="reveal"
            :class="`reveal-delay-${(i % 5) + 1}`"
          />
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.page-hero {
  padding: 120px 0 70px;
  position: relative;
  overflow: hidden;
  background: var(--pink-bg);
}

.page-hero__content {
  position: relative;
  z-index: 1;
  text-align: center;
}

.page-hero__eyebrow {
  font-family: var(--font-accent);
  font-size: 1.8rem;
  color: var(--primrose-deep);
  margin-bottom: 8px;
}

.page-hero__title {
  font-family: var(--font-heading);
  font-size: clamp(2.6rem, 5vw, 3.8rem);
  color: var(--dark);
  margin-bottom: 14px;
}

.page-hero__sub {
  color: var(--mid);
  max-width: 560px;
  margin: 0 auto;
  line-height: 1.7;
}

.filters {
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}

.filter-pill {
  border: 1px solid var(--pinktone);
  background: rgba(255, 255, 255, 0.75);
  padding: 8px 24px;
  border-radius: 999px;
  font-family: var(--font-body);
  font-weight: 700;
  font-size: 0.85rem;
  color: var(--mid);
  cursor: pointer;
  transition:
    background var(--transition),
    color var(--transition),
    box-shadow var(--transition);
}

.filter-pill:hover {
  background: var(--primrose-light);
  color: var(--primrose-deep);
}

.filter-pill.active {
  background: var(--primrose);
  border-color: var(--primrose);
  color: var(--white);
  box-shadow: var(--shadow-soft);
}

.products {
  background: var(--pink-bg);
}

.products__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
  margin-bottom: 24px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--primrose-light);
}

.products__top .filters {
  justify-content: flex-start;
  margin: 0;
}

@media (max-width: 820px) {
  .products__top {
    justify-content: center;
    text-align: center;
  }
  .products__top .filters {
    justify-content: center;
    width: 100%;
    order: 3;
  }
}

.products__count {
  color: var(--mid);
  font-weight: 700;
  font-size: 0.9rem;
  min-width: 80px;
}

@media (max-width: 520px) {
  .products__top {
    justify-content: center;
    text-align: center;
  }
}
</style>
