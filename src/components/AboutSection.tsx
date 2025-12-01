"use client";

import { motion } from "framer-motion";
import { team, timeline } from "@/data/content";
import FloatingShapes from "./FloatingShapes";

export default function AboutSection() {
  return (
    <section id="about" className="relative overflow-hidden px-4 py-24 sm:px-8 lg:px-16">
      <FloatingShapes />
      <div className="glass gradient-border relative rounded-3xl p-10">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-xl">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-100/70">About the agency</p>
            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Creative marketing studio moving faster than the brief.</h2>
            <p className="mt-4 text-white/70">
              Strategy, creative, and engineering operate as one sprint team. We prototype with motion, validate with GTM math,
              and ship campaigns that convert without sacrificing craft.
            </p>
          </div>
          <div className="grid w-full max-w-xl gap-4">
            {timeline.map((item, index) => (
              <motion.div
                key={item.year}
                className="glass gradient-border relative overflow-hidden rounded-2xl px-5 py-4"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-sm font-semibold text-cyan-200">
                      {item.pin}
                    </span>
                    <div>
                      <p className="text-sm uppercase tracking-[0.25em] text-white/60">{item.year}</p>
                      <p className="text-lg font-semibold">{item.title}</p>
                    </div>
                  </div>
                  <span className="text-white/40">◆</span>
                </div>
                <p className="mt-3 text-white/70">{item.copy}</p>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="mt-12">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-100/70">Core team</p>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {team.map((member) => (
              <motion.div
                key={member.name}
                className="group relative overflow-hidden rounded-3xl bg-white/5 p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 via-transparent to-white/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400/40 via-white/30 to-transparent text-lg font-semibold text-white">
                    {member.avatar}
                  </div>
                  <div>
                    <p className="text-lg font-semibold">{member.name}</p>
                    <p className="text-sm uppercase tracking-[0.2em] text-white/60">{member.role}</p>
                  </div>
                </div>
                <p className="mt-4 text-white/70">{member.focus}</p>
                <div className="mt-6 flex items-center gap-3 text-sm text-cyan-100/80">
                  <span className="h-[1px] w-8 bg-cyan-300" />
                  Hover to reveal
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
