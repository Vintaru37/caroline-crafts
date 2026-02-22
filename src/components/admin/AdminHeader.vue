<script setup lang="ts">
defineProps<{
  logoImg: string;
  stats: { total: number; books: number; notebooks: number };
}>();

defineEmits<{ logout: [] }>();
</script>

<template>
  <header class="admin-header">
    <div class="admin-header__left">
      <img :src="logoImg" alt="CarolineCrafts" class="admin-header__logo-img" />
      <span class="admin-header__pill">Admin Panel</span>
    </div>

    <div class="admin-header__stats">
      <div class="stat-chip">
        <span class="stat-chip__num">{{ stats.total }}</span>
        <span class="stat-chip__label">Total</span>
      </div>
      <div class="stat-chip">
        <span class="stat-chip__num">{{ stats.books }}</span>
        <span class="stat-chip__label">Books</span>
      </div>
      <div class="stat-chip">
        <span class="stat-chip__num">{{ stats.notebooks }}</span>
        <span class="stat-chip__label">Notebooks</span>
      </div>
    </div>

    <button class="logout-btn" @click="$emit('logout')">Log out</button>
  </header>
</template>

<style scoped>
.admin-header {
  background: #1a0d10;
  padding: 12px 28px;
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.25);
}

.admin-header__left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.admin-header__logo-img {
  height: 36px;
  width: auto;
  object-fit: contain;
}

.admin-header__pill {
  background: rgba(242, 151, 160, 0.18);
  border: 1px solid rgba(242, 151, 160, 0.35);
  color: var(--primrose-light, #f8bbc0);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.admin-header__stats {
  display: flex;
  gap: 10px;
}

.stat-chip {
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 10px;
  padding: 6px 14px;
  text-align: center;
  min-width: 64px;
}

.stat-chip__num {
  display: block;
  font-size: 1.15rem;
  font-weight: 700;
  color: #fff;
  line-height: 1.1;
}

.stat-chip__label {
  display: block;
  font-size: 0.68rem;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.logout-btn {
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.18);
  color: rgba(255, 255, 255, 0.75);
  padding: 8px 18px;
  border-radius: var(--radius-sm, 8px);
  font-size: 0.875rem;
  font-family: var(--font-body);
  cursor: pointer;
  transition:
    background 0.2s,
    color 0.2s;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.14);
  color: #fff;
}

@media (max-width: 640px) {
  .admin-header {
    padding: 10px 16px;
    gap: 12px;
  }
  .admin-header__stats {
    display: none;
  }
}
</style>
