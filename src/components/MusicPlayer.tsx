import { useCallback, useEffect, useRef, useState } from "react";
import { Pause, Play, SkipBack, SkipForward } from "lucide-react";

// To use real Chase Atlantic instrumentals:
//   1. Download the instrumental MP3s and place them in the /public folder
//      e.g. public/swim-instrumental.mp3
//   2. Replace each `src` below with the matching filename, e.g. "/swim-instrumental.mp3"
const PLAYLIST = [
  {
    title: "Swim (Instrumental)",
    artist: "Chase Atlantic",
    src: "/swim-instrumental.mp3",
  },
  {
    title: "Meddle About (Instrumental)",
    artist: "Chase Atlantic",
    src: "/meddle-about-instrumental.mp3",
  },
  {
    title: "Okay (Instrumental)",
    artist: "Chase Atlantic",
    src: "/okay-instrumental.mp3",
  },
  {
    title: "Friends (Instrumental)",
    artist: "Chase Atlantic",
    src: "/friends-instrumental.mp3",
  },
  {
    title: "Into It (Instrumental)",
    artist: "Chase Atlantic",
    src: "/into-it-instrumental.mp3",
  },
];

function fmt(s: number) {
  if (!s || isNaN(s)) return "0:00";
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
}

const MUTED   = "oklch(0.55 0.03 270)";
const MUTED_H = "#c4b5fd";

