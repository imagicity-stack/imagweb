import Img from "./Img";
import { Burst, Scribble, Sparkle, SpinBadge } from "./Doodles";

// Inner-page hero: stacked display lines with a red marker word, plus a fan
// of tilted photos and stickers. Animations hang off --intro-delay so they
// wait for the opener / page wipe to clear before playing.
export default function PageHero({
  label,
  lines = [],
  script,
  text,
  images = [],
  badge = "Imagicity • Make some noise • ",
  children
}) {
  const scriptDelay = 80 + lines.length * 100;
  return (
    <section className="ix-phero">
      <div className="container ix-phero-grid">
        <div className="ix-phero-copy">
          <span className="ix-label ix-hero-in" style={{ "--hd": "0ms" }}>
            {label}
          </span>
          <h1 className="ix-hero-title is-page">
            {lines.map((line, index) => (
              <span className="ix-hl" key={line}>
                <span className="ix-hl-in" style={{ "--hd": `${80 + index * 100}ms` }}>
                  {line}
                </span>
              </span>
            ))}
            {script ? (
              <span className="ix-hl ix-hl-script">
                <span className="ix-hl-in" style={{ "--hd": `${scriptDelay}ms` }}>
                  {script}
                </span>
                <Scribble className="ix-hero-scribble" color="#111" />
              </span>
            ) : null}
          </h1>
          {text ? (
            <p className="ix-hero-sub ix-hero-in" style={{ "--hd": `${scriptDelay + 150}ms` }}>
              {text}
            </p>
          ) : null}
          {children ? (
            <div className="ix-hero-in" style={{ "--hd": `${scriptDelay + 260}ms` }}>
              {children}
            </div>
          ) : null}
        </div>

        <div className="ix-phero-art">
          {images.map((image, index) => (
            <figure className={`ix-phero-photo is-${index}`} key={image.id}>
              <Img
                id={image.id}
                alt={image.alt}
                width={560}
                ratio={index === 0 ? 1.2 : 0.95}
                priority={index === 0}
                sizes="(max-width: 980px) 55vw, 26vw"
              />
              {image.caption ? <figcaption>{image.caption}</figcaption> : null}
            </figure>
          ))}
          <Burst className="ix-phero-burst" size={120} />
          <Sparkle className="ix-phero-sparkle" size={44} color="#ED2041" />
          <SpinBadge className="ix-phero-badge" size={118} text={badge} />
        </div>
      </div>
    </section>
  );
}
