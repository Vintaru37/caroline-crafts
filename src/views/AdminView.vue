<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useProducts } from "../composables/useProducts";
import type { AdminProduct, ProductCategory } from "../composables/useProducts";
import { supabase } from "../lib/supabase";
import {
  deleteProductImage,
  deleteBlogImage,
} from "../composables/useImageUpload";
import logoImg from "../assets/images/logo.webp";

import AdminLoginScreen from "../components/admin/AdminLoginScreen.vue";
import AdminHeader from "../components/admin/AdminHeader.vue";
import AdminToolbar from "../components/admin/AdminToolbar.vue";
import AdminProductTable from "../components/admin/AdminProductTable.vue";
import AdminProductModal from "../components/admin/AdminProductModal.vue";
import AdminDeleteModal from "../components/admin/AdminDeleteModal.vue";
import AdminToast from "../components/admin/AdminToast.vue";
import AdminTableSettingsModal from "../components/admin/AdminTableSettingsModal.vue";
import AdminAnalytics from "../components/admin/AdminAnalytics.vue";
import AdminBlogTable from "../components/admin/AdminBlogTable.vue";
import AdminBlogModal from "../components/admin/AdminBlogModal.vue";
import AdminBlogDeleteModal from "../components/admin/AdminBlogDeleteModal.vue";
import {
  type TableSettings,
  loadTableSettings,
  saveTableSettings,
} from "../components/admin/tableSettings";
import { useBlog } from "../composables/useBlog";
import type { BlogArticle, BlogArticleInput } from "../composables/useBlog";

// Auth
const authenticated = ref(false);

onMounted(async () => {
  const { data } = await supabase.auth.getSession();
  authenticated.value = !!data.session;
});

const { data: authListener } = supabase.auth.onAuthStateChange(
  (_event, session) => {
    authenticated.value = !!session;
  },
);

onUnmounted(() => {
  authListener.subscription.unsubscribe();
});

async function logout() {
  await supabase.auth.signOut();
}

// Products
const {
  isLoading,
  loadError,
  allProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  exportProducts,
  importProducts,
  reorderProducts,
  reload,
} = useProducts();

// Filter & Search
type CatFilter = "all" | ProductCategory;
const catFilter = ref<CatFilter>("all");
const searchQ = ref("");

const stats = computed(() => ({
  total: allProducts.value.length,
  books: allProducts.value.filter((p) => p.category === "coloring-book").length,
  notebooks: allProducts.value.filter((p) => p.category === "notebook").length,
}));

const filteredProducts = computed(() => {
  let list = allProducts.value as AdminProduct[];
  if (catFilter.value !== "all") {
    list = list.filter((p) => p.category === catFilter.value);
  }
  const term = searchQ.value.trim().toLowerCase();
  if (term) {
    list = list.filter(
      (p) =>
        p.title.toLowerCase().includes(term) ||
        p.desc.toLowerCase().includes(term) ||
        p.tag.toLowerCase().includes(term),
    );
  }
  return list;
});

// Drag is available on any category tab as long as no text search is active
const isDraggable = computed(() => searchQ.value.trim() === "");

// Add / Edit Modal
const showModal = ref(false);
const modalMode = ref<"add" | "edit">("add");
const editingId = ref<string | null>(null);
const modalInitialData = ref<Omit<AdminProduct, "id"> | null>(null);
const formError = ref("");
const saving = ref(false);

function openAdd() {
  modalInitialData.value = null;
  editingId.value = null;
  modalMode.value = "add";
  formError.value = "";
  showModal.value = true;
}

function openEdit(p: AdminProduct) {
  const { id, ...rest } = p;
  modalInitialData.value = rest;
  editingId.value = id;
  modalMode.value = "edit";
  formError.value = "";
  showModal.value = true;
}

