import Link from "next/link";
import Layout from "../../components/Layout";
import Reveal from "../../components/Reveal";
import { services, getServiceBySlug } from "../../lib/services";

export default function ServiceDetailPage({ service, related }) {
  return (
    <Layout title={service.short} description={service.summary}>
      <section className="hero-compact svc-detail-hero">
        <div className="container">
          <Reveal>
            <Link href="/services" className="svc-back">
              ← All services
            </Link>
          </Reveal>
          <Reveal delay={60}>
            <span className={`badge ${service.accent}`}>
              Track {service.number}
            </span>
          </Reveal>
          <Reveal delay={120}>
            <h1 className="h-display">{service.title}</h1>
          </Reveal>
          <Reveal delay={180}>
            <p>{service.summary}</p>
          </Reveal>
          <Reveal delay={240}>
            <div className="cta-actions" style={{ justifyContent: "center" }}>
              <Link href="/contact" className="btn btn-glow">
                Start with this service →
              </Link>
              <Link href="/portfolio" className="btn btn-outline">
                See results
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section tight">
        <div className="container">
          <div className="svc-detail-layout">
            <Reveal variant="left">
              <div className="section-head" style={{ marginBottom: 26 }}>
                <span className="eyebrow">What's included</span>
                <h2 style={{ fontSize: "clamp(1.7rem,3vw,2.4rem)" }}>
                  Everything you get in this track
                </h2>
              </div>
              <ul className="include-grid">
                {service.offerings.map((item) => (
                  <li key={item}>
                    <span className="tick">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal variant="right" className="svc-aside">
              <div className="svc-aside-card">
                <h4>Ideal for</h4>
                <p>{service.idealFor}</p>
              </div>
              <div className="svc-aside-card">
                <h4>Pairs well with</h4>
                <div className="svc-aside-links">
                  {related.map((item) => (
                    <Link key={item.slug} href={`/services/${item.slug}`}>
                      {item.short} →
                    </Link>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section tight">
        <div className="container">
          <div className="section-head center">
            <Reveal>
              <span className="eyebrow">Outcomes</span>
            </Reveal>
            <Reveal delay={80}>
              <h2>What you can expect</h2>
            </Reveal>
          </div>
          <div className="grid grid-3">
            {service.outcomes.map((outcome, index) => (
              <Reveal key={outcome} delay={index * 90} className="card">
                <div className={`card-icon ${service.accent}`}>
                  {String(index + 1).padStart(2, "0")}
                </div>
                <p style={{ color: "rgba(244,241,255,0.92)", fontSize: "1.05rem" }}>
                  {outcome}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section tight">
        <div className="container">
          <Reveal variant="scale" className="cta-band">
            <h2>Ready to put {service.short} to work?</h2>
            <p>
              Tell us about your goals and we'll shape this into a plan built
              around your brand and market.
            </p>
            <div className="cta-actions">
              <Link href="/contact" className="btn btn-glow">
                Make a request →
              </Link>
              <Link href="/services" className="btn btn-outline">
                Browse all services
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </Layout>
  );
}

export async function getStaticPaths() {
  return {
    paths: services.map((service) => ({ params: { slug: service.slug } })),
    fallback: false
  };
}

export async function getStaticProps({ params }) {
  const service = getServiceBySlug(params.slug);
  if (!service) {
    return { notFound: true };
  }
  const related = services
    .filter((item) => item.slug !== service.slug)
    .slice(0, 3)
    .map(({ slug, short }) => ({ slug, short }));

  return { props: { service, related } };
}
