<script setup lang="ts">
import { RouterLink } from "vue-router";
import heroBook1 from "../assets/images/coloring-books/no-thoughts-only-awawa.webp";
import heroBook2 from "../assets/images/coloring-books/huggy-friends.webp";
import heroBook3 from "../assets/images/coloring-books/little-reminders.webp";
import heroNotebook from "../assets/images/notebooks/cute-kawaii-rock-hyrax.webp";
import heroNotebook2 from "../assets/images/notebooks/no-need-to-rush.webp";
import heroNotebook3 from "../assets/images/notebooks/happy-like-quokka.webp";
</script>

<template>
  <section class="hero">
    <!-- layered background blobs -->
    <div class="hero-bg">
      <div class="hero-bg__blob hero-bg__blob--a"></div>
      <div class="hero-bg__blob hero-bg__blob--b"></div>
      <div class="hero-bg__blob hero-bg__blob--c"></div>
      <div class="hero-bg__blob hero-bg__blob--d"></div>
    </div>

    <!-- scattered sparkles -->
    <span class="h-spark h-spark--1" aria-hidden="true">✦</span>
    <span class="h-spark h-spark--2" aria-hidden="true">✦</span>
    <span class="h-spark h-spark--3" aria-hidden="true">⬧</span>
    <span class="h-spark h-spark--4" aria-hidden="true">✦</span>
    <span class="h-spark h-spark--5" aria-hidden="true">♡</span>
    <span class="h-spark h-spark--6" aria-hidden="true">✿</span>
    <span class="h-spark h-spark--7" aria-hidden="true">✧</span>
    <span class="h-spark h-spark--8" aria-hidden="true">♡</span>
    <span class="h-spark h-spark--9" aria-hidden="true">✿</span>
    <span class="h-spark h-spark--10" aria-hidden="true">✧</span>

    <!-- floating confetti dots -->
    <div class="hero-dots" aria-hidden="true">
      <div class="h-dot h-dot--1"></div>
      <div class="h-dot h-dot--2"></div>
      <div class="h-dot h-dot--3"></div>
      <div class="h-dot h-dot--4"></div>
      <div class="h-dot h-dot--5"></div>
      <div class="h-dot h-dot--6"></div>
      <div class="h-dot h-dot--7"></div>
      <div class="h-dot h-dot--8"></div>
    </div>

    <div class="container hero__layout">
      <!-- TEXT -->
      <div class="hero__copy">
        <h1 class="hero__headline">
          <span class="hero__hl-bold">Caroline</span>
          <span class="hero__hl-script">Crafts</span>
        </h1>
        <p class="hero__tagline">
          Coloring books & notebooks that<br />help you slow down and
          <em>relax</em>.
        </p>
        <div class="hero__pills">
          <span class="hero__pill">🛒 On Amazon</span>
          <span class="hero__pill">📦 Worldwide shipping</span>
          <span class="hero__pill">💌 Made with love</span>
        </div>
      </div>

      <!-- COLLAGE -->
      <div class="hero__visual">
        <div class="hero__glow"></div>
        <div class="hero__ring"></div>
        <div class="hero__collage">
          <RouterLink
            :to="{ path: '/products', query: { kind: 'coloring-books' } }"
            class="hero__book hero__book--a"
          >
            <div class="hero__book-face">
              <img :src="heroBook1" alt="Book" />
            </div>
          </RouterLink>

          <RouterLink
            :to="{ path: '/products', query: { kind: 'coloring-books' } }"
            class="hero__book hero__book--b"
          >
            <div class="hero__book-face">
              <img :src="heroBook2" alt="Book" />
            </div>
          </RouterLink>

          <RouterLink
            :to="{ path: '/products', query: { kind: 'coloring-books' } }"
            class="hero__book hero__book--c"
          >
            <div class="hero__book-face">
              <img :src="heroBook3" alt="Book" />
            </div>
          </RouterLink>

          <RouterLink
            :to="{ path: '/products', query: { kind: 'notebooks' } }"
            class="hero__book hero__book--d"
          >
            <div class="hero__book-face">
              <img :src="heroNotebook" alt="Book" />
            </div>
          </RouterLink>

          <RouterLink
            :to="{ path: '/products', query: { kind: 'notebooks' } }"
            class="hero__book hero__book--e"
          >
            <div class="hero__book-face">
              <img :src="heroNotebook2" alt="Book" />
            </div>
          </RouterLink>

          <RouterLink
            :to="{ path: '/products', query: { kind: 'notebooks' } }"
            class="hero__book hero__book--f"
          >
            <div class="hero__book-face">
              <img :src="heroNotebook3" alt="Book" />
            </div>
          </RouterLink>
        </div>
      </div>
    </div>

    <!-- scroll indicator -->
    <a href="#about" class="hero__scroll" aria-label="Scroll down">
      <span class="hero__scroll-label">About Me</span>
      <span class="hero__scroll-arrow">↓</span>
    </a>
  </section>
