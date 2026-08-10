export function initPhotoEffects(){
  const card=document.querySelector('.hero-photo-inner');
  if(!card)return;
  const fine=window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!fine||reduced)return;
  const reset=()=>{card.style.setProperty('--photo-rx','0deg');card.style.setProperty('--photo-ry','-4deg');card.style.setProperty('--photo-lift','0px');card.style.setProperty('--photo-shine-x','50%');card.style.setProperty('--photo-shine-y','50%');};
  card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5;const y=(e.clientY-r.top)/r.height-.5;card.style.setProperty('--photo-rx',`${-y*8}deg`);card.style.setProperty('--photo-ry',`${x*10-4}deg`);card.style.setProperty('--photo-lift','-10px');card.style.setProperty('--photo-shine-x',`${50+x*75}%`);card.style.setProperty('--photo-shine-y',`${50+y*75}%`);});
  card.addEventListener('pointerleave',reset);reset();
}
