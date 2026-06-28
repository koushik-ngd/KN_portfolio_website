import { useEffect, useRef } from "react";

const FS = 14; // font size in px — also the column width

interface Col {
  head: number;    // current head row (fractional)
  length: number;  // stream length in rows
  speed: number;   // rows advanced per frame
  chars: string[]; // binary chars for each row in stream
}

function mkCol(startRow: number): Col {
  const len = 8 + Math.floor(Math.random() * 24);
  return {
    head: startRow,
    length: len,
    speed: 0.12 + Math.random() * 0.28,
    chars: Array.from({ length: len }, () => (Math.random() > 0.5 ? "1" : "0")),
  };
}

export default function BinaryRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const clickRef = useRef<{ x: number; y: number; t: number } | null>(null);
  const rafRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0;
    let H = 0;
    let numCols = 0;
    let columns: Col[] = [];

    function init() {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W;
      canvas.height = H;
      numCols = Math.ceil(W / FS) + 1;
      const maxR = Math.ceil(H / FS);
      columns = Array.from({ length: numCols }, () =>
        mkCol(-(Math.random() * maxR * 1.8))
      );
    }

    init();

    function draw() {
      const { x: mx, y: my } = mouseRef.current;
      const ck = clickRef.current;
      const now = performance.now();
      const ckAge = ck ? (now - ck.t) / 1000 : 1;
      const ckDecay = Math.max(0, 1 - ckAge * 2.2);

      // Near-black background — drawn fresh every frame
      ctx.fillStyle = "#04030a";
      ctx.fillRect(0, 0, W, H);

      ctx.font = `${FS}px "Courier New", monospace`;

      for (let i = 0; i < numCols; i++) {
        const col = columns[i];
        const x = i * FS;

        for (let j = 0; j < col.length; j++) {
          const row = Math.floor(col.head) - j;
          const py = row * FS;
          if (py < -FS || py > H + FS) continue;

          // Occasionally flip chars in the stream to keep it feeling alive
          if (Math.random() < 0.035) {
            col.chars[j] = Math.random() > 0.5 ? "1" : "0";
          }

          const ch = col.chars[j];

          // Brightness falls off from head (j=0) toward tail
          const ratio = Math.pow(1 - j / col.length, 1.5);

          // Mouse-hover proximity glow
          const mDist = Math.hypot(x - mx, py - my);
          const mGlow = Math.max(0, 1 - mDist / 190);

          // Click-burst proximity glow
          const cDist = ck ? Math.hypot(x - ck.x, py - ck.y) : 9999;
          const cGlow = ckDecay * Math.max(0, 1 - cDist / 300);

          const glow = Math.min(1, mGlow + cGlow);

          if (j === 0) {
            // Head character: bright lavender-white, boosted by proximity
            const r = Math.floor(190 + glow * 65);
            const g = Math.floor(175 + glow * 80);
            ctx.fillStyle = `rgba(${r},${g},255,${0.88 + glow * 0.12})`;
          } else {
            // Trail: deep purple dimming toward the tail
            const r = Math.floor((65 + glow * 90) * ratio);
            const g = Math.floor((28 + glow * 55) * ratio);
            const b = Math.floor((148 + glow * 70) * ratio);
            ctx.fillStyle = `rgba(${r},${g},${b},${(0.78 + glow * 0.22) * ratio})`;
          }

          ctx.fillText(ch, x, py);
        }

        col.head += col.speed;

        // Restart stream once its tail has fully cleared the bottom edge
        if ((Math.floor(col.head) - col.length) * FS > H + FS) {
          if (Math.random() < 0.025) {
            columns[i] = mkCol(-(1 + Math.random() * 28));
          }
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    draw();

    const onResize = () => init();
    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const onLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };
    const onClick = (e: MouseEvent) => {
      clickRef.current = { x: e.clientX, y: e.clientY, t: performance.now() };
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    window.addEventListener("click", onClick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        display: "block",
        zIndex: -1,
        pointerEvents: "none",
      }}
    />
  );
}
