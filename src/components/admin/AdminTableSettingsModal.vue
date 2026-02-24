<script setup lang="ts">
import { ref, watch } from "vue";
import type {
  ActionSettings,
  ColumnSettings,
  TableSettings,
} from "./tableSettings";
import { defaultTableSettings } from "./tableSettings";

// ── Component ──────────────────────────────────────────────────────────────────

const props = defineProps<{
  show: boolean;
  settings: TableSettings;
}>();

const emit = defineEmits<{
  close: [];
  "update:settings": [val: TableSettings];
}>();

// Work on a deep copy so Cancel discards changes
const local = ref<TableSettings>(JSON.parse(JSON.stringify(props.settings)));

watch(
  () => props.show,
  (v) => {
    if (v) local.value = JSON.parse(JSON.stringify(props.settings));
  },
);

function apply() {
  emit("update:settings", JSON.parse(JSON.stringify(local.value)));
  emit("close");
}

function cancel() {
  emit("close");
}

function resetDefaults() {
  local.value = defaultTableSettings();
}

const COLUMN_LABELS: Record<keyof ColumnSettings, string> = {
  image: "Image",
  title: "Title",
  desc: "Description",
  category: "Category",
  tag: "Tag",
  type: "Type",
  amazonUrl: "Amazon URL",
  isVisible: "Visible",
};

const ACTION_LABELS: Record<keyof ActionSettings, string> = {
  edit: "Edit button",
  delete: "Delete button",
  moveTop: "Move to top",
  movePosition: "Move to position",
  moveBottom: "Move to bottom",
};
</script>

<template>
  <Teleport to="body">
    <div v-if="show" class="ts-backdrop" @click.self="cancel">
      <div
        class="ts-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ts-title"
      >
        <!-- Header -->
        <div class="ts-header">
          <span class="ts-title" id="ts-title">
            <svg class="ts-cog-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M19.14 12.94c.04-.3.06-.61.06-.94s-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.49.49 0 0 0-.59-.22l-2.39.96a7.04 7.04 0 0 0-1.62-.94l-.36-2.54A.484.484 0 0 0 14 2h-4c-.25 0-.46.18-.49.42l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.48.48 0 0 0-.59.22L2.74 8.87a.47.47 0 0 0 .12.61l2.03 1.58c-.05.3-.08.63-.08.94s.03.64.08.94l-2.03 1.58a.47.47 0 0 0-.12.61l1.92 3.32c.12.22.37.3.59.22l2.39-.96c.5.37 1.03.7 1.62.94l.36 2.54c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.36-2.54c.59-.24 1.13-.57 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32a.47.47 0 0 0-.12-.61l-2.03-1.58zM12 15.6A3.6 3.6 0 1 1 12 8.4a3.6 3.6 0 0 1 0 7.2z"
                fill="currentColor"
              />
            </svg>
            Table Settings
          </span>
          <button class="ts-close" @click="cancel" aria-label="Close settings">
            ✕
          </button>
        </div>

        <div class="ts-body">
          <!-- Coloring Books columns -->
          <section class="ts-section">
            <h3 class="ts-section-title">
              <span class="ts-section-icon">🎨</span> Coloring Book Columns
            </h3>
            <div class="ts-checks">
              <label
                v-for="(label, key) in COLUMN_LABELS"
                :key="key"
                class="ts-check"
              >
                <input
                  type="checkbox"
                  v-model="local.coloringBook[key]"
                  class="ts-checkbox"
                />
                <span class="ts-check-label">{{ label }}</span>
              </label>
            </div>
          </section>

          <div class="ts-divider" />

          <!-- Notebook columns -->
          <section class="ts-section">
            <h3 class="ts-section-title">
              <span class="ts-section-icon">📓</span> Notebook Columns
            </h3>
            <div class="ts-checks">
              <label
                v-for="(label, key) in COLUMN_LABELS"
                :key="key"
                class="ts-check"
              >
                <input
                  type="checkbox"
                  v-model="local.notebook[key]"
                  class="ts-checkbox"
                />
                <span class="ts-check-label">{{ label }}</span>
              </label>
            </div>
          </section>

          <div class="ts-divider" />

          <!-- Action buttons -->
          <section class="ts-section">
            <h3 class="ts-section-title">
              <span class="ts-section-icon">⚡</span> Action Buttons
            </h3>
            <p class="ts-section-hint">
              Move actions only appear in reorder mode.
            </p>
            <div class="ts-checks">
              <label
                v-for="(label, key) in ACTION_LABELS"
                :key="key"
                class="ts-check"
              >
                <input
                  type="checkbox"
                  v-model="local.actions[key]"
                  class="ts-checkbox"
                />
                <span class="ts-check-label">{{ label }}</span>
              </label>
            </div>
          </section>
        </div>

        <!-- Footer -->
        <div class="ts-footer">
          <button class="ts-btn ts-btn--ghost" @click="resetDefaults">
            Reset defaults
          </button>
          <div class="ts-footer-right">
            <button class="ts-btn ts-btn--cancel" @click="cancel">
              Cancel
            </button>
            <button class="ts-btn ts-btn--apply" @click="apply">Apply</button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.ts-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(57, 22, 28, 0.35);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.ts-modal {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 24px 64px rgba(57, 22, 28, 0.22);
  width: 100%;
  max-width: 560px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: ts-pop 0.18s ease;
}

