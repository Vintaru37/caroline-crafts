<script setup lang="ts">
import { parseTags } from "../composables/useProducts";
const props = defineProps<{
  product: {
    image: string;
    title: string;
    desc: string;
    tag: string;
    amazonUrl?: string;
    notebookType?: string;
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
      <span
        v-if="props.product.notebookType"
        class="product-card__tag product-card__tag--bottom"
      >
        {{ props.product.notebookType }}
      </span>
    </div>

    <div class="product-card__body">
      <p class="product-card__kind">NOTEBOOK / NOTES</p>
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
.product-card__cover--tall {
  aspect-ratio: 2 / 3;
}

/* ensure the cover is a positioned container for absolute pills */
.product-card__cover {
  position: relative;
  overflow: hidden;
}

/* bottom variant: reuse existing pill visuals, just anchor to image bottom */
.product-card__tag--bottom {
  position: absolute;
  left: 12px;
  bottom: 10px;
  transform: translateY(0);
}

/* ensure bottom variant doesn't inherit top/right from global tag */
.product-card__tag--bottom {
  top: auto;
  right: auto;
}
</style>
