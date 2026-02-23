<template>
  <section class="cta-banner">
    <!-- Shimmer -->
    <span class="cta-shimmer" aria-hidden="true" />

    <!-- Floating sparkles -->
    <span class="cta-spark cta-spark--0" aria-hidden="true">✦</span>
    <span class="cta-spark cta-spark--1" aria-hidden="true">✿</span>
    <span class="cta-spark cta-spark--2" aria-hidden="true">✦</span>
    <span class="cta-spark cta-spark--3" aria-hidden="true">❀</span>

    <div class="container cta-banner__inner reveal">
      <div class="cta-banner__text">
        <span class="cta-eyebrow">available on Amazon</span>
        <h2 class="cta-banner__title">Discover my collection</h2>
        <p class="cta-banner__sub">
          Coloring books and notebooks crafted with love — order today and let
          the inspiration find you.
        </p>
      </div>

      <div class="cta-banner__action">
        <a
          href="https://www.amazon.com/stores/Caroline-Crafts/author/B0FD432Q7J"
          target="_blank"
          rel="noopener noreferrer"
          class="cta-btn"
        >
          <span class="cta-btn__label">Shop on Amazon</span>
          <span class="cta-btn__arrow">→</span>
        </a>
        <p class="cta-banner__note">Fast shipping · Secure checkout</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ── Banner shell ────────────────────────────────── */
.cta-banner {
  position: relative;
  overflow: hidden;
  padding: 60px 0;
  background: linear-gradient(
    135deg,
    #f9c0ca 0%,
    var(--primrose) 45%,
    var(--primrose-deep) 100%
  );
}

/* top-edge highlight */
.cta-banner::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    160deg,
    rgba(255, 255, 255, 0.22) 0%,
    rgba(255, 255, 255, 0.04) 50%,
    transparent 100%
  );
  pointer-events: none;
}

/* ── Shimmer ─────────────────────────────────────── */
.cta-shimmer {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    110deg,
    transparent 30%,
    rgba(255, 255, 255, 0.1) 50%,
    transparent 70%
  );
  pointer-events: none;
}

/* ── Floating sparkles ───────────────────────────── */
.cta-spark {
  position: absolute;
  color: rgba(255, 255, 255, 0.55);
  pointer-events: none;
  animation: ctaSpark 6s ease-in-out infinite;
}
.cta-spark--0 {
  font-size: 1rem;
  top: 12%;
  left: 10%;
  animation-delay: 0s;
}
.cta-spark--1 {
  font-size: 1.4rem;
  top: 70%;
  left: 6%;
  animation-delay: 1.8s;
}
.cta-spark--2 {
  font-size: 0.8rem;
  top: 18%;
  right: 8%;
  animation-delay: 0.9s;
}
.cta-spark--3 {
  font-size: 1.1rem;
  bottom: 18%;
  right: 14%;
  animation-delay: 2.6s;
}

@keyframes ctaSpark {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
    opacity: 0.45;
  }
  50% {
    transform: translateY(-10px) rotate(18deg);
    opacity: 0.9;
  }
}

/* ── Inner layout ────────────────────────────────── */
.cta-banner__inner {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 48px;
  flex-wrap: wrap;
}

/* ── Text block ──────────────────────────────────── */
.cta-eyebrow {
  font-family: var(--font-accent);
  font-size: 1.6rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.82);
  display: block;
  margin-bottom: 4px;
  letter-spacing: 0.02em;
}

.cta-banner__title {
  font-family: var(--font-heading);
  font-size: 2.8rem;
  line-height: 1.18;
  color: var(--white);
  margin-bottom: 16px;
  text-shadow: 0 2px 16px rgba(195, 80, 100, 0.25);
}

.cta-banner__sub {
  font-size: 0.97rem;
  color: rgba(255, 255, 255, 0.82);
  line-height: 1.7;
  max-width: 420px;
}

/* ── Action block ────────────────────────────────── */
.cta-banner__action {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  flex-shrink: 0;
}

/* ── CTA button ──────────────────────────────────── */
.cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 16px 36px;
  border-radius: var(--radius-xl);
  background: rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1.5px solid rgba(255, 255, 255, 0.7);
  color: var(--white);
  font-family: var(--font-body);
  font-weight: 700;
  font-size: 0.95rem;
  letter-spacing: 0.03em;
  white-space: nowrap;
  box-shadow:
    0 4px 24px rgba(195, 80, 100, 0.22),
    inset 0 1px 0 rgba(255, 255, 255, 0.55);
  transition:
    background 0.3s ease,
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.cta-btn:hover {
  background: rgba(255, 255, 255, 0.32);
  transform: translateY(-3px);
  box-shadow:
    0 10px 36px rgba(195, 80, 100, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.7);
}

.cta-btn__arrow {
  transition: transform 0.28s ease;
}

.cta-btn:hover .cta-btn__arrow {
  transform: translateX(5px);
}

.cta-banner__note {
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 0.04em;
}

/* ── Responsive ──────────────────────────────────── */
@media (max-width: 768px) {
  .cta-banner {
    padding: 68px 0;
  }

  .cta-banner__inner {
    flex-direction: column;
    text-align: center;
    gap: 36px;
  }

  .cta-banner__title {
    font-size: 2.2rem;
  }

  .cta-banner__sub {
    max-width: 100%;
  }

  .cta-banner__action {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .cta-banner__title {
    font-size: 1.9rem;
  }
}
</style>
