import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import { useRouter } from "next/router";
import { SITE_NAME, DEFAULT_OG_IMAGE, absoluteUrl } from "../lib/site";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Work" },
  { href: "/blog", label: "Blog" },
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
  const canonicalUrl =
    canonical || absoluteUrl((router.asPath || "/").split("?")[0].split("#")[0]);
  const resolvedOgImage = ogImage ? absoluteUrl(ogImage) : DEFAULT_OG_IMAGE;
  const jsonLdItems = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);

  const pageTitle = title
    ? `${title} · ${SITE_NAME}`
    : `${SITE_NAME} — Creative Marketing Agency`;

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
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="robots"
          content={noindex ? "noindex, follow" : "index, follow, max-image-preview:large"}
        />
        {keywords ? <meta name="keywords" content={keywords} /> : null}
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content={ogType} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={resolvedOgImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={resolvedOgImage} />
        {article ? (
          <>
            {article.publishedTime ? (
              <meta property="article:published_time" content={article.publishedTime} />
            ) : null}
            {article.modifiedTime ? (
              <meta property="article:modified_time" content={article.modifiedTime} />
            ) : null}
            {article.author ? (
              <meta property="article:author" content={article.author} />
            ) : null}
            {article.section ? (
              <meta property="article:section" content={article.section} />
            ) : null}
            {(article.tags || []).map((tag) => (
              <meta key={tag} property="article:tag" content={tag} />
            ))}
          </>
        ) : null}
        {jsonLdItems.map((item, index) => (
          <script
            key={`jsonld-${index}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
          />
        ))}
      </Head>

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
                className={`nav-link ${
                  router.pathname === link.href ? "active" : ""
                }`}
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
              className={`mobile-link ${
                router.pathname === link.href ? "active" : ""
              }`}
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
              {["Instagram", "LinkedIn", "X", "YouTube"].map((social) => (
                <a key={social} href="#" aria-label={social}>
                  {social}
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
          <span className="footer-tag">Strategy · Creative · Performance</span>
        </div>
      </footer>
    </div>
  );
}
