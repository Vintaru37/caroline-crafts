<script setup lang="ts">
import { ref } from "vue";
import FloatingDecor from "../components/FloatingDecor.vue";
import { useReveal } from "../composables/useReveal";
import instagramIcon from "../assets/images/instagram-icon.png";
import tiktokIcon from "../assets/images/tiktok-icon.png";

useReveal();

/* ── FAQ smooth height animation ─────────────────── */
function onEnter(el: Element) {
  const h = el as HTMLElement;
  h.style.overflow = "hidden";
  h.style.height = "0";
  h.style.opacity = "0";
  void h.offsetHeight; // force reflow
  h.style.transition =
    "height 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.35s ease";
  h.style.height = h.scrollHeight + "px";
  h.style.opacity = "1";
}

function onAfterEnter(el: Element) {
  const h = el as HTMLElement;
  h.style.height = "";
  h.style.overflow = "";
  h.style.transition = "";
  h.style.opacity = "";
}

function onLeave(el: Element) {
  const h = el as HTMLElement;
  h.style.overflow = "hidden";
  h.style.height = h.scrollHeight + "px";
  h.style.opacity = "1";
  void h.offsetHeight; // force reflow
  h.style.transition =
    "height 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.28s ease";
  h.style.height = "0";
  h.style.opacity = "0";
}

function onAfterLeave(el: Element) {
  const h = el as HTMLElement;
  h.style.height = "";
  h.style.overflow = "";
  h.style.transition = "";
  h.style.opacity = "";
}

/* ── FAQ accordion ───────────────────────────────── */
const faqs = [
  {
    q: "Where can I buy your books?",
    a: 'All my coloring books and notebooks are available on Amazon. Simply search for "CarolineCrafts" or follow the links on the product pages — shipping is handled directly by Amazon.',
  },
  {
    q: "Do you ship internationally?",
    a: "Yes! Because my books are printed and shipped through Amazon KDP, they are available worldwide wherever Amazon operates. Delivery times and costs depend on your location.",
  },
  {
    q: "Can you create a custom design?",
    a: "I occasionally take on custom commissions for coloring books and themed notebooks. Send me a message with your idea and I'll let you know about availability and pricing.",
  },
  {
    q: "How can I follow your creative process?",
    a: "I share behind-the-scenes timelapse videos, new design previews, and sneak peeks on Instagram and TikTok. Follow @carolinecrafts to stay updated on every new release!",
  },
];

const openIndex = ref<number | null>(0);

function toggle(i: number) {
  openIndex.value = openIndex.value === i ? null : i;
}

/* ── Contact form ────────────────────────────────── */
const form = ref({ name: "", email: "", message: "" });
const sent = ref(false);
const sending = ref(false);

function handleSubmit() {
  sending.value = true;
  setTimeout(() => {
    sending.value = false;
    sent.value = true;
    form.value = { name: "", email: "", message: "" };
  }, 900);
}
</script>

<template>
  <main>
    <!-- ── Page hero ──────────────────────────────── -->
    <section class="page-hero">
      <FloatingDecor />
      <div class="container page-hero__inner">
        <span class="page-hero__eyebrow">say hello 🌸</span>
        <h1 class="page-hero__title">Get in Touch</h1>
        <p class="page-hero__sub">
          Questions, collaborations, or just want to share the love?<br />
          I'd love to hear from you.
        </p>
      </div>
    </section>

    <!-- ── Main two-column section ────────────────── -->
    <section class="section contact-section">
      <div class="container contact-cols">
        <!-- LEFT: FAQ accordion -->
        <div class="faq-col reveal">
          <span class="eyebrow">FAQs</span>
          <h2 class="faq-col__heading">
            Answers to commonly<br />asked questions
          </h2>

          <div class="faq-list">
            <div
              v-for="(item, i) in faqs"
              :key="i"
              class="faq-item"
              :class="{ 'faq-item--open': openIndex === i }"
            >
              <button class="faq-item__btn" @click="toggle(i)">
                <span class="faq-item__diamond">◆</span>
                <span class="faq-item__q">{{ item.q }}</span>
                <span class="faq-item__arrow">{{
                  openIndex === i ? "▲" : "▼"
                }}</span>
              </button>
              <Transition
                :css="false"
                @enter="onEnter"
                @after-enter="onAfterEnter"
                @leave="onLeave"
                @after-leave="onAfterLeave"
              >
                <div v-show="openIndex === i" class="faq-item__answer">
                  {{ item.a }}
                </div>
              </Transition>
            </div>
          </div>
        </div>

        <!-- RIGHT: Form + socials -->
        <div class="form-col reveal reveal-delay-2">
          <!-- Form card -->
          <div class="form-card">
            <h2 class="form-card__title">Contact Us</h2>
            <p class="form-card__sub">
              Feel free to reach out — I typically reply within 24 hours 🕐
            </p>

            <Transition name="fade">
              <div v-if="sent" class="success-msg">
                🎉 Message sent! I'll get back to you soon.
              </div>
            </Transition>

            <form v-if="!sent" class="c-form" @submit.prevent="handleSubmit">
              <input
                v-model="form.name"
                class="c-form__input"
                type="text"
                placeholder="Your name"
                required
              />
              <input
                v-model="form.email"
                class="c-form__input"
                type="email"
                placeholder="Your email"
                required
              />
              <textarea
                v-model="form.message"
                class="c-form__input c-form__textarea"
                placeholder="Your message..."
                rows="5"
                required
              />
              <button
                type="submit"
                class="btn btn-primary c-form__submit"
                :disabled="sending"
              >
                {{ sending ? "Sending…" : "Send Message" }}
              </button>
            </form>
          </div>

          <!-- Social follow -->
          <div class="social-follow">
            <span class="social-follow__label">Follow me on:</span>
            <div class="social-cards">
              <!-- Instagram -->
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener"
                class="social-card"
              >
                <div class="social-card__icon">
                  <img :src="instagramIcon" alt="Instagram" />
                </div>
                <span class="social-card__name">Instagram</span>
              </a>

              <!-- TikTok -->
              <a
                href="https://www.tiktok.com"
                target="_blank"
                rel="noopener"
                class="social-card"
              >
                <div class="social-card__icon">
                  <img :src="tiktokIcon" alt="TikTok" />
                </div>
                <span class="social-card__name">TikTok</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
