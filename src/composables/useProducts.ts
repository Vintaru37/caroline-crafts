/**
 * useProducts – singleton composable backed by Supabase.
 *
 * Reads from / writes to the `products` table in your Supabase project.
 * Images are stored as bare filenames in the DB (e.g. "cozy-awawa.webp") and
 * resolved to real asset URLs at runtime via Vite glob imports.
 */

import { reactive, computed } from "vue";
import { supabase } from "../lib/supabase";
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
  /** Display order — lower = first */
  sort_order?: number;
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

const state = reactive({
  products: [] as AdminProduct[],
  loading: true,
  error: null as string | null,
});

// Fetch immediately when the module is first imported
_fetchAll();

async function _fetchAll(): Promise<void> {
  state.loading = true;
  state.error = null;

  // Try Supabase first. If the query fails for any reason (network down,
  // missing column, RLS issue) fall back silently to the bundled JSON so
  // the site always shows products.
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("sort_order", { ascending: true, nullsFirst: false })
    .order("id");

  if (error) {
    console.warn(
      "[useProducts] Supabase unavailable, using local fallback:",
      error.message,
    );
    // Use bundled JSON as fallback — products always visible to visitors
    state.products.splice(
      0,
      state.products.length,
      ...(productsData as AdminProduct[]),
    );
    // Only show the error banner inside the admin panel, not to visitors
    state.error = error.message;
  } else {
    state.products.splice(
      0,
      state.products.length,
      ...(data as AdminProduct[]),
    );
  }
  state.loading = false;
}

// ── Composable ───────────────────────────────────────────────────────────────

export function useProducts() {
  const isLoading = computed(() => state.loading);
  const loadError = computed(() => state.error);

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

  // ── CRUD (Supabase-backed) ────────────────────────────────────────

  async function addProduct(data: Omit<AdminProduct, "id">): Promise<void> {
    const id = `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const product: AdminProduct = { ...data, id };
    const { error } = await supabase.from("products").insert([product]);
    if (error) throw new Error(error.message);
    state.products.push(product);
  }

  async function updateProduct(
    id: string,
    changes: Partial<Omit<AdminProduct, "id">>,
  ): Promise<void> {
    const { error } = await supabase
      .from("products")
      .update(changes)
      .eq("id", id);
    if (error) throw new Error(error.message);
    const idx = state.products.findIndex((p) => p.id === id);
    if (idx === -1) return;
    const current = state.products[idx];
    if (!current) return;
    state.products.splice(idx, 1, { ...current, ...changes, id: current.id });
  }

  async function deleteProduct(id: string): Promise<void> {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) throw new Error(error.message);
    const idx = state.products.findIndex((p) => p.id === id);
    if (idx !== -1) state.products.splice(idx, 1);
  }

  // ── Export / Import ───────────────────────────────────────────────

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
      reader.onload = async (e) => {
        try {
          const data = JSON.parse(e.target!.result as string) as AdminProduct[];
          if (!Array.isArray(data))
            throw new Error("File must contain an array of products.");
          const { error } = await supabase
            .from("products")
            .upsert(data, { onConflict: "id" });
          if (error) throw new Error(error.message);
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

  // ── Reorder ───────────────────────────────────────────────────────
  // Persists a new display order for the given product IDs to Supabase.

  async function reorderProducts(orderedIds: string[]): Promise<void> {
    const map = new Map(state.products.map((p) => [p.id, p]));
    // Include full product objects so Supabase not-null constraints are satisfied
    const updates = orderedIds.map((id, idx) => {
      const p = map.get(id)!;
      return { ...p, sort_order: idx };
    });
    const { error } = await supabase
      .from("products")
      .upsert(updates, { onConflict: "id" });
    if (error) throw new Error(error.message);
    // Reorder local state to match
    const reordered = orderedIds
      .map((id, idx) => {
        const p = map.get(id);
        return p ? { ...p, sort_order: idx } : null;
      })
      .filter(Boolean) as AdminProduct[];
    state.products.splice(0, state.products.length, ...reordered);
  }

  // ── Reload ────────────────────────────────────────────────────────

  function reload(): Promise<void> {
    return _fetchAll();
  }

  return {
    isLoading,
    loadError,
    allProducts,
    coloringBookList,
    notebookList,
    addProduct,
    updateProduct,
    deleteProduct,
    exportProducts,
    importProducts,
    reorderProducts,
    reload,
  };
}
