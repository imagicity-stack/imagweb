import { useEffect, useRef } from "react";
import Link from "next/link";
import Layout from "../components/Layout";
import Reveal from "../components/Reveal";
import Counter from "../components/Counter";
import Img from "../components/Img";
import Marquee from "../components/Marquee";
import SplitText from "../components/SplitText";
import WorkRail from "../components/WorkRail";
import Process from "../components/Process";
import Testimonials from "../components/Testimonials";
import StudioStrip from "../components/StudioStrip";
import CtaBand from "../components/CtaBand";
import { Mark } from "../components/Logo";
import {
  Crown,
  Doodle,
  Scribble,
  Smiley,
  Sparkle,
  Sparks,
  SpinBadge,
  Squiggle
} from "../components/Doodles";
import { IMG } from "../lib/media";
import { projects } from "../lib/work";
import { formatDate } from "../lib/blog";
import { getPublishedPosts } from "../lib/blogServer";

const tapeA = [
  "Brand Strategy",
  "Performance Media",
  "Creative Studio",
  "Go-To-Market",
  "Marketing Automation",
  "Content Systems"
];

const tapeB = [
  "Make some noise",
  "Conversion Design",
  "AI Workflows",
  "Social Storytelling",
  "Launch Campaigns",
  "Lead Funnels"
];

const stats = [
  { to: 120, suffix: "+", label: "Launches & campaigns shipped", icon: "star" },
  { to: 40, suffix: "+", label: "Brands partnered", icon: "heart" },
  { to: 4.8, suffix: "x", decimals: 1, label: "Average return on ad spend", icon: "bolt" },
  { to: 3, suffix: "", label: "Cities across India & UAE", icon: "smile" }
];

const pillars = [
  {
    title: "Strategy & Brand",
    icon: "bulb",
    image: IMG.brainstormGlass,
    href: "/services#strategy-brand",
    body: "Positioning, go-to-market and brand narrative. Who you are, where you play and why you win."
  },
  {
    title: "Creative & Content",
    icon: "pencil",
    image: IMG.designerTablet,
    href: "/services#creative-content",
    body: "Identity, campaigns and social content designed to stop the scroll and actually convert."
  },
  {
    title: "Growth & Performance",
    icon: "megaphone",
    image: IMG.analytics,
    href: "/services#growth-performance",
    body: "Paid media, funnels and conversion-led websites engineered around CAC and ROAS."
  },
  {
    title: "Systems & Reach",
    icon: "bolt",
    image: IMG.robotArm,
    href: "/services#systems-reach",
    body: "Automation, AI workflows, local reach and integrated launches that scale on their own."
  }
];

const fallbackInsights = [
  {
    href: "/blog",
    kicker: "Branding",
    title: "Brand building playbooks that actually ship",
    image: IMG.tornPosters
  },
  {
    href: "/blog",
    kicker: "Design",
    title: "Colour, type and the psychology of identity",
    image: IMG.colorSamples
  },
  {
    href: "/creacity",
    kicker: "Tips & Tricks",
    title: "Quick wins for marketers who move fast",
    image: IMG.personWriting
  }
];

// Mouse parallax for the hero collage: eases toward the pointer and writes two
// CSS variables, each layer multiplies them by its own --depth.
function useHeroParallax(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (!window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)").matches) {
      return undefined;
    }
    let tx = 0;
    let ty = 0;
    let x = 0;
    let y = 0;
    let frame = 0;

    const loop = () => {
      x += (tx - x) * 0.08;
      y += (ty - y) * 0.08;
      el.style.setProperty("--px", x.toFixed(3));
      el.style.setProperty("--py", y.toFixed(3));
      frame = Math.abs(tx - x) + Math.abs(ty - y) > 0.002 ? requestAnimationFrame(loop) : 0;
    };

    const onMove = (event) => {
      const rect = el.getBoundingClientRect();
      if (rect.bottom < 0) return;
      tx = event.clientX / window.innerWidth - 0.5;
      ty = event.clientY / window.innerHeight - 0.5;
      if (!frame) frame = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [ref]);
}

