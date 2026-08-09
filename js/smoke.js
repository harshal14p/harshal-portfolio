/* ==========================================================================
   SMOKE BACKGROUND
   Cinematic pink/wine fog made from a handful of soft radial-gradient
   "blobs" that drift slowly using layered sine waves. Radial gradients
   already have soft falloff built in, so no expensive blur filters are
   needed — this stays cheap even on modest devices.
   ========================================================================== */

const COLORS = [
  { r: 122, g: 18, b: 54 },   // deep wine
  { r: 178, g: 58, b: 92 },   // mid wine-pink
  { r: 255, g: 61, b: 129 },  // vivid pink (used sparingly, low alpha)
];

export function initSmoke() {
  const canvas = document.getElementById("smoke-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isSmallScreen = window.innerWidth < 760;

  const blobCount = prefersReduced ? 4 : isSmallScreen ? 5 : 8;
  const speed = prefersReduced ? 0.08 : isSmallScreen ? 0.35 : 0.5;
  const dpr = Math.min(window.devicePixelRatio || 1, isSmallScreen ? 1.5 : 2);

  let width = 0;
  let height = 0;
  let running = true;

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener("resize", resize);

  // Each blob drifts along its own lazy Lissajous-style path
  const blobs = Array.from({ length: blobCount }, (_, i) => {
    const color = COLORS[i % COLORS.length];
    return {
      color,
      baseX: Math.random() * width,
      baseY: Math.random() * height,
      radius: Math.min(width, height) * (0.35 + Math.random() * 0.35),
      ampX: 120 + Math.random() * 180,
      ampY: 90 + Math.random() * 160,
      freqX: 0.05 + Math.random() * 0.08,
      freqY: 0.04 + Math.random() * 0.07,
      phase: Math.random() * Math.PI * 2,
      alpha: 0.16 + Math.random() * 0.14,
    };
  });

  let t = 0;

  function draw() {
    ctx.clearRect(0, 0, width, height);
    ctx.globalCompositeOperation = "lighter";

    for (const b of blobs) {
      const x = b.baseX + Math.sin(t * b.freqX + b.phase) * b.ampX;
      const y = b.baseY + Math.cos(t * b.freqY + b.phase) * b.ampY;

      const gradient = ctx.createRadialGradient(x, y, 0, x, y, b.radius);
      gradient.addColorStop(0, `rgba(${b.color.r}, ${b.color.g}, ${b.color.b}, ${b.alpha})`);
      gradient.addColorStop(1, `rgba(${b.color.r}, ${b.color.g}, ${b.color.b}, 0)`);

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    }

    ctx.globalCompositeOperation = "source-over";
  }

  function loop() {
    if (!running) return;
    t += 0.016 * speed;
    draw();
    requestAnimationFrame(loop);
  }

  // Pause the loop while the tab is hidden to save battery/CPU
  document.addEventListener("visibilitychange", () => {
    running = !document.hidden;
    if (running) requestAnimationFrame(loop);
  });

  requestAnimationFrame(loop);
}
