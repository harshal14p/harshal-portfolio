/* Premium World — single background 3D scene. Portfolio content remains untouched. */
export function initGenzPlayground(){
  if(document.documentElement.dataset.gpReady)return;
  document.documentElement.dataset.gpReady="1";
  ["css/genz-playground.css","css/neo-arcade.css","css/world-overhaul.css","css/world-font-fix.css"].forEach(href=>{
    if(!document.querySelector(`link[href="${href}"]`)){const link=document.createElement("link");link.rel="stylesheet";link.href=href;document.head.appendChild(link)}
  });
  /* runtime-repair must be last: it owns layout safety and cannot be overridden by decorative CSS. */
  const repair="css/runtime-repair.css";
  if(!document.querySelector(`link[href="${repair}"]`)){const link=document.createElement("link");link.rel="stylesheet";link.href=repair;document.head.appendChild(link)}
  ["galaxy-canvas","smoke-canvas","scene-canvas","scene-fallback"].forEach(id=>document.getElementById(id)?.remove());
  buildBlackHole();
}
function buildBlackHole(){
  document.querySelector(".neo-world")?.remove();
  const world=document.createElement("div");world.className="neo-world";world.setAttribute("aria-hidden","true");
  world.innerHTML='<div class="blackhole-core" aria-hidden="true"></div>';
  document.body.appendChild(world);
}
