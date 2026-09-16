"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function AboutSection() {
  return (
    <section className="py-28 px-5 border-t border-border/30 bg-charcoal/50">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl mx-auto text-center"
      >
        <p className="text-[10px] tracking-[0.5em] text-chrome uppercase mb-8">About Us</p>
        <h2 className="heading-display text-3xl sm:text-4xl md:text-5xl leading-tight">
          Built for the
          <br />
          <span className="text-silver">Modern Individual</span>
        </h2>
        <p className="mt-10 text-[13px] text-muted leading-relaxed max-w-lg mx-auto">
          ZAVR started with a simple idea — great jewellery shouldn&apos;t come
          with an unreasonable price tag. We design every piece to be bold,
          minimal, and built to last.
        </p>
        <Link href="/about" className="inline-block mt-10 text-[11px] text-offwhite tracking-[0.15em] uppercase underline underline-offset-4 hover:text-silver transition-colors">
          Learn More
        </Link>
      </motion.div>
    </section>
  );
}
