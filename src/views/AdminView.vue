<script setup lang="ts">
import { ref, computed, reactive, onUnmounted } from "vue";
import { useProducts, resolveImage } from "../composables/useProducts";
import type { AdminProduct, ProductCategory } from "../composables/useProducts";

// ── Auth ─────────────────────────────────────────────────────────────────────
// NOTE: client-side password only – not a substitute for real server auth.
// Set VITE_ADMIN_PASSWORD in your .env to override the default.
const PASS =
  (import.meta.env.VITE_ADMIN_PASSWORD as string | undefined) ?? "caroline";
const AUTH_KEY = "cc_admin_authed";

const authenticated = ref(sessionStorage.getItem(AUTH_KEY) === "1");
const pwInput = ref("");
const pwVisible = ref(false);
const pwError = ref("");
const pwLoading = ref(false);

function login() {
  if (!pwInput.value) {
    pwError.value = "Please enter the password.";
    return;
  }
  pwLoading.value = true;
  // Tiny artificial delay to make it feel less instant-hackable
  setTimeout(() => {
    pwLoading.value = false;
    if (pwInput.value === PASS) {
      sessionStorage.setItem(AUTH_KEY, "1");
      authenticated.value = true;
      pwError.value = "";
      pwInput.value = "";
    } else {
      pwError.value = "Incorrect password. Try again.";
      pwInput.value = "";
    }
  }, 400);
}

function logout() {
  sessionStorage.removeItem(AUTH_KEY);
  authenticated.value = false;
}

// ── Products ─────────────────────────────────────────────────────────────────
const {
  allProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  exportProducts,
  importProducts,
  resetToDefaults,
} = useProducts();

// ── Filter & Search ──────────────────────────────────────────────────────────
type CatFilter = "all" | ProductCategory;
const catFilter = ref<CatFilter>("all");
const searchQ = ref("");

const stats = computed(() => ({
  total: allProducts.value.length,
  books: allProducts.value.filter((p) => p.category === "coloring-book").length,
  notebooks: allProducts.value.filter((p) => p.category === "notebook").length,
}));

