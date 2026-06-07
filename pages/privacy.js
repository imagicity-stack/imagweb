import Layout from "../components/Layout";

const UPDATED = "June 7, 2026";

export default function PrivacyPage() {
  return (
    <Layout
      title="Privacy Policy"
      description="How Imagicity collects, uses, and protects your personal information."
    >
      <section className="section legal">
        <div className="container legal-inner">
          <span className="eyebrow">Legal</span>
          <h1 className="h-display">Privacy Policy</h1>
          <p className="legal-updated">Last updated: {UPDATED}</p>

          <p>
            This Privacy Policy explains how Imagicity (&ldquo;we&rdquo;, &ldquo;us&rdquo;) collects,
            uses, and safeguards your information when you visit{" "}
            <a href="https://imagicity.in">imagicity.in</a> or interact with our services. By using
            our website, you agree to the practices described here.
          </p>

          <h2>Information we collect</h2>
          <ul>
            <li>
              <strong>Contact enquiries:</strong> when you submit our contact form we collect your
              name, email, phone number, and message.
            </li>
            <li>
              <strong>Newsletter:</strong> if you subscribe, we collect your name and email address.
            </li>
            <li>
              <strong>Comments:</strong> the name and comment text you choose to publish on our blog.
            </li>
            <li>
              <strong>Usage &amp; analytics:</strong> we use Google Analytics and aggregate,
              coarse location (country/city derived from your IP — we do not store raw IP addresses)
              to understand how our content performs. We do not use this to identify you personally.
            </li>
            <li>
              <strong>Cookies:</strong> small files used for analytics and to remember preferences
              (for example, so a popup isn&rsquo;t shown to you repeatedly).
            </li>
          </ul>

          <h2>How we use your information</h2>
          <ul>
            <li>To respond to your enquiries and provide our services.</li>
            <li>To send you the newsletter and notify you about new articles you signed up for.</li>
            <li>To display and moderate blog comments.</li>
            <li>To measure and improve our content, website, and marketing.</li>
          </ul>

          <h2>Sharing &amp; third parties</h2>
          <p>
            We do not sell your personal information. We share data only with trusted service
            providers that help us operate the site — including Google (Firebase &amp; Analytics),
            our email delivery provider, and our hosting provider (Vercel) — who process it on our
            behalf.
          </p>

          <h2>Data retention</h2>
          <p>
            We keep your information only for as long as needed to fulfil the purposes above or to
            comply with legal obligations, after which it is deleted or anonymised.
          </p>

          <h2>Your choices &amp; rights</h2>
          <ul>
            <li>
              <strong>Unsubscribe</strong> from the newsletter at any time using the link or reply
              instruction in our emails.
            </li>
            <li>
              Request <strong>access to, correction of, or deletion of</strong> your personal data by
              emailing us.
            </li>
            <li>Disable cookies through your browser settings.</li>
          </ul>

          <h2>Children</h2>
          <p>Our website is not directed to children under 13, and we do not knowingly collect their data.</p>

          <h2>Changes to this policy</h2>
          <p>
            We may update this policy from time to time. Material changes will be reflected by the
            &ldquo;Last updated&rdquo; date above.
          </p>

          <h2>Contact us</h2>
          <p>
            Questions about your privacy? Email{" "}
            <a href="mailto:connect@imagicity.in">connect@imagicity.in</a>.
          </p>

          <p className="legal-note">
            This page is provided for general information and does not constitute legal advice.
          </p>
        </div>
      </section>
    </Layout>
  );
}
