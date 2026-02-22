<script setup lang="ts">
import type { AdminProduct } from "../../composables/useProducts";

const props = defineProps<{
  target: AdminProduct | null;
}>();

defineEmits<{
  cancel: [];
  confirm: [];
}>();
</script>

<template>
  <Transition name="modal">
    <div v-if="target" class="modal-backdrop" @click.self="$emit('cancel')">
      <div
        class="confirm-card"
        role="alertdialog"
        aria-modal="true"
        aria-label="Confirm deletion"
      >
        <div class="confirm-icon">🗑️</div>
        <h2 class="confirm-title">Delete product?</h2>
        <p class="confirm-body">
          <strong>{{ target.title }}</strong> will be permanently removed. This
          cannot be undone.
        </p>
        <div class="confirm-actions">
          <button class="btn-cancel" @click="$emit('cancel')">Cancel</button>
          <button class="btn-delete-confirm" @click="$emit('confirm')">
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
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

.confirm-card {
  background: #fff;
  border-radius: 20px;
  padding: 36px 32px;
  max-width: 400px;
  width: 100%;
  text-align: center;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.3);
}

.confirm-icon {
  font-size: 2.5rem;
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
  line-height: 1.5;
  margin-bottom: 24px;
}

.confirm-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

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

.btn-delete-confirm {
  padding: 10px 24px;
  background: linear-gradient(135deg, #e05070, #c03050);
  color: #fff;
  border: none;
  border-radius: var(--radius-md, 12px);
  font-size: 0.9rem;
  font-family: var(--font-body);
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.2s;
}
.btn-delete-confirm:hover {
  opacity: 0.9;
}

/* Modal transition */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-active .confirm-card,
.modal-leave-active .confirm-card {
  transition:
    transform 0.2s ease,
    opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .confirm-card,
.modal-leave-to .confirm-card {
  transform: translateY(12px) scale(0.97);
  opacity: 0;
}
</style>
