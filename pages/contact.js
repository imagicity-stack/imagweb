import { useState } from "react";

import Layout from "../components/Layout";

export default function ContactPage() {
  const [formState, setFormState] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [status, setStatus] = useState({
    state: "idle",
    message: ""
  });

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
        message: "Thanks for reaching out. We will respond soon."
      });
      setFormState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
      });
    } catch (error) {
      setStatus({
        state: "error",
        message: "Something went wrong. Please try again soon."
      });
    }
  };

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
          <label>
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
          <label>
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
          {status.message ? <p>{status.message}</p> : null}
          <button
            type="submit"
            className="button-primary"
            disabled={status.state === "loading"}
          >
            {status.state === "loading" ? "Sending..." : "Submit request"}
          </button>
        </form>
      </section>
    </Layout>
  );
}
