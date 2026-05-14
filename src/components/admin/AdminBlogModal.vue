<script setup lang="ts">
import { reactive, ref, watch, computed } from "vue";
import { generateSlug, parseTags } from "../../composables/useBlog";
import type { BlogArticle, BlogArticleInput } from "../../composables/useBlog";
import { uploadBlogImage } from "../../composables/useImageUpload";

const TAG_PRESETS = [
  "coloring",
  "journaling",
  "tips",
  "behind the scenes",
  "crafts",
  "inspiration",
];

const props = defineProps<{
  show: boolean;
  mode: "add" | "edit";
  initialData: Omit<BlogArticle, "id" | "created_at" | "updated_at"> | null;
  saving: boolean;
  error: string;
}>();

const emit = defineEmits<{
  close: [];
  save: [data: BlogArticleInput];
}>();

interface FormData {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image: string;
  tags: string;
  is_published: boolean;
  published_at: string | null;
  sort_order: number | null;
}

function blankForm(): FormData {
  return {
    slug: "",
    title: "",
    excerpt: "",
    content: "",
    cover_image: "",
    tags: "",
    is_published: false,
    published_at: null,
    sort_order: null,
  };
}

const form = reactive<FormData>(blankForm());
const selectedTags = ref<string[]>([]);
const customTagInput = ref("");
const slugManuallyEdited = ref(false);
const activeTab = ref<"write" | "preview">("write");

// ── Image upload state ────────────────────────────────────────────────────────
const fileInputRef = ref<HTMLInputElement | null>(null);
const pendingFile = ref<File | null>(null);
const localPreviewUrl = ref<string>("");
const isDragging = ref(false);
const isUploading = ref(false);
const uploadPhaseLabel = ref("");
const uploadError = ref("");

watch(pendingFile, (newFile) => {
  if (localPreviewUrl.value) URL.revokeObjectURL(localPreviewUrl.value);
  localPreviewUrl.value = newFile ? URL.createObjectURL(newFile) : "";
});

// ── Reset on open ─────────────────────────────────────────────────────────────
watch(
  () => props.show,
  (open) => {
    if (open) {
      const src = props.initialData ?? blankForm();
      form.slug = src.slug ?? "";
      form.title = src.title ?? "";
      form.excerpt = src.excerpt ?? "";
      form.content = src.content ?? "";
      form.cover_image = src.cover_image ?? "";
      form.tags = src.tags ?? "";
      form.is_published = src.is_published ?? false;
      form.published_at = src.published_at ?? null;
      form.sort_order = src.sort_order ?? null;
      selectedTags.value = parseTags(src.tags);
      customTagInput.value = "";
      slugManuallyEdited.value = props.mode === "edit";
      activeTab.value = "write";
      // Reset upload state
      pendingFile.value = null;
      uploadError.value = "";
      isUploading.value = false;
    } else {
      if (localPreviewUrl.value) {
        URL.revokeObjectURL(localPreviewUrl.value);
        localPreviewUrl.value = "";
      }
    }
  },
);

// Auto-generate slug from title (only when not manually edited in add mode)
watch(
  () => form.title,
  (title) => {
    if (props.mode === "add" && !slugManuallyEdited.value) {
      form.slug = generateSlug(title);
    }
  },
);

// ── Tag helpers ───────────────────────────────────────────────────────────────
function toggleTag(tag: string) {
  const i = selectedTags.value.indexOf(tag);
  if (i === -1) selectedTags.value.push(tag);
  else selectedTags.value.splice(i, 1);
}

function removeTag(tag: string) {
  selectedTags.value = selectedTags.value.filter((t) => t !== tag);
}

function addCustomTag() {
  const parts = customTagInput.value
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  for (const part of parts) {
    if (!selectedTags.value.includes(part)) {
      selectedTags.value.push(part);
    }
  }
  customTagInput.value = "";
}

function onTagKeydown(e: KeyboardEvent) {
  if (e.key === "Enter" || e.key === ",") {
    e.preventDefault();
    addCustomTag();
  }
}

// ── Word / char counts ────────────────────────────────────────────────────────
const wordCount = computed(() => {
  const words = form.content.trim().split(/\s+/).filter(Boolean).length;
  return words;
});

const readTime = computed(
  () => `~${Math.max(1, Math.round(wordCount.value / 200))} min read`,
);

