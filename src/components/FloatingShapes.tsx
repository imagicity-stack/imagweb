"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function FloatingShapes() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to("[data-floating]", {
        y: (index) => (index % 2 === 0 ? 16 : -16),
        x: (index) => (index % 2 === 0 ? -10 : 10),
        rotate: 6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        duration: 3.6,
        stagger: 0.4
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div
        data-floating
        className="absolute left-12 top-20 h-32 w-32 rounded-full bg-orange-400/15 blur-3xl"
      />
      <div
        data-floating
        className="absolute right-16 top-1/3 h-28 w-28 rounded-full bg-white/10 blur-3xl"
      />
      <div
        data-floating
        className="absolute bottom-12 left-1/2 h-36 w-36 -translate-x-1/2 rounded-full bg-rose-400/15 blur-3xl"
      />
    </div>
  );
}
