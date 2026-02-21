<script setup lang="ts">
import { RouterLink } from "vue-router";

import cbImg1 from "../assets/images/coloring-books/no-thoughts-only-awawa.webp";
import cbImg2 from "../assets/images/coloring-books/huggy-friends.webp";
import cbImg3 from "../assets/images/coloring-books/little-reminders.webp";
import nbImg1 from "../assets/images/notebooks/cute-axolotl.webp";
import nbImg2 from "../assets/images/notebooks/cute-kawaii-rock-hyrax.webp";
import nbImg3 from "../assets/images/notebooks/happy-like-quokka.webp";

const features = [
  {
    title: "Coloring Books",
    desc: "Beautiful floral, mandala and nature patterns. Perfect relaxation for adults and children.",
    to: { path: "/products", query: { kind: "coloring-books" } },
    type: "coloring",
    fanImages: [cbImg1, cbImg2, cbImg3],
    gradFrom: "#fff1f4",
    gradMid: "#ffd9e9",
    gradTo: "#ffc8e0",
    glow: "rgba(255,182,193,0.24)",
    orb1: "rgba(255,197,208,0.32)",
    orb2: "rgba(255,229,235,0.22)",
    ctaBg: "rgba(255,255,255,0.28)",
    ctaColor: "#c026a0",
    sparkles: ["✦", "✿", "✦", "❀"],
  },
  {
    title: "Notebooks",
    desc: "Elegant bullet journals, notebooks and diaries in soft pastel covers.",
    to: { path: "/products", query: { kind: "notebooks" } },
    type: "notebook",
    fanImages: [nbImg1, nbImg2, nbImg3],
    gradFrom: "#f8fff9",
    gradMid: "#c6e9d0",
    gradTo: "#aedfb6",
    glow: "rgba(170,220,140,0.20)",
    orb1: "rgba(180,225,140,0.28)",
    orb2: "rgba(210,240,185,0.16)",
    ctaBg: "rgba(255,255,255,0.22)",
    ctaColor: "var(--lime-dark)",
    sparkles: ["✦", "✿", "✦", "❀"],
  },
];
</script>

<template>
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
          :class="[
            'feature-card reveal',
            `reveal-delay-${i + 2}`,
            feat.type ? `is-${feat.type}` : '',
          ]"
          :style="{
            '--grad-from': feat.gradFrom,
            '--grad-mid': feat.gradMid,
            '--grad-to': feat.gradTo,
            '--glow': feat.glow,
            '--orb1': feat.orb1,
            '--orb2': feat.orb2,
            '--cta-bg': feat.ctaBg,
            '--cta-color': feat.ctaColor,
          }"
        >
          <!-- decorative blurred orbs -->
          <span class="orb orb--a" aria-hidden="true" />
          <span class="orb orb--b" aria-hidden="true" />

          <!-- shimmer sweep -->
          <span class="shimmer" aria-hidden="true" />

          <!-- floating sparkle chars -->
          <span
            v-for="(sp, si) in feat.sparkles"
            :key="si"
            class="sparkle"
            :class="`sparkle--${si}`"
            aria-hidden="true"
            >{{ sp }}</span
          >

          <!-- book fan -->
          <div class="feature-card__fan" aria-hidden="true">
            <img
              v-for="(img, fi) in feat.fanImages"
              :key="fi"
              :src="img"
              :class="`fan-book fan-book--${fi}`"
              alt=""
            />
          </div>

          <!-- text -->
          <h3 class="feature-card__title">{{ feat.title }}</h3>
          <p class="feature-card__desc">{{ feat.desc }}</p>

          <!-- CTA pill -->
          <span class="feature-card__cta">
            <span class="feature-card__cta-text">Discover collection</span>
            <span class="feature-card__cta-arrow">→</span>
          </span>
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ── Section ─────────────────────────────────────── */
.categories {
  background: var(--pink-bg);
}

