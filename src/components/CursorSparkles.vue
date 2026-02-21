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

let lastSpawnTime = 0;
const THROTTLE_MS = 50; // ~20 sparks/sec max

function spawnSpark(x: number, y: number) {
  const el = document.createElement("span");
  el.className = "cursor-spark";
  const symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)] ?? "✦";
  el.textContent = symbol;

  const color = COLORS[Math.floor(Math.random() * COLORS.length)];
  const size = rand(0.65, 1.15);
  const angle = rand(-55, 55); // horizontal drift
  const rise = rand(66, 72); // how far it floats up
  const duration = rand(600, 1050);
  const rotate = rand(-40, 40);

  el.style.cssText = `
    left: ${x}px;
    top: ${y}px;
    font-size: ${size}rem;
    color: ${color};
    --rise: -${rise}px;
    --drift: ${angle}px;
    --rot: ${rotate}deg;
    animation-duration: ${duration}ms;
  `;

  document.body.appendChild(el);

  el.addEventListener("animationend", () => el.remove(), { once: true });
}

function onMouseMove(e: MouseEvent) {
  const now = performance.now();
  if (now - lastSpawnTime < THROTTLE_MS) return;
  lastSpawnTime = now;
  spawnSpark(e.clientX, e.clientY);
}

onMounted(() => window.addEventListener("mousemove", onMouseMove));
onUnmounted(() => window.removeEventListener("mousemove", onMouseMove));
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
  animation: cursorSparkFade linear forwards;
  /* translate so the symbol is centered on the cursor */
  margin-left: -0.4em;
  margin-top: -0.4em;
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