</template>

<style scoped>
/* ── Hero shell ──────────────────────────────────── */
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(160deg, #fff0f3 0%, #fefaf5 45%, #f4f8ec 100%);
  overflow: hidden;
  padding-top: 68px;
}

/* Background blobs */
.hero-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.hero-bg__blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(72px);
}

.hero-bg__blob--a {
  width: 720px;
  height: 720px;
  background: radial-gradient(
    circle,
    rgba(242, 151, 160, 0.42) 0%,
    transparent 70%
  );
  top: -200px;
  right: -160px;
  animation: blobDrift 14s ease-in-out infinite alternate;
}

.hero-bg__blob--b {
  width: 460px;
  height: 460px;
  background: radial-gradient(
    circle,
    rgba(189, 215, 120, 0.26) 0%,
    transparent 70%
  );
  bottom: -100px;
  left: 12%;
  animation: blobDrift 18s ease-in-out infinite alternate-reverse;
}

.hero-bg__blob--c {
  width: 330px;
  height: 330px;
  background: radial-gradient(
    circle,
    rgba(255, 185, 198, 0.3) 0%,
    transparent 70%
  );
  top: 38%;
  left: -80px;
  animation: blobDrift 11s ease-in-out infinite alternate;
  animation-delay: -4s;
}

.hero-bg__blob--d {
  width: 440px;
  height: 440px;
  background: radial-gradient(
    circle,
    rgba(210, 168, 238, 0.18) 0%,
    transparent 70%
  );
  top: 18%;
  right: 8%;
  animation: blobDrift 22s ease-in-out infinite alternate-reverse;
  animation-delay: -8s;
}

@keyframes blobDrift {
  from {
    transform: translate(0, 0) scale(1);
  }
  to {
    transform: translate(26px, 18px) scale(1.06);
  }
}

/* Sparkles */
.h-spark {
  position: absolute;
  pointer-events: none;
  animation: sparkFloat 4s ease-in-out infinite alternate;
  z-index: 1;
  user-select: none;
  line-height: 1;
}

.h-spark--1 {
  top: 18%;
  left: 5%;
  font-size: 1rem;
  animation-delay: 0s;
  color: var(--primrose);
}
.h-spark--2 {
  top: 13%;
  right: 7%;
  font-size: 0.75rem;
  animation-delay: 1.2s;
  color: var(--primrose-deep);
}
.h-spark--3 {
  bottom: 28%;
  left: 4%;
  font-size: 1.3rem;
  animation-delay: 0.5s;
  color: var(--lime-dark);
  opacity: 0.75;
}
.h-spark--4 {
  bottom: 20%;
  right: 5%;
  font-size: 0.85rem;
  animation-delay: 2s;
  color: var(--primrose);
}
.h-spark--5 {
  top: 14%;
  left: 38%;
  font-size: 1.1rem;
  animation-name: sparkHeart;
  animation-delay: 0.8s;
  color: #c9607a;
}
.h-spark--6 {
  top: 44%;
  right: 10%;
  font-size: 1.25rem;
  animation-name: sparkFlower;
  animation-delay: 1.7s;
  color: var(--primrose);
}
.h-spark--7 {
  bottom: 42%;
  right: 27%;
  font-size: 0.9rem;
  animation-delay: 0.3s;
  color: var(--lime-dark);
  opacity: 0.8;
}
.h-spark--8 {
  bottom: 13%;
  left: 30%;
  font-size: 1rem;
  animation-name: sparkHeart;
  animation-delay: 2.4s;
  color: var(--primrose-deep);
}
.h-spark--9 {
  top: 23%;
  left: 49%;
  font-size: 0.8rem;
  animation-name: sparkFlower;
  animation-delay: 1.1s;
  color: var(--primrose);
  opacity: 0.85;
}
.h-spark--10 {
  bottom: 12%;
  right: 28%;
  font-size: 1.15rem;
  animation-name: sparkFlower;
  animation-delay: 3s;
  color: #c9607a;
}

@keyframes sparkFloat {
  from {
    opacity: 0.4;
    transform: translateY(0) rotate(0deg) scale(1);
  }
  to {
    opacity: 1;
    transform: translateY(-12px) rotate(25deg) scale(1.1);
  }
}

@keyframes sparkHeart {
  from {
    opacity: 0.4;
    transform: translateY(0) scale(1);
  }
  to {
    opacity: 1;
    transform: translateY(-11px) scale(1.35);
  }
}

@keyframes sparkFlower {
  from {
    opacity: 0.4;
    transform: rotate(0deg) scale(1);
  }
  to {
    opacity: 0.95;
    transform: rotate(42deg) scale(1.18);
  }
}

