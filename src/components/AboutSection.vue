<script setup lang="ts">
import { RouterLink } from "vue-router";
import aboutMeImg from "../assets/images/about-me2.png";
</script>

<template>
  <section id="about" class="section about">
    <div class="container about__inner">
      <div class="about__visual">
        <div class="about__avatar">
          <img
            :src="aboutMeImg"
            alt="About Caroline"
            class="about__avatar-img"
          />
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
          🌿
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
  grid-template-columns: 270px 1fr;
  align-items: center;
  gap: 28px;
}

.about__visual {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.about__avatar {
  width: 270px;
  position: relative;
  z-index: 1;
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
