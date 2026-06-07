import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import SeoHead from "./SeoHead";
import SitePopup from "./SitePopup";
import NewsletterForm from "./NewsletterForm";
import { SOCIAL_PROFILES } from "../lib/site";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Work" },
  { href: "/blog", label: "Blog" },
  { href: "/creacity", label: "Tips & Tricks" },
  { href: "/contact", label: "Contact" }
];

const serviceLinks = [
  { label: "Strategy & GTM", slug: "strategy-go-to-market" },
  { label: "Brand & Positioning", slug: "brand-strategy-positioning" },
  { label: "Creative Studio", slug: "creative-design-studio" },
  { label: "Performance Marketing", slug: "performance-marketing" },
  { label: "Funnels & Lead Gen", slug: "lead-generation-funnels" }
];

const DEFAULT_DESCRIPTION =
  "Imagicity is a creative marketing agency blending strategy, storytelling, and performance to launch, grow, and scale bold brands.";

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
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const top = window.scrollY;
      const height =
        document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(top > 24);
      setProgress(height > 0 ? Math.min(1, top / height) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [router.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <div className="page-shell">
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

      <div className="scroll-progress" style={{ transform: `scaleX(${progress})` }} />

      <div className="bg-mesh" aria-hidden="true">
        <span className="orb orb-violet" />
        <span className="orb orb-pink" />
        <span className="orb orb-aqua" />
        <span className="grain" />
      </div>

      <header className={`site-header ${scrolled ? "scrolled" : ""}`}>
        <div className="header-inner">
          <Link href="/" className="brand" aria-label="Imagicity home">
            <Image
              src="/ICONS/SSA.png"
              alt=""
              width={40}
              height={40}
              className="brand-mark"
              priority
            />
            <span className="brand-word">Imagicity</span>
          </Link>

          <nav className="nav-pill" aria-label="Primary">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link ${isActive(link.href) ? "active" : ""}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <Link href="/contact" className="btn btn-glow header-cta">
            Start a project
          </Link>

          <button
            type="button"
            className={`menu-toggle ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <span />
            <span />
          </button>
        </div>
      </header>

      <div
        id="mobile-menu"
        className={`mobile-menu ${menuOpen ? "open" : ""}`}
        aria-hidden={!menuOpen}
      >
        <nav className="mobile-links">
          {navLinks.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              className={`mobile-link ${isActive(link.href) ? "active" : ""}`}
              style={{ transitionDelay: `${120 + index * 60}ms` }}
            >
              <span className="mobile-link-index">
                {String(index + 1).padStart(2, "0")}
              </span>
              {link.label}
            </Link>
          ))}
        </nav>
        <Link href="/contact" className="btn btn-glow mobile-cta">
          Start a project
        </Link>
        <div className="mobile-meta">
          <a href="mailto:connect@imagicity.in">connect@imagicity.in</a>
          <span>Hyderabad · Bengaluru · Dubai</span>
        </div>
      </div>

      <main>{children}</main>

      <footer className="site-footer">
        <div className="footer-glow" aria-hidden="true" />

        <div className="footer-news">
          <div className="footer-news-inner">
            <div className="footer-news-copy">
              <h3>Never miss a playbook.</h3>
              <p>
                Get our latest marketing insights and new articles delivered straight to your
                inbox. No spam, unsubscribe anytime.
              </p>
            </div>
            <NewsletterForm />
          </div>
        </div>

        <div className="footer-top">
          <div className="footer-brand">
            <Link href="/" className="brand">
              <Image
                src="/ICONS/SSA.png"
                alt=""
                width={44}
                height={44}
                className="brand-mark"
              />
              <span className="brand-word">Imagicity</span>
            </Link>
            <p>
              A creative marketing agency helping ambitious brands build
              authority, acquire customers, and scale with clarity.
            </p>
            <div className="footer-socials">
              {SOCIAL_PROFILES.map((social) => (
                <a
                  key={social.name}
                  href={social.url || "#"}
                  aria-label={social.name}
                  {...(social.url
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  {social.name}
                </a>
              ))}
            </div>
          </div>

          <div className="footer-col">
            <h4>Explore</h4>
            <ul>
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h4>Services</h4>
            <ul>
              {serviceLinks.map((service) => (
                <li key={service.slug}>
                  <Link href={`/services/${service.slug}`}>{service.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h4>Get in touch</h4>
            <ul className="footer-contact">
              <li>
                <a href="mailto:connect@imagicity.in">connect@imagicity.in</a>
              </li>
              <li>
                <a href="tel:+919122289578">+91 91222 89578</a>
              </li>
              <li>Hyderabad · Bengaluru · Dubai</li>
            </ul>
            <Link href="/contact" className="btn btn-outline footer-cta">
              Make a request
            </Link>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Imagicity. All rights reserved.</span>
          <nav className="footer-legal" aria-label="Legal">
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
          </nav>
          <span className="footer-tag">Strategy · Creative · Performance</span>
        </div>
      </footer>

      <SitePopup />
    </div>
  );
}
