<script setup lang="ts">
import { useReveal } from "../composables/useReveal";
import HeroSection from "../components/HeroSection.vue";
import AboutSection from "../components/AboutSection.vue";
import CategoriesSection from "../components/CategoriesSection.vue";
import AmazonCtaSection from "../components/AmazonCtaSection.vue";
import SocialSection from "../components/SocialSection.vue";

useReveal();
</script>

<template>
  <main>
    <HeroSection />
    <AboutSection />
    <CategoriesSection />
    <AmazonCtaSection />
    <SocialSection />
  </main>
</template>
