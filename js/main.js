import { SITE } from './config.js';

function applyConfig(){
  document.querySelectorAll('[data-bind="name"]').forEach(el=>el.textContent=SITE.name);
  document.querySelectorAll('[data-bind="name-short"]').forEach(el=>el.textContent=SITE.nameShort);
  document.querySelectorAll('[data-bind="email-link"]').forEach(el=>el.href=`mailto:${SITE.email}`);
  document.querySelectorAll('[data-bind="linkedin-link"]').forEach(el=>el.href=SITE.linkedin);
  document.querySelectorAll('[data-bind="instagram-link"]').forEach(el=>el.href=SITE.instagram);
  document.querySelectorAll('[data-bind="resume-link"]').forEach(el=>el.href=SITE.resumePath);
  document.querySelectorAll('[data-bind="profile-image"]').forEach(img=>img.src=SITE.profileImagePath);
}
function applySEO(){document.title='Harshal Chouhan | Key Account Manager, Project Coordinator & MBA Finance';}
function loadStyle(path){if(document.querySelector(`link[href="${path}"]`))return;const l=document.createElement('link');l.rel='stylesheet';l.href=path;document.head.appendChild(l);}
function initNav(){const nav=document.getElementById('site-nav'),toggle=document.getElementById('nav-toggle'),menu=document.getElementById('mobile-menu');const sync=()=>nav?.classList.toggle('scrolled',scrollY>20);addEventListener('scroll',sync,{passive:true});sync();if(toggle&&menu){toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')==='true';toggle.setAttribute('aria-expanded',String(!open));menu.classList.toggle('open',!open)});menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{toggle.setAttribute('aria-expanded','false');menu.classList.remove('open')}));}}
function initTimeline(){document.querySelectorAll('.timeline-toggle').forEach(btn=>btn.addEventListener('click',()=>{const item=btn.closest('.timeline-item');const open=item.classList.toggle('open');btn.setAttribute('aria-expanded',String(open));}));}
function initContact(){document.querySelectorAll('[data-whatsapp]').forEach(el=>el.addEventListener('click',()=>{const n=String(el.dataset.whatsapp||'').replace(/\D/g,'');if(n)open(`https://wa.me/${n}`,'_blank','noopener,noreferrer')}));document.querySelectorAll('[data-action=call]').forEach(el=>el.addEventListener('click',()=>{const n=String(el.dataset.phone||SITE.phone||'').replace(/\D/g,'');if(n)location.href=`tel:${n}`}));document.querySelectorAll('[data-action=email]').forEach(el=>el.addEventListener('click',()=>{const e=el.dataset.email||SITE.email;if(e)location.href=`mailto:${e}`}));}
function initPhotoMotion(){const photo=document.querySelector('.hero-photo');if(!photo)return;const inner=photo.querySelector('.hero-photo-inner');if(!inner)return;const reset=()=>{inner.style.setProperty('--photo-x','0px');inner.style.setProperty('--photo-y','0px');inner.style.setProperty('--shine-x','-120%')};photo.addEventListener('pointermove',e=>{const r=photo.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5;const y=(e.clientY-r.top)/r.height-.5;inner.style.setProperty('--photo-x',`${x*10}px`);inner.style.setProperty('--photo-y',`${y*10}px`);inner.style.setProperty('--shine-x',`${50+x*95}%`);inner.style.setProperty('--photo-rx',`${-y*2.2}deg`);inner.style.setProperty('--photo-ry',`${x*2.8}deg`);});photo.addEventListener('pointerleave',reset);reset();}
async function initProjects(){try{const mod=await import('./projects.js');mod.initProjects?.()}catch(e){console.warn('[Portfolio] projects skipped',e)}}
async function initVideoReview(){try{await import('./video-review-v2.js')}catch(e){console.warn('[Portfolio] video review unavailable',e)}}
async function initPremium(){try{await import('./premium-interactions.js')}catch(e){console.warn('[Portfolio] premium interactions unavailable',e)}}
async function init3D(){try{const mod=await import('./final-art-scene.js');await mod.initScene?.()}catch(e){console.warn('[Portfolio] final art scene unavailable',e)}}
function init(){applyConfig();applySEO();loadStyle('css/regenerated-ui.css');loadStyle('css/premium-overhaul.css');loadStyle('css/final-art-direction.css');loadStyle('css/final-polish.css');initNav();initTimeline();initContact();initPhotoMotion();initProjects();initVideoReview();initPremium();init3D();document.querySelectorAll('.reveal').forEach(el=>el.classList.add('is-visible'));}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();