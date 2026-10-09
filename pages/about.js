import Link from "next/link";
import Layout from "../components/Layout";
import Reveal from "../components/Reveal";
import Counter from "../components/Counter";
import Img from "../components/Img";
import PageHero from "../components/PageHero";
import SplitText from "../components/SplitText";
import Marquee from "../components/Marquee";
import CtaBand from "../components/CtaBand";
import { CurlyArrow, Doodle, Scribble, Smiley, Sparkle } from "../components/Doodles";
import { Mark } from "../components/Logo";
import { IMG, CITIES } from "../lib/media";
import { FOUNDING_CITY } from "../lib/site";

const values = [
  {
    title: "Strategy first",
    body: "Every creative decision is rooted in research, positioning and the metrics that matter to your business.",
    tone: "yellow",
    icon: "bulb"
  },
  {
    title: "Bold storytelling",
    body: "We blend culture, design and performance marketing to make brands genuinely unforgettable.",
    tone: "red",
    icon: "megaphone"
  },
  {
    title: "Systemic growth",
    body: "Our work connects channels, automation and teams so growth becomes repeatable and predictable.",
    tone: "ink",
    icon: "rocket"
  },
  {
    title: "Radical clarity",
    body: "No jargon, no vanity metrics. We report on what moves revenue and we tell you the truth.",
    tone: "paper",
    icon: "target"
  }
];

const stats = [
  { to: 120, suffix: "+", label: "Projects delivered", icon: "star" },
  { to: 40, suffix: "+", label: "Brands partnered", icon: "heart" },
  { to: 4.8, suffix: "x", decimals: 1, label: "Avg. ROAS", icon: "bolt" },
  { to: 4, suffix: "", label: "Studios", icon: "smile" }
];

const principles = [
  "We obsess over the customer journey, not just the deliverable.",
  "We build in public loops: test, learn and iterate fast.",
  "We treat your budget like our own money.",
  "We connect brand and performance instead of choosing one."
];

const gallery = [
  { id: IMG.brainstormColor, caption: "Wall of ideas", tall: true },
  { id: IMG.photographer, caption: "Shoot day" },
  { id: IMG.designTeam, caption: "Crit session" },
  { id: IMG.coffeeFloat, caption: "Fuel", tall: true },
  { id: IMG.microphone, caption: "Podcast corner" },
  { id: IMG.highFive, caption: "Wins, loudly" },
  { id: IMG.colorSamples, caption: "Swatch therapy", tall: true }
];

