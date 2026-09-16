"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import ProductCard from "@/components/products/ProductCard";
import type { Product } from "@/types";

export default function NewArrivals({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <section className="py-24 px-5 border-t border-border/30">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between mb-14"
        >
          <div>
            <p className="text-[10px] tracking-[0.5em] text-chrome uppercase mb-3">Just Landed</p>
            <h2 className="heading-display text-3xl md:text-4xl">New Arrivals</h2>
          </div>
          <Link href="/shop?sort=newest" className="hidden sm:block link-hover text-[11px] tracking-[0.15em] uppercase text-chrome hover:text-offwhite transition-colors">
            View All
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              id={p.id}
              name={p.name}
              slug={p.slug}
              price={p.price}
              image={(p.images as string[])?.[0] || "/products/apex-crystal-cuff.jpg"}
              isNew={p.isNew}
            />
          ))}
        </div>

        <div className="mt-10 text-center sm:hidden">
          <Link href="/shop?sort=newest" className="text-[11px] text-chrome hover:text-offwhite transition-colors tracking-[0.15em] uppercase">
            View All →
          </Link>
        </div>
      </div>
    </section>
  );
}
