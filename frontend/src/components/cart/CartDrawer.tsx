"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "./CartProvider";
import { formatOriginalPrice, formatDiscountedPrice, getDiscountedPrice, DISCOUNT_PERCENT } from "@/lib/discount";

export default function CartDrawer() {
  const { items, removeItem, updateQuantity, subtotal, isOpen, setIsOpen } = useCart();
  
  // Calculate discounted subtotal
  const discountedSubtotal = items.reduce(
    (sum, item) => sum + getDiscountedPrice(item.price) * item.quantity,
    0
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-obsidian/70 backdrop-blur-sm z-50"
            onClick={() => setIsOpen(false)}
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.35, ease: "easeOut" }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-charcoal z-50 flex flex-col border-l border-border/30"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border/30">
              <h2 className="text-[11px] tracking-[0.2em] uppercase font-medium">
                Cart ({items.length})
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-chrome hover:text-offwhite transition-colors p-1"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M6 6l12 12M6 18L18 6" />
                </svg>
              </button>
            </div>

            {/* Discount banner */}
            <div className="px-6 py-3 bg-obsidian/50 border-b border-border/20">
              <p className="text-[10px] tracking-[0.15em] uppercase text-silver">
                <span className="text-offwhite font-medium">{DISCOUNT_PERCENT}% OFF</span> applied automatically
              </p>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {items.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-[11px] tracking-[0.15em] uppercase text-muted mb-4">
                    Your cart is empty
                  </p>
                  <Link
                    href="/shop"
                    onClick={() => setIsOpen(false)}
                    className="text-[11px] text-offwhite underline underline-offset-4 tracking-wider uppercase"
                  >
                    Continue Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-5">
                  {items.map((item) => (
                    <div key={item.productId} className="flex gap-4">
                      <div className="relative w-20 h-24 bg-charcoal-light flex-shrink-0 overflow-hidden">
                        <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
                      </div>
                      <div className="flex-1 min-w-0 py-1">
                        <Link
                          href={`/product/${item.slug}`}
                          onClick={() => setIsOpen(false)}
                          className="text-[12px] font-medium truncate block hover:text-silver transition-colors"
                        >
                          {item.name}
                        </Link>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[12px] text-offwhite">{formatDiscountedPrice(item.price)}</span>
                          <span className="text-[10px] text-muted line-through">{formatOriginalPrice(item.price)}</span>
                        </div>
                        <div className="flex items-center gap-3 mt-3">
                          <div className="flex items-center border border-border/50">
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                              className="w-7 h-7 text-[11px] text-chrome hover:text-offwhite transition-colors"
                            >
                              −
                            </button>
                            <span className="w-6 text-center text-[11px]">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              className="w-7 h-7 text-[11px] text-chrome hover:text-offwhite transition-colors"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.productId)}
                            className="text-[10px] text-muted hover:text-offwhite transition-colors tracking-wider uppercase"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-border/30 space-y-4 bg-obsidian/30">
                <div className="space-y-2">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-muted uppercase tracking-wider">Original</span>
                    <span className="text-muted line-through">{formatOriginalPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-silver uppercase tracking-wider">Discount ({DISCOUNT_PERCENT}%)</span>
                    <span className="text-silver">-{formatOriginalPrice(subtotal - discountedSubtotal)}</span>
                  </div>
                  <div className="flex justify-between text-[13px] font-medium pt-2 border-t border-border/30">
                    <span className="uppercase tracking-wider">Total</span>
                    <span>{formatOriginalPrice(discountedSubtotal)}</span>
                  </div>
                </div>
                <Link
                  href="/checkout"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center py-3.5 bg-offwhite text-obsidian text-[11px] tracking-[0.2em] uppercase font-medium hover:bg-silver transition-colors"
                >
                  Checkout
                </Link>
                <button
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center py-2 text-[10px] text-muted hover:text-offwhite transition-colors tracking-wider uppercase"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
