import Layout from "../components/Layout";

const projects = [
  {
    title: "Nova Health Launch",
    body: "Go-to-market strategy, brand identity, and conversion-led landing pages for a digital health startup."
  },
  {
    title: "Wavelane EdTech Growth",
    body: "Performance media, CRM automation, and content systems that doubled monthly demo requests."
  },
  {
    title: "Orbito Labs Rebrand",
    body: "Messaging architecture, creative direction, and campaign storytelling for a deep-tech platform."
  },
  {
    title: "Mira Hospitality",
    body: "Local marketing, influencer activations, and social storytelling to drive city-wide awareness."
  }
];

export default function PortfolioPage() {
  return (
    <Layout>
      <section className="hero compact">
        <div className="hero-card">
          <span className="hero-label">Portfolio</span>
          <h1>Work that moves ambitious brands.</h1>
          <p>
            A snapshot of the launch campaigns, brand systems, and growth engines
            we have built for founders and institutions across categories.
          </p>
        </div>
      </section>

      <section className="section-card">
        <div className="card-grid">
          {projects.map((project) => (
            <article key={project.title} className="service-card">
              <h3>{project.title}</h3>
              <p>{project.body}</p>
            </article>
          ))}
        </div>
      </section>
    </Layout>
  );
}
