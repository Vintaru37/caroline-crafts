<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useAnalyticsStats } from "../../composables/useAnalytics";

const {
  isLoading,
  error,
  fetchStats,
  dailyCounts,
  topPages,
  deviceBreakdown,
  topReferrers,
  totalViews,
  uniqueSessions,
  todayViews,
  todaySessions,
  weekViews,
  weekSessions,
} = useAnalyticsStats();

const range = ref<7 | 30>(30);

async function load(days: 7 | 30) {
  range.value = days;
  await fetchStats(days);
}

onMounted(() => load(30));

// ── Bar chart helpers ─────────────────────────────────────────────────────────
const chartMax = computed(() =>
  Math.max(...dailyCounts.value.map((d) => d.views), 1),
);

function barHeight(v: number): string {
  return `${Math.round((v / chartMax.value) * 100)}%`;
}

function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

// Thin the X-axis labels so they don't overlap
const labeledDates = computed((): Set<string> => {
  const all = dailyCounts.value.map((d) => d.date);
  const step = range.value === 30 ? 4 : 1;
  return new Set(all.filter((_, i) => i % step === 0 || i === all.length - 1));
});

// ── Device colours ────────────────────────────────────────────────────────────
const deviceColour: Record<string, string> = {
  desktop: "#e8407c",
  mobile: "#f297a0",
  tablet: "#f9c0d8",
  unknown: "#e8c8d8",
};

function deviceIcon(type: string): string {
  return { desktop: "🖥️", mobile: "📱", tablet: "📟" }[type] ?? "❓";
}

// ── Referrer truncation ───────────────────────────────────────────────────────
function shortRef(ref: string): string {
  if (ref === "(direct)") return "🔗 Direct / Typed";
  return ref.replace(/^www\./, "");
}

const maxPageViews = computed(() =>
  topPages.value.length > 0 ? (topPages.value[0]?.views ?? 1) : 1,
);

const maxRefViews = computed(() =>
  topReferrers.value.length > 0 ? (topReferrers.value[0]?.count ?? 1) : 1,
);
</script>

