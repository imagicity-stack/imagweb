import { useState } from "react";
import Link from "next/link";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/contact", label: "Contact" }
];

export default function Layout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="page">
      <header className="site-header">
        <Link href="/" className="logo-chip">
          Imagicity
        </Link>
        <nav className="nav-pill">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="nav-link">
              {link.label}
            </Link>
          ))}
        </nav>
        <Link href="/contact" className="cta-pill">
          Request
        </Link>
        <button
          type="button"
          className="menu-toggle"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Open menu"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          <span />
          <span />
          <span />
        </button>
      </header>
      <div
        className={`menu-overlay ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden={!menuOpen}
      />
      <aside
        id="mobile-menu"
        className={`mobile-menu ${menuOpen ? "open" : ""}`}
      >
        <nav className="mobile-menu-links">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="mobile-nav-link"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/contact"
          className="button-primary mobile-request"
          onClick={() => setMenuOpen(false)}
        >
          Request
        </Link>
      </aside>
      <main>{children}</main>
      <footer className="site-footer">
        <div>
          <h3>Imagicity</h3>
          <p>
            A creative marketing agency helping ambitious brands build authority,
            acquire customers, and scale with clarity.
          </p>
        </div>
        <div>
          <h4>Quick Links</h4>
          <ul>
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4>Contact</h4>
          <p>connect@imagicity.in</p>
          <p>+91 9122289578</p>
          <p>Hyderabad · Bengaluru · Dubai</p>
          <div className="social-links">
            <a
              href="https://www.instagram.com/imagicity.in"
              target="_blank"
              rel="noreferrer"
              className="social-link"
              aria-label="Follow Imagicity on Instagram"
            >
              <img src="/instagram.svg" alt="Instagram" width="20" height="20" />
              <span>Instagram</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
