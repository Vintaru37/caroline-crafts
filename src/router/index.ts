import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: {
        title: "CarolineCrafts – Coloring Books & Notebooks on Amazon",
        description:
          "Beautiful coloring books and elegant notebooks designed by Caroline. Available on Amazon with worldwide shipping. Relax, color, create.",
      },
    },
    {
      path: "/products",
      name: "products",
      component: () => import("../views/ProductsView.vue"),
      meta: {
        title: "Products – CarolineCrafts",
        description:
          "Browse all CarolineCrafts coloring books and notebooks. Filter by category and find the perfect book to inspire your creativity.",
      },
    },
    {
      path: "/coloring-books",
      redirect: { name: "products", query: { kind: "coloring-books" } },
    },
    {
      path: "/notebooks",
      redirect: { name: "products", query: { kind: "notebooks" } },
    },
    {
      path: "/contact",
      name: "contact",
      component: () => import("../views/ContactView.vue"),
      meta: {
        title: "Contact – CarolineCrafts",
        description:
          "Get in touch with Caroline. Ask about custom designs, commissions, or just say hello! Find us on Instagram and TikTok too.",
      },
    },
    {
      path: "/admin",
      name: "admin",
      component: () => import("../views/AdminView.vue"),
      meta: {
        title: "Admin – CarolineCrafts",
      },
    },
    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: () => import("../views/NotFoundView.vue"),
      meta: {
        title: "Page Not Found – CarolineCrafts",
      },
    },
  ],
  scrollBehavior() {
    return { top: 0, behavior: "smooth" };
  },
});

// Keep <title>, meta description, and canonical in sync on every navigation
router.afterEach((to) => {
  const { title, description } = (to.meta ?? {}) as {
    title?: string;
    description?: string;
  };

  if (title) {
    document.title = title;
  }

  if (description) {
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", description);
  }

  // Update canonical URL
  let canonical = document.querySelector(
    'link[rel="canonical"]',
  ) as HTMLLinkElement | null;
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.rel = "canonical";
    document.head.appendChild(canonical);
  }
  canonical.href = window.location.origin + to.path;
});

export default router;
