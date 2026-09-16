"use client";

import { motion } from "framer-motion";

export default function BrandStatement() {
  return (
    <section className="py-28 px-5 border-t border-border/30">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl mx-auto text-center"
      >
        <p className="text-[10px] tracking-[0.5em] text-chrome uppercase mb-8">
          The Brand
        </p>
        <h2 className="heading-display text-3xl sm:text-4xl md:text-5xl leading-tight">
          We create affordable, premium-quality jewellery that doesn&apos;t
          belong to a gender — it belongs to{" "}
          <span className="text-silver">you</span>.
        </h2>
        <p className="mt-10 text-[13px] text-muted leading-relaxed max-w-lg mx-auto">
          ZAVR.CO is a Pakistan-based jewellery brand built for the modern
          individual. No labels. No limits. Just clean design, quality
          materials, and pieces that feel as good as they look.
        </p>
      </motion.div>
    </section>
  );
}
