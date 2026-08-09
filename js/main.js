/* Main entry point */
import { SITE } from "./config.js";
import { initCursor } from "./cursor.js";
import { initNav } from "./nav.js";
import { initSmoke } from "./smoke.js";
import { initReveal, initWorkflow, initTimeline } from "./reveal.js";
import { initProjects } from "./projects.js";
import { initScene } from "./scene.js";
import { initTilt } from "./tilt.js";

injectVisualOverrides();
applyConfig();
applySEO();
initCursor();
initNav();
initSmoke();
initReveal();
initWorkflow();
initTimeline();
initProjects();
initTilt();
initScene();
initNameShine();
initBackgroundInteraction();

function injectVisualOverrides() {
  if (document.querySelector('link[data-visual-overrides]')) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "./css/overrides.css?v=6";
  link.dataset.visualOverrides = "true";
  document.head.appendChild(link);
}
function applyConfig() {
  document.querySelectorAll('[data-bind="name"]').forEach((el) => (el.textContent = SITE.name));
  document.querySelectorAll('[data-bind="name-short"]').forEach((el) => (el.textContent = SITE.nameShort));
  document.querySelectorAll('[data-bind="email-link"]').forEach((el) => el.setAttribute("href", `mailto:${SITE.email}`));
  document.querySelectorAll('[data-bind="linkedin-link"]').forEach((el) => el.setAttribute("href", SITE.linkedin));
  document.querySelectorAll('[data-bind="instagram-link"]').forEach((el) => el.setAttribute("href", SITE.instagram));
  document.querySelectorAll('[data-bind="resume-link"]').forEach((el) => el.setAttribute("href", SITE.resumePath));
  document.querySelectorAll('[data-bind="profile-image"]').forEach((img) => { img.src = SITE.profileImagePath; });
}
function applySEO() {
  const canonical = window.location.origin + window.location.pathname;
  const title = "Harshal Chouhan | Key Account Manager, Project Coordinator & MBA Finance";
  const description = "Portfolio of Harshal Chouhan — Key Account Manager, Project Coordinator and MBA Finance professional focused on client relationships, project execution, creative collaboration and business growth.";
  document.title = title;
  setMeta("description", description);
  setMeta("keywords", "Harshal Chouhan, Key Account Manager, Project Coordinator, MBA Finance, client management, project management, creative collaboration, portfolio");
  setMetaProperty("og:url", canonical); setMetaProperty("og:title", title); setMetaProperty("og:description", description);
  document.querySelector('link[rel="canonical"]')?.setAttribute("href", canonical);
  const schema = document.querySelector('script[type="application/ld+json"]');
  if (schema) { try { const data = JSON.parse(schema.textContent); data.url = canonical; data.sameAs = [SITE.linkedin]; data.email = SITE.email; schema.textContent = JSON.stringify(data); } catch (_) {} }
}
function setMeta(name, content) { let el = document.querySelector(`meta[name="${name}"]`); if (!el) { el = document.createElement("meta"); el.name = name; document.head.appendChild(el); } el.content = content; }
function setMetaProperty(property, content) { let el = document.querySelector(`meta[property="${property}"]`); if (!el) { el = document.createElement("meta"); el.setAttribute("property", property); document.head.appendChild(el); } el.content = content; }

function initNameShine() {
  const heroName = document.querySelector('.hero-title span[data-bind="name"]');
  if (!heroName) return;
  let last = 0;
  const shine = () => {
    const now = performance.now();
    if (now - last < 1100) return;
    last = now;
    heroName.classList.remove("shine");
    void heroName.offsetWidth;
    heroName.classList.add("shine");
  };
  window.addEventListener("scroll", shine, { passive: true });
  window.addEventListener("mousemove", shine, { passive: true });
  setInterval(() => { if (document.visibilityState === "visible") shine(); }, 6500);
}

function initBackgroundInteraction() {
  window.addEventListener("pointerdown", (event) => {
    if (event.target.closest("a,button,input,textarea,select")) return;
    const ripple = document.createElement("span");
    ripple.className = "bg-ripple";
    ripple.style.left = `${event.clientX}px`; ripple.style.top = `${event.clientY}px`;
    document.body.appendChild(ripple);
    for (let i = 0; i < 8; i++) {
      const p = document.createElement("span"); p.className = "bg-particle";
      p.style.left = `${event.clientX}px`; p.style.top = `${event.clientY}px`;
      const angle = (Math.PI * 2 * i) / 8; const distance = 25 + Math.random() * 45;
      p.style.setProperty("--dx", `${Math.cos(angle) * distance}px`); p.style.setProperty("--dy", `${Math.sin(angle) * distance}px`);
      document.body.appendChild(p); p.addEventListener("animationend", () => p.remove(), { once: true });
    }
    ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
  }, { passive: true });
}
