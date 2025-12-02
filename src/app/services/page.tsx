import ServicesSection from "@/components/ServicesSection";
import { services } from "@/data/content";

const delivery = [
  {
    title: "Workshops + roadmaps",
    detail: "Positioning sprints, audience maps, and creative territories that translate into a 90-day execution plan."
  },
  {
    title: "Production sprints",
    detail: "Design, copy, engineering, and QA operate together to ship motion-first pages, campaign assets, and launch kits."
  },
  {
    title: "Performance systems",
    detail: "Analytics wiring, testing matrices, and reporting cadences so you know what to scale and what to pause."
  }
];

export const metadata = {
  title: "Services | Imagicity",
  description:
    "Explore Imagicity services: brand positioning, integrated campaigns, content systems, and web experiences built for growth."
};

export default function ServicesPage() {
  return (
    <main className="space-y-16 pb-24 pt-28 sm:pt-32">
      <section className="px-4 sm:px-8 lg:px-16">
        <div className="glass gradient-border relative overflow-hidden rounded-3xl p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(255,133,95,0.22),transparent_35%),radial-gradient(circle_at_82%_12%,rgba(244,114,182,0.18),transparent_40%)]" />
          <div className="relative grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.3em] text-orange-100/80">Capabilities</p>
              <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">Marketing programs built for modern GTM teams.</h1>
              <p className="text-lg text-white/70">
                From zero-to-one brands to enterprise launches, we design modular systems that combine storytelling, design, and
                technology. Each service can be booked individually or packaged into a full GTM engagement.
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                {services.map((service) => (
                  <div key={service.title} className="glass gradient-border rounded-2xl p-4">
                    <div className="flex items-center justify-between text-sm uppercase tracking-[0.2em] text-white/60">
                      <span>{service.title}</span>
                      <span className="text-white/50">{service.icon}</span>
                    </div>
                    <p className="mt-2 text-sm text-orange-100/90">{service.tagline}</p>
                    <p className="mt-2 text-sm text-white/70">{service.detail}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4 rounded-3xl bg-white/5 p-6">
              <p className="text-sm uppercase tracking-[0.3em] text-white/60">Service formats</p>
              <div className="grid gap-3">
                {delivery.map((item) => (
                  <div key={item.title} className="glass gradient-border rounded-2xl p-4">
                    <p className="text-sm font-semibold text-white">{item.title}</p>
                    <p className="mt-2 text-sm text-white/70">{item.detail}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-white/70">
                Every engagement includes a Slack channel, weekly demos, and analytics dashboards so stakeholders stay aligned.
              </div>
            </div>
          </div>
        </div>
      </section>

      <ServicesSection />

      <section className="px-4 sm:px-8 lg:px-16">
        <div className="glass gradient-border grid gap-6 rounded-3xl p-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.3em] text-orange-100/80">Delivery rhythm</p>
            <h2 className="text-3xl font-semibold sm:text-4xl">Sprint-based collaboration with measurable milestones.</h2>
            <p className="text-white/70">
              We run two-week sprints anchored in a shared roadmap. Expect transparent priorities, demos, and retros so your team
              has clarity on progress and next steps.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {["Creative direction + asset systems", "Landing pages + conversion experiments", "Campaign orchestration + media kits", "Always-on optimization + reporting"].map((item) => (
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
