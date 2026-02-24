<script setup lang="ts">
import { ref } from "vue";
import { RouterLink, useRoute } from "vue-router";
import logoImg from "../assets/images/logo.png";

const route = useRoute();
const menuOpen = ref(false);

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
  { to: "/contact", label: "Contact" },
];

function closeMenu() {
  menuOpen.value = false;
}
</script>

<template>
  <header class="navbar" :class="{ 'navbar--scrolled': true }">
    <div class="container navbar__inner">
      <!-- Logo -->
      <RouterLink to="/" class="navbar__logo" @click="closeMenu">
        <img
          :src="logoImg"
          alt="CarolineCrafts logo"
          class="navbar__logo-img"
        />
        <span class="navbar__logo-text"
          >Caroline<strong class="navbar__logo-accent">Crafts</strong></span
        >
      </RouterLink>

      <!-- Desktop nav -->
      <nav class="navbar__links">
        <RouterLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="navbar__link"
          :class="{ active: route.path === link.to }"
        >
          {{ link.label }}
        </RouterLink>
        <a
          href="https://www.amazon.com/stores/Caroline-Crafts/author/B0FD432Q7J"
          target="_blank"
          rel="noopener noreferrer"
          class="btn btn-primary navbar__cta"
        >
          Amazon
        </a>
      </nav>

      <!-- Hamburger -->
      <button
        class="navbar__burger"
        :class="{ open: menuOpen }"
        aria-label="Open menu"
        @click="menuOpen = !menuOpen"
      >
        <span /><span /><span />
      </button>
    </div>

    <!-- overlay to close mobile menu when clicking outside -->
    <div v-if="menuOpen" class="navbar__overlay" @click="closeMenu"></div>

    <!-- Mobile menu -->
    <Transition name="slide-down">
      <nav v-if="menuOpen" class="navbar__mobile">
        <RouterLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="navbar__mobile-link"
          :class="{ active: route.path === link.to }"
          @click="closeMenu"
        >
          {{ link.label }}
        </RouterLink>
        <a
          href="https://www.amazon.com/stores/Caroline-Crafts/author/B0FD432Q7J"
          target="_blank"
          rel="noopener noreferrer"
          class="btn btn-primary navbar__mobile-cta"
          @click="closeMenu"
        >
          Amazon
        </a>
      </nav>
    </Transition>
  </header>
</template>

<style scoped>
/* ─── Glass bar ──────────────────────────────────────── */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgb(255, 244, 245);
  border-bottom: 1px solid var(--primrose);
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.8) inset,
    0 6px 32px rgba(242, 151, 160, 0.14);
}

.navbar__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
}

/* ─── Logo ───────────────────────────────────────────── */
.navbar__logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-heading);
  font-size: 1.3rem;
  color: var(--dark);
  transition:
    opacity var(--transition),
    transform var(--transition);
}

.navbar__logo-accent {
  font-family: var(--font-accent);
  font-size: 1.6rem;
}

.navbar__logo:hover {
  opacity: 0.85;
  transform: scale(1.02);
}

.navbar__logo-img {
  height: 50px;
  display: block;
  object-fit: contain;
  filter: drop-shadow(0 2px 8px rgba(242, 151, 160, 0.45));
}

