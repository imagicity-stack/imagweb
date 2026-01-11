import Image from "next/image";

const navLinks = ["Main", "Services", "Team", "Contacts"];

const services = [
  {
    title: "Launch Lab",
    description:
      "Campaign strategy, brand playbooks, and punchy rollouts for bold launches.",
    color: "bg-[#78c995]",
    image: "/ICONS/8079500.png"
  },
  {
    title: "Design Sprints",
    description:
      "Rapid prototyping and visual systems that make every touchpoint pop.",
    color: "bg-[#7b6bf0]",
    image: "/ICONS/80795w00.png"
  },
  {
    title: "Social Gravity",
    description:
      "Magnetic content series that keep audiences orbiting your brand.",
    color: "bg-[#f38bd4]",
    image: "/ICONS/80sa79500.png"
  }
];

const logoMarks = ["Nova", "Pixel", "Spark", "Loom", "Axis", "Zing"];

export default function HomePage() {
  return (
    <main className="bg-[#f7cf46] text-[#111111]">
      <section className="relative overflow-hidden px-4 pb-16 pt-12 sm:px-8">
        <div className="pointer-events-none absolute inset-0">
          <div className="sunburst" />
        </div>

        <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-8">
          <div className="flex items-center gap-6">
            <span className="badge">Imagicity</span>
            <span className="badge">Creative</span>
          </div>

          <div className="black-card w-full">
            <header className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="logo-disc">
                  <span className="text-sm font-semibold uppercase tracking-[0.2em] text-white">
                    IM
                  </span>
                </div>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f7cf46]">
                  Creative Agency
                </span>
              </div>
              <nav className="flex flex-wrap items-center gap-3 rounded-full bg-white/90 px-6 py-3 text-xs font-semibold uppercase tracking-[0.15em]">
                {navLinks.map((link) => (
                  <span key={link} className="text-[#111111]">
                    {link}
                  </span>
                ))}
              </nav>
              <button className="rounded-full bg-[#f7cf46] px-6 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-[#111111]">
                Request
              </button>
            </header>

            <div className="relative mt-10 grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
              <div>
                <h1 className="text-4xl font-black uppercase leading-tight text-white sm:text-5xl lg:text-6xl">
                  The all-in-one project management solution
                </h1>
                <svg
                  className="mt-6"
                  width="120"
                  height="20"
                  viewBox="0 0 120 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 10C12 4 22 16 32 10C42 4 52 16 62 10C72 4 82 16 92 10C102 4 112 16 118 10"
                    stroke="#F7CF46"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
                <p className="mt-6 max-w-xl text-sm text-white/70">
                  We turn messy projects into magnetic launches with visual systems, content
                  sparks, and campaign strategy that feels like a festival.
                </p>
                <button className="mt-8 rounded-full bg-[#f7cf46] px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#111111]">
                  Make a request
                </button>
                <div className="mt-10 flex flex-wrap items-center gap-6 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
                  {logoMarks.map((mark) => (
                    <span key={mark}>{mark}</span>
                  ))}
                </div>
              </div>

              <div className="relative flex items-center justify-center">
                <div className="sticker-burst">
                  <svg viewBox="0 0 120 120" aria-hidden="true">
                    <polygon
                      points="60,2 70,30 118,30 82,52 96,100 60,72 24,100 38,52 2,30 50,30"
                      fill="#f7cf46"
                      stroke="#111111"
                      strokeWidth="4"
                    />
                  </svg>
                </div>
                <Image
                  src="/ICONS/80795s00.png"
                  alt="Creative badge"
                  width={220}
                  height={220}
                  className="relative z-10 h-auto w-52"
                />
                <Image
                  src="/ICONS/807950SD0.png"
                  alt="Sticker"
                  width={140}
                  height={140}
                  className="absolute -left-8 top-4 h-auto w-28 rotate-[-12deg]"
                />
                <Image
                  src="/ICONS/SSA.png"
                  alt="Sticker"
                  width={160}
                  height={160}
                  className="absolute -right-6 bottom-0 h-auto w-32 rotate-[10deg]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="services-card">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-xl font-black uppercase">What do we do</span>
                <svg width="40" height="12" viewBox="0 0 40 12" fill="none">
                  <path
                    d="M2 6C8 2 12 10 18 6C24 2 28 10 34 6"
                    stroke="#111111"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <span className="text-sm font-black uppercase tracking-[0.2em] text-[#ff3277]">
                Services
              </span>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-3">
              {services.map((service) => (
                <div
                  key={service.title}
                  className={`service-tile ${service.color} flex flex-col gap-4`}
                >
                  <div className="rounded-[20px] border-[3px] border-[#111111] bg-white p-2">
                    <Image
                      src={service.image}
                      alt={service.title}
                      width={280}
                      height={200}
                      className="h-40 w-full rounded-[16px] object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-black uppercase text-white">
                    {service.title}
                  </h3>
                  <p className="text-sm text-white/90">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
