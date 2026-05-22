import Link from "next/link";
import Image from "next/image";
import Layout from "../components/Layout";
import Reveal from "../components/Reveal";
import Counter from "../components/Counter";

const services = [
  {
    icon: "S",
    accent: "violet",
    title: "Strategy & Go-To-Market",
    body: "We architect market entry, positioning, and channel plans that align brand and revenue from day one."
  },
  {
    icon: "C",
    accent: "pink",
    title: "Creative & Design Studio",
    body: "Design, copy, and campaigns that look bold and convert faster across every single touchpoint."
  },
  {
    icon: "P",
    accent: "aqua",
    title: "Performance Marketing",
    body: "Data-driven paid media engineered around CAC, ROAS, and the metrics that actually move growth."
  },
  {
    icon: "F",
    accent: "amber",
    title: "Funnels & Automation",
    body: "Lead systems, CRM, and AI workflows working together to scale visibility and demand on autopilot."
  },
  {
    icon: "B",
    accent: "lime",
    title: "Brand & Positioning",
    body: "Clear, consistent, credible brands — narrative, voice, and identity built to be unforgettable."
  },
  {
    icon: "W",
    accent: "violet",
    title: "Web & Conversion",
    body: "Conversion-led websites and landing pages that turn attention into qualified pipeline."
  }
];

const stats = [
  { to: 120, suffix: "+", label: "Launches & campaigns shipped" },
  { to: 4.8, suffix: "x", decimals: 1, label: "Average return on ad spend" },
  { to: 9, suffix: "", label: "Core service tracks" },
  { to: 3, suffix: "", label: "Cities across India & UAE" }
];

const steps = [
  { title: "Discover", body: "Research, audits, and positioning. We map the market and find the angle." },
  { title: "Design", body: "Strategy into systems — brand, funnels, creative, and channel architecture." },
  { title: "Deploy", body: "Launch campaigns and automation with sharp creative and tight tracking." },
  { title: "Scale", body: "Optimize against real metrics and compound what works, month over month." }
];

const testimonials = [
  {
    quote:
      "Imagicity rebuilt our entire growth engine in eight weeks. Demo requests doubled and our CAC dropped by a third.",
    name: "Ananya Rao",
    role: "Founder, Wavelane",
    initials: "AR"
  },
  {
    quote:
      "The most strategic creative team we've worked with. They think like operators, not just designers.",
    name: "Karan Mehta",
    role: "CMO, Nova Health",
    initials: "KM"
  },
  {
    quote:
      "From positioning to paid media, everything finally works as one system. Our pipeline has never been healthier.",
    name: "Sara Iqbal",
    role: "VP Growth, Orbito Labs",
    initials: "SI"
  }
];

const marquee = [
  "Brand Strategy",
  "Performance Media",
  "Creative Studio",
  "Go-To-Market",
  "Marketing Automation",
  "Content Systems",
  "Conversion Design",
  "AI Workflows"
];

