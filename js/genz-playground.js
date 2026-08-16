/* Gen-Z Playground — interaction layer only; no portfolio content is changed. */
export function initGenzPlayground(){
  if(document.documentElement.dataset.gpReady)return;
  document.documentElement.dataset.gpReady="1";
  document.head.insertAdjacentHTML("beforeend",'<link rel="stylesheet" href="css/genz-playground.css"><link rel="stylesheet" href="css/neo-arcade.css">');
  if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  buildObjects();
  initPointerParallax();
  initSectionLabels();
  initScrollDepth();
}

function buildObjects(){
  const specs=[
    ["neo-object neo-cube",{right:"9vw",top:"15vh",animationDelay:"-2s"}],
    ["neo-object neo-ring",{right:"3vw",top:"53vh",animationDelay:"-6s"}],
    ["neo-object neo-orb",{left:"10vw",top:"30vh",animationDelay:"-3s"}],
    ["neo-object neo-disc",{left:"7vw",top:"70vh",animationDelay:"-8s"}],
    ["neo-object neo-shard",{right:"25vw",top:"22vh",animationDelay:"-4s"}],
    ["neo-object neo-cube",{left:"5vw",top:"16vh",animationDelay:"-5s",transform:"scale(.48) rotate(25deg)",opacity:".45"}],
    ["neo-object neo-orb",{right:"16vw",top:"72vh",animationDelay:"-4s",transform:"scale(.75)",opacity:".65"}],
    ["neo-object neo-tag",{right:"8vw",top:"81vh"},"DIGITAL PLAYGROUND"],
    ["neo-object neo-tag",{left:"12vw",top:"72vh"},"SCROLL // EXPLORE"],
    ["neo-object neo-tag",{left:"5vw",top:"51vh"},"HC // SYSTEM ONLINE"]
  ];
  const frag=document.createDocumentFragment();
  specs.forEach(([cls,pos,text])=>{
    const el=document.createElement("div");
    el.className=cls;
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
    document.querySelectorAll(".gp-object,.neo-object").forEach(el=>{
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
  style.textContent='.gp-section-index{position:absolute;right:2.5%;top:4%;font:800 9px/1 Inter,sans-serif;letter-spacing:.18em;color:rgba(255,255,255,.3);pointer-events:none}.hero-photo-inner{transform:rotate(calc(5deg + var(--gp-x,0deg))) perspective(1000px) rotateY(calc(-8deg + var(--gp-y,0deg)))!important}.mobile-menu.open{display:grid!important}.gp-cube-small{width:54px;height:54px;opacity:.55}.gp-ring-small{width:82px;height:82px;opacity:.5}.gp-orb-blue{background:radial-gradient(circle at 30% 25%,#fff 0 3%,rgba(49,156,255,.95) 12%,rgba(49,156,255,.22) 48%,transparent 72%)!important;box-shadow:0 0 55px rgba(49,156,255,.38)!important}';
  document.head.appendChild(style);
}

function initScrollDepth(){
  let last=0,raf=0;
  window.addEventListener("scroll",()=>{
    if(raf)return;
    raf=requestAnimationFrame(()=>{
      raf=0;
      const y=window.scrollY||0;
      const delta=Math.max(-30,Math.min(30,(y-last)));
      last=y;
      document.querySelectorAll(".gp-object,.neo-object").forEach(el=>{
        const d=Number(el.dataset.gpDepth||.5);
        el.style.marginTop=`${Math.max(-18,Math.min(18,delta*d))}px`;
      });
    });
  },{passive:true});
}
