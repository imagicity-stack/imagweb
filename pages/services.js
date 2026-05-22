import Link from "next/link";
import Layout from "../components/Layout";
import Reveal from "../components/Reveal";

const services = [
  {
    title: "Strategy and Go-To-Market Planning",
    description:
      "We help businesses define how to enter, position, and grow in their target market with clarity and precision.",
    offerings: [
      "Market and competitor research",
      "Target audience and customer profiling",
      "Brand positioning and differentiation",
      "Go-To-Market strategy for launches and expansions",
      "Channel and distribution strategy",
      "Pricing and offer structuring",
      "Messaging and value proposition framework"
    ]
  },
  {
    title: "Brand Strategy and Positioning",
    description:
      "We build brands that are clear, consistent, and credible across all touchpoints.",
    offerings: [
      "Brand positioning and narrative development",
      "Brand voice and communication tone",
      "Brand architecture and naming support",
      "Rebranding and repositioning strategy",
      "Campaign-level brand storytelling"
    ]
  },
  {
    title: "Creative and Graphic Design Studio",
    description:
      "Our design studio translates strategy into impactful visual communication.",
    offerings: [
      "Logo design and brand identity systems",
      "Brand guidelines and visual frameworks",
      "Social media creatives and content templates",
      "Performance marketing ad creatives",
      "Website and landing page visual design",
      "Print and offline creatives",
      "Pitch decks and presentation design",
      "Motion graphics and logo animations"
    ]
  },
  {
    title: "Performance Marketing and Paid Media",
    description:
      "We run data-driven paid campaigns focused on measurable growth.",
    offerings: [
      "Meta Ads and Google Ads strategy and execution",
      "Campaign structuring and funnel alignment",
      "Creative testing and optimization",
      "Budget planning and scaling strategy",
      "Performance tracking including CAC and ROI"
    ]
  },
  {
    title: "Lead Generation and Funnel Systems",
    description:
      "We design end-to-end systems to capture, nurture, and convert leads.",
    offerings: [
      "Lead magnet and offer planning",
      "Landing page and form strategy",
      "CRM setup and lead routing",
      "WhatsApp and call-based follow-ups",
      "Lead nurturing workflows",
      "Funnel performance analysis"
    ]
  },
  {
    title: "Content and Social Media Marketing",
    description:
      "We create content systems that build authority and long-term visibility.",
    offerings: [
      "Content strategy and content pillars",
      "Platform-specific planning for Instagram, LinkedIn, and YouTube",
      "Founder-led and brand-led content frameworks",
      "Monthly content calendars",
      "Community building strategy",
      "Content performance tracking"
    ]
  },
  {
    title: "Marketing Automation and AI Solutions",
    description:
      "We implement automation to improve efficiency and scalability.",
    offerings: [
      "CRM and pipeline automation",
      "WhatsApp and email automation workflows",
      "AI voice call systems for follow-ups and admissions",
      "No-code automation using modern tools",
      "Internal marketing process automation"
    ]
  },
  {
    title: "Website and Conversion Optimization",
    description:
      "We design digital experiences that convert visitors into customers.",
    offerings: [
      "Website structure and UX planning",
      "Conversion-focused copywriting",
      "Landing page optimization",
      "CTA and form optimization",
      "User behavior analysis",
      "Website performance optimization"
    ]
  },
  {
    title: "Local and Regional Marketing",
    description:
      "We help brands grow in city-specific and regional markets with context-driven strategies.",
    offerings: [
      "City and region-focused campaign planning",
      "Offline-to-online funnel integration",
      "Local influencer collaborations",
      "Event-based marketing strategy",
      "Community-driven marketing initiatives"
    ]
  },
  {
    title: "Campaign Planning and Launch Execution",
    description:
      "We plan and execute integrated campaigns across channels.",
    offerings: [
      "Campaign ideation and concept development",
      "Creative direction and execution roadmap",
      "Multi-channel campaign rollout",
      "Launch planning and timelines",
      "Post-campaign reporting and analysis"
    ]
  }
];

const badges = ["violet", "pink", "aqua", "amber"];

export default function ServicesPage() {
  return (
    <Layout
      title="Services"
      description="Structured, strategy-led marketing services designed to help startups, institutions, and growing businesses build strong brands, acquire customers, and scale sustainably."
    >
      <section className="hero-compact">
        <div className="container">
          <Reveal>
            <span className="eyebrow">Our core services</span>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="h-display">
              Systems built to{" "}
              <span className="gradient-text">launch, scale, and lead</span>.
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p>
              Imagicity offers structured, strategy-led marketing services
              designed to help startups, institutions, and growing businesses
              build strong brands, acquire customers, and scale sustainably.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section tight">
        <div className="container">
          <div className="services-list">
            {services.map((service, index) => (
              <Reveal key={service.title} className="service-row">
                <div>
                  <span className={`badge ${badges[index % badges.length]}`}>
                    Track {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3>{service.title}</h3>
                  <p className="desc">{service.description}</p>
                </div>
                <ul className="offer-list">
                  {service.offerings.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section tight">
        <div className="container">
          <Reveal variant="scale" className="cta-band">
            <h2>Not sure where to start?</h2>
            <p>
              Tell us your goals and we'll recommend the exact mix of services to
              get you there — fast.
            </p>
            <div className="cta-actions">
              <Link href="/contact" className="btn btn-glow">
                Get a recommendation →
              </Link>
              <Link href="/portfolio" className="btn btn-outline">
                See the results
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </Layout>
  );
}
