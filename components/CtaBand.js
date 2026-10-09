import Link from "next/link";
import Reveal from "./Reveal";
import { Burst, Sparkle } from "./Doodles";

// The loud red "let's do this" band that closes most marketing pages.
export default function CtaBand({
  kicker = "Ready to build a brand",
  title = "That means business?",
  text = "Let's create something unforgettable together. Tell us where you are and where you want to be.",
  primary = { href: "/contact", label: "Let's start a project" },
  secondary = null
}) {
  return (
    <section className="ix-cta">
      <div className="ix-cta-shapes" aria-hidden="true">
        <Burst size={140} className="ix-cta-burst" color="#FAE80C" />
        <Sparkle size={46} className="ix-cta-sparkle" color="#111" />
      </div>
      <div className="container ix-cta-inner">
        <Reveal className="ix-cta-copy">
          <span className="ix-script ix-cta-kicker">{kicker}</span>
          <h2 className="ix-cta-title">{title}</h2>
        </Reveal>
        <Reveal className="ix-cta-side" delay={120}>
          <p>{text}</p>
          <div className="ix-cta-actions">
            <Link href={primary.href} className="ix-btn ix-btn-ink" data-magnetic>
              {primary.label} <span className="ix-arrow">→</span>
            </Link>
            {secondary ? (
              <Link href={secondary.href} className="ix-link-under">
                {secondary.label}
              </Link>
            ) : null}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