async function handleSave(formData: Omit<AdminProduct, "id">) {
  if (!formData.title.trim()) {
    formError.value = "Title is required.";
    return;
  }
  saving.value = true;
  formError.value = "";
  try {
    if (modalMode.value === "add") {
      await addProduct(formData);
      showToast("Product added!");
    } else if (editingId.value) {
      const oldImage = modalInitialData.value?.image ?? "";
      await updateProduct(editingId.value, formData);
      // Delete the replaced image from storage (non-fatal, errors are logged)
      if (oldImage && oldImage !== formData.image) {
        await deleteProductImage(oldImage);
      }
      showToast("Product updated!");
    }
    showModal.value = false;
  } catch (err: unknown) {
    formError.value =
      "Save failed: " + (err instanceof Error ? err.message : "Unknown error");
  } finally {
    saving.value = false;
  }
}

// Delete
const deleteTarget = ref<AdminProduct | null>(null);

async function confirmDelete() {
  if (!deleteTarget.value) return;
  try {
    // Capture image URL before deleting the DB row
    const oldImage = deleteTarget.value.image ?? "";
    await deleteProduct(deleteTarget.value.id);
    // Delete associated image from storage (non-fatal)
    if (oldImage) {
      await deleteProductImage(oldImage);
    }
    deleteTarget.value = null;
    showToast("Product deleted.");
  } catch (err: unknown) {
    showToast(
      "Delete failed: " +
        (err instanceof Error ? err.message : "Unknown error"),
      "error",
    );
  }
}

// Drag-and-drop reorder
const isSavingOrder = ref(false);

async function handleToggleVisible(product: AdminProduct) {
  try {
    await updateProduct(product.id, { isVisible: product.isVisible === false });
    showToast(
      product.isVisible === false
        ? `"${product.title}" is now visible.`
        : `"${product.title}" is now hidden.`,
    );
  } catch (err: unknown) {
    showToast(
      "Failed to update visibility: " +
        (err instanceof Error ? err.message : "Unknown error"),
      "error",
    );
  }
}

async function handleReorder(ids: string[]) {
  isSavingOrder.value = true;
  try {
    await reorderProducts(ids);
    showToast("Order saved!");
  } catch (err: unknown) {
    showToast(
      "Failed to save order: " +
        (err instanceof Error ? err.message : "Unknown error"),
      "error",
    );
  } finally {
    isSavingOrder.value = false;
  }
}

// Import
async function handleImportFile(file: File) {
  try {
    await importProducts(file);
    showToast("Products imported successfully!");
  } catch (err: unknown) {
    showToast(
      "Import failed: " +
        (err instanceof Error ? err.message : "Unknown error"),
      "error",
    );
  }
}

// ── Toast
const toastMsg = ref("");
const toastType = ref<"success" | "error">("success");
const toastVisible = ref(false);
let toastTimer: ReturnType<typeof setTimeout> | null = null;

// ── Table settings
const showTableSettings = ref(false);
const tableSettings = ref<TableSettings>(loadTableSettings());

// ── Active tab
const activeTab = ref<"products" | "blog" | "analytics">("products");

function handleSettingsUpdate(val: TableSettings) {
  tableSettings.value = val;
  saveTableSettings(val);
}

function showToast(msg: string, type: "success" | "error" = "success") {
  if (toastTimer) clearTimeout(toastTimer);
  toastMsg.value = msg;
  toastType.value = type;
  toastVisible.value = true;
  toastTimer = setTimeout(() => {
    toastVisible.value = false;
  }, 3500);
}

onUnmounted(() => {
  if (toastTimer) clearTimeout(toastTimer);
});

// ── Blog tab ─────────────────────────────────────────────────────────────────
const {
  isLoading: blogLoading,
  loadError: blogError,
  allArticles,
  reload: reloadBlog,
  addArticle,
  updateArticle,
  deleteArticle,
  togglePublished,
} = useBlog();

const showBlogModal = ref(false);
const blogModalMode = ref<"add" | "edit">("add");
const blogEditingId = ref<string | null>(null);
const blogModalInitialData = ref<Omit<
  BlogArticle,
  "id" | "created_at" | "updated_at"
