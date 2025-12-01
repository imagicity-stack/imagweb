"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import clsx from "clsx";

export default function MagneticButton({
  children,
  className,
  href
}: {
  children: React.ReactNode;
  className?: string;
  href?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMove = (event: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = event.clientX - (rect.left + rect.width / 2);
      const y = event.clientY - (rect.top + rect.height / 2);
      el.style.transform = `translate(${x * 0.08}px, ${y * 0.08}px)`;
    };
    const reset = () => {
      el.style.transform = "translate(0px, 0px)";
    };

    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", reset);
    return () => {
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseleave", reset);
    };
  }, []);

  const content = (
    <motion.div
      ref={ref}
      data-magnetic
      className={clsx(
        "group magnetic relative inline-flex items-center gap-3 overflow-hidden rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white shadow-[0_18px_60px_rgba(0,0,0,0.35)] transition-colors hover:border-orange-300 hover:bg-orange-400/20",
        className
      )}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
    >
      <span className="absolute inset-0 bg-gradient-to-r from-orange-400/35 via-amber-200/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <span className="relative z-10">{children}</span>
      <span className="relative z-10 h-2 w-2 rounded-full bg-orange-300 shadow-[0_0_20px_rgba(255,133,95,0.8)]" />
    </motion.div>
  );

  if (href) {
    return (
      <a href={href} className="group inline-block">
        {content}
      </a>
    );
  }

  return content;
}
