<script setup lang="ts">
import { RouterLink } from "vue-router";
import logoImg from "../assets/images/logo.png";
</script>

<template>
  <footer class="footer">
    <div class="container footer__inner">
      <div class="footer__brand">
        <div class="footer__logo">
          <img
            :src="logoImg"
            alt="CarolineCrafts logo"
            class="footer__logo-img"
          />
          Caroline<strong>Crafts</strong>
        </div>
        <p class="footer__tagline">
          Handcrafted coloring books and notebooks<br />
          made with love for every creator ✨
        </p>
      </div>

      <div class="footer__col">
        <h4 class="footer__heading">Navigation</h4>
        <RouterLink to="/" class="footer__link">Home</RouterLink>
        <RouterLink to="/products" class="footer__link">Products</RouterLink>
        <RouterLink to="/contact" class="footer__link">Contact</RouterLink>
      </div>

      <div class="footer__col">
        <h4 class="footer__heading">Find me</h4>
        <a
          href="https://www.instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          class="footer__social"
        >
          <span class="footer__social-icon">📸</span> Instagram
        </a>
        <a
          href="https://www.tiktok.com"
          target="_blank"
          rel="noopener noreferrer"
          class="footer__social"
        >
          <span class="footer__social-icon">🎵</span> TikTok
        </a>
        <a
          href="https://www.amazon.com"
          target="_blank"
          rel="noopener noreferrer"
          class="footer__social"
        >
          <span class="footer__social-icon">🛒</span> Amazon
        </a>
      </div>
    </div>

    <div class="footer__bottom">
      <p>
        © {{ new Date().getFullYear() }} CarolineCrafts. All rights reserved.
      </p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: #cb6f794d;
  color: var(--dark);
  padding-top: 60px;
  border-top: 1px solid var(--pinktone);
}

.footer__inner {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 48px;
  padding-bottom: 48px;
}

.footer__brand {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.footer__logo {
  display: flex;
  align-items: center;
  font-family: var(--font-heading);
  font-size: 1.4rem;
  color: var(--dark);
}

.footer__logo-img {
  width: 50px;
  margin-right: 12px;
}

.footer__logo strong {
  color: var(--primrose-deep);
}

.footer__tagline {
  font-size: 0.88rem;
  color: var(--mid);
  line-height: 1.7;
}

.footer__col {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.footer__heading {
  font-family: var(--font-heading);
  font-size: 1rem;
  color: var(--dark);
  margin-bottom: 4px;
}

.footer__link,
.footer__social {
  font-size: 0.88rem;
  color: var(--mid);
  transition: color var(--transition);
  display: flex;
  align-items: center;
  gap: 6px;
}

.footer__link:hover,
.footer__social:hover {
  color: var(--primrose-deep);
}

.footer__social-icon {
  font-size: 1rem;
}

.footer__bottom {
  border-top: 1px solid whitesmoke;
  padding: 16px 24px;
  text-align: center;
  font-size: 0.82rem;
  color: var(--mid);
}

@media (max-width: 768px) {
  .footer__inner {
    grid-template-columns: 1fr 1fr;
  }
  .footer__brand {
    grid-column: 1 / -1;
  }
}

@media (max-width: 480px) {
  .footer__inner {
    grid-template-columns: 1fr;
  }
}
</style>