// ── Markdown preview (same tiny renderer as BlogPostView) ─────────────────────
function renderPreview(text: string): string {
  if (!text) return "<p class='preview-empty'>Nothing to preview yet…</p>";
  const escape = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const inline = (s: string) =>
    s
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/~~(.+?)~~/g, "<del>$1</del>")
      .replace(/`(.+?)`/g, "<code>$1</code>")
      .replace(
        /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
      );
  const lines = text.trimEnd().split("\n");
  const out: string[] = [];
  let inList = false;
  let inOl = false;
  const close = () => {
    if (inList) {
      out.push("</ul>");
      inList = false;
    }
    if (inOl) {
      out.push("</ol>");
      inOl = false;
    }
  };
  for (let i = 0; i < lines.length; i++) {
    const line: string = lines[i] ?? "";
    if (line.startsWith("### ")) {
      close();
      out.push(`<h3>${inline(escape(line.slice(4)))}</h3>`);
      continue;
    }
    if (line.startsWith("## ") || line.startsWith("# ")) {
      close();
      const slice = line.startsWith("# ") ? 2 : 3;
      out.push(`<h2>${inline(escape(line.slice(slice)))}</h2>`);
      continue;
    }
    if (line.startsWith("> ")) {
      close();
      out.push(`<blockquote>${inline(escape(line.slice(2)))}</blockquote>`);
      continue;
    }
    if (line.startsWith("- ") || line.startsWith("* ")) {
      if (inOl) {
        out.push("</ol>");
        inOl = false;
      }
      if (!inList) {
        out.push("<ul>");
        inList = true;
      }
      out.push(`<li>${inline(escape(line.slice(2)))}</li>`);
      continue;
    }
    if (/^\d+\. /.test(line)) {
      if (inList) {
        out.push("</ul>");
        inList = false;
      }
      if (!inOl) {
        out.push("<ol>");
        inOl = true;
      }
      out.push(`<li>${inline(escape(line.replace(/^\d+\. /, "")))}</li>`);
      continue;
    }
    if (/^---+$/.test(line.trim())) {
      close();
      out.push("<hr>");
      continue;
    }
    close();
    if (line.trim() === "") {
      out.push('<div class="md-br"></div>');
      continue;
    }
    out.push(`<p>${inline(escape(line))}</p>`);
  }
  close();
  return out.join("\n");
}

const preview = computed(() => renderPreview(form.content));

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

function clearCoverImage() {
  form.cover_image = "";
  clearPendingFile();
}

// ── Submit (upload first if pending, then save) ───────────────────────────────
async function handleSubmit() {
  uploadError.value = "";

  if (pendingFile.value) {
    isUploading.value = true;
    uploadPhaseLabel.value = "Processing image…";
    try {
      const url = await uploadBlogImage(pendingFile.value, (phase) => {
        uploadPhaseLabel.value =
          phase === "processing" ? "Processing image…" : "Uploading…";
      });
      form.cover_image = url;
      clearPendingFile();
    } catch (err) {
      uploadError.value =
        err instanceof Error ? err.message : "Image upload failed.";
      isUploading.value = false;
      return;
    }
    isUploading.value = false;
  }

  form.tags = selectedTags.value.join(",");
  const payload: BlogArticleInput = {
    slug: form.slug.trim(),
    title: form.title.trim(),
    excerpt: form.excerpt.trim(),
    content: form.content,
    cover_image: form.cover_image.trim(),
    tags: form.tags,
    is_published: form.is_published,
    published_at:
      form.is_published && !form.published_at
        ? new Date().toISOString()
        : form.published_at,
    sort_order: form.sort_order,
  };
  emit("save", payload);
}

// Insert markdown helper at cursor position
const textareaRef = ref<HTMLTextAreaElement | null>(null);

function insertMarkdown(before: string, after = "") {
  const el = textareaRef.value;
  if (!el) return;
  const start = el.selectionStart;
  const end = el.selectionEnd;
  const selected = form.content.slice(start, end);
  form.content =
    form.content.slice(0, start) +
    before +
    selected +
    after +
    form.content.slice(end);
  // Restore cursor after update
  setTimeout(() => {
    const pos = start + before.length + selected.length + after.length;
    el.setSelectionRange(pos, pos);
    el.focus();
  }, 0);
}

// ── Keyboard shortcuts ────────────────────────────────────────────────────────
function onEditorKeydown(e: KeyboardEvent) {
  if (!e.ctrlKey && !e.metaKey) return;
  switch (e.key.toLowerCase()) {
    case "b":
      e.preventDefault();
      insertMarkdown("**", "**");
      break;
    case "i":
      e.preventDefault();
      insertMarkdown("*", "*");
      break;
    case "k":
      e.preventDefault();
      insertMarkdown("[", "](https://)");
      break;
    case "`":
      e.preventDefault();
      insertMarkdown("`", "`");
      break;
    case "1":
      if (e.altKey) {
        e.preventDefault();
        insertMarkdown("## ");
      }
      break;
    case "2":
      if (e.altKey) {
        e.preventDefault();
        insertMarkdown("### ");
      }
      break;
  }
}

