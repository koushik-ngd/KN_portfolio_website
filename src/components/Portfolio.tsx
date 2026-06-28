import { useEffect, useRef, useState } from "react";
import { Github, Linkedin, Mail, Download, ArrowUpRight } from "lucide-react";
import HeroVisual from "./HeroVisual";

const NAV = [
  { label: "Home",       href: "#home" },
  { label: "About",      href: "#about" },
  { label: "Tech Stack", href: "#techstack" },
  { label: "Projects",   href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Blog",       href: "/blog" },
  { label: "Contact",    href: "#contact" },
];

const ROLES = ["Data Analyst", "AI Engineer", "ML Engineer", "Python Developer"];

const DI = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons";
const SI = "https://cdn.simpleicons.org";

const TECH_STACK: Array<{ name: string; src: string; invert?: boolean; whiteBg?: boolean }> = [
  { name: "Python",       src: `${DI}/python/python-original.svg` },
  { name: "Pandas",       src: `${DI}/pandas/pandas-original.svg` },
  { name: "NumPy",        src: `${DI}/numpy/numpy-original.svg` },
  { name: "Matplotlib",   src: `${DI}/matplotlib/matplotlib-original.svg` },
  { name: "scikit-learn", src: `${DI}/scikitlearn/scikitlearn-original.svg` },
  { name: "TensorFlow",   src: `${DI}/tensorflow/tensorflow-original.svg` },
  // postgresql gives a clear visual database icon that represents SQL skills
  { name: "SQL",          src: `${DI}/postgresql/postgresql-original.svg` },
  { name: "MySQL",        src: `${DI}/mysql/mysql-original.svg` },
  { name: "Power BI",     src: "/powerbi.png", whiteBg: true },
  { name: "Jupyter",      src: `${DI}/jupyter/jupyter-original.svg` },
  { name: "Git",          src: `${DI}/git/git-original.svg` },
  { name: "GitHub",       src: `${SI}/github/ffffff` },
  { name: "VS Code",      src: `${DI}/vscode/vscode-original.svg` },
  { name: "React",        src: `${DI}/react/react-original.svg` },
  { name: "Next.js",      src: "/nextjs.png" },
  { name: "C++",          src: `${DI}/cplusplus/cplusplus-original.svg` },
];

const PROJECTS = [
  {
    title: "Dubai Real Estate ROI Analysis",
    desc: "Analyzed 1M+ Dubai Land Department transactions to identify highest ROI neighbourhoods.",
    tags: ["Python", "Pandas", "Matplotlib"],
    href: "https://github.com/koushik-ngd/Dubai-RE-ROI-Analysis",
    image: "/projects/dubai-re-roi.jpg",
  },
  {
    title: "Dubai Rental Market Trends & Price Prediction",
    desc: "16 years of rental data analyzed with a Random Forest price prediction model achieving R² of 0.699.",
    tags: ["Python", "scikit-learn", "Matplotlib"],
    href: "https://github.com/koushik-ngd/Dubai-Rental-Trends",
    image: "/projects/dubai-rental.png",
  },
  {
    title: "Explainable AI Loan Approval Agent",
    desc: "End-to-end ML pipeline with SHAP explainability for transparent financial decision making.",
    tags: ["Python", "SHAP", "Random Forest"],
    href: "https://github.com/koushik-ngd/ExplainableAI-Loan-Approval-AI-Agent",
    image: "/projects/explainable-ai.png",
  },
];

const POSTS = [
  {
    title: "How I Analyzed 1 Million Dubai Property Transactions",
    date: "March 12, 2026",
    excerpt: "A deep dive into the pipeline, the data quirks, and the ROI neighbourhoods that surprised me.",
  },
  {
    title: "What the UAE Rental Market Data Actually Tells Us",
    date: "February 4, 2026",
    excerpt: "Sixteen years of rentals, one Random Forest, and the patterns landlords don't talk about.",
  },
  {
    title: "Why Explainability Matters in AI",
    date: "January 18, 2026",
    excerpt: "Why SHAP isn't optional when your model approves or rejects someone's loan.",
  },
];

function IntroOverlay({ onDone }: { onDone: () => void }) {
  const text = "Built different. Powered by data.";
  const [shown, setShown] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (shown < text.length) {
      const t = setTimeout(() => setShown(shown + 1), 55);
      return () => clearTimeout(t);
    }
    const a = setTimeout(() => setFading(true), 700);
    const b = setTimeout(() => onDone(), 1500);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, [shown, onDone, text.length]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-700 ${fading ? "opacity-0 pointer-events-none" : "opacity-100"}`}
      style={{ background: "#04030a" }}
    >
      <h1 className="font-display text-3xl md:text-6xl font-semibold tracking-tight text-center px-6">
        {text.split("").map((ch, i) => (
          <span
            key={i}
            className={i < shown ? "text-gradient-purple" : "opacity-0"}
            style={{ transition: "opacity .2s ease" }}
          >
            {ch === " " ? "\u00A0" : ch}
          </span>
        ))}
        <span className="caret h-[0.9em] align-middle" />
      </h1>
    </div>
  );
}

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function TypingRoles() {
  const [i, setI] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = ROLES[i];
    const speed = deleting ? 45 : 90;
    const t = setTimeout(() => {
      if (!deleting) {
        const next = current.slice(0, text.length + 1);
        setText(next);
        if (next === current) setTimeout(() => setDeleting(true), 1400);
      } else {
        const next = current.slice(0, text.length - 1);
        setText(next);
        if (next === "") { setDeleting(false); setI((i + 1) % ROLES.length); }
      }
    }, speed);
    return () => clearTimeout(t);
  }, [text, deleting, i]);

  return (
    <span className="text-purple-glow" style={{ color: "var(--purple-glow)" }}>
      {text}<span className="caret h-[1em] align-middle" />
    </span>
  );
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    h(); window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all ${scrolled ? "py-3" : "py-5"}`}>
      <div className="mx-auto max-w-6xl px-6">
        <div
          className="flex items-center justify-between rounded-2xl px-5 py-3 border"
          style={{
            background: "oklch(0.07 0.02 270 / 82%)",
            backdropFilter: "blur(20px)",
            borderColor: "oklch(1 0 0 / 10%)",
          }}
        >
          <a href="#home" className="logo-badge">
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* outer ring */}
              <circle cx="22" cy="22" r="20.5" stroke="url(#logo-ring)" strokeWidth="0.85"/>
              {/* subtle inner ring for depth */}
              <circle cx="22" cy="22" r="17" stroke="url(#logo-ring2)" strokeWidth="0.4"/>
              {/* KN monogram */}
              <text
                x="22" y="26.5"
                textAnchor="middle"
                fontFamily="inherit"
                fontSize="11"
                fontWeight="500"
                letterSpacing="2"
                fill="url(#logo-text)"
              >KN</text>
              <defs>
                <linearGradient id="logo-ring" x1="2" y1="2" x2="42" y2="42" gradientUnits="userSpaceOnUse">
                  <stop offset="0%"   stopColor="#c4b5fd" stopOpacity="0.75"/>
                  <stop offset="45%"  stopColor="#7c3aed" stopOpacity="0.35"/>
                  <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.65"/>
                </linearGradient>
                <linearGradient id="logo-ring2" x1="2" y1="2" x2="42" y2="42" gradientUnits="userSpaceOnUse">
                  <stop offset="0%"   stopColor="#a78bfa" stopOpacity="0.2"/>
                  <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.04"/>
                </linearGradient>
                <linearGradient id="logo-text" x1="10" y1="16" x2="34" y2="30" gradientUnits="userSpaceOnUse">
                  <stop offset="0%"   stopColor="#ede9fe"/>
                  <stop offset="100%" stopColor="#a78bfa"/>
                </linearGradient>
              </defs>
            </svg>
          </a>
          <nav className="hidden md:flex items-center gap-7">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} className="nav-link">
                {n.label}
              </a>
            ))}
          </nav>
          <a
            href="#contact"
            className="hidden md:inline-flex text-xs uppercase tracking-widest px-4 py-2 rounded-full border border-white/15 hover:border-purple hover:text-purple transition"
          >
            Get in touch
          </a>
          <button className="md:hidden text-sm" onClick={() => setOpen(!open)}>Menu</button>
        </div>
        {open && (
          <div className="md:hidden mt-2 rounded-2xl border border-white/10 p-4" style={{ background: "oklch(0.07 0.02 270 / 92%)", backdropFilter: "blur(20px)" }}>
            {NAV.map((n) => (
              <a key={n.href} href={n.href} onClick={() => setOpen(false)} className="nav-link block py-2">{n.label}</a>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      <div className="mx-auto max-w-6xl px-6 pt-32 pb-20 w-full">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">

          {/* ── Left: text content ── */}
          <div className="animate-fade-up">
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[0.95]">
              <span className="text-gradient-purple">Koushik</span>
              <br />
              <span className="text-foreground">Nagardona.</span>
            </h1>
            <p className="mt-8 text-2xl md:text-3xl font-display font-medium">
              Built different. <span style={{ color: "var(--purple-glow)" }}>Powered by data.</span>
            </p>
            <p className="mt-5 max-w-xl text-base md:text-lg text-muted-foreground">
              Data Science and AI student based in Dubai, turning raw data into real decisions.
            </p>
            <p className="mt-4 text-lg md:text-xl">
              <span className="text-muted-foreground">I work as a </span>
              <TypingRoles />
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="#projects"
                className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-medium text-white transition-all hover:scale-[1.02]"
                style={{
                  background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                  boxShadow: "0 10px 40px -10px #a855f7aa",
                }}
              >
                View My Work
                <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            <a
              href="/cv.pdf"
              target="_blank"
              rel="noreferrer"
              download="Koushik_Nagardona_CV.pdf"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-medium border border-white/20 hover:border-purple hover:bg-white/5 transition"
            >
              <Download className="h-4 w-4" /> Download CV
            </a>
            </div>
          </div>

          {/* ── Right: interactive 3-D data globe ── */}
          <div
            className="hidden md:block animate-fade-up"
            style={{ height: "520px", animationDelay: "150ms", paddingLeft: "8%" }}
          >
            <HeroVisual />
          </div>

        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="py-32 relative">
      <div className="mx-auto max-w-6xl px-6">

        {/* Section label */}
        <p className="reveal text-xs uppercase tracking-[0.3em] text-muted-foreground mb-16">
          01 — About
        </p>

        {/* Two-column editorial layout */}
        <div className="reveal grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-16 items-start mb-20">

          {/* Left: large heading + purple underline */}
          <div>
            <h2 className="text-5xl md:text-6xl xl:text-7xl font-bold leading-tight tracking-tight text-white">
              About<br />Me
            </h2>
            <div
              className="mt-5 h-[3px] w-24 rounded-full"
              style={{ background: "linear-gradient(90deg, #7c3aed, #a855f7 60%, transparent)" }}
            />
          </div>

          {/* Right: bio */}
          <p className="text-lg md:text-xl leading-relaxed text-muted-foreground">
            I am a Computer Science student at the University of Wollongong in Dubai, specializing
            in Big Data and AI. I build end-to-end data pipelines, machine learning models and
            analytical dashboards with a focus on solving real problems in the UAE market. I care
            about clean code, honest metrics and work that actually holds up.
          </p>
        </div>

        {/* Stat cards */}
        <div className="reveal grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { n: "1M+", l: "Rows Analyzed" },
            { n: "3",   l: "Projects Shipped" },
            { n: "2",   l: "Hackathons Led" },
          ].map((s) => (
            <div key={s.l} className="glass-card glass-card-hover rounded-2xl p-8">
              <div className="text-5xl font-display font-bold text-gradient-purple">{s.n}</div>
              <div className="mt-3 text-sm text-muted-foreground uppercase tracking-widest">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TechStack() {
  return (
    <section id="techstack" className="py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="reveal mb-14">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">02 — Skills</p>
          <h2 className="text-4xl md:text-5xl font-bold">
            Tech <span className="text-gradient-purple">Stack</span>.
          </h2>
        </div>

        <div className="reveal grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-3">
          {TECH_STACK.map((tech) => (
            <div
              key={tech.name}
              className="glass-card glass-card-hover flex flex-col items-center gap-3 rounded-2xl p-4 cursor-default"
            >
              {tech.whiteBg ? (
                /* White-background logos get a small white rounded tile so they don't bleed */
                <div className="w-[42px] h-[42px] rounded-lg bg-white flex items-center justify-center p-1.5">
                  <img
                    src={tech.src}
                    alt={tech.name}
                    loading="lazy"
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <img
                  src={tech.src}
                  alt={tech.name}
                  width={42}
                  height={42}
                  loading="lazy"
                  style={tech.invert ? { filter: "brightness(0) invert(1)" } : undefined}
                  className="w-[42px] h-[42px] object-contain"
                />
              )}
              <span className="text-[11px] text-center leading-tight text-muted-foreground">
                {tech.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Projects() {
  return (
    <section id="projects" className="py-32 relative">
      <div className="mx-auto max-w-6xl px-6">
        <div className="reveal flex items-end justify-between flex-wrap gap-6 mb-14">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">03 — Work</p>
            <h2 className="text-4xl md:text-5xl font-bold">Featured <span className="text-gradient-purple">Work</span>.</h2>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {PROJECTS.map((p, i) => (
            <a
              key={p.title}
              href="/projects"
              className="reveal glass-card glass-card-hover rounded-2xl flex flex-col group overflow-hidden"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              {/* Project image */}
              <div className="relative h-44 overflow-hidden flex-shrink-0">
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* gradient fade into card body */}
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(to bottom, transparent 40%, oklch(0.07 0.02 270) 100%)" }}
                />
                {/* index badge */}
                <div className="absolute top-3 left-3 text-xs uppercase tracking-widest text-muted-foreground px-2 py-1 rounded-full"
                  style={{ background: "oklch(0.06 0.02 270 / 80%)", backdropFilter: "blur(8px)", border: "1px solid oklch(1 0 0 / 12%)" }}>
                  0{i + 1}
                </div>
                <ArrowUpRight className="absolute top-3 right-3 h-4 w-4 text-muted-foreground group-hover:text-white transition" />
              </div>

              {/* Card body */}
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-lg font-semibold leading-snug">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground flex-1">{p.desc}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <span key={t} className="text-[11px] uppercase tracking-wider px-2.5 py-1 rounded-full border border-white/10 text-muted-foreground">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium" style={{ color: "var(--purple-glow)" }}>
                  View details <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className="reveal mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          {/* Dedicated projects page */}
          <a
            href="/projects"
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-full text-sm font-semibold text-white transition-all duration-300"
            style={{
              background: "oklch(0.09 0.025 272 / 90%)",
              border: "1px solid oklch(0.62 0.23 295 / 35%)",
              backdropFilter: "blur(12px)",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.boxShadow = "0 0 32px -6px #a855f7aa";
              el.style.borderColor = "oklch(0.62 0.23 295 / 70%)";
              el.style.background = "oklch(0.12 0.04 272 / 95%)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.boxShadow = "";
              el.style.borderColor = "oklch(0.62 0.23 295 / 35%)";
              el.style.background = "oklch(0.09 0.025 272 / 90%)";
            }}
          >
            <span>Explore all projects</span>
            <span
              className="inline-flex items-center justify-center w-7 h-7 rounded-full group-hover:translate-x-1 transition-transform duration-300"
              style={{ background: "linear-gradient(135deg,#7c3aed,#a855f7)" }}
            >
              <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
          </a>

          {/* GitHub fallback */}
          <a
            href="https://github.com/koushik-ngd"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-white/15 text-sm text-muted-foreground transition-all duration-200 hover:border-white/30 hover:text-white"
          >
            <Github className="h-4 w-4" /> View GitHub
          </a>
        </div>
      </div>
    </section>
  );
}

const EXPERIENCE = [
  {
    company:    "FlyRank AI",
    logo:       "/flyrank-logo.png",
    role:       "Machine Learning Intern",
    duration:   "July 2026 – August 2026",
    type:       "Internship",
    location:   "Remote",
    description: "", // add your description here when ready
    tags:       ["Machine Learning", "Python", "AI"],
  },
];

function Experience() {
  return (
    <section id="experience" className="py-32">
      <div className="mx-auto max-w-6xl px-6">

        <div className="reveal mb-14">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">04 — Experience</p>
          <h2 className="text-4xl md:text-5xl font-bold">
            Where I've <span className="text-gradient-purple">Worked</span>.
          </h2>
        </div>

        <div className="space-y-5">
          {EXPERIENCE.map((e, i) => (
            <div
              key={e.company}
              className="reveal glass-card glass-card-hover rounded-2xl p-7"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-6">

                {/* Logo */}
                <div
                  className="flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center overflow-hidden"
                  style={{ background: "oklch(0.06 0.02 270)", border: "1px solid oklch(1 0 0 / 10%)" }}
                >
                  <img
                    src={e.logo}
                    alt={`${e.company} logo`}
                    className="w-12 h-12 object-contain rounded-xl"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-white">{e.role}</h3>
                      <p className="text-base font-medium mt-0.5" style={{ color: "var(--purple-glow)" }}>
                        {e.company}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 text-right shrink-0">
                      <span
                        className="text-xs px-3 py-1 rounded-full"
                        style={{
                          background: "oklch(0.62 0.23 295 / 12%)",
                          color: "#c4b5fd",
                          border: "1px solid oklch(0.62 0.23 295 / 25%)",
                        }}
                      >
                        {e.type}
                      </span>
                      <span
                        className="text-xs px-3 py-1 rounded-full text-muted-foreground"
                        style={{ background: "oklch(0.08 0.02 270)", border: "1px solid oklch(1 0 0 / 10%)" }}
                      >
                        {e.location}
                      </span>
                    </div>
                  </div>

                  {/* Duration */}
                  <p className="text-sm text-muted-foreground mb-4 flex items-center gap-2">
                    <span
                      className="inline-block w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: "linear-gradient(135deg,#7c3aed,#a855f7)" }}
                    />
                    {e.duration}
                  </p>

                  {/* Description — empty for now */}
                  {e.description && (
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      {e.description}
                    </p>
                  )}

                  {/* Tags */}
                  {e.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {e.tags.map((t) => (
                        <span
                          key={t}
                          className="text-[11px] uppercase tracking-wider px-2.5 py-1 rounded-full border border-white/10 text-muted-foreground"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

function Blog() {
  // Duplicate posts for seamless infinite loop
  const loopPosts = [...POSTS, ...POSTS, ...POSTS, ...POSTS];

  return (
    <section id="blog" className="py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="reveal mb-14">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">05 — Writing</p>
          <h2 className="text-4xl md:text-5xl font-bold">From the <span className="text-gradient-purple">notebook</span>.</h2>
        </div>
      </div>

      {/* Full-bleed scroll track (breaks out of max-w container) */}
      <div
        className="blog-scroll-wrap"
        style={{ position: "relative", overflow: "hidden", cursor: "default" }}
      >
        {/* Left fade mask */}
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "120px", background: "linear-gradient(to right, #04030a 0%, transparent 100%)", zIndex: 2, pointerEvents: "none" }} />
        {/* Right fade mask */}
        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "120px", background: "linear-gradient(to left, #04030a 0%, transparent 100%)", zIndex: 2, pointerEvents: "none" }} />

        {/* Scrolling track */}
        <div
          className="blog-track"
          style={{ display: "flex", gap: "1.25rem", width: "max-content", padding: "0.5rem 0 1rem" }}
        >
          {loopPosts.map((p, i) => (
            <article
              key={i}
              style={{ width: "320px", flexShrink: 0 }}
              className="glass-card glass-card-hover rounded-2xl p-7 flex flex-col"
            >
              <div className="text-xs uppercase tracking-widest text-muted-foreground">{p.date}</div>
              <h3 className="mt-4 text-lg font-semibold leading-snug">{p.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground flex-1">{p.excerpt}</p>
              <a href="/blog" className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium" style={{ color: "var(--purple-glow)" }}>
                Read More <ArrowUpRight className="h-4 w-4" />
              </a>
            </article>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6">

        {/* Explore all posts CTA */}
        <div className="reveal flex justify-center mt-14">
          <a
            href="/blog"
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-full text-sm font-semibold text-white transition-all duration-300"
            style={{
              background: "oklch(0.09 0.025 272 / 90%)",
              border: "1px solid oklch(0.62 0.23 295 / 35%)",
              backdropFilter: "blur(12px)",
              boxShadow: "0 0 0 0 #a855f700",
              transition: "box-shadow 0.3s ease, border-color 0.3s ease, background 0.3s ease",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.boxShadow = "0 0 32px -6px #a855f7aa";
              el.style.borderColor = "oklch(0.62 0.23 295 / 70%)";
              el.style.background = "oklch(0.12 0.04 272 / 95%)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.boxShadow = "0 0 0 0 #a855f700";
              el.style.borderColor = "oklch(0.62 0.23 295 / 35%)";
              el.style.background = "oklch(0.09 0.025 272 / 90%)";
            }}
          >
            <span>Explore all posts</span>
            <span
              className="inline-flex items-center justify-center w-7 h-7 rounded-full transition-transform duration-300 group-hover:translate-x-1"
              style={{ background: "linear-gradient(135deg,#7c3aed,#a855f7)" }}
            >
              <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── Replace YOUR_FORM_ID below with the ID from https://formspree.io ────────
// Steps: 1) Go to formspree.io  2) Sign up free  3) "+ New Form"
//        4) Set email to koushik.ngd@gmail.com  5) Copy the ID from the endpoint URL
const FORMSPREE_ID = "YOUR_FORM_ID";

function Contact() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    const form = e.currentTarget;
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      if (res.ok) { setStatus("success"); form.reset(); }
      else setStatus("error");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="py-32 relative">
      <div className="mx-auto max-w-6xl px-6">
        <div className="reveal mb-14">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">06 — Contact</p>
          <h2 className="text-5xl md:text-7xl font-bold">Let's Build <span className="text-gradient-purple">Something</span>.</h2>
        </div>

        <div className="grid md:grid-cols-[1fr_320px] gap-10">
          <form className="reveal glass-card rounded-2xl p-8 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Name</label>
              <input name="name" type="text" required className="mt-2 w-full bg-transparent border-b border-white/15 py-3 outline-none focus:border-purple transition" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Email</label>
              <input name="email" type="email" required className="mt-2 w-full bg-transparent border-b border-white/15 py-3 outline-none focus:border-purple transition" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Message</label>
              <textarea name="message" rows={4} required className="mt-2 w-full bg-transparent border-b border-white/15 py-3 outline-none focus:border-purple transition resize-none" />
            </div>

            {/* Status feedback */}
            {status === "success" && (
              <p className="text-sm font-medium" style={{ color: "#4ade80" }}>
                ✓ Message sent! I'll get back to you soon.
              </p>
            )}
            {status === "error" && (
              <p className="text-sm font-medium" style={{ color: "#f87171" }}>
                Something went wrong. Try emailing me directly at koushik.ngd@gmail.com
              </p>
            )}

            <button
              type="submit"
              disabled={status === "loading" || status === "success"}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium text-white disabled:opacity-60 disabled:cursor-not-allowed transition-opacity"
              style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)", boxShadow: "0 10px 30px -10px #a855f7aa" }}
            >
              {status === "loading" ? "Sending…" : status === "success" ? "Sent ✓" : <>Send Message <ArrowUpRight className="h-4 w-4" /></>}
            </button>
          </form>

          <div className="reveal space-y-3">
            {[
              {
                logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",
                logoBg: "#ffffff",
                label: "GitHub",
                href: "https://github.com/koushik-ngd",
                sub: "koushik-ngd",
              },
              {
                logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg",
                logoBg: "transparent",
                label: "LinkedIn",
                href: "https://www.linkedin.com/in/koushikng/",
                sub: "Connect with me",
              },
              {
                logo: "https://cdn.simpleicons.org/gmail/EA4335",
                logoBg: "transparent",
                label: "Email",
                href: "mailto:koushik.ngd@gmail.com",
                sub: "koushik.ngd@gmail.com",
              },
            ].map(({ logo, logoBg, label, href, sub }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="glass-card glass-card-hover rounded-xl p-5 flex items-center gap-4 group"
              >
                <div
                  className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "linear-gradient(135deg,#7c3aed22,#a855f722)", border: "1px solid #a855f740" }}
                >
                  <img
                    src={logo}
                    alt={label}
                    width={26}
                    height={26}
                    style={{
                      objectFit: "contain",
                      background: logoBg !== "transparent" ? logoBg : undefined,
                      borderRadius: logoBg !== "transparent" ? "4px" : undefined,
                      padding: logoBg !== "transparent" ? "2px" : undefined,
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{label}</div>
                  <div className="text-xs text-muted-foreground truncate">{sub}</div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition flex-shrink-0" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/5 py-10">
      <div className="mx-auto max-w-6xl px-6 flex flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground">
        <div>© Koushik Nagardona 2026</div>
        <div className="font-display italic">Built different. Powered by data.</div>
        <div className="flex items-center gap-4">
          <a href="https://github.com/koushik-ngd" target="_blank" rel="noreferrer" className="hover:text-foreground transition"><Github className="h-4 w-4" /></a>
          <a href="https://www.linkedin.com/in/koushikng/" target="_blank" rel="noreferrer" className="hover:text-foreground transition"><Linkedin className="h-4 w-4" /></a>
          <a href="mailto:koushik.ngd@gmail.com" className="hover:text-foreground transition"><Mail className="h-4 w-4" /></a>
        </div>
      </div>
    </footer>
  );
}

export default function Portfolio() {
  const [intro, setIntro] = useState(true);
  useReveal();
  const mounted = useRef(false);
  useEffect(() => { mounted.current = true; }, []);

  return (
    <div className="relative">
      {intro && <IntroOverlay onDone={() => setIntro(false)} />}
      <Navbar />
      <main>
        <Hero />
        <About />
        <TechStack />
        <Projects />
        <Experience />
        <Blog />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
