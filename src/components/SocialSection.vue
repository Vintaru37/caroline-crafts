<script setup lang="ts">
import instagramIcon from "../assets/images/instagram-icon.png";
import tiktokIcon from "../assets/images/tiktok-icon.png";
</script>

<template>
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
</template>

<style scoped>
.social-section {
  background: var(--white);
  border-top: 1px solid var(--primrose-light);
}

.social-section__inner {
  text-align: center;
}

.section-eyebrow {
  font-family: var(--font-accent);
  font-size: 1.8rem;
  font-weight: 400;
  color: var(--primrose);
  display: block;
  margin-bottom: 6px;
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
</style>
