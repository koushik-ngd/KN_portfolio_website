import { useEffect, useRef } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────
const N         = 130;
const CONN_DIST = 0.72;
const SPEED_Y   = 0.0022;
const SPEED_X   = 0.0006;
const HOLD_SEC  = 2.5;   // seconds to hold each shape
const MORPH_SEC = 2.5;   // seconds for each transition
const PHASE_DUR = HOLD_SEC + MORPH_SEC;

type V3 = { x: number; y: number; z: number };

// ── Ease in-out (smoothstep) ──────────────────────────────────────────────────
function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function lerp3(a: V3, b: V3, t: number): V3 {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, z: a.z + (b.z - a.z) * t };
}

// ── Shape generators (all derived from same Fibonacci distribution) ───────────

// Sphere — Fibonacci spiral
const SPHERE: V3[] = (() => {
  const pts: V3[] = [];
  const g = Math.PI * (1 + Math.sqrt(5));
  for (let i = 0; i < N; i++) {
    const t = Math.acos(1 - (2 * (i + 0.5)) / N);
    const p = g * i;
    pts.push({ x: Math.sin(t) * Math.cos(p), y: Math.sin(t) * Math.sin(p), z: Math.cos(t) });
  }
  return pts;
})();

// Cube — project each sphere ray onto the L∞ unit cube, then scale
const CUBE: V3[] = SPHERE.map(({ x, y, z }) => {
  const m = Math.max(Math.abs(x), Math.abs(y), Math.abs(z));
  const s = 0.82 / m;
  return { x: x * s, y: y * s, z: z * s };
});

// Diamond (octahedron) — project onto L1 sphere, then scale
const DIAMOND: V3[] = SPHERE.map(({ x, y, z }) => {
  const m = Math.abs(x) + Math.abs(y) + Math.abs(z);
  const s = 1.2 / m;
  return { x: x * s, y: y * s, z: z * s };
});

// Square pyramid — apex (0,0,1), square base at z=-1 with corners (±1,±1,-1)
// Face planes: base z=-1; sides ±2x+z=1, ±2y+z=1
// Cast a ray from origin in direction p and find minimum positive t.
const PYRAMID: V3[] = SPHERE.map(({ x, y, z }) => {
  let t = Infinity;
  if (z < -1e-9)          t = Math.min(t, -1 / z);
  if ( 2*x + z > 1e-9)   t = Math.min(t, 1 / ( 2*x + z));
  if (-2*x + z > 1e-9)   t = Math.min(t, 1 / (-2*x + z));
  if ( 2*y + z > 1e-9)   t = Math.min(t, 1 / ( 2*y + z));
  if (-2*y + z > 1e-9)   t = Math.min(t, 1 / (-2*y + z));
  if (!isFinite(t) || t <= 0) t = 1;
  const s = 0.78;
  return { x: x * t * s, y: y * t * s, z: z * t * s };
});

const SHAPES: V3[][] = [SPHERE, CUBE, DIAMOND, PYRAMID];

// ── Rotation helpers ──────────────────────────────────────────────────────────
const ry = (p: V3, a: number): V3 => ({
  x:  p.x * Math.cos(a) + p.z * Math.sin(a),
  y:  p.y,
  z: -p.x * Math.sin(a) + p.z * Math.cos(a),
});
const rx = (p: V3, a: number): V3 => ({
  x: p.x,
  y: p.y * Math.cos(a) - p.z * Math.sin(a),
  z: p.y * Math.sin(a) + p.z * Math.cos(a),
});

