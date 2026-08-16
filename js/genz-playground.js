/* Gen-Z Playground — interaction layer only; no portfolio content is changed. */
export function initGenzPlayground(){
  if(document.documentElement.dataset.gpReady)return;
  document.documentElement.dataset.gpReady="1";
  document.head.insertAdjacentHTML("beforeend",'<link rel="stylesheet" href="css/genz-playground.css">');
  if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  buildObjects();
  initPointerParallax();
  initSectionLabels();
}

function buildObjects(){
  const specs=[
    ["gp-cube",{right:"10vw",top:"16vh",animationDelay:"-2s"}],
    ["gp-ring",{right:"4vw",top:"54vh",animationDelay:"-6s"}],
    ["gp-orb",{left:"11vw",top:"31vh",animationDelay:"-3s"}],
    ["gp-label",{right:"8vw",top:"80vh"},"DIGITAL PLAYGROUND"],
    ["gp-label",{left:"13vw",top:"72vh"},"SCROLL // EXPLORE"]
  ];
  const frag=document.createDocumentFragment();
  specs.forEach(([cls,pos,text])=>{
    const el=document.createElement("div");
    el.className=`gp-object ${cls}`;
    Object.assign(el.style,pos);
    if(text)el.textContent=text;
    el.dataset.gpDepth=String(Math.random()*0.8+0.35);
    frag.appendChild(el);
  });
  document.body.appendChild(frag);
}

function initPointerParallax(){
  let tx=0,ty=0,cx=0,cy=0,raf=0;
  window.addEventListener("pointermove",e=>{
    if(e.pointerType&&e.pointerType!=="mouse")return;
    tx=(e.clientX/window.innerWidth-.5)*2;
    ty=(e.clientY/window.innerHeight-.5)*2;
    if(!raf)raf=requestAnimationFrame(tick);
  },{passive:true});
  function tick(){
    raf=0;cx+=(tx-cx)*.08;cy+=(ty-cy)*.08;
    document.querySelectorAll(".gp-object").forEach(el=>{
      const d=Number(el.dataset.gpDepth||.5);
      el.style.translate=`${cx*18*d}px ${cy*14*d}px`;
    });
    const hero=document.querySelector(".hero-photo-inner");
    if(hero){hero.style.setProperty("--gp-x",`${cx*3}deg`);hero.style.setProperty("--gp-y",`${cy*-3}deg`);}
    raf=requestAnimationFrame(tick);
  }
}

function initSectionLabels(){
  const ids=["hero","about","whatido","workflow","experience","work","skills","education","certifications","beyond","exploring","contact"];
  ids.forEach((id,i)=>{
    const section=document.getElementById(id);
    if(!section||section.querySelector(".gp-section-index"))return;
    const label=document.createElement("span");
    label.className="gp-section-index";
    label.textContent=`0${Math.min(i+1,9)} / ${id.replace(/-/g," ").toUpperCase()}`;
    section.appendChild(label);
  });
  const style=document.createElement("style");
  style.textContent='.gp-section-index{position:absolute;right:2.5%;top:4%;font:800 9px/1 Inter,sans-serif;letter-spacing:.18em;color:rgba(255,255,255,.3);pointer-events:none}.hero-photo-inner{transform:rotate(calc(5deg + var(--gp-x,0deg))) perspective(1000px) rotateY(calc(-8deg + var(--gp-y,0deg)))!important}.mobile-menu.open{display:grid!important}';
  document.head.appendChild(style);
}