.section-eyebrow {
  font-family: var(--font-accent);
  font-size: 1.8rem;
  font-weight: 400;
  color: var(--primrose);
  display: block;
  margin-bottom: 6px;
}

/* ── Grid ────────────────────────────────────────── */
.features-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32px;
}

/* ── Card base ───────────────────────────────────── */
.feature-card {
  position: relative;
  overflow: hidden;
  border-radius: 36px;
  padding: 24px 32px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  background: linear-gradient(
    135deg,
    var(--grad-from) 0%,
    var(--grad-mid) 50%,
    var(--grad-to) 100%
  );
  box-shadow:
    0 8px 32px var(--glow),
    0 2px 8px rgba(61, 43, 43, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
  transition:
    transform 0.38s cubic-bezier(0.23, 1, 0.32, 1),
    box-shadow 0.38s cubic-bezier(0.23, 1, 0.32, 1);
  cursor: pointer;
  text-decoration: none;
}

.feature-card::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.55) 0%,
    rgba(255, 255, 255, 0.08) 60%,
    transparent 100%
  );
  pointer-events: none;
  z-index: 1;
}

.feature-card:hover {
  transform: translateY(-10px) scale(1.018);
  box-shadow:
    0 28px 64px var(--glow),
    0 8px 24px rgba(61, 43, 43, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.7);
}

.feature-card:hover .shimmer {
  transform: translateX(220%) skewX(-20deg);
}

/* ── Decorative orbs ─────────────────────────────── */
.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(32px);
  pointer-events: none;
  z-index: 0;
}

.orb--a {
  width: 200px;
  height: 200px;
  background: var(--orb1);
  bottom: -60px;
  right: -50px;
}

.orb--b {
  width: 130px;
  height: 130px;
  background: var(--orb2);
  top: -40px;
  left: 30px;
}

/* ── Shimmer sweep ───────────────────────────────── */
.shimmer {
  position: absolute;
  top: 0;
  left: -80%;
  width: 60%;
  height: 100%;
  background: linear-gradient(
    120deg,
    transparent 0%,
    rgba(255, 255, 255, 0.48) 50%,
    transparent 100%
  );
  transform: translateX(-100%) skewX(-20deg);
  transition: transform 0.72s cubic-bezier(0.23, 1, 0.32, 1);
  pointer-events: none;
  z-index: 2;
}

/* ── Floating sparkles ───────────────────────────── */
.sparkle {
  position: absolute;
  font-size: 1rem;
  opacity: 0.45;
  pointer-events: none;
  z-index: 1;
  color: rgba(255, 255, 255, 0.9);
  animation: floatSpark 5s ease-in-out infinite;
}

.sparkle--0 {
  top: 14%;
  right: 18%;
  animation-delay: 0s;
  font-size: 0.85rem;
}
.sparkle--1 {
  top: 38%;
  right: 9%;
  animation-delay: 1.3s;
  font-size: 1.1rem;
}
.sparkle--2 {
  bottom: 22%;
  right: 22%;
  animation-delay: 0.6s;
  font-size: 0.7rem;
}
.sparkle--3 {
  bottom: 14%;
  right: 10%;
  animation-delay: 2s;
  font-size: 0.9rem;
}

@keyframes floatSpark {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
    opacity: 0.4;
  }
  50% {
    transform: translateY(-8px) rotate(15deg);
    opacity: 0.75;
  }
}

/* ── Book fan ────────────────────────────────────── */
.feature-card__fan {
  position: relative;
  z-index: 3;
  width: 100%;
  height: 240px;
  margin: 0 0 32px;
  flex-shrink: 0;
}

.fan-book {
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 148px;
  height: 210px;
  border-radius: 10px;
  box-shadow:
    0 12px 32px rgba(0, 0, 0, 0.28),
    0 4px 10px rgba(0, 0, 0, 0.16);
  transform-origin: bottom center;
  transition: transform 0.42s cubic-bezier(0.23, 1, 0.32, 1);
  border: 3px solid rgba(255, 255, 255, 0.8);
}

