/* Navigation — stable on desktop/mobile and works with dynamically mounted sections. */
export function initNav(){
  const nav=document.getElementById("site-nav");
  const toggle=document.getElementById("nav-toggle");
  const mobileMenu=document.getElementById("mobile-menu");
  const prefersReduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if(nav){
    const onScroll=()=>nav.classList.toggle("scrolled",window.scrollY>40);
    onScroll();
    window.addEventListener("scroll",onScroll,{passive:true});
  }

  /* Tools is a real portfolio destination. Keep it visible even if the
     video-review module mounts later or fails to initialize. */
  document.querySelectorAll(".nav-links,.mobile-menu").forEach(menu=>{
    if(!menu.querySelector('a[href="#video-review"]')){
      const a=document.createElement("a");
      a.href="#video-review";
      a.textContent="Tools";
      menu.insertBefore(a,menu.querySelector('a[href="#contact"]')||null);
    }
  });

  if(toggle&&mobileMenu){
    toggle.addEventListener("click",()=>{
      const isOpen=mobileMenu.classList.toggle("open");
      toggle.setAttribute("aria-expanded",String(isOpen));
      toggle.setAttribute("aria-label",isOpen?"Close menu":"Open menu");
    });
  }

  /* Delegation is intentional: video-review-v2 can add navigation links
     after this module has initialized. */
  nav?.addEventListener("click",e=>{
    const link=e.target.closest('a[href^="#"]');
    if(!link||!nav.contains(link))return;
    const targetId=link.getAttribute("href");
    if(!targetId||targetId==="#")return;
    const targetEl=document.querySelector(targetId);
    if(!targetEl)return;
    e.preventDefault();
    targetEl.scrollIntoView({behavior:prefersReduced?"auto":"smooth",block:"start"});
    if(mobileMenu&&toggle&&mobileMenu.classList.contains("open")){
      mobileMenu.classList.remove("open");
      toggle.setAttribute("aria-expanded","false");
      toggle.setAttribute("aria-label","Open menu");
    }
  });
}
