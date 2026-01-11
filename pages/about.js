import Layout from "../components/Layout";

const values = [
  {
    title: "Strategy first",
    body: "Every creative decision is rooted in research, positioning, and the metrics that matter."
  },
  {
    title: "Bold storytelling",
    body: "We blend culture, design, and performance marketing to make brands unforgettable."
  },
  {
    title: "Systemic growth",
    body: "Our work connects channels, automation, and teams so growth is repeatable."
  }
];

export default function AboutPage() {
  return (
    <Layout>
      <section className="hero compact">
        <div className="hero-card">
          <span className="hero-label">About Imagicity</span>
          <h1>We design marketing systems with soul.</h1>
          <p>
            Imagicity is a creative marketing agency built for ambitious founders,
            institutions, and growth teams who want clarity, consistency, and
            measurable momentum.
          </p>
        </div>
      </section>

      <section className="section-card">
        <div className="section-header">
          <h2>What we believe</h2>
          <span className="section-tag">Our Values</span>
        </div>
        <div className="card-grid">
          {values.map((value) => (
            <article key={value.title} className="service-card">
              <h3>{value.title}</h3>
              <p>{value.body}</p>
            </article>
          ))}
        </div>
      </section>
    </Layout>
  );
}
