// Photo catalog for the marketing pages. Everything is served straight from
// the Unsplash CDN (free for commercial use, no attribution required), which
// resizes and converts to WebP/AVIF on the fly. Swap any entry for a real
// project shot by changing its id, or point `src` at a file in /public.

const UNSPLASH = "https://images.unsplash.com";

export const photo = (id, width = 900, ratio = 0.75) => {
  const w = Math.round(width);
  const h = Math.round(width * ratio);
  return `${UNSPLASH}/${id}?auto=format&fit=crop&crop=entropy&w=${w}&h=${h}&q=72`;
};

export const IMG = {
  teamSticky: "photo-1586936893354-362ad6ae47ba",
  teamSunlit: "photo-1681949287382-052ea3954a51",
  brainstormGlass: "photo-1758691736836-0413b066787a",
  brainstormColor: "photo-1758691736934-e5d6d0c7f875",
  teamTable: "photo-1681949101473-9aea8b928a55",
  creativeDesk: "photo-1787647559705-d2ad3322020e",
  colorfulOffice: "photo-1787647561654-12e683ecf637",
  designTeam: "photo-1787647562528-c591a0011510",
  designCollab: "photo-1787647561274-d48d803795a7",
  personWriting: "photo-1587440871875-191322ee64b0",
  designerTablet: "photo-1572044162444-ad60f128bdea",
  colorSamples: "photo-1716471330463-f475b00f0506",
  pensNotebooks: "photo-1717079556888-c23cb91b450f",
  bottleYellow: "photo-1706111577646-8e514604388e",
  jarsYellow: "photo-1634976099174-19f91dcaf31f",
  boxesYellow: "photo-1634976311006-d0bb9a7cc5f0",
  boxMockup: "photo-1711985220351-b6e89ac8267a",
  perfumeBox: "photo-1711985220375-79aa5830f8b9",
  pumpBottles: "photo-1771519902689-0a5c7be8efe6",
  coffeeCup: "photo-1696960741206-63a41bb798ad",
  coffeePink: "photo-1712402832925-d41c446883d3",
  coffeeFloat: "photo-1789572555700-2d7cad930dc4",
  socialPhone: "photo-1724862936518-ae7fcfc052c1",
  phoneApps: "photo-1603145733146-ae562a55031e",
  socialIcons: "photo-1611926653458-09294b3142bf",
  analytics: "photo-1551288049-bebda4e38f71",
  laptopStats: "photo-1460925895917-afdab827c52f",
  laptopCharts: "photo-1504868584819-f8e8b4b6d7e3",
  campaignDesk: "photo-1542744173-05336fcc7ad4",
  laptopWood: "photo-1678690832311-bb6e361989ca",
  doctorTablet: "photo-1758691461973-553db5285280",
  students: "photo-1758270705290-62b6294dd044",
  studentsCollab: "photo-1758270705518-b61b40527e76",
  hotelLobby: "photo-1621293954908-907159247fc8",
  checkerBar: "photo-1692153142524-60285a93c249",
  phonePay: "photo-1556742521-9713bf272865",
  robotArm: "photo-1655393001768-d946c97d6fd1",
  monitorsRoom: "photo-1701848055770-effbdb148e15",
  photographer: "photo-1542992933-ce75d0187ec1",
  cameraMan: "photo-1621024994278-e409544f4085",
  microphone: "photo-1603425013520-e0b30e6e37dc",
  billboardNight: "photo-1635873432087-50eba4c4392d",
  giantEyes: "photo-1771824673475-8585ae4c7961",
  posterWall: "photo-1783027900120-2313cec51ecc",
  tornPosters: "photo-1773664028484-96d3175d77b9",
  celebrate: "photo-1758691737584-a8f17fb34475",
  selfie: "photo-1758691737535-57edd2a11d73",
  highFive: "photo-1752650735509-58f11eaa2e10",
  charminar: "photo-1696941515998-d83f24967aca",
  bengaluru: "photo-1687158266872-fd2773fa76c6",
  dubai: "photo-1634007626524-f47fa37810a7"
};

// One hero image per service track, keyed by slug from lib/services.js.
export const SERVICE_IMAGES = {
  "strategy-go-to-market": IMG.brainstormGlass,
  "brand-strategy-positioning": IMG.boxMockup,
  "creative-design-studio": IMG.designerTablet,
  "performance-marketing": IMG.analytics,
  "lead-generation-funnels": IMG.laptopCharts,
  "content-social-media": IMG.socialPhone,
  "marketing-automation-ai": IMG.robotArm,
  "website-conversion": IMG.laptopWood,
  "local-regional-marketing": IMG.billboardNight,
  "campaign-launch-execution": IMG.giantEyes
};

export const CITIES = [
  { name: "Hyderabad", note: "HQ · Strategy & Studio", image: IMG.charminar },
  { name: "Bengaluru", note: "Growth & Performance", image: IMG.bengaluru },
  { name: "Dubai", note: "GCC Launches", image: IMG.dubai }
];