export default function MusicPlayer() {
  const [open,     setOpen]     = useState(false);
  const [playing,  setPlaying]  = useState(false);
  const [idx,      setIdx]      = useState(0);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  // Speech-bubble hint: show for ~4 s then fade away
  const [hint, setHint] = useState<"visible" | "fading" | "gone">("visible");
  useEffect(() => {
    const fadeTimer = setTimeout(() => setHint("fading"),  10000);
    const hideTimer = setTimeout(() => setHint("gone"),    10800);
    return () => { clearTimeout(fadeTimer); clearTimeout(hideTimer); };
  }, []);

  const audioRef   = useRef<HTMLAudioElement | null>(null);
  const playingRef = useRef(false);

  useEffect(() => { playingRef.current = playing; }, [playing]);

  // Load and (optionally) play when track index changes
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.src = PLAYLIST[idx].src;
    a.load();
    setProgress(0);
    if (playingRef.current) a.play().catch(() => setPlaying(false));
  }, [idx]);

  // Respond to play / pause toggle
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) a.play().catch(() => setPlaying(false));
    else a.pause();
  }, [playing]);

  const onTimeUpdate = useCallback(() => {
    const a = audioRef.current;
    if (!a || !a.duration) return;
    setDuration(a.duration);
    setProgress(a.currentTime / a.duration);
  }, []);

  const onEnded = useCallback(() => setIdx((i) => (i + 1) % PLAYLIST.length), []);

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const a = audioRef.current;
    if (!a || !a.duration) return;
    const { left, width } = e.currentTarget.getBoundingClientRect();
    a.currentTime = ((e.clientX - left) / width) * a.duration;
  };

  const skip = (d: 1 | -1) =>
    setIdx((i) => (i + d + PLAYLIST.length) % PLAYLIST.length);

  const track = PLAYLIST[idx];

  return (
    <>
      {/* Hidden audio element — controlled via ref */}
      <audio
        ref={audioRef}
        onTimeUpdate={onTimeUpdate}
        onEnded={onEnded}
        onLoadedMetadata={onTimeUpdate}
      />

      <div style={{ position: "fixed", bottom: "1.5rem", right: "1.5rem", zIndex: 40 }}>

        {/* ── Expanded player card ─────────────────────────────── */}
        <div
          style={{
            position: "absolute",
            bottom: "calc(100% + 14px)",
            right: 0,
            width: "300px",
            transformOrigin: "bottom right",
            transition:
              "opacity 0.28s ease, transform 0.28s cubic-bezier(0.34, 1.4, 0.64, 1)",
            opacity:       open ? 1 : 0,
            transform:     open ? "scale(1) translateY(0)" : "scale(0.88) translateY(10px)",
            pointerEvents: open ? "auto" : "none",
          }}
        >
          <div
            style={{
              background: "rgba(7, 6, 16, 0.97)",
              backdropFilter: "blur(28px)",
              WebkitBackdropFilter: "blur(28px)",
              border: "1px solid rgba(168,85,247,0.22)",
              borderRadius: "1.25rem",
              padding: "1.25rem",
              boxShadow: "0 28px 70px -10px rgba(0,0,0,0.85), 0 0 0 1px rgba(124,58,237,0.1), inset 0 1px 0 rgba(255,255,255,0.06)",
            }}
          >
            {/* Header row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "1rem",
              }}
            >
              <span
                style={{
                  fontSize: "0.6rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.2em",
                  color: MUTED,
                }}
              >
                Now Playing
              </span>
              <button
                onClick={() => setOpen(false)}
                style={{
                  color: MUTED,
                  fontSize: "0.95rem",
                  cursor: "pointer",
                  background: "none",
                  border: "none",
                  lineHeight: 1,
                  padding: "2px",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                onMouseLeave={(e) => (e.currentTarget.style.color = MUTED)}
              >
                ✕
              </button>
            </div>

            {/* ── Turntable deck ───────────────────────────────── */}
            <div
              style={{
                background: "linear-gradient(160deg, #0e0c1e 0%, #080612 60%, #06050f 100%)",
                borderRadius: "0.75rem",
                padding: "6px 6px 4px",
                marginBottom: "0.9rem",
                border: "1px solid rgba(255,255,255,0.07)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04), inset 0 -1px 0 rgba(0,0,0,0.5)",
              }}
            >
              <svg
                viewBox="0 0 256 162"
                width="100%"
                style={{ display: "block" }}
              >
                <defs>
                  {/* Platter: deep charcoal with subtle aluminum sheen */}
                  <radialGradient id="mp-platter" cx="42%" cy="38%">
                    <stop offset="0%"   stopColor="#2e2b42" />
                    <stop offset="40%"  stopColor="#18162a" />
                    <stop offset="85%"  stopColor="#0c0b18" />
                    <stop offset="100%" stopColor="#080612" />
                  </radialGradient>
                  {/* Vinyl: near-black with blue-black depth */}
                  <radialGradient id="mp-disk" cx="50%" cy="50%">
                    <stop offset="0%"   stopColor="#141220" />
                    <stop offset="60%"  stopColor="#080610" />
                    <stop offset="100%" stopColor="#030208" />
                  </radialGradient>
                  {/* Label: rich purple with gloss highlight */}
                  <radialGradient id="mp-label" cx="33%" cy="28%">
                    <stop offset="0%"   stopColor="#d8a4ff" />
                    <stop offset="35%"  stopColor="#9333ea" />
                    <stop offset="100%" stopColor="#3b0764" />
                  </radialGradient>
                  {/* Arm: metallic silver gradient */}
                  <linearGradient id="mp-arm" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%"   stopColor="#58547a" />
                    <stop offset="40%"  stopColor="#a09cc0" />
                    <stop offset="100%" stopColor="#6a6690" />
                  </linearGradient>
                  <filter id="mp-glow">
                    <feGaussianBlur stdDeviation="2.5" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                  <filter id="mp-needle-glow">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                </defs>

                {/* ── Platter shadow ── */}
                <circle cx="116" cy="83" r="77" fill="rgba(0,0,0,0.5)" />
                {/* ── Platter ── */}
                <circle cx="116" cy="81" r="77" fill="url(#mp-platter)" />
                {/* Platter outer chrome ring */}
                <circle cx="116" cy="81" r="76.5" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.2" />
                <circle cx="116" cy="81" r="75.5" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
                {/* Rubber mat texture rings */}
                {[72, 70, 68, 66].map((r) => (
                  <circle key={r} cx="116" cy="81" r={r} fill="none" stroke="rgba(255,255,255,0.045)" strokeWidth="0.8" />
                ))}

                {/* ── Vinyl record (spins) ── */}
                <g
                  className="vinyl-record"
                  style={{ animationPlayState: playing ? "running" : "paused" }}
                >
                  {/* Vinyl body */}
                  <circle cx="116" cy="81" r="63" fill="url(#mp-disk)" />
                  {/* Outer edge gloss */}
                  <circle cx="116" cy="81" r="62.5" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />
                  {/* Groove lines — more visible */}
                  {[57, 53, 49, 45, 41, 37, 33, 29].map((r) => (
                    <circle key={r} cx="116" cy="81" r={r} fill="none" stroke="rgba(255,255,255,0.11)" strokeWidth="0.7" />
                  ))}
                  {/* Groove sheen (light reflection band) */}
                  <circle cx="116" cy="81" r="45" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                  {/* Label */}
                  <circle cx="116" cy="81" r="21" fill="url(#mp-label)" />
                  <circle cx="116" cy="81" r="21" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.6" />
                  {/* Label gloss highlight */}
                  <ellipse cx="110" cy="74" rx="6" ry="3.5" fill="rgba(255,255,255,0.22)" transform="rotate(-35 110 74)" />
                  {/* Spindle hole */}
                  <circle cx="116" cy="81" r="3.5" fill="#030208" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
                </g>

                {/* ── Tonearm ── */}
                {/* Pivot base shadow */}
                <circle cx="233" cy="21" r="11" fill="rgba(0,0,0,0.6)" />
                {/* Pivot base plate */}
                <circle cx="232" cy="19" r="10" fill="#1a1828" stroke="rgba(180,170,220,0.35)" strokeWidth="1.5" />
                <circle cx="232" cy="19" r="6"  fill="#0f0e1e" stroke="rgba(160,156,192,0.4)" strokeWidth="1" />
                <circle cx="232" cy="19" r="2.5" fill="#06050e" />

                {/* Arm group */}
                <g
                  style={{
                    transformBox: "view-box",
                    transformOrigin: "232px 19px",
                    transform: playing ? "rotate(48deg)" : "rotate(5deg)",
                    transition: "transform 0.9s cubic-bezier(0.34, 1.05, 0.64, 1)",
                  }}
                >
                  {/* Arm shadow */}
                  <line x1="233" y1="29" x2="230" y2="108" stroke="rgba(0,0,0,0.5)" strokeWidth="4" strokeLinecap="round" />
                  {/* Main arm body — chrome */}
                  <line
                    x1="232" y1="28"
                    x2="229" y2="107"
                    stroke="url(#mp-arm)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  {/* Arm highlight streak */}
                  <line x1="232" y1="32" x2="230" y2="100" stroke="rgba(255,255,255,0.18)" strokeWidth="0.8" strokeLinecap="round" />
                  {/* Headshell kink */}
                  <line
                    x1="229" y1="107"
                    x2="224" y2="118"
                    stroke="#a8a4c8"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  {/* Cartridge body */}
                  <rect x="219" y="116" width="10" height="5" rx="2"
                    fill="#1e1c34" stroke="rgba(180,176,210,0.5)" strokeWidth="0.8"
                  />
                  {/* Needle tip — bright purple glow */}
                  <circle cx="224" cy="123" r="3.5" fill="#b060ff" filter="url(#mp-needle-glow)" />
                  <circle cx="224" cy="123" r="1.8" fill="#e0b0ff" />
                  <line x1="224" y1="126" x2="224" y2="130" stroke="#c084fc" strokeWidth="1.5" strokeLinecap="round" />
                </g>

                {/* Anti-skate weight */}
                <circle cx="243" cy="34" r="4" fill="#1a1830" stroke="rgba(160,156,200,0.4)" strokeWidth="1" />
                <circle cx="243" cy="34" r="1.5" fill="#0a091a" />
                <line x1="232" y1="19" x2="243" y2="34" stroke="rgba(140,136,180,0.5)" strokeWidth="1.2" />
              </svg>
            </div>

            {/* Track info */}
            <div style={{ textAlign: "center", marginBottom: "0.9rem" }}>
              <p
                style={{
                  fontWeight: 600,
                  fontSize: "0.92rem",
                  color: "#fff",
                  marginBottom: "0.2rem",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {track.title}
              </p>
              <p style={{ fontSize: "0.74rem", color: MUTED }}>{track.artist}</p>
            </div>

            {/* Progress bar */}
            <div
              onClick={seek}
              style={{
                height: "3px",
                borderRadius: "9999px",
                background: "oklch(1 0 0 / 10%)",
                cursor: "pointer",
                marginBottom: "0.28rem",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${progress * 100}%`,
                  borderRadius: "9999px",
                  background: "linear-gradient(90deg, #7c3aed, #a855f7)",
                  transition: "width 0.25s linear",
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "0.62rem",
                color: MUTED,
                marginBottom: "1.1rem",
              }}
            >
              <span>{fmt(progress * duration)}</span>
              <span>{fmt(duration)}</span>
            </div>

            {/* Playback controls */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "1.5rem",
              }}
            >
              {/* Skip back */}
              <button
                onClick={() => skip(-1)}
                style={{ color: MUTED, cursor: "pointer", background: "none", border: "none", display: "flex", transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = MUTED_H)}
                onMouseLeave={(e) => (e.currentTarget.style.color = MUTED)}
              >
                <SkipBack size={18} />
              </button>

              {/* Play / Pause */}
              <button
                onClick={() => setPlaying((p) => !p)}
                style={{
                  width: "46px",
                  height: "46px",
                  borderRadius: "9999px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                  boxShadow: "0 0 24px -4px #a855f7bb",
                  cursor: "pointer",
                  border: "none",
                  flexShrink: 0,
                  transition: "transform 0.15s ease, box-shadow 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = "scale(1.1)";
                  el.style.boxShadow = "0 0 32px -2px #a855f7dd";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = "scale(1)";
                  el.style.boxShadow = "0 0 24px -4px #a855f7bb";
                }}
              >
                {playing ? (
                  <Pause size={18} fill="white" color="white" />
                ) : (
                  <Play size={18} fill="white" color="white" style={{ marginLeft: "2px" }} />
                )}
              </button>

              {/* Skip forward */}
              <button
                onClick={() => skip(1)}
                style={{ color: MUTED, cursor: "pointer", background: "none", border: "none", display: "flex", transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = MUTED_H)}
                onMouseLeave={(e) => (e.currentTarget.style.color = MUTED)}
              >
                <SkipForward size={18} />
              </button>
            </div>

            {/* Playlist dots */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "6px",
                marginTop: "1rem",
              }}
            >
              {PLAYLIST.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  style={{
                    width: i === idx ? "18px" : "6px",
                    height: "6px",
                    borderRadius: "9999px",
                    background: i === idx ? "linear-gradient(90deg,#7c3aed,#a855f7)" : "oklch(1 0 0 / 20%)",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    transition: "width 0.3s ease, background 0.3s ease",
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── Speech-bubble hint ───────────────────────────────── */}
        {hint !== "gone" && (
          <div
            style={{
              position: "absolute",
              bottom: "6px",
              right: "calc(100% + 14px)",
              whiteSpace: "nowrap",
              pointerEvents: "none",
              transition: "opacity 0.7s ease, transform 0.7s ease",
              opacity:   hint === "fading" ? 0 : 1,
              transform: hint === "fading" ? "translateX(-8px)" : "translateX(0)",
            }}
          >
            {/* Cloud bubble */}
            <div
              style={{
                background: "oklch(0.11 0.035 272 / 96%)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid oklch(0.62 0.23 295 / 40%)",
                borderRadius: "1rem",
                padding: "0.6rem 1rem",
                fontSize: "0.78rem",
                lineHeight: 1.5,
                color: "#e9d5ff",
                boxShadow: "0 8px 32px -6px rgba(124,58,237,0.5), 0 0 0 1px rgba(168,85,247,0.08)",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <span style={{ fontSize: "1.05rem" }}>🎵</span>
              <span>
                Put on some music<br />
                <span style={{ color: "#c084fc", fontWeight: 600 }}>while you scroll!</span>
              </span>
            </div>
            {/* Arrow tail pointing RIGHT toward the button */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                right: "-8px",
                transform: "translateY(-50%)",
                width: 0,
                height: 0,
                borderTop: "7px solid transparent",
                borderBottom: "7px solid transparent",
                borderLeft: "9px solid oklch(0.62 0.23 295 / 40%)",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "50%",
                right: "-6px",
                transform: "translateY(-50%)",
                width: 0,
                height: 0,
                borderTop: "6px solid transparent",
                borderBottom: "6px solid transparent",
                borderLeft: "8px solid oklch(0.11 0.035 272)",
              }}
            />
          </div>
        )}

        {/* ── Collapsed turntable button ───────────────────────── */}
        <button
          onClick={() => setOpen((o) => !o)}
          className="vinyl-pill"
          aria-label="Toggle music player"
          style={{
            width: "72px",
            height: "52px",
            borderRadius: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(145deg, #100e20 0%, #1e0a42 50%, #0e0820 100%)",
            border: "1px solid rgba(168,85,247,0.55)",
            cursor: "pointer",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
            overflow: "hidden",
            padding: 0,
            boxShadow: "0 4px 20px -4px rgba(124,58,237,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.transform = "scale(1.08)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.transform = "scale(1)")}
        >
          {/* Mini turntable SVG */}
          <svg
            viewBox="0 0 72 52"
            width={72}
            height={52}
            style={{ display: "block" }}
          >
            <defs>
              <radialGradient id="btn-platter" cx="42%" cy="38%">
                <stop offset="0%"   stopColor="#2c2944" />
                <stop offset="55%"  stopColor="#141228" />
                <stop offset="100%" stopColor="#08060f" />
              </radialGradient>
              <radialGradient id="btn-disk" cx="50%" cy="50%">
                <stop offset="0%"   stopColor="#121020" />
                <stop offset="100%" stopColor="#03020a" />
              </radialGradient>
              <radialGradient id="btn-label" cx="33%" cy="28%">
                <stop offset="0%"   stopColor="#d8a4ff" />
                <stop offset="40%"  stopColor="#9333ea" />
                <stop offset="100%" stopColor="#3b0764" />
              </radialGradient>
              <linearGradient id="btn-arm" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%"   stopColor="#504c70" />
                <stop offset="50%"  stopColor="#9894b8" />
                <stop offset="100%" stopColor="#625e88" />
              </linearGradient>
              <filter id="btn-glow">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            {/* Deck surface lines */}
            <line x1="0" y1="44" x2="72" y2="44" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
            <line x1="0" y1="8"  x2="72" y2="8"  stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />

            {/* Platter shadow */}
            <circle cx="28" cy="27" r="21" fill="rgba(0,0,0,0.45)" />
            {/* Platter */}
            <circle cx="28" cy="26" r="21" fill="url(#btn-platter)" />
            <circle cx="28" cy="26" r="20.5" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />
            {[18, 15].map((r) => (
              <circle key={r} cx="28" cy="26" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
            ))}

            {/* Vinyl (spins) */}
            <g
              className="vinyl-record"
              style={{ animationPlayState: playing ? "running" : "paused" }}
            >
              <circle cx="28" cy="26" r="17" fill="url(#btn-disk)" />
              <circle cx="28" cy="26" r="16.5" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="0.5" />
              {[14, 11, 8].map((r) => (
                <circle key={r} cx="28" cy="26" r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
              ))}
              <circle cx="28" cy="26" r="5"   fill="url(#btn-label)" />
              <circle cx="28" cy="26" r="5"   fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.4" />
              <circle cx="28" cy="26" r="1.5" fill="#03020a" />
            </g>

            {/* Tonearm pivot */}
            <circle cx="62" cy="8" r="4.5" fill="#181628" stroke="rgba(180,170,220,0.38)" strokeWidth="1" />
            <circle cx="62" cy="8" r="2"   fill="#0a091a" stroke="rgba(160,156,200,0.3)" strokeWidth="0.6" />

            {/* Tonearm */}
            <g
              style={{
                transformBox: "view-box",
                transformOrigin: "62px 8px",
                transform: playing ? "rotate(30deg)" : "rotate(5deg)",
                transition: "transform 0.9s cubic-bezier(0.34, 1.05, 0.64, 1)",
              }}
            >
              {/* Arm shadow */}
              <line x1="63" y1="13" x2="61" y2="35" stroke="rgba(0,0,0,0.4)" strokeWidth="3" strokeLinecap="round" />
              {/* Chrome arm */}
              <line x1="62" y1="12" x2="60" y2="34" stroke="url(#btn-arm)" strokeWidth="2" strokeLinecap="round" />
              <line x1="62" y1="14" x2="61" y2="32" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" strokeLinecap="round" />
              <line x1="60" y1="34" x2="57" y2="40" stroke="#a8a4c8" strokeWidth="1.8" strokeLinecap="round" />
              {/* Needle glow */}
              <circle cx="57" cy="41" r="2.5" fill="#b060ff" filter="url(#btn-glow)" />
              <circle cx="57" cy="41" r="1.2" fill="#e0b0ff" />
            </g>

            {/* Anti-skate weight */}
            <circle cx="67" cy="16" r="2.2" fill="#181630" stroke="rgba(160,156,200,0.4)" strokeWidth="0.6" />
            <line x1="62" y1="8" x2="67" y2="16" stroke="rgba(140,136,180,0.45)" strokeWidth="0.8" />
          </svg>
        </button>
      </div>
    </>
  );
}
