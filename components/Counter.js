import { useEffect, useRef, useState } from "react";

export default function Counter({
  to,
  duration = 1700,
  prefix = "",
  suffix = "",
  decimals = 0
}) {
  const ref = useRef(null);
  const started = useRef(false);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    if (typeof IntersectionObserver === "undefined") {
      setValue(to);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started.current) {
            started.current = true;
            const start = performance.now();
            const step = (now) => {
              const progress = Math.min(1, (now - start) / duration);
              const eased = 1 - Math.pow(1 - progress, 3);
              setValue(to * eased);
              if (progress < 1) {
                requestAnimationFrame(step);
              } else {
                setValue(to);
              }
            };
            requestAnimationFrame(step);
          }
        });
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [to, duration]);

  const display = decimals
    ? value.toFixed(decimals)
    : Math.round(value).toLocaleString();

  return (
    <span ref={ref}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
