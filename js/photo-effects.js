export function initPhotoEffects(){
  const card=document.querySelector('.hero-photo-inner');
  if(!card)return;
  if(!document.getElementById('photo-effects-style')){const style=document.createElement('style');style.id='photo-effects-style';style.textContent=`
    .hero-photo-inner{--photo-rx:0deg;--photo-ry:-4deg;--photo-lift:0px;--photo-shine-x:50%;--photo-shine-y:50%;position:relative;overflow:hidden;transform:perspective(1200px) rotateX(var(--photo-rx)) rotateY(var(--photo-ry)) translateY(var(--photo-lift)) translateZ(75px)!important;transition:transform .18s cubic-bezier(.16,.8,.24,1),box-shadow .35s ease!important}
    .hero-photo-inner:before{content:'';position:absolute;inset:-30%;z-index:4;pointer-events:none;background:radial-gradient(circle at var(--photo-shine-x) var(--photo-shine-y),rgba(255,255,255,.32) 0,rgba(255,255,255,.12) 8%,rgba(255,255,255,0) 28%);mix-blend-mode:screen;opacity:.85;transition:opacity .3s ease}
    .hero-photo-inner:after{content:'';position:absolute;inset:0;z-index:5;pointer-events:none;background:linear-gradient(115deg,transparent 25%,rgba(255,255,255,.18) 46%,rgba(255,255,255,0) 58%);transform:translateX(-120%);transition:transform .75s cubic-bezier(.16,.8,.24,1);mix-blend-mode:screen}
    .hero-photo-inner:hover:after{transform:translateX(120%)}
    .hero-photo-inner img{position:relative;z-index:2}
  `;document.head.appendChild(style);}
  const fine=window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!fine||reduced)return;
  const reset=()=>{card.style.setProperty('--photo-rx','0deg');card.style.setProperty('--photo-ry','-4deg');card.style.setProperty('--photo-lift','0px');card.style.setProperty('--photo-shine-x','50%');card.style.setProperty('--photo-shine-y','50%');};
  card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5;const y=(e.clientY-r.top)/r.height-.5;card.style.setProperty('--photo-rx',`${-y*8}deg`);card.style.setProperty('--photo-ry',`${x*10-4}deg`);card.style.setProperty('--photo-lift','-10px');card.style.setProperty('--photo-shine-x',`${50+x*75}%`);card.style.setProperty('--photo-shine-y',`${50+y*75}%`);});
  card.addEventListener('pointerleave',reset);reset();
}
