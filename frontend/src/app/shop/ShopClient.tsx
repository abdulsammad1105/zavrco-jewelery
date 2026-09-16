"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import ProductCard from "@/components/products/ProductCard";
import type { Product, Category } from "@/types";

type Props = {
  products: Product[];
  categories: Category[];
  activeCategory: string;
  activeSort: string;
  searchQuery: string;
};

export default function ShopClient({
  products,
  categories,
  activeCategory,
  activeSort,
  searchQuery,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchQuery);

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`/shop?${params.toString()}`);
    },
    [router, searchParams],
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams("search", search);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <h1 className="heading-display text-3xl md:text-4xl">
          {activeCategory
            ? categories.find((c) => c.slug === activeCategory)?.name || "Shop"
            : "Shop All"}
        </h1>
        <p className="mt-2 text-sm text-muted">
          {products.length} product{products.length !== 1 ? "s" : ""}
        </p>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-10 pb-6 border-b border-border">
        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => updateParams("category", "")}
            className={`px-4 py-2 text-xs tracking-wider uppercase border transition-colors ${
              !activeCategory
                ? "border-offwhite text-offwhite"
                : "border-border text-muted hover:text-offwhite hover:border-chrome"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => updateParams("category", cat.slug)}
              className={`px-4 py-2 text-xs tracking-wider uppercase border transition-colors ${
                activeCategory === cat.slug
                  ? "border-offwhite text-offwhite"
                  : "border-border text-muted hover:text-offwhite hover:border-chrome"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="flex gap-3 md:ml-auto items-center">
          {/* Sort */}
          <select
            value={activeSort}
            onChange={(e) => updateParams("sort", e.target.value)}
            className="bg-charcoal border border-border px-3 py-2 text-xs text-offwhite tracking-wider uppercase focus:outline-none focus:border-chrome cursor-pointer"
          >
            <option value="">Featured</option>
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
          </select>

          {/* Search */}
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="bg-charcoal border border-border px-3 py-2 pr-8 text-xs text-offwhite placeholder:text-muted focus:outline-none focus:border-chrome w-36 sm:w-48"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted hover:text-offwhite"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </button>
          </form>
        </div>
      </div>

      {/* Products grid */}
      {products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted text-sm tracking-wider uppercase">
            No products found
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              id={p.id}
              name={p.name}
              slug={p.slug}
              price={p.price}
              image={
                (p.images as string[])?.[0] ||
                "/products/apex-crystal-cuff.jpg"
              }
              isNew={p.isNew}
            />
          ))}
        </div>
      )}
    </div>
  );
}
