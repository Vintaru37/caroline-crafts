<script setup lang="ts">
import { ref } from "vue";

type CatFilter = "all" | "coloring-book" | "notebook";

const props = defineProps<{
  stats: { total: number; books: number; notebooks: number };
  catFilter: CatFilter;
  searchQ: string;
  filteredCount: number;
  isDraggable: boolean;
}>();

const emit = defineEmits<{
  "update:catFilter": [val: CatFilter];
  "update:searchQ": [val: string];
  add: [];
  export: [];
  importFile: [file: File];
}>();

const fileInput = ref<HTMLInputElement | null>(null);

function triggerImport() {
  fileInput.value?.click();
}

function handleFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  emit("importFile", file);
  if (fileInput.value) fileInput.value.value = "";
}
</script>

<template>
  <div class="admin-toolbar">
    <div class="toolbar-row">
      <!-- Search -->
      <div class="search-wrap">
        <span class="search-icon">🔍</span>
        <input
          :value="searchQ"
          @input="
            emit('update:searchQ', ($event.target as HTMLInputElement).value)
          "
          class="admin-search"
          type="text"
          placeholder="Search products…"
          aria-label="Search products"
        />
        <button
          v-if="searchQ"
          class="search-clear"
          type="button"
          aria-label="Clear search"
          @click="emit('update:searchQ', '')"
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
          @click="emit('update:catFilter', 'all')"
        >
          All ({{ stats.total }})
        </button>
        <button
          class="cat-tab"
          :class="{ active: catFilter === 'coloring-book' }"
          role="tab"
          @click="emit('update:catFilter', 'coloring-book')"
        >
          🎨 Books ({{ stats.books }})
        </button>
        <button
          class="cat-tab"
          :class="{ active: catFilter === 'notebook' }"
          role="tab"
          @click="emit('update:catFilter', 'notebook')"
        >
          📓 Notebooks ({{ stats.notebooks }})
        </button>
      </div>

      <!-- Primary action -->
      <button class="btn-add" @click="emit('add')">
        <span class="btn-add__icon">+</span> Add Product
      </button>
    </div>

    <div class="toolbar-row toolbar-row--secondary">
      <span class="result-count">
        Showing <strong>{{ filteredCount }}</strong> product{{
          filteredCount !== 1 ? "s" : ""
        }}
        <span v-if="isDraggable" class="drag-hint">· Drag to reorder</span>
        <span v-else class="drag-hint drag-hint--off"
          >· Clear search to enable reordering</span
        >
      </span>
      <div class="secondary-actions">
        <button
          class="btn-secondary"
          title="Export products as JSON"
          @click="emit('export')"
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
  </div>
</template>

<style scoped>
.admin-toolbar {
  background: #fff;
  border-bottom: 1px solid #f0dde0;
  padding: 14px 28px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.toolbar-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.toolbar-row--secondary {
  font-size: 0.85rem;
  color: var(--mid);
}

/* Search */
.search-wrap {
  position: relative;
  flex: 1;
  min-width: 180px;
  max-width: 320px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.9rem;
  pointer-events: none;
}

.admin-search {
  width: 100%;
  padding: 9px 36px 9px 36px;
  border: 1.5px solid #f0d4d8;
  border-radius: var(--radius-md, 12px);
  font-size: 0.9rem;
  font-family: var(--font-body);
  outline: none;
  transition: border-color 0.2s;
  background: #fdf8f9;
}

.admin-search:focus {
  border-color: var(--primrose);
}

.search-clear {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.8rem;
  color: var(--mid);
  padding: 0 4px;
}

/* Category tabs */
.cat-tabs {
  display: flex;
  gap: 4px;
}

.cat-tab {
  padding: 8px 16px;
  border: 1.5px solid #f0d4d8;
  border-radius: 20px;
  background: #fdf8f9;
  font-size: 0.85rem;
  font-family: var(--font-body);
  color: var(--mid);
  cursor: pointer;
  transition:
    background 0.15s,
    color 0.15s,
    border-color 0.15s;
  white-space: nowrap;
}

.cat-tab:hover {
  border-color: var(--primrose);
  color: var(--dark);
}

.cat-tab.active {
  background: var(--primrose);
  border-color: var(--primrose);
  color: #fff;
  font-weight: 700;
}

/* Add button */
.btn-add {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 9px 20px;
  background: linear-gradient(135deg, var(--primrose), var(--primrose-deep));
  color: #fff;
  border: none;
  border-radius: var(--radius-md, 12px);
  font-size: 0.9rem;
  font-family: var(--font-body);
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  transition:
    opacity 0.2s,
    transform 0.1s;
  margin-left: auto;
}

.btn-add:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.btn-add__icon {
  font-size: 1.2rem;
  line-height: 1;
}

/* Secondary row */
.result-count {
  flex: 1;
}

.drag-hint {
  color: var(--primrose-deep);
  font-style: italic;
}

.drag-hint--off {
  color: var(--mid);
  opacity: 0.7;
}

.secondary-actions {
  display: flex;
  gap: 8px;
}

.btn-secondary {
  padding: 7px 14px;
  border: 1.5px solid #e8d0d4;
  border-radius: var(--radius-sm, 8px);
  background: #fdf8f9;
  font-size: 0.82rem;
  font-family: var(--font-body);
  color: var(--mid);
  cursor: pointer;
  transition:
    background 0.15s,
    border-color 0.15s;
}

.btn-secondary:hover {
  background: #f9ecee;
  border-color: var(--primrose);
  color: var(--dark);
}

@media (max-width: 640px) {
  .admin-toolbar {
    padding: 12px 16px;
  }
  .search-wrap {
    max-width: 100%;
  }
  .btn-add {
    margin-left: 0;
  }
}
</style>
