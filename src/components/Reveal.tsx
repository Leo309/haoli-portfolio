"use client";

import { motion } from "framer-motion";

// Subtle one-time fade/slide as a section enters the viewport.
// Server and client always render the same element: branching on reduced motion
// caused a hydration mismatch that left content stuck at opacity 0. Reduced-motion
// visitors (and visitors without JS) are handled in CSS via [data-reveal] instead.
export default function Reveal({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      data-reveal
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
