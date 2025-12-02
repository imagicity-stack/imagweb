"use client";

import { ReactNode, useEffect, useState } from "react";
import Lenis from "@studio-freight/lenis";
import Cursor from "./Cursor";
import NoiseOverlay from "./NoiseOverlay";
import Navigation from "./Navigation";
import Preloader from "./Preloader";

export default function ClientRoot({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [enableCursor, setEnableCursor] = useState(false);
  const [enableLenis, setEnableLenis] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarsePointer = window.matchMedia("(pointer: coarse)");

    const updateFlags = () => {
      const allowMotion = !prefersReducedMotion.matches;
      const allowDesktopFeatures = !coarsePointer.matches;
      setEnableCursor(allowMotion && allowDesktopFeatures);
      setEnableLenis(allowMotion && allowDesktopFeatures);
    };

    updateFlags();
    prefersReducedMotion.addEventListener("change", updateFlags);
    coarsePointer.addEventListener("change", updateFlags);

    return () => {
      prefersReducedMotion.removeEventListener("change", updateFlags);
      coarsePointer.removeEventListener("change", updateFlags);
    };
  }, []);

  useEffect(() => {
    if (!enableLenis) return;

    const lenis = new Lenis({
      smoothWheel: true,
      lerp: 0.1,
      wheelMultiplier: 0.85,
      touchMultiplier: 0.9,
      duration: 1.1
    });

    let animationFrame: number;
    const raf = (time: number) => {
      lenis.raf(time);
      animationFrame = requestAnimationFrame(raf);
    };

    animationFrame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationFrame);
      lenis.destroy();
    };
  }, [enableLenis]);

  return (
    <>
      <Preloader />
      <NoiseOverlay />
      {enableCursor && <Cursor />}
      <Navigation
        open={menuOpen}
        onToggle={() => setMenuOpen((prev) => !prev)}
        onClose={() => setMenuOpen(false)}
      />
      <div className="relative z-10 overflow-hidden">{children}</div>
    </>
  );
}
