"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Category } from "@/types";

export default function CollectionsGrid({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null;

  return (
    <section className="py-24 px-5 border-t border-border/30 bg-charcoal/30">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-[10px] tracking-[0.5em] text-chrome uppercase mb-3">Browse</p>
          <h2 className="heading-display text-3xl md:text-4xl">Collections</h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <Link href={`/shop?category=${cat.slug}`} className="group relative block aspect-[3/4] overflow-hidden">
                <Image
                  src={cat.image || "/products/apex-crystal-cuff.jpg"}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian/90 via-obsidian/30 to-transparent" />
                <div className="absolute inset-0 border border-border/20 group-hover:border-chrome/30 transition-colors" />
                <span className="absolute top-4 left-4 editorial-index">
                  {String(i + 1).padStart(2, "0")} / {String(categories.length).padStart(2, "0")}
                </span>
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="text-[15px] font-medium tracking-wider uppercase">{cat.name}</h3>
                  <span className="mt-2 text-[10px] text-chrome tracking-[0.15em] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300 block">
                    Shop Now →
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
