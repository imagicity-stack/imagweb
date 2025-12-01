"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import MenuOverlay from "./MenuOverlay";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Work", href: "#work" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "#contact" }
];

export default function Navigation({
  open,
  onToggle,
  onClose
}: {
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
}) {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(barRef.current, {
        y: -40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      });
    }, barRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <div
        ref={barRef}
        className="fixed top-0 left-0 right-0 z-30 px-4 py-4 lg:px-10"
      >
        <div className="glass gradient-border flex items-center justify-between rounded-full px-5 py-3">
          <Link href="#home" className="flex items-center gap-3" aria-label="Go to home">
            <span className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-orange-400/70 via-white/10 to-rose-400/70 text-lg font-semibold uppercase tracking-[0.18em]">
              <motion.span
                className="absolute inset-0 bg-gradient-to-br from-orange-300/30 via-transparent to-rose-200/25"
                animate={{ rotate: 360 }}
                transition={{ duration: 12, ease: "linear", repeat: Infinity }}
              />
              <span className="relative">IM</span>
            </span>
            <div className="hidden sm:block">
              <p className="text-sm uppercase tracking-[0.2em] text-orange-100/80">Imagicity</p>
              <p className="text-xs text-white/50">Creative Marketing Studio</p>
            </div>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm uppercase tracking-[0.16em] text-white/70">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="group relative transition-colors duration-300 hover:text-white"
              >
                {link.label}
                <span className="absolute left-0 -bottom-1 h-px w-full scale-x-0 bg-orange-300 transition-transform duration-300 ease-out group-hover:scale-x-100" />
              </Link>
            ))}
          </div>
          <motion.button
            type="button"
            data-magnetic
            onClick={onToggle}
            aria-expanded={open}
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="group relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-white/5 text-white shadow-[0_10px_45px_rgba(0,0,0,0.4)] transition-all hover:bg-white/10"
          >
            <motion.span
              className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,133,95,0.18),transparent_40%),radial-gradient(circle_at_70%_70%,rgba(244,114,182,0.22),transparent_45%)]"
              animate={{ rotate: [0, 6, 0, -4, 0], scale: [1, 1.03, 1.01, 1.04, 1] }}
              transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
            />
            <motion.div
              initial="closed"
              animate={open ? "open" : "closed"}
              variants={{
                closed: { rotate: 0 },
                open: { rotate: 0 }
              }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="relative flex h-6 w-6 items-center justify-center"
            >
              {["top", "middle", "bottom"].map((position, index) => (
                <motion.span
                  key={position}
                  className="absolute left-1/2 block h-[2px] origin-center rounded-full bg-white"
                  style={{ width: position === "middle" ? "1.4rem" : "1.25rem" }}
                  variants={{
                    closed: {
                      rotate: 0,
                      y: position === "top" ? -6 : position === "bottom" ? 6 : 0,
                      x: 0,
                      opacity: 1
                    },
                    open: {
                      rotate: index === 0 ? 42 : index === 2 ? -42 : 0,
                      y: 0,
                      x: index === 1 ? -4 : 0,
                      opacity: index === 1 ? 0 : 1
                    }
                  }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                />
              ))}
            </motion.div>
            <motion.span
              className="absolute inset-0 rounded-full border border-white/10"
              animate={{ opacity: [0.25, 0.6, 0.25] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.button>
        </div>
      </div>
      <MenuOverlay open={open} onClose={onClose} />
    </>
  );
}