/* Confetti dots */
.hero-dots {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.h-dot {
  position: absolute;
  border-radius: 50%;
  animation: dotFloat ease-in-out infinite alternate;
}

.h-dot--1 {
  width: 9px;
  height: 9px;
  background: rgba(242, 151, 160, 0.55);
  top: 16%;
  left: 20%;
  animation-duration: 5.2s;
  animation-delay: 0s;
}
.h-dot--2 {
  width: 6px;
  height: 6px;
  background: rgba(189, 215, 120, 0.65);
  top: 28%;
  right: 20%;
  animation-duration: 7s;
  animation-delay: -1.8s;
}
.h-dot--3 {
  width: 10px;
  height: 10px;
  background: rgba(255, 185, 210, 0.5);
  bottom: 32%;
  right: 14%;
  animation-duration: 6s;
  animation-delay: -3.2s;
}
.h-dot--4 {
  width: 7px;
  height: 7px;
  background: rgba(242, 151, 160, 0.45);
  bottom: 22%;
  left: 18%;
  animation-duration: 8s;
  animation-delay: -0.5s;
}
.h-dot--5 {
  width: 5px;
  height: 5px;
  background: rgba(210, 170, 230, 0.6);
  top: 52%;
  left: 6%;
  animation-duration: 4.8s;
  animation-delay: -2s;
}
.h-dot--6 {
  width: 8px;
  height: 8px;
  background: rgba(255, 185, 198, 0.55);
  top: 38%;
  right: 6%;
  animation-duration: 6.5s;
  animation-delay: -4s;
}
.h-dot--7 {
  width: 6px;
  height: 6px;
  background: rgba(189, 215, 120, 0.5);
  bottom: 46%;
  left: 44%;
  animation-duration: 5.8s;
  animation-delay: -1.2s;
}
.h-dot--8 {
  width: 9px;
  height: 9px;
  background: rgba(210, 170, 230, 0.45);
  top: 70%;
  right: 40%;
  animation-duration: 7.2s;
  animation-delay: -3.8s;
}

@keyframes dotFloat {
  from {
    transform: translateY(0) scale(1);
    opacity: 0.35;
  }
  to {
    transform: translateY(-18px) scale(1.15);
    opacity: 0.85;
  }
}

/* Two-column grid */
.hero__layout {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 24px;
  padding-top: 48px;
  padding-bottom: 96px;
  position: relative;
  z-index: 1;
}

/* ─── Text side ─── */
.hero__copy {
  display: flex;
  flex-direction: column;
}

.hero__headline {
  margin: 0 0 22px;
  animation: fadeInUp 0.7s 0.1s ease both;
}

.hero__hl-bold {
  display: block;
  font-family: var(--font-heading);
  font-size: clamp(4.2rem, 8.5vw, 6rem);
  font-weight: 700;
  color: var(--dark);
  line-height: 0.88;
  letter-spacing: -3px;
}

.hero__hl-script {
  display: block;
  font-family: var(--font-accent);
  font-size: clamp(3.4rem, 5.5vw, 5.2rem);
  font-weight: 400;
  line-height: 1.05;
  background: linear-gradient(
    130deg,
    #b84860 0%,
    var(--primrose) 55%,
    #f9b8c5 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero__tagline {
  font-size: clamp(1rem, 2vw, 1.15rem);
  color: var(--mid);
  line-height: 1.75;
  margin-bottom: 36px;
  animation: fadeInUp 0.7s 0.2s ease both;
}

.hero__tagline em {
  font-style: italic;
  font-weight: 700;
  color: var(--primrose-deep);
}

.hero__pills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  animation: fadeInUp 0.7s 0.42s ease both;
}

.hero__pill {
  background: rgba(255, 255, 255, 0.75);
  border: 1px solid rgba(242, 151, 160, 0.38);
  border-radius: 50px;
  padding: 5px 13px;
  font-size: 0.8rem;
  color: var(--mid);
  font-weight: 500;
}

/* ─── Visual side ─── */
.hero__visual {
  position: relative;
  height: 520px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeInRight 0.9s 0.25s ease both;
}

.hero__glow {
  position: absolute;
  inset: -40px;
  background: radial-gradient(
    circle at 55% 50%,
    rgba(242, 151, 160, 0.3) 0%,
    rgba(189, 215, 120, 0.12) 50%,
    transparent 70%
  );
  filter: blur(24px);
  border-radius: 50%;
  animation: glowPulse 6s ease-in-out infinite alternate;
}

@keyframes glowPulse {
  from {
    opacity: 0.75;
    transform: scale(0.96);
  }
  to {
    opacity: 1;
    transform: scale(1.04);
  }
}

.hero__ring {
  position: absolute;
  width: 520px;
  height: 520px;
  border-radius: 50%;
  border: 2px dashed rgba(242, 151, 160, 0.38);
  animation: ringRotate 40s linear infinite;
  pointer-events: none;
}

@keyframes ringRotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.hero__collage {
  position: relative;
  width: 460px;
  height: 480px;
  margin-top: 1rem;
}

@keyframes floatBook {
  from {
    transform: translateY(0px);
  }
  to {
    transform: translateY(-20px);
  }
}

.hero__book {
  position: absolute;
  animation: floatBook ease-in-out infinite alternate;
  cursor: pointer;
  transition: all 0.1s;
}

/* when hovering the collage, dim non-hovered books; hovered book stays fully opaque and above */
.hero__collage:hover .hero__book:not(:hover) {
  opacity: 0.5;
  transition: opacity 0.22s ease;
}
.hero__book:hover {
  opacity: 1;
  z-index: 9999;
  transition: all 0.12 ease;
}

.hero__book--a {
  width: 230px;
  height: 230px;
  top: 30px;
  left: 0;
  z-index: 2;
  --rot: -11deg;
  animation-duration: 5.8s;
  animation-delay: 0s;
}

.hero__book--b {
  width: 230px;
  height: 230px;
  top: 18px;
  left: 136px;
  z-index: 4;
  --rot: 2deg;
  animation-duration: 6.4s;
  animation-delay: -2.1s;
}

.hero__book--c {
  width: 230px;
  height: 230px;
  top: 30px;
  right: 0;
  z-index: 3;
  --rot: 13deg;
  animation-duration: 7.2s;
  animation-delay: -4s;
}

.hero__book--d {
  width: 170px;
  height: 234px;
  bottom: 14px;
  left: 152px;
  z-index: 5;
  --rot: -6deg;
  animation-duration: 5.2s;
  animation-delay: -1s;
}

.hero__book--e {
  width: 152px;
  height: 210px;
  bottom: 18px;
  left: 10px;
  z-index: 1;
  --rot: -14deg;
  animation-duration: 6.8s;
  animation-delay: -2.6s;
}

.hero__book--f {
  width: 152px;
  height: 210px;
  bottom: 10px;
  right: 10px;
  z-index: 1;
  --rot: 12deg;
  animation-duration: 6.2s;
  animation-delay: -3.4s;
}

.hero__book-face {
  width: 100%;
  height: 100%;
  border-radius: 6px;
  overflow: hidden;
  transform: rotate(var(--rot, 0deg));
  box-shadow:
    0 18px 52px rgba(61, 43, 43, 0.22),
    0 4px 14px rgba(61, 43, 43, 0.1);
  transition:
    transform 0.38s ease,
    box-shadow 0.38s ease;
  will-change: transform;
}

.hero__book-face img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: fill;
}