function Hero() {
  const artRef = useRef(null);
  useHeroParallax(artRef);

  return (
    <section className="ix-hero">
      <div className="container ix-hero-grid">
        <div className="ix-hero-copy">
          <span className="ix-label ix-hero-in" style={{ "--hd": "0ms" }}>
            Creative marketing agency
          </span>
          <h1 className="ix-hero-title">
            <span className="ix-hl">
              <span className="ix-hl-in" style={{ "--hd": "80ms" }}>
                Brands that
              </span>
            </span>
            <span className="ix-hl">
              <span className="ix-hl-in" style={{ "--hd": "190ms" }}>
                refuse to
              </span>
            </span>
            <span className="ix-hl ix-hl-script">
              <span className="ix-hl-in" style={{ "--hd": "320ms" }}>
                blend in.
              </span>
              <Scribble className="ix-hero-scribble" color="#111" />
            </span>
          </h1>
          <p className="ix-hero-sub ix-hero-in" style={{ "--hd": "480ms" }}>
            Imagicity blends strategy, storytelling and performance marketing to help startups
            and institutions launch, grow and scale. Born in Hazaribagh, now making noise from
            Hyderabad to Dubai.
          </p>
          <div className="ix-hero-actions ix-hero-in" style={{ "--hd": "600ms" }}>
            <Link href="/portfolio" className="ix-btn ix-btn-ink" data-magnetic>
              View our work <span className="ix-arrow">→</span>
            </Link>
            <Link href="/contact" className="ix-link-under">
              Start a project
            </Link>
          </div>
          <div className="ix-hero-proof ix-hero-in" style={{ "--hd": "720ms" }}>
            <div>
              <strong>120+</strong>
              <span>launches shipped</span>
            </div>
            <div>
              <strong>4.8x</strong>
              <span>avg. return on ads</span>
            </div>
            <div>
              <strong>3</strong>
              <span>cities, 2 countries</span>
            </div>
          </div>
        </div>

        <div className="ix-hero-art" ref={artRef}>
          <div className="ix-par" style={{ "--depth": 0.5 }}>
            <span className="ix-hero-tri is-y" />
          </div>
          <div className="ix-par" style={{ "--depth": 0.9 }}>
            <span className="ix-hero-tri is-r" />
          </div>
          <div className="ix-par ix-par-main" style={{ "--depth": 1.4 }}>
            <figure className="ix-hero-photo is-main">
              <Img
                id={IMG.colorfulOffice}
                alt="Creative team planning a campaign around a desk"
                width={760}
                ratio={1.18}
                priority
                sizes="(max-width: 980px) 78vw, 36vw"
              />
              <figcaption className="ix-namecard">
                <b>Team Imagicity</b>
                <span>Strategy · Creative · Growth</span>
              </figcaption>
            </figure>
          </div>
          <div className="ix-par ix-par-pack" style={{ "--depth": 2.4 }}>
            <figure className="ix-hero-photo is-pack">
              <Img
                id={IMG.bottleYellow}
                alt="Product packaging on a bright yellow set"
                width={420}
                ratio={0.8}
                sizes="(max-width: 980px) 40vw, 16vw"
              />
              <span className="ix-tape" aria-hidden="true" />
            </figure>
          </div>
          <div className="ix-par ix-par-phone" style={{ "--depth": 2 }}>
            <figure className="ix-hero-photo is-phone">
              <Img
                id={IMG.socialPhone}
                alt="Social media feed on a phone"
                width={360}
                ratio={1.25}
                sizes="(max-width: 980px) 32vw, 12vw"
              />
            </figure>
          </div>
          <div className="ix-par ix-par-badge" style={{ "--depth": 3 }}>
            <SpinBadge className="ix-hero-badge" size={132} />
          </div>
          <div className="ix-par ix-par-smiley" style={{ "--depth": 2.6 }}>
            <Smiley className="ix-hero-smiley" size={96} color="#FAE80C" />
          </div>
          <Crown className="ix-hero-crown" size={78} />
          <Sparks className="ix-hero-sparks" size={64} />
          <Sparkle className="ix-hero-sparkle" size={42} color="#ED2041" />
        </div>
      </div>
      <a href="#who-we-are" className="ix-scroll-cue" data-no-wipe>
        <span>Scroll</span>
        <i aria-hidden="true" />
      </a>
    </section>
  );
}