<template>
  <div class="analytics">
    <!-- ── Header ──────────────────────────────────────────────────────────── -->
    <div class="analytics__header">
      <h2 class="analytics__title">📊 Site Analytics</h2>

      <div class="range-tabs">
        <button
          :class="['range-btn', { active: range === 7 }]"
          @click="load(7)"
        >
          Last 7 days
        </button>
        <button
          :class="['range-btn', { active: range === 30 }]"
          @click="load(30)"
        >
          Last 30 days
        </button>
        <button class="refresh-btn" @click="load(range)" title="Refresh">
          <span :class="{ spinning: isLoading }">↺</span>
        </button>
      </div>
    </div>

    <!-- ── Error ──────────────────────────────────────────────────────────── -->
    <div v-if="error" class="analytics__error">⚠️ {{ error }}</div>

    <!-- ── Loading skeleton ───────────────────────────────────────────────── -->
    <div v-if="isLoading" class="analytics__loading">
      <span class="spinner"></span> Loading data…
    </div>

    <template v-else>
      <!-- ── Summary cards ─────────────────────────────────────────────────── -->
      <div class="stat-grid">
        <div class="stat-card stat-card--accent">
          <span class="stat-card__icon">👁️</span>
          <span class="stat-card__val">{{ todayViews }}</span>
          <span class="stat-card__label">Views today</span>
        </div>
        <div class="stat-card">
          <span class="stat-card__icon">🙋</span>
          <span class="stat-card__val">{{ todaySessions }}</span>
          <span class="stat-card__label">Sessions today</span>
        </div>
        <div class="stat-card">
          <span class="stat-card__icon">📅</span>
          <span class="stat-card__val">{{ weekViews }}</span>
          <span class="stat-card__label">Views this week</span>
        </div>
        <div class="stat-card">
          <span class="stat-card__icon">👥</span>
          <span class="stat-card__val">{{ weekSessions }}</span>
          <span class="stat-card__label">Sessions this week</span>
        </div>
        <div class="stat-card">
          <span class="stat-card__icon">📈</span>
          <span class="stat-card__val">{{ totalViews }}</span>
          <span class="stat-card__label">Total views ({{ range }}d)</span>
        </div>
        <div class="stat-card">
          <span class="stat-card__icon">🆔</span>
          <span class="stat-card__val">{{ uniqueSessions }}</span>
          <span class="stat-card__label">Unique sessions ({{ range }}d)</span>
        </div>
      </div>

      <!-- ── Bar chart ──────────────────────────────────────────────────────── -->
      <div class="panel">
        <h3 class="panel__title">Views per day</h3>
        <div class="bar-chart" :style="{ '--bars': dailyCounts.length }">
          <div v-for="day in dailyCounts" :key="day.date" class="bar-col">
            <div class="bar-col__tip" v-if="day.views > 0">
              {{ day.views }}
            </div>
            <div
              class="bar-col__bar"
              :style="{ height: barHeight(day.views) }"
              :title="`${formatDate(day.date)}: ${day.views} views, ${day.sessions} sessions`"
            ></div>
            <div class="bar-col__label">
              <span v-if="labeledDates.has(day.date)">{{
                formatDate(day.date)
              }}</span>
            </div>
          </div>
        </div>
        <div v-if="totalViews === 0" class="empty-note">
          No data yet for this range. Make sure analytics cookies are accepted
          on the site.
        </div>
      </div>

      <!-- ── Bottom row ──────────────────────────────────────────────────────── -->
      <div class="bottom-row">
        <!-- Top pages -->
        <div class="panel panel--half">
          <h3 class="panel__title">Top pages</h3>
          <div v-if="topPages.length === 0" class="empty-note">
            No data yet.
          </div>
          <div v-else class="bar-list">
            <div v-for="p in topPages" :key="p.page" class="bar-list__row">
              <span class="bar-list__label" :title="p.page">{{ p.page }}</span>
              <div class="bar-list__track">
                <div
                  class="bar-list__fill"
                  :style="{
                    width: `${Math.round((p.views / maxPageViews) * 100)}%`,
                  }"
                ></div>
              </div>
              <span class="bar-list__count">{{ p.views }}</span>
            </div>
          </div>
        </div>

        <!-- Right column -->
        <div class="right-col">
          <!-- Device breakdown -->
          <div class="panel">
            <h3 class="panel__title">Devices</h3>
            <div v-if="deviceBreakdown.length === 0" class="empty-note">
              No data yet.
            </div>
            <div v-else class="device-list">
              <div
                v-for="d in deviceBreakdown"
                :key="d.type"
                class="device-row"
              >
                <span class="device-row__icon">{{ deviceIcon(d.type) }}</span>
                <span class="device-row__type">{{ d.type }}</span>
                <div class="device-row__track">
                  <div
                    class="device-row__fill"
                    :style="{
                      width: `${d.percent}%`,
                      background: deviceColour[d.type] ?? '#e8c8d8',
                    }"
                  ></div>
                </div>
                <span class="device-row__pct">{{ d.percent }}%</span>
              </div>
            </div>
          </div>

          <!-- Top referrers -->
          <div class="panel">
            <h3 class="panel__title">Top referrers</h3>
            <div v-if="topReferrers.length === 0" class="empty-note">
              No data yet.
            </div>
            <div v-else class="bar-list">
              <div
                v-for="r in topReferrers"
                :key="r.referrer"
                class="bar-list__row"
              >
                <span class="bar-list__label" :title="r.referrer">{{
                  shortRef(r.referrer)
                }}</span>
                <div class="bar-list__track">
                  <div
                    class="bar-list__fill bar-list__fill--alt"
                    :style="{
                      width: `${Math.round((r.count / maxRefViews) * 100)}%`,
                    }"
                  ></div>
                </div>
                <span class="bar-list__count">{{ r.count }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
/* ── Layout ──────────────────────────────────────────────────────────────────── */
.analytics {
  padding: 28px 28px 60px;
  max-width: 1200px;
  margin: 0 auto;
}

.analytics__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 14px;
  margin-bottom: 24px;
}

.analytics__title {
  font-family: var(--font-heading);
  font-size: 1.5rem;
  color: var(--dark);
}

/* ── Range tabs ───────────────────────────────────────────────────────────────── */
.range-tabs {
  display: flex;
  align-items: center;
  gap: 6px;
}

.range-btn {
  padding: 7px 16px;
  border-radius: 20px;
  border: 1.5px solid #f0c8d4;
  background: #fff;
  color: var(--mid);
  font-size: 0.82rem;
  font-weight: 700;
  font-family: var(--font-body);
  cursor: pointer;
  transition: all 0.18s;
}

.range-btn.active,
.range-btn:hover {
  background: var(--primrose);
  color: #fff;
  border-color: var(--primrose);
}

.refresh-btn {
  padding: 6px 10px;
  border-radius: 20px;
  border: 1.5px solid #f0c8d4;
  background: #fff;
  color: var(--mid);
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.18s;
  line-height: 1;
}

.refresh-btn:hover {
  background: #fdeaec;
}

