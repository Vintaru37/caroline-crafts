<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import NavBar from "./components/NavBar.vue";
import FooterBar from "./components/FooterBar.vue";
import CursorSparkles from "./components/CursorSparkles.vue";
import CookieConsent from "./components/CookieConsent.vue";
import { trackPageView, getConsent } from "./composables/useAnalytics";

const route = useRoute();
const router = useRouter();
const isAdmin = computed(() => route.name === "admin");

// Track page views on each navigation (only fires if analytics consent is given)
router.afterEach((to) => {
  trackPageView(to.path);
});

// When the user updates consent, track the current page right away (if they accepted)
function onConsentUpdated() {
  if (getConsent().analytics) {
    trackPageView(route.path);
  }
}
</script>

<template>
  <div id="app-root">
    <CursorSparkles v-if="!isAdmin" />
    <NavBar v-if="!isAdmin" />

    <RouterView v-slot="{ Component }">
      <Transition name="fade" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>

    <FooterBar v-if="!isAdmin" />

    <!-- Cookie consent popup – shown to first-time visitors -->
    <CookieConsent v-if="!isAdmin" @consentUpdated="onConsentUpdated" />
  </div>
</template>

<style>
#app-root {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

#app-root main {
  flex: 1;
}
</style>
