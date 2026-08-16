/* Defensive runtime layer: fixes common visual/runtime failures without changing content. */
export function initStability(){
  const root=document.documentElement;
  root.classList.add("portfolio-stable");

  // Never let decorative layers block navigation, buttons or cards.
  document.querySelectorAll(".neo-world,#smoke-canvas,#scene-canvas,#scene-fallback").forEach(el=>el.style.pointerEvents="none");

  // Keep decorative legacy canvases out of the new world.
  ["galaxy-canvas","smoke-canvas","scene-canvas","scene-fallback"].forEach(id=>document.getElementById(id)?.remove());

  // Images should never leave broken-icon gaps in cards.
  document.querySelectorAll("img").forEach(img=>{
    img.addEventListener("error",()=>{
      img.classList.add("image-failed");
      if(img.closest(".project-thumb"))img.style.display="none";
    },{once:true});
  });

  // If an animation observer ever fails, content must still become readable.
  window.setTimeout(()=>{
    document.querySelectorAll(".reveal:not(.is-visible)").forEach(el=>{
      const r=el.getBoundingClientRect();
      if(r.top<window.innerHeight*1.5)el.classList.add("is-visible");
    });
  },2500);

  // Prevent the mobile drawer from staying open after switching to desktop.
  const closeMobile=()=>{
    if(window.innerWidth>900){
      document.getElementById("mobile-menu")?.classList.remove("open");
      document.getElementById("nav-toggle")?.setAttribute("aria-expanded","false");
    }
  };
  window.addEventListener("resize",closeMobile,{passive:true});
  closeMobile();

  // Touch devices do not need the custom mouse cursor.
  if(matchMedia("(pointer: coarse)").matches){
    document.body.classList.add("coarse-pointer");
    document.querySelectorAll(".cursor-dot,.cursor-ring").forEach(el=>el.remove());
  }
}
