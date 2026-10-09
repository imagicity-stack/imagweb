import { useState } from "react";

import Layout from "../components/Layout";
import Reveal from "../components/Reveal";
import Img from "../components/Img";
import PageHero from "../components/PageHero";
import { Burst, CurlyArrow, Doodle } from "../components/Doodles";
import { Mark } from "../components/Logo";
import { IMG, CITIES } from "../lib/media";
import { CONTACT_EMAIL, CONTACT_PHONE, LOCATIONS, FOUNDING_CITY } from "../lib/site";

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  subject: "",
  message: ""
};

const contactItems = [
  { label: "Email", value: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}`, icon: "megaphone" },
  {
    label: "Call",
    value: CONTACT_PHONE,
    href: `tel:${CONTACT_PHONE.replace(/[^+\d]/g, "")}`,
    icon: "bolt"
  },
  { label: "Studios", value: LOCATIONS.join(" · "), icon: "target" }
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
    a: "Yes. While our strength is integrated systems, you can start with one track, like performance marketing or brand, and expand over time."
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
      <PageHero
        label="Start a project"
        lines={["Let's make", "some"]}
        script="noise."
        text="Tell us about your goals and we'll build a marketing system tailored to your brand, market and momentum."
        badge="Say hello • Say hello • "
        images={[
          { id: IMG.highFive, alt: "Two teammates high-fiving", caption: "deal!" },
          { id: IMG.coffeePink, alt: "Coffee bag and cup on a pink set" },
          { id: IMG.selfie, alt: "Team taking a selfie at the office" }
        ]}
      />

      <section className="ix-section ix-consult-wrap">
        <div className="container">
          <Reveal variant="pop">
            <div className="ix-consult">
              <span className="ix-consult-badge" aria-hidden="true">
                <Burst size={150} color="#FAE80C" />
                <b>Free!</b>
              </span>
              <div className="ix-consult-copy">
                <span className="ix-script is-yellow">Free for new clients</span>
                <h2 className="ix-h2 is-light">
                  Your first consultation is absolutely free.
                </h2>
                <p>
                  Book a no-obligation 45-minute strategy session. We&apos;ll audit your current
                  marketing, surface the gaps quietly costing you growth, and hand you a few
                  high-impact moves you can act on right away, whether or not we end up working
                  together.
                </p>
                <ul className="ix-consult-list">
                  <li>A focused audit of your current marketing</li>
                  <li>2–3 quick wins tailored to your brand</li>
                  <li>A clear roadmap for what scalable growth looks like</li>
                </ul>
                <div className="ix-consult-actions">
                  <a href="#start" className="ix-btn ix-btn-yellow" data-magnetic>
                    Claim your free session <span className="ix-arrow">→</span>
                  </a>
                  <span className="ix-consult-note">No card required · Limited slots each month</span>
                </div>
              </div>
              <figure className="ix-consult-photo">
                <Img id={IMG.campaignDesk} alt="Strategist reviewing a marketing plan on a laptop" width={560} ratio={1.15} sizes="(max-width: 980px) 80vw, 30vw" />
              </figure>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="ix-section ix-contact" id="start">
        <div className="container ix-contact-grid">
          <Reveal variant="left" className="ix-contact-panel">
            <h2>Let&apos;s talk.</h2>
            <p>Whether it&apos;s a launch, a rebrand or a growth sprint, we&apos;re ready when you are.</p>
            <div className="ix-contact-items">
              {contactItems.map((item) => {
                const content = (
                  <>
                    <Doodle name={item.icon} size={40} />
                    <span>
                      <span className="ix-ci-label">{item.label}</span>
                      <span className="ix-ci-value">{item.value}</span>
                    </span>
                  </>
                );
                return item.href ? (
                  <a key={item.label} href={item.href} className="ix-ci">
                    {content}
                  </a>
                ) : (
                  <div key={item.label} className="ix-ci">
                    {content}
                  </div>
                );
              })}
            </div>
            <div className="ix-contact-cities">
              <figure className="is-origin">
                <Mark size={54} />
                <figcaption>{FOUNDING_CITY}</figcaption>
              </figure>
              {CITIES.map((city) => (
                <figure key={city.name}>
                  <Img id={city.image} alt={`${city.name} skyline`} width={240} ratio={1.2} sizes="120px" />
                  <figcaption>{city.name}</figcaption>
                </figure>
              ))}
            </div>
            <CurlyArrow className="ix-contact-arrow" color="#FAE80C" size={110} />
          </Reveal>

          <Reveal variant="right">
            <form className="ix-form" onSubmit={handleSubmit}>
              <label>
                First name
                <input
                  type="text"
                  name="firstName"
                  placeholder="Jane"
                  autoComplete="given-name"
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
                  autoComplete="family-name"
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
                  autoComplete="email"
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
                  autoComplete="tel"
                  value={formState.phone}
                  onChange={handleChange}
                  required
                />
              </label>
              <label className="is-full">
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
              <label className="is-full">
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
              <div className="ix-form-foot">
                <button
                  type="submit"
                  className="ix-btn ix-btn-red"
                  disabled={status.state === "loading"}
                  data-magnetic
                >
                  {status.state === "loading" ? "Sending..." : "Submit request"}{" "}
                  <span className="ix-arrow">→</span>
                </button>
                {status.message ? (
                  <p className={`ix-form-status is-${status.state}`} role="status">
                    {status.message}
                  </p>
                ) : null}
              </div>
            </form>
          </Reveal>
        </div>
      </section>

      <section className="ix-section ix-faq">
        <div className="container">
          <Reveal className="ix-head is-center">
            <span className="ix-label">FAQ</span>
            <h2 className="ix-h2">
              Good questions, <span className="ix-script is-red">answered.</span>
            </h2>
          </Reveal>
          <div className="ix-faq-list">
            {faqs.map((faq, index) => (
              <Reveal key={faq.q} delay={index * 80}>
                <details className="ix-faq-item">
                  <summary>
                    <span>{faq.q}</span>
                    <i aria-hidden="true" />
                  </summary>
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
