"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import MenuOverlay from "./MenuOverlay";

const navLinks = ["Home", "About", "Services", "Work", "Contact"];

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
            <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400/70 to-white/10 text-lg font-semibold">
              IW
            </span>
            <div className="hidden sm:block">
              <p className="text-sm uppercase tracking-[0.2em] text-cyan-100/80">Imaginary Works</p>
              <p className="text-xs text-white/50">Creative Marketing Agency</p>
            </div>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm uppercase tracking-[0.16em] text-white/70">
            {navLinks.map((link) => (
              <Link
                key={link}
                href={`#${link.toLowerCase()}`}
                className="group relative transition-colors duration-300 hover:text-white"
              >
                {link}
                <span className="absolute left-0 -bottom-1 h-px w-full scale-x-0 bg-cyan-300 transition-transform duration-300 ease-out group-hover:scale-x-100" />
              </Link>
            ))}
          </div>
          <button
            data-magnetic
            onClick={onToggle}
            className="relative flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-white shadow-[0_10px_45px_rgba(0,0,0,0.4)] transition-all hover:bg-white/10"
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          >
            <motion.div
              animate={{ rotate: open ? 45 : 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="h-5 w-5"
            >
              <span className="absolute left-1/2 top-1/2 block h-[2px] w-5 -translate-x-1/2 -translate-y-1/2 bg-white" />
              <span
                className="absolute left-1/2 top-1/2 block h-[2px] w-5 -translate-x-1/2 -translate-y-1/2 bg-white"
                style={{ rotate: open ? "90deg" : "0deg", transformOrigin: "center" }}
              />
            </motion.div>
          </button>
        </div>
      </div>
      <MenuOverlay open={open} onClose={onClose} />
    </>
  );
}
