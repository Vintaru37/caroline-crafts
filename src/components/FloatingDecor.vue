<script setup lang="ts">
interface DecorItem {
  emoji: string;
  top: string;
  left: string;
  size: string;
  dur: string;
  del: string;
}

const props = defineProps<{
  /** number of floating items to render (cycles the pool if larger) */
  count?: number;
  /** when true, render extra (denser) decor items — kept for backwards compatibility */
  dense?: boolean;
  /** when true, render fixed to the viewport so it follows scroll */
  fixed?: boolean;
}>();

const pool: DecorItem[] = [
  { emoji: "🌸", top: "8%", left: "4%", size: "3.5rem", dur: "7s", del: "0s" },
  {
    emoji: "🌿",
    top: "18%",
    left: "88%",
    size: "2.5rem",
    dur: "9s",
    del: "1.2s",
  },
  { emoji: "🌷", top: "55%", left: "6%", size: "2.2rem", dur: "8s", del: "2s" },
  {
    emoji: "✿",
    top: "72%",
    left: "91%",
    size: "3rem",
    dur: "10s",
    del: "0.7s",
  },
  {
    emoji: "🍃",
    top: "40%",
    left: "2%",
    size: "1.9rem",
    dur: "6.5s",
    del: "3.1s",
  },
  {
    emoji: "🌺",
    top: "80%",
    left: "78%",
    size: "3.2rem",
    dur: "8.5s",
    del: "1.8s",
  },
  {
    emoji: "🌼",
    top: "14%",
    left: "48%",
    size: "1.7rem",
    dur: "11s",
    del: "4.2s",
  },
  {
    emoji: "🌸",
    top: "48%",
    left: "72%",
    size: "2.4rem",
    dur: "9.5s",
    del: "2.6s",
  },
  {
    emoji: "🌿",
    top: "28%",
    left: "22%",
    size: "1.6rem",
    dur: "7.5s",
    del: "0.9s",
  },
  {
    emoji: "🌷",
    top: "88%",
    left: "30%",
    size: "2.6rem",
    dur: "6.8s",
    del: "3.7s",
  },
  {
    emoji: "✿",
    top: "5%",
    left: "65%",
    size: "1.8rem",
    dur: "8s",
    del: "1.5s",
  },
  {
    emoji: "🍃",
    top: "62%",
    left: "54%",
    size: "1.5rem",
    dur: "12s",
    del: "5s",
  },
];

// optionally include a small extra set when `dense` is true
const extraPool: DecorItem[] = [
  {
    emoji: "🌸",
    top: "22%",
    left: "12%",
    size: "1.4rem",
    dur: "6.2s",
    del: "1s",
  },
  {
    emoji: "🌿",
    top: "34%",
    left: "80%",
    size: "1.8rem",
    dur: "7.2s",
    del: "0.6s",
  },
  {
    emoji: "🌼",
    top: "66%",
    left: "40%",
    size: "1.2rem",
    dur: "9s",
    del: "3s",
  },
];

import { ref, computed, onMounted, watch } from "vue";

const poolItems = computed(() => (props.dense ? pool.concat(extraPool) : pool));

// renderedItems holds items with dynamic positions (top/left)
const renderedItems = ref<DecorItem[]>([]);

function randPercent(min = 2, max = 96) {
  return `${Math.floor(Math.random() * (max - min + 1) + min)}%`;
}

function buildRenderedItems() {
  const p = poolItems.value;
  const requested = props.count ?? p.length;
  const out: DecorItem[] = [];
  const poolLen = p.length || 1;
  for (let i = 0; i < requested; i++) {
    const base = p[i % poolLen] as DecorItem;
    out.push({
      emoji: base.emoji,
      size: base.size,
      dur: base.dur,
      del: base.del,
      top: randPercent(4, 88),
      left: randPercent(4, 96),
    });
  }
  renderedItems.value = out;
}

onMounted(buildRenderedItems);
watch([() => props.count, () => props.dense], buildRenderedItems);
</script>

<template>
  <div
    :class="['float-bg', props.fixed ? 'float-bg--fixed' : '']"
    aria-hidden="true"
  >
    <span
      v-for="(item, i) in renderedItems"
      :key="i"
      class="float-bg__item"
      :style="{
        top: item.top,
        left: item.left,
        fontSize: item.size,
        animationDuration: item.dur,
        animationDelay: item.del,
      }"
      >{{ item.emoji }}</span
    >
  </div>
</template>

<style scoped>
.float-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}

.float-bg--fixed {
  position: fixed;
  inset: 0;
  z-index: 0;
}

.float-bg__item {
  position: absolute;
  opacity: 0.18;
  user-select: none;
  animation: floatAnim 8s ease-in-out infinite alternate;
}

@keyframes floatAnim {
  0% {
    transform: translateY(0px) rotate(0deg) scale(1);
  }
  25% {
    transform: translateY(-14px) rotate(6deg) scale(1.04);
  }
  55% {
    transform: translateY(-22px) rotate(-4deg) scale(0.97);
  }
  80% {
    transform: translateY(-12px) rotate(9deg) scale(1.02);
  }
  100% {
    transform: translateY(-28px) rotate(-8deg) scale(1.05);
  }
}
</style>