export default function AboutPage() {
  return (
    <Layout
      title="About"
      description="Imagicity is a creative marketing agency built for ambitious founders, institutions, and growth teams who want clarity, consistency, and measurable momentum."
    >
      <PageHero
        label="About Imagicity"
        lines={["We build", "marketing"]}
        script="with soul."
        text="Born in Hazaribagh, built for ambitious founders, institutions and growth teams who want clarity, consistency and measurable momentum."
        badge="Est. Hazaribagh • Now everywhere • "
        images={[
          { id: IMG.teamTable, alt: "Team gathered around a planning table", caption: "the crew" },
          { id: IMG.creativeDesk, alt: "Designers working together at a desk" },
          { id: IMG.pensNotebooks, alt: "Notebooks and pens ready for a workshop" }
        ]}
      />

      <section className="ix-section ix-story">
        <div className="container ix-split">
          <Reveal variant="left" className="ix-stack">
            <figure className="ix-polaroid is-back">
              <Img id={IMG.brainstormGlass} alt="Brainstorm on a glass wall" width={560} ratio={1.05} sizes="(max-width: 980px) 70vw, 30vw" />
            </figure>
            <figure className="ix-polaroid is-front">
              <Img id={IMG.celebrate} alt="Team celebrating a launch" width={520} ratio={0.85} sizes="(max-width: 980px) 60vw, 24vw" />
              <figcaption className="ix-polaroid-label">launch day = best day</figcaption>
              <span className="ix-tape" aria-hidden="true" />
            </figure>
            <Smiley size={86} className="ix-stack-smiley" />
            <span className="ix-sticker ix-stack-origin">Est. in {FOUNDING_CITY}</span>
          </Reveal>
          <Reveal variant="right" className="ix-split-copy">
            <span className="ix-label">Our story</span>
            <h2 className="ix-h2">
              Built by operators who got tired of{" "}
              <span className="ix-script is-red">marketing theatre.</span>
            </h2>
            <p>
              Imagicity started in Hazaribagh, Jharkhand. We began because too many brands were
              sold pretty decks and disconnected campaigns. Strategy lived in one room, creative in
              another, and performance somewhere else entirely.
            </p>
            <p>
              So we built a different kind of agency, one where positioning, storytelling, paid
              media and automation are designed as a single growth system. That idea grew from our
              Hazaribagh studio into Hyderabad, Bengaluru and Dubai, and Hazaribagh is still home
              base. The result is marketing that is both beautiful and brutally effective.
            </p>
            <Link href="/portfolio" className="ix-btn ix-btn-ink" data-magnetic>
              See what we&apos;ve built <span className="ix-arrow">→</span>
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="ix-statband">
        <div className="container ix-statband-grid">
          {stats.map((stat, index) => (
            <Reveal key={stat.label} delay={index * 90} variant="pop" className="ix-statband-item">
              <Doodle name={stat.icon} size={50} />
              <strong>
                <Counter to={stat.to} suffix={stat.suffix} decimals={stat.decimals || 0} />
              </strong>
              <span>{stat.label}</span>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="ix-section ix-values">
        <div className="container">
          <Reveal className="ix-head">
            <span className="ix-label">What we believe</span>
            <h2 className="ix-h2">
              <SplitText text="Principles that shape every engagement." />
            </h2>
          </Reveal>
          <div className="ix-notes">
            {values.map((value, index) => (
              <Reveal key={value.title} delay={index * 100} variant="pop" className="ix-note-wrap">
                <article className={`ix-note tone-${value.tone} is-${index}`}>
                  <span className="ix-note-pin" aria-hidden="true" />
                  <Doodle name={value.icon} size={50} />
                  <span className="ix-note-num">{String(index + 1).padStart(2, "0")}</span>
                  <h3>{value.title}</h3>
                  <p>{value.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="ix-band ix-gallery">
        <div className="container">
          <Reveal className="ix-head">
            <span className="ix-script is-yellow">Life at the studio</span>
            <h2 className="ix-h2 is-light">Serious work. Unserious energy.</h2>
          </Reveal>
          <div className="ix-masonry">
            {gallery.map((shot, index) => (
              <Reveal key={shot.id} delay={(index % 3) * 90} variant="clip" className="ix-masonry-item">
                <figure className={shot.tall ? "is-tall" : ""}>
                  <Img
                    id={shot.id}
                    alt={shot.caption}
                    width={520}
                    ratio={shot.tall ? 1.3 : 0.8}
                    sizes="(max-width: 760px) 90vw, 30vw"
                  />
                  <figcaption>{shot.caption}</figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="ix-section ix-cities">
        <div className="container">
          <Reveal className="ix-head is-center">
            <span className="ix-label">Where we make noise</span>
            <h2 className="ix-h2">
              Started in {FOUNDING_CITY}. <span className="ix-script is-red">Now everywhere.</span>
            </h2>
          </Reveal>
          <div className="ix-city-grid">
            <Reveal variant="pop" className="ix-city-wrap">
              <article className="ix-city ix-origin" data-tilt>
                <span className="ix-origin-tag">Day one</span>
                <Mark size={92} className="ix-origin-mark" />
                <div className="ix-origin-body">
                  <span className="ix-script">where it all started</span>
                  <h3>{FOUNDING_CITY}</h3>
                  <span className="ix-origin-place">Jharkhand, India · Still home base</span>
                </div>
                <CurlyArrow className="ix-origin-arrow" size={92} />
              </article>
            </Reveal>
            {CITIES.map((city, index) => (
              <Reveal key={city.name} delay={(index + 1) * 110} className="ix-city-wrap">
                <article className="ix-city" data-tilt>
                  <Img id={city.image} alt={`${city.name} skyline`} width={560} ratio={1.25} sizes="(max-width: 760px) 90vw, 30vw" />
                  <div className="ix-city-info">
                    <h3>{city.name}</h3>
                    <span>{city.note}</span>
                  </div>
                  <span className="ix-city-num">{String(index + 1).padStart(2, "0")}</span>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Marquee
        items={["Test", "Learn", "Iterate", "Compound", "Repeat", "Make noise"]}
        tone="red"
        duration={30}
      />

      <section className="ix-section ix-rules">
        <div className="container ix-rules-grid">
          <Reveal className="ix-rules-head">
            <span className="ix-label">How we think</span>
            <h2 className="ix-h2">
              Our approach in four <span className="ix-script is-red">honest rules.</span>
            </h2>
            <Scribble className="ix-rules-scribble" color="#111" />
            <Sparkle size={50} color="#FAE80C" className="ix-rules-spark" />
          </Reveal>
          <ol className="ix-rules-list">
            {principles.map((rule, index) => (
              <Reveal as="li" key={rule} delay={index * 90} variant="left">
                <span className="ix-rule-num">{String(index + 1).padStart(2, "0")}</span>
                <span className="ix-rule-text">{rule}</span>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <CtaBand
        kicker="Want a team that"
        title="Treats your growth like its own?"
        text="Let's talk about where your brand is today, and where it could be next."
        secondary={{ href: "/services", label: "Explore services" }}
      />
    </Layout>
  );
}
