"use client";

import { motion } from "framer-motion";
import { aboutParagraphs } from "@/lib/data";

export default function About() {
  return (
    <section id="about" className="scroll-mt-16 lg:scroll-mt-24">
      {/* Mobile section header */}
      <div className="sticky top-0 z-20 -mx-6 mb-4 bg-slate-900/75 px-6 py-5 backdrop-blur lg:hidden">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-200">
          About
        </h2>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="space-y-4"
      >
        {aboutParagraphs.map((paragraph, index) => (
          <p key={index} className="leading-relaxed">
            {paragraph}
          </p>
        ))}
      </motion.div>
    </section>
  );
}
