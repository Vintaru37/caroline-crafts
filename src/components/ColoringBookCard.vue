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
        Buy on Amazon →
      </a>
    </div>
  </article>
</template>

<style scoped>
.product-card {
  display: flex;
  flex-direction: column;
}

.product-card__cover {
  position: relative;
  width: 100%;
  overflow: hidden;
  background: var(--yucca);
}

.product-card__cover--square {
  aspect-ratio: 1 / 1;
}

.product-card__image {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  transition: transform 300ms;
  transform-origin: center center;
  will-change: transform;
  backface-visibility: hidden;
}

.product-card:hover .product-card__image,
.product-card:focus-within .product-card__image {
  transform: scale(1.04);
}

.product-card__tag {
  position: absolute;
  top: 12px;
  right: 12px;
  background: var(--dark);
  color: var(--white);
  font-size: 0.72rem;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 999px;
  font-family: var(--font-body);
}

.product-card__body {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  padding-top: 14px;
}

.product-card__kind {
  font-family: var(--font-body);
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--light-text);
  margin-bottom: 6px;
}

.product-card__meta {
  display: flex;
  gap: 8px;
  margin-bottom: 14px;
  flex-wrap: wrap;
}

.meta-pill {
  background: rgba(242, 151, 160, 0.14);
  color: var(--mid);
  font-size: 0.75rem;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 999px;
}

.product-card__link {
  margin-top: auto;
  margin-left: auto;
  border: 1px solid var(--pinktone);
  border-radius: 3rem;
  padding: 6px 12px;
  transition: all 0.2s;

  &:hover {
    background: var(--primrose-light);
    border-color: var(--primrose-light);
    color: var(--primrose-deep);
  }
}
</style>
