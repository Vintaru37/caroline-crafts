<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getConsent, saveConsent } from "../composables/useAnalytics";

const emit = defineEmits<{ consentUpdated: [] }>();

const visible = ref(false);
const analytics = ref(false);
// const marketing = ref(false); // not used yet

onMounted(() => {
  const stored = getConsent();
  if (!stored.answered) {
    visible.value = true;
  }
  analytics.value = stored.analytics;
  // marketing.value = stored.marketing;
});

function acceptAll() {
  analytics.value = true;
  // marketing.value = true;
  save();
}

function rejectAll() {
  analytics.value = false;
  // marketing.value = false;
  save();
}

function saveCustom() {
  save();
}

function save() {
  saveConsent({
    analytics: analytics.value,
    marketing: false, // marketing not used yet
    answered: true,
  });
  emit("consentUpdated");
  close();
}

function close() {
  visible.value = false;
}
</script>

<template>
  <Transition name="cc-fade">
    <div
      v-if="visible"
      class="cc-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Cookie consent"
    >
      <div class="cc-card">
        <div class="cc-dots"><span></span><span></span><span></span></div>

        <div class="cc-cookie-wrap" aria-hidden="true">🍪</div>

        <div class="cc-header">
          <h2 class="cc-title">We use cookies!</h2>
        </div>

        <p class="cc-text">
          We use cookies to understand how visitors use our site and to
          personalise your experience. You can choose which types of cookies to
          allow below. Read our
          <a href="/privacy" target="_blank" rel="noopener">Privacy Policy</a>
          for more details.
        </p>

        <div class="cc-toggles">
          <!-- Necessary -->
          <div class="cc-toggle-row">
            <label class="cc-toggle-label">
              Necessary
              <span>Always active — required for the site to work</span>
            </label>
            <label
              class="toggle-switch"
              aria-label="Necessary cookies (always on)"
            >
              <input type="checkbox" checked disabled />
              <span class="slider"></span>
            </label>
          </div>

          <!-- Analytics -->
          <div class="cc-toggle-row">
            <label class="cc-toggle-label">
              Analytics
              <span>Help us count visits &amp; improve content</span>
            </label>
            <label
              class="toggle-switch"
              :aria-label="`Analytics cookies ${analytics ? 'on' : 'off'}`"
            >
              <input type="checkbox" v-model="analytics" />
              <span class="slider"></span>
            </label>
          </div>

          <!-- Marketing toggle – reserved for future use
          <div class="cc-toggle-row">
            <label class="cc-toggle-label">
              Marketing
              <span>Used for personalised advertising</span>
            </label>
            <label class="toggle-switch">
              <input type="checkbox" v-model="marketing" />
              <span class="slider"></span>
            </label>
          </div>
          -->
        </div>

        <div class="cc-buttons">
          <button class="btn btn-accept" @click="acceptAll">
            Accept all cookies
          </button>
          <button class="btn btn-custom" @click="saveCustom">
            Save my preferences
          </button>
          <button class="btn btn-reject" @click="rejectAll">
            Reject non-essential
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* ═══════════════════════════════════════════════════════════
   MOBILE-FIRST  — bottom sheet, subtle dim, no blur
   ═══════════════════════════════════════════════════════════ */
.cc-overlay {
  position: fixed;
  inset: 0;
  background: rgba(61, 20, 35, 0.28);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 0 12px 16px;
  z-index: 9999;
}

.cc-card {
  background: #fff;
  border-radius: 22px 22px 12px 12px;
  padding: 18px 16px 14px;
  width: 100%;
  max-width: 480px;
  box-shadow:
    0 20px 60px rgba(220, 60, 120, 0.18),
    0 4px 16px rgba(180, 40, 90, 0.12);
  border: 2px solid #f9c0d8;
  position: relative;
  text-align: center;
}

/* Floating cookie — smaller on mobile */
.cc-cookie-wrap {
  position: absolute;
  top: -32px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 3rem;
  line-height: 1;
  animation: cc-bounce 2.8s ease-in-out infinite;
  filter: drop-shadow(0 4px 8px rgba(180, 40, 90, 0.22));
  user-select: none;
}

.cc-header {
  margin-top: 30px;
  margin-bottom: 6px;
}

.cc-title {
  font-family: "Pacifico", "Caveat", cursive;
  font-size: 1.25rem;
  color: #c0295e;
  line-height: 1.2;
  text-shadow: 0 2px 0 #ffd6e8;
}

.cc-text {
  font-size: 0.79rem;
  color: #6b3650;
  line-height: 1.55;
  margin-bottom: 12px;
}

.cc-text a {
  color: #d63d75;
  font-weight: 700;
  text-decoration: none;
  border-bottom: 1.5px dashed #f9b8d3;
}

.cc-text a:hover {
  color: #a02050;
}

/* Toggles — compact on mobile */
.cc-toggles {
  display: flex;
  flex-direction: column;
  gap: 7px;
  background: #fff5f9;
  border: 1.5px solid #f9d0e4;
  border-radius: 12px;
  padding: 9px 11px;
  margin-bottom: 12px;
  text-align: left;
}

.cc-toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.cc-toggle-label {
  font-size: 0.8rem;
  font-weight: 700;
  color: #7a3050;
  cursor: default;
}

