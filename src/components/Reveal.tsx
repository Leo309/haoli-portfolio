"use client";

import { motion, useReducedMotion } from "framer-motion";

// Subtle one-time fade/slide as a section enters the viewport.
// Visitors who ask for reduced motion get the content with no animation at all.
export default function Reveal({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return <div>{children}</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
