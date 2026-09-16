"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useCart } from "@/components/cart/CartProvider";
import { formatOriginalPrice, formatDiscountedPrice, getDiscountedPrice, DISCOUNT_PERCENT } from "@/lib/discount";

export default function CartClient() {
  const { items, removeItem, updateQuantity, subtotal } = useCart();

  const discountedSubtotal = items.reduce(
    (sum, item) => sum + getDiscountedPrice(item.price) * item.quantity,
    0
  );
  const savings = subtotal - discountedSubtotal;

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-32 pb-24 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="heading-display text-4xl mb-6">Your Cart</h1>
          <p className="text-[12px] text-muted tracking-wider mb-10">Your cart is currently empty.</p>
          <Link href="/shop" className="inline-block px-10 py-4 border border-offwhite/80 text-offwhite text-[11px] tracking-[0.2em] uppercase hover:bg-offwhite hover:text-obsidian transition-colors">
            Continue Shopping
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-32 md:pt-36 pb-12 md:pb-20">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="heading-display text-4xl mb-12"
      >
        Your Cart
      </motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Items */}
        <div className="lg:col-span-2 space-y-6">
          {items.map((item, i) => (
            <motion.div
              key={item.productId}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex gap-5 sm:gap-6 pb-6 border-b border-border/30"
            >
              <Link href={`/product/${item.slug}`} className="relative w-24 h-32 sm:w-28 sm:h-36 bg-charcoal flex-shrink-0 overflow-hidden">
                <Image src={item.image} alt={item.name} fill className="object-cover" sizes="112px" />
              </Link>
              <div className="flex-1 py-1">
                <Link href={`/product/${item.slug}`} className="text-[13px] font-medium hover:text-silver transition-colors">
                  {item.name}
                </Link>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[13px]">{formatDiscountedPrice(item.price)}</span>
                  <span className="text-[11px] text-muted line-through">{formatOriginalPrice(item.price)}</span>
                </div>

                <div className="flex items-center gap-4 mt-5">
                  <div className="flex items-center border border-border/50">
                    <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="px-3 py-1.5 text-[12px] text-chrome hover:text-offwhite transition-colors">−</button>
                    <span className="px-3 py-1.5 text-[12px] min-w-[32px] text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="px-3 py-1.5 text-[12px] text-chrome hover:text-offwhite transition-colors">+</button>
                  </div>
                  <button onClick={() => removeItem(item.productId)} className="text-[10px] text-muted hover:text-offwhite transition-colors tracking-[0.1em] uppercase">
                    Remove
                  </button>
                </div>

                <p className="mt-4 text-[13px] text-offwhite">
                  {formatOriginalPrice(getDiscountedPrice(item.price) * item.quantity)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-charcoal/50 border border-silver/20 p-6 sticky top-28 shadow-sm">
            <h2 className="text-[11px] tracking-[0.2em] uppercase text-chrome mb-5">Order Summary</h2>
            
            <div className="space-y-3 text-[12px]">
              <div className="flex justify-between">
                <span className="text-muted">Subtotal</span>
                <span className="text-muted line-through">{formatOriginalPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-silver">
                <span>Discount ({DISCOUNT_PERCENT}%)</span>
                <span>-{formatOriginalPrice(savings)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Shipping</span>
                <span className="text-green-500/80 text-[10px] tracking-wider uppercase">Free</span>
              </div>
              <div className="border-t border-border/30 pt-3 flex justify-between text-[14px] font-medium">
                <span>Total</span>
                <span>{formatOriginalPrice(discountedSubtotal)}</span>
              </div>
            </div>

            <div className="mt-5 p-3 bg-obsidian/50 border border-border/20">
              <p className="text-[10px] tracking-wider uppercase text-silver">
                <span className="text-offwhite font-medium">{DISCOUNT_PERCENT}% off</span> applied automatically
              </p>
            </div>

            <Link href="/checkout" className="block w-full text-center py-4 bg-offwhite text-obsidian text-[11px] tracking-[0.2em] uppercase font-medium hover:bg-silver transition-colors mt-6">
              Checkout
            </Link>
            <Link href="/shop" className="block text-center text-[10px] text-muted hover:text-offwhite transition-colors tracking-wider uppercase mt-4">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
