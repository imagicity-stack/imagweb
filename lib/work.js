import { IMG } from "./media";

// Case studies shown on the home rail and the Work page.
export const projects = [
  {
    slug: "nova-health",
    title: "Nova Health Launch",
    client: "Digital health",
    category: "Brand",
    tags: ["Go-To-Market", "Brand", "Web"],
    body: "Go-to-market strategy, brand identity, and conversion-led landing pages for a digital health startup.",
    result: "3.1x",
    metric: "increase in sign-ups",
    image: IMG.doctorTablet,
    tone: "yellow"
  },
  {
    slug: "wavelane",
    title: "Wavelane EdTech Growth",
    client: "EdTech",
    category: "Performance",
    tags: ["Performance", "CRM", "Content"],
    body: "Performance media, CRM automation, and content systems built to scale qualified demand.",
    result: "2x",
    metric: "monthly demo requests",
    image: IMG.students,
    tone: "red"
  },
  {
    slug: "orbito-labs",
    title: "Orbito Labs Rebrand",
    client: "Deep tech",
    category: "Brand",
    tags: ["Positioning", "Creative"],
    body: "Messaging architecture, creative direction, and campaign storytelling for a deep-tech platform.",
    result: "-34%",
    metric: "customer acquisition cost",
    image: IMG.monitorsRoom,
    tone: "ink"
  },
  {
    slug: "mira-hospitality",
    title: "Mira Hospitality",
    client: "Hospitality",
    category: "Social",
    tags: ["Local", "Social", "Influencer"],
    body: "Local marketing, influencer activations, and social storytelling to drive city-wide awareness.",
    result: "5.2M",
    metric: "organic impressions",
    image: IMG.hotelLobby,
    tone: "yellow"
  },
  {
    slug: "lumen-finance",
    title: "Lumen Finance",
    client: "Fintech",
    category: "Growth",
    tags: ["Funnel", "Automation"],
    body: "End-to-end lead funnel with WhatsApp automation and AI follow-ups for a fintech launch.",
    result: "47%",
    metric: "lead-to-call conversion",
    image: IMG.phonePay,
    tone: "red"
  },
  {
    slug: "atlas-academy",
    title: "Atlas Academy",
    client: "Education",
    category: "Growth",
    tags: ["Campaign", "Paid Media"],
    body: "Integrated admissions campaign across paid, social, and offline channels for a new cohort.",
    result: "1.8x",
    metric: "enrolment vs. target",
    image: IMG.posterWall,
    tone: "ink"
  }
];

export const projectCategories = ["All", "Brand", "Performance", "Growth", "Social"];
