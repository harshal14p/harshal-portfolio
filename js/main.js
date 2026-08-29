/* Stable portfolio bootstrap. One layout system; optional features are isolated. */
import { SITE } from "./config.js";
applyConfig();
applySEO();
load("./cursor.js","initCursor");
load("./nav.js","initNav");
load("./reveal.js","initReveal");
load("./reveal.js","initWorkflow");
load("./reveal.js","initTimeline");
load("./projects.js","initProjects");
load("./project-recovery.js","initProjectRecovery");
load("./tilt.js","initTilt");
load("./genz-playground.js","initGenzPlayground");
load("./stability.js","initStability");
loadSelf("./video-review-v2.js");
/* Do not load mobile-fixes: it imports retired cinematic CSS and injects global hero rules after the final stylesheet. */
loadStyle("css/final-stability-fixes.css");
loadStyle("css/clean-ui-overrides.css");
initWhatsApp();
initContactActions();

async function load(path,fn){try{const mod=await import(path);if(typeof mod[fn]==="function")mod[fn]();}catch(error){console.warn(`[Portfolio] optional module skipped: ${path}`,error);fallbackReveal();}}
async function loadSelf(path){try{await import(path);}catch(error){console.warn(`[Portfolio] optional feature skipped: ${path}`,error);fallbackReveal();}}
function loadStyle(path){if(document.querySelector(`link[href="${path}"]`))return;const link=document.createElement("link");link.rel="stylesheet";link.href=path;document.head.appendChild(link)}
function fallbackReveal(){document.querySelectorAll(".reveal").forEach(el=>{el.classList.add("is-visible");el.style.opacity="1";el.style.transform="translateY(0)"})}
function applyConfig(){document.querySelectorAll('[data-bind="name"]').forEach(el=>el.textContent=SITE.name);document.querySelectorAll('[data-bind="name-short"]').forEach(el=>el.textContent=SITE.nameShort);document.querySelectorAll('[data-bind="email-link"]').forEach(el=>el.href=`mailto:${SITE.email}`);document.querySelectorAll('[data-bind="linkedin-link"]').forEach(el=>el.href=SITE.linkedin);document.querySelectorAll('[data-bind="instagram-link"]').forEach(el=>el.href=SITE.instagram);document.querySelectorAll('[data-bind="resume-link"]').forEach(el=>el.href=SITE.resumePath);document.querySelectorAll('[data-bind="profile-image"]').forEach(img=>{img.src=SITE.profileImagePath;img.addEventListener("error",()=>{img.style.display="block";img.style.visibility="visible";img.style.opacity="1"},{once:true})})}
function applySEO(){const base="https://harshal-portfolio-tau.vercel.app/";const title="Harshal Chouhan | Key Account Manager, Project Coordinator & MBA Finance";const description="Harshal Chouhan — Key Account Manager and Project Coordinator with an MBA in Finance, focused on client relationships, project coordination and creative execution.";document.title=title;setMeta("description",description);setMeta("og:title",title,true);setMeta("og:description",description,true);setMeta("og:url",base,true);setMeta("og:image",new URL(SITE.profileImagePath,base).href,true);setMeta("twitter:title",title);setMeta("twitter:description",description);setMeta("twitter:image",new URL(SITE.profileImagePath,base).href);const canonical=document.querySelector('link[rel="canonical"]');if(canonical)canonical.href=base}
function setMeta(name,content,property=false){let el=document.querySelector(`meta[${property?"property":"name"}="${name}"]`);if(!el){el=document.createElement("meta");el.setAttribute(property?"property":"name",name);document.head.appendChild(el)}el.content=content}
function initWhatsApp(){document.querySelectorAll("[data-whatsapp]").forEach(el=>el.addEventListener("click",()=>{const number=String(el.dataset.whatsapp||"").replace(/\D/g,"");if(number)window.open(`https://wa.me/${number}`,"_blank","noopener,noreferrer")}))}
function initContactActions(){document.querySelectorAll("[data-action=call]").forEach(el=>el.addEventListener("click",()=>{const n=String(el.dataset.phone||SITE.phone||"").replace(/\D/g,"");if(n)window.location.href=`tel:${n}`}));document.querySelectorAll("[data-action=email]").forEach(el=>el.addEventListener("click",()=>{const e=el.dataset.email||SITE.email;if(e)window.location.href=`mailto:${e}`}))}
