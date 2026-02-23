<script setup lang="ts">
import {
  computed,
  nextTick,
  ref,
  watch,
  watchEffect,
  onMounted,
  onBeforeUnmount,
} from "vue";
import { useRoute } from "vue-router";
import FloatingDecor from "../components/FloatingDecor.vue";
import ColoringBookCard from "../components/ColoringBookCard.vue";
import NotebookCard from "../components/NotebookCard.vue";
import { useReveal } from "../composables/useReveal";
import { useProducts } from "../composables/useProducts";

const { refresh } = useReveal();
const { coloringBookList, notebookList, isLoading } = useProducts();

type ProductKind = "all" | "coloring-books" | "notebooks";

type Product = {
  id: string;
  kind: Exclude<ProductKind, "all">;
  image: string;
  title: string;
  desc: string;
  tag: string;
  amazonUrl?: string;
};

const CardComponentByKind = {
  "coloring-books": ColoringBookCard,
  notebooks: NotebookCard,
} as const;

const allProducts = computed<Product[]>(() => {
  const books: Product[] = coloringBookList.value.map((b) => ({
    id: `book-${b.id}`,
    kind: "coloring-books",
    image: b.image,
    title: b.title,
    desc: b.desc,
    tag: b.tag,
    amazonUrl: b.amazonUrl,
  }));

  const nbs: Product[] = notebookList.value.map((n) => ({
    id: `nb-${n.id}`,
    kind: "notebooks",
    image: n.image,
    title: n.title,
    desc: n.desc,
    metaB: n.notebookType,
    tag: n.tag,
    amazonUrl: n.amazonUrl,
    notebookType: n.notebookType,
  }));

  return [...books, ...nbs];
});

const route = useRoute();

const selected = ref<ProductKind>("all");
const q = ref("");
const productsRef = ref<HTMLElement | null>(null);

const showScrollTop = ref(false);

function onScroll() {
  showScrollTop.value = typeof window !== "undefined" && window.scrollY > 200;
}

function scrollToTop() {
  if (typeof window !== "undefined") {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

onMounted(() => {
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", onScroll);
});

// --- Products-view specific reveal observer (starts earlier for cards) ---
let prodObserver: IntersectionObserver | null = null;

function setupProductReveals() {
  // clean up previous
  prodObserver?.disconnect();

  prodObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          prodObserver?.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px 24px 0px" },
  );

  // Observe only product card reveals inside this view
  nextTick(() => {
    document
      .querySelectorAll(".card-grid .reveal:not(.is-visible)")
      .forEach((el) => prodObserver?.observe(el));
  });
}

onMounted(() => setupProductReveals());
onBeforeUnmount(() => prodObserver?.disconnect());

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

  // scroll products section to top after filter change
  nextTick(() =>
    productsRef.value?.scrollIntoView({ behavior: "smooth", block: "start" }),
  );
}

// Filter and sort products. Bestsellers (tag === 'bestseller') appear first.
const filtered = computed(() => {
  let base =
    selected.value === "all"
      ? allProducts.value.slice()
      : allProducts.value.filter((p) => p.kind === selected.value);

  const term = q.value.trim().toLowerCase();
  if (term) {
    base = base.filter((p) => {
      return (
        p.title.toLowerCase().includes(term) ||
        p.desc.toLowerCase().includes(term) ||
        (p.tag || "").toLowerCase().includes(term)
      );
    });
  }

  // sort so that items with tag 'bestseller' come first; keep original order otherwise
  base.sort((a, b) => {
    const aScore = a.tag === "bestseller" ? 1 : 0;
    const bScore = b.tag === "bestseller" ? 1 : 0;
    return bScore - aScore;
  });

  return base;
});

// After a filter change Vue may reposition cards into the viewport without
// the IntersectionObserver detecting it (it only fires on state *changes*).
// Unobserving then re-observing forces the IO to report current visibility.
watch(filtered, () => nextTick(refresh));
// Re-run products-specific observer when the filtered list changes
watch(filtered, () => nextTick(setupProductReveals));

// When user types in the search box, scroll back to the top of the products
watch(q, (newVal, oldVal) => {
  if (newVal === oldVal) return;
  nextTick(() =>
    productsRef.value?.scrollIntoView({ behavior: "smooth", block: "start" }),
  );
});
</script>

