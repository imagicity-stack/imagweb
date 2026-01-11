import Link from "next/link";
import Layout from "../components/Layout";

const highlights = [
  {
    title: "Strategy-led growth",
    body: "We architect market entry, positioning, and channel plans that align brand and revenue."
  },
  {
    title: "Creative built for performance",
    body: "Design, copy, and campaigns that look bold and convert faster across every touchpoint."
  },
  {
    title: "Systems, not one-offs",
    body: "Funnels, automation, and analytics working together to scale visibility and demand."
  }
];

const trustedLogos = ["Nova Labs", "Wavelane", "Orbito", "Mira", "Lumen", "Astor"];

export default function HomePage() {
  return (
    <Layout>
      <section className="hero">
        <div className="hero-card">
          <span className="hero-label">Imagicity Creative Marketing Agency</span>
          <h1>The all-in-one marketing engine for bold brands.</h1>
          <p>
            Imagicity blends strategy, storytelling, and performance marketing to
            help startups and institutions launch, grow, and scale with
            confidence.
          </p>
          <div className="hero-actions">
            <Link href="/contact" className="button-primary">
              Make a Request
            </Link>
            <Link href="/services" className="button-secondary">
              Explore Services
            </Link>
          </div>
          <div className="logo-row">
            {trustedLogos.map((logo) => (
              <span key={logo} className="logo-chip">
                {logo}
              </span>
            ))}
          </div>
        </div>
        <div className="hero-stickers">
          <div className="sticker pink">Brand + Growth</div>
          <div className="sticker aqua">Demand Engine</div>
          <div className="sticker yellow">Launch Ready</div>
        </div>
      </section>

      <section className="section-card">
        <div className="section-header">
          <h2>What do we do</h2>
          <span className="section-tag">Services</span>
        </div>
        <div className="card-grid">
          {highlights.map((item) => (
            <article key={item.title} className="service-card">
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
        <Link href="/services" className="button-primary">
          View all services
        </Link>
      </section>

      <section className="cta-band">
        <div>
          <h2>Let’s build the marketing system your brand deserves.</h2>
          <p>
            From strategy to execution, we deliver high-impact marketing that
            scales with you.
          </p>
        </div>
        <Link href="/contact" className="button-secondary">
          Start a project
        </Link>
      </section>
    </Layout>
  );
}
