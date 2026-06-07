import { useState } from "react";

// Footer newsletter signup. Posts to /api/newsletter/subscribe, which stores the
// subscriber and sends a branded welcome email.
export default function NewsletterForm() {
  const [form, setForm] = useState({ name: "", email: "", website: "" });
  const [status, setStatus] = useState({ state: "idle", message: "" });

  const update = (field) => (event) =>
    setForm((prev) => ({ ...prev, [field]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    setStatus({ state: "loading", message: "" });
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setStatus({ state: "error", message: data.error || "Could not subscribe." });
        return;
      }
      setStatus({ state: "success", message: data.message || "You're subscribed!" });
      setForm({ name: "", email: "", website: "" });
    } catch (error) {
      setStatus({ state: "error", message: "Could not subscribe. Please try again." });
    }
  };

  return (
    <form className="newsletter-form" onSubmit={submit}>
      <div className="newsletter-fields">
        <input
          type="text"
          aria-label="Your name"
          placeholder="Your name"
          value={form.name}
          onChange={update("name")}
          maxLength={120}
        />
        <input
          type="email"
          required
          aria-label="Email address"
          placeholder="you@email.com"
          value={form.email}
          onChange={update("email")}
        />
        {/* Honeypot */}
        <input
          type="text"
          className="newsletter-hp"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          value={form.website}
          onChange={update("website")}
        />
        <button type="submit" className="btn btn-glow" disabled={status.state === "loading"}>
          {status.state === "loading" ? "Joining…" : "Subscribe"}
        </button>
      </div>
      {status.message ? (
        <p className={`newsletter-status ${status.state}`}>{status.message}</p>
      ) : null}
    </form>
  );
}
