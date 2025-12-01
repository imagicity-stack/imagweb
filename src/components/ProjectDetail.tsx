"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import MagneticButton from "./MagneticButton";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ProjectDetail({
  project
}: {
  project: {
    title: string;
    summary: string;
    tags: string[];
    highlight: string;
  };
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-project-block]", {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.15,
        scrollTrigger: {
          trigger: ref.current,
          start: "top 80%"
        }
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="px-4 pb-24 pt-28 sm:px-8 lg:px-16">
      <div className="flex items-center justify-between gap-4">
        <Link href="#work" className="text-sm uppercase tracking-[0.2em] text-white/60">
          ← Back to work
        </Link>
        <MagneticButton className="bg-white/10">Book this format</MagneticButton>
      </div>
      <div className="mt-8 grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <motion.h1
            className="text-4xl font-semibold sm:text-5xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {project.title}
          </motion.h1>
          <p className="text-lg text-white/70">{project.summary}</p>
          <div className="flex flex-wrap gap-3 text-sm uppercase tracking-[0.2em] text-orange-100/80">
            {project.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-white/5 px-3 py-1">
                {tag}
              </span>
            ))}
          </div>
          <div className="relative h-72 overflow-hidden rounded-3xl bg-gradient-to-br from-orange-400/25 via-rose-200/15 to-black/30">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,133,95,0.32),transparent_45%),radial-gradient(circle_at_80%_20%,rgba(244,114,182,0.22),transparent_45%)]" />
            <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-white/5 via-orange-300/12 to-transparent" />
          </div>
        </div>
        <div className="glass gradient-border h-fit rounded-3xl p-6" data-project-block>
          <p className="text-sm uppercase tracking-[0.3em] text-orange-100/80">Outcome</p>
          <p className="mt-3 text-lg text-white/80">{project.highlight}</p>
          <div className="mt-6 space-y-4 text-sm text-white/70">
            <div className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
              <span>Launch velocity</span>
              <span className="text-orange-200">4 weeks</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
              <span>Motion fidelity</span>
              <span className="text-orange-200">GSAP + Framer</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
              <span>Conversion lift</span>
              <span className="text-orange-200">+30%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
