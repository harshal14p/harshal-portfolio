export function initGalaxy() {
  const canvas = document.getElementById('galaxy-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: true });
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let w=0,h=0,dpr=1,t=0,scroll=0,scrollTarget=0,stars=[],planets=[],ripples=[],shooting=[];
  let pointer={x:-9999,y:-9999,active:false};

  const resize=()=>{
    w=innerWidth; h=innerHeight; dpr=Math.min(devicePixelRatio||1,w<760?1.5:2);
    canvas.width=w*dpr; canvas.height=h*dpr; canvas.style.width=w+'px'; canvas.style.height=h+'px';
    ctx.setTransform(dpr,0,0,dpr,0,0); makeStars(); makePlanets(); makeShooting();
  };

  function makeStars(){
    const n=w<760?360:900;
    stars=Array.from({length:n},(_,i)=>({
      x:Math.random(),y:Math.random(),z:.15+Math.random()*.85,size:Math.random()<.94?.35+Math.random()*1.25:1.4+Math.random()*2,
      phase:Math.random()*6.28,speed:.25+Math.random()*1.4,warm:i%31===0
    }));
  }

  function makePlanets(){
    const s=Math.min(w,h);
    planets=[
      {name:'Mercury',x:.10,y:.25,r:s*.018,c1:'#d9b58b',c2:'#493d37',d:.42,sp:.17,earth:false,ring:false},
      {name:'Venus',x:.30,y:.16,r:s*.026,c1:'#e7b77c',c2:'#67422c',d:.56,sp:-.11,earth:false,ring:false},
      {name:'Earth',x:.78,y:.30,r:s*.052,c1:'#8edcff',c2:'#124d75',d:.82,sp:.14,earth:true,ring:false},
      {name:'Saturn',x:.18,y:.72,r:s*.040,c1:'#e2c18c',c2:'#654a34',d:.72,sp:-.08,earth:false,ring:true},
      {name:'Mars',x:.74,y:.78,r:s*.030,c1:'#d47c58',c2:'#54231d',d:.62,sp:.09,earth:false,ring:false},
      {name:'Jupiter',x:.48,y:.86,r:s*.048,c1:'#d7b18b',c2:'#654936',d:.9,sp:-.06,earth:false,ring:false}
    ];
  }

  function makeShooting(){
    shooting=Array.from({length:w<760?2:5},()=>({x:Math.random()*w,y:Math.random()*h*.65,v:3+Math.random()*5,wait:Math.random()*500}));
  }

  function milkyWay(){
    ctx.save(); ctx.translate(w*.5,h*.52); ctx.rotate(-.25+Math.sin(t*.018)*.025);
    const g=ctx.createLinearGradient(-w*.7,0,w*.7,0);
    g.addColorStop(0,'rgba(0,0,0,0)'); g.addColorStop(.22,'rgba(83,91,145,.045)'); g.addColorStop(.5,'rgba(225,224,255,.16)'); g.addColorStop(.78,'rgba(73,82,145,.05)'); g.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=g; ctx.filter='blur(22px)'; ctx.fillRect(-w*.75,-h*.09,w*1.5,h*.18); ctx.filter='none';
    for(let i=0;i<240;i++){
      const x=(Math.random()*2-1)*w*.72, y=(Math.random()-.5)*h*.13*(1-Math.abs(x)/(w*.9));
      ctx.fillStyle=`rgba(230,235,255,${.05+Math.random()*.2})`; ctx.fillRect(x,y,Math.random()*1.4+.3,Math.random()*1.4+.3);
    }
    ctx.restore();
  }

  function nebula(){
    const g=ctx.createRadialGradient(w*.55,h*.48,0,w*.55,h*.48,Math.max(w,h)*.72);
    g.addColorStop(0,'rgba(45,55,105,.10)'); g.addColorStop(.45,'rgba(18,35,72,.055)'); g.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=g; ctx.fillRect(0,0,w,h);
  }

  function drawStars(){
    const sx=Math.sin(t*.018)*10, sy=scroll*.045;
    for(const s of stars){
      let x=s.x*w+sx*s.z+Math.sin(scroll*.00045+s.y*8)*26*s.z;
      let y=s.y*h+Math.cos(scroll*.00035+s.x*7)*16*s.z-sy*s.z;
      const a=.22+.62*s.z*(.62+.38*Math.sin(t*s.speed+s.phase));
      ctx.beginPath(); ctx.arc(x,y,s.size*s.z,0,6.28);
      ctx.fillStyle=s.warm?`rgba(255,226,190,${a})`:`rgba(220,230,255,${a})`; ctx.fill();
    }
  }

  function drawEarth(x,y,r){
    ctx.save(); ctx.beginPath(); ctx.arc(x,y,r,0,6.28); ctx.clip();
    const g=ctx.createRadialGradient(x-r*.35,y-r*.4,r*.05,x,y,r);
    g.addColorStop(0,'#b9f0ff'); g.addColorStop(.28,'#258fc4'); g.addColorStop(.72,'#0a416d'); g.addColorStop(1,'#020b17');
    ctx.fillStyle=g; ctx.fillRect(x-r,y-r,r*2,r*2);
    const drift=Math.sin(t*.045+scroll*.002)*r*.22;
    ctx.fillStyle='rgba(78,164,92,.72)';
    for(let i=0;i<5;i++){const cx=x+Math.sin(i*2.3+t*.018+scroll*.0015)*r*.52+drift,cy=y+Math.cos(i*1.7+t*.015)*r*.48;ctx.beginPath();ctx.ellipse(cx,cy,r*.22,r*.10,i,0,6.28);ctx.fill();}
    ctx.fillStyle='rgba(255,255,255,.18)'; ctx.beginPath(); ctx.ellipse(x-r*.25,y-r*.32,r*.7,r*.2,-.5,0,6.28);ctx.fill(); ctx.restore();
  }

  function drawPlanet(p,i){
    const a=scroll*.001*p.sp+Math.sin(t*.045+i)*.045;
    const x=p.x*w+Math.cos(a)*28*p.d, y=p.y*h+Math.sin(a)*18*p.d;
    ctx.save(); ctx.translate(x,y); ctx.rotate(-.16+a*.2);
    if(p.ring){ctx.strokeStyle='rgba(226,210,175,.34)';ctx.lineWidth=Math.max(1,p.r*.08);ctx.beginPath();ctx.ellipse(0,0,p.r*1.9,p.r*.5,0,0,6.28);ctx.stroke();}
    if(p.earth){drawEarth(0,0,p.r);ctx.beginPath();ctx.arc(0,0,p.r*1.06,0,6.28);ctx.strokeStyle='rgba(130,220,255,.18)';ctx.lineWidth=p.r*.07;ctx.stroke();}
    else {const g=ctx.createRadialGradient(-p.r*.35,-p.r*.45,p.r*.05,0,0,p.r);g.addColorStop(0,p.c1);g.addColorStop(.48,p.c2);g.addColorStop(1,'#050509');ctx.beginPath();ctx.arc(0,0,p.r,0,6.28);ctx.fillStyle=g;ctx.shadowBlur=p.r*.65;ctx.shadowColor='rgba(110,145,255,.13)';ctx.fill();ctx.shadowBlur=0;}
    ctx.restore();
  }

  function drawShooting(){
    if(reduced)return;
    for(const s of shooting){s.wait-=1;if(s.wait>0)continue;s.x+=s.v;s.y+=s.v*.42;if(s.x>w+100||s.y>h*.8){s.x=-100;s.y=Math.random()*h*.55;s.wait=120+Math.random()*600;continue;}ctx.strokeStyle='rgba(220,235,255,.5)';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(s.x,s.y);ctx.lineTo(s.x-s.v*12,s.y-s.v*5);ctx.stroke();}
  }

  function ripple(x,y){ripples.push({x,y,age:0});}
  function drawRipples(){
    ripples=ripples.filter(r=>r.age<1);
    for(const r of ripples){r.age+=reduced?.04:.018;for(let k=0;k<3;k++){const rad=12+r.age*110+k*18;ctx.strokeStyle=`rgba(165,210,255,${(1-r.age)*(.34-k*.08)})`;ctx.lineWidth=1;ctx.beginPath();ctx.arc(r.x,r.y,rad,0,6.28);ctx.stroke();}}
    if(pointer.active&&!reduced){ctx.strokeStyle='rgba(150,205,255,.12)';ctx.lineWidth=1;ctx.beginPath();ctx.arc(pointer.x,pointer.y,22+Math.sin(t*.12)*4,0,6.28);ctx.stroke();}
  }

  function frame(){
    t+=reduced?.002:.008; scroll+=(scrollTarget-scroll)*.08;
    ctx.clearRect(0,0,w,h);ctx.fillStyle='#000';ctx.fillRect(0,0,w,h);
    nebula();milkyWay();drawStars();planets.forEach(drawPlanet);drawShooting();drawRipples();requestAnimationFrame(frame);
  }

  addEventListener('resize',resize);
  addEventListener('scroll',()=>scrollTarget=scrollY,{passive:true});
  addEventListener('pointermove',e=>{pointer.x=e.clientX;pointer.y=e.clientY;pointer.active=true;},{passive:true});
  addEventListener('pointerleave',()=>pointer.active=false,{passive:true});
  addEventListener('pointerdown',e=>{if(!e.target.closest('a,button,input,textarea,select'))ripple(e.clientX,e.clientY);},{passive:true});
  resize();frame();
}
