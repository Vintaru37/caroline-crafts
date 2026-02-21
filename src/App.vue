<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import NavBar from "./components/NavBar.vue";
import FooterBar from "./components/FooterBar.vue";
import CursorSparkles from "./components/CursorSparkles.vue";

const route = useRoute();
const isAdmin = computed(() => route.name === "admin");
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
