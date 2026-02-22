<script setup lang="ts">
import { ref, watch } from "vue";
import draggable from "vuedraggable";
import { resolveImage } from "../../composables/useProducts";
import type { AdminProduct } from "../../composables/useProducts";

const props = defineProps<{
  allProducts: AdminProduct[];
  filteredProducts: AdminProduct[];
  isDraggable: boolean;
  isLoading: boolean;
  loadError: string | null;
  isSavingOrder: boolean;
}>();

const emit = defineEmits<{
  edit: [product: AdminProduct];
  delete: [product: AdminProduct];
  reorder: [ids: string[]];
  reload: [];
}>();

// ── Draggable list ──────────────────────────────────────────────────────────
// FIX: spread the array in the getter so Vue compares element-by-element.
// Without the spread, the getter always returns the same reactive array
// reference — Vue sees no change and the watcher only fires once (empty).
const draggableList = ref<AdminProduct[]>([]);
watch(
  () => [...props.allProducts],
  (val) => {
    draggableList.value = val;
  },
  { immediate: true },
);

function onDragEnd() {
  emit(
    "reorder",
    draggableList.value.map((p) => p.id),
  );
}

function categoryLabel(cat: string) {
  return cat === "coloring-book" ? "Book" : "Notebook";
}
</script>

<template>
  <div class="table-wrap">
    <!-- Loading overlay -->
    <div v-if="isLoading" class="table-loading">
      <span class="spinner"></span>
      <span>Loading products…</span>
    </div>

    <!-- DB warning banner -->
    <div v-if="loadError && !isLoading" class="db-warning">
      <span class="db-warning__icon">⚠️</span>
      <span class="db-warning__text">
        <strong>Database unavailable.</strong> Showing local fallback data.
        Changes cannot be saved.
        <button class="db-warning__retry" @click="emit('reload')">Retry</button>
      </span>
    </div>

    <!-- Saving order indicator -->
    <div v-if="isSavingOrder" class="order-saving">
      <span class="spinner spinner--sm"></span> Saving order…
    </div>

    <!-- Empty state -->
    <div
      v-if="
        !isLoading &&
        (isDraggable ? draggableList : filteredProducts).length === 0
      "
      class="empty-state"
    >
      <span class="empty-state__icon">🎨</span>
      <p class="empty-state__text">No products found.</p>
    </div>

    <table v-if="!isLoading" class="product-table">
      <thead>
        <tr>
          <th v-if="isDraggable" class="th-drag"></th>
          <th class="th-img"></th>
          <th>Title</th>
          <th>Category</th>
          <th>Tag</th>
          <th>Amazon URL</th>
          <th class="th-actions">Actions</th>
        </tr>
      </thead>

      <!-- Draggable tbody (All tab, no search) -->
      <draggable
        v-if="isDraggable"
        v-model="draggableList"
        tag="tbody"
        item-key="id"
        handle=".drag-handle"
        @end="onDragEnd"
        ghost-class="dragging-ghost"
        chosen-class="dragging-chosen"
      >
        <template #item="{ element: p }">
          <tr class="product-row">
            <td class="td-drag">
              <span class="drag-handle" title="Drag to reorder">⠿</span>
            </td>
            <td class="td-img">
              <img
                :src="resolveImage(p.category, p.image)"
                :alt="p.title"
                class="product-thumb"
                loading="lazy"
              />
            </td>
            <td>
              <span class="product-title">{{ p.title }}</span>
            </td>
            <td>
              <span class="cat-badge" :class="`cat-badge--${p.category}`">
                {{ categoryLabel(p.category) }}
              </span>
            </td>
            <td>
              <span v-if="p.tag" class="tag-pill">{{ p.tag }}</span>
              <span v-else class="no-tag">—</span>
            </td>
            <td class="td-url">
              <a
                v-if="p.amazonUrl"
                :href="p.amazonUrl"
                target="_blank"
                rel="noopener"
                class="amazon-link"
                >View ↗</a
              >
              <span v-else class="no-tag">—</span>
            </td>
            <td class="td-actions">
              <button
                class="action-btn action-btn--edit"
                @click="emit('edit', p)"
              >
                ✏️ Edit
              </button>
              <button
                class="action-btn action-btn--delete"
                @click="emit('delete', p)"
              >
                🗑️ Delete
              </button>
            </td>
          </tr>
        </template>
      </draggable>

      <!-- Static tbody (filtered / searched) -->
      <tbody v-else>
        <tr v-for="p in filteredProducts" :key="p.id" class="product-row">
          <td class="td-img">
            <img
              :src="resolveImage(p.category, p.image)"
              :alt="p.title"
              class="product-thumb"
              loading="lazy"
            />
          </td>
          <td>
            <span class="product-title">{{ p.title }}</span>
          </td>
          <td>
            <span class="cat-badge" :class="`cat-badge--${p.category}`">
              {{ categoryLabel(p.category) }}
            </span>
          </td>
          <td>
            <span v-if="p.tag" class="tag-pill">{{ p.tag }}</span>
            <span v-else class="no-tag">—</span>
          </td>
          <td class="td-url">
            <a
              v-if="p.amazonUrl"
              :href="p.amazonUrl"
              target="_blank"
              rel="noopener"
              class="amazon-link"
              >View ↗</a
            >
            <span v-else class="no-tag">—</span>
          </td>
          <td class="td-actions">
            <button
              class="action-btn action-btn--edit"
              @click="emit('edit', p)"
            >
              ✏️ Edit
            </button>
            <button
              class="action-btn action-btn--delete"
              @click="emit('delete', p)"
            >
              🗑️ Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.table-wrap {
  flex: 1;
  overflow-x: auto;
  padding: 24px 28px;
  position: relative;
}

