"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export default function Cursor() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [active, setActive] = useState(false);

  const cursorX = useSpring(x, { stiffness: 220, damping: 26, mass: 0.4 });
  const cursorY = useSpring(y, { stiffness: 220, damping: 26, mass: 0.4 });

  useEffect(() => {
    const move = (event: MouseEvent) => {
      x.set(event.clientX - 16);
      y.set(event.clientY - 16);
    };

    const magneticTargets = Array.from(
      document.querySelectorAll<HTMLElement>("[data-magnetic]")
    );

    const enter = () => setActive(true);
    const leave = () => setActive(false);

    magneticTargets.forEach((target) => {
      target.addEventListener("mouseenter", enter);
      target.addEventListener("mouseleave", leave);
    });

    window.addEventListener("mousemove", move);
    return () => {
      window.removeEventListener("mousemove", move);
      magneticTargets.forEach((target) => {
        target.removeEventListener("mouseenter", enter);
        target.removeEventListener("mouseleave", leave);
      });
    };
  }, [x, y]);

  return (
    <motion.div
      className="custom-cursor pointer-events-none fixed top-0 left-0 z-50 h-8 w-8 rounded-full border border-cyan-200/50 bg-cyan-300/30"
      style={{ translateX: cursorX, translateY: cursorY }}
      animate={{ scale: active ? 1.6 : 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
    >
      <motion.div
        className="absolute inset-0 -z-10 rounded-full bg-cyan-500/40 blur-2xl"
        animate={{ scale: active ? 2.4 : 1.4, opacity: active ? 0.6 : 0.3 }}
        transition={{ duration: 0.6 }}
      />
    </motion.div>
  );
}
