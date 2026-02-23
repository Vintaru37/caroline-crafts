<script setup lang="ts">
import { RouterLink } from "vue-router";
import aboutMeImg from "../assets/images/about-me2.webp";
import aboutMeBackImg from "../assets/images/about-me.webp";
</script>

<template>
  <section id="about" class="section about">
    <div class="container about__inner">
      <div class="about__visual">
        <div class="about__hint" aria-hidden="true">
          <span>hover me <span class="hint-icon">🌸</span></span>
        </div>
        <div class="about__flip-card">
          <div class="about__flip-inner">
            <div class="about__flip-front">
              <img
                :src="aboutMeImg"
                alt="About Caroline"
                class="about__avatar-img"
              />
            </div>
            <div class="about__flip-back">
              <img
                v-if="aboutMeBackImg"
                :src="aboutMeBackImg"
                alt="About Caroline – back"
                class="about__avatar-img"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="about__text reveal reveal-delay-1">
        <p class="about__eyebrow">About me</p>
        <h2 class="section-title">Hi, I'm Caroline!</h2>
        <p class="about__body">
          I'm a creator who loves combining art with functionality. I design
          beautiful coloring books and elegant notebooks available on Amazon.
        </p>
        <p class="about__body">
          Every page, every pattern – is a piece of my heart. I believe that
          coloring and handwriting are the most beautiful forms of relaxation.
        </p>
        <RouterLink to="/contact" class="btn btn-primary about__btn">
          Let's get to know each other
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about {
  background: var(--white);
  border-top: 1px solid var(--primrose-light);
}

.about__inner {
  display: grid;
  grid-template-columns: 310px 1fr;
  align-items: center;
  gap: 24px;
}

.about__visual {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.about__hint {
  position: absolute;
  top: -40px;
  right: -68px;
  background: #fff;
  border: 2px solid var(--primrose, #e8a0bf);
  color: var(--primrose, #e8a0bf);
  padding: 7px 16px;
  border-radius: 999px;
  font-family: var(--font-accent, cursive);
  font-size: 1.5rem;
  white-space: nowrap;
  transform: rotate(-6deg);
  box-shadow: 0 3px 12px rgba(180, 120, 160, 0.18);
  animation: hint-float 2.6s ease-in-out infinite;
  pointer-events: none;
  z-index: 10;
  transition: opacity 0.35s ease;
}

.hint-icon {
  opacity: 0.65;
}

.about__visual:hover .about__hint {
  opacity: 0;
}

.about__hint::after {
  content: "";
  position: absolute;
  bottom: -12px;
  left: 30%;
  transform: translateX(-50%) rotate(6deg);
  width: 0;
  height: 0;
  border-left: 7px solid transparent;
  border-right: 7px solid transparent;
  border-top: 12px solid var(--primrose, #e8a0bf);
}

.about__hint::before {
  content: "";
  position: absolute;
  bottom: -9px;
  left: 30%;
  transform: translateX(-50%) rotate(6deg);
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 11px solid #fff;
  z-index: 1;
}

@keyframes hint-float {
  0%,
  100% {
    transform: rotate(-6deg) translateY(0);
  }
  50% {
    transform: rotate(-6deg) translateY(-7px);
  }
}

.about__flip-card {
  width: 100%;
  height: 420px;
  perspective: 1000px;
}

.about__flip-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.7s cubic-bezier(0.4, 0.2, 0.2, 1);
  border-radius: 6px;
}

.about__flip-card:hover .about__flip-inner {
  transform: rotateY(180deg);
}

.about__flip-front,
.about__flip-back {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(180, 140, 160, 0.18);
}

.about__flip-back {
  transform: rotateY(180deg);
  background: var(--primrose-light, #f9eef4);
}

.about__flip-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  background: linear-gradient(
    135deg,
    var(--primrose-light, #f9eef4),
    var(--primrose, #e8a0bf) 200%
  );
}

.about__avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 6px;
}

.about__eyebrow {
  font-family: var(--font-accent);
  font-size: 1.8rem;
  font-weight: 400;
  color: var(--primrose);
  display: block;
  margin-bottom: 6px;
}

.about__body {
  color: var(--mid);
  margin-bottom: 16px;
  line-height: 1.75;
}

.about__btn {
  margin-top: 8px;
}

@media (max-width: 900px) {
  .about__inner {
    grid-template-columns: 1fr;
  }
  .about__visual {
    display: none;
  }
}
</style>
