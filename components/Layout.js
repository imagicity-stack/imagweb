import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import SeoHead from "./SeoHead";
import SitePopup from "./SitePopup";
import NewsletterForm from "./NewsletterForm";
import Logo, { Mark } from "./Logo";
import { Asterisk, Sparkle } from "./Doodles";
import { SOCIAL_PROFILES, CONTACT_EMAIL, CONTACT_PHONE, LOCATIONS } from "../lib/site";

const navLinks = [
  { href: "/portfolio", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/creacity", label: "Tips & Tricks" },
  { href: "/contact", label: "Contact" }
];

const menuLinks = [{ href: "/", label: "Home" }, ...navLinks];

const serviceLinks = [
  { label: "Strategy & GTM", slug: "strategy-go-to-market" },
  { label: "Brand & Positioning", slug: "brand-strategy-positioning" },
  { label: "Creative Studio", slug: "creative-design-studio" },
  { label: "Performance Marketing", slug: "performance-marketing" },
  { label: "Funnels & Lead Gen", slug: "lead-generation-funnels" }
];

const GIANT = "IMAGICITY".split("");

const DEFAULT_DESCRIPTION =
  "Imagicity is a creative marketing agency blending strategy, storytelling, and performance to launch, grow, and scale bold brands.";

const telHref = `tel:${CONTACT_PHONE.replace(/[^+\d]/g, "")}`;

export default function Layout({
  children,
  title,
  description = DEFAULT_DESCRIPTION,
  canonical,
  ogType = "website",
  ogImage,
  keywords,
  noindex = false,
  article = null,
  jsonLd = null
}) {
  const router = useRouter();
  const isActive = (href) =>
    href === "/"
      ? router.pathname === "/"
      : router.pathname === href || router.pathname.startsWith(`${href}/`);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const progressRef = useRef(null);
  const menuOpenRef = useRef(false);

  // Scroll progress is written straight to the DOM (no re-render per scroll
  // event); React state only flips when the header actually changes mode.
  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
      }
      setScrolled(y > 24);
      if (!menuOpenRef.current) {
        if (y > 160 && y - lastY > 6) setHidden(true);
        else if (lastY - y > 6 || y < 160) setHidden(false);
      }
      lastY = y;
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setHidden(false);
  }, [router.asPath]);

  useEffect(() => {
    menuOpenRef.current = menuOpen;
    document.body.style.overflow = menuOpen ? "hidden" : "";
    if (!menuOpen) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <div className="page-shell ix">
      <SeoHead
        title={title}
        description={description}
        canonical={canonical}
        ogType={ogType}
        ogImage={ogImage}
        keywords={keywords}
        noindex={noindex}
        article={article}
        jsonLd={jsonLd}
      />

      <a href="#main" className="ix-skip">
        Skip to content
      </a>

      <div className="ix-progress" ref={progressRef} aria-hidden="true" />

      <header
        className={`ix-header ${scrolled ? "is-scrolled" : ""} ${
          hidden && !menuOpen ? "is-hidden" : ""
        } ${menuOpen ? "is-menu" : ""}`}
      >
        <div className="ix-header-inner">
          <Link href="/" className="ix-brand" aria-label="Imagicity home">
            <Logo size={34} />
          </Link>

          <nav className="ix-nav" aria-label="Primary">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`ix-nav-link ${isActive(link.href) ? "is-active" : ""}`}
                aria-current={isActive(link.href) ? "page" : undefined}
              >
                <span className="ix-roll" data-text={link.label}>
                  <span>{link.label}</span>
                </span>
              </Link>
            ))}
          </nav>

          <Link href="/contact" className="ix-btn ix-btn-ink ix-header-cta" data-magnetic>
            Let&apos;s work together <span className="ix-arrow">→</span>
          </Link>

          <button
            type="button"
            className={`ix-burger ${menuOpen ? "is-open" : ""}`}
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="ix-menu"
          >
            <span className="ix-burger-label">{menuOpen ? "Close" : "Menu"}</span>
            <span className="ix-burger-lines" aria-hidden="true">
              <i />
              <i />
            </span>
          </button>
        </div>
      </header>

      <div
        id="ix-menu"
        className={`ix-menu ${menuOpen ? "is-open" : ""}`}
        aria-hidden={!menuOpen}
        inert={menuOpen ? undefined : ""}
      >
        <span className="ix-menu-bg is-r" />
        <span className="ix-menu-bg is-y" />
        <div className="ix-menu-inner">
          <nav className="ix-menu-links" aria-label="Mobile">
            {menuLinks.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                className={`ix-menu-link ${isActive(link.href) ? "is-active" : ""}`}
                style={{ "--mi": index }}
              >
                <span className="ix-menu-index">{String(index + 1).padStart(2, "0")}</span>
                <span className="ix-menu-text">{link.label}</span>
              </Link>
            ))}
          </nav>
          <div className="ix-menu-foot">
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            <a href={telHref}>{CONTACT_PHONE}</a>
            <span>{LOCATIONS.join(" · ")}</span>
          </div>
          <Mark size={260} className="ix-menu-mark" />
        </div>
      </div>

      <main id="main">{children}</main>

      <footer className="ix-footer">
        <div className="container">
          <div className="ix-foot-news">
            <div className="ix-foot-news-copy">
              <span className="ix-script">Never miss a playbook</span>
              <h3>Loud ideas, straight to your inbox.</h3>
              <p>
                Our latest marketing insights and new articles. No spam, unsubscribe anytime.
              </p>
            </div>
            <NewsletterForm />
          </div>

          <div className="ix-foot-grid">
            <div className="ix-foot-brand">
              <Link href="/" aria-label="Imagicity home">
                <Logo size={40} />
              </Link>
              <p>
                A creative marketing agency helping ambitious brands build authority, win
                customers and scale with clarity.
              </p>
              {SOCIAL_PROFILES.length ? (
                <div className="ix-foot-socials">
                  {SOCIAL_PROFILES.map((social) => (
                    <a
                      key={social.name}
                      href={social.url}
                      aria-label={social.name}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {social.name}
                    </a>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="ix-foot-col">
              <h4>Navigate</h4>
              <ul>
                {menuLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="ix-foot-col">
              <h4>Services</h4>
              <ul>
                {serviceLinks.map((service) => (
                  <li key={service.slug}>
                    <Link href={`/services/${service.slug}`}>{service.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="ix-foot-col">
              <h4>Say hello</h4>
              <ul>
                <li>
                  <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
                </li>
                <li>
                  <a href={telHref}>{CONTACT_PHONE}</a>
                </li>
                <li>{LOCATIONS.join(" · ")}</li>
              </ul>
            </div>

            <div className="ix-foot-sticker" aria-hidden="true">
              <span>
                Strategy with purpose.
                <br />
                Creative with soul.
                <br />
                Results with noise.
              </span>
              <Asterisk size={34} color="#111" />
            </div>
          </div>
        </div>

        <div className="ix-foot-giant" aria-hidden="true">
          {GIANT.map((letter, index) => (
            <span key={`${letter}-${index}`} style={{ "--gi": index }}>
              {letter}
            </span>
          ))}
          <Sparkle size={64} className="ix-foot-giant-spark" />
        </div>

        <div className="container ix-foot-bottom">
          <span>© {new Date().getFullYear()} Imagicity. All rights reserved.</span>
          <nav className="ix-foot-legal" aria-label="Legal">
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
          </nav>
          <span className="ix-foot-made">Made loud in Hyderabad</span>
        </div>
      </footer>

      <SitePopup />
    </div>
  );
}
