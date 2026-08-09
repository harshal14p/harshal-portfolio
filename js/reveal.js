/* ==========================================================================
   SCROLL-DRIVEN UI
   - Fade/slide-up reveal for elements marked .reveal
   - Progress line + active stage highlighting for the workflow section
   - Expand/collapse behaviour for the experience timeline
   ========================================================================== */

export function initReveal() {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealEls = document.querySelectorAll(".reveal");

  if (prefersReduced) {
    // Show everything immediately, no staggered motion
    revealEls.forEach((el) => el.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach((el) => observer.observe(el));
  }
}

export function initWorkflow() {
  const track = document.getElementById("workflow-track");
  const fill = document.getElementById("workflow-fill");
  const stages = document.querySelectorAll("#workflow-stages .stage");
  if (!track || !fill || !stages.length) return;

  function update() {
    const rect = track.getBoundingClientRect();
    const viewportH = window.innerHeight;

    // Progress = how far the track has travelled through the viewport
    const total = rect.height + viewportH * 0.6;
    const traveled = viewportH * 0.85 - rect.top;
    const progress = Math.max(0, Math.min(1, traveled / total));

    fill.style.width = `${progress * 100}%`;

    const activeIndex = Math.floor(progress * stages.length);
    stages.forEach((stage, i) => {
      stage.classList.toggle("is-active", i <= activeIndex);
    });
  }

  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
}

export function initTimeline() {
  const items = document.querySelectorAll(".timeline-item");
  items.forEach((item) => {
    const toggle = item.querySelector(".timeline-toggle");
    if (!toggle) return;
    toggle.addEventListener("click", () => {
      const isOpen = item.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });
  });

  // Open the first (current) role by default
  if (items[0]) {
    items[0].classList.add("is-open");
    items[0].querySelector(".timeline-toggle")?.setAttribute("aria-expanded", "true");
  }
}