.hero__book:hover .hero__book-face {
  transform: rotate(var(--rot, 0deg)) scale(1.07) translateY(-8px);
  box-shadow:
    0 36px 90px rgba(61, 43, 43, 0.32),
    0 8px 24px rgba(61, 43, 43, 0.15);
}

/* Scroll hint */
.hero__scroll {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  text-decoration: none;
  color: var(--light-text);
  opacity: 0.55;
  transition: opacity 0.25s;
  z-index: 2;
}

.hero__scroll:hover {
  opacity: 1;
}

.hero__scroll-label {
  font-size: 0.65rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  font-weight: 600;
}

.hero__scroll-arrow {
  font-size: 1.1rem;
  animation: scrollBounce 2s ease-in-out infinite;
}

@keyframes scrollBounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(7px);
  }
}

/* Entrance animations */
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-18px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(22px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(36px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* ── Responsive ────────────────────────────────── */
@media (max-width: 900px) {
  .hero__layout {
    grid-template-columns: 1fr;
    text-align: center;
    padding-bottom: 80px;
  }

  .hero__visual {
    height: 360px;
  }
  .hero__collage {
    width: 320px;
    height: 340px;
  }
  .hero__book--a {
    width: 150px;
    height: 150px;
    top: 42px;
  }
  .hero__book--b {
    width: 160px;
    height: 170px;
    top: 12px;
    left: 85px;
  }
  .hero__book--c {
    width: 150px;
    height: 150px;
    top: 42px;
  }
  .hero__book--d {
    width: 116px;
    height: 154px;
    bottom: 8px;
    left: 104px;
  }

  .hero__book--e {
    width: 104px;
    height: 146px;
    bottom: 4px;
    left: 12px;
  }

  .hero__book--f {
    width: 104px;
    height: 146px;
    bottom: 4px;
    right: 12px;
  }
  .hero__ring {
    width: 340px;
    height: 340px;
  }
  .hero__kicker {
    align-self: center;
  }
  .hero__ctas {
    justify-content: center;
  }
  .hero__pills {
    justify-content: center;
  }
}

@media (max-width: 600px) {
  .hero__ctas {
    flex-direction: column;
  }
}
</style>
