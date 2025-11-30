"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";

const links = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Work", href: "#work" },
  { label: "Contact", href: "#contact" }
];

export default function MenuOverlay({
  open,
  onClose
}: {
  open: boolean;
  onClose: () => void;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = overlayRef.current;
    if (!container) return;

    gsap.set(container, { xPercent: 100 });
    const items = container.querySelectorAll("[data-link]");

    if (open) {
      gsap.to(container, {
        xPercent: 0,
        duration: 0.9,
        ease: "power4.out"
      });
      gsap.fromTo(
        items,
        { x: 40, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.08,
          delay: 0.2
        }
      );
    } else {
      gsap.to(container, {
        xPercent: 100,
        duration: 0.9,
        ease: "power4.inOut"
      });
    }
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={overlayRef}
          className="fixed inset-0 z-20 flex bg-black/90 text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="flex-1 bg-gradient-to-r from-cyan-500/10 via-transparent to-transparent" />
          <div className="flex flex-1 flex-col justify-center gap-6 px-10">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-100/70">Navigate</p>
            <div className="space-y-4 text-4xl font-semibold sm:text-5xl">
              {links.map((link) => (
                <Link
                  data-link
                  key={link.label}
                  href={link.href}
                  onClick={onClose}
                  className="group flex items-center gap-4"
                >
                  <span className="h-[2px] w-8 bg-white/20 transition-all group-hover:w-12 group-hover:bg-cyan-300" />
                  <span className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:text-cyan-200">
                    {link.label}
                  </span>
                </Link>
              ))}
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {["Strategy", "Design", "Development", "Campaigns"].map((item) => (
                <div
                  key={item}
                  className="glass gradient-border relative rounded-2xl px-4 py-3 text-sm text-white/80"
                >
                  {item}
                  <span className="absolute right-4 top-4 h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_20px_rgba(29,229,255,0.8)]" />
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
