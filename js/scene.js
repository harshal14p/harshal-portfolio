/* Cinematic 3D identity environment — abstract, interactive, no external model dependency. */
export async function initScene(){
  const canvas=document.getElementById('scene-canvas');
  const fallback=document.getElementById('scene-fallback');
  if(!canvas)return;
  if(!window.WebGLRenderingContext){if(fallback)fallback.classList.add('is-active');return;}
  let THREE;
  try{THREE=await import('three');}catch(e){if(fallback)fallback.classList.add('is-active');return;}
  const mobile=innerWidth<760;
  const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:!mobile,powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(devicePixelRatio||1,mobile?1.35:1.8));
  renderer.setSize(innerWidth,innerHeight);
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.15;
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(42,innerWidth/innerHeight,.1,100);
  camera.position.set(0,.2,8);

  const particleCount=mobile?650:1200;
  const positions=new Float32Array(particleCount*3);
  for(let i=0;i<particleCount;i++){
    positions[i*3]=(Math.random()-.5)*15;
    positions[i*3+1]=(Math.random()-.5)*9;
    positions[i*3+2]=(Math.random()-.5)*9-2;
  }
  const pg=new THREE.BufferGeometry();pg.setAttribute('position',new THREE.BufferAttribute(positions,3));
  const pm=new THREE.PointsMaterial({color:0x69bdff,size:.025,transparent:true,opacity:.55,depthWrite:false,blending:THREE.AdditiveBlending});
  const particles=new THREE.Points(pg,pm);scene.add(particles);

  const forms=new THREE.Group();scene.add(forms);
  const torus=new THREE.Mesh(new THREE.TorusGeometry(2.65,.012,8,160),new THREE.MeshBasicMaterial({color:0x4db5ff,transparent:true,opacity:.28}));
  torus.rotation.set(.55,-.35,.15);forms.add(torus);
  const torus2=new THREE.Mesh(new THREE.TorusGeometry(3.55,.008,8,160),new THREE.MeshBasicMaterial({color:0xbfe8ff,transparent:true,opacity:.10}));
  torus2.rotation.set(-.45,.5,-.1);forms.add(torus2);
  const ico=new THREE.Mesh(new THREE.IcosahedronGeometry(1.7,2),new THREE.MeshBasicMaterial({color:0x6fc7ff,wireframe:true,transparent:true,opacity:.12}));
  ico.position.set(2.8,.25,-1.5);forms.add(ico);
  const cube=new THREE.Mesh(new THREE.BoxGeometry(2.8,2.8,2.8),new THREE.MeshBasicMaterial({color:0x8bd2ff,wireframe:true,transparent:true,opacity:.07}));
  cube.position.set(-3.1,-.7,-1);forms.add(cube);

  scene.add(new THREE.AmbientLight(0x9fcfff,.12));
  const blue=new THREE.PointLight(0x159cff,5,14);blue.position.set(3,2,4);scene.add(blue);
  const white=new THREE.PointLight(0xffffff,1.8,10);white.position.set(-3,-1,3);scene.add(white);

  let mx=0,my=0,tx=0,ty=0;
  addEventListener('pointermove',e=>{tx=e.clientX/innerWidth-.5;ty=e.clientY/innerHeight-.5},{passive:true});
  let scroll=0,scrollTarget=0;
  addEventListener('scroll',()=>{scrollTarget=scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight)},{passive:true});
  function resize(){renderer.setSize(innerWidth,innerHeight);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();}
  addEventListener('resize',resize);
  const clock=new THREE.Clock();
  function animate(){
    const t=clock.getElapsedTime();
    mx+=(tx-mx)*.035;my+=(ty-my)*.035;scroll+=(scrollTarget-scroll)*.025;
    particles.rotation.y=t*.012+mx*.05;particles.rotation.x=my*.025;
    forms.rotation.y=t*.035+mx*.16+scroll*.9;forms.rotation.x=my*.08+scroll*.28;
    torus.rotation.z=t*.055;torus2.rotation.z=-t*.035;ico.rotation.x=t*.12;ico.rotation.y=t*.18;cube.rotation.y=-t*.07;
    camera.position.x=mx*.55;camera.position.y=.2-my*.35;camera.position.z=8-scroll*1.15;
    camera.lookAt(mx*.12,my*.08,-.4-scroll*.35);
    blue.position.x=3+mx*2;blue.position.y=2-my*2;
    renderer.render(scene,camera);requestAnimationFrame(animate);
  }
  animate();
}
