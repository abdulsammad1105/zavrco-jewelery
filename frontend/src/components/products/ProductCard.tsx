"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { formatOriginalPrice, formatDiscountedPrice, DISCOUNT_PERCENT } from "@/lib/discount";
import { useCart } from "@/components/cart/CartProvider";
import WishlistButton from "@/components/wishlist/WishlistButton";

type ProductCardProps = {
  id: number;
  name: string;
  slug: string;
  price: string;
  image: string;
  secondaryImage?: string;
  isNew?: boolean;
};

export default function ProductCard({
  id,
  name,
  slug,
  price,
  image,
  secondaryImage,
  isNew,
}: ProductCardProps) {
  const { addItem } = useCart();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/product/${slug}`} className="block">
        <div className="relative aspect-[3/4] bg-charcoal overflow-hidden shadow-sm ring-1 ring-border/60 group-hover:ring-silver/30 transition-all duration-500">
          {/* Primary image */}
          <Image
            src={image}
            alt={name}
            fill
            className={`object-cover transition-all duration-700 ${
              isHovered && secondaryImage ? "opacity-0 scale-105" : "opacity-100 scale-100"
            }`}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          {/* Secondary image (crossfade) */}
          {secondaryImage && (
            <Image
              src={secondaryImage}
              alt={`${name} alternate`}
              fill
              className={`object-cover transition-all duration-700 ${
                isHovered ? "opacity-100 scale-100" : "opacity-0 scale-105"
              }`}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          )}
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {isNew && (
              <span className="px-2 py-0.5 bg-offwhite text-obsidian text-[9px] tracking-[0.1em] uppercase font-medium">
                New
              </span>
            )}
            <span className="px-2 py-0.5 bg-obsidian/85 text-offwhite text-[9px] tracking-[0.1em] uppercase font-medium border border-silver/40">
              -{DISCOUNT_PERCENT}%
            </span>
          </div>

          <WishlistButton
            productId={id}
            className="absolute top-3 right-3 text-offwhite/80 hover:text-offwhite transition-colors"
          />

          {/* Quick add overlay */}
          <div
            className={`absolute inset-x-0 bottom-0 transition-all duration-300 ${
              isHovered ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
            }`}
          >
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addItem({ productId: id, name, price, image, slug });
              }}
              className="w-full bg-obsidian/95 backdrop-blur-sm text-offwhite text-[10px] tracking-[0.2em] uppercase py-3.5 hover:bg-silver hover:text-obsidian transition-colors border-t border-silver/30"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </Link>
      
      <div className="mt-4 space-y-1">
        <Link href={`/product/${slug}`}>
          <h3 className="text-[13px] font-medium text-offwhite/90 hover:text-offwhite transition-colors truncate">
            {name}
          </h3>
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-medium text-silver">{formatDiscountedPrice(price)}</span>
          <span className="text-[11px] text-muted line-through">{formatOriginalPrice(price)}</span>
        </div>
      </div>
    </motion.div>
  );
}
