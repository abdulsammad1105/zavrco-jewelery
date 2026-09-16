"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail("");
    }
  }

  return (
    <section className="py-24 px-5 border-t border-border/30">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="max-w-xl mx-auto text-center"
      >
        <p className="text-[10px] tracking-[0.5em] text-chrome uppercase mb-3">Newsletter</p>
        <h2 className="heading-display text-2xl md:text-3xl">Stay in the Loop</h2>
        <p className="mt-4 text-[12px] text-muted">
          New drops, exclusive offers, and brand updates — straight to your inbox.
        </p>
        
        {submitted ? (
          <p className="mt-8 text-[12px] text-silver">Thank you for subscribing.</p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="flex-1 bg-charcoal/50 border border-border/50 px-5 py-3.5 text-[12px] text-offwhite placeholder:text-muted focus:outline-none focus:border-chrome/50 transition-colors"
            />
            <button type="submit" className="px-8 py-3.5 bg-offwhite text-obsidian text-[11px] tracking-[0.15em] uppercase font-medium hover:bg-silver transition-colors">
              Subscribe
            </button>
          </form>
        )}
      </motion.div>
    </section>
  );
}
