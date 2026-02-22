<script setup lang="ts">
import { reactive, watch, computed, ref } from "vue";
import { resolveImage } from "../../composables/useProducts";
import { uploadProductImage } from "../../composables/useImageUpload";
import type {
  AdminProduct,
  ProductCategory,
} from "../../composables/useProducts";

const TAG_PRESETS = ["bestseller", "new", "sale", "for kids", "bold and easy"];

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

// ── Image upload state ────────────────────────────────────────────────────────
const fileInputRef = ref<HTMLInputElement | null>(null);
const pendingFile = ref<File | null>(null);
const localPreviewUrl = ref<string>("");
const isDragging = ref(false);
const isUploading = ref(false);
const uploadPhaseLabel = ref("");
const uploadError = ref("");

// Keep object URL in sync with pendingFile (create / revoke)
watch(pendingFile, (newFile) => {
  if (localPreviewUrl.value) URL.revokeObjectURL(localPreviewUrl.value);
  localPreviewUrl.value = newFile ? URL.createObjectURL(newFile) : "";
});

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
      // Reset upload state
      pendingFile.value = null;
      uploadError.value = "";
      isUploading.value = false;
    } else {
      // Revoke stale object URL when modal closes
      if (localPreviewUrl.value) {
        URL.revokeObjectURL(localPreviewUrl.value);
        localPreviewUrl.value = "";
      }
    }
  },
);

function toggleTag(t: string) {
  form.tag = form.tag === t ? "" : t;
}

// Preview for the text-field image (filename or https://… URL)
const resolvedPreview = computed(() => {
  if (!form.image) return "";
  try {
    return resolveImage(form.category, form.image);
  } catch {
    return "";
  }
});

// ── File input handlers ───────────────────────────────────────────────────────
function triggerFileInput() {
  fileInputRef.value?.click();
}

function onFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0] ?? null;
  if (file) {
    pendingFile.value = file;
    uploadError.value = "";
  }
}

function onDrop(e: DragEvent) {
  isDragging.value = false;
  const file = e.dataTransfer?.files?.[0] ?? null;
  if (file && file.type.startsWith("image/")) {
    pendingFile.value = file;
    uploadError.value = "";
  }
}

function clearPendingFile() {
  pendingFile.value = null;
  if (fileInputRef.value) fileInputRef.value.value = "";
}

