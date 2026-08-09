/* ==========================================================================
   MAIN ENTRY POINT
   Applies the values from config.js to the page, then boots every
   feature module. Each module is independent — if one fails, the rest
   of the site keeps working.
   ========================================================================== */

import { SITE } from "./config.js";
import { initCursor } from "./cursor.js";
import { initNav } from "./nav.js";
import { initSmoke } from "./smoke.js";
import { initReveal, initWorkflow, initTimeline } from "./reveal.js";
import { initProjects } from "./projects.js";
import { initScene } from "./scene.js";
import { initTilt } from "./tilt.js";

applyConfig();
initCursor();
initNav();
initSmoke();
initReveal();
initWorkflow();
initTimeline();
initProjects();
initTilt();
initScene(); // async — safe to fire and forget; it self-handles fallbacks

/* --------------------------------------------------------------------------
   Binds config.js values onto every element marked data-bind="...".
   Add SITE.<field> in config.js and reference it with data-bind here if
   you need to inject more values later.
   -------------------------------------------------------------------------- */
function applyConfig() {
  document.querySelectorAll('[data-bind="name"]').forEach((el) => (el.textContent = SITE.name));
  document.querySelectorAll('[data-bind="name-short"]').forEach((el) => (el.textContent = SITE.nameShort));

  document.querySelectorAll('[data-bind="email-link"]').forEach((el) => {
    el.setAttribute("href", `mailto:${SITE.email}`);
  });
  document.querySelectorAll('[data-bind="linkedin-link"]').forEach((el) => {
    el.setAttribute("href", SITE.linkedin);
  });
  document.querySelectorAll('[data-bind="instagram-link"]').forEach((el) => {
    el.setAttribute("href", SITE.instagram);
  });
  document.querySelectorAll('[data-bind="resume-link"]').forEach((el) => {
    el.setAttribute("href", SITE.resumePath);
  });

  document.querySelectorAll('[data-bind="profile-image"]').forEach((img) => {
    img.src = SITE.profileImagePath;
    img.addEventListener("error", () => {
      img.style.display = "none";
      const wrap = img.closest(".hero-photo-inner");
      if (wrap && !wrap.querySelector(".photo-fallback")) {
        const initials = document.createElement("div");
        initials.className = "photo-fallback";
        initials.textContent = SITE.nameShort;
        wrap.appendChild(initials);
      }
    });
  });
}
const heroName = document.querySelector('.hero-title span[data-bind="name"]');

if (heroName) {
  heroName.addEventListener("click", () => {
    heroName.classList.remove("shine");
    void heroName.offsetWidth;
    heroName.classList.add("shine");
  });
}
