"use client";

import { motion } from "framer-motion";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import Hero from "@/components/Hero";
import ServicesSection from "@/components/ServicesSection";
import WorkSection from "@/components/WorkSection";

export default function HomePage() {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="space-y-8"
    >
      <Hero />
      <ServicesSection />
      <AboutSection />
      <WorkSection />
      <ContactSection />
    </motion.main>
  );
}
