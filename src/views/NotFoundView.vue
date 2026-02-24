<template>
  <div class="nf">
    <!-- soft background blobs -->
    <div class="nf-bg" aria-hidden="true">
      <div class="nf-bg__blob nf-bg__blob--a"></div>
      <div class="nf-bg__blob nf-bg__blob--b"></div>
      <div class="nf-bg__blob nf-bg__blob--c"></div>
    </div>

    <!-- CSS-only floating petals -->
    <div class="nf-petals" aria-hidden="true">
      <div class="petal petal--1"></div>
      <div class="petal petal--2"></div>
      <div class="petal petal--3"></div>
      <div class="petal petal--4"></div>
      <div class="petal petal--5"></div>
      <div class="petal petal--6"></div>
      <div class="petal petal--7"></div>
      <div class="petal petal--8"></div>
    </div>

    <!-- decorative rings -->
    <div class="nf-ring nf-ring--1" aria-hidden="true"></div>
    <div class="nf-ring nf-ring--2" aria-hidden="true"></div>
    <div class="nf-ring nf-ring--3" aria-hidden="true"></div>

    <!-- main content -->
    <div class="nf__content">
      <!-- ornament row -->
      <div class="nf__ornament" aria-hidden="true">
        <span class="orn-line"></span>
        <span class="orn-diamond"></span>
        <span class="orn-diamond orn-diamond--lg"></span>
        <span class="orn-diamond"></span>
        <span class="orn-line"></span>
      </div>

      <!-- 404 -->
      <div class="nf__code" aria-label="404">
        <span class="nf__digit nf__digit--4a">4</span>
        <span class="nf__digit nf__digit--0">0</span>
        <span class="nf__digit nf__digit--4b">4</span>
      </div>

      <h1 class="nf__title">Page not found</h1>

      <p class="nf__sub">
        This page seems to have drifted off somewhere quiet.<br />
        Let's bring you back to where the pretty things are.
      </p>

      <!-- divider -->
      <div class="nf__divider" aria-hidden="true">
        <span></span><span class="nf__divider-dot"></span><span></span>
      </div>

      <RouterLink to="/" class="nf__btn"> Back to CarolineCrafts </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>

<style scoped>
/* ══ WRAPPER ════════════════════════════════════════════════ */
.nf {
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 2rem 1.5rem;
  background: var(--pink-bg);
}

/* ══ BLOBS ═══════════════════════════════════════════════════ */
.nf-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.nf-bg__blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
}
.nf-bg__blob--a {
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, #fbc9d4 0%, #fde8ec 100%);
  top: -200px;
  left: -180px;
  opacity: 0.55;
  animation: blobDrift 14s ease-in-out infinite alternate;
}
.nf-bg__blob--b {
  width: 420px;
  height: 420px;
  background: radial-gradient(circle, #fde0e8 0%, #fff4f5 100%);
  bottom: -130px;
  right: -120px;
  opacity: 0.5;
  animation: blobDrift 18s ease-in-out infinite alternate-reverse;
}
.nf-bg__blob--c {
  width: 260px;
  height: 260px;
  background: radial-gradient(circle, #fdeaec 0%, #fde8ec 100%);
  top: 45%;
  left: 58%;
  opacity: 0.4;
  animation: blobDrift 11s ease-in-out 2s infinite alternate;
}
@keyframes blobDrift {
  from {
    transform: translate(0, 0) scale(1);
  }
  to {
    transform: translate(28px, 18px) scale(1.06);
  }
}

/* ══ DECORATIVE RINGS ════════════════════════════════════════ */
.nf-ring {
  position: absolute;
  border-radius: 50%;
  border: 1.5px solid rgba(242, 151, 160, 0.18);
  pointer-events: none;
  animation: ringExpand 8s ease-in-out infinite;
}
.nf-ring--1 {
  width: 320px;
  height: 320px;
  top: -60px;
  left: -80px;
  animation-delay: 0s;
}
.nf-ring--2 {
  width: 200px;
  height: 200px;
  bottom: 40px;
  right: -50px;
  animation-delay: 2s;
}
.nf-ring--3 {
  width: 140px;
  height: 140px;
  top: 30%;
  right: 12%;
  animation-delay: 4s;
}
@keyframes ringExpand {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.6;
  }
  50% {
    transform: scale(1.08);
    opacity: 0.25;
  }
}

/* ══ FLOATING PETALS (CSS shapes) ════════════════════════════ */
.nf-petals {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}
.petal {
  position: absolute;
  border-radius: 50% 0 50% 0;
  background: rgba(242, 151, 160, 0.18);
  animation: petalDrift 9s ease-in-out infinite;
}
.petal--1 {
  width: 18px;
  height: 28px;
  top: 8%;
  left: 6%;
  animation-duration: 8s;
  animation-delay: 0s;
  transform: rotate(20deg);
}
.petal--2 {
  width: 14px;
  height: 22px;
  top: 22%;
  left: 15%;
  animation-duration: 11s;
  animation-delay: 1.5s;
  transform: rotate(-30deg);
  background: rgba(249, 208, 206, 0.25);
}
.petal--3 {
  width: 20px;
  height: 30px;
  top: 10%;
  right: 8%;
  animation-duration: 9s;
  animation-delay: 0.8s;
  transform: rotate(50deg);
}
.petal--4 {
  width: 12px;
  height: 20px;
  top: 35%;
  right: 5%;
  animation-duration: 12s;
  animation-delay: 2s;
  transform: rotate(-15deg);
  background: rgba(249, 208, 206, 0.2);
}
.petal--5 {
  width: 22px;
  height: 32px;
  bottom: 25%;
  left: 8%;
  animation-duration: 10s;
  animation-delay: 3s;
  transform: rotate(35deg);
}
.petal--6 {
  width: 16px;
  height: 24px;
  bottom: 15%;
  left: 20%;
  animation-duration: 7s;
  animation-delay: 0.5s;
  transform: rotate(-45deg);
  background: rgba(249, 208, 206, 0.22);
}
.petal--7 {
  width: 18px;
  height: 26px;
  bottom: 20%;
  right: 10%;
  animation-duration: 13s;
  animation-delay: 1s;
  transform: rotate(60deg);
}
.petal--8 {
  width: 14px;
  height: 20px;
  top: 60%;
  right: 18%;
  animation-duration: 9.5s;
  animation-delay: 2.5s;
  transform: rotate(-25deg);
  background: rgba(249, 208, 206, 0.2);
}
@keyframes petalDrift {
  0%,
  100% {
    transform: translateY(0) rotate(20deg) scale(1);
    opacity: 0.7;
  }
  40% {
    transform: translateY(-18px) rotate(35deg) scale(1.06);
    opacity: 1;
  }
  70% {
    transform: translateY(-8px) rotate(10deg) scale(0.96);
    opacity: 0.6;
  }
}

/* ══ CONTENT ═════════════════════════════════════════════════ */
.nf__content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1.25rem;
  max-width: 520px;
  width: 100%;
}

