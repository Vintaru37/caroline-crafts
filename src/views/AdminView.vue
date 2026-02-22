<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useProducts } from "../composables/useProducts";
import type { AdminProduct, ProductCategory } from "../composables/useProducts";
import { supabase } from "../lib/supabase";
import { deleteProductImage } from "../composables/useImageUpload";
import logoImg from "../assets/images/logo.png";

import AdminLoginScreen from "../components/admin/AdminLoginScreen.vue";
import AdminHeader from "../components/admin/AdminHeader.vue";
import AdminToolbar from "../components/admin/AdminToolbar.vue";
import AdminProductTable from "../components/admin/AdminProductTable.vue";
import AdminProductModal from "../components/admin/AdminProductModal.vue";
import AdminDeleteModal from "../components/admin/AdminDeleteModal.vue";
import AdminToast from "../components/admin/AdminToast.vue";

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
    await deleteProduct(deleteTarget.value.id);
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

// â”€â”€ Toast
const toastMsg = ref("");
const toastType = ref<"success" | "error">("success");
const toastVisible = ref(false);
let toastTimer: ReturnType<typeof setTimeout> | null = null;

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
</script>

<template>
  <!-- Login screen (auth handled inside component) -->
  <AdminLoginScreen v-if="!authenticated" />

  <!-- Dashboard -->
  <div v-else class="admin-wrap">
    <AdminHeader :logoImg="logoImg" :stats="stats" @logout="logout" />

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
    />

    <AdminProductTable
      :filteredProducts="filteredProducts"
      :isDraggable="isDraggable"
      :isLoading="isLoading"
      :loadError="loadError"
      :isSavingOrder="isSavingOrder"
      @edit="openEdit"
      @delete="deleteTarget = $event"
      @reorder="handleReorder"
      @reload="reload"
    />

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

    <AdminToast :visible="toastVisible" :msg="toastMsg" :type="toastType" />
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
</style>
