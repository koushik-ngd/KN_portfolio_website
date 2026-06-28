import { ArrowLeft, ArrowUpRight, Github, ExternalLink } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// ─── Project data ────────────────────────────────────────────────────────────
// Drop your project screenshots into  public/projects/
//   e.g.  public/projects/dubai-re-roi.png
//         public/projects/dubai-rental.png
//         public/projects/explainable-ai.png
// The `image` field below maps directly to those paths.
// ─────────────────────────────────────────────────────────────────────────────
const PROJECTS = [
  {
    id: "dubai-re-roi",
    title: "Dubai Real Estate ROI Analysis",
    subtitle: "Property Analytics · 2026",
    image: "/projects/dubai-re-roi.jpg",
    description:
      "Processed over 1 million raw Dubai Land Department property transactions to identify the highest-ROI neighbourhoods in Dubai. Built a full ETL pipeline in Python, normalised the data into a PostgreSQL warehouse, and surfaced insights through an interactive Power BI dashboard. The analysis revealed several up-and-coming areas where rental yield outperformed established zones by 2–3×.",
    highlights: [
      "1M+ DLD transactions ingested and cleaned",
      "23 neighbourhoods ranked by gross rental yield",
      "Interactive Power BI dashboard for stakeholders",
      "Automated monthly refresh via scheduled pipeline",
    ],
    tags: ["Python", "Pandas", "SQL", "PostgreSQL", "Power BI", "Matplotlib"],
    github: "https://github.com/koushik-ngd/Dubai-RE-ROI-Analysis",
    metrics: [
      { label: "Rows Processed", value: "1M+" },
      { label: "Neighbourhoods", value: "23" },
      { label: "Pipeline Runtime", value: "< 4 min" },
    ],
    featured: true,
    status: "Completed",
    year: "2026",
  },
  {
    id: "dubai-rental",
    title: "Dubai Rental Market Trends & Price Prediction",
    subtitle: "Machine Learning · 2025",
    image: "/projects/dubai-rental.png",
    description:
      "Collected and analyzed 16 years of Dubai rental market data to uncover long-term pricing trends across property types and districts. Trained a Random Forest regression model to predict annual rent based on location, size, and amenity features. The model achieved an R² of 0.699 on held-out data, with SHAP values used to explain which features drive price most strongly in each sub-market.",
    highlights: [
      "16-year historical dataset across multiple districts",
      "Random Forest achieving R² of 0.699",
      "SHAP value analysis for feature importance",
      "Year-over-year trend visualisations per property type",
    ],
    tags: ["Python", "scikit-learn", "Pandas", "SHAP", "Matplotlib", "NumPy"],
    github: "https://github.com/koushik-ngd/Dubai-Rental-Trends",
    metrics: [
      { label: "R² Score", value: "0.699" },
      { label: "Years of Data", value: "16" },
      { label: "Features Used", value: "24" },
    ],
    featured: false,
    status: "Completed",
    year: "2025",
  },
  {
    id: "explainable-ai",
    title: "Explainable AI Loan Approval Agent",
    subtitle: "Responsible AI · 2025",
    image: "/projects/explainable-ai.png",
    description:
      "Built an end-to-end ML loan approval pipeline with a hard focus on transparency. A gradient-boosted classifier makes the initial decision, but every output is accompanied by a SHAP waterfall chart that breaks down exactly why an application was approved or rejected. The system was designed to meet emerging UAE financial-AI compliance requirements, where black-box decisions on credit are increasingly scrutinised.",
    highlights: [
      "Gradient boosted classifier with 94% accuracy",
      "SHAP waterfall charts for every prediction",
      "Fairness audit across demographic segments",
      "REST API wrapper for integration into banking apps",
    ],
    tags: ["Python", "XGBoost", "SHAP", "FastAPI", "scikit-learn", "Pandas"],
    github: "https://github.com/koushik-ngd/ExplainableAI-Loan-Approval-AI-Agent",
    metrics: [
      { label: "Accuracy", value: "94%" },
      { label: "SHAP Features", value: "18" },
      { label: "Bias Delta", value: "< 2%" },
    ],
    featured: false,
    status: "Completed",
    year: "2025",
  },
];