@keyframes ts-pop {
  from {
    opacity: 0;
    transform: scale(0.96) translateY(8px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Header */
.ts-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 22px 14px;
  border-bottom: 1px solid #f0dde0;
}

.ts-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--dark, #2a0a10);
}

.ts-cog-icon {
  width: 20px;
  height: 20px;
  color: var(--primrose-deep, #c84a6b);
  flex-shrink: 0;
}

.ts-close {
  background: none;
  border: none;
  font-size: 1rem;
  color: var(--mid, #8a5560);
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  line-height: 1;
  transition: background 0.12s;
}
.ts-close:hover {
  background: #f9ecee;
}

/* Body */
.ts-body {
  overflow-y: auto;
  padding: 20px 22px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.ts-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.ts-section-title {
  font-size: 0.9rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: var(--primrose-deep, #c84a6b);
  display: flex;
  align-items: center;
  gap: 6px;
}

.ts-section-hint {
  font-size: 0.78rem;
  color: var(--mid, #8a5560);
  margin: -4px 0 2px;
  font-style: italic;
}

.ts-section-icon {
  font-size: 1rem;
}

.ts-checks {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(145px, 1fr));
  gap: 8px 12px;
}

.ts-check {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 7px 10px;
  border-radius: 8px;
  border: 1px solid #f0d4d8;
  background: #fdf8f9;
  transition:
    background 0.12s,
    border-color 0.12s;
  user-select: none;
}

.ts-check:hover {
  background: #fdf0f2;
  border-color: var(--primrose, #f297a0);
}

.ts-checkbox {
  accent-color: var(--primrose-deep, #c84a6b);
  width: 15px;
  height: 15px;
  flex-shrink: 0;
  cursor: pointer;
}

.ts-check-label {
  font-size: 0.85rem;
  color: var(--dark, #2a0a10);
}

.ts-divider {
  height: 1px;
  background: #f0dde0;
  margin: 10px 0;
}

/* Footer */
.ts-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 22px 18px;
  border-top: 1px solid #f0dde0;
  gap: 10px;
}

.ts-footer-right {
  display: flex;
  gap: 8px;
}

.ts-btn {
  padding: 8px 18px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-family: var(--font-body);
  font-weight: 700;
  cursor: pointer;
  border: none;
  transition:
    opacity 0.15s,
    background 0.15s;
}

.ts-btn--ghost {
  background: none;
  border: 1px solid #ddd;
  color: var(--mid, #8a5560);
}
.ts-btn--ghost:hover {
  background: #f5f5f5;
}

.ts-btn--cancel {
  background: transparent;
  border: 1px solid #c84a6b;
  color: #c84a6b;
}
.ts-btn--cancel:hover {
  background: rgba(200, 74, 107, 0.05);
}

.ts-btn--apply {
  background: linear-gradient(
    135deg,
    var(--primrose, #f297a0),
    var(--primrose-deep, #c84a6b)
  );
  color: #fff;
  border: none;
  min-width: 90px;
}
.ts-btn--apply:hover {
  opacity: 0.88;
}

@media (max-width: 480px) {
  .ts-checks {
    grid-template-columns: 1fr 1fr;
  }
  .ts-footer {
    flex-direction: column;
    align-items: stretch;
  }
  .ts-footer-right {
    justify-content: flex-end;
  }
}
</style>
