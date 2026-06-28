import { ArrowLeft, Calendar } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// ─── Data model ───────────────────────────────────────────────────────────────
type Post = {
  title:    string;
  date:     string;
  category: string;
  featured: boolean;
  images:   string[];
  content:  string[];
  tags:     string[];
};

const ALL_POSTS: Post[] = [
  {
    title:    "What a day honestly.",
    date:     "June 2026",
    category: "Events",
    featured: true,
    images:   [
      "/blog/post1-twe-venue.png",
      "/blog/post1-twe-building.png",
      "/blog/post1-campus-panel.png",
    ],
    content: [
      "Attended Campus to Corporate at the University of Birmingham Dubai today and I genuinely did not expect to enjoy it this much.",
      "Met people from Citi, Beehive Fintech, Lift Mart Elevators & Escalators LLC, Innovation City and CyberKnight, had real conversations, and walked away feeling like all the late nights building projects actually mean something.",
      "We also had some genuinely good workshops. Tarek Farran from Binance talked about financial literacy and blockchain in a way that actually made sense for once. Jason Rego from Sony talked about Kando, emotion in Japanese, and how Sony thinks about making people feel something through their products. Both were solid.",
      "The discussion panel at the end was a great way to close out the day.",
      "The networking part surprised me the most honestly. I've met some amazing people. I always assumed it would feel awkward and transactional but it really did not. When you actually care about what people are building the conversations just flow.",
      "If you are a student sitting at home convincing yourself these events are not worth it, they are. Just show up.",
      "Big thank you to Osama Damati and the +twe team for organising this one, it was genuinely worth the day.",
    ],
    tags: [
      "careerfair", "datascience", "artificialintelligence", "machinelearning",
      "python", "dubai", "uae", "campustocorporate", "studentlife", "career",
      "internship", "fintech", "blockchain", "tech", "growthmindset", "universityofbirmingham",
    ],
  },
];

const CATEGORIES = ["All", ...Array.from(new Set(ALL_POSTS.map((p) => p.category)))];

const CATEGORY_COLORS: Record<string, string> = {
  Events:           "#d97706",
  "Data Engineering": "#7c3aed",
  "Machine Learning": "#2563eb",
  "AI & Ethics":      "#0891b2",
  Analytics:          "#059669",
  Career:             "#d97706",
  Python:             "#16a34a",
};

function categoryColor(cat: string) {
  return CATEGORY_COLORS[cat] ?? "#7c3aed";
}

