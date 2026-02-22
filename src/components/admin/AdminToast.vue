<script setup lang="ts">
defineProps<{
  visible: boolean;
  msg: string;
  type: "success" | "error";
}>();
</script>

<template>
  <Transition name="toast">
    <div
      v-if="visible"
      class="toast"
      :class="`toast--${type}`"
      role="status"
      aria-live="polite"
    >
      <span class="toast__icon">{{ type === "success" ? "✅" : "❌" }}</span>
      <span class="toast__msg">{{ msg }}</span>
    </div>
  </Transition>
</template>

<style scoped>
.toast {
  position: fixed;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 300;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 24px;
  border-radius: 14px;
  font-size: 0.92rem;
  font-family: var(--font-body);
  font-weight: 600;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
  white-space: nowrap;
  pointer-events: none;
}

.toast--success {
  background: #1a3a22;
  color: #a8f0b8;
  border: 1px solid rgba(168, 240, 184, 0.25);
}

.toast--error {
  background: #3a1a22;
  color: #f8a8b8;
  border: 1px solid rgba(248, 168, 184, 0.25);
}

.toast__icon {
  font-size: 1rem;
}

/* Toast transition */
.toast-enter-active {
  animation: toast-in 0.25s ease;
}
.toast-leave-active {
  animation: toast-in 0.2s ease reverse;
}

@keyframes toast-in {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}
</style>