/* ── ornament ────────────────────────────────────────── */
.nf__ornament {
  display: flex;
  align-items: center;
  gap: 6px;
}
.orn-line {
  display: block;
  width: 48px;
  height: 1.5px;
  background: linear-gradient(90deg, transparent, var(--primrose), transparent);
  border-radius: 2px;
}
.orn-diamond {
  display: block;
  width: 6px;
  height: 6px;
  background: var(--primrose);
  transform: rotate(45deg);
  border-radius: 1px;
  opacity: 0.7;
}
.orn-diamond--lg {
  width: 9px;
  height: 9px;
  opacity: 1;
}

/* ── 404 ─────────────────────────────────────────────── */
.nf__code {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 0.04em;
  line-height: 1;
  margin: -0.3rem 0;
}
.nf__digit {
  font-family: var(--font-heading);
  font-size: clamp(6rem, 22vw, 11rem);
  font-weight: 600;
  letter-spacing: -0.04em;
  color: var(--primrose);
  position: relative;
  animation: digitRise 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.nf__digit--4a {
  animation-delay: 0s;
  color: var(--primrose);
}
.nf__digit--0 {
  animation-delay: 0.12s;
  color: var(--pinktone);
  font-size: clamp(5.2rem, 19vw, 9.5rem);
}
.nf__digit--4b {
  animation-delay: 0.24s;
  color: var(--primrose);
}
@keyframes digitRise {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ── title ───────────────────────────────────────────── */
.nf__title {
  font-family: var(--font-heading);
  font-size: clamp(1.5rem, 4.5vw, 2.1rem);
  font-weight: 400;
  font-style: italic;
  color: var(--dark);
  letter-spacing: 0.01em;
}

/* ── sub ─────────────────────────────────────────────── */
.nf__sub {
  font-family: var(--font-body);
  font-size: clamp(0.88rem, 2.4vw, 1rem);
  color: var(--mid);
  line-height: 1.75;
  max-width: 450px;
}

/* ── divider ─────────────────────────────────────────── */
.nf__divider {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  max-width: 260px;
}
.nf__divider span:not(.nf__divider-dot) {
  flex: 1;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(242, 151, 160, 0.4),
    transparent
  );
}
.nf__divider-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--primrose);
  opacity: 0.6;
  flex: none;
}

/* ── button ──────────────────────────────────────────── */
.nf__btn {
  display: inline-block;
  padding: 0.85rem 2.6rem;
  background: var(--primrose);
  color: var(--white);
  font-family: var(--font-body);
  font-weight: 700;
  font-size: 0.95rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  border-radius: var(--radius-xl);
  text-decoration: none;
  box-shadow: 0 6px 22px rgba(242, 151, 160, 0.38);
  transition:
    background var(--transition),
    transform var(--transition),
    box-shadow var(--transition);
  position: relative;
  overflow: hidden;
}
.nf__btn::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.18) 0%,
    transparent 55%
  );
  border-radius: inherit;
  pointer-events: none;
}
.nf__btn:hover {
  background: var(--primrose-deep);
  transform: translateY(-3px);
  box-shadow: 0 12px 32px rgba(242, 151, 160, 0.48);
}
.nf__btn:active {
  transform: translateY(-1px);
}

/* ══ MOBILE ══════════════════════════════════════════════════ */
@media (max-width: 480px) {
  .nf-ring--1,
  .nf-ring--3 {
    display: none;
  }
  .petal--2,
  .petal--4,
  .petal--6,
  .petal--8 {
    display: none;
  }
  .nf__content {
    gap: 1rem;
  }
}
</style>
