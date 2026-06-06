import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import SeoHead from "../SeoHead";

const navLinks = [
  { href: "/blog", label: "Latest" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Work" },
  { href: "/about", label: "About" }
];

// Light, editorial "news channel" layout for the public blog. Scoped under the
// .news class and a body.theme-news class so it never affects the dark
// marketing site.
export default function NewsLayout({ children, ...seo }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    document.body.classList.add("theme-news");
    return () => document.body.classList.remove("theme-news");
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const height = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(height > 0 ? Math.min(1, window.scrollY / height) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="news">
      <SeoHead {...seo} />

      <div className="news-progress" style={{ transform: `scaleX(${progress})` }} />

      <header className="news-header">
        <div className="news-header-inner">
          <Link href="/" className="news-brand" aria-label="Imagicity home">
            <span className="news-brand-mark">
              <Image src="/ICONS/SSA.png" alt="" width={28} height={28} />
            </span>
            <span className="news-brand-word">Imagicity</span>
          </Link>

          <nav className="news-nav" aria-label="Blog">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </nav>

          <Link href="/contact" className="news-header-cta">
            Start a project
          </Link>
        </div>
      </header>

      <main className="news-main">{children}</main>

      <footer className="news-footer">
        <div className="news-footer-inner">
          <Link href="/" className="news-brand">
            <span className="news-brand-mark dark">
              <Image src="/ICONS/SSA.png" alt="" width={26} height={26} />
            </span>
            <span className="news-brand-word">Imagicity</span>
          </Link>
          <nav className="news-footer-nav">
            <Link href="/blog">Blog</Link>
            <Link href="/services">Services</Link>
            <Link href="/portfolio">Work</Link>
            <Link href="/contact">Contact</Link>
          </nav>
          <span className="news-footer-copy">
            © {new Date().getFullYear()} Imagicity. Strategy · Creative · Performance
          </span>
        </div>
      </footer>
    </div>
  );
}
