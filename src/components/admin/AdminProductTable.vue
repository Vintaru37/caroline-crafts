<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, computed } from "vue";
import draggable from "vuedraggable";
import { resolveImage } from "../../composables/useProducts";
import type { AdminProduct } from "../../composables/useProducts";

const props = defineProps<{
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

// ── Draggable list ────────────────────────────────────────────────────────────
// Spread in the getter so Vue diffs by value, not reference.
const draggableList = ref<AdminProduct[]>([]);
const hasUnsavedOrder = ref(false);
const originalFilteredIds = ref<string[]>([]);
const showScrollTop = ref(false);
const showPositionPopup = ref(false);
const popupTargetId = ref<string | null>(null);
const popupInput = ref<string>("");
const popupError = ref<string | null>(null);

const orderBarVisible = computed(
  () => props.isDraggable && (hasUnsavedOrder.value || props.isSavingOrder),
);

function onScroll() {
  showScrollTop.value = typeof window !== "undefined" && window.scrollY > 200;
}

function scrollToTop() {
  if (typeof window !== "undefined") {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

watch(
  () => [...props.filteredProducts],
  (val) => {
    draggableList.value = val;
    // capture the baseline order for visible items so we can detect
    // whether a later drag actually changed the order
    originalFilteredIds.value = val.map((p) => p.id);
    hasUnsavedOrder.value = false; // reset when filter/search changes
  },
  { immediate: true },
);

// When parent finishes saving (true → false), clear the unsaved flag
watch(
  () => props.isSavingOrder,
  (newVal, oldVal) => {
    if (oldVal === true && newVal === false) {
      hasUnsavedOrder.value = false;
    }
  },
);

onMounted(() => {
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", onScroll);
});

function onDragEnd() {
  // Determine whether the visible list order actually changed.
  const current = draggableList.value.map((p) => p.id);
  const original = originalFilteredIds.value;
  if (current.length !== original.length) {
    hasUnsavedOrder.value = true;
    return;
  }
  let changed = false;
  for (let i = 0; i < current.length; i++) {
    if (current[i] !== original[i]) {
      changed = true;
      break;
    }
  }
  hasUnsavedOrder.value = changed;
}

function saveOrder() {
  emit(
    "reorder",
    draggableList.value.map((p) => p.id),
  );
}

function moveItemToIndex(id: string, newIndex: number) {
  const arr = draggableList.value;
  const from = arr.findIndex((p) => p.id === id);
  if (from === -1) return;
  // clamp newIndex
  const to = Math.max(0, Math.min(newIndex, arr.length - 1));
  if (from === to) return;
  const [item] = arr.splice(from, 1);
  if (!item) return;
  arr.splice(to, 0, item);
  hasUnsavedOrder.value = true;
}

function moveToTop(id: string) {
  moveItemToIndex(id, 0);
}

function moveToBottom(id: string) {
  moveItemToIndex(id, draggableList.value.length - 1);
}

function moveToPositionPrompt(id: string) {
  // open custom popup instead of browser prompt
  popupTargetId.value = id;
  // default to current position
  const idx = draggableList.value.findIndex((p) => p.id === id);
  popupInput.value = (idx >= 0 ? idx + 1 : 1).toString();
  popupError.value = null;
  showPositionPopup.value = true;
}

function confirmPopupMove() {
  if (!popupTargetId.value) return;
  const pos = parseInt(popupInput.value, 10);
  if (Number.isNaN(pos) || pos < 1 || pos > draggableList.value.length) {
    popupError.value = `Enter a number between 1 and ${draggableList.value.length}`;
    return;
  }
  moveItemToIndex(
    popupTargetId.value,
    Math.max(0, Math.min(pos - 1, draggableList.value.length - 1)),
  );
  showPositionPopup.value = false;
  popupTargetId.value = null;
}

function cancelPopup() {
  showPositionPopup.value = false;
  popupTargetId.value = null;
  popupError.value = null;
}

function cancelOrder() {
  // revert staged order to the original visible order
  draggableList.value = [...props.filteredProducts];
  hasUnsavedOrder.value = false;
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

    <!-- Save Order bar -->
    <div
      v-if="isDraggable && (hasUnsavedOrder || isSavingOrder)"
      class="order-bar"
    >
      <span class="order-bar__hint"
        >Drag to reorder, then save when ready.</span
      >
      <button class="btn-cancel-order" @click="cancelOrder">Cancel</button>
      <button
        class="btn-save-order"
        :disabled="isSavingOrder || !hasUnsavedOrder"
        @click="saveOrder"
      >
        <span v-if="isSavingOrder" class="spinner spinner--sm"></span>
        <span v-else>
          <svg class="icon-svg" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M6 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"
              fill="currentColor"
            />
          </svg>
          Save Order
        </span>
      </button>
    </div>

    <!-- Empty state -->
    <div v-if="!isLoading && filteredProducts.length === 0" class="empty-state">
      <span class="empty-state__icon">🎨</span>
      <p class="empty-state__text">No products found.</p>
    </div>

    <table v-if="!isLoading" class="product-table">
      <thead>
        <tr>
          <th v-if="isDraggable" class="th-drag"></th>
          <th class="th-img"></th>
          <th>Title</th>
          <th class="th-desc">Description</th>
          <th>Category</th>
          <th>Tag</th>
          <th>Amazon URL</th>
          <th class="th-actions">Actions</th>
        </tr>
      </thead>

      <!-- Draggable tbody (any category tab, no search) -->
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
            <td class="td-desc">
              <span class="product-desc">{{ p.desc }}</span>
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
              <div class="move-controls" v-if="isDraggable">
                <button
                  class="move-btn"
                  title="Move to top"
                  @click="moveToTop(p.id)"
                >
                  <svg class="icon-svg" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 4l-8 8h5v8h6v-8h5z" fill="currentColor" />
                  </svg>
                </button>
                <button
                  class="move-btn"
                  title="Move to position"
                  @click="moveToPositionPrompt(p.id)"
                >
                  <svg class="icon-svg" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M7 10l5-5 5 5H7zm0 4h10l-5 5-5-5z"
                      fill="currentColor"
                    />
                  </svg>
                </button>
                <button
                  class="move-btn"
                  title="Move to bottom"
                  @click="moveToBottom(p.id)"
                >
                  <svg class="icon-svg" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 20l8-8h-5V4h-6v8H4z" fill="currentColor" />
                  </svg>
                </button>
                <button
                  class="action-btn action-btn--edit"
                  @click="emit('edit', p)"
                >
                  <svg class="icon-svg" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
                      fill="currentColor"
                    />
                  </svg>
                </button>
                <button
                  class="action-btn action-btn--delete"
                  @click="emit('delete', p)"
                >
                  <svg class="icon-svg" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
                      fill="currentColor"
                    />
                  </svg>
                </button>
              </div>
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
          <td class="td-desc">
            <span class="product-desc">{{ p.desc }}</span>
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
              <svg class="icon-svg" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
                  fill="currentColor"
                />
              </svg>
            </button>
            <button
              class="action-btn action-btn--delete"
              @click="emit('delete', p)"
            >
              <svg class="icon-svg" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- Position popup -->
    <div
      v-if="showPositionPopup"
      :class="[
        'pos-popup',
        orderBarVisible ? 'pos-popup--above' : 'pos-popup--base',
      ]"
    >
      <label class="pos-popup__label"
        >Move item to position (1‑{{ draggableList.length }})</label
      >
      <input
        v-model="popupInput"
        class="pos-popup__input"
        type="number"
        min="1"
        :max="draggableList.length"
      />
      <div class="pos-popup__actions">
        <button class="btn-cancel-order" @click="cancelPopup">Cancel</button>
        <button class="btn-save-order" @click="confirmPopupMove">
          Move Product
        </button>
      </div>
      <div v-if="popupError" class="pos-popup__error">{{ popupError }}</div>
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

/* Save Order bar */
.order-bar {
  position: fixed;
  left: 50%;
  bottom: 18px;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 12px;
  background: #fff;
  border: 2px solid var(--primrose);
  border-radius: 12px;
  padding: 10px 18px;
  z-index: 900;
  box-shadow: 0 12px 40px rgba(57, 22, 28, 0.18);
  width: calc(100% - 56px);
  max-width: 650px;
}

.order-bar__hint {
  font-size: 0.83rem;
  color: var(--primrose-deep);
  font-style: italic;
}

.btn-save-order {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 20px;
  background: linear-gradient(135deg, var(--primrose), var(--primrose-deep));
  color: #fff;
  border: none;
  border-radius: var(--radius-sm, 8px);
  font-size: 0.85rem;
  font-family: var(--font-body);
  font-weight: 700;
  cursor: pointer;
  min-width: 150px;
  min-height: 36px;
  transition: opacity 0.2s;
  white-space: nowrap;

  & span {
    display: flex;
    align-items: center;
    gap: 6px;
  }
}

.btn-save-order:hover:not(:disabled) {
  opacity: 0.88;
}
.btn-cancel-order {
  background: transparent;
  border: 1px solid #c84a6b;
  color: #c84a6b;
  padding: 8px 14px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 700;
  margin-left: auto;
}
.btn-cancel-order:hover {
  background: rgba(200, 74, 107, 0.04);
}
.btn-save-order:disabled {
  opacity: 0.55;
  cursor: not-allowed;
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
  padding: 10px 6px;
  vertical-align: middle;
  color: var(--dark);
}

/* Drag */
.td-drag {
  text-align: center;
  padding: 0 !important;
}
.drag-handle {
  cursor: grab;
  font-size: 1.1rem;
  color: #c8a0a8;
  user-select: none;
  display: inline-block;
  padding: 16px;
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

.td-desc {
  max-width: 400px;
  padding-inline: 24px !important;
}
.product-desc {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  color: var(--mid);
  font-size: 0.85rem;
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
  text-transform: capitalize;
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
  padding: 6px;
  border-radius: var(--radius-sm, 8px);
  font-size: 0.78rem;
  font-family: var(--font-body);
  cursor: pointer;
  border: 1.5px solid transparent;
  transition:
    background 0.15s,
    border-color 0.15s;

 & .icon-svg {
    margin-bottom: 20px;
 }
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

/* Move controls */
.move-controls {
  display: inline-flex;
  gap: 4px;
  vertical-align: middle;
}
.move-btn {
  background: #fff;
  border: 1px solid #f0d4d8;
  color: var(--primrose-deep);
  padding: 6px 8px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.82rem;
}
.move-btn:hover {
  background: #fff7f8;
}

/* Icon styling */
.icon-svg {
  width: 18px;
  height: 18px;
  display: block;
  margin: 0;
  fill: currentColor;
}
.td-actions .action-btn,
.td-actions .move-btn {
  width: 44px;
  height: 36px;
  min-width: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  padding: 0;
  line-height: 0;
}
.btn-save-order .icon-svg {
  margin-right: 8px;
}
.move-btn .icon-svg {
  width: 19px;
  height: 19px;
}
.td-actions .action-btn .icon-svg,
.td-actions .move-btn .icon-svg {
  display: block;
  margin: 0 auto;
}
.action-btn--edit .icon-svg,
.action-btn--delete .icon-svg {
  transform: translateY(-1px);
}

.scroll-top {
  position: fixed;
  right: 16px;
  bottom: 16px;
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

@media (max-width: 900px) {
  .scroll-top {
    left: 50%;
    bottom: 96px;
    width: 120px;
    transform: translateX(-50%);
  }
}

.pos-popup {
  position: fixed;
  left: 50%;
  bottom: 18px;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 12px;
  background: #fff;
  border: 2px solid var(--primrose);
  border-radius: 12px;
  padding: 10px 18px;
  z-index: 1250;
  box-shadow: 0 12px 40px rgba(57, 22, 28, 0.18);
  width: calc(100% - 56px);
  max-width: 650px;
}
.pos-popup--base {
  bottom: 18px;
}
.pos-popup--above {
  bottom: 84px;
}
.pos-popup__label {
  font-size: 0.9rem;
  color: var(--primrose-deep);
  font-style: italic;
  min-width: 180px;
}
.pos-popup__input {
  width: 80px;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #f0d4d8;
}
.pos-popup__actions {
  margin-left: auto;
  display: flex;
  gap: 8px;
}
.pos-popup__error {
  color: #c04060;
  font-size: 0.82rem;
  margin-top: 8px;
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

@media (max-width: 1024px) {
  /* Hide description column on narrow screens */
  .th-desc,
  .td-desc {
    display: none;
  }
}
</style>
