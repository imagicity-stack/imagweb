import Link from "next/link";
import WorkSection from "@/components/WorkSection";

const proofPoints = [
  {
    label: "Pipeline lift",
    value: "+38%",
    description: "Demo requests increased after aligning product stories with campaign nurture."
  },
  {
    label: "Markets launched",
    value: "6",
    description: "Coordinated campaigns, localized assets, and analytics rollout in parallel."
  },
  {
    label: "Speed to ship",
    value: "2 wks",
    description: "Average sprint cycle from concept to live experiments with QA and analytics."
  }
];

export const metadata = {
  title: "Work | Imagicity",
  description: "Explore Imagicity case studies across GTM, creative campaigns, and conversion-focused product storytelling."
};

export default function WorkPage() {
  return (
    <main className="space-y-16 pb-24 pt-28 sm:pt-32">
      <section className="px-4 sm:px-8 lg:px-16">
        <div className="glass gradient-border relative overflow-hidden rounded-3xl p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_24%,rgba(255,133,95,0.2),transparent_36%),radial-gradient(circle_at_78%_14%,rgba(244,114,182,0.16),transparent_40%)]" />
          <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.3em] text-orange-100/80">Case studies</p>
              <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">Integrated launches with engineering-grade craft.</h1>
              <p className="text-lg text-white/70">
                We build connected experiences across web, content, and campaign media. Browse the active portfolio and open any
                case file to see the GTM thinking, creative systems, and performance results.
              </p>
              <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.2em] text-white/60">
                {["GTM architecture", "Motion design", "Next.js builds", "Campaign operations"].map((item) => (
                  <span key={item} className="rounded-full border border-white/15 px-3 py-1">
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div className="space-y-4 rounded-3xl bg-white/5 p-6">
              <p className="text-sm uppercase tracking-[0.3em] text-white/60">Recent outcomes</p>
              <div className="grid gap-3 sm:grid-cols-3">
                {proofPoints.map((item) => (
                  <div key={item.label} className="glass gradient-border space-y-2 rounded-2xl p-4 text-center">
                    <p className="text-xs uppercase tracking-[0.22em] text-white/50">{item.label}</p>
                    <p className="text-3xl font-semibold text-orange-100">{item.value}</p>
                    <p className="text-sm text-white/70">{item.description}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-white/70">
                Prefer to talk through the work? <Link href="/contact" className="text-orange-200 hover:text-orange-100">Schedule a walkthrough</Link>
                and we will tailor the deck to your use case.
              </div>
            </div>
          </div>
        </div>
      </section>

      <WorkSection />

      <section className="px-4 sm:px-8 lg:px-16">
        <div className="glass gradient-border grid gap-6 rounded-3xl p-8 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.3em] text-orange-100/80">Engagement model</p>
            <h2 className="text-3xl font-semibold sm:text-4xl">From discovery to growth loops.</h2>
            <p className="text-white/70">
              Each project starts with a strategy sprint, then we move into production and optimization. We stay close with analytics,
              creative refreshes, and experiment backlogs so the work keeps compounding.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {["Research, ICPs, and positioning", "Concepts, storyboards, and motion", "Production builds with QA + analytics", "Testing roadmap, reporting, and refreshes"].map((item) => (
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
