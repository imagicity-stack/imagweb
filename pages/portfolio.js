import { useState } from "react";
import Layout from "../components/Layout";
import Reveal from "../components/Reveal";
import Img from "../components/Img";
import PageHero from "../components/PageHero";
import Marquee from "../components/Marquee";
import Testimonials from "../components/Testimonials";
import CtaBand from "../components/CtaBand";
import { IMG } from "../lib/media";
import { projects, projectCategories } from "../lib/work";

export default function PortfolioPage() {
  const [filter, setFilter] = useState("All");
  const visible = projects.filter((project) => filter === "All" || project.category === filter);

  return (
    <Layout
      title="Work"
      description="A snapshot of the launch campaigns, brand systems, and growth engines Imagicity has built for founders and institutions across categories."
    >
      <PageHero
        label="Selected work"
        lines={["Work that", "moves"]}
        script="ambitious brands."
        text="A snapshot of the launch campaigns, brand systems and growth engines we've built for founders and institutions across categories."
        badge="Selected work • Real results • "
        images={[
          { id: IMG.posterWall, alt: "Street wall covered in campaign posters", caption: "out in the wild" },
          { id: IMG.hotelLobby, alt: "Hospitality brand space" },
          { id: IMG.phonePay, alt: "Fintech app payment on a phone" }
        ]}
      />

      <section className="ix-section ix-work">
        <div className="container">
          <div className="ix-filters" role="group" aria-label="Filter projects">
            {projectCategories.map((category) => (
              <button
                key={category}
                type="button"
                className={`ix-chip ${filter === category ? "is-on" : ""}`}
                aria-pressed={filter === category}
                onClick={() => setFilter(category)}
              >
                {category}
              </button>
            ))}
            <span className="ix-filters-count">
              {String(visible.length).padStart(2, "0")} projects
            </span>
          </div>

          <div className="ix-work-grid" key={filter}>
            {visible.map((project, index) => (
              <Reveal key={project.slug} delay={(index % 2) * 120} className={`ix-case-wrap is-${index % 2 ? "odd" : "even"}`}>
                <article className={`ix-case tone-${project.tone}`}>
                  <div className="ix-case-media" data-tilt>
                    <Img
                      id={project.image}
                      alt={`${project.title} visual`}
                      width={820}
                      ratio={index % 3 === 0 ? 1.05 : 0.78}
                      sizes="(max-width: 760px) 92vw, 46vw"
                    />
                    <span className="ix-case-result">
                      <strong>{project.result}</strong>
                      <span>{project.metric}</span>
                    </span>
                  </div>
                  <div className="ix-case-body">
                    <div className="ix-case-tags">
                      {project.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                    <h3>{project.title}</h3>
                    <p>{project.body}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Marquee
        items={projects.map((project) => `${project.result} ${project.metric}`)}
        tone="yellow"
        duration={50}
      />

      <Testimonials />

      <CtaBand
        kicker="Your brand could be"
        title="The next case study."
        text="Let's build a growth engine worth showing off. Tell us what you're working on."
        secondary={{ href: "/services", label: "Explore services" }}
      />
    </Layout>
  );
}
