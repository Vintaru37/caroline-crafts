<template>
  <section class="cta-banner">
    <div class="container cta-banner__inner reveal">
      <div class="cta-banner__text">
        <h2 class="cta-banner__title">Find my products<br />on Amazon 🛒</h2>
        <p class="cta-banner__sub">
          Order today and get your piece of inspiration!
        </p>
      </div>
      <a
        href="https://www.amazon.com"
        target="_blank"
        rel="noopener noreferrer"
        class="btn btn-primary cta-banner__btn"
      >
        Shop on Amazon →
      </a>
    </div>
  </section>
</template>

<style scoped>
.cta-banner {
  background: var(--primrose);
  padding: 60px 0;
}

.cta-banner__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  flex-wrap: wrap;
}

.cta-banner__title {
  font-size: 2rem;
  color: var(--white);
  margin-bottom: 8px;
}

.cta-banner__sub {
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.95rem;
}

.cta-banner__btn {
  background: var(--white);
  color: var(--primrose);
  border-color: var(--white);
  white-space: nowrap;
  flex-shrink: 0;
}

.cta-banner__btn:hover {
  background: var(--yucca);
  border-color: var(--yucca);
}

@media (max-width: 600px) {
  .cta-banner__inner {
    text-align: center;
    justify-content: center;
  }
}
</style>
