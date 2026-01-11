import Link from "next/link";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/contact", label: "Contact" }
];

export default function Layout({ children }) {
  return (
    <div className="page">
      <header className="site-header">
        <div className="logo-chip">Imagicity</div>
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
      </header>
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
          <p>hello@imagicity.com</p>
          <p>+91 90000 00000</p>
          <p>Hyderabad · Bengaluru · Dubai</p>
        </div>
      </footer>
    </div>
  );
}
