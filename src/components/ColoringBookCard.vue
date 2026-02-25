<script setup lang="ts">
import { parseTags } from "../composables/useProducts";
const props = defineProps<{
  product: {
    image: string;
    title: string;
    desc: string;
    tag: string;
    amazonUrl?: string;
  };
}>();
</script>

<template>
  <article class="product-card">
    <div class="product-card__cover product-card__cover--square">
      <img
        v-if="props.product.image"
        :src="props.product.image"
        :alt="props.product.title"
        class="product-card__image"
        loading="lazy"
        decoding="async"
      />
      <div
        v-if="parseTags(props.product.tag).length"
        class="product-card__tags"
      >
        <span
          v-for="t in parseTags(props.product.tag)"
          :key="t"
          class="product-card__tag"
          >{{ t }}</span
        >
      </div>
    </div>

    <div class="product-card__body">
      <p class="product-card__kind">COLORING BOOK</p>
      <h3 class="product-card__title">{{ props.product.title }}</h3>
      <p class="product-card__desc">{{ props.product.desc }}</p>

      <a
        class="product-card__link"
        :href="
          props.product.amazonUrl ||
          'https://www.amazon.com/stores/Caroline-Crafts/author/B0FD432Q7J'
        "
        target="_blank"
        rel="noopener noreferrer"
      >
        View on Amazon →
      </a>
    </div>
  </article>
</template>

<style scoped>
.product-card__cover--square {
  aspect-ratio: 1 / 1;
}
</style>