<template>
  <main>
    <FloatingDecor fixed :count="16" />
    <!-- ── Header ─────────────────────────────────── -->
    <section class="page-hero">
      <div class="container page-hero__content reveal">
        <p class="page-hero__eyebrow">my products on Amazon</p>
        <h1 class="page-hero__title">Products</h1>
        <p class="page-hero__sub">
          Handcrafted designs made with care — perfect for you or as a gift.
        </p>
      </div>
    </section>

    <!-- ── Grid ───────────────────────────────────── -->
    <section class="section products" ref="productsRef">
      <div class="container">
        <!-- Loading state while Supabase fetches products -->
        <div v-if="isLoading" class="products-loading">
          <span class="products-loading__spinner"></span>
          <p>Loading products…</p>
        </div>

        <template v-else>
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

            <!-- Search -->
            <div class="search">
              <span class="search__icon search__icon--left" aria-hidden="true">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M21 21l-4.35-4.35"
                    stroke="#c85473"
                    stroke-width="1.8"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <circle
                    cx="11"
                    cy="11"
                    r="6"
                    stroke="#c85473"
                    stroke-width="1.8"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>

              <input
                id="product-search"
                v-model="q"
                class="search__input"
                type="text"
                :maxlength="35"
                placeholder="Search products"
                aria-label="Search products"
              />

              <button
                v-if="q"
                type="button"
                class="search__clear"
                @click="q = ''"
                aria-label="Clear search"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M18 6L6 18M6 6l12 12"
                    stroke="#7a4450"
                    stroke-width="2.2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>

          <!-- No products found -->
          <div v-if="filtered.length === 0" class="empty-state">
            <p class="empty-state__title">No products found</p>
            <p class="empty-state__body">
              <span v-if="q">No results for "{{ q }}".</span>
              <span v-else>We couldn't find any products.</span>
              Try different keywords or clear the search.
            </p>
            <button v-if="q" class="btn" @click="q = ''">Clear search</button>
          </div>

          <!-- Product cards -->
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

          <!-- Scroll to top button -->
          <button
            v-show="showScrollTop"
            class="scroll-top"
            @click="scrollToTop"
            aria-label="Scroll to top"
          >
            <svg viewBox="0 0 24 24" class="icon-svg" aria-hidden="true">
              <path d="M12 8l-6 6h12z" fill="currentColor" />
            </svg>
            Scroll to top
          </button>
        </template>
      </div>
    </section>
  </main>
</template>

<style scoped>
.page-hero {
  padding: 120px 0 70px;
  overflow: hidden;
  background: var(--primrose-light);
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
  position: sticky;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
  margin-bottom: 0;
  padding: 10px;
  margin-bottom: 12px;
  border-bottom: 1px solid var(--primrose-light);
  top: 71px;
  z-index: 40;
  background: var(--pink-bg);
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

.search {
  position: relative;
  max-width: 520px;
}

.search__icon {
  position: absolute;
  left: 12px;
  top: 47%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  color: var(--mid);
  pointer-events: none;
}

.search__icon svg {
  display: block;
}

.search__input {
  padding: 10px 14px;
  padding-left: 44px;
  padding-right: 44px;
  border-radius: 999px;
  border: 1.5px solid #f3d6db;
  background: #fff;
  min-width: 240px;
  font-size: 0.95rem;
  outline: none;
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.02);
  transition:
    box-shadow 180ms ease,
    border-color 180ms ease;
}

.search__input::placeholder {
  color: #d18c9b;
}

.search__input:focus {
  box-shadow: 0 0 0 6px rgba(242, 151, 160, 0.12);
  border-color: #f297a0;
}

.search__clear {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.04);
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
}

.search__clear svg {
  display: block;
}

.empty-state {
  background: rgba(255, 245, 247, 0.9);
  border: 1px solid #f4d9dd;
  padding: 28px 20px;
  border-radius: 12px;
  text-align: center;
  margin-bottom: 18px;
}
.empty-state__title {
  font-size: 1.15rem;
  font-weight: 800;
  color: #c13b64;
  margin: 0 0 6px;
}
.empty-state__body {
  color: var(--mid);
  margin: 0 0 12px;
}
.empty-state .btn {
  background: linear-gradient(90deg, #ffb2c4, #f79aa9);
  border: none;
  color: white;
  padding: 8px 16px;
  border-radius: 999px;
  cursor: pointer;
}

@media (max-width: 520px) {
  .products__top {
    justify-content: center;
    text-align: center;
  }
}

/* Disable sticky header on small screens to save vertical space */
@media (max-width: 600px) {
  .products__top {
    position: static;
    top: auto;
    z-index: auto;
    background: transparent;
    padding-top: 6px;
    padding-bottom: 6px;
  }
}

.products-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 80px 0;
  color: var(--mid);
  font-family: var(--font-body);
  font-size: 1rem;
}

.products-loading__spinner {
  display: block;
  width: 44px;
  height: 44px;
  border: 4px solid rgba(242, 151, 160, 0.25);
  border-top-color: var(--primrose);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.scroll-top {
  position: fixed;
  right: 10px;
  bottom: 10px;
  width: 140px;
  height: 44px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 6px 14px;
  background: linear-gradient(90deg, #fff6fb 0%, #ffeef6 100%);
  color: #c84a6b;
  border: 1px solid #c84a6b;
  box-shadow: 0 12px 30px rgba(200, 74, 107, 0.08);
  cursor: pointer;
  z-index: 1200;
  transition:
    box-shadow 0.16s ease,
    opacity 0.12s ease,
    background 0.12s ease,
    filter 0.12s ease;
  font-weight: 700;
}
.scroll-top .icon-svg {
  width: 18px;
  height: 18px;
  display: block;
  fill: currentColor;
}
.scroll-top:hover {
  box-shadow: 0 18px 48px rgba(200, 74, 107, 0.12);
  filter: brightness(1.03);
}
.scroll-top:active {
  box-shadow: 0 10px 28px rgba(200, 74, 107, 0.1);
}
.scroll-top:focus-visible {
  outline: 3px solid rgba(200, 74, 107, 0.12);
  outline-offset: 4px;
}
</style>
