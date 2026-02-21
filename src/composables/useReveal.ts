import { onMounted, onUnmounted } from "vue";

export function useReveal() {
  let observer: IntersectionObserver | null = null;
  let mutationObserver: MutationObserver | null = null;

  const observeReveal = (node: Element) => {
    if (!observer) return;
    if (node.classList.contains("reveal")) {
      observer.observe(node);
    }
    node.querySelectorAll?.(".reveal").forEach((el) => observer?.observe(el));
  };

  onMounted(() => {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -56px 0px" },
    );

    document.querySelectorAll(".reveal").forEach((el) => observer?.observe(el));

    mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((m) => {
        m.addedNodes.forEach((added) => {
          if (!(added instanceof Element)) return;
          observeReveal(added);
        });
      });
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });
  });

  onUnmounted(() => {
    observer?.disconnect();
    mutationObserver?.disconnect();
  });
}
