function installMobileFixes(){
  if(document.getElementById('portfolio-mobile-fixes'))return;
  const style=document.createElement('style');
  style.id='portfolio-mobile-fixes';
  style.textContent=`
    .hero-title span{color:#fff!important;background:linear-gradient(110deg,#fff 0%,#fff 42%,rgba(255,255,255,.28) 47%,#fff 51%,#fff 100%)!important;background-size:300% 100%!important;-webkit-background-clip:text!important;background-clip:text!important;-webkit-text-fill-color:transparent!important;animation:nameSweep 7s ease-in-out infinite alternate!important}
    .hero-photo,.hero-photo-inner,.hero-photo img{visibility:visible!important;opacity:1!important}
    .hero-photo{z-index:20!important;display:block!important}.hero-photo-inner{display:block!important}.hero-photo img{display:block!important;width:100%!important;height:auto!important;object-fit:cover!important}
    @media(max-width:760px){.hero-photo{position:relative!important;z-index:20!important;width:min(300px,78vw)!important;margin:48px auto 0!important}.hero-photo-inner{transform:none!important;min-height:0!important}.hero-photo img{max-width:100%!important}}
    @media(prefers-reduced-motion:reduce){.hero-title span{animation:none!important}}
  `;
  document.head.appendChild(style);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',installMobileFixes,{once:true});else installMobileFixes();
/* Load the new visual layer after the existing mobile safety fixes. */
import('./cinematic-enhancement.js').catch(e=>console.warn('[Portfolio] cinematic layer skipped',e));