.fan-book--0 {
  transform: translate(calc(-50% - 22px), 12px) rotate(-18deg);
  z-index: 1;
}
.fan-book--1 {
  transform: translateX(-50%) rotate(0deg);
  z-index: 3;
}
.fan-book--2 {
  transform: translate(calc(-50% + 22px), 12px) rotate(18deg);
  z-index: 2;
}

.feature-card:hover .fan-book--0 {
  transform: translate(calc(-50% - 54px), 12px) rotate(-26deg);
}
.feature-card:hover .fan-book--1 {
  transform: translateX(-50%) rotate(0deg) scale(1.07) translateY(-6px);
}
.feature-card:hover .fan-book--2 {
  transform: translate(calc(-50% + 54px), 12px) rotate(26deg);
}

/* ── Coloring books: square-ish fan images ───────────────────────── */
.feature-card.is-coloring .feature-card__fan {
  height: 220px;
}
.feature-card.is-coloring .fan-book {
  width: 180px;
  height: 180px;
  border-radius: 12px;
}
.feature-card.is-coloring .fan-book--0 {
  transform: translate(calc(-50% - 38px), 8px) rotate(-14deg);
  z-index: 1;
}
.feature-card.is-coloring .fan-book--1 {
  transform: translateX(-50%) rotate(0deg);
  z-index: 3;
}
.feature-card.is-coloring .fan-book--2 {
  transform: translate(calc(-50% + 38px), 8px) rotate(14deg);
  z-index: 2;
}
.feature-card.is-coloring:hover .fan-book--0 {
  transform: translateX(calc(-50% - 72px)) rotate(-22deg);
}
.feature-card.is-coloring:hover .fan-book--1 {
  transform: translateX(-50%) rotate(0deg) scale(1.08) translateY(-6px);
}
.feature-card.is-coloring:hover .fan-book--2 {
  transform: translateX(calc(-50% + 72px)) rotate(22deg);
}

/* ── Text ────────────────────────────────────────── */
.feature-card__title {
  position: relative;
  z-index: 3;
  font-family: var(--font-heading);
  font-size: 1.9rem;
  color: var(--dark);
  line-height: 1.2;
  text-shadow: 0 1px 3px rgba(255, 255, 255, 0.6);
}

.feature-card__desc {
  position: relative;
  z-index: 3;
  font-size: 0.93rem;
  color: #5a4040;
  line-height: 1.7;
  flex: 1;
  max-width: 88%;
}

/* ── CTA pill ────────────────────────────────────── */
.feature-card__cta {
  position: relative;
  z-index: 3;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  align-self: flex-start;
  margin-top: 6px;
  padding: 10px 22px;
  border-radius: 999px;
  background: var(--cta-bg);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1.5px solid rgba(255, 255, 255, 0.75);
  color: var(--cta-color);
  font-weight: 700;
  font-size: 0.88rem;
  letter-spacing: 0.02em;
  box-shadow:
    0 2px 12px rgba(0, 0, 0, 0.07),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  transition:
    gap 0.28s ease,
    background 0.28s ease,
    box-shadow 0.28s ease;
}

.feature-card:hover .feature-card__cta {
  background: rgba(255, 255, 255, 0.5);
  box-shadow:
    0 4px 20px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 1);
}

.feature-card__cta-arrow {
  transition: transform 0.28s ease;
}

.feature-card:hover .feature-card__cta-arrow {
  transform: translateX(5px);
}

/* ── Responsive ──────────────────────────────────── */
@media (max-width: 900px) {
  .features-grid {
    grid-template-columns: 1fr;
  }

  .feature-card {
    padding: 40px 32px 38px;
  }
}

@media (max-width: 480px) {
  .feature-card {
    padding: 34px 24px 32px;
    border-radius: 28px;
  }

  .feature-card__title {
    font-size: 1.6rem;
  }
}
</style>
