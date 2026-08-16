/* Navigation — safe on desktop/mobile and resilient if a nav element is absent. */
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

  if(toggle&&mobileMenu){
    toggle.addEventListener("click",()=>{
      const isOpen=mobileMenu.classList.toggle("open");
      toggle.setAttribute("aria-expanded",String(isOpen));
      toggle.setAttribute("aria-label",isOpen?"Close menu":"Open menu");
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(link=>{
    link.addEventListener("click",e=>{
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
  });
}
