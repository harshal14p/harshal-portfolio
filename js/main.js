/* Stable portfolio bootstrap — optional modules are isolated so one bug can never blank the site. */
import { SITE } from "./config.js";
showContent();
applyConfig();
applySEO();
removeCertificateSection();
load("./cursor.js","initCursor");
load("./nav.js","initNav");
load("./reveal.js","initReveal");
load("./reveal.js","initWorkflow");
load("./reveal.js","initTimeline");
load("./projects.js","initProjects");
load("./tilt.js","initTilt");
load("./galaxy.js?v=10","initGalaxy",true);
initWhatsApp();
initContactActions();
async function load(path,fn,canvas=false){try{if(canvas)ensureGalaxyCanvas();const mod=await import(path);if(typeof mod[fn]==="function")mod[fn]();}catch(error){console.warn(`[Portfolio] optional module skipped: ${path}`,error);showContent();}}
function showContent(){document.querySelectorAll(".reveal").forEach(el=>{el.classList.add("is-visible");el.style.opacity="1";el.style.transform="translateY(0)";});}
function ensureGalaxyCanvas(){if(document.getElementById("galaxy-canvas"))return;const canvas=document.createElement("canvas");canvas.id="galaxy-canvas";canvas.setAttribute("aria-hidden","true");document.body.prepend(canvas)}
function applyConfig(){document.querySelectorAll('[data-bind="name"]').forEach(el=>el.textContent=SITE.name);document.querySelectorAll('[data-bind="name-short"]').forEach(el=>el.textContent=SITE.nameShort);document.querySelectorAll('[data-bind="email-link"]').forEach(el=>el.href=`mailto:${SITE.email}`);document.querySelectorAll('[data-bind="linkedin-link"]').forEach(el=>el.href=SITE.linkedin);document.querySelectorAll('[data-bind="instagram-link"]').forEach(el=>el.href=SITE.instagram);document.querySelectorAll('[data-bind="resume-link"]').forEach(el=>el.href=SITE.resumePath);document.querySelectorAll('[data-bind="profile-image"]').forEach(img=>img.src=SITE.profileImagePath)}
function applySEO(){document.title="Harshal Chouhan | Key Account Manager, Project Coordinator & MBA Finance";const meta=document.querySelector('meta[name="description"]');if(meta)meta.content="Portfolio of Harshal Chouhan — Key Account Manager, Project Coordinator and MBA Finance professional."}
function removeCertificateSection(){document.querySelectorAll('section.certifications,#certifications').forEach(el=>el.remove());document.querySelectorAll('nav a,.nav-links a,.mobile-menu a').forEach(el=>{if(/certif/i.test(el.textContent||""))el.remove()})}
function getWhatsAppHref(){const phone=String(SITE.phone||"").replace(/\D/g,"");return phone?`https://wa.me/91${phone}?text=${encodeURIComponent("Hi Harshal, I found your portfolio and would like to connect with you.")}`:"#"}
function initWhatsApp(){document.querySelectorAll('[data-bind="whatsapp-link"]').forEach(el=>{el.href=getWhatsAppHref();el.target="_blank";el.rel="noopener noreferrer"})}
function initContactActions(){const actions=document.querySelector(".contact-actions");if(!actions)return;const wa=actions.querySelector('[data-bind="whatsapp-link"]');if(wa){wa.href=getWhatsAppHref();wa.target="_blank";wa.rel="noopener noreferrer"}}
