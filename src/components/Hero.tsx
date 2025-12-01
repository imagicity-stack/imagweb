"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MagneticButton from "./MagneticButton";
import TextRing from "./TextRing";
import FloatingShapes from "./FloatingShapes";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollY, [0, 600], [0, -120]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-hero-kicker]", {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: "power3.out"
      });
      gsap.from("[data-hero-title]", {
        opacity: 0,
        y: 60,
        duration: 1,
        ease: "power3.out",
        delay: 0.1
      });
      gsap.from("[data-hero-cta]", {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.12,
        delay: 0.4
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="home"
      ref={ref}
      className="relative overflow-hidden px-4 pb-24 pt-36 sm:px-8 lg:px-16"
    >
      <FloatingShapes />
      <motion.div
        style={{ y }}
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(29,229,255,0.2),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(29,229,255,0.15),transparent_40%)]"
      />
      <div className="glass gradient-border relative mb-10 inline-flex items-center gap-3 rounded-full px-4 py-2" data-hero-kicker>
        <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_20px_rgba(29,229,255,0.8)]" />
        <span className="text-xs uppercase tracking-[0.3em] text-white/70">Brand strategy • Campaigns • Growth</span>
      </div>
      <div className="grid gap-10 lg:grid-cols-[3fr_2fr] lg:items-center">
        <div className="space-y-8">
          <h1
            data-hero-title
            className="text-balance text-4xl font-semibold leading-[1.05] sm:text-5xl lg:text-6xl"
          >
            Creative marketing teams that ship conversion-ready brand experiences.
          </h1>
          <p className="max-w-2xl text-lg text-white/70">
            We pair GTM architecture with bold creative, building integrated campaigns, content engines, and high-speed digital
            experiences that move the funnel.
          </p>
          <div className="flex flex-wrap items-center gap-4" data-hero-cta>
            <MagneticButton>Start a project</MagneticButton>
            <MagneticButton className="bg-transparent hover:bg-white/10" href="#work">
              View work
            </MagneticButton>
            <div className="relative hidden sm:block">
              <TextRing />
            </div>
          </div>
          <div className="marquee gap-6 text-white/50">
            {["Product launches", "Integrated campaigns", "Content systems", "Conversion-focused web"].map((item) => (
              <div key={item} className="flex items-center gap-3 uppercase tracking-[0.3em]">
                <span className="h-[1px] w-10 bg-white/20" />
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="relative flex justify-center">
          <motion.div
            className="glass gradient-border relative w-full max-w-md overflow-hidden rounded-3xl p-8"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 via-transparent to-white/5" />
            <div className="relative space-y-4">
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-100/70">Marketing ops dashboard</p>
              <div className="space-y-3">
                <div className="glass gradient-border flex items-center justify-between rounded-2xl px-4 py-3">
                  <span className="text-sm text-white/70">Campaign pods</span>
                  <span className="text-lg font-semibold text-cyan-200">3 in market</span>
                </div>
                <div className="glass gradient-border flex items-center justify-between rounded-2xl px-4 py-3">
                  <span className="text-sm text-white/70">Response time</span>
                  <span className="text-lg font-semibold text-cyan-200">Under 2h</span>
                </div>
                <div className="glass gradient-border flex items-center justify-between rounded-2xl px-4 py-3">
                  <span className="text-sm text-white/70">Launch velocity</span>
                  <span className="text-lg font-semibold text-cyan-200">Sprint 06</span>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {[{ label: "Pipeline-ready leads", value: 82 }, { label: "Engagement lift", value: 68 }].map(({ label, value }) => (
                  <div key={label} className="glass gradient-border space-y-2 rounded-2xl p-4">
                    <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-white/60">
                      <span>{label}</span>
                      <span className="text-cyan-200">{value}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-300 via-white/60 to-cyan-500"
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="relative mt-4 overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-400/30 via-white/10 to-transparent p-6">
                <p className="text-xs uppercase tracking-[0.3em] text-white/60">Aurora stream</p>
                <div className="mt-4 h-24 overflow-hidden rounded-xl bg-black/60">
                  <motion.div
                    className="absolute inset-0 scale-110 bg-[radial-gradient(circle_at_30%_40%,rgba(29,229,255,0.2),transparent_30%),radial-gradient(circle_at_70%_60%,rgba(124,58,237,0.25),transparent_36%)]"
                    animate={{ x: ["-10%", "6%", "-8%"], y: ["-6%", "4%", "-6%"], rotate: [0, 4, -3, 0] }}
                    transition={{ duration: 10, ease: "easeInOut", repeat: Infinity }}
                  />
                  <svg className="relative h-full w-full text-cyan-200/70" viewBox="0 0 400 120" preserveAspectRatio="none">
                    <path
                      d="M0 60 Q80 20 160 60 T320 60 T400 60"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <animate
                        attributeName="d"
                        dur="5.4s"
                        repeatCount="indefinite"
                        values="M0 60 Q80 18 160 60 T320 60 T400 60; M0 60 Q80 90 160 60 T320 60 T400 60; M0 60 Q80 18 160 60 T320 60 T400 60"
                      />
                    </path>
                  </svg>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
