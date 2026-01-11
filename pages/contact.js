import Layout from "../components/Layout";

export default function ContactPage() {
  return (
    <Layout>
      <section className="hero compact">
        <div className="hero-card">
          <span className="hero-label">Start a project</span>
          <h1>Ready to launch your next growth chapter?</h1>
          <p>
            Tell us about your goals and we will build a marketing system tailored
            to your brand, market, and momentum.
          </p>
          <div className="contact-grid">
            <div>
              <h3>Studio</h3>
              <p>Hyderabad · Bengaluru · Dubai</p>
            </div>
            <div>
              <h3>Email</h3>
              <p>hello@imagicity.com</p>
            </div>
            <div>
              <h3>Call</h3>
              <p>+91 90000 00000</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-card">
        <form className="contact-form">
          <label>
            Full name
            <input type="text" placeholder="Your name" />
          </label>
          <label>
            Work email
            <input type="email" placeholder="you@company.com" />
          </label>
          <label>
            What do you need help with?
            <textarea rows="5" placeholder="Share your goals" />
          </label>
          <button type="submit" className="button-primary">
            Submit request
          </button>
        </form>
      </section>
    </Layout>
  );
}
