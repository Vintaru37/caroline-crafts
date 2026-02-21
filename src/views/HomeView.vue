<script setup lang="ts">
import { RouterLink } from "vue-router";
import FloatingDecor from "../components/FloatingDecor.vue";
import { useReveal } from "../composables/useReveal";
import aboutMeImg from "../assets/images/about-me2.png";
import instagramIcon from "../assets/images/instagram-icon.png";
import tiktokIcon from "../assets/images/tiktok-icon.png";

useReveal();

const features = [
  {
    icon: "🎨",
    title: "Coloring Books",
    desc: "Beautiful floral, mandala and nature patterns. Perfect relaxation for adults and children.",
    to: { path: "/products", query: { kind: "coloring-books" } },
    color: "var(--primrose)",
    bg: "var(--pinktone)",
  },
  {
    icon: "📓",
    title: "Notebooks",
    desc: "Elegant bullet journals, notebooks and diaries in soft pastel covers.",
    to: { path: "/products", query: { kind: "notebooks" } },
    color: "var(--lime-dark)",
    bg: "#dfe3c0",
  },
];
</script>

<template>
  <main>
    <!-- ═══ HERO ═══════════════════════════════════════════════════ -->
    <section class="hero">
      <FloatingDecor />

      <div class="container hero__content reveal">
        <p class="hero__badge">✨ Welcome to my world!</p>
        <h1 class="hero__title">
          Caroline<span class="hero__title-accent">Crafts</span>
        </h1>
        <p class="hero__sub">
          I design coloring books &amp; notebooks<br />that inspire creativity
          and mindful relaxation.
        </p>
        <p class="hero__desc">
          Every design is crafted by hand with love for detail. Find them on
          Amazon – ready to brighten your day 🌸
        </p>
        <div class="hero__actions">
          <RouterLink
            :to="{ path: '/products', query: { kind: 'coloring-books' } }"
            class="btn btn-primary"
          >
            🎨 Coloring Books
          </RouterLink>
          <RouterLink
            :to="{ path: '/products', query: { kind: 'notebooks' } }"
            class="btn btn-lime"
          >
            📓 Notebooks
          </RouterLink>
          <RouterLink to="/contact" class="btn btn-outline">
            Get in touch
          </RouterLink>
        </div>

        <div class="hero__badges">
          <span class="pill">🛒 Available on Amazon</span>
          <span class="pill">📦 Worldwide shipping</span>
          <span class="pill">💌 Made with love</span>
        </div>
      </div>
    </section>

    <!-- ═══ ABOUT ══════════════════════════════════════════════════ -->
    <section class="section about">
      <div class="container about__inner">
        <div class="about__visual">
          <div class="about__avatar">
            <img
              :src="aboutMeImg"
              alt="About Caroline"
              class="about__avatar-img"
            />
          </div>
        </div>
        <div class="about__text reveal reveal-delay-1">
          <p class="about__eyebrow">About me</p>
          <h2 class="section-title">Hi, I'm Caroline!</h2>
          <p class="about__body">
            I'm a creator who loves combining art with functionality. I design
            beautiful coloring books and elegant notebooks available on Amazon.
          </p>
          <p class="about__body">
            Every page, every pattern – is a piece of my heart. I believe that
            coloring and handwriting are the most beautiful forms of relaxation.
            🌿
          </p>
          <RouterLink to="/contact" class="btn btn-primary about__btn">
            Let's get to know each other
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- ═══ CATEGORIES ═════════════════════════════════════════════ -->
    <section class="section categories">
      <div class="container">
        <p class="section-eyebrow reveal">What I create</p>
        <h2 class="section-title reveal reveal-delay-1">My Products</h2>
        <p class="section-subtitle reveal reveal-delay-2">
          Each product is a unique design – take a look and find something for
          yourself
        </p>

        <div class="features-grid">
          <RouterLink
            v-for="(feat, i) in features"
            :key="feat.title"
            :to="feat.to"
            class="feature-card reveal"
            :class="`reveal-delay-${i + 2}`"
            :style="{ '--accent': feat.color, '--bg': feat.bg }"
          >
            <div class="feature-card__icon">{{ feat.icon }}</div>
            <h3 class="feature-card__title">{{ feat.title }}</h3>
            <p class="feature-card__desc">{{ feat.desc }}</p>
            <span class="feature-card__cta">Discover →</span>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- ═══ AMAZON CTA ════════════════════════════════════════════ -->
    <section class="cta-banner">
      <div class="container cta-banner__inner reveal">
        <div class="cta-banner__text">
          <h2 class="cta-banner__title">Find my products<br />on Amazon 🛒</h2>
          <p class="cta-banner__sub">
            Order today and get your piece of inspiration!
          </p>
        </div>
        <a
          href="https://www.amazon.com"
          target="_blank"
          rel="noopener noreferrer"
          class="btn btn-primary cta-banner__btn"
        >
          Shop on Amazon →
        </a>
      </div>
    </section>

    <!-- ═══ SOCIAL ════════════════════════════════════════════════ -->
    <section class="section social-section">
      <div class="container social-section__inner">
        <p class="section-eyebrow reveal">Follow me</p>
        <h2 class="section-title reveal reveal-delay-1">Stay up to date</h2>
        <p class="section-subtitle reveal reveal-delay-2">
          Check in for new designs, inspiration and behind-the-scenes creative
          content
        </p>

        <div class="social-cards">
          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            class="social-card social-card--ig"
          >
            <div class="social-card__icon">
              <img :src="instagramIcon" alt="Instagram" />
            </div>
            <div class="social-card__body">
              <strong>Instagram</strong>
              <span>@carolinecrafts</span>
            </div>
            <span class="social-card__arrow">→</span>
          </a>

          <a
            href="https://www.tiktok.com"
            target="_blank"
            rel="noopener noreferrer"
            class="social-card social-card--tt"
          >
            <div class="social-card__icon">
              <img :src="tiktokIcon" alt="TikTok" />
            </div>
            <div class="social-card__body">
              <strong>TikTok</strong>
              <span>@carolinecrafts</span>
            </div>
            <span class="social-card__arrow">→</span>
          </a>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