// ─── Photo gallery (mirrors LinkedIn 1/2/3-image layouts) ────────────────────
function ImageGallery({ images }: { images: string[] }) {
  if (images.length === 0) return null;

  const imgStyle = (h: string): React.CSSProperties => ({
    width: "100%", height: h, objectFit: "cover", display: "block",
  });

  if (images.length === 1) {
    return (
      <div style={{ borderRadius: "0.75rem", overflow: "hidden", marginBottom: "1rem" }}>
        <img src={images[0]} alt="" style={imgStyle("340px")} />
      </div>
    );
  }

  if (images.length === 2) {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3px", borderRadius: "0.75rem", overflow: "hidden", marginBottom: "1rem" }}>
        {images.map((src, i) => <img key={i} src={src} alt="" style={imgStyle("280px")} />)}
      </div>
    );
  }

  // 3 images: large on left, two stacked on right
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3px", borderRadius: "0.75rem", overflow: "hidden", marginBottom: "1rem" }}>
      <img src={images[0]} alt="" style={{ ...imgStyle("360px"), gridRow: "1 / 3" }} />
      <div style={{ display: "grid", gap: "3px" }}>
        {images.slice(1, 3).map((src, i) => <img key={i} src={src} alt="" style={imgStyle("178px")} />)}
      </div>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function BlogPage() {
  const [active,   setActive]   = useState("All");
  const [search,   setSearch]   = useState("");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const revealRefs = useRef<HTMLElement[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) (e.target as HTMLElement).classList.add("visible"); }),
      { threshold: 0.1 },
    );
    revealRefs.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const addReveal = (el: HTMLElement | null) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el);
  };

  const filtered = ALL_POSTS.filter((p) => {
    const matchCat    = active === "All" || p.category === active;
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
                        p.content.join(" ").toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const toggleExpand = (title: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(title) ? next.delete(title) : next.add(title);
      return next;
    });
  };

  const PREVIEW = 3; // paragraphs visible before "see more"

  return (
    <div style={{ minHeight: "100vh", color: "#fff" }}>

      {/* ── Top bar ───────────────────────────────────────────────────────── */}
      <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, padding: "0.75rem 1.5rem" }}>
        <div style={{
          maxWidth: "72rem", margin: "0 auto",
          display: "flex", alignItems: "center",
          background: "oklch(0.07 0.02 270 / 85%)", backdropFilter: "blur(20px)",
          borderRadius: "1rem", padding: "0.75rem 1.5rem",
          border: "1px solid oklch(1 0 0 / 10%)",
        }}>
          <a
            href="/"
            style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", fontSize: "0.85rem", color: "oklch(0.72 0.03 270)", textDecoration: "none", transition: "color 0.2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#c4b5fd")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "oklch(0.72 0.03 270)")}
          >
            <ArrowLeft size={15} /> Back to portfolio
          </a>
        </div>
      </header>

      {/* ── Page hero ─────────────────────────────────────────────────────── */}
      <section style={{ paddingTop: "8rem", paddingBottom: "3rem", textAlign: "center" }}>
        <div style={{ maxWidth: "52rem", margin: "0 auto", padding: "0 1.5rem" }}>
          <p ref={addReveal} className="reveal" style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.3em", color: "oklch(0.55 0.04 270)", marginBottom: "1rem" }}>
            04 — Writing
          </p>
          <h1 ref={addReveal} className="reveal" style={{ fontSize: "clamp(2.8rem, 6vw, 5rem)", fontWeight: 800, lineHeight: 1.05, marginBottom: "1.25rem" }}>
            From the{" "}<span className="text-gradient-purple">notebook</span>.
          </h1>

          {/* Search */}
          <div ref={addReveal} className="reveal" style={{ display: "flex", justifyContent: "center", marginBottom: "2rem" }}>
            <input
              type="text"
              placeholder="Search posts…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: "100%", maxWidth: "28rem", background: "oklch(0.09 0.02 270 / 80%)", border: "1px solid oklch(1 0 0 / 12%)", borderRadius: "9999px", padding: "0.65rem 1.25rem", fontSize: "0.85rem", color: "#fff", outline: "none", backdropFilter: "blur(12px)", transition: "border-color 0.2s" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#7c3aed")}
              onBlur={(e)  => (e.currentTarget.style.borderColor = "oklch(1 0 0 / 12%)")}
            />
          </div>

          {/* Category filters */}
          <div ref={addReveal} className="reveal" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.5rem" }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                style={{
                  padding: "0.35rem 1rem", borderRadius: "9999px", fontSize: "0.75rem", fontWeight: 500, cursor: "pointer", border: "1px solid", transition: "all 0.2s ease",
                  background:   active === cat ? "linear-gradient(135deg, #7c3aed, #a855f7)" : "oklch(0.09 0.02 270 / 80%)",
                  borderColor:  active === cat ? "transparent" : "oklch(1 0 0 / 12%)",
                  color:        active === cat ? "#fff" : "oklch(0.65 0.03 270)",
                  boxShadow:    active === cat ? "0 0 16px -4px #a855f7aa" : "none",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Posts feed ────────────────────────────────────────────────────── */}
      <section style={{ paddingBottom: "6rem" }}>
        <div style={{ maxWidth: "44rem", margin: "0 auto", padding: "0 1.5rem", display: "flex", flexDirection: "column", gap: "1.75rem" }}>

          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "4rem 0", color: "oklch(0.55 0.03 270)" }}>
              No posts match your search.
            </div>
          ) : (
            filtered.map((p, i) => {
              const isExpanded     = expanded.has(p.title);
              const showToggle     = p.content.length > PREVIEW;
              const visibleContent = isExpanded ? p.content : p.content.slice(0, PREVIEW);

              return (
                <article
                  key={p.title}
                  ref={addReveal}
                  className="reveal glass-card"
                  style={{ borderRadius: "1.25rem", overflow: "hidden", animationDelay: `${i * 80}ms` }}
                >
                  {/* ── Post header: avatar + date + category */}
                  <div style={{ padding: "1.5rem 1.5rem 1.1rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "linear-gradient(135deg, #7c3aed, #a855f7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 700, color: "#fff", flexShrink: 0, letterSpacing: "0.05em" }}>
                        KN
                      </div>
                      <div>
                        <p style={{ fontSize: "0.84rem", fontWeight: 600, color: "#e9d5ff", margin: 0, lineHeight: 1.3 }}>Koushik Nagardona</p>
                        <p style={{ fontSize: "0.7rem", color: "oklch(0.55 0.03 270)", margin: 0, display: "flex", alignItems: "center", gap: "0.3rem" }}>
                          <Calendar size={10} /> {p.date}
                        </p>
                      </div>
                    </div>
                    <span style={{ fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.15em", padding: "0.22rem 0.7rem", borderRadius: "9999px", background: `${categoryColor(p.category)}22`, color: categoryColor(p.category), border: `1px solid ${categoryColor(p.category)}44`, flexShrink: 0 }}>
                      {p.category}
                    </span>
                  </div>

                  {/* ── Post body text */}
                  <div style={{ padding: "0 1.5rem" }}>
                    {visibleContent.map((para, j) => (
                      <p key={j} style={{ fontSize: "0.92rem", color: "oklch(0.80 0.03 270)", lineHeight: 1.75, marginBottom: "0.8rem", margin: "0 0 0.8rem" }}>
                        {para}
                      </p>
                    ))}
                    {showToggle && (
                      <button
                        onClick={() => toggleExpand(p.title)}
                        style={{ background: "none", border: "none", color: "#a855f7", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", padding: "0.25rem 0 1rem", transition: "color 0.2s" }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#c4b5fd")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "#a855f7")}
                      >
                        {isExpanded ? "See less ↑" : "…see more ↓"}
                      </button>
                    )}
                  </div>

                  {/* ── Photo gallery */}
                  {p.images.length > 0 && (
                    <div style={{ padding: "0.5rem 1.5rem 0" }}>
                      <ImageGallery images={p.images} />
                    </div>
                  )}

                  {/* ── Hashtags */}
                  <div style={{ padding: "0.5rem 1.5rem 1.5rem", display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                    {p.tags.map((tag) => (
                      <span key={tag} style={{ fontSize: "0.68rem", color: "oklch(0.58 0.14 295)" }}>#{tag}</span>
                    ))}
                  </div>
                </article>
              );
            })
          )}
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer style={{ borderTop: "1px solid oklch(1 0 0 / 8%)", padding: "2rem 1.5rem", textAlign: "center" }}>
        <p style={{ fontSize: "0.78rem", color: "oklch(0.45 0.02 270)" }}>
          © {new Date().getFullYear()} Koushik Nagardona ·{" "}
          <a href="/" style={{ color: "#a855f7", textDecoration: "none" }}>Back to portfolio</a>
        </p>
      </footer>
    </div>
  );
}
