/* Premium World — single background 3D scene. Portfolio content remains untouched. */
export function initGenzPlayground(){
  if(document.documentElement.dataset.gpReady)return;
  document.documentElement.dataset.gpReady="1";
  ["css/genz-playground.css","css/neo-arcade.css","css/world-overhaul.css","css/world-font-fix.css"].forEach(href=>{
    if(!document.querySelector(`link[href="${href}"]`)){const link=document.createElement("link");link.rel="stylesheet";link.href=href;document.head.appendChild(link)}
  });
  ["galaxy-canvas","smoke-canvas","scene-canvas","scene-fallback"].forEach(id=>document.getElementById(id)?.remove());
  buildBlackHole();
}
function buildBlackHole(){
  document.querySelector(".neo-world")?.remove();
  const world=document.createElement("div");world.className="neo-world";world.setAttribute("aria-hidden","true");
  const hole=document.createElement("div");hole.className="neo-blackhole";
  hole.innerHTML='<div class="blackhole-ring ring-one"></div><div class="blackhole-ring ring-two"></div><div class="blackhole-core"></div><div class="blackhole-glow"></div>';
  world.appendChild(hole);
  const specks=document.createElement("div");specks.className="neo-specks";
  for(let i=0;i<42;i++){const s=document.createElement("i");s.style.setProperty("--x",`${Math.random()*100}%`);s.style.setProperty("--y",`${Math.random()*100}%`);s.style.setProperty("--d",`${3+Math.random()*7}s`);s.style.setProperty("--delay",`${-Math.random()*8}s`);specks.appendChild(s)}
  world.appendChild(specks);document.body.appendChild(world);
}