function AboutBand() {
  return (
    <section className="ix-band ix-about" id="who-we-are">
      <div className="container ix-about-grid">
        <Reveal variant="pop" className="ix-about-photo">
          <figure className="ix-polaroid">
            <Img
              id={IMG.teamSticky}
              alt="Team mapping a campaign with sticky notes"
              width={620}
              ratio={1}
              sizes="(max-width: 980px) 80vw, 28vw"
            />
            <figcaption className="ix-polaroid-label">
              Strategy with purpose.
              <br />
              Creative with soul.
            </figcaption>
          </figure>
          <Squiggle className="ix-about-squiggle" color="#FAE80C" width={150} />
        </Reveal>

        <Reveal className="ix-about-copy" delay={100}>
          <span className="ix-script is-yellow">Who we are</span>
          <h2 className="ix-h2 is-light">
            Marketing systems, not one-off deliverables.
          </h2>
          <p>
            Imagicity started in Hazaribagh, Jharkhand, and grew into a creative marketing agency
            for founders, institutions and growth teams across India and the UAE who want clarity,
            consistency and measurable momentum.
          </p>
          <p>
            Most agencies hand you assets. We hand you an engine: strategy, creative, channels and
            automation working together so growth is repeatable.
          </p>
          <Link href="/about" className="ix-link-under is-light">
            More about us <span className="ix-arrow">→</span>
          </Link>
        </Reveal>

        <div className="ix-about-stats">
          {stats.map((stat, index) => (
            <Reveal key={stat.label} delay={index * 90} className="ix-stat">
              <Doodle name={stat.icon} size={46} />
              <div>
                <strong>
                  <Counter to={stat.to} suffix={stat.suffix} decimals={stat.decimals || 0} />
                </strong>
                <span>{stat.label}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pillars() {
  return (
    <section className="ix-section ix-pillars">
      <div className="container ix-pillars-grid">
        <Reveal className="ix-pillars-head">
          <span className="ix-label">What we do</span>
          <h2 className="ix-h2">
            Marketing that <span className="ix-script is-red">drives impact.</span>
          </h2>
          <Scribble className="ix-pillars-scribble" color="#111" />
          <p>
            Ten service tracks in four pillars. Start with one or plug them together into a
            connected growth system.
          </p>
          <Link href="/services" className="ix-btn ix-btn-ink" data-magnetic>
            All services <span className="ix-arrow">→</span>
          </Link>
        </Reveal>

        {pillars.map((pillar, index) => (
          <Reveal key={pillar.title} delay={index * 90} className="ix-pillar-wrap">
            <Link href={pillar.href} className="ix-pillar" data-tilt>
              <span className="ix-pillar-img">
                <Img id={pillar.image} alt="" width={480} ratio={0.62} sizes="(max-width: 760px) 90vw, 22vw" />
              </span>
              <Doodle name={pillar.icon} size={58} className="ix-pillar-icon" />
              <h3>{pillar.title}</h3>
              <p>{pillar.body}</p>
              <span className="ix-arrow-circle" aria-hidden="true">
                →
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Insights({ posts }) {
  const items = posts.length
    ? posts.map((post) => ({
        href: `/blog/${post.slug}`,
        kicker: post.category || "Journal",
        title: post.title,
        date: formatDate(post.publishedAt || post.createdAt),
        cover: post.coverImage?.url || null,
        alt: post.coverImage?.alt || post.title,
        image: IMG.posterWall
      }))
    : fallbackInsights;

  return (
    <section className="ix-band ix-insights">
      <div className="container ix-insights-grid">
        <Reveal className="ix-insights-head">
          <span className="ix-script is-yellow">Insights</span>
          <h2 className="ix-h2 is-light">Ideas to inspire</h2>
          <p>
            Thoughts on branding, performance and building businesses that leave a mark.
          </p>
          <Link href="/blog" className="ix-link-under is-light">
            View all articles <span className="ix-arrow">→</span>
          </Link>
        </Reveal>
        {items.map((item, index) => (
          <Reveal key={`${item.href}-${index}`} delay={index * 100} className="ix-post-wrap">
            <Link href={item.href} className={`ix-post tone-${index}`} data-cursor="view">
              <span className="ix-post-media">
                {item.cover ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.cover} alt={item.alt} loading="lazy" decoding="async" />
                ) : (
                  <Img id={item.image} alt="" width={520} ratio={0.7} sizes="(max-width: 760px) 90vw, 24vw" />
                )}
                <span className="ix-post-kicker">{item.kicker}</span>
              </span>
              {item.date ? <time className="ix-post-date">{item.date}</time> : null}
              <span className="ix-post-title">
                {item.title} <span className="ix-arrow">→</span>
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export default function HomePage({ posts = [] }) {
  return (
    <Layout>
      <Hero />

      <div className="ix-tapes" aria-hidden="true">
        <Marquee items={tapeA} tone="yellow" tilt={-2.5} duration={40} />
        <Marquee items={tapeB} tone="ink" tilt={2} duration={46} reverse />
      </div>

      <AboutBand />
      <Pillars />

      <WorkRail projects={projects}>
        <div className="container ix-rail-head">
          <Reveal>
            <span className="ix-script is-yellow">Selected work</span>
            <h2 className="ix-h2 is-light">
              <SplitText text="Brands we helped get loud." />
            </h2>
          </Reveal>
          <Reveal delay={120} className="ix-rail-head-side">
            <span className="ix-rail-hint">Keep scrolling</span>
            <Link href="/portfolio" className="ix-link-under is-light">
              View all projects <span className="ix-arrow">→</span>
            </Link>
          </Reveal>
        </div>
      </WorkRail>

      <Process />

      <section className="ix-section ix-studio">
        <div className="container">
          <Reveal className="ix-head">
            <span className="ix-label">Inside the studio</span>
            <h2 className="ix-h2">
              Where the noise <span className="ix-script is-red">gets made.</span>
            </h2>
          </Reveal>
        </div>
        <StudioStrip />
        <Mark size={180} className="ix-studio-mark" />
      </section>

      <Testimonials />
      <Insights posts={posts} />
      <CtaBand />
    </Layout>
  );
}

export async function getStaticProps() {
  // Only ship what the cards render (no article bodies or author emails).
  const posts = (await getPublishedPosts({ max: 3 })).map((post) => ({
    slug: post.slug,
    title: post.title,
    category: post.category,
    coverImage: post.coverImage ? { url: post.coverImage.url, alt: post.coverImage.alt } : null,
    publishedAt: post.publishedAt,
    createdAt: post.createdAt
  }));
  return {
    props: { posts },
    revalidate: 300
  };
}
