"use client";

import { apiFetch } from "@/lib/api";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import { formatOriginalPrice, formatDiscountedPrice, getDiscountedPrice } from "@/lib/discount";
import type { Product } from "@/types";

type WishlistRow = {
  id: number;
  productId: number;
  product: Product | null;
};

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistRow[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  const load = useCallback(async () => {
    setLoading(true);
    const res = await apiFetch("/api/wishlist");
    if (res.ok) {
      const data = await res.json();
      setItems(data.items);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function removeItem(productId: number) {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
    await apiFetch(`/api/wishlist/${productId}`, { method: "DELETE" });
  }

  function moveToCart(item: WishlistRow) {
    if (!item.product) return;
    const images = item.product.images as string[];
    addItem({
      productId: item.product.id,
      name: item.product.name,
      price: String(getDiscountedPrice(item.product.price)),
      image: images?.[0] || "/products/apex-crystal-cuff.jpg",
      slug: item.product.slug,
    });
    removeItem(item.productId);
  }

  return (
    <div>
      <h2 className="text-[11px] tracking-[0.2em] uppercase text-chrome mb-5">Wishlist</h2>

      {loading ? (
        <p className="text-[13px] text-muted">Loading...</p>
      ) : items.length === 0 ? (
        <p className="text-[13px] text-muted">
          Your wishlist is empty.{" "}
          <Link href="/shop" className="text-offwhite hover:text-chrome transition-colors">
            Browse the shop
          </Link>
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {items.map((item) => {
            if (!item.product) return null;
            const images = item.product.images as string[];
            return (
              <div key={item.id} className="border border-border/50 p-4 flex gap-4">
                <div className="relative w-20 h-24 shrink-0 bg-charcoal">
                  <Image
                    src={images?.[0] || "/products/apex-crystal-cuff.jpg"}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/product/${item.product.slug}`}
                    className="text-[13px] text-offwhite hover:text-chrome transition-colors block truncate"
                  >
                    {item.product.name}
                  </Link>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-[13px] text-offwhite">
                      {formatDiscountedPrice(item.product.price)}
                    </span>
                    <span className="text-[11px] text-muted line-through">
                      {formatOriginalPrice(item.product.price)}
                    </span>
                  </div>
                  <div className="flex gap-4 mt-3">
                    <button
                      onClick={() => moveToCart(item)}
                      className="text-[10px] tracking-[0.15em] uppercase text-offwhite hover:text-chrome transition-colors"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="text-[10px] tracking-[0.15em] uppercase text-muted hover:text-offwhite transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