// ── Submit (upload first, then save) ─────────────────────────────────────────
async function handleSubmit() {
  uploadError.value = "";

  if (pendingFile.value) {
    isUploading.value = true;
    uploadPhaseLabel.value = "Processing image…";
    try {
      const url = await uploadProductImage(
        pendingFile.value,
        form.category,
        (phase) => {
          uploadPhaseLabel.value =
            phase === "processing" ? "Processing image…" : "Uploading…";
        },
      );
      form.image = url;
      clearPendingFile();
    } catch (err) {
      uploadError.value =
        err instanceof Error ? err.message : "Image upload failed.";
      isUploading.value = false;
      return; // Don't emit save on upload failure
    }
    isUploading.value = false;
  }

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
            <div class="cat-toggle">
              <button
                type="button"
                class="cat-btn"
                :class="{ active: form.category === 'coloring-book' }"
                @click="form.category = 'coloring-book'"
              >
                🎨 Coloring Book
              </button>
              <button
                type="button"
                class="cat-btn"
                :class="{ active: form.category === 'notebook' }"
                @click="form.category = 'notebook'"
              >
                📓 Notebook
              </button>
            </div>
          </div>

          <!-- Title -->
          <div class="form-group">
            <label class="form-label" for="f-title">Title *</label>
            <input
              id="f-title"
              v-model="form.title"
              spellcheck="false"
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
              spellcheck="false"
              class="form-textarea"
              rows="3"
              placeholder="Short description…"
            ></textarea>
          </div>

          <!-- Image -->
          <div class="form-group">
            <label class="form-label">Image</label>

            <!-- Drop zone / file picker -->
            <div
              class="drop-zone"
              :class="{
                'has-file': !!pendingFile,
                'drag-over': isDragging,
                'is-notebook': form.category === 'notebook',
              }"
              @dragover.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              @drop.prevent="onDrop"
              @click="triggerFileInput"
            >
              <input
                ref="fileInputRef"
                type="file"
                accept="image/*"
                class="file-input-hidden"
                @change="onFileChange"
                @click.stop
              />
              <template v-if="pendingFile">
                <img
                  :src="localPreviewUrl"
                  class="drop-zone-thumb"
                  alt="Selected image"
                />
                <div class="drop-zone-info">
                  <span class="drop-zone-filename">{{ pendingFile.name }}</span>
                  <span class="drop-zone-hint"
                    >Will be resized &amp; converted to WebP on save</span
                  >
                </div>
                <button
                  class="drop-zone-clear"
                  type="button"
                  @click.stop="clearPendingFile"
                  aria-label="Remove selected image"
                >
                  ✕
                </button>
              </template>
              <template v-else>
                <span class="drop-zone-icon">📷</span>
                <div class="drop-zone-info">
                  <span class="drop-zone-text"
                    >Drop image here or <u>browse</u></span
                  >
                  <span class="drop-zone-hint"
                    >PNG · JPG · WEBP · GIF · any format</span
                  >
                </div>
              </template>
            </div>

            <!-- Current image (edit mode, no new file pending) -->
            <div
              v-if="!pendingFile && resolvedPreview"
              :class="[
                'current-image-wrap',
                { 'is-notebook': form.category === 'notebook' },
              ]"
            >
              <span class="current-image-label">Current image</span>
              <img
                :src="resolvedPreview"
                alt="Current image"
                class="current-image-thumb"
              />
            </div>

            <!-- Upload error -->
            <p v-if="uploadError" class="form-error">{{ uploadError }}</p>
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
            :disabled="saving || isUploading || !form.title.trim()"
            @click="handleSubmit"
          >
            <span v-if="isUploading">{{ uploadPhaseLabel }}</span>
            <span v-else-if="!saving">{{
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
  max-width: 660px;
  max-height: 95vh;
  padding-inline: 0.75rem;
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
  padding: 12px 24px;
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

/* Category toggle */
.cat-toggle {
  display: flex;
  gap: 8px;
}
.cat-btn {
  flex: 1;
  padding: 11px 16px;
  border: 2px solid #f0d4d8;
  border-radius: var(--radius-md, 12px);
  background: #fdf8f9;
  font-size: 0.92rem;
  font-family: var(--font-body);
  color: var(--mid);
  cursor: pointer;
  font-weight: 500;
  text-align: center;
  transition:
    background 0.18s,
    border-color 0.18s,
    color 0.18s,
    box-shadow 0.18s;
}
.cat-btn:hover {
  border-color: var(--primrose);
  color: var(--dark);
  background: #fff5f6;
}
.cat-btn.active {
  background: linear-gradient(135deg, var(--primrose), var(--primrose-deep));
  border-color: transparent;
  color: #fff;
  font-weight: 700;
  box-shadow: 0 4px 14px rgba(242, 151, 160, 0.35);
}

/* Current image preview (edit mode) */
.current-image-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
}
.current-image-label {
  font-size: 0.78rem;
  color: #b0a0a4;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
  white-space: nowrap;
}
.current-image-thumb {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
  border: 1.5px solid #f0d4d8;
}

/* Drop zone */
.drop-zone {
  border: 2px dashed #f0d4d8;
  border-radius: var(--radius-md, 12px);
  background: #fdf8f9;
  padding: 20px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition:
    border-color 0.2s,
    background 0.2s;
  position: relative;
}
.drop-zone:hover,
.drop-zone.drag-over {
  border-color: var(--primrose);
  background: #fff5f6;
}
.drop-zone.drag-over {
  background: #fff0f2;
}
.drop-zone.has-file {
  border-style: solid;
  padding: 12px 16px;
}
.file-input-hidden {
  display: none;
}
.drop-zone-icon {
  font-size: 1.8rem;
  flex-shrink: 0;
  line-height: 1;
}
.drop-zone-info {
  display: flex;
  flex-direction: column;
  gap: 3px;
  flex: 1;
  min-width: 0;
}
.drop-zone.is-notebook .drop-zone-thumb {
  height: 150px;
}
.drop-zone-text {
  font-size: 0.88rem;
  color: var(--mid);
}
.current-image-wrap.is-notebook .current-image-thumb {
  height: 150px;
}
.drop-zone-hint {
  font-size: 0.75rem;
  color: #b0a0a4;
}
.drop-zone-thumb {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
  border: 1.5px solid #f0d4d8;
  flex-shrink: 0;
}
.drop-zone-filename {
  font-size: 0.85rem;
  color: var(--dark);
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.drop-zone-clear {
  background: #f8eaec;
  border: none;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  font-size: 0.8rem;
  color: var(--mid);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition:
    background 0.15s,
    color 0.15s;
}
.drop-zone-clear:hover {
  background: var(--primrose);
  color: #fff;
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