> | null>(null);
const blogFormError = ref("");
const blogSaving = ref(false);
const blogDeleteTarget = ref<BlogArticle | null>(null);

function openBlogAdd() {
  blogModalInitialData.value = null;
  blogEditingId.value = null;
  blogModalMode.value = "add";
  blogFormError.value = "";
  showBlogModal.value = true;
}

function openBlogEdit(a: BlogArticle) {
  const { id, created_at, updated_at, ...rest } = a;
  blogModalInitialData.value = rest;
  blogEditingId.value = id;
  blogModalMode.value = "edit";
  blogFormError.value = "";
  showBlogModal.value = true;
}

async function handleBlogSave(formData: BlogArticleInput) {
  if (!formData.title.trim()) {
    blogFormError.value = "Title is required.";
    return;
  }
  if (!formData.slug.trim()) {
    blogFormError.value = "Slug is required.";
    return;
  }
  blogSaving.value = true;
  blogFormError.value = "";
  try {
    if (blogModalMode.value === "add") {
      await addArticle(formData);
      showToast("Article created!");
    } else if (blogEditingId.value) {
      const oldImage = blogModalInitialData.value?.cover_image ?? "";
      await updateArticle(blogEditingId.value, formData);
      // Remove the old cover from the bucket if it was replaced (non-fatal)
      if (oldImage && oldImage !== formData.cover_image) {
        await deleteBlogImage(oldImage);
      }
      showToast("Article updated!");
    }
    showBlogModal.value = false;
  } catch (err: unknown) {
    blogFormError.value =
      "Save failed: " + (err instanceof Error ? err.message : "Unknown error");
  } finally {
    blogSaving.value = false;
  }
}

async function confirmBlogDelete() {
  if (!blogDeleteTarget.value) return;
  try {
    const oldImage = blogDeleteTarget.value.cover_image ?? "";
    await deleteArticle(blogDeleteTarget.value.id);
    // Remove cover from bucket (non-fatal)
    if (oldImage) {
      await deleteBlogImage(oldImage);
    }
    blogDeleteTarget.value = null;
    showToast("Article deleted.");
  } catch (err: unknown) {
    showToast(
      "Delete failed: " +
        (err instanceof Error ? err.message : "Unknown error"),
      "error",
    );
  }
}

async function handleTogglePublish(article: BlogArticle) {
  try {
    await togglePublished(article);
    showToast(
      article.is_published
        ? `"${article.title}" unpublished.`
        : `"${article.title}" is now live!`,
    );
  } catch (err: unknown) {
    showToast(
      "Failed to update status: " +
        (err instanceof Error ? err.message : "Unknown error"),
      "error",
    );
  }
}
</script>

