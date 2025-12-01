"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useCallback } from "react";
import { projects } from "@/data/content";

export default function WorkSection() {
  const handleTilt = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const midX = rect.width / 2;
    const midY = rect.height / 2;
    const rotateY = ((x - midX) / midX) * 6;
    const rotateX = -((y - midY) / midY) * 6;
    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  }, []);

  const resetTilt = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const card = event.currentTarget;
    card.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
  }, []);

  return (
    <section id="work" className="px-4 py-24 sm:px-8 lg:px-16">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-100/70">Selected work</p>
          <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Integrated marketing for brands obsessed with growth.</h2>
        </div>
        <p className="text-white/60">Click any card to open the growth case file.</p>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => (
          <Link key={project.slug} href={`/work/${project.slug}`}>
            <motion.div
              className="card-tilt relative h-full overflow-hidden rounded-3xl bg-white/5 p-5"
              onMouseMove={handleTilt}
              onMouseLeave={resetTilt}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${project.palette} opacity-60`} />
              <div className="relative flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm uppercase tracking-[0.2em] text-white/70">{project.tags.join(" • ")}</p>
                  <span className="text-sm text-cyan-100/80">Explore</span>
                </div>
                <h3 className="text-2xl font-semibold">{project.title}</h3>
                <p className="text-white/70">{project.summary}</p>
                <div className="relative mt-4 h-32 overflow-hidden rounded-2xl bg-black/50">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(29,229,255,0.3),transparent_40%),radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.08),transparent_40%)]" />
                  <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-white/5 via-cyan-400/10 to-transparent" />
                </div>
                <div className="flex items-center justify-between text-sm text-white/60">
                  <span>{project.highlight}</span>
                  <span className="h-[1px] w-10 bg-white/30" />
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </section>
  );
}
