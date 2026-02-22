<script setup lang="ts">
import { reactive, watch, computed } from "vue";
import { resolveImage } from "../../composables/useProducts";
import type {
  AdminProduct,
  ProductCategory,
} from "../../composables/useProducts";

const TAG_PRESETS = ["bestseller", "new", "sale", "limited edition"];

interface FormData {
  category: ProductCategory;
  title: string;
  desc: string;
  tag: string;
  image: string;
  amazonUrl: string;
  notebookType: string;
}

const props = defineProps<{
  show: boolean;
  mode: "add" | "edit";
  initialData: Omit<AdminProduct, "id"> | null;
  saving: boolean;
  error: string;
}>();

const emit = defineEmits<{
  close: [];
  save: [data: FormData];
}>();

function blankForm(): FormData {
  return {
    category: "coloring-book",
    title: "",
    desc: "",
    tag: "",
    image: "",
    amazonUrl: "",
    notebookType: "",
  };
}

const form = reactive<FormData>(blankForm());

watch(
  () => props.show,
  (newShow) => {
    if (newShow) {
      const src = props.initialData ?? blankForm();
      form.category = src.category;
      form.title = src.title;
      form.desc = src.desc;
      form.tag = src.tag;
      form.image = src.image;
      form.amazonUrl = src.amazonUrl;
      form.notebookType = src.notebookType ?? "";
    }
  },
);

function toggleTag(t: string) {
  form.tag = form.tag === t ? "" : t;
}

const imagePreview = computed(() => {
  if (!form.image) return "";
  try {
    return resolveImage(form.category, form.image);
  } catch {
    return "";
  }
});

function handleSubmit() {
  emit("save", { ...form });
}
</script>

<template>
  <Transition name="modal">
    <div v-if="show" class="modal-backdrop" @click.self="emit('close')">
      <div
        class="modal-card"
        role="dialog"
        aria-modal="true"
        :aria-label="mode === 'add' ? 'Add Product' : 'Edit Product'"
      >
        <div class="modal-header">
          <h2 class="modal-title">
            {{ mode === "add" ? "➕ Add Product" : "✏️ Edit Product" }}
          </h2>
          <button class="modal-close" aria-label="Close" @click="emit('close')">
            ✕
          </button>
        </div>

        <div class="modal-body">
          <!-- Category -->
          <div class="form-group">
            <label class="form-label">Category</label>
            <div class="radio-row">
              <label class="radio-label">
                <input
                  type="radio"
                  v-model="form.category"
                  value="coloring-book"
                />
                🎨 Coloring Book
              </label>
              <label class="radio-label">
                <input type="radio" v-model="form.category" value="notebook" />
                📓 Notebook
              </label>
            </div>
          </div>

          <!-- Title -->
          <div class="form-group">
            <label class="form-label" for="f-title">Title *</label>
            <input
              id="f-title"
              v-model="form.title"
              class="form-input"
              type="text"
              placeholder="Product title"
            />
          </div>

          <!-- Description -->
          <div class="form-group">
            <label class="form-label" for="f-desc">Description</label>
            <textarea
              id="f-desc"
              v-model="form.desc"
              class="form-textarea"
              rows="3"
              placeholder="Short description…"
            ></textarea>
          </div>

          <!-- Image filename -->
          <div class="form-group">
            <label class="form-label" for="f-image">Image filename</label>
            <input
              id="f-image"
              v-model="form.image"
              class="form-input"
              type="text"
              placeholder="e.g. cozy-awawa.webp or https://…"
            />
            <div v-if="imagePreview" class="img-preview-wrap">
              <img :src="imagePreview" alt="Preview" class="img-preview" />
            </div>
          </div>

          <!-- Tag presets -->
          <div class="form-group">
            <label class="form-label">Tag</label>
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
            <input
              v-model="form.tag"
              class="form-input"
              type="text"
              placeholder="Or type a custom tag…"
              style="margin-top: 8px"
            />
          </div>

          <!-- Amazon URL -->
          <div class="form-group">
            <label class="form-label" for="f-amazon">Amazon URL</label>
            <input
              id="f-amazon"
              v-model="form.amazonUrl"
              class="form-input"
              type="url"
              placeholder="https://amazon.com/dp/…"
            />
          </div>

          <!-- Notebook type (only for notebooks) -->
          <div v-if="form.category === 'notebook'" class="form-group">
            <label class="form-label" for="f-nbtype">Notebook Type</label>
            <input
              id="f-nbtype"
              v-model="form.notebookType"
              class="form-input"
              type="text"
              placeholder="e.g. Lined, Grid, Bullet Journal"
            />
          </div>

          <p v-if="error" class="form-error">{{ error }}</p>
        </div>

        <div class="modal-footer">
          <button class="btn-cancel" type="button" @click="emit('close')">
            Cancel
          </button>
          <button
            class="btn-save"
            type="button"
            :disabled="saving || !form.title.trim()"
            @click="handleSubmit"
          >
            <span v-if="!saving">{{
              mode === "add" ? "Add Product" : "Save Changes"
            }}</span>
            <span v-else class="spinner"></span>
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* Backdrop */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(30, 12, 18, 0.55);
  backdrop-filter: blur(4px);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.modal-card {
  background: #fff;
  border-radius: 20px;
  width: 100%;
  max-width: 560px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  padding: 20px 24px 16px;
  border-bottom: 1px solid #f0d4d8;
  flex-shrink: 0;
}

