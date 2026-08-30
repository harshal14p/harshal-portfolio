import { SITE } from './config.js';

function applyConfig(){
  document.querySelectorAll('[data-bind="name"]').forEach(el=>el.textContent=SITE.name);
  document.querySelectorAll('[data-bind="name-short"]').forEach(el=>el.textContent=SITE.nameShort);
  document.querySelectorAll('[data-bind="email-link"]').forEach(el=>el.href=`mailto:${SITE.email}`);
  document.querySelectorAll('[data-bind="linkedin-link"]').forEach(el=>el.href=SITE.linkedin);
  document.querySelectorAll('[data-bind="instagram-link"]').forEach(el=>el.href=SITE.instagram);
  document.querySelectorAll('[data-bind="resume-link"]').forEach(el=>el.href=SITE.resumePath);
  document.querySelectorAll('[data-bind="profile-image"]').forEach(img=>{img.src=SITE.profileImagePath;});
}
function applySEO(){document.title='Harshal Chouhan | Key Account Manager, Project Coordinator & MBA Finance';}
function loadStyle(path){if(document.querySelector(`link[href="${path}"]`))return;const l=document.createElement('link');l.rel='stylesheet';l.href=path;document.head.appendChild(l);}
function initNav(){const nav=document.getElementById('site-nav'),toggle=document.getElementById('nav-toggle'),menu=document.getElementById('mobile-menu');const sync=()=>nav?.classList.toggle('scrolled',scrollY>20);addEventListener('scroll',sync,{passive:true});sync();if(toggle&&menu){toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')==='true';toggle.setAttribute('aria-expanded',String(!open));menu.classList.toggle('open',!open)});menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{toggle.setAttribute('aria-expanded','false');menu.classList.remove('open')}));}}
function initTimeline(){document.querySelectorAll('.timeline-toggle').forEach(btn=>btn.addEventListener('click',()=>{const item=btn.closest('.timeline-item');const open=item.classList.toggle('open');btn.setAttribute('aria-expanded',String(open));}));}
function initContact(){document.querySelectorAll('[data-whatsapp]').forEach(el=>el.addEventListener('click',()=>{const n=String(el.dataset.whatsapp||'').replace(/\D/g,'');if(n)open(`https://wa.me/${n}`,'_blank','noopener,noreferrer')}));document.querySelectorAll('[data-action=call]').forEach(el=>el.addEventListener('click',()=>{const n=String(el.dataset.phone||SITE.phone||'').replace(/\D/g,'');if(n)location.href=`tel:${n}`}));document.querySelectorAll('[data-action=email]').forEach(el=>el.addEventListener('click',()=>{const e=el.dataset.email||SITE.email;if(e)location.href=`mailto:${e}`}));}
async function initProjects(){try{const mod=await import('./projects.js');mod.initProjects?.()}catch(e){console.warn('[Portfolio] projects skipped',e)}}
async function initVideoReview(){try{await import('./video-review-v2.js')}catch(e){console.warn('[Portfolio] video review unavailable',e)}}
function init(){applyConfig();applySEO();loadStyle('css/regenerated-ui.css');initNav();initTimeline();initContact();initProjects();initVideoReview();document.querySelectorAll('.reveal').forEach(el=>el.classList.add('is-visible'));}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
