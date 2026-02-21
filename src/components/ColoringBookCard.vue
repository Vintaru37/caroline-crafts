<script setup lang="ts">
const props = defineProps<{
  product: {
    image: string;
    title: string;
    desc: string;
    tag: string;
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
      />
      <span v-if="props.product.tag" class="product-card__tag">{{
        props.product.tag
      }}</span>
    </div>

    <div class="product-card__body">
      <p class="product-card__kind">COLORING BOOK</p>
      <h3 class="product-card__title">{{ props.product.title }}</h3>
      <p class="product-card__desc">{{ props.product.desc }}</p>

      <a
        class="product-card__link"
        href="https://www.amazon.com"
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
