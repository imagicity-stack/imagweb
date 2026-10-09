import { useEffect, useRef } from "react";
import Link from "next/link";
import Img from "./Img";

// Pinned horizontal gallery: on desktop the section is made tall enough that
// scrolling down slides the track sideways (sticky + translate3d, updated in a
// single rAF). On touch / small screens it falls back to a native swipe row.
export default function WorkRail({ projects, children }) {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return undefined;

    const desktop = window.matchMedia("(min-width: 980px) and (prefers-reduced-motion: no-preference)");
    let distance = 0;
    let frame = 0;
    let active = false;

    const measure = () => {
      if (!desktop.matches) {
        section.style.height = "";
        track.style.transform = "";
        section.classList.remove("is-pinned");
        return;
      }
      section.classList.add("is-pinned");
      distance = Math.max(0, track.scrollWidth - window.innerWidth);
      section.style.height = `${window.innerHeight + distance}px`;
      update();
    };

    const update = () => {
      frame = 0;
      if (!desktop.matches) return;
      const rect = section.getBoundingClientRect();
      const span = section.offsetHeight - window.innerHeight;
      const progress = span > 0 ? Math.min(1, Math.max(0, -rect.top / span)) : 0;
      track.style.transform = `translate3d(${(-progress * distance).toFixed(1)}px,0,0)`;
      section.style.setProperty("--rail", progress.toFixed(4));
    };

    const onScroll = () => {
      if (active && !frame) frame = requestAnimationFrame(update);
    };

    const gate = new IntersectionObserver(([entry]) => {
      active = entry.isIntersecting;
      if (active) onScroll();
    });
    gate.observe(section);

    const resize = new ResizeObserver(measure);
    resize.observe(track);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", onScroll, { passive: true });
    desktop.addEventListener?.("change", measure);
    measure();

    return () => {
      gate.disconnect();
      resize.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", onScroll);
      desktop.removeEventListener?.("change", measure);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section className="ix-rail" ref={sectionRef}>
      <div className="ix-rail-sticky">
        {children}
        <div className="ix-rail-viewport">
          <div className="ix-rail-track" ref={trackRef}>
            {projects.map((project, index) => (
              <Link
                href="/portfolio"
                key={project.slug}
                className={`ix-rail-card tone-${project.tone}`}
                data-cursor="view"
              >
                <div className="ix-rail-media">
                  <Img
                    id={project.image}
                    alt={`${project.title} campaign visual`}
                    width={720}
                    ratio={0.8}
                    sizes="(max-width: 980px) 80vw, 34vw"
                  />
                  <span className="ix-rail-num">{String(index + 1).padStart(2, "0")}</span>
                  <span className="ix-rail-result">
                    <strong>{project.result}</strong>
                    {project.metric}
                  </span>
                </div>
                <div className="ix-rail-info">
                  <div>
                    <h3>{project.title}</h3>
                    <span>{project.tags.slice(0, 2).join(" & ")}</span>
                  </div>
                  <span className="ix-arrow" aria-hidden="true">→</span>
                </div>
              </Link>
            ))}
            <Link href="/portfolio" className="ix-rail-end" data-cursor="view">
              <span>See all</span>
              <strong>the work</strong>
              <span className="ix-arrow" aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
        <div className="container">
          <span className="ix-rail-progress" aria-hidden="true">
            <i />
          </span>
        </div>
      </div>
    </section>
  );
}
