"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { useCart } from "@/components/cart/CartProvider";
import ProductCard from "@/components/products/ProductCard";
import WishlistButton from "@/components/wishlist/WishlistButton";
import { formatOriginalPrice, formatDiscountedPrice, DISCOUNT_PERCENT } from "@/lib/discount";
import type { Product } from "@/types";

type Props = {
  product: Product;
  categoryName: string | null;
  related: Product[];
};

export default function ProductDetail({ product, categoryName, related }: Props) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const images = (product.images as string[]) || [];
  const inStock = product.stock > 0;

  function handleAddToCart() {
    if (!inStock) return;
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: images[0] || "/products/apex-crystal-cuff.jpg",
      slug: product.slug,
    }, quantity);
  }

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-32 md:pt-36 pb-12 md:pb-20">
      {/* Breadcrumb */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-[10px] text-muted tracking-[0.15em] uppercase mb-10 flex items-center gap-2"
      >
        <Link href="/" className="hover:text-offwhite transition-colors">Home</Link>
        <span className="text-border">/</span>
        <Link href="/shop" className="hover:text-offwhite transition-colors">Shop</Link>
        {categoryName && (
          <>
            <span className="text-border">/</span>
            <span className="text-chrome">{categoryName}</span>
          </>
        )}
      </motion.nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        {/* Image gallery */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="relative aspect-[3/4] bg-charcoal overflow-hidden">
            {images[activeImage] && (
              <Image
                src={images[activeImage]}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            )}
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.isNew && (
                <span className="px-2.5 py-1 bg-offwhite text-obsidian text-[9px] tracking-[0.1em] uppercase font-medium">
                  New
                </span>
              )}
              <span className="px-2.5 py-1 bg-obsidian/90 text-offwhite text-[9px] tracking-[0.1em] uppercase font-medium border border-silver/40">
                -{DISCOUNT_PERCENT}%
              </span>
            </div>
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 mt-3">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`relative w-20 h-24 overflow-hidden border transition-all ${
                    activeImage === i ? "border-silver" : "border-border/30 opacity-50 hover:opacity-100"
                  }`}
                >
                  <Image src={img} alt={`${product.name} ${i + 1}`} fill className="object-cover" sizes="80px" />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Product info */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="flex flex-col"
        >
          {categoryName && (
            <p className="text-[10px] tracking-[0.3em] text-chrome uppercase mb-3">{categoryName}</p>
          )}
          <h1 className="heading-display text-3xl md:text-4xl text-offwhite">{product.name}</h1>
          
          {/* Pricing */}
          <div className="mt-5 flex items-baseline gap-3">
            <span className="text-2xl font-medium text-silver">{formatDiscountedPrice(product.price)}</span>
            <span className="text-sm text-muted line-through">{formatOriginalPrice(product.price)}</span>
            <span className="text-[10px] tracking-wider uppercase text-silver bg-charcoal px-2 py-0.5 border border-silver/40">
              Save {DISCOUNT_PERCENT}%
            </span>
          </div>

          {/* Stock status intentionally hidden from customers — availability
              still gates Add to Cart via the disabled state below. */}

          {/* Description */}
          {product.description && (
            <p className="mt-6 text-[13px] text-muted leading-relaxed">{product.description}</p>
          )}

          {/* Details */}
          <div className="mt-8 space-y-3 text-[12px] border-t border-border/30 pt-6">
            {product.material && (
              <div className="flex gap-6">
                <span className="text-chrome uppercase tracking-[0.1em] w-20 flex-shrink-0">Material</span>
                <span className="text-offwhite/90">{product.material}</span>
              </div>
            )}
            {product.dimensions && (
              <div className="flex gap-6">
                <span className="text-chrome uppercase tracking-[0.1em] w-20 flex-shrink-0">Size</span>
                <span className="text-offwhite/90">{product.dimensions}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-5">
              <span className="text-[10px] tracking-[0.15em] uppercase text-chrome">Qty</span>
              <div className="flex items-center border border-border/50">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-2.5 text-chrome hover:text-offwhite transition-colors">−</button>
                <span className="px-4 py-2.5 text-[12px] min-w-[40px] text-center">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-2.5 text-chrome hover:text-offwhite transition-colors">+</button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!inStock}
              className="w-full py-4 bg-offwhite text-obsidian text-[11px] tracking-[0.25em] uppercase font-medium hover:bg-silver transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {inStock ? "Add to Cart" : "Currently Unavailable"}
            </button>

            {inStock && (
              <Link
                href="/checkout"
                onClick={handleAddToCart}
                className="block w-full py-4 border border-offwhite/80 text-offwhite text-[11px] tracking-[0.25em] uppercase text-center hover:bg-offwhite hover:text-obsidian transition-colors"
              >
                Buy Now
              </Link>
            )}

            <WishlistButton
              productId={product.id}
              className="w-full py-4 border border-border/50 text-chrome hover:text-offwhite hover:border-offwhite/50 transition-colors flex items-center justify-center gap-2 text-[11px] tracking-[0.2em] uppercase"
            >
              <span>Wishlist</span>
            </WishlistButton>
          </div>

          {/* Promo reminder */}
          <div className="mt-6 p-4 bg-charcoal/50 border border-border/30">
            <p className="text-[10px] tracking-[0.15em] uppercase text-silver">
              <span className="text-offwhite font-medium">{DISCOUNT_PERCENT}% discount</span> applied automatically
            </p>
          </div>

          {/* Shipping & Care accordions */}
          <div className="mt-8 border-t border-border/30 pt-6 space-y-4">
            <details className="group">
              <summary className="flex items-center justify-between cursor-pointer text-[10px] tracking-[0.15em] uppercase text-chrome hover:text-offwhite transition-colors py-2">
                Shipping Information
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-open:rotate-180 transition-transform">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </summary>
              <p className="mt-2 text-[12px] text-muted leading-relaxed pb-2">
                Free shipping across Pakistan. Orders ship within 2–3 business days. Delivery takes 3–5 business days. Cash on Delivery available.
              </p>
            </details>
            <details className="group border-t border-border/20 pt-4">
              <summary className="flex items-center justify-between cursor-pointer text-[10px] tracking-[0.15em] uppercase text-chrome hover:text-offwhite transition-colors py-2">
                Care Instructions
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-open:rotate-180 transition-transform">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </summary>
              <p className="mt-2 text-[12px] text-muted leading-relaxed pb-2">
                {product.care || "Avoid contact with water, perfume, and harsh chemicals. Store in a dry place. Clean gently with a soft cloth."}
              </p>
            </details>
          </div>
        </motion.div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section className="mt-24 pt-16 border-t border-border/30">
          <h2 className="text-[11px] tracking-[0.3em] uppercase text-chrome mb-10">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {related.map((p) => (
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
        </section>
      )}
    </div>
  );
}
