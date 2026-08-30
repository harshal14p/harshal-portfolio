import * as THREE from 'three';

let renderer, scene, camera, group, core, halo, particles, gada, icons = [], raf;
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
function makeGada(){
  const g=new THREE.Group();
  const metal=new THREE.MeshStandardMaterial({color:0x7fbfff,metalness:.94,roughness:.2,transparent:true,opacity:.48,emissive:0x0b4b9c,emissiveIntensity:1.7});
  const glow=new THREE.MeshBasicMaterial({color:0x3b91ff,transparent:true,opacity:.12,blending:THREE.AdditiveBlending,depthWrite:false});
  const handle=new THREE.Mesh(new THREE.CylinderGeometry(.08,.12,3.5,16),metal);handle.position.y=-.9;g.add(handle);
  const collar=new THREE.Mesh(new THREE.TorusGeometry(.22,.06,10,24),metal);collar.rotation.x=Math.PI/2;collar.position.y=.82;g.add(collar);
  const head=new THREE.Mesh(new THREE.SphereGeometry(.68,24,18),metal);head.scale.set(1,1.08,.92);head.position.y=1.38;g.add(head);
  const crown=new THREE.Mesh(new THREE.ConeGeometry(.48,.42,12),metal);crown.position.y=2.03;g.add(crown);
  const aura=new THREE.Mesh(new THREE.SphereGeometry(1.05,20,16),glow);g.add(aura);
  g.scale.setScalar(.72);return g;
}
function makeIcon(symbol){
  const g=new THREE.Group();
  const mat=new THREE.MeshStandardMaterial({color:0x74baff,metalness:.75,roughness:.3,transparent:true,opacity:.25,emissive:0x0a3977,emissiveIntensity:1.2});
  const line=new THREE.LineBasicMaterial({color:0x8cc8ff,transparent:true,opacity:.3,blending:THREE.AdditiveBlending});
  if(symbol==='movie'){
    const body=new THREE.Mesh(new THREE.BoxGeometry(1.15,.72,.18),mat);g.add(body);
    for(let i=-2;i<=2;i++){const l=new THREE.Mesh(new THREE.BoxGeometry(.16,.12,.2),mat);l.position.set(i*.22,.44,0);g.add(l)}
    const reel1=new THREE.Mesh(new THREE.TorusGeometry(.18,.045,8,20),line);reel1.position.set(-.3,.05,.13);g.add(reel1);
    const reel2=reel1.clone();reel2.position.x=.3;g.add(reel2);
  } else if(symbol==='tech'){
    const oct=new THREE.Mesh(new THREE.OctahedronGeometry(.62,1),mat);g.add(oct);
    const ring=new THREE.Mesh(new THREE.TorusGeometry(.88,.025,8,40),line);ring.rotation.x=.9;g.add(ring);
  } else if(symbol==='fashion'){
    const body=new THREE.Mesh(new THREE.CylinderGeometry(.18,.5,.95,12),mat);body.position.y=-.05;g.add(body);
    const collar=new THREE.Mesh(new THREE.TorusGeometry(.3,.045,8,20),line);collar.rotation.x=Math.PI/2;collar.position.y=.43;g.add(collar);
  } else if(symbol==='music'){
    const stem=new THREE.Mesh(new THREE.BoxGeometry(.07,1.05,.07),mat);stem.position.set(.22,.15,0);g.add(stem);
    const note=new THREE.Mesh(new THREE.TorusGeometry(.23,.055,8,20),line);note.rotation.x=Math.PI/2;note.position.set(-.02,-.35,0);g.add(note);
  } else {
    const outer=new THREE.Mesh(new THREE.BoxGeometry(1.1,.7,.22),mat);g.add(outer);
    const d1=new THREE.Mesh(new THREE.TorusGeometry(.23,.045,8,20),line);d1.rotation.y=Math.PI/2;d1.position.set(-.28,0,.16);g.add(d1);
    const d2=d1.clone();d2.position.x=.28;g.add(d2);
  }
  return g;
}
function makeParticles(){
  const n=900,pos=new Float32Array(n*3);
  for(let i=0;i<n;i++){const r=7+Math.random()*15,a=Math.random()*Math.PI*2;pos[i*3]=Math.cos(a)*r;pos[i*3+1]=(Math.random()-.5)*18;pos[i*3+2]=(Math.random()-.5)*12;}
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
  return new THREE.Points(geo,new THREE.PointsMaterial({color:0x5ba9ff,size:.025,transparent:true,opacity:.34,blending:THREE.AdditiveBlending,depthWrite:false}));
}
function enhanceUI(){
  const contact=document.getElementById('contact');
  if(contact&&!contact.querySelector('.final-convergence')){
    const wrap=document.createElement('div');wrap.className='final-convergence';wrap.innerHTML='<span class="final-kicker">THE WORLD ENDS HERE.</span><h2>HARSHAL<br>CHOUHAN</h2><p>LET’S BUILD SOMETHING WORTH REMEMBERING.</p><div class="final-line"></div>';
    contact.prepend(wrap);contact.classList.add('cinematic-ending');
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
  gada=makeGada();gada.position.set(-4.6,2.5,-2.8);gada.rotation.set(.12,-.35,.18);scene.add(gada);
  const specs=[['movie',-5.1,-1.9,-1.2,.7],['tech',5.2,2.1,-3.4,.62],['fashion',-5.5,.4,-4.2,.65],['music',4.7,-2.3,-2.4,.7],['game',.3,3.3,-5,.65]];
  icons=specs.map(([type,x,y,z,s],i)=>{const o=makeIcon(type);o.position.set(x,y,z);o.scale.setScalar(s);o.userData.base={x,y,z,phase:i*.9};scene.add(o);return o;});
  particles=makeParticles();scene.add(particles);
  const key=new THREE.PointLight(0x3c94ff,12,25);key.position.set(4,4,8);scene.add(key);
  const fill=new THREE.PointLight(0x6cb7ff,5,20);fill.position.set(-7,-2,5);scene.add(fill);scene.add(new THREE.AmbientLight(0x183050,.65));
  addEventListener('resize',resize,{passive:true});addEventListener('mousemove',onMove,{passive:true});addEventListener('scroll',onScroll,{passive:true});onScroll();
  const clock=new THREE.Clock();
  const tick=()=>{const t=clock.getElapsedTime();pointer.lerp(target,.035);scrollCurrent+=(scrollTarget-scrollCurrent)*.025;
    group.rotation.y=pointer.x*.16+scrollCurrent*.42;group.rotation.x=pointer.y*.08-scrollCurrent*.08;group.position.y=Math.sin(t*.16)*.12-scrollCurrent*.7;
    core.rotation.z=.08+Math.sin(t*.12)*.03;core.children.forEach((m,i)=>{if(m.isMesh)m.rotation.y=t*.045*(i%2?1:-1)});halo.rotation.z=.08+t*.018;halo.scale.setScalar(1+Math.sin(t*.45)*.025);
    gada.rotation.y=-.35+pointer.x*.32+Math.sin(t*.28)*.05;gada.rotation.x=.12+pointer.y*.18+scrollCurrent*.9;gada.position.y=2.5-scrollCurrent*5.4;gada.position.x=-4.6+pointer.x*.7;
    icons.forEach((o,i)=>{const b=o.userData.base;o.rotation.y=t*(.08+i*.012)+pointer.x*.18*(i%2?1:-1);o.rotation.x=pointer.y*.12+Math.sin(t*.35+b.phase)*.08;o.position.x=b.x+pointer.x*.45*(i%2?1:-1);o.position.y=b.y+Math.sin(t*.3+b.phase)*.18-scrollCurrent*(.9+(i%3)*.25);o.position.z=b.z+Math.cos(t*.22+b.phase)*.12;});
    particles.rotation.y=t*.004+pointer.x*.08;particles.rotation.x=pointer.y*.025;
    camera.position.x+=(pointer.x*1.2-camera.position.x)*.025;camera.position.y+=(-pointer.y*.65-camera.position.y)*.025;camera.position.z+=(14+scrollCurrent*1.5-camera.position.z)*.02;camera.lookAt(2.1,0,0);
    renderer.render(scene,camera);raf=requestAnimationFrame(tick);
  };tick();
}
