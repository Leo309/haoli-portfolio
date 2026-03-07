"use client";

import { motion } from "framer-motion";
import { personalInfo } from "@/lib/data";

export default function Contact() {
  return (
    <section id="contact" className="scroll-mt-16 lg:scroll-mt-24">
      {/* Mobile section header */}
      <div className="sticky top-0 z-20 -mx-6 mb-4 bg-slate-900/75 px-6 py-5 backdrop-blur lg:hidden">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-200">
          Contact
        </h2>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="max-w-lg"
      >
        <p className="leading-relaxed">
          I'm currently open to new opportunities in analytics engineering,
          data analysis, and full-stack development. Whether you have a
          question, a potential role, or just want to say hi — my inbox is
          always open.
        </p>

        <a
          href={`mailto:${personalInfo.email}`}
          className="mt-6 inline-block rounded-lg border border-teal-400/30 bg-teal-400/10 px-6 py-3 text-sm font-medium text-teal-300 transition-all hover:bg-teal-400/20 hover:border-teal-400/50"
        >
          Say Hello
        </a>
      </motion.div>
    </section>
  );
}
