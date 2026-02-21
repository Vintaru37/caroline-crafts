<script setup lang="ts">
import NavBar from "./components/NavBar.vue";
import FooterBar from "./components/FooterBar.vue";
import CursorSparkles from "./components/CursorSparkles.vue";
</script>

<template>
  <div id="app-root">
    <CursorSparkles />
    <NavBar />

    <RouterView v-slot="{ Component }">
      <Transition name="fade" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>

    <FooterBar />
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
