/* Main entry point */
import { SITE } from "./config.js";
import { initCursor } from "./cursor.js";
import { initNav } from "./nav.js";
import { initReveal, initWorkflow, initTimeline } from "./reveal.js";
import { initProjects } from "./projects.js";
import { initScene } from "./scene.js";
import { initTilt } from "./tilt.js";
import { initGalaxy } from "./galaxy.js?v=10";

injectVisualOverrides();
ensureGalaxyCanvas();
applyConfig();
applySEO();
removeCertificateSection();
initCursor();
initNav();
initReveal();
initWorkflow();
initTimeline();
initProjects();
initTilt();
initGalaxy();
initWhatsApp();

function ensureGalaxyCanvas() {
  if (document.getElementById("galaxy-canvas")) return;
  const canvas = document.createElement("canvas");
  canvas.id = "galaxy-canvas";
  canvas.setAttribute("aria-hidden", "true");
  document.body.prepend(canvas);
}
function injectVisualOverrides() {
  if (document.querySelector('link[data-visual-overrides]')) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "./css/overrides.css?v=11";
  link.dataset.visualOverrides = "true";
  document.head.appendChild(link);
}
function removeCertificateSection() {
  document.querySelectorAll('section, nav a, .nav-links a, .mobile-menu a').forEach((el) => {
    const id = (el.id || "").toLowerCase();
    const cls = typeof el.className === "string" ? el.className.toLowerCase() : "";
    const text = (el.textContent || "").trim().toLowerCase().replace(/\s+/g, " ");
    if (id.includes("certif") || cls.includes("certif") || (el.tagName === "SECTION" && /^(certificate|certificates|certification|certifications)$/.test(text))) el.remove();
  });
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

function initWhatsApp() {
  const phone = String(SITE.phone || "").replace(/\D/g, "");
  if (!phone || document.getElementById("whatsapp-float")) return;
  const message = encodeURIComponent("Hi Harshal, I found your portfolio and would like to connect with you.");
  const href = `https://wa.me/91${phone}?text=${message}`;
  document.querySelectorAll('[data-bind="whatsapp-link"]').forEach((el) => {
    el.href = href;
    el.target = "_blank";
    el.rel = "noopener noreferrer";
  });
  const button = document.createElement("a");
  button.id = "whatsapp-float";
  button.href = href;
  button.target = "_blank";
  button.rel = "noopener noreferrer";
  button.setAttribute("aria-label", "Chat with Harshal on WhatsApp");
  button.setAttribute("title", "Chat with me on WhatsApp");
  button.innerHTML = '<span class="wa-icon" aria-hidden="true">◔</span><span class="wa-label">WhatsApp</span>';
  document.body.appendChild(button);
}
