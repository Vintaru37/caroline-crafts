<script setup lang="ts">
import { ref } from "vue";
import FloatingDecor from "../components/FloatingDecor.vue";

const form = ref({
  name: "",
  email: "",
  message: "",
});

const sent = ref(false);
const sending = ref(false);

function handleSubmit() {
  sending.value = true;
  setTimeout(() => {
    sending.value = false;
    sent.value = true;
    form.value = { name: "", email: "", message: "" };
  }, 1000);
}

const socials = [
  {
    name: "Instagram",
    handle: "@carolinecrafts",
    icon: "📸",
    desc: "Behind the scenes, new designs and inspiration",
    href: "https://www.instagram.com",
    bg: "linear-gradient(135deg, #fce4ec, #F9D0CE)",
    color: "#c2185b",
  },
  {
    name: "TikTok",
    handle: "@carolinecrafts",
    icon: "🎵",
    desc: "Timelapses, how-tos and unboxings",
    href: "https://www.tiktok.com",
    bg: "linear-gradient(135deg, #dfe3c0, #B6BB79)",
    color: "#558b2f",
  },
  {
    name: "Amazon",
    handle: "CarolineCrafts",
    icon: "🛒",
    desc: "All my products in one place",
    href: "https://www.amazon.com",
    bg: "linear-gradient(135deg, #F3EBD8, #EADec8)",
    color: "#e65100",
  },
];
</script>

<template>
  <main>
    <!-- ── Page Header ─────────────────────────────── -->
    <section class="page-hero">
      <FloatingDecor />
      <div class="container page-hero__content">
        <p class="page-hero__eyebrow">Let's talk</p>
        <h1 class="page-hero__title">Contact</h1>
        <p class="page-hero__sub">
          Have a question about my products, want to collaborate, or just want
          to say hello? Write to me! 🌸
        </p>
      </div>
    </section>

    <!-- ── Content ─────────────────────────────────── -->
    <section class="section contact-section">
      <div class="container contact-grid">
        <!-- Form -->
        <div class="contact-form-wrap">
          <h2 class="contact-form-wrap__title">Send a message</h2>
          <p class="contact-form-wrap__sub">
            I usually reply within 24 hours 🕐
          </p>

          <Transition name="fade">
            <div v-if="sent" class="success-banner">
              🎉 Thank you for your message! I'll reply as soon as possible.
            </div>
          </Transition>

          <form
            v-if="!sent"
            class="contact-form"
            @submit.prevent="handleSubmit"
          >
            <div class="form-group">
              <label class="form-label" for="name">Name *</label>
              <input
                id="name"
                v-model="form.name"
                class="form-input"
                type="text"
                placeholder="What should I call you?"
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label" for="email">E-mail *</label>
              <input
                id="email"
                v-model="form.email"
                class="form-input"
                type="email"
                placeholder="your@email.com"
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label" for="message">Message *</label>
              <textarea
                id="message"
                v-model="form.message"
                class="form-input form-textarea"
                placeholder="What would you like to talk about? ✨"
                rows="5"
                required
              />
            </div>

            <button
              type="submit"
              class="btn btn-primary form-submit"
              :disabled="sending"
            >
              {{ sending ? "⏳ Sending..." : "💌 Send message" }}
            </button>
          </form>

          <div v-if="sent" class="after-sent">
            <button class="btn btn-outline" @click="sent = false">
              Send another message
            </button>
          </div>
        </div>

        <!-- Info -->
        <div class="contact-info">
          <h2 class="contact-info__title">Other ways to reach me</h2>

          <div class="contact-email-card">
            <span class="contact-email-card__icon">✉️</span>
            <div>
              <p class="contact-email-card__label">E-mail</p>
              <a
                href="mailto:hello@carolinecrafts.com"
                class="contact-email-card__addr"
              >
                hello@carolinecrafts.com
              </a>
            </div>
          </div>

          <h3 class="contact-info__social-title">Social Media</h3>

          <div class="social-list">
            <a
              v-for="s in socials"
              :key="s.name"
              :href="s.href"
              target="_blank"
              rel="noopener noreferrer"
              class="social-item"
              :style="{ background: s.bg }"
            >
              <div class="social-item__icon">{{ s.icon }}</div>
              <div class="social-item__body">
                <strong>{{ s.name }}</strong>
                <span class="social-item__handle">{{ s.handle }}</span>
                <span class="social-item__desc">{{ s.desc }}</span>
              </div>
              <span class="social-item__arrow" :style="{ color: s.color }"
                >→</span
              >
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- ── FAQ ──────────────────────────────────────── -->
    <section class="section faq-section">
      <div class="container">
        <h2 class="section-title" style="margin-bottom: 32px">
          Frequently Asked Questions
        </h2>

        <div class="faq-grid">
          <div class="faq-card">
            <h4 class="faq-card__q">🛒 Where can I buy your products?</h4>
            <p class="faq-card__a">
              All my coloring books and notebooks are available on Amazon. Just
              search for "CarolineCrafts".
            </p>
          </div>
          <div class="faq-card">
            <h4 class="faq-card__q">📦 Do you ship internationally?</h4>
            <p class="faq-card__a">
              Yes! Amazon delivers my products to many countries worldwide.
            </p>
          </div>
          <div class="faq-card">
            <h4 class="faq-card__q">🎨 Can you create a custom design?</h4>
            <p class="faq-card__a">
              I'd love to chat about it! Send me a message and we'll discuss the
              details.
            </p>
          </div>
          <div class="faq-card">
            <h4 class="faq-card__q">📸 Can I share your products?</h4>
            <p class="faq-card__a">
              Of course! Tag me on Instagram or TikTok – I love seeing your
              work! 🌸
            </p>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