const filtered = computed(() => {
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

// ── Add / Edit Modal ─────────────────────────────────────────────────────────
const showModal = ref(false);
const modalMode = ref<"add" | "edit">("add");
const editingId = ref<string | null>(null);
const formError = ref("");

const blankForm = (): Omit<AdminProduct, "id"> => ({
  category: "coloring-book",
  title: "",
  desc: "",
  tag: "",
  image: "",
  amazonUrl: "",
  notebookType: "",
});

const form = reactive<Omit<AdminProduct, "id">>(blankForm());

function openAdd() {
  Object.assign(form, blankForm());
  editingId.value = null;
  modalMode.value = "add";
  formError.value = "";
  showModal.value = true;
}

function openEdit(p: AdminProduct) {
  Object.assign(form, { ...p });
  editingId.value = p.id;
  modalMode.value = "edit";
  formError.value = "";
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
}

function saveModal() {
  if (!form.title.trim()) {
    formError.value = "Title is required.";
    return;
  }
  if (modalMode.value === "add") {
    addProduct({ ...form });
    showToast("Product added! 🎉");
  } else if (editingId.value) {
    updateProduct(editingId.value, { ...form });
    showToast("Product updated! ✅");
  }
  showModal.value = false;
}

const TAG_PRESETS = ["bestseller", "new", "sale", "limited edition"];

function toggleTag(t: string) {
  form.tag = form.tag === t ? "" : t;
}

// ── Delete confirmation ──────────────────────────────────────────────────────
const deleteTarget = ref<AdminProduct | null>(null);

function askDelete(p: AdminProduct) {
  deleteTarget.value = p;
}

function confirmDelete() {
  if (deleteTarget.value) {
    deleteProduct(deleteTarget.value.id);
    deleteTarget.value = null;
    showToast("Product deleted. 🗑️");
  }
}

// ── Reset confirmation ───────────────────────────────────────────────────────
const showReset = ref(false);

function confirmReset() {
  resetToDefaults();
  showReset.value = false;
  showToast("Products reset to defaults. 🔄");
}

// ── Import / Export ──────────────────────────────────────────────────────────
const fileInput = ref<HTMLInputElement | null>(null);

function triggerImport() {
  fileInput.value?.click();
}

async function handleFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  try {
    await importProducts(file);
    showToast("Products imported successfully! 📦");
  } catch (err: unknown) {
    showToast(
      "Import failed: " +
        (err instanceof Error ? err.message : "Unknown error"),
      "error",
    );
  }
  if (fileInput.value) fileInput.value.value = "";
}

// ── Toast ────────────────────────────────────────────────────────────────────
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
  <!-- ═══════════════════════════════════════════════════════ LOGIN SCREEN -->
  <div v-if="!authenticated" class="login-wrap">
    <div class="login-card">
      <div class="login-brand">
        <span class="login-brand__rose">🌸</span>
        <span class="login-brand__name">Caroline<strong>Crafts</strong></span>
      </div>
      <h1 class="login-title">Admin Panel</h1>
      <p class="login-sub">Manage your products with ease</p>

      <div class="login-field" :class="{ error: pwError }">
        <label for="pw-input" class="sr-only">Password</label>
        <input
          id="pw-input"
          :type="pwVisible ? 'text' : 'password'"
          v-model="pwInput"
          class="login-input"
          placeholder="Enter your password"
          autocomplete="current-password"
          @keyup.enter="login"
        />
        <button
          type="button"
          class="pw-toggle"
          :aria-label="pwVisible ? 'Hide password' : 'Show password'"
          @click="pwVisible = !pwVisible"
        >
          {{ pwVisible ? "🙈" : "👁️" }}
        </button>
      </div>

      <p v-if="pwError" class="login-error">{{ pwError }}</p>

      <button
        class="login-btn"
        :class="{ loading: pwLoading }"
        :disabled="pwLoading"
        @click="login"
      >
        <span v-if="!pwLoading">Log In →</span>
        <span v-else class="spinner"></span>
      </button>

      <p class="login-hint">
        Default password: <code>caroline</code> — change via
        <code>VITE_ADMIN_PASSWORD</code> in <code>.env</code>
      </p>
    </div>
  </div>

  <!-- ═══════════════════════════════════════════════════ ADMIN DASHBOARD -->
  <div v-else class="admin-wrap">
    <!-- ── Header ────────────────────────────────────────────────── -->
    <header class="admin-header">
      <div class="admin-header__left">
        <span class="admin-header__logo">🌸 CarolineCrafts</span>
        <span class="admin-header__pill">Admin Panel</span>
      </div>

      <div class="admin-header__stats">
        <div class="stat-chip">
          <span class="stat-chip__num">{{ stats.total }}</span>
          <span class="stat-chip__label">Total</span>
        </div>
        <div class="stat-chip">
          <span class="stat-chip__num">{{ stats.books }}</span>
          <span class="stat-chip__label">Books</span>
        </div>
        <div class="stat-chip">
          <span class="stat-chip__num">{{ stats.notebooks }}</span>
          <span class="stat-chip__label">Notebooks</span>
        </div>
      </div>

      <button class="logout-btn" @click="logout">Log out</button>
    </header>

    <!-- ── Toolbar ───────────────────────────────────────────────── -->
    <div class="admin-toolbar">
      <div class="toolbar-row">
        <!-- Search -->
        <div class="search-wrap">
          <span class="search-icon">🔍</span>
          <input
            v-model="searchQ"
            class="admin-search"
            type="text"
            placeholder="Search products…"
            aria-label="Search products"
          />
          <button
            v-if="searchQ"
            class="search-clear"
            type="button"
            @click="searchQ = ''"
            aria-label="Clear search"
          >
            ✕
          </button>
        </div>

        <!-- Category tabs -->
        <div class="cat-tabs" role="tablist">
          <button
            class="cat-tab"
            :class="{ active: catFilter === 'all' }"
            role="tab"
            @click="catFilter = 'all'"
          >
            All ({{ stats.total }})
          </button>
          <button
            class="cat-tab"
            :class="{ active: catFilter === 'coloring-book' }"
            role="tab"
            @click="catFilter = 'coloring-book'"
          >
            🎨 Books ({{ stats.books }})
          </button>
          <button
            class="cat-tab"
            :class="{ active: catFilter === 'notebook' }"
            role="tab"
            @click="catFilter = 'notebook'"
          >
            📓 Notebooks ({{ stats.notebooks }})
          </button>
        </div>

        <!-- Primary action -->
        <button class="btn-add" @click="openAdd">
          <span class="btn-add__icon">+</span> Add Product
        </button>
      </div>

      <div class="toolbar-row toolbar-row--secondary">
        <span class="result-count">
          Showing <strong>{{ filtered.length }}</strong> product{{
            filtered.length !== 1 ? "s" : ""
          }}
        </span>
        <div class="secondary-actions">
          <button
            class="btn-secondary"
            title="Export products as JSON"
            @click="exportProducts"
          >
            📤 Export JSON
          </button>
          <button
            class="btn-secondary"
            title="Import products from JSON"
            @click="triggerImport"
          >
            📥 Import JSON
          </button>
          <button
            class="btn-danger-soft"
            title="Reset to original product data"
            @click="showReset = true"
          >
            🔄 Reset to Defaults
          </button>
        </div>
      </div>
    </div>

    <!-- hidden file input -->
    <input
      ref="fileInput"
      type="file"
      accept=".json"
      style="display: none"
      @change="handleFileChange"
    />

    <!-- ── Product table ─────────────────────────────────────────── -->
    <div class="table-wrap">
      <!-- Empty state -->
      <div v-if="filtered.length === 0" class="empty-state">
        <p class="empty-state__emoji">🔍</p>
        <p class="empty-state__title">No products found</p>
        <p class="empty-state__sub">
          <span v-if="searchQ">No results for "{{ searchQ }}".</span>
          <span v-else>No products in this category yet.</span>
        </p>
        <button v-if="searchQ" class="btn-secondary" @click="searchQ = ''">
          Clear search
        </button>
        <button v-else class="btn-add small" @click="openAdd">
          + Add Product
        </button>
      </div>

      <table v-else class="product-table">
        <thead>
          <tr>
            <th class="th-num">#</th>
            <th class="th-img">Image</th>
            <th class="th-title">Title & Description</th>
            <th class="th-cat">Category</th>
            <th class="th-tag">Tag</th>
            <th class="th-actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(product, idx) in filtered"
            :key="product.id"
            class="product-row"
            :class="{ 'product-row--custom': product.id.startsWith('custom-') }"
          >
            <td class="td-num">{{ idx + 1 }}</td>

            <td class="td-img">
              <div class="thumb-wrap">
                <img
                  v-if="product.image"
                  :src="resolveImage(product.category, product.image)"
                  :alt="product.title"
                  class="thumb"
                  loading="lazy"
                />
                <div v-else class="thumb-placeholder">📷</div>
              </div>
            </td>

            <td class="td-title">
              <strong class="product-title">{{ product.title }}</strong>
              <span
                class="product-type"
                v-if="product.category === 'notebook' && product.notebookType"
              >
                {{ product.notebookType }}
              </span>
              <p class="product-desc">
                {{ product.desc.slice(0, 90)
                }}{{ product.desc.length > 90 ? "…" : "" }}
              </p>
              <a
                v-if="product.amazonUrl"
                :href="product.amazonUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="amazon-link"
                >↗ Amazon</a
              >
            </td>

            <td class="td-cat">
              <span
                class="cat-badge"
                :class="
                  product.category === 'coloring-book'
                    ? 'cat-badge--book'
                    : 'cat-badge--nb'
                "
              >
                {{
                  product.category === "coloring-book"
                    ? "🎨 Book"
                    : "📓 Notebook"
                }}
              </span>
            </td>

            <td class="td-tag">
              <span v-if="product.tag" class="tag-pill">{{ product.tag }}</span>
              <span v-else class="tag-none">—</span>
            </td>

            <td class="td-actions">
              <button
                class="action-btn action-btn--edit"
                title="Edit product"
                @click="openEdit(product)"
              >
                ✏️ Edit
              </button>
              <button
                class="action-btn action-btn--delete"
                title="Delete product"
                @click="askDelete(product)"
              >
                🗑️
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ═══════════════════════════════════════ ADD / EDIT MODAL -->
    <Transition name="modal">
      <div v-if="showModal" class="modal-backdrop" @click.self="closeModal">
        <div
          class="modal-card"
          role="dialog"
          aria-modal="true"
          :aria-label="modalMode === 'add' ? 'Add product' : 'Edit product'"
        >
          <div class="modal-header">
            <h2 class="modal-title">
              {{
                modalMode === "add" ? "✨ Add New Product" : "✏️ Edit Product"
              }}
            </h2>
            <button class="modal-close" aria-label="Close" @click="closeModal">
              ✕
            </button>
          </div>

          <div class="modal-body">
            <!-- Category -->
            <div class="form-group">
              <label class="form-label">Category</label>
              <div class="radio-row">
                <label
                  class="radio-label"
                  :class="{ selected: form.category === 'coloring-book' }"
                >
                  <input
                    type="radio"
                    v-model="form.category"
                    value="coloring-book"
                  />
                  🎨 Coloring Book
                </label>
                <label
                  class="radio-label"
                  :class="{ selected: form.category === 'notebook' }"
                >
                  <input
                    type="radio"
                    v-model="form.category"
                    value="notebook"
                  />
                  📓 Notebook
                </label>
              </div>
            </div>

            <!-- Title -->
            <div class="form-group">
              <label class="form-label" for="f-title"
                >Title <span class="required">*</span></label
              >
              <input
                id="f-title"
                v-model="form.title"
                class="form-input"
                type="text"
                placeholder="e.g. Cozy Capybaras"
              />
            </div>

            <!-- Description -->
            <div class="form-group">
              <label class="form-label" for="f-desc">Description</label>
              <textarea
                id="f-desc"
                v-model="form.desc"
                class="form-input form-textarea"
                rows="4"
                placeholder="Short product description…"
              ></textarea>
            </div>

            <!-- Tag -->
            <div class="form-group">
              <label class="form-label" for="f-tag">Tag</label>
              <input
                id="f-tag"
                v-model="form.tag"
                class="form-input"
                type="text"
                placeholder="e.g. bestseller, new…"
              />
              <div class="tag-presets">
                <button
                  v-for="t in TAG_PRESETS"
                  :key="t"
                  type="button"
                  class="preset-chip"
                  :class="{ active: form.tag === t }"
                  @click="toggleTag(t)"
                >
                  {{ t }}
                </button>
              </div>
            </div>

            <!-- Notebook type -->
            <div v-if="form.category === 'notebook'" class="form-group">
              <label class="form-label" for="f-nbtype">Notebook Type</label>
              <input
                id="f-nbtype"
                v-model="form.notebookType"
                class="form-input"
                type="text"
                placeholder="e.g. Lined, Grid, Bullet Journal…"
              />
            </div>

            <!-- Image URL -->
            <div class="form-group">
              <label class="form-label" for="f-img">Image URL</label>
              <input
                id="f-img"
                v-model="form.image"
                class="form-input"
                type="text"
                placeholder="https://…"
              />
              <div v-if="form.image" class="img-preview-wrap">
                <img
                  :src="resolveImage(form.category, form.image)"
                  alt="Preview"
                  class="img-preview"
                />
              </div>
            </div>

            <!-- Amazon URL -->
            <div class="form-group">
              <label class="form-label" for="f-amazon">Amazon URL</label>
              <input
                id="f-amazon"
                v-model="form.amazonUrl"
                class="form-input"
                type="text"
                placeholder="https://www.amazon.com/dp/…"
              />
            </div>

            <p v-if="formError" class="form-error">⚠️ {{ formError }}</p>
          </div>

          <div class="modal-footer">
            <button class="btn-cancel" @click="closeModal">Cancel</button>
            <button class="btn-save" @click="saveModal">
              {{ modalMode === "add" ? "Add Product" : "Save Changes" }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ═════════════════════════════════ DELETE CONFIRM MODAL -->
    <Transition name="modal">
      <div
        v-if="deleteTarget"
        class="modal-backdrop"
        @click.self="deleteTarget = null"
      >
        <div class="confirm-card" role="dialog" aria-modal="true">
          <div class="confirm-icon">🗑️</div>
          <h3 class="confirm-title">Delete product?</h3>
          <p class="confirm-body">
            <strong>"{{ deleteTarget.title }}"</strong> will be permanently
            removed. This cannot be undone.
          </p>
          <div class="confirm-actions">
            <button class="btn-cancel" @click="deleteTarget = null">
              Cancel
            </button>
            <button class="btn-delete-confirm" @click="confirmDelete">
              Yes, delete
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ══════════════════════════════════ RESET CONFIRM MODAL -->
    <Transition name="modal">
      <div
        v-if="showReset"
        class="modal-backdrop"
        @click.self="showReset = false"
      >
        <div class="confirm-card" role="dialog" aria-modal="true">
          <div class="confirm-icon">🔄</div>
          <h3 class="confirm-title">Reset to defaults?</h3>
          <p class="confirm-body">
            All custom products and edits will be lost. The original product
            data from the source files will be restored.
          </p>
          <div class="confirm-actions">
            <button class="btn-cancel" @click="showReset = false">
              Cancel
            </button>
            <button class="btn-delete-confirm" @click="confirmReset">
              Yes, reset
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ═══════════════════════════════════════════════ TOAST -->
    <Transition name="toast">
      <div
        v-if="toastVisible"
        class="toast"
        :class="toastType === 'error' ? 'toast--error' : 'toast--success'"
      >
        {{ toastMsg }}
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* ── Utilities ──────────────────────────────────────────────────────────────── */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
}

/* ═══════════════════════════════════════════════════════════ LOGIN SCREEN */
.login-wrap {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a0d10 0%, #2d1520 50%, #3d1a26 100%);
  padding: 24px;
}

.login-card {
  background: #fff;
  border-radius: 24px;
  padding: 48px 40px;
  max-width: 420px;
  width: 100%;
  text-align: center;
  box-shadow: 0 32px 80px rgba(0, 0, 0, 0.4);
}

.login-brand {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 24px;
}

.login-brand__rose {
  font-size: 2rem;
}

.login-brand__name {
  font-family: var(--font-heading);
  font-size: 1.5rem;
  color: var(--dark);
}

.login-brand__name strong {
  color: var(--primrose-deep);
}

.login-title {
  font-family: var(--font-heading);
  font-size: 2rem;
  color: var(--dark);
  margin-bottom: 6px;
}

.login-sub {
  color: var(--mid);
  font-size: 0.95rem;
  margin-bottom: 28px;
}

.login-field {
  position: relative;
  margin-bottom: 14px;
}

.login-input {
  width: 100%;
  padding: 14px 48px 14px 18px;
  border: 1.5px solid #f0d4d8;
  border-radius: var(--radius-md);
  font-size: 1rem;
  font-family: var(--font-body);
  outline: none;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
  background: #fdf8f9;
}

.login-input:focus {
  border-color: var(--primrose);
  box-shadow: 0 0 0 4px rgba(242, 151, 160, 0.18);
}

.login-field.error .login-input {
  border-color: #e05070;
}

.pw-toggle {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.1rem;
  padding: 0;
  line-height: 1;
}

.login-error {
  color: #c94060;
  font-size: 0.85rem;
  margin-bottom: 12px;
}

.login-btn {
  width: 100%;
  padding: 15px;
  background: linear-gradient(135deg, var(--primrose), var(--primrose-deep));
  color: #fff;
  border: none;
  border-radius: var(--radius-md);
  font-size: 1.05rem;
  font-family: var(--font-body);
  font-weight: 700;
  cursor: pointer;
  transition:
    opacity 0.2s,
    transform 0.1s;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 52px;
  margin-bottom: 20px;
}

.login-btn:hover:not(:disabled) {
  opacity: 0.92;
  transform: translateY(-1px);
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  display: inline-block;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.login-hint {
  color: var(--light-text);
  font-size: 0.8rem;
  line-height: 1.6;
}

.login-hint code {
  background: var(--primrose-light);
  color: var(--primrose-deep);
  padding: 1px 6px;
  border-radius: 4px;
  font-size: 0.78rem;
}

/* ═══════════════════════════════════════════════════ ADMIN DASHBOARD */
.admin-wrap {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #faf0f2;
  font-family: var(--font-body);
}

/* ── Header ─────────────────────────────────────────────────────────────── */
.admin-header {
  background: linear-gradient(135deg, #2d1520 0%, #4a1a2e 60%, #5a2035 100%);
  color: #fff;
  padding: 16px 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);
  position: sticky;
  top: 0;
  z-index: 50;
}

.admin-header__left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.admin-header__logo {
  font-family: var(--font-heading);
  font-size: 1.3rem;
  font-weight: 700;
  color: #fde8ec;
  letter-spacing: -0.01em;
}

.admin-header__pill {
  background: rgba(242, 151, 160, 0.25);
  border: 1px solid rgba(242, 151, 160, 0.4);
  color: var(--pinktone);
  padding: 3px 12px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.admin-header__stats {
  display: flex;
  gap: 10px;
  align-items: center;
}

.stat-chip {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 6px 16px;
  min-width: 56px;
}

.stat-chip__num {
  font-size: 1.3rem;
  font-weight: 800;
  color: #fde8ec;
  line-height: 1.1;
}

.stat-chip__label {
  font-size: 0.7rem;
  color: rgba(253, 232, 236, 0.65);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.logout-btn {
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fde8ec;
  padding: 8px 18px;
  border-radius: 999px;
  cursor: pointer;
  font-size: 0.85rem;
  font-family: var(--font-body);
  font-weight: 600;
  transition: background 0.2s;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* ── Toolbar ─────────────────────────────────────────────────────────────── */
.admin-toolbar {
  background: #fff;
  border-bottom: 1px solid #f0d8dc;
  padding: 14px 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: sticky;
  top: 65px;
  z-index: 40;
  box-shadow: 0 2px 12px rgba(242, 151, 160, 0.08);
}

.toolbar-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.toolbar-row--secondary {
  justify-content: space-between;
}

.search-wrap {
  position: relative;
  min-width: 220px;
  flex: 1 1 220px;
  max-width: 320px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  font-size: 0.9rem;
}

.admin-search {
  width: 100%;
  padding: 9px 36px 9px 36px;
  border: 1.5px solid #f0d4d8;
  border-radius: 999px;
  font-size: 0.9rem;
  font-family: var(--font-body);
  outline: none;
  background: #fdf8f9;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}

.admin-search:focus {
  border-color: var(--primrose);
  box-shadow: 0 0 0 3px rgba(242, 151, 160, 0.15);
}

.search-clear {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--mid);
  cursor: pointer;
  font-size: 0.8rem;
  padding: 2px;
  line-height: 1;
}

.cat-tabs {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.cat-tab {
  padding: 7px 16px;
  border-radius: 999px;
  border: 1.5px solid #f0d4d8;
  background: transparent;
  color: var(--mid);
  font-size: 0.82rem;
  font-family: var(--font-body);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.18s;
}

.cat-tab:hover {
  border-color: var(--primrose);
  color: var(--primrose-deep);
  background: var(--primrose-light);
}

.cat-tab.active {
  background: linear-gradient(135deg, var(--primrose), var(--primrose-deep));
  border-color: var(--primrose-deep);
  color: #fff;
  box-shadow: 0 2px 10px rgba(242, 151, 160, 0.3);
}

.btn-add {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 9px 20px;
  background: linear-gradient(135deg, var(--primrose), var(--primrose-deep));
  color: #fff;
  border: none;
  border-radius: 999px;
  font-size: 0.9rem;
  font-family: var(--font-body);
  font-weight: 700;
  cursor: pointer;
  transition:
    transform 0.15s,
    box-shadow 0.15s;
  box-shadow: 0 3px 12px rgba(242, 151, 160, 0.35);
  white-space: nowrap;
}

.btn-add:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(242, 151, 160, 0.45);
}

.btn-add.small {
  padding: 7px 16px;
  font-size: 0.82rem;
}

.btn-add__icon {
  font-size: 1.1rem;
  font-weight: 300;
  line-height: 1;
}

.result-count {
  color: var(--mid);
  font-size: 0.85rem;
}

.secondary-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.btn-secondary {
  padding: 6px 14px;
  border: 1.5px solid #e0c8cc;
  background: #fff;
  color: var(--mid);
  border-radius: 999px;
  font-size: 0.8rem;
  font-family: var(--font-body);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.18s;
}

.btn-secondary:hover {
  border-color: var(--primrose);
  color: var(--primrose-deep);
  background: var(--primrose-light);
}

.btn-danger-soft {
  padding: 6px 14px;
  border: 1.5px solid #f0c8d0;
  background: #fff5f7;
  color: #c04060;
  border-radius: 999px;
  font-size: 0.8rem;
  font-family: var(--font-body);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.18s;
}

.btn-danger-soft:hover {
  background: #ffe0e6;
  border-color: #e07090;
}

/* ── Table ───────────────────────────────────────────────────────────────── */
.table-wrap {
  flex: 1;
  padding: 24px;
  overflow-x: auto;
}

.empty-state {
  background: #fff;
  border-radius: var(--radius-lg);
  padding: 60px 24px;
  text-align: center;
  border: 1.5px dashed #f0d0d8;
  max-width: 500px;
  margin: 0 auto;
}

.empty-state__emoji {
  font-size: 2.5rem;
  margin-bottom: 12px;
}

.empty-state__title {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--dark);
  margin-bottom: 6px;
}

.empty-state__sub {
  color: var(--mid);
  margin-bottom: 20px;
  font-size: 0.9rem;
}

.product-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(242, 151, 160, 0.1);
}

.product-table thead {
  background: linear-gradient(90deg, #fce8ec, #fdf3f5);
  border-bottom: 2px solid #f5d8de;
}

.product-table th {
  padding: 14px 16px;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--primrose-deep);
}

.th-num {
  width: 48px;
}
.th-img {
  width: 80px;
}
.th-title {
  min-width: 220px;
}
.th-cat {
  width: 140px;
}
.th-tag {
  width: 120px;
}
.th-actions {
  width: 140px;
  text-align: right;
}

.product-row {
  border-bottom: 1px solid #fce8ec;
  transition: background 0.15s;
}

.product-row:last-child {
  border-bottom: none;
}

.product-row:hover {
  background: #fff8f9;
}

.product-row--custom {
  background: #fffbec;
}

.product-row--custom:hover {
  background: #fff8e0;
}

.product-table td {
  padding: 12px 16px;
  vertical-align: middle;
}

.td-num {
  color: var(--light-text);
  font-size: 0.8rem;
  font-weight: 700;
}

.td-img {
  padding: 8px 16px;
}

.thumb-wrap {
  width: 54px;
  height: 54px;
  border-radius: 10px;
  overflow: hidden;
  background: var(--primrose-light);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumb-placeholder {
  font-size: 1.4rem;
  opacity: 0.5;
}

.td-title {
  max-width: 300px;
}

.product-title {
  display: block;
  font-size: 0.9rem;
  color: var(--dark);
  margin-bottom: 2px;
}

.product-type {
  display: inline-block;
  font-size: 0.72rem;
  color: var(--mid);
  background: var(--lime-light);
  border-radius: 4px;
  padding: 1px 6px;
  margin-bottom: 4px;
}

.product-desc {
  font-size: 0.78rem;
  color: var(--mid);
  line-height: 1.4;
  margin-bottom: 4px;
}

.amazon-link {
  font-size: 0.75rem;
  color: var(--primrose-deep);
  text-decoration: underline;
  font-weight: 600;
}

.cat-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  white-space: nowrap;
}

.cat-badge--book {
  background: #fde8ec;
  color: #c04060;
  border: 1px solid #f8c8d4;
}

.cat-badge--nb {
  background: var(--lime-light);
  color: var(--lime-dark);
  border: 1px solid #d4d998;
}

.tag-pill {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 0.73rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--primrose-light), #fde8ec);
  color: var(--primrose-deep);
  border: 1px solid var(--pinktone);
  text-transform: capitalize;
}

.tag-none {
  color: var(--light-text);
  font-size: 0.85rem;
}

.td-actions {
  text-align: right;
  white-space: nowrap;
}

.action-btn {
  padding: 6px 12px;
  border-radius: 8px;
  border: 1.5px solid transparent;
  font-size: 0.8rem;
  font-family: var(--font-body);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}

.action-btn--edit {
  background: #fff;
  border-color: #f0d4d8;
  color: var(--mid);
  margin-right: 6px;
}

.action-btn--edit:hover {
  background: var(--primrose-light);
  border-color: var(--primrose);
  color: var(--primrose-deep);
}

.action-btn--delete {
  background: #fff;
  border-color: #f0d4d8;
  color: #c87080;
  padding: 6px 10px;
}

.action-btn--delete:hover {
  background: #ffe0e6;
  border-color: #e07090;
  color: #c04060;
}

/* ═══════════════════════════════════════════════════════════════ MODALS */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(45, 21, 32, 0.55);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  z-index: 200;
}

/* Add/Edit modal */
.modal-card {
  background: #fff;
  border-radius: 24px;
  width: 100%;
  max-width: 560px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 32px 80px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 28px 0;
  position: sticky;
  top: 0;
  background: #fff;
  z-index: 1;
  padding-bottom: 12px;
  border-bottom: 1px solid #fce8ec;
}

.modal-title {
  font-family: var(--font-heading);
  font-size: 1.4rem;
  color: var(--dark);
}

.modal-close {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1.5px solid #f0d4d8;
  background: #fdf8f9;
  color: var(--mid);
  font-size: 0.85rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.15s;
}

.modal-close:hover {
  background: var(--primrose-light);
  color: var(--primrose-deep);
  border-color: var(--primrose);
}

.modal-body {
  padding: 20px 28px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.modal-footer {
  padding: 16px 28px 24px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  position: sticky;
  bottom: 0;
  background: #fff;
  border-top: 1px solid #fce8ec;
  z-index: 1;
}

/* Form elements */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--dark);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.required {
  color: var(--primrose-deep);
}

.form-input {
  width: 100%;
  padding: 11px 14px;
  border: 1.5px solid #f0d4d8;
  border-radius: var(--radius-sm);
  font-size: 0.9rem;
  font-family: var(--font-body);
  outline: none;
  background: #fdf8f9;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}

.form-input:focus {
  border-color: var(--primrose);
  box-shadow: 0 0 0 3px rgba(242, 151, 160, 0.15);
  background: #fff;
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.radio-row {
  display: flex;
  gap: 10px;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: 1.5px solid #f0d4d8;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--mid);
  transition: all 0.18s;
  flex: 1;
  justify-content: center;
  background: #fdf8f9;
}

.radio-label input[type="radio"] {
  display: none;
}

.radio-label.selected,
.radio-label:has(input:checked) {
  border-color: var(--primrose);
  background: var(--primrose-light);
  color: var(--primrose-deep);
}

.tag-presets {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: 4px;
}

.preset-chip {
  padding: 4px 12px;
  border-radius: 999px;
  border: 1.5px solid #f0d4d8;
  background: #fdf8f9;
  color: var(--mid);
  font-size: 0.77rem;
  font-family: var(--font-body);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}

.preset-chip:hover {
  border-color: var(--primrose);
  color: var(--primrose-deep);
  background: var(--primrose-light);
}

.preset-chip.active {
  background: var(--primrose);
  border-color: var(--primrose-deep);
  color: #fff;
}

.img-preview-wrap {
  margin-top: 8px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  max-height: 140px;
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.img-preview {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: var(--radius-sm);
  border: 1.5px solid #f0d4d8;
}

.form-error {
  color: #c04060;
  font-size: 0.85rem;
  background: #fff0f4;
  border: 1px solid #f0c0c8;
  border-radius: var(--radius-sm);
  padding: 8px 12px;
}

/* Modal action buttons */
.btn-cancel {
  padding: 10px 22px;
  border: 1.5px solid #e0c8cc;
  background: #fff;
  color: var(--mid);
  border-radius: 999px;
  font-size: 0.88rem;
  font-family: var(--font-body);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-cancel:hover {
  border-color: var(--primrose);
  color: var(--primrose-deep);
  background: var(--primrose-light);
}

.btn-save {
  padding: 10px 24px;
  background: linear-gradient(135deg, var(--primrose), var(--primrose-deep));
  color: #fff;
  border: none;
  border-radius: 999px;
  font-size: 0.88rem;
  font-family: var(--font-body);
  font-weight: 700;
  cursor: pointer;
  transition:
    transform 0.15s,
    box-shadow 0.15s;
  box-shadow: 0 3px 12px rgba(242, 151, 160, 0.35);
}

.btn-save:hover {
  transform: translateY(-1px);
  box-shadow: 0 5px 16px rgba(242, 151, 160, 0.45);
}

/* Confirm modal */
.confirm-card {
  background: #fff;
  border-radius: 20px;
  padding: 36px 32px;
  max-width: 380px;
  width: 100%;
  text-align: center;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.25);
}

.confirm-icon {
  font-size: 2.8rem;
  margin-bottom: 12px;
}

.confirm-title {
  font-family: var(--font-heading);
  font-size: 1.4rem;
  color: var(--dark);
  margin-bottom: 10px;
}

.confirm-body {
  color: var(--mid);
  font-size: 0.9rem;
  line-height: 1.6;
  margin-bottom: 24px;
}

.confirm-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.btn-delete-confirm {
  padding: 10px 24px;
  background: linear-gradient(135deg, #e05070, #c03050);
  color: #fff;
  border: none;
  border-radius: 999px;
  font-size: 0.88rem;
  font-family: var(--font-body);
  font-weight: 700;
  cursor: pointer;
  transition:
    transform 0.15s,
    box-shadow 0.15s;
  box-shadow: 0 3px 12px rgba(192, 48, 80, 0.3);
}

.btn-delete-confirm:hover {
  transform: translateY(-1px);
  box-shadow: 0 5px 16px rgba(192, 48, 80, 0.4);
}

/* ── Toast ────────────────────────────────────────────────────────────────── */
.toast {
  position: fixed;
  bottom: 28px;
  right: 28px;
  padding: 14px 22px;
  border-radius: 14px;
  font-size: 0.9rem;
  font-weight: 600;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
  z-index: 999;
  display: flex;
  align-items: center;
  gap: 8px;
}

.toast--success {
  background: linear-gradient(135deg, #2d1520, #4a1a2e);
  color: #fde8ec;
  border: 1px solid rgba(242, 151, 160, 0.3);
}

.toast--error {
  background: linear-gradient(135deg, #3d0010, #600020);
  color: #ffd0d8;
  border: 1px solid rgba(224, 80, 112, 0.3);
}

/* ── Transitions ──────────────────────────────────────────────────────────── */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.22s ease;
}

.modal-enter-active .modal-card,
.modal-enter-active .confirm-card,
.modal-leave-active .modal-card,
.modal-leave-active .confirm-card {
  transition: transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-card,
.modal-enter-from .confirm-card {
  transform: scale(0.92) translateY(16px);
}

.modal-leave-to .modal-card,
.modal-leave-to .confirm-card {
  transform: scale(0.94) translateY(8px);
}

.toast-enter-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.toast-leave-active {
  transition: all 0.25s ease;
}

.toast-enter-from {
  transform: translateX(80px);
  opacity: 0;
}

.toast-leave-to {
  transform: translateX(40px);
  opacity: 0;
}

/* ── Responsive ───────────────────────────────────────────────────────────── */
@media (max-width: 768px) {
  .admin-header {
    padding: 12px 16px;
  }

  .admin-header__stats {
    display: none;
  }

  .admin-toolbar {
    padding: 12px 16px;
  }

  .toolbar-row {
    flex-direction: column;
    align-items: stretch;
  }

  .toolbar-row--secondary {
    flex-direction: column;
    gap: 8px;
  }

  .search-wrap {
    max-width: 100%;
  }

  .secondary-actions {
    justify-content: flex-end;
  }

  .table-wrap {
    padding: 12px;
  }

  .modal-card {
    max-height: 95vh;
  }

  .modal-body {
    padding: 16px 20px;
  }

  .modal-footer {
    padding: 12px 20px 20px;
  }
}

@media (max-width: 520px) {
  .login-card {
    padding: 36px 24px;
  }

  .admin-header__logo {
    font-size: 1.1rem;
  }

  .radio-row {
    flex-direction: column;
  }
}
</style>
