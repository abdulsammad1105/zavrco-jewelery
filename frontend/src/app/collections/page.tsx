import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { Category, Collection } from "@/types";
import { API_URL } from "@/lib/api";

export const metadata: Metadata = {
  title: "Collections",
  description: "Browse ZAVR.CO collections — Rings, Chains, Bracelets, Pendants, Biker Chains & Statement.",
};

export const dynamic = "force-dynamic";

export default async function CollectionsPage() {
  let allCategories: Category[] = [];
  let allCollections: Collection[] = [];

  try {
    const [categoriesRes, collectionsRes] = await Promise.all([
      fetch(`${API_URL}/api/categories`, { cache: "no-store" }),
      fetch(`${API_URL}/api/collections`, { cache: "no-store" }),
    ]);
    allCategories = await categoriesRes.json();
    allCollections = await collectionsRes.json();
  } catch {
    // Backend may be unreachable at build/render time
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12">
      <h1 className="text-3xl md:text-4xl font-light tracking-wider uppercase mb-4">
        Collections
      </h1>
      <p className="text-sm text-muted mb-12">
        Explore our curated collections of premium fashion jewellery.
      </p>

      {/* Categories */}
      {allCategories.length > 0 && (
        <section className="mb-16">
          <h2 className="text-xs tracking-[0.4em] text-chrome uppercase mb-6">
            By Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {allCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.slug}`}
                className="group relative block aspect-[3/4] overflow-hidden rounded"
              >
                <Image
                  src={cat.image || "/products/apex-crystal-cuff.jpg"}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 via-obsidian/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="text-lg font-medium tracking-wider uppercase">
                    {cat.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Collections */}
      {allCollections.length > 0 && (
        <section>
          <h2 className="text-xs tracking-[0.4em] text-chrome uppercase mb-6">
            By Collection
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {allCollections.map((col) => (
              <Link
                key={col.id}
                href="/shop"
                className="group block bg-charcoal rounded p-8 hover:bg-charcoal-light transition-colors"
              >
                <h3 className="text-xl font-light tracking-wider uppercase mb-2">
                  {col.name}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {col.description}
                </p>
                <span className="inline-block mt-4 text-xs text-chrome tracking-wider uppercase group-hover:text-offwhite transition-colors">
                  Explore →
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
