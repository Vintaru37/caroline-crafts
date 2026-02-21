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
        <span class="navbar__logo-text">Caroline<strong>Crafts</strong></span>
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
          href="https://www.amazon.com"
          target="_blank"
          rel="noopener noreferrer"
          class="btn btn-primary navbar__cta"
        >
          🛒 Amazon
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
          href="https://www.amazon.com"
          target="_blank"
          rel="noopener noreferrer"
          class="btn btn-primary navbar__mobile-cta"
          @click="closeMenu"
        >
          🛒 Amazon
        </a>
      </nav>
    </Transition>
  </header>
</template>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(255, 244, 245, 0.97);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--pinktone);
  box-shadow: 0 2px 20px rgba(242, 151, 160, 0.1);
}

.navbar__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 68px;
}

/* Logo */
.navbar__logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-heading);
  font-size: 1.3rem;
  color: var(--dark);
  transition: opacity var(--transition);
}

.navbar__logo:hover {
  opacity: 0.8;
}

.navbar__logo-img {
  height: 52px;
  display: block;
  object-fit: contain;
}

.navbar__logo-text strong {
  color: var(--primrose);
}

/* Desktop links */
.navbar__links {
  display: flex;
  align-items: center;
  gap: 8px;
}

.navbar__link {
  padding: 6px 14px;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 600;
  font-family: var(--font-body);
  color: var(--mid);
  transition:
    color var(--transition),
    background var(--transition);
}

.navbar__link:hover,
.navbar__link.active {
  color: var(--primrose-deep);
  background: var(--primrose-light);
}

.navbar__cta {
  margin-left: 8px;
  padding: 8px 20px;
  font-size: 0.88rem;
}

/* Hamburger */
.navbar__burger {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 36px;
  height: 36px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: var(--radius-sm);
  transition: background var(--transition);
}

.navbar__burger:hover {
  background: var(--pinktone);
}

.navbar__burger span {
  display: block;
  height: 2px;
  background: var(--dark);
  border-radius: 2px;
  transition:
    transform 0.3s,
    opacity 0.3s;
}

.navbar__burger.open span:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}
.navbar__burger.open span:nth-child(2) {
  opacity: 0;
}
.navbar__burger.open span:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}

/* Mobile menu */
.navbar__mobile {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 16px 24px 20px;
  background: var(--white);
  border-top: 1px solid var(--pinktone);
}

.navbar__mobile-link {
  padding: 12px 16px;
  border-radius: var(--radius-sm);
  font-weight: 500;
  color: var(--mid);
  transition:
    background var(--transition),
    color var(--transition);
}

.navbar__mobile-link:hover,
.navbar__mobile-link.active {
  background: var(--primrose-light);
  color: var(--primrose-deep);
}

.navbar__mobile-cta {
  margin-top: 8px;
  text-align: center;
}

/* Slide animation */
.slide-down-enter-active,
.slide-down-leave-active {
  transition:
    max-height 0.3s ease,
    opacity 0.3s ease;
  overflow: hidden;
  max-height: 400px;
}

.slide-down-enter-from,
.slide-down-leave-to {
  max-height: 0;
  opacity: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .navbar__links {
    display: none;
  }
  .navbar__burger {
    display: flex;
  }
}
</style>
