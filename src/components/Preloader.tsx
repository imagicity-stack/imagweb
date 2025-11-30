"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Preloader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 1600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6 } }}
        >
          <motion.div
            className="relative flex h-28 w-28 items-center justify-center rounded-full border border-cyan-300/30"
            initial={{ scale: 0.7, rotate: -8 }}
            animate={{ scale: 1, rotate: 360 }}
            transition={{ duration: 1.3, ease: "easeInOut" }}
          >
            <motion.div
              className="absolute inset-2 rounded-full bg-gradient-to-br from-cyan-400/50 to-white/10"
              animate={{ borderRadius: [24, 56, 24], rotate: [0, 90, 180, 360] }}
              transition={{ duration: 1.3, ease: "easeInOut" }}
            />
            <motion.span
              className="relative text-lg font-semibold tracking-[0.2em]"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              IW
            </motion.span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
