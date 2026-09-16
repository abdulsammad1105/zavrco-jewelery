"use client";

import { apiFetch } from "@/lib/api";
import { useState } from "react";
import { formatPrice, formatOrderId } from "@/lib/utils";
import type { Order } from "@/types";

const inputClass =
  "w-full bg-charcoal/50 border border-border/50 px-4 py-3.5 text-[12px] text-offwhite placeholder:text-muted focus:outline-none focus:border-silver/60 transition-colors";

export default function TrackOrderPage() {
  const [form, setForm] = useState({ id: "", phone: "" });
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setOrder(null);
    const cleanId = form.id.trim().toUpperCase().replace(/^ZAV0*/, "");
    const res = await apiFetch(`/api/orders/track?id=${encodeURIComponent(cleanId)}&phone=${encodeURIComponent(form.phone)}`);
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Order not found");
      setLoading(false);
      return;
    }
    setOrder(data);
    setLoading(false);
  }

  return (
    <main className="min-h-screen pt-40 pb-24 px-5 sm:px-8 max-w-md mx-auto">
      <h1 className="heading-display text-3xl text-offwhite mb-2">Track Order</h1>
      <p className="text-[12px] text-muted mb-10">
        Enter your Order ID (e.g. ZAV006) and the phone number used at checkout.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Order ID (e.g. ZAV006) *"
          required
          value={form.id}
          onChange={(e) => setForm({ ...form, id: e.target.value })}
          className={inputClass}
        />
        <input
          type="tel"
          placeholder="Phone Number *"
          required
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className={inputClass}
        />
        {error && <p className="text-[12px] text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 py-4 bg-offwhite text-obsidian text-[11px] tracking-[0.2em] uppercase font-medium hover:bg-silver transition-colors disabled:opacity-50"
        >
          {loading ? "Searching..." : "Track Order"}
        </button>
      </form>

      {order && (
        <div className="mt-10 border border-border/50 p-5">
          <div className="flex justify-between items-start mb-3">
            <p className="text-[13px] text-offwhite">Order {formatOrderId(order.id)}</p>
            <span className="text-[10px] tracking-[0.15em] uppercase text-chrome border border-border/50 px-2 py-1">
              {order.status}
            </span>
          </div>
          <p className="text-[12px] text-muted mb-1">
            {order.items.length} item{order.items.length !== 1 ? "s" : ""}
          </p>
          <p className="text-[14px] text-offwhite">{formatPrice(order.total)}</p>
        </div>
      )}
    </main>
  );
}