<template>
  <!-- Login screen (auth handled inside component) -->
  <AdminLoginScreen v-if="!authenticated" />

  <!-- Dashboard -->
  <div v-else class="admin-wrap">
    <AdminHeader :logoImg="logoImg" :stats="stats" @logout="logout" />

    <!-- Tab navigation -->
    <nav class="admin-tabs">
      <button
        :class="[
          'admin-tab',
          { 'admin-tab--active': activeTab === 'products' },
        ]"
        @click="activeTab = 'products'"
      >
        📦 Products
      </button>
      <button
        :class="['admin-tab', { 'admin-tab--active': activeTab === 'blog' }]"
        @click="activeTab = 'blog'"
      >
        ✍️ Blog
      </button>
      <button
        :class="[
          'admin-tab',
          { 'admin-tab--active': activeTab === 'analytics' },
        ]"
        @click="activeTab = 'analytics'"
      >
        📊 Analytics
      </button>
    </nav>

    <!-- Products tab -->
    <template v-if="activeTab === 'products'">
      <AdminToolbar
        :stats="stats"
        :catFilter="catFilter"
        :searchQ="searchQ"
        :filteredCount="filteredProducts.length"
        :isDraggable="isDraggable"
        @update:catFilter="catFilter = $event"
        @update:searchQ="searchQ = $event"
        @add="openAdd"
        @export="exportProducts"
        @importFile="handleImportFile"
        @openSettings="showTableSettings = true"
      />

      <AdminProductTable
        :filteredProducts="filteredProducts"
        :isDraggable="isDraggable"
        :isLoading="isLoading"
        :loadError="loadError"
        :isSavingOrder="isSavingOrder"
        :tableSettings="tableSettings"
        @edit="openEdit"
        @delete="deleteTarget = $event"
        @reorder="handleReorder"
        @reload="reload"
        @toggleVisible="handleToggleVisible"
      />
    </template>

    <!-- Analytics tab -->
    <AdminAnalytics v-else-if="activeTab === 'analytics'" />

    <!-- Blog tab -->
    <template v-else-if="activeTab === 'blog'">
      <div class="blog-tab-header">
        <h2 class="blog-tab-title">✍️ Blog Articles</h2>
        <button class="btn-new-article" @click="openBlogAdd">
          + New Article
        </button>
      </div>
      <AdminBlogTable
        :articles="allArticles"
        :isLoading="blogLoading"
        :loadError="blogError"
        @edit="openBlogEdit"
        @delete="blogDeleteTarget = $event"
        @togglePublish="handleTogglePublish"
        @reload="reloadBlog"
      />
    </template>

    <AdminProductModal
      :show="showModal"
      :mode="modalMode"
      :initialData="modalInitialData"
      :saving="saving"
      :error="formError"
      @close="showModal = false"
      @save="handleSave"
    />

    <AdminDeleteModal
      :target="deleteTarget"
      @cancel="deleteTarget = null"
      @confirm="confirmDelete"
    />

    <AdminBlogModal
      :show="showBlogModal"
      :mode="blogModalMode"
      :initialData="blogModalInitialData"
      :saving="blogSaving"
      :error="blogFormError"
      @close="showBlogModal = false"
      @save="handleBlogSave"
    />

    <AdminBlogDeleteModal
      :target="blogDeleteTarget"
      @cancel="blogDeleteTarget = null"
      @confirm="confirmBlogDelete"
    />

    <AdminToast :visible="toastVisible" :msg="toastMsg" :type="toastType" />

    <AdminTableSettingsModal
      :show="showTableSettings"
      :settings="tableSettings"
      @close="showTableSettings = false"
      @update:settings="handleSettingsUpdate"
    />
  </div>
</template>

<style scoped>
.admin-wrap {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #faf0f2;
  font-family: var(--font-body);
}

/* ── Tab bar ────────────────────────────────────────────────────────────────── */
.admin-tabs {
  display: flex;
  gap: 0;
  background: var(--dark);
  padding: 0 24px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.06);
}

.admin-tab {
  padding: 12px 22px;
  background: transparent;
  border: none;
  border-bottom: 3px solid transparent;
  color: rgba(255, 255, 255, 0.5);
  font-family: var(--font-body);
  font-size: 0.88rem;
  font-weight: 700;
  cursor: pointer;
  transition:
    color 0.2s,
    border-color 0.2s;
  letter-spacing: 0.03em;
  margin-bottom: -2px;
}

.admin-tab:hover {
  color: rgba(255, 255, 255, 0.85);
}

.admin-tab--active {
  color: var(--primrose, #f297a0);
  border-bottom-color: var(--primrose, #f297a0);
}

/* ── Blog tab header ── */
.blog-tab-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px 12px;
  flex-wrap: wrap;
  gap: 12px;
}

.blog-tab-title {
  font-family: var(--font-heading);
  font-size: 1.25rem;
  color: var(--dark);
}

.btn-new-article {
  padding: 10px 22px;
  background: linear-gradient(135deg, var(--primrose, #f297a0), #e57f8a);
  color: #fff;
  border: none;
  border-radius: var(--radius-md, 18px);
  font-family: var(--font-body);
  font-size: 0.88rem;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-new-article:hover {
  opacity: 0.88;
}
</style>
