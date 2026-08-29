/* Background-only world. It must never modify portfolio typography, geometry or positioning. */
export function initGenzPlayground(){
  if(document.documentElement.dataset.gpReady)return;
  document.documentElement.dataset.gpReady="1";
  const href="css/background-only.css?v=1";
  if(!document.querySelector(`link[href^="css/background-only.css"]`)){const link=document.createElement("link");link.rel="stylesheet";link.href=href;document.head.appendChild(link)}
  ["galaxy-canvas","smoke-canvas","scene-canvas","scene-fallback"].forEach(id=>document.getElementById(id)?.remove());
  buildBlackHole();
}
function buildBlackHole(){
  document.querySelector(".neo-world")?.remove();
  const world=document.createElement("div");world.className="neo-world";world.setAttribute("aria-hidden","true");
  document.body.appendChild(world);
}
