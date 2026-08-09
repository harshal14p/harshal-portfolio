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
initContactActions();

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
  link.href = "./css/overrides.css?v=12";
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

/* Contact row: remove Resume and add WhatsApp beside the existing Call/Email/LinkedIn actions. */
function initContactActions() {
  const actions = document.querySelector(".contact-actions");
  if (!actions) return;

  const resume = actions.querySelector('[data-bind="resume-link"]');
  if (resume) resume.remove();

  const call = actions.querySelector('a[href^="tel:"]');
  if (call) {
    call.textContent = "";
    call.innerHTML = `${iconPhone()}<span>Call Me</span>`;
    call.classList.add("contact-glass-action");
    call.setAttribute("aria-label", "Call Harshal");
  }

  const email = actions.querySelector('[data-bind="email-link"]');
  if (email) {
    email.textContent = "";
    email.innerHTML = `${iconMail()}<span>Email Me</span>`;
    email.classList.add("contact-glass-action");
    email.setAttribute("aria-label", "Email Harshal");
  }

  const linkedin = actions.querySelector('[data-bind="linkedin-link"]');
  if (linkedin && linkedin.closest(".contact-actions")) {
    linkedin.textContent = "";
    linkedin.innerHTML = `${iconLinkedIn()}<span>Connect</span>`;
    linkedin.classList.add("contact-glass-action");
    linkedin.setAttribute("aria-label", "Connect with Harshal on LinkedIn");
  }

  if (!actions.querySelector(".contact-whatsapp")) {
    const wa = document.createElement("a");
    const phone = String(SITE.phone || "").replace(/\D/g, "");
    const message = encodeURIComponent("Hi Harshal, I found your portfolio and would like to connect with you.");
    wa.className = "btn btn-ghost contact-glass-action contact-whatsapp";
    wa.href = `https://wa.me/91${phone}?text=${message}`;
    wa.target = "_blank";
    wa.rel = "noopener noreferrer";
    wa.setAttribute("data-cursor", "link");
    wa.setAttribute("aria-label", "Chat with Harshal on WhatsApp");
    wa.innerHTML = `${iconWhatsApp()}<span>Chat Now</span>`;
    actions.appendChild(wa);
  }

  if (!document.getElementById("contact-action-style")) {
    const style = document.createElement("style");
    style.id = "contact-action-style";
    style.textContent = `
      .contact-actions{display:flex;flex-wrap:wrap;align-items:center;gap:18px!important}
      .contact-glass-action{display:inline-flex!important;align-items:center;justify-content:center;gap:14px;min-height:66px!important;padding:10px 24px!important;border-radius:22px!important;border:1px solid rgba(255,255,255,.11)!important;background:linear-gradient(145deg,rgba(255,255,255,.075),rgba(255,255,255,.025))!important;box-shadow:0 18px 45px rgba(0,0,0,.28),inset 0 1px 0 rgba(255,255,255,.08)!important;backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);transition:transform .35s ease,box-shadow .35s ease,border-color .35s ease!important}
      .contact-glass-action:hover{transform:translateY(-5px) translateZ(15px)!important;border-color:rgba(255,61,129,.35)!important;box-shadow:0 26px 55px rgba(0,0,0,.4),0 0 28px rgba(255,61,129,.09),inset 0 1px 0 rgba(255,255,255,.12)!important}
      .contact-glass-action .contact-icon{width:42px;height:42px;display:grid;place-items:center;border-radius:13px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);flex:0 0 auto}
      .contact-glass-action .contact-icon svg{width:21px;height:21px;stroke:currentColor;fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
      .contact-whatsapp .contact-icon{color:#62e28a}
      .contact-actions a[href^="tel:"] .contact-icon{color:#bba7ff}
      .contact-actions [data-bind="email-link"] .contact-icon{color:#fff}
      .contact-actions [data-bind="linkedin-link"] .contact-icon{color:#67aafc}
      @media(max-width:700px){.contact-actions{display:grid;grid-template-columns:1fr 1fr}.contact-glass-action{min-height:58px!important;padding:8px 12px!important;font-size:.78rem!important;gap:8px}.contact-glass-action .contact-icon{width:36px;height:36px;border-radius:11px}.contact-glass-action .contact-icon svg{width:18px;height:18px}}
      @media(max-width:430px){.contact-actions{grid-template-columns:1fr}.contact-glass-action{width:100%}}
    `;
    document.head.appendChild(style);
  }
}
function iconPhone(){return '<span class="contact-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 5.18 2 2 0 0 1 4.11 3h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8 10.73a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92z"/></svg></span>'}
function iconMail(){return '<span class="contact-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg></span>'}
function iconLinkedIn(){return '<span class="contact-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4V8h4v2.2A4.8 4.8 0 0 1 16 8Z"/><path d="M2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg></span>'}
function iconWhatsApp(){return '<span class="contact-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M20.5 3.5A10 10 0 0 0 3.7 16.1L2 22l6.1-1.6A10 10 0 1 0 20.5 3.5Z"/><path d="M8.5 7.5c.3-.7.6-.7 1-.7h.7c.2 0 .4.1.5.4l.9 2.1c.1.3.1.5-.1.7l-.7.8c.9 1.6 2.1 2.7 3.7 3.5l.8-.8c.2-.2.4-.3.7-.2l2.1 1c.3.1.4.3.4.6v.7c0 .4-.1.7-.7 1-1 .5-2.3.2-4.1-.8-2.5-1.3-4.4-3.2-5.7-5.7-1-1.8-1.3-3.1-.8-4.1Z"/></svg></span>'}