.cc-toggle-label span {
  display: block;
  font-weight: 600;
  font-size: 0.68rem;
  color: #b07090;
}

/* Toggle switch — mobile size (40 × 22) */
.toggle-switch {
  position: relative;
  flex-shrink: 0;
  width: 40px;
  height: 22px;
  cursor: pointer;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
  position: absolute;
}

.slider {
  position: absolute;
  inset: 0;
  background: #e8c8d8;
  border-radius: 50px;
  transition: background 0.3s;
}

.slider::before {
  content: "";
  position: absolute;
  left: 3px;
  top: 3px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s;
}

input:checked + .slider {
  background: #e0457f;
}

input:checked + .slider::before {
  transform: translateX(18px); /* 40 - 16 - 3 - 3 */
}

input:disabled + .slider {
  opacity: 0.6;
  cursor: default;
}

/* Buttons — compact on mobile */
.cc-buttons {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.btn {
  width: 100%;
  padding: 10px 14px;
  border: none;
  border-radius: 11px;
  font-family: "Nunito", var(--font-body, sans-serif);
  font-size: 0.85rem;
  font-weight: 800;
  cursor: pointer;
  transition:
    transform 0.15s,
    box-shadow 0.15s,
    background 0.2s;
  letter-spacing: 0.3px;
}

.btn:hover {
  transform: translateY(-2px);
}

.btn:active {
  transform: translateY(0);
}

.btn-accept {
  background: linear-gradient(135deg, #e8407c 0%, #c02560 100%);
  color: #fff;
  box-shadow: 0 5px 16px rgba(200, 40, 100, 0.35);
}

.btn-accept:hover {
  box-shadow: 0 8px 24px rgba(200, 40, 100, 0.45);
}

.btn-custom {
  background: #fff0f6;
  color: #c02560;
  border: 2px solid #f5b8d4;
}

.btn-custom:hover {
  background: #ffe0ef;
}

.btn-reject {
  background: transparent;
  color: #b07090;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 4px;
}

.btn-reject:hover {
  color: #7a3050;
}

/* Decorative dots */
.cc-dots {
  position: absolute;
  top: 11px;
  right: 13px;
  display: flex;
  gap: 4px;
}

.cc-dots span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #f9c0d8;
  display: inline-block;
}

.cc-dots span:nth-child(2) {
  background: #f4a8c8;
}

.cc-dots span:nth-child(3) {
  background: #e898b8;
}

/* ═══════════════════════════════════════════════════════════
   DESKTOP  (≥ 768 px)
   – floating card at bottom-right, no overlay, no blur
   ═══════════════════════════════════════════════════════════ */
@media (min-width: 768px) {
  .cc-overlay {
    top: auto;
    left: auto;
    right: 28px;
    bottom: 28px;
    background: none;
    backdrop-filter: none;
    padding: 0;
    display: block;
  }

  .cc-card {
    width: 360px;
    max-width: 360px;
    border-radius: 24px;
    border-width: 2.5px;
    padding: 0px 26px 22px;
    box-shadow:
      0 24px 64px rgba(220, 60, 120, 0.22),
      0 6px 20px rgba(180, 40, 90, 0.14);
  }

  .cc-cookie-wrap {
    font-size: 3.8rem;
    top: -38px;
  }

  .cc-header {
    margin-top: 44px;
    margin-bottom: 10px;
  }

  .cc-title {
    font-size: 1.55rem;
  }

  .cc-text {
    font-size: 0.86rem;
    line-height: 1.62;
    margin-bottom: 18px;
  }

  .cc-toggles {
    gap: 10px;
    border-radius: 16px;
    padding: 12px 14px;
    margin-bottom: 18px;
  }

  .cc-toggle-label {
    font-size: 0.85rem;
  }

  .cc-toggle-label span {
    font-size: 0.74rem;
  }

  /* Toggle switch — desktop size (46 × 26) */
  .toggle-switch {
    width: 46px;
    height: 26px;
  }

  .slider::before {
    width: 20px;
    height: 20px;
  }

  input:checked + .slider::before {
    transform: translateX(20px); /* 46 - 20 - 3 - 3 */
  }

  .cc-buttons {
    gap: 10px;
  }

  .btn {
    padding: 13px 20px;
    font-size: 0.95rem;
    border-radius: 14px;
  }

  .btn-reject {
    font-size: 0.82rem;
    padding: 6px;
  }

  .cc-dots {
    top: 14px;
    right: 18px;
    gap: 5px;
  }

  .cc-dots span {
    width: 7px;
    height: 7px;
  }
}

/* ── Transitions ─────────────────────────────────────────── */
.cc-fade-enter-active {
  animation: cc-slide-up 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}

.cc-fade-leave-active {
  animation: cc-slide-up 0.28s cubic-bezier(0.22, 1, 0.36, 1) reverse;
}

@keyframes cc-bounce {
  0%,
  100% {
    transform: translateX(-50%) translateY(0);
  }
  50% {
    transform: translateX(-50%) translateY(-8px);
  }
}

@keyframes cc-slide-up {
  from {
    opacity: 0;
    transform: translateY(40px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>
