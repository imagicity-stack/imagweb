import Link from "next/link";
import Image from "next/image";
import Layout from "../components/Layout";
import Reveal from "../components/Reveal";
import Counter from "../components/Counter";

const values = [
  {
    icon: "01",
    accent: "violet",
    title: "Strategy first",
    body: "Every creative decision is rooted in research, positioning, and the metrics that matter to your business."
  },
  {
    icon: "02",
    accent: "pink",
    title: "Bold storytelling",
    body: "We blend culture, design, and performance marketing to make brands genuinely unforgettable."
  },
  {
    icon: "03",
    accent: "aqua",
    title: "Systemic growth",
    body: "Our work connects channels, automation, and teams so that growth becomes repeatable and predictable."
  },
  {
    icon: "04",
    accent: "amber",
    title: "Radical clarity",
    body: "No jargon, no vanity metrics. We report on what moves revenue and we tell you the truth."
  }
];

const stats = [
  { to: 120, suffix: "+", label: "Projects delivered" },
  { to: 40, suffix: "+", label: "Brands partnered" },
  { to: 4.8, suffix: "x", decimals: 1, label: "Avg. ROAS" },
  { to: 3, suffix: "", label: "Cities" }
];

const principles = [
  "We obsess over the customer journey, not just the deliverable.",
  "We build in public loops — test, learn, and iterate fast.",
  "We treat your budget like our own money.",
  "We connect brand and performance instead of choosing one."
];

export default function AboutPage() {
  return (
    <Layout
      title="About"
      description="Imagicity is a creative marketing agency built for ambitious founders, institutions, and growth teams who want clarity, consistency, and measurable momentum."
    >
      <section className="hero-compact">
        <div className="container">
          <Reveal>
            <span className="eyebrow">About Imagicity</span>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="h-display">
              We design marketing systems with{" "}
              <span className="gradient-text">soul</span>.
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p>
              Imagicity is a creative marketing agency built for ambitious
              founders, institutions, and growth teams who want clarity,
              consistency, and measurable momentum.
            </p>
          </Reveal>
        </div>
      </section>

      {/* STORY SPLIT */}
      <section className="section">
        <div className="container">
          <div className="split">
            <Reveal variant="left" className="split-content">
              <span className="eyebrow">Our story</span>
              <h2
                className="h-display"
                style={{ fontSize: "clamp(2rem,4vw,3rem)", margin: "18px 0" }}
              >
                Built by operators who got tired of marketing theatre.
              </h2>
              <p style={{ color: "var(--muted)", marginBottom: 16 }}>
                We started Imagicity because too many brands were sold pretty
                decks and disconnected campaigns. Strategy lived in one room,
                creative in another, and performance somewhere else entirely.
              </p>
              <p style={{ color: "var(--muted)" }}>
                So we built a different kind of agency — one where positioning,
                storytelling, paid media, and automation are designed as a
                single growth system. The result is marketing that's both
                beautiful and brutally effective.
              </p>
            </Reveal>
            <Reveal variant="right" className="split-visual">
              <Image
                src="/ICONS/80sa79500.png"
                alt="Imagicity creative swirl"
                width={420}
                height={420}
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="section tight">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <Reveal key={stat.label} delay={index * 90} className="stat">
                <div className="stat-num">
                  <Counter
                    to={stat.to}
                    suffix={stat.suffix}
                    decimals={stat.decimals || 0}
                  />
                </div>
                <div className="stat-label">{stat.label}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <Reveal>
              <span className="eyebrow">What we believe</span>
            </Reveal>
            <Reveal delay={80}>
              <h2>Principles that shape every engagement.</h2>
            </Reveal>
          </div>
          <div className="grid grid-2">
            {values.map((value, index) => (
              <Reveal key={value.title} delay={(index % 2) * 100} className="card">
                <div className={`card-icon ${value.accent}`}>{value.icon}</div>
                <h3>{value.title}</h3>
                <p>{value.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* APPROACH */}
      <section className="section">
        <div className="container">
          <div className="split">
            <Reveal variant="left" className="split-visual">
              <Image
                src="/ICONS/807950SD0.png"
                alt="Pattern grid"
                width={420}
                height={420}
              />
            </Reveal>
            <Reveal variant="right" className="split-content">
              <span className="eyebrow">How we think</span>
              <h2
                className="h-display"
                style={{ fontSize: "clamp(2rem,4vw,3rem)", margin: "18px 0" }}
              >
                Our approach in four honest rules.
              </h2>
              <ul className="split-list">
                {principles.map((principle) => (
                  <li key={principle}>
                    <span className="tick">✓</span>
                    <div>
                      <p style={{ color: "rgba(244,241,255,0.9)", fontSize: "1.02rem" }}>
                        {principle}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section tight">
        <div className="container">
          <Reveal variant="scale" className="cta-band">
            <h2>Want a team that treats your growth like its own?</h2>
            <p>Let's talk about where your brand is — and where it could be.</p>
            <div className="cta-actions">
              <Link href="/contact" className="btn btn-glow">
                Start a project →
              </Link>
              <Link href="/services" className="btn btn-outline">
                Explore services
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </Layout>
  );
}