/* ── Page hero ───────────────────────────────────── */
.page-hero {
  position: relative;
  overflow: hidden;
  background: var(--pink-bg);
  padding: 110px 0 80px;
  text-align: center;
}

.page-hero__inner {
  position: relative;
  z-index: 1;
}

.page-hero__eyebrow {
  font-family: var(--font-accent);
  font-size: 2rem;
  color: var(--primrose-deep);
  display: block;
  margin-bottom: 10px;
}

.page-hero__title {
  font-family: var(--font-heading);
  font-size: clamp(2.4rem, 5vw, 3.6rem);
  color: var(--dark);
  margin-bottom: 16px;
}

.page-hero__sub {
  font-size: 1rem;
  color: var(--mid);
  max-width: 520px;
  margin: 0 auto;
  line-height: 1.7;
}

/* ── Contact section ─────────────────────────────── */
.contact-section {
  background: var(--pink-bg);
}

.contact-cols {
  display: grid;
  grid-template-columns: 1fr 1.05fr;
  gap: 48px;
  align-items: start;
}

@media (max-width: 840px) {
  .contact-cols {
    grid-template-columns: 1fr;
    gap: 40px;
  }
}

/* ── FAQ col ─────────────────────────────────────── */
.faq-col__heading {
  font-family: var(--font-heading);
  font-size: 1.75rem;
  color: var(--dark);
  margin-bottom: 28px;
  line-height: 1.3;
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.faq-item {
  background: var(--white);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-soft);
  overflow: hidden;
  transition: box-shadow var(--transition);
}

.faq-item--open {
  box-shadow: var(--shadow-card);
}

.faq-item__btn {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 18px 20px;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  font-family: var(--font-body);
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--dark);
  transition: background var(--transition);
}

.faq-item__btn:hover {
  background: var(--lime-light);
}

.faq-item__diamond {
  color: var(--primrose);
  font-size: 0.65rem;
  flex-shrink: 0;
}

.faq-item__q {
  flex: 1;
}

.faq-item__arrow {
  font-size: 0.55rem;
  color: var(--light-text);
  flex-shrink: 0;
}

.faq-item__answer {
  padding: 12px 20px 18px 44px;
  font-size: 0.9rem;
  color: var(--mid);
  line-height: 1.7;
}

/* FAQ height animation handled by JS hooks in script */

/* ── Form card ───────────────────────────────────── */
.form-card {
  background: var(--white);
  border-radius: var(--radius-lg);
  padding: 36px 34px 32px;
  box-shadow: var(--shadow-card);
  margin-bottom: 24px;
}

.form-card__title {
  font-family: var(--font-heading);
  font-size: 1.9rem;
  color: var(--dark);
  margin-bottom: 6px;
}

.form-card__sub {
  font-size: 0.9rem;
  color: var(--mid);
  margin-bottom: 24px;
}

.success-msg {
  background: var(--lime-light);
  color: var(--lime-dark);
  border-radius: var(--radius-sm);
  padding: 14px 18px;
  font-weight: 700;
  font-size: 0.95rem;
}

.c-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.c-form__input {
  width: 100%;
  padding: 13px 18px;
  border: 1.5px solid #f0dde0;
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  font-size: 0.9rem;
  color: var(--dark);
  background: var(--pink-bg);
  outline: none;
  transition:
    border-color var(--transition),
    box-shadow var(--transition);
}

.c-form__input::placeholder {
  color: var(--light-text);
}

.c-form__input:focus {
  border-color: var(--primrose);
  box-shadow: 0 0 0 3px rgba(242, 151, 160, 0.18);
}

.c-form__textarea {
  resize: vertical;
  min-height: 120px;
}

.c-form__submit {
  width: 100%;
  margin-top: 4px;
}
.c-form__submit:disabled {
  opacity: 0.65;
  cursor: not-allowed;
  transform: none;
}

/* ── Social follow ───────────────────────────────── */
.social-follow__label {
  font-family: var(--font-accent);
  font-size: 1.3rem;
  color: var(--mid);
  display: block;
  margin-bottom: 14px;
}

.social-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.social-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 16px 14px;
  background: var(--white);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card);
  text-decoration: none;
  transition:
    transform var(--transition),
    box-shadow var(--transition);
}

.social-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-hover);
}

.social-card__icon {
  width: 52px;
  height: 52px;
  margin-top: 4px;
}
.social-card__icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 10px;
}

.social-card__name {
  font-family: var(--font-body);
  font-weight: 700;
  font-size: 0.85rem;
  color: var(--dark);
}
</style>