.spinning {
  display: inline-block;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ── Error / loading ──────────────────────────────────────────────────────────── */
.analytics__error {
  background: #fff0f0;
  border: 1px solid #f5c0c0;
  color: #c04040;
  padding: 12px 16px;
  border-radius: 12px;
  margin-bottom: 20px;
  font-size: 0.88rem;
}

.analytics__loading {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--mid);
  padding: 40px 0;
  justify-content: center;
  font-size: 0.9rem;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2.5px solid #f0c8d4;
  border-top-color: var(--primrose);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  display: inline-block;
}

/* ── Stat cards ───────────────────────────────────────────────────────────────── */
.stat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 14px;
  margin-bottom: 24px;
}

.stat-card {
  background: #fff;
  border: 1.5px solid #f5dce4;
  border-radius: 16px;
  padding: 18px 16px 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  box-shadow: 0 2px 10px rgba(242, 151, 160, 0.08);
}

.stat-card--accent {
  background: linear-gradient(135deg, #fdeaec, #fff5f8);
  border-color: var(--primrose);
}

.stat-card__icon {
  font-size: 1.4rem;
}

.stat-card__val {
  font-size: 1.9rem;
  font-weight: 800;
  color: var(--dark);
  line-height: 1.1;
}

.stat-card__label {
  font-size: 0.72rem;
  color: var(--mid);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-align: center;
}

/* ── Panels ───────────────────────────────────────────────────────────────────── */
.panel {
  background: #fff;
  border: 1.5px solid #f5dce4;
  border-radius: 18px;
  padding: 20px 22px 18px;
  box-shadow: 0 2px 10px rgba(242, 151, 160, 0.07);
  margin-bottom: 18px;
}

.panel__title {
  font-family: var(--font-body);
  font-size: 0.82rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: var(--mid);
  margin-bottom: 16px;
}

.empty-note {
  font-size: 0.85rem;
  color: var(--light-text);
  text-align: center;
  padding: 10px 0;
}

/* ── Bar chart ────────────────────────────────────────────────────────────────── */
.bar-chart {
  display: flex;
  align-items: flex-end;
  gap: 3px;
  height: 180px;
  padding-bottom: 24px;
  position: relative;
}

.bar-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
  position: relative;
}

.bar-col__tip {
  font-size: 0.6rem;
  color: var(--mid);
  position: absolute;
  top: -16px;
  white-space: nowrap;
}

.bar-col__bar {
  width: 100%;
  min-height: 2px;
  background: linear-gradient(to top, #e8407c, #f297a0);
  border-radius: 4px 4px 0 0;
  transition: height 0.4s ease;
  cursor: default;
}

.bar-col__bar:hover {
  background: linear-gradient(to top, #c02560, #e8407c);
}

.bar-col__label {
  position: absolute;
  bottom: -32px;
  font-size: 0.62rem;
  color: var(--mid);
  white-space: nowrap;
  transform: rotate(-30deg) translateX(-4px);
  transform-origin: top left;
}

/* ── Bottom row ───────────────────────────────────────────────────────────────── */
.bottom-row {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 18px;
}

@media (max-width: 860px) {
  .bottom-row {
    grid-template-columns: 1fr;
  }
}

.panel--half {
  margin-bottom: 0;
}

.right-col {
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* ── Horizontal bar list (pages & referrers) ─────────────────────────────────── */
.bar-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.bar-list__row {
  display: grid;
  grid-template-columns: 120px 1fr 36px;
  align-items: center;
  gap: 8px;
}

.bar-list__label {
  font-size: 0.8rem;
  color: var(--dark);
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.bar-list__track {
  height: 8px;
  background: #f5dce4;
  border-radius: 50px;
  overflow: hidden;
}

.bar-list__fill {
  height: 100%;
  background: linear-gradient(90deg, #e8407c, #f297a0);
  border-radius: 50px;
  transition: width 0.5s ease;
}

.bar-list__fill--alt {
  background: linear-gradient(90deg, #9ea86a, #b6bb79);
}

.bar-list__count {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--mid);
  text-align: right;
}

/* ── Device list ──────────────────────────────────────────────────────────────── */
.device-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.device-row {
  display: grid;
  grid-template-columns: 22px 64px 1fr 36px;
  align-items: center;
  gap: 8px;
}

.device-row__icon {
  font-size: 1rem;
}

.device-row__type {
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--dark);
  text-transform: capitalize;
}

.device-row__track {
  height: 8px;
  background: #f5dce4;
  border-radius: 50px;
  overflow: hidden;
}

.device-row__fill {
  height: 100%;
  border-radius: 50px;
  transition: width 0.5s ease;
}

.device-row__pct {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--mid);
  text-align: right;
}
</style>
