"use client";

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function ContactSection() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      name: form.get("name")?.toString() || "",
      email: form.get("email")?.toString() || "",
      project: form.get("project")?.toString() || "",
      createdAt: serverTimestamp()
    };

    setLoading(true);
    setMessage(null);
    try {
      await addDoc(collection(db, "contacts"), payload);
      setMessage("Request received. We'll respond within one business day.");
      event.currentTarget.reset();
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong. Please try again or email hello@imaginary.works");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="px-4 pb-24 sm:px-8 lg:px-16">
      <div className="glass gradient-border relative overflow-hidden rounded-3xl p-10">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-100/70">Contact</p>
            <h2 className="text-3xl font-semibold sm:text-4xl">Let’s orchestrate your next launch.</h2>
            <p className="text-white/70">
              Tell us about the momentum you want. We will assemble a strike team in under 48 hours.
            </p>
            <div className="glitch-map relative h-56 overflow-hidden rounded-2xl bg-[radial-gradient(circle_at_20%_20%,rgba(29,229,255,0.2),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.08),transparent_45%)]">
              <div className="absolute inset-0 bg-[url('https://tile.openstreetmap.org/0/0/0.png')] opacity-10 mix-blend-screen" />
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/30 via-transparent to-white/5" />
              <div className="absolute bottom-4 left-4 rounded-full bg-black/50 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/70">
                Remote first • Global
              </div>
            </div>
          </div>
          <motion.form
            onSubmit={submit}
            className="glass gradient-border relative rounded-3xl p-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm">
                <span className="text-white/60">Name</span>
                <input
                  name="name"
                  required
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-3 text-white outline-none transition focus:border-cyan-300 focus:bg-black/60"
                  placeholder="Nova Kim"
                />
              </label>
              <label className="space-y-2 text-sm">
                <span className="text-white/60">Email</span>
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-3 text-white outline-none transition focus:border-cyan-300 focus:bg-black/60"
                  placeholder="you@brand.com"
                />
              </label>
            </div>
            <label className="mt-4 block space-y-2 text-sm">
              <span className="text-white/60">Project vision</span>
              <textarea
                name="project"
                rows={4}
                required
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-3 text-white outline-none transition focus:border-cyan-300 focus:bg-black/60"
                placeholder="Campaign, product launch, new site, or GTM overhaul"
              />
            </label>
            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-full bg-gradient-to-r from-cyan-400 to-white/30 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-black shadow-[0_18px_60px_rgba(0,0,0,0.35)] transition hover:from-cyan-300 hover:to-white disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Sending..." : "Send the signal"}
            </button>
            {message && <p className="mt-4 text-sm text-cyan-100/80">{message}</p>}
          </motion.form>
        </div>
      </div>
    </section>
  );
}