export default function HomePage() {
  return (
    <Layout>
      {/* HERO */}
      <section className="hero">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-copy">
              <Reveal>
                <span className="eyebrow">Creative Marketing Agency</span>
              </Reveal>
              <Reveal delay={80}>
                <h1 className="h-display">
                  The all-in-one{" "}
                  <span className="gradient-text">marketing engine</span> for
                  bold brands.
                </h1>
              </Reveal>
              <Reveal delay={160}>
                <p className="hero-sub">
                  Imagicity blends strategy, storytelling, and performance
                  marketing to help startups and institutions launch, grow, and
                  scale with confidence.
                </p>
              </Reveal>
              <Reveal delay={240}>
                <div className="hero-actions">
                  <Link href="/contact" className="btn btn-glow">
                    Start a project →
                  </Link>
                  <Link href="/services" className="btn btn-outline">
                    Explore services
                  </Link>
                </div>
              </Reveal>
              <Reveal delay={320}>
                <div className="hero-chips">
                  <span className="chip">Strategy-led</span>
                  <span className="chip">Built for performance</span>
                  <span className="chip">Systems, not one-offs</span>
                </div>
              </Reveal>
            </div>

            <Reveal variant="scale" delay={200} className="hero-visual">
              <Image
                src="/ICONS/80795w00.png"
                alt="Imagicity brand mark"
                width={460}
                height={460}
                className="hero-blob"
                priority
              />
              <div className="hero-float one">
                <span className="big gradient-text">4.8x</span>
                <span className="small">Avg. return on ad spend</span>
              </div>
              <div className="hero-float two">
                <span className="big gradient-text">120+</span>
                <span className="small">Campaigns launched</span>
              </div>
              <div className="hero-float three">
                <span className="big gradient-text">9</span>
                <span className="small">Service tracks</span>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[...marquee, ...marquee].map((item, index) => (
            <span className="marquee-item" key={`${item}-${index}`}>
              {item}
            </span>
          ))}
        </div>
      </div>

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

      {/* SERVICES */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <Reveal>
              <span className="eyebrow">What we do</span>
            </Reveal>
            <Reveal delay={80}>
              <h2>Everything your brand needs to grow, under one roof.</h2>
            </Reveal>
            <Reveal delay={140}>
              <p>
                Nine integrated service tracks — built to work as one connected
                system instead of disconnected projects.
              </p>
            </Reveal>
          </div>

          <div className="grid grid-3">
            {services.map((service, index) => (
              <Reveal
                key={service.title}
                delay={(index % 3) * 100}
                className="card"
              >
                <div className={`card-icon ${service.accent}`}>
                  {service.icon}
                </div>
                <h3>{service.title}</h3>
                <p>{service.body}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={150} style={{ marginTop: 36 }}>
            <Link href="/services" className="btn btn-outline">
              View all services →
            </Link>
          </Reveal>
        </div>
      </section>

      {/* FEATURE SPLIT */}
      <section className="section">
        <div className="container">
          <div className="split">
            <Reveal variant="left" className="split-content">
              <span className="eyebrow">Why Imagicity</span>
              <h2 className="h-display" style={{ fontSize: "clamp(2rem,4vw,3rem)", margin: "18px 0" }}>
                We design marketing <span className="gradient-text">systems</span>, not one-off deliverables.
              </h2>
              <p style={{ color: "var(--muted)" }}>
                Most agencies hand you assets. We hand you an engine — strategy,
                creative, channels, and automation working together so growth is
                repeatable and measurable.
              </p>
              <ul className="split-list">
                {[
                  {
                    h: "Strategy first",
                    p: "Every creative decision is rooted in research, positioning, and the metrics that matter."
                  },
                  {
                    h: "Creative built to convert",
                    p: "Bold storytelling engineered for performance across every channel and format."
                  },
                  {
                    h: "Compounding growth",
                    p: "Funnels, automation, and analytics that make your results stack month over month."
                  }
                ].map((item) => (
                  <li key={item.h}>
                    <span className="tick">✓</span>
                    <div>
                      <h4>{item.h}</h4>
                      <p>{item.p}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal variant="right" className="split-visual">
              <Image
                src="/ICONS/8079500.png"
                alt="Concentric growth target"
                width={420}
                height={420}
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="section">
        <div className="container">
          <div className="section-head center">
            <Reveal>
              <span className="eyebrow">How we work</span>
            </Reveal>
            <Reveal delay={80}>
              <h2>A clear path from idea to momentum.</h2>
            </Reveal>
          </div>
          <div className="process-grid">
            {steps.map((step, index) => (
              <Reveal key={step.title} delay={index * 90} className="step">
                <div className="step-num">{String(index + 1).padStart(2, "0")}</div>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section">
        <div className="container">
          <div className="section-head center">
            <Reveal>
              <span className="eyebrow">Client love</span>
            </Reveal>
            <Reveal delay={80}>
              <h2>Brands grow louder with us.</h2>
            </Reveal>
          </div>
          <div className="grid grid-3">
            {testimonials.map((item, index) => (
              <Reveal key={item.name} delay={index * 100} className="quote-card">
                <div className="mark">“</div>
                <p>{item.quote}</p>
                <div className="quote-author">
                  <span className="quote-avatar">{item.initials}</span>
                  <div>
                    <div className="name">{item.name}</div>
                    <div className="role">{item.role}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section tight">
        <div className="container">
          <Reveal variant="scale" className="cta-band">
            <h2>Let's build the marketing system your brand deserves.</h2>
            <p>
              From strategy to execution, we deliver high-impact marketing that
              scales with you.
            </p>
            <div className="cta-actions">
              <Link href="/contact" className="btn btn-glow">
                Make a request →
              </Link>
              <Link href="/portfolio" className="btn btn-outline">
                See our work
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </Layout>
  );
}
