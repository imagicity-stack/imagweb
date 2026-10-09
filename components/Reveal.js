import { useEffect, useRef, useState } from "react";

// One IntersectionObserver shared by every Reveal on the page instead of one
// per element, so long pages with dozens of animated blocks stay cheap.
let sharedObserver = null;
const callbacks = new Map();

function getObserver() {
  if (typeof IntersectionObserver === "undefined") return null;
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const done = callbacks.get(entry.target);
          sharedObserver.unobserve(entry.target);
          callbacks.delete(entry.target);
          if (done) done();
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
  }
  return sharedObserver;
}

export function useInView(ref) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const observer = getObserver();
    if (!observer) {
      setInView(true);
      return undefined;
    }
    callbacks.set(el, () => setInView(true));
    observer.observe(el);
    return () => {
      observer.unobserve(el);
      callbacks.delete(el);
    };
  }, [ref]);

  return inView;
}

export default function Reveal({
  children,
  as: Tag = "div",
  delay = 0,
  variant = "up",
  className = "",
  style,
  ...rest
}) {
  const ref = useRef(null);
  const shown = useInView(ref);

  return (
    <Tag
      ref={ref}
      className={`reveal reveal-${variant} ${shown ? "in" : ""} ${className}`.trim()}
      style={{ "--d": `${delay}ms`, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
