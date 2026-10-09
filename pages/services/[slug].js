import Link from "next/link";
import Layout from "../../components/Layout";
import Reveal from "../../components/Reveal";
import Img from "../../components/Img";
import Marquee from "../../components/Marquee";
import CtaBand from "../../components/CtaBand";
import { Burst, Doodle, Scribble, Sparkle } from "../../components/Doodles";
import { services, getServiceBySlug } from "../../lib/services";
import { IMG, SERVICE_IMAGES } from "../../lib/media";

export default function ServiceDetailPage({ service, related }) {
  const image = SERVICE_IMAGES[service.slug] || IMG.creativeDesk;

  return (
    <Layout title={service.short} description={service.summary}>
      <section className="ix-sd-hero">
        <div className="container ix-sd-grid">
          <div className="ix-sd-copy">
            <Link href="/services" className="ix-back ix-hero-in" style={{ "--hd": "0ms" }}>
              <span aria-hidden="true">←</span> All services
            </Link>
            <span className="ix-sticker ix-hero-in" style={{ "--hd": "60ms" }}>
              Track {service.number}
            </span>
            <h1 className="ix-sd-title">
              <span className="ix-hl">
                <span className="ix-hl-in" style={{ "--hd": "120ms" }}>
                  {service.title}
                </span>
              </span>
            </h1>
            <p className="ix-script ix-sd-tagline ix-hero-in" style={{ "--hd": "260ms" }}>
              {service.tagline}
            </p>
            <p className="ix-hero-sub ix-hero-in" style={{ "--hd": "340ms" }}>
              {service.summary}
            </p>
            <div className="ix-hero-actions ix-hero-in" style={{ "--hd": "440ms" }}>
              <Link href="/contact" className="ix-btn ix-btn-ink" data-magnetic>
                Start with this service <span className="ix-arrow">→</span>
              </Link>
              <Link href="/portfolio" className="ix-link-under">
                See results
              </Link>
            </div>
          </div>
          <div className="ix-sd-art ix-hero-in" style={{ "--hd": "200ms" }}>
            <span className="ix-sd-tri" aria-hidden="true" />
            <figure className="ix-sd-photo">
              <Img id={image} alt={`${service.short} at Imagicity`} width={760} ratio={1.05} priority sizes="(max-width: 980px) 90vw, 42vw" />
            </figure>
            <Burst size={130} className="ix-sd-burst" color="#ED2041" />
            <Doodle name="star" size={60} className="ix-sd-star" />
          </div>
        </div>
      </section>

      <Marquee items={service.offerings} tone="yellow" duration={45} tilt={-1.5} />

      <section className="ix-section ix-sd-body">
        <div className="container ix-sd-layout">
          <Reveal variant="left">
            <span className="ix-label">What&apos;s included</span>
            <h2 className="ix-h2">
              Everything you get <span className="ix-script is-red">in this track.</span>
            </h2>
            <Scribble className="ix-sd-scribble" color="#111" />
            <ul className="ix-checks">
              {service.offerings.map((item, index) => (
                <li key={item} style={{ "--ci": index }}>
                  <span className="ix-check" aria-hidden="true">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal variant="right" className="ix-sd-aside">
            <div className="ix-note tone-yellow is-1">
              <span className="ix-note-pin" aria-hidden="true" />
              <h3>Ideal for</h3>
              <p>{service.idealFor}</p>
            </div>
            <div className="ix-sd-pairs">
              <h3>Pairs well with</h3>
              {related.map((item) => (
                <Link key={item.slug} href={`/services/${item.slug}`} className="ix-sd-pair">
                  <span className="ix-sd-pair-img">
                    <Img id={SERVICE_IMAGES[item.slug] || IMG.creativeDesk} alt="" width={160} ratio={1} sizes="64px" />
                  </span>
                  <span>{item.short}</span>
                  <span className="ix-arrow" aria-hidden="true">→</span>
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="ix-section ix-outcomes">
        <div className="container">
          <Reveal className="ix-head is-center">
            <span className="ix-label">Outcomes</span>
            <h2 className="ix-h2">What you can expect</h2>
          </Reveal>
          <div className="ix-outcome-grid">
            {service.outcomes.map((outcome, index) => (
              <Reveal key={outcome} delay={index * 110} variant="pop" className="ix-outcome-wrap">
                <article className={`ix-outcome is-${index}`} data-tilt>
                  <span className="ix-outcome-num">{String(index + 1).padStart(2, "0")}</span>
                  <p>{outcome}</p>
                  <Sparkle size={30} className="ix-outcome-spark" color={index === 1 ? "#111" : "#FAE80C"} />
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        kicker="Ready to put"
        title={`${service.short} to work?`}
        text="Tell us about your goals and we'll shape this into a plan built around your brand and market."
        primary={{ href: "/contact", label: "Make a request" }}
        secondary={{ href: "/services", label: "Browse all services" }}
      />
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
  // Suggest neighbouring tracks rather than always the first three.
  const index = services.findIndex((item) => item.slug === service.slug);
  const related = [1, 2, 3]
    .map((step) => services[(index + step) % services.length])
    .map(({ slug, short }) => ({ slug, short }));

  return { props: { service, related } };
}
