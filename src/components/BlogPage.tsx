import { ArrowUpRight, ArrowLeft, Calendar, Clock } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const ALL_POSTS = [
  {
    title: "How I Analyzed 1 Million Dubai Property Transactions",
    date: "March 12, 2026",
    readTime: "8 min read",
    category: "Data Engineering",
    excerpt:
      "A deep dive into the pipeline, the data quirks, and the ROI neighbourhoods that surprised me. From raw DLD exports to a fully queryable warehouse in 48 hours.",
    featured: true,
  },
  {
    title: "What the UAE Rental Market Data Actually Tells Us",
    date: "February 4, 2026",
    readTime: "6 min read",
    category: "Machine Learning",
    excerpt:
      "Sixteen years of rentals, one Random Forest, and the patterns landlords don't talk about. Spoiler: location is only half the story.",
    featured: false,
  },
  {
    title: "Why Explainability Matters in AI",
    date: "January 18, 2026",
    readTime: "5 min read",
    category: "AI & Ethics",
    excerpt:
      "Why SHAP isn't optional when your model approves or rejects someone's loan. A look at why black-box AI is a liability, not a feature.",
    featured: false,
  },
  {
    title: "Building an End-to-End ML Pipeline with Python and SQL",
    date: "December 22, 2025",
    readTime: "10 min read",
    category: "Data Engineering",
    excerpt:
      "How I wired pandas, SQLAlchemy, scikit-learn, and a PostgreSQL warehouse into a single reproducible pipeline that runs on a cron job every morning.",
    featured: false,
  },
  {
    title: "Power BI vs Tableau: A Data Analyst's Honest Take",
    date: "November 30, 2025",
    readTime: "7 min read",
    category: "Analytics",
    excerpt:
      "After building dashboards in both tools for real clients, here's what nobody in the vendor marketing actually tells you about performance, DAX, and team adoption.",
    featured: false,
  },
  {
    title: "My Hackathon Playbook: How We Led Two UAE Data Competitions",
    date: "October 15, 2025",
    readTime: "9 min read",
    category: "Career",
    excerpt:
      "The exact 48-hour framework we used — from problem framing to stakeholder pitch — that helped us lead two data hackathons at UOWD and claim top results.",
    featured: false,
  },
  {
    title: "Getting Comfortable with Pandas: Beyond the Basics",
    date: "September 8, 2025",
    readTime: "6 min read",
    category: "Python",
    excerpt:
      "GroupBy chains, memory-efficient dtypes, and vectorised operations that make a real difference once your DataFrames hit 10 million rows.",
    featured: false,
  },
  {
    title: "TensorFlow vs PyTorch: Which Should You Learn First?",
    date: "August 3, 2025",
    readTime: "5 min read",
    category: "Machine Learning",
    excerpt:
      "An honest comparison from someone who has shipped models in both. The answer depends entirely on where you want to end up — research lab or production API.",
    featured: false,
  },
];

const CATEGORIES = ["All", ...Array.from(new Set(ALL_POSTS.map((p) => p.category)))];

const CATEGORY_COLORS: Record<string, string> = {
  "Data Engineering": "#7c3aed",
  "Machine Learning": "#2563eb",
  "AI & Ethics":      "#0891b2",
  "Analytics":        "#059669",
  "Career":           "#d97706",
  "Python":           "#16a34a",
};

function categoryColor(cat: string) {
  return CATEGORY_COLORS[cat] ?? "#7c3aed";
}

