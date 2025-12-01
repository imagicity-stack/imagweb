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
  { label: "Blog", href: "/blog" },
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
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEsc);

    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  useEffect(() => {
    const container = overlayRef.current;
    if (!container) return;
    const ctx = gsap.context(() => {
      const items = container.querySelectorAll("[data-link]");
      const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (open) {
        timeline
          .set(container, { xPercent: 100, scale: 0.96, rotate: -3 })
          .to(container, { xPercent: 0, scale: 1, rotate: 0, duration: 0.9, ease: "power4.out" })
          .fromTo(
            items,
            { x: 40, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.8, stagger: 0.08, delay: 0.1 },
            "<"
          );
      } else {
        timeline.to(container, { xPercent: 110, scale: 0.94, rotate: 3, duration: 0.75, ease: "power4.inOut" });
      }
    }, container);

    return () => ctx.revert();
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={overlayRef}
          className="fixed inset-0 z-20 flex overflow-hidden bg-black/90 text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            aria-hidden
            className="absolute inset-0 opacity-70"
            animate={{ backgroundPosition: ["0% 0%", "120% 60%", "0% 0%"], rotate: [0, 2, -2, 0] }}
            transition={{ duration: 14, ease: "easeInOut", repeat: Infinity }}
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 30%, rgba(255,133,95,0.22), transparent 30%), radial-gradient(circle at 80% 70%, rgba(244,114,182,0.26), transparent 32%)"
            }}
          />
          <div className="flex-1 bg-gradient-to-r from-orange-400/15 via-transparent to-transparent backdrop-blur-[2px]" />
          <div className="relative flex flex-1 flex-col justify-center gap-6 px-10">
            <p className="text-sm uppercase tracking-[0.3em] text-orange-100/80">Navigate</p>
            <div className="space-y-4 text-4xl font-semibold sm:text-5xl">
              {links.map((link) => (
                <Link
                  data-link
                  key={link.label}
                  href={link.href}
                  onClick={onClose}
                  className="group flex items-center gap-4"
                >
                  <span className="h-[2px] w-8 bg-white/20 transition-all group-hover:w-12 group-hover:bg-orange-300" />
                  <span className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:text-orange-200">
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
                  <span className="absolute right-4 top-4 h-2 w-2 rounded-full bg-orange-300 shadow-[0_0_20px_rgba(255,133,95,0.8)]" />
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
