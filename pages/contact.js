import { useState } from "react";

import Layout from "../components/Layout";
import Reveal from "../components/Reveal";

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  subject: "",
  message: ""
};

const contactItems = [
  { label: "Email", value: "connect@imagicity.in", href: "mailto:connect@imagicity.in", icon: "@" },
  { label: "Call", value: "+91 91222 89578", href: "tel:+919122289578", icon: "☎" },
  { label: "Studios", value: "Hyderabad · Bengaluru · Dubai", icon: "◎" }
];

const faqs = [
  {
    q: "How quickly can we get started?",
    a: "Most engagements kick off within a week of our first call. We'll send a tailored scope and timeline after understanding your goals."
  },
  {
    q: "Do you work with early-stage startups?",
    a: "Absolutely. A large part of our work is helping founders launch and find product-market fit through sharp positioning and lean growth systems."
  },
  {
    q: "Can we engage you for a single service?",
    a: "Yes. While our strength is integrated systems, you can start with one track — like performance marketing or brand — and expand over time."
  }
];

export default function ContactPage() {
  const [formState, setFormState] = useState(initialState);
  const [status, setStatus] = useState({ state: "idle", message: "" });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ state: "loading", message: "" });

    const payload = {
      name: `${formState.firstName} ${formState.lastName}`.trim(),
      email: formState.email.trim(),
      phone: formState.phone.trim(),
      subject: formState.subject.trim(),
      message: formState.message.trim()
    };

    const contentTypeHeader = `Content${String.fromCharCode(45)}Type`;
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          [contentTypeHeader]: "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setStatus({
          state: "error",
          message: data.message || "Something went wrong. Please try again soon."
        });
        return;
      }

      setStatus({
        state: "success",
        message: "Thanks for reaching out. We'll respond soon."
      });
      setFormState(initialState);
    } catch (error) {
      setStatus({
        state: "error",
        message: "Something went wrong. Please try again soon."
      });
    }
  };

  return (
    <Layout
      title="Contact"
      description="Tell us about your goals and we'll build a marketing system tailored to your brand, market, and momentum."
    >
      <section className="hero-compact">
        <div className="container">
          <Reveal>
            <span className="eyebrow">Start a project</span>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="h-display">
              Ready to launch your next{" "}
              <span className="gradient-text">growth chapter</span>?
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p>
              Tell us about your goals and we'll build a marketing system
              tailored to your brand, market, and momentum.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section tight">
        <div className="container">
          <div className="contact-layout">
            <Reveal variant="left" className="contact-panel">
              <h3>Let's talk.</h3>
              <p>
                Whether it's a launch, a rebrand, or a growth sprint — we're
                ready when you are.
              </p>
              <div className="contact-info">
                {contactItems.map((item) => {
                  const content = (
                    <>
                      <span className="ci-icon">{item.icon}</span>
                      <div>
                        <div className="label">{item.label}</div>
                        <div className="value">{item.value}</div>
                      </div>
                    </>
                  );
                  return item.href ? (
                    <a key={item.label} href={item.href} className="contact-info-item">
                      {content}
                    </a>
                  ) : (
                    <div key={item.label} className="contact-info-item">
                      {content}
                    </div>
                  );
                })}
              </div>
            </Reveal>

            <Reveal variant="right">
              <form className="contact-form" onSubmit={handleSubmit}>
                <label>
                  First name
                  <input
                    type="text"
                    name="firstName"
                    placeholder="Jane"
                    value={formState.firstName}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label>
                  Last name
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Doe"
                    value={formState.lastName}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label>
                  Work email
                  <input
                    type="email"
                    name="email"
                    placeholder="you@company.com"
                    value={formState.email}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label>
                  Phone number
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Your phone"
                    value={formState.phone}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label className="full">
                  Subject
                  <input
                    type="text"
                    name="subject"
                    placeholder="Project inquiry"
                    value={formState.subject}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label className="full">
                  Message
                  <textarea
                    rows="5"
                    name="message"
                    placeholder="Share your goals"
                    value={formState.message}
                    onChange={handleChange}
                    required
                  />
                </label>
                <div className="form-footer">
                  <button
                    type="submit"
                    className="btn btn-glow"
                    disabled={status.state === "loading"}
                  >
                    {status.state === "loading" ? "Sending..." : "Submit request →"}
                  </button>
                  {status.message ? (
                    <p className={`form-status ${status.state}`}>{status.message}</p>
                  ) : null}
                </div>
              </form>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head center">
            <Reveal>
              <span className="eyebrow">FAQ</span>
            </Reveal>
            <Reveal delay={80}>
              <h2>Good questions, answered.</h2>
            </Reveal>
          </div>
          <div className="faq-list" style={{ maxWidth: 760, margin: "0 auto" }}>
            {faqs.map((faq, index) => (
              <Reveal key={faq.q} delay={index * 80}>
                <details className="faq-item">
                  <summary>{faq.q}</summary>
                  <p>{faq.a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
