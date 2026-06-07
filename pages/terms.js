import Layout from "../components/Layout";

const UPDATED = "June 7, 2026";

export default function TermsPage() {
  return (
    <Layout
      title="Terms of Service"
      description="The terms that govern your use of the Imagicity website."
    >
      <section className="section legal">
        <div className="container legal-inner">
          <span className="eyebrow">Legal</span>
          <h1 className="h-display">Terms of Service</h1>
          <p className="legal-updated">Last updated: {UPDATED}</p>

          <p>
            These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of the
            Imagicity website at <a href="https://imagicity.in">imagicity.in</a>. By using the site,
            you agree to these Terms.
          </p>

          <h2>Use of the website</h2>
          <p>
            You may use the site for lawful purposes only. You agree not to misuse the site, attempt
            to disrupt it, or access it in any way that could damage or impair its availability.
          </p>

          <h2>Intellectual property</h2>
          <p>
            All content on this site — including text, graphics, logos, and articles — is owned by or
            licensed to Imagicity and is protected by applicable intellectual property laws. You may
            not reproduce or republish our content without prior written permission.
          </p>

          <h2>Comments &amp; submissions</h2>
          <p>
            When you post a comment or submit content, you are responsible for it and grant us the
            right to display, moderate, or remove it. Do not post anything unlawful, abusive,
            misleading, or that infringes the rights of others. We may remove any submission at our
            discretion.
          </p>

          <h2>Third-party links</h2>
          <p>
            Our site may link to third-party websites. We are not responsible for the content or
            practices of those sites and encourage you to review their terms and policies.
          </p>

          <h2>Disclaimer</h2>
          <p>
            The website and its content are provided &ldquo;as is&rdquo; without warranties of any
            kind. While we strive for accuracy, we do not guarantee that the content is complete,
            current, or error-free.
          </p>

          <h2>Limitation of liability</h2>
          <p>
            To the fullest extent permitted by law, Imagicity shall not be liable for any indirect,
            incidental, or consequential damages arising from your use of the site.
          </p>

          <h2>Changes to these terms</h2>
          <p>
            We may revise these Terms from time to time. Continued use of the site after changes
            constitutes acceptance of the updated Terms.
          </p>

          <h2>Governing law</h2>
          <p>These Terms are governed by the laws of India.</p>

          <h2>Contact us</h2>
          <p>
            Questions about these Terms? Email{" "}
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
