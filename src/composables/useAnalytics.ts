import { ref, computed } from "vue";
import { supabase } from "../lib/supabase";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PageViewRow {
  id: number;
  created_at: string;
  page: string;
  referrer: string | null;
  device_type: string | null;
  session_id: string | null;
}

export interface DailyCount {
  date: string; // YYYY-MM-DD
  views: number;
  sessions: number;
}

export interface PageStat {
  page: string;
  views: number;
}

export interface DeviceStat {
  type: string;
  count: number;
  percent: number;
}

export interface ReferrerStat {
  referrer: string;
  count: number;
}

// ─── Consent helpers ──────────────────────────────────────────────────────────

export interface CookieConsent {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  answered: boolean;
}

const CONSENT_KEY = "cc_consent";

export function getConsent(): CookieConsent {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw)
      return {
        necessary: true,
        analytics: false,
        marketing: false,
        answered: false,
      };
    return JSON.parse(raw) as CookieConsent;
  } catch {
    return {
      necessary: true,
      analytics: false,
      marketing: false,
      answered: false,
    };
  }
}

export function saveConsent(consent: Omit<CookieConsent, "necessary">) {
  localStorage.setItem(
    CONSENT_KEY,
    JSON.stringify({ necessary: true, ...consent, answered: true }),
  );
}

// ─── Session ID ───────────────────────────────────────────────────────────────

function getOrCreateSessionId(): string {
  const key = "cc_session_id";
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = Math.random().toString(36).slice(2) + Date.now().toString(36);
    sessionStorage.setItem(key, id);
  }
  return id;
}

// ─── Device type ─────────────────────────────────────────────────────────────

function getDeviceType(): "mobile" | "tablet" | "desktop" {
  const ua = navigator.userAgent;
  if (/Mobi|Android/i.test(ua)) return "mobile";
  if (/Tablet|iPad/i.test(ua)) return "tablet";
  return "desktop";
}

// ─── Track a page view ────────────────────────────────────────────────────────

export async function trackPageView(page: string) {
  // Never record views while running on localhost / in dev mode
  if (import.meta.env.DEV) return;

  const consent = getConsent();
  if (!consent.analytics) return;

  const referrerHost = (() => {
    const r = document.referrer;
    if (!r) return null;
    try {
      return new URL(r).hostname;
    } catch {
      return r;
    }
  })();

  await supabase.from("page_views").insert({
    page,
    referrer: referrerHost,
    device_type: getDeviceType(),
    session_id: getOrCreateSessionId(),
    user_agent: navigator.userAgent,
  });
}

// ─── Analytics stats composable (admin only) ─────────────────────────────────

export function useAnalyticsStats() {
  const rows = ref<PageViewRow[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const fetchedDays = ref(30);

  async function fetchStats(days = 30) {
    isLoading.value = true;
    error.value = null;
    fetchedDays.value = days;

    const since = new Date();
    since.setDate(since.getDate() - days);

    const { data, error: err } = await supabase
      .from("page_views")
      .select("id, created_at, page, referrer, device_type, session_id")
      .gte("created_at", since.toISOString())
      .order("created_at", { ascending: true });

    if (err) {
      error.value = err.message;
    } else {
      rows.value = (data ?? []) as PageViewRow[];
    }
    isLoading.value = false;
  }

  // ── Daily counts for the fetched range ────────────────────────────────────
  const dailyCounts = computed((): DailyCount[] => {
    const map: Record<string, { views: number; sessions: Set<string> }> = {};
    for (const r of rows.value) {
      const d = r.created_at.slice(0, 10);
      if (!map[d]) map[d] = { views: 0, sessions: new Set() };
      map[d].views++;
      if (r.session_id) map[d].sessions.add(r.session_id);
    }

    const result: DailyCount[] = [];
    for (let i = fetchedDays.value - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      result.push({
        date: key,
        views: map[key]?.views ?? 0,
        sessions: map[key]?.sessions.size ?? 0,
      });
    }
    return result;
  });

  // ── Top pages ────────────────────────────────────────────────────────────
  const topPages = computed((): PageStat[] => {
    const map: Record<string, number> = {};
    for (const r of rows.value) {
      map[r.page] = (map[r.page] ?? 0) + 1;
    }
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([page, views]) => ({ page, views }));
  });

  // ── Device breakdown ─────────────────────────────────────────────────────
  const deviceBreakdown = computed((): DeviceStat[] => {
    const map: Record<string, number> = {};
    for (const r of rows.value) {
      const t = r.device_type ?? "unknown";
      map[t] = (map[t] ?? 0) + 1;
    }
    const total = rows.value.length || 1;
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .map(([type, count]) => ({
        type,
        count,
        percent: Math.round((count / total) * 100),
      }));
  });

  // ── Top referrers ────────────────────────────────────────────────────────
  const topReferrers = computed((): ReferrerStat[] => {
    const map: Record<string, number> = {};
    for (const r of rows.value) {
      const ref = r.referrer || "(direct)";
      map[ref] = (map[ref] ?? 0) + 1;
    }
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([referrer, count]) => ({ referrer, count }));
  });

  // ── Summary numbers ──────────────────────────────────────────────────────
  const totalViews = computed(() => rows.value.length);

  const uniqueSessions = computed(
    () => new Set(rows.value.map((r) => r.session_id).filter(Boolean)).size,
  );

  const todayViews = computed(() => {
    const today = new Date().toISOString().slice(0, 10);
    return rows.value.filter((r) => r.created_at.slice(0, 10) === today).length;
  });

  const todaySessions = computed(() => {
    const today = new Date().toISOString().slice(0, 10);
    return new Set(
      rows.value
        .filter((r) => r.created_at.slice(0, 10) === today)
        .map((r) => r.session_id)
        .filter(Boolean),
    ).size;
  });

  const weekViews = computed(() => {
    const since = new Date();
    since.setDate(since.getDate() - 7);
    return rows.value.filter((r) => new Date(r.created_at) >= since).length;
  });

  const weekSessions = computed(() => {
    const since = new Date();
    since.setDate(since.getDate() - 7);
    return new Set(
      rows.value
        .filter((r) => new Date(r.created_at) >= since)
        .map((r) => r.session_id)
        .filter(Boolean),
    ).size;
  });

  return {
    rows,
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
  };
}