.modal-title {
  flex: 1;
  font-family: var(--font-heading);
  font-size: 1.3rem;
  color: var(--dark);
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.1rem;
  color: var(--mid);
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition:
    background 0.15s,
    color 0.15s;
}
.modal-close:hover {
  background: #f8eaec;
  color: var(--dark);
}

.modal-body {
  overflow-y: auto;
  padding: 20px 24px;
  flex: 1;
}

.modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  padding: 16px 24px;
  border-top: 1px solid #f0d4d8;
  flex-shrink: 0;
}

/* Form elements */
.form-group {
  margin-bottom: 16px;
}

.form-label {
  display: block;
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--mid);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 6px;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 10px 14px;
  border: 1.5px solid #f0d4d8;
  border-radius: var(--radius-md, 12px);
  font-size: 0.9rem;
  font-family: var(--font-body);
  color: var(--dark);
  background: #fdf8f9;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.form-input:focus,
.form-textarea:focus {
  border-color: var(--primrose);
  box-shadow: 0 0 0 3px rgba(242, 151, 160, 0.18);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

/* Radio row */
.radio-row {
  display: flex;
  gap: 20px;
}
.radio-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
  cursor: pointer;
}
.radio-label input[type="radio"] {
  accent-color: var(--primrose);
}

/* Image preview */
.img-preview-wrap {
  margin-top: 8px;
}
.img-preview {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 10px;
  border: 1.5px solid #f0d4d8;
}

/* Tag presets */
.tag-presets {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.preset-chip {
  padding: 5px 14px;
  border: 1.5px solid #f0d4d8;
  border-radius: 20px;
  background: #fdf8f9;
  font-size: 0.8rem;
  font-family: var(--font-body);
  color: var(--mid);
  cursor: pointer;
  transition:
    background 0.15s,
    border-color 0.15s,
    color 0.15s;
}
.preset-chip:hover {
  border-color: var(--primrose);
  color: var(--dark);
}
.preset-chip.active {
  background: var(--primrose);
  border-color: var(--primrose);
  color: #fff;
  font-weight: 700;
}

/* Error */
.form-error {
  color: #c94060;
  font-size: 0.85rem;
  margin-top: 12px;
  background: #fff4f6;
  border: 1px solid #ffd0d8;
  border-radius: 8px;
  padding: 8px 12px;
}

/* Footer buttons */
.btn-cancel {
  padding: 10px 22px;
  border: 1.5px solid #e8d0d4;
  border-radius: var(--radius-md, 12px);
  background: #fdf8f9;
  font-size: 0.9rem;
  font-family: var(--font-body);
  color: var(--mid);
  cursor: pointer;
  transition: background 0.15s;
}
.btn-cancel:hover {
  background: #f8ecee;
}

.btn-save {
  padding: 10px 24px;
  background: linear-gradient(135deg, var(--primrose), var(--primrose-deep));
  color: #fff;
  border: none;
  border-radius: var(--radius-md, 12px);
  font-size: 0.9rem;
  font-family: var(--font-body);
  font-weight: 700;
  cursor: pointer;
  min-width: 120px;
  min-height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s;
}
.btn-save:hover:not(:disabled) {
  opacity: 0.9;
}
.btn-save:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.4);
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

/* Modal transition */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-active .modal-card,
.modal-leave-active .modal-card {
  transition:
    transform 0.2s ease,
    opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .modal-card,
.modal-leave-to .modal-card {
  transform: translateY(16px) scale(0.97);
  opacity: 0;
}

@media (max-width: 600px) {
  .modal-card {
    max-height: 95vh;
    border-radius: 16px;
  }
  .modal-body {
    padding: 16px;
  }
  .modal-footer {
    padding: 12px 16px;
  }
}
</style>