// ── AI prompt copy ────────────────────────────────────────────────────────────
const AI_PROMPT = `Napisz treść artykułu w formacie Markdown. Oto zasady formatowania:

- Duży nagłówek sekcji: ## Tytuł sekcji
- Mały nagłówek podsekcji: ### Tytuł podsekcji
- Pogrubiony tekst: **tekst**
- Kursywa: *tekst*
- Przekreślenie: ~~tekst~~
- Kod w tekście: \`kod\`
- Lista punktowana: - element
- Lista numerowana: 1. element
- Cytat lub wyróżnienie: > tekst
- Pozioma linia oddzielająca sekcje: ---
- Link: [widoczny tekst](https://adres-url.pl)
- Pusta linia między akapitami tworzy mały odstęp

Nie używaj żadnego innego formatowania. Zwróć samą treść artykułu, bez komentarzy.`;
const promptCopied = ref(false);
async function copyAiPrompt() {
  await navigator.clipboard.writeText(AI_PROMPT);
  promptCopied.value = true;
  setTimeout(() => {
    promptCopied.value = false;
  }, 2000);
}

// ── HTML → Markdown converter (used on paste from AI chat) ───────────────────
function htmlToMarkdown(html: string): string {
  const doc = new DOMParser().parseFromString(html, "text/html");

  function walk(node: Node): string {
    if (node.nodeType === Node.TEXT_NODE) return node.textContent ?? "";
    if (node.nodeType !== Node.ELEMENT_NODE) return "";
    const el = node as HTMLElement;
    const tag = el.tagName.toLowerCase();
    const ch = () => Array.from(el.childNodes).map(walk).join("");

    switch (tag) {
      case "h1":
      case "h2":
        return `\n## ${ch().trim()}\n`;
      case "h3":
        return `\n### ${ch().trim()}\n`;
      case "h4":
      case "h5":
      case "h6":
        return `\n### ${ch().trim()}\n`;
      case "strong":
      case "b": {
        const t = ch();
        return t.trim() ? `**${t}**` : t;
      }
      case "em":
      case "i": {
        const t = ch();
        return t.trim() ? `*${t}*` : t;
      }
      case "del":
      case "s": {
        const t = ch();
        return t.trim() ? `~~${t}~~` : t;
      }
      case "code": {
        if (el.closest("pre")) return ch();
        const t = ch();
        return t.trim() ? `\`${t}\`` : t;
      }
      case "pre":
        return `\n\`${ch().trim()}\`\n`;
      case "a": {
        const href = el.getAttribute("href") ?? "";
        const t = ch();
        return href && href !== t ? `[${t}](${href})` : t;
      }
      case "li": {
        const parent = el.parentElement?.tagName.toLowerCase();
        const prefix = parent === "ol" ? "1. " : "- ";
        return `${prefix}${ch().trim()}\n`;
      }
      case "ul":
      case "ol":
        return `\n${ch()}`;
      case "blockquote":
        return `\n> ${ch().trim().replace(/\n/g, "\n> ")}\n`;
      case "hr":
        return `\n---\n`;
      case "br":
        return "\n";
      case "p":
        return `\n${ch().trim()}\n`;
      default:
        return ch();
    }
  }

  return walk(doc.body)
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function onEditorPaste(e: ClipboardEvent) {
  const html = e.clipboardData?.getData("text/html");
  if (!html) return; // no HTML in clipboard → let browser handle plain-text paste normally
  e.preventDefault();
  const markdown = htmlToMarkdown(html);
  const el = textareaRef.value;
  if (!el) return;
  const start = el.selectionStart;
  const end = el.selectionEnd;
  form.content =
    form.content.slice(0, start) + markdown + form.content.slice(end);
  setTimeout(() => {
    const pos = start + markdown.length;
    el.setSelectionRange(pos, pos);
    el.focus();
  }, 0);
}
</script>

<template>
  <Transition name="modal">
    <div v-if="show" class="modal-backdrop" @click.self="$emit('close')">
      <div
        class="blog-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Article editor"
      >
        <!-- Header -->
        <div class="modal-header">
          <h2 class="modal-title">
            {{ mode === "add" ? "✍️ New Article" : "✏️ Edit Article" }}
          </h2>
          <button
            class="modal-close"
            @click="$emit('close')"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form class="modal-body" @submit.prevent="handleSubmit">
          <!-- Two-column layout -->
          <div class="modal-cols">
            <!-- LEFT: core fields -->
            <div class="modal-left">
              <!-- Title -->
              <div class="field">
                <label class="field-label" for="art-title"
                  >Title <span class="req">*</span></label
                >
                <input
                  id="art-title"
                  v-model="form.title"
                  type="text"
                  class="field-input"
                  placeholder="Your article title…"
                  required
                  autocomplete="off"
                />
              </div>

              <!-- Slug -->
              <div class="field">
                <label class="field-label" for="art-slug">
                  Slug <span class="req">*</span>
                  <span class="field-hint">Auto-generated · editable</span>
                </label>
                <div class="slug-wrap">
                  <span class="slug-prefix">/blog/</span>
                  <input
                    id="art-slug"
                    v-model="form.slug"
                    type="text"
                    class="field-input slug-input"
                    placeholder="my-article-slug"
                    required
                    autocomplete="off"
                    @input="slugManuallyEdited = true"
                  />
                </div>
              </div>

              <!-- Excerpt -->
              <div class="field">
                <label class="field-label" for="art-excerpt">
                  Excerpt
                  <span class="field-hint"
                    >Shown on card &amp; meta description</span
                  >
                </label>
                <textarea
                  id="art-excerpt"
                  v-model="form.excerpt"
                  class="field-input field-textarea"
                  placeholder="A short, enticing summary of the article…"
                  rows="3"
                />
              </div>

              <!-- Cover image -->
              <div class="field">
                <label class="field-label">
                  Cover image
                  <span class="field-hint">Upload or paste a URL</span>
                </label>

                <!-- Hidden file input -->
                <input
                  ref="fileInputRef"
                  type="file"
                  accept="image/*"
                  style="display: none"
                  @change="onFileChange"
                />

                <!-- Drop zone (shown when no image selected yet) -->
                <div
                  v-if="!pendingFile && !form.cover_image"
                  class="cover-dropzone"
                  :class="{ 'cover-dropzone--over': isDragging }"
                  @click="triggerFileInput"
                  @dragover.prevent="isDragging = true"
                  @dragleave="isDragging = false"
                  @drop.prevent="onDrop"
                >
                  <span class="dropzone-icon">🖼️</span>
                  <span class="dropzone-text"
                    >Drop image here or <strong>click to browse</strong></span
                  >
                  <span class="dropzone-sub"
                    >PNG, JPG, WEBP → auto-converted to WebP</span
                  >
                </div>

                <!-- Pending file preview -->
                <div v-else-if="pendingFile" class="cover-has-image">
                  <img
                    :src="localPreviewUrl"
                    alt="Cover preview"
                    class="cover-thumb"
                  />
                  <div class="cover-image-actions">
                    <span class="cover-filename">{{ pendingFile.name }}</span>
                    <span class="cover-badge cover-badge--pending"
                      >⏳ Will upload on save</span
                    >
                    <button
                      type="button"
                      class="cover-replace-btn"
                      @click="triggerFileInput"
                    >
                      Replace
                    </button>
                    <button
                      type="button"
                      class="cover-clear-btn"
                      @click="clearPendingFile"
                    >
                      ✕ Remove
                    </button>
                  </div>
                </div>

                <!-- Existing cover image (from URL or already uploaded) -->
                <div v-else-if="form.cover_image" class="cover-has-image">
                  <img
                    :src="form.cover_image"
                    alt="Cover preview"
                    class="cover-thumb"
                  />
                  <div class="cover-image-actions">
                    <span class="cover-badge cover-badge--saved">✅ Saved</span>
                    <button
                      type="button"
                      class="cover-replace-btn"
                      @click="triggerFileInput"
                    >
                      Upload new
                    </button>
                    <button
                      type="button"
                      class="cover-clear-btn"
                      @click="clearCoverImage"
                    >
                      ✕ Remove
                    </button>
                  </div>
                </div>

                <!-- Upload error -->
                <p v-if="uploadError" class="upload-error">
                  ⚠️ {{ uploadError }}
                </p>

                <!-- URL fallback (collapsed under "or paste a URL" link) -->
                <details class="url-fallback">
                  <summary class="url-fallback-toggle">
                    Or paste an external URL instead
                  </summary>
                  <input
                    v-model="form.cover_image"
                    type="url"
                    class="field-input"
                    placeholder="https://…"
                    autocomplete="off"
                    style="margin-top: 8px"
                    @input="clearPendingFile"
                  />
                </details>
              </div>

              <!-- Tags -->
              <div class="field">
                <label class="field-label">Tags</label>
                <!-- Presets -->
                <div class="tag-presets">
                  <button
                    v-for="tag in TAG_PRESETS"
                    :key="tag"
                    type="button"
                    class="tag-preset"
                    :class="{ active: selectedTags.includes(tag) }"
                    @click="toggleTag(tag)"
                  >
                    {{ tag }}
                  </button>
                </div>
                <!-- Custom input -->
                <div class="tag-input-row">
                  <input
                    v-model="customTagInput"
                    type="text"
                    class="field-input tag-custom-input"
                    placeholder="Custom tag, comma-separated…"
                    @keydown="onTagKeydown"
                  />
                  <button
                    type="button"
                    class="tag-add-btn"
                    @click="addCustomTag"
                  >
                    Add
                  </button>
                </div>
                <!-- Selected -->
                <div v-if="selectedTags.length" class="selected-tags">
                  <span
                    v-for="tag in selectedTags"
                    :key="tag"
                    class="selected-tag"
                  >
                    {{ tag }}
                    <button
                      type="button"
                      class="remove-tag"
                      @click="removeTag(tag)"
                    >
                      ×
                    </button>
                  </span>
                </div>
              </div>

              <!-- Publish settings -->
              <div class="field field--row">
                <label class="toggle-label">
                  <input
                    type="checkbox"
                    v-model="form.is_published"
                    class="toggle-checkbox"
                  />
                  <span class="toggle-track">
                    <span class="toggle-thumb" />
                  </span>
                  <span class="toggle-text">
                    {{ form.is_published ? "✅ Published" : "📝 Draft" }}
                  </span>
                </label>
              </div>
            </div>

            <!-- RIGHT: content editor -->
            <div class="modal-right">
              <!-- Editor tabs -->
              <div class="editor-tabs">
                <button
                  type="button"
                  class="editor-tab"
                  :class="{ 'editor-tab--active': activeTab === 'write' }"
                  @click="activeTab = 'write'"
                >
                  ✍️ Write
                </button>
                <button
                  type="button"
                  class="editor-tab"
                  :class="{ 'editor-tab--active': activeTab === 'preview' }"
                  @click="activeTab = 'preview'"
                >
                  👁️ Preview
                </button>
                <span class="editor-meta"
                  >{{ wordCount }} words · {{ readTime }}</span
                >
              </div>

              <!-- Formatting toolbar -->
              <div v-if="activeTab === 'write'" class="fmt-toolbar">
                <button
                  type="button"
                  class="fmt-btn"
                  title="Bold"
                  @click="insertMarkdown('**', '**')"
                >
                  <strong>B</strong>
                </button>
                <button
                  type="button"
                  class="fmt-btn"
                  title="Italic"
                  @click="insertMarkdown('*', '*')"
                >
                  <em>I</em>
                </button>
                <button
                  type="button"
                  class="fmt-btn"
                  title="Heading 2"
                  @click="insertMarkdown('## ')"
                >
                  H2
                </button>
                <button
                  type="button"
                  class="fmt-btn"
                  title="Heading 3"
                  @click="insertMarkdown('### ')"
                >
                  H3
                </button>
                <button
                  type="button"
                  class="fmt-btn"
                  title="List item"
                  @click="insertMarkdown('- ')"
                >
                  • List
                </button>
                <button
                  type="button"
                  class="fmt-btn"
                  title="Horizontal rule"
                  @click="insertMarkdown('---\n')"
                >
                  ─ HR
                </button>
                <button
                  type="button"
                  class="fmt-btn"
                  title="Inline code"
                  @click="insertMarkdown('`', '`')"
                >
                  <code>code</code>
                </button>
                <button
                  type="button"
                  class="fmt-btn"
                  title="Strikethrough"
                  @click="insertMarkdown('~~', '~~')"
                >
                  <del>S</del>
                </button>
                <span class="fmt-sep" />
                <button
                  type="button"
                  class="fmt-btn"
                  title="Blockquote"
                  @click="insertMarkdown('> ')"
                >
                  “ Quote
                </button>
                <button
                  type="button"
                  class="fmt-btn"
                  title="Numbered list"
                  @click="insertMarkdown('1. ')"
                >
                  1. List
                </button>
                <button
                  type="button"
                  class="fmt-btn"
                  title="Link"
                  @click="insertMarkdown('[', '](https://)')"
                >
                  🔗 Link
                </button>
              </div>

              <!-- Markdown help hint + AI prompt copy -->
              <div v-if="activeTab === 'write'" class="md-hint-row">
                <button
                  type="button"
                  class="copy-prompt-btn"
                  :class="{ copied: promptCopied }"
                  @click="copyAiPrompt"
                  title="Skopiuj opis składni Markdown dla asystenta AI"
                >
                  {{
                    promptCopied ? "✅ Skopiowano!" : "🤖 Kopiuj prompt dla AI"
                  }}
                </button>
                <span class="md-shortcuts-hint"
                  >Ctrl+B pogrubienie &nbsp;·&nbsp; Ctrl+I kursywa &nbsp;·&nbsp;
                  Ctrl+K link &nbsp;·&nbsp; Ctrl+` kod</span
                >
              </div>

              <!-- Write tab -->
              <textarea
                v-if="activeTab === 'write'"
                ref="textareaRef"
                v-model="form.content"
                class="content-editor"
                placeholder="Write your article here…&#10;&#10;## Getting started&#10;&#10;Use **Markdown** to format your content."
                spellcheck="true"
                @keydown="onEditorKeydown"
                @paste="onEditorPaste"
              />

              <!-- Preview tab -->
              <div v-else class="content-preview prose" v-html="preview" />
            </div>
          </div>

          <!-- Error -->
          <div v-if="error" class="modal-error">⚠️ {{ error }}</div>

          <!-- Footer actions -->
          <div class="modal-footer">
            <button type="button" class="btn-cancel" @click="$emit('close')">
              Cancel
            </button>
            <button
              type="submit"
              class="btn-save"
              :disabled="
                saving || isUploading || !form.title.trim() || !form.slug.trim()
              "
            >
              <span v-if="saving || isUploading" class="btn-spinner" />
              <span v-if="isUploading">{{ uploadPhaseLabel }}</span>
              <span v-else-if="!saving">{{
                mode === "add" ? "Publish Article" : "Save Changes"
              }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* ── Backdrop ── */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(30, 12, 18, 0.6);
  backdrop-filter: blur(4px);
  z-index: 200;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 24px 16px;
  overflow-y: auto;
}

/* ── Modal shell ── */
.blog-modal {
  background: #fff;
  border-radius: 24px;
  width: 100%;
  max-width: 1320px;
  max-height: calc(100dvh - 48px);
  box-shadow: 0 32px 100px rgba(0, 0, 0, 0.32);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin: auto;
}

/* ── Header ── */
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 22px 28px 18px;
  border-bottom: 1px solid #f8e8eb;
  background: linear-gradient(135deg, #fff6f8, #fffaf7);
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
  border: 1.5px solid #f0d0d8;
  background: #fff;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--mid);
  transition: background 0.15s;
}

.modal-close:hover {
  background: #fde8ec;
}

/* ── Body ── */
.modal-body {
  padding: 24px 28px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-y: auto;
  flex: 1;
  min-height: 0;
}

/* ── Two-column layout ── */
.modal-cols {
  display: grid;
  grid-template-columns: 420px 1fr;
  gap: 28px;
  align-items: start;
}

.modal-left,
.modal-right {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* ── Fields ── */
.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field--row {
  flex-direction: row;
  align-items: center;
}

.field-label {
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--mid);
  display: flex;
  align-items: center;
  gap: 6px;
}

.req {
  color: var(--primrose-deep);
}

.field-hint {
  font-size: 0.72rem;
  font-weight: 400;
  letter-spacing: 0;
  text-transform: none;
  color: var(--light-text);
}

.field-input {
  width: 100%;
  padding: 10px 14px;
  border: 1.5px solid #f2d0d5;
  border-radius: var(--radius-sm);
  font-family: var(--font-body);
  font-size: 0.9rem;
  color: var(--dark);
  background: #fdf8f9;
  transition: border-color 0.15s;
  outline: none;
}

.field-input:focus {
  border-color: var(--primrose);
  background: #fff;
}

.field-textarea {
  resize: vertical;
  min-height: 70px;
  line-height: 1.6;
}

/* Slug */
.slug-wrap {
  display: flex;
  align-items: stretch;
  border: 1.5px solid #f2d0d5;
  border-radius: var(--radius-sm);
  overflow: hidden;
  background: #fdf8f9;
  transition: border-color 0.15s;
}

.slug-wrap:focus-within {
  border-color: var(--primrose);
  background: #fff;
}

.slug-prefix {
  padding: 10px 10px 10px 14px;
  font-size: 0.85rem;
  color: var(--light-text);
  background: #f8f0f2;
  white-space: nowrap;
  border-right: 1px solid #f2d0d5;
}

.slug-input {
  border: none;
  border-radius: 0;
  background: transparent;
  flex: 1;
}

.slug-input:focus {
  background: transparent;
}

/* ── Cover image upload widget ── */
.cover-dropzone {
  border: 2px dashed #f2d0d5;
  border-radius: var(--radius-sm);
  padding: 22px 16px;
  text-align: center;
  cursor: pointer;
  transition:
    background 0.15s,
    border-color 0.15s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.cover-dropzone:hover,
.cover-dropzone--over {
  background: var(--primrose-light);
  border-color: var(--primrose);
}

.dropzone-icon {
  font-size: 1.8rem;
}

.dropzone-text {
  font-size: 0.85rem;
  color: var(--dark);
}

.dropzone-sub {
  font-size: 0.75rem;
  color: var(--light-text);
}

.cover-has-image {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 10px;
  background: #fdf8f9;
  border: 1.5px solid #f2d0d5;
  border-radius: var(--radius-sm);
}

.cover-thumb {
  width: 96px;
  height: 54px;
  object-fit: cover;
  border-radius: 6px;
  flex-shrink: 0;
}

.cover-image-actions {
  display: flex;
  flex-direction: column;
  gap: 5px;
  flex: 1;
  min-width: 0;
}

.cover-filename {
  font-size: 0.78rem;
  color: var(--mid);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cover-badge {
  font-size: 0.72rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 99px;
  align-self: flex-start;
}

.cover-badge--pending {
  background: #fff4e0;
  color: #9a6a00;
}
.cover-badge--saved {
  background: #eaf7ed;
  color: #2d7a3a;
}

.cover-replace-btn,
.cover-clear-btn {
  font-size: 0.78rem;
  font-family: var(--font-body);
  border: 1.5px solid #f2d0d5;
  border-radius: 6px;
  padding: 3px 10px;
  cursor: pointer;
  transition: background 0.15s;
  background: #fff;
  color: var(--dark);
  align-self: flex-start;
}

.cover-replace-btn:hover {
  background: var(--primrose-light);
}
.cover-clear-btn {
  color: #c03050;
  border-color: #f8c0c8;
}
.cover-clear-btn:hover {
  background: #fde8ec;
}

.upload-error {
  font-size: 0.8rem;
  color: #c03050;
  margin-top: 4px;
}

.url-fallback {
  margin-top: 6px;
}

.url-fallback-toggle {
  font-size: 0.78rem;
  color: var(--light-text);
  cursor: pointer;
  user-select: none;
}

.url-fallback-toggle:hover {
  color: var(--primrose-deep);
}

/* Tags */
.tag-presets {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag-preset {
  font-size: 0.78rem;
  padding: 4px 12px;
  border-radius: 99px;
  border: 1.5px solid #f2d0d5;
  background: #fdf8f9;
  color: var(--mid);
  cursor: pointer;
  font-family: var(--font-body);
  transition: all 0.15s;
}

.tag-preset.active,
.tag-preset:hover {
  background: var(--primrose-light);
  border-color: var(--primrose);
  color: var(--primrose-deep);
}

.tag-input-row {
  display: flex;
  gap: 8px;
  align-items: stretch;
}

.tag-custom-input {
  flex: 1;
}

.tag-add-btn {
  padding: 8px 16px;
  border: 1.5px solid #f2d0d5;
  border-radius: var(--radius-sm);
  background: var(--primrose-light);
  color: var(--primrose-deep);
  font-family: var(--font-body);
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s;
}

.tag-add-btn:hover {
  background: var(--pinktone);
}

.selected-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 4px;
}

.selected-tag {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 0.78rem;
  font-weight: 700;
  padding: 3px 10px;
  background: var(--primrose-light);
  color: var(--primrose-deep);
  border-radius: 99px;
}

.remove-tag {
  border: none;
  background: none;
  cursor: pointer;
  font-size: 0.95rem;
  color: var(--primrose-deep);
  padding: 0;
  line-height: 1;
}

/* Publish toggle */
.toggle-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  user-select: none;
}

.toggle-checkbox {
  display: none;
}

.toggle-track {
  width: 44px;
  height: 24px;
  border-radius: 99px;
  background: #e8d8da;
  position: relative;
  transition: background 0.2s;
  flex-shrink: 0;
}

.toggle-checkbox:checked ~ .toggle-track {
  background: var(--primrose);
}

.toggle-thumb {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.18);
  transition: left 0.2s;
}

.toggle-checkbox:checked ~ .toggle-track .toggle-thumb {
  left: 23px;
}

.toggle-text {
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--dark);
}

/* ── Editor ── */
.editor-tabs {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
}

.editor-tab {
  padding: 6px 16px;
  border-radius: var(--radius-sm);
  border: 1.5px solid #f2d0d5;
  background: #fdf8f9;
  font-family: var(--font-body);
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--mid);
  cursor: pointer;
  transition: all 0.15s;
}

.editor-tab--active,
.editor-tab:hover {
  background: var(--primrose-light);
  border-color: var(--primrose);
  color: var(--primrose-deep);
}

.editor-meta {
  margin-left: auto;
  font-size: 0.75rem;
  color: var(--light-text);
}

/* Formatting toolbar */
.fmt-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  padding: 6px 10px;
  background: #fdf0f2;
  border: 1.5px solid #f2d0d5;
  border-bottom: none;
  border-radius: var(--radius-sm) var(--radius-sm) 0 0;
}

.fmt-btn {
  padding: 4px 10px;
  font-size: 0.82rem;
  font-family: var(--font-body);
  border: 1.5px solid transparent;
  border-radius: 6px;
  background: transparent;
  cursor: pointer;
  color: var(--dark);
  transition: background 0.12s;
}

.fmt-btn:hover {
  background: #fff;
  border-color: #f2d0d5;
}

.fmt-sep {
  width: 1px;
  background: #f2d0d5;
  align-self: stretch;
  margin: 0 2px;
}

.md-hint-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: -10px;
}

.md-shortcuts-hint {
  font-size: 0.72rem;
  color: var(--light-text);
  white-space: nowrap;
}

.copy-prompt-btn {
  font-size: 0.75rem;
  font-family: var(--font-body);
  font-weight: 700;
  padding: 3px 12px;
  border: 1.5px solid #f2d0d5;
  border-radius: 99px;
  background: #fdf8f9;
  color: var(--primrose-deep);
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
}

.copy-prompt-btn:hover {
  background: var(--primrose-light);
  border-color: var(--primrose);
}

.copy-prompt-btn.copied {
  background: #eaf7ed;
  border-color: #a8ddb5;
  color: #2d7a3a;
}

.content-editor {
  width: 100%;
  min-height: 500px;
  padding: 14px 16px;
  border: 1.5px solid #f2d0d5;
  border-top: none;
  border-radius: 0 0 var(--radius-sm) var(--radius-sm);
  font-family: "Courier New", Courier, monospace;
  font-size: 0.88rem;
  line-height: 1.7;
  color: var(--dark);
  background: #fffbfc;
  resize: vertical;
  outline: none;
  transition: border-color 0.15s;
}

.content-editor:focus {
  border-color: var(--primrose);
  background: #fff;
}

/* Preview */
.content-preview {
  min-height: 500px;
  padding: 16px;
  border: 1.5px solid #f2d0d5;
  border-radius: var(--radius-sm);
  font-size: 0.9rem;
  line-height: 1.8;
  color: var(--dark);
  background: #fffbfc;
  overflow-y: auto;
}

:deep(.content-preview h2) {
  font-family: var(--font-heading);
  font-size: 1.3rem;
  margin: 1.2rem 0 0.5rem;
}
:deep(.content-preview h3) {
  font-family: var(--font-heading);
  font-size: 1.1rem;
  margin: 1rem 0 0.4rem;
}
:deep(.content-preview p) {
  margin-bottom: 0.7rem;
}
:deep(.content-preview ul) {
  padding-left: 1.4rem;
  margin-bottom: 0.7rem;
}
:deep(.content-preview li) {
  margin-bottom: 0.3rem;
}
:deep(.content-preview code) {
  background: var(--primrose-light);
  padding: 1px 5px;
  border-radius: 3px;
  font-size: 0.85em;
}
:deep(.content-preview hr) {
  border: none;
  border-top: 1px solid var(--pinktone);
  margin: 1rem 0;
}
:deep(.content-preview blockquote) {
  border-left: 4px solid var(--primrose);
  background: var(--primrose-light);
  padding: 8px 14px;
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  color: var(--mid);
  font-style: italic;
  margin: 0.5rem 0;
}
:deep(.content-preview ol) {
  padding-left: 1.4rem;
  margin-bottom: 0.7rem;
}
:deep(.content-preview del) {
  color: var(--light-text);
  text-decoration: line-through;
}
:deep(.content-preview .md-br) {
  height: 0.6rem;
}
:deep(.content-preview a) {
  color: var(--primrose-deep);
  text-decoration: underline;
}
:deep(.preview-empty) {
  color: var(--light-text);
  font-style: italic;
}

/* ── Error ── */
.modal-error {
  padding: 10px 14px;
  background: #fde8ec;
  border: 1.5px solid #f8b8c8;
  border-radius: var(--radius-sm);
  color: #c03050;
  font-size: 0.88rem;
}

/* ── Footer ── */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 4px;
  border-top: 1px solid #f8e8eb;
}

.btn-cancel {
  padding: 11px 24px;
  border: 1.5px solid #e8d0d4;
  border-radius: var(--radius-md);
  background: #fdf8f9;
  font-family: var(--font-body);
  font-size: 0.9rem;
  color: var(--mid);
  cursor: pointer;
  transition: background 0.15s;
}

.btn-cancel:hover {
  background: #f8ecee;
}

.btn-save {
  padding: 11px 28px;
  background: linear-gradient(135deg, var(--primrose), var(--primrose-deep));
  color: #fff;
  border: none;
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 150px;
  justify-content: center;
}

.btn-save:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
.btn-save:not(:disabled):hover {
  opacity: 0.9;
}

.btn-spinner {
  width: 16px;
  height: 16px;
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

/* ── Modal transition ── */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.22s ease;
}
.modal-enter-active .blog-modal,
.modal-leave-active .blog-modal {
  transition:
    transform 0.22s ease,
    opacity 0.22s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .blog-modal,
.modal-leave-to .blog-modal {
  transform: translateY(14px) scale(0.97);
  opacity: 0;
}

/* ── Responsive ── */
@media (max-width: 820px) {
  .modal-cols {
    grid-template-columns: 1fr;
  }
  .blog-modal {
    max-width: 100%;
    border-radius: 20px;
  }
}
</style>
