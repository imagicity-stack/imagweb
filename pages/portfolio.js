import Link from "next/link";
import Layout from "../components/Layout";
import Reveal from "../components/Reveal";

const projects = [
  {
    gradient: "g1",
    tags: ["Go-To-Market", "Brand", "Web"],
    title: "Nova Health Launch",
    body: "Go-to-market strategy, brand identity, and conversion-led landing pages for a digital health startup.",
    result: "3.1x",
    metric: "increase in sign-ups"
  },
  {
    gradient: "g2",
    tags: ["Performance", "CRM", "Content"],
    title: "Wavelane EdTech Growth",
    body: "Performance media, CRM automation, and content systems built to scale qualified demand.",
    result: "2x",
    metric: "monthly demo requests"
  },
  {
    gradient: "g3",
    tags: ["Positioning", "Creative"],
    title: "Orbito Labs Rebrand",
    body: "Messaging architecture, creative direction, and campaign storytelling for a deep-tech platform.",
    result: "-34%",
    metric: "customer acquisition cost"
  },
  {
    gradient: "g4",
    tags: ["Local", "Social", "Influencer"],
    title: "Mira Hospitality",
    body: "Local marketing, influencer activations, and social storytelling to drive city-wide awareness.",
    result: "5.2M",
    metric: "organic impressions"
  },
  {
    gradient: "g5",
    tags: ["Funnel", "Automation"],
    title: "Lumen Finance",
    body: "End-to-end lead funnel with WhatsApp automation and AI follow-ups for a fintech launch.",
    result: "47%",
    metric: "lead-to-call conversion"
  },
  {
    gradient: "g6",
    tags: ["Campaign", "Paid Media"],
    title: "Atlas Academy",
    body: "Integrated admissions campaign across paid, social, and offline channels for a new cohort.",
    result: "1.8x",
    metric: "enrolment vs. target"
  }
];

export default function PortfolioPage() {
  return (
    <Layout
      title="Work"
      description="A snapshot of the launch campaigns, brand systems, and growth engines Imagicity has built for founders and institutions across categories."
    >
      <section className="hero-compact">
        <div className="container">
          <Reveal>
            <span className="eyebrow">Selected work</span>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="h-display">
              Work that moves{" "}
              <span className="gradient-text">ambitious brands</span>.
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p>
              A snapshot of the launch campaigns, brand systems, and growth
              engines we've built for founders and institutions across
              categories.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section tight">
        <div className="container">
          <div className="work-grid">
            {projects.map((project, index) => (
              <Reveal
                key={project.title}
                delay={(index % 2) * 90}
                className={`work-card ${project.gradient}`}
              >
                <div className="work-tags">
                  {project.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                <h3>{project.title}</h3>
                <p>{project.body}</p>
                <div className="work-result">
                  <strong>{project.result}</strong>
                  <span>{project.metric}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section tight">
        <div className="container">
          <Reveal variant="scale" className="cta-band">
            <h2>Your brand could be the next case study.</h2>
            <p>
              Let's build a growth engine worth showing off. Tell us what you're
              working on.
            </p>
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