/* Loading */
.table-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 60px 0;
  color: var(--mid);
  font-size: 1rem;
}

.spinner {
  width: 24px;
  height: 24px;
  border: 3px solid rgba(242, 151, 160, 0.3);
  border-top-color: var(--primrose);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  display: inline-block;
  flex-shrink: 0;
}

.spinner--sm {
  width: 14px;
  height: 14px;
  border-width: 2px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* DB Warning */
.db-warning {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fff8e1;
  border: 1.5px solid #ffe082;
  border-radius: 10px;
  padding: 12px 16px;
  margin-bottom: 16px;
  font-size: 0.88rem;
  color: #7a5800;
}

.db-warning__icon {
  font-size: 1.1rem;
  flex-shrink: 0;
}
.db-warning__text {
  flex: 1;
}
.db-warning__retry {
  background: none;
  border: 1px solid #f0b800;
  color: #7a5800;
  border-radius: 6px;
  padding: 3px 10px;
  font-size: 0.82rem;
  cursor: pointer;
  margin-left: 8px;
}
.db-warning__retry:hover {
  background: #fff3cd;
}

/* Order saving indicator */
.order-saving {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(242, 151, 160, 0.12);
  border: 1px solid rgba(242, 151, 160, 0.3);
  color: var(--primrose-deep);
  border-radius: 8px;
  padding: 6px 12px;
  font-size: 0.82rem;
  margin-bottom: 12px;
}

/* Empty state */
.empty-state {
  text-align: center;
  padding: 60px 0;
}
.empty-state__icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 12px;
}
.empty-state__text {
  color: var(--mid);
  font-size: 1rem;
}

/* Table */
.product-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.88rem;
}

.product-table thead tr {
  background: #fdf2f4;
}

.product-table th {
  padding: 12px 14px;
  text-align: left;
  font-weight: 700;
  color: var(--mid);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  border-bottom: 2px solid #f0d4d8;
  white-space: nowrap;
}

.th-drag {
  width: 32px;
}
.th-img {
  width: 60px;
}
.th-actions {
  width: 160px;
}

/* Row */
.product-row {
  border-bottom: 1px solid #f7eaec;
  transition: background 0.15s;
}

.product-row:hover {
  background: #fdf8f9;
}

.product-table td {
  padding: 10px 14px;
  vertical-align: middle;
  color: var(--dark);
}

/* Drag */
.td-drag {
  width: 32px;
  text-align: center;
}
.drag-handle {
  cursor: grab;
  font-size: 1.1rem;
  color: #c8a0a8;
  user-select: none;
  display: inline-block;
  padding: 4px;
  transition: color 0.15s;
}
.drag-handle:hover {
  color: var(--primrose-deep);
}
.drag-handle:active {
  cursor: grabbing;
}

/* Dragging states */
:deep(.dragging-ghost) {
  opacity: 0.4;
  background: #fce4e8;
}
:deep(.dragging-chosen) {
  background: #fff0f2;
  box-shadow: 0 4px 16px rgba(242, 151, 160, 0.3);
}

/* Image */
.td-img {
  width: 60px;
}
.product-thumb {
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #f0d4d8;
  background: #fdf8f9;
}

/* Title */
.product-title {
  font-weight: 600;
  color: var(--dark);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Category badge */
.cat-badge {
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 0.72rem;
  font-weight: 700;
  white-space: nowrap;
}
.cat-badge--coloring-book {
  background: rgba(242, 151, 160, 0.18);
  color: var(--primrose-deep);
}
.cat-badge--notebook {
  background: rgba(130, 190, 130, 0.18);
  color: #3a7a3a;
}

/* Tag pill */
.tag-pill {
  background: rgba(242, 151, 160, 0.14);
  border: 1px solid rgba(242, 151, 160, 0.35);
  color: var(--primrose-deep);
  padding: 2px 10px;
  border-radius: 10px;
  font-size: 0.75rem;
  white-space: nowrap;
}
.no-tag {
  color: #ccc;
}

/* Amazon link */
.amazon-link {
  color: var(--primrose-deep);
  font-size: 0.82rem;
  text-decoration: none;
}
.amazon-link:hover {
  text-decoration: underline;
}

/* Actions */
.td-actions {
  width: 160px;
}
.td-actions,
.td-url {
  white-space: nowrap;
}

.action-btn {
  padding: 5px 12px;
  border-radius: var(--radius-sm, 8px);
  font-size: 0.78rem;
  font-family: var(--font-body);
  cursor: pointer;
  border: 1.5px solid transparent;
  transition:
    background 0.15s,
    border-color 0.15s;
  margin-right: 4px;
}
.action-btn--edit {
  background: #f8f4ff;
  border-color: #e0d0f8;
  color: #6040c0;
}
.action-btn--edit:hover {
  background: #ede4ff;
}
.action-btn--delete {
  background: #fff4f6;
  border-color: #ffd0d8;
  color: #c04060;
}
.action-btn--delete:hover {
  background: #ffe4e8;
}

@media (max-width: 768px) {
  .table-wrap {
    padding: 16px;
  }
  .product-table {
    display: block;
    overflow-x: auto;
  }
}
</style>
