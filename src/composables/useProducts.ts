/**
 * useProducts – singleton composable for all product data management.
 *
 * Products are loaded from src/data/products.json at build time.
 * Changes made in the Admin Panel are kept in-memory for the current session.
 * Use the Export button to download the updated JSON, then replace
 * src/data/products.json with it and rebuild to make changes permanent.
 *
 */

import { reactive, computed } from "vue";
import productsData from "../data/products.json";

// ── Image resolution via Vite glob ───────────────────────────────────────────

const bookImages = import.meta.glob("../assets/images/coloring-books/*.webp", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const notebookImages = import.meta.glob(
  "../assets/images/notebooks/*.{png,webp,jpg}",
  { eager: true, query: "?url", import: "default" },
) as Record<string, string>;

// ── Types ────────────────────────────────────────────────────────────────────

export type ProductCategory = "coloring-book" | "notebook";

export interface AdminProduct {
  id: string;
  category: ProductCategory;
  title: string;
  desc: string;
  tag: string;
  /** Bare filename (e.g. "cozy-awawa.webp") or a full https:// URL */
  image: string;
  /** Amazon product page URL */
  amazonUrl: string;
  /** Used by Notebooks – e.g. "Lined", "Grid", "Bullet Journal" */
  notebookType: string;
}

export function resolveImage(category: ProductCategory, image: string): string {
  // Already a full URL or absolute path (e.g. https://…) – return as-is
  if (
    image.startsWith("http") ||
    image.startsWith("/") ||
    image.startsWith("data:")
  ) {
    return image;
  }
  if (category === "coloring-book") {
    return bookImages[`../assets/images/coloring-books/${image}`] ?? image;
  }
  return notebookImages[`../assets/images/notebooks/${image}`] ?? image;
}

// ── Module-level singleton state ─────────────────────────────────────────────
// Seeded from products.json at startup. Changes are in-memory only.
// Export from the Admin Panel to get an updated JSON you can commit.

const state = reactive({
  products: (productsData as AdminProduct[]).slice(),
});

// ── Composable ───────────────────────────────────────────────────────────────

export function useProducts() {
  // Raw list (bare image filenames) – used internally and for export
  const allProducts = computed(() => state.products as AdminProduct[]);

  // Resolved lists – images replaced with full asset URLs for display in cards
  const coloringBookList = computed(() =>
    state.products
      .filter((p) => p.category === "coloring-book")
      .map((p) => ({ ...p, image: resolveImage(p.category, p.image) })),
  );

  const notebookList = computed(() =>
    state.products
      .filter((p) => p.category === "notebook")
      .map((p) => ({ ...p, image: resolveImage(p.category, p.image) })),
  );

  // ── CRUD (in-memory only) ─────────────────────────────────────────

  function addProduct(data: Omit<AdminProduct, "id">): void {
    const id = `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    state.products.push({ ...data, id });
  }

  function updateProduct(
    id: string,
    changes: Partial<Omit<AdminProduct, "id">>,
  ): void {
    const idx = state.products.findIndex((p) => p.id === id);
    if (idx === -1) return;
    const current = state.products[idx];
    if (!current) return;
    const updated: AdminProduct = { ...current, ...changes, id: current.id };
    state.products.splice(idx, 1, updated);
  }

  function deleteProduct(id: string): void {
    const idx = state.products.findIndex((p) => p.id === id);
    if (idx !== -1) state.products.splice(idx, 1);
  }

  // ── Export / Import ───────────────────────────────────────────────
  // Export writes raw state (bare filenames) → drop into src/data/products.json
  // and rebuild to make changes permanent for all visitors.

  function exportProducts(): void {
    const json = JSON.stringify(state.products, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "products.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function importProducts(file: File): Promise<void> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target!.result as string) as AdminProduct[];
          if (!Array.isArray(data))
            throw new Error("File must contain an array of products.");
          state.products.splice(0, state.products.length, ...data);
          resolve();
        } catch (err: unknown) {
          reject(
            new Error(err instanceof Error ? err.message : "Invalid JSON file"),
          );
        }
      };
      reader.onerror = () => reject(new Error("Could not read file."));
      reader.readAsText(file);
    });
  }

  // ── Reset ─────────────────────────────────────────────────────────
  // Discards all in-memory changes and reloads from products.json

  function resetToDefaults(): void {
    state.products.splice(
      0,
      state.products.length,
      ...(productsData as AdminProduct[]),
    );
  }

  return {
    allProducts,
    coloringBookList,
    notebookList,
    addProduct,
    updateProduct,
    deleteProduct,
    exportProducts,
    importProducts,
    resetToDefaults,
  };
}
