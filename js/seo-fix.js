(()=>{
  const SITE_URL='https://harshal-portfolio-tau.vercel.app/';
  const absolute=(path)=>new URL(path,SITE_URL).href;
  function upsert(selector,attrs){let el=document.head.querySelector(selector);if(!el){el=document.createElement('meta');document.head.appendChild(el)}Object.entries(attrs).forEach(([k,v])=>el.setAttribute(k,v));}
  function run(){
    let canonical=document.head.querySelector('link[rel="canonical"]');
    if(!canonical){canonical=document.createElement('link');canonical.rel='canonical';document.head.appendChild(canonical)}
    canonical.href=SITE_URL;
    upsert('meta[property="og:url"]',{'property':'og:url',content:SITE_URL});
    upsert('meta[property="og:image"]',{'property':'og:image',content:absolute('assets/profile.jpg')});
    upsert('meta[name="twitter:image"]',{'name':'twitter:image',content:absolute('assets/profile.jpg')});
    const ld=document.head.querySelector('script[type="application/ld+json"]');
    if(ld){try{const data=JSON.parse(ld.textContent);data.url=SITE_URL;ld.textContent=JSON.stringify(data)}catch{}}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
})();
