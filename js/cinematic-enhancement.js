(()=>{'use strict';
if(document.getElementById('cinematic-world'))return;
const link=document.createElement('link');link.rel='stylesheet';link.href='css/cinematic-enhancement.css?v=3';document.head.appendChild(link);
const world=document.createElement('div');world.id='cinematic-world';world.setAttribute('aria-hidden','true');world.innerHTML='<span class="cx-orb one"></span><span class="cx-orb two"></span><span class="cx-orb three"></span><span class="cx-ring r1"></span><span class="cx-ring r2"></span><span class="cx-grid"></span><span class="cx-scan"></span>';document.body.prepend(world);

/* Decorative HUD/section-code overlays intentionally disabled. They were
   obscuring content and adding unwanted pills/labels throughout the site. */
const hud=null;
const progress=null;
const labels={};

function enhanceWorkflow(){const track=document.querySelector('.workflow-track');if(!track)return;document.querySelectorAll('.stage').forEach((el,i)=>{el.style.setProperty('--stage-delay',`${i*90}ms`);el.classList.add('cx-stage')})}
function enhanceExperience(){document.querySelectorAll('.timeline-item').forEach((el,i)=>{el.classList.add('cx-career-node')})}
function enhanceSkills(){const grid=document.querySelector('.skills-grid');if(!grid||grid.dataset.cxReady)return;grid.dataset.cxReady='1';grid.classList.add('cx-skill-system');grid.querySelectorAll('.skill-group').forEach((el,i)=>{el.classList.add('cx-skill-orbit')})}
function enhanceProjects(){document.querySelectorAll('.project-card').forEach((el,i)=>{el.classList.add('cx-project');el.style.setProperty('--project-i',i)})}
function enhanceExploring(){return}
function enhanceContact(){const s=document.getElementById('contact');if(!s)return;s.classList.add('cx-contact-scene');if(!s.querySelector('.cx-contact-glow')){const glow=document.createElement('div');glow.className='cx-contact-glow';s.prepend(glow)}}
enhanceWorkflow();enhanceExperience();enhanceSkills();enhanceProjects();enhanceExploring();enhanceContact();
let tx=0,ty=0,rx=0,ry=0;window.addEventListener('pointermove',e=>{tx=e.clientX/innerWidth-.5;ty=e.clientY/innerHeight-.5},{passive:true});
function frame(){rx+=(tx-rx)*.035;ry+=(ty-ry)*.035;world.style.transform=`translate3d(${rx*-8}px,${ry*-5}px,0)`;const card=document.querySelector('.hero-photo-inner');if(card&&!matchMedia('(prefers-reduced-motion: reduce)').matches){card.style.transform=`perspective(1100px) rotateY(${rx*-9-7}deg) rotateX(${ry*5+2}deg) translateZ(0)`}document.documentElement.style.setProperty('--cx-mx',`${rx*18}px`);document.documentElement.style.setProperty('--cx-my',`${ry*12}px`);requestAnimationFrame(frame)}requestAnimationFrame(frame);
const observer=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('cx-active')}),{threshold:.18});document.querySelectorAll('.section,.about-card,.tilt-card,.timeline-item,.skill-group,.edu-card,.beyond-card,.project-card').forEach(s=>observer.observe(s));
})();