export default function BlogPage() {
  const [active, setActive] = useState("All");
  const [search, setSearch]   = useState("");
  const revealRefs = useRef<HTMLElement[]>([]);

  // Scroll-reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) (e.target as HTMLElement).classList.add("visible"); }),
      { threshold: 0.1 }
    );
    revealRefs.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const addReveal = (el: HTMLElement | null) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el);
  };

  const filtered = ALL_POSTS.filter((p) => {
    const matchCat = active === "All" || p.category === active;
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
                        p.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const featured = filtered.find((p) => p.featured && active === "All" && search === "");
  const rest = featured ? filtered.filter((p) => !p.featured) : filtered;

  return (
    <div style={{ minHeight: "100vh", color: "#fff" }}>

      {/* ── Top bar ───────────────────────────────────────────── */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          padding: "0.75rem 1.5rem",
        }}
      >
        <div
          style={{
            maxWidth: "72rem",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "oklch(0.07 0.02 270 / 85%)",
            backdropFilter: "blur(20px)",
            borderRadius: "1rem",
            padding: "0.75rem 1.5rem",
            border: "1px solid oklch(1 0 0 / 10%)",
          }}
        >
          <a
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              fontSize: "0.85rem",
              color: "oklch(0.72 0.03 270)",
              transition: "color 0.2s",
              textDecoration: "none",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#c4b5fd")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "oklch(0.72 0.03 270)")}
          >
            <ArrowLeft size={15} />
            Back to portfolio
          </a>

          <span
            style={{
              fontSize: "0.7rem",
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              color: "oklch(0.55 0.04 270)",
            }}
          >
            Koushik Nagardona — Blog
          </span>
        </div>
      </header>

      {/* ── Page hero ─────────────────────────────────────────── */}
      <section style={{ paddingTop: "8rem", paddingBottom: "4rem", textAlign: "center" }}>
        <div style={{ maxWidth: "72rem", margin: "0 auto", padding: "0 1.5rem" }}>
          <p
            ref={addReveal}
            className="reveal"
            style={{
              fontSize: "0.65rem",
              textTransform: "uppercase",
              letterSpacing: "0.3em",
              color: "oklch(0.55 0.04 270)",
              marginBottom: "1rem",
            }}
          >
            04 — Writing
          </p>
          <h1
            ref={addReveal}
            className="reveal"
            style={{ fontSize: "clamp(2.8rem, 6vw, 5rem)", fontWeight: 800, lineHeight: 1.05, marginBottom: "1.25rem" }}
          >
            From the{" "}
            <span className="text-gradient-purple">notebook</span>.
          </h1>
          <p
            ref={addReveal}
            className="reveal"
            style={{ fontSize: "1.05rem", color: "oklch(0.65 0.03 270)", maxWidth: "36rem", margin: "0 auto 2.5rem" }}
          >
            Thoughts on data engineering, machine learning, and building things that actually work.
          </p>

          {/* Search bar */}
          <div
            ref={addReveal}
            className="reveal"
            style={{ display: "flex", justifyContent: "center", marginBottom: "2rem" }}
          >
            <input
              type="text"
              placeholder="Search posts…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                maxWidth: "28rem",
                background: "oklch(0.09 0.02 270 / 80%)",
                border: "1px solid oklch(1 0 0 / 12%)",
                borderRadius: "9999px",
                padding: "0.65rem 1.25rem",
                fontSize: "0.85rem",
                color: "#fff",
                outline: "none",
                backdropFilter: "blur(12px)",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#7c3aed")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "oklch(1 0 0 / 12%)")}
            />
          </div>

          {/* Category filters */}
          <div
            ref={addReveal}
            className="reveal"
            style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.5rem" }}
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                style={{
                  padding: "0.35rem 1rem",
                  borderRadius: "9999px",
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  cursor: "pointer",
                  border: "1px solid",
                  transition: "all 0.2s ease",
                  background: active === cat
                    ? "linear-gradient(135deg, #7c3aed, #a855f7)"
                    : "oklch(0.09 0.02 270 / 80%)",
                  borderColor: active === cat ? "transparent" : "oklch(1 0 0 / 12%)",
                  color: active === cat ? "#fff" : "oklch(0.65 0.03 270)",
                  boxShadow: active === cat ? "0 0 16px -4px #a855f7aa" : "none",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Posts grid ────────────────────────────────────────── */}
      <section style={{ paddingBottom: "6rem" }}>
        <div style={{ maxWidth: "72rem", margin: "0 auto", padding: "0 1.5rem" }}>

          {/* Featured post (full-width card) */}
          {featured && (
            <article
              ref={addReveal}
              className="reveal glass-card glass-card-hover"
              style={{
                borderRadius: "1.25rem",
                padding: "2.5rem",
                marginBottom: "2rem",
                display: "grid",
                gridTemplateColumns: "1fr auto",
                gap: "2rem",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                  <span
                    style={{
                      fontSize: "0.65rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.15em",
                      padding: "0.2rem 0.65rem",
                      borderRadius: "9999px",
                      background: `${categoryColor(featured.category)}22`,
                      color: categoryColor(featured.category),
                      border: `1px solid ${categoryColor(featured.category)}44`,
                    }}
                  >
                    {featured.category}
                  </span>
                  <span
                    style={{
                      fontSize: "0.65rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.15em",
                      padding: "0.2rem 0.65rem",
                      borderRadius: "9999px",
                      background: "oklch(0.62 0.23 295 / 15%)",
                      color: "#c4b5fd",
                      border: "1px solid oklch(0.62 0.23 295 / 30%)",
                    }}
                  >
                    Featured
                  </span>
                </div>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.75rem", lineHeight: 1.3 }}>
                  {featured.title}
                </h2>
                <p style={{ color: "oklch(0.65 0.03 270)", fontSize: "0.95rem", marginBottom: "1.25rem", maxWidth: "48rem" }}>
                  {featured.excerpt}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", fontSize: "0.75rem", color: "oklch(0.55 0.03 270)" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    <Calendar size={12} /> {featured.date}
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    <Clock size={12} /> {featured.readTime}
                  </span>
                </div>
              </div>
              <a
                href="#"
                style={{
                  flexShrink: 0,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.7rem 1.5rem",
                  borderRadius: "9999px",
                  background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                  color: "#fff",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  textDecoration: "none",
                  boxShadow: "0 8px 24px -6px #a855f7bb",
                  transition: "transform 0.15s ease, box-shadow 0.15s ease",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1.04)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
              >
                Read post <ArrowUpRight size={14} />
              </a>
            </article>
          )}

          {/* Regular posts grid */}
          {rest.length > 0 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "1.25rem",
              }}
            >
              {rest.map((p, i) => (
                <article
                  key={p.title}
                  ref={addReveal}
                  className="reveal glass-card glass-card-hover"
                  style={{
                    borderRadius: "1.25rem",
                    padding: "1.75rem",
                    display: "flex",
                    flexDirection: "column",
                    animationDelay: `${i * 60}ms`,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                    <span
                      style={{
                        fontSize: "0.62rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.15em",
                        padding: "0.18rem 0.6rem",
                        borderRadius: "9999px",
                        background: `${categoryColor(p.category)}22`,
                        color: categoryColor(p.category),
                        border: `1px solid ${categoryColor(p.category)}44`,
                      }}
                    >
                      {p.category}
                    </span>
                    <span style={{ fontSize: "0.65rem", color: "oklch(0.5 0.03 270)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                      <Clock size={11} /> {p.readTime}
                    </span>
                  </div>

                  <h3 style={{ fontSize: "1rem", fontWeight: 600, lineHeight: 1.4, marginBottom: "0.65rem" }}>
                    {p.title}
                  </h3>
                  <p style={{ fontSize: "0.82rem", color: "oklch(0.62 0.03 270)", lineHeight: 1.6, flex: 1 }}>
                    {p.excerpt}
                  </p>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "1.25rem" }}>
                    <span style={{ fontSize: "0.68rem", color: "oklch(0.5 0.03 270)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                      <Calendar size={11} /> {p.date}
                    </span>
                    <a
                      href="#"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.3rem",
                        fontSize: "0.78rem",
                        fontWeight: 600,
                        color: "#a855f7",
                        textDecoration: "none",
                        transition: "color 0.2s, gap 0.2s",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = "#c4b5fd"; e.currentTarget.style.gap = "0.5rem"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = "#a855f7"; e.currentTarget.style.gap = "0.3rem"; }}
                    >
                      Read more <ArrowUpRight size={13} />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "4rem 0", color: "oklch(0.55 0.03 270)" }}>
              No posts match your search.
            </div>
          )}
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────── */}
      <footer style={{ borderTop: "1px solid oklch(1 0 0 / 8%)", padding: "2rem 1.5rem", textAlign: "center" }}>
        <p style={{ fontSize: "0.78rem", color: "oklch(0.45 0.02 270)" }}>
          © {new Date().getFullYear()} Koushik Nagardona ·{" "}
          <a href="/" style={{ color: "#a855f7", textDecoration: "none" }}>
            Back to portfolio
          </a>
        </p>
      </footer>
    </div>
  );
}