const TAG_COLORS: Record<string, string> = {
  Python:       "#3b82f6",
  Pandas:       "#10b981",
  SQL:          "#f59e0b",
  PostgreSQL:   "#6366f1",
  "Power BI":   "#f59e0b",
  Matplotlib:   "#ec4899",
  "scikit-learn": "#f97316",
  SHAP:         "#a855f7",
  NumPy:        "#06b6d4",
  XGBoost:      "#ef4444",
  FastAPI:      "#22c55e",
};

function tagColor(t: string) {
  return TAG_COLORS[t] ?? "#7c3aed";
}

// ─── Gradient placeholder shown when project image isn't uploaded yet ─────────
const PLACEHOLDER_GRADIENTS = [
  "linear-gradient(135deg,#1e1b3a 0%,#4c1d95 50%,#1e1b3a 100%)",
  "linear-gradient(135deg,#0f172a 0%,#1e3a5f 50%,#0f172a 100%)",
  "linear-gradient(135deg,#0f0e1c 0%,#312e81 50%,#0f0e1c 100%)",
];

function ProjectImage({ src, alt, idx }: { src: string; alt: string; idx: number }) {
  const [failed, setFailed] = useState(false);
  return failed ? (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: PLACEHOLDER_GRADIENTS[idx % PLACEHOLDER_GRADIENTS.length],
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
      }}
    >
      <div style={{ fontSize: "2rem", opacity: 0.25 }}>📸</div>
      <p style={{ fontSize: "0.7rem", color: "oklch(0.55 0.03 270)", textAlign: "center", padding: "0 1rem" }}>
        Drop your screenshot at<br />
        <code style={{ color: "#a855f7" }}>public/projects/{src.split("/").pop()}</code>
      </p>
    </div>
  ) : (
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
    />
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function ProjectsPage() {
  const revealRefs = useRef<HTMLElement[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) (e.target as HTMLElement).classList.add("visible");
        }),
      { threshold: 0.08 }
    );
    revealRefs.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const addReveal = (el: HTMLElement | null) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el);
  };

  const featured = PROJECTS.find((p) => p.featured)!;
  const rest = PROJECTS.filter((p) => !p.featured);

  return (
    <div style={{ minHeight: "100vh", color: "#fff" }}>

      {/* ── Top bar ─────────────────────────────────────────────── */}
      <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, padding: "0.75rem 1.5rem" }}>
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
            style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", fontSize: "0.85rem", color: "oklch(0.72 0.03 270)", transition: "color 0.2s", textDecoration: "none" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#c4b5fd")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "oklch(0.72 0.03 270)")}
          >
            <ArrowLeft size={15} /> Back to portfolio
          </a>
          <span style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "oklch(0.55 0.04 270)" }}>
            Koushik Nagardona — Projects
          </span>
        </div>
      </header>

      {/* ── Page hero ───────────────────────────────────────────── */}
      <section style={{ paddingTop: "8rem", paddingBottom: "3.5rem", textAlign: "center" }}>
        <div style={{ maxWidth: "72rem", margin: "0 auto", padding: "0 1.5rem" }}>
          <p ref={addReveal} className="reveal" style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.3em", color: "oklch(0.55 0.04 270)", marginBottom: "1rem" }}>
            03 — Work
          </p>
          <h1 ref={addReveal} className="reveal" style={{ fontSize: "clamp(2.8rem, 6vw, 5rem)", fontWeight: 800, lineHeight: 1.05, marginBottom: "1.25rem" }}>
            Featured <span className="text-gradient-purple">Work</span>.
          </h1>
          <p ref={addReveal} className="reveal" style={{ fontSize: "1.05rem", color: "oklch(0.65 0.03 270)", maxWidth: "36rem", margin: "0 auto" }}>
            End-to-end data projects across real-estate analytics, predictive modelling, and explainable AI.
          </p>
        </div>
      </section>

      {/* ── Featured project ────────────────────────────────────── */}
      <section style={{ paddingBottom: "3rem" }}>
        <div style={{ maxWidth: "72rem", margin: "0 auto", padding: "0 1.5rem" }}>
          <div
            ref={addReveal}
            className="reveal glass-card"
            style={{ borderRadius: "1.5rem", overflow: "hidden" }}
          >
            {/* Image */}
            <div style={{ height: "320px", position: "relative", overflow: "hidden" }}>
              <ProjectImage src={featured.image} alt={featured.title} idx={0} />
              {/* Overlay gradient */}
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, oklch(0.06 0.02 270) 0%, transparent 60%)" }} />
              {/* Badges */}
              <div style={{ position: "absolute", top: "1.25rem", left: "1.25rem", display: "flex", gap: "0.5rem" }}>
                <span style={{ fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.15em", padding: "0.22rem 0.7rem", borderRadius: "9999px", background: "oklch(0.62 0.23 295 / 20%)", color: "#c4b5fd", border: "1px solid oklch(0.62 0.23 295 / 35%)", backdropFilter: "blur(8px)" }}>
                  Featured
                </span>
                <span style={{ fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.15em", padding: "0.22rem 0.7rem", borderRadius: "9999px", background: "oklch(0.1 0.02 270 / 70%)", color: "oklch(0.72 0.03 270)", border: "1px solid oklch(1 0 0 / 15%)", backdropFilter: "blur(8px)" }}>
                  {featured.year}
                </span>
              </div>
            </div>

            {/* Content */}
            <div style={{ padding: "2rem 2.5rem 2.5rem", display: "grid", gridTemplateColumns: "1fr auto", gap: "2.5rem", alignItems: "start" }}>
              <div>
                <p style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "oklch(0.55 0.04 270)", marginBottom: "0.5rem" }}>
                  {featured.subtitle}
                </p>
                <h2 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "1rem", lineHeight: 1.2 }}>
                  {featured.title}
                </h2>
                <p style={{ fontSize: "0.92rem", color: "oklch(0.68 0.03 270)", lineHeight: 1.7, marginBottom: "1.5rem", maxWidth: "52rem" }}>
                  {featured.description}
                </p>

                {/* Highlights */}
                <ul style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: "0.5rem", marginBottom: "1.5rem", listStyle: "none", padding: 0 }}>
                  {featured.highlights.map((h) => (
                    <li key={h} style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", fontSize: "0.82rem", color: "oklch(0.72 0.03 270)" }}>
                      <span style={{ color: "#a855f7", flexShrink: 0, marginTop: "2px" }}>▸</span> {h}
                    </li>
                  ))}
                </ul>

                {/* Tags */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                  {featured.tags.map((t) => (
                    <span key={t} style={{ fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.12em", padding: "0.2rem 0.65rem", borderRadius: "9999px", background: `${tagColor(t)}18`, color: tagColor(t), border: `1px solid ${tagColor(t)}30` }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right column: metrics + CTA */}
              <div style={{ minWidth: "180px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
                  {featured.metrics.map((m) => (
                    <div key={m.label} style={{ background: "oklch(0.06 0.02 270 / 80%)", borderRadius: "0.75rem", padding: "0.9rem 1.1rem", border: "1px solid oklch(1 0 0 / 8%)", textAlign: "center" }}>
                      <p style={{ fontSize: "1.5rem", fontWeight: 800, background: "linear-gradient(135deg,#a855f7,#7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{m.value}</p>
                      <p style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "oklch(0.55 0.03 270)", marginTop: "0.2rem" }}>{m.label}</p>
                    </div>
                  ))}
                </div>
                <a
                  href={featured.github}
                  target="_blank"
                  rel="noreferrer"
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", padding: "0.75rem 1.25rem", borderRadius: "9999px", background: "linear-gradient(135deg,#7c3aed,#a855f7)", color: "#fff", fontSize: "0.82rem", fontWeight: 600, textDecoration: "none", boxShadow: "0 8px 24px -6px #a855f7aa", transition: "transform 0.15s ease" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.transform = "scale(1.04)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.transform = "scale(1)")}
                >
                  <Github size={15} /> View on GitHub
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Other projects ──────────────────────────────────────── */}
      <section style={{ paddingBottom: "6rem" }}>
        <div style={{ maxWidth: "72rem", margin: "0 auto", padding: "0 1.5rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: "1.5rem" }}>
            {rest.map((p, i) => (
              <div
                key={p.id}
                ref={addReveal}
                className="reveal glass-card"
                style={{ borderRadius: "1.25rem", overflow: "hidden", display: "flex", flexDirection: "column", animationDelay: `${i * 80}ms` }}
              >
                {/* Image */}
                <div style={{ height: "220px", position: "relative", overflow: "hidden", flexShrink: 0 }}>
                  <ProjectImage src={p.image} alt={p.title} idx={i + 1} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, oklch(0.06 0.02 270) 0%, transparent 55%)" }} />
                  <span style={{ position: "absolute", top: "1rem", left: "1rem", fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.15em", padding: "0.2rem 0.6rem", borderRadius: "9999px", background: "oklch(0.1 0.02 270 / 75%)", color: "oklch(0.72 0.03 270)", border: "1px solid oklch(1 0 0 / 15%)", backdropFilter: "blur(8px)" }}>
                    {p.year}
                  </span>
                </div>

                {/* Content */}
                <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", flex: 1 }}>
                  <p style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.18em", color: "oklch(0.55 0.04 270)", marginBottom: "0.4rem" }}>
                    {p.subtitle}
                  </p>
                  <h3 style={{ fontSize: "1.15rem", fontWeight: 700, lineHeight: 1.3, marginBottom: "0.75rem" }}>
                    {p.title}
                  </h3>
                  <p style={{ fontSize: "0.82rem", color: "oklch(0.65 0.03 270)", lineHeight: 1.65, marginBottom: "1rem", flex: 1 }}>
                    {p.description}
                  </p>

                  {/* Metrics row */}
                  <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
                    {p.metrics.map((m) => (
                      <div key={m.label} style={{ flex: 1, background: "oklch(0.06 0.02 270 / 80%)", borderRadius: "0.6rem", padding: "0.6rem 0.5rem", border: "1px solid oklch(1 0 0 / 8%)", textAlign: "center" }}>
                        <p style={{ fontSize: "1.05rem", fontWeight: 800, background: "linear-gradient(135deg,#a855f7,#7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{m.value}</p>
                        <p style={{ fontSize: "0.55rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "oklch(0.5 0.03 270)", marginTop: "0.15rem" }}>{m.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Tags */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginBottom: "1.25rem" }}>
                    {p.tags.map((t) => (
                      <span key={t} style={{ fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.1em", padding: "0.18rem 0.55rem", borderRadius: "9999px", background: `${tagColor(t)}18`, color: tagColor(t), border: `1px solid ${tagColor(t)}30` }}>
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: "0.75rem" }}>
                    <a
                      href={p.github}
                      target="_blank"
                      rel="noreferrer"
                      style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem", padding: "0.6rem", borderRadius: "0.65rem", background: "oklch(0.08 0.02 270)", border: "1px solid oklch(1 0 0 / 12%)", color: "oklch(0.72 0.03 270)", fontSize: "0.78rem", fontWeight: 600, textDecoration: "none", transition: "border-color 0.2s, color 0.2s" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#7c3aed55"; (e.currentTarget as HTMLElement).style.color = "#c4b5fd"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "oklch(1 0 0 / 12%)"; (e.currentTarget as HTMLElement).style.color = "oklch(0.72 0.03 270)"; }}
                    >
                      <Github size={14} /> GitHub
                    </a>
                    <a
                      href={p.github}
                      target="_blank"
                      rel="noreferrer"
                      style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem", padding: "0.6rem", borderRadius: "0.65rem", background: "linear-gradient(135deg,#7c3aed,#a855f7)", color: "#fff", fontSize: "0.78rem", fontWeight: 600, textDecoration: "none", boxShadow: "0 4px 16px -4px #a855f7aa", transition: "transform 0.15s ease" }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.transform = "scale(1.03)")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.transform = "scale(1)")}
                    >
                      View project <ExternalLink size={13} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* GitHub CTA */}
          <div ref={addReveal} className="reveal" style={{ textAlign: "center", marginTop: "3.5rem" }}>
            <a
              href="https://github.com/koushik-ngd"
              target="_blank"
              rel="noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.7rem 1.6rem", borderRadius: "9999px", border: "1px solid oklch(1 0 0 / 15%)", color: "oklch(0.72 0.03 270)", fontSize: "0.82rem", textDecoration: "none", transition: "border-color 0.2s, color 0.2s" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#7c3aed66"; (e.currentTarget as HTMLElement).style.color = "#c4b5fd"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "oklch(1 0 0 / 15%)"; (e.currentTarget as HTMLElement).style.color = "oklch(0.72 0.03 270)"; }}
            >
              <Github size={15} /> View all on GitHub <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer style={{ borderTop: "1px solid oklch(1 0 0 / 8%)", padding: "2rem 1.5rem", textAlign: "center" }}>
        <p style={{ fontSize: "0.78rem", color: "oklch(0.45 0.02 270)" }}>
          © {new Date().getFullYear()} Koushik Nagardona ·{" "}
          <a href="/" style={{ color: "#a855f7", textDecoration: "none" }}>Back to portfolio</a>
        </p>
      </footer>
    </div>
  );
}
