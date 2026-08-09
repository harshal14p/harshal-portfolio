/* ==========================================================================
   3D SCENE — cinematic bike + scroll-linked camera
   Loaded from assets/bike.glb (see config.js for the path). Three.js is
   imported dynamically so that, if the CDN or the model ever fails to
   load, the rest of the site (nav, cursor, projects, etc.) keeps working
   perfectly and this section simply falls back to a static gradient.

   HOW TO ADJUST THE CAMERA PATH:
   Edit the `keyframes` array below. Each entry is a camera position and
   a point for the camera to look at. The camera glides smoothly between
   them as the page scrolls through the hero → workflow sections.
   ========================================================================== */

import { SITE } from "./config.js";

export async function initScene() {
  const canvas = document.getElementById("scene-canvas");
  const fallback = document.getElementById("scene-fallback");
  if (!canvas || !fallback) return;

  function showFallback() {
    canvas.style.display = "none";
    fallback.classList.add("is-active");
  }

  if (!hasWebGL()) {
    showFallback();
    return;
  }

  let THREE, GLTFLoader, RoomEnvironment;
  try {
    const [core, loaderMod, envMod] = await Promise.all([
      import("three"),
      import("three/addons/loaders/GLTFLoader.js"),
      import("three/addons/environments/RoomEnvironment.js"),
    ]);
    THREE = core;
    GLTFLoader = loaderMod.GLTFLoader;
    RoomEnvironment = envMod.RoomEnvironment;
  } catch (err) {
    console.warn("Three.js could not be loaded — showing static fallback.", err);
    showFallback();
    return;
  }

  try {
    runScene(THREE, GLTFLoader, RoomEnvironment, canvas, showFallback);
  } catch (err) {
    console.warn("3D scene failed to initialize — showing static fallback.", err);
    showFallback();
  }
}

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl")));
  } catch (e) {
    return false;
  }
}

function runScene(THREE, GLTFLoader, RoomEnvironment, canvas, showFallback) {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = window.innerWidth < 760;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: !isMobile,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  const scene = new THREE.Scene();
  scene.background = null; // transparent — smoke layer shows through behind the bike

  // Soft image-based reflections. Purely cosmetic, so a failure here should
  // never take down the whole scene.
  try {
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  } catch (err) {
    console.warn("Environment reflections skipped:", err);
  }

  // ---- Lighting: dark + cinematic, no default/ugly flat light ----
  scene.add(new THREE.AmbientLight(0xffffff, 0.22));

  const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
  keyLight.position.set(4, 6, 5);
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0xff3d81, 1.2); // pink rim for silhouette
  rimLight.position.set(-5, 2.5, -4);
  scene.add(rimLight);

  const fillLight = new THREE.PointLight(0x7a1236, 1.0, 20); // wine fill
  fillLight.position.set(-2, 0.6, 3);
  scene.add(fillLight);

  const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 100);

  // ---- Cinematic camera keyframes (scroll progress 0 → 1) ----
  const keyframes = [
    { pos: new THREE.Vector3(3.2, 1.4, 4.6), look: new THREE.Vector3(0, 0.5, 0) },   // hero: 3/4 front
    { pos: new THREE.Vector3(5.6, 1.1, 0.2), look: new THREE.Vector3(0, 0.45, 0) },  // side profile
    { pos: new THREE.Vector3(-3.4, 1.6, -4.4), look: new THREE.Vector3(0, 0.55, 0) },// rear 3/4
    { pos: new THREE.Vector3(1.1, 0.32, 1.7), look: new THREE.Vector3(0, 0.32, 0) }, // low cinematic close-up
    { pos: new THREE.Vector3(-0.9, 0.85, 1.0), look: new THREE.Vector3(0, 0.5, -0.15) }, // detail focus
  ];

  const currentPos = keyframes[0].pos.clone();
  const currentLook = keyframes[0].look.clone();
  const targetPos = new THREE.Vector3();
  const targetLook = new THREE.Vector3();
  camera.position.copy(currentPos);
  camera.lookAt(currentLook);

  const modelGroup = new THREE.Group();
  scene.add(modelGroup);

  // ---- Load the bike model ----
  const loader = new GLTFLoader();
  loader.load(
    SITE.bikeModelPath,
    (gltf) => {
      const model = gltf.scene;

      // Center the model at the origin and normalize its scale, so any
      // replacement .glb (whatever its original units) lines up with the
      // camera keyframes above without extra tweaking.
      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      model.position.sub(center);

      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z) || 1;
      const scaleFactor = 2.4 / maxDim;
      model.scale.setScalar(scaleFactor);

      modelGroup.add(model);
    },
    undefined,
    (err) => {
      console.warn("Bike model failed to load — showing static fallback.", err);
      showFallback();
    }
  );

  // ---- Scroll range: the cinematic sequence plays out from the top of
  // the page through the end of the "workflow" section ----
  function getScrollRange() {
    const endEl = document.getElementById("workflow");
    if (!endEl) return window.innerHeight * 4;
    const rect = endEl.getBoundingClientRect();
    return window.scrollY + rect.bottom;
  }
  let scrollRange = getScrollRange();

  function onResize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    scrollRange = getScrollRange();
  }
  window.addEventListener("resize", onResize);
  window.addEventListener("load", () => { scrollRange = getScrollRange(); });

  // Reduced motion: hold a single static, well-composed angle. No
  // scroll-linked movement, but the model itself still renders.
  if (prefersReduced) {
    camera.position.copy(keyframes[0].pos);
    camera.lookAt(keyframes[0].look);
    renderer.render(scene, camera);
    // Re-render once after images/model finish loading or the window resizes,
    // since the scene is otherwise static.
    const rerender = () => renderer.render(scene, camera);
    window.addEventListener("resize", rerender);
    setTimeout(rerender, 800);
    return;
  }

  const clock = new THREE.Clock();

  function animate() {
    const delta = Math.min(clock.getDelta(), 0.1);

    const progress = Math.max(0, Math.min(1, window.scrollY / scrollRange));
    const segment = progress * (keyframes.length - 1);
    const idx = Math.min(keyframes.length - 2, Math.floor(segment));
    const frac = segment - idx;
    const eased = frac * frac * (3 - 2 * frac); // smoothstep — no sudden jumps between keyframes

    targetPos.lerpVectors(keyframes[idx].pos, keyframes[idx + 1].pos, eased);
    targetLook.lerpVectors(keyframes[idx].look, keyframes[idx + 1].look, eased);

    // Exponential damping: smooth, frame-rate independent trailing motion
    const factor = 1 - Math.exp(-4.5 * delta);
    currentPos.lerp(targetPos, factor);
    currentLook.lerp(targetLook, factor);

    camera.position.copy(currentPos);
    camera.lookAt(currentLook);

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
}
