/* ==========================================================================
   CUSTOM CURSOR
   Small dot + trailing ring that follows the pointer, with a subtle
   "magnetic" enlarge effect over interactive elements. Automatically
   disabled on touch devices.
   ========================================================================== */

export function initCursor() {
  const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
  if (isTouch) {
    document.documentElement.classList.add("no-custom-cursor");
    return;
  }

  const dot = document.getElementById("cursor-dot");
  const ring = document.getElementById("cursor-ring");
  if (!dot || !ring) return;

  const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const ringPos = { x: pointer.x, y: pointer.y };

  window.addEventListener("mousemove", (e) => {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    dot.style.transform = `translate(${pointer.x}px, ${pointer.y}px) translate(-50%, -50%)`;
  });

  // Magnetic ring enlarges over anything marked data-cursor="link"
  document.addEventListener("mouseover", (e) => {
    if (e.target.closest("[data-cursor='link']")) ring.classList.add("is-active");
  });
  document.addEventListener("mouseout", (e) => {
    if (e.target.closest("[data-cursor='link']")) ring.classList.remove("is-active");
  });

  function loop() {
    // Damped follow for the ring so it trails smoothly behind the dot
    ringPos.x += (pointer.x - ringPos.x) * 0.18;
    ringPos.y += (pointer.y - ringPos.y) * 0.18;
    ring.style.transform = `translate(${ringPos.x}px, ${ringPos.y}px) translate(-50%, -50%)`;
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  document.addEventListener("mouseleave", () => {
    dot.style.opacity = "0";
    ring.style.opacity = "0";
  });
  document.addEventListener("mouseenter", () => {
    dot.style.opacity = "1";
    ring.style.opacity = "1";
  });
}