.navbar__logo-text strong {
  background: linear-gradient(135deg, var(--primrose), var(--primrose-deep));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ─── Desktop links ──────────────────────────────────── */
.navbar__links {
  display: flex;
  align-items: center;
  gap: 4px;
  font-family: var(--font-accent);
  color: var(--mid);
}

.navbar__link {
  position: relative;
  padding: 4px 24px;
  border-radius: 50px;
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  transition:
    color var(--transition),
    background var(--transition),
    box-shadow var(--transition),
    transform var(--transition);
}

.navbar__link:hover {
  color: var(--primrose-deep);
  background: rgba(253, 234, 236, 0.8);
  box-shadow: 0 2px 12px rgba(242, 151, 160, 0.2);
  transform: translateY(-1px);
}

.navbar__link.active {
  color: white;
  background: linear-gradient(135deg, var(--primrose), var(--primrose-deep));
  box-shadow:
    0 4px 16px rgba(242, 151, 160, 0.45),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

/* underline sweep on non-active hover */
.navbar__link:not(.active)::after {
  content: "";
  position: absolute;
  bottom: 4px;
  left: 18px;
  right: 18px;
  height: 2px;
  background: var(--primrose);
  border-radius: 2px;
  transform: scaleX(0);
  transform-origin: center;
  transition: transform 0.25s ease;
}

.navbar__link:not(.active):hover::after {
  transform: scaleX(1);
}

/* ─── CTA button ─────────────────────────────────────── */
.navbar__cta {
  margin-left: 12px;
  padding: 9px 24px;
  font-size: 0.86rem;
  font-weight: 700;
  border-radius: 50px;
  letter-spacing: 0.04em;
  background: linear-gradient(
    135deg,
    var(--primrose) 0%,
    var(--primrose-deep) 100%
  );
  color: #fff !important;
  border: none;
  box-shadow:
    0 4px 18px rgba(242, 151, 160, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  transition:
    transform var(--transition),
    box-shadow var(--transition),
    filter var(--transition);
}

.navbar__cta:hover {
  transform: translateY(-2px) scale(1.04);
  box-shadow:
    0 8px 28px rgba(242, 151, 160, 0.55),
    inset 0 1px 0 rgba(255, 255, 255, 0.35);
  filter: brightness(1.06);
}

/* ─── Hamburger ──────────────────────────────────────── */
.navbar__burger {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 40px;
  height: 40px;
  background: rgba(253, 234, 236, 0.7);
  border: 1.5px solid rgba(242, 151, 160, 0.35);
  cursor: pointer;
  padding: 8px;
  border-radius: 50px;
  backdrop-filter: blur(6px);
  transition:
    background var(--transition),
    box-shadow var(--transition),
    transform var(--transition);
}

.navbar__burger:hover {
  background: var(--pinktone);
  box-shadow: 0 2px 14px rgba(242, 151, 160, 0.35);
  transform: scale(1.06);
}

.navbar__burger span {
  display: block;
  height: 2.5px;
  background: var(--primrose-deep);
  border-radius: 2px;
  transition:
    transform 0.32s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.2s ease,
    width 0.25s ease;
}

/* middle bar shrinks before collapsing */
.navbar__burger span:nth-child(2) {
  width: 75%;
}

.navbar__burger.open span:nth-child(1) {
  transform: translateY(7.5px) rotate(45deg);
}
.navbar__burger.open span:nth-child(2) {
  opacity: 0;
  transform: scaleX(0);
}
.navbar__burger.open span:nth-child(3) {
  transform: translateY(-7.5px) rotate(-45deg);
}

/* ─── Mobile menu ────────────────────────────────────── */
.navbar__mobile {
  position: absolute;
  top: calc(100% + 10px);
  left: 12px;
  right: 12px;
  z-index: 111;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 16px 14px 20px;
  background: rgba(255, 248, 249, 0.88);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(249, 208, 206, 0.6);
  border-radius: 22px;
  box-shadow:
    0 8px 32px rgba(242, 151, 160, 0.22),
    0 2px 8px rgba(0, 0, 0, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.75);
}

/* full-viewport invisible overlay placed under the mobile menu; clicking it closes the menu */
.navbar__overlay {
  position: fixed;
  inset: 0;
  z-index: 110;
  background: rgba(0, 0, 0, 0.04);
}

.navbar__mobile-link {
  padding: 11px 18px;
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: 0.95rem;
  letter-spacing: 0.02em;
  color: var(--mid);
  transition:
    background var(--transition),
    color var(--transition),
    transform var(--transition),
    box-shadow var(--transition);
}

.navbar__mobile-link:hover {
  background: rgba(253, 234, 236, 0.9);
  color: var(--primrose-deep);
  transform: translateX(4px);
}

.navbar__mobile-link.active {
  background: linear-gradient(135deg, var(--primrose), var(--primrose-deep));
  color: #fff;
  box-shadow: 0 3px 14px rgba(242, 151, 160, 0.4);
}

.navbar__mobile-cta {
  margin-top: 10px;
  text-align: center;
  background: linear-gradient(
    135deg,
    var(--primrose) 0%,
    var(--primrose-deep) 100%
  ) !important;
  color: #fff !important;
  border-radius: 50px !important;
  padding: 13px 22px !important;
  font-weight: 700;
  letter-spacing: 0.04em;
  box-shadow: 0 4px 18px rgba(242, 151, 160, 0.45);
  transition:
    transform var(--transition),
    filter var(--transition);
}

.navbar__mobile-cta:hover {
  transform: scale(1.02);
  filter: brightness(1.05);
}

/* ─── Slide animation ────────────────────────────────── */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.35s;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.97);
}

/* ─── Responsive ─────────────────────────────────────── */
@media (max-width: 768px) {
  .navbar__links {
    display: none;
  }
  .navbar__burger {
    display: flex;
  }
}
</style>
