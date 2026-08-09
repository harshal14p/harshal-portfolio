/* ==========================================================================
   SUBTLE CARD TILT
   A very light tilt-toward-cursor effect on the "What I Do" cards.
   Disabled on touch devices and when reduced motion is requested.
   ========================================================================== */

const MAX_TILT = 5; // degrees — deliberately subtle

export function initTilt() {
  const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (isTouch || prefersReduced) return;

  document.querySelectorAll(".tilt-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * MAX_TILT}deg) rotateX(${-y * MAX_TILT}deg) translateY(-2px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg)";
    });
  });
}
