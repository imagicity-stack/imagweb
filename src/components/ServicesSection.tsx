"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { services } from "@/data/content";

export default function ServicesSection() {
  const [selected, setSelected] = useState<(typeof services)[number] | null>(null);

  return (
    <section id="services" className="relative px-4 py-24 sm:px-8 lg:px-16">
      <div className="mb-12 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-orange-100/80">Capabilities</p>
          <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Strategy + creativity + premium execution.</h2>
        </div>
        <div className="hidden text-sm text-white/60 lg:block">Hover for motion. Click for detail.</div>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {services.map((service, index) => (
          <motion.button
            key={service.title}
            onClick={() => setSelected(service)}
            className="card-tilt glass gradient-border group relative overflow-hidden rounded-3xl p-6 text-left"
            whileHover={{ scale: 1.02, rotate: index % 2 === 0 ? 1.5 : -1.5 }}
            transition={{ type: "spring", stiffness: 180, damping: 16 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                 style={{ backgroundImage: `linear-gradient(135deg, rgba(255,133,95,0.18), rgba(244,114,182,0.08))` }}
            />
            <div className="relative flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-xl">
                {service.icon}
              </div>
              <span className="text-xs uppercase tracking-[0.3em] text-white/60">0{index + 1}</span>
            </div>
            <h3 className="relative mt-4 text-2xl font-semibold">{service.title}</h3>
            <p className="mt-2 text-white/70">{service.tagline}</p>
            <div className="mt-6 flex items-center gap-3 text-sm text-orange-100/80">
              <span className="h-[1px] w-10 bg-orange-300" />
              Tap to open detail
            </div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-30 flex items-center justify-center bg-black/70 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="glass gradient-border relative max-w-xl rounded-3xl p-8 shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 160, damping: 18 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute right-5 top-5 h-10 w-10 rounded-full bg-white/10 text-lg"
                aria-label="Close service detail"
              >
                ×
              </button>
              <p className="text-sm uppercase tracking-[0.3em] text-orange-100/80">{selected.title}</p>
              <h4 className="mt-3 text-2xl font-semibold">{selected.tagline}</h4>
              <p className="mt-4 text-white/70">{selected.detail}</p>
              <div className="mt-6 grid grid-cols-2 gap-3 text-sm text-white/60">
                <div className="rounded-2xl bg-white/5 px-3 py-2">Framer Motion + GSAP</div>
                <div className="rounded-2xl bg-white/5 px-3 py-2">Research + KPI stack</div>
                <div className="rounded-2xl bg-white/5 px-3 py-2">Modular stories</div>
                <div className="rounded-2xl bg-white/5 px-3 py-2">Launch playbooks</div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
