import * as THREE from 'three';

let renderer, scene, camera, group, core, halo, particles, raf;
const pointer = new THREE.Vector2(0,0);
const target = new THREE.Vector2(0,0);
let scrollTarget = 0, scrollCurrent = 0;

function makeMonogram(){
  const g=new THREE.Group();
  const mat=new THREE.MeshStandardMaterial({color:0x72b9ff,metalness:.9,roughness:.22,transparent:true,opacity:.2,emissive:0x0b3d88,emissiveIntensity:1.8});
  const glow=new THREE.MeshBasicMaterial({color:0x2f8cff,transparent:true,opacity:.08,blending:THREE.AdditiveBlending,depthWrite:false});
  const box=(x,y,z,sx,sy,sz)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(sx,sy,sz),mat);m.position.set(x,y,z);g.add(m);};
  box(-1.5,0,0,.32,4.8,.32);box(-.05,0,0,.32,4.8,.32);box(-.78,0,0,1.75,.32,.32);
  box(.92,1.55,0,1.65,.32,.32);box(.92,-1.55,0,1.65,.32,.32);box(1.7,0,0,.32,3,.32);box(.92,0,0,.32,1.1,.32);
  g.add(new THREE.Mesh(new THREE.IcosahedronGeometry(2.8,2),glow));return g;
}
function makeSacredMotif(){
  const g=new THREE.Group(),mat=new THREE.LineBasicMaterial({color:0x5ba9ff,transparent:true,opacity:.055,blending:THREE.AdditiveBlending});
  const make=(r,z)=>{const p=[];for(let i=0;i<=80;i++){const t=i/80*Math.PI;p.push(new THREE.Vector3(Math.cos(t)*r*Math.sin(t),Math.sin(t)*r*Math.sin(t)+.2,z));}return new THREE.Line(new THREE.BufferGeometry().setFromPoints(p),mat)};
  g.add(make(2.6,0),make(1.7,.02));return g;
}
function makeParticles(){
  const n=900,pos=new Float32Array(n*3);
  for(let i=0;i<n;i++){const r=7+Math.random()*15,a=Math.random()*Math.PI*2;pos[i*3]=Math.cos(a)*r;pos[i*3+1]=(Math.random()-.5)*18;pos[i*3+2]=(Math.random()-.5)*12;}
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
  return new THREE.Points(geo,new THREE.PointsMaterial({color:0x5ba9ff,size:.025,transparent:true,opacity:.34,blending:THREE.AdditiveBlending,depthWrite:false}));
}
function enhanceUI(){
  const hero=document.getElementById('hero');
  if(hero&&!hero.querySelector('.art-opening')){
    const intro=document.createElement('div');intro.className='art-opening';intro.innerHTML='<span>HC / 01</span><span>AN INTERACTIVE PERSONAL WORLD</span>';hero.appendChild(intro);
  }
  const contact=document.getElementById('contact');
  if(contact&&!contact.querySelector('.final-convergence')){
    const wrap=document.createElement('div');wrap.className='final-convergence';wrap.innerHTML='<span class="final-kicker">THE WORLD ENDS HERE.</span><h2>HARSHAL<br>CHOUHAN</h2><p>LET’S BUILD SOMETHING WORTH REMEMBERING.</p><div class="final-line"></div>';
    contact.prepend(wrap);
    contact.classList.add('cinematic-ending');
  }
}
function resize(){if(!renderer||!camera)return;camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.setSize(innerWidth,innerHeight,false)}
function onMove(e){target.x=e.clientX/innerWidth-.5;target.y=e.clientY/innerHeight-.5}
function onScroll(){scrollTarget=Math.min(1,Math.max(0,scrollY/(document.documentElement.scrollHeight-innerHeight||1)))}
export function initScene(){
  const canvas=document.getElementById('scene-canvas');if(!canvas)return;
  enhanceUI();scene=new THREE.Scene();scene.fog=new THREE.FogExp2(0x030509,.035);
  camera=new THREE.PerspectiveCamera(38,innerWidth/innerHeight,.1,80);camera.position.set(0,0,14);
  renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.setSize(innerWidth,innerHeight,false);renderer.outputColorSpace=THREE.SRGBColorSpace;
  group=new THREE.Group();scene.add(group);
  core=makeMonogram();core.position.set(4.2,.5,-1.2);core.rotation.set(.05,-.25,.08);group.add(core);
  halo=makeSacredMotif();halo.position.set(4.2,.5,-1.7);halo.rotation.set(0,.15,.08);group.add(halo);
  particles=makeParticles();scene.add(particles);
  const key=new THREE.PointLight(0x3c94ff,12,25);key.position.set(4,4,8);scene.add(key);
  const fill=new THREE.PointLight(0x6cb7ff,5,20);fill.position.set(-7,-2,5);scene.add(fill);scene.add(new THREE.AmbientLight(0x183050,.65));
  addEventListener('resize',resize,{passive:true});addEventListener('mousemove',onMove,{passive:true});addEventListener('scroll',onScroll,{passive:true});onScroll();
  const clock=new THREE.Clock();
  const tick=()=>{const t=clock.getElapsedTime();pointer.lerp(target,.035);scrollCurrent+=(scrollTarget-scrollCurrent)*.025;
    group.rotation.y=pointer.x*.16+scrollCurrent*.42;group.rotation.x=pointer.y*.08-scrollCurrent*.08;group.position.y=Math.sin(t*.16)*.12-scrollCurrent*.7;
    core.rotation.z=.08+Math.sin(t*.12)*.03;core.children.forEach((m,i)=>{if(m.isMesh)m.rotation.y=t*.045*(i%2?1:-1)});halo.rotation.z=.08+t*.018;halo.scale.setScalar(1+Math.sin(t*.45)*.025);
    particles.rotation.y=t*.004+pointer.x*.08;particles.rotation.x=pointer.y*.025;
    camera.position.x+=(pointer.x*1.2-camera.position.x)*.025;camera.position.y+=(-pointer.y*.65-camera.position.y)*.025;camera.position.z+=(14+scrollCurrent*1.5-camera.position.z)*.02;camera.lookAt(2.1,0,0);
    renderer.render(scene,camera);raf=requestAnimationFrame(tick);
  };tick();
}
