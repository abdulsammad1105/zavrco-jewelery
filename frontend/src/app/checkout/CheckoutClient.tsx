"use client";

import { apiFetch } from "@/lib/api";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useCart } from "@/components/cart/CartProvider";
import { formatOriginalPrice, getDiscountedPrice, DISCOUNT_PERCENT } from "@/lib/discount";
import { SHIPPING_COST } from "@/lib/shipping";

const PROVINCES = [
  "Punjab", "Sindh", "Khyber Pakhtunkhwa", "Balochistan",
  "Islamabad Capital Territory", "Gilgit-Baltistan", "Azad Jammu & Kashmir",
];

const MEEZAN_ACCOUNT_NAME = "Abdul Sammad";
const MEEZAN_ACCOUNT_NUMBER = "00300109308326";

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function CheckoutClient() {
  const { items, subtotal, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [proofDataUrl, setProofDataUrl] = useState<string | null>(null);

  const [form, setForm] = useState({
    customerName: "", customerEmail: "", customerPhone: "",
    address: "", city: "", province: "", postalCode: "",
  });

  const discountedSubtotal = items.reduce(
    (sum, item) => sum + getDiscountedPrice(item.price) * item.quantity, 0
  );
  const total = discountedSubtotal + SHIPPING_COST;

  function updateField(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleProofChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5MB");
      return;
    }
    setError("");
    const dataUrl = await fileToDataUrl(file);
    setProofDataUrl(dataUrl);
    setProofPreview(dataUrl);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) return;

    if (!proofDataUrl) {
      setError("Please upload a screenshot of your Delivery Charges payment before placing your order");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await apiFetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
          })),
          paymentProof: proofDataUrl,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }

      const { id } = await res.json();
      clearCart();
      router.push(`/order-confirmation?id=${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-32 pb-24 text-center">
        <h1 className="heading-display text-4xl mb-6">Checkout</h1>
        <p className="text-[12px] text-muted mb-10">Your cart is empty.</p>
        <Link href="/shop" className="inline-block px-10 py-4 border border-offwhite/80 text-offwhite text-[11px] tracking-[0.2em] uppercase hover:bg-offwhite hover:text-obsidian transition-colors">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-32 md:pt-36 pb-12 md:pb-20">
      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="heading-display text-4xl mb-12">
        Checkout
      </motion.h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Form */}
          <div className="lg:col-span-2 space-y-10">
            {/* Contact */}
            <section>
              <h2 className="text-[11px] tracking-[0.2em] uppercase text-chrome mb-5">Contact</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input type="text" placeholder="Full Name *" required value={form.customerName} onChange={(e) => updateField("customerName", e.target.value)}
                  className="bg-charcoal/50 border border-border/50 px-4 py-3.5 text-[12px] text-offwhite placeholder:text-muted focus:outline-none focus:border-silver/60 transition-colors" />
                <input type="tel" placeholder="Phone *" required value={form.customerPhone} onChange={(e) => updateField("customerPhone", e.target.value)}
                  className="bg-charcoal/50 border border-border/50 px-4 py-3.5 text-[12px] text-offwhite placeholder:text-muted focus:outline-none focus:border-silver/60 transition-colors" />
                <input type="email" placeholder="Email *" required value={form.customerEmail} onChange={(e) => updateField("customerEmail", e.target.value)}
                  className="sm:col-span-2 bg-charcoal/50 border border-border/50 px-4 py-3.5 text-[12px] text-offwhite placeholder:text-muted focus:outline-none focus:border-silver/60 transition-colors" />
              </div>
            </section>

            {/* Shipping */}
            <section>
              <h2 className="text-[11px] tracking-[0.2em] uppercase text-chrome mb-5">Shipping Address</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <textarea placeholder="Full Address *" required rows={3} value={form.address} onChange={(e) => updateField("address", e.target.value)}
                  className="sm:col-span-2 bg-charcoal/50 border border-border/50 px-4 py-3.5 text-[12px] text-offwhite placeholder:text-muted focus:outline-none focus:border-silver/60 transition-colors resize-none" />
                <input type="text" placeholder="City *" required value={form.city} onChange={(e) => updateField("city", e.target.value)}
                  className="bg-charcoal/50 border border-border/50 px-4 py-3.5 text-[12px] text-offwhite placeholder:text-muted focus:outline-none focus:border-silver/60 transition-colors" />
                <select required value={form.province} onChange={(e) => updateField("province", e.target.value)}
                  className="bg-charcoal/50 border border-border/50 px-4 py-3.5 text-[12px] text-offwhite focus:outline-none focus:border-silver/60 transition-colors cursor-pointer">
                  <option value="" disabled>Province *</option>
                  {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
                <input type="text" placeholder="Postal Code" value={form.postalCode} onChange={(e) => updateField("postalCode", e.target.value)}
                  className="bg-charcoal/50 border border-border/50 px-4 py-3.5 text-[12px] text-offwhite placeholder:text-muted focus:outline-none focus:border-silver/60 transition-colors" />
              </div>
            </section>

            {/* Payment */}
            <section>
              <h2 className="text-[11px] tracking-[0.2em] uppercase text-chrome mb-5">Payment</h2>

              <div className="bg-charcoal/50 border border-silver/30 px-5 py-4 mb-5">
                <p className="text-[12px] font-medium text-silver mb-2">Pay Delivery Charges via Bank Transfer</p>
                <div className="text-[12px] text-offwhite space-y-1">
                  <p>Account Name: <span className="text-muted">{MEEZAN_ACCOUNT_NAME}</span></p>
                  <p>Account Number: <span className="text-muted">{MEEZAN_ACCOUNT_NUMBER}</span></p>
                  <p>Bank Name: <span className="text-muted">Meezan Bank Limited</span></p>
                </div>
                <p className="text-[10px] text-muted mt-3">
                  Send the Delivery Charges shown below to this Account number, then upload a screenshot
                  of the successful transaction. Your order will only be confirmed once the payment
                  screenshot is attached.
                </p>
              </div>

              <div>
                <label className="block text-[11px] text-chrome mb-2">Payment Screenshot *</label>
                <input
                  type="file"
                  accept="image/*"
                  required
                  onChange={handleProofChange}
                  className="block w-full text-[12px] text-muted file:mr-4 file:py-2.5 file:px-4 file:border file:border-border/50 file:bg-charcoal/50 file:text-offwhite file:text-[11px] file:uppercase file:tracking-wider file:cursor-pointer hover:file:border-silver/60 transition-colors"
                />
                {proofPreview && (
                  <div className="relative w-24 h-24 mt-3 border border-border/50 overflow-hidden">
                    <Image src={proofPreview} alt="Payment proof preview" fill className="object-cover" sizes="96px" />
                  </div>
                )}
              </div>
            </section>

            {error && <p className="text-[12px] text-red-400">{error}</p>}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-charcoal/50 border border-silver/20 p-6 sticky top-28 shadow-sm">
              <h2 className="text-[11px] tracking-[0.2em] uppercase text-chrome mb-5">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.productId} className="flex gap-3">
                    <div className="relative w-14 h-18 bg-charcoal shrink-0 overflow-hidden">
                      <Image src={item.image} alt={item.name} fill className="object-cover" sizes="56px" />
                      <span className="absolute -top-1 -right-1 bg-offwhite text-obsidian text-[8px] font-semibold rounded-full w-4 h-4 flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0 py-0.5">
                      <p className="text-[11px] font-medium truncate">{item.name}</p>
                      <p className="text-[11px] text-chrome mt-0.5">{formatOriginalPrice(getDiscountedPrice(item.price) * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-border/30 pt-4 space-y-2 text-[12px]">
                <div className="flex justify-between">
                  <span className="text-muted">Subtotal</span>
                  <span className="text-muted line-through">{formatOriginalPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-silver">
                  <span>Discount ({DISCOUNT_PERCENT}%)</span>
                  <span>-{formatOriginalPrice(subtotal - discountedSubtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span>{formatOriginalPrice(SHIPPING_COST)}</span>
                </div>
                <div className="border-t border-border/30 pt-3 flex justify-between text-[14px] font-medium">
                  <span>Total</span>
                  <span>{formatOriginalPrice(total)}</span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-obsidian/50 border border-border/20">
                <p className="text-[10px] tracking-wider uppercase text-silver">
                  <span className="text-offwhite font-medium">{DISCOUNT_PERCENT}% off</span> applied automatically
                </p>
              </div>

              <button type="submit" disabled={loading}
                className="w-full mt-6 py-4 bg-offwhite text-obsidian text-[11px] tracking-[0.2em] uppercase font-medium hover:bg-silver transition-colors disabled:opacity-50">
                {loading ? "Placing Order..." : "Place Order"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
