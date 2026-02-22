<script setup lang="ts">
import { ref } from "vue";
import { supabase } from "../../lib/supabase";
import logoImg from "../../assets/images/logo.png";

const emailInput = ref("");
const pwInput = ref("");
const pwVisible = ref(false);
const pwError = ref("");
const pwLoading = ref(false);

async function login() {
  if (!emailInput.value || !pwInput.value) {
    pwError.value = "Please enter your email and password.";
    return;
  }
  pwLoading.value = true;
  pwError.value = "";
  const { error } = await supabase.auth.signInWithPassword({
    email: emailInput.value.trim(),
    password: pwInput.value,
  });
  pwLoading.value = false;
  if (error) {
    pwError.value = error.message;
    pwInput.value = "";
  } else {
    emailInput.value = "";
    pwInput.value = "";
  }
}
</script>

<template>
  <div class="login-wrap">
    <div class="login-card">
      <div class="login-brand">
        <img :src="logoImg" alt="CarolineCrafts" class="login-brand__img" />
      </div>
      <h1 class="login-title">Admin Panel</h1>
      <p class="login-sub">Manage your products with ease</p>

      <div class="login-field" :class="{ error: pwError }">
        <label for="email-input" class="sr-only">Email</label>
        <input
          id="email-input"
          type="email"
          v-model="emailInput"
          class="login-input"
          placeholder="Admin email"
          autocomplete="email"
          @keyup.enter="login"
        />
      </div>

      <div class="login-field" :class="{ error: pwError }">
        <label for="pw-input" class="sr-only">Password</label>
        <input
          id="pw-input"
          :type="pwVisible ? 'text' : 'password'"
          v-model="pwInput"
          class="login-input"
          placeholder="Password"
          autocomplete="current-password"
          @keyup.enter="login"
        />
        <button
          type="button"
          class="pw-toggle"
          :aria-label="pwVisible ? 'Hide password' : 'Show password'"
          @click="pwVisible = !pwVisible"
        >
          {{ pwVisible ? "🙈" : "👁️" }}
        </button>
      </div>

      <p v-if="pwError" class="login-error">{{ pwError }}</p>

      <button
        class="login-btn"
        :class="{ loading: pwLoading }"
        :disabled="pwLoading"
        @click="login"
      >
        <span v-if="!pwLoading">Log In →</span>
        <span v-else class="spinner"></span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
}

.login-wrap {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a0d10 0%, #2d1520 50%, #3d1a26 100%);
  padding: 24px;
}

.login-card {
  background: #fff;
  border-radius: 24px;
  padding: 48px 40px;
  max-width: 420px;
  width: 100%;
  text-align: center;
  box-shadow: 0 32px 80px rgba(0, 0, 0, 0.4);
}

.login-brand {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
}

.login-brand__img {
  height: 56px;
  width: auto;
  object-fit: contain;
}

.login-title {
  font-family: var(--font-heading);
  font-size: 2rem;
  color: var(--dark);
  margin-bottom: 6px;
}

.login-sub {
  color: var(--mid);
  font-size: 0.95rem;
  margin-bottom: 28px;
}

.login-field {
  position: relative;
  margin-bottom: 14px;
}

.login-input {
  width: 100%;
  padding: 14px 48px 14px 18px;
  border: 1.5px solid #f0d4d8;
  border-radius: var(--radius-md);
  font-size: 1rem;
  font-family: var(--font-body);
  outline: none;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
  background: #fdf8f9;
}

.login-input:focus {
  border-color: var(--primrose);
  box-shadow: 0 0 0 4px rgba(242, 151, 160, 0.18);
}

.login-field.error .login-input {
  border-color: #e05070;
}

.pw-toggle {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.1rem;
  padding: 0;
  line-height: 1;
}

.login-error {
  color: #c94060;
  font-size: 0.85rem;
  margin-bottom: 12px;
}

.login-btn {
  width: 100%;
  padding: 15px;
  background: linear-gradient(135deg, var(--primrose), var(--primrose-deep));
  color: #fff;
  border: none;
  border-radius: var(--radius-md);
  font-size: 1.05rem;
  font-family: var(--font-body);
  font-weight: 700;
  cursor: pointer;
  transition:
    opacity 0.2s,
    transform 0.1s;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 52px;
  margin-bottom: 20px;
}

.login-btn:hover:not(:disabled) {
  opacity: 0.92;
  transform: translateY(-1px);
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.4);
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

@media (max-width: 520px) {
  .login-card {
    padding: 36px 24px;
  }
}
</style>