// ─── Component ────────────────────────────────────────────────────────────────
export default function HeroVisual() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse     = useRef({ x: 0, y: 0 });
  const rot       = useRef({ y: 0.4, x: 0.3 });
  const raf       = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0, H = 0, cx = 0, cy = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width  = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cx = W / 2;
      cy = H / 2;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.current = {
        x: (e.clientX - r.left  - r.width  / 2) / r.width,
        y: (e.clientY - r.top   - r.height / 2) / r.height,
      };
    };
    window.addEventListener("mousemove", onMove);

    let last = performance.now();
    let elapsed = 0;

    const draw = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last     = now;
      elapsed += dt;

      rot.current.y += SPEED_Y + mouse.current.x * 0.012;
      rot.current.x += SPEED_X + mouse.current.y * 0.004;

      ctx.clearRect(0, 0, W, H);

      const R   = Math.min(W, H) * 0.38;
      const fov = R * 2.6;

      // ── Morphing: hold → ease-in-out morph → hold → … ─────────────────────
      const totalCycle = PHASE_DUR * SHAPES.length;
      const cycle      = elapsed % totalCycle;
      const phaseIdx   = Math.floor(cycle / PHASE_DUR);
      const phaseT     = (cycle % PHASE_DUR) / PHASE_DUR;   // 0 → 1 within phase
      const holdFrac   = HOLD_SEC / PHASE_DUR;               // fraction spent holding
      const rawMorph   = phaseT < holdFrac ? 0 : (phaseT - holdFrac) / (1 - holdFrac);
      const lerpT      = easeInOut(Math.min(rawMorph, 1));

      const fromPts = SHAPES[phaseIdx];
      const toPts   = SHAPES[(phaseIdx + 1) % SHAPES.length];
      const pts     = fromPts.map((a, i) => lerp3(a, toPts[i], lerpT));

      // ── Project points with perspective ────────────────────────────────────
      type PP = { sx: number; sy: number; z: number; rp: V3 };
      const pp: PP[] = pts.map((p) => {
        const q = rx(ry(p, rot.current.y), rot.current.x);
        const s = fov / (fov + q.z * R);
        return { sx: cx + q.x * R * s, sy: cy + q.y * R * s, z: q.z, rp: q };
      });

      // ── Connections ────────────────────────────────────────────────────────
      for (let i = 0; i < pp.length; i++) {
        for (let j = i + 1; j < pp.length; j++) {
          const a = pp[i], b = pp[j];
          const dx = a.rp.x - b.rp.x, dy = a.rp.y - b.rp.y, dz = a.rp.z - b.rp.z;
          const d  = Math.sqrt(dx * dx + dy * dy + dz * dz);
          if (d < CONN_DIST) {
            const fade   = 1 - d / CONN_DIST;
            const depthA = (a.z + 1) / 2;
            const depthB = (b.z + 1) / 2;
            const alpha  = fade * 0.42 * (depthA * 0.55 + 0.28) * (depthB * 0.55 + 0.28);
            ctx.beginPath();
            ctx.moveTo(a.sx, a.sy);
            ctx.lineTo(b.sx, b.sy);
            ctx.strokeStyle = `rgba(167,139,250,${alpha.toFixed(3)})`;
            ctx.lineWidth   = 0.55;
            ctx.stroke();
          }
        }
      }

      // ── Dots ───────────────────────────────────────────────────────────────
      for (const p of pp) {
        const t     = (p.z + 1) / 2;
        const alpha = 0.28 + t * 0.72;
        const r     = 1.1 + t * 2.8;

        const grd = ctx.createRadialGradient(p.sx, p.sy, 0, p.sx, p.sy, r * 4);
        grd.addColorStop(0, `rgba(192,132,252,${(alpha * 0.6).toFixed(3)})`);
        grd.addColorStop(1, "rgba(192,132,252,0)");
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, r * 4, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.sx, p.sy, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(233,213,255,${alpha.toFixed(3)})`;
        ctx.fill();
      }

      // ── Orbital rings ──────────────────────────────────────────────────────
      const rings = [
        { rx: R * 0.92, ry: R * 0.28, tilt:  0.18, speed:  0.38, color: "168,85,247",  alpha: 0.18, dotR: 3.5 },
        { rx: R * 0.72, ry: R * 0.22, tilt: -0.28, speed: -0.22, color: "124,58,237",  alpha: 0.13, dotR: 2.5 },
        { rx: R * 1.08, ry: R * 0.18, tilt:  0.55, speed:  0.15, color: "196,181,253", alpha: 0.09, dotR: 2.0 },
      ];

      ctx.save();
      ctx.translate(cx, cy);

      for (const ring of rings) {
        const angle = elapsed * ring.speed;

        ctx.beginPath();
        ctx.save();
        ctx.rotate(ring.tilt);
        ctx.ellipse(0, 0, ring.rx, ring.ry, 0, 0, Math.PI * 2);
        ctx.restore();
        ctx.strokeStyle = `rgba(${ring.color},${ring.alpha})`;
        ctx.lineWidth   = 0.8;
        ctx.stroke();

        const ex0 = ring.rx * Math.cos(angle);
        const ey0 = ring.ry * Math.sin(angle);
        const ex  = ex0 * Math.cos(ring.tilt) - ey0 * Math.sin(ring.tilt);
        const ey  = ex0 * Math.sin(ring.tilt) + ey0 * Math.cos(ring.tilt);

        const dg = ctx.createRadialGradient(ex, ey, 0, ex, ey, ring.dotR * 4);
        dg.addColorStop(0, `rgba(${ring.color},${ring.alpha * 4})`);
        dg.addColorStop(1, `rgba(${ring.color},0)`);
        ctx.beginPath();
        ctx.arc(ex, ey, ring.dotR * 4, 0, Math.PI * 2);
        ctx.fillStyle = dg;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(ex, ey, ring.dotR, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${ring.color},${Math.min(ring.alpha * 5, 0.85)})`;
        ctx.fill();
      }

      ctx.restore();

      // ── Ambient centre glow ────────────────────────────────────────────────
      const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 0.55);
      cg.addColorStop(0, "rgba(124,58,237,0.07)");
      cg.addColorStop(0.5, "rgba(124,58,237,0.03)");
      cg.addColorStop(1, "rgba(124,58,237,0)");
      ctx.beginPath();
      ctx.arc(cx, cy, R * 0.55, 0, Math.PI * 2);
      ctx.fillStyle = cg;
      ctx.fill();

      // ── Outer vignette (softens edges) ────────────────────────────────────
      const vg = ctx.createRadialGradient(cx, cy, R * 0.7, cx, cy, R * 1.15);
      vg.addColorStop(0, "rgba(4,3,10,0)");
      vg.addColorStop(1, "rgba(4,3,10,0.45)");
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.15, 0, Math.PI * 2);
      ctx.fillStyle = vg;
      ctx.fill();

      raf.current = requestAnimationFrame(draw);
    };

    raf.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf.current);
      ro.disconnect();
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ display: "block", width: "100%", height: "100%", cursor: "crosshair" }}
    />
  );
}
