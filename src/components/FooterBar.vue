<script setup lang="ts">
import { RouterLink } from "vue-router";
import logoImg from "../assets/images/logo.png";
import instagramImg from "../assets/images/instagram-icon.png";
import tiktokImg from "../assets/images/tiktok-icon.png";
import amazonImg from "../assets/images/amazon-icon.png";
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
          Caroline<strong class="footer__logo-accent">Crafts</strong>
        </div>
        <p class="footer__tagline">
          Coloring books and notebooks made with love for everyone ✨<br />
          Grab your markers and let the creativity flow!
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
          href="https://www.instagram.com/itscarolinecrafts"
          target="_blank"
          rel="noopener noreferrer"
          class="footer__social"
        >
          <img
            :src="instagramImg"
            alt="Instagram"
            class="footer__social-icon"
          />
          Instagram
        </a>
        <a
          href="https://www.tiktok.com/@itscarolinecrafts"
          target="_blank"
          rel="noopener noreferrer"
          class="footer__social"
        >
          <img :src="tiktokImg" alt="TikTok" class="footer__social-icon" />
          TikTok
        </a>
        <a
          href="https://www.amazon.com/stores/Caroline-Crafts/author/B0FD432Q7J"
          target="_blank"
          rel="noopener noreferrer"
          class="footer__social"
        >
          <img :src="amazonImg" alt="Amazon" class="footer__social-icon" />
          Amazon
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

.footer__logo-accent {
  font-family: var(--font-accent);
  font-size: 1.7rem;
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
  width: 20px;
  height: 20px;
  display: inline-block;
  margin-right: 8px;
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
