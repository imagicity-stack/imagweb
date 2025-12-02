import ContactSection from "@/components/ContactSection";

const contactOptions = [
  {
    title: "Project partnerships",
    detail: "Campaigns, web builds, GTM overhauls, or content systems. We'll pair you with the right pod in under 48 hours.",
    note: "Expect an intro, discovery questions, and a recommended engagement model."
  },
  {
    title: "Advisory + audits",
    detail: "Growth, UX, and analytics reviews for teams that want guidance before committing to a full build.",
    note: "We package recommendations, timelines, and quick wins you can ship immediately."
  },
  {
    title: "Emergency launches",
    detail: "Tight deadlines? We can stand up a rapid squad for demos, PR drops, or critical product updates.",
    note: "Includes design, engineering, QA, and analytics to land the launch reliably."
  }
];

export const metadata = {
  title: "Contact | Imagicity",
  description:
    "Contact Imagicity for campaigns, GTM strategy, design systems, or product launches. We'll reply within one business day."
};

export default function ContactPage() {
  return (
    <main className="space-y-16 pb-24 pt-28 sm:pt-32">
      <section className="px-4 sm:px-8 lg:px-16">
        <div className="glass gradient-border relative overflow-hidden rounded-3xl p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(255,133,95,0.2),transparent_36%),radial-gradient(circle_at_82%_12%,rgba(244,114,182,0.16),transparent_40%)]" />
          <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.3em] text-orange-100/80">Contact</p>
              <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">Tell us what momentum looks like for you.</h1>
              <p className="text-lg text-white/70">
                Share your goals, timelines, and constraints. We will assemble a focused team and return with a plan within one business day.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {contactOptions.map((item) => (
                  <div key={item.title} className="glass gradient-border rounded-2xl p-4">
                    <p className="text-sm font-semibold text-white">{item.title}</p>
                    <p className="mt-2 text-sm text-white/70">{item.detail}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.2em] text-orange-100/80">{item.note}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-3 rounded-3xl bg-white/5 p-6 text-sm text-white/70">
              <p className="text-sm uppercase tracking-[0.3em] text-white/60">Response times</p>
              <div className="glass gradient-border rounded-2xl p-4">
                <p className="text-sm font-semibold text-white">Weekdays</p>
                <p className="text-lg text-orange-100">Under 24h</p>
                <p className="text-sm text-white/70">You will hear from a strategist and a producer with next steps.</p>
              </div>
              <div className="glass gradient-border rounded-2xl p-4">
                <p className="text-sm font-semibold text-white">Weekends</p>
                <p className="text-lg text-orange-100">Light coverage</p>
                <p className="text-sm text-white/70">We monitor urgent launches and respond to new requests every morning.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                Need to share a deck or RFP? Email <span className="font-semibold text-orange-100">hello@imagicity.example</span> and we will route it immediately.
              </div>
            </div>
          </div>
        </div>
      </section>

      <ContactSection />
    </main>
  );
}