/* ── Page Hero ─────────────────────────────────── */
.page-hero {
  padding: 120px 0 60px;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #fce4ec 0%, var(--yucca) 100%);
}

.page-hero__content {
  position: relative;
  z-index: 1;
}

.page-hero__eyebrow {
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--primrose);
  margin-bottom: 8px;
}

.page-hero__title {
  font-size: clamp(2.5rem, 6vw, 4rem);
  color: var(--dark);
  margin-bottom: 14px;
}

.page-hero__sub {
  color: var(--mid);
  font-size: 1rem;
  max-width: 500px;
  line-height: 1.7;
}

/* ── Contact grid ──────────────────────────────── */
.contact-section {
  background: var(--white);
}

.contact-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 64px;
  align-items: start;
}

/* ── Form ──────────────────────────────────────── */
.contact-form-wrap__title {
  font-size: 1.6rem;
  color: var(--dark);
  margin-bottom: 6px;
}

.contact-form-wrap__sub {
  color: var(--mid);
  font-size: 0.88rem;
  margin-bottom: 28px;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--dark);
}

.form-input {
  padding: 12px 16px;
  border: 1.5px solid var(--yucca-dark);
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  font-size: 0.9rem;
  color: var(--dark);
  background: var(--yucca);
  transition:
    border-color var(--transition),
    box-shadow var(--transition);
  outline: none;
  width: 100%;
}

.form-input:focus {
  border-color: var(--primrose);
  box-shadow: 0 0 0 3px rgba(242, 151, 160, 0.15);
  background: var(--white);
}

.form-textarea {
  resize: vertical;
  min-height: 130px;
}

.form-submit {
  align-self: flex-start;
}

.form-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.success-banner {
  background: #e8f5e9;
  border: 1.5px solid #a5d6a7;
  color: #2e7d32;
  border-radius: var(--radius-md);
  padding: 16px 20px;
  font-size: 0.95rem;
  margin-bottom: 20px;
}

.after-sent {
  margin-top: 16px;
}

/* ── Info ──────────────────────────────────────── */
.contact-info__title {
  font-size: 1.6rem;
  color: var(--dark);
  margin-bottom: 24px;
}

.contact-email-card {
  display: flex;
  align-items: center;
  gap: 16px;
  background: var(--yucca);
  border-radius: var(--radius-md);
  padding: 18px 20px;
  margin-bottom: 28px;
}

.contact-email-card__icon {
  font-size: 1.8rem;
}

.contact-email-card__label {
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--mid);
  margin-bottom: 2px;
}

.contact-email-card__addr {
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--primrose);
  word-break: break-all;
  transition: color var(--transition);
}

.contact-email-card__addr:hover {
  color: #e8808a;
}

.contact-info__social-title {
  font-size: 1rem;
  color: var(--dark);
  margin-bottom: 14px;
  font-family: var(--font-heading);
}

.social-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.social-item {
  display: flex;
  align-items: center;
  gap: 14px;
  border-radius: var(--radius-md);
  padding: 16px 18px;
  transition:
    transform var(--transition),
    box-shadow var(--transition);
  box-shadow: var(--shadow-soft);
}

.social-item:hover {
  transform: translateX(4px);
  box-shadow: var(--shadow-card);
}

.social-item__icon {
  font-size: 1.6rem;
}

.social-item__body {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}

.social-item__body strong {
  font-size: 0.9rem;
  color: var(--dark);
}

.social-item__handle {
  font-size: 0.8rem;
  color: var(--mid);
}

.social-item__desc {
  font-size: 0.75rem;
  color: var(--mid);
  opacity: 0.8;
}

.social-item__arrow {
  font-size: 1.2rem;
  font-weight: 600;
  transition: transform var(--transition);
}

.social-item:hover .social-item__arrow {
  transform: translateX(4px);
}

/* ── FAQ ───────────────────────────────────────── */
.faq-section {
  background: var(--yucca);
}

.faq-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.faq-card {
  background: var(--white);
  border-radius: var(--radius-md);
  padding: 24px 26px;
  box-shadow: var(--shadow-soft);
  border-left: 4px solid var(--primrose);
}

.faq-card__q {
  font-size: 0.95rem;
  color: var(--dark);
  margin-bottom: 10px;
}

.faq-card__a {
  font-size: 0.88rem;
  color: var(--mid);
  line-height: 1.65;
}

/* ── Responsive ────────────────────────────────── */
@media (max-width: 900px) {
  .contact-grid {
    grid-template-columns: 1fr;
  }
  .faq-grid {
    grid-template-columns: 1fr;
  }
}
</style>
