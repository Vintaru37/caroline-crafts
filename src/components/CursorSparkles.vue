<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";

const SYMBOLS = ["✦", "✧", "✦"];
const COLORS = [
  "#f9c6d0",
  "#f7b7c4",
  "#f4a7b8",
  "#f6d3df",
  "#f9b8c5",
  "#f4c2d0",
];

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

const THROTTLE_MS = 50; // ~20 sparks/sec max
const POOL_SIZE = 36;
let lastSpawnTime = 0;

const pool: HTMLSpanElement[] = [];
const free: HTMLSpanElement[] = [];

const onAnimEnd = (e: AnimationEvent) => {
  const el = e.currentTarget as HTMLSpanElement;
  el.classList.remove("active");
  el.style.cssText = "";
  if (!free.includes(el)) free.push(el);
};

function makeSpark() {
  const el = document.createElement("span") as HTMLSpanElement;
  el.className = "cursor-spark";
  el.addEventListener("animationend", onAnimEnd as EventListener);
  document.body.appendChild(el);
  pool.push(el);
  free.push(el);
}

function initPool() {
  for (let i = 0; i < POOL_SIZE; i++) makeSpark();
}

function spawnSpark(x: number, y: number) {
  const el = free.pop() ?? pool[Math.floor(Math.random() * pool.length)];
  if (!el) return;

  const symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)] ?? "✦";
  const color = COLORS[Math.floor(Math.random() * COLORS.length)] ?? "#f9c6d0";
  const size = rand(0.65, 1.15);
  const angle = rand(-55, 55);
  const rise = rand(66, 72);
  const duration = rand(600, 1050);
  const rotate = rand(-40, 40);

  el.textContent = symbol;
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  el.style.fontSize = `${size}rem`;
  el.style.color = color;
  el.style.setProperty("--rise", `-${rise}px`);
  el.style.setProperty("--drift", `${angle}px`);
  el.style.setProperty("--rot", `${rotate}deg`);
  el.style.animationDuration = `${duration}ms`;

  el.classList.remove("active");
  // force reflow to restart animation
  void el.offsetWidth;
  el.classList.add("active");
}

function onMouseMove(e: MouseEvent) {
  const now = performance.now();
  if (now - lastSpawnTime < THROTTLE_MS) return;
  lastSpawnTime = now;
  spawnSpark(e.clientX, e.clientY);
}

onMounted(() => {
  initPool();
  window.addEventListener("mousemove", onMouseMove);
});

onUnmounted(() => {
  window.removeEventListener("mousemove", onMouseMove);
  // cleanup pool elements
  for (const el of pool) {
    el.removeEventListener("animationend", onAnimEnd as EventListener);
    el.remove();
  }
  pool.length = 0;
  free.length = 0;
});
</script>

<template>
  <!-- renderless component -->
</template>

<style>
.cursor-spark {
  position: fixed;
  pointer-events: none;
  user-select: none;
  z-index: 99999;
  line-height: 1;
  transform-origin: center;
  margin-left: -0.4em;
  margin-top: -0.4em;
}

.cursor-spark.active {
  animation: cursorSparkFade linear forwards;
}

@keyframes cursorSparkFade {
  0% {
    opacity: 1;
    transform: translate(0, 0) rotate(0deg) scale(1);
  }
  60% {
    opacity: 0.7;
    transform: translate(var(--drift), calc(var(--rise) * 0.6))
      rotate(calc(var(--rot) * 0.6)) scale(1.1);
  }
  100% {
    opacity: 0;
    transform: translate(var(--drift), var(--rise)) rotate(var(--rot))
      scale(0.4);
  }
}
</style>
