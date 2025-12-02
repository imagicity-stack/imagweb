import AboutSection from "@/components/AboutSection";

const pillars = [
  {
    title: "Strategy operators",
    description:
      "GTM, positioning, and revenue design are core disciplines here. Every engagement begins with math and market proof, not just moodboards.",
    detail: "Narratives, ICPs, and plays are shaped with research, competitive sweeps, and experiments we can measure."
  },
  {
    title: "Creative technologists",
    description:
      "Design and engineering move in the same sprint. We storyboard motion early, design for systems, and build on production-ready stacks.",
    detail: "We blend Framer Motion, GSAP, and Next.js to keep every launch tactile, fast, and flexible for growth teams."
  },
  {
    title: "Performance mindset",
    description:
      "Campaigns, content, and product surfaces ladder up to metrics. We wire analytics, dashboards, and playbooks so teams can keep iterating.",
    detail: "Every drop ships with instrumentation, reporting cadences, and on-call creative support."
  }
];

const snapshots = [
  {
    label: "Launches",
    value: "60+",
    blurb: "Campaigns, feature debuts, and brand refreshes shipped across SaaS, fintech, and gaming."
  },
  {
    label: "Time zones",
    value: "8",
    blurb: "Distributed pods that cover EMEA and NA hours for follow-the-sun execution."
  },
  {
    label: "Retainers",
    value: "12",
    blurb: "Embedded teams that own GTM, design systems, and experimentation programs."
  }
];

export const metadata = {
  title: "About | Imagicity",
  description:
    "Inside Imagicity: the strategy-led creative marketing studio pairing GTM, design, engineering, and campaign ops in one sprint team."
};

export default function AboutPage() {
  return (
    <main className="space-y-16 pb-24 pt-28 sm:pt-32">
      <section className="px-4 sm:px-8 lg:px-16">
        <div className="glass gradient-border relative overflow-hidden rounded-3xl p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,133,95,0.18),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(244,114,182,0.15),transparent_45%)]" />
          <div className="relative grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-start">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.3em] text-orange-100/80">About Imagicity</p>
              <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
                Strategy-first creative studio building memorable, measurable momentum.
              </h1>
              <p className="text-lg text-white/70">
                We operate as a dedicated strike team—researchers, designers, engineers, and campaign operators working together
                from the first brief. Every deliverable is built to move the funnel and look exceptional doing it.
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                {pillars.map((item) => (
                  <div key={item.title} className="glass gradient-border rounded-2xl p-4">
                    <p className="text-sm uppercase tracking-[0.22em] text-white/60">{item.title}</p>
                    <p className="mt-2 font-semibold">{item.description}</p>
                    <p className="mt-2 text-sm text-white/70">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4 rounded-3xl bg-white/5 p-6">
              <p className="text-sm uppercase tracking-[0.3em] text-white/60">Studio signals</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {snapshots.map((item) => (
                  <div key={item.label} className="glass gradient-border space-y-2 rounded-2xl p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-white/50">{item.label}</p>
                    <p className="text-3xl font-semibold text-orange-100">{item.value}</p>
                    <p className="text-sm text-white/70">{item.blurb}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-white/70">
                We keep collaboration simple: weekly demos, transparent roadmaps, and async-first comms so your marketing org can
                stay in flow.
              </div>
            </div>
          </div>
        </div>
      </section>

      <AboutSection />

      <section className="px-4 sm:px-8 lg:px-16">
        <div className="glass gradient-border grid gap-8 rounded-3xl p-8 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.3em] text-orange-100/80">How we work</p>
            <h2 className="text-3xl font-semibold sm:text-4xl">Embedded, transparent, and relentlessly iterative.</h2>
            <p className="text-white/70">
              Engagements start with a discovery sprint and roadmap. From there we ship in two-week cycles—mixing UX, creative,
              engineering, and campaign ops—so leadership sees momentum every week.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {["Discovery + strategy workshop", "Prototype-driven design with motion", "Production-ready engineering", "Campaign + content orchestration"].map((item) => (
              <div key={item} className="glass gradient-border rounded-2xl p-4 text-sm font-semibold text-white/80">
                <div className="mb-2 h-[1px] w-10 bg-orange-300" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
