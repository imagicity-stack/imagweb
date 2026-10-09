import Layout from "../components/Layout";
import Reveal from "../components/Reveal";
import PageHero from "../components/PageHero";
import HoverList from "../components/HoverList";
import Marquee from "../components/Marquee";
import Process from "../components/Process";
import CtaBand from "../components/CtaBand";
import { Doodle } from "../components/Doodles";
import { serviceCategories, getServiceMap } from "../lib/services";
import { IMG, SERVICE_IMAGES } from "../lib/media";

const categoryIcons = ["bulb", "pencil", "megaphone", "bolt"];

const anchorFor = (title) =>
  title
    .toLowerCase()
    .replace(/&/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export default function ServicesPage() {
  const map = getServiceMap();

  return (
    <Layout
      title="Services"
      description="Structured, strategy-led marketing services designed to help startups, institutions, and growing businesses build strong brands, acquire customers, and scale sustainably."
    >
      <PageHero
        label="Our core services"
        lines={["Systems built", "to launch,"]}
        script="scale & lead."
        text="Ten focused service tracks, organised into four clear pillars. Start with one or combine them into a connected growth system. Pick any service to see exactly what's inside."
        badge="Strategy • Creative • Growth • Systems • "
        images={[
          { id: IMG.analytics, alt: "Performance analytics dashboard on a laptop", caption: "numbers don't lie" },
          { id: IMG.designerTablet, alt: "Designer sketching on a drawing tablet" },
          { id: IMG.socialPhone, alt: "Social media feed on a phone" }
        ]}
      />

      <Marquee
        items={["Strategy", "Brand", "Creative", "Content", "Performance", "Funnels", "Automation", "Web"]}
        tone="ink"
        duration={36}
      />

      <section className="ix-section ix-svc">
        <div className="container">
          {serviceCategories.map((category, catIndex) => (
            <div className="ix-svc-cat" id={anchorFor(category.title)} key={category.title}>
              <Reveal className="ix-svc-cat-head">
                <span className="ix-svc-cat-num">{String(catIndex + 1).padStart(2, "0")}</span>
                <div>
                  <h2 className="ix-h2">{category.title}</h2>
                  <p>{category.blurb}</p>
                </div>
                <Doodle name={categoryIcons[catIndex]} size={64} className="ix-svc-cat-icon" />
              </Reveal>
              <HoverList
                items={category.slugs
                  .map((slug) => map[slug])
                  .filter(Boolean)
                  .map((service) => ({
                    href: `/services/${service.slug}`,
                    number: service.number,
                    title: service.short,
                    tagline: service.tagline,
                    tags: service.offerings.slice(0, 2),
                    image: SERVICE_IMAGES[service.slug] || IMG.creativeDesk
                  }))}
              />
            </div>
          ))}
        </div>
      </section>

      <Process title="One process. Every track." />

      <CtaBand
        kicker="Not sure where"
        title="To start?"
        text="Tell us your goals and we'll recommend the exact mix of services to get you there, fast."
        primary={{ href: "/contact", label: "Get a recommendation" }}
        secondary={{ href: "/portfolio", label: "See the results" }}
      />
    </Layout>
  );
}
