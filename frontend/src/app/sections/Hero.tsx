"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background image with reveal */}
      <motion.div
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
        className="absolute inset-0"
      >
        <Image
          src="/images/hero.jpg"
          alt="ZAVR.CO Jewellery"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian/40 via-obsidian/20 to-obsidian/70" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl">
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="editorial-index mb-3"
        >
          ZAVR / COLLECTION 01
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-[10px] tracking-[0.5em] text-silver uppercase mb-6"
        >
          Introducing ZAVR.CO
        </motion.p>
        
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="heading-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-offwhite"
        >
          Jewellery
          <br />
          <span className="text-silver/80">Without a Label</span>
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="mt-8 text-[13px] text-chrome tracking-wide max-w-md mx-auto leading-relaxed"
        >
          Premium fashion jewellery designed for the modern individual. 
          No gender. No limits.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.3 }}
          className="mt-12"
        >
          <Link
            href="/shop"
            className="inline-block px-10 py-4 border border-offwhite/80 text-offwhite text-[11px] tracking-[0.25em] uppercase hover:bg-offwhite hover:text-obsidian transition-all duration-500"
          >
            Explore Collection
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <span className="text-[9px] tracking-[0.3em] uppercase text-chrome/60">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-px h-8 bg-gradient-to-b from-chrome/40 to-transparent"
        />
      </motion.div>
    </section>
  );
}
