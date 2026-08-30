import * as THREE from 'three';
let renderer,scene,camera,gada,icons,particles;
const pointer=new THREE.Vector2(),target=new THREE.Vector2();let scroll=0,scrollNow=0;
const gold=new THREE.MeshStandardMaterial({color:0xc98f18,metalness:.98,roughness:.18,emissive:0x3a2100,emissiveIntensity:.8});
const goldHi=new THREE.MeshStandardMaterial({color:0xf4cf62,metalness:1,roughness:.12,emissive:0x5a3200,emissiveIntensity:1.05});
const goldDark=new THREE.MeshStandardMaterial({color:0x8b5b08,metalness:.95,roughness:.22,emissive:0x251400,emissiveIntensity:.45});
const blueGlow=new THREE.MeshBasicMaterial({color:0x2f8cff,transparent:true,opacity:.055,blending:THREE.AdditiveBlending,depthWrite:false});
function ring(r,t,y,mat=goldHi){const o=new THREE.Mesh(new THREE.TorusGeometry(r,t,12,40),mat);o.rotation.x=Math.PI/2;o.position.y=y;return o}
function makeGada(){
  const g=new THREE.Group();
  // Long tapered shaft, matching the reference silhouette.
  const shaft=new THREE.Mesh(new THREE.CylinderGeometry(.095,.18,5.35,32),goldHi);shaft.position.y=-1.65;g.add(shaft);
  const collar1=ring(.25,.075,.98,gold);g.add(collar1);
  const collar2=ring(.31,.085,-.02,gold);g.add(collar2);
  // Ornamental grip and pointed pommel.
  const grip=new THREE.Mesh(new THREE.CylinderGeometry(.14,.22,1.05,24),gold);grip.position.y=-4.82;g.add(grip);
  [-5.28,-5.02,-4.76,-4.5].forEach((y,i)=>g.add(ring(.20+i*.012,.055,y,goldHi)));
  const pommel=new THREE.Mesh(new THREE.ConeGeometry(.16,.58,24),goldHi);pommel.position.y=-5.62;g.add(pommel);
  const pomRing=ring(.18,.055,-5.38,gold);g.add(pomRing);
  // Bulbous, fluted gada head.
  const profile=[new THREE.Vector2(.32,1.05),new THREE.Vector2(.58,1.12),new THREE.Vector2(.84,1.32),new THREE.Vector2(1.02,1.62),new THREE.Vector2(1.08,1.95),new THREE.Vector2(1.00,2.25),new THREE.Vector2(.80,2.48),new THREE.Vector2(.54,2.64),new THREE.Vector2(.30,2.58)];
  const head=new THREE.Mesh(new THREE.LatheGeometry(profile,48),goldHi);head.position.y=.98;g.add(head);
  // Raised vertical ribs create the distinctive segmented/fluted metal look.
  for(let i=0;i<12;i++){
    const a=i*Math.PI*2/12;
    const rib=new THREE.Mesh(new THREE.TorusGeometry(.86,.055,8,22,Math.PI*.78),gold);
    rib.rotation.set(Math.PI/2,0,a);
    rib.scale.set(1,1.42,1);
    rib.position.y=1.05;
    g.add(rib);
  }
  g.add(ring(1.02,.075,1.05,gold));
  g.add(ring(.66,.07,2.78,gold));
  const crownBase=ring(.43,.075,2.92,goldHi);g.add(crownBase);
  const crown=new THREE.Mesh(new THREE.ConeGeometry(.31,.72,24),goldHi);crown.position.y=3.25;g.add(crown);
  const crownTip=new THREE.Mesh(new THREE.ConeGeometry(.08,.28,16),goldHi);crownTip.position.y=3.75;g.add(crownTip);
  const aura=new THREE.Mesh(new THREE.SphereGeometry(1.55,28,20),blueGlow);aura.position.y=1.45;g.add(aura);
  g.rotation.z=-.16;g.rotation.x=.06;g.scale.setScalar(.76);
  return g;
}
function makeSymbol(type){const g=new THREE.Group(),m=new THREE.MeshStandardMaterial({color:0x78baff,metalness:.8,roughness:.3,transparent:true,opacity:.24,emissive:0x0a3f80,emissiveIntensity:1.1});if(type==='film'){g.add(new THREE.Mesh(new THREE.BoxGeometry(1.1,.7,.16),m));for(let i=-2;i<3;i++){const b=new THREE.Mesh(new THREE.BoxGeometry(.13,.12,.18),m);b.position.set(i*.22,.43,0);g.add(b)}}else if(type==='tech')g.add(new THREE.Mesh(new THREE.OctahedronGeometry(.62,1),m));else if(type==='music'){const n=new THREE.Mesh(new THREE.TorusGeometry(.25,.055,8,22),m);n.rotation.x=Math.PI/2;g.add(n);const s=new THREE.Mesh(new THREE.BoxGeometry(.07,1,.07),m);s.position.set(.22,.25,0);g.add(s)}else g.add(new THREE.Mesh(new THREE.IcosahedronGeometry(.52,1),m));return g}
function makeParticles(){const n=750,a=new Float32Array(n*3);for(let i=0;i<n;i++){const r=7+Math.random()*17,t=Math.random()*Math.PI*2;a[i*3]=Math.cos(t)*r;a[i*3+1]=(Math.random()-.5)*18;a[i*3+2]=(Math.random()-.5)*12}const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(a,3));return new THREE.Points(geo,new THREE.PointsMaterial({color:0x5aaaff,size:.022,transparent:true,opacity:.32,blending:THREE.AdditiveBlending,depthWrite:false}))}
function resize(){if(!renderer)return;camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.setSize(innerWidth,innerHeight,false)}
function move(e){target.x=e.clientX/innerWidth-.5;target.y=e.clientY/innerHeight-.5}function scr(){scroll=Math.min(1,Math.max(0,scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight)))}
export function initScene(){const c=document.getElementById('scene-canvas');if(!c)return;scene=new THREE.Scene();scene.fog=new THREE.FogExp2(0x02060b,.032);camera=new THREE.PerspectiveCamera(40,innerWidth/innerHeight,.1,90);camera.position.set(0,0,15);renderer=new THREE.WebGLRenderer({canvas:c,alpha:true,antialias:true,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.setSize(innerWidth,innerHeight,false);renderer.outputColorSpace=THREE.SRGBColorSpace;gada=makeGada();gada.position.set(-3.0,3.0,-3);scene.add(gada);const specs=[['film',4.8,1.8,-4,.65],['tech',4.9,-1.6,-3,.62],['music',-4.9,.3,-4.2,.65],['game',1.8,3.3,-6,.55]];icons=specs.map(([t,x,y,z,s],i)=>{const o=makeSymbol(t);o.position.set(x,y,z);o.scale.setScalar(s);o.userData={x,y,z,p:i*.8};scene.add(o);return o});particles=makeParticles();scene.add(particles);const key=new THREE.PointLight(0x3c95ff,12,28);key.position.set(3,5,8);scene.add(key);const warm=new THREE.PointLight(0xffc33d,6,18);warm.position.set(-4,2,5);scene.add(warm);scene.add(new THREE.AmbientLight(0x173250,.65));addEventListener('resize',resize,{passive:true});addEventListener('mousemove',move,{passive:true});addEventListener('scroll',scr,{passive:true});scr();const clock=new THREE.Clock();function tick(){const t=clock.getElapsedTime();pointer.lerp(target,.045);scrollNow+=(scroll-scrollNow)*.025;gada.rotation.y=-.18+pointer.x*.16;gada.rotation.x=.06+pointer.y*.07+scrollNow*.28;gada.rotation.z=-.16+Math.sin(t*.25)*.025;gada.position.y=3.0-scrollNow*5.2;gada.position.x=-3.0+pointer.x*.3;icons.forEach((o,i)=>{const b=o.userData;o.rotation.x=pointer.y*.15+Math.sin(t*.3+b.p)*.08;o.rotation.y=t*(.07+i*.012)+pointer.x*.2;o.position.x=b.x+pointer.x*.35;o.position.y=b.y+Math.sin(t*.25+b.p)*.15-scrollNow*(.65+i*.12)});particles.rotation.y=t*.004+pointer.x*.06;camera.position.x+=(pointer.x*.7-camera.position.x)*.025;camera.position.y+=(-pointer.y*.45-camera.position.y)*.025;camera.position.z+=(15+scrollNow*1.5-camera.position.z)*.02;camera.lookAt(0,0,0);renderer.render(scene,camera);requestAnimationFrame(tick)}tick()}
