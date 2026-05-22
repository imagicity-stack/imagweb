import Link from "next/link";
import Layout from "../components/Layout";
import Reveal from "../components/Reveal";
import Icon from "../components/Icon";
import { serviceCategories, getServiceMap } from "../lib/services";

export default function ServicesPage() {
  const map = getServiceMap();

  return (
    <Layout
      title="Services"
      description="Structured, strategy-led marketing services designed to help startups, institutions, and growing businesses build strong brands, acquire customers, and scale sustainably."
    >
      <section className="hero-compact">
        <div className="container">
          <Reveal>
            <span className="eyebrow">Our core services</span>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="h-display">
              Systems built to{" "}
              <span className="gradient-text">launch, scale, and lead</span>.
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p>
              Ten focused service tracks, organized into four clear pillars.
              Start with one or combine them into a connected growth system —
              tap any service to see exactly what's included.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section tight">
        <div className="container svc-categories">
          {serviceCategories.map((category, catIndex) => (
            <div className="svc-category" key={category.title}>
              <Reveal className="svc-cat-head">
                <span className="svc-cat-index">
                  {String(catIndex + 1).padStart(2, "0")}
                </span>
                <div>
                  <h2>{category.title}</h2>
                  <p>{category.blurb}</p>
                </div>
              </Reveal>

              <div className="grid grid-3 svc-cat-grid">
                {category.slugs.map((slug, index) => {
                  const service = map[slug];
                  if (!service) return null;
                  return (
                    <Reveal
                      key={slug}
                      delay={(index % 3) * 90}
                      as={Link}
                      href={`/services/${slug}`}
                      className="card svc-card"
                    >
                      <div className={`card-icon ${service.accent}`}>
                        <Icon name={service.icon} />
                      </div>
                      <h3>{service.title}</h3>
                      <p>{service.tagline}</p>
                      <ul className="svc-card-tags">
                        {service.offerings.slice(0, 3).map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                      <span className="svc-explore">
                        Explore service <span className="arrow">→</span>
                      </span>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section tight">
        <div className="container">
          <Reveal variant="scale" className="cta-band">
            <h2>Not sure where to start?</h2>
            <p>
              Tell us your goals and we'll recommend the exact mix of services to
              get you there — fast.
            </p>
            <div className="cta-actions">
              <Link href="/contact" className="btn btn-glow">
                Get a recommendation →
              </Link>
              <Link href="/portfolio" className="btn btn-outline">
                See the results
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </Layout>
  );
}
