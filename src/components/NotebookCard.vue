<script setup lang="ts">
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
    <div class="product-card__cover product-card__cover--tall">
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
      <p class="product-card__kind">NOTEBOOK / NOTES</p>
      <h3 class="product-card__title">{{ props.product.title }}</h3>
      <p class="product-card__desc">{{ props.product.desc }}</p>

      <a
        class="product-card__link"
        :href="props.product.amazonUrl || 'https://www.amazon.com'"
        target="_blank"
        rel="noopener noreferrer"
      >
        View on Amazon →
      </a>
    </div>
  </article>
</template>

<style scoped>
.product-card__cover--tall {
  aspect-ratio: 2 / 3;
}
</style>