/* ── HERO ──────────────────────────────────────────── */
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  background: var(--pink-bg);
  overflow: hidden;
  padding-top: 68px;
}

.hero__content {
  position: relative;
  z-index: 1;
  padding: 60px 24px;
  max-width: 700px;
}

.hero__badge {
  display: inline-block;
  background: var(--white);
  color: var(--primrose-deep);
  font-family: var(--font-accent);
  font-size: 1.15rem;
  padding: 6px 18px;
  border-radius: 50px;
  margin-bottom: 20px;
  box-shadow: var(--shadow-soft);
  border: 1.5px solid var(--pinktone);
}

.hero__title {
  font-size: clamp(3rem, 8vw, 5.5rem);
  color: var(--dark);
  margin-bottom: 16px;
  line-height: 1.1;
}

.hero__title-accent {
  color: var(--primrose);
}

.hero__sub {
  font-size: clamp(1.1rem, 3vw, 1.4rem);
  color: var(--mid);
  margin-bottom: 14px;
  font-style: italic;
}

.hero__desc {
  font-size: 0.95rem;
  color: var(--mid);
  max-width: 520px;
  margin-bottom: 36px;
  line-height: 1.7;
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 32px;
}

.hero__badges {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.pill {
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid var(--pinktone);
  border-radius: 50px;
  padding: 5px 14px;
  font-size: 0.82rem;
  color: var(--mid);
  font-weight: 500;
}

/* ── ABOUT ─────────────────────────────────────────── */
.about {
  background: var(--white);
  border-top: 1px solid var(--primrose-light);
}

.about__inner {
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  align-items: center;
}

.about__visual {
  position: relative;
  display: flex;
  justify-content: center;
}

.about__avatar {
  width: 270px;
  aspect-ratio: 1024/1536;
  position: relative;
  z-index: 1;
}

.about__avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 6px;
}

.about__eyebrow,
.section-eyebrow {
  font-family: var(--font-accent);
  font-size: 1.8rem;
  font-weight: 400;
  letter-spacing: 0;
  text-transform: none;
  color: var(--primrose);
  display: block;
  margin-bottom: 6px;
}

.about__body {
  color: var(--mid);
  margin-bottom: 16px;
  line-height: 1.75;
}

.about__btn {
  margin-top: 8px;
}

/* ── CATEGORIES ────────────────────────────────────── */
.categories {
  background: var(--pink-bg);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 28px;
}

.feature-card {
  background: var(--white);
  border-radius: var(--radius-lg);
  padding: 40px 36px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: var(--shadow-card);
  transition:
    transform var(--transition),
    box-shadow var(--transition);
  border-top: 4px solid var(--accent);
}

.feature-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 48px rgba(61, 43, 43, 0.16);
}

.feature-card__icon {
  font-size: 2.8rem;
  width: 64px;
  height: 64px;
  background: var(--bg);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
}

.feature-card__title {
  font-size: 1.5rem;
  color: var(--dark);
}

.feature-card__desc {
  font-size: 0.9rem;
  color: var(--mid);
  line-height: 1.65;
  flex: 1;
}

.feature-card__cta {
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--accent);
}

/* ── CTA BANNER ─────────────────────────────────────── */
.cta-banner {
  background: var(--primrose);
  padding: 60px 0;
}

.cta-banner__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  flex-wrap: wrap;
}

.cta-banner__title {
  font-size: 2rem;
  color: var(--white);
  margin-bottom: 8px;
}

.cta-banner__sub {
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.95rem;
}

.cta-banner__btn {
  background: var(--white);
  color: var(--primrose);
  border-color: var(--white);
  white-space: nowrap;
  flex-shrink: 0;
}

.cta-banner__btn:hover {
  background: var(--yucca);
  border-color: var(--yucca);
}

/* ── SOCIAL ─────────────────────────────────────────── */
.social-section {
  background: var(--white);
  border-top: 1px solid var(--primrose-light);
}

.social-section__inner {
  text-align: center;
}

.social-cards {
  display: flex;
  justify-content: center;
  gap: 24px;
  flex-wrap: wrap;
  margin-top: 8px;
}

.social-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 32px;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  transition:
    transform var(--transition),
    box-shadow var(--transition);
  min-width: 240px;
}

.social-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 36px rgba(61, 43, 43, 0.18);
}

.social-card--ig {
  background: var(--primrose-light);
}
.social-card--tt {
  background: var(--lime-light);
}

.social-card__icon {
  width: 52px;
  height: 52px;
}
.social-card__icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 8px;
}

.social-card__body {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.social-card__body strong {
  font-size: 1rem;
  color: var(--dark);
}

.social-card__body span {
  font-size: 0.83rem;
  color: var(--mid);
}

.social-card__arrow {
  margin-left: auto;
  font-size: 1.2rem;
  color: var(--mid);
  transition: transform var(--transition);
}

.social-card:hover .social-card__arrow {
  transform: translateX(4px);
}

/* ── Responsive ─────────────────────────────────────── */
@media (max-width: 900px) {
  .about__inner {
    grid-template-columns: 1fr;
  }
  .about__visual {
    display: none;
  }
  .features-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .hero__actions {
    flex-direction: column;
  }
  .cta-banner__inner {
    text-align: center;
    justify-content: center;
  }
}
</style>
